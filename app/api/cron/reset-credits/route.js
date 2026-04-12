import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

// POST /api/cron/reset-credits
// Secured by AUDIT_SEED_KEY header. Run on the 1st of each month.
// Resets FREE-tier tutors to 5 credits.
export async function POST(request) {
    const authHeader = request.headers.get("x-cron-key");
    if (!authHeader || authHeader !== process.env.AUDIT_SEED_KEY) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const result = await prisma.user.updateMany({
            where: {
                role: "TUTOR",
                subscriptionTier: "FREE"
            },
            data: {
                credits: 5
            }
        });

        return NextResponse.json({
            success: true,
            resetCount: result.count,
            message: `Reset credits to 5 for ${result.count} FREE tutors`
        });
    } catch (error) {
        console.error("Credit reset error:", error);
        return NextResponse.json({ error: "Failed to reset credits" }, { status: 500 });
    }
}
