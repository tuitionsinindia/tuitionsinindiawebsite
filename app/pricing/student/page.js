"use client";

import Link from "next/link";
import { 
    Zap, 
    CheckCircle2, 
    ShieldCheck, 
    ArrowRight, 
    Info, 
    Clock, 
    Sparkles, 
    CircleUser 
} from "lucide-react";

export default function StudentPricing() {
    return (
        <div className="min-h-screen bg-background-dark font-sans text-on-background-dark antialiased pt-40 pb-32 selection:bg-primary/30">
            {/* Redundant Header/Footer removed (in RootLayout) */}

            {/* Hero Section */}
            <section className="py-24 px-6 relative overflow-hidden text-center max-w-7xl mx-auto mb-24">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-primary/5 blur-[120px] rounded-full -z-10"></div>
                
                <div className="inline-flex items-center gap-3 px-4 py-2 bg-primary/10 rounded-full border border-primary/20 mb-10">
                    <Zap size={14} className="text-primary" />
                    <span className="text-primary text-xs font-black uppercase tracking-[0.3em]">Investment in Potential</span>
                </div>
                
                <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter leading-[0.9] text-white uppercase mb-12">
                    Transparent <br />
                    <span className="text-primary font-serif lowercase tracking-normal not-italic px-4">academic</span> value.
                </h1>
                
                <p className="max-w-3xl mx-auto text-xl md:text-2xl text-on-background-dark/40 font-medium leading-relaxed italic">
                    No hidden gatekeeping. No predatory contracts. Pay for the expertise you consume, at the pace your ambition dictates.
                </p>
            </section>

            {/* Pricing Plans */}
            <section className="px-6 max-w-7xl mx-auto grid md:grid-cols-2 gap-12">
                
                {/* Pay Per Hour */}
                <div className="bg-surface-dark p-12 md:p-20 rounded-[4rem] border border-border-dark shadow-4xl flex flex-col items-center text-center hover:border-primary/20 transition-all group overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-full h-2 bg-background-dark"></div>
                    <div className="size-20 rounded-[2rem] bg-background-dark border border-border-dark flex items-center justify-center text-on-surface-dark/40 group-hover:text-primary transition-all mb-12 shadow-2xl">
                        <Clock size={40} />
                    </div>
                    <h3 className="text-4xl font-black text-white mb-6 uppercase italic tracking-tight">Pay Per Hour</h3>
                    <p className="text-on-background-dark/40 font-medium mb-16 italic text-lg leading-relaxed max-w-sm">
                        Surgical support for specific doubts, exam sprints, or high-fidelity concept mastery.
                    </p>

                    <div className="mb-16">
                        <p className="text-xs font-black text-primary uppercase tracking-[0.3em] mb-4">Indicative Rate</p>
                        <div className="text-7xl font-black text-white italic tracking-tighter">₹299<span className="text-xl text-on-surface-dark/20 font-medium not-italic px-4"> / hr</span></div>
                    </div>

                    <ul className="space-y-6 mb-20 text-left w-full max-w-xs mx-auto">
                        {[
                            "Absolute scheduling flexibility",
                            "Zero upfront commitment",
                            "Elite expert directory access",
                            "30-min diagnostic trials",
                            "Instant session termination"
                        ].map((feature, i) => (
                            <li key={i} className="flex items-center gap-4 text-on-surface-dark font-black text-xs uppercase tracking-tight italic">
                                <div className="size-2 rounded-full bg-primary/20"></div>
                                {feature}
                            </li>
                        ))}
                    </ul>

                    <Link href="/search" className="w-full py-6 bg-background-dark border border-border-dark text-white font-black rounded-2xl hover:border-primary/50 transition-all uppercase tracking-widest text-xs active:scale-95 shadow-xl">
                        Browse Tutors
                    </Link>
                </div>

                {/* Structured Bundles */}
                <div className="bg-surface-dark p-12 md:p-20 rounded-[4.5rem] border-4 border-primary shadow-4xl shadow-primary/10 flex flex-col items-center text-center relative group scale-105 z-10 transition-transform active:scale-100">
                    <div className="absolute -top-5 right-16 bg-primary text-white text-xs font-black uppercase tracking-[0.3em] px-10 py-3 rounded-2xl shadow-xl">
                        Institutional Valued
                    </div>
                    <div className="size-20 rounded-[2rem] bg-primary flex items-center justify-center text-white mb-12 shadow-2xl shadow-primary/20 group-hover:rotate-12 transition-transform">
                        <Sparkles size={40} />
                    </div>
                    <h3 className="text-4xl font-black text-white mb-6 uppercase italic tracking-tighter">Academic Bundles</h3>
                    <p className="text-on-background-dark/40 font-medium mb-16 italic text-lg leading-relaxed max-w-sm">
                        Consistent learning progress through dedicated mentorship and academic coaching.
                    </p>

                    <div className="mb-16">
                        <p className="text-xs font-black text-primary uppercase tracking-[0.3em] mb-4">Why Students Love Us</p>
                        <div className="text-8xl font-black text-primary italic tracking-tighter">20%<span className="text-2xl text-white font-black not-italic px-4">OFF</span></div>
                    </div>

                    <ul className="space-y-6 mb-20 text-left w-full max-w-xs mx-auto">
                        {[
                            "Priority Matching Pipeline",
                            "Dedicated Success Strategy",
                            "Curated Learning Roadmap",
                            "Quarterly Insight Reports",
                            "Preferred Pricing Clusters"
                        ].map((feature, i) => (
                            <li key={i} className="flex items-center gap-4 text-white font-black text-sm italic uppercase tracking-tight">
                                <ShieldCheck size={20} className="text-primary" />
                                {feature}
                            </li>
                        ))}
                    </ul>

                    <Link href="/ai-match" className="w-full py-7 bg-primary text-white font-black rounded-2xl hover:scale-105 transition-all uppercase tracking-widest text-xs shadow-2xl shadow-primary/40 active:scale-95">
                        Inquire Strategy
                    </Link>
                </div>
            </section>

            {/* Our Promise */}
            <section className="py-48 px-6 max-w-7xl mx-auto">
                <div className="text-center p-16 md:p-32 rounded-[5rem] border border-border-dark bg-surface-dark/40 relative overflow-hidden group shadow-4xl">
                    <div className="absolute inset-0 bg-primary/5 blur-3xl -z-10 group-hover:scale-125 transition-transform duration-1000"></div>
                    <ShieldCheck size={64} className="text-primary mx-auto mb-12 group-hover:scale-110 transition-transform" />
                    <h2 className="text-4xl md:text-6xl font-black mb-10 uppercase italic tracking-tighter text-white">The <span className="text-primary font-serif lowercase tracking-normal not-italic px-4">unconditional</span> trust.</h2>
                    <p className="text-xl md:text-2xl text-on-background-dark/40 font-medium leading-relaxed italic max-w-3xl mx-auto">
                        Our benchmark for excellence is your satisfaction. If your initial session does not meet your expectations, we provide a new match at zero cost.
                    </p>
                </div>
            </section>

            {/* Counselor CTA */}
            <section className="py-24 text-center max-w-xl mx-auto px-6">
                <p className="text-xs font-black uppercase tracking-[0.4em] text-on-background-dark/20 mb-8 px-4">Need Guidance?</p>
                <Link href="/contact" className="text-3xl font-black text-white italic uppercase group">
                    Speak with an <span className="text-primary underline decoration-primary/20 decoration-4 underline-offset-8 group-hover:decoration-primary transition-all">Academic Counselor</span>
                    <ArrowRight size={24} className="inline-block ml-4 text-primary group-hover:translate-x-3 transition-transform" />
                </Link>
            </section>
        </div>
    );
}
