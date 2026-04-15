import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken, COOKIE_NAME } from "@/lib/session";

export const dynamic = 'force-dynamic';

// GET /api/notifications?userId=xxx
// Returns recent notifications (unread first, last 30), plus unread count
export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
        return NextResponse.json({ error: "userId required" }, { status: 400 });
    }

    // Verify caller owns this data
    const cookie = request.cookies.get(COOKIE_NAME);
    const session = cookie ? verifyToken(cookie.value) : null;
    if (!session || session.id !== userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const [notifications, unreadCount] = await Promise.all([
            prisma.notification.findMany({
                where: { userId },
                orderBy: [{ isRead: "asc" }, { createdAt: "desc" }],
                take: 30,
            }),
            prisma.notification.count({
                where: { userId, isRead: false },
            }),
        ]);

        return NextResponse.json({ success: true, notifications, unreadCount });
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

// PATCH /api/notifications
// Body: { userId, notificationId? }
// If notificationId is provided, marks that one as read.
// Otherwise marks ALL for that user as read.
export async function PATCH(request) {
    try {
        const { userId, notificationId } = await request.json();

        if (!userId) {
            return NextResponse.json({ error: "userId required" }, { status: 400 });
        }

        // Verify caller owns these notifications
        const cookie = request.cookies.get(COOKIE_NAME);
        const session = cookie ? verifyToken(cookie.value) : null;
        if (!session || session.id !== userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (notificationId) {
            // Scope update to notifications owned by this user — prevents cross-user marking
            await prisma.notification.updateMany({
                where: { id: notificationId, userId },
                data: { isRead: true },
            });
        } else {
            await prisma.notification.updateMany({
                where: { userId, isRead: false },
                data: { isRead: true },
            });
        }

        return NextResponse.json({ success: true });
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
