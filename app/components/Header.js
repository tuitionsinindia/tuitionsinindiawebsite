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
    UserPlus, 
    LayoutDashboard, 
    CircleHelp,
    Info,
    Newspaper,
    ShieldCheck,
    Zap
} from "lucide-react";

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
        // Initial scroll check
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        setMobileMenuOpen(false);
    }, [pathname]);

    if (!isMounted) return null;

    // Hide header on dashboard/admin/messages routes
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
            className={`fixed top-0 w-full z-50 transition-all duration-300 ${
                scrolled 
                ? 'bg-white/95 backdrop-blur-md border-b border-gray-200 py-3 shadow-sm' 
                : 'bg-transparent py-5 lg:py-6'
            }`}
        >
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                {/* Brand Identity */}
                <Link href="/" className="flex items-center gap-2 group relative z-10 hover:opacity-90 transition-opacity">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                        <Zap size={20} className="text-white fill-white" />
                    </div>
                    <div className="flex flex-col">
                        <span className={`text-xl font-bold tracking-tight leading-none ${scrolled ? 'text-gray-900' : 'text-white'}`}>
                            TuitionsInIndia
                        </span>
                        <span className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${scrolled ? 'text-blue-600' : 'text-blue-300'}`}>
                            Marketplace
                        </span>
                    </div>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden lg:flex items-center gap-8">
                    {/* Students Protocol */}
                    <div className="relative group/menu">
                        <button className={`flex items-center gap-1.5 font-bold text-sm transition-colors ${scrolled ? 'text-gray-600 hover:text-blue-600' : 'text-white/90 hover:text-white'}`}>
                            Students <ChevronDown size={14} className="transition-transform group-hover/menu:rotate-180" />
                        </button>
                        <div className="absolute top-full left-1/2 -translate-x-1/2 w-56 bg-white border border-gray-200 rounded-2xl p-3 opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible group-hover/menu:translate-y-2 transition-all duration-300 shadow-xl">
                            {navLinks.students.map((item, i) => (
                                <Link key={i} href={item.href} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 text-gray-700 font-semibold group/item transition-colors">
                                    <div className="text-gray-400 group-hover/item:text-blue-600 transition-colors">
                                        <item.icon size={16} />
                                    </div>
                                    <span className="text-sm">{item.label}</span>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Tutors Protocol */}
                    <div className="relative group/menu">
                        <button className={`flex items-center gap-1.5 font-bold text-sm transition-colors ${scrolled ? 'text-gray-600 hover:text-blue-600' : 'text-white/90 hover:text-white'}`}>
                            Tutors <ChevronDown size={14} className="transition-transform group-hover/menu:rotate-180" />
                        </button>
                        <div className="absolute top-full left-1/2 -translate-x-1/2 w-56 bg-white border border-gray-200 rounded-2xl p-3 opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible group-hover/menu:translate-y-2 transition-all duration-300 shadow-xl">
                            {navLinks.tutors.map((item, i) => (
                                <Link key={i} href={item.href} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 text-gray-700 font-semibold group/item transition-colors">
                                    <div className="text-gray-400 group-hover/item:text-blue-600 transition-colors">
                                        <item.icon size={16} />
                                    </div>
                                    <span className="text-sm">{item.label}</span>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Institutes Protocol */}
                    <div className="relative group/menu">
                        <button className={`flex items-center gap-1.5 font-bold text-sm transition-colors ${scrolled ? 'text-gray-600 hover:text-blue-600' : 'text-white/90 hover:text-white'}`}>
                            Institutes <ChevronDown size={14} className="transition-transform group-hover/menu:rotate-180" />
                        </button>
                        <div className="absolute top-full left-1/2 -translate-x-1/2 w-56 bg-white border border-gray-200 rounded-2xl p-3 opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible group-hover/menu:translate-y-2 transition-all duration-300 shadow-xl">
                            {navLinks.institutes.map((item, i) => (
                                <Link key={i} href={item.href} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 text-gray-700 font-semibold group/item transition-colors">
                                    <div className="text-gray-400 group-hover/item:text-blue-600 transition-colors">
                                        <item.icon size={16} />
                                    </div>
                                    <span className="text-sm">{item.label}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </nav>

                {/* Secure Actions */}
                <div className="flex items-center gap-4 relative z-10">
                    <Link 
                        href="/login" 
                        className={`hidden sm:inline-flex font-bold text-sm px-4 py-2 rounded-lg transition-colors ${scrolled ? 'text-gray-600 hover:bg-gray-100 hover:text-gray-900' : 'text-white/90 hover:bg-white/10 hover:text-white'}`}
                    >
                        Log In
                    </Link>
                    <Link
                        href="/register"
                        className={`px-5 py-2.5 font-bold text-sm rounded-xl transition-all shadow-md active:scale-95 ${scrolled ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-white text-blue-700 hover:bg-blue-50'}`}
                    >
                        Sign Up
                    </Link>
                    
                    {/* Mobile Terminal Toggle */}
                    <button 
                        onClick={() => setMobileMenuOpen(true)}
                        className={`lg:hidden w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${scrolled ? 'text-gray-900 bg-gray-100' : 'text-white bg-white/20'}`}
                    >
                        <Menu size={20} />
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={`fixed inset-0 z-[100] transition-all duration-300 ${mobileMenuOpen ? 'visible' : 'invisible'}`}>
                <div 
                    className={`absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity duration-300 ${mobileMenuOpen ? 'opacity-100' : 'opacity-0'}`}
                    onClick={() => setMobileMenuOpen(false)}
                ></div>
                
                <div className={`absolute top-0 right-0 h-full w-full max-w-sm bg-white shadow-2xl transition-transform duration-300 flex flex-col ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                    <div className="p-6 flex items-center justify-between border-b border-gray-100">
                        <div className="flex items-center gap-2">
                            <Zap size={20} className="text-blue-600 fill-blue-600" />
                            <span className="text-lg font-bold text-gray-900">Menu</span>
                        </div>
                        <button 
                            onClick={() => setMobileMenuOpen(false)} 
                            className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors"
                        >
                            <X size={20} className="stroke-2" />
                        </button>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-6 space-y-8">
                        <section>
                            <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4 px-2">For Students</p>
                            <div className="grid grid-cols-1 gap-2">
                                {navLinks.students.map((item, i) => (
                                    <Link key={i} href={item.href} className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 hover:bg-blue-50 text-gray-700 hover:text-blue-700 font-semibold text-sm transition-all">
                                        <item.icon size={18} className="text-gray-400" />
                                        {item.label}
                                    </Link>
                                ))}
                            </div>
                        </section>

                        <section>
                            <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4 px-2">For Tutors</p>
                            <div className="grid grid-cols-1 gap-2">
                                {navLinks.tutors.map((item, i) => (
                                    <Link key={i} href={item.href} className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 hover:bg-blue-50 text-gray-700 hover:text-blue-700 font-semibold text-sm transition-all">
                                        <item.icon size={18} className="text-gray-400" />
                                        {item.label}
                                    </Link>
                                ))}
                            </div>
                        </section>

                        <section>
                            <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4 px-2">For Institutes</p>
                            <div className="grid grid-cols-1 gap-2">
                                {navLinks.institutes.map((item, i) => (
                                    <Link key={i} href={item.href} className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 hover:bg-blue-50 text-gray-700 hover:text-blue-700 font-semibold text-sm transition-all">
                                        <item.icon size={18} className="text-gray-400" />
                                        {item.label}
                                    </Link>
                                ))}
                            </div>
                        </section>
                    </div>

                    <div className="p-6 border-t border-gray-100 flex flex-col gap-3">
                        <Link href="/login" className="flex items-center justify-center gap-2 w-full py-4 rounded-xl font-bold text-sm bg-gray-100 text-gray-900 border border-transparent hover:bg-gray-200 transition-colors">
                            Log In
                        </Link>
                        <Link href="/register" className="flex items-center justify-center gap-2 w-full py-4 rounded-xl font-bold text-sm bg-blue-600 text-white shadow-md hover:bg-blue-700 transition-colors">
                            Sign Up
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
}
