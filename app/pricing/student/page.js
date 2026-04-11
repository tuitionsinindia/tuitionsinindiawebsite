"use client";

import Link from "next/link";
import { CheckCircle2, ShieldCheck, Clock, Sparkles, ArrowRight, Info } from "lucide-react";

export default function StudentPricing() {
    return (
        <div className="min-h-screen bg-white text-gray-900 antialiased">

            {/* Header */}
            <section className="py-16 px-6 text-center border-b border-gray-100">
                <div className="max-w-2xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Find a Tutor That Fits Your Budget
                    </h1>
                    <p className="text-lg text-gray-500">
                        No hidden fees. Pay only for the sessions you take.
                    </p>
                </div>
            </section>

            {/* Pricing Options */}
            <section className="py-16 px-6">
                <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6 items-stretch">

                    {/* Pay Per Hour */}
                    <div className="bg-white border border-gray-200 rounded-2xl p-8 flex flex-col">
                        <div className="mb-6">
                            <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center mb-4">
                                <Clock size={20} className="text-gray-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-1">Pay Per Hour</h3>
                            <p className="text-sm text-gray-400">Flexible, on-demand sessions</p>
                        </div>
                        <div className="text-4xl font-bold text-gray-900 mb-1">
                            ₹299
                            <span className="text-base font-normal text-gray-400 ml-1">/ hour</span>
                        </div>
                        <p className="text-xs text-gray-400 mb-8">Rates vary by tutor experience</p>
                        <ul className="space-y-4 mb-8 flex-1">
                            {[
                                "Book sessions whenever you need",
                                "No upfront commitment",
                                "Access to all verified tutors",
                                "Free 30-minute trial session",
                                "Cancel or reschedule anytime"
                            ].map((feature, i) => (
                                <li key={i} className="flex items-center gap-3 text-sm text-gray-600">
                                    <CheckCircle2 size={16} className="text-blue-500 shrink-0" />
                                    {feature}
                                </li>
                            ))}
                        </ul>
                        <Link
                            href="/search"
                            className="w-full py-3 border border-gray-200 text-gray-700 font-medium rounded-lg hover:border-blue-500 hover:text-blue-600 transition-colors text-center text-sm"
                        >
                            Browse Tutors
                        </Link>
                    </div>

                    {/* Bundle Plan */}
                    <div className="bg-white border-2 border-blue-600 rounded-2xl p-8 flex flex-col relative shadow-lg shadow-blue-100">
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-semibold px-4 py-1 rounded-full">
                            Best Value
                        </div>
                        <div className="mb-6 pt-2">
                            <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center mb-4">
                                <Sparkles size={20} className="text-blue-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-1">Session Bundles</h3>
                            <p className="text-sm text-gray-400">Consistent, structured learning</p>
                        </div>
                        <div className="text-4xl font-bold text-blue-600 mb-1">
                            20% off
                        </div>
                        <p className="text-xs text-gray-400 mb-8">On packages of 10 or more sessions</p>
                        <ul className="space-y-4 mb-8 flex-1">
                            {[
                                "Priority tutor matching",
                                "Dedicated learning plan",
                                "Structured progress tracking",
                                "Regular performance reports",
                                "Discounted per-session rates"
                            ].map((feature, i) => (
                                <li key={i} className="flex items-center gap-3 text-sm text-gray-700">
                                    <ShieldCheck size={16} className="text-blue-600 shrink-0" />
                                    {feature}
                                </li>
                            ))}
                        </ul>
                        <Link
                            href="/ai-match"
                            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors text-center text-sm"
                        >
                            Get Matched Now
                        </Link>
                    </div>

                </div>
            </section>

            {/* Trust Section */}
            <section className="py-12 px-6 bg-gray-50 border-y border-gray-100">
                <div className="max-w-3xl mx-auto text-center">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mx-auto mb-4">
                        <ShieldCheck size={22} className="text-blue-600" />
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-3">Satisfaction Guaranteed</h2>
                    <p className="text-gray-500 max-w-lg mx-auto">
                        If your first session does not meet your expectations, we will arrange a replacement session at no extra cost.
                    </p>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 px-6 text-center">
                <div className="max-w-xl mx-auto">
                    <p className="text-sm text-gray-400 mb-4">Not sure where to start?</p>
                    <Link
                        href="/contact"
                        className="inline-flex items-center gap-2 text-blue-600 font-medium hover:underline text-base"
                    >
                        Speak with an Academic Counsellor
                        <ArrowRight size={16} />
                    </Link>
                </div>
            </section>

        </div>
    );
}
