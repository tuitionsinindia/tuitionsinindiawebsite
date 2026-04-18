import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// Fetch all sessions for a user
export async function GET(req) {
    try {
        const session = getSession();
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');

        if (!userId) return NextResponse.json({ error: "Missing User ID" }, { status: 400 });
        if (session.id !== userId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

        const sessions = await prisma.chatSession.findMany({
            where: {
                OR: [
                    { studentId: userId },
                    { tutorId: userId }
                ]
            },
            include: {
                student: { select: { id: true, name: true, image: true, role: true } },
                tutor: { select: { id: true, name: true, image: true, role: true } },
                messages: {
                    orderBy: { createdAt: 'desc' },
                    take: 1,
                    select: { id: true, content: true, isRead: true, senderId: true, createdAt: true, sender: { select: { name: true } } }
                }
            },
            orderBy: { updatedAt: 'desc' }
        });

        return NextResponse.json({ sessions });
    } catch (error) {
        console.error("Fetch sessions error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// Create or find a specific session between two users
export async function POST(req) {
    try {
        const session = getSession();
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const body = await req.json();
        const { studentId, tutorId } = body;

        if (!studentId || !tutorId) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // The authenticated user must be one of the participants
        if (session.id !== studentId && session.id !== tutorId) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        // 1. Check for existing session first
        let chatSession = await prisma.chatSession.findUnique({
            where: { studentId_tutorId: { studentId, tutorId } },
            include: {
                student: { select: { id: true, name: true, image: true, role: true, subscriptionTier: true } },
                tutor: { select: { id: true, name: true, image: true, role: true } },
                messages: {
                    orderBy: { createdAt: 'asc' },
                    include: { sender: { select: { name: true } } }
                }
            }
        });

        // 2. If new connection, check if initiator has unlock or premium
        if (!chatSession) {
            const initiatorId = session.id;

            const [initiator, unlock] = await Promise.all([
                prisma.user.findUnique({ where: { id: initiatorId } }),
                prisma.leadUnlock.findFirst({
                    where: {
                        tutorId,
                        lead: { studentId }
                    }
                })
            ]);

            if (!initiator) return NextResponse.json({ error: "User not found" }, { status: 404 });

            const isPremium = ['PRO', 'ELITE'].includes(initiator.subscriptionTier);
            const isAuthorized = unlock || isPremium || initiator.role === 'ADMIN';

            if (!isAuthorized) {
                return NextResponse.json({
                    error: "Upgrade required",
                    details: "A premium subscription or lead unlock is required to start a conversation."
                }, { status: 403 });
            }

            chatSession = await prisma.chatSession.create({
                data: { studentId, tutorId },
                include: {
                    student: { select: { id: true, name: true, image: true, role: true } },
                    tutor: { select: { id: true, name: true, image: true, role: true } },
                    messages: true
                }
            });
        }

        return NextResponse.json({ session: chatSession });
    } catch (error) {
        console.error("Chat session error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
