import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function POST(request) {
    try {
        const body = await request.json();
        const { 
            userId, 
            tutorId, 
            name, 
            phone, 
            title, 
            bio, 
            subjects, 
            locations, 
            hourlyRate, 
            grades, 
            isInstitute, 
            instituteName, 
            contactPerson, 
            experience,
            teachingModes,
            timings,
            boards,
            languages,
            expertiseLevel,
            gender
        } = body;

        const targetId = userId || tutorId;

        if (!targetId) {
            return NextResponse.json({ success: false, error: "Missing Target ID" }, { status: 400 });
        }

        // 1. Update User basic info
        await prisma.user.update({
            where: { id: targetId },
            data: {
                name: contactPerson || name || undefined,
                phone,
                isProfileComplete: true
            }
        });

        // 2. Normalize inputs to arrays
        const subjectList = Array.isArray(subjects) ? subjects : subjects?.split(',').map(s => s.trim().toUpperCase()).filter(Boolean) || [];
        const locationList = Array.isArray(locations) ? locations : locations?.split(',').map(l => l.trim().toUpperCase()).filter(Boolean) || [];
        const gradeList = Array.isArray(grades) ? grades : grades?.split(',').map(g => g.trim().toUpperCase()).filter(Boolean) || [];
        const boardList = Array.isArray(boards) ? boards : boards?.split(',').map(b => b.trim().toUpperCase()).filter(Boolean) || [];
        const timingList = Array.isArray(timings) ? timings : timings?.split(',').map(t => t.trim()).filter(Boolean) || [];
        const languageList = Array.isArray(languages) ? languages : languages?.split(',').map(l => l.trim().toUpperCase()).filter(Boolean) || [];

        // 3. Prepare Listing Data
        const finalTitle = isInstitute ? `INSTITUTE: ${instituteName || title}` : (title || "PROFESSIONAL TUTOR");

        const listingData = {
            title: finalTitle,
            bio: bio || "",
            subjects: subjectList,
            grades: gradeList,
            locations: locationList,
            hourlyRate: parseInt(hourlyRate) || 0,
            experience: parseInt(experience) || 0,
            teachingModes: teachingModes || ["ONLINE"],
            timings: timingList,
            boards: boardList,
            languages: languageList,
            expertiseLevel,
            gender
        };

        // 4. Upsert Listing
        await prisma.listing.upsert({
            where: { tutorId: targetId },
            update: listingData,
            create: {
                tutorId: targetId,
                ...listingData
            }
        });

        return NextResponse.json({ success: true, message: "Faculty Terminal Configured Successfully" });
    } catch (error) {
        console.error("Profile Update Error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
