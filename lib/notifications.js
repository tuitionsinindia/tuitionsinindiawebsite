import prisma from "@/lib/prisma";

/**
 * Creates an in-app notification for a user.
 * Silently fails — never throws, so it doesn't break the calling flow.
 */
export async function createNotification(userId, { type, title, body, link = null }) {
    try {
        await prisma.notification.create({
            data: { userId, type, title, body, link }
        });
    } catch (err) {
        console.error("Failed to create notification:", err.message);
    }
}

/**
 * Bulk-creates notifications for multiple users (e.g. notify all matching tutors).
 */
export async function createNotifications(userIds, { type, title, body, link = null }) {
    if (!userIds?.length) return;
    try {
        await prisma.notification.createMany({
            data: userIds.map(userId => ({ userId, type, title, body, link })),
            skipDuplicates: true
        });
    } catch (err) {
        console.error("Failed to create bulk notifications:", err.message);
    }
}
