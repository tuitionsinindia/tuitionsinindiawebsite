import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function POST(request) {
    try {
        const body = await request.json();
        let { name, email, phone, subject, location, budget, description, grade } = body;

        // Validation
        if (!email || !name || !phone) {
            return NextResponse.json({ success: false, error: "Missing required contact details" }, { status: 400 });
        }

        email = email.trim().toLowerCase();
        name = name.trim();
        phone = phone.trim();

        if (email === "" || name === "" || phone === "") {
            return NextResponse.json({ success: false, error: "Contact details cannot be empty" }, { status: 400 });
        }

        // 1. Find or create the Student user
        const user = await prisma.user.upsert({
            where: { email },
            update: {
                name,
                phone,
            },
            create: {
                email,
                name,
                phone,
                role: 'STUDENT',
            },
        });

        // 2. Create the Lead
        const lead = await prisma.lead.create({
            data: {
                studentId: user.id,
                subject: subject,
                location: location,
                budget: budget,
                description: `${grade ? `Grade: ${grade}. ` : ''}${description}`,
                status: 'OPEN',
            },
        });

        return NextResponse.json({ success: true, leadId: lead.id }, { status: 201 });
    } catch (error) {
        console.error("Error creating lead:", error);
        return NextResponse.json(
            { success: false, error: "Failed to post requirement" },
            { status: 500 }
        );
    }
}
