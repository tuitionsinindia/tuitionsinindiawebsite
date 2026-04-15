import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const uid = searchParams.get("uid");

    if (!uid) {
        return NextResponse.json({ error: "Missing user ID." }, { status: 400 });
    }

    try {
        const user = await prisma.user.findUnique({ where: { id: uid }, select: { id: true, notificationPrefs: true } });
        if (!user) {
            return NextResponse.json({ error: "User not found." }, { status: 404 });
        }

        let prefs = {};
        try { prefs = typeof user.notificationPrefs === "string" ? JSON.parse(user.notificationPrefs) : (user.notificationPrefs || {}); }
        catch { prefs = {}; }

        prefs.unsubscribed = true;

        await prisma.user.update({
            where: { id: uid },
            data: { notificationPrefs: prefs },
        });

        // Redirect to confirmation page
        return NextResponse.redirect(new URL("/unsubscribe?done=1", request.url));
    } catch (error) {
        console.error("Unsubscribe error:", error);
        return NextResponse.redirect(new URL("/unsubscribe?error=1", request.url));
    }
}
