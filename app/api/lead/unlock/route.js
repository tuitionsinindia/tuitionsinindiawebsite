import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function POST(request) {
    try {
        const { leadId, tutorId } = await request.json();

        if (!leadId || !tutorId) {
            return NextResponse.json({ error: "Missing Lead ID or Tutor ID" }, { status: 400 });
        }

        // 1. Check if already unlocked
        const existingUnlock = await prisma.leadUnlock.findUnique({
            where: {
                leadId_tutorId: { leadId, tutorId }
            }
        });

        if (existingUnlock) {
            return NextResponse.json({ error: "Lead already unlocked" }, { status: 400 });
        }

        // 2. Start a transaction to deduct credits and create unlock
        return await prisma.$transaction(async (tx) => {
            const tutor = await tx.user.findUnique({
                where: { id: tutorId },
                select: { credits: true }
            });

            if (!tutor || tutor.credits < 1) {
                return NextResponse.json({ error: "Insufficient credits. Please top up." }, { status: 403 });
            }

            const lead = await tx.lead.findUnique({
                where: { id: leadId },
                select: { unlockCount: true, maxUnlocks: true, status: true }
            });

            if (!lead || lead.status === 'CLOSED' || lead.unlockCount >= lead.maxUnlocks) {
                return NextResponse.json({ error: "Lead is no longer available" }, { status: 410 });
            }

            // Deduct credit
            await tx.user.update({
                where: { id: tutorId },
                data: { credits: { decrement: 1 } }
            });

            // Create unlock record
            await tx.leadUnlock.create({
                data: { leadId, tutorId }
            });

            // Update lead unlock count
            const updatedLead = await tx.lead.update({
                where: { id: leadId },
                data: { unlockCount: { increment: 1 } }
            });

            // If max unlocks reached, close the lead
            if (updatedLead.unlockCount >= updatedLead.maxUnlocks) {
                await tx.lead.update({
                    where: { id: leadId },
                    data: { status: 'CLOSED' }
                });
            }

            return NextResponse.json({ success: true });
        });

    } catch (error) {
        console.error("Error unlocking lead:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
