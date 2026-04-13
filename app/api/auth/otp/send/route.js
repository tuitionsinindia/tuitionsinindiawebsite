import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendOTP } from "@/lib/sms";
import { otpStore } from "@/lib/otpStore";
import { checkRateLimit } from "@/lib/rateLimit";

export async function POST(request) {
    try {
        // Rate limit: 5 OTP requests per minute per IP
        const { limited } = checkRateLimit(request, "otp-send", 5, 60000);
        if (limited) {
            return NextResponse.json({ error: "Too many requests. Please wait a minute and try again." }, { status: 429 });
        }

        const { name, phone, role, isRegistration, userId } = await request.json();

        if (!phone || !role) {
            return NextResponse.json({ error: "Phone and role are required." }, { status: 400 });
        }

        // Generate a 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Store OTP with 10-minute expiry
        otpStore.set(phone, {
            code: otp,
            expires: Date.now() + 10 * 60 * 1000,
        });

        let user;

        if (userId) {
            // Google OAuth flow: user already exists, just need to verify their phone
            user = await prisma.user.findUnique({ where: { id: userId } });
            if (!user) {
                return NextResponse.json({ error: "User not found." }, { status: 404 });
            }
            // Check if this phone belongs to a different user
            const phoneOwner = await prisma.user.findUnique({ where: { phone } });
            if (phoneOwner && phoneOwner.id !== userId) {
                return NextResponse.json({
                    error: "This phone number is already registered to another account. Please use a different number.",
                }, { status: 409 });
            }
        } else if (isRegistration) {
            // Registration: create if new, update name if existing
            const existing = await prisma.user.findUnique({ where: { phone } });
            if (existing) {
                user = await prisma.user.update({
                    where: { phone },
                    data: { name: name || existing.name },
                });
            } else {
                user = await prisma.user.create({
                    data: { phone, name: name || "User", role, phoneVerified: false },
                });
            }
        } else {
            // Login: only find existing user, don't create
            user = await prisma.user.findUnique({ where: { phone } });
            if (!user) {
                return NextResponse.json({
                    error: "No account found with this phone number. Please register first.",
                }, { status: 404 });
            }
        }

        // Send OTP via Twilio
        const formattedPhone = "+91" + phone.replace(/\D/g, "").slice(-10);
        await sendOTP(formattedPhone, otp);

        console.log(`[AUTH] OTP ${otp} dispatched to ${phone}`);

        return NextResponse.json({
            success: true,
            message: "OTP sent successfully",
            userId: user.id,
        });
    } catch (error) {
        console.error("OTP Send Error:", error);
        return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 });
    }
}
