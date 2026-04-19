import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { isAdminAuthorized } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

// Returns attribution breakdowns for the admin dashboard.
// Takes an optional `range` query param: "7d" | "30d" | "90d" | "all". Defaults to 30d.
export async function GET(request) {
    if (!isAdminAuthorized(request)) {
        return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const range = searchParams.get("range") || "30d";

    const since = (() => {
        const now = Date.now();
        if (range === "7d") return new Date(now - 7 * 24 * 60 * 60 * 1000);
        if (range === "30d") return new Date(now - 30 * 24 * 60 * 60 * 1000);
        if (range === "90d") return new Date(now - 90 * 24 * 60 * 60 * 1000);
        return null; // all-time
    })();

    const baseWhere = since ? { createdAt: { gte: since } } : {};

    try {
        const [
            totalUsers,
            attributedUsers,
            bySource,
            byCampaign,
            byLandingPath,
            byRole,
            recentUsers,
        ] = await Promise.all([
            prisma.user.count({ where: baseWhere }),
            prisma.user.count({ where: { ...baseWhere, NOT: { utmSource: null } } }),
            prisma.user.groupBy({
                by: ["utmSource"],
                where: baseWhere,
                _count: { _all: true },
                orderBy: { _count: { utmSource: "desc" } },
                take: 20,
            }),
            prisma.user.groupBy({
                by: ["utmCampaign"],
                where: { ...baseWhere, NOT: { utmCampaign: null } },
                _count: { _all: true },
                orderBy: { _count: { utmCampaign: "desc" } },
                take: 20,
            }),
            prisma.user.groupBy({
                by: ["landingPath"],
                where: { ...baseWhere, NOT: { landingPath: null } },
                _count: { _all: true },
                orderBy: { _count: { landingPath: "desc" } },
                take: 20,
            }),
            prisma.user.groupBy({
                by: ["role", "utmSource"],
                where: baseWhere,
                _count: { _all: true },
            }),
            prisma.user.findMany({
                where: { ...baseWhere, NOT: { utmSource: null } },
                select: {
                    id: true,
                    name: true,
                    role: true,
                    createdAt: true,
                    utmSource: true,
                    utmMedium: true,
                    utmCampaign: true,
                    utmContent: true,
                    landingPath: true,
                },
                orderBy: { createdAt: "desc" },
                take: 25,
            }),
        ]);

        // Build a role×source matrix (e.g., how many TUTOR signups came from Facebook vs Google).
        const roleSourceMatrix = {};
        for (const row of byRole) {
            const source = row.utmSource || "(direct)";
            if (!roleSourceMatrix[source]) roleSourceMatrix[source] = {};
            roleSourceMatrix[source][row.role] = row._count._all;
        }

        const format = (rows, key) =>
            rows.map((r) => ({
                key: r[key] || "(direct)",
                count: r._count._all,
            }));

        return NextResponse.json({
            success: true,
            range,
            totalUsers,
            attributedUsers,
            attributionRate: totalUsers > 0 ? Math.round((attributedUsers / totalUsers) * 100) : 0,
            bySource: format(bySource, "utmSource"),
            byCampaign: format(byCampaign, "utmCampaign"),
            byLandingPath: format(byLandingPath, "landingPath"),
            roleSourceMatrix,
            recentUsers: recentUsers.map((u) => ({
                id: u.id,
                name: u.name || "(no name)",
                role: u.role,
                createdAt: u.createdAt,
                utmSource: u.utmSource,
                utmMedium: u.utmMedium,
                utmCampaign: u.utmCampaign,
                utmContent: u.utmContent,
                landingPath: u.landingPath,
            })),
            generatedAt: new Date().toISOString(),
        });
    } catch (err) {
        console.error("Attribution API error:", err);
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}
