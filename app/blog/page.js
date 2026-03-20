import Link from "next/link";

export default function Blog() {
    const posts = [
        {
            title: "10 Tips for Finding the Perfect Math Tutor in 2026",
            excerpt: "Finding a tutor who matches your learning style is a science. Here are the 10 most important things to look for...",
            image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800",
            category: "Student Tips",
            date: "March 5, 2026"
        },
        {
            title: "Scaling Your Tutoring Business: From 1 to 50 Students",
            excerpt: "Learn how the top-earning tutors on our platform manage their schedule and grow their teaching brand...",
            image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800",
            category: "Tutor Growth",
            date: "March 2, 2026"
        },
        {
            title: "The Rise of AI in Personalized Learning",
            excerpt: "How AI Matchmakers are revolutionizing the way students across India connect with educators...",
            image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800",
            category: "Technology",
            date: "Feb 28, 2026"
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50 pt-32 pb-20 px-4 md:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">Academic Insights</h1>
                    <p className="text-slate-500 font-medium text-lg max-w-2xl mx-auto">
                        Latest news, tutorials, and success stories from the TuitionsInIndia community.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-20">
                    {posts.map((post, idx) => (
                        <div key={idx} className="bg-white rounded-[2rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl transition-all group flex flex-col">
                            <div className="h-56 relative overflow-hidden">
                                <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                <div className="absolute top-4 left-4 px-4 py-1.5 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-bold text-primary uppercase tracking-widest leading-none">
                                    {post.category}
                                </div>
                            </div>
                            <div className="p-8 flex-1 flex flex-col">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">{post.date}</p>
                                <h2 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-primary transition-colors leading-tight">{post.title}</h2>
                                <p className="text-slate-500 text-sm font-medium mb-8 flex-1">{post.excerpt}</p>
                                <Link href="#" className="font-bold text-primary text-sm flex items-center gap-2 group/link">
                                    Read Article <span className="material-symbols-outlined text-sm group-hover/link:translate-x-1 transition-transform">arrow_forward</span>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-center">
                    <button className="bg-white text-slate-900 border border-slate-200 font-bold px-10 py-4 rounded-2xl hover:bg-slate-50 transition-all">
                        Load More Articles
                    </button>
                </div>
            </div>
        </div>
    );
}
