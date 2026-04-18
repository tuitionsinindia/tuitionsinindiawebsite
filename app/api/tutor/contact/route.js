import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

// GET /api/tutor/contact?tutorId=xxx
// Returns a tutor's contact details to any logged-in user (students get it free).
// Also logs the contact view for analytics.
export async function GET(request) {
    try {
        const session = getSession();
        if (!session) {
            return NextResponse.json({ error: "Please sign in to view contact details." }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const tutorId = searchParams.get("tutorId");

        if (!tutorId) {
            return NextResponse.json({ error: "tutorId is required." }, { status: 400 });
        }

        // Don't let a tutor fetch their own contact details via this route
        // (they can see it in their dashboard)
        const tutor = await prisma.user.findUnique({
            where: { id: tutorId },
            select: {
                id: true,
                name: true,
                phone: true,
                phoneVerified: true,
                email: true,
                role: true,
                isVerified: true,
                tutorListing: {
                    select: { subjects: true, locations: true }
                }
            }
        });

        if (!tutor) {
            return NextResponse.json({ error: "Tutor not found." }, { status: 404 });
        }

        if (!["TUTOR", "INSTITUTE"].includes(tutor.role)) {
            return NextResponse.json({ error: "Not a tutor profile." }, { status: 400 });
        }

        // Increment profile view counter (fire-and-forget, don't await)
        prisma.listing.updateMany({
            where: { tutorId },
            data: { viewCount: { increment: 1 } }
        }).catch(() => {});

        // Build WhatsApp link (Indian numbers)
        const rawPhone = (tutor.phone || "").replace(/\D/g, "").slice(-10);
        const whatsappUrl = rawPhone ? `https://wa.me/91${rawPhone}` : null;

        return NextResponse.json({
            name: tutor.name,
            phone: tutor.phoneVerified ? tutor.phone : null,
            email: tutor.email || null,
            whatsappUrl,
            isVerified: tutor.isVerified,
            subjects: tutor.tutorListing?.subjects || [],
            locations: tutor.tutorListing?.locations || [],
        });

    } catch (err) {
        console.error("[TUTOR_CONTACT_ERROR]", err);
        return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
    }
}
