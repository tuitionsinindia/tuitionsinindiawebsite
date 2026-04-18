import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { isAdminAuthorized } from "@/lib/adminAuth";

export const dynamic = 'force-dynamic';

const PAGE_SIZE = 25;

export async function GET(request) {
    if (!isAdminAuthorized(request)) {
        return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    try {
        const { searchParams } = new URL(request.url);
        const search = searchParams.get("search") || "";
        const role = searchParams.get("role") || "";
        const status = searchParams.get("status") || "";
        const sort = searchParams.get("sort") || "createdAt_desc";
        const page = Math.max(1, parseInt(searchParams.get("page") || "1"));

        const where = {
            ...(role && role !== "ALL" && { role: role.toUpperCase() }),
            ...(status === "SUSPENDED" && { isSuspended: true }),
            ...(status === "ACTIVE" && { isSuspended: false, isVerified: true }),
            ...(status === "PENDING" && { isSuspended: false, isVerified: false }),
            ...(search && {
                OR: [
                    { name: { contains: search, mode: "insensitive" } },
                    { phone: { contains: search } },
                    { email: { contains: search, mode: "insensitive" } }
                ]
            })
        };

        const sortMap = {
            "createdAt_desc": { createdAt: "desc" },
            "createdAt_asc":  { createdAt: "asc" },
            "name_asc":       { name: "asc" },
            "credits_desc":   { credits: "desc" },
            "tier":           { subscriptionTier: "desc" },
        };
        const orderBy = sortMap[sort] || { createdAt: "desc" };

        const [users, total] = await Promise.all([
            prisma.user.findMany({
                where,
                select: {
                    id: true, name: true, email: true, phone: true, role: true,
                    isVerified: true, isSuspended: true, credits: true,
                    subscriptionTier: true, subscriptionStatus: true, createdAt: true,
                    _count: { select: { transactions: true, leadsPosted: true } }
                },
                orderBy,
                skip: (page - 1) * PAGE_SIZE,
                take: PAGE_SIZE,
            }),
            prisma.user.count({ where })
        ]);

        return NextResponse.json({ success: true, users, total, page, pages: Math.ceil(total / PAGE_SIZE) });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
