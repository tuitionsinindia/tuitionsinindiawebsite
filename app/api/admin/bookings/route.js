import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { isAdminAuthorized } from "@/lib/adminAuth";

export const dynamic = 'force-dynamic';

const PAGE_SIZE = 20;

export async function GET(request) {
    if (!isAdminAuthorized(request)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(request.url);
        const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
        const limit = Math.max(1, parseInt(searchParams.get("limit") || String(PAGE_SIZE)));
        const status = searchParams.get("status") || "all";
        const search = searchParams.get("search") || "";

        const where = {};

        if (status && status !== "all") {
            where.status = status.toUpperCase();
        }

        if (search) {
            where.OR = [
                { student: { name: { contains: search, mode: "insensitive" } } },
                { tutor: { name: { contains: search, mode: "insensitive" } } },
            ];
        }

        const [bookings, total] = await Promise.all([
            prisma.trialBooking.findMany({
                where,
                select: {
                    id: true,
                    subject: true,
                    preferredTime: true,
                    status: true,
                    depositStatus: true,
                    depositAmount: true,
                    demoType: true,
                    createdAt: true,
                    student: {
                        select: { name: true, email: true, phone: true },
                    },
                    tutor: {
                        select: { name: true, email: true, phone: true },
                    },
                },
                orderBy: { createdAt: "desc" },
                skip: (page - 1) * limit,
                take: limit,
            }),
            prisma.trialBooking.count({ where }),
        ]);

        return NextResponse.json({
            bookings,
            total,
            page,
            pages: Math.ceil(total / limit),
        });
    } catch (error) {
        console.error("Admin bookings error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
