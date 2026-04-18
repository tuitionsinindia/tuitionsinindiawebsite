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

        // Count how many early adopter slots have been used
        // (tutors who have applied — PENDING_REVIEW means they got through, with or without payment)
        const EARLY_ADOPTER_LIMIT = 100;
        const slotsUsed = await prisma.verificationRequest.count({
            where: {
                status: { in: ["PENDING_REVIEW", "APPROVED"] },
            },
        });

        const isEarlyAdopter = slotsUsed < EARLY_ADOPTER_LIMIT;

        if (isEarlyAdopter) {
            // Skip payment — go straight to PENDING_REVIEW for free
            await prisma.verificationRequest.upsert({
                where: { tutorId: session.id },
                create: {
                    tutorId: session.id,
                    status: "PENDING_REVIEW",
                    // No razorpayOrderId — marks this as an early adopter slot
                },
                update: {
                    status: "PENDING_REVIEW",
                    razorpayOrderId: null,
                    razorpayPaymentId: null,
                    rejectionReason: null,
                },
            });

            // Notify admins
            const admins = await prisma.user.findMany({
                where: { role: "ADMIN" },
                select: { id: true },
            });
            if (admins.length > 0) {
                await prisma.notification.createMany({
                    data: admins.map((admin) => ({
                        userId: admin.id,
                        type: "VERIFICATION_REQUEST",
                        title: "New early adopter verification request",
                        body: `A tutor has applied for free verification (early adopter slot ${slotsUsed + 1} of ${EARLY_ADOPTER_LIMIT}).`,
                        link: "/dashboard/admin?tab=verifications",
                    })),
                });
            }

            // Notify the tutor
            await prisma.notification.create({
                data: {
                    userId: session.id,
                    type: "VERIFICATION_REQUEST",
                    title: "Verification request submitted — free for early adopters!",
                    body: "Your verification request has been submitted for review. As an early adopter, this is free. We will review your documents within 2-3 working days.",
                    link: "/dashboard/tutor",
                },
            }).catch(() => {});

            return NextResponse.json({ success: true, earlyAdopter: true, slotsRemaining: EARLY_ADOPTER_LIMIT - slotsUsed - 1 });
        }

        // Paid path — create Razorpay order for ₹999
        const razorpay = getRazorpay();
        const order = await razorpay.orders.create({
            amount: 99900,
            currency: "INR",
            notes: {
                type: "verification",
                tutorId: session.id,
            },
        });

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
