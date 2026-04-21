import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendWelcomeEmail, sendLeadAlertEmail, sendLeadPostedEmail } from "@/lib/email";
import { sendLeadAlertSMS } from "@/lib/sms";
import { getAttributionFromRequest } from "@/lib/attribution";

export const dynamic = 'force-dynamic';

export async function POST(request) {
    try {
        const body = await request.json();
        let { name, email, phone, subject, location, budget, description, grade, modes } = body;
        const attribution = getAttributionFromRequest(request);

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
            // Create new user — stamp first-touch attribution so marketing can
            // see which ad/campaign brought them in.
            user = await prisma.user.create({
                data: {
                    email,
                    name,
                    phone,
                    role: 'STUDENT',
                    utmSource: attribution.utmSource,
                    utmMedium: attribution.utmMedium,
                    utmCampaign: attribution.utmCampaign,
                    utmContent: attribution.utmContent,
                    utmTerm: attribution.utmTerm,
                    landingPath: attribution.landingPath,
                    referrerHost: attribution.referrerHost,
                },
            });
        }

        // 2. Create the Lead
        // budget arrives as a free-text string (e.g. "300-500 per hour") from the
        // requirement form, but the schema stores it as Int?. Extract the first
        // integer from the string; fall back to null so Prisma never rejects it.
        const budgetInt = budget
            ? (parseInt(String(budget).match(/\d+/)?.[0] ?? '', 10) || null)
            : null;

        const lead = await prisma.lead.create({
            data: {
                studentId: user.id,
                subjects: subject ? [subject] : [],
                grades: grade ? [grade] : [],
                locations: location ? [location] : [],
                modes: Array.isArray(modes) && modes.length > 0 ? modes : ["BOTH"],
                budget: budgetInt,
                description: description,
                status: 'OPEN',
            },
        });

        // 3. Dispatch asynchronous notifications.
        // Resend has a 2-req/sec rate limit on the free plan, so we stagger
        // the three fan-out sends by ~500ms rather than firing them in parallel.
        // Everything runs fire-and-forget so the HTTP response isn't blocked.
        try {
            const delay = (ms) => new Promise((r) => setTimeout(r, ms));

            (async () => {
                if (isNewUser) {
                    await sendWelcomeEmail(email, name, "Student");
                    await delay(500);
                }
                await sendLeadPostedEmail(email, name, lead);
                await delay(500);

                const tutors = await prisma.user.findMany({
                    where: { role: 'TUTOR' },
                    select: { email: true, phone: true },
                    take: 50, // TODO: filter by matching subject/location
                });

                const tutorEmails = tutors.map(t => t.email).filter(Boolean);
                if (tutorEmails.length > 0) {
                    await sendLeadAlertEmail(tutorEmails, lead);
                }
                // SMS burst — Twilio handles its own rate limiting.
                for (const t of tutors.slice(0, 5)) {
                    if (t.phone) sendLeadAlertSMS(t.phone, lead).catch(console.error);
                }
            })().catch((err) => console.error("Lead notification error:", err));
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
