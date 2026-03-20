import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const DEFAULT_SUBJECTS = [
    "Mathematics", "Physics", "Chemistry", "Biology", "Science",
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

export async function GET() {
    try {
        const subjectSet = new Set(DEFAULT_SUBJECTS);

        try {
            // Fetch unique subjects from tutor listings
            const tutorListings = await prisma.listing.findMany({
                where: { isActive: true },
                select: { subjects: true },
                take: 100 // Limit for performance
            });

            tutorListings.forEach(l => {
                if (l.subjects) l.subjects.forEach(s => subjectSet.add(s));
            });

            // Fetch unique subjects from student leads
            const leads = await prisma.lead.findMany({
                where: { status: 'OPEN' },
                select: { subject: true },
                take: 100
            });

            leads.forEach(l => {
                if (l.subject) subjectSet.add(l.subject);
            });
        } catch (dbError) {
            console.error("DB fetch for subjects failed, using defaults:", dbError);
            // Non-fatal, we still have defaults
        }

        // Convert to sorted array
        const sortedSubjects = Array.from(subjectSet).sort();

        return NextResponse.json(sortedSubjects);
    } catch (error) {
        console.error("Critical error in subjects API:", error);
        return NextResponse.json(DEFAULT_SUBJECTS.sort()); // Fallback to defaults even on critical error
    }
}
