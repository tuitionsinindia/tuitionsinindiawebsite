import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request) {
    try {
        const { name, phone, role } = await request.json();

        if (!phone || !role) {
            return NextResponse.json({ error: "Phone and Role are required" }, { status: 400 });
        }

        // Mock OTP generation
        const otp = "123456"; 
        console.log(`[AUTH] Sending OTP ${otp} to ${phone} for role ${role}`);

        // Update or create lead capture (Placeholder user)
        // In a real app, you might use a separate 'Prospect' table or just update the User
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

        // Store OTP in a session or a cache (mocking with a return for now)
        // In production, use Redis or a dedicated OTP table
        return NextResponse.json({ 
            success: true, 
            message: "OTP sent successfully (Mock: 123456)",
            userId: user.id 
        });

    } catch (error) {
        console.error("OTP Send Error:", error);
        return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 });
    }
}
