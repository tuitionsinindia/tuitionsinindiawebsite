export const dynamic = "force-dynamic";

import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { triggerIntroCall, triggerNextMatch } from "@/lib/vipUtils";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const session = getSession();
        if (!session) {
            return NextResponse.json({ error: "Please log in to continue." }, { status: 401 });
        }
        if (session.role !== "STUDENT") {
            return NextResponse.json({ error: "Only students can respond to tutor recommendations." }, { status: 403 });
        }

        const body = await request.json();
        const { matchId, response, note } = body;

        if (!matchId || !response) {
            return NextResponse.json({ error: "Please provide matchId and response." }, { status: 400 });
        }
        if (response !== "ACCEPTED" && response !== "REJECTED") {
            return NextResponse.json({ error: "Response must be ACCEPTED or REJECTED." }, { status: 400 });
        }

        // Find the match and verify ownership
        const match = await prisma.vipMatch.findUnique({
            where: { id: matchId },
            include: {
                application: true,
            },
        });

        if (!match) {
            return NextResponse.json({ error: "Recommendation not found." }, { status: 404 });
        }
        if (match.application.studentId !== session.id) {
            return NextResponse.json({ error: "Access denied." }, { status: 403 });
        }
        if (match.status !== "SENT") {
            return NextResponse.json({ error: "This recommendation has already been responded to." }, { status: 409 });
        }

        if (response === "ACCEPTED") {
            await prisma.vipMatch.update({
                where: { id: matchId },
                data: {
                    status: "ACCEPTED",
                    respondedAt: new Date(),
                },
            });

            // Fire and forget: schedule intro call
            triggerIntroCall(matchId).catch((err) => {
                console.error("[VIP] triggerIntroCall failed:", err.message);
            });

            return NextResponse.json({ success: true, action: "intro_call_scheduled" });
        }

        // REJECTED
        await prisma.vipMatch.update({
            where: { id: matchId },
            data: {
                status: "REJECTED",
                studentNote: note || null,
                respondedAt: new Date(),
            },
        });

        await prisma.vipApplication.update({
            where: { id: match.applicationId },
            data: {
                replacementsUsed: { increment: 1 },
            },
        });

        // Fire and forget: find next match
        triggerNextMatch(match.applicationId).catch((err) => {
            console.error("[VIP] triggerNextMatch failed:", err.message);
        });

        return NextResponse.json({ success: true, action: "next_match_triggered" });
    } catch (err) {
        console.error("[VIP Match Respond]", err);
        return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
    }
}
