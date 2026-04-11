"use client";

import Link from "next/link";
import { 
    Search, 
    ShieldCheck, 
    MessageSquare, 
    CheckCircle2, 
    ArrowRight,
    XCircle,
    Lock
} from "lucide-react";

export default function StudentHowItWorks() {
    const steps = [
        {
            step: "01",
            title: "Search for Instructors",
            desc: "Browse our directory of verified experts. Filter by subject, grade level, and your city to find local or online tutors that match your needs.",
            icon: Search,
            color: "text-blue-600",
            bg: "bg-blue-50/50"
        },
        {
            step: "02",
            title: "Review Credentials",
            desc: "Every profile includes verified qualifications, teaching experience, and genuine student reviews. You always know exactly who you're learning from.",
            icon: ShieldCheck,
            color: "text-emerald-600",
            bg: "bg-emerald-50/50"
        },
        {
            step: "03",
            title: "Connect & Chat",
            desc: "Once you find a match, unlock their contact details to chat directly. Discuss your learning goals, schedule, and finalize fees with zero middleman costs.",
            icon: MessageSquare,
            color: "text-indigo-600",
            bg: "bg-indigo-50/50"
        },
        {
            step: "04",
            title: "Start Learning",
            desc: "Meet online or in-person. Start improving your grades and understanding with structured, personalized attention from India's best faculty.",
            icon: CheckCircle2,
            color: "text-blue-600",
            bg: "bg-blue-50/50"
        }
    ];

    const faqs = [
        { q: "Is it free to search for tutors?", a: "Yes, browsing and searching through our directory of verified tutors and institutes is completely free. You only unlock contacts when you are ready to reach out." },
        { q: "How do I know the tutors are qualified?", a: "We maintain a rigorous verification system. Our team manually checks educational certificates and ID proofs before granting a 'Verified' badge." },
        { q: "Do you take a percentage of the tuition fees?", a: "No! Unlike other platforms, we do not take a commission from the fees you pay to your tutor. You negotiate and pay them directly." }
    ];

    return (
        <div className="snap-container bg-white text-gray-900 antialiased selection:bg-blue-200">
            
            {/* Hero Section */}
            <section className="snap-section px-6 relative text-center">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-100/30 blur-[120px] rounded-full -z-10 animate-pulse"></div>
                
                <div className="max-w-4xl mx-auto">
                    <span className="bg-blue-100 text-blue-700 text-xs font-black px-4 py-2 rounded-full uppercase tracking-[0.3em] mb-8 inline-block">
                        Student Mandate
                    </span>
                    
                    <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-10 leading-[0.9] uppercase italic text-gray-900">
                        Academic <br />
                        <span className="text-blue-600">Acceleration.</span>
                    </h1>
                    
                    <p className="text-lg md:text-xl text-gray-500 font-medium max-w-2xl mx-auto mb-12 leading-relaxed italic">
                        The elite matching architecture for precision learning. Connect directly with India's most qualified academic professionals.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/search?role=TUTOR" className="px-10 py-5 bg-blue-600 text-white rounded-2xl font-black shadow-2xl shadow-blue-600/30 hover:bg-black active:scale-95 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-xs">
                            Initiate Discovery <ArrowRight size={20} />
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
                            <div className={`aspect-square rounded-[3rem] ${item.bg} flex items-center justify-center transition-transform hover:scale-105 duration-700`}>
                                <item.icon size={120} strokeWidth={1} className={item.color} />
                            </div>
                            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gray-100 blur-3xl opacity-50 rounded-full"></div>
                        </div>
                    </div>
                </section>
            ))}

            {/* Security Section */}
            <section className="snap-section px-6">
                <div className="max-w-5xl mx-auto bg-gray-900 rounded-[4rem] p-12 md:p-24 text-center relative overflow-hidden shadow-4xl text-white">
                    <div className="absolute top-0 right-0 p-20 opacity-5 -z-10 rotate-12">
                        <ShieldCheck size={400} />
                    </div>
                    
                    <h2 className="text-4xl md:text-7xl font-black tracking-tighter uppercase italic mb-10 leading-none">
                        Zero <span className="text-blue-500 font-serif lowercase tracking-normal not-italic px-4">risk</span> Verification.
                    </h2>
                    
                    <p className="text-xl text-gray-400 font-medium mb-12 italic max-w-2xl mx-auto">
                        Every educator on our platform undergoes a multi-factor credential audit. We prioritize pedigree and academic integrity.
                    </p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-left border-t border-white/10 pt-12">
                        {[
                            { label: "Identity Audit", val: "100%", sub: "Govt Verified" },
                            { label: "Degree Verification", val: "Manual", sub: "Expert Rev" },
                            { label: "Trust Score", val: "High", sub: "Algorithmic" }
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

            {/* FAQ Strategy Section */}
            <section className="snap-section px-6 bg-gray-50">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-black tracking-tighter uppercase italic text-gray-900">Protocol <span className="text-blue-600">FAQ</span></h2>
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
                    <Lock size={12} strokeWidth={3} /> Standard Security Protocols Active
                </div>
            </section>
        </div>
    );
}
