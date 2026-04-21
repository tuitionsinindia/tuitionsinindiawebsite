import { NextResponse } from "next/server";
import { verifyToken, COOKIE_NAME } from "@/lib/session";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request) {
    try {
        const cookie = request.cookies.get(COOKIE_NAME);
        if (!cookie) return NextResponse.json(null, { status: 401 });

        const session = verifyToken(cookie.value);
        if (!session?.id) return NextResponse.json(null, { status: 401 });

        const user = await prisma.user.findUnique({
            where: { id: session.id },
            select: {
                id: true,
                name: true,
                phone: true,
                email: true,
                role: true,
                credits: true,
                subscriptionTier: true,
                subscriptionStatus: true,
                isVerified: true,
                isIdVerified: true,
                isProfileComplete: true,
            }
        });

        if (!user) return NextResponse.json(null, { status: 401 });

        return NextResponse.json(user);
    } catch {
        return NextResponse.json(null, { status: 401 });
    }
}
