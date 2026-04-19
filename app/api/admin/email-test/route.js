import { NextResponse } from "next/server";
import { isAdminAuthorized } from "@/lib/adminAuth";
import {
    sendWelcomeEmail,
    sendTutorWelcomeEmail,
    sendLeadAlertEmail,
    sendLeadPostedEmail,
    sendTutorUnlockedEmail,
    sendNewMessageEmail,
    sendTrialNotificationEmail,
    sendPaymentReceiptEmail,
    sendVerificationResultEmail,
    sendTutorDay1Email,
    sendTutorDay3Email,
    sendTutorDay7Email,
    sendStudentDay3Email,
    sendStudentDay7Email,
    sendReEngagementEmail,
    sendConversionNudgeEmail,
    sendTicketNotificationEmail,
    sendTicketUserCopyEmail,
    sendWeeklyTutorDigestEmail,
    sendWeeklyStudentDigestEmail,
} from "@/lib/email";

export const dynamic = "force-dynamic";

// Admin tool: send any email template to a specified address so you can
// verify deliverability + spam-folder status. Returns JSON with the send
// status so the admin UI can show "Sent ✓" or the error.
export async function POST(request) {
    if (!isAdminAuthorized(request)) {
        return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { template, to } = await request.json();
        if (!template) return NextResponse.json({ success: false, error: "template is required" }, { status: 400 });
        if (!to || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(to)) {
            return NextResponse.json({ success: false, error: "Valid 'to' email is required" }, { status: 400 });
        }

        const name = "Test Recipient";
        const sampleLead = {
            id: "lead_test_123",
            subjects: ["Mathematics"],
            locations: ["Delhi"],
            budget: 800,
            description: "Looking for Maths tutor for Class 10 CBSE, 3 days a week.",
        };
        const sampleTicket = {
            id: "tkt_test_123",
            type: "SUPPORT",
            subject: "Test ticket — please ignore",
            body: "This is a sample ticket to verify email delivery.",
            name,
            email: to,
            phone: null,
            sourcePath: "/help",
            userId: null,
            chatTranscript: null,
        };
        const sampleTransaction = {
            transactionId: "txn_test_123",
            amount: 499,
            description: "Credit pack (30 credits) — test receipt",
        };

        let result;
        switch (template) {
            case "welcome_student":    result = await sendWelcomeEmail(to, name, "Student"); break;
            case "welcome_tutor":      result = await sendWelcomeEmail(to, name, "Tutor"); break;
            case "welcome_institute":  result = await sendWelcomeEmail(to, name, "Institute"); break;
            case "tutor_welcome":      result = await sendTutorWelcomeEmail(to, name); break;
            case "lead_posted":        result = await sendLeadPostedEmail(to, name, sampleLead); break;
            case "lead_alert":         result = await sendLeadAlertEmail([to], sampleLead); break;
            case "tutor_unlocked":     result = await sendTutorUnlockedEmail(to, { name: "Priya M." }); break;
            case "new_message":        result = await sendNewMessageEmail(to, name, "Priya M.", "Hi! Is the slot 5 pm still available?", `https://tuitionsinindia.com/dashboard/student`); break;
            case "trial_confirmed":    result = await sendTrialNotificationEmail(to, name, { status: "CONFIRMED", subject: "Mathematics", otherPartyName: "Priya M.", dashboardLink: "https://tuitionsinindia.com/dashboard/student" }); break;
            case "trial_declined":     result = await sendTrialNotificationEmail(to, name, { status: "DECLINED", subject: "Mathematics", otherPartyName: "Priya M.", dashboardLink: "https://tuitionsinindia.com/dashboard/student" }); break;
            case "payment_receipt":    result = await sendPaymentReceiptEmail(to, sampleTransaction); break;
            case "verification_approved": result = await sendVerificationResultEmail(to, name, { approved: true }); break;
            case "verification_rejected": result = await sendVerificationResultEmail(to, name, { approved: false, rejectionReason: "Document unclear — please upload a clearer photo of your ID" }); break;
            case "tutor_day_1":        result = await sendTutorDay1Email(to, name, "user_test_123"); break;
            case "tutor_day_3":        result = await sendTutorDay3Email(to, name, "user_test_123"); break;
            case "tutor_day_7":        result = await sendTutorDay7Email(to, name, "user_test_123"); break;
            case "student_day_3":      result = await sendStudentDay3Email(to, name, "user_test_123"); break;
            case "student_day_7":      result = await sendStudentDay7Email(to, name, 500, "user_test_123"); break;
            case "re_engagement":      result = await sendReEngagementEmail(to, name, 12, "user_test_123"); break;
            case "conversion_nudge":   result = await sendConversionNudgeEmail(to, name, "Priya M.", "Mathematics", "user_test_123"); break;
            case "ticket_admin":       result = await sendTicketNotificationEmail({ ...sampleTicket, email: to }); break;
            case "ticket_user_copy":   result = await sendTicketUserCopyEmail({ ...sampleTicket, email: to }); break;
            case "weekly_tutor_digest":
                result = await sendWeeklyTutorDigestEmail(to, name, {
                    newLeads: 7, unlocksUsed: 3, creditsRemaining: 27,
                    topLeads: [
                        { subject: "Mathematics", location: "Delhi", budget: 800 },
                        { subject: "Physics", location: "Delhi", budget: 1200 },
                        { subject: "Chemistry", location: "Gurgaon", budget: 1000 },
                    ],
                }, "user_test_123");
                break;
            case "weekly_student_digest":
                result = await sendWeeklyStudentDigestEmail(to, name, {
                    newTutors: 12, subject: "Mathematics", location: "Delhi",
                }, "user_test_123");
                break;
            default:
                return NextResponse.json({ success: false, error: `Unknown template: ${template}` }, { status: 400 });
        }

        if (result === null) {
            return NextResponse.json({ success: false, error: "Send failed — check server logs" }, { status: 500 });
        }

        // Resend SDK returns { data, error } instead of throwing, so we have
        // to inspect the response. In particular, a 403 "domain not verified"
        // comes back as result.error with no exception.
        if (result?.error) {
            const msg = result.error.message || result.error.name || "Resend returned an error";
            const hint = /domain.*not verified/i.test(msg)
                ? " → Go to resend.com/domains and verify tuitionsinindia.com"
                : "";
            return NextResponse.json({
                success: false,
                error: `${msg}${hint}`,
                rawError: result.error,
            }, { status: 502 });
        }

        return NextResponse.json({
            success: true,
            sentTo: to,
            template,
            messageId: result?.data?.id || null,
            mocked: !process.env.RESEND_API_KEY,
        });
    } catch (err) {
        console.error("Email test error:", err);
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}

// List of templates + metadata for the UI.
export async function GET(request) {
    if (!isAdminAuthorized(request)) {
        return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({
        success: true,
        templates: EMAIL_TEMPLATES,
    });
}

const EMAIL_TEMPLATES = [
    { id: "welcome_student",    label: "Welcome — Student",                 category: "Transactional", when: "Student signs up" },
    { id: "welcome_tutor",      label: "Welcome — Tutor",                   category: "Transactional", when: "Tutor signs up" },
    { id: "welcome_institute",  label: "Welcome — Institute",               category: "Transactional", when: "Institute signs up" },
    { id: "tutor_welcome",      label: "Tutor Welcome (detailed)",          category: "Transactional", when: "After tutor profile complete" },
    { id: "lead_posted",        label: "Lead posted confirmation",          category: "Transactional", when: "Student posts a requirement" },
    { id: "lead_alert",         label: "Lead alert (to tutors)",            category: "Transactional", when: "New matching requirement" },
    { id: "tutor_unlocked",     label: "Tutor unlocked your contact",       category: "Transactional", when: "Tutor uses credit on a student" },
    { id: "new_message",        label: "New message notification",          category: "Transactional", when: "New chat message" },
    { id: "trial_confirmed",    label: "Demo class — Confirmed",            category: "Transactional", when: "Tutor accepts demo booking" },
    { id: "trial_declined",     label: "Demo class — Declined",             category: "Transactional", when: "Tutor rejects demo booking" },
    { id: "payment_receipt",    label: "Payment receipt",                   category: "Transactional", when: "Razorpay payment succeeds" },
    { id: "verification_approved", label: "Verification — Approved",        category: "Transactional", when: "Admin approves ID+qualification" },
    { id: "verification_rejected", label: "Verification — Rejected",        category: "Transactional", when: "Admin rejects verification request" },
    { id: "ticket_admin",       label: "Ticket notification (to admin)",    category: "Transactional", when: "User raises a ticket" },
    { id: "ticket_user_copy",   label: "Ticket copy (to user)",             category: "Transactional", when: "User raises a ticket" },
    { id: "tutor_day_1",        label: "Tutor Day 1 — Complete profile",    category: "Drip",          when: "24h after tutor signup, incomplete profile" },
    { id: "tutor_day_3",        label: "Tutor Day 3 — Tips",                category: "Drip",          when: "Day 3 after tutor signup" },
    { id: "tutor_day_7",        label: "Tutor Day 7 — Upgrade",             category: "Drip",          when: "Day 7 after tutor signup" },
    { id: "student_day_3",      label: "Student Day 3 — How it works",      category: "Drip",          when: "Day 3 after student signup" },
    { id: "student_day_7",      label: "Student Day 7 — Tutors near you",   category: "Drip",          when: "Day 7 after student signup" },
    { id: "re_engagement",      label: "Re-engagement — 14 days inactive",  category: "Drip",          when: "Student inactive 14 days" },
    { id: "conversion_nudge",   label: "Conversion nudge",                  category: "Drip",          when: "Viewed tutor but didn't contact" },
    { id: "weekly_tutor_digest",   label: "Weekly tutor digest",            category: "Weekly",        when: "Every Sunday 9 AM" },
    { id: "weekly_student_digest", label: "Weekly student digest",          category: "Weekly",        when: "Every Sunday 9 AM" },
];
