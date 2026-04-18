import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { getRazorpay } from "@/lib/razorpay";
import { sendTrialNotificationEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

const SITEURL = "https://tuitionsinindia.com";

async function issueFullRefund(depositPaymentId, trialId) {
    try {
        await getRazorpay().payments.refund(depositPaymentId, { amount: 14900 });
        await prisma.trialBooking.update({
            where: { id: trialId },
            data: { depositStatus: "REFUNDED" },
        });
    } catch (err) {
        console.error("Razorpay refund error:", err);
    }
}

export async function PATCH(request, { params }) {
    try {
        const session = getSession();
        if (!session) return NextResponse.json({ error: "Please log in to update this booking" }, { status: 401 });

        const { id } = await params;
        const { status, tutorNote, cancelReason, demoType, noShow } = await request.json();

        const trial = await prisma.trialBooking.findUnique({ where: { id } });
        if (!trial) return NextResponse.json({ error: "Booking not found" }, { status: 404 });

        const isTutor = session.role === "TUTOR" && trial.tutorId === session.id;
        const isStudent = session.role === "STUDENT" && trial.studentId === session.id;

        if (!isTutor && !isStudent) {
            return NextResponse.json({ error: "Not authorized" }, { status: 403 });
        }

        // Allowed state transitions
        const allowedTransitions = {
            TUTOR: {
                PENDING: ["CONFIRMED", "DECLINED"],
                CONFIRMED: ["COMPLETED", "CANCELLED"],
            },
            STUDENT: {
                PENDING: ["CANCELLED"],
                CONFIRMED: ["CANCELLED"],
            },
        };

        const role = isTutor ? "TUTOR" : "STUDENT";
        const allowed = allowedTransitions[role]?.[trial.status] || [];
        if (!allowed.includes(status)) {
            return NextResponse.json({ error: `Cannot change status from ${trial.status} to ${status}` }, { status: 400 });
        }

        // Fetch user details for notifications and emails
        const [student, tutor] = await Promise.all([
            prisma.user.findUnique({ where: { id: trial.studentId }, select: { id: true, email: true, name: true } }),
            prisma.user.findUnique({ where: { id: trial.tutorId }, select: { id: true, email: true, name: true } }),
        ]);

        let updateData = { status };
        if (tutorNote !== undefined) updateData.tutorNote = tutorNote || null;
        if (cancelReason !== undefined) updateData.cancelReason = cancelReason || null;

        // ── TUTOR → CONFIRMED ──────────────────────────────────────────────────
        if (isTutor && status === "CONFIRMED") {
            if (!demoType || !["FREE", "PAID"].includes(demoType)) {
                return NextResponse.json({ error: "Please choose whether this will be a free or paid demo" }, { status: 400 });
            }
            updateData.demoType = demoType;

            await prisma.trialBooking.update({ where: { id }, data: updateData });

            // Notify student
            await prisma.notification.create({
                data: {
                    userId: trial.studentId,
                    type: "TRIAL_UPDATE",
                    title: "Demo class confirmed!",
                    body: `Your demo for ${trial.subject} has been confirmed${demoType === "FREE" ? " as a free demo" : " as a paid demo (₹149)"}. The tutor will reach out to schedule the time.`,
                    link: "/dashboard/student?tab=TRIALS",
                },
            }).catch(() => {});

            if (student?.email) {
                sendTrialNotificationEmail(student.email, student.name, {
                    status: "CONFIRMED",
                    subject: trial.subject,
                    otherPartyName: tutor?.name || "your tutor",
                    dashboardLink: `${SITEURL}/dashboard/student?tab=TRIALS`,
                }).catch(() => {});
            }

            return NextResponse.json({ success: true });
        }

        // ── TUTOR → COMPLETED ──────────────────────────────────────────────────
        if (isTutor && status === "COMPLETED") {
            await prisma.trialBooking.update({ where: { id }, data: updateData });

            const depositPaid = trial.depositStatus === "PAID";

            // No-show flag — forfeit deposit to tutor
            if (noShow) {
                if (depositPaid) {
                    await prisma.trialBooking.update({
                        where: { id },
                        data: { depositStatus: "RELEASED", cancelReason: "Student did not attend" },
                    });

                    await prisma.transaction.create({
                        data: {
                            userId: trial.tutorId,
                            amount: 10000, // ₹100 in paise
                            currency: "INR",
                            status: "SUCCESS",
                            description: `No-show fee — ${student?.name || "student"}`,
                            razorpayPaymentId: trial.depositPaymentId,
                        },
                    }).catch(() => {});
                }

                await prisma.notification.create({
                    data: {
                        userId: trial.studentId,
                        type: "TRIAL_UPDATE",
                        title: "You missed your demo class",
                        body: `You were marked as not attending your demo for ${trial.subject}. Your ₹149 deposit has been forfeited. If you believe this is an error, contact support.`,
                        link: "/dashboard/student?tab=TRIALS",
                    },
                }).catch(() => {});

                return NextResponse.json({ success: true });
            }

            // Normal completion
            if (depositPaid) {
                if (trial.demoType === "FREE") {
                    // Return deposit as platform credit
                    await prisma.$transaction([
                        prisma.trialBooking.update({ where: { id }, data: { depositStatus: "CREDITED" } }),
                        prisma.user.update({
                            where: { id: trial.studentId },
                            data: { platformCredit: { increment: 14900 } },
                        }),
                    ]);

                    await prisma.notification.create({
                        data: {
                            userId: trial.studentId,
                            type: "TRIAL_UPDATE",
                            title: "Demo deposit returned as credit",
                            body: "Your ₹149 demo deposit has been returned as platform credit. Use it toward your next demo booking.",
                            link: "/dashboard/student?tab=TRIALS",
                        },
                    }).catch(() => {});

                } else if (trial.demoType === "PAID") {
                    // Release to tutor ledger
                    await prisma.trialBooking.update({ where: { id }, data: { depositStatus: "RELEASED" } });

                    await prisma.transaction.create({
                        data: {
                            userId: trial.tutorId,
                            amount: 11900, // ₹119 in paise (₹149 - ₹30 platform cut)
                            currency: "INR",
                            status: "SUCCESS",
                            description: `Demo fee — ${student?.name || "student"}`,
                            razorpayPaymentId: trial.depositPaymentId,
                        },
                    }).catch(() => {});

                    await prisma.notification.create({
                        data: {
                            userId: trial.tutorId,
                            type: "TRIAL_UPDATE",
                            title: "Demo earnings added",
                            body: "₹119 has been added to your earnings. Payout processed within 7 days.",
                            link: "/dashboard/tutor?tab=TRIALS",
                        },
                    }).catch(() => {});

                    await prisma.notification.create({
                        data: {
                            userId: trial.studentId,
                            type: "TRIAL_UPDATE",
                            title: "Demo class complete",
                            body: `Your demo class for ${trial.subject} is complete. You can now leave a review.`,
                            link: "/dashboard/student?tab=TRIALS",
                        },
                    }).catch(() => {});
                }
            }

            if (student?.email) {
                sendTrialNotificationEmail(student.email, student.name, {
                    status: "COMPLETED",
                    subject: trial.subject,
                    otherPartyName: tutor?.name || "your tutor",
                    dashboardLink: `${SITEURL}/dashboard/student?tab=TRIALS`,
                }).catch(() => {});
            }

            return NextResponse.json({ success: true });
        }

        // ── TUTOR → DECLINED ──────────────────────────────────────────────────
        if (isTutor && status === "DECLINED") {
            await prisma.trialBooking.update({ where: { id }, data: updateData });

            if (trial.depositStatus === "PAID" && trial.depositPaymentId) {
                await issueFullRefund(trial.depositPaymentId, id);
            }

            await prisma.notification.create({
                data: {
                    userId: trial.studentId,
                    type: "TRIAL_UPDATE",
                    title: "Demo request not accepted",
                    body: `Your demo request for ${trial.subject} was not accepted. Your deposit will be refunded. Try booking with another tutor.`,
                    link: "/dashboard/student?tab=TRIALS",
                },
            }).catch(() => {});

            if (student?.email) {
                sendTrialNotificationEmail(student.email, student.name, {
                    status: "DECLINED",
                    subject: trial.subject,
                    otherPartyName: tutor?.name || "your tutor",
                    dashboardLink: `${SITEURL}/dashboard/student?tab=TRIALS`,
                }).catch(() => {});
            }

            return NextResponse.json({ success: true });
        }

        // ── TUTOR → CANCELLED ──────────────────────────────────────────────────
        if (isTutor && status === "CANCELLED") {
            await prisma.trialBooking.update({ where: { id }, data: updateData });

            if (trial.depositStatus === "PAID" && trial.depositPaymentId) {
                await issueFullRefund(trial.depositPaymentId, id);
            }

            await prisma.notification.create({
                data: {
                    userId: trial.studentId,
                    type: "TRIAL_UPDATE",
                    title: "Demo class cancelled",
                    body: `The demo booking for ${trial.subject} was cancelled by the tutor. Any deposit will be refunded.`,
                    link: "/dashboard/student?tab=TRIALS",
                },
            }).catch(() => {});

            if (student?.email) {
                sendTrialNotificationEmail(student.email, student.name, {
                    status: "CANCELLED",
                    subject: trial.subject,
                    otherPartyName: tutor?.name || "your tutor",
                    dashboardLink: `${SITEURL}/dashboard/student?tab=TRIALS`,
                }).catch(() => {});
            }

            return NextResponse.json({ success: true });
        }

        // ── STUDENT → CANCELLED ───────────────────────────────────────────────
        if (isStudent && status === "CANCELLED") {
            await prisma.trialBooking.update({ where: { id }, data: updateData });

            const depositPaid = trial.depositStatus === "PAID" && trial.depositPaymentId;

            if (trial.status === "PENDING") {
                // Full refund
                if (depositPaid) {
                    await issueFullRefund(trial.depositPaymentId, id);
                }
            } else if (trial.status === "CONFIRMED") {
                const hoursSinceCreation = (Date.now() - new Date(trial.createdAt).getTime()) / 3600000;

                if (hoursSinceCreation <= 24) {
                    // Within 24h — full refund
                    if (depositPaid) {
                        await issueFullRefund(trial.depositPaymentId, id);
                    }
                } else {
                    // After 24h — forfeit deposit
                    if (depositPaid) {
                        await prisma.trialBooking.update({
                            where: { id },
                            data: { depositStatus: "RELEASED" },
                        });

                        await prisma.transaction.create({
                            data: {
                                userId: trial.tutorId,
                                amount: 10000, // ₹100 to tutor
                                currency: "INR",
                                status: "SUCCESS",
                                description: `Late cancellation fee — ${student?.name || "student"}`,
                                razorpayPaymentId: trial.depositPaymentId,
                            },
                        }).catch(() => {});

                        // ₹49 platform ledger entry (logged against platform admin)
                        // This is an internal accounting entry — omit userId or track separately if needed
                    }
                }
            }

            // Notify tutor
            await prisma.notification.create({
                data: {
                    userId: trial.tutorId,
                    type: "TRIAL_UPDATE",
                    title: "Demo booking cancelled",
                    body: `The demo booking for ${trial.subject} has been cancelled by the student.`,
                    link: "/dashboard/tutor?tab=TRIALS",
                },
            }).catch(() => {});

            if (tutor?.email) {
                sendTrialNotificationEmail(tutor.email, tutor.name, {
                    status: "CANCELLED",
                    subject: trial.subject,
                    otherPartyName: student?.name || "the student",
                    dashboardLink: `${SITEURL}/dashboard/tutor?tab=TRIALS`,
                }).catch(() => {});
            }

            return NextResponse.json({ success: true });
        }

        // Fallback — should not reach here
        return NextResponse.json({ error: "Invalid status change" }, { status: 400 });

    } catch (error) {
        console.error("Trial status error:", error);
        return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
    }
}
