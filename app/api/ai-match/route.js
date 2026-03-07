import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(request) {
    try {
        const body = await request.json();
        const { learningGoal, subject, learningStyle, gradeLevel } = body;

        if (!subject || !gradeLevel) {
            return NextResponse.json({ error: 'Subject and Grade Level are required' }, { status: 400 });
        }

        // 1. Fetch all active tutors
        const tutors = await prisma.listing.findMany({
            where: { isActive: true },
            include: {
                tutor: {
                    select: {
                        name: true,
                        isVerified: true,
                    }
                }
            }
        });

        // 2. AI Scoring Algorithm (Simulated Heuristics)
        const scoredTutors = tutors.map(tutor => {
            let score = 0;
            const reasons = [];

            // A. Subject Match (Highest Weight)
            const normalizedTargetSub = subject.toLowerCase().trim();
            const hasExactSubject = tutor.subjects.some(s => s.toLowerCase() === normalizedTargetSub);
            const hasPartialSubject = tutor.subjects.some(s => s.toLowerCase().includes(normalizedTargetSub) || normalizedTargetSub.includes(s.toLowerCase()));

            if (hasExactSubject) {
                score += 50;
                reasons.push("Exact subject match");
            } else if (hasPartialSubject) {
                score += 30;
                reasons.push("Related subject expertise");
            }

            // B. Grade Level Heuristics (Using keywords in Bio or Subjects)
            const normalizedGrade = gradeLevel.toLowerCase();
            const bio = (tutor.bio || "").toLowerCase();

            if (bio.includes(normalizedGrade) || tutor.subjects.some(s => s.toLowerCase().includes(normalizedGrade))) {
                score += 20;
                reasons.push(`Experience with ${gradeLevel} students`);
            } else {
                score += 5; // Default assumption they can teach it, but no bonus
            }

            // C. Verified Bonus (Trust Factor)
            if (tutor.tutor.isVerified) {
                score += 15;
                reasons.push("TuitionsInIndia Verified Educator");
            }

            // D. Rating Bonus
            if (tutor.rating >= 4.5) {
                score += 10;
                reasons.push("Top-rated by prior students");
            } else if (tutor.rating > 0) {
                score += 5;
            }

            // E. Learning Style Matching (Simulated based on keywords)
            if (learningStyle) {
                const styleLower = learningStyle.toLowerCase();
                if (styleLower.includes('visual') && bio.match(/diagram|interactive|video|whiteboard/)) {
                    score += 10;
                    reasons.push("Teaching style aligns with visual learning");
                }
                if (styleLower.includes('practical') && bio.match(/practical|hands-on|real-world|build/)) {
                    score += 10;
                    reasons.push("Teaching style aligns with practical learning");
                }
                if (styleLower.includes('patient') && bio.match(/patient|slow|step-by-step/)) {
                    score += 10;
                    reasons.push("Known for patient teaching methodology");
                }
            }

            return {
                ...tutor,
                matchScore: score,
                matchReasons: reasons.slice(0, 3) // Top 3 reasons
            };
        });

        // 3. Sort by score
        const bestMatches = scoredTutors
            .filter(t => t.matchScore > 20) // Only return relevant matches
            .sort((a, b) => b.matchScore - a.matchScore)
            .slice(0, 5); // Return top 5

        return NextResponse.json({
            matches: bestMatches,
            analysis: {
                analyzedCount: tutors.length,
                topScore: bestMatches[0]?.matchScore || 0
            }
        });

    } catch (error) {
        console.error("AI Match Error:", error);
        return NextResponse.json({ error: 'Failed to process AI Match' }, { status: 500 });
    }
}
