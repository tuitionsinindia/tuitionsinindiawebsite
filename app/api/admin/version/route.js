import { NextResponse } from "next/server";
import { isAdminAuthorized } from "@/lib/adminAuth";
import { readFileSync } from "fs";
import { join } from "path";

export const dynamic = "force-dynamic";

function readJsonLog(filePath, limit = 20) {
    try {
        const content = readFileSync(filePath, "utf8");
        const lines = content.trim().split("\n").filter(Boolean);
        return lines
            .slice(-limit)
            .reverse()
            .map(line => {
                try { return JSON.parse(line); } catch { return null; }
            })
            .filter(Boolean);
    } catch {
        return [];
    }
}

function readVersionFile(filePath) {
    try {
        const content = readFileSync(filePath, "utf8");
        return JSON.parse(content);
    } catch {
        return null;
    }
}

export async function GET(request) {
    if (!isAdminAuthorized(request)) {
        return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    // Version files written by deploy scripts / GitHub Actions
    const prodVersion   = readVersionFile("/root/tuitionsinindia/version.json");
    const stagingVersion = readVersionFile("/root/tuitionsinindia-staging/version.json");

    // Deployment history logs — one JSON entry per line
    const prodHistory    = readJsonLog("/root/deploy-history/production.log");
    const stagingHistory = readJsonLog("/root/deploy-history/staging.log");

    // Backup status — list most recent backup files
    let backups = { production: [], staging: [], lastRun: null };
    try {
        const { readdirSync, statSync } = await import("fs");
        const readDir = (dir) => {
            try {
                return readdirSync(dir)
                    .filter(f => f.endsWith(".sql.gz"))
                    .map(f => {
                        const s = statSync(join(dir, f));
                        return { name: f, size: s.size, createdAt: s.mtime };
                    })
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    .slice(0, 7);
            } catch { return []; }
        };
        backups.production = readDir("/root/db-backups/production");
        backups.staging    = readDir("/root/db-backups/staging");
        if (backups.production.length > 0) {
            backups.lastRun = backups.production[0].createdAt;
        }
    } catch { /* backups dir not set up yet */ }

    return NextResponse.json({
        success: true,
        production: {
            current: prodVersion,
            history: prodHistory,
        },
        staging: {
            current: stagingVersion,
            history: stagingHistory,
        },
        backups,
    });
}
