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
        const search = searchParams.get("search") || "";
        const role = searchParams.get("role") || "";
        const page = Math.max(1, parseInt(searchParams.get("page") || "1"));

        const where = {
            ...(role && { role: role.toUpperCase() }),
            ...(search && {
                OR: [
                    { name: { contains: search, mode: "insensitive" } },
                    { phone: { contains: search } },
                    { email: { contains: search, mode: "insensitive" } }
                ]
            })
        };

        const [users, total] = await Promise.all([
            prisma.user.findMany({
                where,
                select: {
                    id: true, name: true, email: true, phone: true, role: true,
                    isVerified: true, isSuspended: true, credits: true,
                    subscriptionTier: true, subscriptionStatus: true, createdAt: true,
                    _count: { select: { transactions: true, leadsPosted: true } }
                },
                orderBy: { createdAt: "desc" },
                skip: (page - 1) * PAGE_SIZE,
                take: PAGE_SIZE,
            }),
            prisma.user.count({ where })
        ]);

        return NextResponse.json({
            success: true, users, total, page,
            pages: Math.ceil(total / PAGE_SIZE)
        });
    } catch (error) {
        console.error("Admin users error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
