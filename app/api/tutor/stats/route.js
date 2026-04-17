import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export async function GET(request) {
    try {
        const session = getSession();
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { searchParams } = new URL(request.url);
        const tutorId = searchParams.get("tutorId");

        if (!tutorId) {
            return NextResponse.json({ error: "Tutor ID is required" }, { status: 400 });
        }

        if (session.id !== tutorId && session.role !== "ADMIN") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
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
