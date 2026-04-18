"use client";

import Link from "next/link";
import { CheckCircle2, ShieldCheck, Building2, Crown, Info, ArrowRight, CreditCard } from "lucide-react";

export default function TutorPricing() {
    return (
        <div className="min-h-screen bg-white text-gray-900 antialiased">

            {/* Header */}
            <section className="py-16 px-6 text-center border-b border-gray-100">
                <div className="max-w-2xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
                        Simple, transparent pricing
                    </h1>
                    <p className="text-lg text-gray-500">
                        No commission. Keep 100% of what you earn from students.
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
                                <CreditCard size={20} className="text-gray-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-1">Free</h3>
                            <p className="text-sm text-gray-400">Get started at no cost</p>
                        </div>
                        <div className="text-4xl font-bold text-gray-900 mb-1">
                            ₹0
                        </div>
                        <p className="text-xs text-gray-400 mb-8">5 free credits on signup</p>
                        <ul className="space-y-4 mb-8 flex-1">
                            {[
                                "Full tutor profile listing",
                                "5 free credits when you sign up",
                                "Receive student enquiries",
                                "Accept demo class bookings",
                                "Buy more credits as needed"
                            ].map((feature, i) => (
                                <li key={i} className="flex items-center gap-3 text-sm text-gray-600">
                                    <CheckCircle2 size={16} className="text-blue-500 shrink-0" />
                                    {feature}
                                </li>
                            ))}
                        </ul>
                        <Link
                            href="/register/tutor"
                            className="w-full py-3 border border-gray-200 text-gray-700 font-medium rounded-lg hover:border-blue-500 hover:text-blue-600 transition-colors text-center text-sm"
                        >
                            Get Started Free
                        </Link>
                    </div>

                    {/* Pro Tier - Recommended */}
                    <div className="bg-white border-2 border-blue-600 rounded-2xl p-8 flex flex-col relative shadow-lg shadow-blue-100">
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-semibold px-4 py-1 rounded-full">
                            Recommended
                        </div>
                        <div className="mb-6 pt-2">
                            <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center mb-4">
                                <Crown size={20} className="text-blue-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-1">Pro</h3>
                            <p className="text-sm text-gray-400">For individual tutors</p>
                        </div>
                        <div className="text-4xl font-bold text-gray-900 mb-1">
                            ₹499
                            <span className="text-base font-normal text-gray-400 ml-1">/month</span>
                        </div>
                        <p className="text-xs text-blue-600 font-medium mb-8">30 credits included every month</p>
                        <ul className="space-y-4 mb-8 flex-1">
                            {[
                                "Verified badge on your profile",
                                "30 credits per month",
                                "Priority search ranking",
                                "Direct student messaging",
                                "Up to 5 subject categories",
                                "Cancel anytime"
                            ].map((feature, i) => (
                                <li key={i} className="flex items-center gap-3 text-sm text-gray-700">
                                    <ShieldCheck size={16} className="text-blue-600 shrink-0" />
                                    {feature}
                                </li>
                            ))}
                        </ul>
                        <Link
                            href="/register/tutor"
                            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors text-center text-sm"
                        >
                            Start with Pro
                        </Link>
                    </div>

                    {/* Elite Tier */}
                    <div className="bg-white border border-gray-200 rounded-2xl p-8 flex flex-col">
                        <div className="mb-6">
                            <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center mb-4">
                                <Building2 size={20} className="text-gray-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-1">Elite</h3>
                            <p className="text-sm text-gray-400">For institutes and top tutors</p>
                        </div>
                        <div className="text-4xl font-bold text-gray-900 mb-1">
                            ₹1,999
                            <span className="text-base font-normal text-gray-400 ml-1">/month</span>
                        </div>
                        <p className="text-xs text-gray-400 mb-8">100 credits included every month</p>
                        <ul className="space-y-4 mb-8 flex-1">
                            {[
                                "Everything in Pro",
                                "100 credits per month",
                                "Featured listing in search",
                                "Top search ranking",
                                "Dedicated support",
                                "Unlimited subject categories"
                            ].map((feature, i) => (
                                <li key={i} className="flex items-center gap-3 text-sm text-gray-600">
                                    <CheckCircle2 size={16} className="text-blue-500 shrink-0" />
                                    {feature}
                                </li>
                            ))}
                        </ul>
                        <Link
                            href="/register/tutor"
                            className="w-full py-3 border border-gray-200 text-gray-700 font-medium rounded-lg hover:border-blue-500 hover:text-blue-600 transition-colors text-center text-sm"
                        >
                            Start with Elite
                        </Link>
                    </div>

                </div>
            </section>

            {/* Credit Packs */}
            <section className="py-16 px-6 bg-gray-50">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight">Or buy credits as you go</h2>
                    <p className="text-gray-500 mb-10">No subscription needed. Buy credit packs and use them to unlock student contacts.</p>
                    <div className="grid grid-cols-3 gap-4">
                        {[
                            { credits: 10, price: 99 },
                            { credits: 30, price: 249 },
                            { credits: 60, price: 449 }
                        ].map((pack, i) => (
                            <div key={i} className="bg-white border border-gray-200 rounded-2xl p-6 text-center">
                                <p className="text-3xl font-bold text-gray-900 mb-1">{pack.credits}</p>
                                <p className="text-sm text-gray-400 mb-3">credits</p>
                                <p className="text-xl font-bold text-blue-600">₹{pack.price}</p>
                                <p className="text-xs text-gray-400 mt-1">₹{Math.round(pack.price / pack.credits)} per credit</p>
                            </div>
                        ))}
                    </div>
                    <p className="text-sm text-gray-400 mt-6">Credits can be purchased from your tutor dashboard after signing up.</p>
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
