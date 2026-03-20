import prisma from "@/lib/prisma";
import DirectoryLayout from "@/components/DirectoryLayout";

export const dynamic = 'force-dynamic';

export default async function TutorsDirectory({ searchParams }) {
  const { subject, location, minPrice, maxPrice, rating, levels, verified } = await searchParams;

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

  if (minPrice || maxPrice) {
    where.hourlyRate = {};
    if (minPrice) where.hourlyRate.gte = parseInt(minPrice);
    if (maxPrice) where.hourlyRate.lte = parseInt(maxPrice);
  }

  if (rating) {
    where.rating = { gte: parseFloat(rating) };
  }

  if (verified === 'true') {
    where.tutor = { isVerified: true };
  }

  if (levels) {
    // Assuming academic levels are stored or can be inferred. 
    // For now, let's filter by subjects that might contain the level or just listing title.
    // In a real app, we'd have a specific field.
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

  return (
    <DirectoryLayout
      tutors={tutors}
      subject={subject}
      location={location}
      filters={{ minPrice, maxPrice, rating, levels, verified }}
    />
  );
}
