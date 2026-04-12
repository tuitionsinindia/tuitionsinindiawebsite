"use client";

import Link from "next/link";
import { 
    Building2, 
    ShieldCheck, 
    Users, 
    BarChart3, 
    ArrowRight,
    Globe,
    Zap,
    Lock
} from "lucide-react";

export default function InstituteHowItWorks() {
    const steps = [
        {
            step: "01",
            title: "Register Your Institute",
            desc: "Create a profile for your coaching centre or academy, highlighting your courses, faculty, and locations.",
            icon: Building2,
            color: "text-blue-600",
            bg: "bg-blue-50/50"
        },
        {
            step: "02",
            title: "Institutional Audit",
            desc: "Submit registration credentials for verification. Earn the trusted 'Verified Institute' seal for high-fidelity discovery.",
            icon: ShieldCheck,
            color: "text-emerald-600",
            bg: "bg-emerald-50/50"
        },
        {
            step: "03",
            title: "Get Discovered",
            desc: "Appear at the top of local search results. Verified institutes are prioritised and shown to more students in your area.",
            icon: Globe,
            color: "text-indigo-600",
            bg: "bg-indigo-50/50"
        },
        {
            step: "04",
            title: "Track & Grow",
            desc: "Monitor enquiries and profile performance. Use your dashboard analytics to grow student intake over time.",
            icon: BarChart3,
            color: "text-blue-600",
            bg: "bg-blue-50/50"
        }
    ];

    const faqs = [
        { q: "What type of institutes can register?", a: "Any coaching centre, tuition academy, training institute, or school can register. Whether you offer a single subject or a full curriculum, you are welcome." },
        { q: "Can I list multiple branches?", a: "Yes. You can add multiple branch locations under a single institute profile, making it easy for students in different areas to find you." },
        { q: "How does the pricing work?", a: "Listing your institute is free. You can optionally purchase premium placement credits to boost your visibility in search results and attract more enquiries." }
    ];

    return (
        <div className="snap-container bg-white text-gray-900 antialiased selection:bg-blue-200">
            
            {/* Hero Section */}
            <section className="snap-section px-6 relative text-center">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sky-100/30 blur-[120px] rounded-full -z-10 animate-pulse"></div>
                
                <div className="max-w-4xl mx-auto">
                    <div className="inline-flex items-center gap-3 px-4 py-2 bg-blue-50 rounded-full border border-blue-100 mb-8">
                        <Users size={14} className="text-blue-600" />
                        <span className="text-blue-700 text-xs font-black uppercase tracking-[0.3em]">For Institutes</span>
                    </div>

                    <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-10 leading-[0.9] uppercase italic text-gray-900">
                        Grow your <br />
                        <span className="text-blue-600 font-serif lowercase tracking-normal not-italic px-4">institute's</span> reach.
                    </h1>

                    <p className="text-lg md:text-xl text-gray-500 font-medium max-w-2xl mx-auto mb-12 leading-relaxed italic">
                        List your coaching centre or academy on India's fastest-growing tuition directory and fill your classrooms.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/register/institute" className="px-10 py-5 bg-blue-600 text-white rounded-2xl font-black shadow-2xl shadow-blue-600/30 hover:bg-black active:scale-95 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-xs">
                            Register Your Institute <ArrowRight size={20} />
                        </Link>
                    </div>
                </div>
                
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-20">
                    <div className="w-px h-12 bg-gray-400"></div>
                </div>
            </section>

            {/* Steps - Procedural Layout */}
            {steps.map((item, i) => (
                <section key={i} className="snap-section px-6">
                    <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
                        <div className={i % 2 === 0 ? "lg:order-1" : "lg:order-2"}>
                            <div className="flex items-center gap-4 mb-8">
                                <div className="size-16 rounded-3xl bg-gray-900 text-white flex items-center justify-center font-black text-2xl shadow-xl">
                                    {item.step}
                                </div>
                                <div className="h-px w-12 bg-gray-200"></div>
                            </div>
                            
                            <h2 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tighter uppercase italic mb-6 leading-none">
                                {item.title.split(' ')[0]} <br />
                                <span className="text-blue-600">{item.title.split(' ').slice(1).join(' ')}</span>
                            </h2>
                            
                            <p className="text-xl text-gray-500 font-medium leading-relaxed mb-10 italic">
                                {item.desc}
                            </p>
                        </div>
                        
                        <div className={`relative ${i % 2 === 0 ? "lg:order-2" : "lg:order-1"}`}>
                            <div className={`aspect-square rounded-[3rem] ${item.bg} flex items-center justify-center transition-transform hover:scale-105 duration-700 border-2 border-gray-50`}>
                                <item.icon size={120} strokeWidth={1} className={item.color} />
                            </div>
                            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-blue-50 blur-3xl opacity-30 rounded-full"></div>
                        </div>
                    </div>
                </section>
            ))}

            {/* Scale Section */}
            <section className="snap-section px-6">
                <div className="max-w-5xl mx-auto bg-gray-900 rounded-[4rem] p-12 md:p-24 text-center relative overflow-hidden shadow-4xl text-white">
                    <div className="absolute top-0 right-0 p-20 opacity-5 -z-10 rotate-12">
                        <Building2 size={400} />
                    </div>
                    
                    <h2 className="text-4xl md:text-7xl font-black tracking-tighter uppercase italic mb-10 leading-none">
                        Local presence, <span className="text-blue-500 font-serif lowercase tracking-normal not-italic px-4">wider</span> reach.
                    </h2>

                    <p className="text-xl text-gray-400 font-medium mb-12 italic max-w-2xl mx-auto">
                        Connect your branches with students searching nearby. Be the first choice for parents in your city.
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-left border-t border-white/10 pt-12">
                        {[
                            { label: "Category Rank", val: "#1", sub: "Top Institutes" },
                            { label: "Branch Support", val: "Unlimited", sub: "Multi-location" },
                            { label: "Discovery Rate", val: "High", sub: "Verified Boost" }
                        ].map((stat, i) => (
                            <div key={i} className="space-y-1">
                                <p className="text-xs font-black uppercase tracking-widest text-gray-500">{stat.label}</p>
                                <p className="text-3xl font-black text-white">{stat.val}</p>
                                <p className="text-xs font-bold text-blue-500 italic uppercase">{stat.sub}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Area */}
            <section className="snap-section px-6 bg-gray-50">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-black tracking-tighter uppercase italic text-gray-900">Frequently Asked <span className="text-blue-600">Questions</span></h2>
                    </div>
                    
                    <div className="grid gap-6">
                        {faqs.map((faq, i) => (
                            <div key={i} className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm group hover:shadow-xl transition-all hover:border-blue-100">
                                <h3 className="font-black text-gray-900 text-xl mb-4 italic flex items-center gap-4">
                                    <span className="text-blue-600 font-serif text-2xl lowercase">q.</span> {faq.q}
                                </h3>
                                <p className="text-gray-500 font-medium leading-relaxed pl-12 italic">
                                    {faq.a}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
