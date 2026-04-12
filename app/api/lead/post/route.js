import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendWelcomeEmail, sendLeadAlertEmail } from "@/lib/email";
import { sendLeadAlertSMS } from "@/lib/sms";
import { createNotifications } from "@/lib/notifications";

export const dynamic = 'force-dynamic';

export async function POST(request) {
    try {
        const body = await request.json();
        let { name, email, phone, subject, location, budget, description, grade } = body;
        // Parse budget safely — form sends strings like "1000/hr", schema expects Int?
        const budgetInt = budget ? parseInt(String(budget).replace(/\D/g, ''), 10) || null : null;

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
                subjects: subject ? [subject] : [],
                grades: grade ? [grade] : [],
                locations: location ? [location] : [],
                budget: budgetInt,
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

            // Fetch tutors whose listing subjects overlap with the lead
            const leadSubjects = lead.subjects?.length ? lead.subjects.map(s => s.toUpperCase()) : [];
            prisma.user.findMany({
                where: {
                    role: 'TUTOR',
                    tutorListing: leadSubjects.length > 0
                        ? { subjects: { hasSome: leadSubjects }, isActive: true }
                        : { isActive: true },
                },
                select: { id: true, email: true, phone: true },
                take: 50,
            }).then(tutors => {
                const tutorEmails = tutors.map(t => t.email).filter(Boolean);
                if (tutorEmails.length > 0) {
                    sendLeadAlertEmail(tutorEmails, lead).catch(console.error);
                }
                // Send SMS to a small subset (mock)
                tutors.slice(0, 5).forEach(t => {
                    if (t.phone) sendLeadAlertSMS(t.phone, lead).catch(console.error);
                });
                // In-app notifications for all matching tutors
                const tutorIds = tutors.map(t => t.id);
                const subjectLabel = lead.subjects?.[0] || "a subject";
                createNotifications(tutorIds, {
                    type: "NEW_LEAD",
                    title: "New student requirement",
                    body: `A student is looking for a ${subjectLabel} tutor. Unlock the lead to connect.`,
                    link: `/dashboard/tutor?tab=leads`,
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
