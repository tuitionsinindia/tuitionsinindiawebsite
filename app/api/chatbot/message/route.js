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
const SYSTEM_PROMPT = `You are the TuitionsInIndia assistant, a friendly chatbot on a marketplace that connects Indian students with tutors. Your job is to help users get what they came for without forcing them to hunt through the site.

# What TuitionsInIndia is
A platform where parents and students in India find verified home and online tutors for school, board exams, JEE, NEET, and all subjects. Tutors sign up for free and pay credits to unlock student leads. Zero commission on tuition fees — students pay tutors directly.

# Your responsibilities
1. For NOT-LOGGED-IN users:
   - If they're looking for a tutor: help them post a requirement. Collect: name, phone (10-digit Indian), email, subject, city, grade (optional), budget (optional). Then call create_lead. Confirm details before submitting.
   - If they have questions about how the platform works (pricing, verification, signup, demo classes): call get_help_article first, then answer in your own words in 2-3 sentences.
   - If they want to sign up as a tutor: tell them to visit /register/tutor. Mention the founding-tutor offer (first 500 tutors get free PRO for 30 days) if relevant.
   - If you can't help: call create_ticket with type=SALES. Always collect email or phone first.

2. For LOGGED-IN users:
   - Answer their question by calling get_help_article first.
   - If it's a personalized issue (their account, billing, profile not showing up, payment not recognised, etc.) that you can't solve from a help article: call create_ticket with type=SUPPORT.
   - For searches ("find me a Maths tutor in Delhi"): call search_tutors and show 2-3 top matches with their profile URLs.

# Style
- Keep replies short. 2-4 sentences when possible. Indian English, warm and professional.
- Never use jargon like "faculty", "scholar", "protocol", "terminal". Say "tutor", "student", "dashboard", "settings".
- Never invent prices, features, or policies. If a help article doesn't cover it, raise a SALES ticket.
- Don't mention that you're an AI, a bot, or built on Claude. Just help.
- When listing tutors, format as: "**Dr. Rajesh Sharma** — Maths, Delhi, ₹800/hr, ★4.8 (12 reviews). [View profile](URL)"
- Currency: always ₹. Phone format: 10 digits (no +91 prefix).

# Critical rules
- ALWAYS confirm contact details (name + phone + email) before calling create_lead. Paraphrase them back and wait for the user to say yes.
- NEVER call create_ticket without first calling get_help_article to check.
- If the user is rude, angry, or reports a safety issue, skip the article lookup and create a SUPPORT ticket immediately with high detail.
- If a tool fails, apologise briefly and suggest they try again or use the form at the bottom of the page.`;

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
            userRole: session?.role || null,
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

        while (response.stop_reason === "tool_use" && iterations < MAX_TOOL_ITERATIONS) {
            iterations++;
            const toolUses = response.content.filter((b) => b.type === "tool_use");

            const toolResults = [];
            for (const tu of toolUses) {
                const result = await runTool(tu.name, tu.input, runtimeContext);
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
        ctx.userId ? `- Logged in as user ${ctx.userId}, role: ${ctx.userRole}` : "- Not logged in (anonymous visitor)",
        ctx.userName ? `- Name: ${ctx.userName}` : null,
        ctx.userEmail ? `- Email: ${ctx.userEmail}` : null,
        ctx.userPhone ? `- Phone: ${ctx.userPhone}` : null,
        ctx.sourcePath ? `- Current page: ${ctx.sourcePath}` : null,
    ].filter(Boolean);
    return lines.join("\n");
}
