export const dynamic = "force-dynamic";

import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://tuitionsinindia.com";

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const contractId = searchParams.get("contractId");
    const razorpayPaymentId = searchParams.get("razorpay_payment_id");
    const paymentStatus = searchParams.get("razorpay_payment_link_status");

    const successUrl = `${BASE_URL}/dashboard/tutor?tab=vip&payment=success`;
    const failedUrl = `${BASE_URL}/dashboard/tutor?tab=vip&payment=failed`;

    if (!contractId) {
        return NextResponse.redirect(failedUrl);
    }

    if (paymentStatus === "paid") {
        try {
            const payment = await prisma.vipPayment.findFirst({
                where: {
                    contractId,
                    status: "PENDING",
                },
                include: {
                    contract: {
                        select: { tutorId: true },
                    },
                },
            });

            if (payment) {
                await prisma.vipPayment.update({
                    where: { id: payment.id },
                    data: {
                        status: "PAID",
                        razorpayPaymentId: razorpayPaymentId || null,
                        paidAt: new Date(),
                    },
                });

                // Notify the tutor
                if (payment.contract?.tutorId) {
                    await prisma.notification.create({
                        data: {
                            userId: payment.contract.tutorId,
                            type: "VIP_PAYMENT",
                            title: "Commission payment received",
                            body: "Your VIP introduction fee payment has been received. Thank you!",
                            link: "/dashboard/tutor?tab=vip",
                        },
                    }).catch((err) => {
                        console.error("[VIP Tutor Payment] Notification failed:", err.message);
                    });
                }
            }

            return NextResponse.redirect(successUrl);
        } catch (err) {
            console.error("[VIP Tutor Payment Verify]", err);
            return NextResponse.redirect(failedUrl);
        }
    }

    return NextResponse.redirect(failedUrl);
}
