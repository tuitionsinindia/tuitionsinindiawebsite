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
        const showAll = searchParams.get("all") === "true";

        let where = {
            status: 'OPEN',
        };

        // If tutorId is provided and we are NOT specifically asking for 'all', 
        // we filter by tutor's preferred subjects/locations
        if (tutorId && !showAll && !subject && !location) {
            const tutorListing = await prisma.listing.findUnique({
                where: { tutorId },
                select: { subjects: true, locations: true, grades: true }
            });

            if (tutorListing) {
                const orConditions = [];
                
                if (tutorListing.subjects && tutorListing.subjects.length > 0) {
                    orConditions.push({
                        subject: { in: tutorListing.subjects, mode: 'insensitive' }
                    });
                    // Also support fuzzy matching for subjects
                    tutorListing.subjects.forEach(s => {
                        orConditions.push({ subject: { contains: s, mode: 'insensitive' } });
                    });
                }

                if (tutorListing.locations && tutorListing.locations.length > 0) {
                    tutorListing.locations.forEach(l => {
                        orConditions.push({ location: { contains: l, mode: 'insensitive' } });
                    });
                }

                if (orConditions.length > 0) {
                    where.OR = orConditions;
                }
            }
        }

        // Manual filters override intelligent matching or append to it
        if (subject) {
            where.subject = { contains: subject, mode: 'insensitive' };
        }
        if (location) {
            where.location = { contains: location, mode: 'insensitive' };
        }
        if (minBudget) {
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

        // Sanitize leads
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
