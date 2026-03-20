import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req) {
    try {
        const { studentId, tutorId } = await req.json();

        if (!studentId || !tutorId) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Find existing session
        let session = await prisma.chatSession.findUnique({
            where: {
                studentId_tutorId: { studentId, tutorId }
            },
            include: {
                student: { select: { id: true, name: true, role: true } },
                tutor: { select: { id: true, name: true, role: true } },
                messages: { orderBy: { createdAt: 'asc' } }
            }
        });

        // Create if it doesn't exist
        if (!session) {
            // Validate they both exist
            const student = await prisma.user.findUnique({ where: { id: studentId } });
            const tutor = await prisma.user.findUnique({ where: { id: tutorId } });

            if (!student || !tutor) {
                return NextResponse.json({ error: "Invalid user references" }, { status: 400 });
            }

            session = await prisma.chatSession.create({
                data: {
                    studentId,
                    tutorId
                },
                include: {
                    student: { select: { id: true, name: true, role: true } },
                    tutor: { select: { id: true, name: true, role: true } },
                    messages: true
                }
            });
        }

        return NextResponse.json({ session });
    } catch (error) {
        console.error("Chat session error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
