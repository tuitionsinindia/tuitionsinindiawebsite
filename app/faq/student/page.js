"use client";

import FAQ from "@/app/components/FAQ";
import Link from "next/link";
import { ArrowRight, CircleHelp, Mail, Lock } from "lucide-react";

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
            question: "What if I am not happy with a tutor?",
            answer: "You can close your requirement at any time and post a new one. We also encourage you to leave a review so other students benefit from your experience."
        },
        {
            question: "Can I find tutors for home tuition and online classes?",
            answer: "Yes. You can filter by teaching mode — home tuition, online classes, or at a coaching centre. Many tutors offer multiple modes."
        }
    ];

    return (
        <div className="bg-white text-gray-900 antialiased">

            {/* Header Section */}
            <section className="px-6 py-24 text-center bg-gray-50 border-b border-gray-100">
                <div className="max-w-3xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full border border-blue-100 mb-6">
                        <CircleHelp size={14} className="text-blue-600" />
                        <span className="text-blue-700 text-xs font-semibold">Student help</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-gray-900 leading-tight">
                        Frequently asked questions
                    </h1>
                    <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
                        Everything you need to know about finding and connecting with tutors on TuitionsInIndia.
                    </p>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="px-6 py-20 bg-gray-50">
                <div className="max-w-3xl mx-auto">
                    <FAQ items={questions} />
                </div>
            </section>

            {/* Support Section */}
            <section className="px-6 py-16">
                <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-gray-200 p-10 md:p-14 text-center shadow-sm">
                    <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900 leading-tight">
                        Still have questions?
                    </h2>
                    <p className="text-gray-500 mb-8 max-w-lg mx-auto leading-relaxed">
                        Our support team is here to help you with anything related to finding a tutor or using the platform.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/post-requirement"
                            className="bg-blue-600 text-white font-semibold px-8 py-4 rounded-xl hover:bg-blue-700 active:scale-95 transition-all shadow-sm flex items-center justify-center gap-2 text-sm"
                        >
                            Post requirement <ArrowRight size={16} />
                        </Link>
                        <button className="bg-white border border-gray-200 text-gray-700 font-semibold px-8 py-4 rounded-xl hover:bg-gray-50 active:scale-95 transition-all flex items-center justify-center gap-2 text-sm">
                            <Mail size={16} className="text-blue-600" />
                            Contact support
                        </button>
                    </div>
                    <div className="mt-10 flex items-center justify-center gap-2 text-xs text-gray-400">
                        <Lock size={12} /> Your data is secure
                    </div>
                </div>
            </section>
        </div>
    );
}
