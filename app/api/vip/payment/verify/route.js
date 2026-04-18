export const dynamic = "force-dynamic";

import crypto from "crypto";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { triggerFirstMatch } from "@/lib/vipUtils";
import { NextResponse } from "next/server";

function verifyRazorpaySignature(orderId, paymentId, signature, secret) {
    const expected = crypto
        .createHmac("sha256", secret)
        .update(`${orderId}|${paymentId}`)
        .digest("hex");
    return expected === signature;
}

export async function POST(request) {
    try {
        const session = getSession();
        if (!session) {
            return NextResponse.json({ error: "Please log in to continue." }, { status: 401 });
        }
        if (session.role !== "STUDENT") {
            return NextResponse.json({ error: "Only students can verify VIP payments." }, { status: 403 });
        }

        const body = await request.json();
        const { applicationId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = body;

        if (!applicationId || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
            return NextResponse.json({ error: "Missing required payment details." }, { status: 400 });
        }

        // Verify the Razorpay signature
        const isValid = verifyRazorpaySignature(
            razorpayOrderId,
            razorpayPaymentId,
            razorpaySignature,
            process.env.RAZORPAY_KEY_SECRET
        );
        if (!isValid) {
            return NextResponse.json({ error: "Payment verification failed. Please contact support." }, { status: 400 });
        }

        // Find the application
        const application = await prisma.vipApplication.findFirst({
            where: {
                id: applicationId,
                studentId: session.id,
                status: "PENDING_PAYMENT",
            },
        });
        if (!application) {
            return NextResponse.json(
                { error: "Application not found or payment already processed." },
                { status: 404 }
            );
        }

        // Mark application as active with payment recorded
        await prisma.vipApplication.update({
            where: { id: applicationId },
            data: {
                status: "ACTIVE",
                enrollmentPaymentId: razorpayPaymentId,
            },
        });

        // Fire and forget: trigger first tutor match
        triggerFirstMatch(applicationId).catch((err) => {
            console.error("[VIP] triggerFirstMatch failed:", err.message);
        });

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("[VIP Payment Verify]", err);
        return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
    }
}
