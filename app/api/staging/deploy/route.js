import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const IS_STAGING = process.env.NEXT_PUBLIC_ENV === "staging";
const WEBHOOK_URL = process.env.DEPLOY_WEBHOOK_URL || "http://host.docker.internal:9001";
const WEBHOOK_SECRET = process.env.DEPLOY_WEBHOOK_SECRET || "";

export async function POST(request) {
    if (!IS_STAGING) {
        return NextResponse.json({ error: "Not available in production" }, { status: 403 });
    }
    if (!WEBHOOK_SECRET) {
        return NextResponse.json({ error: "Deploy webhook not configured" }, { status: 503 });
    }

    const { env = "staging" } = await request.json().catch(() => ({}));
    if (!["staging", "production"].includes(env)) {
        return NextResponse.json({ error: "Invalid env" }, { status: 400 });
    }

    try {
        const res = await fetch(
            `${WEBHOOK_URL}/deploy?env=${env}&token=${WEBHOOK_SECRET}`,
            { signal: AbortSignal.timeout(8000) }
        );
        const json = await res.json();
        return NextResponse.json(json, { status: res.status });
    } catch (err) {
        return NextResponse.json({ success: false, error: "Deploy server unreachable" }, { status: 503 });
    }
}

export async function GET() {
    if (!IS_STAGING) {
        return NextResponse.json({ error: "Not available" }, { status: 403 });
    }
    try {
        const res = await fetch(`${WEBHOOK_URL}/health`, { signal: AbortSignal.timeout(3000) });
        const json = await res.json();
        return NextResponse.json({ online: true, ...json });
    } catch {
        return NextResponse.json({ online: false });
    }
}
