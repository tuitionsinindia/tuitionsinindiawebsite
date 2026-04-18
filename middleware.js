import { NextResponse } from "next/server";

/**
 * Edge middleware — protects dashboard routes.
 * Verifies the ti_session cookie exists before serving any /dashboard/* page.
 * Full token signature verification still happens in each API route.
 */
export function middleware(request) {
    const { pathname } = request.nextUrl;

    // Admin dashboard uses its own key-based auth (localStorage) — skip cookie check
    if (pathname.startsWith("/dashboard/admin")) {
        return NextResponse.next();
    }

    // All other dashboard routes require a session cookie
    const sessionCookie = request.cookies.get("ti_session");
    if (!sessionCookie?.value) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*"],
};
