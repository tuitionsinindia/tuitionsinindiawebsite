import { Resend } from 'resend';
import {
    welcomeTemplate, leadAlertTemplate, paymentReceiptTemplate,
    studentDay3Template, studentDay7Template,
    tutorDay3Template, tutorDay7Template,
    reEngagementTemplate, conversionNudgeTemplate
} from './emailTemplates';

const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_key');
const FROM_WELCOME = 'Tuitions in India <welcome@tuitionsinindia.com>';
const FROM_ALERTS = 'Tuitions in India <alerts@tuitionsinindia.com>';
const FROM_BILLING = 'Tuitions in India <billing@tuitionsinindia.com>';

export const sendWelcomeEmail = async (email, name, role) => {
    try {
        if (!process.env.RESEND_API_KEY) {
            console.log(`[MOCK EMAIL] Welcome sent to ${email}`);
            return true;
        }
        return await resend.emails.send({
            from: FROM_WELCOME,
            to: email,
            subject: 'Welcome to Tuitions in India!',
            html: welcomeTemplate(name, role),
        });
    } catch (error) {
        console.error("Failed to send welcome email:", error);
        return null;
    }
};

export const sendLeadAlertEmail = async (tutorEmails, leadDetails) => {
    try {
        if (!process.env.RESEND_API_KEY || tutorEmails.length === 0) {
            console.log(`[MOCK EMAIL] Lead Alert sent to ${tutorEmails.length} tutors`);
            return true;
        }
        return await resend.emails.send({
            from: FROM_ALERTS,
            bcc: tutorEmails,
            subject: `New Student Lead: ${leadDetails.subjects?.[0] || leadDetails.subject || "Tutor Needed"}`,
            html: leadAlertTemplate(leadDetails),
        });
    } catch (error) {
        console.error("Failed to send lead alert email:", error);
        return null;
    }
};

export const sendTutorUnlockedEmail = async (studentEmail, tutorDetails) => {
    try {
        if (!process.env.RESEND_API_KEY) {
            console.log(`[MOCK EMAIL] Tutor Unlock Notification sent to ${studentEmail}`);
            return true;
        }
        return await resend.emails.send({
            from: FROM_ALERTS,
            to: studentEmail,
            subject: `A tutor is interested — ${tutorDetails.name}`,
            html: welcomeTemplate(tutorDetails.name, "match notification"),
        });
    } catch (error) {
        console.error("Failed to send tutor unlock email:", error);
        return null;
    }
};

// ── Drip Sequences ───────────────────────────────────────────────────────────

export const sendStudentDay3Email = async (email, name) => {
    try {
        if (!process.env.RESEND_API_KEY) { console.log(`[MOCK] Student Day 3 → ${email}`); return true; }
        return await resend.emails.send({ from: FROM_WELCOME, to: email, subject: 'How to find the right tutor on TuitionsInIndia', html: studentDay3Template(name) });
    } catch (e) { console.error("Student Day 3 email error:", e); return null; }
};

export const sendStudentDay7Email = async (email, name, tutorCount) => {
    try {
        if (!process.env.RESEND_API_KEY) { console.log(`[MOCK] Student Day 7 → ${email}`); return true; }
        return await resend.emails.send({ from: FROM_WELCOME, to: email, subject: `${tutorCount}+ tutors near you — explore now`, html: studentDay7Template(name, tutorCount) });
    } catch (e) { console.error("Student Day 7 email error:", e); return null; }
};

export const sendTutorDay3Email = async (email, name) => {
    try {
        if (!process.env.RESEND_API_KEY) { console.log(`[MOCK] Tutor Day 3 → ${email}`); return true; }
        return await resend.emails.send({ from: FROM_WELCOME, to: email, subject: '3 tips to get more students on TuitionsInIndia', html: tutorDay3Template(name) });
    } catch (e) { console.error("Tutor Day 3 email error:", e); return null; }
};

export const sendTutorDay7Email = async (email, name) => {
    try {
        if (!process.env.RESEND_API_KEY) { console.log(`[MOCK] Tutor Day 7 → ${email}`); return true; }
        return await resend.emails.send({ from: FROM_WELCOME, to: email, subject: 'Your first student lead is free — upgrade for more', html: tutorDay7Template(name) });
    } catch (e) { console.error("Tutor Day 7 email error:", e); return null; }
};

export const sendReEngagementEmail = async (email, name, matchCount) => {
    try {
        if (!process.env.RESEND_API_KEY) { console.log(`[MOCK] Re-engagement → ${email}`); return true; }
        return await resend.emails.send({ from: FROM_ALERTS, to: email, subject: `We found ${matchCount} new tutors matching your search`, html: reEngagementTemplate(name, matchCount) });
    } catch (e) { console.error("Re-engagement email error:", e); return null; }
};

export const sendConversionNudgeEmail = async (email, name, tutorName, subject) => {
    try {
        if (!process.env.RESEND_API_KEY) { console.log(`[MOCK] Conversion nudge → ${email}`); return true; }
        return await resend.emails.send({ from: FROM_ALERTS, to: email, subject: `${tutorName} still has availability — contact them now`, html: conversionNudgeTemplate(name, tutorName, subject) });
    } catch (e) { console.error("Conversion nudge email error:", e); return null; }
};

export const sendTrialNotificationEmail = async (toEmail, toName, { status, subject, otherPartyName, dashboardLink }) => {
    try {
        const subjectLines = {
            CONFIRMED: `Your free trial for ${subject} is confirmed!`,
            DECLINED: `Trial request for ${subject} — update`,
            COMPLETED: `Your trial class for ${subject} is done — leave a review`,
            CANCELLED: `Trial class for ${subject} has been cancelled`,
        };
        const bodyLines = {
            CONFIRMED: `Great news, ${toName}! <strong>${otherPartyName}</strong> has confirmed your free trial class for <strong>${subject}</strong>. They will reach out to schedule the time. Check your dashboard for details.`,
            DECLINED: `Hi ${toName}, your trial request for <strong>${subject}</strong> was not accepted by <strong>${otherPartyName}</strong>. You can try booking a trial with another tutor.`,
            COMPLETED: `Hi ${toName}, your trial class for <strong>${subject}</strong> with <strong>${otherPartyName}</strong> has been marked as completed. Share your experience by leaving a review!`,
            CANCELLED: `Hi ${toName}, the trial class for <strong>${subject}</strong> has been cancelled. You can always book again when you are ready.`,
        };

        const emailSubject = subjectLines[status];
        const emailBody = bodyLines[status];
        if (!emailSubject || !emailBody) return null;

        const html = `
<!DOCTYPE html><html><body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:40px 20px">
<tr><td align="center">
<table width="100%" style="max-width:520px;background:#ffffff;border-radius:16px;border:1px solid #e5e7eb;overflow:hidden">
<tr><td style="background:#2563EB;padding:24px 32px;text-align:center">
<span style="color:#ffffff;font-size:18px;font-weight:800">TuitionsInIndia</span>
</td></tr>
<tr><td style="padding:32px">
<h2 style="margin:0 0 12px;color:#111827;font-size:20px">${emailSubject}</h2>
<p style="margin:0 0 20px;color:#6b7280;font-size:14px;line-height:1.6">${emailBody}</p>
<a href="${dashboardLink}" style="display:inline-block;padding:12px 28px;background:#2563EB;color:#ffffff;text-decoration:none;border-radius:10px;font-weight:600;font-size:14px">View Dashboard</a>
</td></tr>
<tr><td style="padding:16px 32px;border-top:1px solid #f1f5f9;text-align:center">
<p style="margin:0;color:#9ca3af;font-size:12px">TuitionsInIndia — India's Trusted Tutor Discovery Platform</p>
</td></tr>
</table></td></tr></table></body></html>`;

        if (!process.env.RESEND_API_KEY) {
            console.log(`[MOCK EMAIL] Trial ${status} sent to ${toEmail}`);
            return true;
        }
        return await resend.emails.send({ from: FROM_ALERTS, to: toEmail, subject: emailSubject, html });
    } catch (error) {
        console.error("Failed to send trial notification email:", error);
        return null;
    }
};

export const sendNewMessageEmail = async (toEmail, toName, fromName, messagePreview, dashboardLink) => {
    try {
        const html = `
<!DOCTYPE html><html><body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:40px 20px">
<tr><td align="center">
<table width="100%" style="max-width:520px;background:#ffffff;border-radius:16px;border:1px solid #e5e7eb;overflow:hidden">
<tr><td style="background:#2563EB;padding:24px 32px;text-align:center">
<span style="color:#ffffff;font-size:18px;font-weight:800">TuitionsInIndia</span>
</td></tr>
<tr><td style="padding:32px">
<h2 style="margin:0 0 12px;color:#111827;font-size:20px">New message from ${fromName}</h2>
<p style="margin:0 0 20px;color:#6b7280;font-size:14px;line-height:1.6">Hi ${toName}, you have a new message: <em style="color:#374151">"${messagePreview}"</em></p>
<a href="${dashboardLink}" style="display:inline-block;padding:12px 28px;background:#2563EB;color:#ffffff;text-decoration:none;border-radius:10px;font-weight:600;font-size:14px">Reply Now</a>
</td></tr>
<tr><td style="padding:16px 32px;border-top:1px solid #f1f5f9;text-align:center">
<p style="margin:0;color:#9ca3af;font-size:12px">TuitionsInIndia — India's Trusted Tutor Discovery Platform</p>
</td></tr>
</table></td></tr></table></body></html>`;

        if (!process.env.RESEND_API_KEY) {
            console.log(`[MOCK EMAIL] New message notification sent to ${toEmail}`);
            return true;
        }
        return await resend.emails.send({ from: FROM_ALERTS, to: toEmail, subject: `New message from ${fromName} on TuitionsInIndia`, html });
    } catch (error) {
        console.error("Failed to send new message email:", error);
        return null;
    }
};

export const sendPaymentReceiptEmail = async (userEmail, transactionDetails) => {
    try {
        if (!process.env.RESEND_API_KEY) {
            console.log(`[MOCK EMAIL] Payment receipt sent to ${userEmail} for ₹${transactionDetails.amount}`);
            return true;
        }
        return await resend.emails.send({
            from: FROM_BILLING,
            to: userEmail,
            subject: `Payment Receipt — ₹${transactionDetails.amount}`,
            html: paymentReceiptTemplate(transactionDetails),
        });
    } catch (error) {
        console.error("Failed to send payment receipt email:", error);
        return null;
    }
};
