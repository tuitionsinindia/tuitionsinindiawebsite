"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Sparkles, X, CheckCircle2, ArrowRight } from "lucide-react";

// Shown once on a tutor or institute dashboard when the user arrives via
// `?welcome=1` (from the chatbot or signup flow). Lists the next steps
// that turn a bare profile into one that actually receives leads.
//
// Dismissible (session + localStorage so it doesn't reappear on every page).
//
// Usage:
//   <DashboardWelcomeCard role="TUTOR" steps={[{label, href, done?}, ...]} />
export default function DashboardWelcomeCard({ role = "TUTOR", steps = [] }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [dismissed, setDismissed] = useState(false);

    const welcomeFlag = searchParams?.get("welcome");
    const shouldShow = welcomeFlag === "1" || welcomeFlag === "true";

    // Persist dismissal so the card doesn't reappear if the user refreshes.
    useEffect(() => {
        try {
            if (localStorage.getItem(`ti_welcome_dismissed_${role}`) === "1") setDismissed(true);
        } catch {}
    }, [role]);

    if (!shouldShow || dismissed) return null;

    const handleDismiss = () => {
        setDismissed(true);
        try { localStorage.setItem(`ti_welcome_dismissed_${role}`, "1"); } catch {}
        // Remove ?welcome=1 from URL without a navigation.
        const params = new URLSearchParams(searchParams.toString());
        params.delete("welcome");
        const newUrl = window.location.pathname + (params.toString() ? `?${params.toString()}` : "");
        window.history.replaceState({}, "", newUrl);
    };

    const doneCount = steps.filter((s) => s.done).length;
    const total = steps.length;
    const pct = total > 0 ? Math.round((doneCount / total) * 100) : 0;
    const title = role === "INSTITUTE"
        ? "Welcome to TuitionsInIndia! Let's activate your institute listing."
        : "Welcome to TuitionsInIndia! Let's get your profile ready for students.";

    return (
        <div className="relative bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-2xl p-5 md:p-6 shadow-sm overflow-hidden">
            <button
                onClick={handleDismiss}
                aria-label="Dismiss"
                className="absolute top-3 right-3 p-1.5 rounded-md hover:bg-white/10 transition-colors"
            >
                <X size={16} />
            </button>

            <div className="flex items-start gap-3 mb-4">
                <div className="size-10 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
                    <Sparkles size={18} />
                </div>
                <div className="flex-1 min-w-0 pr-8">
                    <h2 className="text-base md:text-lg font-bold leading-tight">{title}</h2>
                    <p className="text-xs text-blue-100 mt-1">
                        {total > 0
                            ? `${doneCount} of ${total} steps complete · ${pct}%`
                            : "Complete these steps to start receiving enquiries:"}
                    </p>
                </div>
            </div>

            {total > 0 && (
                <div className="w-full bg-white/15 rounded-full h-1.5 mb-4 overflow-hidden">
                    <div className="bg-white h-full rounded-full transition-all" style={{ width: `${pct}%` }} />
                </div>
            )}

            <div className="space-y-2">
                {steps.map((step, i) => (
                    <button
                        key={i}
                        onClick={() => step.href && router.push(step.href)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left ${
                            step.done
                                ? "bg-white/10 text-blue-100 cursor-default"
                                : "bg-white hover:bg-blue-50 text-blue-700"
                        }`}
                        disabled={!step.href || step.done}
                    >
                        {step.done ? (
                            <CheckCircle2 size={16} className="shrink-0" />
                        ) : (
                            <span className="size-5 rounded-full border-2 border-blue-300 shrink-0" />
                        )}
                        <span className="flex-1 text-sm font-semibold">{step.label}</span>
                        {!step.done && step.href && <ArrowRight size={14} className="shrink-0" />}
                    </button>
                ))}
            </div>
        </div>
    );
}
