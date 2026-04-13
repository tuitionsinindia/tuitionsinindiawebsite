"use client";

import Link from 'next/link';
import { Users, Globe, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function AboutPage() {
    const stats = [
        { label: "Tutors listed", value: "10,000+" },
        { label: "Student connections", value: "50,000+" },
        { label: "Cities covered", value: "543+" },
        { label: "Average rating", value: "4.9 / 5" },
    ];

    const values = [
        {
            title: "Verified tutors",
            desc: "Every tutor on our platform is verified before being listed, so you can connect with confidence.",
            icon: ShieldCheck,
        },
        {
            title: "Zero commission",
            desc: "We never take a cut of tutor fees. What you agree with your tutor is what you pay — nothing more.",
            icon: CheckCircle2,
        },
        {
            title: "Direct connections",
            desc: "Students and tutors connect directly. No middlemen, no delays — just good teaching relationships.",
            icon: Users,
        },
    ];

    return (
        <div className="bg-white min-h-screen pt-24 pb-20">
            <main className="max-w-5xl mx-auto px-6 space-y-20">

                {/* Hero */}
                <section className="text-center max-w-3xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
                        Connecting students with the right tutors across India
                    </h1>
                    <p className="text-lg text-gray-500 leading-relaxed">
                        TuitionsinIndia is a free platform where students and parents can find verified tutors for home tuition, online classes, and coaching. We believe good education should be easy to access — no commissions, no barriers.
                    </p>
                </section>

                {/* Stats */}
                <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {stats.map((stat, i) => (
                        <div key={i} className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-center">
                            <p className="text-3xl font-bold text-blue-600 mb-1">{stat.value}</p>
                            <p className="text-sm text-gray-500">{stat.label}</p>
                        </div>
                    ))}
                </section>

                {/* Our story */}
                <section className="grid lg:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Why we built this</h2>
                        <p className="text-gray-500 leading-relaxed mb-4">
                            Finding a good tutor used to mean asking around, calling coaching centres, and hoping someone could help. We wanted to make it simple — search by subject, location, and grade, then connect directly with tutors who are the right fit.
                        </p>
                        <p className="text-gray-500 leading-relaxed mb-6">
                            Geography shouldn't limit learning. Whether you're in a metro city or a smaller town, you deserve access to a great tutor.
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <Link href="/search" className="px-5 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm">
                                Find a tutor
                            </Link>
                            <Link href="/register/tutor" className="px-5 py-2.5 bg-white text-gray-700 rounded-lg font-semibold border border-gray-200 hover:bg-gray-50 transition-colors text-sm">
                                Join as a tutor
                            </Link>
                        </div>
                    </div>
                    <div className="bg-gray-50 rounded-2xl overflow-hidden border border-gray-200">
                        <img
                            src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                            alt="Tutor teaching a student"
                            className="w-full h-64 object-cover"
                        />
                    </div>
                </section>

                {/* Values */}
                <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-8">What we stand for</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        {values.map((val, i) => (
                            <div key={i} className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                                <div className="size-10 rounded-lg bg-blue-50 flex items-center justify-center mb-4">
                                    <val.icon size={20} className="text-blue-600" />
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-2">{val.title}</h3>
                                <p className="text-sm text-gray-500 leading-relaxed">{val.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* CTA */}
                <section className="bg-blue-600 rounded-2xl p-10 text-center text-white">
                    <h2 className="text-2xl font-bold mb-3">Ready to get started?</h2>
                    <p className="text-blue-100 mb-6">Search for tutors near you — it's free.</p>
                    <div className="flex flex-wrap justify-center gap-3">
                        <Link href="/search" className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors text-sm">
                            Find a tutor
                        </Link>
                        <Link href="/pricing/student" className="bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors text-sm border border-blue-500">
                            View pricing
                        </Link>
                    </div>
                </section>

            </main>
        </div>
    );
}
