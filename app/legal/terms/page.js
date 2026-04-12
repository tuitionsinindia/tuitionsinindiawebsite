"use client";

import { ShieldCheck, FileText, Scale, CheckCircle2 } from "lucide-react";

export default function TermsOfService() {
    return (
        <div className="min-h-screen bg-white">
            <section className="bg-gray-50 border-b border-gray-100 py-16 px-6">
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3 tracking-tight">Terms of Service</h1>
                    <p className="text-gray-500">Last updated: March 24, 2026</p>
                </div>
            </section>

            <div className="max-w-3xl mx-auto px-6 py-16">
                <div className="prose prose-gray max-w-none space-y-12">
                    <section className="space-y-4">
                        <div className="flex items-center gap-3">
                            <FileText className="text-blue-600 shrink-0" size={20} />
                            <h2 className="text-xl font-bold text-gray-900">1. Acceptance of Terms</h2>
                        </div>
                        <p className="text-gray-600 leading-relaxed">
                            By accessing or using TuitionsInIndia, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our platform.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <div className="flex items-center gap-3">
                            <ShieldCheck className="text-blue-600 shrink-0" size={20} />
                            <h2 className="text-xl font-bold text-gray-900">2. Your Account</h2>
                        </div>
                        <p className="text-gray-600 leading-relaxed">
                            You are responsible for keeping your account credentials secure. Tutors must provide accurate and verifiable qualifications. Providing false information may result in account suspension or removal from the platform.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <div className="flex items-center gap-3">
                            <Scale className="text-blue-600 shrink-0" size={20} />
                            <h2 className="text-xl font-bold text-gray-900">3. Payments & Credits</h2>
                        </div>
                        <p className="text-gray-600 leading-relaxed">
                            Our platform uses a credit-based system for tutors to access student leads. Credits purchased are non-refundable. We operate on a zero-commission model — tutors keep 100% of what they earn from students directly.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <div className="flex items-center gap-3">
                            <CheckCircle2 className="text-blue-600 shrink-0" size={20} />
                            <h2 className="text-xl font-bold text-gray-900">4. Professional Conduct</h2>
                        </div>
                        <p className="text-gray-600 leading-relaxed">
                            Harassment, fraud, or misrepresentation of qualifications is strictly prohibited. All users are expected to behave professionally and respectfully. Violations may result in immediate account removal.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-bold text-gray-900">5. Platform Disclaimer</h2>
                        <p className="text-gray-600 leading-relaxed">
                            TuitionsInIndia is a marketplace connecting students with tutors. We verify tutor credentials but do not employ them directly. We encourage users to review tutor profiles, ratings, and qualifications carefully before making a decision.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-bold text-gray-900">6. Changes to Terms</h2>
                        <p className="text-gray-600 leading-relaxed">
                            We may update these terms from time to time. Continued use of the platform after changes are posted constitutes your acceptance of the revised terms.
                        </p>
                    </section>

                    <div className="pt-6 border-t border-gray-100">
                        <p className="text-sm text-gray-400">
                            For questions about these terms, contact us at <span className="text-blue-600">support@tuitionsinindia.com</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
