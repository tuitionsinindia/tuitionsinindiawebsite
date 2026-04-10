// prisma/seed_comprehensive.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const SUBJECTS_BY_CAT = {
    "school_k5": ["English", "Maths", "EVS", "Science", "Hindi"],
    "school_6_10": ["Maths", "Science", "Physics", "Chemistry", "Biology", "English", "Hindi", "Social Studies"],
    "school_11_12_sci": ["Physics", "Chemistry", "Maths", "Biology", "Computer Science", "Psychology"],
    "school_11_12_comm": ["Accountancy", "Economics", "Business Studies", "Maths (Applied)", "Statistics"],
    "school_11_12_hum": ["History", "Geography", "Political Science", "Sociology", "Psychology"],
    "college_uni": ["Engineering Maths", "Programming (C/C++)", "Financial Accounting", "B.Sc Physics"],
    "exam_prep": ["IIT JEE Mains", "IIT JEE Advanced", "NEET", "CLAT", "CAT", "UPSC (GS/CSAT)", "Banking (IBPS/SBI)", "SSC CGL"],
    "study_abroad": ["IELTS", "TOEFL", "GRE", "GMAT", "SAT"],
    "languages": ["Spoken English", "French", "German", "Spanish", "Japanese", "Sanskrit"],
    "it_coding": ["Python", "Java", "Web Development", "Data Science", "Machine Learning", "Digital Marketing"],
    "hobbies_arts": ["Vocal Music (Hindustani)", "Guitar", "Piano", "Drawing", "Classical Dance", "Yoga"]
};

const CITY_COORDS = [
    { name: "Mumbai", lat: 19.0760, lng: 72.8777 },
    { name: "Delhi", lat: 28.6139, lng: 77.2090 },
    { name: "Bangalore", lat: 12.9716, lng: 77.5946 },
    { name: "Kolkata", lat: 22.5726, lng: 88.3639 },
    { name: "Hyderabad", lat: 17.3850, lng: 78.4867 },
    { name: "Chennai", lat: 13.0827, lng: 80.2707 },
    { name: "Pune", lat: 18.5204, lng: 73.8567 },
    { name: "Ahmedabad", lat: 23.0225, lng: 72.5714 },
    { name: "Jaipur", lat: 26.9124, lng: 75.7873 },
    { name: "Lucknow", lat: 26.8467, lng: 80.9462 }
];

const NAMES = [
    "Rajesh Kumar", "Dr. Sarah Ahmed", "Anita Desai", "Michael Fernandes", "Vikram Singh",
    "Priya Sharma", "Amit Patel", "Sneha Rao", "John Doe", "Aisha Khan",
    "Rohan Gupta", "Deepika Padukone", "Suresh Raina", "Meera Nair", "Arjun Kapoor",
    "Kavita Reddy", "Sanjay Dutt", "Nisha Verma", "Vivek Oberoi", "Sunita Williams",
    "Manish Tiwari", "Anjali Menon", "Pradeep Joshi", "Neha Kakkar", "Rahul Dravid",
    "Shreya Ghoshal", "Abhishek Bachchan", "Kriti Sanon", "Varun Dhawan", "Alia Bhatt",
    "Ranbir Kapoor", "Shraddha Kapoor", "Kartik Aaryan", "Sara Ali Khan", "Ishaan Khatter",
    "Janhvi Kapoor", "Ananya Panday", "Tiger Shroff", "Disha Patani", "Sushant Singh Rajput",
    "Irfan Khan", "Rishi Kapoor", "Sridevi", "Amrish Puri", "Manoj Bajpayee",
    "Naseeruddin Shah", "Om Puri", "Paresh Rawal", "Anupam Kher", "Boman Irani"
];

const GRADES = ["Primary (1-5)", "Middle (6-8)", "High School (9-10)", "Higher Secondary (11-12)", "Undergraduate", "Competitive Exams"];

async function main() {
    console.log("🌱 Creating 50+ Comprehensive Dummy Data...");

    // 0. Cleanup
    console.log("🧹 Cleaning up old '@example.com' users...");
    await prisma.user.deleteMany({
        where: { email: { contains: '@example.com' } }
    });

    // 1. Generate Tutors/Students
    for (let i = 0; i < 200; i++) {
        const name = NAMES[i % NAMES.length];
        const email = `test_user_${i}_${Date.now()}@example.com`;
        const city = CITY_COORDS[i % CITY_COORDS.length];
        const tier = i % 10 === 0 ? 'ELITE' : i % 5 === 0 ? 'PRO' : 'FREE';
        
        // Randomize location slightly around city center
        const lat = city.lat + (Math.random() - 0.5) * 0.2;
        const lng = city.lng + (Math.random() - 0.5) * 0.2;

        const catKeys = Object.keys(SUBJECTS_BY_CAT);
        // Ensure even distribution of subjects
        const randomCat = catKeys[i % catKeys.length];
        const subjects = [SUBJECTS_BY_CAT[randomCat][Math.floor(Math.random() * SUBJECTS_BY_CAT[randomCat].length)]];
        const role = i % 2 === 0 ? 'TUTOR' : 'STUDENT';
        
        const user = await prisma.user.create({
            data: {
                name,
                email,
                phone: `${i % 2 === 0 ? '9' : '8'}0000001${i.toString().padStart(2, '0')}`,
                role: role,
                lat,
                lng,
                isVerified: Math.random() > 0.3,
                subscriptionTier: tier,
                ...(role === 'TUTOR' ? {
                    tutorListing: {
                        create: {
                            title: `${name} - ${subjects[0]} Specialist`,
                            bio: `Professional educator with years of experience helping students excel in ${subjects[0]} and related areas.`,
                            subjects,
                            grades: [GRADES[Math.floor(Math.random() * GRADES.length)]],
                            locations: [city.name, "Online"],
                            hourlyRate: 300 + Math.floor(Math.random() * 1500),
                            rating: parseFloat((4.0 + Math.random() * 1.0).toFixed(1)),
                            reviewCount: Math.floor(Math.random() * 50),
                            experience: 2 + Math.floor(Math.random() * 15),
                            boards: ["CBSE", "ICSE", "State Board"],
                            teachingModes: ["Online", "Home Tuition"]
                        }
                    }
                } : {})
            }
        });
    }

    // 2. Ensuring the Demo Student exists
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

    console.log("✅ 50 Dummy Profiles seeded successfully!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
