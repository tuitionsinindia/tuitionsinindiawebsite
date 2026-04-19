import twilio from 'twilio';

// SMS provider priority:
// 1. MSG91 — Indian provider, DLT-compliant, reliable delivery. Primary.
// 2. Twilio — fallback for non-India numbers, or if MSG91 fails.
// If neither is configured, sends are mocked (logged, not delivered).

const msg91AuthKey = process.env.MSG91_AUTH_KEY;
const msg91OtpTemplateId = process.env.MSG91_OTP_TEMPLATE_ID;
const msg91SenderId = process.env.MSG91_SENDER_ID || "TUTIND";

const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhone = process.env.TWILIO_PHONE_NUMBER;
const twilioClient = twilioAccountSid && twilioAuthToken ? twilio(twilioAccountSid, twilioAuthToken) : null;

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

// Returns just the 12-digit country-code-prefixed mobile for MSG91
// (they don't want a + sign — "919999000111").
function toMsg91India(phone) {
    const e164 = toE164India(phone);
    return e164 ? e164.replace(/^\+/, "") : null;
}

// ─── MSG91 — primary OTP provider ────────────────────────────────────────
// API docs: https://docs.msg91.com/p/tf9GTextN/e/mSfS4Dx4yB/MSG91
// Uses their OTP endpoint which auto-handles DLT template compliance and
// the 10-minute OTP lifecycle (we still store our own copy in otpStore
// for verification, but this request triggers the SMS).
async function sendOtpViaMsg91(mobileE12, otpCode) {
    if (!msg91AuthKey || !msg91OtpTemplateId) return null;
    try {
        const url = `https://control.msg91.com/api/v5/otp?template_id=${msg91OtpTemplateId}&mobile=${mobileE12}&authkey=${msg91AuthKey}&otp=${otpCode}`;
        const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
        });
        const body = await res.json().catch(() => ({}));
        if (res.ok && body?.type !== "error") {
            return body.request_id || "sent";
        }
        console.error(`MSG91 OTP failed (${res.status}):`, body);
        return null;
    } catch (err) {
        console.error("MSG91 OTP network error:", err);
        return null;
    }
}

// MSG91 Flow API — used for non-OTP transactional sends (lead alerts).
// Requires a separate pre-approved template for each message type.
// For now we fall back to Twilio for lead-alert SMS; can switch to MSG91
// Flow once we register a lead-alert template.
async function sendFlowSmsViaMsg91(mobileE12, templateId, variables) {
    if (!msg91AuthKey || !templateId) return null;
    try {
        const res = await fetch("https://control.msg91.com/api/v5/flow/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                authkey: msg91AuthKey,
            },
            body: JSON.stringify({
                template_id: templateId,
                short_url: "0",
                recipients: [{ mobiles: mobileE12, ...variables }],
            }),
        });
        const body = await res.json().catch(() => ({}));
        if (res.ok && body?.type !== "error") return body.request_id || "sent";
        console.error(`MSG91 Flow failed (${res.status}):`, body);
        return null;
    } catch (err) {
        console.error("MSG91 Flow network error:", err);
        return null;
    }
}

// ─── Public API ──────────────────────────────────────────────────────────

export const sendOTP = async (mobileNumber, otpCode) => {
    const msg91Mobile = toMsg91India(mobileNumber);
    const e164 = toE164India(mobileNumber) || mobileNumber;

    // Mock mode — neither provider configured
    if (!msg91AuthKey && !twilioClient) {
        console.log(`[MOCK SMS] OTP ${otpCode} sent to ${e164}`);
        return true;
    }

    // Primary — MSG91 (India-only)
    if (msg91AuthKey && msg91OtpTemplateId && msg91Mobile) {
        const sid = await sendOtpViaMsg91(msg91Mobile, otpCode);
        if (sid) return sid;
        console.warn("MSG91 OTP failed, falling back to Twilio");
    }

    // Fallback — Twilio
    if (twilioClient) {
        try {
            const message = await twilioClient.messages.create({
                body: `Your Tuitions in India verification code is: ${otpCode}. Valid for 10 minutes.`,
                from: twilioPhone,
                to: e164,
            });
            return message.sid;
        } catch (err) {
            console.error("Twilio OTP failed:", err);
            return null;
        }
    }

    return null;
};

export const sendLeadAlertSMS = async (tutorMobile, leadDetails) => {
    const e164 = toE164India(tutorMobile);
    if (!e164) {
        console.error(`Lead alert SMS skipped — phone not in E.164 form: ${tutorMobile}`);
        return null;
    }

    if (!twilioClient && !msg91AuthKey) {
        console.log(`[MOCK SMS] Lead alert sent to ${e164} for ${leadDetails.subject}`);
        return true;
    }

    const subject = leadDetails.subjects?.[0] || leadDetails.subject || "a subject";
    const location = leadDetails.locations?.[0] || leadDetails.location || "online";

    // If MSG91 lead-alert template is registered, use it. Otherwise Twilio.
    if (msg91AuthKey && process.env.MSG91_LEAD_ALERT_TEMPLATE_ID) {
        const sid = await sendFlowSmsViaMsg91(
            toMsg91India(tutorMobile),
            process.env.MSG91_LEAD_ALERT_TEMPLATE_ID,
            { subject, location, budget: leadDetails.budget ? `₹${leadDetails.budget}` : "Negotiable" }
        );
        if (sid) return sid;
    }

    if (twilioClient) {
        try {
            const message = await twilioClient.messages.create({
                body: `Tuitions in India: New Lead! A student in ${location} needs a ${subject} tutor. Budget: ${leadDetails.budget ? "₹" + leadDetails.budget + "/hr" : "Negotiable"}. Login to unlock: https://tuitionsinindia.com/dashboard/tutor`,
                from: twilioPhone,
                to: e164,
            });
            return message.sid;
        } catch (err) {
            console.error("Failed to send lead alert SMS:", err);
            return null;
        }
    }

    return null;
};

export const sendWhatsAppLeadAlert = async (tutorMobile, leadDetails) => {
    try {
        if (!twilioClient) {
            console.log(`[MOCK WHATSAPP] Alert sent to ${tutorMobile} for ${leadDetails.subject}`);
            return true;
        }

        // Ensure the phone numbers have correct format structure (WhatsApp needs whatsapp: prefix)
        const formatForWa = (phone) => phone.startsWith('whatsapp:') ? phone : `whatsapp:${phone}`;
        const formatFromWa = (phone) => phone.startsWith('whatsapp:') ? phone : `whatsapp:${phone}`;

        const message = await twilioClient.messages.create({
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
