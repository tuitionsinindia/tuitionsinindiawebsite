"use client";

import Link from "next/link";
import { 
    GraduationCap, 
    BookOpen, 
    CreditCard, 
    LayoutGrid, 
    Rocket, 
    Zap,
    Search,
    UserCheck,
    MessageSquare,
    Star,
    Video
} from "lucide-react";

export default function StudentKB() {
    const categories = [
        {
            title: "Getting Started",
            icon: Rocket,
            topics: ["How to create a profile", "Finding your first tutor", "Using the AI Matchmaker"]
        },
        {
            title: "Learning Tips",
            icon: Zap,
            topics: ["Effective online study habits", "How to prepare for board exams", "Setting learning goals"]
        },
        {
            title: "Payments & Refunds",
            icon: CreditCard,
            topics: ["Understanding pricing bundles", "Managing your credits", "How to request a refund"]
        },
        {
            title: "Platform Features",
            icon: LayoutGrid,
            topics: ["Using the internal chat", "Leaving reviews for tutors", "Tracking your progress"]
        }
    ];

    return (
        <div className="min-h-screen bg-background-dark font-sans text-on-background-dark antialiased pt-40 pb-32 selection:bg-primary/30">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-24 space-y-6">
                    <div className="inline-flex items-center gap-3 px-4 py-2 bg-primary/10 rounded-full border border-primary/20 mb-8">
                        <GraduationCap size={14} className="text-primary" />
                        <span className="text-primary text-xs font-black uppercase tracking-[0.3em]">Student Intelligence Hub</span>
                    </div>
                    <h1 className="text-6xl md:text-8xl font-black text-white italic tracking-tighter leading-none uppercase">
                        Knowledge <br />
                        <span className="text-primary font-serif lowercase tracking-normal not-italic px-4">repository</span>.
                    </h1>
                    <p className="text-on-background-dark/40 font-medium text-xl max-w-2xl mx-auto leading-relaxed italic">
                        In-depth guides and expert advice to help you master your subjects and achieve academic excellence.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-32">
                    {categories.map((cat, idx) => (
                        <div key={idx} className="bg-surface-dark p-10 rounded-[3rem] border border-border-dark shadow-4xl hover:border-primary/30 transition-all group">
                            <div className="size-14 rounded-2xl bg-background-dark border border-border-dark flex items-center justify-center mb-8 text-primary group-hover:scale-110 transition-transform">
                                <cat.icon size={24} />
                            </div>
                            <h2 className="text-xl font-black text-white mb-8 mb-6 uppercase italic tracking-tight">{cat.title}</h2>
                            <ul className="space-y-4">
                                {cat.topics.map((topic, i) => (
                                    <li key={i}>
                                        <Link href="#" className="text-xs font-black uppercase tracking-widest text-on-surface-dark/40 hover:text-primary transition-colors flex items-center gap-3 group/link">
                                            <div className="size-1.5 rounded-full bg-primary/20 group-hover/link:bg-primary transition-colors"></div>
                                            {topic}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Webinar CTA */}
                <div className="p-16 md:p-24 bg-primary rounded-[5rem] text-white text-center shadow-4xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-black/5 opacity-50"></div>
                    <div className="absolute -right-32 -bottom-32 size-[600px] bg-white/10 rounded-full blur-[120px] group-hover:scale-110 transition-transform duration-1000"></div>
                    
                    <div className="relative z-10 space-y-10 max-w-3xl mx-auto">
                        <Video size={48} className="mx-auto mb-8 text-white/50" />
                        <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter leading-none"> Want specialized <span className="text-black font-serif lowercase tracking-normal not-italic px-4">advice?</span></h2>
                        <p className="text-xl text-white/80 font-medium italic leading-relaxed">Join our weekly student webinars to learn from Bharat's top-performing students and legendary educators.</p>
                        <button className="bg-white text-primary font-black px-12 py-5 rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-black/20 uppercase tracking-[0.3em] text-xs">
                            Register for Session
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
