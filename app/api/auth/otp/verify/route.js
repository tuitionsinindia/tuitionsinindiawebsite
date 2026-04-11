import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { otpStore } from "@/lib/otpStore";

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

        // Find user - by userId if provided, otherwise by phone
        const whereClause = userId ? { id: userId } : { phone: phone };
        const user = await prisma.user.update({
            where: whereClause,
            data: { phoneVerified: true }
        });

        return NextResponse.json({
            success: true,
            user: {
                id: user.id,
                name: user.name,
                role: user.role,
                phone: user.phone
            }
        });

    } catch (error) {
        console.error("OTP Verification Error:", error);
        return NextResponse.json({ error: "Verification failed" }, { status: 500 });
    }
}
