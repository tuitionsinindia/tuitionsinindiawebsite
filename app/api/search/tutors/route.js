import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const subject = searchParams.get("subject");
    const location = searchParams.get("location");
    const grade = searchParams.get("grade");
    const minRate = parseInt(searchParams.get("minRate")) || 0;
    const maxRate = parseInt(searchParams.get("maxRate")) || 10000;
    const sortBy = searchParams.get("sortBy") || "relevance"; // relevance, price_low, price_high, rating, distance
    const isVerified = searchParams.get("verified") === "true";
    
    const lat = parseFloat(searchParams.get("lat"));
    const lng = parseFloat(searchParams.get("lng"));
    const radius = parseFloat(searchParams.get("radius") || "50"); // Default 50km

    const role = (searchParams.get("role") || "TUTOR").toUpperCase();

    try {
        if (role === "STUDENT") {
            let where = { status: 'OPEN' }; 
            if (subject) where.subject = { contains: subject, mode: "insensitive" };
            if (location && !lat) where.location = { contains: location, mode: "insensitive" };
            if (grade) where.grade = { contains: grade, mode: "insensitive" };

            let leads = await prisma.lead.findMany({
                where,
                include: { student: true },
                orderBy: [
                    { isPremium: 'desc' },
                    { premiumTier: 'desc' },
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

            // Sorting for leads
            leads.sort((a, b) => {
                if (sortBy === "distance" && lat && lng) return a.distance - b.distance;
                if (a.isPremium !== b.isPremium) return b.isPremium ? 1 : -1;
                return new Date(b.createdAt) - new Date(a.createdAt);
            });

            return NextResponse.json(leads.map(l => ({
                id: l.id,
                name: "Student Requirement",
                subject: l.subject,
                grade: l.grade,
                location: l.location,
                distance: l.distance,
                rate: l.budget,
                bio: l.description,
                isPremium: l.isPremium,
                premiumTier: l.premiumTier,
                createdAt: l.createdAt
            })));
        }

        // TUTOR SEARCH
        let where = { 
            role: "TUTOR",
            tutorListing: {
                is: {
                    isActive: true,
                    hourlyRate: { gte: minRate, lte: maxRate }
                }
            }
        };

        if (isVerified) where.isVerified = true;

        if (subject) {
            const normalizedSubject = subject.charAt(0).toUpperCase() + subject.slice(1).toLowerCase();
            where.tutorListing.is.subjects = {
                hasSome: [subject, normalizedSubject, subject.toUpperCase(), subject.toLowerCase()]
            };
        }

        if (grade) {
            where.tutorListing.is.grades = {
                hasSome: [grade]
            };
        }

        if (location && !lat) {
            where.tutorListing.is.locations = {
                has: location
            };
        }

        let tutors = await prisma.user.findMany({
            where,
            include: {
                tutorListing: true
            },
            take: 100
        });

        // Map and sort with safety checks
        tutors = tutors
            .map(tutor => {
                const distance = (tutor.lat && tutor.lng) ? calculateDistance(lat, lng, tutor.lat, tutor.lng) : 9999;
                return { ...tutor, distance };
            })
            .filter(tutor => (lat && lng) ? tutor.distance <= radius : true);

        tutors.sort((a, b) => {
            if (sortBy === "price_low") return (a.tutorListing?.hourlyRate || 0) - (b.tutorListing?.hourlyRate || 0);
            if (sortBy === "price_high") return (b.tutorListing?.hourlyRate || 0) - (a.tutorListing?.hourlyRate || 0);
            if (sortBy === "distance" && lat && lng) return a.distance - b.distance;
            if (sortBy === "rating") return (b.tutorListing?.rating || 0) - (a.tutorListing?.rating || 0);

            // Default: relevance (Tier > Verification > Proximity)
            const tierScore = { 'ELITE': 3, 'PRO': 2, 'FREE': 1 };
            const aScore = tierScore[a.subscriptionTier] || 0;
            const bScore = tierScore[b.subscriptionTier] || 0;

            if (aScore !== bScore) return bScore - aScore;
            if (a.isVerified !== b.isVerified) return b.isVerified ? 1 : -1;
            if (lat && lng) return a.distance - b.distance;

            return new Date(b.createdAt) - new Date(a.createdAt);
        });

        // FINAL MAPPING WITH EXTREME SAFETY
        return NextResponse.json(tutors.map(t => {
            try {
                return {
                    id: t.id,
                    name: t.name || "Anonymous User",
                    image: t.image,
                    location: t.location || "Location not specified",
                    distance: t.distance,
                    grade: t.tutorListing?.grades?.[0] || "General", 
                    grades: t.tutorListing?.grades || [],
                    subject: t.tutorListing?.subjects?.[0] || "Expert Tutor",
                    subjects: t.tutorListing?.subjects || [],
                    rate: t.tutorListing?.hourlyRate || 0,
                    bio: t.tutorListing?.bio || "No bio available.",
                    isInstitute: t.role === "INSTITUTE",
                    isVerified: t.isVerified || false,
                    subscriptionTier: t.subscriptionTier || 'FREE',
                    rating: t.tutorListing?.rating || 0,
                    reviewCount: t.tutorListing?.reviewCount || 0
                };
            } catch (cardErr) {
                console.error("Error mapping tutor card:", cardErr);
                return null;
            }
        }).filter(Boolean));
    } catch (err) {
        console.error("SEARCH_API_ERROR:", err);
        
        const errorMessage = err.message || "";
        
        // Specifically check for Prisma Proxy 'fetch failed'
        if (errorMessage.includes("fetch failed") || errorMessage.includes("Cannot fetch data from service")) {
            return NextResponse.json({ 
                error: "Database service unreachable.",
                details: "Your local Prisma Postgres proxy is not running. Please run 'npx prisma dev' and keep it open.",
                action: "npx prisma dev"
            }, { status: 503 });
        }

        // Specifically check if 'grades' column is missing
        if (errorMessage.includes('column "grades" does not exist')) {
            return NextResponse.json({ 
                error: "Database schema out of sync.",
                details: "The 'grades' column is missing. Please run 'npx prisma db push'.",
                action: "npx prisma db push"
            }, { status: 500 });
        }

        return NextResponse.json({ 
            error: "Search failed", 
            details: errorMessage 
        }, { status: 500 });
    }
}

// Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}
