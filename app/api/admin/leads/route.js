import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { isAdminAuthorized } from "@/lib/adminAuth";

export const dynamic = 'force-dynamic';

const PAGE_SIZE = 20;

export async function GET(request) {
    if (!isAdminAuthorized(request)) {
        return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(request.url);
        const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
        const status = searchParams.get("status") || "";

        const where = status ? { status } : {};

        const [leads, total] = await Promise.all([
            prisma.lead.findMany({
                where,
                include: {
                    student: { select: { id: true, name: true, phone: true, email: true } },
                    _count: { select: { unlockedBy: true } }
                },
                orderBy: { createdAt: "desc" },
                skip: (page - 1) * PAGE_SIZE,
                take: PAGE_SIZE,
            }),
            prisma.lead.count({ where })
        ]);

        return NextResponse.json({
            success: true, leads, total, page,
            pages: Math.ceil(total / PAGE_SIZE)
        });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function PATCH(request) {
    if (!isAdminAuthorized(request)) {
        return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    try {
        const { leadId, status } = await request.json();
        if (!leadId || !status) {
            return NextResponse.json({ success: false, error: "leadId and status required" }, { status: 400 });
        }

        const lead = await prisma.lead.update({
            where: { id: leadId },
            data: { status },
            select: { id: true, status: true }
        });

        return NextResponse.json({ success: true, lead });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
