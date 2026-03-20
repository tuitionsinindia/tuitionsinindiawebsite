import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function POST(request) {
    try {
        const { leadId, studentId, reason } = await request.json();

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

        return NextResponse.json({ success: true, status: updatedLead.status });

    } catch (error) {
        console.error("Error closing lead:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
