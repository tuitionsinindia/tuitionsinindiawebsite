export const dynamic = "force-dynamic";

import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const session = getSession();
        if (!session) {
            return NextResponse.json({ error: "Please log in to continue." }, { status: 401 });
        }
        if (session.role !== "TUTOR") {
            return NextResponse.json({ error: "Only tutors can check verification status." }, { status: 403 });
        }

        const request = await prisma.verificationRequest.findUnique({
            where: { tutorId: session.id },
        });

        return NextResponse.json({ request: request || null });
    } catch (err) {
        console.error("[Verification Status]", err);
        return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
    }
}
