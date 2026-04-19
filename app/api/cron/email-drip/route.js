import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import {
    sendStudentDay3Email, sendStudentDay7Email,
    sendTutorDay1Email, sendTutorDay3Email, sendTutorDay7Email,
    sendReEngagementEmail,
} from "@/lib/email";

/**
 * Cron endpoint — run daily to send drip email sequences.
 * Protects with CRON_SECRET so only authorized calls can trigger it.
 *
 * Sequences:
 *   Day 3 — Student: "How TuitionsInIndia Works"
 *   Day 3 — Tutor:   "Tips to Get More Students"
 *   Day 7 — Student: "Top Tutors Near You"
 *   Day 7 — Tutor:   "Your First Contact is Free / Upgrade"
 *   Day 14+ inactive — Re-engagement
 */
export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const secret = searchParams.get("secret");

    if (secret !== process.env.CRON_SECRET) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const now = new Date();
    const day1Ago = new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000);
    const day1Window = new Date(day1Ago.getTime() - 24 * 60 * 60 * 1000); // 1–2 days ago
    const day3Ago = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
    const day3Window = new Date(day3Ago.getTime() - 24 * 60 * 60 * 1000); // 3–4 days ago
    const day7Ago = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const day7Window = new Date(day7Ago.getTime() - 24 * 60 * 60 * 1000); // 7–8 days ago
    const day14Ago = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    let sent = { day1Tutor: 0, day3Student: 0, day3Tutor: 0, day7Student: 0, day7Tutor: 0, reEngagement: 0 };

    try {
        // Helper to check if user has unsubscribed from marketing emails
        const isUnsubscribed = (prefs) => {
            try { return (typeof prefs === "string" ? JSON.parse(prefs) : prefs)?.unsubscribed === true; }
            catch { return false; }
        };

        // ── Day 1 Tutors — only those who haven't completed profile ─────
        const day1Tutors = await prisma.user.findMany({
            where: {
                role: "TUTOR",
                email: { not: null },
                createdAt: { gte: day1Window, lte: day1Ago },
                isProfileComplete: false,
            },
            select: { id: true, email: true, name: true, notificationPrefs: true },
            take: 100,
        });
        for (const u of day1Tutors) {
            if (u.email && !isUnsubscribed(u.notificationPrefs)) {
                await sendTutorDay1Email(u.email, u.name || "Tutor", u.id);
                sent.day1Tutor++;
            }
        }

        // ── Day 3 Students ───────────────────────────────────────────────
        const day3Students = await prisma.user.findMany({
            where: {
                role: "STUDENT",
                email: { not: null },
                createdAt: { gte: day3Window, lte: day3Ago },
            },
            select: { id: true, email: true, name: true, notificationPrefs: true },
            take: 100,
        });
        for (const u of day3Students) {
            if (u.email && !isUnsubscribed(u.notificationPrefs)) {
                await sendStudentDay3Email(u.email, u.name || "Student", u.id);
                sent.day3Student++;
            }
        }

        // ── Day 3 Tutors ─────────────────────────────────────────────────
        const day3Tutors = await prisma.user.findMany({
            where: {
                role: "TUTOR",
                email: { not: null },
                createdAt: { gte: day3Window, lte: day3Ago },
            },
            select: { id: true, email: true, name: true, notificationPrefs: true },
            take: 100,
        });
        for (const u of day3Tutors) {
            if (u.email && !isUnsubscribed(u.notificationPrefs)) {
                await sendTutorDay3Email(u.email, u.name || "Tutor", u.id);
                sent.day3Tutor++;
            }
        }

        // ── Day 7 Students ───────────────────────────────────────────────
        const tutorCount = await prisma.listing.count({ where: { isActive: true } });
        const day7Students = await prisma.user.findMany({
            where: {
                role: "STUDENT",
                email: { not: null },
                createdAt: { gte: day7Window, lte: day7Ago },
            },
            select: { id: true, email: true, name: true, notificationPrefs: true },
            take: 100,
        });
        for (const u of day7Students) {
            if (u.email && !isUnsubscribed(u.notificationPrefs)) {
                await sendStudentDay7Email(u.email, u.name || "Student", tutorCount, u.id);
                sent.day7Student++;
            }
        }

        // ── Day 7 Tutors ─────────────────────────────────────────────────
        const day7Tutors = await prisma.user.findMany({
            where: {
                role: "TUTOR",
                email: { not: null },
                createdAt: { gte: day7Window, lte: day7Ago },
            },
            select: { id: true, email: true, name: true, notificationPrefs: true },
            take: 100,
        });
        for (const u of day7Tutors) {
            if (u.email && !isUnsubscribed(u.notificationPrefs)) {
                await sendTutorDay7Email(u.email, u.name || "Tutor", u.id);
                sent.day7Tutor++;
            }
        }

        // ── Daily housekeeping: downgrade expired complimentary PRO ─────
        // First-500 tutors got 30-day complimentary PRO at signup. Once that
        // window passes, return them to FREE so PRO truly is paid-tier.
        const expiredPro = await prisma.user.updateMany({
            where: {
                role: "TUTOR",
                proGrantedUntil: { not: null, lte: now },
                subscriptionTier: "PRO",
            },
            data: {
                subscriptionTier: "FREE",
                subscriptionStatus: "INACTIVE",
                proGrantedUntil: null,
            },
        });
        sent.expiredProDowngrades = expiredPro.count;

        // ── 14-day Re-engagement (students who haven't had activity) ─────
        const inactiveStudents = await prisma.user.findMany({
            where: {
                role: "STUDENT",
                email: { not: null },
                updatedAt: { lte: day14Ago },
                createdAt: { lte: day14Ago },
            },
            select: { id: true, email: true, name: true, notificationPrefs: true },
            take: 50,
        });
        for (const u of inactiveStudents) {
            if (!u.email || isUnsubscribed(u.notificationPrefs)) continue;
            const newTutors = await prisma.listing.count({
                where: { isActive: true, createdAt: { gte: day14Ago } },
            });
            if (newTutors > 0) {
                await sendReEngagementEmail(u.email, u.name || "Student", newTutors, u.id);
                sent.reEngagement++;
            }
        }

        return NextResponse.json({ success: true, sent });
    } catch (err) {
        console.error("Email drip cron error:", err);
        return NextResponse.json({ error: "Failed", details: err.message }, { status: 500 });
    }
}
