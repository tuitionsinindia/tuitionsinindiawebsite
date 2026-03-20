import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Fetch all messages for a session (used for polling)
export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const sessionId = searchParams.get('sessionId');

        if (!sessionId) {
            return NextResponse.json({ error: "Missing session ID" }, { status: 400 });
        }

        const messages = await prisma.message.findMany({
            where: { sessionId },
            orderBy: { createdAt: 'asc' },
            include: {
                sender: { select: { id: true, name: true, role: true } }
            }
        });

        return NextResponse.json({ messages });
    } catch (error) {
        console.error("Fetch messages error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// Send a new message
export async function POST(req) {
    try {
        const { sessionId, senderId, content } = await req.json();

        if (!sessionId || !senderId || !content) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const message = await prisma.message.create({
            data: {
                sessionId,
                senderId,
                content
            },
            include: {
                sender: { select: { id: true, name: true, role: true } }
            }
        });

        // Update the session's updatedAt time
        await prisma.chatSession.update({
            where: { id: sessionId },
            data: { updatedAt: new Date() }
        });

        return NextResponse.json({ message });
    } catch (error) {
        console.error("Send message error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
