"use client";

import Link from "next/link";

export default function StudentPricing() {
    return (
        <div className="min-h-screen bg-white font-sans flex flex-col pt-32">
            {/* Hero Section */}
            <section className="py-24 px-4 bg-slate-50 border-b border-slate-100">
                <div className="max-w-7xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 text-primary text-[10px] font-bold tracking-widest uppercase mb-6">
                        For Students & Parents
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 tracking-tight">
                        Transparent <span className="text-primary">Pricing</span>
                    </h1>
                    <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
                        No hidden fees. No long-term contracts. Pay only for the learning you receive with our flexible, student-first models.
                    </p>
                </div>
            </section>

            {/* Pricing Models */}
            <section className="py-24 px-4">
                <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
                    {/* Pay Per Hour */}
                    <div className="bg-white p-12 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/20 flex flex-col items-center text-center">
                        <span className="material-symbols-outlined text-primary text-5xl mb-8">event_available</span>
                        <h3 className="text-3xl font-bold text-slate-900 mb-4">Pay Per Hour</h3>
                        <p className="text-slate-500 font-medium mb-10">Best for short-term support, exam prep, or specific doubt clearing.</p>

                        <div className="text-slate-900 font-bold mb-10">
                            <span className="text-slate-400 text-lg">Starts at</span>
                            <div className="text-5xl">₹299<span className="text-lg text-slate-400">/hr</span></div>
                        </div>

                        <ul className="space-y-4 mb-12 text-left w-full">
                            {[
                                "No upfront commitment",
                                "Pay only for what you use",
                                "Choice of verified experts",
                                "30-min Free Trial session",
                                "Cancel anytime"
                            ].map((feature, i) => (
                                <li key={i} className="flex items-center gap-3 text-slate-600 font-bold text-sm">
                                    <span className="material-symbols-outlined text-emerald-500 text-[18px]">check_circle</span>
                                    {feature}
                                </li>
                            ))}
                        </ul>

                        <Link href="/tutors" className="w-full py-5 bg-primary text-white font-bold rounded-2xl hover:opacity-90 transition-all uppercase tracking-widest text-xs shadow-lg shadow-primary/10">Browse Tutors</Link>
                    </div>

                    {/* Learning Bundles */}
                    <div className="bg-slate-900 p-12 rounded-[3rem] text-white flex flex-col items-center text-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 bg-accent text-slate-900 text-[10px] font-bold uppercase tracking-widest px-8 py-2 rounded-bl-2xl">
                            Best Value
                        </div>
                        <span className="material-symbols-outlined text-accent text-5xl mb-8">package_2</span>
                        <h3 className="text-3xl font-bold mb-4">Learning Bundles</h3>
                        <p className="text-white/40 font-medium mb-10">Best for consistent progress and long-term academic excellence.</p>

                        <div className="font-bold mb-10">
                            <span className="text-white/20 text-lg">Save up to</span>
                            <div className="text-6xl text-accent">20%</div>
                        </div>

                        <ul className="space-y-4 mb-12 text-left w-full">
                            {[
                                "Priority support",
                                "Dedicated Academic Advisor",
                                "Consistent study schedule",
                                "Progress tracking reports",
                                "Lower hourly effective rate"
                            ].map((feature, i) => (
                                <li key={i} className="flex items-center gap-3 text-white/70 font-bold text-sm">
                                    <span className="material-symbols-outlined text-accent text-[18px]">check_circle</span>
                                    {feature}
                                </li>
                            ))}
                        </ul>

                        <Link href="/ai-match" className="w-full py-5 bg-white text-slate-900 font-bold rounded-2xl hover:bg-slate-100 transition-all uppercase tracking-widest text-xs">Get a Custom Quote</Link>
                    </div>
                </div>
            </section>

            {/* Satisfaction Guarantee */}
            <section className="py-24 px-4 bg-primary/5">
                <div className="max-w-4xl mx-auto text-center bg-white p-12 rounded-[3rem] border border-primary/10 shadow-xl shadow-primary/5">
                    <span className="material-symbols-outlined text-emerald-500 text-6xl mb-8">verified</span>
                    <h2 className="text-3xl font-bold mb-6">Our Satisfaction Guarantee</h2>
                    <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-2xl mx-auto">
                        We are so confident in the quality of our tutors that if you're not completely satisfied with your first paid session, we'll refund you 100% or credit your account for a session with another tutor of your choice.
                    </p>
                </div>
            </section>
        </div>
    );
}
