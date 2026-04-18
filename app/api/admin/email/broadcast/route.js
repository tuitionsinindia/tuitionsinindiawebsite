import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { isAdminAuthorized } from "@/lib/adminAuth";
import { Resend } from "resend";

export const dynamic = 'force-dynamic';

const MAX_RECIPIENTS = 500;
const BATCH_SIZE = 10;
const BATCH_DELAY_MS = 200;

function buildHtml(body) {
    return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;padding:24px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:8px;overflow:hidden;border:1px solid #e5e7eb;max-width:600px;width:100%;">
        <tr>
          <td style="background:#2563EB;padding:16px 24px;">
            <span style="color:#fff;font-size:20px;font-weight:600;">TuitionsinIndia</span>
          </td>
        </tr>
        <tr>
          <td style="padding:24px;color:#111827;font-size:15px;line-height:1.6;">
            ${body.replace(/\n/g, "<br>")}
          </td>
        </tr>
        <tr>
          <td style="padding:16px 24px;border-top:1px solid #e5e7eb;color:#6b7280;font-size:13px;">
            To unsubscribe, reply to this email.
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

async function getUsersBySegment(segment) {
    const notSuspended = { isSuspended: false };

    switch (segment) {
        case "TUTOR":
            return prisma.user.findMany({
                where: { role: "TUTOR", ...notSuspended },
                select: { email: true, name: true },
                take: MAX_RECIPIENTS,
            });
        case "STUDENT":
            return prisma.user.findMany({
                where: { role: "STUDENT", ...notSuspended },
                select: { email: true, name: true },
                take: MAX_RECIPIENTS,
            });
        case "ALL":
            return prisma.user.findMany({
                where: { ...notSuspended },
                select: { email: true, name: true },
                take: MAX_RECIPIENTS,
            });
        case "PRO":
            return prisma.user.findMany({
                where: { role: "TUTOR", subscriptionTier: "PRO", ...notSuspended },
                select: { email: true, name: true },
                take: MAX_RECIPIENTS,
            });
        case "ELITE":
            return prisma.user.findMany({
                where: { role: "TUTOR", subscriptionTier: "ELITE", ...notSuspended },
                select: { email: true, name: true },
                take: MAX_RECIPIENTS,
            });
        case "UNVERIFIED_TUTOR":
            return prisma.user.findMany({
                where: { role: "TUTOR", isVerified: false, ...notSuspended },
                select: { email: true, name: true },
                take: MAX_RECIPIENTS,
            });
        default:
            return [];
    }
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function POST(request) {
    if (!isAdminAuthorized(request)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { subject, body: emailBody, segment, preview } = body;

        if (!subject || !emailBody || !segment) {
            return NextResponse.json({ error: "subject, body, and segment are required" }, { status: 400 });
        }

        const validSegments = ["TUTOR", "STUDENT", "ALL", "PRO", "ELITE", "UNVERIFIED_TUTOR"];
        if (!validSegments.includes(segment)) {
            return NextResponse.json({ error: `Invalid segment. Must be one of: ${validSegments.join(", ")}` }, { status: 400 });
        }

        const users = await getUsersBySegment(segment);

        if (preview) {
            return NextResponse.json({
                count: users.length,
                emails: users.slice(0, 5).map((u) => u.email),
            });
        }

        const resend = new Resend(process.env.RESEND_API_KEY);
        const html = buildHtml(emailBody);

        let sent = 0;
        let failed = 0;

        // Send in batches
        for (let i = 0; i < users.length; i += BATCH_SIZE) {
            const batch = users.slice(i, i + BATCH_SIZE);

            await Promise.all(
                batch.map(async (user) => {
                    try {
                        await resend.emails.send({
                            from: "TuitionsinIndia <no-reply@tuitionsinindia.com>",
                            to: user.email,
                            subject,
                            html,
                        });
                        sent++;
                    } catch (err) {
                        console.error(`Failed to send to ${user.email}:`, err.message);
                        failed++;
                    }
                })
            );

            // Delay between batches (skip delay after the last batch)
            if (i + BATCH_SIZE < users.length) {
                await sleep(BATCH_DELAY_MS);
            }
        }

        return NextResponse.json({ success: true, sent, failed });
    } catch (error) {
        console.error("Admin email broadcast error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
