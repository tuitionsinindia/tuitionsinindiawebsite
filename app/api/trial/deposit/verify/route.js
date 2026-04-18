import { NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { Resend } from "resend";

export const dynamic = "force-dynamic";

const resend = new Resend(process.env.RESEND_API_KEY || "re_dummy_key");
const FROM_ALERTS = "Tuitions in India <alerts@tuitionsinindia.com>";

export async function POST(request) {
    try {
        const session = getSession();
        if (!session) return NextResponse.json({ error: "Please log in to verify payment" }, { status: 401 });
        if (session.role !== "STUDENT") return NextResponse.json({ error: "Only students can verify demo deposits" }, { status: 403 });

        const { trialId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = await request.json();

        if (!trialId || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
            return NextResponse.json({ error: "Missing payment details" }, { status: 400 });
        }

        // Verify signature
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
            .update(`${razorpayOrderId}|${razorpayPaymentId}`)
            .digest("hex");

        if (expectedSignature !== razorpaySignature) {
            return NextResponse.json({ error: "Payment verification failed. Please contact support." }, { status: 400 });
        }

        // Find trial booking
        const trial = await prisma.trialBooking.findUnique({
            where: { id: trialId },
        });

        if (!trial) return NextResponse.json({ error: "Booking not found" }, { status: 404 });
        if (trial.studentId !== session.id) return NextResponse.json({ error: "Not authorized" }, { status: 403 });
        if (trial.depositStatus !== "UNPAID") return NextResponse.json({ error: "This booking deposit has already been processed" }, { status: 409 });

        // Update trial and increment student's contact view count
        await prisma.$transaction([
            prisma.trialBooking.update({
                where: { id: trialId },
                data: {
                    depositStatus: "PAID",
                    depositPaymentId: razorpayPaymentId,
                },
            }),
            prisma.user.update({
                where: { id: session.id },
                data: { contactViewsThisMonth: { increment: 1 } },
            }),
        ]);

        // Fetch tutor and student details for notifications
        const [tutor, student] = await Promise.all([
            prisma.user.findUnique({ where: { id: trial.tutorId }, select: { email: true, name: true } }),
            prisma.user.findUnique({ where: { id: session.id }, select: { name: true } }),
        ]);

        // Notify tutor in-app
        await prisma.notification.create({
            data: {
                userId: trial.tutorId,
                type: "TRIAL_REQUEST",
                title: "New demo booking (deposit paid)",
                body: `A student has paid the ₹149 demo deposit and wants to book a demo for ${trial.subject}. Choose free or paid demo when accepting.`,
                link: "/dashboard/tutor?tab=TRIALS",
            },
        }).catch(() => {});

        // Email tutor
        if (tutor?.email) {
            const html = `
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
Hi ${tutor.name || "there"},<br><br>
<strong>${student?.name || "A student"}</strong> has booked a demo for <strong>${trial.subject}</strong> and paid a ₹149 deposit. Log in to accept and choose whether this will be a free or paid demo.
</p>
<a href="https://tuitionsinindia.com/dashboard/tutor?tab=TRIALS" style="display:inline-block;padding:12px 28px;background:#2563EB;color:#ffffff;text-decoration:none;border-radius:10px;font-weight:600;font-size:14px">View Booking</a>
</td></tr>
<tr><td style="padding:16px 32px;border-top:1px solid #f1f5f9;text-align:center">
<p style="margin:0;color:#9ca3af;font-size:12px">TuitionsInIndia — India's Trusted Tutor Discovery Platform</p>
</td></tr>
</table></td></tr></table></body></html>`;

            resend.emails.send({
                from: FROM_ALERTS,
                to: tutor.email,
                subject: `New demo booking from ${student?.name || "a student"} for ${trial.subject}`,
                html,
            }).catch(() => {});
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Trial deposit verify error:", error);
        return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
    }
}
