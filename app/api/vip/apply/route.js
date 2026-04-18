export const dynamic = "force-dynamic";

import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getRazorpay } from "@/lib/razorpay";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const session = getSession();
        if (!session) {
            return NextResponse.json({ error: "Please log in to continue." }, { status: 401 });
        }
        if (session.role !== "STUDENT") {
            return NextResponse.json({ error: "Only students can apply for the VIP service." }, { status: 403 });
        }

        const body = await request.json();
        const {
            subjects,
            grades,
            locations,
            budget,
            schedule,
            genderPreference,
            boardPreference,
            modePreference,
            additionalNotes,
        } = body;

        // Validate required fields
        if (!subjects || !Array.isArray(subjects) || subjects.length === 0) {
            return NextResponse.json({ error: "Please select at least one subject." }, { status: 400 });
        }
        if (!grades || !Array.isArray(grades) || grades.length === 0) {
            return NextResponse.json({ error: "Please select at least one grade." }, { status: 400 });
        }
        if (!locations || !Array.isArray(locations) || locations.length === 0) {
            return NextResponse.json({ error: "Please select at least one location." }, { status: 400 });
        }

        // Check for existing active application
        const existing = await prisma.vipApplication.findFirst({
            where: {
                studentId: session.id,
                status: { in: ["ACTIVE", "MATCHED"] },
            },
        });
        if (existing) {
            return NextResponse.json(
                { error: "You already have an active VIP application.", applicationId: existing.id },
                { status: 409 }
            );
        }

        // Create the VIP application
        const application = await prisma.vipApplication.create({
            data: {
                studentId: session.id,
                subjects,
                grades,
                locations,
                budget: budget || null,
                schedule: schedule || null,
                genderPreference: genderPreference || null,
                boardPreference: boardPreference || null,
                modePreference: modePreference || null,
                additionalNotes: additionalNotes || null,
                status: "PENDING_PAYMENT",
            },
        });

        // Create Razorpay order for ₹2,000 enrollment fee
        const razorpay = getRazorpay();
        const order = await razorpay.orders.create({
            amount: 200000,
            currency: "INR",
            receipt: application.id,
            notes: {
                type: "vip_enrollment",
                applicationId: application.id,
                studentId: session.id,
            },
        });

        // Store the order ID on the application
        await prisma.vipApplication.update({
            where: { id: application.id },
            data: { enrollmentOrderId: order.id },
        });

        return NextResponse.json({
            applicationId: application.id,
            orderId: order.id,
            amount: 200000,
            currency: "INR",
            keyId: process.env.RAZORPAY_KEY_ID,
        });
    } catch (err) {
        console.error("[VIP Apply]", err);
        return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
    }
}
