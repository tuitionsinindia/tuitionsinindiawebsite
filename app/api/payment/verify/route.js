import { NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function POST(request) {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            tutorId,
            creditsToAdd,
        } = await request.json();

        // Verify signature
        const key_secret = process.env.RAZORPAY_KEY_SECRET || "rzp_test_mock_secret";
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", key_secret)
            .update(body.toString())
            .digest("hex");

        const isAuthentic = expectedSignature === razorpay_signature;

        if (isAuthentic) {
            // Update tutor credits in the database
            const updatedUser = await prisma.user.update({
                where: { id: tutorId },
                data: {
                    credits: { increment: parseInt(creditsToAdd) },
                },
            });

            // Optionally record the transaction
            // await prisma.transaction.create({ ... });

            return NextResponse.json({ success: true, credits: updatedUser.credits });
        } else {
            return NextResponse.json({ success: false, error: "Invalid signature" }, { status: 400 });
        }
    } catch (error) {
        console.error("Error verifying payment:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
