"use client";

import Link from 'next/link';
import { 
    Zap, 
    Users, 
    Globe, 
    ShieldCheck, 
    ArrowUpRight, 
    Trophy,
    Target,
    Layers,
    Cpu,
    CheckCircle2
} from 'lucide-react';

export default function AboutPage() {
    const stats = [
        { label: "Tutors Listed", value: "10K+", icon: Users, color: "text-primary" },
        { label: "Matches Architected", value: "50K+", icon: Zap, color: "text-amber-400" },
        { label: "Intelligence Hubs", value: "543+", icon: Globe, color: "text-emerald-400" },
        { label: "Trust Index", value: "4.9/5", icon: ShieldCheck, color: "text-purple-400" }
    ];

    const values = [
        { 
            title: "Verified Tutors", 
            desc: "Every educator on our platform undergoes a high-fidelity verification sequence to ensure they meet our 'Digital Ivory Tower' standards.", 
            icon: Target 
        },
        { 
            title: "Economic Efficiency", 
            desc: "Our zero-commission model ensures 100% of the economic value flows directly from students to educators, maximizing positive impact.", 
            icon: Layers 
        },
        { 
            title: "Neural Matching", 
            desc: "Our proprietary AI Matchmaker analyzes millions of academic data points to ensure the perfect alignment between student needs and faculty expertise.", 
            icon: Cpu 
        }
    ];

    return (
        <div className="bg-background-dark min-h-screen font-sans text-on-background-dark antialiased pt-40 pb-32 selection:bg-primary/30">
            {/* Header/Footer are handled in layout.js */}
            
            <main className="max-w-7xl mx-auto px-6 space-y-48">
                
                {/* Our Story */}
                <section className="relative text-center max-w-4xl mx-auto space-y-12">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-primary/5 blur-[120px] rounded-full -z-10"></div>
                    
                    <div className="inline-flex items-center gap-3 px-4 py-2 bg-primary/10 rounded-full border border-primary/20 mb-8">
                        <Zap size={14} className="text-primary" />
                        <span className="text-primary text-xs font-black uppercase tracking-[0.3em]">Institutional DNA</span>
                    </div>

                    <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter leading-none text-white uppercase">
                        The Standard of <br />
                        <span className="text-primary font-serif lowercase tracking-normal not-italic px-4">academic</span> excellence.
                    </h1>

                    <p className="text-xl md:text-2xl text-on-background-dark/40 font-medium leading-relaxed italic max-w-3xl mx-auto">
                        TuitionsInIndia is a premium academic matchmaking engine connecting the next generation of leaders with world-class, verified educators. We architect learning matches with institutional-grade precision.
                    </p>
                </section>

                {/* Stats Grid */}
                <section className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {stats.map((stat, i) => (
                        <div key={i} className="bg-surface-dark border border-border-dark p-10 rounded-[3rem] shadow-4xl group hover:border-primary/30 transition-all">
                            <div className={`size-12 rounded-2xl bg-background-dark border border-border-dark flex items-center justify-center mb-8 ${stat.color} group-hover:scale-110 transition-transform`}>
                                <stat.icon size={24} />
                            </div>
                            <p className="text-5xl font-black text-white mb-2 tracking-tighter italic">{stat.value}</p>
                            <p className="text-xs font-black text-on-surface-dark/40 uppercase tracking-[0.2em]">{stat.label}</p>
                        </div>
                    ))}
                </section>

                {/* Vision Segment */}
                <section className="grid lg:grid-cols-2 gap-24 items-center">
                    <div className="space-y-12">
                        <div className="space-y-8">
                            <h2 className="text-5xl md:text-6xl font-black uppercase italic tracking-tighter leading-none text-white">
                                Our <span className="text-primary font-serif lowercase tracking-normal not-italic">vision</span> <br />
                                unrestricted.
                            </h2>
                            <p className="text-lg text-on-background-dark/40 leading-relaxed font-medium italic max-w-xl">
                                Traditional education is bound by geography. We believe learning should be bound only by curiosity. By building a direct, high-trust ecosystem, we empower educators to scale their impact and students to transcend their environment.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-6">
                            <Link href="/register/tutor" className="px-10 py-5 bg-primary text-white rounded-2xl font-black text-xs tracking-[0.3em] uppercase shadow-2xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                                Browse Tutors
                            </Link>
                            <Link href="/search" className="px-10 py-5 bg-surface-dark text-white rounded-2xl font-black text-xs tracking-[0.3em] uppercase border border-border-dark hover:border-primary/50 active:scale-95 transition-all">
                                Discover Experts
                            </Link>
                        </div>
                    </div>
                    <div className="relative group p-4">
                        <div className="absolute inset-0 bg-primary/10 blur-[100px] rounded-full group-hover:scale-110 transition-transform"></div>
                        <div className="bg-surface-dark p-4 rounded-[4.5rem] border border-border-dark shadow-4xl relative overflow-hidden">
                            <img 
                                src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
                                alt="Foundational Excellence"
                                className="w-full h-full object-cover rounded-[4rem] opacity-60 group-hover:scale-105 transition-transform duration-1000 grayscale group-hover:grayscale-0"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-transparent"></div>
                            <div className="absolute bottom-12 left-12 right-12 p-8 bg-surface-dark/80 backdrop-blur-xl rounded-3xl border border-border-dark flex items-center justify-between">
                                <div>
                                    <p className="text-white font-black uppercase text-lg italic tracking-tight">Verified Elite</p>
                                    <p className="text-primary text-xs font-black uppercase tracking-widest">Global Standards</p>
                                </div>
                                <div className="size-12 rounded-full bg-primary text-white flex items-center justify-center font-black italic shadow-lg shadow-primary/20">
                                    99%
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Our Values */}
                <section className="space-y-24">
                    <div className="text-center">
                        <h2 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter text-white">Core <span className="text-primary font-serif lowercase tracking-normal not-italic">principles</span></h2>
                        <p className="text-on-background-dark/40 font-medium italic mt-4">The architectural pillars of our ecosystem.</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {values.map((val, i) => (
                            <div key={i} className="bg-surface-dark p-16 rounded-[4rem] border border-border-dark shadow-4xl hover:border-primary/30 transition-all group">
                                <div className="size-16 rounded-2xl bg-background-dark border border-border-dark flex items-center justify-center mb-10 text-primary group-hover:scale-110 transition-transform">
                                    <val.icon size={28} />
                                </div>
                                <h3 className="text-2xl font-black text-white mb-6 uppercase italic tracking-tight">{val.title}</h3>
                                <p className="text-on-surface-dark/60 leading-relaxed font-medium italic opacity-80">{val.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Terminal CTA */}
                <section className="p-16 md:p-32 bg-primary rounded-[5rem] text-center text-white relative overflow-hidden shadow-4xl group">
                    <div className="absolute -right-20 -bottom-20 size-96 bg-white/10 rounded-full blur-[100px] group-hover:scale-125 transition-transform duration-1000"></div>
                    <div className="absolute -left-20 -top-20 size-96 bg-black/10 rounded-full blur-[100px] group-hover:scale-125 transition-transform duration-1000"></div>
                    
                    <div className="relative z-10 max-w-3xl mx-auto space-y-12">
                        <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none italic"> Ready for <span className="text-black font-serif lowercase tracking-normal not-italic px-2">impact?</span></h2>
                        <p className="text-xl md:text-2xl text-white/80 font-medium italic leading-relaxed">Join the most elite academic network in Bharat and synchronize your learning trajectory with the future.</p>
                        <div className="flex flex-wrap justify-center gap-6 pt-8">
                            <Link href="/search" className="bg-white text-primary px-16 py-6 rounded-2xl font-black uppercase text-xs tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-white/10">
                                View Pricing
                            </Link>
                            <Link href="/pricing/student" className="bg-transparent border border-white/30 text-white px-16 py-6 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-white/10 active:scale-95 transition-all">
                                Transparent Pricing
                            </Link>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
