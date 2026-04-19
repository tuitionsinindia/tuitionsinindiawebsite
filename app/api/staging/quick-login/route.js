import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createSessionToken, makeSessionCookie } from "@/lib/session";

export const dynamic = "force-dynamic";

// Only available on staging
const IS_STAGING = process.env.NEXT_PUBLIC_ENV === "staging";

const TEST_ACCOUNTS = {
    student:   { phone: "9999100001", name: "Test Student",   role: "STUDENT" },
    tutor:     { phone: "9999200001", name: "Test Tutor",     role: "TUTOR" },
    institute: { phone: "9999300001", name: "Test Institute", role: "INSTITUTE" },
};

const DASHBOARD = {
    STUDENT:   "/dashboard/student",
    TUTOR:     "/dashboard/tutor",
    INSTITUTE: "/dashboard/institute",
};

export async function POST(request) {
    if (!IS_STAGING) {
        return NextResponse.json({ error: "Not available in production" }, { status: 403 });
    }

    const { role } = await request.json().catch(() => ({}));
    const account = TEST_ACCOUNTS[role?.toLowerCase()];
    if (!account) {
        return NextResponse.json({ error: "Invalid role. Use student, tutor, or institute." }, { status: 400 });
    }

    // Find or create the test user
    let user = await prisma.user.findFirst({ where: { phone: account.phone } });

    if (!user) {
        user = await prisma.user.create({
            data: {
                phone: account.phone,
                name: account.name,
                role: account.role,
                phoneVerified: true,
                isVerified: account.role === "TUTOR" ? true : false,
                credits: account.role === "TUTOR" ? 5 : 0,
                subscriptionTier: "FREE",
            },
        });
    }

    const token = createSessionToken(user);
    const cookie = makeSessionCookie(token);

    return NextResponse.json(
        { success: true, redirect: DASHBOARD[user.role] || "/" },
        { headers: { "Set-Cookie": cookie } }
    );
}
