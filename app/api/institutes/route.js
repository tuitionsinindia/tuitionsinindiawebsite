import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const revalidate = 1800;

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const location = searchParams.get("location") || "";
        const subject = searchParams.get("subject") || "";
        const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 50);

        const where = {
            isInstitute: true,
            isActive: true,
            ...(location && { locations: { has: location } }),
            ...(subject && { subjects: { has: subject } }),
        };

        const institutes = await prisma.listing.findMany({
            where,
            orderBy: [{ viewCount: "desc" }, { createdAt: "desc" }],
            take: limit,
            select: {
                id: true,
                title: true,
                bio: true,
                subjects: true,
                locations: true,
                rating: true,
                reviewCount: true,
                viewCount: true,
                createdAt: true,
                tutor: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                        isVerified: true,
                        email: true,
                    },
                },
            },
        });

        return NextResponse.json(institutes);
    } catch (error) {
        console.error("Institutes list error:", error);
        return NextResponse.json([], { status: 200 });
    }
}
