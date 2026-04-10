import { PrismaClient } from '@prisma/client';

// Production Database URL from .env
const DATABASE_URL = "postgresql://tuitions_admin:secure_password_here@187.77.188.36:5432/tuitionsinindia?schema=public";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: DATABASE_URL,
    },
  },
});

async function runProductionSeed(phase = 1) {
    console.log(`🚀 PRODUCTION AUDIT: PHASE ${phase} INITIALIZING...`);
    
    try {
        if (phase === 1) {
            // 1. SCRUB OLD AUDIT DATA
            await prisma.user.deleteMany({
                where: { email: { contains: '_audit@prod-test.com' } }
            });

            // 2. CREATE FREE STUDENT
            const student = await prisma.user.create({
                data: {
                    name: "Aman Prod_Audit (Free Student)",
                    email: "aman_audit@prod-test.com",
                    role: "STUDENT",
                    subscriptionTier: "FREE",
                    phone: "9999911111",
                    phoneVerified: true,
                    lat: 19.0760, // Mumbai Center
                    lng: 72.8777,
                    leadsPosted: {
                        create: {
                            subjects: ["Mathematics"],
                            grades: ["High School (9-10)"],
                            locations: ["STUDENT_HOME"],
                            modes: ["STUDENT_HOME"],
                            description: "Urgent 1:1 Math tuition required at my location (Mumbai Node).",
                            budget: 1200,
                            lat: 19.0760,
                            lng: 72.8777
                        }
                    }
                }
            });

            // 3. CREATE FREE TUTOR
            const tutor = await prisma.user.create({
                data: {
                    name: "Dr. Rajesh Prod_Audit (Free Tutor)",
                    email: "rajesh_audit@prod-test.com",
                    role: "TUTOR",
                    subscriptionTier: "FREE",
                    phone: "8888822222",
                    phoneVerified: true,
                    lat: 19.0800,
                    lng: 72.8800,
                    tutorListing: {
                        create: {
                            title: "Senior Algebra Specialist",
                            bio: "PhD in Mathematics. 20 years experience.",
                            subjects: ["Mathematics", "Physics"],
                            grades: ["High School (9-10)"],
                            teachingModes: ["STUDENT_HOME", "ONLINE"],
                            hourlyRate: 900,
                            experience: 20,
                            type: "PRIVATE"
                        }
                    }
                }
            });

            // 4. CREATE FREE INSTITUTE
            const institute = await prisma.user.create({
                data: {
                    name: "Elite Academy Prod_Audit (Free Institute)",
                    email: "elite_audit@prod-test.com",
                    role: "INSTITUTE",
                    subscriptionTier: "FREE",
                    phone: "7777733333",
                    phoneVerified: true,
                    lat: 19.0700,
                    lng: 72.8700,
                    tutorListing: {
                        create: {
                            title: "Elite Competitive Center",
                            bio: "Premium institute for advanced science protocols.",
                            subjects: ["Mathematics", "Science"],
                            grades: ["High School (9-10)"],
                            teachingModes: ["CENTER", "STUDENT_HOME"],
                            isInstitute: true,
                            type: "GROUP",
                            maxSeats: 30
                        }
                    }
                }
            });

            console.log("✅ PHASE 1 SEEDING COMPLETE: FREE NODES READY.");
            console.log(`Nodes: Student[${student.id}], Tutor[${tutor.id}], Institute[${institute.id}]`);
        }

        if (phase === 2) {
            console.log("💎 UPGRADING NODES TO PRO TIER...");
            await prisma.user.updateMany({
                where: { email: { contains: '_audit@prod-test.com' } },
                data: { subscriptionTier: "PRO" }
            });
            console.log("✅ PHASE 2 UPGRADE COMPLETE: PRO NODES READY.");
        }

        if (phase === 0) {
            console.log("🧹 SCRUBBING AUDIT DATA FROM PRODUCTION...");
            await prisma.user.deleteMany({
                where: { email: { contains: '_audit@prod-test.com' } }
            });
            console.log("✅ SCRUB COMPLETE.");
        }

    } catch (error) {
        console.error("❌ PRODUCTION AUDIT ERROR:", error);
    } finally {
        await prisma.$disconnect();
    }
}

// Get phase from CLI
const args = process.argv.slice(2);
const targetPhase = parseInt(args[0]) || 1;
runProductionSeed(targetPhase);
