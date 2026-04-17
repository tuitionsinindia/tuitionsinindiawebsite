import { NextResponse } from "next/server";
import { sendOTP } from "@/lib/sms";
import { otpStore } from "@/lib/otpStore";
import { checkRateLimit } from "@/lib/rateLimit";

// Indian mobile number: starts with 6-9, exactly 10 digits
const INDIA_PHONE_RE = /^[6-9]\d{9}$/;

export async function POST(req) {
    try {
        const { phone } = await req.json();

        if (!phone) {
            return NextResponse.json({ error: "Phone number is required" }, { status: 400 });
        }

        // Validate Indian mobile number format
        const digits = phone.replace(/\D/g, "").slice(-10);
        if (!INDIA_PHONE_RE.test(digits)) {
            return NextResponse.json({ error: "Enter a valid 10-digit Indian mobile number" }, { status: 400 });
        }

        // Rate limit: 5 OTP requests per phone per 10 minutes
        const { limited } = checkRateLimit(req, `otp-send:${digits}`, 5, 600000);
        if (limited) {
            return NextResponse.json({ error: "Too many OTP requests. Please wait 10 minutes." }, { status: 429 });
        }

        // 1. Generate a 6-digit OTP
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

        // 2. Save it temporarily in memory, expires in 10 minutes
        otpStore.set(digits, {
            code: otpCode,
            expires: Date.now() + 10 * 60 * 1000
        });

        // 3. Format the number for India (+91)
        const formattedPhone = "+91" + digits;

        // 4. Dispatch SMS (skip for test phones starting with 9999)
        const isTestPhone = digits.startsWith("9999");
        if (isTestPhone) {
            otpStore.set(digits, { code: "000000", expires: Date.now() + 10 * 60 * 1000 });
            console.log(`[AUTH][TEST] Test phone ${digits} — OTP bypassed, use 000000`);
        } else {
            await sendOTP(formattedPhone, otpCode);
        }

        return NextResponse.json({ success: true, message: "OTP sent successfully" });
    } catch (error) {
        console.error("Error sending OTP:", error);
        return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 });
    }
}
