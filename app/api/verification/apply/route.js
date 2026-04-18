export const dynamic = "force-dynamic";

import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getRazorpay } from "@/lib/razorpay";
import { NextResponse } from "next/server";

export async function POST() {
    try {
        const session = getSession();
        if (!session) {
            return NextResponse.json({ error: "Please log in to continue." }, { status: 401 });
        }
        if (session.role !== "TUTOR") {
            return NextResponse.json({ error: "Only tutors can apply for verification." }, { status: 403 });
        }

        // Check if already verified
        const user = await prisma.user.findUnique({
            where: { id: session.id },
            select: { isVerified: true },
        });
        if (user?.isVerified) {
            return NextResponse.json({ error: "Already verified." }, { status: 400 });
        }

        // Check for existing pending request
        const existing = await prisma.verificationRequest.findUnique({
            where: { tutorId: session.id },
        });
        if (existing && (existing.status === "PENDING_REVIEW" || existing.status === "PENDING_PAYMENT")) {
            return NextResponse.json({ error: "You already have a pending verification request." }, { status: 409 });
        }

        // Create Razorpay order
        const razorpay = getRazorpay();
        const order = await razorpay.orders.create({
            amount: 99900,
            currency: "INR",
            notes: {
                type: "verification",
                tutorId: session.id,
            },
        });

        // Upsert VerificationRequest (handles first-time and re-apply after rejection)
        await prisma.verificationRequest.upsert({
            where: { tutorId: session.id },
            create: {
                tutorId: session.id,
                razorpayOrderId: order.id,
                status: "PENDING_PAYMENT",
            },
            update: {
                status: "PENDING_PAYMENT",
                razorpayOrderId: order.id,
                razorpayPaymentId: null,
                rejectionReason: null,
            },
        });

        return NextResponse.json({
            orderId: order.id,
            amount: 99900,
            currency: "INR",
            keyId: process.env.RAZORPAY_KEY_ID,
        });
    } catch (err) {
        console.error("[Verification Apply]", err);
        return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
    }
}
