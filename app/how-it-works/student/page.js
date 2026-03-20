"use client";

import Link from "next/link";

export default function StudentHowItWorks() {
    return (
        <div className="min-h-screen bg-white font-sans flex flex-col pt-32">
            {/* Hero Section */}
            <section className="py-24 px-4 bg-slate-50 border-b border-slate-100">
                <div className="max-w-7xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 text-primary text-[10px] font-bold tracking-widest uppercase mb-6">
                        For Students & Parents
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 tracking-tight">
                        How it works: <span className="text-primary">Learning journey</span>
                    </h1>
                    <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
                        Find the perfect mentor to help you excel academically. A simple, secure, and AI-powered experience designed for results.
                    </p>
                </div>
            </section>

            {/* Steps Section */}
            <section className="py-24 px-4">
                <div className="max-w-5xl mx-auto">
                    <div className="grid gap-16">
                        {[
                            {
                                step: "01",
                                title: "Search or Use AI Matchmaker",
                                desc: "Browse thousands of verified tutors by subject and location, or let our AI analyze your learning style to find the perfect fit instantly.",
                                icon: "search",
                                color: "bg-blue-50 text-blue-600"
                            },
                            {
                                step: "02",
                                title: "View Verified Profiles",
                                desc: "Check ratings, reviews, qualifications, and teaching styles. We verify every tutor's identity and credentials so you can book with confidence.",
                                icon: "verified_user",
                                color: "bg-emerald-50 text-emerald-600"
                            },
                            {
                                step: "03",
                                title: "Book a Free Trial",
                                desc: "Most of our tutors offer a 30-minute free trial. Connect with them to see if their teaching style resonates with you before committing.",
                                icon: "calendar_today",
                                color: "bg-amber-50 text-amber-600"
                            },
                            {
                                step: "04",
                                title: "Start Learning & Excel",
                                desc: "Schedule regular sessions, track your progress, and see your grades improve. Secure payments and flexible scheduling at your fingertips.",
                                icon: "school",
                                color: "bg-primary text-white"
                            }
                        ].map((item, idx) => (
                            <div key={idx} className="flex flex-col md:flex-row gap-10 items-center">
                                <div className={`shrink-0 size-20 rounded-[2rem] flex items-center justify-center text-3xl font-bold ${item.color} shadow-xl shadow-current/5`}>
                                    <span className="material-symbols-outlined text-4xl">{item.icon}</span>
                                </div>
                                <div className="flex-1 text-center md:text-left">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Step {item.step}</span>
                                    <h3 className="text-3xl font-bold text-slate-900 mb-4">{item.title}</h3>
                                    <p className="text-lg text-slate-500 font-medium leading-relaxed">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-20 p-12 bg-primary rounded-[3rem] text-white text-center shadow-2xl shadow-primary/20 relative overflow-hidden">
                        <div className="relative z-10">
                            <h2 className="text-3xl font-bold mb-6">Ready to find your match?</h2>
                            <p className="text-white/70 font-medium mb-10 max-w-lg mx-auto">Join thousands of students across India who are reaching their full potential with our expert tutors.</p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link href="/tutors" className="px-10 py-5 bg-white text-primary font-bold rounded-2xl hover:opacity-90 transition-all uppercase tracking-widest text-xs">Browse Tutors</Link>
                                <Link href="/ai-match" className="px-10 py-5 bg-primary-glow text-white font-bold rounded-2xl border-2 border-white/20 hover:bg-white/10 transition-all uppercase tracking-widest text-xs">Try AI Matchmaker</Link>
                            </div>
                        </div>
                        <div className="absolute top-0 right-0 size-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                    </div>
                </div>
            </section>

            {/* FAQs */}
            <section className="py-24 px-4 bg-slate-50">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-16">Frequently Asked Questions</h2>
                    <div className="space-y-6">
                        {[
                            { q: "Is the first class really free?", a: "Many tutors offer a free 30-minute introductory session to discuss goals and verify fit. Look for the 'Free Trial' badge on their profile." },
                            { q: "How do you verify tutors?", a: "We conduct a multi-step verification process including identity checks, academic credential verification, and often a demo session evaluation." },
                            { q: "Can I change my tutor if it's not working?", a: "Absolutely. We encourage you to find the best fit. Your balance is safe and can be transferred to a different tutor if needed." }
                        ].map((faq, idx) => (
                            <div key={idx} className="bg-white p-8 rounded-2xl border border-slate-100">
                                <h4 className="font-bold text-slate-900 mb-3">{faq.q}</h4>
                                <p className="text-slate-500 text-sm font-medium leading-relaxed">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
