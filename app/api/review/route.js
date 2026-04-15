import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request) {
    try {
        const { authorId, targetId, rating, comment } = await request.json();

        if (!authorId || !targetId || !rating) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // 1. Verify Trust Link (Lead Unlock, Chat Session, or Completed Trial)
        const [unlock, session, trial] = await Promise.all([
            prisma.leadUnlock.findFirst({
                where: {
                    tutorId: targetId,
                    lead: { studentId: authorId }
                }
            }),
            prisma.chatSession.findFirst({
                where: {
                    OR: [
                        { studentId: authorId, tutorId: targetId },
                        { studentId: targetId, tutorId: authorId }
                    ]
                }
            }),
            prisma.trialBooking.findFirst({
                where: {
                    studentId: authorId,
                    tutorId: targetId,
                    status: "COMPLETED",
                }
            }),
        ]);

        if (!unlock && !session && !trial) {
            return NextResponse.json({
                error: "You can only leave a review after connecting with this tutor."
            }, { status: 403 });
        }

        // 2. Prevent Multiple Reviews (Optional but recommended)
        const existingReview = await prisma.review.findFirst({
            where: { authorId, targetId }
        });

        if (existingReview) {
            return NextResponse.json({ error: "Multiple reviews restricted. Please update your existing feedback." }, { status: 403 });
        }

        // 3. Create Review
        const review = await prisma.review.create({
            data: {
                authorId,
                targetId,
                rating: parseInt(rating),
                comment
            }
        });

        // 4. Update Listing Metadata (Aggregation)
        const reviews = await prisma.review.findMany({
            where: { targetId },
            select: { rating: true }
        });

        const reviewCount = reviews.length;
        const averageRating = reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviewCount;

        await prisma.listing.update({
            where: { tutorId: targetId },
            data: {
                rating: averageRating,
                reviewCount: reviewCount
            }
        });

        return NextResponse.json({ 
            success: true, 
            review,
            newRating: averageRating.toFixed(1),
            newReviewCount: reviewCount
        });

    } catch (err) {
        console.error("REVIEW_SUBMISSION_ERROR:", err);
        return NextResponse.json({ error: "Internal Server Error", details: err.message }, { status: 500 });
    }
}
