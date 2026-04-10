import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

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

        return NextResponse.json({ success: true, lead });

    } catch (error) {
        console.error("Lead Creation Error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
