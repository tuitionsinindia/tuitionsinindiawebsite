import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function POST(request) {
    try {
        const session = getSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { userId, name, phone, email, image, bio, gender, preferredContact, showPhonePublicly, notificationPrefs, lat, lng } = await request.json();

        if (!userId) {
            return NextResponse.json({ error: "userId is required" }, { status: 400 });
        }

        // Ensure the authenticated user can only update their own profile
        if (session.id !== userId) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        await prisma.$transaction(async (tx) => {
            // Build the user update data
            const userData = {};
            if (name !== undefined) userData.name = name;
            if (phone !== undefined) userData.phone = phone;
            if (email !== undefined) userData.email = email;
            // Allow Google profile photo URLs (https://lh3.googleusercontent.com/...)
            if (image !== undefined && typeof image === "string" && image.startsWith("https://")) userData.image = image;
            if (lat !== undefined && !isNaN(lat)) userData.lat = lat;
            if (lng !== undefined && !isNaN(lng)) userData.lng = lng;

            if (preferredContact !== undefined || showPhonePublicly !== undefined) {
                // Fetch existing settings to avoid overwriting unrelated fields
                const existing = await tx.user.findUnique({ where: { id: userId }, select: { privacySettings: true } });
                const current = (existing?.privacySettings || {});
                userData.privacySettings = {
                    ...current,
                    ...(preferredContact !== undefined ? { preferredContact } : {}),
                    ...(showPhonePublicly !== undefined ? { showPhonePublicly } : {}),
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
