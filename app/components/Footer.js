"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
    Zap, 
    MessageCircle, 
    Globe, 
    Camera, 
    Briefcase, 
    Mail, 
    ShieldCheck, 
    ExternalLink,
    ArrowUpRight
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
            title: "Institutional",
            links: [
                { label: "About Agency", href: "/about" },
                { label: "Success Matrix", href: "/success-stories" },
                { label: "Pedagogical Blog", href: "/blog" },
                { label: "Contact Support", href: "/contact" }
            ]
        },
        {
            title: "Expert Portal",
            links: [
                { label: "Faculty Registration", href: "/register/tutor" },
                { label: "Member FAQ", href: "/faq/tutor" },
                { label: "Economic Framework", href: "/pricing/tutor" },
                { label: "Code of Conduct", href: "/guidelines" }
            ]
        },
        {
            title: "Student Core",
            links: [
                { label: "Expert Search", href: "/search?role=TUTOR" },
                { label: "AI Matchmaker", href: "/ai-match" },
                { label: "Domain Inventory", href: "/subjects" },
                { label: "Student FAQ", href: "/faq/student" }
            ]
        }
    ];

    return (
        <footer className="w-full bg-background-dark border-t border-border-dark font-sans pt-32 pb-16 selection:bg-primary/30">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-24">
                    {/* Brand Meta */}
                    <div className="lg:col-span-5">
                        <Link href="/" className="inline-flex items-center gap-3 mb-8 group">
                            <div className="size-12 rounded-[1.25rem] bg-primary flex items-center justify-center shadow-2xl shadow-primary/20 group-hover:scale-110 transition-transform">
                                <Zap size={24} className="text-white fill-white" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-2xl font-black tracking-tighter text-white leading-none">TuitionsInIndia</span>
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mt-1">Intelligence Agency</span>
                            </div>
                        </Link>
                        <p className="text-on-background-dark/40 text-lg font-medium leading-relaxed max-w-sm mb-10 italic">
                            The "Digital Ivory Tower" of pedagogical discovery. Architecting the future of matched intelligence across the Indian academic landscape.
                        </p>
                        <div className="flex gap-4">
                            {[MessageCircle, Globe, Camera, Briefcase].map((Icon, i) => (
                                <button key={i} className="size-12 rounded-2xl bg-surface-dark border border-border-dark flex items-center justify-center text-on-surface-dark/40 hover:text-primary hover:border-primary/50 hover:shadow-xl transition-all active:scale-95">
                                    <Icon size={20} />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Matrices */}
                    <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-12">
                        {footerLinks.map((section, idx) => (
                            <div key={idx}>
                                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-8">{section.title}</h4>
                                <ul className="space-y-4">
                                    {section.links.map((link, i) => (
                                        <li key={i}>
                                            <Link 
                                                href={link.href} 
                                                className="text-on-surface-dark/60 hover:text-white font-black uppercase tracking-widest text-[9px] transition-all flex items-center gap-2 group"
                                            >
                                                {link.label}
                                                <ArrowUpRight size={10} className="opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all text-primary" />
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom Legal Layer */}
                <div className="pt-16 border-t border-border-dark flex flex-col md:flex-row justify-between items-center gap-10">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <p className="text-on-background-dark/20 text-[10px] font-black uppercase tracking-[0.2em]">
                            © {new Date().getFullYear()} TII Ecosystem. All Rights Reserved.
                        </p>
                        <div className="flex gap-6">
                            <Link href="/legal/privacy" className="text-on-background-dark/20 hover:text-primary text-[10px] font-black uppercase tracking-[0.2em] transition-colors">Privacy Protocol</Link>
                            <Link href="/legal/terms" className="text-on-background-dark/20 hover:text-primary text-[10px] font-black uppercase tracking-[0.2em] transition-colors">Economic Mandate</Link>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3 px-6 py-3 bg-surface-dark border border-border-dark rounded-2xl">
                        <ShieldCheck size={14} className="text-primary" />
                        <span className="text-primary text-[9px] font-black uppercase tracking-[0.2em]">Institutional-Grade Security Layer</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
