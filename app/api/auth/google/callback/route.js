import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createSessionToken, makeSessionCookie } from "@/lib/session";

function popupResponse(data, setCookie = null) {
    const json = JSON.stringify(data);
    const html = `<!DOCTYPE html><html><body><script>
        window.opener.postMessage(${json}, window.location.origin);
        window.close();
    </script><p>Redirecting...</p></body></html>`;

    const headers = { "Content-Type": "text/html" };
    if (setCookie) headers["Set-Cookie"] = setCookie;
    return new Response(html, { status: 200, headers });
}

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const code = searchParams.get("code");
        const state = searchParams.get("state");
        const error = searchParams.get("error");

        // User denied access
        if (error) {
            return popupResponse({ type: "GOOGLE_AUTH_ERROR", error: "Google sign-in was cancelled." });
        }

        // Validate CSRF state
        const storedState = request.cookies.get("google_oauth_state")?.value;
        if (!state || state !== storedState) {
            return popupResponse({ type: "GOOGLE_AUTH_ERROR", error: "Invalid state. Please try again." });
        }

        const role = request.cookies.get("google_oauth_role")?.value || "STUDENT";
        const mode = request.cookies.get("google_oauth_mode")?.value || "register";
        const clientId = process.env.GOOGLE_CLIENT_ID;
        const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

        if (!clientId || !clientSecret) {
            return popupResponse({ type: "GOOGLE_AUTH_ERROR", error: "OAuth not configured." });
        }

        // Exchange authorization code for tokens
        const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                code,
                client_id: clientId,
                client_secret: clientSecret,
                redirect_uri: `${baseUrl}/api/auth/google/callback`,
                grant_type: "authorization_code",
            }),
        });

        const tokenData = await tokenRes.json();
        if (!tokenRes.ok || !tokenData.access_token) {
            console.error("Google token exchange failed:", tokenData);
            return popupResponse({ type: "GOOGLE_AUTH_ERROR", error: "Failed to authenticate with Google." });
        }

        // Get user info from Google
        const userInfoRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
            headers: { Authorization: `Bearer ${tokenData.access_token}` },
        });
        const googleUser = await userInfoRes.json();

        if (!googleUser.sub) {
            return popupResponse({ type: "GOOGLE_AUTH_ERROR", error: "Could not get your Google profile." });
        }

        const { sub: googleId, email, name, picture } = googleUser;

        // Find or create user: googleId → email → create new
        let user = await prisma.user.findUnique({ where: { googleId } });

        if (!user && email) {
            // Check if a phone-registered user has the same email — link accounts
            user = await prisma.user.findUnique({ where: { email } });
            if (user) {
                user = await prisma.user.update({
                    where: { id: user.id },
                    data: {
                        googleId,
                        image: user.image || picture,
                        name: user.name || name,
                        provider: user.provider === "phone" ? "phone" : "google",
                    },
                });
            }
        }

        if (!user) {
            if (mode === "login") {
                return popupResponse({
                    type: "GOOGLE_AUTH_ERROR",
                    error: "No account found with this Google account. Please register first.",
                });
            }
            user = await prisma.user.create({
                data: {
                    googleId,
                    email,
                    name,
                    image: picture,
                    role,
                    provider: "google",
                    phoneVerified: false,
                },
            });
        }

        // If phone is already verified, this is a returning user — set session cookie
        const userData = {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
            role: user.role,
            phone: user.phone,
            phoneVerified: user.phoneVerified,
        };

        if (user.phoneVerified && user.phone) {
            const token = createSessionToken(user);
            const cookie = makeSessionCookie(token);
            return popupResponse({ type: "GOOGLE_AUTH_SUCCESS", user: userData }, cookie);
        }

        // Phone not verified yet — frontend will show phone verify step
        return popupResponse({ type: "GOOGLE_AUTH_SUCCESS", user: userData });

    } catch (error) {
        console.error("Google OAuth callback error:", error);
        return popupResponse({ type: "GOOGLE_AUTH_ERROR", error: "Something went wrong. Please try again." });
    }
}
