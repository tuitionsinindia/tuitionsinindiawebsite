import prisma from "@/lib/prisma";

export default async function sitemap() {
    // Base URL of the deployed application
    const baseUrl = "https://tuitionsinindia.com";

    // Static core application routes
    const routes = [
        "",
        "/tutors",
        "/pricing/student",
        "/pricing/tutor",
        "/how-it-works/student",
        "/how-it-works/tutor",
        "/login",
        "/post-requirement",
        "/ai-match",
        "/register/tutor"
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
            }
        });

        const tutorRoutes = tutors.map((tutor) => ({
            url: `${baseUrl}/tutor/${tutor.id}`,
            lastModified: tutor.updatedAt || new Date(),
            changeFrequency: 'monthly',
            priority: 0.6,
        }));

        return [...routes, ...tutorRoutes];
    } catch (error) {
        console.error("Sitemap generation error:", error);
        // Fallback to returning just the static routes if DB fails during build
        return routes;
    }
}
