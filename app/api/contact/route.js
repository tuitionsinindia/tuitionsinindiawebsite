import { NextResponse } from "next/server";
import { Resend } from "resend";
import { checkRateLimit } from "@/lib/rateLimit";

export async function POST(request) {
    try {
        // Rate limit: 3 contact form submissions per IP per hour
        const { limited } = checkRateLimit(request, "contact-form", 3, 3600000);
        if (limited) {
            return NextResponse.json({ success: false, error: "Too many messages sent. Please wait an hour before trying again." }, { status: 429 });
        }

        const resend = new Resend(process.env.RESEND_API_KEY);
        let { name, email, phone, subject, message } = await request.json();

        if (!name?.trim() || !email?.trim() || !message?.trim()) {
            return NextResponse.json({ success: false, error: "Name, email, and message are required." }, { status: 400 });
        }

        // Sanitise + enforce length limits
        name = name.trim().slice(0, 100);
        email = email.trim().slice(0, 200);
        subject = (subject || "General Enquiry").trim().slice(0, 200);
        message = message.trim().slice(0, 2000);
        phone = (phone || "").trim().slice(0, 20);

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json({ success: false, error: "Invalid email address." }, { status: 400 });
        }

        const toAddress = process.env.CONTACT_EMAIL || "support@tuitionsinindia.com";

        await resend.emails.send({
            from: "TuitionsInIndia Contact <noreply@tuitionsinindia.com>",
            to: toAddress,
            replyTo: email,
            subject: `Contact Form: ${subject || "General Enquiry"} — ${name}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #f9fafb; border-radius: 8px;">
                    <h2 style="color: #1d4ed8; margin-bottom: 24px;">New Contact Form Submission</h2>
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr style="border-bottom: 1px solid #e5e7eb;">
                            <td style="padding: 12px 0; font-weight: bold; color: #6b7280; width: 120px;">Name</td>
                            <td style="padding: 12px 0; color: #111827;">${name}</td>
                        </tr>
                        <tr style="border-bottom: 1px solid #e5e7eb;">
                            <td style="padding: 12px 0; font-weight: bold; color: #6b7280;">Email</td>
                            <td style="padding: 12px 0; color: #111827;">${email}</td>
                        </tr>
                        ${phone ? `<tr style="border-bottom: 1px solid #e5e7eb;">
                            <td style="padding: 12px 0; font-weight: bold; color: #6b7280;">Phone</td>
                            <td style="padding: 12px 0; color: #111827;">${phone}</td>
                        </tr>` : ""}
                        <tr style="border-bottom: 1px solid #e5e7eb;">
                            <td style="padding: 12px 0; font-weight: bold; color: #6b7280;">Subject</td>
                            <td style="padding: 12px 0; color: #111827;">${subject || "General Enquiry"}</td>
                        </tr>
                        <tr>
                            <td style="padding: 12px 0; font-weight: bold; color: #6b7280; vertical-align: top;">Message</td>
                            <td style="padding: 12px 0; color: #111827; white-space: pre-wrap;">${message}</td>
                        </tr>
                    </table>
                </div>
            `
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Contact form error:", error);
        return NextResponse.json({ success: false, error: "Failed to send message. Please try again." }, { status: 500 });
    }
}
