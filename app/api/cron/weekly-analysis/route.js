import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function POST(request) {
    const cronKey = request.headers.get("x-cron-key");
    if (!cronKey || cronKey !== process.env.AUDIT_SEED_KEY) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const now = new Date();
        const weekOf = now;

        // Date boundaries
        const thisWeekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const lastWeekStart = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
        const lastWeekEnd = thisWeekStart;

        // Fetch all metrics in parallel
        const [
            revenueThisWeekAgg,
            revenueLastWeekAgg,
            newTutorsThisWeek,
            newStudentsThisWeek,
            totalTutors,
            proTutors,
            eliteTutors,
            verifiedTutors,
            pendingVerifications,
            activeLeads,
            leadUnlocksThisWeek,
            demoBookingsThisWeek,
        ] = await Promise.all([
            prisma.transaction.aggregate({
                where: { status: "SUCCESS", createdAt: { gte: thisWeekStart } },
                _sum: { amount: true },
            }),
            prisma.transaction.aggregate({
                where: { status: "SUCCESS", createdAt: { gte: lastWeekStart, lt: lastWeekEnd } },
                _sum: { amount: true },
            }),
            prisma.user.count({ where: { role: "TUTOR", createdAt: { gte: thisWeekStart } } }),
            prisma.user.count({ where: { role: "STUDENT", createdAt: { gte: thisWeekStart } } }),
            prisma.user.count({ where: { role: "TUTOR" } }),
            prisma.user.count({ where: { role: "TUTOR", subscriptionTier: "PRO" } }),
            prisma.user.count({ where: { role: "TUTOR", subscriptionTier: "ELITE" } }),
            prisma.user.count({ where: { role: "TUTOR", isVerified: true } }),
            prisma.verificationRequest.count({ where: { status: "PENDING_REVIEW" } }),
            prisma.lead.count({ where: { status: "OPEN" } }),
            prisma.leadUnlock.count({ where: { unlockedAt: { gte: thisWeekStart } } }),
            prisma.trialBooking.count({ where: { createdAt: { gte: thisWeekStart } } }),
        ]);

        const revenueThisWeek = revenueThisWeekAgg._sum.amount || 0;
        const revenueLastWeek = revenueLastWeekAgg._sum.amount || 0;

        // Derived metrics
        const revenueGrowth = ((revenueThisWeek - revenueLastWeek) / Math.max(revenueLastWeek, 1)) * 100;
        const proConversionRate = (proTutors + eliteTutors) / Math.max(totalTutors, 1) * 100;
        const verificationRate = verifiedTutors / Math.max(totalTutors, 1) * 100;

        const insights = [];

        // Revenue rules
        if (revenueThisWeek === 0 && totalTutors > 20) {
            insights.push({
                category: "REVENUE",
                priority: "HIGH",
                title: "No revenue this week",
                body: "You had zero transactions this week despite having tutors on the platform. Check if payment flows are working and consider sending a targeted email to free tutors about upgrading.",
                action: "Send email to all free tutors from the Emails tab",
                metric: "weeklyRevenue",
                metricValue: 0,
            });
        } else if (revenueGrowth < -20) {
            insights.push({
                category: "REVENUE",
                priority: "HIGH",
                title: `Revenue dropped ${Math.abs(revenueGrowth).toFixed(0)}% this week`,
                body: `Weekly revenue fell from ₹${revenueLastWeek.toFixed(0)} to ₹${revenueThisWeek.toFixed(0)}. This could indicate payment failures or reduced activity. Check the Transactions tab for failed payments.`,
                action: "Review recent transactions for failed payments",
                metric: "revenueGrowthPct",
                metricValue: revenueGrowth,
            });
        } else if (revenueGrowth > 30) {
            insights.push({
                category: "REVENUE",
                priority: "LOW",
                title: `Strong week — revenue up ${revenueGrowth.toFixed(0)}%`,
                body: `Revenue grew ${revenueGrowth.toFixed(0)}% week-on-week to ₹${revenueThisWeek.toFixed(0)}. This is a good time to increase ad spend to accelerate growth.`,
                action: "Consider increasing Facebook/Google ad budget by 20-30%",
                metric: "revenueGrowthPct",
                metricValue: revenueGrowth,
            });
        }

        // Tutor acquisition rules
        if (newTutorsThisWeek < 5 && totalTutors < 500) {
            insights.push({
                category: "GROWTH",
                priority: "HIGH",
                title: "Tutor signups below target",
                body: `Only ${newTutorsThisWeek} new tutors signed up this week. To hit ₹2L/month revenue, you need 30–50 new tutors per week. Try posting in WhatsApp teacher groups and running Facebook ads targeting teachers aged 25–45 in Tier 1 cities.`,
                action: "Post in 5 WhatsApp teacher groups and boost Facebook ad budget",
                metric: "newTutorsThisWeek",
                metricValue: newTutorsThisWeek,
            });
        } else if (newTutorsThisWeek >= 20) {
            insights.push({
                category: "GROWTH",
                priority: "LOW",
                title: `Good tutor growth — ${newTutorsThisWeek} new tutors this week`,
                body: "Tutor acquisition is strong. Now focus on converting them to paid plans — send a verification push email and highlight Pro benefits.",
                action: "Send verification reminder email to all unverified tutors",
                metric: "newTutorsThisWeek",
                metricValue: newTutorsThisWeek,
            });
        }

        // Conversion rules
        if (proConversionRate < 8 && totalTutors > 30) {
            insights.push({
                category: "CONVERSION",
                priority: "MEDIUM",
                title: `Pro conversion at ${proConversionRate.toFixed(1)}% — target is 10%`,
                body: `Only ${proTutors + eliteTutors} of ${totalTutors} tutors are on a paid plan. Tutors upgrade when they see value — make sure they're unlocking leads and getting enquiries first. Consider an email campaign highlighting Pro benefits.`,
                action: "Send Pro upgrade email to tutors who have unlocked at least 1 lead",
                metric: "proConversionRate",
                metricValue: proConversionRate,
            });
        }

        if (verificationRate < 25 && totalTutors > 50) {
            insights.push({
                category: "CONVERSION",
                priority: "MEDIUM",
                title: `Verification rate at ${verificationRate.toFixed(1)}% — opportunity to earn more`,
                body: `Only ${verifiedTutors} of ${totalTutors} tutors are verified. Each verification is ₹999 revenue. Send a push email to unverified tutors explaining that verified profiles get 3x more student enquiries.`,
                action: "Send verification push email from the Emails tab → Unverified Tutors segment",
                metric: "verificationRate",
                metricValue: verificationRate,
            });
        }

        if (pendingVerifications > 5) {
            insights.push({
                category: "ALERT",
                priority: "HIGH",
                title: `${pendingVerifications} verification requests waiting for your review`,
                body: "Tutors are waiting for their verification to be approved. Delays reduce trust and can cause tutors to leave. Try to review within 2 working days.",
                action: "Go to Tutor Approvals and review pending verifications",
                metric: "pendingVerifications",
                metricValue: pendingVerifications,
            });
        }

        if (leadUnlocksThisWeek === 0 && totalTutors > 20) {
            insights.push({
                category: "CONVERSION",
                priority: "MEDIUM",
                title: "No lead unlocks this week",
                body: "Tutors aren't unlocking student contacts. This could mean they don't have enough credits, leads aren't relevant, or they don't know how to use the dashboard. Consider sending a tutorial email.",
                action: "Send a 'how to find students' email to all tutors",
                metric: "leadUnlocks",
                metricValue: 0,
            });
        }

        if (demoBookingsThisWeek === 0 && totalTutors > 30) {
            insights.push({
                category: "GROWTH",
                priority: "LOW",
                title: "No demo class bookings this week",
                body: "Students aren't booking demo classes. Make sure tutors have demo classes enabled in their settings, and check that the booking flow is working.",
                action: "Email tutors who haven't enabled demo classes to turn them on",
                metric: "demoBookings",
                metricValue: 0,
            });
        }

        // Save all insights to DB
        if (insights.length > 0) {
            await prisma.adminInsight.createMany({
                data: insights.map((i) => ({ ...i, weekOf })),
            });
        }

        return NextResponse.json({
            success: true,
            insightsGenerated: insights.length,
            metrics: {
                revenueThisWeek,
                newTutorsThisWeek,
                proConversionRate,
                verificationRate,
            },
        });
    } catch (error) {
        console.error("POST /api/cron/weekly-analysis error:", error);
        return NextResponse.json({ error: "Weekly analysis failed" }, { status: 500 });
    }
}
