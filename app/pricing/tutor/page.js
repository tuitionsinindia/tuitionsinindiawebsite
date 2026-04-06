"use client";

import Link from "next/link";
import { 
    Zap, 
    CheckCircle2, 
    ShieldCheck, 
    ArrowRight, 
    Info, 
    Mail,
    Trophy,
    Target,
    Layers,
    Cpu,
    Briefcase,
    Building2,
    Crown
} from "lucide-react";

export default function TutorPricing() {
    return (
        <div className="min-h-screen bg-background-dark font-sans text-on-background-dark antialiased pt-40 pb-32 selection:bg-primary/30">
            {/* Header excluded as it's in RootLayout */}

            {/* Hero Protocol */}
            <section className="py-24 px-6 relative overflow-hidden text-center max-w-7xl mx-auto mb-24">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-primary/5 blur-[120px] rounded-full -z-10"></div>
                
                <div className="inline-flex items-center gap-3 px-4 py-2 bg-primary/10 rounded-full border border-primary/20 mb-10">
                    <Zap size={14} className="text-primary" />
                    <span className="text-primary text-[10px] font-black uppercase tracking-[0.3em]">Economic Mandate</span>
                </div>
                
                <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter leading-[0.9] text-white uppercase mb-12">
                    Your Talent, <br />
                    <span className="text-primary font-serif lowercase tracking-normal not-italic px-4">uncompromised</span> profit.
                </h1>
                
                <p className="max-w-3xl mx-auto text-xl md:text-2xl text-on-background-dark/40 font-medium leading-relaxed italic">
                    We operate on a zero-commission protocol. We provide the architectural layer; you build the academic legacy. Keep 100% of your pedagogical value.
                </p>
            </section>

            {/* Economic Tiers */}
            <section className="px-6 max-w-7xl mx-auto grid md:grid-cols-3 gap-8">

                {/* Aspirant Tier */}
                <div className="bg-surface-dark border border-border-dark p-12 rounded-[4rem] shadow-4xl flex flex-col h-full hover:border-primary/20 transition-all group">
                    <div className="mb-10">
                        <div className="size-12 rounded-2xl bg-background-dark border border-border-dark flex items-center justify-center mb-6 text-on-surface-dark/40 group-hover:text-primary transition-colors">
                            <Briefcase size={24} />
                        </div>
                        <h3 className="text-3xl font-black text-white mb-2 uppercase italic tracking-tight">Aspirant</h3>
                        <p className="text-on-surface-dark/40 text-[10px] font-black uppercase tracking-widest italic tracking-[0.2em]">Tier One Discovery</p>
                    </div>
                    <div className="text-5xl font-black text-white mb-10 tracking-tighter italic">Free</div>
                    <ul className="space-y-6 mb-12 flex-1">
                        {["Verified Faculty (Restricted)", "Direct Student Inquiries", "1 Domain Category", "Ecosystem Access"].map((f, i) => (
                            <li key={i} className="flex items-center gap-4 text-on-surface-dark/60 font-medium text-sm italic">
                                <CheckCircle2 size={18} className="text-primary/40" />
                                {f}
                            </li>
                        ))}
                    </ul>
                    <Link href="/register/tutor" className="w-full py-6 bg-background-dark border border-border-dark text-white font-black rounded-2xl hover:border-primary/50 transition-all text-center uppercase tracking-widest text-[10px] active:scale-95">Initialize</Link>
                </div>

                {/* Expert Tier (Proprietary Choice) */}
                <div className="bg-surface-dark p-12 rounded-[4.5rem] border-4 border-primary shadow-4xl shadow-primary/10 flex flex-col h-full relative group scale-105 z-10 transition-transform active:scale-100">
                    <div className="absolute -top-5 right-12 bg-primary text-white text-[10px] font-black uppercase tracking-[0.3em] px-8 py-3 rounded-2xl shadow-xl">
                        Elite Mandate
                    </div>
                    <div className="mb-10 pt-4">
                        <div className="size-12 rounded-2xl bg-primary flex items-center justify-center mb-6 text-white shadow-lg shadow-primary/20">
                            <Crown size={24} />
                        </div>
                        <h3 className="text-3xl font-black text-white mb-2 uppercase italic tracking-tight">Verified Expert</h3>
                        <p className="text-primary text-[10px] font-black uppercase tracking-widest italic tracking-[0.2em]">Institutional Hub Standard</p>
                    </div>
                    <div className="flex flex-col mb-10">
                        <div className="text-6xl font-black text-white tracking-tighter italic">₹499<span className="text-xl text-on-surface-dark/20 font-medium tracking-normal not-italic px-4"> / mo</span></div>
                        <p className="text-[10px] text-primary font-black uppercase tracking-[0.2em] mt-4">Zero Commission Protocol Locked</p>
                    </div>
                    <ul className="space-y-6 mb-12 flex-1">
                        {[
                            "Elite Verification Credential",
                            "High-Priority Matching Pipeline",
                            "Full AI Matchmaker Integration",
                            "5 Specialized Subject Clusters",
                            "Unrestricted Direct Comms"
                        ].map((f, i) => (
                            <li key={i} className="flex items-center gap-4 text-white font-black text-sm italic uppercase tracking-tight">
                                <ShieldCheck size={20} className="text-primary" />
                                {f}
                            </li>
                        ))}
                    </ul>
                    <Link href="/register/tutor" className="w-full py-6 bg-primary text-white font-black rounded-2xl hover:scale-105 transition-all text-center uppercase tracking-widest text-[10px] shadow-2xl shadow-primary/40 active:scale-95">Deploy Profile</Link>
                </div>

                {/* Hub Tier */}
                <div className="bg-background-dark border border-border-dark p-12 rounded-[4rem] flex flex-col h-full shadow-4xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-12 opacity-5 -z-10 group-hover:scale-110 transition-transform duration-700">
                        <Building2 size={160} className="text-primary" />
                    </div>
                    <div className="mb-10">
                        <div className="size-12 rounded-2xl bg-surface-dark border border-border-dark flex items-center justify-center mb-6 text-on-surface-dark/40 group-hover:text-primary transition-colors">
                            <Building2 size={24} />
                        </div>
                        <h3 className="text-3xl font-black text-white mb-2 uppercase italic tracking-tight">Coaching Hub</h3>
                        <p className="text-on-surface-dark/40 text-[10px] font-black uppercase tracking-widest italic tracking-[0.2em]">Multifaceted Entity</p>
                    </div>
                    <div className="text-5xl font-black text-white mb-10 tracking-tighter italic">₹1,999<span className="text-xl text-on-surface-dark/20 font-medium tracking-normal not-italic px-4"> / mo</span></div>
                    <ul className="space-y-6 mb-12 flex-1">
                        {[
                            "Master Institutional Profile",
                            "Faculty Management (up to 10)",
                            "Bulk Requirement Processing",
                            "Custom Hub Branding Architecture",
                            "Advanced Performance Analytics"
                        ].map((f, i) => (
                            <li key={i} className="flex items-center gap-4 text-on-surface-dark/60 font-medium text-sm italic">
                                <CheckCircle2 size={18} className="text-primary/40" />
                                {f}
                            </li>
                        ))}
                    </ul>
                    <Link href="/register/tutor" className="w-full py-6 bg-surface-dark border border-border-dark text-white font-black rounded-2xl hover:border-primary/50 transition-all text-center uppercase tracking-widest text-[10px] active:scale-95">Deploy Hub</Link>
                </div>

            </section>

            {/* Support Terminal */}
            <section className="py-48 text-center max-w-xl mx-auto px-6">
                <div className="size-16 rounded-[1.5rem] bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mx-auto mb-10">
                    <Info size={28} />
                </div>
                <h2 className="text-3xl font-black text-white italic tracking-tighter mb-6 uppercase">Ambiguities in <span className="text-primary">protocol</span>?</h2>
                <p className="text-on-background-dark/40 font-medium italic mb-12">
                    Our academic strategy counsel is standing by to provide high-fidelity technical and pedagogical guidance.
                </p>
                <Link href="/contact" className="inline-flex items-center gap-3 text-primary font-black uppercase tracking-[0.3em] text-xs group">
                    Initiate Consultation 
                    <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
                </Link>
            </section>
        </div>
    );
}
