import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rateLimit";
import { Resend } from "resend";

export const dynamic = "force-dynamic";

// POST /api/inquiry
// Student sends a direct inquiry to a tutor
export async function POST(request) {
    try {
        const session = getSession();
        if (!session) {
            return NextResponse.json({ error: "Please sign in to send an inquiry." }, { status: 401 });
        }

        // Rate limit: 10 inquiries per student per hour
        const { limited } = checkRateLimit(request, `inquiry:${session.id}`, 10, 3600000);
        if (limited) {
            return NextResponse.json({ error: "Too many inquiries sent. Please wait a while before sending more." }, { status: 429 });
        }

        const { toTutorId, message, subject } = await request.json();

        if (!toTutorId) {
            return NextResponse.json({ error: "Tutor ID is required." }, { status: 400 });
        }

        const trimmedMessage = (message || "").trim().slice(0, 1000);
        if (!trimmedMessage) {
            return NextResponse.json({ error: "Message cannot be empty." }, { status: 400 });
        }

        // Prevent students from messaging themselves
        if (session.id === toTutorId) {
            return NextResponse.json({ error: "You cannot send an inquiry to yourself." }, { status: 400 });
        }

        // Fetch student and tutor in parallel
        const [student, tutor] = await Promise.all([
            prisma.user.findUnique({
                where: { id: session.id },
                select: { id: true, name: true, phone: true, email: true }
            }),
            prisma.user.findUnique({
                where: { id: toTutorId },
                select: {
                    id: true, name: true, email: true, phone: true, role: true,
                    tutorListing: { select: { subjects: true } }
                }
            })
        ]);

        if (!student) return NextResponse.json({ error: "Student not found." }, { status: 404 });
        if (!tutor) return NextResponse.json({ error: "Tutor not found." }, { status: 404 });
        if (!["TUTOR", "INSTITUTE"].includes(tutor.role)) {
            return NextResponse.json({ error: "You can only send inquiries to tutors." }, { status: 400 });
        }

        // Prevent duplicate inquiry within 24 hours
        const recentInquiry = await prisma.notification.findFirst({
            where: {
                userId: toTutorId,
                type: "INQUIRY",
                metadata: { path: ["fromStudentId"], equals: session.id },
                createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
            }
        });
        if (recentInquiry) {
            return NextResponse.json({
                error: "You already sent an inquiry to this tutor recently. Please wait 24 hours before sending another."
            }, { status: 429 });
        }

        // Create a DB notification for the tutor
        await prisma.notification.create({
            data: {
                userId: toTutorId,
                type: "INQUIRY",
                title: "New Student Inquiry",
                message: `${student.name} is interested in your services: "${trimmedMessage.slice(0, 100)}${trimmedMessage.length > 100 ? "…" : ""}"`,
                metadata: {
                    fromStudentId: student.id,
                    fromStudentName: student.name,
                    fromStudentPhone: student.phone,
                    message: trimmedMessage,
                    subject: subject || null,
                }
            }
        });

        // Send email to tutor if they have one
        if (tutor.email) {
            try {
                const resend = new Resend(process.env.RESEND_API_KEY);
                const subjectLabel = subject || tutor.tutorListing?.subjects?.[0] || "Tuition";
                await resend.emails.send({
                    from: "TuitionsInIndia <noreply@tuitionsinindia.com>",
                    to: tutor.email,
                    subject: `New Student Inquiry — ${student.name} wants ${subjectLabel} lessons`,
                    html: `
                        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #f9fafb; border-radius: 12px;">
                            <div style="text-align: center; margin-bottom: 24px;">
                                <div style="background: #2563eb; color: white; display: inline-block; padding: 12px 24px; border-radius: 8px; font-size: 18px; font-weight: bold;">
                                    TuitionsinIndia
                                </div>
                            </div>
                            <div style="background: white; border-radius: 8px; padding: 24px; border: 1px solid #e5e7eb;">
                                <h2 style="color: #111827; margin-top: 0;">You have a new student inquiry!</h2>
                                <p style="color: #6b7280; margin-bottom: 16px;">A student is interested in your tuition services.</p>

                                <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px;">
                                    <tr style="border-bottom: 1px solid #f3f4f6;">
                                        <td style="padding: 10px 0; color: #6b7280; font-size: 14px; width: 120px;">Student</td>
                                        <td style="padding: 10px 0; color: #111827; font-weight: 600; font-size: 14px;">${student.name}</td>
                                    </tr>
                                    ${student.phone ? `<tr style="border-bottom: 1px solid #f3f4f6;">
                                        <td style="padding: 10px 0; color: #6b7280; font-size: 14px;">Phone</td>
                                        <td style="padding: 10px 0; color: #111827; font-size: 14px;">${student.phone}</td>
                                    </tr>` : ""}
                                    ${subject ? `<tr style="border-bottom: 1px solid #f3f4f6;">
                                        <td style="padding: 10px 0; color: #6b7280; font-size: 14px;">Subject</td>
                                        <td style="padding: 10px 0; color: #111827; font-size: 14px;">${subject}</td>
                                    </tr>` : ""}
                                </table>

                                <div style="background: #f0f7ff; border-left: 4px solid #2563eb; padding: 16px; border-radius: 4px; margin-bottom: 16px;">
                                    <p style="margin: 0; color: #1e40af; font-size: 14px; font-style: italic;">"${trimmedMessage}"</p>
                                </div>

                                <p style="color: #6b7280; font-size: 14px;">Reply directly to this student or log into your dashboard to respond.</p>
                                ${student.phone ? `
                                <a href="https://wa.me/91${student.phone.replace(/\D/g, "").slice(-10)}"
                                   style="display: inline-block; background: #22c55e; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 14px; margin-top: 8px;">
                                    Reply on WhatsApp
                                </a>` : ""}
                                <a href="https://tuitionsinindia.com/dashboard/tutor"
                                   style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 14px; margin-top: 8px; margin-left: 8px;">
                                    Go to Dashboard
                                </a>
                            </div>
                            <p style="text-align: center; color: #9ca3af; font-size: 12px; margin-top: 16px;">
                                TuitionsInIndia · Zero commission on tutor fees
                            </p>
                        </div>
                    `
                });
            } catch (emailErr) {
                console.error("[INQUIRY] Email send failed:", emailErr.message);
                // Don't fail the request if email fails — notification was already created
            }
        }

        return NextResponse.json({ success: true, message: "Your inquiry has been sent to the tutor." });

    } catch (err) {
        console.error("[INQUIRY_ERROR]", err);
        return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
    }
}
