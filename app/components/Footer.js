"use client";

import Link from "next/link";
import { ShieldCheck, Facebook, Twitter, Linkedin, Instagram, ArrowRight } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-white border-t border-gray-100 py-20 md:py-24 overflow-hidden relative">
            {/* Background Accent */}
            <div className="absolute -bottom-64 -right-64 size-[600px] bg-blue-600/5 rounded-full blur-[150px] -z-0"></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 lg:gap-24 mb-20 pb-20 border-b border-gray-100">
                    <div className="space-y-8 col-span-1 md:col-span-2 lg:col-span-1">
                        <Link href="/" className="flex items-center gap-3">
                             <img src="/logo.png" alt="TuitionsInIndia Logo" className="h-10 w-auto" />
                        </Link>
                        <p className="text-gray-400 text-sm font-medium leading-relaxed italic max-w-sm">
                            India's premier academic matchmaking engine, architecting connections between verified faculty and elite learning legacies through neural-match precision.
                        </p>
                        <div className="flex items-center gap-6">
                            {[Facebook, Twitter, Linkedin, Instagram].map((Icon, i) => (
                                <a key={i} href="#" className="text-gray-300 hover:text-blue-600 transition-all transform hover:-translate-y-1">
                                    <Icon size={20} strokeWidth={1.5} />
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-8">
                        <h4 className="text-xs font-black uppercase tracking-[0.4em] text-gray-900 mb-8 italic">Matchmaking Hub</h4>
                        <nav className="flex flex-col gap-4">
                            {[
                                { name: "Find Expert Tutors", href: "/search?role=TUTOR" },
                                { name: "Discover Student Leads", href: "/search?role=STUDENT" },
                                { name: "How Methodology Works", href: "/#methodology" },
                                { name: "Academic Subjects", href: "/subjects" },
                                { name: "Tutor Verification", href: "/kb/tutor" }
                            ].map((link, i) => (
                                <Link 
                                    key={i} 
                                    href={link.href} 
                                    className="text-xs font-black uppercase tracking-widest text-gray-400 hover:text-blue-600 transition-all flex items-center justify-between group"
                                >
                                    {link.name} <ArrowRight size={12} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                                </Link>
                            ))}
                        </nav>
                    </div>

                    <div className="space-y-8">
                        <h4 className="text-xs font-black uppercase tracking-[0.4em] text-gray-900 mb-8 italic">Institutional Nodes</h4>
                        <nav className="flex flex-col gap-4">
                            {[
                                { name: "Academy Directory", href: "/categories" },
                                { name: "Institute Solutions", href: "/how-it-works/institute" },
                                { name: "Pricing Models", href: "/pricing/tutor" },
                                { name: "Academic Blog", href: "/blog" },
                                { name: "Contact Us", href: "/contact" }
                            ].map((link, i) => (
                                <Link 
                                    key={i} 
                                    href={link.href} 
                                    className="text-xs font-black uppercase tracking-widest text-gray-400 hover:text-blue-600 transition-all flex items-center justify-between group"
                                >
                                    {link.name} <ArrowRight size={12} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                                </Link>
                            ))}
                        </nav>
                    </div>

                    <div className="space-y-8">
                        <h4 className="text-xs font-black uppercase tracking-[0.4em] text-gray-900 mb-8 italic">Legal Framework</h4>
                        <nav className="flex flex-col gap-4">
                            {[
                                { name: "Privacy Policy", href: "/legal/privacy" },
                                { name: "Terms of Engagement", href: "/legal/terms" },
                                { name: "Cookie Security", href: "/legal/cookies" },
                                { name: "Network Integrity", href: "/about" }
                            ].map((link, i) => (
                                <Link 
                                    key={i} 
                                    href={link.href} 
                                    className="text-xs font-black uppercase tracking-widest text-gray-400 hover:text-blue-600 transition-all flex items-center justify-between group"
                                >
                                    {link.name} <ArrowRight size={12} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                                </Link>
                            ))}
                        </nav>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center gap-10 pt-10">
                    <div className="flex items-center gap-4">
                        <div className="size-12 rounded-2xl bg-gray-50 flex items-center justify-center text-blue-600 shadow-inner">
                            <ShieldCheck size={28} strokeWidth={1.5} />
                        </div>
                        <div className="space-y-1">
                            <p className="text-gray-300 text-xs font-black uppercase tracking-[0.3em] leading-none">© 2026 TuitionsInIndia Network</p>
                            <p className="text-gray-400 text-xs font-black uppercase tracking-tight italic">Institutional Grade Discovery System v5.0</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-8 opacity-40 grayscale hover:opacity-100 hover:grayscale-0 transition-all cursor-pointer">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/Razorpay_logo.svg" alt="Razorpay Security" className="h-5 w-auto" />
                    </div>
                </div>
            </div>
        </footer>
    );
}
