import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendLeadAlertEmail } from "@/lib/email";
import { sendLeadAlertSMS } from "@/lib/sms";

export async function POST(request) {
    try {
        const body = await request.json();
        const { 
            studentId, 
            subjects, 
            grades, 
            locations, 
            budget, 
            description, 
            modes, 
            boards, 
            timings, 
            genderPreference,
            lat,
            lng
        } = body;

        if (!studentId || !subjects || subjects.length === 0) {
            return NextResponse.json({ success: false, error: "Missing required identity or requirement fields" }, { status: 400 });
        }

        // 1. Mark profile as complete
        await prisma.user.update({
            where: { id: studentId },
            data: { isProfileComplete: true }
        });

        // 2. Create the Lead with universal alignment
        const lead = await prisma.lead.create({
            data: {
                studentId,
                subjects,
                grades,
                locations,
                budget: parseInt(budget) || 0,
                modes,
                boards,
                timings,
                genderPreference,
                description,
                lat,
                lng,
                status: "OPEN"
            }
        });

        // Non-blocking: notify matching tutors
        prisma.user.findMany({
            where: { role: "TUTOR" },
            select: { email: true, phone: true },
            take: 50,
        }).then(tutors => {
            const emails = tutors.map(t => t.email).filter(Boolean);
            if (emails.length > 0) sendLeadAlertEmail(emails, lead).catch(() => {});
            tutors.slice(0, 5).forEach(t => {
                if (t.phone) sendLeadAlertSMS(t.phone, { subject: subjects?.[0], location: locations?.[0], description }).catch(() => {});
            });
        }).catch(() => {});

        return NextResponse.json({ success: true, lead });

    } catch (error) {
        console.error("Lead Creation Error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
