import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Cache for 1 hour

export default async function sitemap() {
    // Base URL of the deployed application
    const baseUrl = "https://tuitionsinindia.com";

    // Static core application routes
    const routes = [
        "",
        "/search",
        "/categories",
        "/browse",
        "/pricing/student",
        "/pricing/tutor",
        "/pricing/institute",
        "/how-it-works/student",
        "/how-it-works/tutor",
        "/how-it-works/institute",
        "/register",
        "/register/student",
        "/register/tutor",
        "/register/institute",
        "/login",
        "/post-requirement",
        "/ai-match",
        "/faq/student",
        "/faq/tutor",
        "/about",
        "/contact",
        "/legal/terms",
        "/legal/privacy",
        "/legal/cookies",
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: route === "" ? 1.0 : 0.8,
    }));

    try {
        // Fetch all verified tutors to dynamically generate their profile URLs for SEO
        const tutors = await prisma.user.findMany({
            where: {
                role: 'TUTOR',
                isVerified: true
            },
            select: {
                id: true,
                updatedAt: true
            },
            take: 5000 // Limit for safety
        });

        const tutorRoutes = tutors.map((tutor) => ({
            url: `${baseUrl}/search/${tutor.id}`,
            lastModified: tutor.updatedAt || new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        }));

        // Fetch unique subjects and cities for directory SEO
        const listings = await prisma.listing.findMany({
            where: { isActive: true },
            select: { subjects: true, locations: true },
            take: 2000
        });

        // Subject-only pages (/tutors/maths)
        const uniqueSubjects = new Set();
        const citySubjectPairs = new Set();
        listings.forEach(l => {
            (l.subjects || []).forEach(sub => {
                uniqueSubjects.add(sub.toLowerCase());
                (l.locations || []).forEach(city => {
                    citySubjectPairs.add(`${sub.toLowerCase()}/${city.toLowerCase()}`);
                });
            });
        });

        const subjectRoutes = Array.from(uniqueSubjects).map(sub => ({
            url: `${baseUrl}/tutors/${sub}`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        }));

        const directoryRoutes = Array.from(citySubjectPairs).map(pair => ({
            url: `${baseUrl}/tutors/${pair}`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.6,
        }));

        // Blog posts
        const blogPosts = await prisma.blogPost.findMany({
            where: { isPublished: true },
            select: { slug: true, updatedAt: true },
        });
        const blogRoutes = blogPosts.map(post => ({
            url: `${baseUrl}/blog/${post.slug}`,
            lastModified: post.updatedAt || new Date(),
            changeFrequency: 'weekly',
            priority: 0.7,
        }));

        return [...routes, ...tutorRoutes, ...subjectRoutes, ...directoryRoutes, ...blogRoutes];
    } catch (error) {
        console.error("Sitemap generation error:", error);
        // Fallback to returning just the static routes if DB fails during build
        return routes;
    }
}
