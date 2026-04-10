import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request) {
    try {
        const { userId, name, phone, bio, gender, preferredContact } = await request.json();

        if (!userId) {
            return NextResponse.json({ error: "Missing User Identity" }, { status: 400 });
        }

        // Execute Atomized Profile Update
        await prisma.$transaction(async (tx) => {
            // 1. Update Core User Metadata
            await tx.user.update({
                where: { id: userId },
                data: {
                    name,
                    phone,
                    privacySettings: { 
                        preferredContact: preferredContact || "PHONE",
                        showPhonePublicly: true 
                    }
                }
            });

            // 2. Update Tutor-Specific Listing (if exists)
            const tutorListing = await tx.listing.findUnique({
                where: { tutorId: userId }
            });

            if (tutorListing) {
                await tx.listing.update({
                    where: { tutorId: userId },
                    data: {
                        bio,
                        gender
                    }
                });
            }
        });

        return NextResponse.json({ 
            success: true, 
            message: "SYNC_SUCCESS: PROFILE_ATOMS_RECONFIGURED" 
        });

    } catch (err) {
        console.error("USER_UPDATE_ERROR:", err);
        return NextResponse.json({ error: "Internal Server Error", details: err.message }, { status: 500 });
    }
}
