import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { isAdminAuthorized } from "@/lib/adminAuth";

export const dynamic = 'force-dynamic';

// GET — full user details
export async function GET(request, { params }) {
    if (!isAdminAuthorized(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id } = await params;
    try {
        const user = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true, name: true, email: true, phone: true, role: true,
                isVerified: true, isIdVerified: true, isSuspended: true,
                isProfileComplete: true, credits: true,
                subscriptionTier: true, subscriptionStatus: true,
                provider: true, createdAt: true, updatedAt: true,
                tutorListing: {
                    select: {
                        subjects: true, location: true, hourlyRate: true,
                        bio: true, isApproved: true, rating: true, reviewCount: true,
                        lat: true, lng: true
                    }
                },
                _count: {
                    select: {
                        transactions: true, leadsPosted: true,
                        studentTrials: true, reviewsReceived: true,
                    }
                },
                transactions: {
                    take: 5, orderBy: { createdAt: "desc" },
                    select: { id: true, amount: true, type: true, createdAt: true, status: true }
                },
                verificationRequest: {
                    select: { id: true, status: true, submittedAt: true, reviewedAt: true }
                }
            }
        });
        if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
        return NextResponse.json({ success: true, user });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// PATCH — edit user fields
export async function PATCH(request, { params }) {
    if (!isAdminAuthorized(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id } = await params;
    try {
        const body = await request.json();
        const { name, email, credits, subscriptionTier, subscriptionStatus, isVerified, isSuspended } = body;
        const data = {};
        if (name !== undefined) data.name = name;
        if (email !== undefined) data.email = email || null;
        if (credits !== undefined) data.credits = Math.max(0, parseInt(credits) || 0);
        if (subscriptionTier !== undefined) data.subscriptionTier = subscriptionTier;
        if (subscriptionStatus !== undefined) data.subscriptionStatus = subscriptionStatus;
        if (isVerified !== undefined) data.isVerified = Boolean(isVerified);
        if (isSuspended !== undefined) data.isSuspended = Boolean(isSuspended);

        const user = await prisma.user.update({
            where: { id }, data,
            select: {
                id: true, name: true, email: true, phone: true, role: true,
                isVerified: true, isSuspended: true, credits: true,
                subscriptionTier: true, subscriptionStatus: true, createdAt: true,
                _count: { select: { transactions: true, leadsPosted: true } }
            }
        });
        return NextResponse.json({ success: true, user });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// DELETE — remove user and their data
export async function DELETE(request, { params }) {
    if (!isAdminAuthorized(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id } = await params;
    try {
        // Delete in FK-safe order
        await prisma.message.deleteMany({
            where: { chatSession: { OR: [{ studentId: id }, { tutorId: id }] } }
        });
        await prisma.chatSession.deleteMany({ where: { OR: [{ studentId: id }, { tutorId: id }] } });
        await prisma.notification.deleteMany({ where: { userId: id } });
        await prisma.review.deleteMany({ where: { OR: [{ authorId: id }, { targetId: id }] } });
        await prisma.transaction.deleteMany({ where: { userId: id } });
        await prisma.leadUnlock.deleteMany({ where: { tutorId: id } });
        await prisma.lead.deleteMany({ where: { studentId: id } });
        await prisma.verificationRequest.deleteMany({ where: { tutorId: id } });
        await prisma.listing.deleteMany({ where: { tutorId: id } });
        await prisma.user.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ success: false, error: "Cannot delete user: " + error.message }, { status: 500 });
    }
}
