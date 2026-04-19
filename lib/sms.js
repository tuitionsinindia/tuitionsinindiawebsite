import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

// Initialize conditionally so app doesn't crash on boot without keys
const client = accountSid && authToken ? twilio(accountSid, authToken) : null;

// Normalise any Indian phone input to E.164 (+91…). Accepts already-prefixed
// numbers, raw 10-digit, or 12-digit with country code. Returns null if the
// input can't be coerced into something valid.
function toE164India(phone) {
    if (!phone) return null;
    const digits = String(phone).replace(/\D/g, "");
    if (digits.length === 10) return `+91${digits}`;
    if (digits.length === 12 && digits.startsWith("91")) return `+${digits}`;
    if (digits.length === 11 && digits.startsWith("0")) return `+91${digits.slice(1)}`;
    return null;
}

export const sendOTP = async (mobileNumber, otpCode) => {
    try {
        const to = toE164India(mobileNumber) || mobileNumber;
        if (!client) {
            console.log(`[MOCK SMS] OTP ${otpCode} sent to ${to}`);
            return true;
        }

        const message = await client.messages.create({
            body: `Your Tuitions in India verification code is: ${otpCode}. Valid for 10 minutes.`,
            from: twilioPhone,
            to,
        });

        return message.sid;
    } catch (error) {
        console.error("Failed to send OTP SMS:", error);
        return null;
    }
};

export const sendLeadAlertSMS = async (tutorMobile, leadDetails) => {
    try {
        const to = toE164India(tutorMobile);
        if (!to) {
            console.error(`Lead alert SMS skipped — phone not in E.164 form: ${tutorMobile}`);
            return null;
        }
        if (!client) {
            console.log(`[MOCK SMS] Lead alert sent to ${to} for ${leadDetails.subject}`);
            return true;
        }

        const subject = leadDetails.subjects?.[0] || leadDetails.subject || "a subject";
        const location = leadDetails.locations?.[0] || leadDetails.location || "online";
        const message = await client.messages.create({
            body: `Tuitions in India: New Lead! A student in ${location} needs a ${subject} tutor. Budget: ${leadDetails.budget ? "₹" + leadDetails.budget + "/hr" : "Negotiable"}. Login to unlock: https://tuitionsinindia.com/dashboard/tutor`,
            from: twilioPhone,
            to,
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
