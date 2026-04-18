import { NextResponse } from "next/server";
import { isAdminAuthorized } from "@/lib/adminAuth";

export const dynamic = 'force-dynamic';

const VALID_JOBS = ["reset-credits", "vip-billing", "email-drip"];

export async function POST(request) {
    if (!isAdminAuthorized(request)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { job } = body;

        if (!job || !VALID_JOBS.includes(job)) {
            return NextResponse.json(
                { error: `Invalid job. Must be one of: ${VALID_JOBS.join(", ")}` },
                { status: 400 }
            );
        }

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
        const cronKey = process.env.AUDIT_SEED_KEY || "";
        const cronSecret = process.env.CRON_SECRET || "";

        let response;

        if (job === "reset-credits") {
            response = await fetch(`${baseUrl}/api/cron/reset-credits`, {
                method: "POST",
                headers: {
                    "x-cron-key": cronKey,
                    "Content-Type": "application/json",
                },
            });
        } else if (job === "vip-billing") {
            response = await fetch(`${baseUrl}/api/cron/vip-billing`, {
                method: "POST",
                headers: {
                    "x-cron-key": cronKey,
                    "Content-Type": "application/json",
                },
            });
        } else if (job === "email-drip") {
            response = await fetch(`${baseUrl}/api/cron/email-drip?secret=${encodeURIComponent(cronSecret)}`, {
                method: "GET",
            });
        }

        let result;
        try {
            result = await response.json();
        } catch {
            result = { status: response.status, ok: response.ok };
        }

        return NextResponse.json({
            job,
            triggered: true,
            status: response.status,
            result,
        });
    } catch (error) {
        console.error("Admin cron trigger error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
