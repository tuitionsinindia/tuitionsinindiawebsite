import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request) {
    try {
        const { userId, phone, otp } = await request.json();

        if (!otp) {
            return NextResponse.json({ error: "OTP is required" }, { status: 400 });
        }

        // Mock verification
        if (otp !== "123456") {
            return NextResponse.json({ error: "Invalid OTP" }, { status: 401 });
        }

        // Finalize User verification
        const user = await prisma.user.update({
            where: { id: userId },
            data: { 
                phoneVerified: true 
            }
        });

        // In a real app, use NextAuth or a JWT here to establish session
        // For now, return success and user context
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
