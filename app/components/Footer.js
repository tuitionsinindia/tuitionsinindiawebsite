"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
    Zap, 
    MessageCircle, 
    Facebook, 
    Instagram, 
    Linkedin, 
    Mail, 
    ShieldCheck, 
    Phone
} from "lucide-react";

export default function Footer() {
    const pathname = usePathname();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Hide footer on dashboard/admin/messages routes
    if (pathname && (pathname.startsWith("/dashboard") || pathname.startsWith("/admin") || pathname.startsWith("/messages"))) {
        return null;
    }

    if (!isMounted) return null;

    const footerLinks = [
        {
            title: "Platform",
            links: [
                { label: "About Us", href: "/about" },
                { label: "Contact Us", href: "/contact" },
                { label: "How it Works", href: "/how-it-works" },
                { label: "FAQs", href: "/faq" }
            ]
        },
        {
            title: "For Tutors",
            links: [
                { label: "Join as a Tutor", href: "/register/tutor" },
                { label: "Find Students", href: "/search?role=STUDENT" },
                { label: "Elite Membership", href: "/pricing" },
                { label: "Tutor Guidelines", href: "/guidelines" }
            ]
        },
        {
            title: "For Students",
            links: [
                { label: "Find a Tutor", href: "/search?role=TUTOR" },
                { label: "Post a Requirement", href: "/post-requirement" },
                { label: "View Categories", href: "/categories" },
                { label: "Success Stories", href: "/about#success" }
            ]
        }
    ];

    return (
        <footer className="w-full bg-[#0a0a0b] border-t border-white/5 font-sans pt-24 pb-12 selection:bg-blue-500/30">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-20">
                    {/* Brand Info */}
                    <div className="lg:col-span-5 space-y-8">
                        <Link href="/" className="inline-flex items-center gap-3 group">
                            <div className="size-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20 group-hover:scale-110 transition-transform">
                                <Zap size={20} className="text-white fill-white" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xl font-black tracking-tight text-white leading-none">TuitionsInIndia.com</span>
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-500 mt-1">Leading Tuition Marketplace</span>
                            </div>
                        </Link>
                        <p className="text-gray-400 text-lg font-medium leading-relaxed max-w-sm">
                            India's most trusted network for finding quality home and online tutors. Connecting thousands of students with expert educators every month.
                        </p>
                        <div className="flex gap-4">
                            {[Facebook, Instagram, Linkedin, Mail].map((Icon, i) => (
                                <button key={i} className="size-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 hover:text-blue-500 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all">
                                    <Icon size={18} />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links Grid */}
                    <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-12">
                        {footerLinks.map((section, idx) => (
                            <div key={idx} className="space-y-6">
                                <h4 className="text-sm font-bold text-white tracking-wide">{section.title}</h4>
                                <ul className="space-y-4">
                                    {section.links.map((link, i) => (
                                        <li key={i}>
                                            <Link 
                                                href={link.href} 
                                                className="text-gray-500 hover:text-blue-500 text-sm font-medium transition-colors"
                                            >
                                                {link.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
                        <p className="text-gray-600 text-xs font-medium">
                            © {new Date().getFullYear()} tuitionsinindia.com. All rights reserved.
                        </p>
                        <div className="flex gap-6">
                            <Link href="/legal/privacy" className="text-gray-600 hover:text-blue-500 text-xs font-medium transition-colors">Privacy Policy</Link>
                            <Link href="/legal/terms" className="text-gray-600 hover:text-blue-500 text-xs font-medium transition-colors">Terms of Service</Link>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl">
                            <ShieldCheck size={14} className="text-blue-500" />
                            <span className="text-gray-400 text-[11px] font-bold uppercase tracking-wider">Secure Marketplace</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}


