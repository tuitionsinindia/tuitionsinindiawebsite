import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const instituteId = searchParams.get("instituteId");

        if (!instituteId) {
            return NextResponse.json({ error: "Missing Institute ID" }, { status: 400 });
        }

        const courses = await prisma.course.findMany({
            where: { instituteId },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json(courses);
    } catch (error) {
        console.error("Error fetching courses:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const body = await request.json();
        const { instituteId, title, description, duration, price, category } = body;

        if (!instituteId || !title || !price) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const newCourse = await prisma.course.create({
            data: {
                instituteId,
                title,
                description,
                duration,
                price: parseInt(price),
                category
            }
        });

        return NextResponse.json(newCourse);
    } catch (error) {
        console.error("Error creating course:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(request) {
    try {
        const { searchParams } = new URL(request.url);
        const courseId = searchParams.get("id");
        const instituteId = searchParams.get("instituteId");

        if (!courseId || !instituteId) {
            return NextResponse.json({ error: "Missing IDs" }, { status: 400 });
        }

        await prisma.course.delete({
            where: { id: courseId, instituteId }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting course:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
