"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const pathname = usePathname();
    const [isMounted, setIsMounted] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [pathname]);

    if (!isMounted) return null;

    if (pathname && (pathname.startsWith("/dashboard") || pathname.startsWith("/admin") || pathname.startsWith("/messages"))) {
        return null;
    }

    return (
        <>
            <header className={`fixed top-0 z-50 w-full transition-all duration-500 isolation-auto ${scrolled ? 'py-2 bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100' : 'py-6 bg-transparent'}`}>
                <div className="container-premium">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <Link href="/" className="flex items-center transition-transform hover:scale-[1.05] shrink-0 bg-transparent">
                            <img
                                src="/logo_horizontal.png"
                                alt="Tuitions In India"
                                className={`transition-all duration-500 ${scrolled ? 'h-10' : 'h-22'} w-auto object-contain [mix-blend-mode:multiply] [filter:contrast(1.1)_brightness(1.05)] pointer-events-none bg-transparent block`}
                            />
                        </Link>

                        {/* Desktop Navigation - Dropdown Style */}
                        <div className="hidden lg:flex items-center gap-10">
                            {/* Students Dropdown */}
                            <div className="relative group/menu">
                                <button className="flex items-center gap-2 py-4 text-slate-700 hover:text-[#0d40a5] font-bold text-[12px] uppercase tracking-wider transition-all">
                                    For Students
                                    <span className="material-symbols-outlined text-[18px] transition-transform group-hover/menu:rotate-180">expand_more</span>
                                </button>
                                <div className="absolute top-full left-0 w-64 bg-white dark:bg-slate-900 rounded-[2rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] border border-slate-100 dark:border-slate-800 p-4 opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible group-hover/menu:translate-y-2 transition-all duration-300 z-[100]">
                                    {[
                                        { label: "Find Tutors", href: "/search?role=TUTOR", icon: "search" },
                                        { label: "AI Matchmaker", href: "/ai-match", icon: "auto_awesome" },
                                        { label: "How it Works", href: "/how-it-works/student", icon: "help" },
                                        { label: "Pricing Plans", href: "/pricing/student", icon: "payments" }
                                    ].map((item, i) => (
                                        <Link key={i} href={item.href} className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-primary transition-all group">
                                            <span className="material-symbols-outlined text-[20px] opacity-40 group-hover:opacity-100">{item.icon}</span>
                                            <span className="text-sm font-bold tracking-tight">{item.label}</span>
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* Tutors Dropdown */}
                            <div className="relative group/menu">
                                <button className="flex items-center gap-2 py-4 text-slate-700 hover:text-[#0d40a5] font-bold text-[12px] uppercase tracking-wider transition-all">
                                    For Tutors
                                    <span className="material-symbols-outlined text-[18px] transition-transform group-hover/menu:rotate-180">expand_more</span>
                                </button>
                                <div className="absolute top-full left-0 w-64 bg-white dark:bg-slate-900 rounded-[2rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] border border-slate-100 dark:border-slate-800 p-4 opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible group-hover/menu:translate-y-2 transition-all duration-300 z-[100]">
                                    {[
                                        { label: "Join Faculty", href: "/register/tutor", icon: "person_add" },
                                        { label: "Tutor Dashboard", href: "/dashboard", icon: "dashboard" },
                                        { label: "Lead Credits", href: "/pricing/tutor", icon: "stars" },
                                        { label: "Member Support", href: "/kb/tutor", icon: "support_agent" }
                                    ].map((item, i) => (
                                        <Link key={i} href={item.href} className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-primary transition-all group">
                                            <span className="material-symbols-outlined text-[20px] opacity-40 group-hover:opacity-100">{item.icon}</span>
                                            <span className="text-sm font-bold tracking-tight">{item.label}</span>
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            <Link href="/about" className="text-slate-700 hover:text-[#0d40a5] font-bold text-[12px] uppercase tracking-wider transition-all">About Us</Link>
                            <Link href="/blog" className="text-slate-700 hover:text-[#0d40a5] font-bold text-[12px] uppercase tracking-wider transition-all">Blog</Link>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-4">
                            <Link 
                                href="/login" 
                                className="hidden sm:flex px-6 py-2.5 text-slate-700 hover:text-[#0d40a5] font-bold text-[12px] uppercase tracking-wider transition-all"
                            >
                                Login
                            </Link>
                            <Link
                                href="/register"
                                className="bg-[#0d40a5] hover:bg-[#0a358a] text-white px-8 py-3 rounded-lg font-black text-[12px] uppercase tracking-wider transition-all shadow-xl shadow-blue-900/20 hover:-translate-y-0.5 active:scale-95"
                            >
                                Get Started
                            </Link>
                            
                            {/* Mobile Burger Icon */}
                            <button 
                                onClick={() => setMobileMenuOpen(true)}
                                className="lg:hidden size-12 rounded-2xl bg-white text-slate-900 shadow-xl border border-slate-100 flex items-center justify-center active:scale-90 transition-all"
                            >
                                <span className="material-symbols-outlined">menu_open</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Navigation Drawer */}
            <div className={`fixed inset-0 z-[100] transition-all duration-700 ${mobileMenuOpen ? 'visible' : 'invisible'}`}>
                {/* Backdrop */}
                <div 
                    className={`absolute inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity duration-700 ${mobileMenuOpen ? 'opacity-100' : 'opacity-0'}`}
                    onClick={() => setMobileMenuOpen(false)}
                ></div>
                
                {/* Drawer */}
                <div className={`absolute top-0 right-0 h-full w-full max-w-md bg-white shadow-[0_0_100px_rgba(0,0,0,0.5)] transition-transform duration-700 flex flex-col ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'} rounded-l-[3rem]`}>
                    <div className="p-10 flex items-center justify-between">
                        <Link href="/" className="shrink-0">
                            <img src="/logo_horizontal.png" alt="Logo" className="h-10 w-auto object-contain" />
                        </Link>
                        <button onClick={() => setMobileMenuOpen(false)} className="size-14 rounded-[2rem] bg-slate-50 flex items-center justify-center text-slate-900 border border-slate-100 shadow-xl active:scale-90 transition-all">
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-10 space-y-12 no-scrollbar">
                        <section>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-8 px-4 border-l-4 border-primary">Learning Discovery</p>
                            <div className="grid grid-cols-1 gap-4">
                                <Link href="/tutors" className="flex items-center gap-6 p-6 rounded-[2rem] bg-slate-50 text-slate-900 font-black hover:bg-primary/5 transition-all font-heading tracking-wide">
                                    <div className="size-14 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-primary shadow-sm">
                                        <span className="material-symbols-outlined">person_search</span>
                                    </div>
                                    Find Expert Tutors
                                </Link>
                                <Link href="/ai-match" className="flex items-center gap-6 p-6 rounded-[2rem] bg-primary text-white font-black shadow-2xl shadow-primary/20 font-heading tracking-wide">
                                    <div className="size-14 rounded-2xl bg-white/20 flex items-center justify-center text-white">
                                        <span className="material-symbols-outlined animate-pulse">psychology</span>
                                    </div>
                                    Neural AI Matching
                                </Link>
                            </div>
                        </section>

                        <section>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-8 px-4 border-l-4 border-slate-200">Educator Network</p>
                            <div className="grid grid-cols-1 gap-4">
                                <Link href="/register/tutor" className="flex items-center gap-6 p-6 rounded-[2rem] bg-slate-50 text-slate-900 font-black font-heading tracking-wide">
                                    <div className="size-14 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-indigo-500 shadow-sm">
                                        <span className="material-symbols-outlined">school</span>
                                    </div>
                                    Become an Elite Tutor
                                </Link>
                            </div>
                        </section>

                        <div className="pt-10 border-t border-slate-100">
                            <Link href="/login" className="flex items-center gap-6 p-6 rounded-[2rem] bg-slate-50 text-slate-400 font-black font-heading tracking-wide border-2 border-dashed border-slate-200">
                                <span className="material-symbols-outlined">lock</span>
                                Secure Dashboard Login
                            </Link>
                        </div>
                    </div>

                    <div className="p-10">
                        <Link href="/register" className="btn-primary w-full py-6 rounded-3xl text-sm tracking-[0.3em]">
                            INSTANT ONBOARDING
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
