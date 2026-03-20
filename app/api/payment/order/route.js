import razorpay from "@/lib/razorpay";
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function POST(request) {
    try {
        const { amount, currency = "INR", receipt, userId, description } = await request.json();

        const options = {
            amount: amount * 100, // amount in the smallest currency unit (paise)
            currency,
            receipt,
        };

        const order = await razorpay.orders.create(options);

        // Track the transaction as PENDING
        if (userId) {
            await prisma.transaction.create({
                data: {
                    userId,
                    amount,
                    currency,
                    razorpayOrderId: order.id,
                    status: "PENDING",
                    description: description || `Order for ${amount} ${currency}`
                }
            });
        }

        return NextResponse.json(order);
    } catch (error) {
        console.error("Error creating Razorpay order:", error);
        return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
    }
}
