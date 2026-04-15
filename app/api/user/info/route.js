import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");
        const viewerId = searchParams.get("viewerId"); // Optional: for checking permission

        if (!id) {
            return NextResponse.json({ error: "Missing User ID" }, { status: 400 });
        }

        const isSelf = id === viewerId;

        const user = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                image: true,
                role: true,
                isVerified: true,
                isIdVerified: true,
                subscriptionTier: true,
                subscriptionStatus: true,
                // Only return PII/Credits if viewing self or authorized
                email: isSelf,
                phone: isSelf,
                credits: isSelf,
                tutorListing: isSelf ? {
                    select: {
                        id: true,
                        bio: true,
                        subjects: true,
                        grades: true,
                        locations: true,
                        hourlyRate: true,
                        experience: true,
                        gender: true,
                        teachingModes: true,
                        timings: true,
                        languages: true,
                        offersTrialClass: true,
                        trialDuration: true,
                        rating: true,
                        reviewCount: true,
                        isActive: true,
                    }
                } : false,
            },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch (error) {
        console.error("Error fetching user info:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
