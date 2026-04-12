"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
    ChevronDown, 
    Search, 
    User, 
    Menu, 
    X, 
    ArrowRight,
    Zap,
    Users,
    Building2,
    ShieldCheck,
    GraduationCap,
    Globe,
    Target,
    Activity
} from "lucide-react";
import Logo from "./Logo";

export default function Header() {
    const router = useRouter();
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = {
        students: [
            { label: "Find Expert Tutors", href: "/search?role=TUTOR", icon: Search },
            { label: "How it Works", href: "/how-it-works/student", icon: Zap },
            { label: "Pricing & Credits", href: "/pricing/student", icon: Activity }
        ],
        tutors: [
            { label: "Find Student Leads", href: "/search?role=STUDENT", icon: Target },
            { label: "Tutor Dashboard", href: "/dashboard/tutor", icon: GraduationCap },
            { label: "Verification Protocol", href: "/kb/tutor", icon: ShieldCheck }
        ],
        institutes: [
            { label: "Recruit Faculty", href: "/search?role=TUTOR", icon: Users },
            { label: "Institute Solutions", href: "/how-it-works/institute", icon: Building2 },
            { label: "Academy Hubs", href: "/categories", icon: Globe }
        ]
    };

    return (
        <header 
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
                scrolled 
                ? "bg-white/80 backdrop-blur-xl border-b border-gray-100 py-3 shadow-2xl shadow-black/5" 
                : "bg-transparent py-6"
            }`}
        >
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                {/* Logo Section */}
                <div className="flex items-center gap-12 relative z-10">
                    <Logo light={!scrolled} />

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center gap-10">
                        {/* Students */}
                        <div className="relative group/menu">
                            <button className={`flex items-center gap-1 font-black text-xs uppercase tracking-widest transition-all ${scrolled ? 'text-gray-900 hover:text-blue-600' : 'text-white/90 hover:text-white'}`}>
                                Students <ChevronDown size={14} className="transition-transform group-hover/menu:rotate-180" />
                            </button>
                            <div className="absolute top-full left-1/2 -translate-x-1/2 w-64 bg-white border border-gray-100 rounded-[2.5rem] p-4 opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible group-hover/menu:translate-y-4 transition-all duration-300 shadow-4xl overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-1 bg-blue-600"></div>
                                <div className="space-y-1">
                                    <p className="text-xs font-black uppercase tracking-[0.3em] text-gray-400 mb-6 px-2">For Students</p>
                                    {navLinks.students.map((item, i) => (
                                        <Link key={i} href={item.href} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-all text-gray-600 hover:text-blue-600 group/item">
                                            <div className="size-10 rounded-xl bg-gray-50 flex items-center justify-center group-hover/item:bg-blue-600 group-hover/item:text-white transition-all"><item.icon size={18} /></div>
                                            <span className="text-xs font-black uppercase tracking-tight">{item.label}</span>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Tutors */}
                        <div className="relative group/menu">
                            <button className={`flex items-center gap-1 font-black text-xs uppercase tracking-widest transition-all ${scrolled ? 'text-gray-900 hover:text-blue-600' : 'text-white/90 hover:text-white'}`}>
                                Tutors <ChevronDown size={14} className="transition-transform group-hover/menu:rotate-180" />
                            </button>
                            <div className="absolute top-full left-1/2 -translate-x-1/2 w-64 bg-white border border-gray-100 rounded-[2.5rem] p-4 opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible group-hover/menu:translate-y-4 transition-all duration-300 shadow-4xl overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-1 bg-blue-600"></div>
                                <div className="space-y-1">
                                    <p className="text-xs font-black uppercase tracking-[0.3em] text-gray-400 mb-6 px-2">For Tutors</p>
                                    {navLinks.tutors.map((item, i) => (
                                        <Link key={i} href={item.href} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-all text-gray-600 hover:text-blue-600 group/item">
                                            <div className="size-10 rounded-xl bg-gray-50 flex items-center justify-center group-hover/item:bg-blue-600 group-hover/item:text-white transition-all"><item.icon size={18} /></div>
                                            <span className="text-xs font-black uppercase tracking-tight">{item.label}</span>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Institutes */}
                        <div className="relative group/menu">
                            <button className={`flex items-center gap-1 font-black text-xs uppercase tracking-widest transition-all ${scrolled ? 'text-gray-900 hover:text-blue-600' : 'text-white/90 hover:text-white'}`}>
                                Institutes <ChevronDown size={14} className="transition-transform group-hover/menu:rotate-180" />
                            </button>
                            <div className="absolute top-full left-1/2 -translate-x-1/2 w-64 bg-white border border-gray-100 rounded-[2.5rem] p-4 opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible group-hover/menu:translate-y-4 transition-all duration-300 shadow-4xl overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-1 bg-blue-600"></div>
                                <div className="space-y-1">
                                    <p className="text-xs font-black uppercase tracking-[0.3em] text-gray-400 mb-6 px-2">For Institutes</p>
                                    {navLinks.institutes.map((item, i) => (
                                        <Link key={i} href={item.href} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-all text-gray-600 hover:text-blue-600 group/item">
                                            <div className="size-10 rounded-xl bg-gray-50 flex items-center justify-center group-hover/item:bg-blue-600 group-hover/item:text-white transition-all"><item.icon size={18} /></div>
                                            <span className="text-xs font-black uppercase tracking-tight">{item.label}</span>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </nav>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-4 relative z-10">
                    <button 
                        onClick={() => router.push('/search')}
                        className={`hidden md:flex items-center gap-2 font-black text-xs uppercase tracking-[0.2em] px-5 py-2.5 rounded-xl transition-all ${scrolled ? 'text-gray-400 hover:text-blue-600' : 'text-white/60 hover:text-white'}`}
                    >
                        <Search size={16} strokeWidth={3} /> Search
                    </button>
                    <Link 
                        href="/login" 
                        className={`hidden sm:inline-flex font-black text-xs uppercase tracking-[0.2em] px-5 py-2.5 rounded-xl transition-all ${scrolled ? 'text-gray-600 hover:bg-gray-100 hover:text-gray-900' : 'text-white/90 hover:bg-white/10 hover:text-white'}`}
                    >
                        Terminal Log In
                    </Link>
                    <Link
                        href="/register"
                        className={`px-6 py-2.5 font-black text-xs uppercase tracking-[0.2em] rounded-xl transition-all shadow-lg active:scale-95 ${scrolled ? 'bg-blue-600 text-white hover:bg-gray-900 shadow-blue-600/20' : 'bg-white text-blue-700 hover:bg-blue-50 shadow-white/10'}`}
                    >
                        Sign Up Free
                    </Link>
                    
                    <button 
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className={`lg:hidden p-2.5 rounded-xl transition-all ${scrolled ? 'text-gray-900 bg-gray-100' : 'text-white bg-white/10 hover:bg-white/20'}`}
                    >
                        {mobileMenuOpen ? <X size={20} /> : <Search size={20} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="lg:hidden absolute top-0 left-0 w-full bg-white h-screen z-40 p-6 pt-24 animate-fade-in overflow-y-auto">
                    <div className="space-y-12 pb-20">
                        {Object.entries(navLinks).map(([category, links]) => (
                            <div key={category} className="space-y-6">
                                <p className="text-xs font-black uppercase tracking-[0.5em] text-blue-600/40 border-b border-gray-100 pb-4">{category}</p>
                                <div className="grid grid-cols-1 gap-4">
                                    {links.map((item, i) => (
                                        <Link key={i} href={item.href} onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-6 p-5 rounded-3xl bg-gray-50 active:scale-95 transition-all group">
                                            <div className="size-14 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                                                <item.icon size={24} />
                                            </div>
                                            <span className="text-xs font-black uppercase italic text-gray-900">{item.label}</span>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        ))}
                        <div className="pt-10 border-t border-gray-100 space-y-4">
                            <Link href="/login" className="flex items-center justify-center w-full py-5 rounded-3xl font-black text-xs uppercase tracking-widest bg-gray-100 text-gray-900 hover:bg-gray-200 transition-all">
                                Log In
                            </Link>
                            <Link href="/register" className="flex items-center justify-center w-full py-5 rounded-3xl font-black text-xs uppercase tracking-widest bg-blue-600 text-white shadow-xl shadow-blue-600/20 hover:bg-gray-900 transition-all">
                                Get Started Free
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
