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
    Zap,
    Lock
} from "lucide-react";

export default function TutorHowItWorks() {
    const steps = [
        {
            step: "01",
            title: "Architect Your Profile",
            desc: "Sign up and build a high-fidelity profile highlighting your subjects, teaching experience, and service areas.",
            icon: UserPlus,
            color: "text-blue-600",
            bg: "bg-blue-50/50"
        },
        {
            step: "02",
            title: "Credential Audit",
            desc: "Complete our quick KYC process by submitting your ID and academic certificates. Earn the elite 'Verified' status badge.",
            icon: ShieldCheck,
            color: "text-emerald-600",
            bg: "bg-emerald-50/50"
        },
        {
            step: "03",
            title: "Pipeline Enquiries",
            desc: "Get notified instantly via our matching engine when students search for your exact expertise in your preferred zones.",
            icon: BellRing,
            color: "text-purple-600",
            bg: "bg-purple-50/50"
        },
        {
            step: "04",
            title: "Direct Monetization",
            desc: "Chat with students, finalize terms, and teach. We operate a zero-commission protocol—you keep 100% of your value.",
            icon: TrendingUp,
            color: "text-blue-600",
            bg: "bg-blue-50/50"
        }
    ];

    const faqs = [
        { q: "Is there a commission on the tuition fees?", a: "Absolutely not. We do not take a percentage of your earnings. You negotiate your fees directly with the student or parent." },
        { q: "Why should I get verified?", a: "Verified tutors show up higher in search results and receive significantly more student inquiries because parents trust profiles with our safety badge." },
        { q: "Can I teach both online and offline?", a: "Yes. When building your profile, you can specify if you are willing to travel to the student's home, teach at your own location, or conduct online classes." }
    ];

    return (
        <div className="snap-container bg-white text-gray-900 antialiased selection:bg-blue-200">
            
            {/* Hero Section */}
            <section className="snap-section px-6 relative text-center">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-100/30 blur-[120px] rounded-full -z-10 animate-pulse"></div>
                
                <div className="max-w-4xl mx-auto">
                    <div className="inline-flex items-center gap-3 px-4 py-2 bg-blue-50 rounded-full border border-blue-100 mb-8">
                        <Zap size={14} className="text-blue-600" />
                        <span className="text-blue-700 text-xs font-black uppercase tracking-[0.3em]">How It Works for Tutors</span>
                    </div>
                    
                    <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-10 leading-[0.9] uppercase italic text-gray-900">
                        Pedagogical <br />
                        <span className="text-blue-600 font-serif lowercase tracking-normal not-italic px-4">uncompromised</span> profit.
                    </h1>
                    
                    <p className="text-lg md:text-xl text-gray-500 font-medium max-w-2xl mx-auto mb-12 leading-relaxed italic">
                        Stop paying agency tolls. Deploy your expertise on India's most advanced academic matchmaking infrastructure.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/register/tutor" className="px-10 py-5 bg-blue-600 text-white rounded-2xl font-black shadow-2xl shadow-blue-600/30 hover:bg-black active:scale-95 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-xs">
                            Create Tutor Profile <ArrowRight size={20} />
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
                        <div className={i % 2 !== 0 ? "lg:order-2" : "lg:order-1"}>
                            <div className="flex items-center gap-4 mb-8">
                                <div className="size-16 rounded-3xl bg-blue-600 text-white flex items-center justify-center font-black text-2xl shadow-xl">
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
                        
                        <div className={`relative ${i % 2 !== 0 ? "lg:order-1" : "lg:order-2"}`}>
                            <div className={`aspect-square rounded-[3rem] ${item.bg} border-2 border-gray-50 flex items-center justify-center transition-transform hover:scale-105 duration-700`}>
                                <item.icon size={120} strokeWidth={1} className={item.color} />
                            </div>
                            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-blue-50 blur-3xl opacity-30 rounded-full"></div>
                        </div>
                    </div>
                </section>
            ))}

            {/* Verification Section */}
            <section className="snap-section px-6">
                <div className="max-w-5xl mx-auto bg-gray-900 rounded-[4rem] p-12 md:p-24 text-center relative overflow-hidden shadow-4xl text-white">
                    <div className="absolute top-0 right-0 p-20 opacity-5 -z-10 rotate-12">
                        <Award size={400} />
                    </div>
                    
                    <h2 className="text-4xl md:text-7xl font-black tracking-tighter uppercase italic mb-10 leading-none">
                        Certified <span className="text-blue-500 font-serif lowercase tracking-normal not-italic px-4">authority</span> Pipeline.
                    </h2>
                    
                    <p className="text-xl text-gray-400 font-medium mb-12 italic max-w-2xl mx-auto">
                        Earn the trust of thousands of parents. Our verification engine is the industry standard for academic credentialing.
                    </p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-left border-t border-white/10 pt-12">
                        {[
                            { label: "Trust Index", val: "9.8/10", sub: "Parent Rating" },
                            { label: "Lead Velocity", val: "4.5x", sub: "Verified Edge" },
                            { label: "Revenue Share", val: "100%", sub: "Zero Margin" }
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

            {/* FAQ Section */}
            <section className="snap-section px-6 bg-gray-50">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-black tracking-tighter uppercase italic text-gray-900">Tutor <span className="text-blue-600">FAQ</span></h2>
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
                <div className="mt-20 text-center flex items-center justify-center gap-2 text-xs font-black text-gray-300 uppercase tracking-[0.5em]">
                    <Lock size={12} strokeWidth={3} /> Your data is secure
                </div>
            </section>
        </div>
    );
}
