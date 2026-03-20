"use client";

import Link from "next/link";

export default function TutorPricing() {
    return (
        <div className="min-h-screen bg-white font-sans flex flex-col pt-32">
            {/* Hero Section */}
            <section className="py-24 px-4 bg-slate-50 border-b border-slate-100">
                <div className="max-w-7xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 text-primary text-[10px] font-bold tracking-widest uppercase mb-6">
                        For Educators & Coaching Centers
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 tracking-tight">
                        Simple, <span className="text-primary">Flat Fee</span> Model
                    </h1>
                    <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
                        We don't take a commission on your hourly rate. Keep 100% of what you earn from students you match with.
                    </p>
                </div>
            </section>

            {/* Pricing Tiers */}
            <section className="py-24 px-4">
                <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">

                    {/* Basic Tier */}
                    <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col h-full">
                        <div className="mb-8">
                            <h3 className="text-2xl font-bold text-slate-900 mb-2">Basic</h3>
                            <p className="text-slate-400 text-sm font-medium">For new tutors starting out.</p>
                        </div>
                        <div className="text-4xl font-bold text-slate-900 mb-8">Free</div>
                        <ul className="space-y-4 mb-10 flex-1">
                            {["Standard Profile Listing", "Receive Inquiries", "1 Subject category", "Community access"].map((f, i) => (
                                <li key={i} className="flex items-center gap-3 text-slate-500 font-bold text-xs">
                                    <span className="material-symbols-outlined text-emerald-500 text-sm">check</span>
                                    {f}
                                </li>
                            ))}
                        </ul>
                        <Link href="/get-started" className="w-full py-4 bg-slate-50 text-slate-900 font-bold rounded-xl hover:bg-slate-100 transition-all text-center uppercase tracking-widest text-[10px]">Get Started</Link>
                    </div>

                    {/* Trusted Tier */}
                    <div className="bg-white p-10 rounded-[2.5rem] border-4 border-primary shadow-2xl shadow-primary/10 flex flex-col h-full relative">
                        <div className="absolute top-0 right-10 bg-primary text-white text-[10px] font-bold uppercase tracking-widest px-6 py-2 rounded-b-2xl">
                            Most Popular
                        </div>
                        <div className="mb-8">
                            <h3 className="text-2xl font-bold text-slate-900 mb-2">Verified Expert</h3>
                            <p className="text-slate-400 text-sm font-medium">For serious educators seeking growth.</p>
                        </div>
                        <div className="text-4xl font-bold text-slate-900 mb-2">₹499<span className="text-base text-slate-400 font-medium">/mo</span></div>
                        <p className="text-[10px] text-emerald-500 font-bold uppercase mb-8">Verification fee included</p>
                        <ul className="space-y-4 mb-10 flex-1">
                            {[
                                "Trusted Verification Badge",
                                "Priority Search Ranking",
                                "Included in AI Matchmaker",
                                "Up to 5 Subject categories",
                                "Direct Leads Messaging"
                            ].map((f, i) => (
                                <li key={i} className="flex items-center gap-3 text-slate-900 font-bold text-xs">
                                    <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                                    {f}
                                </li>
                            ))}
                        </ul>
                        <Link href="/get-started" className="w-full py-4 bg-primary text-white font-bold rounded-xl hover:opacity-90 transition-all text-center uppercase tracking-widest text-[10px] shadow-lg shadow-primary/10">Become Verified</Link>
                    </div>

                    {/* Premium Tier */}
                    <div className="bg-slate-900 p-10 rounded-[2.5rem] text-white flex flex-col h-full">
                        <div className="mb-8">
                            <h3 className="text-2xl font-bold mb-2">Coaching Center</h3>
                            <p className="text-white/40 text-sm font-medium">For institutes & multiple tutors.</p>
                        </div>
                        <div className="text-4xl font-bold mb-2">₹1,999<span className="text-base text-white/20 font-medium">/mo</span></div>
                        <p className="text-[10px] text-accent font-bold uppercase mb-8">Institutional tools</p>
                        <ul className="space-y-4 mb-10 flex-1">
                            {[
                                "Full Institutional profile",
                                "Manage up to 10 Tutors",
                                "Bulk lead management",
                                "Custom branding & CTA",
                                "Analytics dashboard"
                            ].map((f, i) => (
                                <li key={i} className="flex items-center gap-3 text-white/70 font-bold text-xs">
                                    <span className="material-symbols-outlined text-accent text-sm">verified</span>
                                    {f}
                                </li>
                            ))}
                        </ul>
                        <Link href="/get-started" className="w-full py-4 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-100 transition-all text-center uppercase tracking-widest text-[10px]">Register Center</Link>
                    </div>

                </div>
            </section>

            {/* Why No Commission? */}
            <section className="py-24 px-4 bg-slate-50">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-8">Why we don't take a commission?</h2>
                    <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-2xl mx-auto mb-12">
                        At Tuitions in India, we believe educators deserve to be rewarded fairly for their hard work. Our subscription model allows us to maintain a high-quality platform while ensuring you keep the full value of your expertise. No hidden cuts, just transparent growth.
                    </p>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-white p-8 rounded-3xl border border-slate-100 flex items-center gap-5 text-left">
                            <span className="material-symbols-outlined text-primary text-4xl shrink-0">volunteer_activism</span>
                            <div>
                                <h4 className="font-bold text-slate-900">Direct Relations</h4>
                                <p className="text-slate-400 text-xs font-medium">You maintain the direct relationship with your students.</p>
                            </div>
                        </div>
                        <div className="bg-white p-8 rounded-3xl border border-slate-100 flex items-center gap-5 text-left">
                            <span className="material-symbols-outlined text-primary text-4xl shrink-0">rocket_launch</span>
                            <div>
                                <h4 className="font-bold text-slate-900">Scale Effortlessly</h4>
                                <p className="text-slate-400 text-xs font-medium">The more you teach, the more you earn. Your costs stay fixed.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
