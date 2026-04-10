import DirectoryLayout from "@/components/DirectoryLayout";
import { calculateMatchScore } from "@/lib/matchEngine";

export async function generateMetadata({ params }) {
    const { subject, city } = await params;
    const decodedSubject = decodeURIComponent(subject);
    const decodedCity = decodeURIComponent(city);
    const capitalizedSubject = decodedSubject.charAt(0).toUpperCase() + decodedSubject.slice(1);
    const capitalizedCity = decodedCity.charAt(0).toUpperCase() + decodedCity.slice(1);

    return {
        title: `Expert ${capitalizedSubject} Tutors in ${capitalizedCity} | TuitionsInIndia`,
        description: `Browse verified ${decodedSubject} tutors in ${decodedCity}. Get personalized home tuitions with top-rated educators.`,
    };
}

export default async function CitySubjectDirectory({ params }) {
    const { subject, city } = await params;
    const decodedSubject = decodeURIComponent(subject);
    const decodedCity = decodeURIComponent(city);
    const capitalizedSubject = decodedSubject.charAt(0).toUpperCase() + decodedSubject.slice(1);
    const capitalizedCity = decodedCity.charAt(0).toUpperCase() + decodedCity.slice(1);

    const tutorsData = await prisma.listing.findMany({
        where: {
            isActive: true,
            subjects: {
                hasSome: [capitalizedSubject],
            },
            locations: {
                hasSome: [capitalizedCity],
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

    const tutors = tutorsData.map(item => {
        const match = calculateMatchScore({ 
            subjects: [decodedSubject], 
            locations: [decodedCity] 
        }, {
            subjects: item.subjects,
            locations: item.locations,
            isVerified: item.tutor.isVerified,
            grades: item.grades || [],
            timings: item.timings || []
        });

        return {
            id: item.id,
            name: item.tutor.name || "Anonymous Tutor",
            subjects: item.subjects,
            location: item.locations[0] || "Online",
            rating: item.rating,
            reviews: item.reviewCount,
            isVerified: item.tutor.isVerified,
            hourlyRate: `₹${item.hourlyRate}`,
            bio: item.bio,
            matchScore: match.score,
            matchLabel: match.label,
            matchFactors: match.factors
        };
    });

    return <DirectoryLayout tutors={tutors} subject={decodedSubject} location={decodedCity} />;
}
