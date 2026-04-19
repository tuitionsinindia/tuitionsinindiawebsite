import { NextResponse } from "next/server";
import { getEarlyTutorPromoStatus } from "@/lib/earlyAdopterPromo";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const status = await getEarlyTutorPromoStatus();
        return NextResponse.json({ success: true, ...status });
    } catch (err) {
        console.error("Early tutor promo status error:", err);
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}
