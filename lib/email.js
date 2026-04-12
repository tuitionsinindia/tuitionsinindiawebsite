import { Resend } from 'resend';
import { welcomeTemplate, leadAlertTemplate, paymentReceiptTemplate } from './emailTemplates';

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
