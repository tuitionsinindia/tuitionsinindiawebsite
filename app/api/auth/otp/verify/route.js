import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { otpStore } from "@/lib/otpStore";
import { createSessionToken, makeSessionCookie } from "@/lib/session";
import { sendWelcomeEmail } from "@/lib/email";

export async function POST(request) {
    try {
        const { userId, phone, otp } = await request.json();

        if (!otp || !phone) {
            return NextResponse.json({ error: "Phone and OTP are required" }, { status: 400 });
        }

        const storedData = otpStore.get(phone);

        if (!storedData) {
            return NextResponse.json({ error: "OTP has expired or was not sent to this number." }, { status: 400 });
        }

        if (Date.now() > storedData.expires) {
            otpStore.delete(phone);
            return NextResponse.json({ error: "OTP has expired. Please request a new one." }, { status: 400 });
        }

        if (storedData.code !== otp.toString()) {
            return NextResponse.json({ error: "Invalid OTP code." }, { status: 401 });
        }

        otpStore.delete(phone);

        // Build update data — always verify phone; also set phone if user doesn't have one (Google users)
        const updateData = { phoneVerified: true };
        const whereClause = userId ? { id: userId } : { phone };

        // If userId is provided (Google flow), also set the phone number on the user
        if (userId) {
            updateData.phone = phone;
        }

        // Read existing record so we know if this is a first-time verification
        const existing = await prisma.user.findUnique({
            where: whereClause,
            select: { phoneVerified: true, email: true, name: true, role: true },
        });
        const isFirstVerification = existing && !existing.phoneVerified;

        const user = await prisma.user.update({
            where: whereClause,
            data: updateData,
        });

        // Send welcome email on first-ever phone verification
        if (isFirstVerification && user.email) {
            const roleLabel = user.role === "TUTOR" ? "Tutor" : user.role === "INSTITUTE" ? "Institute" : "Student";
            sendWelcomeEmail(user.email, user.name || "there", roleLabel).catch(() => {});
        }

        // Set session cookie so user is authenticated going forward
        const token = createSessionToken(user);
        const cookie = makeSessionCookie(token);

        const response = NextResponse.json({
            success: true,
            user: {
                id: user.id,
                name: user.name,
                role: user.role,
                phone: user.phone,
                email: user.email,
                image: user.image,
            }
        });

        response.headers.set("Set-Cookie", cookie);
        return response;

    } catch (error) {
        console.error("OTP Verification Error:", error);
        return NextResponse.json({ error: "Verification failed" }, { status: 500 });
    }
}
