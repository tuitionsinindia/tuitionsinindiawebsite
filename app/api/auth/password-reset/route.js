import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Resend } from "resend";
import crypto from "crypto";

const resend = new Resend(process.env.RESEND_API_KEY || "re_dummy_key");

export async function POST(request) {
    try {
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
                html: `
                    <div style="font-family: sans-serif; max-width: 480px; margin: auto; padding: 32px; border: 1px solid #e5e7eb; border-radius: 12px;">
                        <h2 style="color: #111827; margin-bottom: 8px;">Reset your password</h2>
                        <p style="color: #6b7280;">Click the button below to set a new password. This link expires in 1 hour.</p>
                        <a href="${resetLink}" style="display: inline-block; margin: 24px 0; padding: 12px 28px; background: #2563eb; color: white; text-decoration: none; border-radius: 8px; font-weight: 600;">Reset Password</a>
                        <p style="color: #9ca3af; font-size: 12px;">If you didn't request this, you can safely ignore this email.</p>
                    </div>
                `,
            });
        }

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("Password reset error:", err);
        return NextResponse.json({ error: "Failed to send reset email" }, { status: 500 });
    }
}
