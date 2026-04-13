"use client";

import Link from "next/link";
import {
    Search,
    ShieldCheck,
    MessageSquare,
    CheckCircle2,
    ArrowRight,
    Lock
} from "lucide-react";

export default function StudentHowItWorks() {
    const steps = [
        {
            step: "01",
            title: "Search for tutors",
            desc: "Browse our directory of verified tutors. Filter by subject, grade level, and your city to find local or online tutors that match your needs.",
            icon: Search,
            color: "text-blue-600",
            bg: "bg-blue-50"
        },
        {
            step: "02",
            title: "Check their profile",
            desc: "Every profile includes verified qualifications, teaching experience, and genuine student reviews. You always know exactly who you are learning from.",
            icon: ShieldCheck,
            color: "text-emerald-600",
            bg: "bg-emerald-50"
        },
        {
            step: "03",
            title: "Connect and chat",
            desc: "Once you find a match, unlock their contact details to chat directly. Discuss your goals, schedule, and fees with no middleman involved.",
            icon: MessageSquare,
            color: "text-indigo-600",
            bg: "bg-indigo-50"
        },
        {
            step: "04",
            title: "Start learning",
            desc: "Meet online or in person. Start improving your grades with structured, personalised attention from qualified tutors across India.",
            icon: CheckCircle2,
            color: "text-blue-600",
            bg: "bg-blue-50"
        }
    ];

    const faqs = [
        { q: "Is it free to search for tutors?", a: "Yes, browsing and searching through our directory of verified tutors and institutes is completely free. You only pay when you are ready to unlock a tutor's contact details." },
        { q: "How do I know the tutors are qualified?", a: "We verify every tutor manually. Our team checks educational certificates and ID proofs before granting a Verified badge on the profile." },
        { q: "Do you take a percentage of the tuition fees?", a: "No. Unlike other platforms, we do not take any commission from the fees you pay your tutor. You negotiate and pay them directly." }
    ];

    return (
        <div className="bg-white text-gray-900 antialiased">

            {/* Hero Section */}
            <section className="px-6 py-24 text-center bg-gray-50 border-b border-gray-100">
                <div className="max-w-3xl mx-auto">
                    <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-4 py-2 rounded-full mb-6 inline-block">
                        For students and parents
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-gray-900 leading-tight">
                        How TuitionsInIndia works for students
                    </h1>
                    <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
                        Find a verified tutor, check their profile, and start learning — all in a few simple steps.
                    </p>
                    <Link href="/search?role=TUTOR" className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold shadow-sm hover:bg-blue-700 active:scale-95 transition-all text-sm">
                        Search tutors <ArrowRight size={18} />
                    </Link>
                </div>
            </section>

            {/* Steps */}
            <section className="px-6 py-20">
                <div className="max-w-5xl mx-auto space-y-16">
                    {steps.map((item, i) => (
                        <div key={i} className="grid lg:grid-cols-2 gap-10 items-center">
                            <div className={i % 2 === 0 ? "lg:order-1" : "lg:order-2"}>
                                <div className="flex items-center gap-3 mb-5">
                                    <div className="size-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                                        {item.step}
                                    </div>
                                    <div className="h-px w-10 bg-gray-200"></div>
                                </div>
                                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight mb-4">
                                    {item.title}
                                </h2>
                                <p className="text-gray-500 text-lg leading-relaxed">
                                    {item.desc}
                                </p>
                            </div>
                            <div className={`relative ${i % 2 === 0 ? "lg:order-2" : "lg:order-1"}`}>
                                <div className={`aspect-square rounded-2xl ${item.bg} flex items-center justify-center border border-gray-100`}>
                                    <item.icon size={100} strokeWidth={1.2} className={item.color} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Trust Section */}
            <section className="px-6 py-16 bg-gray-50 border-t border-gray-100">
                <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-gray-200 p-10 md:p-16 text-center shadow-sm">
                    <div className="size-14 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-6">
                        <ShieldCheck size={28} className="text-blue-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 tracking-tight mb-4">
                        Every tutor is manually verified
                    </h2>
                    <p className="text-gray-500 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
                        We check ID proof and qualifications before giving any tutor a Verified badge. You can always trust who you are connecting with.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left border-t border-gray-100 pt-10">
                        {[
                            { label: "ID check", val: "100%", sub: "Government verified" },
                            { label: "Degree check", val: "Manual", sub: "Reviewed by our team" },
                            { label: "Trust score", val: "High", sub: "Based on reviews" }
                        ].map((stat, i) => (
                            <div key={i} className="space-y-1">
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{stat.label}</p>
                                <p className="text-2xl font-bold text-gray-900">{stat.val}</p>
                                <p className="text-sm text-blue-600 font-medium">{stat.sub}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="px-6 py-20">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-10 text-center">
                        Frequently asked questions
                    </h2>
                    <div className="space-y-4">
                        {faqs.map((faq, i) => (
                            <div key={i} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:border-blue-200 transition-all">
                                <h3 className="font-semibold text-gray-900 text-lg mb-3">{faq.q}</h3>
                                <p className="text-gray-500 leading-relaxed">
                                    {faq.a}
                                </p>
                            </div>
                        ))}
                    </div>
                    <div className="mt-12 text-center flex items-center justify-center gap-2 text-xs text-gray-400">
                        <Lock size={12} /> Your data is secure
                    </div>
                </div>
            </section>
        </div>
    );
}
