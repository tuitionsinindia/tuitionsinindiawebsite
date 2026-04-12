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
                    // Include both original and lowercase variants for case-insensitive matching
                    const subjectVariants = [...new Set([
                        ...tutorListing.subjects,
                        ...tutorListing.subjects.map(s => s.toLowerCase()),
                        ...tutorListing.subjects.map(s => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()),
                    ])];
                    orConditions.push({ subjects: { hasSome: subjectVariants } });
                }

                if (tutorListing.locations && tutorListing.locations.length > 0) {
                    const locationVariants = [...new Set([
                        ...tutorListing.locations,
                        ...tutorListing.locations.map(l => l.toLowerCase()),
                        ...tutorListing.locations.map(l => l.charAt(0).toUpperCase() + l.slice(1).toLowerCase()),
                    ])];
                    orConditions.push({ locations: { hasSome: locationVariants } });
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

        // Fetch tutor info for match scoring and premium check
        let tutorListing = null;
        let requester = null;
        if (tutorId) {
            [tutorListing, requester] = await Promise.all([
                prisma.listing.findUnique({ where: { tutorId }, select: { subjects: true, locations: true, teachingModes: true, type: true, isInstitute: true } }),
                prisma.user.findUnique({ where: { id: tutorId }, select: { subscriptionTier: true, isVerified: true, lat: true, lng: true } }),
            ]);
        }
        const isPremiumTutor = ['PRO', 'ELITE', 'INSTITUTE'].includes(requester?.subscriptionTier);

        // Sanitize leads and add match scores
        const sanitizedLeads = leads.map(lead => {
            const isUnlockedByCredit = lead.unlockedBy.length > 0;
            const isUnlocked = isUnlockedByCredit || isPremiumTutor;

            // Calculate match score if tutor listing exists
            let matchScore = 0, matchLabel = "Partial Match", matchFactors = [];
            if (tutorListing) {
                const result = calculateMatchScore(
                    { subjects: tutorListing.subjects, locations: tutorListing.locations, modes: tutorListing.teachingModes, lat: requester?.lat, lng: requester?.lng },
                    { subjects: lead.subjects, locations: lead.locations, teachingModes: lead.modes, type: lead.type }
                );
                matchScore = result.score;
                matchLabel = result.label;
                matchFactors = result.factors;
            }

            return {
                ...lead,
                student: isUnlocked ? lead.student : { name: "Hidden", phone: "Hidden", email: "Hidden" },
                isUnlocked,
                matchScore,
                matchLabel,
                matchFactors,
            };
        }).sort((a, b) => b.matchScore - a.matchScore);

        return NextResponse.json(sanitizedLeads);
    } catch (error) {
        console.error("Error fetching leads:", error);
        return NextResponse.json({ error: "Failed to fetch leads" }, { status: 500 });
    }
}
