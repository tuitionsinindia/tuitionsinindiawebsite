import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

// POST /api/cron/reset-credits
// Secured by x-cron-key header. Run on the 1st of each month.
// Refreshes subscription credits: PRO → 30, ELITE → 100. FREE stays unchanged.
export async function POST(request) {
    const authHeader = request.headers.get("x-cron-key");
    if (!authHeader || authHeader !== process.env.AUDIT_SEED_KEY) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const [proResult, eliteResult] = await Promise.all([
            prisma.user.updateMany({
                where: { subscriptionTier: "PRO", subscriptionStatus: "ACTIVE" },
                data: { credits: 30 },
            }),
            prisma.user.updateMany({
                where: { subscriptionTier: "ELITE", subscriptionStatus: "ACTIVE" },
                data: { credits: 100 },
            }),
        ]);

        return NextResponse.json({
            success: true,
            proReset: proResult.count,
            eliteReset: eliteResult.count,
            message: `Monthly credit refresh: ${proResult.count} PRO users → 30 credits, ${eliteResult.count} ELITE users → 100 credits`,
        });
    } catch (error) {
        console.error("Credit reset error:", error);
        return NextResponse.json({ error: "Failed to reset credits" }, { status: 500 });
    }
}
