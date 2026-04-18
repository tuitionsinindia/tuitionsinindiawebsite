import { NextResponse } from "next/server";
import { isAdminAuthorized } from "@/lib/adminAuth";
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET(request) {
    if (!isAdminAuthorized(request)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(request.url);
        const unreadOnly = searchParams.get("unread") === "true";
        const limit = parseInt(searchParams.get("limit") || "20", 10);

        const where = unreadOnly ? { isRead: false } : {};

        const [insights, unreadCount] = await Promise.all([
            prisma.adminInsight.findMany({
                where,
                orderBy: { createdAt: "desc" },
                take: limit,
            }),
            prisma.adminInsight.count({ where: { isRead: false } }),
        ]);

        return NextResponse.json({ insights, unreadCount });
    } catch (error) {
        console.error("GET /api/admin/insights error:", error);
        return NextResponse.json({ error: "Failed to fetch insights" }, { status: 500 });
    }
}

export async function PATCH(request) {
    if (!isAdminAuthorized(request)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await request.json();

        if (body.markAllRead) {
            await prisma.adminInsight.updateMany({
                where: { isRead: false },
                data: { isRead: true },
            });
            return NextResponse.json({ success: true });
        }

        if (!body.id) {
            return NextResponse.json({ error: "id or markAllRead is required" }, { status: 400 });
        }

        await prisma.adminInsight.update({
            where: { id: body.id },
            data: { isRead: true },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("PATCH /api/admin/insights error:", error);
        return NextResponse.json({ error: "Failed to update insight" }, { status: 500 });
    }
}
