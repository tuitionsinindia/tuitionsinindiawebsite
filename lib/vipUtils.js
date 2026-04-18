/**
 * vipUtils.js — Core automation for the VIP Managed Introduction Service
 *
 * Automated pipeline:
 *   Payment confirmed → auto-match tutor → email student
 *   Student accepts → Jitsi call link → email both parties
 *   Student confirms → Razorpay payment link → email tutor
 *   Tutor pays → reveal contact details → email student
 */

import prisma from "@/lib/prisma";
import { calculateMatchScore } from "@/lib/matchEngine";
import { getRazorpay } from "@/lib/razorpay";
import { Resend } from "resend";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://tuitionsinindia.com";
const PLATFORM_COMMISSION_PCT = 0.15; // 15% of student's stated budget

// ─── Match Engine ────────────────────────────────────────────────────────────

/**
 * Find the best unmatched VIP tutor for a given application.
 * Runs the existing match engine against the VIP tutor pool.
 * @returns {object|null} Prisma Listing record with .tutor included, or null
 */
export async function findNextVipTutor(application) {
    const previousMatches = await prisma.vipMatch.findMany({
        where: { applicationId: application.id },
        select: { tutorId: true },
    });
    const excludedTutorIds = previousMatches.map((m) => m.tutorId);

    // Build location/subject filter — at least one must match
    const orConditions = [];
    if (application.subjects?.length > 0) {
        orConditions.push({ subjects: { hasSome: application.subjects } });
    }
    if (application.locations?.length > 0) {
        orConditions.push({ locations: { hasSome: application.locations } });
    }

    const candidates = await prisma.listing.findMany({
        where: {
            isVipEligible: true,
            isActive: true,
            tutorId: { notIn: excludedTutorIds },
            ...(orConditions.length > 0 && { OR: orConditions }),
            // Gender preference
            ...(application.genderPreference && application.genderPreference !== "ANY" && {
                gender: application.genderPreference,
            }),
            // Teaching mode
            ...(application.modePreference && application.modePreference !== "BOTH" && {
                teachingModes: { hasSome: [application.modePreference] },
            }),
            // Board preference
            ...(application.boardPreference && {
                boards: { hasSome: [application.boardPreference] },
            }),
            // Budget — only show tutors within range (or those with no rate set)
            ...(application.budget && {
                OR: [
                    { hourlyRate: null },
                    { hourlyRate: { lte: application.budget } },
                ],
            }),
        },
        include: {
            tutor: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                    isVerified: true,
                    image: true,
                },
            },
        },
    });

    if (candidates.length === 0) return null;

    // Score every candidate against the student's requirements
    const requesterCriterion = {
        subjects: application.subjects || [],
        grades: application.grades || [],
        locations: application.locations || [],
        modes: application.modePreference ? [application.modePreference] : [],
    };

    const scored = candidates
        .map((listing) => ({
            listing,
            score: calculateMatchScore(requesterCriterion, {
                subjects: listing.subjects,
                grades: listing.grades,
                locations: listing.locations,
                teachingModes: listing.teachingModes || [],
            }).score,
        }))
        .sort((a, b) => b.score - a.score);

    return scored[0].listing;
}

// ─── Core Automation Steps ───────────────────────────────────────────────────

/**
 * Step 1 — Called after enrollment payment is confirmed.
 * Finds the best VIP tutor, creates a VipMatch, and emails the student.
 */
export async function triggerFirstMatch(applicationId) {
    const application = await prisma.vipApplication.findUnique({
        where: { id: applicationId },
        include: { student: { select: { id: true, name: true, email: true, phone: true } } },
    });
    if (!application || application.status !== "ACTIVE") return;

    const listing = await findNextVipTutor(application);

    if (!listing) {
        // No VIP tutor available — notify admin, mark for manual review
        await prisma.vipApplication.update({
            where: { id: applicationId },
            data: { adminNotes: "AUTO: No VIP tutor match found. Needs manual review." },
        });
        await sendAdminAlert(application, "No VIP tutor match found for new application.");
        return;
    }

    const match = await prisma.vipMatch.create({
        data: {
            applicationId,
            tutorId: listing.tutorId,
            recommendationNumber: 1,
            status: "SENT",
        },
    });

    await prisma.vipApplication.update({
        where: { id: applicationId },
        data: { currentMatchNumber: 1 },
    });

    await sendMatchEmail(application.student, listing, match, 1);
    await createNotification(application.studentId, "VIP_MATCH",
        "Your first tutor recommendation is ready!",
        `We've found a great match for you. Log in to view their profile.`,
        `/dashboard/student?tab=vip`
    );
}

/**
 * Step 2a — Student rejected current match. Find and send next tutor.
 */
export async function triggerNextMatch(applicationId) {
    const application = await prisma.vipApplication.findUnique({
        where: { id: applicationId },
        include: { student: { select: { id: true, name: true, email: true } } },
    });
    if (!application) return;

    const nextNumber = application.currentMatchNumber + 1;

    // All 5 recommendations exhausted → refund
    if (nextNumber > application.maxRecommendations) {
        await prisma.vipApplication.update({
            where: { id: applicationId },
            data: { status: "REFUNDED" },
        });
        await sendRefundEmail(application.student, application);
        await sendAdminAlert(application, "All 5 recommendations rejected — refund initiated.");
        return;
    }

    const listing = await findNextVipTutor(application);

    if (!listing) {
        await prisma.vipApplication.update({
            where: { id: applicationId },
            data: { adminNotes: `AUTO: No more VIP tutors for match #${nextNumber}. Manual review needed.` },
        });
        await sendAdminAlert(application, `No tutor available for recommendation #${nextNumber}.`);
        return;
    }

    const match = await prisma.vipMatch.create({
        data: {
            applicationId,
            tutorId: listing.tutorId,
            recommendationNumber: nextNumber,
            status: "SENT",
        },
    });

    await prisma.vipApplication.update({
        where: { id: applicationId },
        data: { currentMatchNumber: nextNumber },
    });

    await sendMatchEmail(application.student, listing, match, nextNumber);
    await createNotification(application.studentId, "VIP_MATCH",
        `Recommendation #${nextNumber}: New tutor match ready`,
        `We've found another great match for you. Log in to view their profile.`,
        `/dashboard/student?tab=vip`
    );
}

/**
 * Step 2b — Student accepted a match. Generate intro call link, notify both parties.
 */
export async function triggerIntroCall(matchId) {
    const match = await prisma.vipMatch.findUnique({
        where: { id: matchId },
        include: {
            application: {
                include: { student: { select: { id: true, name: true, email: true, phone: true } } },
            },
            tutor: { select: { id: true, name: true, email: true, phone: true } },
        },
    });
    if (!match) return;

    // Generate unique Jitsi call room (free, no auth needed)
    const callRoomId = `TiI-VIP-${matchId.slice(0, 16)}`;
    const introCallUrl = `https://meet.jit.si/${callRoomId}`;

    await prisma.vipMatch.update({
        where: { id: matchId },
        data: { introCallUrl },
    });

    const student = match.application.student;
    const tutor = match.tutor;

    // Email student
    await sendEmail(student.email, `Your intro call with ${tutor.name} is ready — TuitionsInIndia VIP`,
        buildIntroCallEmailHtml({
            recipientName: student.name,
            otherPartyName: tutor.name,
            role: "student",
            callUrl: introCallUrl,
            applicationId: match.applicationId,
        })
    );

    // Email tutor
    await sendEmail(tutor.email, `New VIP Student Introduction — ${student.name}`,
        buildIntroCallEmailHtml({
            recipientName: tutor.name,
            otherPartyName: student.name,
            role: "tutor",
            callUrl: introCallUrl,
            applicationId: match.applicationId,
            studentSubjects: match.application.subjects,
        })
    );

    await createNotification(student.id, "VIP_CALL",
        "Your intro call link is ready",
        `Click to join your call with ${tutor.name}`,
        `/dashboard/student?tab=vip`
    );
    await createNotification(tutor.id, "VIP_CALL",
        "New VIP student intro call",
        `${student.name} wants to connect with you. Join the call now.`,
        `/dashboard/tutor?tab=vip`
    );
}

/**
 * Step 3 — Student confirmed tutor. Create contract, generate Razorpay payment link for tutor commission.
 */
export async function triggerContractAndPaymentLink(matchId) {
    const match = await prisma.vipMatch.findUnique({
        where: { id: matchId },
        include: {
            application: {
                include: { student: { select: { id: true, name: true, email: true } } },
            },
            tutor: { select: { id: true, name: true, email: true, phone: true } },
        },
    });
    if (!match) return;

    const application = match.application;
    const student = application.student;
    const tutor = match.tutor;

    // Commission = 15% of stated monthly budget (minimum ₹500)
    const monthlyBudget = application.budget || 5000;
    const commissionAmount = Math.max(500, Math.round(monthlyBudget * PLATFORM_COMMISSION_PCT));
    const commissionAmountPaise = commissionAmount * 100;

    // Create VipContract
    const contract = await prisma.vipContract.create({
        data: {
            applicationId: application.id,
            studentId: application.studentId,
            tutorId: match.tutorId,
            monthlyFee: monthlyBudget * 100,
            tutorPayout: Math.round(monthlyBudget * 0.85) * 100,
            platformCut: commissionAmountPaise,
            status: "ACTIVE", // Contact details released on contract creation; payment is good faith
            replacementsLeft: application.maxReplacements - application.replacementsUsed,
        },
    });

    // Update application status
    await prisma.vipApplication.update({
        where: { id: application.id },
        data: { status: "MATCHED" },
    });

    // Generate Razorpay Payment Link for tutor commission
    let paymentLinkUrl = null;
    try {
        const razorpay = getRazorpay();
        const paymentLink = await razorpay.paymentLink.create({
            amount: commissionAmountPaise,
            currency: "INR",
            accept_partial: false,
            description: `VIP Tuition Commission — Student: ${student.name}`,
            customer: {
                name: tutor.name,
                email: tutor.email,
                ...(tutor.phone && { contact: `+91${tutor.phone.replace(/\D/g, "").slice(-10)}` }),
            },
            notify: { sms: !!(tutor.phone), email: !!(tutor.email) },
            reminder_enable: true,
            upi_link: true,
            notes: {
                contractId: contract.id,
                studentName: student.name,
                platform: "TuitionsInIndia VIP",
            },
            callback_url: `${BASE_URL}/api/vip/tutor/payment-verify?contractId=${contract.id}`,
            callback_method: "get",
            expire_by: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60, // 7 days
        });
        paymentLinkUrl = paymentLink.short_url;

        // Store a VipPayment record for tracking
        await prisma.vipPayment.create({
            data: {
                contractId: contract.id,
                amount: commissionAmountPaise,
                tutorPayout: Math.round(monthlyBudget * 0.85) * 100,
                platformCut: commissionAmountPaise,
                status: "PENDING",
                dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
        });
    } catch (err) {
        console.error("[VIP] Razorpay payment link creation failed:", err.message);
        // Continue — admin can generate manually
    }

    // Email tutor with commission payment link
    await sendEmail(tutor.email, `Congratulations! New VIP Student Confirmed — ${student.name}`,
        buildTutorCommissionEmailHtml({
            tutorName: tutor.name,
            studentName: student.name,
            subjects: application.subjects,
            commissionAmount,
            paymentLinkUrl,
            studentPhone: student.phone, // revealed after match (no contact restriction post-confirm)
            studentEmail: student.email,
        })
    );

    // Email student confirming the match
    await sendEmail(student.email, `Your tutor has been confirmed — TuitionsInIndia VIP`,
        buildStudentConfirmEmailHtml({
            studentName: student.name,
            tutorName: tutor.name,
            tutorPhone: tutor.phone,
            tutorEmail: tutor.email,
        })
    );

    await createNotification(student.id, "VIP_CONFIRMED",
        "Tutor confirmed! Contact details are now available.",
        `Your tutor ${tutor.name} has been confirmed. View their contact details in your dashboard.`,
        `/dashboard/student?tab=vip`
    );
    await createNotification(tutor.id, "VIP_CONFIRMED",
        "New VIP student confirmed",
        `${student.name} has confirmed you as their tutor. Please complete the commission payment.`,
        `/dashboard/tutor?tab=vip`
    );

    return contract;
}

// ─── Email Helpers ────────────────────────────────────────────────────────────

async function sendEmail(to, subject, html) {
    if (!to) return;
    try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
            from: "TuitionsInIndia VIP <noreply@tuitionsinindia.com>",
            to,
            subject,
            html,
        });
    } catch (err) {
        console.error("[VIP Email]", err.message);
    }
}

async function sendAdminAlert(application, message) {
    const adminEmail = process.env.ADMIN_EMAIL || "admin@tuitionsinindia.com";
    await sendEmail(adminEmail, `[VIP Alert] ${message}`,
        `<p><strong>Application ID:</strong> ${application.id}</p>
         <p><strong>Student:</strong> ${application.student?.name} (${application.studentId})</p>
         <p><strong>Message:</strong> ${message}</p>
         <p><a href="${BASE_URL}/dashboard/admin?tab=vip">View in Admin Dashboard</a></p>`
    );
}

function emailWrapper(content) {
    return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #f9fafb;">
        <div style="background: white; border-radius: 12px; padding: 28px; border: 1px solid #e5e7eb;">
            <div style="text-align: center; margin-bottom: 24px;">
                <span style="background: #2563eb; color: white; padding: 8px 20px; border-radius: 8px; font-weight: bold; font-size: 16px;">
                    TuitionsinIndia VIP
                </span>
            </div>
            ${content}
        </div>
        <p style="text-align: center; color: #9ca3af; font-size: 12px; margin-top: 16px;">
            TuitionsInIndia · Managed Introduction Service
        </p>
    </div>`;
}

async function sendMatchEmail(student, listing, match, recNumber) {
    const tutor = listing.tutor;
    const html = emailWrapper(`
        <h2 style="color: #111827; margin-top: 0;">Recommendation #${recNumber}: ${tutor.name}</h2>
        <p style="color: #6b7280;">Hi ${student.name},</p>
        <p style="color: #6b7280;">We've found a great match for your tuition requirements. Here's their profile:</p>
        <div style="background: #f0f7ff; border-radius: 8px; padding: 20px; margin: 16px 0;">
            <p style="margin: 0 0 8px; font-weight: bold; color: #111827; font-size: 18px;">${tutor.name}</p>
            <p style="margin: 0 0 4px; color: #6b7280; font-size: 14px;">Subjects: ${listing.subjects?.join(", ") || "Not specified"}</p>
            <p style="margin: 0 0 4px; color: #6b7280; font-size: 14px;">Location: ${listing.locations?.join(", ") || "Not specified"}</p>
            ${listing.experience ? `<p style="margin: 0 0 4px; color: #6b7280; font-size: 14px;">Experience: ${listing.experience} years</p>` : ""}
            ${listing.hourlyRate ? `<p style="margin: 0; color: #6b7280; font-size: 14px;">Fee: ₹${listing.hourlyRate.toLocaleString("en-IN")}/hr</p>` : ""}
        </div>
        <p style="color: #6b7280;">Log in to your dashboard to view the full profile and respond.</p>
        <div style="text-align: center; margin-top: 24px;">
            <a href="${BASE_URL}/dashboard/student?tab=vip"
               style="background: #2563eb; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 15px;">
                View Recommendation
            </a>
        </div>
    `);
    await sendEmail(student.email, `VIP Match #${recNumber}: ${tutor.name} — TuitionsInIndia`, html);
}

function buildIntroCallEmailHtml({ recipientName, otherPartyName, role, callUrl, applicationId, studentSubjects }) {
    const isStudent = role === "student";
    return emailWrapper(`
        <h2 style="color: #111827; margin-top: 0;">Your intro call is ready</h2>
        <p style="color: #6b7280;">Hi ${recipientName},</p>
        <p style="color: #6b7280;">
            ${isStudent
                ? `You expressed interest in <strong>${otherPartyName}</strong>. Your monitored intro call is ready — join whenever you're both available.`
                : `<strong>${otherPartyName}</strong> is interested in ${studentSubjects?.join(", ") || "tuition"} lessons. Please join the intro call to introduce yourself.`
            }
        </p>
        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 20px; margin: 16px 0; text-align: center;">
            <p style="margin: 0 0 8px; font-weight: bold; color: #166534;">Call ID: TiI-VIP-${applicationId.slice(0, 8)}</p>
            <p style="margin: 0; color: #6b7280; font-size: 13px;">No download needed · Works in your browser</p>
        </div>
        <div style="text-align: center; margin-top: 20px;">
            <a href="${callUrl}"
               style="background: #22c55e; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 15px;">
                Join Intro Call
            </a>
        </div>
        <p style="color: #9ca3af; font-size: 12px; text-align: center; margin-top: 20px;">
            After the call, ${isStudent ? "log in to confirm or request a different recommendation" : "the student will confirm from their dashboard"}.
        </p>
    `);
}

function buildTutorCommissionEmailHtml({ tutorName, studentName, subjects, commissionAmount, paymentLinkUrl, studentPhone, studentEmail }) {
    return emailWrapper(`
        <h2 style="color: #111827; margin-top: 0;">🎉 New VIP Student Confirmed!</h2>
        <p style="color: #6b7280;">Hi ${tutorName},</p>
        <p style="color: #6b7280;">
            <strong>${studentName}</strong> has confirmed you as their tutor for <strong>${subjects?.join(", ") || "tuition"}</strong>.
            Please complete the one-time platform introduction fee to activate the arrangement.
        </p>
        <div style="background: #fffbeb; border: 1px solid #fcd34d; border-radius: 8px; padding: 20px; margin: 16px 0;">
            <p style="margin: 0 0 4px; font-weight: bold; color: #92400e;">Introduction Fee: ₹${commissionAmount.toLocaleString("en-IN")}</p>
            <p style="margin: 0; color: #92400e; font-size: 13px;">One-time · Pay via UPI, card, or net banking</p>
        </div>
        ${paymentLinkUrl ? `
        <div style="text-align: center; margin: 24px 0;">
            <a href="${paymentLinkUrl}"
               style="background: #2563eb; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 15px;">
                Pay Introduction Fee
            </a>
        </div>` : ""}
        <div style="background: #f0f7ff; border-radius: 8px; padding: 20px; margin: 16px 0;">
            <p style="margin: 0 0 8px; font-weight: bold; color: #111827;">Student Contact Details</p>
            ${studentPhone ? `<p style="margin: 0 0 4px; color: #374151; font-size: 14px;">📱 ${studentPhone}</p>` : ""}
            ${studentEmail ? `<p style="margin: 0; color: #374151; font-size: 14px;">✉️ ${studentEmail}</p>` : ""}
        </div>
        <p style="color: #9ca3af; font-size: 12px;">
            The payment link expires in 7 days. If you have any issues, contact support@tuitionsinindia.com
        </p>
    `);
}

function buildStudentConfirmEmailHtml({ studentName, tutorName, tutorPhone, tutorEmail }) {
    return emailWrapper(`
        <h2 style="color: #111827; margin-top: 0;">Your tutor has been confirmed!</h2>
        <p style="color: #6b7280;">Hi ${studentName},</p>
        <p style="color: #6b7280;">
            You've confirmed <strong>${tutorName}</strong> as your tutor. Here are their contact details:
        </p>
        <div style="background: #f0f7ff; border-radius: 8px; padding: 20px; margin: 16px 0;">
            <p style="margin: 0 0 8px; font-weight: bold; color: #111827; font-size: 16px;">${tutorName}</p>
            ${tutorPhone ? `<p style="margin: 0 0 4px; color: #374151;">📱 ${tutorPhone}</p>` : ""}
            ${tutorEmail ? `<p style="margin: 0; color: #374151;">✉️ ${tutorEmail}</p>` : ""}
        </div>
        <p style="color: #6b7280;">Reach out to schedule your first session. Remember, you have <strong>3 free replacements</strong> if things don't work out.</p>
        <div style="text-align: center; margin-top: 24px;">
            <a href="${BASE_URL}/dashboard/student?tab=vip"
               style="background: #2563eb; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 15px;">
                View Your VIP Dashboard
            </a>
        </div>
    `);
}

async function sendRefundEmail(student, application) {
    const html = emailWrapper(`
        <h2 style="color: #111827; margin-top: 0;">VIP Service — Full Refund Initiated</h2>
        <p style="color: #6b7280;">Hi ${student.name},</p>
        <p style="color: #6b7280;">
            We were unable to find the right tutor match after ${application.maxRecommendations} recommendations.
            As promised, your ₹2,000 enrollment fee will be refunded within 5-7 business days.
        </p>
        <p style="color: #6b7280;">We're sorry we couldn't find the right fit this time. Please don't hesitate to contact us at support@tuitionsinindia.com if you have any questions.</p>
    `);
    await sendEmail(student.email, "VIP Refund Initiated — TuitionsInIndia", html);
}

// ─── Notification Helper ──────────────────────────────────────────────────────

async function createNotification(userId, type, title, body, link) {
    try {
        await prisma.notification.create({
            data: { userId, type, title, body, link },
        });
    } catch (err) {
        console.error("[VIP Notification]", err.message);
    }
}
