import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const tutorId = searchParams.get("tutorId");

        const leads = await prisma.lead.findMany({
            where: {
                status: 'OPEN',
            },
            include: {
                unlockedBy: {
                    where: {
                        tutorId: tutorId || undefined,
                    }
                },
                student: {
                    select: {
                        name: true,
                        phone: true,
                        email: true,
                    }
                }
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        // Sanitize leads: students' contact info should only be visible if unlockedBy contains the current tutor
        const sanitizedLeads = leads.map(lead => {
            const isUnlocked = lead.unlockedBy.length > 0;
            return {
                ...lead,
                student: isUnlocked ? lead.student : { name: "Hidden", phone: "Hidden", email: "Hidden" },
                isUnlocked,
            };
        });

        return NextResponse.json(sanitizedLeads);
    } catch (error) {
        console.error("Error fetching leads:", error);
        return NextResponse.json({ error: "Failed to fetch leads" }, { status: 500 });
    }
}
