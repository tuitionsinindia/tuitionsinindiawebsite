import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { isAdminAuthorized } from "@/lib/adminAuth";

export const dynamic = 'force-dynamic';

const VALID_TIERS = ["FREE", "PRO", "ELITE"];

export async function POST(request) {
    if (!isAdminAuthorized(request)) {
        return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    try {
        const { userId, tier } = await request.json();
        if (!userId || !tier || !VALID_TIERS.includes(tier)) {
            return NextResponse.json({ success: false, error: "userId and valid tier (FREE/PRO/ELITE) required" }, { status: 400 });
        }

        const user = await prisma.user.update({
            where: { id: userId },
            data: {
                subscriptionTier: tier,
                subscriptionStatus: tier === "FREE" ? "INACTIVE" : "ACTIVE"
            },
            select: { id: true, subscriptionTier: true, subscriptionStatus: true }
        });

        return NextResponse.json({ success: true, subscriptionTier: user.subscriptionTier });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
