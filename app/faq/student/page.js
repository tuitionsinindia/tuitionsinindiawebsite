"use client";

import FAQ from "@/app/components/FAQ";
import Link from "next/link";
import { ArrowRight, CircleHelp, ShieldCheck, Mail, MessageSquare, Lock } from "lucide-react";

export default function StudentFAQ() {
    const questions = [
        {
            question: "How do I find the right tutor for my needs?",
            answer: "Use the search page to filter tutors by subject, location, and class level. You can also post your requirement and matching tutors will be notified automatically."
        },
        {
            question: "Is it free to search for tutors?",
            answer: "Yes, searching and browsing tutor profiles is completely free. You can view subjects, experience, ratings, and fees before deciding to connect."
        },
        {
            question: "How do payments work?",
            answer: "Payments are handled securely through Razorpay. We support UPI, net banking, debit cards, and credit cards. All transactions are encrypted and safe."
        },
        {
            question: "What if I'm not happy with a tutor?",
            answer: "You can close your requirement at any time and post a new one. We also encourage you to leave a review so other students benefit from your experience."
        },
        {
            question: "Can I find tutors for home tuition and online classes?",
            answer: "Yes! You can filter by teaching mode — home tuition, online classes, or at a coaching centre. Many tutors offer multiple modes."
        }
    ];

    return (
        <div className="snap-container bg-white text-gray-900 antialiased selection:bg-blue-200">
            
            {/* Header Section */}
            <section className="snap-section px-6 relative text-center">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-100/30 blur-[120px] rounded-full -z-10 animate-pulse"></div>
                
                <div className="max-w-4xl mx-auto">
                    <div className="inline-flex items-center gap-3 px-4 py-2 bg-blue-50 rounded-full border border-blue-100 mb-8">
                        <CircleHelp size={14} className="text-blue-600" />
                        <span className="text-blue-700 text-xs font-semibold uppercase tracking-wider">Student Help Centre</span>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-8 text-gray-900">
                        Frequently Asked <br />
                        <span className="text-blue-600">Questions</span>
                    </h1>

                    <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-12 leading-relaxed">
                        Everything you need to know about finding and connecting with tutors on TuitionsInIndia.
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
                            Post Requirement <ArrowRight size={18} />
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
