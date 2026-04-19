import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendTicketNotificationEmail } from "@/lib/email";
import { checkRateLimit } from "@/lib/rateLimit";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

// Public endpoint — anyone (logged in or not) can raise a ticket.
// Used by the chatbot's create_ticket tool and by the /contact page.
export async function POST(request) {
    // Rate limit: 5 tickets / minute per IP to prevent spam
    const { limited } = checkRateLimit(request, "ticket-create", 5, 60_000);
    if (limited) {
        return NextResponse.json(
            { success: false, error: "You're creating tickets too quickly. Please wait a moment." },
            { status: 429 }
        );
    }

    try {
        const body = await request.json();
        let { type, subject, message, name, email, phone, sourcePath, chatTranscript } = body;

        // Normalise + validate
        type = type === "SALES" ? "SALES" : "SUPPORT";
        subject = (subject || "").trim().slice(0, 200);
        message = (message || "").trim().slice(0, 10000);
        name = name ? String(name).trim().slice(0, 200) : null;
        email = email ? String(email).trim().toLowerCase().slice(0, 200) : null;
        phone = phone ? String(phone).replace(/[^0-9+]/g, "").slice(0, 20) : null;
        sourcePath = sourcePath ? String(sourcePath).slice(0, 500) : null;

        if (!subject || !message) {
            return NextResponse.json(
                { success: false, error: "A subject and message are required." },
                { status: 400 }
            );
        }
        if (!email && !phone) {
            return NextResponse.json(
                { success: false, error: "We need at least an email or phone number to get back to you." },
                { status: 400 }
            );
        }

        // Optional session — links ticket to the user if they're logged in.
        let userId = null;
        try {
            const session = getSession();
            if (session?.id) userId = session.id;
        } catch {
            // Not logged in — fine, ticket stays anonymous.
        }

        const ticket = await prisma.ticket.create({
            data: {
                type,
                subject,
                body: message,
                name,
                email,
                phone,
                sourcePath,
                userId,
                chatTranscript: chatTranscript || undefined,
            },
        });

        // Email notification is best-effort — don't block the response.
        sendTicketNotificationEmail(ticket).catch((err) =>
            console.error("Failed to send ticket notification:", err)
        );

        return NextResponse.json({
            success: true,
            ticketId: ticket.id,
            message: `Ticket received. We'll reply to ${email || phone} shortly.`,
        });
    } catch (err) {
        console.error("Ticket create error:", err);
        return NextResponse.json(
            { success: false, error: "Could not create ticket. Please try again or email us directly." },
            { status: 500 }
        );
    }
}
