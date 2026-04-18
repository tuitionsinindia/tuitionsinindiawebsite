export const dynamic = "force-dynamic";

import { isAdminAuthorized } from "@/lib/adminAuth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { sendVerificationResultEmail } from "@/lib/email";

export async function PATCH(request, { params }) {
    try {
        if (!isAdminAuthorized(request)) {
            return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
        }

        const { id } = params;
        const { action, rejectionReason } = await request.json();

        if (!action || !["APPROVE", "REJECT"].includes(action)) {
            return NextResponse.json({ error: "Invalid action. Use APPROVE or REJECT." }, { status: 400 });
        }

        const verRequest = await prisma.verificationRequest.findUnique({ where: { id } });
        if (!verRequest) {
            return NextResponse.json({ error: "Verification request not found." }, { status: 404 });
        }

        if (action === "APPROVE") {
            await prisma.$transaction([
                prisma.verificationRequest.update({
                    where: { id },
                    data: { status: "APPROVED" },
                }),
                prisma.user.update({
                    where: { id: verRequest.tutorId },
                    data: { isVerified: true },
                }),
                prisma.notification.create({
                    data: {
                        userId: verRequest.tutorId,
                        type: "VERIFICATION_REQUEST",
                        title: "Your profile is now verified",
                        body: "Your profile is now verified! Your badge is live.",
                        link: "/dashboard/tutor",
                    },
                }),
            ]);

            // Non-blocking email to tutor
            prisma.user.findUnique({ where: { id: verRequest.tutorId }, select: { email: true, name: true } })
                .then(tutor => {
                    if (tutor?.email) sendVerificationResultEmail(tutor.email, tutor.name || "there", { approved: true });
                }).catch(() => {});

        } else {
            if (!rejectionReason) {
                return NextResponse.json({ error: "Please provide a reason for rejection." }, { status: 400 });
            }
            await prisma.$transaction([
                prisma.verificationRequest.update({
                    where: { id },
                    data: { status: "REJECTED", rejectionReason },
                }),
                prisma.notification.create({
                    data: {
                        userId: verRequest.tutorId,
                        type: "VERIFICATION_REQUEST",
                        title: "Verification request not approved",
                        body: `Your verification request was not approved. Reason: ${rejectionReason}. You can reapply.`,
                        link: "/dashboard/tutor",
                    },
                }),
            ]);

            // Non-blocking email to tutor
            prisma.user.findUnique({ where: { id: verRequest.tutorId }, select: { email: true, name: true } })
                .then(tutor => {
                    if (tutor?.email) sendVerificationResultEmail(tutor.email, tutor.name || "there", { approved: false, rejectionReason });
                }).catch(() => {});
        }

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("[Admin Verification Review]", err);
        return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
    }
}
