"use client";

import Link from "next/link";
import {
    GraduationCap,
    BookOpen,
    CreditCard,
    LayoutGrid,
    Rocket,
    Zap,
    Video,
    ChevronRight
} from "lucide-react";

export default function StudentKB() {
    const categories = [
        {
            title: "Getting Started",
            icon: Rocket,
            color: "text-blue-600",
            bg: "bg-blue-50",
            topics: ["How to create a profile", "Finding your first tutor", "Using the AI Matchmaker"]
        },
        {
            title: "Learning Tips",
            icon: Zap,
            color: "text-amber-600",
            bg: "bg-amber-50",
            topics: ["Effective online study habits", "How to prepare for board exams", "Setting learning goals"]
        },
        {
            title: "Payments & Refunds",
            icon: CreditCard,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
            topics: ["Understanding pricing", "Managing your credits", "How to request a refund"]
        },
        {
            title: "Platform Features",
            icon: LayoutGrid,
            color: "text-purple-600",
            bg: "bg-purple-50",
            topics: ["Using the chat", "Leaving reviews for tutors", "Tracking your progress"]
        }
    ];

    return (
        <div className="min-h-screen bg-white">
            <section className="bg-gray-50 border-b border-gray-100 py-16 px-6 text-center">
                <div className="max-w-2xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-full border border-blue-100 mb-5">
                        <GraduationCap size={13} className="text-blue-600" />
                        <span className="text-blue-700 text-xs font-medium">Student Help Centre</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">How can we help?</h1>
                    <p className="text-gray-500 text-lg max-w-xl mx-auto">
                        Guides and tips to help you find the right tutor and get the most out of TuitionsInIndia.
                    </p>
                </div>
            </section>

            <div className="max-w-6xl mx-auto px-6 py-16 space-y-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                    {categories.map((cat, idx) => (
                        <div key={idx} className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-shadow">
                            <div className={`w-10 h-10 rounded-xl ${cat.bg} flex items-center justify-center mb-4`}>
                                <cat.icon size={18} className={cat.color} />
                            </div>
                            <h2 className="font-semibold text-gray-900 mb-4">{cat.title}</h2>
                            <ul className="space-y-2.5">
                                {cat.topics.map((topic, i) => (
                                    <li key={i}>
                                        <Link href="#" className="text-sm text-gray-500 hover:text-blue-600 transition-colors flex items-center gap-2">
                                            <ChevronRight size={14} className="text-gray-300 shrink-0" />
                                            {topic}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="bg-blue-600 rounded-2xl p-10 text-center text-white">
                    <Video size={32} className="mx-auto mb-4 text-blue-200" />
                    <h2 className="text-2xl font-bold mb-3">Want personalised guidance?</h2>
                    <p className="text-blue-100 mb-6 max-w-lg mx-auto">
                        Join our weekly student webinars to learn from top tutors and students across India.
                    </p>
                    <button className="px-6 py-3 bg-white text-blue-600 rounded-xl font-semibold text-sm hover:bg-blue-50 transition-colors">
                        Register for a Session
                    </button>
                </div>
            </div>
        </div>
    );
}
