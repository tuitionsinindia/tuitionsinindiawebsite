import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const session = getSession();
        if (!session) return NextResponse.json({ error: "Please log in to view your credits" }, { status: 401 });

        const user = await prisma.user.findUnique({
            where: { id: session.id },
            select: {
                platformCredit: true,
                contactViewsThisMonth: true,
                demoBookingsThisMonth: true,
            },
        });

        if (!user) return NextResponse.json({ error: "Account not found" }, { status: 404 });

        return NextResponse.json({
            platformCredit: user.platformCredit,
            contactViewsThisMonth: user.contactViewsThisMonth,
            freeContactsRemaining: Math.max(0, 3 - user.contactViewsThisMonth),
            demoBookingsThisMonth: user.demoBookingsThisMonth,
            freeDemosRemaining: Math.max(0, 2 - user.demoBookingsThisMonth),
        });
    } catch (error) {
        console.error("Student credits error:", error);
        return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
    }
}
