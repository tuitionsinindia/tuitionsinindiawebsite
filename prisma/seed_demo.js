const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Seeding Demo Data...");

    // 1. Create Demo Student
    const student = await prisma.user.upsert({
        where: { email: 'demo_student@example.com' },
        update: {},
        create: {
            id: 'st_demo',
            name: 'Demo Student',
            email: 'demo_student@example.com',
            phone: '9999999999',
            role: 'STUDENT',
            lat: 19.0760,
            lng: 72.8777, // Mumbai
        },
    });

    // 2. Create Demo Tutor
    const tutor = await prisma.user.upsert({
        where: { email: 'demo_tutor@example.com' },
        update: {},
        create: {
            id: 'tut_demo',
            name: 'Demo Tutor (Expert)',
            email: 'demo_tutor@example.com',
            phone: '8888888888',
            role: 'TUTOR',
            lat: 19.0800,
            lng: 72.8800, // Near Mumbai center
            isVerified: true,
            isIdVerified: true,
            subscriptionTier: 'PRO',
            subscriptionStatus: 'ACTIVE',
            credits: 50,
        },
    });

    // 3. Create Tutor Listing
    await prisma.listing.upsert({
        where: { tutorId: tutor.id },
        update: {},
        create: {
            tutorId: tutor.id,
            title: 'Master Physics & Mathematics Expert',
            bio: 'Over 10 years of experience in JEE and CBSE coaching. Proven track record of success.',
            subjects: ['Physics', 'Mathematics'],
            locations: ['Mumbai', 'Online'],
            hourlyRate: 800,
            rating: 4.9,
            reviewCount: 25,
            isActive: true,
        }
    });

    // 4. Create Student Lead
    await prisma.lead.create({
        data: {
            studentId: student.id,
            subject: 'Physics',
            location: 'Mumbai',
            lat: 19.0760,
            lng: 72.8777,
            budget: '5000/month',
            description: 'Looking for a home tutor for 12th Grade Physics, thrice a week.',
            status: 'OPEN',
        }
    });

    console.log("✅ Demo Data Seeded successfully!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
