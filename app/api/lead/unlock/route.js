import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createNotification } from "@/lib/notifications";
import { sendTutorUnlockedEmail } from "@/lib/email";
import { getSession } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rateLimit";

export const dynamic = 'force-dynamic';

export async function POST(request) {
    try {
        const session = getSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { limited } = checkRateLimit(request, "lead-unlock", 20, 60000);
        if (limited) {
            return NextResponse.json({ error: "Too many requests. Please wait a moment." }, { status: 429 });
        }

        const { leadId, tutorId } = await request.json();

        if (!leadId || !tutorId) {
            return NextResponse.json({ error: "Missing Lead ID or Tutor ID" }, { status: 400 });
        }

        // Verify the authenticated user is the tutor making the request
        if (session.id !== tutorId) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        // 1. Pre-transaction validation (outside $transaction to safely return responses)
        const existingUnlock = await prisma.leadUnlock.findUnique({
            where: { leadId_tutorId: { leadId, tutorId } },
        });
        if (existingUnlock) {
            return NextResponse.json({ error: "Lead already unlocked" }, { status: 400 });
        }

        const tutor = await prisma.user.findUnique({
            where: { id: tutorId },
            select: { credits: true },
        });

        const lead = await prisma.lead.findUnique({
            where: { id: leadId },
            select: { unlockCount: true, maxUnlocks: true, status: true, premiumTier: true, studentId: true, subjects: true },
        });

        if (!lead || ["CLOSED", "CLOSED_STUDENT", "CLOSED_ADMIN"].includes(lead.status) || lead.unlockCount >= lead.maxUnlocks) {
            return NextResponse.json({ error: "Lead is no longer available" }, { status: 410 });
        }

        const creditCost = lead.premiumTier === 2 ? 3 : lead.premiumTier === 1 ? 2 : 1;

        if (!tutor || tutor.credits < creditCost) {
            return NextResponse.json({
                error: `Insufficient credits. This lead requires ${creditCost} credit${creditCost > 1 ? "s" : ""}. Buy credits or upgrade your plan.`,
                upgradeRequired: true,
            }, { status: 403 });
        }

        // 2. Execute the transaction (all writes)
        await prisma.$transaction(async (tx) => {
            await tx.user.update({
                where: { id: tutorId },
                data: { credits: { decrement: creditCost } },
            });

            await tx.leadUnlock.create({
                data: { leadId, tutorId },
            });

            const updatedLead = await tx.lead.update({
                where: { id: leadId },
                data: { unlockCount: { increment: 1 } },
            });

            if (updatedLead.unlockCount >= updatedLead.maxUnlocks) {
                await tx.lead.update({
                    where: { id: leadId },
                    data: { status: "CLOSED" },
                });
            }
        });

        // 3. Non-blocking notifications (outside transaction)
        const subject = lead.subjects?.[0] || "your requirement";

        if (lead.studentId) {
            createNotification(lead.studentId, {
                type: "LEAD_UNLOCK",
                title: "A tutor is interested in your requirement",
                body: `A tutor has viewed your ${subject} requirement and may contact you soon.`,
            });

            // Email student
            prisma.user.findUnique({ where: { id: lead.studentId }, select: { email: true, name: true } })
                .then(student => {
                    if (student?.email) {
                        sendTutorUnlockedEmail(student.email, { name: student.name || "there" });
                    }
                }).catch(() => {});
        }

        createNotification(tutorId, {
            type: "LEAD_UNLOCK",
            title: "Lead unlocked successfully",
            body: `You've unlocked a ${subject} lead. ${creditCost} credit${creditCost > 1 ? "s" : ""} used. Check the student's contact details.`,
        });

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Error unlocking lead:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
