import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendOTP } from "@/lib/sms";
import { otpStore } from "@/lib/otpStore";

export async function POST(request) {
    try {
        const { name, phone, role } = await request.json();

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

        // Update or create user record
        const user = await prisma.user.upsert({
            where: { phone: phone },
            update: {
                name: name || undefined,
                role: role
            },
            create: {
                phone: phone,
                name: name || "Anonymous",
                role: role,
                phoneVerified: false
            }
        });

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
