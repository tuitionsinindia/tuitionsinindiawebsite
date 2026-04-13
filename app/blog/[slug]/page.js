import prisma from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Clock, User } from "lucide-react";

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const post = await prisma.blogPost.findUnique({ where: { slug } });
    if (!post) return { title: "Post Not Found" };
    return {
        title: `${post.title} | TuitionsInIndia Blog`,
        description: post.excerpt,
        openGraph: {
            title: post.title,
            description: post.excerpt,
            type: "article",
            publishedTime: post.publishedAt?.toISOString(),
            images: post.coverImage ? [{ url: post.coverImage }] : [],
        },
        twitter: { card: "summary_large_image", title: post.title, description: post.excerpt },
    };
}

export async function generateStaticParams() {
    const posts = await prisma.blogPost.findMany({
        where: { isPublished: true },
        select: { slug: true },
    });
    return posts.map(p => ({ slug: p.slug }));
}

export const revalidate = 3600;

export default async function BlogPostPage({ params }) {
    const { slug } = await params;
    const post = await prisma.blogPost.findUnique({ where: { slug } });

    if (!post || !post.isPublished) notFound();

    // Related posts (same category, excluding current)
    const related = await prisma.blogPost.findMany({
        where: { isPublished: true, category: post.category, id: { not: post.id } },
        orderBy: { publishedAt: "desc" },
        take: 3,
    });

    return (
        <div className="min-h-screen bg-white">
            {/* Header bar */}
            <div className="bg-white border-b border-gray-100">
                <div className="max-w-3xl mx-auto px-4 py-4">
                    <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 transition-colors">
                        <ArrowLeft size={16} /> Back to Blog
                    </Link>
                </div>
            </div>

            <article className="max-w-3xl mx-auto px-4 py-10">
                {/* Category + meta */}
                <span className="inline-block bg-blue-50 text-blue-600 text-xs font-semibold px-3 py-1 rounded-lg mb-4">
                    {post.category}
                </span>

                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight mb-4">
                    {post.title}
                </h1>

                <div className="flex items-center gap-4 text-sm text-gray-400 mb-6">
                    <span className="flex items-center gap-1.5"><User size={14} /> {post.author}</span>
                    <span className="flex items-center gap-1.5"><Calendar size={14} /> {post.publishedAt?.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</span>
                    <span className="flex items-center gap-1.5"><Clock size={14} /> {post.readTime}</span>
                </div>

                {post.coverImage && (
                    <div className="rounded-xl overflow-hidden mb-8">
                        <img src={post.coverImage} alt={post.title} className="w-full h-auto" />
                    </div>
                )}

                {/* Blog content (stored as HTML) */}
                <div
                    className="prose prose-gray max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-600 prose-a:text-blue-600"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />

                {/* CTA */}
                <div className="mt-10 bg-blue-50 border border-blue-100 rounded-xl p-6 text-center">
                    <p className="font-bold text-gray-900 mb-2">Looking for a tutor?</p>
                    <p className="text-sm text-gray-500 mb-4">Find verified tutors near you — free to search, no commission.</p>
                    <Link href="/search" className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors">
                        Find a Tutor
                    </Link>
                </div>
            </article>

            {/* Related posts */}
            {related.length > 0 && (
                <section className="max-w-5xl mx-auto px-4 pb-14">
                    <h2 className="text-lg font-bold text-gray-900 mb-6">Related Articles</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {related.map(r => (
                            <Link key={r.id} href={`/blog/${r.slug}`} className="group">
                                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-blue-300 transition-all h-full flex flex-col">
                                    {r.coverImage && (
                                        <div className="h-36 overflow-hidden">
                                            <img src={r.coverImage} alt={r.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                        </div>
                                    )}
                                    <div className="p-4 flex-1">
                                        <h3 className="font-bold text-gray-900 text-sm group-hover:text-blue-600 transition-colors mb-1 line-clamp-2">{r.title}</h3>
                                        <p className="text-xs text-gray-400">{r.readTime}</p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
