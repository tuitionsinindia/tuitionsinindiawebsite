"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
    GraduationCap, Users, Building2, ShieldCheck,
    Rocket, GitBranch, ChevronUp, ChevronDown,
    RefreshCcw, ExternalLink, Clock, CheckCircle2,
    AlertTriangle, LogOut, X, RotateCcw, History
} from "lucide-react";

const ROLES = [
    { key: "student",   label: "Student",   icon: GraduationCap, color: "bg-sky-500 hover:bg-sky-600",    dash: "/dashboard/student" },
    { key: "tutor",     label: "Tutor",     icon: Users,         color: "bg-violet-500 hover:bg-violet-600", dash: "/dashboard/tutor" },
    { key: "institute", label: "Institute", icon: Building2,     color: "bg-orange-500 hover:bg-orange-600", dash: "/dashboard/institute" },
];

function fmtDate(d) {
    if (!d) return "—";
    return new Date(d).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}

export default function StagingBar({ adminKey: initialAdminKey }) {
    const router = useRouter();
    const [minimized, setMinimized] = useState(false);
    const [me, setMe] = useState(null);                    // current logged-in user
    const [loggingIn, setLoggingIn] = useState(null);      // role key
    const [deploying, setDeploying] = useState(null);      // "staging" | "production"
    const [deployMsg, setDeployMsg] = useState(null);
    const [webhookOnline, setWebhookOnline] = useState(null);
    const [panel, setPanel] = useState(null);              // "version" | "history" | null
    const [versionData, setVersionData] = useState(null);
    const [versionLoading, setVersionLoading] = useState(false);
    const panelRef = useRef(null);

    // Persist minimized state
    useEffect(() => {
        const saved = localStorage.getItem("stagingBarMinimized");
        if (saved === "true") setMinimized(true);
    }, []);

    const toggleMinimized = () => {
        const next = !minimized;
        setMinimized(next);
        localStorage.setItem("stagingBarMinimized", next);
    };

    // Fetch current user session
    useEffect(() => {
        fetch("/api/auth/me").then(r => r.json()).then(j => { if (j.user) setMe(j.user); }).catch(() => {});
    }, []);

    // Check webhook status
    useEffect(() => {
        const check = () =>
            fetch("/api/staging/deploy").then(r => r.json()).then(j => setWebhookOnline(j.online)).catch(() => setWebhookOnline(false));
        check();
        const t = setInterval(check, 15000);
        return () => clearInterval(t);
    }, []);

    // Close panel on outside click
    useEffect(() => {
        const handler = (e) => {
            if (panelRef.current && !panelRef.current.contains(e.target)) setPanel(null);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const quickLogin = async (role) => {
        setLoggingIn(role);
        try {
            const res = await fetch("/api/staging/quick-login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ role }),
            });
            const json = await res.json();
            if (json.success) {
                // Full navigation so the new session cookie is picked up
                window.location.href = json.redirect;
            } else {
                alert(json.error || "Login failed");
            }
        } catch {
            alert("Network error. Try again.");
        } finally {
            setLoggingIn(null);
        }
    };

    const openAdmin = () => {
        // Admin key is baked in for staging convenience
        const key = initialAdminKey;
        if (key) {
            localStorage.setItem("ti_admin_key", key);
            sessionStorage.setItem("adminKey", key);
        }
        router.push("/dashboard/admin");
    };

    const logout = async () => {
        await fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
        setMe(null);
        router.push("/");
        router.refresh();
    };

    const triggerDeploy = async (env) => {
        if (env === "production") {
            if (!confirm("Deploy to PRODUCTION (tuitionsinindia.com)? Make sure staging is fully tested.")) return;
        }
        setDeploying(env);
        setDeployMsg(null);
        try {
            const res = await fetch("/api/staging/deploy", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ env }),
            });
            const json = await res.json();
            setDeployMsg({ ok: json.success, text: json.message || json.error });
            setTimeout(() => setDeployMsg(null), 8000);
        } catch {
            setDeployMsg({ ok: false, text: "Network error. Try again." });
        } finally {
            setDeploying(null);
        }
    };

    const openPanel = async (name) => {
        if (panel === name) { setPanel(null); return; }
        setPanel(name);
        if (name === "version" || name === "history") {
            setVersionLoading(true);
            try {
                const res = await fetch("/api/admin/version", {
                    headers: { "x-admin-key": initialAdminKey || "" },
                });
                const json = await res.json();
                if (json.success) setVersionData(json);
            } catch {} finally { setVersionLoading(false); }
        }
    };

    // ── Minimized pill ──
    if (minimized) {
        return (
            <div className="fixed bottom-4 right-4 z-[9999]">
                <button
                    onClick={toggleMinimized}
                    className="flex items-center gap-2 px-3 py-2 bg-slate-800 text-white rounded-full text-xs font-bold shadow-lg hover:bg-slate-700 transition-colors"
                >
                    <span className="size-2 rounded-full bg-amber-400 animate-pulse" />
                    STAGING
                    <ChevronUp size={12} />
                </button>
            </div>
        );
    }

    return (
        <>
            {/* Deploy message toast */}
            {deployMsg && (
                <div className={`fixed bottom-16 left-1/2 -translate-x-1/2 z-[10000] flex items-center gap-2 px-4 py-2.5 rounded-xl shadow-lg text-sm font-semibold ${deployMsg.ok ? "bg-emerald-600 text-white" : "bg-red-600 text-white"}`}>
                    {deployMsg.ok ? <CheckCircle2 size={15} /> : <AlertTriangle size={15} />}
                    {deployMsg.text}
                </div>
            )}

            {/* Panel (version / history) */}
            {panel && (
                <div ref={panelRef} className="fixed bottom-12 right-4 z-[9999] w-96 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700">
                        <span className="text-white font-bold text-sm">{panel === "version" ? "Live Versions" : "Deploy History"}</span>
                        <button onClick={() => setPanel(null)} className="text-slate-400 hover:text-white transition-colors"><X size={14} /></button>
                    </div>
                    {versionLoading ? (
                        <div className="p-6 flex justify-center"><div className="size-6 border-2 border-slate-600 border-t-slate-300 rounded-full animate-spin" /></div>
                    ) : !versionData ? (
                        <div className="p-4 text-slate-400 text-xs">Could not load version data.</div>
                    ) : panel === "version" ? (
                        <div className="p-4 space-y-3">
                            {[
                                { label: "Production", color: "text-emerald-400", data: versionData.production?.current },
                                { label: "Staging",    color: "text-blue-400",    data: versionData.staging?.current },
                            ].map(({ label, color, data: v }) => (
                                <div key={label} className="bg-slate-800 rounded-xl p-3">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className={`text-xs font-bold ${color}`}>{label}</span>
                                        {v && <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />}
                                    </div>
                                    {v ? (
                                        <>
                                            <div className="flex items-center gap-2">
                                                <span className="font-mono text-xs bg-slate-700 text-slate-300 px-1.5 py-0.5 rounded">{v.shortSha || v.sha?.slice(0,7)}</span>
                                                <span className="text-xs text-slate-300 truncate">{v.message}</span>
                                            </div>
                                            <p className="text-xs text-slate-500 mt-1">{fmtDate(v.deployedAt)} · {v.author}</p>
                                        </>
                                    ) : (
                                        <p className="text-xs text-slate-500">Not deployed yet</p>
                                    )}
                                </div>
                            ))}
                            <div className="bg-slate-800 rounded-xl p-3">
                                <p className="text-xs font-bold text-slate-400 mb-2">Latest Backups</p>
                                {versionData.backups?.production?.length > 0 ? (
                                    versionData.backups.production.slice(0, 3).map((f, i) => (
                                        <div key={i} className="flex justify-between text-xs text-slate-400 py-0.5">
                                            <span className="font-mono truncate">{f.name}</span>
                                            <span className="ml-2 shrink-0">{(f.size / 1024).toFixed(0)}KB</span>
                                        </div>
                                    ))
                                ) : <p className="text-xs text-slate-500">No backups yet</p>}
                            </div>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-800 max-h-80 overflow-y-auto">
                            {[...(versionData.staging?.history || []), ...(versionData.production?.history || [])]
                                .sort((a, b) => new Date(b.deployedAt) - new Date(a.deployedAt))
                                .slice(0, 15)
                                .map((entry, i) => (
                                    <div key={i} className="px-4 py-2.5 flex items-start gap-2.5">
                                        <div className={`mt-1 size-1.5 rounded-full shrink-0 ${entry.status === "success" ? "bg-emerald-400" : "bg-red-400"}`} />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <span className={`text-xs font-semibold ${entry.env === "production" ? "text-emerald-400" : "text-blue-400"}`}>{entry.env}</span>
                                                <span className="font-mono text-xs text-slate-400 bg-slate-800 px-1 rounded">{entry.sha}</span>
                                            </div>
                                            <p className="text-xs text-slate-300 truncate mt-0.5">{entry.message}</p>
                                            <p className="text-xs text-slate-500">{entry.author} · {fmtDate(entry.deployedAt)}</p>
                                        </div>
                                    </div>
                                ))}
                            {(!versionData.staging?.history?.length && !versionData.production?.history?.length) && (
                                <p className="p-4 text-xs text-slate-500">No deploy history yet.</p>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* ── Main staging bar ── */}
            <div className="fixed bottom-0 left-0 right-0 z-[9999] bg-slate-900 border-t border-slate-700 shadow-2xl">
                <div className="max-w-screen-xl mx-auto px-3 h-11 flex items-center gap-2">

                    {/* Badge */}
                    <div className="flex items-center gap-1.5 shrink-0">
                        <span className="size-2 rounded-full bg-amber-400 animate-pulse" />
                        <span className="text-amber-400 font-bold text-xs tracking-wide">STAGING</span>
                    </div>

                    <div className="w-px h-5 bg-slate-700 shrink-0" />

                    {/* Current user */}
                    <div className="flex items-center gap-1.5 shrink-0 min-w-0">
                        {me ? (
                            <>
                                <span className="text-xs text-slate-300 font-medium truncate max-w-[100px]">{me.name || me.phone}</span>
                                <span className="text-xs px-1.5 py-0.5 bg-slate-700 text-slate-400 rounded font-mono">{me.role}</span>
                                <button onClick={logout} title="Log out" className="text-slate-500 hover:text-red-400 transition-colors ml-0.5">
                                    <LogOut size={11} />
                                </button>
                            </>
                        ) : (
                            <span className="text-xs text-slate-500">Not logged in</span>
                        )}
                    </div>

                    <div className="w-px h-5 bg-slate-700 shrink-0" />

                    {/* Quick login buttons */}
                    <div className="flex items-center gap-1 flex-1 min-w-0 overflow-x-auto no-scrollbar">
                        {ROLES.map(({ key, label, icon: Icon, color, dash }) => (
                            <button
                                key={key}
                                onClick={() => me?.role === key.toUpperCase() ? router.push(dash) : quickLogin(key)}
                                disabled={loggingIn === key}
                                title={me?.role === key.toUpperCase() ? `Go to ${label} dashboard` : `Log in as ${label}`}
                                className={`flex items-center gap-1 px-2.5 py-1 text-white text-xs font-semibold rounded-lg transition-all shrink-0 disabled:opacity-60 ${color} ${me?.role === key.toUpperCase() ? "ring-2 ring-white/30" : ""}`}
                            >
                                {loggingIn === key
                                    ? <div className="size-3 border border-white/40 border-t-white rounded-full animate-spin" />
                                    : <Icon size={11} />}
                                {label}
                                {me?.role === key.toUpperCase() && <span className="size-1.5 rounded-full bg-white/60" />}
                            </button>
                        ))}

                        {/* Admin button */}
                        <button
                            onClick={openAdmin}
                            title="Open Admin Dashboard"
                            className="flex items-center gap-1 px-2.5 py-1 bg-slate-600 hover:bg-slate-500 text-white text-xs font-semibold rounded-lg transition-colors shrink-0"
                        >
                            <ShieldCheck size={11} /> Admin
                        </button>
                    </div>

                    <div className="w-px h-5 bg-slate-700 shrink-0" />

                    {/* Deploy buttons */}
                    <div className="flex items-center gap-1 shrink-0">
                        <div className={`size-1.5 rounded-full shrink-0 ${webhookOnline === true ? "bg-emerald-400" : webhookOnline === false ? "bg-red-400" : "bg-slate-600"}`} title={webhookOnline ? "Deploy server online" : "Deploy server offline"} />

                        <button
                            onClick={() => triggerDeploy("staging")}
                            disabled={!!deploying || webhookOnline === false}
                            title="Deploy staging branch to tuitionsinindia.in"
                            className="flex items-center gap-1 px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg transition-colors disabled:opacity-50 shrink-0"
                        >
                            {deploying === "staging"
                                ? <div className="size-3 border border-white/40 border-t-white rounded-full animate-spin" />
                                : <Rocket size={11} />}
                            Deploy
                        </button>

                        <button
                            onClick={() => triggerDeploy("production")}
                            disabled={!!deploying || webhookOnline === false}
                            title="Promote to production (tuitionsinindia.com)"
                            className="flex items-center gap-1 px-2.5 py-1 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold rounded-lg transition-colors disabled:opacity-50 shrink-0"
                        >
                            {deploying === "production"
                                ? <div className="size-3 border border-white/40 border-t-white rounded-full animate-spin" />
                                : <GitBranch size={11} />}
                            → Prod
                        </button>
                    </div>

                    <div className="w-px h-5 bg-slate-700 shrink-0" />

                    {/* Version / History */}
                    <div className="flex items-center gap-1 shrink-0">
                        <button
                            onClick={() => openPanel("version")}
                            title="Version info"
                            className={`flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors shrink-0 ${panel === "version" ? "bg-slate-600 text-white" : "text-slate-400 hover:text-white hover:bg-slate-700"}`}
                        >
                            <Clock size={11} /> Version
                        </button>
                        <button
                            onClick={() => openPanel("history")}
                            title="Deploy history"
                            className={`flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors shrink-0 ${panel === "history" ? "bg-slate-600 text-white" : "text-slate-400 hover:text-white hover:bg-slate-700"}`}
                        >
                            <History size={11} /> History
                        </button>
                        <a
                            href="https://github.com/tuitionsinindia/tuitionsinindiawebsite"
                            target="_blank" rel="noopener noreferrer"
                            title="Open GitHub repository"
                            className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors shrink-0"
                        >
                            <ExternalLink size={11} /> GitHub
                        </a>
                    </div>

                    {/* Minimize */}
                    <button
                        onClick={toggleMinimized}
                        title="Minimize staging bar"
                        className="text-slate-500 hover:text-slate-300 transition-colors shrink-0 ml-1"
                    >
                        <ChevronDown size={14} />
                    </button>
                </div>
            </div>

            {/* Spacer so content isn't hidden behind the bar */}
            <div className="h-11" />
        </>
    );
}
