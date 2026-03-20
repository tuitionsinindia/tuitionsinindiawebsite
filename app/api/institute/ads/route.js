import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");

        if (!userId) {
            return NextResponse.json({ error: "Missing User ID" }, { status: 400 });
        }

        const ads = await prisma.adSlot.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json(ads);
    } catch (error) {
        console.error("Error fetching ads:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const body = await request.json();
        const { userId, type, imageUrl, targetUrl, startTime, endTime } = body;

        if (!userId || !type || !startTime || !endTime) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const newAd = await prisma.adSlot.create({
            data: {
                userId,
                type,
                imageUrl,
                targetUrl,
                startTime: new Date(startTime),
                endTime: new Date(endTime),
                isActive: true
            }
        });

        return NextResponse.json(newAd);
    } catch (error) {
        console.error("Error creating ad:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
