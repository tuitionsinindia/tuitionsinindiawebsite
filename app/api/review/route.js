import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { verifyToken, COOKIE_NAME } from "@/lib/session";

export const dynamic = "force-dynamic";

// GET /api/review?targetId=xxx — fetch reviews for a tutor + check if current user already reviewed
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const targetId = searchParams.get("targetId");
        if (!targetId) return NextResponse.json({ error: "targetId required" }, { status: 400 });

        const reviews = await prisma.review.findMany({
            where: { targetId },
            select: {
                id: true, rating: true, comment: true, createdAt: true,
                author: { select: { name: true } }
            },
            orderBy: { createdAt: "desc" },
            take: 20,
        });

        const cookie = request.cookies.get(COOKIE_NAME);
        const session = cookie ? verifyToken(cookie.value) : null;
        let alreadyReviewed = false;
        let canReview = false;

        if (session) {
            const existing = await prisma.review.findFirst({ where: { authorId: session.id, targetId } });
            alreadyReviewed = !!existing;

            if (!alreadyReviewed) {
                const [unlock, chatSession, trial] = await Promise.all([
                    prisma.leadUnlock.findFirst({ where: { tutorId: targetId, lead: { studentId: session.id } } }),
                    prisma.chatSession.findFirst({ where: { OR: [{ studentId: session.id, tutorId: targetId }, { studentId: targetId, tutorId: session.id }] } }),
                    prisma.trialBooking.findFirst({ where: { studentId: session.id, tutorId: targetId, status: "COMPLETED" } }),
                ]);
                canReview = !!(unlock || chatSession || trial);
            }
        }

        return NextResponse.json({ reviews, alreadyReviewed, canReview, userId: session?.id || null });
    } catch (err) {
        console.error("REVIEW_FETCH_ERROR:", err);
        return NextResponse.json({ error: "Failed to load reviews" }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const authSession = getSession();
        if (!authSession) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { authorId, targetId, rating, comment } = await request.json();

        if (authSession.id !== authorId) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        if (!authorId || !targetId || !rating) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const [unlock, chatSess, trial] = await Promise.all([
            prisma.leadUnlock.findFirst({ where: { tutorId: targetId, lead: { studentId: authorId } } }),
            prisma.chatSession.findFirst({ where: { OR: [{ studentId: authorId, tutorId: targetId }, { studentId: targetId, tutorId: authorId }] } }),
            prisma.trialBooking.findFirst({ where: { studentId: authorId, tutorId: targetId, status: "COMPLETED" } }),
        ]);

        if (!unlock && !chatSess && !trial) {
            return NextResponse.json({ error: "You can only leave a review after connecting with this tutor." }, { status: 403 });
        }

        const existingReview = await prisma.review.findFirst({ where: { authorId, targetId } });
        if (existingReview) {
            return NextResponse.json({ error: "Multiple reviews restricted. Please update your existing feedback." }, { status: 403 });
        }

        const review = await prisma.review.create({
            data: { authorId, targetId, rating: parseInt(rating), comment }
        });

        const reviews = await prisma.review.findMany({ where: { targetId }, select: { rating: true } });
        const reviewCount = reviews.length;
        const averageRating = reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviewCount;

        // Auto-feature listings that earn 4.5+ stars with 10+ reviews
        const shouldFeature = averageRating >= 4.5 && reviewCount >= 10;

        await prisma.listing.update({
            where: { tutorId: targetId },
            data: {
                rating: averageRating,
                reviewCount,
                ...(shouldFeature && { isFeatured: true }),
            },
        });

        return NextResponse.json({ success: true, review, newRating: averageRating.toFixed(1), newReviewCount: reviewCount });

    } catch (err) {
        console.error("REVIEW_SUBMISSION_ERROR:", err);
        return NextResponse.json({ error: "Internal Server Error", details: err.message }, { status: 500 });
    }
}
