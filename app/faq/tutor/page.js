"use client";

import FAQ from "@/app/components/FAQ";
import Link from "next/link";
import { ArrowRight, CircleHelp, Zap, Mail, MessageSquare, Lock } from "lucide-react";

export default function TutorFAQ() {
    const questions = [
        {
            question: "How do I receive student inquiries?",
            answer: "Once your profile is verified, you will receive real-time notifications via your dashboard and registered email when students search for your subjects in your preferred geographic zones."
        },
        {
            question: "Is there a subscription fee for tutors?",
            answer: "Listing your profile is free under the 'Aspirant' tier. To unlock high-priority matching, elite verification, and unrestricted direct communication, you can upgrade to our 'Verified Expert' or 'Coaching Hub' tiers."
        },
        {
            question: "How does the platform handle payments from students?",
            answer: "We offer a zero-commission protocol. You are free to negotiate and collect fees directly from students. We only facilitate the discovery and verification layer; we do not take a cut of your tuition fees."
        },
        {
            question: "What is the Verification Protocol?",
            answer: "To ensure academic integrity, we manually audit government IDs and educational credentials. Profiles with a 'Verified' badge receive 4.5x more engagement compared to unverified profiles."
        },
        {
            question: "Can I manage multiple subject clusters?",
            answer: "Yes. Depending on your tier, you can register multiple subject specializations and geographic zones (Online or Local) to maximize your lead pipeline."
        }
    ];

    return (
        <div className="snap-container bg-white text-gray-900 antialiased selection:bg-blue-200">
            
            {/* Header Section */}
            <section className="snap-section px-6 relative text-center">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-100/30 blur-[120px] rounded-full -z-10 animate-pulse"></div>
                
                <div className="max-w-4xl mx-auto">
                    <div className="inline-flex items-center gap-3 px-4 py-2 bg-blue-50 rounded-full border border-blue-100 mb-8">
                        <Zap size={14} className="text-blue-600" />
                        <span className="text-blue-700 text-[10px] font-black uppercase tracking-[0.3em] font-sans">Faculty Support Protocol</span>
                    </div>
                    
                    <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-10 leading-[0.9] uppercase italic text-gray-900">
                        Faculty <br />
                        <span className="text-blue-600 font-serif lowercase tracking-normal not-italic px-4">Support</span> Terminal.
                    </h1>
                    
                    <p className="text-lg md:text-xl text-gray-500 font-medium max-w-2xl mx-auto mb-12 leading-relaxed italic">
                        Detailed operational guidance for independent educators and institutions. Optimize your profile performance and lead conversion.
                    </p>
                </div>
                
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-20">
                    <div className="w-px h-12 bg-gray-400"></div>
                </div>
            </section>

            {/* FAQ Logic Section */}
            <section className="snap-section px-6 bg-gray-50/50">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-16 flex items-center gap-4">
                        <div className="size-12 rounded-2xl bg-gray-900 text-white flex items-center justify-center font-black">
                            Q/A
                        </div>
                        <div className="h-px flex-1 bg-gray-200"></div>
                    </div>
                    <FAQ items={questions} />
                </div>
            </section>

            {/* Growth CTA */}
            <section className="snap-section px-6">
                <div className="max-w-4xl mx-auto bg-gray-900 rounded-[3.5rem] p-12 md:p-24 text-center relative overflow-hidden shadow-4xl text-white">
                    <div className="absolute -left-20 -top-20 size-96 bg-blue-600/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
                    
                    <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase italic mb-8 leading-tight">
                        Scale your <br />
                        <span className="text-blue-500 font-serif lowercase tracking-normal not-italic px-4">academic</span> legacy.
                    </h2>
                    
                    <p className="text-xl text-gray-400 font-medium mb-12 italic max-w-xl mx-auto leading-relaxed">
                        Join India's most advanced educator network. Our support counsel is available 24/7 for technical and pedagogical strategy.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-6 justify-center">
                        <Link 
                            href="/register/tutor" 
                            className="bg-blue-600 text-white font-black px-12 py-6 rounded-2xl hover:bg-white hover:text-gray-900 active:scale-95 transition-all shadow-2xl shadow-blue-600/20 flex items-center justify-center gap-3 uppercase tracking-widest text-xs"
                        >
                            Initialize Faculty Profile <ArrowRight size={18} />
                        </Link>
                        <button className="bg-transparent border border-white/20 text-white font-black px-12 py-6 rounded-2xl hover:bg-white/5 active:scale-95 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-xs">
                            <Mail size={18} className="text-blue-500" />
                            Strategy Counsel
                        </button>
                    </div>

                    <div className="mt-20 flex items-center justify-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-[0.5em]">
                        <Lock size={12} strokeWidth={3} /> Standard Security Protocols Active
                    </div>
                </div>
            </section>
        </div>
    );
}
