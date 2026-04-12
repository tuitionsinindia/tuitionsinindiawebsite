import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const phase = searchParams.get('phase') || '1';
    
    const key = searchParams.get('key');
    const expectedKey = process.env.AUDIT_SEED_KEY;
    if (!expectedKey || key !== expectedKey) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        if (phase === '1') {
            // Create test users
            await prisma.user.deleteMany({ where: { email: { contains: '_prod_audit@test.com' } } });

            const student = await prisma.user.create({
                data: {
                    name: "Aman Gupta (Prod_Audit_Free)",
                    email: "aman_prod_audit@test.com",
                    role: "STUDENT",
                    subscriptionTier: "FREE",
                    phone: "9119119111",
                    phoneVerified: true,
                    lat: 19.0760, // Mumbai Center Node
                    lng: 72.8777,
                    leadsPosted: {
                        create: {
                            subjects: ["Mathematics", "Physics"],
                            grades: ["High School (9-10)"],
                            locations: ["STUDENT_HOME"],
                            modes: ["STUDENT_HOME"],
                            description: "High-fidelity requirement for 1:1 Math lessons at home (Mumbai).",
                            budget: 1200,
                            lat: 19.0760,
                            lng: 72.8777
                        }
                    }
                }
            });

            const tutor = await prisma.user.create({
                data: {
                    name: "Dr. Rajesh Sharma (Prod_Audit_Free)",
                    email: "rajesh_prod_audit@test.com",
                    role: "TUTOR",
                    subscriptionTier: "FREE",
                    phone: "8118118111",
                    phoneVerified: true,
                    credits: 0,
                    lat: 19.0800,
                    lng: 72.8800,
                    tutorListing: {
                        create: {
                            title: "Maths Specialist — Ph.D Applied Mathematics",
                            bio: "Ph.D in Applied Mathematics with 20 years experience.",
                            subjects: ["Mathematics", "Calculus"],
                            grades: ["High School (9-10)", "Higher Secondary (11-12)"],
                            teachingModes: ["STUDENT_HOME", "ONLINE"],
                            hourlyRate: 1000,
                            experience: 20,
                            type: "PRIVATE"
                        }
                    }
                }
            });

            const institute = await prisma.user.create({
                data: {
                    name: "Elite Academy (Prod_Audit_Pro)",
                    email: "elite_prod_audit@test.com",
                    role: "INSTITUTE",
                    subscriptionTier: "PRO", // Starting as Pro to test recruitment initiate
                    phone: "7117117111",
                    phoneVerified: true,
                    lat: 19.0700,
                    lng: 72.8700,
                    tutorListing: {
                        create: {
                            title: "Advanced Science Academy",
                            bio: "Leading academy for competitive mathematics and physics.",
                            subjects: ["Mathematics", "Physics"],
                            grades: ["High School (9-10)"],
                            teachingModes: ["CENTER", "STUDENT_HOME"],
                            isInstitute: true,
                            type: "GROUP",
                            maxSeats: 40
                        }
                    }
                }
            });

            return NextResponse.json({
                success: true,
                message: "Test users created (student, tutor, institute).",
                studentId: student.id,
                tutorId: tutor.id,
                instituteId: institute.id
            });
        }

        if (phase === '2') {
            // PHASE 2: Upgrade Tutor to Pro
            await prisma.user.updateMany({
                where: { email: { contains: '_prod_audit@test.com' } },
                data: { subscriptionTier: "PRO" }
            });
            return NextResponse.json({ success: true, message: "Test users upgraded to PRO." });
        }

        if (phase === '0') {
            // PHASE 0: Cleanup
            await prisma.user.deleteMany({ where: { email: { contains: '_prod_audit@test.com' } } });
            return NextResponse.json({ success: true, message: "Test users deleted." });
        }

        return NextResponse.json({ error: "Invalid phase. Use 1, 2, or 0." }, { status: 400 });

    } catch (error) {
        console.error("❌ AUDIT_SEED FAILED:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
