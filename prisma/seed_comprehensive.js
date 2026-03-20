const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Creating Comprehensive Dummy Data...");

    // 0. Cleanup old dummy data to avoid unique constraint errors
    console.log("🧹 Cleaning up old dummy data...");
    await prisma.user.deleteMany({
        where: {
            OR: [
                { email: { contains: '@example.com' } },
                { id: { startsWith: 'tut_' } },
                { id: 'st_demo' }
            ]
        }
    });

    // 1. Create Diverse Tutors
    const tutorsData = [
        {
            id: 'tut_math_1',
            name: 'Rajesh Kumar',
            email: 'rajesh.math@example.com',
            phone: '9876543210',
            role: 'TUTOR',
            lat: 19.0760, lng: 72.8777, // Mumbai
            isVerified: true,
            subscriptionTier: 'ELITE',
            listing: {
                title: 'Senior Mathematics Specialist',
                bio: 'IIT Graduate with 15 years of experience in teaching Calculus and Algebra for JEE aspirants.',
                subjects: ['Mathematics', 'Further Maths'],
                grades: ['High School (9-10)', 'Higher Secondary (11-12)', 'Competitive Exams'],
                locations: ['Mumbai', 'Online'],
                hourlyRate: 1500,
                rating: 4.9,
                reviewCount: 42
            }
        },
        {
            id: 'tut_phys_1',
            name: 'Dr. Sarah Ahmed',
            email: 'sarah.phys@example.com',
            phone: '9876543211',
            role: 'TUTOR',
            lat: 28.6139, lng: 77.2090, // Delhi
            isVerified: true,
            subscriptionTier: 'PRO',
            listing: {
                title: 'Physics Professor & Mentor',
                bio: 'PhD in Astrophysics. I make complex Physics concepts simple for middle and high school students.',
                subjects: ['Physics', 'Science'],
                grades: ['Middle (6-8)', 'High School (9-10)', 'Higher Secondary (11-12)'],
                locations: ['Delhi', 'Online'],
                hourlyRate: 1200,
                rating: 4.7,
                reviewCount: 18
            }
        },
        {
            id: 'tut_coding_1',
            name: 'Anita Desai',
            email: 'anita.code@example.com',
            phone: '9876543212',
            role: 'TUTOR',
            lat: 12.9716, lng: 77.5946, // Bangalore
            isVerified: false,
            subscriptionTier: 'FREE',
            listing: {
                title: 'Full Stack Web Developer & Coding Tutor',
                bio: 'Expert in Python, JavaScript, and React. Teaching coding to kids and undergraduates.',
                subjects: ['Coding', 'Computer Science'],
                grades: ['Primary (1-5)', 'Middle (6-8)', 'Undergraduate'],
                locations: ['Bangalore', 'Online'],
                hourlyRate: 600,
                rating: 4.5,
                reviewCount: 12
            }
        },
        {
            id: 'tut_music_1',
            name: 'Michael Fernandes',
            email: 'michael.music@example.com',
            phone: '9876543213',
            role: 'TUTOR',
            lat: 15.2993, lng: 74.1240, // Goa (Let's stick to major cities though)
            lat: 19.0800, lng: 72.8800, // Near Mumbai
            isVerified: true,
            subscriptionTier: 'PRO',
            listing: {
                title: 'Professional Guitar & Music Theory Coach',
                bio: 'Learn Guitar from basics to advanced. 8 years as a session musician.',
                subjects: ['Music', 'Arts'],
                grades: ['Primary (1-5)', 'Middle (6-8)', 'High School (9-10)', 'Other'],
                locations: ['Mumbai'],
                hourlyRate: 800,
                rating: 4.8,
                reviewCount: 30
            }
        },
        {
            id: 'tut_chem_1',
            name: 'Vikram Singh',
            email: 'vikram.chem@example.com',
            phone: '9876543214',
            role: 'TUTOR',
            lat: 17.3850, lng: 78.4867, // Hyderabad
            isVerified: true,
            subscriptionTier: 'FREE',
            listing: {
                title: 'Chemistry Expert for NEET/AIPMT',
                bio: 'Specializing in Organic and Inorganic Chemistry for medical entrance exams.',
                subjects: ['Chemistry', 'Science'],
                grades: ['Higher Secondary (11-12)', 'Competitive Exams'],
                locations: ['Hyderabad', 'Online'],
                hourlyRate: 2000,
                rating: 4.6,
                reviewCount: 22
            }
        }
    ];

    for (const data of tutorsData) {
        const { listing, ...userData } = data;
        const user = await prisma.user.upsert({
            where: { email: userData.email },
            update: userData,
            create: userData,
        });

        await prisma.listing.upsert({
            where: { tutorId: user.id },
            update: { ...listing, tutorId: user.id },
            create: { ...listing, tutorId: user.id },
        });
    }

    // 2. Create Diverse Student Leads
    const leadsData = [
        {
            studentId: 'st_demo', // Using existing demo student if exists
            subject: 'Mathematics',
            grade: 'High School (9-10)',
            location: 'Mumbai',
            lat: 19.0760, lng: 72.8777,
            budget: '5000/month',
            description: 'Looking for a Math tutor for my daughter in 10th grade. Focus on Algebra.',
            status: 'OPEN',
            isPremium: true
        },
        {
            studentId: 'st_demo',
            subject: 'Physics',
            grade: 'Higher Secondary (11-12)',
            location: 'Delhi',
            lat: 28.6139, lng: 77.2090,
            budget: '1000/hour',
            description: 'Need help with 12th Board Physics. Prefer evening sessions.',
            status: 'OPEN',
            isPremium: false
        }
    ];

    // Ensure demo student exists
    await prisma.user.upsert({
        where: { email: 'demo_student@example.com' },
        update: {},
        create: {
            id: 'st_demo',
            name: 'Demo Student',
            email: 'demo_student@example.com',
            phone: '9999999999',
            role: 'STUDENT',
        },
    });

    for (const lead of leadsData) {
        await prisma.lead.create({ data: lead });
    }

    console.log("✅ Comprehensive Dummy Data seeded successfully!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
