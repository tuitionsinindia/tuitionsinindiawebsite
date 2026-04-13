"use client";

import Link from "next/link";
import { ShieldCheck, Lock, ArrowLeft, ScrollText, CheckCircle2 } from "lucide-react";

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans pb-24 pt-10">
            {/* Back link */}
            <div className="max-w-5xl mx-auto px-6 py-8 flex items-center justify-between border-b border-gray-200 mb-12">
                <Link href="/" className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors">
                    <ArrowLeft size={16} /> Back to home
                </Link>
                <div className="flex items-center gap-2 text-blue-600">
                    <ShieldCheck size={22} />
                    <span className="text-sm font-semibold">Privacy Policy</span>
                </div>
            </div>

            <main className="max-w-4xl mx-auto px-6">
                {/* Page heading */}
                <div className="mb-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full border border-blue-100 mb-6">
                        <ShieldCheck size={14} />
                        <span className="text-xs font-semibold">Privacy Policy</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-4">
                        How we handle your information
                    </h1>
                    <p className="text-gray-500 leading-relaxed max-w-2xl">
                        This page explains what information we collect, how we use it, and how we keep it safe. Last updated: April 2026.
                    </p>
                </div>

                {/* Sections */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                    <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-3">
                        <div className="size-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                            <Lock size={20} />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900">Data security</h2>
                        <p className="text-gray-500 leading-relaxed text-sm">
                            We collect only the information needed to connect students with tutors. Your data is kept secure and is never shared without your consent.
                        </p>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-3">
                        <div className="size-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                            <ScrollText size={20} />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900">What we collect</h2>
                        <p className="text-gray-500 leading-relaxed text-sm">
                            We collect your name, contact details, and qualifications only to verify your identity and match you with the right tutors or students.
                        </p>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-3">
                        <div className="size-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                            <CheckCircle2 size={20} />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900">How we use your data</h2>
                        <p className="text-gray-500 leading-relaxed text-sm">
                            Your contact details are kept private until you choose to share them. We do not store payment card information — payments are handled securely by Razorpay.
                        </p>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-3">
                        <div className="size-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                            <ShieldCheck size={20} />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900">Your rights</h2>
                        <p className="text-gray-500 leading-relaxed text-sm">
                            You are in full control of your profile. You can update your information, hide your profile from search results, or delete your account at any time.
                        </p>
                    </div>
                </div>

                {/* Contact section */}
                <div className="bg-white rounded-xl border border-gray-200 p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                    <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-gray-900">Questions about privacy?</h3>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            If you have any questions about how we handle your data, please contact us at{" "}
                            <a href="mailto:privacy@tuitionsinindia.com" className="text-blue-600 font-medium hover:underline">
                                privacy@tuitionsinindia.com
                            </a>
                        </p>
                    </div>
                    <div className="shrink-0 size-14 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                        <ShieldCheck size={28} />
                    </div>
                </div>
            </main>
        </div>
    );
}
