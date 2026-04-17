import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createNotifications } from "@/lib/notifications";
import { getSession } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export async function POST(request) {
    try {
        const session = getSession();
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { leadId, studentId, reason } = await request.json();

        // Verify the authenticated user is the student closing the lead
        if (session.id !== studentId && session.role !== "ADMIN") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        if (!leadId || !studentId) {
            return NextResponse.json({ error: "Missing Lead ID or Student ID" }, { status: 400 });
        }

        // Verify lead ownership
        const lead = await prisma.lead.findUnique({
            where: { id: leadId },
            select: { studentId: true, status: true }
        });

        if (!lead) {
            return NextResponse.json({ error: "Lead not found" }, { status: 404 });
        }

        if (lead.studentId !== studentId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        // Update lead status
        const updatedLead = await prisma.lead.update({
            where: { id: leadId },
            data: {
                status: reason === 'admin' ? 'CLOSED_ADMIN' : 'CLOSED_STUDENT'
            }
        });

        // Notify tutors who unlocked this lead that it's been closed
        const unlocks = await prisma.leadUnlock.findMany({
            where: { leadId },
            select: { tutorId: true },
        });
        const tutorIds = unlocks.map(u => u.tutorId);
        if (tutorIds.length > 0) {
            createNotifications(tutorIds, {
                type: "SYSTEM",
                title: "Requirement closed",
                body: "A student requirement you unlocked has been closed by the student.",
            });
        }

        return NextResponse.json({ success: true, status: updatedLead.status });

    } catch (error) {
        console.error("Error closing lead:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
