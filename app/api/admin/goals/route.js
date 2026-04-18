import { NextResponse } from "next/server";
import { isAdminAuthorized } from "@/lib/adminAuth";
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET(request) {
    if (!isAdminAuthorized(request)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const goals = await prisma.platformGoal.findMany({
            where: { isActive: true },
            orderBy: { createdAt: "asc" },
        });

        // Fetch shared metrics for currentValue computation
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const [
            revenueAgg,
            tutorCount,
            studentCount,
            totalTutors,
            paidTutors,
        ] = await Promise.all([
            prisma.transaction.aggregate({
                where: { status: "SUCCESS", createdAt: { gte: startOfMonth } },
                _sum: { amount: true },
            }),
            prisma.user.count({ where: { role: "TUTOR" } }),
            prisma.user.count({ where: { role: "STUDENT" } }),
            prisma.user.count({ where: { role: "TUTOR" } }),
            prisma.user.count({
                where: {
                    role: "TUTOR",
                    subscriptionTier: { in: ["PRO", "ELITE"] },
                },
            }),
        ]);

        const revenueThisMonth = revenueAgg._sum.amount || 0;
        const proConversionRate = totalTutors > 0
            ? (paidTutors / totalTutors) * 100
            : 0;

        const goalsWithProgress = goals.map((goal) => {
            let currentValue = 0;
            switch (goal.category) {
                case "REVENUE":
                    currentValue = revenueThisMonth;
                    break;
                case "TUTORS":
                    currentValue = tutorCount;
                    break;
                case "STUDENTS":
                    currentValue = studentCount;
                    break;
                case "CONVERSIONS":
                    currentValue = proConversionRate;
                    break;
                default:
                    currentValue = 0;
            }
            const progressPercent = goal.targetValue > 0
                ? Math.min((currentValue / goal.targetValue) * 100, 100)
                : 0;
            return { ...goal, currentValue, progressPercent };
        });

        return NextResponse.json({ goals: goalsWithProgress });
    } catch (error) {
        console.error("GET /api/admin/goals error:", error);
        return NextResponse.json({ error: "Failed to fetch goals" }, { status: 500 });
    }
}

export async function POST(request) {
    if (!isAdminAuthorized(request)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { title, category, targetValue, deadline, notes } = await request.json();

        if (!title || !category || targetValue == null || !deadline) {
            return NextResponse.json({ error: "title, category, targetValue, and deadline are required" }, { status: 400 });
        }

        const goal = await prisma.platformGoal.create({
            data: {
                title,
                category,
                targetValue: Number(targetValue),
                deadline: new Date(deadline),
                notes: notes || null,
            },
        });

        return NextResponse.json({ goal }, { status: 201 });
    } catch (error) {
        console.error("POST /api/admin/goals error:", error);
        return NextResponse.json({ error: "Failed to create goal" }, { status: 500 });
    }
}

export async function PATCH(request) {
    if (!isAdminAuthorized(request)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { id, ...fields } = await request.json();

        if (!id) {
            return NextResponse.json({ error: "id is required" }, { status: 400 });
        }

        const updateData = { ...fields };
        if (updateData.deadline) updateData.deadline = new Date(updateData.deadline);
        if (updateData.targetValue != null) updateData.targetValue = Number(updateData.targetValue);

        const goal = await prisma.platformGoal.update({
            where: { id },
            data: updateData,
        });

        return NextResponse.json({ goal });
    } catch (error) {
        console.error("PATCH /api/admin/goals error:", error);
        return NextResponse.json({ error: "Failed to update goal" }, { status: 500 });
    }
}

export async function DELETE(request) {
    if (!isAdminAuthorized(request)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { id } = await request.json();

        if (!id) {
            return NextResponse.json({ error: "id is required" }, { status: 400 });
        }

        await prisma.platformGoal.delete({ where: { id } });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("DELETE /api/admin/goals error:", error);
        return NextResponse.json({ error: "Failed to delete goal" }, { status: 500 });
    }
}
