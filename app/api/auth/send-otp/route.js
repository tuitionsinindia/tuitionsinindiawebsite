import { NextResponse } from "next/server";
import { sendOTP } from "@/lib/sms";
import { otpStore } from "@/lib/otpStore";

export async function POST(req) {
    try {
        const { phone } = await req.json();

        if (!phone) {
            return NextResponse.json({ error: "Phone number is required" }, { status: 400 });
        }

        // 1. Generate a 6-digit OTP
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

        // 2. Save it temporarily in memory, expires in 10 minutes
        otpStore.set(phone, {
            code: otpCode,
            expires: Date.now() + 10 * 60 * 1000
        });

        // 3. Format the number for India (+91)
        const formattedPhone = "+91" + phone.replace(/\D/g, '').slice(-10);

        // 4. Dispatch SMS
        await sendOTP(formattedPhone, otpCode);

        return NextResponse.json({ success: true, message: "OTP Sent Successfully" });
    } catch (error) {
        console.error("Error sending OTP:", error);
        return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 });
    }
}
