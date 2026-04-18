import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { getRazorpay } from "@/lib/razorpay";

export const dynamic = "force-dynamic";

export async function POST(request) {
    try {
        const session = getSession();
        if (!session) return NextResponse.json({ error: "Please log in to book a demo class" }, { status: 401 });
        if (session.role !== "STUDENT") return NextResponse.json({ error: "Only students can book demo classes" }, { status: 403 });

        const { tutorId, subject, preferredTime, message } = await request.json();

        if (!tutorId || !subject || !preferredTime) {
            return NextResponse.json({ error: "Tutor, subject, and preferred time are required" }, { status: 400 });
        }

        // Check tutor offers trial
        const listing = await prisma.listing.findUnique({ where: { tutorId } });
        if (!listing || !listing.offersTrialClass) {
            return NextResponse.json({ error: "This tutor does not offer demo classes" }, { status: 400 });
        }

        // Check no existing active trial with this tutor
        const existing = await prisma.trialBooking.findFirst({
            where: {
                studentId: session.id,
                tutorId,
                status: { in: ["PENDING", "CONFIRMED"] },
            },
        });
        if (existing) {
            return NextResponse.json({ error: "You already have an active demo booking with this tutor" }, { status: 409 });
        }

        // Check monthly demo limits
        const student = await prisma.user.findUnique({
            where: { id: session.id },
            select: { contactViewsThisMonth: true, platformCredit: true },
        });

        if (!student) return NextResponse.json({ error: "Student account not found" }, { status: 404 });

        // Check if student can book — either has credit or is within free limit
        if (student.contactViewsThisMonth >= 2 && student.platformCredit < 14900) {
            return NextResponse.json({
                error: "You've used your 2 free demo bookings this month. Buy credits or wait until next month.",
                limitReached: true,
            }, { status: 429 });
        }

        // If student has enough platform credit, use it directly — no Razorpay needed
        if (student.platformCredit >= 14900) {
            const [trial] = await prisma.$transaction([
                prisma.trialBooking.create({
                    data: {
                        studentId: session.id,
                        tutorId,
                        subject,
                        preferredTime,
                        message: message || null,
                        duration: listing.trialDuration,
                        depositStatus: "PAID",
                        creditUsedFrom: "PLATFORM_CREDIT",
                    },
                }),
                prisma.user.update({
                    where: { id: session.id },
                    data: { platformCredit: { decrement: 14900 } },
                }),
            ]);

            // Notify tutor
            await prisma.notification.create({
                data: {
                    userId: tutorId,
                    type: "TRIAL_REQUEST",
                    title: "New demo booking (deposit paid)",
                    body: `A student has used platform credit to book a demo for ${subject}. Choose free or paid demo when accepting.`,
                    link: "/dashboard/tutor?tab=TRIALS",
                },
            }).catch(() => {});

            return NextResponse.json({ success: true, trial, paidWithCredit: true });
        }

        // Create booking with deposit UNPAID — proceed to Razorpay
        const trial = await prisma.trialBooking.create({
            data: {
                studentId: session.id,
                tutorId,
                subject,
                preferredTime,
                message: message || null,
                duration: listing.trialDuration,
                depositStatus: "UNPAID",
            },
        });

        // Create Razorpay order
        const order = await getRazorpay().orders.create({
            amount: 14900,
            currency: "INR",
            receipt: trial.id,
            notes: {
                type: "demo_deposit",
                trialId: trial.id,
                studentId: session.id,
            },
        });

        // Save order ID on the trial
        await prisma.trialBooking.update({
            where: { id: trial.id },
            data: { depositOrderId: order.id },
        });

        return NextResponse.json({
            trialId: trial.id,
            orderId: order.id,
            amount: 14900,
            currency: "INR",
            keyId: process.env.RAZORPAY_KEY_ID,
        });
    } catch (error) {
        console.error("Trial book error:", error);
        return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
    }
}
