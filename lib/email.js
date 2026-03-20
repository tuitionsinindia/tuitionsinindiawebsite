import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_key');

export const sendWelcomeEmail = async (email, name, role) => {
    try {
        // Skip actual sending if API key is not configured
        if (!process.env.RESEND_API_KEY) {
            console.log(`[MOCK EMAIL] Welcome sent to ${email}`);
            return true;
        }

        const data = await resend.emails.send({
            from: 'Tuitions in India <welcome@tuitionsinindia.com>',
            to: email,
            subject: 'Welcome to Tuitions in India!',
            html: `
                <div style="font-family: sans-serif; padding: 20px;">
                    <h1 style="color: #1e448a;">Welcome, ${name}!</h1>
                    <p>Thank you for joining Tuitions in India as a <strong>${role}</strong>.</p>
                    <p>We are thrilled to have you on board. You can now log into your dashboard to manage your account.</p>
                    <a href="https://tuitionsinindia.com/login" style="display: inline-block; padding: 10px 20px; background-color: #1e448a; color: white; text-decoration: none; border-radius: 5px; margin-top: 10px;">Go to Dashboard</a>
                </div>
            `
        });
        return data;
    } catch (error) {
        console.error("Failed to send welcome email:", error);
        return null;
    }
};

export const sendLeadAlertEmail = async (tutorEmails, leadDetails) => {
    try {
        if (!process.env.RESEND_API_KEY || tutorEmails.length === 0) {
            console.log(`[MOCK EMAIL] Lead Alert sent to ${tutorEmails.length} tutors for: ${leadDetails.subject}`);
            return true;
        }

        // Send to multiple BCC using Resend batching (or loop)
        const data = await resend.emails.send({
            from: 'Tuitions in India Alerts <alerts@tuitionsinindia.com>',
            bcc: tutorEmails, // Max 50 per request on free tier usually
            subject: `New Lead in ${leadDetails.location}: ${leadDetails.subject}`,
            html: `
                <div style="font-family: sans-serif; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
                    <h2 style="color: #ec5b13;">New Student Requirement Posted!</h2>
                    <p>A new student in <strong>${leadDetails.location}</strong> is looking for a tutor for <strong>${leadDetails.subject}</strong>.</p>
                    <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 15px 0;">
                        <p><strong>Requirement:</strong> "${leadDetails.description}"</p>
                        <p><strong>Budget:</strong> ${leadDetails.budget || 'Open for discussion'}</p>
                    </div>
                    <p>Log into your dashboard now to unlock this contact before other tutors do.</p>
                    <a href="https://tuitionsinindia.com/dashboard/tutor" style="display: inline-block; padding: 12px 24px; background-color: #1e448a; color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">View Lead</a>
                </div>
            `
        });
        return data;
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

        const data = await resend.emails.send({
            from: 'Tuitions in India Alerts <alerts@tuitionsinindia.com>',
            to: studentEmail,
            subject: `Tutor Unlocked! ${tutorDetails.name} is ready for you.`,
            html: `
                <div style="font-family: sans-serif; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
                    <h2 style="color: #1e448a;">You have a match!</h2>
                    <p>Great news! A Premium Tutor has reviewed your requirement and unlocked your contact information.</p>
                    <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 15px 0;">
                        <p><strong>Tutor:</strong> ${tutorDetails.name} (${tutorDetails.title})</p>
                        <p><strong>Hourly Rate:</strong> ₹${tutorDetails.hourlyRate || 'Negotiable'}</p>
                    </div>
                    <p>Login to your dashboard to view their full profile and start a chat to finalize timings.</p>
                    <a href="https://tuitionsinindia.com/dashboard/student" style="display: inline-block; padding: 12px 24px; background-color: #f59e0b; color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">Message Tutor</a>
                </div>
            `
        });
        return data;
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

        const data = await resend.emails.send({
            from: 'Tuitions in India Billing <billing@tuitionsinindia.com>',
            to: userEmail,
            subject: `Payment Receipt confirmation (₹${transactionDetails.amount})`,
            html: `
                <div style="font-family: sans-serif; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
                    <h2 style="color: #10b981;">Payment Successful ✅</h2>
                    <p>Thank you for your purchase. We have received your payment.</p>
                    <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 15px 0;">
                        <p><strong>Transaction ID:</strong> ${transactionDetails.transactionId}</p>
                        <p><strong>Amount Paid:</strong> ₹${transactionDetails.amount}</p>
                        <p><strong>Description:</strong> ${transactionDetails.description}</p>
                        <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
                    </div>
                    <p>You can view your detailed billing history inside the dashboard settings.</p>
                </div>
            `
        });
        return data;
    } catch (error) {
        console.error("Failed to send payment receipt email:", error);
        return null;
    }
};
