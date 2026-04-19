// Tool definitions + runtime handlers for the chatbot.
// Split from the route file so the tool contract is testable and auditable
// independent of the Claude call itself.

import prisma from "@/lib/prisma";
import { searchArticles, getArticleBySlug } from "@/lib/helpCenter";
import { sendTicketNotificationEmail, sendWelcomeEmail, sendLeadAlertEmail } from "@/lib/email";
import { maybeGrantEarlyTutorPro } from "@/lib/earlyAdopterPromo";

// ─── Tool schemas sent to Claude ──────────────────────────────────────────
// Keep this list stable — re-ordering or renaming invalidates the prompt
// cache (tools render at position 0, ahead of system).
export const TOOLS = [
    {
        name: "search_tutors",
        description:
            "Search the active tutor database. Use this when the user asks about finding a tutor in a specific subject or city. Returns up to 5 matches with name, subject, city, hourly rate and verified status.",
        input_schema: {
            type: "object",
            properties: {
                subject: { type: "string", description: "Subject name, e.g. 'Mathematics', 'Physics', 'English'. Optional." },
                city: { type: "string", description: "City or area name, e.g. 'Delhi', 'Mumbai', 'Koramangala'. Optional." },
                grade: { type: "string", description: "Grade level, e.g. 'Class 10', 'JEE', 'College'. Optional." },
                max_budget: { type: "number", description: "Max hourly rate in rupees. Optional." },
            },
        },
    },
    {
        name: "create_lead",
        description:
            "Register a new student user and post their tuition requirement. Use this ONLY after confirming with the user that they want tutors to contact them, and after you have collected their name, phone, email, subject and city. Creates the account and posts the lead in one step.",
        input_schema: {
            type: "object",
            properties: {
                name: { type: "string", description: "Full name of the parent or student." },
                phone: { type: "string", description: "10-digit Indian mobile number." },
                email: { type: "string", description: "Email address." },
                subject: { type: "string", description: "Subject they need tuition in." },
                city: { type: "string", description: "City or area." },
                grade: { type: "string", description: "Grade / level. Optional." },
                budget: { type: "number", description: "Hourly budget in rupees. Optional." },
                description: { type: "string", description: "Any extra notes (timing, board, goals). Optional." },
            },
            required: ["name", "phone", "email", "subject", "city"],
        },
    },
    {
        name: "get_help_article",
        description:
            "Look up a help-center article to answer the user's question. Use BEFORE escalating to a ticket if the question is about pricing, signup, verification, demo classes or refunds. Returns title and body.",
        input_schema: {
            type: "object",
            properties: {
                query: { type: "string", description: "Keywords to search the help center for. Be specific." },
            },
            required: ["query"],
        },
    },
    {
        name: "create_ticket",
        description:
            "Raise a ticket for the human team to handle. Use this ONLY if the user's issue cannot be resolved by get_help_article or the other tools — for example, a specific account problem, a payment dispute, a custom request. Always confirm the user's email or phone first so the team can reply. Tickets are emailed to the team and appear in the admin dashboard.",
        input_schema: {
            type: "object",
            properties: {
                type: {
                    type: "string",
                    enum: ["SALES", "SUPPORT"],
                    description: "SALES for pre-signup enquiries (pricing questions, custom plans, partnership). SUPPORT for existing-user issues (bug, billing, account).",
                },
                subject: { type: "string", description: "One-line summary. Max 120 chars." },
                message: { type: "string", description: "Full description of the issue. Include everything the user said that's relevant." },
                name: { type: "string", description: "User's name. Optional." },
                email: { type: "string", description: "Email to reply to. Ask the user if not already provided." },
                phone: { type: "string", description: "Phone number. Optional if email is provided." },
            },
            required: ["type", "subject", "message"],
        },
    },
];

// ─── Handlers — invoked by the API route when Claude emits a tool_use ────
export async function runTool(name, input, context) {
    try {
        if (name === "search_tutors") return await handleSearchTutors(input);
        if (name === "get_help_article") return handleGetHelpArticle(input);
        if (name === "create_lead") return await handleCreateLead(input, context);
        if (name === "create_ticket") return await handleCreateTicket(input, context);
        return { error: `Unknown tool: ${name}` };
    } catch (err) {
        console.error(`Tool ${name} error:`, err);
        return { error: err.message || "Tool execution failed." };
    }
}

async function handleSearchTutors({ subject, city, grade, max_budget }) {
    const where = { isActive: true };
    if (subject) {
        const s = subject.trim();
        where.subjects = { hasSome: [s, s[0].toUpperCase() + s.slice(1).toLowerCase()] };
    }
    if (city) {
        const c = city.trim();
        where.locations = { hasSome: [c, c[0].toUpperCase() + c.slice(1).toLowerCase()] };
    }
    if (grade) {
        where.grades = { hasSome: [grade] };
    }
    if (max_budget && Number(max_budget) > 0) {
        where.hourlyRate = { lte: Number(max_budget) };
    }

    const listings = await prisma.listing.findMany({
        where,
        include: { tutor: { select: { name: true, isVerified: true } } },
        orderBy: [{ rating: "desc" }, { reviewCount: "desc" }],
        take: 5,
    });

    if (listings.length === 0) {
        return { found: 0, tutors: [], note: "No active tutors match those filters right now." };
    }

    return {
        found: listings.length,
        tutors: listings.map((l) => ({
            id: l.id,
            name: l.tutor.name || "Tutor",
            subjects: (l.subjects || []).slice(0, 3),
            city: (l.locations || [])[0] || "Online",
            hourly_rate: l.hourlyRate ? `₹${l.hourlyRate}/hr` : "Rate on request",
            experience_years: l.experience || null,
            rating: l.rating || null,
            reviews: l.reviewCount || 0,
            verified: !!l.tutor.isVerified,
            profile_url: `https://tuitionsinindia.com/search/${l.id}`,
        })),
    };
}

function handleGetHelpArticle({ query }) {
    if (!query) return { articles: [] };
    // Try exact slug first
    const direct = getArticleBySlug(query);
    if (direct) return { articles: [{ title: direct.title, body: direct.body, slug: direct.slug }] };
    const matches = searchArticles(query);
    return {
        found: matches.length,
        articles: matches.map((a) => ({ title: a.title, body: a.body, slug: a.slug })),
    };
}

async function handleCreateLead(input, context) {
    const { name, phone, email, subject, city, grade, budget, description } = input;
    const cleanPhone = String(phone).replace(/[^0-9]/g, "").slice(-10);
    const cleanEmail = String(email).trim().toLowerCase();

    if (cleanPhone.length !== 10) return { error: "Phone number must be a 10-digit Indian mobile." };
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(cleanEmail)) return { error: "Invalid email address." };

    // Find or create student user
    let user = await prisma.user.findFirst({ where: { OR: [{ email: cleanEmail }, { phone: cleanPhone }] } });
    const isNew = !user;
    if (user) {
        user = await prisma.user.update({
            where: { id: user.id },
            data: { name: name.trim(), phone: cleanPhone, email: cleanEmail },
        });
    } else {
        const attribution = context.attribution || {};
        const earlyPro = await maybeGrantEarlyTutorPro("STUDENT"); // returns null for STUDENT, but safe
        user = await prisma.user.create({
            data: {
                name: name.trim(),
                phone: cleanPhone,
                email: cleanEmail,
                role: "STUDENT",
                utmSource: attribution.utmSource,
                utmMedium: attribution.utmMedium,
                utmCampaign: attribution.utmCampaign,
                utmContent: attribution.utmContent,
                utmTerm: attribution.utmTerm,
                landingPath: attribution.landingPath,
                referrerHost: attribution.referrerHost,
                ...(earlyPro || {}),
            },
        });
    }

    const lead = await prisma.lead.create({
        data: {
            studentId: user.id,
            subjects: subject ? [subject] : [],
            grades: grade ? [grade] : [],
            locations: city ? [city] : [],
            modes: ["BOTH"],
            budget: budget ? Number(budget) : null,
            description: description || `Requested via chatbot: ${subject}${city ? ` in ${city}` : ""}`,
            status: "OPEN",
        },
    });

    // Fire-and-forget notifications
    if (isNew) sendWelcomeEmail(cleanEmail, name.trim(), "Student").catch(() => {});
    prisma.user.findMany({
        where: { role: "TUTOR" },
        select: { email: true },
        take: 50,
    }).then((tutors) => {
        const emails = tutors.map((t) => t.email).filter(Boolean);
        if (emails.length) sendLeadAlertEmail(emails, lead).catch(() => {});
    }).catch(() => {});

    return {
        success: true,
        lead_id: lead.id,
        user_id: user.id,
        is_new_user: isNew,
        message: `Lead posted. Matching tutors in ${city || "your area"} will contact ${cleanPhone} within 12 hours.`,
    };
}

async function handleCreateTicket(input, context) {
    const { type, subject, message, name, email, phone } = input;
    const ticket = await prisma.ticket.create({
        data: {
            type: type === "SALES" ? "SALES" : "SUPPORT",
            subject: String(subject).slice(0, 200),
            body: String(message).slice(0, 10000),
            name: name ? String(name).slice(0, 200) : context.userName || null,
            email: email ? String(email).toLowerCase().slice(0, 200) : context.userEmail || null,
            phone: phone ? String(phone).replace(/[^0-9+]/g, "").slice(0, 20) : context.userPhone || null,
            userId: context.userId || null,
            sourcePath: context.sourcePath || null,
            chatTranscript: context.transcript || undefined,
        },
    });
    sendTicketNotificationEmail(ticket).catch(() => {});
    return {
        success: true,
        ticket_id: ticket.id,
        message: `Ticket raised. Our ${type === "SALES" ? "sales" : "support"} team will reply within 24 hours.`,
    };
}
