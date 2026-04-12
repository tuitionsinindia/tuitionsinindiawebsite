import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { isAdminAuthorized } from "@/lib/adminAuth";

export const dynamic = 'force-dynamic';

export async function POST(request) {
    if (!isAdminAuthorized(request)) {
        return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    try {
        const { userId, amount } = await request.json();
        if (!userId || amount === undefined) {
            return NextResponse.json({ success: false, error: "userId and amount required" }, { status: 400 });
        }

        const user = await prisma.user.update({
            where: { id: userId },
            data: { credits: { increment: parseInt(amount) } },
            select: { id: true, credits: true }
        });

        return NextResponse.json({ success: true, credits: user.credits });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
