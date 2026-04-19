"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const COOKIE_NAME = "ti_attribution";
const THIRTY_DAYS = 60 * 60 * 24 * 30;

function readCookie(name) {
    if (typeof document === "undefined") return null;
    const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
    return match ? decodeURIComponent(match[2]) : null;
}

function writeCookie(name, value, maxAgeSeconds) {
    if (typeof document === "undefined") return;
    const secure = window.location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `${name}=${encodeURIComponent(value)}; Max-Age=${maxAgeSeconds}; Path=/; SameSite=Lax${secure}`;
}

/**
 * Captures UTM parameters and referrer on first visit, stores them in a
 * first-party cookie (ti_attribution) for 30 days. Signup/lead endpoints
 * read this cookie via `getAttributionFromCookies()` in lib/attribution.js.
 *
 * Never overwrites — first-touch attribution wins so the ad that *acquired*
 * the user gets credit, not the last click before signup.
 */
export default function UtmCapture() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        const existing = readCookie(COOKIE_NAME);
        if (existing) return; // First-touch: don't overwrite.

        const utmSource = searchParams.get("utm_source") || "";
        const utmMedium = searchParams.get("utm_medium") || "";
        const utmCampaign = searchParams.get("utm_campaign") || "";
        const utmContent = searchParams.get("utm_content") || "";
        const utmTerm = searchParams.get("utm_term") || "";
        const gclid = searchParams.get("gclid") || "";
        const fbclid = searchParams.get("fbclid") || "";

        const hasAnyParam = utmSource || utmMedium || utmCampaign || gclid || fbclid;

        // Pull referrer host only if the user came from outside our domain.
        let referrerHost = "";
        try {
            if (document.referrer) {
                const ref = new URL(document.referrer);
                if (ref.host !== window.location.host) referrerHost = ref.host;
            }
        } catch {
            /* ignore */
        }

        // Only persist if we have *something* to attribute — avoids creating
        // empty cookies for direct traffic that would block a later ad click.
        if (!hasAnyParam && !referrerHost) return;

        const attribution = {
            utmSource: utmSource || (gclid ? "google" : fbclid ? "facebook" : ""),
            utmMedium: utmMedium || (gclid || fbclid ? "cpc" : ""),
            utmCampaign,
            utmContent,
            utmTerm,
            gclid,
            fbclid,
            landingPath: pathname || "",
            referrerHost,
            capturedAt: new Date().toISOString(),
        };

        try {
            writeCookie(COOKIE_NAME, JSON.stringify(attribution), THIRTY_DAYS);
        } catch {
            /* ignore */
        }
    }, [pathname, searchParams]);

    return null;
}
