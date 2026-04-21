import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

// PATCH /api/admin/listing/feature
// Body: { listingId, isFeatured, featuredUntil? }
export async function PATCH(request) {
    const session = getSession();
    if (!session || session.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { listingId, isFeatured, featuredUntil } = await request.json();
    if (!listingId || typeof isFeatured !== "boolean") {
        return NextResponse.json({ error: "listingId and isFeatured required" }, { status: 400 });
    }

    const listing = await prisma.listing.update({
        where: { id: listingId },
        data: {
            isFeatured,
            featuredUntil: isFeatured ? (featuredUntil ? new Date(featuredUntil) : null) : null,
        },
        select: { id: true, isFeatured: true, featuredUntil: true },
    });

    return NextResponse.json({ success: true, listing });
}
