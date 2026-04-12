import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Fetch all sessions for a user
export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ error: "Missing User ID" }, { status: 400 });
        }

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
                    include: { sender: { select: { name: true } } }
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
        const body = await req.json();
        const { studentId, tutorId } = body;

        if (!studentId || !tutorId) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // 1. Check for existing session first to avoid redundant validation
        let session = await prisma.chatSession.findUnique({
            where: {
                studentId_tutorId: { studentId, tutorId }
            },
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
        if (!session) {
            const { initiatorId } = body;
            
            if (!initiatorId) {
                return NextResponse.json({ error: "Initiator ID required for new sessions" }, { status: 400 });
            }

            const [initiator, unlock] = await Promise.all([
                prisma.user.findUnique({ where: { id: initiatorId } }),
                prisma.leadUnlock.findFirst({
                    where: {
                        tutorId: tutorId,
                        lead: { studentId: studentId }
                    }
                })
            ]);

            const isPremium = ['PRO', 'ELITE', 'INSTITUTE'].includes(initiator?.subscriptionTier);
            const isAuthorized = unlock || isPremium || initiator?.role === 'ADMIN';

            if (!isAuthorized) {
                return NextResponse.json({
                    error: "Upgrade required",
                    details: "A premium subscription or lead unlock is required to start a conversation."
                }, { status: 403 });
            }

            // Create the authorized session
            session = await prisma.chatSession.create({
                data: { studentId, tutorId },
                include: {
                    student: { select: { id: true, name: true, image: true, role: true } },
                    tutor: { select: { id: true, name: true, image: true, role: true } },
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
