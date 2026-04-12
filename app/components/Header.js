"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, Menu, X } from "lucide-react";
import Logo from "./Logo";

export default function Header() {
    const router = useRouter();
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
            scrolled
                ? "bg-white/95 backdrop-blur-md border-b border-gray-100 py-3 shadow-sm"
                : "bg-transparent py-4"
        }`}>
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                {/* Logo + Nav */}
                <div className="flex items-center gap-10">
                    <Logo light={!scrolled} />

                    <nav className="hidden md:flex items-center gap-8">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`text-sm font-medium transition-colors ${
                                    scrolled ? "text-gray-600 hover:text-blue-600" : "text-white/80 hover:text-white"
                                }`}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-3">
                    <Link
                        href="/login"
                        className={`hidden sm:inline-flex text-sm font-medium px-4 py-2 rounded-lg transition-colors ${
                            scrolled ? "text-gray-600 hover:text-gray-900" : "text-white/80 hover:text-white"
                        }`}
                    >
                        Log In
                    </Link>
                    <Link
                        href="/get-started"
                        className={`px-5 py-2 text-sm font-semibold rounded-lg transition-colors ${
                            scrolled
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
                            scrolled ? "text-gray-700 hover:bg-gray-100" : "text-white hover:bg-white/10"
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
