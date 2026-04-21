import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

// One-time demo seed — protected by CRON_SECRET
// Call: GET /api/admin/seed-demo?secret=<CRON_SECRET>
export async function GET(request) {
    const secret = new URL(request.url).searchParams.get("secret");
    if (secret !== process.env.CRON_SECRET) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const DEMO_TUTORS = [
        {
            name: "Priya Sharma",
            phone: "9000000001",
            email: "priya.sharma.demo@tuitionsinindia.com",
            image: "https://api.dicebear.com/9.x/avataaars/svg?seed=PriyaSharma&backgroundColor=b6e3f4&clothingColor=6bd9e9",
            title: "Maths & Physics Tutor | IIT Delhi Alumna | 7 yrs exp",
            bio: "IIT Delhi graduate with a passion for making Maths and Physics simple and intuitive. I specialize in JEE preparation and CBSE board exams.",
            subjects: ["Mathematics", "Physics", "IIT JEE Mains", "IIT JEE Advanced"],
            grades: ["Class 11-12", "Competitive Exams"],
            locations: ["Delhi", "Noida", "Gurgaon"],
            hourlyRate: 700,
            rating: 4.9,
            reviewCount: 48,
            experience: 7,
            teachingModes: ["ONLINE", "HOME"],
            offersTrialClass: true,
        },
        {
            name: "Rahul Gupta",
            phone: "9000000002",
            email: "rahul.gupta.demo@tuitionsinindia.com",
            image: "https://api.dicebear.com/9.x/avataaars/svg?seed=RahulGupta&backgroundColor=c0aede&hairColor=2c1b18",
            title: "Chemistry & Biology | MBBS | NEET Specialist",
            bio: "MBBS from Mumbai University. I help students crack NEET and build a strong foundation in Chemistry and Biology for Class 11-12.",
            subjects: ["Chemistry", "Biology", "NEET", "B.Sc Chemistry"],
            grades: ["Class 11-12", "Competitive Exams"],
            locations: ["Mumbai", "Thane", "Navi Mumbai"],
            hourlyRate: 600,
            rating: 4.8,
            reviewCount: 61,
            experience: 5,
            teachingModes: ["HOME", "ONLINE"],
            offersTrialClass: true,
        },
        {
            name: "Anita Verma",
            phone: "9000000003",
            email: "anita.verma.demo@tuitionsinindia.com",
            image: "https://api.dicebear.com/9.x/avataaars/svg?seed=AnitaVerma&backgroundColor=ffd5dc&clothingColor=ff8eb4",
            title: "English & Communication Skills | 10 yrs | All Boards",
            bio: "M.A. English from Delhi University. I make English fun and accessible for students of all ages — from basic grammar to advanced writing and spoken English.",
            subjects: ["English", "Spoken English", "Hindi", "Social Studies"],
            grades: ["Class 1-5", "Class 6-8", "Class 9-10"],
            locations: ["Bangalore", "Electronic City", "Koramangala"],
            hourlyRate: 450,
            rating: 4.9,
            reviewCount: 93,
            experience: 10,
            teachingModes: ["ONLINE"],
            offersTrialClass: true,
        },
        {
            name: "Vikram Patel",
            phone: "9000000004",
            email: "vikram.patel.demo@tuitionsinindia.com",
            image: "https://api.dicebear.com/9.x/avataaars/svg?seed=VikramPatel&backgroundColor=ffdfbf&hairColor=724133",
            title: "JEE & NEET Expert | B.Tech + MBA | 12 yrs exp",
            bio: "Top-ranked coach for JEE and NEET with 12 years of experience. My students have secured seats in IITs, NITs and top medical colleges across India.",
            subjects: ["Mathematics", "Physics", "Chemistry", "IIT JEE Mains", "IIT JEE Advanced", "NEET"],
            grades: ["Class 11-12", "Competitive Exams"],
            locations: ["Ahmedabad", "Surat", "Vadodara"],
            hourlyRate: 900,
            rating: 4.9,
            reviewCount: 112,
            experience: 12,
            teachingModes: ["ONLINE", "HOME"],
            offersTrialClass: false,
        },
        {
            name: "Sunita Reddy",
            phone: "9000000005",
            email: "sunita.reddy.demo@tuitionsinindia.com",
            image: "https://api.dicebear.com/9.x/avataaars/svg?seed=SunitaReddy&backgroundColor=d1d4f9&clothingColor=9287ff",
            title: "Computer Science & Python | B.E. CSE | Online Only",
            bio: "Software engineer turned educator. I teach Python, Data Structures, and Computer Science for school and college students. Industry experience + teaching passion.",
            subjects: ["Computer Science", "Python", "Data Structures", "Programming (C/C++)", "Web Development"],
            grades: ["Class 9-10", "Class 11-12", "Graduate"],
            locations: ["Hyderabad", "Secunderabad", "Online"],
            hourlyRate: 600,
            rating: 4.7,
            reviewCount: 34,
            experience: 6,
            teachingModes: ["ONLINE"],
            offersTrialClass: true,
        },
        {
            name: "Arjun Mehta",
            phone: "9000000006",
            email: "arjun.mehta.demo@tuitionsinindia.com",
            image: "https://api.dicebear.com/9.x/avataaars/svg?seed=ArjunMehta&backgroundColor=b6e3f4&hairColor=4a312c",
            title: "Accountancy & Economics | CA Inter | Board Specialist",
            bio: "CA Inter cleared. I specialize in Accountancy, Business Studies, and Economics for Class 11-12 CBSE and ICSE students. 100+ board toppers coached.",
            subjects: ["Accountancy", "Economics", "Business Studies", "Mathematics"],
            grades: ["Class 11-12"],
            locations: ["Pune", "Kothrud", "Hadapsar"],
            hourlyRate: 500,
            rating: 4.8,
            reviewCount: 57,
            experience: 4,
            teachingModes: ["HOME", "ONLINE"],
            offersTrialClass: true,
        },
    ];

    // Mumbai-focused profiles for school academics & mid-level maths testing
    const MUMBAI_TUTORS = [
        {
            name: "Sneha Kulkarni",
            phone: "9000000010",
            email: "sneha.kulkarni.demo@tuitionsinindia.com",
            image: "https://api.dicebear.com/9.x/avataaars/svg?seed=SnehaKulkarni&backgroundColor=ffd5dc&clothingColor=ff8eb4",
            title: "Maths Tutor | Class 6-10 | CBSE & ICSE | Andheri",
            bio: "B.Sc Mathematics from Mumbai University. I specialize in building strong fundamentals for Class 6 to 10 students. Patient teaching style with step-by-step problem solving. 8 years of experience with 200+ students.",
            subjects: ["Mathematics", "Science", "English"],
            grades: ["Class 6-8", "Class 9-10"],
            locations: ["Andheri", "Goregaon", "Mumbai"],
            hourlyRate: 500,
            rating: 4.8,
            reviewCount: 42,
            experience: 8,
            teachingModes: ["HOME", "ONLINE"],
            offersTrialClass: true,
            lat: 19.1197, lng: 72.8464,
        },
        {
            name: "Rajan Desai",
            phone: "9000000011",
            email: "rajan.desai.demo@tuitionsinindia.com",
            image: "https://api.dicebear.com/9.x/avataaars/svg?seed=RajanDesai&backgroundColor=b6e3f4&hairColor=2c1b18",
            title: "School Maths & Science | 12 yrs | Dadar & Chembur",
            bio: "Experienced school teacher turned private tutor. I cover full school curriculum — Maths, Science, and English — for Class 5 to 10 (CBSE, ICSE, SSC). Evening batches available.",
            subjects: ["Mathematics", "Science", "English", "Hindi"],
            grades: ["Class 1-5", "Class 6-8", "Class 9-10"],
            locations: ["Dadar", "Chembur", "Sion", "Mumbai"],
            hourlyRate: 450,
            rating: 4.7,
            reviewCount: 78,
            experience: 12,
            teachingModes: ["HOME"],
            offersTrialClass: true,
            lat: 19.0178, lng: 72.8478,
        },
        {
            name: "Pooja Joshi",
            phone: "9000000012",
            email: "pooja.joshi.demo@tuitionsinindia.com",
            image: "https://api.dicebear.com/9.x/avataaars/svg?seed=PoojaJoshi&backgroundColor=d1d4f9&clothingColor=9287ff",
            title: "CBSE Maths Specialist | Class 8-10 | Bandra & Kurla",
            bio: "M.Sc Mathematics. My students consistently score 90%+ in board exams. I focus on concept clarity, regular practice tests, and exam technique for Class 8-10 CBSE students.",
            subjects: ["Mathematics", "Science"],
            grades: ["Class 6-8", "Class 9-10"],
            locations: ["Bandra", "Kurla", "Sion", "Mumbai"],
            hourlyRate: 550,
            rating: 4.9,
            reviewCount: 31,
            experience: 6,
            teachingModes: ["HOME", "ONLINE"],
            offersTrialClass: true,
            lat: 19.0596, lng: 72.8295,
        },
        {
            name: "Deepak Nair",
            phone: "9000000013",
            email: "deepak.nair.demo@tuitionsinindia.com",
            image: "https://api.dicebear.com/9.x/avataaars/svg?seed=DeepakNair&backgroundColor=ffdfbf&hairColor=724133",
            title: "School Academics | All Subjects | Thane & Navi Mumbai",
            bio: "Retired school principal with 20 years in education. I teach all subjects for primary and middle school — Maths, English, Hindi, Science, and Social Studies. Available on weekends too.",
            subjects: ["Mathematics", "English", "Hindi", "Science", "Social Studies"],
            grades: ["Class 1-5", "Class 6-8"],
            locations: ["Thane", "Navi Mumbai", "Mulund"],
            hourlyRate: 400,
            rating: 4.8,
            reviewCount: 55,
            experience: 20,
            teachingModes: ["HOME"],
            offersTrialClass: false,
            lat: 19.2183, lng: 72.9781,
        },
    ];

    const MUMBAI_INSTITUTES = [
        {
            name: "Vidya Mandir Tutorials",
            phone: "9100000010",
            email: "vidya.mandir.demo@tuitionsinindia.com",
            image: "https://api.dicebear.com/9.x/initials/svg?seed=VM&backgroundColor=2563eb&fontFamily=Arial&fontSize=40",
            title: "School Academics | Vidya Mandir | CBSE & SSC | Andheri",
            bio: "Mumbai's trusted neighbourhood coaching centre since 2008. We offer comprehensive tuition for Class 1-10 covering all subjects — Maths, Science, English, Hindi, and Social Studies. Small batches, personal attention, monthly parent meetings.",
            subjects: ["Mathematics", "Science", "English", "Hindi", "Social Studies"],
            grades: ["Class 1-5", "Class 6-8", "Class 9-10"],
            locations: ["Andheri", "Versova", "Mumbai"],
            hourlyRate: 600,
            rating: 4.7,
            reviewCount: 89,
            experience: 16,
            teachingModes: ["HOME"],
            offersTrialClass: true,
            isInstitute: true,
            lat: 19.1197, lng: 72.8464,
        },
        {
            name: "NumberNinja Coaching",
            phone: "9100000011",
            email: "numberninja.demo@tuitionsinindia.com",
            image: "https://api.dicebear.com/9.x/initials/svg?seed=NN&backgroundColor=059669&fontFamily=Arial&fontSize=40",
            title: "Maths Coaching | NumberNinja | Class 5-10 | Dadar",
            bio: "Maths-only coaching centre dedicated to building strong foundations for Class 5 to 10. Our students average 95%+ in board exams. Abacus, Mental Maths, and Vedic Maths also available.",
            subjects: ["Mathematics", "Mental Maths", "Abacus"],
            grades: ["Class 1-5", "Class 6-8", "Class 9-10"],
            locations: ["Dadar", "Matunga", "Parel", "Mumbai"],
            hourlyRate: 500,
            rating: 4.9,
            reviewCount: 134,
            experience: 10,
            teachingModes: ["HOME"],
            offersTrialClass: true,
            isInstitute: true,
            lat: 19.0178, lng: 72.8478,
        },
    ];

    const DEMO_INSTITUTES = [
        {
            name: "Excellence Academy",
            phone: "9100000001",
            email: "excellence.academy.demo@tuitionsinindia.com",
            image: "https://api.dicebear.com/9.x/initials/svg?seed=EA&backgroundColor=2563eb&fontFamily=Arial&fontSize=40",
            title: "JEE & NEET Coaching | Excellence Academy | Since 2005",
            bio: "One of Mumbai's most trusted coaching centres for IIT JEE and NEET. 18+ years, 5,000+ selections, dedicated faculty with IIT/AIIMS background.",
            subjects: ["IIT JEE Mains", "IIT JEE Advanced", "NEET", "Mathematics", "Physics", "Chemistry", "Biology"],
            grades: ["Class 11-12", "Competitive Exams"],
            locations: ["Dadar", "Andheri", "Mumbai"],
            hourlyRate: 1200,
            rating: 4.8,
            reviewCount: 204,
            experience: 18,
            teachingModes: ["HOME"],
            offersTrialClass: false,
            isInstitute: true,
        },
        {
            name: "Bright Minds Institute",
            phone: "9100000002",
            email: "bright.minds.demo@tuitionsinindia.com",
            image: "https://api.dicebear.com/9.x/initials/svg?seed=BM&backgroundColor=059669&fontFamily=Arial&fontSize=40",
            title: "School Academics | Bright Minds Institute | CBSE & ICSE",
            bio: "Comprehensive coaching for CBSE and ICSE students from Class 3 to 10. Small batch sizes, experienced teachers, and monthly progress reports for parents.",
            subjects: ["Mathematics", "Science", "English", "Social Studies", "Hindi"],
            grades: ["Class 1-5", "Class 6-8", "Class 9-10"],
            locations: ["Connaught Place", "Lajpat Nagar", "Delhi"],
            hourlyRate: 800,
            rating: 4.7,
            reviewCount: 118,
            experience: 12,
            teachingModes: ["HOME"],
            offersTrialClass: true,
            isInstitute: true,
        },
        {
            name: "TechLearn Academy",
            phone: "9100000003",
            email: "techlearn.demo@tuitionsinindia.com",
            image: "https://api.dicebear.com/9.x/initials/svg?seed=TL&backgroundColor=7c3aed&fontFamily=Arial&fontSize=40",
            title: "IT & Coding | TechLearn Academy | Online & Offline",
            bio: "Bangalore's leading coding academy. We teach Python, Java, Web Development, and Data Science to students and working professionals. Job-ready curriculum.",
            subjects: ["Python", "Java", "Web Development", "Data Science", "Machine Learning", "Computer Science"],
            grades: ["Class 9-10", "Class 11-12", "Graduate"],
            locations: ["Koramangala", "Indiranagar", "Bangalore"],
            hourlyRate: 1500,
            rating: 4.9,
            reviewCount: 87,
            experience: 8,
            teachingModes: ["HOME", "ONLINE"],
            offersTrialClass: true,
            isInstitute: true,
        },
    ];

    const results = { tutors: 0, institutes: 0, skipped: 0 };

    // Seed Mumbai tutors and institutes (declared above in MUMBAI_TUTORS / MUMBAI_INSTITUTES)
    for (const t of MUMBAI_TUTORS) {
        try {
            const existingUser = await prisma.user.findFirst({
                where: { OR: [{ phone: t.phone }, { email: t.email }] },
                include: { tutorListing: true },
            });
            if (existingUser?.tutorListing) { results.skipped++; continue; }

            const user = existingUser
                ? await prisma.user.update({ where: { id: existingUser.id }, data: { name: t.name, image: t.image, role: "TUTOR", phoneVerified: true, lat: t.lat, lng: t.lng } })
                : await prisma.user.create({ data: { name: t.name, phone: t.phone, email: t.email, image: t.image, role: "TUTOR", phoneVerified: true, isVerified: true, lat: t.lat, lng: t.lng } });

            await prisma.listing.create({
                data: {
                    tutorId: user.id, title: t.title, bio: t.bio, subjects: t.subjects,
                    grades: t.grades, locations: t.locations, hourlyRate: t.hourlyRate,
                    rating: t.rating, reviewCount: t.reviewCount, experience: t.experience,
                    teachingModes: t.teachingModes, offersTrialClass: t.offersTrialClass,
                    isActive: true, isVipEligible: true, isInstitute: false,
                },
            });
            results.tutors++;
        } catch (e) { console.error(`Seed error for ${t.name}:`, e.message); }
    }

    for (const inst of MUMBAI_INSTITUTES) {
        try {
            const existingUser = await prisma.user.findFirst({
                where: { OR: [{ phone: inst.phone }, { email: inst.email }] },
                include: { tutorListing: true },
            });
            if (existingUser?.tutorListing) { results.skipped++; continue; }

            const user = existingUser
                ? await prisma.user.update({ where: { id: existingUser.id }, data: { name: inst.name, image: inst.image, role: "INSTITUTE", phoneVerified: true, lat: inst.lat, lng: inst.lng } })
                : await prisma.user.create({ data: { name: inst.name, phone: inst.phone, email: inst.email, image: inst.image, role: "INSTITUTE", phoneVerified: true, isVerified: true, lat: inst.lat, lng: inst.lng } });

            await prisma.listing.create({
                data: {
                    tutorId: user.id, title: inst.title, bio: inst.bio, subjects: inst.subjects,
                    grades: inst.grades, locations: inst.locations, hourlyRate: inst.hourlyRate,
                    rating: inst.rating, reviewCount: inst.reviewCount, experience: inst.experience,
                    teachingModes: inst.teachingModes, offersTrialClass: inst.offersTrialClass,
                    isActive: true, isInstitute: true,
                },
            });
            results.institutes++;
        } catch (e) { console.error(`Seed error for ${inst.name}:`, e.message); }
    }

    for (const t of DEMO_TUTORS) {
        try {
            const existingUser = await prisma.user.findFirst({
                where: { OR: [{ phone: t.phone }, { email: t.email }] },
                include: { tutorListing: true },
            });
            if (existingUser?.tutorListing) { results.skipped++; continue; }

            const user = existingUser
                ? await prisma.user.update({ where: { id: existingUser.id }, data: { name: t.name, image: t.image, role: "TUTOR", phoneVerified: true } })
                : await prisma.user.create({ data: { name: t.name, phone: t.phone, email: t.email, image: t.image, role: "TUTOR", phoneVerified: true, isVerified: true } });

            await prisma.listing.create({
                data: {
                    tutorId: user.id,
                    title: t.title,
                    bio: t.bio,
                    subjects: t.subjects,
                    grades: t.grades,
                    locations: t.locations,
                    hourlyRate: t.hourlyRate,
                    rating: t.rating,
                    reviewCount: t.reviewCount,
                    experience: t.experience,
                    teachingModes: t.teachingModes,
                    offersTrialClass: t.offersTrialClass,
                    isActive: true,
                    isVipEligible: true,
                    isInstitute: t.isInstitute || false,
                },
            });
            results.tutors++;
        } catch (e) {
            console.error(`Seed error for ${t.name}:`, e.message);
        }
    }

    for (const inst of DEMO_INSTITUTES) {
        try {
            const existingUser = await prisma.user.findFirst({
                where: { OR: [{ phone: inst.phone }, { email: inst.email }] },
                include: { tutorListing: true },
            });
            if (existingUser?.tutorListing) { results.skipped++; continue; }

            const user = existingUser
                ? await prisma.user.update({ where: { id: existingUser.id }, data: { name: inst.name, image: inst.image, role: "INSTITUTE", phoneVerified: true } })
                : await prisma.user.create({ data: { name: inst.name, phone: inst.phone, email: inst.email, image: inst.image, role: "INSTITUTE", phoneVerified: true, isVerified: true } });

            await prisma.listing.create({
                data: {
                    tutorId: user.id,
                    title: inst.title,
                    bio: inst.bio,
                    subjects: inst.subjects,
                    grades: inst.grades,
                    locations: inst.locations,
                    hourlyRate: inst.hourlyRate,
                    rating: inst.rating,
                    reviewCount: inst.reviewCount,
                    experience: inst.experience,
                    teachingModes: inst.teachingModes,
                    offersTrialClass: inst.offersTrialClass,
                    isActive: true,
                    isInstitute: true,
                },
            });
            results.institutes++;
        } catch (e) {
            console.error(`Seed error for ${inst.name}:`, e.message);
        }
    }

    return NextResponse.json({ success: true, ...results });
}
