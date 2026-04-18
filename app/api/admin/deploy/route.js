import { NextResponse } from "next/server";
import { isAdminAuthorized } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

// The deploy webhook runs on the VPS host.
// From inside Docker, the host is reachable via host.docker.internal.
const WEBHOOK_URL = process.env.DEPLOY_WEBHOOK_URL || "http://host.docker.internal:9001";
const WEBHOOK_SECRET = process.env.DEPLOY_WEBHOOK_SECRET || "";

// Fallback: GitHub Actions dispatch (used if webhook is unreachable)
const REPO = "tuitionsinindia/tuitionsinindiawebsite";
const GITHUB_TOKEN = process.env.GITHUB_DEPLOY_TOKEN || "";

export async function POST(request) {
    if (!isAdminAuthorized(request)) {
        return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    let body;
    try { body = await request.json(); } catch {
        return NextResponse.json({ success: false, error: "Invalid request body" }, { status: 400 });
    }

    const { env } = body;
    if (!["staging", "production"].includes(env)) {
        return NextResponse.json({ success: false, error: "env must be 'staging' or 'production'" }, { status: 400 });
    }

    // ── Try VPS deploy webhook first ──
    if (WEBHOOK_SECRET) {
        try {
            const webhookRes = await fetch(
                `${WEBHOOK_URL}/deploy?env=${env}&token=${WEBHOOK_SECRET}`,
                { method: "GET", signal: AbortSignal.timeout(8000) }
            );
            const json = await webhookRes.json();
            if (webhookRes.ok && json.success) {
                return NextResponse.json({
                    success: true,
                    env,
                    via: "webhook",
                    message: json.message || `${env} deploy triggered. Takes ~3 minutes.`,
                    monitorUrl: `https://tuitionsinindia.in/dashboard/admin`,
                });
            }
            // Webhook returned an error (e.g. already running)
            return NextResponse.json({ success: false, error: json.error || "Webhook error" }, { status: 409 });
        } catch (webhookErr) {
            // Webhook unreachable — fall through to GitHub Actions if token available
            console.warn("Deploy webhook unreachable:", webhookErr.message);
        }
    }

    // ── Fallback: GitHub Actions workflow_dispatch ──
    if (!GITHUB_TOKEN) {
        return NextResponse.json({
            success: false,
            error: "Deploy webhook is not reachable and GITHUB_DEPLOY_TOKEN is not set. Check VPS setup.",
        }, { status: 503 });
    }

    const workflowFile = env === "production" ? "deploy-production.yml" : "deploy-staging.yml";
    const branch       = env === "production" ? "main" : "staging";

    const dispatchRes = await fetch(
        `https://api.github.com/repos/${REPO}/actions/workflows/${workflowFile}/dispatches`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${GITHUB_TOKEN}`,
                Accept: "application/vnd.github+json",
                "X-GitHub-Api-Version": "2022-11-28",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                ref: branch,
                inputs: env === "production" ? { confirm: "deploy" } : {},
            }),
        }
    );

    if (!dispatchRes.ok) {
        const err = await dispatchRes.text();
        return NextResponse.json({ success: false, error: `GitHub API ${dispatchRes.status}: ${err}` }, { status: 500 });
    }

    return NextResponse.json({
        success: true,
        env,
        via: "github-actions",
        message: `${env} deploy triggered via GitHub Actions.`,
        monitorUrl: `https://github.com/${REPO}/actions`,
    });
}

// GET — fetch run status from webhook health + version info
export async function GET(request) {
    if (!isAdminAuthorized(request)) {
        return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    let webhookStatus = null;
    if (WEBHOOK_SECRET) {
        try {
            const res = await fetch(`${WEBHOOK_URL}/health`, { signal: AbortSignal.timeout(3000) });
            if (res.ok) webhookStatus = await res.json();
        } catch {}
    }

    return NextResponse.json({
        success: true,
        webhookOnline: webhookStatus !== null,
        currentlyDeploying: webhookStatus?.running || [],
        githubActionsAvailable: !!GITHUB_TOKEN,
    });
}
