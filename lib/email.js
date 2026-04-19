import { Resend } from 'resend';
import {
    welcomeTemplate, leadAlertTemplate, paymentReceiptTemplate,
    studentDay3Template, studentDay7Template,
    tutorDay1Template, tutorDay3Template, tutorDay7Template,
    reEngagementTemplate, conversionNudgeTemplate,
    ticketNotificationTemplate,
    leadPostedTemplate, ticketUserCopyTemplate,
    weeklyTutorDigestTemplate, weeklyStudentDigestTemplate,
} from './emailTemplates';

const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_key');
const FROM_WELCOME = 'Tuitions in India <welcome@tuitionsinindia.com>';
const FROM_ALERTS = 'Tuitions in India <alerts@tuitionsinindia.com>';
const FROM_BILLING = 'Tuitions in India <billing@tuitionsinindia.com>';

// The Resend SDK returns { data, error } rather than throwing on API errors
// (e.g. 403 "domain not verified"). Without this check, sends that fail at
// the API layer silently return truthy and look successful. Log them so they
// show up in docker logs, and return null so callers can treat it as a miss.
function logResendIfError(label, result) {
    if (result?.error) {
        console.error(`[EMAIL-FAIL] ${label}:`, result.error.message || result.error);
    }
    return result;
}

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
        // Resend requires a `to` — putting the alerts mailbox there while
        // fanning out to tutors via BCC keeps their addresses hidden from
        // each other (standard bulk-alert pattern).
        const selfTo = "alerts@tuitionsinindia.com";
        return logResendIfError(
            "lead alert",
            await resend.emails.send({
                from: FROM_ALERTS,
                to: selfTo,
                bcc: tutorEmails,
                subject: `New Student Lead: ${leadDetails.subjects?.[0] || leadDetails.subject || "Tutor Needed"}`,
                html: leadAlertTemplate(leadDetails),
            })
        );
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

export const sendStudentDay3Email = async (email, name, userId) => {
    try {
        if (!process.env.RESEND_API_KEY) { console.log(`[MOCK] Student Day 3 → ${email}`); return true; }
        return await resend.emails.send({ from: FROM_WELCOME, to: email, subject: 'How to find the right tutor on TuitionsInIndia', html: studentDay3Template(name, userId) });
    } catch (e) { console.error("Student Day 3 email error:", e); return null; }
};

export const sendStudentDay7Email = async (email, name, tutorCount, userId) => {
    try {
        if (!process.env.RESEND_API_KEY) { console.log(`[MOCK] Student Day 7 → ${email}`); return true; }
        return await resend.emails.send({ from: FROM_WELCOME, to: email, subject: `${tutorCount}+ tutors near you — explore now`, html: studentDay7Template(name, tutorCount, userId) });
    } catch (e) { console.error("Student Day 7 email error:", e); return null; }
};

// Confirm to a student that their requirement was posted.
export const sendLeadPostedEmail = async (email, name, lead) => {
    try {
        if (!process.env.RESEND_API_KEY) { console.log(`[MOCK] Lead posted → ${email}`); return true; }
        return await resend.emails.send({
            from: FROM_ALERTS,
            to: email,
            subject: `Your tuition request is posted — matching tutors coming up`,
            html: leadPostedTemplate(name || "there", lead),
        });
    } catch (e) { console.error("Lead posted email error:", e); return null; }
};

// Send a copy of the ticket to the person who raised it.
export const sendTicketUserCopyEmail = async (ticket) => {
    try {
        if (!ticket.email) return null;
        if (!process.env.RESEND_API_KEY) { console.log(`[MOCK] Ticket copy → ${ticket.email}`); return true; }
        return await resend.emails.send({
            from: FROM_ALERTS,
            to: ticket.email,
            subject: `Ticket received: ${ticket.subject}`,
            html: ticketUserCopyTemplate(ticket),
        });
    } catch (e) { console.error("Ticket user copy email error:", e); return null; }
};

// Weekly digest — tutors: their leads activity for the past 7 days.
export const sendWeeklyTutorDigestEmail = async (email, name, stats, userId) => {
    try {
        if (!process.env.RESEND_API_KEY) { console.log(`[MOCK] Weekly tutor digest → ${email}`); return true; }
        return await resend.emails.send({
            from: FROM_ALERTS,
            to: email,
            subject: `Your weekly summary — ${stats.newLeads || 0} new matching leads`,
            html: weeklyTutorDigestTemplate(name || "Tutor", stats, userId),
        });
    } catch (e) { console.error("Weekly tutor digest error:", e); return null; }
};

// Weekly digest — students: new tutors matching their most recent requirement.
export const sendWeeklyStudentDigestEmail = async (email, name, stats, userId) => {
    try {
        if (!process.env.RESEND_API_KEY) { console.log(`[MOCK] Weekly student digest → ${email}`); return true; }
        return await resend.emails.send({
            from: FROM_ALERTS,
            to: email,
            subject: `${stats.newTutors || 0} new tutors matching your requirement`,
            html: weeklyStudentDigestTemplate(name || "there", stats, userId),
        });
    } catch (e) { console.error("Weekly student digest error:", e); return null; }
};

// Notify the sales/support inbox when a ticket is raised.
// TICKET_NOTIFY_EMAIL overrides the default (abhishekjohn84@gmail.com).
export const sendTicketNotificationEmail = async (ticket) => {
    try {
        const to = process.env.TICKET_NOTIFY_EMAIL || "abhishekjohn84@gmail.com";
        if (!process.env.RESEND_API_KEY) {
            console.log(`[MOCK] Ticket ${ticket.id} (${ticket.type}) → ${to}`);
            return true;
        }
        const subjectPrefix = ticket.type === "SALES" ? "[Sales]" : "[Support]";
        return await resend.emails.send({
            from: FROM_ALERTS,
            to,
            subject: `${subjectPrefix} ${ticket.subject}`,
            html: ticketNotificationTemplate(ticket),
            replyTo: ticket.email || undefined,
        });
    } catch (e) {
        console.error("Ticket notification email error:", e);
        return null;
    }
};

export const sendTutorDay1Email = async (email, name, userId) => {
    try {
        if (!process.env.RESEND_API_KEY) { console.log(`[MOCK] Tutor Day 1 → ${email}`); return true; }
        return await resend.emails.send({ from: FROM_WELCOME, to: email, subject: 'Finish your tutor profile to start receiving enquiries', html: tutorDay1Template(name, userId) });
    } catch (e) { console.error("Tutor Day 1 email error:", e); return null; }
};

export const sendTutorDay3Email = async (email, name, userId) => {
    try {
        if (!process.env.RESEND_API_KEY) { console.log(`[MOCK] Tutor Day 3 → ${email}`); return true; }
        return await resend.emails.send({ from: FROM_WELCOME, to: email, subject: '3 tips to get more students on TuitionsInIndia', html: tutorDay3Template(name, userId) });
    } catch (e) { console.error("Tutor Day 3 email error:", e); return null; }
};

export const sendTutorDay7Email = async (email, name, userId) => {
    try {
        if (!process.env.RESEND_API_KEY) { console.log(`[MOCK] Tutor Day 7 → ${email}`); return true; }
        return await resend.emails.send({ from: FROM_WELCOME, to: email, subject: 'Your first student lead is free — upgrade for more', html: tutorDay7Template(name, userId) });
    } catch (e) { console.error("Tutor Day 7 email error:", e); return null; }
};

export const sendReEngagementEmail = async (email, name, matchCount, userId) => {
    try {
        if (!process.env.RESEND_API_KEY) { console.log(`[MOCK] Re-engagement → ${email}`); return true; }
        return await resend.emails.send({ from: FROM_ALERTS, to: email, subject: `We found ${matchCount} new tutors matching your search`, html: reEngagementTemplate(name, matchCount, userId) });
    } catch (e) { console.error("Re-engagement email error:", e); return null; }
};

export const sendConversionNudgeEmail = async (email, name, tutorName, subject, userId) => {
    try {
        if (!process.env.RESEND_API_KEY) { console.log(`[MOCK] Conversion nudge → ${email}`); return true; }
        return await resend.emails.send({ from: FROM_ALERTS, to: email, subject: `${tutorName} still has availability — contact them now`, html: conversionNudgeTemplate(name, tutorName, subject, userId) });
    } catch (e) { console.error("Conversion nudge email error:", e); return null; }
};

export const sendTrialNotificationEmail = async (toEmail, toName, { status, subject, otherPartyName, dashboardLink }) => {
    try {
        const subjectLines = {
            CONFIRMED: `Your demo class for ${subject} is confirmed!`,
            DECLINED: `Demo class request for ${subject} — update`,
            COMPLETED: `Your demo class for ${subject} is done — leave a review`,
            CANCELLED: `Demo class for ${subject} has been cancelled`,
        };
        const bodyLines = {
            CONFIRMED: `Great news, ${toName}! <strong>${otherPartyName}</strong> has confirmed your demo class for <strong>${subject}</strong>. They will reach out to schedule the time. Check your dashboard for details.`,
            DECLINED: `Hi ${toName}, your demo class request for <strong>${subject}</strong> was not accepted by <strong>${otherPartyName}</strong>. You can try booking a demo with another tutor.`,
            COMPLETED: `Hi ${toName}, your demo class for <strong>${subject}</strong> with <strong>${otherPartyName}</strong> has been marked as completed. Share your experience by leaving a review!`,
            CANCELLED: `Hi ${toName}, the demo class for <strong>${subject}</strong> has been cancelled. You can always book again when you are ready.`,
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
            console.log(`[MOCK EMAIL] Demo class ${status} sent to ${toEmail}`);
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

export const sendContactFormEmail = async ({ name, email, topic, message }) => {
    try {
        const html = `
<!DOCTYPE html><html><body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:40px 20px">
<tr><td align="center">
<table width="100%" style="max-width:520px;background:#ffffff;border-radius:16px;border:1px solid #e5e7eb;overflow:hidden">
<tr><td style="background:#2563EB;padding:24px 32px;text-align:center">
<span style="color:#ffffff;font-size:18px;font-weight:800">TuitionsInIndia — Contact Form</span>
</td></tr>
<tr><td style="padding:32px">
<table width="100%" cellpadding="0" cellspacing="0">
<tr><td style="padding-bottom:12px"><span style="color:#6b7280;font-size:13px">From</span><br><span style="color:#111827;font-size:15px;font-weight:600">${name}</span></td></tr>
<tr><td style="padding-bottom:12px"><span style="color:#6b7280;font-size:13px">Email</span><br><a href="mailto:${email}" style="color:#2563EB;font-size:15px">${email}</a></td></tr>
<tr><td style="padding-bottom:20px"><span style="color:#6b7280;font-size:13px">Topic</span><br><span style="color:#111827;font-size:15px">${topic}</span></td></tr>
</table>
<div style="background:#f8fafc;border-radius:10px;padding:16px;border:1px solid #e5e7eb">
<p style="margin:0;color:#374151;font-size:14px;line-height:1.7;white-space:pre-wrap">${message}</p>
</div>
</td></tr>
<tr><td style="padding:16px 32px;border-top:1px solid #f1f5f9;text-align:center">
<p style="margin:0;color:#9ca3af;font-size:12px">Reply directly to this email to respond to the user.</p>
</td></tr>
</table></td></tr></table></body></html>`;

        if (!process.env.RESEND_API_KEY) {
            console.log(`[MOCK EMAIL] Contact form from ${email}: ${topic}`);
            return true;
        }
        return await resend.emails.send({
            from: FROM_ALERTS,
            to: 'info@tuitionsinindia.com',
            replyTo: email,
            subject: `Contact: ${topic} — ${name}`,
            html,
        });
    } catch (error) {
        console.error("Failed to send contact form email:", error);
        return null;
    }
};

export const sendTutorWelcomeEmail = async (toEmail, toName) => {
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
<h2 style="margin:0 0 8px;color:#111827;font-size:22px">Welcome, ${toName}!</h2>
<p style="margin:0 0 20px;color:#6b7280;font-size:14px;line-height:1.7">
Your tutor profile is now live on TuitionsInIndia. Here is how to get your first student enquiry:
</p>
<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px">
${[
  ["1", "Complete your profile", "Add a good photo, a clear bio, and your hourly rate. Complete profiles get 3× more enquiries."],
  ["2", "Use your 5 free credits", "You have 5 welcome credits ready. Use them to unlock student contact details from your dashboard."],
  ["3", "Get verified", "Apply for a Verified badge — it is free for the first 100 tutors. Verified tutors rank higher in search results."],
].map(([num, title, desc]) => `
<tr><td style="padding:10px 0;border-bottom:1px solid #f1f5f9">
<span style="display:inline-flex;align-items:center;justify-content:center;width:24px;height:24px;background:#2563EB;color:#fff;border-radius:50%;font-size:12px;font-weight:700;margin-right:10px;vertical-align:middle">${num}</span>
<strong style="color:#111827;font-size:14px">${title}</strong>
<p style="margin:4px 0 0 34px;color:#6b7280;font-size:13px">${desc}</p>
</td></tr>`).join("")}
</table>
<a href="https://tuitionsinindia.com/dashboard/tutor" style="display:inline-block;padding:12px 28px;background:#2563EB;color:#ffffff;text-decoration:none;border-radius:10px;font-weight:600;font-size:14px">Go to Your Dashboard</a>
</td></tr>
<tr><td style="padding:16px 32px;border-top:1px solid #f1f5f9;text-align:center">
<p style="margin:0;color:#9ca3af;font-size:12px">TuitionsInIndia — India's Trusted Tutor Discovery Platform<br>Zero commission. You keep 100% of your tuition fees.</p>
</td></tr>
</table></td></tr></table></body></html>`;

        if (!process.env.RESEND_API_KEY) {
            console.log(`[MOCK EMAIL] Welcome email sent to ${toEmail}`);
            return true;
        }
        return await resend.emails.send({
            from: FROM_ALERTS,
            to: toEmail,
            subject: `Welcome to TuitionsInIndia, ${toName}! Your profile is live.`,
            html,
        });
    } catch (error) {
        console.error("Failed to send tutor welcome email:", error);
        return null;
    }
};

export const sendVerificationResultEmail = async (toEmail, toName, { approved, rejectionReason } = {}) => {
    try {
        const emailSubject = approved
            ? "Your TuitionsInIndia profile is now verified ✓"
            : "Your verification request was not approved";

        const html = `
<!DOCTYPE html><html><body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:40px 20px">
<tr><td align="center">
<table width="100%" style="max-width:520px;background:#ffffff;border-radius:16px;border:1px solid #e5e7eb;overflow:hidden">
<tr><td style="background:#2563EB;padding:24px 32px;text-align:center">
<span style="color:#ffffff;font-size:18px;font-weight:800">TuitionsInIndia</span>
</td></tr>
<tr><td style="padding:32px">
${approved ? `
<h2 style="margin:0 0 12px;color:#111827;font-size:20px">You're verified, ${toName}! 🎉</h2>
<p style="margin:0 0 20px;color:#6b7280;font-size:14px;line-height:1.6">
  Your profile has been reviewed and approved. Your verified badge is now live — students can see it on your profile and search results. Verified tutors get more enquiries, so make sure your profile is complete.
</p>
<a href="https://tuitionsinindia.com/dashboard/tutor" style="display:inline-block;padding:12px 28px;background:#2563EB;color:#ffffff;text-decoration:none;border-radius:10px;font-weight:600;font-size:14px">Go to your dashboard</a>
` : `
<h2 style="margin:0 0 12px;color:#111827;font-size:20px">Verification not approved</h2>
<p style="margin:0 0 8px;color:#6b7280;font-size:14px;line-height:1.6">Hi ${toName}, your verification request was reviewed but could not be approved at this time.</p>
${rejectionReason ? `<p style="margin:0 0 20px;padding:12px 16px;background:#fef2f2;border-radius:8px;color:#b91c1c;font-size:14px;line-height:1.6"><strong>Reason:</strong> ${rejectionReason}</p>` : ''}
<p style="margin:0 0 20px;color:#6b7280;font-size:14px;line-height:1.6">You can update your documents and reapply from your dashboard at any time.</p>
<a href="https://tuitionsinindia.com/dashboard/tutor" style="display:inline-block;padding:12px 28px;background:#2563EB;color:#ffffff;text-decoration:none;border-radius:10px;font-weight:600;font-size:14px">Go to your dashboard</a>
`}
</td></tr>
<tr><td style="padding:16px 32px;border-top:1px solid #f1f5f9;text-align:center">
<p style="margin:0;color:#9ca3af;font-size:12px">TuitionsInIndia — India's Trusted Tutor Discovery Platform</p>
</td></tr>
</table></td></tr></table></body></html>`;

        if (!process.env.RESEND_API_KEY) {
            console.log(`[MOCK EMAIL] Verification ${approved ? 'approved' : 'rejected'} sent to ${toEmail}`);
            return true;
        }
        return await resend.emails.send({ from: FROM_ALERTS, to: toEmail, subject: emailSubject, html });
    } catch (error) {
        console.error("Failed to send verification result email:", error);
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
