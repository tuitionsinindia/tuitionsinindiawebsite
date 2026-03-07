import { NextResponse } from "next/server";
import razorpay from "@/lib/razorpay";

export const dynamic = 'force-dynamic';

export async function POST(request) {
    try {
        const { amount, currency = "INR", receipt } = await request.json();

        const options = {
            amount: amount * 100, // amount in the smallest currency unit (paise)
            currency,
            receipt,
        };

        const order = await razorpay.orders.create(options);

        return NextResponse.json(order);
    } catch (error) {
        console.error("Error creating Razorpay order:", error);
        return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
    }
}
