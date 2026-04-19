import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendWeeklyTutorDigestEmail, sendWeeklyStudentDigestEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

// Runs weekly (scheduled via cron on the VPS). Sends:
//   - To TUTORs: a digest of new leads matching their subjects + their credit/unlocks stats
//   - To STUDENTs: new tutors matching their most-recent open requirement
// Secured by x-cron-key header (AUDIT_SEED_KEY).
export async function POST(request) {
    const cronKey = request.headers.get("x-cron-key");
    if (!cronKey || cronKey !== process.env.AUDIT_SEED_KEY) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const isUnsubscribed = (prefs) => {
        try { return (typeof prefs === "string" ? JSON.parse(prefs) : prefs)?.unsubscribed === true; }
        catch { return false; }
    };

    let sent = { tutorDigests: 0, studentDigests: 0, skipped: 0, errored: 0 };

    try {
        // ─── Tutor digests ────────────────────────────────────────────
        const tutors = await prisma.user.findMany({
            where: { role: "TUTOR", email: { not: null }, isProfileComplete: true },
            select: {
                id: true, email: true, name: true, credits: true, notificationPrefs: true,
                tutorListing: { select: { subjects: true, locations: true } },
            },
            take: 500,
        });

        for (const tutor of tutors) {
            if (!tutor.email || isUnsubscribed(tutor.notificationPrefs)) { sent.skipped++; continue; }

            const subjects = tutor.tutorListing?.subjects || [];
            const locations = tutor.tutorListing?.locations || [];

            // Count leads posted in the last 7 days matching this tutor's subjects or locations.
            const matchingLeads = subjects.length > 0 || locations.length > 0
                ? await prisma.lead.findMany({
                    where: {
                        status: "OPEN",
                        createdAt: { gte: sevenDaysAgo },
                        OR: [
                            subjects.length > 0 ? { subjects: { hasSome: subjects } } : undefined,
                            locations.length > 0 ? { locations: { hasSome: locations } } : undefined,
                        ].filter(Boolean),
                    },
                    select: { subjects: true, locations: true, budget: true },
                    take: 20,
                })
                : [];

            const unlocks = await prisma.leadUnlock.count({
                where: { userId: tutor.id, createdAt: { gte: sevenDaysAgo } },
            }).catch(() => 0);

            if (matchingLeads.length === 0 && unlocks === 0) { sent.skipped++; continue; }

            try {
                await sendWeeklyTutorDigestEmail(tutor.email, tutor.name, {
                    newLeads: matchingLeads.length,
                    unlocksUsed: unlocks,
                    creditsRemaining: tutor.credits || 0,
                    topLeads: matchingLeads.slice(0, 3).map(l => ({
                        subject: l.subjects?.[0],
                        location: l.locations?.[0],
                        budget: l.budget,
                    })),
                }, tutor.id);
                sent.tutorDigests++;
            } catch {
                sent.errored++;
            }
        }

        // ─── Student digests ──────────────────────────────────────────
        // Find students with at least one recent open lead, then count new tutors
        // in that subject/location over the past week.
        const recentStudentLeads = await prisma.lead.findMany({
            where: {
                status: "OPEN",
                createdAt: { gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) }, // last 30 days
            },
            select: {
                student: { select: { id: true, email: true, name: true, notificationPrefs: true } },
                subjects: true,
                locations: true,
            },
            distinct: ["studentId"],
            take: 500,
        });

        for (const lead of recentStudentLeads) {
            const student = lead.student;
            if (!student?.email || isUnsubscribed(student.notificationPrefs)) { sent.skipped++; continue; }

            const subject = lead.subjects?.[0];
            const location = lead.locations?.[0];

            const newTutors = await prisma.listing.count({
                where: {
                    isActive: true,
                    createdAt: { gte: sevenDaysAgo },
                    ...(subject ? { subjects: { hasSome: [subject] } } : {}),
                    ...(location ? { locations: { hasSome: [location] } } : {}),
                },
            }).catch(() => 0);

            if (newTutors === 0) { sent.skipped++; continue; }

            try {
                await sendWeeklyStudentDigestEmail(student.email, student.name, {
                    newTutors,
                    subject,
                    location,
                }, student.id);
                sent.studentDigests++;
            } catch {
                sent.errored++;
            }
        }

        return NextResponse.json({ success: true, sent });
    } catch (err) {
        console.error("Weekly digest cron error:", err);
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}
