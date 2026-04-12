import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken, COOKIE_NAME } from "@/lib/session";

export const dynamic = 'force-dynamic';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ error: "Missing User ID" }, { status: 400 });
        }

        // Verify caller is authenticated
        const cookie = request.cookies.get(COOKIE_NAME);
        const session = cookie ? verifyToken(cookie.value) : null;

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                role: true,
                credits: true,
                isVerified: true,
                isIdVerified: true,
                subscriptionTier: true,
                subscriptionStatus: true,
                image: true,
                notificationPrefs: true,
                privacySettings: true,
                isSuspended: true,
                // Only return contact info if caller owns this record
                ...(session.id === id ? { email: true, phone: true } : {}),
                tutorListing: {
                    select: {
                        subjects: true, bio: true, rating: true, reviewCount: true,
                        viewCount: true, hourlyRate: true, experience: true, gender: true,
                        locations: true, grades: true, teachingModes: true, timings: true,
                        boards: true, languages: true, expertiseLevel: true, type: true,
                        title: true, isActive: true,
                    },
                },
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
