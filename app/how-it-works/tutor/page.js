"use client";

import Link from "next/link";
import { 
    UserPlus, 
    ShieldCheck, 
    BellRing, 
    TrendingUp, 
    ArrowRight,
    Star,
    Award
} from "lucide-react";

export default function TutorHowItWorks() {
    const steps = [
        {
            step: "1",
            title: "Create Your Profile",
            desc: "Sign up and build an attractive profile highlighting your subjects, teaching experience, and location constraints.",
            icon: UserPlus,
            color: "text-blue-600",
            bg: "bg-blue-50"
        },
        {
            step: "2",
            title: "Get Verified",
            desc: "Complete our quick KYC process by submitting your ID and educational credentials. Earn the trusted 'Verified' badge.",
            icon: ShieldCheck,
            color: "text-green-600",
            bg: "bg-green-50"
        },
        {
            step: "3",
            title: "Receive Enquiries",
            desc: "Get notified instantly when local or online students search for tutors matching your exact skill set and location.",
            icon: BellRing,
            color: "text-purple-600",
            bg: "bg-purple-50"
        },
        {
            step: "4",
            title: "Grow Your Income",
            desc: "Chat with students, finalize timings, and teach. We don't take any commission from your hard-earned tuition fees.",
            icon: TrendingUp,
            color: "text-blue-600",
            bg: "bg-blue-50"
        }
    ];

    const faqs = [
        { q: "Is there a commission on the tuition fees?", a: "Absolutely not. We do not take a percentage of your earnings. You negotiate your fees directly with the student or parent." },
        { q: "Why should I get verified?", a: "Verified tutors show up higher in search results and receive significantly more student inquiries because parents trust profiles with our safety badge." },
        { q: "Can I teach both online and offline?", a: "Yes. When building your profile, you can specify if you are willing to travel to the student's home, teach at your own location, or conduct online classes." }
    ];

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900 antialiased pt-32 pb-24 selection:bg-blue-200">
            {/* Hero Section */}
            <section className="px-6 relative text-center max-w-5xl mx-auto mb-24">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-blue-100/50 blur-[120px] rounded-full -z-10"></div>
                
                <span className="bg-blue-100 text-blue-700 text-sm font-bold px-4 py-2 rounded-full uppercase tracking-wider mb-6 inline-block">
                    For Independent Tutors
                </span>
                
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-8">
                    Teach More. <br />
                    <span className="text-blue-600">Earn More. Keep 100%.</span>
                </h1>
                
                <p className="text-xl text-gray-600 font-medium max-w-2xl mx-auto mb-10 leading-relaxed">
                    Stop paying agency commissions. Join India's fastest-growing tuition network to connect with students precisely looking for your expertise.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/register/tutor" className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-600/30 hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-2">
                        Create Tutor Profile <ArrowRight size={18} />
                    </Link>
                </div>
            </section>

            {/* Core Workflow */}
            <section className="max-w-6xl mx-auto px-6 mb-32">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold mb-4">How It Works</h2>
                    <p className="text-gray-500 font-medium">Four simple steps to start getting tuition leads.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {steps.map((item, i) => (
                        <div key={i} className="relative bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center group">
                            <div className="absolute -top-5 -left-5 w-12 h-12 bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center justify-center font-black text-gray-900 text-xl z-10">
                                {item.step}
                            </div>
                            
                            <div className={`w-20 h-20 rounded-2xl ${item.bg} ${item.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                <item.icon size={36} strokeWidth={2.5} />
                            </div>
                            
                            <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                            <p className="text-sm font-medium text-gray-500 leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Trust Mechanics */}
            <section className="max-w-6xl mx-auto px-6 mb-32">
                <div className="bg-white rounded-[3rem] p-10 md:p-16 border border-gray-200 flex flex-col lg:flex-row-reverse gap-16 items-center shadow-xl">
                    <div className="lg:w-1/2 space-y-8">
                        <h2 className="text-3xl md:text-4xl font-bold leading-tight">
                            Build Your <br />
                            <span className="text-blue-600">Professional Reputation.</span>
                        </h2>
                        
                        <p className="text-gray-600 font-medium text-lg leading-relaxed">
                            Our platform empowers independent educators with tools previously only available to large agencies.
                        </p>

                        <ul className="space-y-6">
                            {[
                                { title: "Verified Trust Badge", desc: "Show parents you are a certified professional.", icon: Award },
                                { title: "Profile Analytics", desc: "See how many students are viewing your profile.", icon: TrendingUp },
                                { title: "Student Reviews", desc: "Collect testimonials to rank higher in your locality.", icon: Star }
                            ].map((feature, i) => (
                                <li key={i} className="flex gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-blue-600 shrink-0">
                                        <feature.icon size={24} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900 text-lg">{feature.title}</p>
                                        <p className="text-sm text-gray-500 font-medium">{feature.desc}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                    
                    {/* Visual Asset */}
                    <div className="lg:w-1/2 relative w-full">
                        <div className="aspect-square rounded-[3rem] overflow-hidden border border-gray-200 shadow-lg relative bg-gray-100 flex items-center justify-center">
                            <Award size={120} className="text-blue-200 absolute" />
                            <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1571260899304-425dea5e9712?auto=format&fit=crop&w=800&q=80')] bg-cover bg-center opacity-80 mix-blend-overlay"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="max-w-3xl mx-auto px-6">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
                </div>
                
                <div className="space-y-4">
                    {faqs.map((faq, i) => (
                        <div key={i} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                            <h3 className="font-bold text-gray-900 text-lg mb-3 flex items-center gap-3">
                                <span className="text-blue-600">Q.</span> {faq.q}
                            </h3>
                            <p className="text-gray-600 font-medium leading-relaxed pl-8">
                                <span className="text-gray-400 font-bold mr-2">A.</span> {faq.a}
                            </p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
