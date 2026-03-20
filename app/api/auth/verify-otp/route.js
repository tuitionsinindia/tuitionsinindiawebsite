import { NextResponse } from "next/server";
import { otpStore } from "@/lib/otpStore";

export async function POST(req) {
    try {
        const { phone, otp } = await req.json();

        if (!phone || !otp) {
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
            return NextResponse.json({ error: "Invalid OTP code." }, { status: 400 });
        }

        // OTP is correct
        otpStore.delete(phone);

        return NextResponse.json({ success: true, message: "OTP Verified Successfully" });
    } catch (error) {
        console.error("Error verifying OTP:", error);
        return NextResponse.json({ error: "Failed to verify OTP" }, { status: 500 });
    }
}
