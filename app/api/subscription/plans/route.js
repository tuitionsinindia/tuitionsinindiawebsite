import { NextResponse } from "next/server";

export async function GET() {
    const plans = [
        {
            id: "plan_pro_monthly",
            name: "Pro Tutor",
            tier: "PRO",
            price: 999,
            interval: "month",
            credits: 15,
            features: [
                "Highlighted Search Profile",
                "15 Free Lead Credits/mo",
                "Verified Badge",
                "Direct Message Dashboard"
            ]
        },
        {
            id: "plan_elite_yearly",
            name: "Elite Expert",
            tier: "ELITE",
            price: 8999,
            interval: "year",
            credits: 200,
            features: [
                "Top Tier Search Ranking",
                "200 Free Lead Credits/yr",
                "Elite Expert Badge",
                "Dedicated Support",
                "Profile Promotion in Newsletters"
            ]
        }
    ];

    return NextResponse.json(plans);
}
