import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

// POST /api/cron/reset-credits
// Secured by x-cron-key header. Run on the 1st of each month.
// 1. Refreshes subscription credits: PRO → 30, ELITE → 100. FREE stays unchanged.
// 2. Resets contactViewsThisMonth to 0 for all students (demo booking monthly limit).
export async function POST(request) {
    const authHeader = request.headers.get("x-cron-key");
    if (!authHeader || authHeader !== process.env.AUDIT_SEED_KEY) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const [proResult, eliteResult, contactViewsResult] = await Promise.all([
            // Refresh PRO subscription credits
            prisma.user.updateMany({
                where: { subscriptionTier: "PRO", subscriptionStatus: "ACTIVE" },
                data: { credits: 30 },
            }),
            // Refresh ELITE subscription credits
            prisma.user.updateMany({
                where: { subscriptionTier: "ELITE", subscriptionStatus: "ACTIVE" },
                data: { credits: 100 },
            }),
            // Reset monthly demo booking + contact view counter for all students
            prisma.user.updateMany({
                where: { role: "STUDENT" },
                data: { contactViewsThisMonth: 0 },
            }),
        ]);

        return NextResponse.json({
            success: true,
            proReset: proResult.count,
            eliteReset: eliteResult.count,
            contactViewsReset: contactViewsResult.count,
            message: `Monthly reset: ${proResult.count} PRO → 30 credits, ${eliteResult.count} ELITE → 100 credits, ${contactViewsResult.count} students' monthly limits cleared`,
        });
    } catch (error) {
        console.error("Credit reset error:", error);
        return NextResponse.json({ error: "Failed to reset credits" }, { status: 500 });
    }
}
