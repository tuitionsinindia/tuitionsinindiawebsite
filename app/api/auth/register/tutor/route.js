import { NextResponse } from "next/server";
import { sendTutorWelcomeEmail } from "@/lib/email";
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function POST(request) {
    try {
        const body = await request.json();
        let { name, email, phone, title, bio, subjects, locations, hourlyRate, grades } = body;

        // Validation
        if (!email || !name || !phone || !title || !subjects) {
            return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
        }

        email = email.trim().toLowerCase();
        name = name.trim();
        phone = phone.trim();

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
            include: { tutorListing: true }
        });

        if (existingUser && existingUser.tutorListing) {
            return NextResponse.json({ success: false, error: "Tutor profile already exists for this email" }, { status: 400 });
        }

        // Process comma separated lists
        const subjectList = subjects.split(',').map(s => s.trim()).filter(s => s !== "");
        const locationList = locations.split(',').map(l => l.trim()).filter(l => l !== "");
        const gradeList = grades ? grades.split(',').map(g => g.trim()).filter(g => g !== "") : [];

        // 1. Find or create the Tutor user
        let user = await prisma.user.findFirst({
            where: {
                OR: [
                    { email },
                    { phone }
                ]
            }
        });

        const isNewUser = !user;

        if (user) {
            // Update existing user to TUTOR role
            user = await prisma.user.update({
                where: { id: user.id },
                data: {
                    name,
                    phone,
                    email,
                    role: 'TUTOR',
                }
            });
        } else {
            // Create new user
            user = await prisma.user.create({
                data: {
                    email,
                    name,
                    phone,
                    role: 'TUTOR',
                },
            });
        }

        // 2. Create the Listing
        const listing = await prisma.listing.create({
            data: {
                tutorId: user.id,
                title,
                bio,
                subjects: subjectList,
                grades: gradeList,
                locations: locationList,
                hourlyRate: parseInt(hourlyRate) || 0,
                isActive: true,
            },
        });

        // 3. Welcome notification with free credits info (new tutors only)
        if (isNewUser) {
            await prisma.notification.create({
                data: {
                    userId: user.id,
                    type: "WELCOME",
                    title: "Welcome to TuitionsInIndia!",
                    body: "Your tutor profile is live. Complete your profile and apply for a free Verified badge to get more enquiries.",
                    link: "/dashboard/tutor",
                },
            }).catch(() => {});
        }

        // Send welcome email (non-blocking)
        if (isNewUser && user.email) {
            sendTutorWelcomeEmail(user.email, user.name || "there").catch(() => {});
        }

        return NextResponse.json({ success: true, listingId: listing.id }, { status: 201 });
    } catch (error) {
        console.error("Error creating tutor profile:", error);
        return NextResponse.json(
            { success: false, error: error.message || "Failed to create profile" },
            { status: 500 }
        );
    }
}
