"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    Search, MapPin, ChevronDown, Star, ShieldCheck,
    MessageSquare, ArrowRight, CheckCircle2, Users,
    GraduationCap, Zap, BookOpen, Building2, Award
} from "lucide-react";
import { ALL_SUBJECTS, BROAD_CATEGORIES, SUBJECT_CATEGORIES, getSubjectsForCategory, GRADE_OPTIONS, CITY_OPTIONS } from "../lib/subjects";

// School sub-categories that need a level step before showing subjects
const SCHOOL_SUB_CATEGORIES = SUBJECT_CATEGORIES.filter(sc =>
    ["school_k5", "school_6_10", "school_11_12_sci", "school_11_12_comm", "school_11_12_hum", "college_uni"].includes(sc.id)
);

export default function Home() {
    const [searchCategory, setSearchCategory] = useState("");
    const [searchSchoolLevel, setSearchSchoolLevel] = useState(""); // only used when category = "academics"
    const [searchSubject, setSearchSubject] = useState("");
    const [searchGrade, setSearchGrade] = useState("");
    const [searchLocation, setSearchLocation] = useState("");
    const [activeTab, setActiveTab] = useState("TUTOR");
    const [openFaq, setOpenFaq] = useState(null);

    const isAcademics = searchCategory === "academics";

    const heroContent = {
        TUTOR: {
            badge: "India's #1 Tutor Marketplace",
            headline: <>Find the Right Tutor <span className="text-yellow-300">Near You</span></>,
            subtitle: "Free to search. No commission. Connect directly with verified tutors for home tuition, online classes, or coaching centres across India.",
            btnLabel: "Search Tutors",
        },
        STUDENT: {
            badge: "Post a requirement — tutors come to you",
            headline: <>Find Students <span className="text-yellow-300">for Your Subjects</span></>,
            subtitle: "Create your tutor profile and get matched with students who need exactly what you teach. Free to list, zero commission.",
            btnLabel: "Search Students",
        },
        INSTITUTE: {
            badge: "India's #1 Tutor Marketplace",
            headline: <>Find Coaching Centres <span className="text-yellow-300">Near You</span></>,
            subtitle: "Browse verified coaching centres and institutes for any subject, exam, or skill — across 500+ cities in India.",
            btnLabel: "Search Institutes",
        },
    };
    const hero = heroContent[activeTab] || heroContent.TUTOR;

    // For academics: subjects come from the chosen school level; for others: filtered by broad category
    const availableSubjects = isAcademics
        ? (searchSchoolLevel ? (SUBJECT_CATEGORIES.find(sc => sc.id === searchSchoolLevel)?.subjects || []) : [])
        : (searchCategory ? getSubjectsForCategory(searchCategory) : ALL_SUBJECTS);

    const router = useRouter();

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (searchCategory) params.set("category", searchCategory);
        if (searchSchoolLevel) params.set("grade", searchSchoolLevel);
        else if (searchGrade) params.set("grade", searchGrade);
        if (searchSubject) params.set("subject", searchSubject);
        params.set("role", activeTab);
        if (searchLocation) params.set("location", searchLocation);
        router.push(`/search?${params.toString()}`);
    };

    const faqs = [
        { q: "Is it free to find a tutor?", a: "Yes, browsing and connecting with tutors is completely free for students. Tutors pay a small subscription to access student leads." },
        { q: "How are tutors verified?", a: "All tutors go through a profile review. Premium tutors are ID-verified with qualification checks before getting a verified badge." },
        { q: "Can I find online tutors too?", a: "Absolutely. You can filter by online or home tuition. We have tutors available across India for both modes." },
        { q: "How do I contact a tutor?", a: "Once you find a match, you can message them directly or share your phone number to connect instantly." }
    ];

    return (
        <div className="bg-white text-gray-800 font-sans">

            {/* ── HERO ── */}
            <section className="relative bg-gradient-to-br from-blue-700 via-blue-600 to-blue-800 text-white pt-16 pb-8">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url('/indian_hero.png')", backgroundSize: "cover", backgroundPosition: "center" }} />
                <div className="relative max-w-5xl mx-auto px-4 text-center">
                    <span className="inline-block bg-white/20 text-white text-xs font-semibold px-4 py-1.5 rounded-full mb-5 tracking-wide">
                        {hero.badge}
                    </span>
                    <h1 className="text-3xl md:text-5xl font-bold text-white mb-3 leading-tight">
                        {hero.headline}
                    </h1>
                    <p className="text-blue-100 text-sm md:text-base mb-6 max-w-xl mx-auto">
                        {hero.subtitle}
                    </p>

                    {/* Search Box */}
                    <div className="bg-white rounded-2xl shadow-xl overflow-visible">
                        {/* Tabs */}
                        <div className="flex border-b border-gray-100">
                            {[
                                { id: "TUTOR", label: "Tutors" },
                                { id: "STUDENT", label: "Students" },
                                { id: "INSTITUTE", label: "Institutes" }
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex-1 py-3 text-sm font-semibold transition-colors border-b-2 -mb-px whitespace-nowrap ${
                                        activeTab === tab.id
                                            ? "border-blue-600 text-blue-600"
                                            : "border-transparent text-gray-500 hover:text-gray-700"
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Search inputs — 2 rows on mobile, 1 row on desktop */}
                        <div className="p-3 space-y-2">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                {/* Category */}
                                <select
                                    value={searchCategory}
                                    onChange={(e) => { setSearchCategory(e.target.value); setSearchSubject(""); setSearchSchoolLevel(""); setSearchGrade(""); }}
                                    className="h-11 px-3 border border-gray-200 rounded-lg bg-gray-50 text-sm text-gray-700 outline-none focus:border-blue-500 cursor-pointer"
                                >
                                    <option value="">All Categories</option>
                                    {BROAD_CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                                </select>

                                {/* Level — for School & Academics: show school sub-levels; for others: generic grade */}
                                {isAcademics ? (
                                    <select
                                        value={searchSchoolLevel}
                                        onChange={(e) => { setSearchSchoolLevel(e.target.value); setSearchSubject(""); }}
                                        className="h-11 px-3 border border-gray-200 rounded-lg bg-gray-50 text-sm text-gray-700 outline-none focus:border-blue-500 cursor-pointer"
                                    >
                                        <option value="">Select Level</option>
                                        {SCHOOL_SUB_CATEGORIES.map(sc => <option key={sc.id} value={sc.id}>{sc.name}</option>)}
                                    </select>
                                ) : (
                                    <select
                                        value={searchGrade}
                                        onChange={(e) => setSearchGrade(e.target.value)}
                                        className="h-11 px-3 border border-gray-200 rounded-lg bg-gray-50 text-sm text-gray-700 outline-none focus:border-blue-500 cursor-pointer"
                                    >
                                        <option value="">Level</option>
                                        {GRADE_OPTIONS.map(g => <option key={g} value={g}>{g}</option>)}
                                    </select>
                                )}

                                {/* Subject — filtered by category+level */}
                                <select
                                    value={searchSubject}
                                    onChange={(e) => setSearchSubject(e.target.value)}
                                    disabled={isAcademics && !searchSchoolLevel}
                                    className="h-11 px-3 border border-gray-200 rounded-lg bg-gray-50 text-sm text-gray-700 outline-none focus:border-blue-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <option value="">{isAcademics && !searchSchoolLevel ? "Pick level first" : "Subject"}</option>
                                    {availableSubjects.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>

                                {/* City */}
                                <select
                                    value={searchLocation}
                                    onChange={(e) => setSearchLocation(e.target.value)}
                                    className="h-11 px-3 border border-gray-200 rounded-lg bg-gray-50 text-sm text-gray-700 outline-none focus:border-blue-500 cursor-pointer"
                                >
                                    <option value="">City</option>
                                    {CITY_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>

                            <button onClick={handleSearch}
                                className="w-full h-11 bg-blue-600 text-white rounded-lg font-semibold text-sm hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-md">
                                <Search size={15} /> {hero.btnLabel}
                            </button>
                        </div>
                    </div>

                    {/* Trust bar */}
                    <div className="mt-6 flex flex-wrap justify-center gap-6 text-blue-100 text-sm">
                        <span className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-yellow-300" /> Verified Tutors</span>
                        <span className="flex items-center gap-1.5"><Star size={14} className="text-yellow-300" /> Top Rated</span>
                        <span className="flex items-center gap-1.5"><MessageSquare size={14} className="text-yellow-300" /> Direct Contact</span>
                    </div>
                </div>
            </section>

            {/* ── STATS STRIP ── */}
            <section className="bg-white border-b border-gray-100 py-8">
                <div className="max-w-5xl mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                        {[
                            { value: "50,000+", label: "Tutors Listed" },
                            { value: "1 Lakh+", label: "Students Connected" },
                            { value: "500+", label: "Cities Covered" },
                            { value: "4.7 ★", label: "Average Rating" }
                        ].map((s, i) => (
                            <div key={i}>
                                <div className="text-2xl font-bold text-blue-600">{s.value}</div>
                                <div className="text-xs text-gray-500 mt-1 font-medium">{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── HOW IT WORKS ── */}
            <section className="py-14 px-4 bg-gray-50">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-10">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">How It Works</h2>
                        <p className="text-gray-500 mt-2 text-sm">Get started in just 3 simple steps</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { step: "1", title: "Search", desc: "Enter your subject, class level, and city to find matching tutors near you.", icon: Search },
                            { step: "2", title: "Compare", desc: "View profiles, ratings, and fees. Shortlist tutors that match your requirements.", icon: ShieldCheck },
                            { step: "3", title: "Connect", desc: "Contact the tutor directly — no middlemen, no commission charges.", icon: MessageSquare }
                        ].map((item, i) => (
                            <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex gap-4">
                                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-bold text-lg flex items-center justify-center shrink-0">
                                    {item.step}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                                    <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── BROWSE BY CATEGORY ── */}
            <section className="py-14 px-4 bg-white">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-10">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Browse by Category</h2>
                        <p className="text-gray-500 mt-2 text-sm">Find tutors across all subjects and skill areas</p>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                        {BROAD_CATEGORIES.map((cat) => (
                            <Link key={cat.id} href={`/browse?category=${cat.id}`}
                                className="flex flex-col items-center gap-3 p-6 rounded-xl border border-gray-100 hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-all group text-center">
                                <div className="size-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                    <cat.icon size={24} strokeWidth={1.5} />
                                </div>
                                <span className="text-sm font-semibold text-gray-700 group-hover:text-blue-700 leading-tight">{cat.label}</span>
                            </Link>
                        ))}
                    </div>
                    <div className="mt-8 text-center">
                        <Link href="/subjects" className="inline-flex items-center gap-2 text-blue-600 font-semibold text-sm hover:underline">
                            View all subjects <ArrowRight size={14} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── WHY CHOOSE US ── */}
            <section className="py-14 px-4 bg-blue-600 text-white">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-10">
                        <h2 className="text-2xl md:text-3xl font-bold">Why Students & Tutors Trust Us</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                            { icon: ShieldCheck, title: "Verified Tutors", desc: "Every tutor is profile-verified. Premium tutors are ID and qualification checked." },
                            { icon: Users, title: "Wide Reach", desc: "500+ cities across India. Find tutors for home, online, or coaching centre." },
                            { icon: BookOpen, title: "All Subjects", desc: "From school academics to competitive exams — NEET, JEE, UPSC, and more." },
                            { icon: Zap, title: "Quick Match", desc: "Get matched with the right tutor in minutes, not days." }
                        ].map((f, i) => (
                            <div key={i} className="bg-white/10 rounded-xl p-5 text-center">
                                <f.icon size={28} className="mx-auto mb-3 text-yellow-300" strokeWidth={1.5} />
                                <h3 className="font-semibold text-white mb-1 text-sm">{f.title}</h3>
                                <p className="text-blue-100 text-xs leading-relaxed">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── FAQ ── */}
            <section className="py-14 px-4 bg-white">
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-10">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Frequently Asked Questions</h2>
                    </div>
                    <div className="space-y-3">
                        {faqs.map((item, i) => (
                            <div key={i} className="border border-gray-200 rounded-xl overflow-hidden">
                                <button
                                    className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                >
                                    <span className="font-semibold text-gray-800 text-sm">{item.q}</span>
                                    <ChevronDown size={16} className={`text-gray-400 transition-transform shrink-0 ml-3 ${openFaq === i ? "rotate-180" : ""}`} />
                                </button>
                                {openFaq === i && (
                                    <div className="px-4 pb-4 text-sm text-gray-500 leading-relaxed border-t border-gray-100 pt-3">
                                        {item.a}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── VIP SERVICE HIGHLIGHT ── */}
            <section className="py-14 px-4 bg-gradient-to-br from-blue-700 to-indigo-800 text-white">
                <div className="max-w-5xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                        <div>
                            <span className="inline-flex items-center gap-2 bg-white/20 text-white text-xs font-semibold px-4 py-1.5 rounded-full mb-5 border border-white/30">
                                <Award size={12} /> New — VIP Managed Service
                            </span>
                            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 leading-snug">
                                Don't have time to search?<br />We'll find the tutor for you.
                            </h2>
                            <p className="text-blue-100 text-sm leading-relaxed mb-6">
                                Tell us what you need. Our team handpicks the best verified tutors, arranges a monitored intro call, and manages everything — with 3 free replacements guaranteed.
                            </p>
                            <div className="flex flex-col sm:flex-row items-start gap-3">
                                <Link href="/vip"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-700 font-bold rounded-xl hover:bg-blue-50 transition-colors text-sm shadow-lg">
                                    Learn About VIP <ArrowRight size={15} />
                                </Link>
                                <Link href="/vip/apply"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 text-white border border-white/30 font-semibold rounded-xl hover:bg-white/20 transition-colors text-sm">
                                    Enroll — ₹2,000
                                </Link>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { value: "48 hrs", label: "First match sent" },
                                { value: "3×", label: "Free replacements" },
                                { value: "4.5+", label: "Tutor rating" },
                                { value: "₹2,000", label: "One-time fee" },
                            ].map(stat => (
                                <div key={stat.label} className="bg-white/10 rounded-xl p-5 border border-white/20">
                                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                                    <p className="text-blue-200 text-xs mt-1">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── CTA BANNER ── */}
            <section className="py-14 px-4 bg-gray-900 text-white">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-10">
                        <h2 className="text-2xl md:text-3xl font-bold">Get Started Today</h2>
                        <p className="text-gray-400 text-sm mt-2">Join India's most trusted tuition marketplace — free for everyone.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            {
                                icon: GraduationCap,
                                title: "For Students",
                                desc: "Find the perfect tutor for any subject, exam, or skill.",
                                link: "/register/student",
                                btnLabel: "Sign Up as Student"
                            },
                            {
                                icon: Users,
                                title: "For Tutors",
                                desc: "Grow your teaching business. Get student enquiries directly.",
                                link: "/register/tutor",
                                btnLabel: "Sign Up as Tutor"
                            },
                            {
                                icon: Building2,
                                title: "For Institutes",
                                desc: "List your coaching centre and reach students across India.",
                                link: "/register/institute",
                                btnLabel: "Sign Up as Institute"
                            }
                        ].map((item, i) => (
                            <div key={i} className="bg-white/5 rounded-xl p-6 text-center">
                                <item.icon size={28} className="mx-auto mb-3 text-yellow-300" strokeWidth={1.5} />
                                <h3 className="font-semibold text-white mb-1 text-sm">{item.title}</h3>
                                <p className="text-gray-400 text-xs leading-relaxed mb-4">{item.desc}</p>
                                <Link href={item.link}
                                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg font-semibold text-sm hover:bg-blue-700 transition-colors">
                                    {item.btnLabel} <ArrowRight size={14} />
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── FOOTER ── */}
            <footer className="bg-white border-t border-gray-100 py-10">
                <div className="max-w-5xl mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
                        {/* Brand */}
                        <div className="col-span-2 md:col-span-1">
                            <Link href="/">
                                <img src="/logo_minimal.png" alt="TuitionsInIndia" className="h-9 w-auto mb-3" />
                            </Link>
                            <p className="text-xs text-gray-400 leading-relaxed">India's most trusted tuition marketplace. Free to search, zero commission.</p>
                        </div>

                        {/* For Students */}
                        <div>
                            <h4 className="text-xs font-semibold text-gray-900 mb-3">For Students</h4>
                            <div className="space-y-2">
                                {[
                                    { label: "Find Tutors", href: "/search?role=TUTOR" },
                                    { label: "How it Works", href: "/how-it-works/student" },
                                    { label: "Pricing", href: "/pricing/student" },
                                    { label: "Post Requirement", href: "/post-requirement" },
                                    { label: "Sign Up", href: "/register/student" },
                                ].map((link, i) => (
                                    <Link key={i} href={link.href} className="block text-xs text-gray-500 hover:text-blue-600 transition-colors">{link.label}</Link>
                                ))}
                            </div>
                        </div>

                        {/* For Tutors */}
                        <div>
                            <h4 className="text-xs font-semibold text-gray-900 mb-3">For Tutors</h4>
                            <div className="space-y-2">
                                {[
                                    { label: "How it Works", href: "/how-it-works/tutor" },
                                    { label: "Pricing", href: "/pricing/tutor" },
                                    { label: "Find Students", href: "/search?role=STUDENT" },
                                    { label: "Sign Up", href: "/register/tutor" },
                                ].map((link, i) => (
                                    <Link key={i} href={link.href} className="block text-xs text-gray-500 hover:text-blue-600 transition-colors">{link.label}</Link>
                                ))}
                            </div>
                        </div>

                        {/* For Institutes */}
                        <div>
                            <h4 className="text-xs font-semibold text-gray-900 mb-3">For Institutes</h4>
                            <div className="space-y-2">
                                {[
                                    { label: "How it Works", href: "/how-it-works/institute" },
                                    { label: "Pricing", href: "/pricing/institute" },
                                    { label: "Sign Up", href: "/register/institute" },
                                ].map((link, i) => (
                                    <Link key={i} href={link.href} className="block text-xs text-gray-500 hover:text-blue-600 transition-colors">{link.label}</Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Bottom bar */}
                    <div className="border-t border-gray-100 pt-6 flex flex-col md:flex-row justify-between items-center gap-3">
                        <p className="text-xs text-gray-400">© 2026 TuitionsInIndia.com. All rights reserved.</p>
                        <nav className="flex flex-wrap gap-x-4 gap-y-1">
                            {[
                                { label: "Blog", href: "/blog" },
                                { label: "Contact", href: "/contact" },
                                { label: "Privacy Policy", href: "/legal/privacy" },
                                { label: "Terms", href: "/legal/terms" },
                            ].map((link, i) => (
                                <Link key={i} href={link.href} className="text-xs text-gray-400 hover:text-blue-600 transition-colors">{link.label}</Link>
                            ))}
                        </nav>
                    </div>
                </div>
            </footer>
        </div>
    );
}
