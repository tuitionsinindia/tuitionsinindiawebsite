export const dynamic = "force-dynamic";

import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request) {
    try {
        const session = getSession();
        if (!session) {
            return NextResponse.json({ error: "Please log in to continue." }, { status: 401 });
        }
        if (session.role !== "TUTOR") {
            return NextResponse.json({ error: "Only tutors can verify payments." }, { status: 403 });
        }

        const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = await request.json();

        if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
            return NextResponse.json({ error: "Missing payment details." }, { status: 400 });
        }

        // Verify HMAC signature
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
            .update(razorpayOrderId + "|" + razorpayPaymentId)
            .digest("hex");

        if (expectedSignature !== razorpaySignature) {
            return NextResponse.json({ error: "Payment verification failed. Please contact support." }, { status: 400 });
        }

        // Update VerificationRequest and create Transaction + Notifications in a transaction
        await prisma.$transaction(async (tx) => {
            // Update the verification request
            await tx.verificationRequest.update({
                where: { tutorId: session.id },
                data: {
                    status: "PENDING_REVIEW",
                    razorpayPaymentId,
                },
            });

            // Record transaction
            await tx.transaction.create({
                data: {
                    userId: session.id,
                    amount: 99900,
                    currency: "INR",
                    status: "SUCCESS",
                    description: "Verification badge payment",
                    razorpayPaymentId,
                },
            });

            // Notify all admin users
            const admins = await tx.user.findMany({
                where: { role: "ADMIN" },
                select: { id: true },
            });

            if (admins.length > 0) {
                await tx.notification.createMany({
                    data: admins.map((admin) => ({
                        userId: admin.id,
                        type: "VERIFICATION_REQUEST",
                        title: "New verification request",
                        body: "A tutor has paid for verification and is awaiting review.",
                        link: "/dashboard/admin?tab=verifications",
                    })),
                });
            }
        });

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("[Verification Payment Verify]", err);
        return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
    }
}
