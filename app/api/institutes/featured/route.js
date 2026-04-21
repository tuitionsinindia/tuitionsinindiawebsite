import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

export async function GET() {
    try {
        const listings = await prisma.listing.findMany({
            where: { isActive: true, isInstitute: true },
            orderBy: [{ rating: "desc" }, { reviewCount: "desc" }],
            take: 6,
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
                offersTrialClass: true,
                tutor: {
                    select: {
                        name: true,
                        image: true,
                        isVerified: true,
                    },
                },
            },
        });
        return NextResponse.json(listings);
    } catch (e) {
        console.error("institutes/featured error:", e);
        return NextResponse.json([], { status: 200 });
    }
}
