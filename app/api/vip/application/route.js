export const dynamic = "force-dynamic";

import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        const session = getSession();
        if (!session) {
            return NextResponse.json({ error: "Please log in to continue." }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);

        if (session.role === "STUDENT") {
            const application = await prisma.vipApplication.findFirst({
                where: { studentId: session.id },
                orderBy: { createdAt: "desc" },
                include: {
                    matches: {
                        orderBy: { recommendationNumber: "asc" },
                        include: {
                            tutor: {
                                select: {
                                    id: true,
                                    name: true,
                                    image: true,
                                    isVerified: true,
                                    email: true,
                                    phone: true,
                                    tutorListing: {
                                        select: {
                                            subjects: true,
                                            locations: true,
                                            grades: true,
                                            hourlyRate: true,
                                            experience: true,
                                            teachingModes: true,
                                            boards: true,
                                            bio: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                    contract: true,
                },
            });

            if (!application) {
                return NextResponse.json({ application: null });
            }

            // Determine current active match (SENT or ACCEPTED)
            const activeMatch = application.matches.find(
                (m) => m.status === "SENT" || m.status === "ACCEPTED"
            ) || null;

            // Only reveal tutor contact if status is MATCHED
            const isMatched = application.status === "MATCHED";

            return NextResponse.json({
                application: {
                    ...application,
                    activeMatch: activeMatch
                        ? {
                              ...activeMatch,
                              tutor: {
                                  ...activeMatch.tutor,
                                  // Contact details only after match confirmed
                                  email: isMatched ? activeMatch.tutor?.email : undefined,
                                  phone: isMatched ? activeMatch.tutor?.phone : undefined,
                              },
                          }
                        : null,
                    contractDetails: application.contract || null,
                },
            });
        }

        if (session.role === "ADMIN") {
            const applicationId = searchParams.get("applicationId");
            const studentId = searchParams.get("studentId");

            if (!applicationId && !studentId) {
                return NextResponse.json({ error: "Please provide applicationId or studentId." }, { status: 400 });
            }

            const application = await prisma.vipApplication.findFirst({
                where: {
                    ...(applicationId ? { id: applicationId } : {}),
                    ...(studentId ? { studentId } : {}),
                },
                orderBy: { createdAt: "desc" },
                include: {
                    student: {
                        select: { id: true, name: true, email: true, phone: true },
                    },
                    matches: {
                        orderBy: { recommendationNumber: "asc" },
                        include: {
                            tutor: {
                                select: {
                                    id: true,
                                    name: true,
                                    email: true,
                                    phone: true,
                                    image: true,
                                    tutorListing: {
                                        select: {
                                            subjects: true,
                                            locations: true,
                                            grades: true,
                                            hourlyRate: true,
                                            experience: true,
                                            teachingModes: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                    contract: true,
                },
            });

            if (!application) {
                return NextResponse.json({ error: "Application not found." }, { status: 404 });
            }

            return NextResponse.json({ application });
        }

        return NextResponse.json({ error: "Access denied." }, { status: 403 });
    } catch (err) {
        console.error("[VIP Application GET]", err);
        return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
    }
}
