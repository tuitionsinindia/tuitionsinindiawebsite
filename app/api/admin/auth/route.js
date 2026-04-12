import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "info@tuitionsinindia.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Tuitions@123#";

export async function POST(request) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json({ success: false, error: "Missing credentials" }, { status: 400 });
        }

        if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
            return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 });
        }

        if (!process.env.AUDIT_SEED_KEY) {
            return NextResponse.json({ success: false, error: "Admin key not configured" }, { status: 500 });
        }

        return NextResponse.json({ success: true, key: process.env.AUDIT_SEED_KEY });
    } catch {
        return NextResponse.json({ success: false, error: "Auth failed" }, { status: 500 });
    }
}
