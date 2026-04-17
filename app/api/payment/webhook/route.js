import { NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * Razorpay Webhook Handler
 *
 * Handles async payment events from Razorpay for cases where the browser
 * closes before the frontend confirmation completes (e.g. payment.captured).
 *
 * Setup in Razorpay Dashboard:
 *   Webhook URL: https://tuitionsinindia.com/api/payment/webhook
 *   Events: payment.captured, subscription.charged, payment.failed
 *   Secret: add RAZORPAY_WEBHOOK_SECRET to .env.production
 */
export async function POST(request) {
    try {
        const body = await request.text();
        const signature = request.headers.get("x-razorpay-signature");
        const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

        // Verify webhook signature
        if (webhookSecret && signature) {
            const expectedSig = crypto
                .createHmac("sha256", webhookSecret)
                .update(body)
                .digest("hex");

            if (expectedSig !== signature) {
                console.error("[webhook] Invalid Razorpay signature");
                return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
            }
        } else if (process.env.NODE_ENV === "production") {
            // In production, always require webhook secret
            console.error("[webhook] Missing RAZORPAY_WEBHOOK_SECRET or signature");
            return NextResponse.json({ error: "Webhook secret not configured" }, { status: 400 });
        }

        const event = JSON.parse(body);
        const eventType = event.event;

        console.log(`[webhook] Received: ${eventType}`);

        // ── payment.captured ─────────────────────────────────────────────────
        // Fires when a payment is captured (may be delayed if browser closed early)
        if (eventType === "payment.captured") {
            const payment = event.payload?.payment?.entity;
            if (!payment) return NextResponse.json({ received: true });

            const orderId = payment.order_id;
            const paymentId = payment.id;
            const amountPaise = payment.amount; // in paise

            // Find the pending transaction by Razorpay order ID
            const transaction = await prisma.transaction.findUnique({
                where: { razorpayOrderId: orderId },
            });

            if (!transaction) {
                // Transaction not found — may have already been handled by verify endpoint
                return NextResponse.json({ received: true });
            }

            if (transaction.status === "SUCCESS") {
                // Already processed by the verify endpoint — skip
                return NextResponse.json({ received: true });
            }

            // Mark transaction as success and credit the user
            await prisma.$transaction(async (tx) => {
                await tx.transaction.update({
                    where: { razorpayOrderId: orderId },
                    data: {
                        status: "SUCCESS",
                        razorpayPaymentId: paymentId,
                        amount: amountPaise / 100, // convert paise → rupees
                    },
                });

                // Add credits if specified in transaction description
                // Description format: "Purchased N Credits" or subscription tier
                if (transaction.description?.includes("Credits")) {
                    const match = transaction.description.match(/(\d+)\s+Credits/);
                    const credits = match ? parseInt(match[1]) : 0;
                    if (credits > 0) {
                        await tx.user.update({
                            where: { id: transaction.userId },
                            data: { credits: { increment: credits } },
                        });
                        console.log(`[webhook] Added ${credits} credits to user ${transaction.userId}`);
                    }
                }
            });

            return NextResponse.json({ received: true });
        }

        // ── subscription.charged ─────────────────────────────────────────────
        // Fires when a subscription renewal payment succeeds
        if (eventType === "subscription.charged") {
            const subscription = event.payload?.subscription?.entity;
            const payment = event.payload?.payment?.entity;
            if (!subscription || !payment) return NextResponse.json({ received: true });

            const subscriptionId = subscription.id;

            // Find the user with this subscription
            const user = await prisma.user.findFirst({
                where: { subscriptionId },
                select: { id: true, email: true, subscriptionTier: true },
            });

            if (!user) {
                console.warn(`[webhook] No user found for subscription ${subscriptionId}`);
                return NextResponse.json({ received: true });
            }

            // Determine monthly credits based on tier
            const monthlyCredits = user.subscriptionTier === "ELITE" ? 100 : user.subscriptionTier === "PRO" ? 30 : 0;

            await prisma.$transaction(async (tx) => {
                // Record the renewal transaction
                await tx.transaction.create({
                    data: {
                        userId: user.id,
                        amount: payment.amount / 100,
                        currency: payment.currency || "INR",
                        razorpayOrderId: payment.order_id || `sub_${subscriptionId}_${Date.now()}`,
                        razorpayPaymentId: payment.id,
                        status: "SUCCESS",
                        description: `${user.subscriptionTier} subscription renewal — ${monthlyCredits} credits`,
                    },
                });

                // Reset/top-up credits for renewal
                if (monthlyCredits > 0) {
                    await tx.user.update({
                        where: { id: user.id },
                        data: {
                            credits: { increment: monthlyCredits },
                            subscriptionStatus: "ACTIVE",
                        },
                    });
                    console.log(`[webhook] Subscription renewed for user ${user.id}: +${monthlyCredits} credits`);
                }
            });

            return NextResponse.json({ received: true });
        }

        // ── payment.failed ───────────────────────────────────────────────────
        if (eventType === "payment.failed") {
            const payment = event.payload?.payment?.entity;
            if (payment?.order_id) {
                await prisma.transaction.updateMany({
                    where: { razorpayOrderId: payment.order_id, status: "PENDING" },
                    data: { status: "FAILED" },
                }).catch(() => {});
                console.log(`[webhook] Marked transaction FAILED for order ${payment.order_id}`);
            }
            return NextResponse.json({ received: true });
        }

        // All other events — acknowledge receipt
        return NextResponse.json({ received: true });

    } catch (error) {
        console.error("[webhook] Error:", error);
        return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
    }
}
