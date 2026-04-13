"use client";

import { ShieldCheck, FileText, Scale, CheckCircle2 } from "lucide-react";

export default function TermsOfService() {
    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900 antialiased pt-32">

            <main className="px-6 md:px-12 lg:px-24 pb-24 pt-10">
                <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-2xl border border-gray-200 shadow-sm">

                    <div className="space-y-10">
                        <section className="space-y-3">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full border border-blue-100 mb-3">
                                <Scale size={14} />
                                <span className="text-xs font-semibold">Terms of Service</span>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">Terms of Service</h1>
                            <p className="text-gray-500 text-sm">Last updated: March 24, 2026</p>
                        </section>

                        <div className="space-y-10 text-gray-600 leading-relaxed text-base">
                            <section className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <FileText className="text-blue-600 shrink-0" size={20} />
                                    <h2 className="text-xl font-semibold text-gray-900">1. Acceptance of terms</h2>
                                </div>
                                <p>By accessing the TuitionsInIndia platform, you agree to follow these terms. We provide the platform; you agree to use it responsibly.</p>
                            </section>

                            <section className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <ShieldCheck className="text-blue-600 shrink-0" size={20} />
                                    <h2 className="text-xl font-semibold text-gray-900">2. Your account</h2>
                                </div>
                                <p>You are responsible for your account details. Tutors must provide accurate and honest information about their qualifications and teaching experience. Providing false information may result in account suspension.</p>
                            </section>

                            <section className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <Scale className="text-blue-600 shrink-0" size={20} />
                                    <h2 className="text-xl font-semibold text-gray-900">3. Payments and credits</h2>
                                </div>
                                <p>Our platform uses a credit-based system for tutors to contact students. Once credits are purchased, the transaction is final. We do not take a commission on tutor fees, so tutors keep 100% of what they earn.</p>
                            </section>

                            <section className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <CheckCircle2 className="text-blue-600 shrink-0" size={20} />
                                    <h2 className="text-xl font-semibold text-gray-900">4. Acceptable use</h2>
                                </div>
                                <p>Harassment, fraud, or misrepresentation is strictly not allowed. All users are expected to be honest and respectful at all times.</p>
                            </section>

                            <section className="space-y-3">
                                <h2 className="text-xl font-semibold text-gray-900">5. Platform disclaimer</h2>
                                <p>TuitionsInIndia connects students and tutors. We do not employ the tutors listed on our platform. We verify their details, but students and parents should do their own checks before starting lessons.</p>
                            </section>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
