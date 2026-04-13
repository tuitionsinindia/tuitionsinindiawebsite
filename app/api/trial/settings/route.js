import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/session";

export async function PATCH(request) {
    try {
        const token = request.cookies.get("ti_session")?.value;
        if (!token) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

        const session = verifyToken(token);
        if (!session || session.role !== "TUTOR") {
            return NextResponse.json({ error: "Only tutors can update trial settings" }, { status: 403 });
        }

        const { offersTrialClass, trialDuration } = await request.json();

        await prisma.listing.update({
            where: { tutorId: session.id },
            data: {
                offersTrialClass: Boolean(offersTrialClass),
                trialDuration: parseInt(trialDuration) || 30,
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Trial settings error:", error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}
