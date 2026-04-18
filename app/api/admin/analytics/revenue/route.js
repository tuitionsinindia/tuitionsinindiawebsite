import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { isAdminAuthorized } from "@/lib/adminAuth";

export const dynamic = 'force-dynamic';

function mapDescriptionToSource(description) {
    if (!description) return "other";
    const d = description.toLowerCase();
    if (d.includes("credit")) return "credit_pack";
    if (d.includes("pro") || d.includes("elite") || d.includes("subscription")) return "subscription";
    if (d.includes("verification")) return "verification";
    if (d.includes("demo") || d.includes("deposit") || d.includes("trial")) return "demo_deposit";
    if (d.includes("vip")) return "vip";
    return "other";
}

export async function GET(request) {
    if (!isAdminAuthorized(request)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(request.url);
        const days = Math.max(1, parseInt(searchParams.get("days") || "30"));

        const since = new Date();
        since.setDate(since.getDate() - days);
        since.setHours(0, 0, 0, 0);

        // Fetch all SUCCESS transactions in the date range
        const transactions = await prisma.transaction.findMany({
            where: {
                status: "SUCCESS",
                createdAt: { gte: since },
            },
            select: {
                amount: true,
                description: true,
                createdAt: true,
            },
        });

        // Build a map of date -> amount for the date range
        const dailyMap = {};
        for (let i = 0; i < days; i++) {
            const d = new Date(since);
            d.setDate(since.getDate() + i);
            const key = d.toISOString().slice(0, 10);
            dailyMap[key] = 0;
        }

        // Revenue by source
        const revenueBySource = {
            credit_pack: 0,
            subscription: 0,
            verification: 0,
            demo_deposit: 0,
            vip: 0,
            other: 0,
        };

        let totalRevenue = 0;

        for (const tx of transactions) {
            const key = tx.createdAt.toISOString().slice(0, 10);
            if (dailyMap[key] !== undefined) {
                dailyMap[key] += tx.amount;
            }
            const source = mapDescriptionToSource(tx.description);
            revenueBySource[source] += tx.amount;
            totalRevenue += tx.amount;
        }

        const revenueByDay = Object.entries(dailyMap).map(([date, amount]) => ({ date, amount }));

        // MRR: sum all SUCCESS transactions in the current calendar month
        const now = new Date();
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 1);

        const [thisMonthTxs, lastMonthTxs] = await Promise.all([
            prisma.transaction.aggregate({
                where: { status: "SUCCESS", createdAt: { gte: monthStart } },
                _sum: { amount: true },
            }),
            prisma.transaction.aggregate({
                where: { status: "SUCCESS", createdAt: { gte: lastMonthStart, lt: lastMonthEnd } },
                _sum: { amount: true },
            }),
        ]);

        const thisMonth = thisMonthTxs._sum.amount || 0;
        const lastMonth = lastMonthTxs._sum.amount || 0;
        const mrr = thisMonth;
        const growth = lastMonth > 0 ? parseFloat(((thisMonth - lastMonth) / lastMonth * 100).toFixed(1)) : 0;

        return NextResponse.json({
            revenueByDay,
            revenueBySource,
            totalRevenue,
            mrr,
            thisMonth,
            lastMonth,
            growth,
        });
    } catch (error) {
        console.error("Admin revenue analytics error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
