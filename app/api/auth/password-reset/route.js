import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Resend } from "resend";
import crypto from "crypto";
import { passwordResetTemplate } from "@/lib/emailTemplates";
import { checkRateLimit } from "@/lib/rateLimit";

const resend = new Resend(process.env.RESEND_API_KEY || "re_dummy_key");

export async function POST(request) {
    try {
        const { limited } = checkRateLimit(request, "password-reset", 3, 300000);
        if (limited) {
            return NextResponse.json({ error: "Too many attempts. Please wait 5 minutes." }, { status: 429 });
        }

        const { email } = await request.json();

        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        const user = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });

        // Always return success to prevent email enumeration
        if (!user) {
            return NextResponse.json({ success: true });
        }

        // Generate a short-lived reset token (1 hour)
        const token = crypto.randomBytes(32).toString("hex");
        const expires = new Date(Date.now() + 60 * 60 * 1000);

        // Store token in notificationPrefs temporarily (reusing existing JSON field)
        await prisma.user.update({
            where: { id: user.id },
            data: {
                notificationPrefs: {
                    ...(user.notificationPrefs || {}),
                    _resetToken: token,
                    _resetExpires: expires.toISOString(),
                },
            },
        });

        const resetLink = `${process.env.NEXT_PUBLIC_APP_URL || "https://tuitionsinindia.com"}/reset-password?token=${token}&uid=${user.id}`;

        if (!process.env.RESEND_API_KEY) {
            console.log(`[MOCK EMAIL] Password reset link for ${email}: ${resetLink}`);
        } else {
            await resend.emails.send({
                from: "Tuitions in India <noreply@tuitionsinindia.com>",
                to: email,
                subject: "Reset your password — Tuitions in India",
                html: passwordResetTemplate(resetLink),
            });
        }

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("Password reset error:", err);
        return NextResponse.json({ error: "Failed to send reset email" }, { status: 500 });
    }
}
