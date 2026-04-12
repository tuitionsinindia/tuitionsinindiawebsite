import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request) {
    try {
        const { userId, name, phone, bio, gender, preferredContact, notificationPrefs } = await request.json();

        if (!userId) {
            return NextResponse.json({ error: "userId is required" }, { status: 400 });
        }

        await prisma.$transaction(async (tx) => {
            // Build the user update data
            const userData = { name, phone };

            if (preferredContact) {
                userData.privacySettings = {
                    preferredContact,
                    showPhonePublicly: true,
                };
            }

            if (notificationPrefs) {
                userData.notificationPrefs = notificationPrefs;
            }

            await tx.user.update({ where: { id: userId }, data: userData });

            // Update tutor listing bio/gender if listing exists
            if (bio !== undefined || gender !== undefined) {
                const listing = await tx.listing.findUnique({ where: { tutorId: userId } });
                if (listing) {
                    await tx.listing.update({
                        where: { tutorId: userId },
                        data: { bio, gender },
                    });
                }
            }
        });

        return NextResponse.json({ success: true, message: "Profile updated successfully." });

    } catch (err) {
        console.error("User update error:", err);
        return NextResponse.json({ error: "Internal Server Error", details: err.message }, { status: 500 });
    }
}
