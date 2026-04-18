import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(request) {
    try {
        const session = getSession();
        if (!session) return NextResponse.json({ error: "Please log in to transfer your demo credit" }, { status: 401 });
        if (session.role !== "STUDENT") return NextResponse.json({ error: "Only students can transfer demo credits" }, { status: 403 });

        const { newTutorId, subject, preferredTime, message } = await request.json();

        if (!newTutorId || !subject || !preferredTime) {
            return NextResponse.json({ error: "Tutor, subject, and preferred time are required" }, { status: 400 });
        }

        // Check student has enough platform credit
        const student = await prisma.user.findUnique({
            where: { id: session.id },
            select: { platformCredit: true },
        });

        if (!student) return NextResponse.json({ error: "Student account not found" }, { status: 404 });
        if (student.platformCredit < 14900) {
            return NextResponse.json({ error: "You do not have enough demo credit to transfer. Complete a free demo first." }, { status: 400 });
        }

        // Check new tutor offers demo classes
        const listing = await prisma.listing.findUnique({ where: { tutorId: newTutorId } });
        if (!listing || !listing.offersTrialClass) {
            return NextResponse.json({ error: "This tutor does not offer demo classes" }, { status: 400 });
        }

        // Check no existing active trial with new tutor
        const existing = await prisma.trialBooking.findFirst({
            where: {
                studentId: session.id,
                tutorId: newTutorId,
                status: { in: ["PENDING", "CONFIRMED"] },
            },
        });
        if (existing) {
            return NextResponse.json({ error: "You already have an active demo booking with this tutor" }, { status: 409 });
        }

        // Create booking and deduct credit atomically
        const [trial] = await prisma.$transaction([
            prisma.trialBooking.create({
                data: {
                    studentId: session.id,
                    tutorId: newTutorId,
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

        // Fetch student name for notification
        const studentData = await prisma.user.findUnique({
            where: { id: session.id },
            select: { name: true },
        });

        // Notify new tutor
        await prisma.notification.create({
            data: {
                userId: newTutorId,
                type: "TRIAL_REQUEST",
                title: "New demo booking (deposit paid)",
                body: `A student has paid the ₹149 demo deposit and wants to book a demo for ${subject}. Choose free or paid demo when accepting.`,
                link: "/dashboard/tutor?tab=TRIALS",
            },
        }).catch(() => {});

        // Email new tutor
        const newTutor = await prisma.user.findUnique({
            where: { id: newTutorId },
            select: { email: true, name: true },
        });

        if (newTutor?.email) {
            const { Resend } = await import("resend");
            const resend = new Resend(process.env.RESEND_API_KEY || "re_dummy_key");
            resend.emails.send({
                from: "Tuitions in India <alerts@tuitionsinindia.com>",
                to: newTutor.email,
                subject: `New demo booking from ${studentData?.name || "a student"} for ${subject}`,
                html: `
<!DOCTYPE html><html><body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:40px 20px">
<tr><td align="center">
<table width="100%" style="max-width:520px;background:#ffffff;border-radius:16px;border:1px solid #e5e7eb;overflow:hidden">
<tr><td style="background:#2563EB;padding:24px 32px;text-align:center">
<span style="color:#ffffff;font-size:18px;font-weight:800">TuitionsInIndia</span>
</td></tr>
<tr><td style="padding:32px">
<h2 style="margin:0 0 12px;color:#111827;font-size:20px">New demo booking request</h2>
<p style="margin:0 0 20px;color:#6b7280;font-size:14px;line-height:1.6">
Hi ${newTutor.name || "there"},<br><br>
<strong>${studentData?.name || "A student"}</strong> has booked a demo for <strong>${subject}</strong> and paid a ₹149 deposit. Log in to accept and choose whether this will be a free or paid demo.
</p>
<a href="https://tuitionsinindia.com/dashboard/tutor?tab=TRIALS" style="display:inline-block;padding:12px 28px;background:#2563EB;color:#ffffff;text-decoration:none;border-radius:10px;font-weight:600;font-size:14px">View Booking</a>
</td></tr>
<tr><td style="padding:16px 32px;border-top:1px solid #f1f5f9;text-align:center">
<p style="margin:0;color:#9ca3af;font-size:12px">TuitionsInIndia — India's Trusted Tutor Discovery Platform</p>
</td></tr>
</table></td></tr></table></body></html>`,
            }).catch(() => {});
        }

        return NextResponse.json({ success: true, trial });
    } catch (error) {
        console.error("Trial transfer error:", error);
        return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
    }
}
