import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function POST(request) {
    try {
        const body = await request.json();
        let { organizationName, email, phone, website, bio, subjects, locations, foundingYear } = body;

        // Validation
        if (!email || !organizationName || !phone || !subjects || !locations) {
            return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
        }

        email = email.trim().toLowerCase();
        organizationName = organizationName.trim();
        phone = phone.trim();

        // Process comma separated lists
        const subjectList = subjects.split(',').map(s => s.trim()).filter(s => s !== "");
        const locationList = locations.split(',').map(l => l.trim()).filter(l => l !== "");

        // 1. Find or create the Institute user
        let user = await prisma.user.findFirst({
            where: {
                OR: [
                    { email },
                    { phone }
                ]
            }
        });

        if (user) {
            // Update existing user to INSTITUTE role
            user = await prisma.user.update({
                where: { id: user.id },
                data: {
                    name: organizationName,
                    phone,
                    email,
                    role: 'INSTITUTE',
                }
            });
        } else {
            // Create new user
            user = await prisma.user.create({
                data: {
                    email,
                    name: organizationName,
                    phone,
                    role: 'INSTITUTE',
                },
            });
        }

        // 2. Create the Listing (Institutes use the Listing model for directory visibility)
        const listing = await prisma.listing.upsert({
            where: { tutorId: user.id },
            update: {
                title: organizationName,
                bio: `${bio}${website ? `\n\nWebsite: ${website}` : ''}${foundingYear ? `\nEstablished: ${foundingYear}` : ''}`,
                subjects: subjectList,
                locations: locationList,
                isActive: false, // Profiles require admin approval
            },
            create: {
                tutorId: user.id,
                title: organizationName,
                bio: `${bio}${website ? `\n\nWebsite: ${website}` : ''}${foundingYear ? `\nEstablished: ${foundingYear}` : ''}`,
                subjects: subjectList,
                locations: locationList,
                isActive: false,
            },
        });

        return NextResponse.json({ success: true, listingId: listing.id }, { status: 201 });
    } catch (error) {
        console.error("Error creating institute profile:", error);
        return NextResponse.json(
            { success: false, error: error.message || "Failed to create profile" },
            { status: 500 }
        );
    }
}
