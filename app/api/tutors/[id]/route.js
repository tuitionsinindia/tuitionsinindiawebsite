import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * GET /api/tutors/:id
 * Public endpoint — returns tutor profile + listing.
 * Phone is hidden unless the requesting student has unlocked a lead with this tutor.
 */
export async function GET(request, { params }) {
    try {
        const { id } = params;

        const user = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                role: true,
                isVerified: true,
                isIdVerified: true,
                createdAt: true,
                tutorListing: {
                    select: {
                        id: true,
                        title: true,
                        bio: true,
                        subjects: true,
                        grades: true,
                        locations: true,
                        hourlyRate: true,
                        rating: true,
                        reviewCount: true,
                        viewCount: true,
                        experience: true,
                        gender: true,
                        teachingModes: true,
                        timings: true,
                        languages: true,
                        boards: true,
                        expertiseLevel: true,
                        type: true,
                        offersTrialClass: true,
                        trialDuration: true,
                        isActive: true,
                    },
                },
                reviewsReceived: {
                    take: 5,
                    orderBy: { createdAt: "desc" },
                    select: {
                        id: true,
                        rating: true,
                        comment: true,
                        createdAt: true,
                        author: {
                            select: { name: true },
                        },
                    },
                },
            },
        });

        if (!user || user.role !== "TUTOR") {
            return NextResponse.json({ error: "Tutor not found" }, { status: 404 });
        }

        // Increment view count in the background
        if (user.tutorListing?.id) {
            prisma.listing.update({
                where: { id: user.tutorListing.id },
                data: { viewCount: { increment: 1 } },
            }).catch(() => {});
        }

        // Strip phone — it's only revealed via lead unlock flow
        const { phone, ...publicUser } = user;

        return NextResponse.json(publicUser);
    } catch (error) {
        console.error("[Tutors] GET error:", error);
        return NextResponse.json({ error: "Failed to fetch tutor" }, { status: 500 });
    }
}
