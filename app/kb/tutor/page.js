"use client";

import Link from "next/link";
import {
    Briefcase,
    BarChart3,
    TrendingUp,
    PlayCircle,
    UserPlus
} from "lucide-react";

export default function TutorKB() {
    const categories = [
        {
            title: "Getting started",
            icon: UserPlus,
            topics: ["Setting up your tutor profile", "Identity verification steps", "Adding your qualifications"]
        },
        {
            title: "Managing leads",
            icon: BarChart3,
            topics: ["How to unlock student contacts", "Improving your response time", "Understanding student requirements"]
        },
        {
            title: "Running your teaching",
            icon: Briefcase,
            topics: ["Setting competitive hourly rates", "Managing your schedule", "Professional communication tips"]
        },
        {
            title: "Growing your profile",
            icon: TrendingUp,
            topics: ["How to get more profile views", "Reading your analytics", "Collecting student reviews"]
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900 antialiased pt-24 pb-24">
            <div className="max-w-6xl mx-auto px-6">
                <div className="text-center mb-12 space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-full border border-blue-100 mb-4">
                        <Briefcase size={14} className="text-blue-600" />
                        <span className="text-blue-600 text-xs font-semibold">Tutor help centre</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
                        Guides for tutors
                    </h1>
                    <p className="text-gray-500 text-lg max-w-xl mx-auto leading-relaxed">
                        Practical tips to help you set up your profile, manage student leads, and grow your tutoring business.
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

                {/* CTA */}
                <div className="bg-white border border-gray-200 rounded-2xl p-8 md:p-12 text-center">
                    <div className="max-w-2xl mx-auto space-y-5">
                        <PlayCircle size={36} className="mx-auto text-blue-600" />
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Ready to get more students?</h2>
                        <p className="text-gray-500 leading-relaxed">
                            Watch our free tutor guide to learn how to build a strong profile and attract more student enquiries.
                        </p>
                        <button className="bg-blue-600 text-white font-semibold px-8 py-3 rounded-xl hover:bg-blue-700 transition-colors text-sm">
                            Watch the guide
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
