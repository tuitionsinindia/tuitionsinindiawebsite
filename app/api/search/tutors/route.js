import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { calculateMatchScore } from "@/lib/matchEngine";

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const subject = searchParams.get("subject");
    const location = searchParams.get("location");
    const grade = searchParams.get("grade");
    const minRate = parseInt(searchParams.get("minRate")) || 0;
    const maxRate = parseInt(searchParams.get("maxRate")) || 100000;
    const sortBy = searchParams.get("sortBy") || "relevance";
    
    const lat = parseFloat(searchParams.get("lat"));
    const lng = parseFloat(searchParams.get("lng"));
    const radius = parseFloat(searchParams.get("radius") || "50");

    const role = (searchParams.get("role") || "TUTOR").toUpperCase();
    const gender = searchParams.get("gender");
    const experience = parseInt(searchParams.get("experience")) || 0;
    const teachingMode = searchParams.get("teachingMode");
    const board = searchParams.get("board");
    const timing = searchParams.get("timing");

    try {
        if (role === "STUDENT") {
            let where = { status: 'OPEN' }; 
            
            // Array-based intersection logic for Leads (Students)
            if (subject) {
                where.subjects = { hasSome: [subject, subject.toUpperCase(), subject.toLowerCase(), "Maths", "Mathematics"] };
            }
            if (grade) {
                where.grades = { hasSome: [grade, grade.toUpperCase()] };
            }
            if (location && !lat) {
                where.locations = { hasSome: [location, location.toUpperCase()] };
            }
            if (board) {
                where.boards = { hasSome: [board] };
            }
            if (timing) {
                where.timings = { hasSome: [timing] };
            }
            if (gender) {
                where.genderPreference = { in: [gender, "ANY"] };
            }

            let leads = await prisma.lead.findMany({
                where,
                include: { student: true },
                orderBy: [
                    { isPremium: 'desc' },
                    { createdAt: 'desc' }
                ],
                take: 100
            });

            if (lat && lng) {
                leads = leads.map(l => ({
                    ...l,
                    distance: (l.lat && l.lng) ? calculateDistance(lat, lng, l.lat, l.lng) : 9999
                }))
                .filter(l => l.distance <= radius);
            }

            return NextResponse.json(leads.map(l => {
                const searchCriterion = { 
                    subjects: subject ? [subject] : [], 
                    grades: grade ? [grade] : [], 
                    locations: location ? [location] : [],
                    lat, lng
                };
                const match = calculateMatchScore(searchCriterion, { 
                    subjects: l.subjects, 
                    grades: l.grades, 
                    locations: l.locations, 
                    lat: l.lat, lng: l.lng 
                });

                return {
                    id: l.id,
                    name: "Student Requirement",
                    subjects: l.subjects,
                    grades: l.grades,
                    locations: l.locations,
                    distance: l.distance,
                    rate: l.budget,
                    bio: l.description,
                    isPremium: l.isPremium,
                    createdAt: l.createdAt,
                    matchScore: match.score,
                    matchLabel: match.label,
                    matchFactors: match.factors
                };
            }));
        }

        // TUTOR / INSTITUTE SEARCH
        let where = { 
            role: { in: role === "INSTITUTE" ? ["INSTITUTE"] : ["TUTOR", "INSTITUTE"] },
            tutorListing: {
                isActive: true,
                hourlyRate: { gte: minRate, lte: maxRate }
            }
        };

        if (subject) {
            where.tutorListing.subjects = {
                hasSome: [subject, subject.toUpperCase(), subject.toLowerCase(), "Maths", "Mathematics"]
            };
        }

        if (grade) {
            where.tutorListing.grades = { hasSome: [grade, grade.toUpperCase()] };
        }

        if (location && !lat) {
            where.tutorListing.locations = { hasSome: [location, location.toUpperCase()] };
        }

        if (gender) {
            where.tutorListing.gender = gender;
        }

        if (experience) {
            where.tutorListing.experience = { gte: experience };
        }

        if (teachingMode) {
            where.tutorListing.teachingModes = { hasSome: [teachingMode] };
        }

        if (board) {
            where.tutorListing.boards = { hasSome: [board] };
        }

        if (timing) {
            where.tutorListing.timings = { hasSome: [timing] };
        }

        let tutors = await prisma.user.findMany({
            where,
            include: { tutorListing: true },
            take: 100
        });

        tutors = tutors
            .map(tutor => {
                const distance = (tutor.lat && tutor.lng) ? calculateDistance(lat, lng, tutor.lat, tutor.lng) : 9999;
                return { ...tutor, distance };
            })
            .filter(tutor => (lat && lng) ? tutor.distance <= radius : true);

        // Fetch active SEARCH_TOP ad slots to boost featured tutors
        const now = new Date();
        const featuredAds = await prisma.adSlot.findMany({
            where: { type: "SEARCH_TOP", isActive: true, startTime: { lte: now }, endTime: { gte: now } },
            select: { userId: true },
        });
        const featuredIds = new Set(featuredAds.map(a => a.userId));

        tutors.sort((a, b) => {
            // Featured tutors always come first
            const aFeatured = featuredIds.has(a.id) ? 1 : 0;
            const bFeatured = featuredIds.has(b.id) ? 1 : 0;
            if (aFeatured !== bFeatured) return bFeatured - aFeatured;

            if (sortBy === "price_low") return (a.tutorListing?.hourlyRate || 0) - (b.tutorListing?.hourlyRate || 0);
            if (sortBy === "price_high") return (b.tutorListing?.hourlyRate || 0) - (a.tutorListing?.hourlyRate || 0);
            if (sortBy === "distance" && lat && lng) return a.distance - b.distance;

            const tierScore = { 'ELITE': 3, 'PRO': 2, 'FREE': 1 };
            const aScore = (tierScore[a.subscriptionTier] || 0) + (a.isVerified ? 1 : 0);
            const bScore = (tierScore[b.subscriptionTier] || 0) + (b.isVerified ? 1 : 0);

            if (aScore !== bScore) return bScore - aScore;
            return new Date(b.createdAt) - new Date(a.createdAt);
        });

        return NextResponse.json(tutors.map(t => {
            const searchCriterion = { 
                subjects: subject ? [subject] : [], 
                grades: grade ? [grade] : [], 
                locations: location ? [location] : [],
                lat, lng,
                timings: timing ? [timing] : [],
                boards: board ? [board] : []
            };
            const match = calculateMatchScore(searchCriterion, { 
                subjects: t.tutorListing?.subjects || [], 
                grades: t.tutorListing?.grades || [], 
                locations: t.tutorListing?.locations || [], 
                lat: t.lat, lng: t.lng,
                timings: t.tutorListing?.timings || [],
                boards: t.tutorListing?.boards || [],
                isVerified: t.isVerified,
                subscriptionTier: t.subscriptionTier
            });

            return {
                id: t.id,
                name: t.name || (t.role === "INSTITUTE" ? "Institute Member" : "Anonymous Expert"),
                image: t.image,
                location: t.tutorListing?.locations?.[0] || "Multiple Locations",
                distance: t.distance,
                subjects: t.tutorListing?.subjects || [],
                grades: t.tutorListing?.grades || [],
                rate: t.tutorListing?.hourlyRate || 0,
                bio: t.tutorListing?.bio || "Professional Educator",
                isInstitute: t.role === "INSTITUTE",
                isVerified: t.isVerified || false,
                subscriptionTier: t.subscriptionTier || 'FREE',
                rating: t.tutorListing?.rating || 0,
                experience: t.tutorListing?.experience || 0,
                gender: t.tutorListing?.gender,
                teachingModes: t.tutorListing?.teachingModes || [],
                timings: t.tutorListing?.timings || [],
                boards: t.tutorListing?.boards || [],
                matchScore: match.score,
                matchLabel: match.label,
                matchFactors: match.factors,
                isFeatured: featuredIds.has(t.id),
            };
        }));

    } catch (err) {
        console.error("SEARCH_API_ERROR:", err);
        return NextResponse.json({ error: "Search failed", details: err.message }, { status: 500 });
    }
}

function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; 
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}
