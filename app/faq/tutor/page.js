"use client";

import FAQ from "@/app/components/FAQ";
import Link from "next/link";
import { ArrowRight, CircleHelp, Zap, Mail, MessageSquare, Lock } from "lucide-react";

export default function TutorFAQ() {
    const questions = [
        {
            question: "How do I receive student enquiries?",
            answer: "Once your profile is live, you'll get notifications in your dashboard and email when students post requirements matching your subjects and location."
        },
        {
            question: "Is it free to list my profile?",
            answer: "Yes, creating your tutor profile is completely free. To unlock student contacts and get priority in search results, you can upgrade to our Pro or Elite plans."
        },
        {
            question: "Does the platform take a commission on my fees?",
            answer: "No. We charge zero commission. You negotiate and collect fees directly from students. We only charge for credits used to unlock student contacts."
        },
        {
            question: "How does verification work?",
            answer: "We verify your ID and qualifications to give you a 'Verified' badge. Verified tutors get significantly more student enquiries and appear higher in search results."
        },
        {
            question: "Can I teach multiple subjects?",
            answer: "Yes! You can list multiple subjects, grades, and locations on your profile. Pro plan tutors can list up to 5 subjects."
        }
    ];

    return (
        <div className="snap-container bg-white text-gray-900 antialiased selection:bg-blue-200">
            
            {/* Header Section */}
            <section className="snap-section px-6 relative text-center">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-100/30 blur-[120px] rounded-full -z-10 animate-pulse"></div>
                
                <div className="max-w-4xl mx-auto">
                    <div className="inline-flex items-center gap-3 px-4 py-2 bg-blue-50 rounded-full border border-blue-100 mb-8">
                        <CircleHelp size={14} className="text-blue-600" />
                        <span className="text-blue-700 text-xs font-semibold uppercase tracking-wider">Tutor Help Centre</span>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-8 text-gray-900">
                        Frequently Asked <br />
                        <span className="text-blue-600">Questions</span>
                    </h1>

                    <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-12 leading-relaxed">
                        Everything you need to know about getting students and growing your tutoring business on TuitionsInIndia.
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
                            Create Tutor Profile <ArrowRight size={18} />
                        </Link>
                        <button className="bg-transparent border border-white/20 text-white font-black px-12 py-6 rounded-2xl hover:bg-white/5 active:scale-95 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-xs">
                            <Mail size={18} className="text-blue-500" />
                            Contact Support
                        </button>
                    </div>

                    <div className="mt-16 flex items-center justify-center gap-2 text-xs text-gray-400">
                        <Lock size={12} /> Your data is secure
                    </div>
                </div>
            </section>
        </div>
    );
}
