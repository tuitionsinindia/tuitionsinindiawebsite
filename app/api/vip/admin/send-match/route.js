export const dynamic = "force-dynamic";

import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { triggerFirstMatch, triggerNextMatch } from "@/lib/vipUtils";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const session = getSession();
        if (!session || session.role !== "ADMIN") {
            return NextResponse.json({ error: "Admin access required." }, { status: 403 });
        }

        const body = await request.json();
        const { applicationId, force } = body;

        if (!applicationId) {
            return NextResponse.json({ error: "Please provide an applicationId." }, { status: 400 });
        }

        const application = await prisma.vipApplication.findUnique({
            where: { id: applicationId },
        });

        if (!application) {
            return NextResponse.json({ error: "Application not found." }, { status: 404 });
        }
        if (application.status !== "ACTIVE") {
            return NextResponse.json(
                { error: "Matches can only be sent for active applications." },
                { status: 409 }
            );
        }

        if (force) {
            await triggerNextMatch(applicationId);
        } else if (application.currentMatchNumber === 0) {
            await triggerFirstMatch(applicationId);
        } else {
            await triggerNextMatch(applicationId);
        }

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("[VIP Admin Send Match]", err);
        return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
    }
}
