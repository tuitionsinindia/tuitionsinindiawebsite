export const dynamic = "force-dynamic";

import { isAdminAuthorized } from "@/lib/adminAuth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        if (!isAdminAuthorized(request)) {
            return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
        }

        const requests = await prisma.verificationRequest.findMany({
            where: { status: "PENDING_REVIEW" },
            include: {
                tutor: {
                    select: { id: true, name: true, phone: true, email: true },
                },
            },
            orderBy: { createdAt: "asc" },
        });

        return NextResponse.json({ requests });
    } catch (err) {
        console.error("[Admin Verification Requests]", err);
        return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
    }
}
