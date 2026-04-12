/**
 * Validates the x-admin-key header against AUDIT_SEED_KEY env var.
 * Returns true if authorized, false otherwise.
 */
export function isAdminAuthorized(request) {
    const key = request.headers.get("x-admin-key");
    if (!key || !process.env.AUDIT_SEED_KEY) return false;
    return key === process.env.AUDIT_SEED_KEY;
}
