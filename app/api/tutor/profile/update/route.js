import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function POST(request) {
    try {
        const body = await request.json();
        const { tutorId, name, phone, title, bio, subjects, locations, hourlyRate, grades } = body;

        if (!tutorId) {
            return NextResponse.json({ success: false, error: "Missing Tutor ID" }, { status: 400 });
        }

        // 1. Update User basic info
        await prisma.user.update({
            where: { id: tutorId },
            data: {
                name,
                phone
            }
        });

        // 2. Process comma separated lists (if they are strings)
        const subjectList = Array.isArray(subjects) ? subjects : subjects?.split(',').map(s => s.trim()).filter(s => s !== "") || [];
        const locationList = Array.isArray(locations) ? locations : locations?.split(',').map(l => l.trim()).filter(l => l !== "") || [];
        const gradeList = Array.isArray(grades) ? grades : grades?.split(',').map(g => g.trim()).filter(g => g !== "") || [];

        // 3. Update or Create Listing
        const listingData = {
            title: title || "Professional Tutor",
            bio: bio || "",
            subjects: subjectList,
            grades: gradeList,
            locations: locationList,
            hourlyRate: parseInt(hourlyRate) || 0,
        };

        const existingListing = await prisma.listing.findUnique({
            where: { tutorId }
        });

        if (existingListing) {
            await prisma.listing.update({
                where: { tutorId },
                data: listingData
            });
        } else {
            await prisma.listing.create({
                data: {
                    tutorId,
                    ...listingData
                }
            });
        }

        return NextResponse.json({ success: true, message: "Profile updated successfully" });
    } catch (error) {
        console.error("Error updating profile:", error);
        return NextResponse.json(
            { success: false, error: error.message || "Failed to update profile" },
            { status: 500 }
        );
    }
}
