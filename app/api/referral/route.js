import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";

function generateCode() {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "TII-";
    for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
    return code;
}

// GET — fetch referral info for logged-in user
export async function GET(req) {
    try {
        const session = await getSession(req);
        if (!session?.userId) {
            return NextResponse.json({ error: "Not logged in" }, { status: 401 });
        }

        let user = await prisma.user.findUnique({
            where: { id: session.userId },
            select: {
                id: true,
                referralCode: true,
                referrals: {
                    select: { id: true, name: true, role: true, createdAt: true, subscriptionTier: true },
                    orderBy: { createdAt: "desc" },
                },
            },
        });

        // Auto-generate referral code if missing
        if (!user.referralCode) {
            let code = generateCode();
            // Ensure unique
            while (await prisma.user.findUnique({ where: { referralCode: code } })) {
                code = generateCode();
            }
            user = await prisma.user.update({
                where: { id: session.userId },
                data: { referralCode: code },
                select: {
                    id: true,
                    referralCode: true,
                    referrals: {
                        select: { id: true, name: true, role: true, createdAt: true, subscriptionTier: true },
                        orderBy: { createdAt: "desc" },
                    },
                },
            });
        }

        // Count how many referred tutors upgraded to paid
        const paidReferrals = user.referrals.filter(r => ["PRO", "ELITE"].includes(r.subscriptionTier)).length;

        return NextResponse.json({
            referralCode: user.referralCode,
            referralLink: `https://tuitionsinindia.com/register/tutor?ref=${user.referralCode}`,
            totalReferrals: user.referrals.length,
            paidReferrals,
            referrals: user.referrals,
        });
    } catch (err) {
        console.error("Referral GET error:", err);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}

// POST — apply a referral code to a newly registered user
export async function POST(req) {
    try {
        const { userId, referralCode } = await req.json();

        if (!userId || !referralCode) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        const referrer = await prisma.user.findUnique({
            where: { referralCode: referralCode.toUpperCase() },
            select: { id: true },
        });

        if (!referrer) {
            return NextResponse.json({ error: "Invalid referral code" }, { status: 404 });
        }

        // Don't let users refer themselves
        if (referrer.id === userId) {
            return NextResponse.json({ error: "Cannot use your own referral code" }, { status: 400 });
        }

        // Link referral
        await prisma.user.update({
            where: { id: userId },
            data: { referredById: referrer.id },
        });

        // Check if referrer now has 3+ referrals — grant 1 month Pro reward
        const count = await prisma.user.count({ where: { referredById: referrer.id } });
        if (count >= 3 && count % 3 === 0) {
            // Award 1 month Pro (only if currently FREE)
            const referrerUser = await prisma.user.findUnique({ where: { id: referrer.id }, select: { subscriptionTier: true } });
            if (referrerUser?.subscriptionTier === "FREE") {
                await prisma.user.update({
                    where: { id: referrer.id },
                    data: { subscriptionTier: "PRO", subscriptionStatus: "ACTIVE" },
                });
            }
        }

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("Referral POST error:", err);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}
