import { NextResponse } from "next/server";
import { isAdminAuthorized } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

const REPO = "tuitionsinindia/tuitionsinindiawebsite";
const GITHUB_API = "https://api.github.com";

const WORKFLOW_MAP = {
    staging:    "deploy-staging.yml",
    production: "deploy-production.yml",
};

export async function POST(request) {
    if (!isAdminAuthorized(request)) {
        return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const token = process.env.GITHUB_DEPLOY_TOKEN;
    if (!token) {
        return NextResponse.json({
            success: false,
            error: "GITHUB_DEPLOY_TOKEN is not set. Add it to .env.production on the VPS.",
        }, { status: 503 });
    }

    let body;
    try { body = await request.json(); } catch {
        return NextResponse.json({ success: false, error: "Invalid request body" }, { status: 400 });
    }

    const { env, message } = body;
    if (!WORKFLOW_MAP[env]) {
        return NextResponse.json({ success: false, error: "env must be 'staging' or 'production'" }, { status: 400 });
    }

    const workflow = WORKFLOW_MAP[env];
    const branch  = env === "production" ? "main" : "staging";

    // Trigger workflow_dispatch via GitHub API
    const dispatchRes = await fetch(
        `${GITHUB_API}/repos/${REPO}/actions/workflows/${workflow}/dispatches`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
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
        console.error("GitHub dispatch failed:", err);
        return NextResponse.json({
            success: false,
            error: `GitHub API error ${dispatchRes.status}: ${err}`,
        }, { status: 500 });
    }

    // Give GitHub a moment then fetch the latest run so we can return its URL
    await new Promise(r => setTimeout(r, 2000));
    const runsRes = await fetch(
        `${GITHUB_API}/repos/${REPO}/actions/workflows/${workflow}/runs?per_page=1&branch=${branch}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/vnd.github+json",
                "X-GitHub-Api-Version": "2022-11-28",
            },
        }
    );

    let runUrl = `https://github.com/${REPO}/actions`;
    if (runsRes.ok) {
        const runs = await runsRes.json();
        if (runs.workflow_runs?.[0]) {
            runUrl = runs.workflow_runs[0].html_url;
        }
    }

    return NextResponse.json({
        success: true,
        env,
        workflow,
        branch,
        runUrl,
        message: `${env} deployment triggered. GitHub Actions is building now.`,
    });
}

// GET — fetch current deployment status for both envs
export async function GET(request) {
    if (!isAdminAuthorized(request)) {
        return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const token = process.env.GITHUB_DEPLOY_TOKEN;
    if (!token) {
        return NextResponse.json({ success: true, tokenMissing: true, runs: {} });
    }

    const fetchLatestRun = async (workflow, branch) => {
        try {
            const res = await fetch(
                `${GITHUB_API}/repos/${REPO}/actions/workflows/${workflow}/runs?per_page=1&branch=${branch}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/vnd.github+json",
                        "X-GitHub-Api-Version": "2022-11-28",
                    },
                    next: { revalidate: 0 },
                }
            );
            if (!res.ok) return null;
            const data = await res.json();
            const run = data.workflow_runs?.[0];
            if (!run) return null;
            return {
                id: run.id,
                status: run.status,       // queued | in_progress | completed
                conclusion: run.conclusion, // success | failure | cancelled | null
                runUrl: run.html_url,
                startedAt: run.created_at,
                updatedAt: run.updated_at,
                sha: run.head_sha?.slice(0, 7),
                message: run.head_commit?.message,
                actor: run.actor?.login,
            };
        } catch { return null; }
    };

    const [stagingRun, productionRun] = await Promise.all([
        fetchLatestRun("deploy-staging.yml", "staging"),
        fetchLatestRun("deploy-production.yml", "main"),
    ]);

    return NextResponse.json({
        success: true,
        runs: { staging: stagingRun, production: productionRun },
    });
}
