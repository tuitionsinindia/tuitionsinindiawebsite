import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const tutorId = searchParams.get("tutorId");
        const subject = searchParams.get("subject");
        const location = searchParams.get("location");
        const minBudget = searchParams.get("minBudget");

        const where = {
            status: 'OPEN',
        };

        if (subject) {
            where.subject = { contains: subject, mode: 'insensitive' };
        }
        if (location) {
            where.location = { contains: location, mode: 'insensitive' };
        }
        if (minBudget) {
            // Note: budget is currently a string in schema (e.g., "500/hr"). 
            // For real filtering, it should be numeric. We'll do a simple contains for now
            // or assume the user wants to see leads WITH a certain budget.
            where.budget = { contains: minBudget };
        }

        const leads = await prisma.lead.findMany({
            where,
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
