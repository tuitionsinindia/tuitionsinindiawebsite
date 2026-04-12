"use client";

import Link from "next/link";
import Image from "next/image";
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
                            <Image src="/logo.png" alt="TuitionsInIndia Logo" width={120} height={40} className="h-10 w-auto" />
                        </Link>
                        <p className="text-gray-400 text-sm font-medium leading-relaxed italic max-w-sm">
                            India's trusted platform for finding verified tutors and coaching centres. Connect directly — no middlemen, no commission.
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
                        <h4 className="text-xs font-black uppercase tracking-[0.4em] text-gray-900 mb-8 italic">Find & Connect</h4>
                        <nav className="flex flex-col gap-4">
                            {[
                                { name: "Find Tutors", href: "/search?role=TUTOR" },
                                { name: "Find Students", href: "/search?role=STUDENT" },
                                { name: "How It Works", href: "/#methodology" },
                                { name: "Subjects", href: "/subjects" },
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
                        <h4 className="text-xs font-black uppercase tracking-[0.4em] text-gray-900 mb-8 italic">Platform</h4>
                        <nav className="flex flex-col gap-4">
                            {[
                                { name: "Categories", href: "/categories" },
                                { name: "For Institutes", href: "/how-it-works/institute" },
                                { name: "Pricing", href: "/pricing/tutor" },
                                { name: "Blog", href: "/blog" },
                                { name: "Contact", href: "/contact" }
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
                        <h4 className="text-xs font-black uppercase tracking-[0.4em] text-gray-900 mb-8 italic">Legal</h4>
                        <nav className="flex flex-col gap-4">
                            {[
                                { name: "Privacy Policy", href: "/legal/privacy" },
                                { name: "Terms of Service", href: "/legal/terms" },
                                { name: "Cookie Policy", href: "/legal/cookies" },
                                { name: "About Us", href: "/about" }
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
                            <p className="text-gray-300 text-xs font-black uppercase tracking-[0.3em] leading-none">© 2026 TuitionsInIndia</p>
                            <p className="text-gray-400 text-xs font-black uppercase tracking-tight italic">India's trusted tutor discovery platform</p>
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
