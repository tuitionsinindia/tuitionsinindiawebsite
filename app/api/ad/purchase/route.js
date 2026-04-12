import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

// POST /api/ad/purchase — create a featured listing ad slot after payment
export async function POST(request) {
    try {
        const { userId, type, duration } = await request.json();

        if (!userId || !type || !duration) {
            return NextResponse.json({ error: "userId, type, and duration are required" }, { status: 400 });
        }

        const now = new Date();
        const durationDays = duration === "month" ? 30 : 7;
        const endTime = new Date(now.getTime() + durationDays * 24 * 60 * 60 * 1000);

        const adSlot = await prisma.adSlot.create({
            data: {
                userId,
                type,
                startTime: now,
                endTime,
                isActive: true,
            },
        });

        return NextResponse.json({ success: true, adSlot });
    } catch (error) {
        console.error("Ad purchase error:", error);
        return NextResponse.json({ error: "Failed to create ad slot" }, { status: 500 });
    }
}

// GET /api/ad/purchase?userId=xxx — get active ads for a user
export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
        return NextResponse.json({ error: "userId required" }, { status: 400 });
    }

    try {
        const ads = await prisma.adSlot.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
        });
        return NextResponse.json({ ads });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch ads" }, { status: 500 });
    }
}
