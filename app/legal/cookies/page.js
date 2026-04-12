"use client";

import { Cookie, ShieldCheck, Settings, Info } from "lucide-react";

export default function CookiePolicy() {
    return (
        <div className="min-h-screen bg-white">
            <section className="bg-gray-50 border-b border-gray-100 py-16 px-6">
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3 tracking-tight">Cookie Policy</h1>
                    <p className="text-gray-500">Last updated: April 2026</p>
                </div>
            </section>

            <div className="max-w-3xl mx-auto px-6 py-16">
                <div className="prose prose-gray max-w-none space-y-12">
                    <section className="space-y-4">
                        <div className="flex items-center gap-3">
                            <Info className="text-blue-600 shrink-0" size={20} />
                            <h2 className="text-xl font-bold text-gray-900">What Are Cookies?</h2>
                        </div>
                        <p className="text-gray-600 leading-relaxed">
                            Cookies are small text files stored on your device when you visit a website. They help the site remember your preferences and improve your experience on return visits.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <div className="flex items-center gap-3">
                            <Cookie className="text-blue-600 shrink-0" size={20} />
                            <h2 className="text-xl font-bold text-gray-900">Cookies We Use</h2>
                        </div>
                        <div className="space-y-4">
                            <div className="p-5 bg-gray-50 rounded-2xl">
                                <p className="font-bold text-gray-900 mb-1">Essential Cookies</p>
                                <p className="text-gray-600 text-sm leading-relaxed">Required for the platform to function. These include session tokens that keep you logged in. You cannot opt out of these while using the site.</p>
                            </div>
                            <div className="p-5 bg-gray-50 rounded-2xl">
                                <p className="font-bold text-gray-900 mb-1">Analytics Cookies</p>
                                <p className="text-gray-600 text-sm leading-relaxed">We use Google Analytics to understand how visitors use the site (pages visited, time spent). This data is aggregated and anonymous. You can opt out via your browser settings or Google's opt-out tool.</p>
                            </div>
                            <div className="p-5 bg-gray-50 rounded-2xl">
                                <p className="font-bold text-gray-900 mb-1">Preference Cookies</p>
                                <p className="text-gray-600 text-sm leading-relaxed">Store your search preferences (subject, location, mode) so we can show relevant results on your next visit.</p>
                            </div>
                        </div>
                    </section>

                    <section className="space-y-4">
                        <div className="flex items-center gap-3">
                            <Settings className="text-blue-600 shrink-0" size={20} />
                            <h2 className="text-xl font-bold text-gray-900">Managing Cookies</h2>
                        </div>
                        <p className="text-gray-600 leading-relaxed">
                            Most browsers let you control cookies through their settings. You can choose to block or delete cookies at any time. Note that disabling essential cookies will affect how the platform works — for example, you will be logged out on every visit.
                        </p>
                        <p className="text-gray-600 leading-relaxed">
                            For instructions on managing cookies in your browser, visit your browser's help section or go to <span className="text-blue-600">aboutcookies.org</span>.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <div className="flex items-center gap-3">
                            <ShieldCheck className="text-blue-600 shrink-0" size={20} />
                            <h2 className="text-xl font-bold text-gray-900">Third-Party Cookies</h2>
                        </div>
                        <p className="text-gray-600 leading-relaxed">
                            Some features (payment processing via Razorpay, analytics via Google) may set their own cookies. We do not control these cookies — please review the privacy policies of those services directly.
                        </p>
                    </section>

                    <div className="pt-6 border-t border-gray-100">
                        <p className="text-sm text-gray-400">
                            Questions about our cookie use? Email us at <span className="text-blue-600">support@tuitionsinindia.com</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
