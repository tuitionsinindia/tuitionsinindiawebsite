import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const studentId = searchParams.get("studentId");

        if (!studentId) {
            return NextResponse.json({ error: "Missing Student ID" }, { status: 400 });
        }

        const activeLeads = await prisma.lead.findMany({
            where: {
                studentId,
                status: 'OPEN'
            },
            include: {
                unlockedBy: {
                    select: {
                        tutor: {
                            select: {
                                name: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json(activeLeads);

    } catch (error) {
        console.error("Error fetching active leads:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
