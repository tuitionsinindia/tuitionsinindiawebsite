"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Search, Menu, X, ArrowRight, ChevronDown, GraduationCap, Users, Building2 } from "lucide-react";
import Logo from "./Logo";

function SearchBar() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [subject, setSubject] = useState(searchParams.get("subject") || "");
    const [location, setLocation] = useState(searchParams.get("location") || "");

    const handleSearch = (e) => {
        e.preventDefault();
        const params = new URLSearchParams(searchParams.toString());
        if (subject) params.set("subject", subject); else params.delete("subject");
        if (location) params.set("location", location); else params.delete("location");
        router.push(`/search?${params.toString()}`);
    };

    return (
        <form onSubmit={handleSearch} className="flex items-center bg-gray-50 border border-gray-200 rounded-xl overflow-hidden h-10 divide-x divide-gray-200 flex-1 max-w-xl">
            <div className="flex items-center gap-2 px-3 flex-1 min-w-0">
                <Search size={14} className="text-gray-400 shrink-0" />
                <input
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    placeholder="Subject..."
                    className="bg-transparent text-sm text-gray-700 outline-none w-full placeholder:text-gray-400"
                />
            </div>
            <div className="flex items-center gap-2 px-3 flex-1 min-w-0">
                <input
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    placeholder="City..."
                    className="bg-transparent text-sm text-gray-700 outline-none w-full placeholder:text-gray-400"
                />
            </div>
            <button type="submit" className="px-3 h-full bg-blue-600 text-white hover:bg-blue-700 transition-colors shrink-0">
                <ArrowRight size={15} />
            </button>
        </form>
    );
}

const NAV_SECTIONS = [
    {
        label: "For Students",
        icon: GraduationCap,
        links: [
            { label: "How it Works", href: "/how-it-works/student" },
            { label: "Find Tutors", href: "/search?role=TUTOR" },
            { label: "Pricing", href: "/pricing/student" },
            { label: "Sign Up", href: "/register/student" },
        ],
    },
    {
        label: "For Tutors",
        icon: Users,
        links: [
            { label: "How it Works", href: "/how-it-works/tutor" },
            { label: "Find Students", href: "/search?role=STUDENT" },
            { label: "Pricing", href: "/pricing/tutor" },
            { label: "Sign Up", href: "/register/tutor" },
        ],
    },
    {
        label: "For Institutes",
        icon: Building2,
        links: [
            { label: "How it Works", href: "/how-it-works/institute" },
            { label: "Find Students", href: "/search?role=STUDENT" },
            { label: "Pricing", href: "/pricing/institute" },
            { label: "Sign Up", href: "/register/institute" },
        ],
    },
];

function DesktopDropdown({ section, isOpaque }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    const timeoutRef = useRef(null);

    const handleEnter = () => {
        clearTimeout(timeoutRef.current);
        setOpen(true);
    };
    const handleLeave = () => {
        timeoutRef.current = setTimeout(() => setOpen(false), 150);
    };

    useEffect(() => {
        return () => clearTimeout(timeoutRef.current);
    }, []);

    return (
        <div ref={ref} className="relative" onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
            <button
                className={`flex items-center gap-1 text-sm font-medium transition-colors ${
                    isOpaque ? "text-gray-600 hover:text-blue-600" : "text-white/80 hover:text-white"
                }`}
            >
                {section.label}
                <ChevronDown size={14} className={`transition-transform ${open ? "rotate-180" : ""}`} />
            </button>
            {open && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50">
                    <div className="bg-white rounded-xl border border-gray-100 shadow-lg py-2 min-w-[200px]">
                        {section.links.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setOpen(false)}
                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default function Header() {
    const router = useRouter();
    const pathname = usePathname();
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [mobileExpanded, setMobileExpanded] = useState(null);

    const isSearchPage = pathname?.startsWith("/search");
    // Only the homepage gets the transparent/light header — all other pages are always opaque
    const isHomepage = pathname === "/";
    const isOpaque = scrolled || isSearchPage || !isHomepage;

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
            isOpaque
                ? "bg-white border-b border-gray-100 py-3 shadow-sm"
                : "bg-transparent py-4"
        }`}>
            <div className="max-w-7xl mx-auto px-6 flex items-center gap-4 justify-between">
                {/* Logo */}
                <div className="shrink-0">
                    <Logo light={!isOpaque} />
                </div>

                {/* Search bar — only on search page, desktop */}
                {isSearchPage && (
                    <div className="hidden md:flex flex-1 max-w-xl">
                        <Suspense fallback={<div className="h-10 w-full bg-gray-100 rounded-xl animate-pulse" />}>
                            <SearchBar />
                        </Suspense>
                    </div>
                )}

                {/* Desktop Nav — dropdowns */}
                {!isSearchPage && (
                    <nav className="hidden md:flex items-center gap-6">
                        {NAV_SECTIONS.map((section) => (
                            <DesktopDropdown key={section.label} section={section} isOpaque={isOpaque} />
                        ))}
                    </nav>
                )}

                {/* Right Actions */}
                <div className="flex items-center gap-3 shrink-0">
                    <Link
                        href="/login"
                        className={`hidden sm:inline-flex text-sm font-medium px-4 py-2 rounded-lg transition-colors ${
                            isOpaque ? "text-gray-600 hover:text-gray-900" : "text-white/80 hover:text-white"
                        }`}
                    >
                        Log In
                    </Link>
                    <Link
                        href="/get-started"
                        className={`px-5 py-2 text-sm font-semibold rounded-lg transition-colors ${
                            isOpaque
                                ? "bg-blue-600 text-white hover:bg-blue-700"
                                : "bg-white text-blue-700 hover:bg-blue-50"
                        }`}
                    >
                        Sign Up Free
                    </Link>

                    {/* Mobile menu toggle */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className={`md:hidden p-2 rounded-lg transition-colors ${
                            isOpaque ? "text-gray-700 hover:bg-gray-100" : "text-white hover:bg-white/10"
                        }`}
                    >
                        {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-gray-200 shadow-lg p-4 space-y-1">
                    {NAV_SECTIONS.map((section) => (
                        <div key={section.label}>
                            <button
                                onClick={() => setMobileExpanded(mobileExpanded === section.label ? null : section.label)}
                                className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50"
                            >
                                <span className="flex items-center gap-2">
                                    <section.icon size={16} className="text-blue-600" />
                                    {section.label}
                                </span>
                                <ChevronDown size={14} className={`text-gray-400 transition-transform ${mobileExpanded === section.label ? "rotate-180" : ""}`} />
                            </button>
                            {mobileExpanded === section.label && (
                                <div className="ml-8 space-y-0.5 pb-2">
                                    {section.links.map((link) => (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="block px-4 py-2 text-sm text-gray-500 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                        >
                                            {link.label}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                    <div className="pt-3 border-t border-gray-100 space-y-2">
                        <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50">
                            Log In
                        </Link>
                        <Link href="/get-started" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 text-sm font-semibold text-white bg-blue-600 rounded-lg text-center hover:bg-blue-700">
                            Sign Up Free
                        </Link>
                    </div>
                </div>
            )}
        </header>
    );
}
