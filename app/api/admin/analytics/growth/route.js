import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { isAdminAuthorized } from "@/lib/adminAuth";

export const dynamic = 'force-dynamic';

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

        const now = new Date();
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

        // Fetch users created in the date range to build daily signups
        const recentUsers = await prisma.user.findMany({
            where: { createdAt: { gte: since } },
            select: { role: true, createdAt: true },
        });

        // Build date map
        const dailyMap = {};
        for (let i = 0; i < days; i++) {
            const d = new Date(since);
            d.setDate(since.getDate() + i);
            const key = d.toISOString().slice(0, 10);
            dailyMap[key] = { date: key, tutors: 0, students: 0, institutes: 0 };
        }

        for (const user of recentUsers) {
            const key = user.createdAt.toISOString().slice(0, 10);
            if (!dailyMap[key]) continue;
            if (user.role === "TUTOR") dailyMap[key].tutors++;
            else if (user.role === "STUDENT") dailyMap[key].students++;
            else if (user.role === "INSTITUTE") dailyMap[key].institutes++;
        }

        const signupsByDay = Object.values(dailyMap);

        // Totals
        const [totalTutors, totalStudents, totalInstitutes] = await Promise.all([
            prisma.user.count({ where: { role: "TUTOR" } }),
            prisma.user.count({ where: { role: "STUDENT" } }),
            prisma.user.count({ where: { role: "INSTITUTE" } }),
        ]);

        // This month signups
        const [thisMonthTutors, thisMonthStudents, thisMonthInstitutes] = await Promise.all([
            prisma.user.count({ where: { role: "TUTOR", createdAt: { gte: monthStart } } }),
            prisma.user.count({ where: { role: "STUDENT", createdAt: { gte: monthStart } } }),
            prisma.user.count({ where: { role: "INSTITUTE", createdAt: { gte: monthStart } } }),
        ]);

        // Subscription and verification counts
        const [verifiedTutors, proTutors, eliteTutors] = await Promise.all([
            prisma.user.count({ where: { role: "TUTOR", isVerified: true } }),
            prisma.user.count({ where: { role: "TUTOR", subscriptionTier: "PRO" } }),
            prisma.user.count({ where: { role: "TUTOR", subscriptionTier: "ELITE" } }),
        ]);

        // Lead and booking counts
        const [activeLeads, totalLeadUnlocks, totalDemoBookings] = await Promise.all([
            prisma.lead.count({ where: { status: "OPEN" } }),
            prisma.leadUnlock.count(),
            prisma.trialBooking.count(),
        ]);

        // Conversion rates
        const tutorToProRate = totalTutors > 0 ? parseFloat((proTutors / totalTutors * 100).toFixed(1)) : 0;
        const tutorToEliteRate = totalTutors > 0 ? parseFloat((eliteTutors / totalTutors * 100).toFixed(1)) : 0;
        const studentToLeadRate = totalStudents > 0 ? parseFloat((totalLeadUnlocks / totalStudents * 100).toFixed(1)) : 0;

        return NextResponse.json({
            signupsByDay,
            totals: { tutors: totalTutors, students: totalStudents, institutes: totalInstitutes },
            thisMonth: { tutors: thisMonthTutors, students: thisMonthStudents, institutes: thisMonthInstitutes },
            verifiedTutors,
            proTutors,
            eliteTutors,
            activeLeads,
            totalLeadUnlocks,
            totalDemoBookings,
            conversionRates: {
                tutorToPro: tutorToProRate,
                tutorToElite: tutorToEliteRate,
                studentToLead: studentToLeadRate,
            },
        });
    } catch (error) {
        console.error("Admin growth analytics error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
