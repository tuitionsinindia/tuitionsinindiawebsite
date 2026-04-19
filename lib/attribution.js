// Server-side helpers to pull ad attribution from the ti_attribution cookie
// set by app/components/UtmCapture.js. Returns safe defaults when absent or
// malformed so callers can spread the result into prisma.create() without
// pre-checking.

const COOKIE_NAME = "ti_attribution";

export function parseAttributionCookie(cookieHeader) {
    if (!cookieHeader) return emptyAttribution();
    const match = cookieHeader.match(new RegExp("(?:^|; )" + COOKIE_NAME + "=([^;]+)"));
    if (!match) return emptyAttribution();
    try {
        const decoded = decodeURIComponent(match[1]);
        const parsed = JSON.parse(decoded);
        return normaliseAttribution(parsed);
    } catch {
        return emptyAttribution();
    }
}

export function getAttributionFromRequest(request) {
    const header = request?.headers?.get?.("cookie") || "";
    return parseAttributionCookie(header);
}

function emptyAttribution() {
    return {
        utmSource: null,
        utmMedium: null,
        utmCampaign: null,
        utmContent: null,
        utmTerm: null,
        landingPath: null,
        referrerHost: null,
    };
}

function truncate(value, max = 250) {
    if (!value || typeof value !== "string") return null;
    const trimmed = value.trim();
    if (!trimmed) return null;
    return trimmed.length > max ? trimmed.slice(0, max) : trimmed;
}

function normaliseAttribution(raw) {
    if (!raw || typeof raw !== "object") return emptyAttribution();
    return {
        utmSource: truncate(raw.utmSource, 100),
        utmMedium: truncate(raw.utmMedium, 100),
        utmCampaign: truncate(raw.utmCampaign, 200),
        utmContent: truncate(raw.utmContent, 200),
        utmTerm: truncate(raw.utmTerm, 200),
        landingPath: truncate(raw.landingPath, 500),
        referrerHost: truncate(raw.referrerHost, 200),
    };
}
