import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

// Free contact views per month for students (separate from demo booking limit)
const FREE_CONTACT_VIEWS_PER_MONTH = 3;

// GET /api/tutor/contact?tutorId=xxx
// Returns a tutor's contact details.
// Students: limited to 3 free contact views/month. Tutors/admins: unlimited.
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

        // Students: enforce monthly contact view limit
        if (session.role === "STUDENT") {
            const student = await prisma.user.findUnique({
                where: { id: session.id },
                select: { contactViewsThisMonth: true },
            });

            if (!student) {
                return NextResponse.json({ error: "Account not found." }, { status: 404 });
            }

            if (student.contactViewsThisMonth >= FREE_CONTACT_VIEWS_PER_MONTH) {
                return NextResponse.json({
                    error: `You've used your ${FREE_CONTACT_VIEWS_PER_MONTH} free contact views this month. Your limit resets on the 1st of next month.`,
                    limitReached: true,
                    used: student.contactViewsThisMonth,
                    limit: FREE_CONTACT_VIEWS_PER_MONTH,
                }, { status: 429 });
            }

            // Increment the counter atomically
            await prisma.user.update({
                where: { id: session.id },
                data: { contactViewsThisMonth: { increment: 1 } },
            });
        }

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
                privacySettings: true,
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

        // Increment profile view counter (fire-and-forget)
        prisma.listing.updateMany({
            where: { tutorId },
            data: { viewCount: { increment: 1 } }
        }).catch(() => {});

        // Respect privacy settings — hide phone if tutor opted out
        const privacySettings = tutor.privacySettings || {};
        const showPhone = tutor.phoneVerified && (privacySettings.showPhonePublicly !== false);
        const resolvedPhone = showPhone ? tutor.phone : null;

        // Build WhatsApp link (Indian numbers)
        const rawPhone = (resolvedPhone || "").replace(/\D/g, "").slice(-10);
        const whatsappUrl = rawPhone ? `https://wa.me/91${rawPhone}` : null;

        return NextResponse.json({
            name: tutor.name,
            phone: resolvedPhone,
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
