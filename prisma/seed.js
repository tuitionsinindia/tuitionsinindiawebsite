const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    console.log('Start seeding...')

    // Clean up existing data
    await prisma.review.deleteMany()
    await prisma.leadUnlock.deleteMany()
    await prisma.lead.deleteMany()
    await prisma.listing.deleteMany()
    await prisma.user.deleteMany()

    // Create Tutors
    const tutors = [
        {
            name: "Ramesh Sharma",
            email: "ramesh@example.com",
            role: "TUTOR",
            isVerified: true,
            listing: {
                title: "Expert Maths & Physics Tutor",
                bio: "15+ years experience teaching CBSE and ICSE Maths. Ex-HOD at top Mumbai school.",
                subjects: ["Maths", "Physics"],
                locations: ["Mumbai", "Online"],
                hourlyRate: 800,
                rating: 4.9,
                reviewCount: 124,
            }
        },
        {
            name: "Priya Patel",
            email: "priya@example.com",
            role: "TUTOR",
            isVerified: true,
            listing: {
                title: "Chemistry & Biology Specialist",
                bio: "M.Sc Chemistry. Making complex science concepts easy to understand for high school students.",
                subjects: ["Chemistry", "Biology"],
                locations: ["Ahmedabad", "Online"],
                hourlyRate: 600,
                rating: 4.8,
                reviewCount: 89,
            }
        },
        {
            name: "Amit Kumar",
            email: "amit@example.com",
            role: "TUTOR",
            isVerified: false,
            listing: {
                title: "Humanities & English Preparation",
                bio: "Passionate educator focusing on board exam preparation and confident communication skills.",
                subjects: ["English", "History"],
                locations: ["Delhi NCR", "Online"],
                hourlyRate: 500,
                rating: 4.7,
                reviewCount: 56,
            }
        }
    ]

    for (const t of tutors) {
        const user = await prisma.user.create({
            data: {
                name: t.name,
                email: t.email,
                role: t.role,
                isVerified: t.isVerified,
                tutorListing: {
                    create: {
                        title: t.listing.title,
                        bio: t.listing.bio,
                        subjects: t.listing.subjects,
                        locations: t.listing.locations,
                        hourlyRate: t.listing.hourlyRate,
                        rating: t.listing.rating,
                        reviewCount: t.listing.reviewCount,
                    }
                }
            }
        })
        console.log(`Created tutor: ${user.name}`)
    }

    // Create a Student
    const student = await prisma.user.create({
        data: {
            name: "Rahul Gupta",
            email: "rahul@example.com",
            role: "STUDENT",
        }
    })
    console.log(`Created student: ${student.name}`)

    // Create a Lead
    const lead = await prisma.lead.create({
        data: {
            studentId: student.id,
            subject: "Maths",
            location: "Mumbai",
            budget: "₹500-₹800/hr",
            description: "Need help with Class 12 Calculus and Trigonometry for Board Exams.",
            status: "OPEN",
        }
    })
    console.log(`Created lead for: ${lead.subject}`)

    console.log('Seeding finished.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
