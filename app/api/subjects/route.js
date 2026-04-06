import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const DEFAULT_SUBJECTS = [
    "Maths", "Physics", "Chemistry", "Biology", "Science",
    "English", "Hindi", "Sanskrit", "French", "German", "Spanish", 
    "Tamil", "Telugu", "Kannada", "Malayalam", "Marathi",
    "Social Science", "History", "Geography", "Economics", "Civics",
    "Accountancy", "Business Studies", "Commerce", "Statistics",
    "Computer Science", "Coding", "Python", "Java", "C++", "Web Development",
    "JEE Preparation", "NEET Preparation", "UPSC Exams", "Banking Exams", "SSC Exams", "CLAT", "CAT", "GATE",
    "IELTS", "TOEFL", "GRE", "GMAT", "SAT", "IB Curriculum", "IGCSE",
    "Vocal Music", "Guitar", "Piano", "Flute", "Keyboard",
    "Classical Dance", "Western Dance", "Zumba", "Yoga",
    "Drawing", "Painting", "Art & Craft", "Photography",
    "Personality Development", "Spoken English", "Public Speaking",
    "Vedic Maths", "Abacus", "Chess"
];

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const subject = searchParams.get("subject");

        if (subject) {
            // Get grade counts for a specific subject
            const listings = await prisma.listing.findMany({
                where: { 
                    isActive: true,
                    subjects: { has: subject }
                },
                select: { grades: true }
            });

            const gradeCounts = {};
            listings.forEach(listing => {
                if (listing.grades && Array.isArray(listing.grades)) {
                    listing.grades.forEach(grade => {
                        gradeCounts[grade] = (gradeCounts[grade] || 0) + 1;
                    });
                }
            });

            return NextResponse.json(gradeCounts);
        }

        // Default: Get all subjects with overall counts
        const listings = await prisma.listing.findMany({
            where: { isActive: true },
            select: { subjects: true }
        });

        const counts = {};
        listings.forEach(listing => {
            if (listing.subjects && Array.isArray(listing.subjects)) {
                listing.subjects.forEach(sub => {
                    counts[sub] = (counts[sub] || 0) + 1;
                });
            }
        });

        DEFAULT_SUBJECTS.forEach(sub => {
            if (!counts[sub]) counts[sub] = 0;
        });

        const subjectData = Object.entries(counts)
            .filter(([name]) => typeof name === 'string' && name.trim().length > 0)
            .map(([name, count]) => ({
                name: name.trim(),
                count
            }))
            .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));

        return NextResponse.json(subjectData);
    } catch (error) {
        console.error("Critical error in subjects API:", error);
        return NextResponse.json([]);
    }
}
