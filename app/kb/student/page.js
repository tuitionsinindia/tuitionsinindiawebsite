"use client";

import Link from "next/link";
import {
    GraduationCap,
    BookOpen,
    CreditCard,
    LayoutGrid,
    Rocket,
    Zap,
    Video
} from "lucide-react";

export default function StudentKB() {
    const categories = [
        {
            title: "Getting started",
            icon: Rocket,
            topics: ["How to create a profile", "Finding your first tutor", "Using the search and filters"]
        },
        {
            title: "Study tips",
            icon: Zap,
            topics: ["Effective online study habits", "How to prepare for board exams", "Setting learning goals"]
        },
        {
            title: "Payments and credits",
            icon: CreditCard,
            topics: ["Understanding pricing plans", "Managing your credits", "How to request a refund"]
        },
        {
            title: "Platform features",
            icon: LayoutGrid,
            topics: ["Using the chat feature", "Leaving reviews for tutors", "Tracking your progress"]
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900 antialiased pt-24 pb-24">
            <div className="max-w-6xl mx-auto px-6">
                <div className="text-center mb-12 space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-full border border-blue-100 mb-4">
                        <GraduationCap size={14} className="text-blue-600" />
                        <span className="text-blue-600 text-xs font-semibold">Student help centre</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
                        How can we help you?
                    </h1>
                    <p className="text-gray-500 text-lg max-w-xl mx-auto leading-relaxed">
                        Guides and tips to help you find the right tutor and get the most out of your learning.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
                    {categories.map((cat, idx) => (
                        <div key={idx} className="bg-white p-6 rounded-xl border border-gray-200 hover:border-blue-300 transition-all">
                            <div className="size-10 rounded-lg bg-blue-50 flex items-center justify-center mb-5 text-blue-600">
                                <cat.icon size={20} />
                            </div>
                            <h2 className="text-base font-semibold text-gray-900 mb-4">{cat.title}</h2>
                            <ul className="space-y-3">
                                {cat.topics.map((topic, i) => (
                                    <li key={i}>
                                        <Link href="#" className="text-sm text-gray-500 hover:text-blue-600 transition-colors flex items-center gap-2">
                                            <div className="size-1.5 rounded-full bg-gray-300 shrink-0"></div>
                                            {topic}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Webinar CTA */}
                <div className="bg-blue-600 rounded-2xl p-8 md:p-12 text-white text-center">
                    <div className="max-w-2xl mx-auto space-y-5">
                        <Video size={36} className="mx-auto text-blue-200" />
                        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Want personalised advice?</h2>
                        <p className="text-blue-100 leading-relaxed">
                            Join our weekly student webinars to learn from top-performing students and experienced educators across India.
                        </p>
                        <button className="bg-white text-blue-600 font-semibold px-8 py-3 rounded-xl hover:bg-blue-50 transition-colors text-sm">
                            Register for a session
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
