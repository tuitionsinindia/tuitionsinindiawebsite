"use client";

import Link from "next/link";
import {
    UserPlus,
    ShieldCheck,
    BellRing,
    TrendingUp,
    ArrowRight,
    Award,
    Star,
    Lock
} from "lucide-react";

export default function TutorHowItWorks() {
    const steps = [
        {
            step: "01",
            title: "Create Your Profile",
            desc: "Sign up and build your profile with your subjects, teaching experience, and areas you can teach in.",
            icon: UserPlus,
            color: "text-blue-600",
            bg: "bg-blue-50"
        },
        {
            step: "02",
            title: "Get Verified",
            desc: "Complete a quick KYC check by submitting your ID and certificates. Earn the 'Verified' badge on your profile.",
            icon: ShieldCheck,
            color: "text-emerald-600",
            bg: "bg-emerald-50"
        },
        {
            step: "03",
            title: "Receive Student Enquiries",
            desc: "Get notified when students in your area search for the subjects you teach.",
            icon: BellRing,
            color: "text-purple-600",
            bg: "bg-purple-50"
        },
        {
            step: "04",
            title: "Start Teaching",
            desc: "Chat with students, agree on fees, and start teaching. We charge zero commission — you keep 100% of your earnings.",
            icon: TrendingUp,
            color: "text-blue-600",
            bg: "bg-blue-50"
        }
    ];

    const faqs = [
        { q: "Is there a commission on the tuition fees?", a: "No. We do not take a percentage of your earnings. You negotiate your fees directly with the student or parent." },
        { q: "Why should I get verified?", a: "Verified tutors show up higher in search results and receive more student enquiries because parents trust profiles with the verified badge." },
        { q: "Can I teach both online and offline?", a: "Yes. When building your profile, you can specify if you're willing to travel to the student's home, teach at your own location, or conduct online classes." }
    ];

    return (
        <div className="snap-container bg-white text-gray-900 antialiased">

            {/* Hero Section */}
            <section className="snap-section px-6 relative text-center">
                <div className="max-w-3xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full border border-blue-100 mb-8">
                        <Star size={14} className="text-blue-600" />
                        <span className="text-blue-700 text-sm font-semibold">How It Works for Tutors</span>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-8 leading-tight text-gray-900">
                        Teach on your terms.<br />
                        <span className="text-blue-600">Keep all your earnings.</span>
                    </h1>

                    <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
                        Stop paying agency fees. List your profile on India's largest tutoring platform for free. Connect directly with students near you.
                    </p>

                    <Link href="/register/tutor" className="inline-flex px-8 py-4 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-sm hover:bg-blue-700 active:scale-[0.98] transition-all items-center gap-3">
                        Sign Up as Tutor <ArrowRight size={18} />
                    </Link>
                </div>
            </section>

            {/* Steps */}
            {steps.map((item, i) => (
                <section key={i} className="snap-section px-6">
                    <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
                        <div className={i % 2 !== 0 ? "lg:order-2" : "lg:order-1"}>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="size-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                                    {item.step}
                                </div>
                                <div className="h-px w-8 bg-gray-200"></div>
                            </div>

                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-4">
                                {item.title}
                            </h2>

                            <p className="text-lg text-gray-500 leading-relaxed mb-8">
                                {item.desc}
                            </p>
                        </div>

                        <div className={`relative ${i % 2 !== 0 ? "lg:order-1" : "lg:order-2"}`}>
                            <div className={`aspect-square rounded-2xl ${item.bg} border border-gray-100 flex items-center justify-center transition-transform hover:scale-105 duration-500`}>
                                <item.icon size={100} strokeWidth={1} className={item.color} />
                            </div>
                        </div>
                    </div>
                </section>
            ))}

            {/* Verification Section */}
            <section className="snap-section px-6">
                <div className="max-w-4xl mx-auto bg-gray-900 rounded-2xl p-8 md:p-12 text-center relative overflow-hidden text-white">
                    <div className="absolute top-0 right-0 p-12 opacity-5 -z-10 rotate-12">
                        <Award size={300} />
                    </div>

                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
                        Build trust with parents
                    </h2>

                    <p className="text-lg text-gray-400 mb-10 max-w-2xl mx-auto">
                        Get verified and show up higher in search results. Parents trust tutors with verified profiles.
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-left border-t border-white/10 pt-8">
                        {[
                            { label: "Parent Rating", val: "9.8/10", sub: "Average score" },
                            { label: "More Enquiries", val: "4.5x", sub: "With verified badge" },
                            { label: "Your Earnings", val: "100%", sub: "Zero commission" }
                        ].map((stat, i) => (
                            <div key={i} className="space-y-1">
                                <p className="text-xs font-semibold text-gray-500">{stat.label}</p>
                                <p className="text-2xl font-bold text-white">{stat.val}</p>
                                <p className="text-xs font-medium text-blue-400">{stat.sub}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="snap-section px-6 bg-gray-50">
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900">Frequently Asked <span className="text-blue-600">Questions</span></h2>
                    </div>

                    <div className="grid gap-4">
                        {faqs.map((faq, i) => (
                            <div key={i} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
                                <h3 className="font-bold text-gray-900 text-lg mb-3">
                                    {faq.q}
                                </h3>
                                <p className="text-gray-500 leading-relaxed text-sm">
                                    {faq.a}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="mt-12 text-center flex items-center justify-center gap-2 text-xs font-semibold text-gray-400">
                    <Lock size={12} /> Your data is secure
                </div>
            </section>
        </div>
    );
}
