import { NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/lib/prisma";
import { sendPaymentReceiptEmail } from "@/lib/email";

export const dynamic = 'force-dynamic';

// Credits included per subscription tier — source of truth is server-side only
const TIER_CREDITS = { PRO: 30, ELITE: 100 };

export async function POST(request) {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            userId,
            subscriptionTier,        // Optional: if it's a subscription purchase
            razorpay_subscription_id // Optional
        } = await request.json();

        // Verify Razorpay signature — key_secret must be set; no hardcoded fallback
        const key_secret = process.env.RAZORPAY_KEY_SECRET;
        if (!key_secret) {
            console.error("[payment/verify] RAZORPAY_KEY_SECRET not set");
            return NextResponse.json({ error: "Payment configuration error" }, { status: 500 });
        }

        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", key_secret)
            .update(body.toString())
            .digest("hex");

        const isAuthentic = expectedSignature === razorpay_signature;

        if (!isAuthentic) {
            if (razorpay_order_id) {
                await prisma.transaction.update({
                    where: { razorpayOrderId: razorpay_order_id },
                    data: { status: "FAILED" }
                }).catch(() => { });
            }
            return NextResponse.json({ success: false, error: "Invalid signature" }, { status: 400 });
        }

        // ── Determine authorized credits server-side ──────────────────────────
        // NEVER trust creditsToAdd from the client — always derive from the server-created order.
        let authorizedCredits = 0;

        if (subscriptionTier) {
            // For subscriptions, credits are fixed by tier
            authorizedCredits = TIER_CREDITS[subscriptionTier] || 0;
        } else {
            // For credit packs, look up the Transaction description created during order creation
            const existingTx = await prisma.transaction.findUnique({
                where: { razorpayOrderId: razorpay_order_id },
                select: { description: true, userId: true },
            });

            if (!existingTx) {
                console.error("[payment/verify] Transaction not found for order", razorpay_order_id);
                return NextResponse.json({ error: "Order not found" }, { status: 404 });
            }

            // Verify the userId matches the order's owner
            if (existingTx.userId && existingTx.userId !== userId) {
                console.warn("[payment/verify] userId mismatch — possible tampering", { userId, txUserId: existingTx.userId });
                return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
            }

            // Parse credits from description, e.g. "Purchased 30 Credits"
            const match = existingTx.description?.match(/(\d+)\s+Credits/i);
            authorizedCredits = match ? parseInt(match[1]) : 0;
        }

        // ── Apply credits and update transaction ─────────────────────────────
        let updateData = {};

        if (subscriptionTier) {
            updateData = {
                subscriptionTier,
                subscriptionStatus: "ACTIVE",
                subscriptionId: razorpay_subscription_id,
                credits: { increment: authorizedCredits },
            };
        } else {
            updateData = {
                credits: { increment: authorizedCredits },
            };
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: updateData,
        });

        // Mark transaction SUCCESS and fetch actual amount for receipt
        let actualAmount = null;
        try {
            const updatedTx = await prisma.transaction.update({
                where: { razorpayOrderId: razorpay_order_id },
                data: {
                    status: "SUCCESS",
                    razorpayPaymentId: razorpay_payment_id,
                },
                select: { amount: true, description: true },
            });
            actualAmount = updatedTx?.amount;
        } catch (transError) {
            console.error("[payment/verify] Failed to update transaction:", transError);
        }

        // Send receipt email
        if (updatedUser?.email) {
            sendPaymentReceiptEmail(updatedUser.email, {
                transactionId: razorpay_payment_id,
                amount: actualAmount,
                description: subscriptionTier
                    ? `${subscriptionTier} subscription — ${authorizedCredits} credits`
                    : `Purchased ${authorizedCredits} credits`,
            }).catch(err => console.error("[payment/verify] Receipt email failed:", err));
        }

        return NextResponse.json({ success: true, credits: updatedUser.credits });

    } catch (error) {
        console.error("[payment/verify] Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
