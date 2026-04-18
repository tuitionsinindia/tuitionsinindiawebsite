import { NextResponse } from "next/server";
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
            // Create new user with 5 welcome credits
            user = await prisma.user.create({
                data: {
                    email,
                    name,
                    phone,
                    role: 'TUTOR',
                    credits: 5,
                },
            });
        }

        // 2. Create the Listing
        const isNewUser = !existingUser;
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
                    type: "SYSTEM",
                    title: "Welcome to TuitionsInIndia! 🎉",
                    body: "Your profile is live. We've given you 5 free credits to get started — use them to unlock student contact details from your dashboard.",
                    link: "/dashboard/tutor",
                },
            }).catch(() => {});
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
