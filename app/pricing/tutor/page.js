"use client";

import Link from "next/link";
import { CheckCircle2, ShieldCheck, Briefcase, Building2, Crown, Info, ArrowRight } from "lucide-react";

export default function TutorPricing() {
    return (
        <div className="min-h-screen bg-white text-gray-900 antialiased">

            {/* Header */}
            <section className="py-16 px-6 text-center border-b border-gray-100">
                <div className="max-w-2xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Simple, Transparent Pricing
                    </h1>
                    <p className="text-lg text-gray-500">
                        No commission. Keep 100% of what you earn.
                    </p>
                </div>
            </section>

            {/* Pricing Tiers */}
            <section className="py-16 px-6">
                <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6 items-stretch">

                    {/* Free Tier */}
                    <div className="bg-white border border-gray-200 rounded-2xl p-8 flex flex-col">
                        <div className="mb-6">
                            <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center mb-4">
                                <Briefcase size={20} className="text-gray-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-1">Free</h3>
                            <p className="text-sm text-gray-400">Get started at no cost</p>
                        </div>
                        <div className="text-4xl font-bold text-gray-900 mb-8">
                            Free
                        </div>
                        <ul className="space-y-4 mb-8 flex-1">
                            {[
                                "Basic tutor profile",
                                "5 leads included to get started",
                                "1 subject category",
                                "Access to student directory"
                            ].map((feature, i) => (
                                <li key={i} className="flex items-center gap-3 text-sm text-gray-600">
                                    <CheckCircle2 size={16} className="text-blue-500 shrink-0" />
                                    {feature}
                                </li>
                            ))}
                        </ul>
                        <Link
                            href="/register/tutor?plan=free"
                            className="w-full py-3 border border-gray-200 text-gray-700 font-medium rounded-lg hover:border-blue-500 hover:text-blue-600 transition-colors text-center text-sm"
                        >
                            Get Started Free
                        </Link>
                    </div>

                    {/* Expert Tier - Recommended */}
                    <div className="bg-white border-2 border-blue-600 rounded-2xl p-8 flex flex-col relative shadow-lg shadow-blue-100">
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-semibold px-4 py-1 rounded-full">
                            Recommended
                        </div>
                        <div className="mb-6 pt-2">
                            <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center mb-4">
                                <Crown size={20} className="text-blue-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-1">Expert</h3>
                            <p className="text-sm text-gray-400">For individual tutors</p>
                        </div>
                        <div className="text-4xl font-bold text-gray-900 mb-1">
                            ₹499
                            <span className="text-base font-normal text-gray-400 ml-1">/month</span>
                        </div>
                        <p className="text-xs text-blue-600 font-medium mb-8">Billed monthly, cancel anytime</p>
                        <ul className="space-y-4 mb-8 flex-1">
                            {[
                                "Verified badge on your profile",
                                "Unlimited student leads",
                                "AI-powered student matching",
                                "Up to 5 subject categories",
                                "Priority search ranking",
                                "Direct student messaging"
                            ].map((feature, i) => (
                                <li key={i} className="flex items-center gap-3 text-sm text-gray-700">
                                    <ShieldCheck size={16} className="text-blue-600 shrink-0" />
                                    {feature}
                                </li>
                            ))}
                        </ul>
                        <Link
                            href="/register/tutor?plan=expert"
                            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors text-center text-sm"
                        >
                            Start as Expert
                        </Link>
                    </div>

                    {/* Coaching Hub Tier */}
                    <div className="bg-white border border-gray-200 rounded-2xl p-8 flex flex-col">
                        <div className="mb-6">
                            <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center mb-4">
                                <Building2 size={20} className="text-gray-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-1">Coaching Hub</h3>
                            <p className="text-sm text-gray-400">For institutes and academies</p>
                        </div>
                        <div className="text-4xl font-bold text-gray-900 mb-1">
                            ₹1,999
                            <span className="text-base font-normal text-gray-400 ml-1">/month</span>
                        </div>
                        <p className="text-xs text-gray-400 mb-8">Up to 10 tutors included</p>
                        <ul className="space-y-4 mb-8 flex-1">
                            {[
                                "Institute profile with branding",
                                "Manage up to 10 tutors",
                                "Bulk lead management",
                                "Custom institute page",
                                "Performance analytics dashboard"
                            ].map((feature, i) => (
                                <li key={i} className="flex items-center gap-3 text-sm text-gray-600">
                                    <CheckCircle2 size={16} className="text-blue-500 shrink-0" />
                                    {feature}
                                </li>
                            ))}
                        </ul>
                        <Link
                            href="/register/institute"
                            className="w-full py-3 border border-gray-200 text-gray-700 font-medium rounded-lg hover:border-blue-500 hover:text-blue-600 transition-colors text-center text-sm"
                        >
                            Register as Institute
                        </Link>
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
                        Our team is happy to help you choose the right plan for your teaching goals.
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
