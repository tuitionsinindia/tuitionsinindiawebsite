import prisma from "@/lib/prisma";
import DirectoryLayout from "@/components/DirectoryLayout";

export async function generateMetadata({ params }) {
    const { subject } = await params;
    const decodedSubject = decodeURIComponent(subject);
    const capitalizedSubject = decodedSubject.charAt(0).toUpperCase() + decodedSubject.slice(1);

    return {
        title: `Best ${capitalizedSubject} Tutors in India | TuitionsInIndia`,
        description: `Find top verified ${decodedSubject} tutors and home tuitions across India. Browse profiles, reviews, and rates.`,
    };
}

export default async function SubjectDirectory({ params }) {
    const { subject } = await params;
    const decodedSubject = decodeURIComponent(subject);
    const capitalizedSubject = decodedSubject.charAt(0).toUpperCase() + decodedSubject.slice(1);

    const tutorsData = await prisma.listing.findMany({
        where: {
            isActive: true,
            subjects: {
                hasSome: [capitalizedSubject],
            }
        },
        include: {
            tutor: {
                select: {
                    name: true,
                    isVerified: true,
                },
            },
        },
        orderBy: {
            rating: 'desc',
        },
    });

    const tutors = tutorsData.map(item => ({
        id: item.id,
        name: item.tutor.name || "Anonymous Tutor",
        subjects: item.subjects,
        location: item.locations[0] || "Online",
        rating: item.rating,
        reviews: item.reviewCount,
        isVerified: item.tutor.isVerified,
        hourlyRate: `₹${item.hourlyRate}`,
        bio: item.bio,
    }));

    return <DirectoryLayout tutors={tutors} subject={decodedSubject} />;
}
