export const dynamic = "force-dynamic";

import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const session = getSession();
        if (!session) {
            return NextResponse.json({ error: "Please log in to continue." }, { status: 401 });
        }
        if (session.role !== "TUTOR") {
            return NextResponse.json({ error: "Only tutors can check verification status." }, { status: 403 });
        }

        const EARLY_ADOPTER_LIMIT = 100;

        const [verificationRequest, slotsUsed] = await Promise.all([
            prisma.verificationRequest.findUnique({ where: { tutorId: session.id } }),
            prisma.verificationRequest.count({
                where: { status: { in: ["PENDING_REVIEW", "APPROVED"] } },
            }),
        ]);

        const slotsRemaining = Math.max(0, EARLY_ADOPTER_LIMIT - slotsUsed);

        return NextResponse.json({
            request: verificationRequest || null,
            earlyAdopter: {
                slotsRemaining,
                slotsUsed,
                limit: EARLY_ADOPTER_LIMIT,
                isFree: slotsRemaining > 0,
            },
        });
    } catch (err) {
        console.error("[Verification Status]", err);
        return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
    }
}
