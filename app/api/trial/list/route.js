import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/session";

export async function GET(request) {
    try {
        const token = request.cookies.get("ti_session")?.value;
        if (!token) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

        const session = verifyToken(token);
        if (!session) return NextResponse.json({ error: "Invalid session" }, { status: 401 });

        let trials;
        if (session.role === "STUDENT") {
            trials = await prisma.trialBooking.findMany({
                where: { studentId: session.id },
                include: {
                    tutor: { select: { id: true, name: true, image: true } },
                },
                orderBy: { createdAt: "desc" },
            });
        } else if (session.role === "TUTOR") {
            trials = await prisma.trialBooking.findMany({
                where: { tutorId: session.id },
                include: {
                    student: { select: { id: true, name: true, phone: true, image: true } },
                },
                orderBy: { createdAt: "desc" },
            });
        } else {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        return NextResponse.json({ trials });
    } catch (error) {
        console.error("Trial list error:", error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}
