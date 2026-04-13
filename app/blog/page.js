import Link from "next/link";
import prisma from "@/lib/prisma";
import { Calendar, Clock, ArrowRight, BookOpen } from "lucide-react";

export const metadata = {
    title: "Blog — Study Tips, Tutor Guides & Exam Prep | TuitionsInIndia",
    description: "Tips for students, parents, and tutors. Exam preparation guides, study advice, and how to find the right tutor in India.",
};

export const dynamic = "force-dynamic";

export default async function BlogPage() {
    let posts = [];
    try {
        posts = await prisma.blogPost.findMany({
            where: { isPublished: true },
            orderBy: { publishedAt: "desc" },
            take: 20,
        });
    } catch {}


    const categories = [...new Set(posts.map(p => p.category))];

    return (
        <div className="min-h-screen bg-white">
            {/* Hero */}
            <section className="bg-gradient-to-br from-blue-700 via-blue-600 to-blue-800 text-white pt-28 pb-14">
                <div className="max-w-5xl mx-auto px-4 text-center">
                    <div className="inline-flex items-center gap-2 bg-white/20 text-white text-xs font-semibold px-4 py-1.5 rounded-full mb-5">
                        <BookOpen size={14} /> Blog
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold mb-3">
                        Tips for Students, Parents, and Tutors
                    </h1>
                    <p className="text-blue-100 text-sm md:text-base max-w-xl mx-auto">
                        Exam preparation guides, study advice, and tips to grow your tutoring career.
                    </p>
                </div>
            </section>

            <section className="max-w-5xl mx-auto px-4 py-12">
                {/* Category pills */}
                {categories.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-8">
                        {categories.map(cat => (
                            <span key={cat} className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-semibold">
                                {cat}
                            </span>
                        ))}
                    </div>
                )}

                {posts.length === 0 ? (
                    <div className="text-center py-20">
                        <BookOpen size={48} className="text-gray-300 mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Coming Soon</h2>
                        <p className="text-sm text-gray-500">We're working on helpful articles for students, parents, and tutors. Check back soon!</p>
                    </div>
                ) : (
                    <>
                        {/* Featured (first post) */}
                        {posts.length > 0 && (
                            <Link href={`/blog/${posts[0].slug}`} className="group block mb-10">
                                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:border-blue-300 transition-all hover:shadow-md">
                                    <div className="md:flex">
                                        {posts[0].coverImage && (
                                            <div className="md:w-1/2 h-60 md:h-auto">
                                                <img src={posts[0].coverImage} alt={posts[0].title} className="w-full h-full object-cover" />
                                            </div>
                                        )}
                                        <div className={`p-6 md:p-8 flex flex-col justify-center ${posts[0].coverImage ? "md:w-1/2" : ""}`}>
                                            <span className="inline-block bg-blue-50 text-blue-600 text-xs font-semibold px-3 py-1 rounded-lg mb-3 w-fit">
                                                {posts[0].category}
                                            </span>
                                            <h2 className="text-xl md:text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-3 leading-tight">
                                                {posts[0].title}
                                            </h2>
                                            <p className="text-sm text-gray-500 mb-4 line-clamp-3">{posts[0].excerpt}</p>
                                            <div className="flex items-center gap-4 text-xs text-gray-400">
                                                <span className="flex items-center gap-1"><Calendar size={12} /> {posts[0].publishedAt?.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                                                <span className="flex items-center gap-1"><Clock size={12} /> {posts[0].readTime}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        )}

                        {/* Post grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {posts.slice(1).map(post => (
                                <Link key={post.id} href={`/blog/${post.slug}`} className="group">
                                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-blue-300 transition-all hover:shadow-md h-full flex flex-col">
                                        {post.coverImage && (
                                            <div className="h-44 overflow-hidden">
                                                <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                            </div>
                                        )}
                                        <div className="p-5 flex-1 flex flex-col">
                                            <span className="inline-block bg-gray-100 text-gray-600 text-xs font-semibold px-2.5 py-1 rounded-md mb-3 w-fit">
                                                {post.category}
                                            </span>
                                            <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2 leading-snug line-clamp-2">
                                                {post.title}
                                            </h3>
                                            <p className="text-sm text-gray-500 mb-4 line-clamp-2 flex-1">{post.excerpt}</p>
                                            <div className="flex items-center gap-3 text-xs text-gray-400">
                                                <span className="flex items-center gap-1"><Calendar size={12} /> {post.publishedAt?.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                                                <span className="flex items-center gap-1"><Clock size={12} /> {post.readTime}</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </>
                )}

                {/* Newsletter */}
                <div className="mt-14 bg-blue-50 border border-blue-100 rounded-2xl p-8 md:p-10 text-center">
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Get Study Tips and Tutor Recommendations</h2>
                    <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">
                        Weekly tips for students, parents, and tutors delivered to your inbox. No spam.
                    </p>
                    <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                        <input
                            type="email"
                            placeholder="Your email address"
                            className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 outline-none focus:border-blue-500"
                        />
                        <button type="submit" className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 transition-colors">
                            Subscribe
                        </button>
                    </form>
                </div>
            </section>
        </div>
    );
}
