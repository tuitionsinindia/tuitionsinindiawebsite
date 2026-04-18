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
    Lock,
    PlayCircle
} from "lucide-react";

export default function TutorHowItWorks() {
    const steps = [
        {
            step: "01",
            title: "Create your profile",
            desc: "Sign up and build your tutor profile. Add your subjects, teaching experience, qualifications, and the areas you teach in. It is free to list your profile.",
            icon: UserPlus,
            color: "text-blue-600",
            bg: "bg-blue-50"
        },
        {
            step: "02",
            title: "Get verified",
            desc: "Submit your ID and qualification certificates for a one-time review by our team. Once approved, your profile gets a Verified badge that builds trust with students and parents.",
            icon: ShieldCheck,
            color: "text-emerald-600",
            bg: "bg-emerald-50"
        },
        {
            step: "03",
            title: "Accept demo class bookings",
            desc: "Students pay a ₹149 deposit to book a demo class with you. Accept or decline the request from your dashboard. You choose whether to offer the demo free or charge a small fee.",
            icon: PlayCircle,
            color: "text-indigo-600",
            bg: "bg-indigo-50"
        },
        {
            step: "04",
            title: "Receive enquiries and start teaching",
            desc: "Get notified when students send you enquiries directly. Discuss fees, schedule, and learning goals — then start teaching. We charge zero commission. You keep 100% of your earnings.",
            icon: TrendingUp,
            color: "text-blue-600",
            bg: "bg-blue-50"
        }
    ];

    const faqs = [
        { q: "Is there a commission on tuition fees?", a: "No. We do not take a percentage of your earnings. You negotiate your fees directly with the student or parent and they pay you directly." },
        { q: "What is a demo class and how does it work?", a: "A demo class is a short introductory session that lets students try learning with you before committing to regular classes. Students pay a ₹149 refundable deposit to book it. You can choose to mark it as free (the student gets the deposit back as platform credit) or charge for it (you receive ₹119, we keep ₹30 as a platform fee)." },
        { q: "Why should I get verified?", a: "Verified tutors appear higher in search results and receive more student enquiries. Parents trust profiles with a verified badge because it means your qualifications have been reviewed by our team." },
        { q: "Can I teach both online and offline?", a: "Yes. When building your profile, you can specify if you are willing to travel to the student's home, teach at your own location, or conduct online classes — or any combination." }
    ];

    return (
        <div className="bg-white text-gray-900 antialiased">

            {/* Hero Section */}
            <section className="px-6 py-24 text-center bg-gray-50 border-b border-gray-100">
                <div className="max-w-3xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full border border-blue-100 mb-8">
                        <Star size={14} className="text-blue-600" />
                        <span className="text-blue-700 text-sm font-semibold">For tutors</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-gray-900 leading-tight">
                        Teach on your terms.<br />
                        <span className="text-blue-600">Keep all your earnings.</span>
                    </h1>
                    <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
                        List your profile for free. Connect directly with students near you. Zero commission — always.
                    </p>
                    <Link href="/register/tutor" className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold shadow-sm hover:bg-blue-700 active:scale-95 transition-all text-sm">
                        Sign up as a tutor <ArrowRight size={18} />
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
                        <Award size={28} className="text-blue-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 tracking-tight mb-4">
                        Build trust. Earn more.
                    </h2>
                    <p className="text-gray-500 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
                        Verified tutors get more visibility and more student enquiries. Get your badge once — it stays on your profile.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left border-t border-gray-100 pt-10">
                        {[
                            { label: "Listing fee", val: "₹0", sub: "Always free to list" },
                            { label: "Commission", val: "0%", sub: "You keep everything" },
                            { label: "Verified badge", val: "₹999", sub: "One-time review fee" }
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
