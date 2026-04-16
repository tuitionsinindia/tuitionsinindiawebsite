"use client";

import Link from "next/link";
import {
    Building2,
    ShieldCheck,
    Users,
    BarChart3,
    ArrowRight,
    Globe,
    Lock
} from "lucide-react";

export default function InstituteHowItWorks() {
    const steps = [
        {
            step: "01",
            title: "Register your institute",
            desc: "Create a profile for your coaching centre or academy. Add your subjects, teaching staff, locations, and a description of what you offer.",
            icon: Building2,
            color: "text-blue-600",
            bg: "bg-blue-50"
        },
        {
            step: "02",
            title: "Get verified",
            desc: "Submit your registration documents for verification. Earn a Verified Institute badge so students and parents can trust your listing.",
            icon: ShieldCheck,
            color: "text-emerald-600",
            bg: "bg-emerald-50"
        },
        {
            step: "03",
            title: "Appear in search results",
            desc: "Your institute will show up when students search for tutors and coaching centres in your area. Verified institutes get higher visibility.",
            icon: Globe,
            color: "text-indigo-600",
            bg: "bg-indigo-50"
        },
        {
            step: "04",
            title: "Track enquiries",
            desc: "View incoming student enquiries and profile visits from your dashboard. Use these insights to understand what students are looking for.",
            icon: BarChart3,
            color: "text-blue-600",
            bg: "bg-blue-50"
        }
    ];

    const faqs = [
        { q: "What type of institutes can register?", a: "Any coaching centre, tuition academy, training institute, or school can register. Whether you offer a single subject or a full curriculum, you are welcome." },
        { q: "Can I list multiple branches?", a: "Yes. You can add multiple branch locations under a single institute profile, making it easy for students in different areas to find you." },
        { q: "How does the pricing work?", a: "Listing your institute is free. You can optionally purchase credits to boost your visibility in search results and attract more enquiries." }
    ];

    return (
        <div className="bg-white text-gray-900 antialiased">

            {/* Hero Section */}
            <section className="px-6 py-24 text-center bg-gray-50 border-b border-gray-100">
                <div className="max-w-3xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full border border-blue-100 mb-6">
                        <Users size={14} className="text-blue-600" />
                        <span className="text-blue-700 text-xs font-semibold">How it works for institutes</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-gray-900 leading-tight">
                        Reach more students with your institute listing
                    </h1>
                    <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
                        List your coaching centre or academy on TuitionsInIndia and connect with students looking for courses in your area.
                    </p>
                    <Link href="/register/institute" className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold shadow-sm hover:bg-blue-700 active:scale-95 transition-all text-sm">
                        Register your institute <ArrowRight size={18} />
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

            {/* Reach Section */}
            <section className="px-6 py-16 bg-gray-50 border-t border-gray-100">
                <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-gray-200 p-10 md:p-16 text-center shadow-sm">
                    <div className="size-14 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-6">
                        <Building2 size={28} className="text-blue-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 tracking-tight mb-4">
                        Grow your student base
                    </h2>
                    <p className="text-gray-500 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
                        Students search for local coaching centres every day. Make sure your institute shows up when they do.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left border-t border-gray-100 pt-10">
                        {[
                            { label: "Search visibility", val: "High", sub: "For verified institutes" },
                            { label: "Branch support", val: "Multiple", sub: "Add all your locations" },
                            { label: "Enquiry tracking", val: "Built-in", sub: "From your dashboard" }
                        ].map((stat, i) => (
                            <div key={i} className="space-y-1">
                                <p className="text-xs font-semibold text-gray-400">{stat.label}</p>
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
                        Questions about listing your institute
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
