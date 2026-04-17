import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(request) {
    const session = getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get("studentId");

    if (!studentId) return NextResponse.json({ error: "Missing studentId" }, { status: 400 });
    if (session.id !== studentId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    try {
        const unlocks = await prisma.leadUnlock.findMany({
            where: { lead: { studentId } },
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
        const uniqueTutors = Array.from(new Map(tutors.map(t => [t.id, t])).values());
        return NextResponse.json(uniqueTutors);
    } catch (error) {
        console.error("Error fetching unlocked tutors:", error);
        return NextResponse.json({ error: "Failed to fetch tutors" }, { status: 500 });
    }
}
