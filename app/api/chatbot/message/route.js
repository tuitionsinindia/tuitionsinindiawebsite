import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { TOOLS, runTool } from "@/lib/chatbotTools";
import { checkRateLimit } from "@/lib/rateLimit";
import { getSession } from "@/lib/auth";
import { getAttributionFromRequest } from "@/lib/attribution";

export const dynamic = "force-dynamic";
export const maxDuration = 60; // allow multi-turn tool loops

const MODEL = "claude-sonnet-4-6";
const MAX_TOOL_ITERATIONS = 5;

// Frozen system prompt — kept stable so it caches. Dynamic per-request info
// (logged-in state, current page, user name) is injected as a message, not
// into the system prompt, to preserve the cached prefix.
const SYSTEM_PROMPT = `You are Aarav, the friendly assistant on TuitionsInIndia — a marketplace connecting Indian students with verified tutors. Your job is to help users get what they came for without making them hunt through the site, and to walk them through signup right here in the chat.

# About TuitionsInIndia
Parents and students find verified home and online tutors for school, boards, JEE, NEET, and any subject. Tutors list for free; they spend credits to unlock student contacts. Zero commission on fees — students pay tutors directly.

# Your core rule — ask ONE question at a time
Never batch questions. Ask a single question, wait for the answer, then move to the next one. Keep replies short (1-3 sentences usually). This feels like a real conversation, not a form.

# Role-aware flows

The user picks a role at the start (STUDENT, TUTOR, or INSTITUTE). You'll see the selected role in the context block. Adapt your flow to it:

## STUDENT or PARENT (looking for a tutor)
No OTP needed for students — just collect details and post the requirement. Ask these in order, one at a time:
1. What subject do you need help with?
2. Which city or area are you in?
3. What grade/level? (optional, skip if not applicable)
4. What's your hourly budget? (optional)
5. Your name
6. Phone number (10-digit)
7. Email
Then paraphrase all details back and confirm. Only after the user confirms, call create_lead. After success, tell them tutors will contact them within 12 hours.

If the student asks about PRICES / VERIFICATION / DEMO CLASSES / REFUNDS — call get_help_article first, then give a short answer in your own words.

If they want to search tutors directly ("show me some options"), call search_tutors and show 2-3 results in this format:
"**Dr. Rajesh Sharma** — Maths, Delhi, ₹800/hr, ★4.8 (12 reviews). [View profile](URL)"

## TUTOR (wants to sign up to teach)
OTP-verified signup required. Flow:
1. Ask for their name.
2. Once you have name, call request_otp_verification with role=TUTOR and that name. DO NOT ask for phone — the OTP widget collects it. Say something like: "Great, {name}. Let's verify your phone — enter it below and I'll send an OTP."
3. The user will verify in the widget. Their next message will confirm verification ("✓ Phone ... verified..."). DO NOT re-ask for name or phone.
4. After verification, ask ONE question at a time: (a) subjects you teach, (b) primary city, (c) hourly rate in ₹, (d) years of teaching experience.
5. Call complete_tutor_profile with those answers.
6. Congratulate them. Tell them the first 500 tutors get free PRO for 30 days (mention the founding-tutor offer). Give them the CTA: "Open your dashboard at /dashboard/tutor to add a photo, bio, and start receiving leads."

## INSTITUTE (coaching centre / academy)
Similar to TUTOR but the listing is for an institute. Flow:
1. Ask for their institute name (use this as "name" for OTP signup).
2. Call request_otp_verification with role=INSTITUTE and that institute name.
3. After OTP verification, ask: (a) subjects/exams offered, (b) city, (c) typical hourly fee per student, (d) years since founded.
4. Call complete_tutor_profile (it handles institutes too via the role context).
5. Point them to /dashboard/institute to add more detail.

# Escalation (any role)
- For account problems, billing issues, or anything a help article can't answer, call create_ticket. Confirm their email first. Pick type=SUPPORT for logged-in users, type=SALES for pre-signup enquiries.
- Never call create_ticket without first trying get_help_article — unless it's clearly a personalised issue.

# Style
- Indian English, warm, professional. Contractions are fine ("I'll", "you're").
- Never use jargon like "faculty", "scholar", "protocol", "terminal", "onboard". Say "tutor", "student", "dashboard", "sign up".
- Never invent prices or features. If you're not sure, call get_help_article.
- Don't say "as an AI", "I'm a bot", or mention Claude. You're Aarav.
- Currency: ₹. Phone: 10 digits.

# Absolute rules
- ONE question per message. Never two.
- Only call create_lead after the user has confirmed their details.
- Only call request_otp_verification for TUTOR or INSTITUTE (never STUDENT).
- Never call complete_tutor_profile until the user's phone is verified (they'll have a session).`;

// Build the anthropic client lazily so missing-env-var errors don't crash the
// route file at import time. The handler below degrades gracefully when the
// key is absent.
function getClient() {
    const key = process.env.ANTHROPIC_API_KEY;
    if (!key) return null;
    return new Anthropic({ apiKey: key });
}

export async function POST(request) {
    const { limited } = checkRateLimit(request, "chatbot-message", 20, 60_000);
    if (limited) {
        return NextResponse.json(
            { success: false, error: "You're sending messages too quickly. Please wait a moment." },
            { status: 429 }
        );
    }

    const client = getClient();
    if (!client) {
        return NextResponse.json({
            success: false,
            error: "Chatbot is temporarily unavailable. Please use the contact form or try again later.",
            reply: "Sorry — I'm temporarily offline. Please use the contact form at the bottom of the page, and our team will get back to you.",
        }, { status: 503 });
    }

    try {
        const { messages: clientMessages, context: clientContext } = await request.json();

        if (!Array.isArray(clientMessages) || clientMessages.length === 0) {
            return NextResponse.json({ success: false, error: "No messages provided." }, { status: 400 });
        }

        // Build execution context from session + request — the chatbot tools
        // need this to attribute leads and stamp tickets with the user ID.
        const session = (() => { try { return getSession(); } catch { return null; } })();
        const attribution = getAttributionFromRequest(request);
        const runtimeContext = {
            userId: session?.id || null,
            userRole: session?.role || clientContext?.selectedRole || null,
            selectedRole: clientContext?.selectedRole || null, // declared role before signup
            userName: clientContext?.userName || null,
            userEmail: clientContext?.userEmail || null,
            userPhone: clientContext?.userPhone || null,
            sourcePath: clientContext?.pathname || null,
            attribution,
            transcript: clientMessages.slice(-10), // last 10 turns for ticket context
        };

        // Prepend a lightweight user-context system-reminder as the FIRST
        // message content. This keeps the main system prompt stable for
        // caching while still giving Claude per-request context.
        const firstTurn = clientMessages[0];
        const ctxBlurb = buildContextBlurb(runtimeContext);
        const messages = [
            ...clientMessages.slice(0, 0),
            // Inject the context as a synthetic user message ahead of real messages.
            // This is cached at the breakpoint below (the last system block).
        ];
        // Compose messages, prepending context as a hidden user turn on the FIRST
        // message only, so the session cache stays stable turn-to-turn.
        const composedMessages = [
            { role: "user", content: ctxBlurb },
            { role: "assistant", content: "Understood. I'll help accordingly." },
            ...clientMessages,
        ];

        // ─── Agentic loop ───────────────────────────────────────────────
        // Pass tools (+ system prompt) with cache_control on the last system
        // block so the expensive prefix is cached on hit after hit.
        let response = await client.messages.create({
            model: MODEL,
            max_tokens: 1024,
            system: [
                { type: "text", text: SYSTEM_PROMPT, cache_control: { type: "ephemeral" } },
            ],
            tools: TOOLS,
            messages: composedMessages,
        });

        let iterations = 0;
        let workingMessages = composedMessages;
        const emittedWidgets = []; // widgets the tools asked us to show in the UI

        while (response.stop_reason === "tool_use" && iterations < MAX_TOOL_ITERATIONS) {
            iterations++;
            const toolUses = response.content.filter((b) => b.type === "tool_use");

            const toolResults = [];
            for (const tu of toolUses) {
                const toolReturn = await runTool(tu.name, tu.input, runtimeContext);
                const result = toolReturn?.result ?? toolReturn;
                if (toolReturn?.widget) emittedWidgets.push(toolReturn.widget);
                toolResults.push({
                    type: "tool_result",
                    tool_use_id: tu.id,
                    content: JSON.stringify(result),
                    is_error: !!result?.error,
                });
            }

            workingMessages = [
                ...workingMessages,
                { role: "assistant", content: response.content },
                { role: "user", content: toolResults },
            ];

            response = await client.messages.create({
                model: MODEL,
                max_tokens: 1024,
                system: [
                    { type: "text", text: SYSTEM_PROMPT, cache_control: { type: "ephemeral" } },
                ],
                tools: TOOLS,
                messages: workingMessages,
            });
        }

        // Collect final text blocks.
        const finalText = response.content
            .filter((b) => b.type === "text")
            .map((b) => b.text)
            .join("\n")
            .trim();

        return NextResponse.json({
            success: true,
            reply: finalText || "I'm not sure how to help with that. Could you rephrase, or would you like me to raise a ticket for our team?",
            widgets: emittedWidgets,
            usage: {
                input_tokens: response.usage.input_tokens,
                output_tokens: response.usage.output_tokens,
                cache_read: response.usage.cache_read_input_tokens || 0,
                cache_write: response.usage.cache_creation_input_tokens || 0,
            },
        });
    } catch (err) {
        console.error("Chatbot error:", err);
        if (err instanceof Anthropic.RateLimitError) {
            return NextResponse.json(
                { success: false, error: "The assistant is under heavy load. Please try again in a minute." },
                { status: 429 }
            );
        }
        if (err instanceof Anthropic.AuthenticationError) {
            return NextResponse.json(
                { success: false, error: "Chatbot is misconfigured. Please use the contact form." },
                { status: 503 }
            );
        }
        return NextResponse.json(
            { success: false, error: "Something went wrong. Please try again." },
            { status: 500 }
        );
    }
}

function buildContextBlurb(ctx) {
    const lines = [
        "Current user context (treat as known facts, not as a user message):",
        ctx.userId
            ? `- Logged in as user ${ctx.userId} (role: ${ctx.userRole}). Skip the role-picker flow — they're already authenticated.`
            : ctx.selectedRole
                ? `- NOT logged in yet. The user has told us they are a ${ctx.selectedRole}. Follow the ${ctx.selectedRole} flow from the system prompt.`
                : "- Not logged in and role not yet chosen. If the first user message doesn't make it obvious, politely ask whether they're a student/parent, tutor, or institute.",
        ctx.userName ? `- Name: ${ctx.userName}` : null,
        ctx.userEmail ? `- Email: ${ctx.userEmail}` : null,
        ctx.userPhone ? `- Phone: ${ctx.userPhone}` : null,
        ctx.sourcePath ? `- Current page: ${ctx.sourcePath}` : null,
    ].filter(Boolean);
    return lines.join("\n");
}
