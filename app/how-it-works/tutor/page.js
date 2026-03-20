"use client";

import Link from "next/link";

export default function TutorHowItWorks() {
    return (
        <div className="min-h-screen bg-white font-sans flex flex-col pt-32">
            {/* Hero Section */}
            <section className="py-24 px-4 bg-slate-50 border-b border-slate-100">
                <div className="max-w-7xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 text-primary text-[10px] font-bold tracking-widest uppercase mb-6">
                        For Educators & Coaching Centers
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 tracking-tight">
                        Grow your <span className="text-primary">Teaching Career</span>
                    </h1>
                    <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
                        Join India's most trusted network of educators. Get high-quality leads, manage your schedule, and build your digital presence.
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
                                title: "Create Your Expert Profile",
                                desc: "List your subjects, experience, and certifications. A detailed profile with professional photos and clear descriptions attracts 5x more students.",
                                icon: "person_add",
                                color: "bg-blue-50 text-blue-600"
                            },
                            {
                                step: "02",
                                title: "Complete Verification",
                                desc: "Upload your ID and academic documents. Verified tutors get a 'Trusted' badge and are prioritized in search results and AI matchmaking.",
                                icon: "shield",
                                color: "bg-emerald-50 text-emerald-600"
                            },
                            {
                                step: "03",
                                title: "Receive & Manage Leads",
                                desc: "Respond to student inquiries instantly through our messaging hub. Set your own rates and schedule sessions that work for you.",
                                icon: "chat_bubble",
                                color: "bg-amber-50 text-amber-600"
                            },
                            {
                                step: "04",
                                title: "Start Teaching & Earning",
                                desc: "Deliver high-quality education and build your reputation. Get paid securely and receive glowing reviews to attract even more students.",
                                icon: "payments",
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

                    <div className="mt-20 p-12 bg-slate-900 rounded-[3rem] text-white text-center shadow-2xl relative overflow-hidden">
                        <div className="relative z-10">
                            <h2 className="text-3xl font-bold mb-6">Start your journey today</h2>
                            <p className="text-white/40 font-medium mb-10 max-w-lg mx-auto">Help shape the future of India's students while building a sustainable and profitable teaching business.</p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link href="/get-started" className="px-10 py-5 bg-primary text-white font-bold rounded-2xl hover:opacity-90 transition-all uppercase tracking-widest text-xs">Join as a Tutor</Link>
                                <Link href="/get-started" className="px-10 py-5 bg-white/10 text-white font-bold rounded-2xl border-2 border-white/20 hover:bg-white/20 transition-all uppercase tracking-widest text-xs">Register Coaching Center</Link>
                            </div>
                        </div>
                        <div className="absolute top-0 right-0 size-64 bg-primary/20 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-24 px-4 bg-slate-50">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-16">Why teach with Tuitions in India?</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { title: "Maximum Visibility", desc: "Our platform reaches millions of students searching for your expertise.", icon: "visibility" },
                            { title: "AI-Powered Matching", desc: "We connect you with students who best fit your teaching style and pace.", icon: "auto_awesome" },
                            { title: "Secure Payments", desc: "Manage your earnings with our transparent and reliable payment system.", icon: "lock" }
                        ].map((benefit, idx) => (
                            <div key={idx} className="bg-white p-10 rounded-3xl border border-slate-100 shadow-sm text-center">
                                <span className="material-symbols-outlined text-primary text-4xl mb-6">{benefit.icon}</span>
                                <h4 className="font-bold text-slate-900 mb-4">{benefit.title}</h4>
                                <p className="text-slate-500 text-sm font-medium leading-relaxed">{benefit.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
