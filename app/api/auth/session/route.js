import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken, COOKIE_NAME } from "@/lib/session";

export const dynamic = 'force-dynamic';

// GET /api/auth/session — returns current logged-in user or 401
export async function GET(request) {
    const cookie = request.cookies.get(COOKIE_NAME);
    if (!cookie?.value) {
        return NextResponse.json({ user: null }, { status: 401 });
    }

    const payload = verifyToken(cookie.value);
    if (!payload) {
        return NextResponse.json({ user: null }, { status: 401 });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: payload.id },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                role: true,
                image: true,
                credits: true,
                subscriptionTier: true,
                subscriptionStatus: true,
                isVerified: true,
                isSuspended: true,
                notificationPrefs: true,
                privacySettings: true,
            },
        });

        if (!user || user.isSuspended) {
            return NextResponse.json({ user: null }, { status: 401 });
        }

        return NextResponse.json({ user });
    } catch (err) {
        return NextResponse.json({ user: null }, { status: 500 });
    }
}
