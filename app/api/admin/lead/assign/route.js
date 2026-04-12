import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request) {
    try {
        const { leadId, tutorId, adminId } = await request.json();

        if (!leadId || !tutorId || !adminId) {
            return NextResponse.json({ error: "Missing required identification metadata" }, { status: 400 });
        }

        // 1. Verify Admin Status
        const admin = await prisma.user.findUnique({
            where: { id: adminId },
            select: { role: true }
        });

        if (!admin || admin.role !== "ADMIN") {
            return NextResponse.json({ error: "Admin access required" }, { status: 403 });
        }

        // 2. Execute Admin Override Pair
        const result = await prisma.$transaction(async (tx) => {
            // Check if already unlocked
            const existing = await tx.leadUnlock.findUnique({
                where: { leadId_tutorId: { leadId, tutorId } }
            });

            if (existing) return { alreadyPaired: true };

            // Create Unlock (Admin Override: bypassing credit checks and maxUnlocks)
            await tx.leadUnlock.create({
                data: { leadId, tutorId }
            });

            // Increment lead count
            const updatedLead = await tx.lead.update({
                where: { id: leadId },
                data: { unlockCount: { increment: 1 } }
            });

            // Create Initial Chat Session to facilitate contact
            const session = await tx.chatSession.upsert({
                where: { studentId_tutorId: { studentId: updatedLead.studentId, tutorId } },
                update: {},
                create: { studentId: updatedLead.studentId, tutorId }
            });

            return { success: true, sessionId: session.id };
        });

        if (result.alreadyPaired) {
            return NextResponse.json({ error: "Tutor already assigned to this lead." }, { status: 400 });
        }

        return NextResponse.json({ 
            success: true, 
            message: "Tutor assigned to lead successfully.",
            sessionId: result.sessionId
        });

    } catch (err) {
        console.error("ADMIN_LEAD_ASSIGN_ERROR:", err);
        return NextResponse.json({ error: "Internal Server Error", details: err.message }, { status: 500 });
    }
}
