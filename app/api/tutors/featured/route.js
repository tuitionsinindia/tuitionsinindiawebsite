import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

// GET /api/tutors/featured?sort=reviewed|popular
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const sort = searchParams.get("sort") || "reviewed";

        const orderBy = sort === "popular"
            ? [{ viewCount: "desc" }, { reviewCount: "desc" }, { rating: "desc" }]
            : [{ isFeatured: "desc" }, { rating: "desc" }, { reviewCount: "desc" }, { viewCount: "desc" }];

        const listings = await prisma.listing.findMany({
            where: { isActive: true, isInstitute: false, title: { not: "" }, bio: { not: "" } },
            orderBy,
            take: 8,
            select: {
                id: true, title: true, bio: true, subjects: true, locations: true,
                hourlyRate: true, rating: true, reviewCount: true, viewCount: true,
                experience: true, teachingModes: true, offersTrialClass: true, isFeatured: true,
                tutor: { select: { id: true, name: true, image: true, isVerified: true, isIdVerified: true } },
            },
        });

        return NextResponse.json(listings);
    } catch (error) {
        console.error("Featured tutors error:", error);
        return NextResponse.json([], { status: 200 });
    }
}
