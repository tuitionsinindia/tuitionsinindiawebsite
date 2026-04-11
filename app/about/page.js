"use client";

import Link from 'next/link';
import {
    Zap,
    Users,
    Globe,
    ShieldCheck,
    Target,
    Layers,
    Brain,
    CheckCircle2,
    ArrowRight
} from 'lucide-react';

export default function AboutPage() {
    const stats = [
        { label: "Tutors", value: "10K+", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
        { label: "Matches Made", value: "50K+", icon: Zap, color: "text-amber-600", bg: "bg-amber-50" },
        { label: "Cities Covered", value: "543+", icon: Globe, color: "text-emerald-600", bg: "bg-emerald-50" },
        { label: "Avg. Rating", value: "4.9/5", icon: ShieldCheck, color: "text-purple-600", bg: "bg-purple-50" }
    ];

    const values = [
        {
            title: "Verified Tutors",
            desc: "Every tutor on our platform is manually verified. We check qualifications, conduct background screening, and review teaching experience before any profile goes live.",
            icon: ShieldCheck
        },
        {
            title: "No Commission",
            desc: "We don't take a cut from tutor earnings. Students pay tutors directly, keeping the relationship transparent and the economics fair for everyone.",
            icon: Layers
        },
        {
            title: "Smart Matching",
            desc: "Our matching algorithm considers subject, location, grade level, teaching mode, budget, and schedule to surface the most relevant tutors for each student.",
            icon: Brain
        }
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Hero */}
            <section className="bg-gray-50 border-b border-gray-100 py-20 px-6">
                <div className="max-w-3xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-full border border-blue-100 mb-6">
                        <Zap size={13} className="text-blue-600" />
                        <span className="text-blue-700 text-xs font-medium">About TuitionsInIndia</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-5 tracking-tight">
                        Connecting students with the right tutors across India
                    </h1>
                    <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed">
                        TuitionsInIndia helps students find verified home tutors and online tutors for every subject, grade, and exam. We make it simple to search, compare, and connect — for free.
                    </p>
                </div>
            </section>

            <div className="max-w-6xl mx-auto px-6 py-16 space-y-20">

                {/* Stats */}
                <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {stats.map((stat, i) => (
                        <div key={i} className="bg-white border border-gray-200 rounded-2xl p-6 text-center shadow-sm">
                            <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mx-auto mb-3`}>
                                <stat.icon size={18} className={stat.color} />
                            </div>
                            <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                            <p className="text-sm text-gray-500">{stat.label}</p>
                        </div>
                    ))}
                </section>

                {/* Mission */}
                <section className="grid lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-5">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
                            Education shouldn't be limited by where you live
                        </h2>
                        <p className="text-gray-500 leading-relaxed">
                            We built TuitionsInIndia because finding a good tutor is harder than it should be. Parents spend weeks asking around, and qualified tutors struggle to reach students outside their immediate area.
                        </p>
                        <p className="text-gray-500 leading-relaxed">
                            Our platform removes that friction. Students can browse hundreds of verified tutors by subject, location, and price in minutes. Tutors get discovered by students who genuinely need their help.
                        </p>
                        <div className="flex gap-4 pt-2">
                            <Link
                                href="/register/tutor"
                                className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
                            >
                                Join as a Tutor
                            </Link>
                            <Link
                                href="/search"
                                className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors"
                            >
                                Find a Tutor
                            </Link>
                        </div>
                    </div>
                    <div className="bg-gray-50 border border-gray-200 rounded-2xl overflow-hidden">
                        <img
                            src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                            alt="Student learning with a tutor"
                            className="w-full h-72 object-cover"
                        />
                        <div className="p-5 flex items-center justify-between">
                            <div>
                                <p className="font-semibold text-gray-900 text-sm">Verified Tutors</p>
                                <p className="text-xs text-gray-500">Background checked & qualified</p>
                            </div>
                            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-full">
                                <CheckCircle2 size={13} className="text-emerald-600" />
                                <span className="text-xs font-medium text-emerald-700">99% satisfaction</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Values */}
                <section className="space-y-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-gray-900 mb-3">What we stand for</h2>
                        <p className="text-gray-500 max-w-lg mx-auto">Three principles guide every decision we make at TuitionsInIndia.</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6">
                        {values.map((val, i) => (
                            <div key={i} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mb-4">
                                    <val.icon size={18} className="text-blue-600" />
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-2">{val.title}</h3>
                                <p className="text-sm text-gray-500 leading-relaxed">{val.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* CTA */}
                <section className="bg-blue-600 rounded-2xl p-10 md:p-14 text-center text-white">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">Ready to get started?</h2>
                    <p className="text-blue-100 text-lg mb-8 max-w-lg mx-auto">
                        Join thousands of students and tutors already using TuitionsInIndia.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link
                            href="/search"
                            className="px-6 py-3 bg-white text-blue-600 rounded-xl font-semibold text-sm hover:bg-blue-50 transition-colors"
                        >
                            Find a Tutor
                        </Link>
                        <Link
                            href="/pricing/student"
                            className="px-6 py-3 bg-blue-700 text-white rounded-xl font-semibold text-sm hover:bg-blue-800 transition-colors border border-blue-500"
                        >
                            View Pricing
                        </Link>
                    </div>
                </section>
            </div>
        </div>
    );
}
