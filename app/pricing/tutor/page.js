"use client";

import Link from "next/link";
import { 
    Zap, 
    CheckCircle2, 
    ShieldCheck, 
    ArrowRight, 
    Info, 
    Briefcase,
    Building2,
    Crown,
    Lock
} from "lucide-react";

export default function TutorPricing() {
    return (
        <div className="snap-container bg-white text-gray-900 antialiased selection:bg-blue-200">
            
            {/* Hero Section */}
            <section className="snap-section px-6 relative text-center">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-100/30 blur-[120px] rounded-full -z-10 animate-pulse"></div>
                
                <div className="max-w-4xl mx-auto">
                    <div className="inline-flex items-center gap-3 px-4 py-2 bg-blue-50 rounded-full border border-blue-100 mb-8">
                        <Zap size={14} className="text-blue-600" />
                        <span className="text-blue-700 text-xs font-black uppercase tracking-[0.3em]">Economic Mandate</span>
                    </div>
                    
                    <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-10 leading-[0.9] uppercase italic text-gray-900">
                        Your Talent, <br />
                        <span className="text-blue-600 font-serif lowercase tracking-normal not-italic px-4">uncompromised</span> profit.
                    </h1>
                    
                    <p className="text-lg md:text-xl text-gray-500 font-medium max-w-2xl mx-auto mb-12 leading-relaxed italic">
                        We operate on a zero-commission protocol. Keep 100% of your pedagogical value. We provide the infrastructure; you build the legacy.
                    </p>
                </div>
                
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-20">
                    <div className="w-px h-12 bg-gray-400"></div>
                </div>
            </section>

            {/* Pricing Tiers Section */}
            <section className="snap-section px-6 py-20 bg-gray-50/50">
                <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8 items-stretch">

                    {/* Aspirant Tier */}
                    <div className="bg-white border border-gray-100 p-10 rounded-[3rem] shadow-sm flex flex-col h-full hover:shadow-2xl transition-all group active:scale-95">
                        <div className="mb-10">
                            <div className="size-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mb-6 text-gray-400 group-hover:text-blue-600 transition-colors">
                                <Briefcase size={24} />
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 mb-2 uppercase italic tracking-tight">Aspirant</h3>
                            <p className="text-gray-400 text-xs font-black uppercase tracking-widest italic tracking-[0.2em]">Tier One Discovery</p>
                        </div>
                        <div className="text-5xl font-black text-gray-900 mb-10 tracking-tighter italic">Free</div>
                        <ul className="space-y-6 mb-12 flex-1">
                            {["Verified Faculty (Restricted)", "Direct Student Inquiries", "1 Domain Category", "Ecosystem Access"].map((f, i) => (
                                <li key={i} className="flex items-center gap-4 text-gray-500 font-medium text-sm italic">
                                    <CheckCircle2 size={18} className="text-blue-600/40" />
                                    {f}
                                </li>
                            ))}
                        </ul>
                        <Link href="/register/tutor" className="w-full py-5 bg-gray-900 text-white font-black rounded-2xl hover:bg-blue-600 transition-all text-center uppercase tracking-widest text-xs">Initialize Profile</Link>
                    </div>

                    {/* Expert Tier */}
                    <div className="bg-white p-10 rounded-[3.5rem] border-4 border-blue-600 shadow-4xl shadow-blue-600/10 flex flex-col h-full relative group scale-105 z-10 transition-transform active:scale-100">
                        <div className="absolute -top-5 right-10 bg-blue-600 text-white text-xs font-black uppercase tracking-[0.3em] px-6 py-3 rounded-2xl shadow-xl animate-bounce">
                            Elite Mandate
                        </div>
                        <div className="mb-10 pt-4">
                            <div className="size-16 rounded-3xl bg-blue-600 flex items-center justify-center mb-6 text-white shadow-lg shadow-blue-600/20">
                                <Crown size={28} />
                            </div>
                            <h3 className="text-3xl font-black text-gray-900 mb-2 uppercase italic tracking-tight">Verified Expert</h3>
                            <p className="text-blue-600 text-xs font-black uppercase tracking-widest italic tracking-[0.2em]">Institutional Hub Standard</p>
                        </div>
                        <div className="flex flex-col mb-10">
                            <div className="text-6xl font-black text-gray-900 tracking-tighter italic">₹499<span className="text-xl text-gray-300 font-medium tracking-normal not-italic px-4"> / mo</span></div>
                            <p className="text-xs text-blue-600 font-black uppercase tracking-[0.2em] mt-4">Zero Commission Protocol Locked</p>
                        </div>
                        <ul className="space-y-6 mb-12 flex-1">
                            {[
                                "Elite Verification Credential",
                                "High-Priority Matching Pipeline",
                                "Full AI Matchmaker Integration",
                                "5 Specialized Subject Clusters",
                                "Unrestricted Direct Comms"
                            ].map((f, i) => (
                                <li key={i} className="flex items-center gap-4 text-gray-900 font-black text-sm italic uppercase tracking-tight">
                                    <ShieldCheck size={20} className="text-blue-600" />
                                    {f}
                                </li>
                            ))}
                        </ul>
                        <Link href="/register/tutor" className="w-full py-6 bg-blue-600 text-white font-black rounded-2xl hover:scale-105 transition-all text-center uppercase tracking-widest text-xs shadow-2xl shadow-blue-600/40">Deploy Profile</Link>
                    </div>

                    {/* Hub Tier */}
                    <div className="bg-white border border-gray-100 p-10 rounded-[3rem] shadow-sm flex flex-col h-full hover:shadow-2xl transition-all group active:scale-95">
                        <div className="mb-10">
                            <div className="size-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mb-6 text-gray-400 group-hover:text-blue-600 transition-colors">
                                <Building2 size={24} />
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 mb-2 uppercase italic tracking-tight">Coaching Hub</h3>
                            <p className="text-gray-400 text-xs font-black uppercase tracking-widest italic tracking-[0.2em]">Multifaceted Entity</p>
                        </div>
                        <div className="text-5xl font-black text-gray-900 mb-10 tracking-tighter italic">₹1,999<span className="text-xl text-gray-300 font-medium tracking-normal not-italic px-4"> / mo</span></div>
                        <ul className="space-y-6 mb-12 flex-1">
                            {[
                                "Master Institutional Profile",
                                "Faculty Management (up to 10)",
                                "Bulk Requirement Processing",
                                "Custom Hub Branding Architecture",
                                "Advanced Performance Analytics"
                            ].map((f, i) => (
                                <li key={i} className="flex items-center gap-4 text-gray-500 font-medium text-sm italic">
                                    <CheckCircle2 size={18} className="text-blue-600/40" />
                                    {f}
                                </li>
                            ))}
                        </ul>
                        <Link href="/register/tutor" className="w-full py-5 bg-gray-900 text-white font-black rounded-2xl hover:bg-blue-600 transition-all text-center uppercase tracking-widest text-xs">Deploy Hub</Link>
                    </div>

                </div>
            </section>

            {/* Support Terminal */}
            <section className="snap-section px-6 text-center max-w-xl mx-auto">
                <div className="size-20 rounded-[1.8rem] bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mx-auto mb-10 shadow-inner">
                    <Info size={32} />
                </div>
                <h2 className="text-3xl font-black text-gray-900 italic tracking-tighter mb-6 uppercase">Ambiguities in <span className="text-blue-600">protocol</span>?</h2>
                <p className="text-gray-500 font-medium italic mb-12 text-lg">
                    Our academic strategy counsel is standing by to provide high-fidelity technical and pedagogical guidance.
                </p>
                <div className="flex flex-col items-center gap-8">
                    <Link href="/contact" className="px-10 py-5 bg-white border-2 border-gray-900 text-gray-900 font-black rounded-2xl hover:bg-gray-900 hover:text-white transition-all uppercase tracking-widest text-xs shadow-xl active:scale-95 flex items-center gap-3 group">
                        Initiate Consultation 
                        <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                    </Link>
                    <div className="flex items-center justify-center gap-2 text-xs font-black text-gray-300 uppercase tracking-[0.5em]">
                        <Lock size={12} strokeWidth={3} /> Standard Security Protocols Active
                    </div>
                </div>
            </section>
        </div>
    );
}
