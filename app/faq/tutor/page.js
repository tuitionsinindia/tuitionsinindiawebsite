"use client";

import FAQ from "@/app/components/FAQ";
import Link from "next/link";
import { ArrowRight, CircleHelp, Zap, Mail, MessageSquare, Lock } from "lucide-react";

export default function TutorFAQ() {
    const questions = [
        {
            question: "How do I receive student enquiries?",
            answer: "Once your profile is verified, you will receive real-time notifications on your dashboard and by email whenever a student searches for your subjects in your area."
        },
        {
            question: "Is there a subscription fee for tutors?",
            answer: "Listing your profile is free. To unlock priority matching, verification, and unlimited direct messaging, you can upgrade to our Expert or Institute plans."
        },
        {
            question: "How does payment work?",
            answer: "We operate a zero-commission model. You negotiate and collect fees directly from students. We only provide the discovery and verification service — we never take a cut of your earnings."
        },
        {
            question: "How does the verification process work?",
            answer: "We manually verify your government ID and educational certificates. Verified profiles receive 4.5x more student enquiries compared to unverified ones."
        },
        {
            question: "Can I teach multiple subjects?",
            answer: "Yes. You can list multiple subjects and locations — whether online or in-person — to reach as many relevant students as possible."
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
                        <span className="text-blue-700 text-xs font-black uppercase tracking-[0.3em] font-sans">Tutor Help</span>
                    </div>

                    <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-10 leading-[0.9] uppercase italic text-gray-900">
                        Tutor <br />
                        <span className="text-blue-600 font-serif lowercase tracking-normal not-italic px-4">FAQ</span>
                    </h1>

                    <p className="text-lg md:text-xl text-gray-500 font-medium max-w-2xl mx-auto mb-12 leading-relaxed italic">
                        Everything you need to know about listing and growing your tutoring business on TuitionsInIndia.
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
                        Our support team is here to help you grow your tutoring business on TuitionsInIndia.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-6 justify-center">
                        <Link
                            href="/register/tutor"
                            className="bg-blue-600 text-white font-black px-12 py-6 rounded-2xl hover:bg-white hover:text-gray-900 active:scale-95 transition-all shadow-2xl shadow-blue-600/20 flex items-center justify-center gap-3 uppercase tracking-widest text-xs"
                        >
                            Create Your Profile <ArrowRight size={18} />
                        </Link>
                        <Link href="/contact" className="bg-transparent border border-white/20 text-white font-black px-12 py-6 rounded-2xl hover:bg-white/5 active:scale-95 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-xs">
                            <Mail size={18} className="text-blue-500" />
                            Contact Us
                        </Link>
                    </div>

                </div>
            </section>
        </div>
    );
}
