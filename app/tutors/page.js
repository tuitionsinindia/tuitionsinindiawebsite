import prisma from "@/lib/prisma";
import DirectoryLayout from "@/components/DirectoryLayout";

export const dynamic = 'force-dynamic';

export default async function TutorsDirectory({ searchParams }) {
  const { subject, location } = await searchParams;

  const where = {
    isActive: true,
  };

  if (subject) {
    where.subjects = {
      hasSome: [subject.charAt(0).toUpperCase() + subject.slice(1)],
    };
  }

  if (location) {
    where.locations = {
      hasSome: [location.charAt(0).toUpperCase() + location.slice(1)],
    };
  }

  const tutorsData = await prisma.listing.findMany({
    where,
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

  return <DirectoryLayout tutors={tutors} subject={subject} location={location} />;
}
