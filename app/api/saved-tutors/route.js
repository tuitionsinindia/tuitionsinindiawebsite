import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

// GET /api/saved-tutors?studentId=xxx — list saved tutors
export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get("studentId");
    if (!studentId) return NextResponse.json({ error: "studentId required" }, { status: 400 });

    try {
        const saved = await prisma.savedTutor.findMany({
            where: { studentId },
            include: {
                tutor: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                        isVerified: true,
                        tutorListing: {
                            select: { subjects: true, locations: true, hourlyRate: true, rating: true, reviewCount: true, bio: true }
                        }
                    }
                }
            },
            orderBy: { createdAt: "desc" }
        });
        return NextResponse.json({ saved: saved.map(s => ({ ...s.tutor, savedAt: s.createdAt })) });
    } catch (error) {
        console.error("Saved tutors GET error:", error);
        return NextResponse.json({ error: "Failed to load saved tutors" }, { status: 500 });
    }
}

// POST /api/saved-tutors — save a tutor
export async function POST(request) {
    try {
        const { studentId, tutorId } = await request.json();
        if (!studentId || !tutorId) return NextResponse.json({ error: "studentId and tutorId required" }, { status: 400 });

        await prisma.savedTutor.create({ data: { studentId, tutorId } });
        return NextResponse.json({ success: true });
    } catch (error) {
        if (error.code === "P2002") return NextResponse.json({ success: true }); // already saved
        console.error("Save tutor error:", error);
        return NextResponse.json({ error: "Failed to save tutor" }, { status: 500 });
    }
}

// DELETE /api/saved-tutors?studentId=xxx&tutorId=xxx — unsave
export async function DELETE(request) {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get("studentId");
    const tutorId = searchParams.get("tutorId");
    if (!studentId || !tutorId) return NextResponse.json({ error: "studentId and tutorId required" }, { status: 400 });

    try {
        await prisma.savedTutor.deleteMany({ where: { studentId, tutorId } });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Unsave tutor error:", error);
        return NextResponse.json({ error: "Failed to unsave tutor" }, { status: 500 });
    }
}
