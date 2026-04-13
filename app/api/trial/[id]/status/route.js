import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/session";

export async function PATCH(request, { params }) {
    try {
        const token = request.cookies.get("ti_session")?.value;
        if (!token) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

        const session = verifyToken(token);
        if (!session) return NextResponse.json({ error: "Invalid session" }, { status: 401 });

        const { id } = await params;
        const { status, tutorNote, cancelReason } = await request.json();

        const trial = await prisma.trialBooking.findUnique({ where: { id } });
        if (!trial) return NextResponse.json({ error: "Trial not found" }, { status: 404 });

        // Validate permissions
        const isTutor = session.role === "TUTOR" && trial.tutorId === session.id;
        const isStudent = session.role === "STUDENT" && trial.studentId === session.id;

        if (!isTutor && !isStudent) {
            return NextResponse.json({ error: "Not authorized" }, { status: 403 });
        }

        // Allowed transitions
        const allowedTransitions = {
            TUTOR: {
                PENDING: ["CONFIRMED", "DECLINED"],
                CONFIRMED: ["COMPLETED", "CANCELLED"],
            },
            STUDENT: {
                PENDING: ["CANCELLED"],
                CONFIRMED: ["CANCELLED"],
            },
        };

        const role = isTutor ? "TUTOR" : "STUDENT";
        const allowed = allowedTransitions[role]?.[trial.status] || [];
        if (!allowed.includes(status)) {
            return NextResponse.json({ error: `Cannot change status from ${trial.status} to ${status}` }, { status: 400 });
        }

        const updated = await prisma.trialBooking.update({
            where: { id },
            data: {
                status,
                tutorNote: tutorNote || undefined,
                cancelReason: cancelReason || undefined,
            },
        });

        // Notify the other party
        const notifyUserId = isTutor ? trial.studentId : trial.tutorId;
        const statusMessages = {
            CONFIRMED: { title: "Trial class confirmed!", body: `Your trial for ${trial.subject} has been confirmed. The tutor will reach out to schedule the time.` },
            DECLINED: { title: "Trial class declined", body: `Your trial request for ${trial.subject} was not accepted. Try contacting another tutor.` },
            COMPLETED: { title: "Trial class completed", body: `Your trial class for ${trial.subject} is marked as done. You can now leave a review.` },
            CANCELLED: { title: "Trial class cancelled", body: `The trial booking for ${trial.subject} has been cancelled.` },
        };

        const msg = statusMessages[status];
        if (msg) {
            await prisma.notification.create({
                data: {
                    userId: notifyUserId,
                    type: "TRIAL_UPDATE",
                    title: msg.title,
                    body: msg.body,
                    link: session.role === "TUTOR"
                        ? `/dashboard/student?tab=TRIALS`
                        : `/dashboard/tutor?tab=TRIALS`,
                },
            }).catch(() => {});
        }

        return NextResponse.json({ success: true, trial: updated });
    } catch (error) {
        console.error("Trial status error:", error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}
