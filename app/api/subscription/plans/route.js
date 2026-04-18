import { NextResponse } from "next/server";

export async function GET() {
    const plans = [
        {
            id: "plan_pro_monthly",
            name: "Pro",
            tier: "PRO",
            price: 699,
            interval: "month",
            credits: 30,
            features: [
                "Verified badge on your profile",
                "30 credits per month",
                "Priority search ranking",
                "Direct student messaging",
                "Up to 5 subject categories"
            ]
        },
        {
            id: "plan_elite_monthly",
            name: "Elite",
            tier: "ELITE",
            price: 2499,
            interval: "month",
            credits: 100,
            features: [
                "Everything in Pro",
                "100 credits per month",
                "Featured listing in search",
                "Top search ranking",
                "Dedicated support",
                "Unlimited subject categories"
            ]
        },
        {
            id: "plan_institute_monthly",
            name: "Institute Pro",
            tier: "ELITE",
            price: 4999,
            interval: "month",
            credits: 200,
            targetRole: "INSTITUTE",
            features: [
                "Up to 5 staff/teacher listings",
                "200 credits per month",
                "Verified institute badge",
                "Featured placement in search",
                "Priority student matching",
                "Dedicated account support",
                "Batch and course management"
            ]
        }
    ];

    return NextResponse.json(plans);
}
