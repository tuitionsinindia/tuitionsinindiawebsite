#!/usr/bin/env node
/**
 * Deploy Webhook Server
 * Runs on the VPS host (not inside Docker).
 * Listens on port 9001 and triggers deploy scripts when called by the admin panel.
 *
 * Start:   node /root/scripts/deploy-webhook.js
 * Logs:    /var/log/deploy-webhook.log
 * Auto-start: added to crontab with @reboot
 */

const http = require("http");
const { spawn } = require("child_process");
const fs   = require("fs");
const path = require("path");

const PORT    = 9001;
const SECRET  = process.env.DEPLOY_WEBHOOK_SECRET || "change-this";
const LOG     = "/var/log/deploy-webhook.log";

const SCRIPTS = {
    staging:    "/root/scripts/run-deploy-staging.sh",
    production: "/root/scripts/run-deploy-production.sh",
};

// Track in-progress deploys to prevent double-triggering
const running = {};

function log(msg) {
    const line = `[${new Date().toISOString()}] ${msg}\n`;
    process.stdout.write(line);
    fs.appendFileSync(LOG, line);
}

const server = http.createServer((req, res) => {
    const url = new URL(req.url, `http://localhost`);

    // Health check
    if (url.pathname === "/health") {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ ok: true, running: Object.keys(running) }));
        return;
    }

    // Deploy trigger
    if (url.pathname !== "/deploy") {
        res.writeHead(404);
        res.end("Not found");
        return;
    }

    const token = url.searchParams.get("token");
    const env   = url.searchParams.get("env");

    if (token !== SECRET) {
        log(`Unauthorized deploy attempt from ${req.socket.remoteAddress}`);
        res.writeHead(401, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, error: "Unauthorized" }));
        return;
    }

    if (!SCRIPTS[env]) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, error: "Invalid env. Use staging or production." }));
        return;
    }

    if (running[env]) {
        res.writeHead(409, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, error: `${env} deploy already in progress.` }));
        return;
    }

    log(`Deploy triggered: ${env}`);
    running[env] = true;

    // Respond immediately — the build takes ~3 min
    res.writeHead(202, { "Content-Type": "application/json" });
    res.end(JSON.stringify({
        success: true,
        env,
        message: `${env} deploy started. Takes ~3 minutes.`,
    }));

    // Run the deploy script in background
    const proc = spawn("bash", [SCRIPTS[env]], {
        detached: true,
        stdio: ["ignore", fs.openSync(LOG, "a"), fs.openSync(LOG, "a")],
    });
    proc.on("close", (code) => {
        log(`Deploy ${env} finished with code ${code}`);
        delete running[env];
    });
    proc.unref();
});

server.listen(PORT, "0.0.0.0", () => {
    log(`Deploy webhook listening on port ${PORT}`);
});

process.on("uncaughtException", (err) => log(`Uncaught: ${err.message}`));
