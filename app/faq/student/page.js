"use client";

import FAQ from "@/app/components/FAQ";
import Link from "next/link";
import { ArrowRight, CircleHelp, ShieldCheck, Mail, MessageSquare, Lock } from "lucide-react";

export default function StudentFAQ() {
    const questions = [
        {
            question: "How do I find the right tutor for my needs?",
            answer: "Use our search to filter by subject, location, and grade level. You can also use our AI Matchmaker to get a personalised recommendation based on your requirements."
        },
        {
            question: "Is the first trial session really free?",
            answer: "Most of our verified tutors offer a free 30-minute trial session. Look for the 'Free Trial' badge on a tutor's profile to confirm availability."
        },
        {
            question: "How are payments handled?",
            answer: "Payments are processed securely through Razorpay and support UPI, Netbanking, and all major cards. You pay your tutor directly — we don't take a commission."
        },
        {
            question: "What is the Satisfaction Guarantee?",
            answer: "If your first session doesn't meet your expectations, we will help you find a better match at no additional cost."
        },
        {
            question: "Can I find tutors who come to my home?",
            answer: "Yes. You can filter by teaching mode — at your home, at the tutor's location, at a coaching centre, or online. Choose whatever suits you best."
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
                        <span className="text-blue-700 text-xs font-black uppercase tracking-[0.3em]">Student Help</span>
                    </div>

                    <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-10 leading-[0.9] uppercase italic text-gray-900">
                        Student <br />
                        <span className="text-blue-600 font-serif lowercase tracking-normal not-italic px-4">FAQ</span>
                    </h1>

                    <p className="text-lg md:text-xl text-gray-500 font-medium max-w-2xl mx-auto mb-12 leading-relaxed italic">
                        Everything you need to know about finding and working with tutors on TuitionsInIndia.
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

            {/* Support Section */}
            <section className="snap-section px-6">
                <div className="max-w-4xl mx-auto bg-gray-900 rounded-3xl p-12 md:p-20 text-center relative overflow-hidden shadow-xl text-white">
                    <div className="absolute -right-20 -bottom-20 size-96 bg-blue-600/10 rounded-full blur-3xl -z-10"></div>

                    <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
                        Still have questions?
                    </h2>

                    <p className="text-lg text-gray-400 mb-10 max-w-lg mx-auto leading-relaxed">
                        Our support team is here to help you with anything related to finding a tutor or using the platform.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-6 justify-center">
                        <Link
                            href="/post-requirement"
                            className="bg-blue-600 text-white font-black px-12 py-6 rounded-2xl hover:bg-white hover:text-gray-900 active:scale-95 transition-all shadow-2xl shadow-blue-600/20 flex items-center justify-center gap-3 uppercase tracking-widest text-xs"
                        >
                            Post a Requirement <ArrowRight size={18} />
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
