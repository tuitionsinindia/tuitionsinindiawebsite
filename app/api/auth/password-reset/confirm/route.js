import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createSessionToken, makeSessionCookie } from "@/lib/session";

export async function POST(request) {
    try {
        const { uid, token } = await request.json();

        if (!uid || !token) {
            return NextResponse.json({ error: "Invalid link." }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { id: uid },
            select: { id: true, name: true, role: true, notificationPrefs: true },
        });

        if (!user) {
            return NextResponse.json({ error: "Link is invalid or has expired." }, { status: 400 });
        }

        const prefs = user.notificationPrefs || {};
        const storedToken = prefs._resetToken;
        const expires = prefs._resetExpires ? new Date(prefs._resetExpires) : null;

        if (!storedToken || storedToken !== token) {
            return NextResponse.json({ error: "Link is invalid or has already been used." }, { status: 400 });
        }

        if (!expires || new Date() > expires) {
            return NextResponse.json({ error: "This link has expired. Please request a new one." }, { status: 400 });
        }

        // Clear the token so it can only be used once
        await prisma.user.update({
            where: { id: uid },
            data: {
                notificationPrefs: {
                    ...prefs,
                    _resetToken: null,
                    _resetExpires: null,
                },
            },
        });

        // Create session
        const sessionToken = createSessionToken({ id: user.id, role: user.role, name: user.name });
        const cookie = makeSessionCookie(sessionToken);

        const dashboardMap = {
            STUDENT: `/dashboard/student?studentId=${user.id}`,
            TUTOR: `/dashboard/tutor?tutorId=${user.id}`,
            INSTITUTE: `/dashboard/institute?instId=${user.id}`,
            ADMIN: `/dashboard/admin`,
        };
        const redirectTo = dashboardMap[user.role] || "/";

        const res = NextResponse.json({ success: true, redirectTo });
        res.headers.set("Set-Cookie", cookie);
        return res;
    } catch (err) {
        console.error("Password reset confirm error:", err);
        return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
    }
}
