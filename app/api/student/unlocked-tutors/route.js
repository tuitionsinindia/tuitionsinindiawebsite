import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get("studentId");

    if (!studentId) {
        return NextResponse.json({ error: "Missing studentId" }, { status: 400 });
    }

    try {
        // Find all unlocks where the tutor unlocked a lead belonging to this student
        // Or conceptually: where this student unlocked a tutor (depends on the model)
        // In our plan: Tutors unlock student leads. Students unlock tutors.
        // Wait, the current LeadUnlock model is:
        // lead has a student. tutor unlocks the lead.
        // So the student has implicitly shared their contact with the tutor.
        // Does the student "unlock" the tutor, or does the tutor "unlock" the student's lead?
        // According to the new hybrid plan:
        // 1. Tutors unlock student leads (which we already had in LeadUnlock).
        // 2. Students unlock Tutors.

        // Since the current LeadUnlock is tutor-centric, let's fetch tutors who have 
        // been unlocked by the student AND tutors who unlocked the student's leads.
        // For now, let's just fetch tutors who unlocked this student's leads, as that means a connection was made.

        const unlocks = await prisma.leadUnlock.findMany({
            where: {
                lead: {
                    studentId: studentId
                }
            },
            include: {
                tutor: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true,
                        isVerified: true,
                        tutorListing: {
                            select: {
                                subjects: true,
                                hourlyRate: true,
                                locations: true,
                                experience: true,
                                rating: true,
                            }
                        }
                    }
                }
            }
        });

        const tutors = unlocks.map(u => u.tutor);

        // Deduplicate tutors in case a tutor unlocked multiple leads from the same student
        const uniqueTutors = Array.from(new Map(tutors.map(t => [t.id, t])).values());

        return NextResponse.json(uniqueTutors);
    } catch (error) {
        console.error("Error fetching unlocked tutors:", error);
        return NextResponse.json({ error: "Failed to fetch tutors" }, { status: 500 });
    }
}
