import { NextResponse } from "next/server";
import { isAdminAuthorized } from "@/lib/adminAuth";
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

function getCurrentMonthStr() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    return `${year}-${month}`;
}

async function getRevenueForMonth(monthStr) {
    // monthStr is like "2026-04"
    const [year, month] = monthStr.split("-").map(Number);
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 1);

    const agg = await prisma.transaction.aggregate({
        where: {
            status: "SUCCESS",
            createdAt: { gte: start, lt: end },
        },
        _sum: { amount: true },
    });
    return agg._sum.amount || 0;
}

export async function GET(request) {
    if (!isAdminAuthorized(request)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(request.url);
        const monthParam = searchParams.get("month");
        const currentMonthStr = getCurrentMonthStr();

        // If a specific month is requested, return just that month
        if (monthParam) {
            let budget = await prisma.monthlyBudget.findUnique({
                where: { month: monthParam },
            });

            if (!budget) {
                budget = await prisma.monthlyBudget.create({
                    data: { month: monthParam, totalBudget: 0, adSpend: 0 },
                });
            }

            const revenueThisMonth = await getRevenueForMonth(monthParam);
            const roi = budget.adSpend > 0 ? revenueThisMonth / budget.adSpend : null;

            return NextResponse.json({
                budget: { ...budget, revenueThisMonth, roi },
            });
        }

        // Return all budgets + ensure current month exists
        const budgets = await prisma.monthlyBudget.findMany({
            orderBy: { month: "desc" },
        });

        // Auto-create current month if missing
        let currentMonthBudget = budgets.find((b) => b.month === currentMonthStr);
        if (!currentMonthBudget) {
            currentMonthBudget = await prisma.monthlyBudget.create({
                data: { month: currentMonthStr, totalBudget: 0, adSpend: 0 },
            });
            budgets.unshift(currentMonthBudget);
        }

        const revenueThisMonth = await getRevenueForMonth(currentMonthStr);
        const roi = currentMonthBudget.adSpend > 0
            ? revenueThisMonth / currentMonthBudget.adSpend
            : null;

        return NextResponse.json({
            budgets,
            currentMonth: { ...currentMonthBudget, roi, revenueThisMonth },
        });
    } catch (error) {
        console.error("GET /api/admin/budget error:", error);
        return NextResponse.json({ error: "Failed to fetch budgets" }, { status: 500 });
    }
}

export async function POST(request) {
    if (!isAdminAuthorized(request)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { month, totalBudget, adSpend, breakdown, notes } = await request.json();

        if (!month) {
            return NextResponse.json({ error: "month is required" }, { status: 400 });
        }

        const budget = await prisma.monthlyBudget.upsert({
            where: { month },
            update: {
                ...(totalBudget != null && { totalBudget: Number(totalBudget) }),
                ...(adSpend != null && { adSpend: Number(adSpend) }),
                ...(breakdown !== undefined && { breakdown }),
                ...(notes !== undefined && { notes }),
            },
            create: {
                month,
                totalBudget: totalBudget != null ? Number(totalBudget) : 0,
                adSpend: adSpend != null ? Number(adSpend) : 0,
                breakdown: breakdown || null,
                notes: notes || null,
            },
        });

        return NextResponse.json({ budget });
    } catch (error) {
        console.error("POST /api/admin/budget error:", error);
        return NextResponse.json({ error: "Failed to upsert budget" }, { status: 500 });
    }
}

export async function PATCH(request) {
    if (!isAdminAuthorized(request)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { month, totalBudget, adSpend, breakdown, notes } = await request.json();

        if (!month) {
            return NextResponse.json({ error: "month is required" }, { status: 400 });
        }

        const budget = await prisma.monthlyBudget.upsert({
            where: { month },
            update: {
                ...(totalBudget != null && { totalBudget: Number(totalBudget) }),
                ...(adSpend != null && { adSpend: Number(adSpend) }),
                ...(breakdown !== undefined && { breakdown }),
                ...(notes !== undefined && { notes }),
            },
            create: {
                month,
                totalBudget: totalBudget != null ? Number(totalBudget) : 0,
                adSpend: adSpend != null ? Number(adSpend) : 0,
                breakdown: breakdown || null,
                notes: notes || null,
            },
        });

        return NextResponse.json({ budget });
    } catch (error) {
        console.error("PATCH /api/admin/budget error:", error);
        return NextResponse.json({ error: "Failed to upsert budget" }, { status: 500 });
    }
}
