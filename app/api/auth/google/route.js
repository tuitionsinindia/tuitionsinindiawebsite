import { NextResponse } from "next/server";
import crypto from "crypto";

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get("role") || "STUDENT";
    const mode = searchParams.get("mode") || "register";

    const clientId = process.env.GOOGLE_CLIENT_ID;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    if (!clientId) {
        return new Response("Google OAuth not configured", { status: 500 });
    }

    // CSRF state token
    const state = crypto.randomBytes(16).toString("hex");

    const params = new URLSearchParams({
        client_id: clientId,
        redirect_uri: `${baseUrl}/api/auth/google/callback`,
        response_type: "code",
        scope: "openid email profile",
        access_type: "online",
        prompt: "select_account",
        state,
    });

    const googleUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;

    const response = NextResponse.redirect(googleUrl);

    // Store state, role, and mode in cookies for the callback to use
    const cookieOpts = "HttpOnly; SameSite=Lax; Path=/; Max-Age=600";
    response.headers.append("Set-Cookie", `google_oauth_state=${state}; ${cookieOpts}`);
    response.headers.append("Set-Cookie", `google_oauth_role=${role}; ${cookieOpts}`);
    response.headers.append("Set-Cookie", `google_oauth_mode=${mode}; ${cookieOpts}`);

    return response;
}
