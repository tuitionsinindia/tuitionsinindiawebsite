// Simple in-memory rate limiter (no external dependencies)
// Tracks requests per IP with a sliding window

const globalForRate = global;
if (!globalForRate.rateLimitStore) {
    globalForRate.rateLimitStore = new Map();
}
const store = globalForRate.rateLimitStore;

// Clean old entries every 5 minutes
setInterval(() => {
    const now = Date.now();
    for (const [key, entries] of store) {
        const valid = entries.filter(t => now - t < 60000);
        if (valid.length === 0) store.delete(key);
        else store.set(key, valid);
    }
}, 300000);

/**
 * Check rate limit for a request.
 * @param {Request} request - Next.js request object
 * @param {string} prefix - Key prefix to separate different endpoints
 * @param {number} maxRequests - Max requests per window (default: 10)
 * @param {number} windowMs - Window size in ms (default: 60000 = 1 minute)
 * @returns {{ limited: boolean, remaining: number }}
 */
export function checkRateLimit(request, prefix = "default", maxRequests = 10, windowMs = 60000) {
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown";
    const key = `${prefix}:${ip}`;
    const now = Date.now();

    const existing = store.get(key) || [];
    const valid = existing.filter(t => now - t < windowMs);
    valid.push(now);
    store.set(key, valid);

    return {
        limited: valid.length > maxRequests,
        remaining: Math.max(0, maxRequests - valid.length),
    };
}
