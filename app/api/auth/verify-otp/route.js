import { NextResponse } from "next/server";
import { otpStore } from "@/lib/otpStore";
import { checkRateLimit } from "@/lib/rateLimit";

export async function POST(req) {
    try {
        const { phone, otp } = await req.json();

        if (!phone || !otp) {
            return NextResponse.json({ error: "Phone and OTP are required" }, { status: 400 });
        }

        const digits = phone.replace(/\D/g, "").slice(-10);

        // Rate limit: 10 verification attempts per IP per 10 minutes (brute-force protection)
        const { limited } = checkRateLimit(req, `otp-verify:${digits}`, 10, 600000);
        if (limited) {
            return NextResponse.json({ error: "Too many attempts. Please request a new OTP." }, { status: 429 });
        }

        const storedData = otpStore.get(digits);

        if (!storedData) {
            return NextResponse.json({ error: "OTP has expired or was not sent to this number." }, { status: 400 });
        }

        if (Date.now() > storedData.expires) {
            otpStore.delete(digits);
            return NextResponse.json({ error: "OTP has expired. Please request a new one." }, { status: 400 });
        }

        // TEST BYPASS: phones starting with 9999 accept OTP 000000
        const isTestPhone = digits.startsWith("9999");
        const isTestOtp = otp.toString() === "000000";
        if (isTestPhone && isTestOtp) {
            otpStore.delete(digits);
        } else {
            if (storedData.code !== otp.toString()) {
                return NextResponse.json({ error: "Invalid OTP code." }, { status: 400 });
            }
            otpStore.delete(digits);
        }

        return NextResponse.json({ success: true, message: "OTP verified successfully" });
    } catch (error) {
        console.error("Error verifying OTP:", error);
        return NextResponse.json({ error: "Failed to verify OTP" }, { status: 500 });
    }
}
