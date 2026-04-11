"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
    Menu, 
    X, 
    ChevronDown, 
    Search, 
    Sparkles, 
    BookOpen, 
    CreditCard, 
    LayoutDashboard,
    Zap,
    GraduationCap,
    School,
    Users
} from "lucide-react";
import Logo from "./Logo";

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const pathname = usePathname();
    const [isMounted, setIsMounted] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        const handleScroll = () => {
            if (typeof window !== 'undefined') {
                setScrolled(window.scrollY > 20);
            }
        };
        window.addEventListener("scroll", handleScroll);
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        setMobileMenuOpen(false);
    }, [pathname]);

    if (!isMounted) return null;

    // Hide header on dashboard/admin routes
    if (pathname && (pathname.startsWith("/dashboard") || pathname.startsWith("/admin") || pathname.startsWith("/messages"))) {
        return null;
    }

    const navLinks = {
        students: [
            { label: "Find Tutors", href: "/search?role=TUTOR", icon: Search },
            { label: "How it Works", href: "/how-it-works/student", icon: BookOpen },
            { label: "AI Matchmaker", href: "/ai-match", icon: Sparkles }
        ],
        tutors: [
            { label: "How it Works", href: "/how-it-works/tutor", icon: BookOpen },
            { label: "Tutor Dashboard", href: "/dashboard", icon: LayoutDashboard },
            { label: "Tutor Pricing", href: "/pricing/tutor", icon: CreditCard }
        ],
        institutes: [
            { label: "How it Works", href: "/how-it-works/institute", icon: BookOpen },
            { label: "Institute Dashboard", href: "/dashboard", icon: LayoutDashboard }
        ]
    };

    return (
        <header 
            className={`fixed top-0 w-full z-50 transition-all duration-500 ${
                scrolled 
                ? 'bg-white/90 backdrop-blur-xl border-b border-gray-100 py-3 shadow-lg' 
                : 'bg-transparent py-5 lg:py-6'
            }`}
        >
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                <Logo light={!scrolled} />

                {/* Desktop Navigation */}
                <nav className="hidden lg:flex items-center gap-10">
                    {/* Students */}
                    <div className="relative group/menu">
                        <button className={`flex items-center gap-1.5 font-black text-xs uppercase tracking-widest transition-all ${scrolled ? 'text-gray-900 hover:text-blue-600' : 'text-white/90 hover:text-white'}`}>
                            Students <ChevronDown size={14} className="transition-transform group-hover/menu:rotate-180" />
                        </button>
                        <div className="absolute top-full left-1/2 -translate-x-1/2 w-64 bg-white border border-gray-100 rounded-[2.5rem] p-4 opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible group-hover/menu:translate-y-4 transition-all duration-300 shadow-4xl overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-blue-600"></div>
                            {navLinks.students.map((item, i) => (
                                <Link key={i} href={item.href} className="flex items-center gap-4 px-5 py-4 rounded-2xl hover:bg-blue-50 text-gray-700 font-bold group/item transition-all">
                                    <div className="p-2 bg-gray-50 rounded-xl group-hover/item:bg-blue-600 group-hover/item:text-white transition-all">
                                        <item.icon size={18} />
                                    </div>
                                    <span className="text-xs uppercase tracking-tight">{item.label}</span>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Tutors */}
                    <div className="relative group/menu">
                        <button className={`flex items-center gap-1.5 font-black text-xs uppercase tracking-widest transition-all ${scrolled ? 'text-gray-900 hover:text-blue-600' : 'text-white/90 hover:text-white'}`}>
                            Tutors <ChevronDown size={14} className="transition-transform group-hover/menu:rotate-180" />
                        </button>
                        <div className="absolute top-full left-1/2 -translate-x-1/2 w-64 bg-white border border-gray-100 rounded-[2.5rem] p-4 opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible group-hover/menu:translate-y-4 transition-all duration-300 shadow-4xl overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-blue-600"></div>
                            {navLinks.tutors.map((item, i) => (
                                <Link key={i} href={item.href} className="flex items-center gap-4 px-5 py-4 rounded-2xl hover:bg-blue-50 text-gray-700 font-bold group/item transition-all">
                                    <div className="p-2 bg-gray-50 rounded-xl group-hover/item:bg-blue-600 group-hover/item:text-white transition-all">
                                        <item.icon size={18} />
                                    </div>
                                    <span className="text-xs uppercase tracking-tight">{item.label}</span>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Institutes */}
                    <div className="relative group/menu">
                        <button className={`flex items-center gap-1.5 font-black text-xs uppercase tracking-widest transition-all ${scrolled ? 'text-gray-900 hover:text-blue-600' : 'text-white/90 hover:text-white'}`}>
                            Institutes <ChevronDown size={14} className="transition-transform group-hover/menu:rotate-180" />
                        </button>
                        <div className="absolute top-full left-1/2 -translate-x-1/2 w-64 bg-white border border-gray-100 rounded-[2.5rem] p-4 opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible group-hover/menu:translate-y-4 transition-all duration-300 shadow-4xl overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-blue-600"></div>
                            {navLinks.institutes.map((item, i) => (
                                <Link key={i} href={item.href} className="flex items-center gap-4 px-5 py-4 rounded-2xl hover:bg-blue-50 text-gray-700 font-bold group/item transition-all">
                                    <div className="p-2 bg-gray-50 rounded-xl group-hover/item:bg-blue-600 group-hover/item:text-white transition-all">
                                        <item.icon size={18} />
                                    </div>
                                    <span className="text-xs uppercase tracking-tight">{item.label}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </nav>

                {/* Secure Actions */}
                <div className="flex items-center gap-5 relative z-10">
                    <Link 
                        href="/login" 
                        className={`hidden sm:inline-flex font-black text-[10px] uppercase tracking-[0.2em] px-6 py-3 rounded-2xl transition-all ${scrolled ? 'text-gray-600 hover:bg-gray-100 hover:text-gray-900' : 'text-white/90 hover:bg-white/10 hover:text-white'}`}
                    >
                        Log In
                    </Link>
                    <Link
                        href="/register"
                        className={`px-5 sm:px-8 py-3 sm:py-3.5 font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl transition-all shadow-xl active:scale-95 whitespace-nowrap ${scrolled ? 'bg-blue-600 text-white hover:bg-gray-900 shadow-blue-600/20' : 'bg-white text-blue-700 hover:bg-blue-50 shadow-white/10'}`}
                    >
                        Sign Up Free
                    </Link>
                    
                    {/* Mobile Terminal Toggle */}
                    <button 
                        onClick={() => setMobileMenuOpen(true)}
                        className={`lg:hidden w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${scrolled ? 'text-gray-900 bg-gray-100' : 'text-white bg-white/20 hover:bg-white/30'}`}
                    >
                        <Menu size={20} />
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={`fixed inset-0 z-[100] transition-all duration-500 ${mobileMenuOpen ? 'visible' : 'invisible'}`}>
                <div 
                    className={`absolute inset-0 bg-gray-900/60 backdrop-blur-md transition-opacity duration-500 ${mobileMenuOpen ? 'opacity-100' : 'opacity-0'}`}
                    onClick={() => setMobileMenuOpen(false)}
                ></div>
                
                <div className={`absolute top-0 right-0 h-full w-full max-w-sm bg-white shadow-2xl transition-transform duration-500 flex flex-col ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                    <div className="p-8 flex items-center justify-between border-b border-gray-50">
                        <Logo className="scale-75 origin-left" />
                        <button 
                            onClick={() => setMobileMenuOpen(false)} 
                            className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-900 hover:bg-red-50 hover:text-red-500 transition-all"
                        >
                            <X size={20} strokeWidth={3} />
                        </button>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-8 space-y-10">
                        <section>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-6 px-2">For Students</p>
                            <div className="grid grid-cols-1 gap-3">
                                {navLinks.students.map((item, i) => (
                                    <Link key={i} href={item.href} className="flex items-center gap-5 p-5 rounded-2xl bg-gray-50 hover:bg-blue-50 text-gray-900 hover:text-blue-600 font-bold transition-all group">
                                        <item.icon size={20} className="text-gray-400 group-hover:text-blue-600" />
                                        <span className="text-xs uppercase">{item.label}</span>
                                    </Link>
                                ))}
                            </div>
                        </section>

                        <section>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-6 px-2">For Tutors</p>
                            <div className="grid grid-cols-1 gap-3">
                                {navLinks.tutors.map((item, i) => (
                                    <Link key={i} href={item.href} className="flex items-center gap-5 p-5 rounded-2xl bg-gray-50 hover:bg-blue-50 text-gray-900 hover:text-blue-600 font-bold transition-all group">
                                        <item.icon size={20} className="text-gray-400 group-hover:text-blue-600" />
                                        <span className="text-xs uppercase">{item.label}</span>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    </div>

                    <div className="p-8 border-t border-gray-50 flex flex-col gap-4">
                        <Link href="/login" className="flex items-center justify-center w-full py-5 rounded-3xl font-black text-xs uppercase tracking-widest bg-gray-100 text-gray-900 hover:bg-gray-200 transition-all">
                            Log In
                        </Link>
                        <Link href="/register" className="flex items-center justify-center w-full py-5 rounded-3xl font-black text-xs uppercase tracking-widest bg-blue-600 text-white shadow-xl shadow-blue-600/20 hover:bg-gray-900 transition-all">
                            Sign Up Free
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
}
