import { NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/lib/prisma";
import { sendPaymentReceiptEmail } from "@/lib/email";

export const dynamic = 'force-dynamic';

export async function POST(request) {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            userId,
            creditsToAdd,
            subscriptionTier, // Optional: if it's a subscription purchase
            razorpay_subscription_id // Optional
        } = await request.json();

        // Verify signature
        const key_secret = process.env.RAZORPAY_KEY_SECRET || "rzp_test_mock_secret";

        // Note: For subscriptions, signature verification might differ depending on Razorpay flow.
        // Assuming order-based flow for now for simplicity, or simple trust if signature matches.
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", key_secret)
            .update(body.toString())
            .digest("hex");

        const isAuthentic = expectedSignature === razorpay_signature;

        if (isAuthentic) {
            let updateData = {};

            if (subscriptionTier) {
                updateData = {
                    subscriptionTier: subscriptionTier,
                    subscriptionStatus: "ACTIVE",
                    subscriptionId: razorpay_subscription_id,
                    credits: { increment: parseInt(creditsToAdd || 0) }
                };
            } else {
                updateData = {
                    credits: { increment: parseInt(creditsToAdd || 0) }
                };
            }

            // Update user in the database
            const updatedUser = await prisma.user.update({
                where: { id: userId },
                data: updateData,
            });

            // Update the existing PENDING transaction to SUCCESS
            try {
                await prisma.transaction.update({
                    where: { razorpayOrderId: razorpay_order_id },
                    data: {
                        status: "SUCCESS",
                        razorpayPaymentId: razorpay_payment_id,
                    }
                });
            } catch (transError) {
                console.error("Failed to update transaction record:", transError);
                // We still proceed since credits were updated
            }

            // Dispatch Receipt Email
            if (updatedUser?.email) {
                await sendPaymentReceiptEmail(updatedUser.email, {
                    transactionId: razorpay_payment_id,
                    amount: parseInt(creditsToAdd) * 50, // Approximation or fetch actual if stored
                    description: `Purchased ${creditsToAdd} Credits`
                });
            }

            return NextResponse.json({ success: true, credits: updatedUser.credits });
        } else {
            // Log as FAILED if payment ID exists
            if (razorpay_order_id) {
                await prisma.transaction.update({
                    where: { razorpayOrderId: razorpay_order_id },
                    data: { status: "FAILED" }
                }).catch(() => { });
            }
            return NextResponse.json({ success: false, error: "Invalid signature" }, { status: 400 });
        }
    } catch (error) {
        console.error("Error verifying payment:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
