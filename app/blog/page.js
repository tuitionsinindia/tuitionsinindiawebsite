import Link from "next/link";
import { ArrowRight, Calendar, User, Newspaper } from "lucide-react";

export default function Blog() {
    const posts = [
        {
            title: "10 Tips for Finding the Perfect Maths Tutor in 2026",
            excerpt: "Finding a tutor who matches your learning style matters. We've analysed thousands of successful matches to identify the most important things to look for when choosing a maths tutor.",
            image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800",
            category: "For Students",
            date: "24 March 2026",
            author: "TuitionsInIndia Team",
            readTime: "8 min read"
        },
        {
            title: "How to Grow from 1 to 50 Students as a Tutor",
            excerpt: "Learn how the most successful tutors on our platform manage their time, market themselves, and build a steady stream of students using our matching platform.",
            image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800",
            category: "For Tutors",
            date: "21 March 2026",
            author: "TuitionsInIndia Team",
            readTime: "12 min read"
        },
        {
            title: "How AI is Changing the Way Students Find Tutors in India",
            excerpt: "Our matching algorithm considers subject, location, grade level, budget, and teaching style to surface the most relevant tutors for each student — here's how it works.",
            image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800",
            category: "Platform News",
            date: "18 March 2026",
            author: "TuitionsInIndia Team",
            readTime: "6 min read"
        }
    ];

    const categoryColors = {
        "For Students": "bg-blue-50 text-blue-700",
        "For Tutors": "bg-emerald-50 text-emerald-700",
        "Platform News": "bg-purple-50 text-purple-700"
    };

    return (
        <div className="min-h-screen bg-white">
            <section className="bg-gray-50 border-b border-gray-100 py-16 px-6">
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">Blog</h1>
                    <p className="text-gray-500 text-lg max-w-2xl">
                        Tips, guides, and updates from the TuitionsInIndia team for students, tutors, and parents.
                    </p>
                </div>
            </section>

            <div className="max-w-6xl mx-auto px-6 py-16 space-y-16">
                {/* Posts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {posts.map((post, idx) => (
                        <div
                            key={idx}
                            className={`bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-md transition-shadow ${
                                idx === 0 ? "lg:col-span-12 lg:flex" : "lg:col-span-6"
                            }`}
                        >
                            <div className={`relative overflow-hidden ${idx === 0 ? "lg:w-2/5 h-64 lg:h-auto" : "h-52"}`}>
                                <img
                                    src={post.image}
                                    alt={post.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute top-4 left-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${categoryColors[post.category] || "bg-gray-50 text-gray-600"}`}>
                                        {post.category}
                                    </span>
                                </div>
                            </div>

                            <div className={`p-6 flex flex-col justify-between ${idx === 0 ? "flex-1" : ""}`}>
                                <div>
                                    <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
                                        <span className="flex items-center gap-1"><Calendar size={12} /> {post.date}</span>
                                        <span>{post.readTime}</span>
                                    </div>
                                    <h2 className={`font-bold text-gray-900 mb-3 leading-snug ${idx === 0 ? "text-2xl md:text-3xl" : "text-xl"}`}>
                                        {post.title}
                                    </h2>
                                    <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">{post.excerpt}</p>
                                </div>

                                <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-100">
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <User size={14} className="text-gray-400" />
                                        {post.author}
                                    </div>
                                    <Link href="#" className="flex items-center gap-1 text-blue-600 text-sm font-medium hover:underline">
                                        Read more <ArrowRight size={14} />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Newsletter */}
                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-10 text-center">
                    <Newspaper size={28} className="text-gray-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Stay updated</h2>
                    <p className="text-gray-500 mb-6 max-w-lg mx-auto">
                        Get monthly tips on finding tutors, exam preparation, and teaching best practices.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                        <input
                            type="email"
                            placeholder="Your email address"
                            className="flex-1 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300"
                        />
                        <button className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors whitespace-nowrap">
                            Subscribe
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
