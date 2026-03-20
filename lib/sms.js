import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

// Initialize conditionally so app doesn't crash on boot without keys
const client = accountSid && authToken ? twilio(accountSid, authToken) : null;

export const sendOTP = async (mobileNumber, otpCode) => {
    try {
        if (!client) {
            console.log(`[MOCK SMS] OTP ${otpCode} sent to ${mobileNumber}`);
            return true;
        }

        const message = await client.messages.create({
            body: `Your Tuitions in India verification code is: ${otpCode}. Valid for 10 minutes.`,
            from: twilioPhone,
            to: mobileNumber
        });

        return message.sid;
    } catch (error) {
        console.error("Failed to send OTP SMS:", error);
        return null;
    }
};

export const sendLeadAlertSMS = async (tutorMobile, leadDetails) => {
    try {
        if (!client) {
            console.log(`[MOCK SMS] Lead alert sent to ${tutorMobile} for ${leadDetails.subject}`);
            return true;
        }

        const message = await client.messages.create({
            body: `Tuitions in India: New Lead! A student in ${leadDetails.location} needs a ${leadDetails.subject} tutor. Budget: ${leadDetails.budget || 'Negotiable'}. Login to unlock: https://tuitionsinindia.com/dashboard/tutor`,
            from: twilioPhone,
            to: tutorMobile
        });

        return message.sid;
    } catch (error) {
        console.error("Failed to send lead alert SMS:", error);
        return null;
    }
};

export const sendWhatsAppLeadAlert = async (tutorMobile, leadDetails) => {
    try {
        if (!client) {
            console.log(`[MOCK WHATSAPP] Alert sent to ${tutorMobile} for ${leadDetails.subject}`);
            return true;
        }

        // Ensure the phone numbers have correct format structure (WhatsApp needs whatsapp: prefix)
        const formatForWa = (phone) => phone.startsWith('whatsapp:') ? phone : `whatsapp:${phone}`;
        const formatFromWa = (phone) => phone.startsWith('whatsapp:') ? phone : `whatsapp:${phone}`;

        const message = await client.messages.create({
            body: `*Tuitions in India - New Lead!* 📢\n\nA student in *${leadDetails.location}* needs a *${leadDetails.subject}* tutor.\n\n*Budget:* ${leadDetails.budget || 'Negotiable'}\n*Requirement:* ${leadDetails.description || 'Not specified'}\n\nLogin to unlock this lead instantly: https://tuitionsinindia.com/dashboard/tutor`,
            from: formatFromWa(twilioPhone),
            to: formatForWa(tutorMobile)
        });

        return message.sid;
    } catch (error) {
        console.error("Failed to send lead alert WhatsApp:", error);
        return null;
    }
};
