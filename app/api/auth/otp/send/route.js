import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendOTP } from "@/lib/sms";
import { otpStore } from "@/lib/otpStore";

export async function POST(request) {
    try {
        const { name, phone, role, isRegistration } = await request.json();

        if (!phone || !role) {
            return NextResponse.json({ error: "Phone and Role are required" }, { status: 400 });
        }

        // Generate a 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Store OTP with 10-minute expiry
        otpStore.set(phone, {
            code: otp,
            expires: Date.now() + 10 * 60 * 1000
        });

        let user;
        if (isRegistration) {
            // Registration flow — create if new, update name if existing
            const existing = await prisma.user.findUnique({ where: { phone } });
            if (existing) {
                // Allow re-registration to proceed (user may be completing a profile)
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
            // Login flow — only find existing user, don't create
            user = await prisma.user.findUnique({ where: { phone } });
            if (!user) {
                return NextResponse.json({
                    error: "No account found with this phone number. Please register first.",
                }, { status: 404 });
            }
        }

        // Send OTP via Twilio (falls back to console log if keys not set)
        const formattedPhone = "+91" + phone.replace(/\D/g, '').slice(-10);
        await sendOTP(formattedPhone, otp);

        return NextResponse.json({
            success: true,
            message: "OTP sent successfully",
            userId: user.id
        });

    } catch (error) {
        console.error("OTP Send Error:", error);
        return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 });
    }
}
