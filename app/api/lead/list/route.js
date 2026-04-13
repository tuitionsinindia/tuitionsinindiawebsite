import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { calculateMatchScore } from "@/lib/matchEngine";

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
        // we filter by tutor's preferred subjects/locations using array overlap
        if (tutorId && !showAll && !subject && !location) {
            const tutorListing = await prisma.listing.findUnique({
                where: { tutorId },
                select: { subjects: true, locations: true, grades: true }
            });

            if (tutorListing) {
                const orConditions = [];
                
                if (tutorListing.subjects && tutorListing.subjects.length > 0) {
                    orConditions.push({
                        subjects: { hasSome: tutorListing.subjects }
                    });
                }

                if (tutorListing.locations && tutorListing.locations.length > 0) {
                    orConditions.push({
                        locations: { hasSome: tutorListing.locations }
                    });
                }

                if (orConditions.length > 0) {
                    where.OR = orConditions;
                }
            }
        }

        // Manual filters override intelligent matching or append to it
        if (subject) {
            where.subjects = { hasSome: [subject.toUpperCase()] };
        }
        if (location) {
            where.locations = { hasSome: [location.toUpperCase()] };
        }
        if (minBudget) {
            where.budget = { gte: parseInt(minBudget) };
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

        // Fetch tutor info for premium check and match calculation
        const requester = tutorId ? await prisma.user.findUnique({ 
            where: { id: tutorId }, 
            include: { tutorListing: true } 
        }) : null;
        
        const isPremiumTutor = ['PRO', 'ELITE', 'INSTITUTE'].includes(requester?.subscriptionTier);

        const requesterCriterion = requester?.tutorListing ? {
            subjects: requester.tutorListing.subjects,
            grades: requester.tutorListing.grades,
            locations: requester.tutorListing.locations,
            modes: requester.tutorListing.teachingModes || [],
            lat: requester.lat,
            lng: requester.lng
        } : null;

        // Sanitize leads and inject match scores
        const sanitizedLeads = leads.map(lead => {
            const isUnlockedByCredit = lead.unlockedBy.length > 0;
            const isUnlocked = isUnlockedByCredit || isPremiumTutor;

            let match = { score: 0, label: "Analyzing...", factors: [] };
            if (requesterCriterion) {
                match = calculateMatchScore(requesterCriterion, {
                    subjects: lead.subjects,
                    grades: lead.grades,
                    locations: lead.locations,
                    teachingModes: lead.mode ? [lead.mode] : ["BOTH"],
                    lat: lead.lat,
                    lng: lead.lng
                });
            }

            return {
                ...lead,
                student: isUnlocked ? lead.student : { name: "Hidden", phone: "Hidden", email: "Hidden" },
                isUnlocked,
                matchScore: match.score,
                matchLabel: match.label,
                matchFactors: match.factors
            };
        });

        // Sort by matchScore descending
        sanitizedLeads.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));

        return NextResponse.json(sanitizedLeads);
    } catch (error) {
        console.error("Error fetching leads:", error);
        return NextResponse.json({ error: "Failed to fetch leads" }, { status: 500 });
    }
}
