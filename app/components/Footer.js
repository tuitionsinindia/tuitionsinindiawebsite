"use client";

import Link from "next/link";
import { ShieldCheck, Facebook, Twitter, Linkedin, Instagram } from "lucide-react";
import Logo from "./Logo";

export default function Footer() {
    return (
        <footer className="bg-white border-t border-gray-100 py-16 overflow-hidden relative">
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-10 mb-16 pb-16 border-b border-gray-100">
                    <div className="space-y-6 col-span-1 md:col-span-2 lg:col-span-1">
                        <Logo />
                        <p className="text-gray-500 text-sm font-medium leading-relaxed max-w-sm">
                            India's trusted platform connecting students with verified tutors. Find the right tutor for any subject, anywhere in India.
                        </p>
                        <div className="flex items-center gap-5">
                            {[Facebook, Twitter, Linkedin, Instagram].map((Icon, i) => (
                                <a key={i} href="#" className="text-gray-300 hover:text-blue-600 transition-all">
                                    <Icon size={20} strokeWidth={1.5} />
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-5">
                        <h4 className="text-xs font-bold text-gray-900">Explore</h4>
                        <nav className="flex flex-col gap-3">
                            {[
                                { name: "Find Tutors", href: "/search?role=TUTOR" },
                                { name: "Find Students", href: "/search?role=STUDENT" },
                                { name: "How It Works", href: "/how-it-works/tutor" },
                                { name: "All Subjects", href: "/subjects" },
                                { name: "Tutor Verification", href: "/kb/tutor" }
                            ].map((link, i) => (
                                <Link
                                    key={i}
                                    href={link.href}
                                    className="text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors"
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    <div className="space-y-5">
                        <h4 className="text-xs font-bold text-gray-900">Resources</h4>
                        <nav className="flex flex-col gap-3">
                            {[
                                { name: "Browse Categories", href: "/categories" },
                                { name: "For Institutes", href: "/how-it-works/institute" },
                                { name: "Pricing", href: "/pricing/tutor" },
                                { name: "Blog", href: "/blog" },
                                { name: "Contact Us", href: "/contact" }
                            ].map((link, i) => (
                                <Link
                                    key={i}
                                    href={link.href}
                                    className="text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors"
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    <div className="space-y-5">
                        <h4 className="text-xs font-bold text-gray-900">Legal</h4>
                        <nav className="flex flex-col gap-3">
                            {[
                                { name: "Privacy Policy", href: "/legal/privacy" },
                                { name: "Terms of Service", href: "/legal/terms" },
                                { name: "Cookie Policy", href: "/legal/cookies" },
                                { name: "About Us", href: "/about" }
                            ].map((link, i) => (
                                <Link
                                    key={i}
                                    href={link.href}
                                    className="text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors"
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    <div className="space-y-5">
                        <h4 className="text-xs font-bold text-gray-900">Popular Cities</h4>
                        <nav className="flex flex-col gap-3">
                            {[
                                "Mumbai", "Delhi", "Bangalore", "Kolkata",
                                "Hyderabad", "Chennai", "Pune", "Ahmedabad"
                            ].map((city) => (
                                <Link
                                    key={city}
                                    href={`/search?location=${encodeURIComponent(city)}&role=TUTOR`}
                                    className="text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors"
                                >
                                    Tutors in {city}
                                </Link>
                            ))}
                        </nav>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-3">
                        <ShieldCheck size={20} className="text-blue-600" />
                        <p className="text-gray-400 text-sm font-medium">© 2026 TuitionsinIndia. All rights reserved.</p>
                    </div>
                    <div className="flex items-center gap-8 opacity-40 grayscale hover:opacity-100 hover:grayscale-0 transition-all cursor-pointer">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/Razorpay_logo.svg" alt="Razorpay Security" className="h-5 w-auto" />
                    </div>
                </div>
            </div>
        </footer>
    );
}
