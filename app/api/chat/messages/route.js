import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { createNotification } from '@/lib/notifications';
import { sendNewMessageEmail } from '@/lib/email';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// Fetch all messages for a session (used for polling)
export async function GET(req) {
    try {
        const session = getSession();
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { searchParams } = new URL(req.url);
        const sessionId = searchParams.get('sessionId');

        if (!sessionId) {
            return NextResponse.json({ error: "Missing session ID" }, { status: 400 });
        }

        // Verify the requesting user is a participant in this chat session
        const chatSession = await prisma.chatSession.findUnique({
            where: { id: sessionId },
            select: { studentId: true, tutorId: true },
        });
        if (!chatSession) return NextResponse.json({ error: "Session not found" }, { status: 404 });
        if (session.id !== chatSession.studentId && session.id !== chatSession.tutorId) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
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
        const session = getSession();
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { sessionId, senderId, content } = await req.json();

        if (!sessionId || !senderId || !content) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Verify the sender is the authenticated user
        if (session.id !== senderId) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        // Verify the sender is a participant in this session
        const chatSession = await prisma.chatSession.findUnique({
            where: { id: sessionId },
            select: { studentId: true, tutorId: true },
        });
        if (!chatSession) return NextResponse.json({ error: "Session not found" }, { status: 404 });
        if (senderId !== chatSession.studentId && senderId !== chatSession.tutorId) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        // Enforce message length limit
        const trimmedContent = content.trim().slice(0, 2000);
        if (!trimmedContent) {
            return NextResponse.json({ error: "Message cannot be empty" }, { status: 400 });
        }

        const message = await prisma.message.create({
            data: { sessionId, senderId, content: trimmedContent },
            include: {
                sender: { select: { id: true, name: true, role: true } }
            }
        });

        // Update the session's updatedAt time
        await prisma.chatSession.update({
            where: { id: sessionId },
            data: { updatedAt: new Date() },
        });

        // Notify the recipient (non-blocking)
        const recipientId = senderId === chatSession.studentId ? chatSession.tutorId : chatSession.studentId;
        const senderName = message.sender?.name || "Someone";
        const preview = trimmedContent.length > 80 ? trimmedContent.slice(0, 80) + "..." : trimmedContent;

        createNotification(recipientId, {
            type: "NEW_MESSAGE",
            title: `New message from ${senderName}`,
            body: preview,
        });

        // Email notification to recipient
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://tuitionsinindia.com";
        prisma.user.findUnique({ where: { id: recipientId }, select: { email: true, name: true, role: true } })
            .then(recipient => {
                if (recipient?.email) {
                    const dashLink = recipient.role === "TUTOR"
                        ? `${baseUrl}/dashboard/tutor`
                        : `${baseUrl}/dashboard/student`;
                    sendNewMessageEmail(recipient.email, recipient.name || "there", senderName, preview, dashLink);
                }
            }).catch(err => console.error("[chat/messages] Email notification failed:", err));

        return NextResponse.json({ message });
    } catch (error) {
        console.error("Send message error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
