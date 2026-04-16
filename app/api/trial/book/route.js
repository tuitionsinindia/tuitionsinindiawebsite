import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/session";
import { sendTrialNotificationEmail } from "@/lib/email";

export async function POST(request) {
    try {
        const token = request.cookies.get("ti_session")?.value;
        if (!token) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

        const session = verifyToken(token);
        if (!session || session.role !== "STUDENT") {
            return NextResponse.json({ error: "Only students can book trial classes" }, { status: 403 });
        }

        const { tutorId, subject, preferredTime, message } = await request.json();

        if (!tutorId || !subject || !preferredTime) {
            return NextResponse.json({ error: "Tutor, subject, and preferred time are required" }, { status: 400 });
        }

        // Check tutor offers trial
        const listing = await prisma.listing.findUnique({ where: { tutorId } });
        if (!listing || !listing.offersTrialClass) {
            return NextResponse.json({ error: "This tutor does not offer trial classes" }, { status: 400 });
        }

        // Check if student already has a pending/confirmed trial with this tutor
        const existing = await prisma.trialBooking.findFirst({
            where: {
                studentId: session.id,
                tutorId,
                status: { in: ["PENDING", "CONFIRMED"] },
            },
        });
        if (existing) {
            return NextResponse.json({ error: "You already have an active trial booking with this tutor" }, { status: 409 });
        }

        const trial = await prisma.trialBooking.create({
            data: {
                studentId: session.id,
                tutorId,
                subject,
                preferredTime,
                message: message || null,
                duration: listing.trialDuration,
            },
        });

        // Notify tutor — in-app + email
        const [tutor, student] = await Promise.all([
            prisma.user.findUnique({ where: { id: tutorId }, select: { name: true, email: true } }),
            prisma.user.findUnique({ where: { id: session.id }, select: { name: true } }),
        ]);

        await prisma.notification.create({
            data: {
                userId: tutorId,
                type: "TRIAL_REQUEST",
                title: "New trial class request",
                body: `A student wants to book a ${listing.trialDuration}-min free trial for ${subject}.`,
                link: `/dashboard/tutor?tutorId=${tutorId}&tab=TRIALS`,
            },
        }).catch(() => {});

        if (tutor?.email) {
            sendTrialNotificationEmail(tutor.email, tutor.name || "Tutor", {
                status: "REQUESTED",
                subject,
                otherPartyName: student?.name || "A student",
                dashboardLink: `https://tuitionsinindia.com/dashboard/tutor?tutorId=${tutorId}&tab=TRIALS`,
            }).catch(() => {});
        }

        return NextResponse.json({ success: true, trial });
    } catch (error) {
        console.error("Trial book error:", error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}
