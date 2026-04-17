import { cookies } from "next/headers";
import { verifyToken } from "@/lib/session";

/**
 * Returns the authenticated session payload from the ti_session cookie,
 * or null if the cookie is missing or the token is invalid/expired.
 *
 * Usage in API routes:
 *   const session = getSession();
 *   if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
 *   if (session.id !== userId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
 */
export function getSession() {
    const cookieStore = cookies();
    const token = cookieStore.get("ti_session")?.value;
    if (!token) return null;
    return verifyToken(token);
}
