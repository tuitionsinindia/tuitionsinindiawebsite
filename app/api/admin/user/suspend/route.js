import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { isAdminAuthorized } from "@/lib/adminAuth";

export const dynamic = 'force-dynamic';

export async function POST(request) {
    if (!isAdminAuthorized(request)) {
        return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    try {
        const { userId, suspend } = await request.json();
        if (!userId || suspend === undefined) {
            return NextResponse.json({ success: false, error: "userId and suspend (bool) required" }, { status: 400 });
        }

        const user = await prisma.user.update({
            where: { id: userId },
            data: { isSuspended: !!suspend },
            select: { id: true, isSuspended: true }
        });

        return NextResponse.json({ success: true, isSuspended: user.isSuspended });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
