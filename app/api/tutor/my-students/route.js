import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const tutorId = searchParams.get("tutorId");

        if (!tutorId) {
            return NextResponse.json({ error: "Tutor ID is required" }, { status: 400 });
        }

        // Fetch leads unlocked by this tutor and include the student info
        const unlocks = await prisma.leadUnlock.findMany({
            where: { tutorId },
            include: {
                lead: {
                    include: {
                        student: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                phone: true
                            }
                        }
                    }
                }
            },
            orderBy: { unlockedAt: 'desc' }
        });

        // Map to unique student list
        const students = unlocks.map(u => ({
            ...u.lead.student,
            unlockedAt: u.unlockedAt,
            subject: u.lead.subjects?.[0], 
            location: u.lead.locations?.[0]
        }));

        // Deduplicate in case a tutor unlocked multiple leads for the same student
        const uniqueStudents = Array.from(new Map(students.map(s => [s.id, s])).values());

        return NextResponse.json(uniqueStudents);
    } catch (error) {
        console.error("Error fetching tutor's students:", error);
        return NextResponse.json({ error: "Failed to fetch student connections" }, { status: 500 });
    }
}
