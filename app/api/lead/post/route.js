import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendWelcomeEmail, sendLeadAlertEmail } from "@/lib/email";
import { sendLeadAlertSMS } from "@/lib/sms";

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
        // Highly common in dev for the same phone to be used with different temp emails
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
            // Update existing user with latest details
            user = await prisma.user.update({
                where: { id: user.id },
                data: { name, phone, email }
            });
        } else {
            // Create new user
            user = await prisma.user.create({
                data: {
                    email,
                    name,
                    phone,
                    role: 'STUDENT',
                },
            });
        }

        // 2. Create the Lead
        const lead = await prisma.lead.create({
            data: {
                studentId: user.id,
                subject: subject,
                grade: grade,
                location: location,
                budget: budget,
                description: description,
                status: 'OPEN',
            },
        });

        // 3. Dispatch Asynchronous Notifications
        try {
            // If it's a completely new user, send them a welcome email
            if (isNewUser) {
                sendWelcomeEmail(email, name, "Student").catch(console.error);
            }

            // Fetch active tutors to notify them about the new lead
            prisma.user.findMany({
                where: { role: 'TUTOR' },
                select: { email: true, phone: true },
                take: 50 // In production, filter by subject/location algorithm
            }).then(tutors => {
                const tutorEmails = tutors.map(t => t.email).filter(Boolean);
                if (tutorEmails.length > 0) {
                    sendLeadAlertEmail(tutorEmails, lead).catch(console.error);
                }
                // Send SMS to a small subset (mock)
                tutors.slice(0, 5).forEach(t => {
                    if (t.phone) sendLeadAlertSMS(t.phone, lead).catch(console.error);
                });
            }).catch(console.error);
        } catch (notifyErr) {
            console.error("Non-blocking notification error", notifyErr);
        }

        return NextResponse.json({ success: true, leadId: lead.id }, { status: 201 });
    } catch (error) {
        console.error("Error creating lead:", error);
        // Include error message in response for debugging in dev environment
        return NextResponse.json(
            { success: false, error: error.message || "Failed to post requirement" },
            { status: 500 }
        );
    }
}
