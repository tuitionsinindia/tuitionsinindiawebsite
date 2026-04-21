import { NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

const TIER_CREDITS = { PRO: 30, ELITE: 100 };

/**
 * POST /api/subscription/activate
 * Called by the mobile app after a successful Razorpay payment for a subscription plan.
 * Verifies the payment signature server-side, then upgrades the user's subscriptionTier.
 */
export async function POST(request) {
    try {
        const session = getSession();
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            userId,
            planId, // "PRO" | "ELITE"
        } = await request.json();

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !userId || !planId) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        if (session.id !== userId) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const tier = planId.toUpperCase();
        if (!["PRO", "ELITE"].includes(tier)) {
            return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
        }

        // Verify Razorpay signature
        const key_secret = process.env.RAZORPAY_KEY_SECRET;
        if (!key_secret) {
            return NextResponse.json({ error: "Payment configuration error" }, { status: 500 });
        }

        const body = `${razorpay_order_id}|${razorpay_payment_id}`;
        const expectedSignature = crypto
            .createHmac("sha256", key_secret)
            .update(body)
            .digest("hex");

        if (expectedSignature !== razorpay_signature) {
            return NextResponse.json({ success: false, error: "Invalid payment signature" }, { status: 400 });
        }

        // Activate subscription + grant credits
        const creditsToAdd = TIER_CREDITS[tier] || 0;
        const renewalDate = new Date();
        renewalDate.setMonth(renewalDate.getMonth() + 1);

        await prisma.user.update({
            where: { id: userId },
            data: {
                subscriptionTier: tier,
                subscriptionStatus: "ACTIVE",
                credits: { increment: creditsToAdd },
            },
        });

        // Log the transaction
        await prisma.transaction.create({
            data: {
                userId,
                type: "SUBSCRIPTION",
                amount: 0, // server doesn't know the amount here — Razorpay webhook handles accounting
                status: "COMPLETED",
                description: `${tier} plan activated via mobile app`,
                razorpayOrderId: razorpay_order_id,
                razorpayPaymentId: razorpay_payment_id,
            },
        }).catch(() => {}); // non-blocking — don't fail if Transaction model differs

        return NextResponse.json({
            success: true,
            tier,
            creditsAdded: creditsToAdd,
            message: `${tier} plan activated successfully`,
        });
    } catch (error) {
        console.error("[subscription/activate] error:", error);
        return NextResponse.json({ error: "Failed to activate subscription" }, { status: 500 });
    }
}
