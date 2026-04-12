import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { isAdminAuthorized } from "@/lib/adminAuth";

export const dynamic = 'force-dynamic';

export async function GET(request) {
    if (!isAdminAuthorized(request)) {
        return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    try {
        // 1. Fetch generic counts
        const totalTutors = await prisma.user.count({ where: { role: 'TUTOR' } });
        const totalStudents = await prisma.user.count({ where: { role: 'STUDENT' } });
        const activeLeads = await prisma.lead.count({ where: { status: 'OPEN' } });

        // 2. Fetch revenue (Sum of SUCCESS transactions)
        const revenueAggregate = await prisma.transaction.aggregate({
            _sum: {
                amount: true,
            },
            where: {
                status: 'SUCCESS',
            },
        });
        const totalRevenue = revenueAggregate._sum.amount || 0;

        // 3. Fetch recently pending tutors for approval
        const pendingTutors = await prisma.user.findMany({
            where: {
                role: 'TUTOR',
                isVerified: false,
            },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                createdAt: true,
                tutorListing: {
                    select: {
                        subjects: true,
                        locations: true
                    }
                }
            },
            take: 10,
            orderBy: { createdAt: 'desc' },
        });

        // 4. Fetch recent transactions
        const recentTransactions = await prisma.transaction.findMany({
            where: {
                status: 'SUCCESS',
            },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                        role: true,
                    }
                }
            },
            take: 10,
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json({
            success: true,
            metrics: {
                totalTutors,
                totalStudents,
                totalRevenue,
                activeLeads,
            },
            pendingTutors,
            recentTransactions
        }, { status: 200 });

    } catch (error) {
        console.error("Failed to fetch admin metrics:", error);
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}
