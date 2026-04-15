import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { createNotification } from '@/lib/notifications';
import { sendNewMessageEmail } from '@/lib/email';

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
        const session = await prisma.chatSession.update({
            where: { id: sessionId },
            data: { updatedAt: new Date() },
            select: { studentId: true, tutorId: true },
        });

        // Notify the recipient (non-blocking)
        const recipientId = senderId === session.studentId ? session.tutorId : session.studentId;
        const senderName = message.sender?.name || "Someone";
        const preview = content.length > 80 ? content.slice(0, 80) + "..." : content;
        createNotification(recipientId, {
            type: "NEW_MESSAGE",
            title: `New message from ${senderName}`,
            body: preview,
        });

        // Email notification to recipient
        prisma.user.findUnique({ where: { id: recipientId }, select: { email: true, name: true, role: true } })
            .then(recipient => {
                if (recipient?.email) {
                    const dashLink = recipient.role === "TUTOR"
                        ? "https://tuitionsinindia.com/dashboard/tutor"
                        : "https://tuitionsinindia.com/dashboard/student";
                    sendNewMessageEmail(recipient.email, recipient.name || "there", senderName, preview, dashLink);
                }
            }).catch(() => {});

        return NextResponse.json({ message });
    } catch (error) {
        console.error("Send message error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
