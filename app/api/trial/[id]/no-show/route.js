import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(request, { params }) {
    try {
        const session = getSession();
        if (!session) return NextResponse.json({ error: "Please log in to report a no-show" }, { status: 401 });
        if (session.role !== "TUTOR") return NextResponse.json({ error: "Only tutors can report a no-show" }, { status: 403 });

        const { id } = await params;

        const trial = await prisma.trialBooking.findUnique({ where: { id } });
        if (!trial) return NextResponse.json({ error: "Booking not found" }, { status: 404 });
        if (trial.tutorId !== session.id) return NextResponse.json({ error: "Not authorized" }, { status: 403 });
        if (trial.status !== "CONFIRMED") return NextResponse.json({ error: "Only confirmed bookings can be marked as no-show" }, { status: 400 });
        if (trial.depositStatus !== "PAID") return NextResponse.json({ error: "No deposit to release for this booking" }, { status: 400 });

        // Mark complete, release deposit
        await prisma.$transaction([
            prisma.trialBooking.update({
                where: { id },
                data: {
                    status: "COMPLETED",
                    depositStatus: "RELEASED",
                    cancelReason: "Student did not attend",
                },
            }),
        ]);

        // Log ₹100 tutor earning (non-blocking)
        const student = await prisma.user.findUnique({
            where: { id: trial.studentId },
            select: { name: true },
        });

        await prisma.transaction.create({
            data: {
                userId: trial.tutorId,
                amount: 10000, // ₹100 in paise
                currency: "INR",
                status: "SUCCESS",
                description: `No-show fee — ${student?.name || "student"}`,
                razorpayPaymentId: trial.depositPaymentId,
            },
        }).catch(() => {});

        // Notify student
        await prisma.notification.create({
            data: {
                userId: trial.studentId,
                type: "TRIAL_UPDATE",
                title: "You missed your demo class",
                body: `You were marked as not attending your demo for ${trial.subject}. Your ₹149 deposit has been forfeited. If you believe this is an error, contact support.`,
                link: "/dashboard/student?tab=TRIALS",
            },
        }).catch(() => {});

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Trial no-show error:", error);
        return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
    }
}
