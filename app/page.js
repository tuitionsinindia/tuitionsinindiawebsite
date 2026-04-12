"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    Search, MapPin, ChevronDown, Star, ShieldCheck,
    MessageSquare, ArrowRight, CheckCircle2, Users,
    GraduationCap, Zap, BookOpen, Phone
} from "lucide-react";
import { ALL_SUBJECTS, POPULAR_SUBJECTS } from "../lib/subjects";

export default function Home() {
    const [searchSubject, setSearchSubject] = useState("");
    const [searchGrade, setSearchGrade] = useState("");
    const [searchLocation, setSearchLocation] = useState("");
    const [filteredSubjects, setFilteredSubjects] = useState([]);
    const [showSubjectSuggestions, setShowSubjectSuggestions] = useState(false);
    const [showCityDropdown, setShowCityDropdown] = useState(false);
    const [showGradeDropdown, setShowGradeDropdown] = useState(false);
    const [activeTab, setActiveTab] = useState("TUTOR");
    const [openFaq, setOpenFaq] = useState(null);

    const majorCities = ["Mumbai", "Delhi", "Bangalore", "Kolkata", "Hyderabad", "Chennai", "Pune", "Ahmedabad"];
    const gradesList = ["Class 1–5", "Class 6–8", "Class 9–10", "Class 11–12", "Competitive Exams", "College / University"];

    const router = useRouter();

    useEffect(() => {
        if (searchSubject.length >= 1) {
            const q = searchSubject.toLowerCase();
            const filtered = ALL_SUBJECTS.filter(s => s.toLowerCase().includes(q));
            setFilteredSubjects(filtered);
            setShowSubjectSuggestions(filtered.length > 0);
        } else {
            setShowSubjectSuggestions(false);
        }
    }, [searchSubject]);

    const handleSearch = () => {
        const params = new URLSearchParams();
        params.set("subject", searchSubject);
        params.set("grade", searchGrade);
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
                        India's #1 Tutor Marketplace
                    </span>
                    <h1 className="text-3xl md:text-5xl font-bold text-white mb-3 leading-tight">
                        Find the Right Tutor, <span className="text-yellow-300">Near You</span>
                    </h1>
                    <p className="text-blue-100 text-sm md:text-base mb-6 max-w-xl mx-auto">
                        Connect with verified tutors for home tuition, online classes, or coaching centres across India.
                    </p>

                    {/* Search Box */}
                    <div className="bg-white rounded-2xl shadow-xl overflow-visible">
                        {/* Tabs */}
                        <div className="flex border-b border-gray-100">
                            {[
                                { id: "TUTOR", label: "Find Tutors" },
                                { id: "STUDENT", label: "Find Students" },
                                { id: "INSTITUTE", label: "Find Institutes" }
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex-1 py-3 text-sm font-semibold transition-colors border-b-2 -mb-px ${
                                        activeTab === tab.id
                                            ? "border-blue-600 text-blue-600"
                                            : "border-transparent text-gray-500 hover:text-gray-700"
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Search inputs row */}
                        <div className="p-3" style={{display:'grid', gridTemplateColumns:'1fr 160px 130px auto', gap:'8px'}}>
                            {/* Subject */}
                            <div className="relative">
                                <div className="flex items-center gap-2 px-3 h-11 border border-gray-200 rounded-lg bg-gray-50 focus-within:border-blue-500 focus-within:bg-white transition-all">
                                    <Search size={15} className="text-gray-400 shrink-0" />
                                    <input
                                        className="w-full bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400"
                                        placeholder="Subject (e.g. Maths)"
                                        value={searchSubject}
                                        onChange={e => setSearchSubject(e.target.value)}
                                    />
                                </div>
                                {showSubjectSuggestions && (
                                    <div className="absolute top-full mt-1 left-0 w-56 bg-white border border-gray-200 rounded-xl shadow-lg z-50 py-1 overflow-hidden">
                                        {filteredSubjects.slice(0, 6).map((s, i) => (
                                            <div key={i} onMouseDown={() => { setSearchSubject(s); setShowSubjectSuggestions(false); }}
                                                className="px-4 py-2.5 hover:bg-blue-50 cursor-pointer text-sm text-gray-700 hover:text-blue-700">
                                                {s}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Grade */}
                            <div className="relative">
                                <div className="flex items-center gap-1.5 px-3 h-11 border border-gray-200 rounded-lg bg-gray-50 cursor-pointer hover:border-blue-400 transition-all"
                                    onClick={() => { setShowGradeDropdown(!showGradeDropdown); setShowCityDropdown(false); }}>
                                    <GraduationCap size={14} className="text-gray-400 shrink-0" />
                                    <span className="flex-1 text-sm text-gray-600 truncate">{searchGrade || "Class"}</span>
                                    <ChevronDown size={13} className="text-gray-400 shrink-0" />
                                </div>
                                {showGradeDropdown && (
                                    <div className="absolute top-full mt-1 left-0 w-52 bg-white border border-gray-200 rounded-xl shadow-lg z-50 py-1">
                                        {gradesList.map((g, i) => (
                                            <div key={i} onClick={() => { setSearchGrade(g); setShowGradeDropdown(false); }}
                                                className="px-4 py-2.5 hover:bg-blue-50 cursor-pointer text-sm text-gray-700 hover:text-blue-700">
                                                {g}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* City */}
                            <div className="relative">
                                <div className="flex items-center gap-1.5 px-3 h-11 border border-gray-200 rounded-lg bg-gray-50 cursor-pointer hover:border-blue-400 transition-all"
                                    onClick={() => { setShowCityDropdown(!showCityDropdown); setShowGradeDropdown(false); }}>
                                    <MapPin size={14} className="text-gray-400 shrink-0" />
                                    <span className="flex-1 text-sm text-gray-600 truncate">{searchLocation || "City"}</span>
                                    <ChevronDown size={13} className="text-gray-400 shrink-0" />
                                </div>
                                {showCityDropdown && (
                                    <div className="absolute top-full mt-1 left-0 w-44 bg-white border border-gray-200 rounded-xl shadow-lg z-50 py-1">
                                        {majorCities.map((city, i) => (
                                            <div key={i} onClick={() => { setSearchLocation(city); setShowCityDropdown(false); }}
                                                className="px-4 py-2.5 hover:bg-blue-50 cursor-pointer text-sm text-gray-700 hover:text-blue-700">
                                                {city}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <button onClick={handleSearch}
                                className="h-11 px-5 bg-blue-600 text-white rounded-lg font-semibold text-sm hover:bg-blue-700 active:scale-95 transition-all flex items-center gap-2 whitespace-nowrap shadow-md">
                                <Search size={15} /> Search
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
                            { step: "3", title: "Connect", desc: "Contact the tutor directly — no middlemen, no commission charges.", icon: Phone }
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

            {/* ── POPULAR SUBJECTS ── */}
            <section className="py-14 px-4 bg-white">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-10">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Popular Subjects</h2>
                        <p className="text-gray-500 mt-2 text-sm">Find expert tutors for any subject</p>
                    </div>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
                        {POPULAR_SUBJECTS.map((cat, i) => (
                            <Link key={i} href={`/search?subject=${encodeURIComponent(cat.title)}&role=TUTOR`}
                                className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-100 hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-all group text-center">
                                <div className="text-blue-600 group-hover:text-blue-700">
                                    <cat.icon size={24} strokeWidth={1.5} />
                                </div>
                                <span className="text-xs font-semibold text-gray-700 group-hover:text-blue-700 leading-tight">{cat.title}</span>
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

            {/* ── CTA BANNER ── */}
            <section className="py-12 px-4 bg-gray-900 text-white">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-2xl md:text-3xl font-bold mb-3">Are You a Tutor?</h2>
                    <p className="text-gray-400 text-sm mb-6 max-w-lg mx-auto">
                        Join thousands of tutors already growing their student base on TuitionsInIndia. Create your free profile today.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Link href="/register/tutor"
                            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
                            Register as Tutor <ArrowRight size={16} />
                        </Link>
                        <Link href="/search"
                            className="px-6 py-3 bg-white/10 text-white rounded-xl font-semibold text-sm hover:bg-white/20 transition-all flex items-center justify-center gap-2">
                            Find a Tutor
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── FOOTER ── */}
            <footer className="bg-white border-t border-gray-100 py-10">
                <div className="max-w-5xl mx-auto px-4">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
                        <Link href="/">
                            <img src="/logo_minimal.png" alt="TuitionsInIndia" className="h-9 w-auto" />
                        </Link>
                        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
                            {[
                                { label: "Find Tutors", href: "/search" },
                                { label: "For Tutors", href: "/register/tutor" },
                                { label: "Pricing", href: "/pricing" },
                                { label: "Blog", href: "/blog" },
                                { label: "Privacy Policy", href: "/legal/privacy" },
                                { label: "Contact", href: "/contact" }
                            ].map((link, i) => (
                                <Link key={i} href={link.href} className="text-xs text-gray-500 hover:text-blue-600 transition-colors font-medium">{link.label}</Link>
                            ))}
                        </nav>
                    </div>
                    <div className="border-t border-gray-100 pt-6 flex flex-col md:flex-row justify-between items-center gap-3">
                        <p className="text-xs text-gray-400">© 2026 TuitionsInIndia.com. All rights reserved.</p>
                        <p className="text-xs text-gray-400">Made with ❤️ for students across India</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
