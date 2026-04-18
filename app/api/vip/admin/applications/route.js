export const dynamic = "force-dynamic";

import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        const session = getSession();
        if (!session || session.role !== "ADMIN") {
            return NextResponse.json({ error: "Admin access required." }, { status: 403 });
        }

        const { searchParams } = new URL(request.url);
        const status = searchParams.get("status") || null;
        const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
        const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)));
        const skip = (page - 1) * limit;

        const where = status ? { status } : {};

        const [applications, total] = await Promise.all([
            prisma.vipApplication.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: "desc" },
                include: {
                    student: {
                        select: { id: true, name: true, email: true, phone: true },
                    },
                    _count: {
                        select: { matches: true },
                    },
                    contract: true,
                },
            }),
            prisma.vipApplication.count({ where }),
        ]);

        return NextResponse.json({
            applications,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        });
    } catch (err) {
        console.error("[VIP Admin Applications GET]", err);
        return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
    }
}

export async function PATCH(request) {
    try {
        const session = getSession();
        if (!session || session.role !== "ADMIN") {
            return NextResponse.json({ error: "Admin access required." }, { status: 403 });
        }

        const body = await request.json();
        const { applicationId, adminNotes, assignedAdminId, status } = body;

        if (!applicationId) {
            return NextResponse.json({ error: "Please provide an applicationId." }, { status: 400 });
        }

        const updateData = {};
        if (adminNotes !== undefined) updateData.adminNotes = adminNotes;
        if (assignedAdminId !== undefined) updateData.assignedAdminId = assignedAdminId;
        if (status !== undefined) updateData.status = status;

        if (Object.keys(updateData).length === 0) {
            return NextResponse.json({ error: "No fields to update." }, { status: 400 });
        }

        const application = await prisma.vipApplication.update({
            where: { id: applicationId },
            data: updateData,
        });

        return NextResponse.json({ success: true, application });
    } catch (err) {
        console.error("[VIP Admin Applications PATCH]", err);
        return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
    }
}
