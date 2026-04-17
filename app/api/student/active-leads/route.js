import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export async function GET(request) {
    try {
        const session = getSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const studentId = searchParams.get("studentId");

        if (!studentId) {
            return NextResponse.json({ error: "Missing Student ID" }, { status: 400 });
        }

        // Verify the authenticated user is requesting their own leads
        if (session.id !== studentId) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
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
                                id: true,
                                name: true,
                                phone: true,
                                email: true,
                                image: true,
                                tutorListing: {
                                    select: {
                                        title: true,
                                        subjects: true
                                    }
                                }
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
