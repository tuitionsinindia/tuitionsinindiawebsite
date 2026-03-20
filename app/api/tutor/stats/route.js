import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const tutorId = searchParams.get("tutorId");

        if (!tutorId) {
            return NextResponse.json({ error: "Tutor ID is required" }, { status: 400 });
        }

        const [listing, unlockCount, reviewStats] = await Promise.all([
            prisma.listing.findUnique({
                where: { tutorId },
                select: { viewCount: true, rating: true, reviewCount: true }
            }),
            prisma.leadUnlock.count({
                where: { tutorId }
            }),
            prisma.review.aggregate({
                where: { targetId: tutorId },
                _avg: { rating: true },
                _count: { rating: true }
            })
        ]);

        return NextResponse.json({
            profileViews: listing?.viewCount || 0,
            leadsUnlocked: unlockCount,
            rating: reviewStats._avg.rating || listing?.rating || 0,
            reviewsCount: reviewStats._count.rating || listing?.reviewCount || 0
        });
    } catch (error) {
        console.error("Error fetching tutor stats:", error);
        return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
    }
}
