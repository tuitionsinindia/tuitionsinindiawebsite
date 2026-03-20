import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function POST(request) {
    try {
        const body = await request.json();
        const { tutorId, isApproved } = body;

        if (!tutorId) {
            return NextResponse.json({ success: false, error: "Tutor ID is required" }, { status: 400 });
        }

        const tutor = await prisma.user.update({
            where: {
                id: tutorId,
                role: 'TUTOR'
            },
            data: {
                isVerified: isApproved,
            }
        });

        return NextResponse.json({ success: true, tutorId: tutor.id, isVerified: tutor.isVerified }, { status: 200 });
    } catch (error) {
        console.error("Failed to approve tutor:", error);
        return NextResponse.json({ success: false, error: "Failed to process approval" }, { status: 500 });
    }
}
