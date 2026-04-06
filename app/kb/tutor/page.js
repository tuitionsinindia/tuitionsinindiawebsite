"use client";

import Link from "next/link";
import { 
    Users, 
    BarChart3, 
    Briefcase, 
    TrendingUp, 
    ShieldCheck, 
    Zap,
    Search,
    UserCheck,
    MessageSquare,
    PlayCircle,
    UserPlus,
    LayoutDashboard
} from "lucide-react";

export default function TutorKB() {
    const categories = [
        {
            title: "Tutor Onboarding",
            icon: UserPlus,
            topics: ["Setting up your expert profile", "Identity verification process", "Adding your academic credentials"]
        },
        {
            title: "Lead Management",
            icon: BarChart3,
            topics: ["How to unlock student leads", "Optimizing your response time", "Qualifying student requirements"]
        },
        {
            title: "Teaching Business",
            icon: Briefcase,
            topics: ["Setting competitive hourly rates", "Managing your schedule", "Professional communication ethics"]
        },
        {
            title: "Platform Growth",
            icon: TrendingUp,
            topics: ["How to get more profile views", "Understanding your analytics", "Collecting student reviews"]
        }
    ];

    return (
        <div className="min-h-screen bg-background-dark font-sans text-on-background-dark antialiased pt-40 pb-32 selection:bg-primary/30">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-24 space-y-6">
                    <div className="inline-flex items-center gap-3 px-4 py-2 bg-primary/10 rounded-full border border-primary/20 mb-8">
                        <Briefcase size={14} className="text-primary" />
                        <span className="text-primary text-[10px] font-black uppercase tracking-[0.3em]">Educator Success Matrix</span>
                    </div>
                    <h1 className="text-6xl md:text-8xl font-black text-white italic tracking-tighter leading-none uppercase">
                        Expert <br />
                        <span className="text-primary font-serif lowercase tracking-normal not-italic px-4">guidance</span>.
                    </h1>
                    <p className="text-on-background-dark/40 font-medium text-xl max-w-2xl mx-auto leading-relaxed italic">
                        Actionable insights and professional training to help you build a successful and sustainable tutoring brand.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-32">
                    {categories.map((cat, idx) => (
                        <div key={idx} className="bg-surface-dark p-10 rounded-[3rem] border border-border-dark shadow-4xl hover:border-primary/30 transition-all group">
                            <div className="size-14 rounded-2xl bg-background-dark border border-border-dark flex items-center justify-center mb-8 text-primary group-hover:scale-110 transition-transform">
                                <cat.icon size={24} />
                            </div>
                            <h2 className="text-xl font-black text-white mb-6 uppercase italic tracking-tight">{cat.title}</h2>
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

                {/* Masterclass CTA */}
                <div className="p-16 md:p-24 bg-surface-dark border-4 border-primary rounded-[5rem] text-white text-center shadow-4xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-primary/5 opacity-50"></div>
                    <div className="absolute -right-32 -bottom-32 size-[600px] bg-primary/10 rounded-full blur-[120px] group-hover:scale-110 transition-transform duration-1000"></div>
                    
                    <div className="relative z-10 space-y-10 max-w-3xl mx-auto">
                        <PlayCircle size={48} className="mx-auto mb-8 text-primary" />
                        <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter leading-none"> Ready to double your <span className="text-primary font-serif lowercase tracking-normal not-italic px-4">leads?</span></h2>
                        <p className="text-xl text-on-background-dark/40 font-medium italic leading-relaxed">Our exclusive tutor masterclass reveals the secrets to profile architecture and student conversion protocols.</p>
                        <button className="bg-primary text-white font-black px-12 py-5 rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20 uppercase tracking-[0.3em] text-[10px]">
                            Watch Masterclass
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
