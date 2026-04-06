import Link from "next/link";
import { ArrowRight, Calendar, User, Tag, ArrowUpRight, Newspaper, Bookmark, Share2 } from "lucide-react";

export default function Blog() {
    const posts = [
        {
            title: "The Architecture of Learning: 10 Tips for Finding the Perfect Math Tutor in 2026",
            excerpt: "Finding a tutor who matches your learning style is a science. At TuitionsInIndia, we've analyzed over 10,000 matches to identify the most important things to look for...",
            image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800",
            category: "Institutional Tips",
            date: "MARCH 24, 2026",
            author: "Dr. Elena Vance",
            readTime: "8 min read"
        },
        {
            title: "Scaling Your Pedagogical Estate: From 1 to 50 Verified Students",
            excerpt: "Learn how the top-earning educators on our platform manage their schedule and grow their institutional brand through our AI-driven matching engine...",
            image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800",
            category: "Expert Growth",
            date: "MARCH 21, 2026",
            author: "Marcus Aurelius",
            readTime: "12 min read"
        },
        {
            title: "The Singularity of Education: The Rise of AI in Personalized Matching",
            excerpt: "How our proprietary AI Matchmakers are revolutionizing the way students across the subcontinent connect with elite educators...",
            image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800",
            category: "Technology",
            date: "MARCH 18, 2026",
            author: "Chief AI Architect",
            readTime: "6 min read"
        }
    ];

    return (
        <div className="min-h-screen bg-background-dark text-on-background-dark font-sans selection:bg-primary/30">
            
            <main className="pt-40 pb-32">
                <div className="max-w-7xl mx-auto px-6">
                    {/* Hero Header */}
                    <div className="max-w-3xl mb-24">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="size-2 bg-primary rounded-full"></div>
                            <span className="text-primary font-black uppercase tracking-[0.3em] text-[10px]">Academic Intelligence Agency</span>
                        </div>
                        <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none mb-8">
                            Academic <br/>
                            <span className="text-primary italic font-serif lowercase tracking-normal">Insights</span>.
                        </h1>
                        <p className="text-on-background-dark/60 text-xl font-medium leading-relaxed max-w-2xl">
                            The official repository of institutional research, educator strategies, and student success frameworks from the TuitionsInIndia community.
                        </p>
                    </div>

                    {/* Featured Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-32">
                        {posts.map((post, idx) => (
                            <div 
                                key={idx} 
                                className={`group relative bg-surface-dark rounded-[3.5rem] border border-border-dark overflow-hidden flex flex-col transition-all hover:border-primary/40 hover:translate-y-[-4px] ${
                                    idx === 0 ? "lg:col-span-12 lg:flex-row" : "lg:col-span-6"
                                } shadow-2xl`}
                            >
                                <div className={`relative overflow-hidden ${idx === 0 ? "lg:w-1/2 h-80 lg:h-auto" : "h-72"}`}>
                                    <img 
                                        src={post.image} 
                                        alt={post.title} 
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-90" 
                                    />
                                    <div className="absolute top-8 left-8">
                                        <div className="px-5 py-2 bg-primary text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">
                                            {post.category}
                                        </div>
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-transparent opacity-60"></div>
                                </div>
                                
                                <div className={`p-12 flex-1 flex flex-col justify-between ${idx === 0 ? "lg:p-16" : ""}`}>
                                    <div>
                                        <div className="flex items-center gap-4 text-on-surface-dark/40 text-[10px] font-black uppercase tracking-widest mb-8">
                                            <div className="flex items-center gap-1.5">
                                                <Calendar size={12} className="text-primary" />
                                                <span>{post.date}</span>
                                            </div>
                                            <div className="size-1 bg-border-dark rounded-full"></div>
                                            <div className="flex items-center gap-1.5">
                                                <Bookmark size={12} className="text-primary" />
                                                <span>{post.readTime}</span>
                                            </div>
                                        </div>
                                        <h2 className={`font-black text-white group-hover:text-primary transition-colors leading-tight tracking-tighter mb-8 ${
                                            idx === 0 ? "text-3xl md:text-5xl" : "text-2xl"
                                        }`}>
                                            {post.title}
                                        </h2>
                                        <p className="text-on-surface-dark/60 font-medium text-lg leading-relaxed mb-10 line-clamp-3">
                                            {post.excerpt}
                                        </p>
                                    </div>
                                    
                                    <div className="flex items-center justify-between pt-8 border-t border-border-dark">
                                        <div className="flex items-center gap-3">
                                            <div className="size-10 rounded-xl bg-background-dark border border-border-dark flex items-center justify-center text-primary font-black italic">
                                                {post.author.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-white font-black text-xs tracking-tight">{post.author}</p>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-primary">Senior Scholar</p>
                                            </div>
                                        </div>
                                        <Link href="#" className="p-4 bg-background-dark border border-border-dark rounded-2xl text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-lg active:scale-95">
                                            <ArrowUpRight size={20} strokeWidth={3} />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Newsletter / Subscription Hub */}
                    <div className="bg-primary/5 border border-primary/20 rounded-[4rem] p-12 md:p-20 relative overflow-hidden text-center mb-20">
                        <div className="absolute top-0 left-0 size-64 bg-primary/10 blur-3xl -z-10 animate-pulse"></div>
                        <div className="relative z-10 max-w-2xl mx-auto">
                            <Newspaper size={48} className="text-primary mx-auto mb-8 opacity-40" />
                            <h2 className="text-3xl md:text-5xl font-black text-white italic tracking-tighter mb-6">
                                Join the <span className="underline decoration-primary decoration-4 underline-offset-4">Academic Registry</span>.
                            </h2>
                            <p className="text-on-background-dark/60 font-medium text-lg mb-12">
                                Receive monthly intelligence reports on the Indian tutoring market, pedagogical optimization, and AI match frameworks.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <input 
                                    type="email" 
                                    placeholder="Institutional email address" 
                                    className="flex-1 bg-surface-dark border border-border-dark rounded-2xl px-8 py-5 text-white font-black text-sm focus:border-primary outline-none transition-all placeholder:text-on-surface-dark/20"
                                />
                                <button className="bg-primary text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20">
                                    Subscribe Now
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
