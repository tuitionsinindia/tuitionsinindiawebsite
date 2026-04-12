import crypto from "crypto";

const SECRET = process.env.SESSION_SECRET || process.env.AUDIT_SEED_KEY || "tuitions-default-secret";
const COOKIE_NAME = "ti_session";
const MAX_AGE = 30 * 24 * 60 * 60; // 30 days in seconds

/**
 * Signs a payload object and returns a token string: base64(payload).signature
 */
function signPayload(payload) {
    const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
    const sig = crypto.createHmac("sha256", SECRET).update(data).digest("hex");
    return `${data}.${sig}`;
}

/**
 * Verifies and decodes a token. Returns the payload or null if invalid/expired.
 */
export function verifyToken(token) {
    if (!token || typeof token !== "string") return null;
    const [data, sig] = token.split(".");
    if (!data || !sig) return null;

    const expectedSig = crypto.createHmac("sha256", SECRET).update(data).digest("hex");
    if (!crypto.timingSafeEqual(Buffer.from(sig, "hex"), Buffer.from(expectedSig, "hex"))) return null;

    try {
        const payload = JSON.parse(Buffer.from(data, "base64url").toString());
        if (payload.exp && Date.now() > payload.exp) return null;
        return payload;
    } catch {
        return null;
    }
}

/**
 * Creates a signed session token for a user.
 */
export function createSessionToken(user) {
    return signPayload({
        id: user.id,
        role: user.role,
        exp: Date.now() + MAX_AGE * 1000,
    });
}

/**
 * Returns a Set-Cookie header string for the session cookie.
 */
export function makeSessionCookie(token) {
    return `${COOKIE_NAME}=${token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${MAX_AGE}${process.env.NODE_ENV === "production" ? "; Secure" : ""}`;
}

/**
 * Returns a Set-Cookie header string that clears the session cookie.
 */
export function clearSessionCookie() {
    return `${COOKIE_NAME}=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0`;
}

export { COOKIE_NAME };
