"use client";

import FAQ from "@/app/components/FAQ";
import Link from "next/link";
import { ArrowRight, CircleHelp, ShieldCheck, Mail, MessageSquare, Lock } from "lucide-react";

export default function StudentFAQ() {
    const questions = [
        {
            question: "How do I find the right tutor for my needs?",
            answer: "You can use our 'Expert Search' to filter by subject, location, and institutional metrics. Alternatively, deploy our AI Matchmaker for an automated, high-precision recommendation based on your pedagogical requirements."
        },
        {
            question: "Is the first trial session really free?",
            answer: "The majority of our verified institutional specialists offer a 30-minute diagnostic session at zero cost. Look for the 'Verified Trial' badge on the educator's profile for confirmation."
        },
        {
            question: "How are financial transactions handled?",
            answer: "We utilize a secure credit-based ecosystem and direct payment protocols through Razorpay. All transactions are encrypted and support UPI, Netbanking, and major platform facilities."
        },
        {
            question: "What is the Satisfaction Guarantee protocol?",
            answer: "Our Academic Integrity Guarantee ensures that if your first session does not meet institutional standards, we will re-initiate a high-priority match sequence at no additional cost."
        },
        {
            question: "Does the platform support home-based discovery?",
            answer: "Yes. Our matching engine supports 'Home Laboratory', 'Online Synchronous', and 'Institutional Center' modes. You can filter your search based on your preferred learning environment."
        }
    ];

    return (
        <div className="snap-container bg-white text-gray-900 antialiased selection:bg-blue-200">
            
            {/* Header Section */}
            <section className="snap-section px-6 relative text-center">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-100/30 blur-[120px] rounded-full -z-10 animate-pulse"></div>
                
                <div className="max-w-4xl mx-auto">
                    <div className="inline-flex items-center gap-3 px-4 py-2 bg-blue-50 rounded-full border border-blue-100 mb-8">
                        <ShieldCheck size={14} className="text-blue-600" />
                        <span className="text-blue-700 text-[10px] font-black uppercase tracking-[0.3em]">Institutional Support Matrix</span>
                    </div>
                    
                    <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-10 leading-[0.9] uppercase italic text-gray-900">
                        Student <br />
                        <span className="text-blue-600 font-serif lowercase tracking-normal not-italic px-4">Support</span> Terminal.
                    </h1>
                    
                    <p className="text-lg md:text-xl text-gray-500 font-medium max-w-2xl mx-auto mb-12 leading-relaxed italic">
                        Comprehensive documentation for navigating the TuitionsInIndia academic ecosystem. Find clarity on procurement and matching protocols.
                    </p>
                </div>
                
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-20">
                    <div className="w-px h-12 bg-gray-400"></div>
                </div>
            </section>

            {/* Questions Grid Section */}
            <section className="snap-section px-6 bg-gray-50/50">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-16 flex items-center gap-4">
                        <div className="size-12 rounded-2xl bg-gray-900 text-white flex items-center justify-center font-black">
                            FAQ
                        </div>
                        <div className="h-px flex-1 bg-gray-200"></div>
                    </div>
                    <FAQ items={questions} />
                </div>
            </section>

            {/* Support Hub Section */}
            <section className="snap-section px-6">
                <div className="max-w-4xl mx-auto bg-gray-900 rounded-[3.5rem] p-12 md:p-24 text-center relative overflow-hidden shadow-4xl text-white">
                    <div className="absolute -right-20 -bottom-20 size-96 bg-blue-600/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
                    
                    <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase italic mb-8 leading-tight">
                        Queries still <br />
                        <span className="text-blue-500 font-serif lowercase tracking-normal not-italic px-4">unresolved</span>?
                    </h2>
                    
                    <p className="text-xl text-gray-400 font-medium mb-12 italic max-w-xl mx-auto leading-relaxed">
                        Our institutional support team is standing by to provide technical and pedagogical assistance for your learning journey.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-6 justify-center">
                        <Link 
                            href="/post-requirement" 
                            className="bg-blue-600 text-white font-black px-12 py-6 rounded-2xl hover:bg-white hover:text-gray-900 active:scale-95 transition-all shadow-2xl shadow-blue-600/20 flex items-center justify-center gap-3 uppercase tracking-widest text-xs"
                        >
                            Deploy Requirement <ArrowRight size={18} />
                        </Link>
                        <button className="bg-transparent border border-white/20 text-white font-black px-12 py-6 rounded-2xl hover:bg-white/5 active:scale-95 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-xs">
                            <Mail size={18} className="text-blue-500" />
                            Contact Counsel
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
