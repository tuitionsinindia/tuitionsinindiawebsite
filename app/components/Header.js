"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Search, Menu, X, ArrowRight } from "lucide-react";
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

export default function Header() {
    const router = useRouter();
    const pathname = usePathname();
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const isSearchPage = pathname?.startsWith("/search");
    const isOpaque = scrolled || isSearchPage;

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navItems = [
        { label: "Find Tutors", href: "/search" },
        { label: "For Tutors", href: "/how-it-works/tutor" },
        { label: "Pricing", href: "/pricing/tutor" },
    ];

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

                {/* Nav — hidden on search page (space used by search bar) */}
                {!isSearchPage && (
                    <nav className="hidden md:flex items-center gap-8">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`text-sm font-medium transition-colors ${
                                    isOpaque ? "text-gray-600 hover:text-blue-600" : "text-white/80 hover:text-white"
                                }`}
                            >
                                {item.label}
                            </Link>
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
                <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-gray-200 shadow-lg p-6 space-y-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className="block px-4 py-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50"
                        >
                            {item.label}
                        </Link>
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
