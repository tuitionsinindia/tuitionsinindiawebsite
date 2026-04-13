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
