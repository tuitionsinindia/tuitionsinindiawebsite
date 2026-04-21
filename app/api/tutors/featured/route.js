import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const revalidate = 3600; // Cache for 1 hour

export async function GET() {
    try {
        const listings = await prisma.listing.findMany({
            where: {
                isActive: true,
                isInstitute: false,
                title: { not: "" },
                bio: { not: "" },
            },
            orderBy: [
                { isFeatured: "desc" },
                { rating: "desc" },
                { reviewCount: "desc" },
                { viewCount: "desc" },
            ],
            take: 8,
            select: {
                id: true,
                title: true,
                bio: true,
                subjects: true,
                locations: true,
                hourlyRate: true,
                rating: true,
                reviewCount: true,
                experience: true,
                teachingModes: true,
                expertiseLevel: true,
                offersTrialClass: true,
                isFeatured: true,
                tutor: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                        isVerified: true,
                        isIdVerified: true,
                    },
                },
            },
        });

        return NextResponse.json(listings);
    } catch (error) {
        console.error("Featured tutors error:", error);
        return NextResponse.json([], { status: 200 });
    }
}
