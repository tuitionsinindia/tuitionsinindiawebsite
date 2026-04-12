import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { calculateMatchScore } from "@/lib/matchEngine";

export const dynamic = 'force-dynamic';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("id");
        const role = searchParams.get("role");

        if (!userId || !role) {
            return NextResponse.json({ error: "Missing identity parameters" }, { status: 400 });
        }

        if (role === 'STUDENT') {
            // 1. Get student's active leads to extract subjects/locations
            const studentLeads = await prisma.lead.findMany({
                where: { studentId: userId },
                select: { subjects: true, locations: true }
            });

            // Normalize to uppercase for case-insensitive matching (Listings store uppercase)
            const uniqueSubjects = [...new Set(studentLeads.flatMap(l => l.subjects))];
            const uniqueLocations = [...new Set(studentLeads.flatMap(l => l.locations))];
            const subjectsUpper = uniqueSubjects.map(s => s.toUpperCase());
            const subjectsLower = uniqueSubjects.map(s => s.toLowerCase());
            const subjectsBoth = [...new Set([...uniqueSubjects, ...subjectsUpper, ...subjectsLower])];

            // 2. Find listings that match these subjects (try all case variants)
            const listings = await prisma.listing.findMany({
                where: {
                    subjects: { hasSome: subjectsBoth },
                    isActive: true
                },
                include: {
                    tutor: {
                        select: {
                            id: true,
                            name: true,
                            image: true,
                            role: true,
                            subscriptionTier: true,
                            isVerified: true
                            // Phone and Email removed; use LeadUnlock for PII exchange
                        }
                    }
                }
            });

            // Build a combined criterion from all student leads
            const criterion = {
                subjects: uniqueSubjects,
                locations: uniqueLocations,
                modes: [...new Set(studentLeads.flatMap(l => l.modes || []))],
            };

            // Calculate match scores and sort by best match
            const matches = listings.map(l => {
                const { score, label, factors } = calculateMatchScore(criterion, {
                    subjects: l.subjects,
                    locations: l.locations,
                    teachingModes: l.teachingModes,
                    lat: l.tutor?.lat, lng: l.tutor?.lng,
                    type: l.type, isInstitute: l.isInstitute,
                    isVerified: l.tutor?.isVerified, rating: l.rating,
                    maxSeats: l.maxSeats, enrolledCount: l.enrolledCount,
                });
                return {
                    ...l.tutor,
                    matchScore: score,
                    matchLabel: label,
                    matchFactors: factors,
                    tutorListing: {
                        id: l.id,
                        subjects: l.subjects,
                        hourlyRate: l.hourlyRate,
                        bio: l.bio,
                        type: l.type,
                        isInstitute: l.isInstitute,
                        rating: l.rating,
                        experience: l.experience,
                    },
                };
            }).sort((a, b) => b.matchScore - a.matchScore);

            return NextResponse.json(matches);
        } else {
            // Educators (TUTOR/INSTITUTE) - Find leads matching their listing
            const tutorListing = await prisma.listing.findUnique({
                where: { tutorId: userId },
                select: { subjects: true, locations: true }
            });

            if (!tutorListing) return NextResponse.json([]);

            const leads = await prisma.lead.findMany({
                where: {
                    subjects: { hasSome: tutorListing.subjects },
                    status: 'OPEN'
                },
                include: {
                    student: {
                        select: { name: true, image: true }
                    }
                }
            });

            return NextResponse.json(leads);
        }
    } catch (error) {
        console.error("Matching engine error:", error);
        return NextResponse.json({ error: "Internal Matching Failure" }, { status: 500 });
    }
}
