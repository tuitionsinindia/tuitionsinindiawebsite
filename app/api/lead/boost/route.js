import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

// POST /api/lead/boost — upgrade a lead's premium tier after payment
export async function POST(request) {
    try {
        const { leadId, studentId, premiumTier } = await request.json();

        if (!leadId || !studentId || premiumTier === undefined) {
            return NextResponse.json({ error: "leadId, studentId, and premiumTier required" }, { status: 400 });
        }

        // Verify ownership
        const lead = await prisma.lead.findUnique({
            where: { id: leadId },
            select: { studentId: true },
        });

        if (!lead || lead.studentId !== studentId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const updated = await prisma.lead.update({
            where: { id: leadId },
            data: { isPremium: premiumTier > 0, premiumTier },
        });

        return NextResponse.json({ success: true, lead: updated });
    } catch (error) {
        console.error("Lead boost error:", error);
        return NextResponse.json({ error: "Failed to boost lead" }, { status: 500 });
    }
}
