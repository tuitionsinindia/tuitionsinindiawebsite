export const dynamic = "force-dynamic";

import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const session = getSession();
        if (!session || session.role !== "ADMIN") {
            return NextResponse.json({ error: "Admin access required." }, { status: 403 });
        }

        const body = await request.json();
        const { tutorId, isVipEligible, vipAvailability } = body;

        if (!tutorId || typeof isVipEligible !== "boolean") {
            return NextResponse.json(
                { error: "Please provide tutorId and isVipEligible (true/false)." },
                { status: 400 }
            );
        }

        // Update the tutor's listing
        const updateData = { isVipEligible };
        if (vipAvailability !== undefined) {
            updateData.vipAvailability = vipAvailability;
        }

        await prisma.listing.updateMany({
            where: { tutorId },
            data: updateData,
        });

        // Notify the tutor when being added to the VIP pool
        if (isVipEligible) {
            await prisma.notification.create({
                data: {
                    userId: tutorId,
                    type: "VIP_ELIGIBLE",
                    title: "You've been added to our VIP tutor pool!",
                    body: "You are now eligible to receive premium student introductions through TuitionsInIndia VIP.",
                    link: "/dashboard/tutor?tab=vip",
                },
            }).catch((err) => {
                console.error("[VIP Admin Tutor-VIP] Notification failed:", err.message);
            });
        }

        return NextResponse.json({ success: true, isVipEligible });
    } catch (err) {
        console.error("[VIP Admin Tutor-VIP]", err);
        return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
    }
}
