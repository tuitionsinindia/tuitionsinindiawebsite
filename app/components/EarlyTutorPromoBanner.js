"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";

// Public banner — fetches the early-tutor PRO offer status from
// /api/promo/early-tutor-status and renders an urgency message with the
// remaining slot count. Returns null when the offer has closed so it
// disappears cleanly without leaving an empty box.
//
// Variants: "full" (pricing/landing pages) and "compact" (forms/headers).
export default function EarlyTutorPromoBanner({ variant = "full", ctaHref = "/register/tutor" }) {
    const [status, setStatus] = useState(null);

    useEffect(() => {
        let cancelled = false;
        fetch("/api/promo/early-tutor-status")
            .then(r => r.json())
            .then(json => {
                if (cancelled || !json.success || !json.isActive) return;
                setStatus(json);
            })
            .catch(() => {});
        return () => { cancelled = true; };
    }, []);

    if (!status) return null;

    const urgency = status.slotsRemaining <= 50
        ? `Only ${status.slotsRemaining} spots left`
        : `${status.slotsRemaining} of ${status.limit} spots remaining`;

    if (variant === "compact") {
        return (
            <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg text-xs">
                <Sparkles size={14} className="text-amber-600 shrink-0" />
                <span className="text-amber-900 font-semibold">
                    First {status.limit} tutors get FREE PRO for {status.days} days · {urgency}
                </span>
            </div>
        );
    }

    return (
        <div className="relative overflow-hidden rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 p-5 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
                <div className="flex items-start gap-3 flex-1">
                    <div className="size-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
                        <Sparkles size={18} />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-amber-900">
                            Founding-tutor offer · FREE PRO for {status.days} days
                        </p>
                        <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">
                            The first {status.limit} tutors on TuitionsInIndia get a complimentary PRO subscription —
                            <strong> 30 credits, verified badge, priority search.</strong> No card needed.
                        </p>
                        <p className="text-[11px] font-semibold text-amber-700 mt-1.5">{urgency}</p>
                    </div>
                </div>
                <Link
                    href={ctaHref}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold rounded-lg shrink-0 transition-colors"
                >
                    Claim my free PRO <ArrowRight size={14} />
                </Link>
            </div>
        </div>
    );
}
