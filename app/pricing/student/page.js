"use client";

import Link from "next/link";
import {
    CheckCircle2,
    ShieldCheck,
    ArrowRight,
    Info,
    Clock,
    Star,
    Search,
    Zap
} from "lucide-react";

export default function StudentPricing() {
    return (
        <div className="min-h-screen bg-white font-sans text-gray-900 antialiased">

            {/* Header */}
            <section className="py-16 px-6 text-center border-b border-gray-100">
                <div className="max-w-2xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full border border-blue-100 mb-6">
                        <Star size={14} className="text-blue-600" />
                        <span className="text-blue-700 text-sm font-semibold">For Students & Parents</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
                        Find the right tutor
                    </h1>
                    <p className="text-lg text-gray-500">
                        Browse verified tutors for free. Pay only for the tuition you receive — we charge zero commission.
                    </p>
                </div>
            </section>

            {/* How It Works for Students */}
            <section className="py-16 px-6">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-2xl font-bold text-gray-900 text-center mb-12 tracking-tight">How it works</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Search,
                                title: "Search for free",
                                desc: "Browse tutor profiles, read reviews, and compare rates. No account needed to search."
                            },
                            {
                                icon: Zap,
                                title: "Post a requirement",
                                desc: "Tell us what you need — subject, location, and budget. Matching tutors will contact you directly."
                            },
                            {
                                icon: ShieldCheck,
                                title: "Start learning",
                                desc: "Agree on fees directly with the tutor. We take zero commission — 100% goes to the tutor."
                            }
                        ].map((item, i) => (
                            <div key={i} className="text-center p-6">
                                <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center mx-auto mb-4">
                                    <item.icon size={22} className="text-blue-600" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing Options */}
            <section className="py-16 px-6 bg-gray-50">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-2xl font-bold text-gray-900 text-center mb-3 tracking-tight">Simple pricing</h2>
                    <p className="text-gray-500 text-center mb-12 max-w-xl mx-auto">Students can use the platform for free. You only pay the tutor directly for classes — no hidden fees.</p>

                    <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">

                        {/* Free Access */}
                        <div className="bg-white border border-gray-200 rounded-2xl p-8 flex flex-col">
                            <div className="mb-6">
                                <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center mb-4">
                                    <Search size={20} className="text-gray-400" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-1">Free Access</h3>
                                <p className="text-sm text-gray-400">Everything you need to find a tutor</p>
                            </div>
                            <div className="text-4xl font-bold text-gray-900 mb-8">
                                Free
                            </div>
                            <ul className="space-y-4 mb-8 flex-1">
                                {[
                                    "Browse all tutor profiles",
                                    "Post tuition requirements",
                                    "Receive tutor responses",
                                    "Read reviews and ratings",
                                    "Compare tutor rates",
                                    "Chat with matched tutors"
                                ].map((feature, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm text-gray-600">
                                        <CheckCircle2 size={16} className="text-blue-500 shrink-0" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                            <Link
                                href="/post-requirement"
                                className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors text-center text-sm"
                            >
                                Post a Requirement
                            </Link>
                        </div>

                        {/* Boost Your Requirement */}
                        <div className="bg-white border-2 border-blue-600 rounded-2xl p-8 flex flex-col relative shadow-lg shadow-blue-100">
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-semibold px-4 py-1 rounded-full">
                                Get More Responses
                            </div>
                            <div className="mb-6 pt-2">
                                <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center mb-4">
                                    <Zap size={20} className="text-blue-600" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-1">Boost a Requirement</h3>
                                <p className="text-sm text-gray-400">Get priority responses from top tutors</p>
                            </div>
                            <div className="text-4xl font-bold text-gray-900 mb-1">
                                ₹49
                                <span className="text-base font-normal text-gray-400 ml-1">per requirement</span>
                            </div>
                            <p className="text-xs text-blue-600 font-medium mb-8">One-time payment, no subscription</p>
                            <ul className="space-y-4 mb-8 flex-1">
                                {[
                                    "Everything in Free, plus:",
                                    "Your requirement shown first to tutors",
                                    "More tutor responses (up to 4.5x)",
                                    "Priority matching with top-rated tutors",
                                    "Highlighted in tutor dashboards",
                                    "Faster response time"
                                ].map((feature, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm text-gray-700">
                                        <ShieldCheck size={16} className="text-blue-600 shrink-0" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                            <Link
                                href="/post-requirement"
                                className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors text-center text-sm"
                            >
                                Post and Boost
                            </Link>
                        </div>

                    </div>
                </div>
            </section>

            {/* Trust Section */}
            <section className="py-16 px-6">
                <div className="max-w-3xl mx-auto text-center">
                    <div className="p-8 bg-blue-50 rounded-2xl border border-blue-100">
                        <ShieldCheck size={32} className="text-blue-600 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight">
                            Your satisfaction matters
                        </h2>
                        <p className="text-gray-500 leading-relaxed max-w-xl mx-auto">
                            All tutors on our platform are verified. If you are not happy with a tutor, you can always search for a new one at no cost. We are here to help you find the right match.
                        </p>
                    </div>
                </div>
            </section>

            {/* FAQ / Support CTA */}
            <section className="py-16 px-6 border-t border-gray-100 text-center">
                <div className="max-w-xl mx-auto">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mx-auto mb-4">
                        <Info size={22} className="text-blue-600" />
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-3">Have questions?</h2>
                    <p className="text-gray-500 mb-8">
                        Our team is happy to help you find the right tutor for your needs.
                    </p>
                    <Link
                        href="/contact"
                        className="inline-flex items-center gap-2 px-6 py-3 border border-gray-200 text-gray-700 font-medium rounded-lg hover:border-blue-500 hover:text-blue-600 transition-colors text-sm"
                    >
                        Contact Us
                        <ArrowRight size={16} />
                    </Link>
                </div>
            </section>
        </div>
    );
}
