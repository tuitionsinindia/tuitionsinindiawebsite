import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { isAdminAuthorized } from "@/lib/adminAuth";

export const dynamic = 'force-dynamic';

export async function GET(request) {
    if (!isAdminAuthorized(request)) {
        return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    try {
        const now = new Date();
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        const [
            totalTutors,
            totalStudents,
            totalInstitutes,
            activeLeads,
            revenueAggregate,
            weeklyRevenueAgg,
            newUsersThisWeek,
            newUsersThisMonth,
            pendingBookingsCount,
            totalBookings,
            pendingTutors,
            recentTransactions,
            recentSignups,
        ] = await Promise.all([
            prisma.user.count({ where: { role: "TUTOR" } }),
            prisma.user.count({ where: { role: "STUDENT" } }),
            prisma.user.count({ where: { role: "INSTITUTE" } }),
            prisma.lead.count({ where: { status: "OPEN" } }),
            prisma.transaction.aggregate({ _sum: { amount: true }, where: { status: "SUCCESS" } }),
            prisma.transaction.aggregate({ _sum: { amount: true }, where: { status: "SUCCESS", createdAt: { gte: weekAgo } } }),
            prisma.user.count({ where: { createdAt: { gte: weekAgo } } }),
            prisma.user.count({ where: { createdAt: { gte: monthAgo } } }),
            prisma.trialBooking.count({ where: { status: "PENDING" } }).catch(() => 0),
            prisma.trialBooking.count().catch(() => 0),
            prisma.user.findMany({
                where: { role: "TUTOR", isVerified: false, isSuspended: false },
                select: { id: true, name: true, email: true, phone: true, createdAt: true,
                    tutorListing: { select: { subjects: true, location: true } } },
                take: 10,
                orderBy: { createdAt: "desc" },
            }),
            prisma.transaction.findMany({
                where: { status: "SUCCESS" },
                include: { user: { select: { name: true, email: true, role: true } } },
                take: 10,
                orderBy: { createdAt: "desc" },
            }),
            prisma.user.findMany({
                select: { id: true, name: true, email: true, phone: true, role: true,
                    subscriptionTier: true, createdAt: true },
                take: 8,
                orderBy: { createdAt: "desc" },
            }),
        ]);

        return NextResponse.json({
            success: true,
            metrics: {
                totalTutors,
                totalStudents,
                totalInstitutes,
                totalRevenue: revenueAggregate._sum.amount || 0,
                weeklyRevenue: weeklyRevenueAgg._sum.amount || 0,
                activeLeads,
                newUsersThisWeek,
                newUsersThisMonth,
                pendingBookings: pendingBookingsCount,
                totalBookings,
            },
            pendingTutors,
            recentTransactions,
            recentSignups,
        }, { status: 200 });

    } catch (error) {
        console.error("Failed to fetch admin metrics:", error);
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}
