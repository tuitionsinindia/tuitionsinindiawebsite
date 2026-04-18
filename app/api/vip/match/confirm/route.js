export const dynamic = "force-dynamic";

import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { triggerContractAndPaymentLink } from "@/lib/vipUtils";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const session = getSession();
        if (!session) {
            return NextResponse.json({ error: "Please log in to continue." }, { status: 401 });
        }
        if (session.role !== "STUDENT") {
            return NextResponse.json({ error: "Only students can confirm a tutor." }, { status: 403 });
        }

        const body = await request.json();
        const { matchId } = body;

        if (!matchId) {
            return NextResponse.json({ error: "Please provide a matchId." }, { status: 400 });
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
        if (match.status !== "ACCEPTED") {
            return NextResponse.json(
                { error: "You can only confirm a tutor after accepting their recommendation." },
                { status: 409 }
            );
        }

        // Await contract creation — surface errors to the client
        await triggerContractAndPaymentLink(matchId);

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("[VIP Match Confirm]", err);
        return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
    }
}
