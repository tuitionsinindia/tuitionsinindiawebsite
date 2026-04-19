import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { isAdminAuthorized } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

function envStatus(name, { required = true, secret = true } = {}) {
    const value = process.env[name];
    const present = !!value && value.trim() !== "";
    return {
        name,
        present,
        required,
        // Never return the actual secret — only a presence flag and a short preview for non-secret vars.
        preview: secret || !present ? null : value.slice(0, 60),
    };
}

export async function GET(request) {
    if (!isAdminAuthorized(request)) {
        return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const checks = [];

    // --- Core infra ---
    const dbUrl = process.env.DATABASE_URL || "";
    checks.push({
        id: "database",
        category: "Infrastructure",
        label: "Database connection",
        status: dbUrl ? "ok" : "fail",
        detail: dbUrl ? "DATABASE_URL is set" : "DATABASE_URL is missing",
    });

    checks.push({
        id: "session-secret",
        category: "Infrastructure",
        label: "Session secret",
        status: process.env.SESSION_SECRET ? "ok" : "fail",
        detail: process.env.SESSION_SECRET ? "SESSION_SECRET is set" : "SESSION_SECRET missing — auth will fail in prod",
    });

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";
    checks.push({
        id: "base-url",
        category: "Infrastructure",
        label: "Public base URL",
        status: baseUrl === "https://tuitionsinindia.com" ? "ok"
            : baseUrl ? "warn" : "fail",
        detail: baseUrl || "NEXT_PUBLIC_BASE_URL missing",
    });

    const nodeEnv = process.env.NODE_ENV || "";
    checks.push({
        id: "node-env",
        category: "Infrastructure",
        label: "Node environment",
        status: nodeEnv === "production" ? "ok" : "warn",
        detail: `NODE_ENV=${nodeEnv || "(unset)"}`,
    });

    // --- Payments (Razorpay) ---
    const rzpKey = process.env.RAZORPAY_KEY_ID || "";
    let rzpStatus = "fail";
    let rzpDetail = "RAZORPAY_KEY_ID missing";
    if (rzpKey.startsWith("rzp_live_")) {
        rzpStatus = "ok";
        rzpDetail = "Live mode — ready to take real payments";
    } else if (rzpKey.startsWith("rzp_test_")) {
        rzpStatus = "warn";
        rzpDetail = "Test mode — switch to live key before launch";
    } else if (rzpKey) {
        rzpStatus = "warn";
        rzpDetail = "Key set but format is unrecognised";
    }
    checks.push({
        id: "razorpay-mode",
        category: "Payments",
        label: "Razorpay mode",
        status: rzpStatus,
        detail: rzpDetail,
    });

    checks.push({
        id: "razorpay-secret",
        category: "Payments",
        label: "Razorpay secret",
        status: process.env.RAZORPAY_KEY_SECRET ? "ok" : "fail",
        detail: process.env.RAZORPAY_KEY_SECRET ? "RAZORPAY_KEY_SECRET is set" : "RAZORPAY_KEY_SECRET missing",
    });

    checks.push({
        id: "razorpay-webhook",
        category: "Payments",
        label: "Razorpay webhook secret",
        status: process.env.RAZORPAY_WEBHOOK_SECRET ? "ok" : "warn",
        detail: process.env.RAZORPAY_WEBHOOK_SECRET
            ? "Webhook signature verification enabled"
            : "No webhook secret — delayed captures won't be recorded",
    });

    // --- Email (Resend) ---
    checks.push({
        id: "resend-key",
        category: "Email & SMS",
        label: "Resend API key",
        status: process.env.RESEND_API_KEY ? "ok" : "fail",
        detail: process.env.RESEND_API_KEY ? "RESEND_API_KEY is set" : "RESEND_API_KEY missing",
    });

    // --- SMS (Twilio) ---
    const twilioSid = process.env.TWILIO_ACCOUNT_SID;
    const twilioToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioNumber = process.env.TWILIO_PHONE_NUMBER;
    const twilioAllSet = twilioSid && twilioToken && twilioNumber;
    checks.push({
        id: "twilio",
        category: "Email & SMS",
        label: "Twilio (SMS/OTP)",
        status: twilioAllSet ? "ok" : "fail",
        detail: twilioAllSet
            ? "All Twilio credentials set"
            : "Missing: " + [!twilioSid && "SID", !twilioToken && "token", !twilioNumber && "number"].filter(Boolean).join(", "),
    });

    checks.push({
        id: "twilio-dlt",
        category: "Email & SMS",
        label: "Twilio DLT approval (manual)",
        status: "manual",
        detail: "Verify DLT template + entity registration in Twilio console. Without this, Indian OTPs will silently fail.",
    });

    // --- Auth ---
    const googleOk = process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET;
    checks.push({
        id: "google-oauth",
        category: "Auth",
        label: "Google OAuth",
        status: googleOk ? "ok" : "warn",
        detail: googleOk ? "Client ID + secret set" : "Google sign-in disabled (phone OTP still works)",
    });

    // --- Analytics / Ads ---
    const gaId = process.env.NEXT_PUBLIC_GA_ID || "";
    checks.push({
        id: "ga-id",
        category: "Analytics & Ads",
        label: "Google Analytics ID",
        status: gaId && gaId !== "G-XXXXXXXXXX" ? "ok" : "warn",
        detail: gaId && gaId !== "G-XXXXXXXXXX"
            ? `Tracking live: ${gaId}`
            : "NEXT_PUBLIC_GA_ID not set — ad conversions won't track",
    });

    const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID || "";
    checks.push({
        id: "meta-pixel",
        category: "Analytics & Ads",
        label: "Meta (Facebook) Pixel ID",
        status: pixelId ? "ok" : "warn",
        detail: pixelId
            ? `Pixel live: ${pixelId}`
            : "NEXT_PUBLIC_META_PIXEL_ID not set — Meta ad attribution won't work",
    });

    // --- Data state ---
    try {
        const [tutorCount, studentCount, instituteCount, auditUsersCount, openLeads] = await Promise.all([
            prisma.user.count({ where: { role: "TUTOR" } }),
            prisma.user.count({ where: { role: "STUDENT" } }),
            prisma.user.count({ where: { role: "INSTITUTE" } }),
            prisma.user.count({ where: { email: { contains: "_prod_audit@test.com" } } }),
            prisma.lead.count({ where: { status: "OPEN" } }),
        ]);

        checks.push({
            id: "tutor-supply",
            category: "Marketplace",
            label: "Tutor supply",
            status: tutorCount >= 100 ? "ok" : tutorCount >= 25 ? "warn" : "fail",
            detail: `${tutorCount} tutors registered (target: 100+ across 3 launch cities)`,
        });

        checks.push({
            id: "student-demand",
            category: "Marketplace",
            label: "Student base",
            status: studentCount >= 200 ? "ok" : studentCount >= 50 ? "warn" : "fail",
            detail: `${studentCount} students registered`,
        });

        checks.push({
            id: "institute-supply",
            category: "Marketplace",
            label: "Institute supply",
            status: instituteCount >= 10 ? "ok" : "warn",
            detail: `${instituteCount} institutes registered`,
        });

        checks.push({
            id: "open-leads",
            category: "Marketplace",
            label: "Open student leads",
            status: openLeads >= 20 ? "ok" : openLeads >= 5 ? "warn" : "fail",
            detail: `${openLeads} open leads for tutors to unlock`,
        });

        checks.push({
            id: "audit-users",
            category: "Data hygiene",
            label: "Test accounts in DB",
            status: auditUsersCount === 0 ? "ok" : "fail",
            detail: auditUsersCount === 0
                ? "No Prod_Audit test accounts found"
                : `${auditUsersCount} test account(s) still present — run cleanup (phase=0)`,
        });
    } catch (err) {
        checks.push({
            id: "db-read",
            category: "Marketplace",
            label: "Database read",
            status: "fail",
            detail: `Could not read marketplace data: ${err.message}`,
        });
    }

    // --- Legal / SEO ---
    checks.push({
        id: "legal-pages",
        category: "Compliance",
        label: "Legal pages (manual)",
        status: "manual",
        detail: "Confirm /legal/privacy, /legal/terms, /legal/cookies reviewed by counsel (DPDP Act 2023)",
    });

    checks.push({
        id: "razorpay-business",
        category: "Compliance",
        label: "Razorpay business verification (manual)",
        status: "manual",
        detail: "PAN, GST, bank details activated in Razorpay dashboard",
    });

    checks.push({
        id: "resend-domain",
        category: "Compliance",
        label: "Resend domain verification (manual)",
        status: "manual",
        detail: "Confirm SPF/DKIM/DMARC verified for tuitionsinindia.com in Resend",
    });

    // --- Summary ---
    const summary = {
        total: checks.length,
        ok: checks.filter((c) => c.status === "ok").length,
        warn: checks.filter((c) => c.status === "warn").length,
        fail: checks.filter((c) => c.status === "fail").length,
        manual: checks.filter((c) => c.status === "manual").length,
    };
    const launchReady = summary.fail === 0 && summary.warn <= 2;

    return NextResponse.json({
        success: true,
        launchReady,
        summary,
        checks,
        generatedAt: new Date().toISOString(),
    });
}
