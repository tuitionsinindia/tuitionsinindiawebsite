import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { isAdminAuthorized } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

// List tickets. Query params: status (OPEN|IN_PROGRESS|RESOLVED|CLOSED|ALL),
// type (SALES|SUPPORT|ALL), limit (default 50).
export async function GET(request) {
    if (!isAdminAuthorized(request)) {
        return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "ALL";
    const type = searchParams.get("type") || "ALL";
    const limit = Math.min(parseInt(searchParams.get("limit") || "50", 10), 200);

    const where = {};
    if (status !== "ALL") where.status = status;
    if (type !== "ALL") where.type = type;

    try {
        const [tickets, counts] = await Promise.all([
            prisma.ticket.findMany({
                where,
                orderBy: { createdAt: "desc" },
                take: limit,
            }),
            prisma.ticket.groupBy({
                by: ["status"],
                _count: { _all: true },
            }),
        ]);

        const statusCounts = counts.reduce((acc, c) => {
            acc[c.status] = c._count._all;
            return acc;
        }, {});

        return NextResponse.json({
            success: true,
            tickets,
            statusCounts,
            totalReturned: tickets.length,
        });
    } catch (err) {
        console.error("Admin tickets GET error:", err);
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}

// Update ticket status. Body: { id, status }
export async function PATCH(request) {
    if (!isAdminAuthorized(request)) {
        return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { id, status } = await request.json();
        if (!id || !status) {
            return NextResponse.json({ success: false, error: "id and status required" }, { status: 400 });
        }
        const allowed = ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"];
        if (!allowed.includes(status)) {
            return NextResponse.json({ success: false, error: "Invalid status" }, { status: 400 });
        }

        const ticket = await prisma.ticket.update({
            where: { id },
            data: { status },
        });
        return NextResponse.json({ success: true, ticket });
    } catch (err) {
        console.error("Admin tickets PATCH error:", err);
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}
