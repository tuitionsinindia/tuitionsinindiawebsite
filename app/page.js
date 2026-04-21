"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    Search, MapPin, ChevronDown, Star, ShieldCheck,
    MessageSquare, ArrowRight, CheckCircle2, Users,
    GraduationCap, Zap, BookOpen, Building2, Award,
    BadgeCheck, Monitor, Home as HomeIcon, Layers,
    TrendingUp, Clock, IndianRupee
} from "lucide-react";

// ── Avatar with initials + deterministic colour ──────────────────────────────
const AVATAR_COLOURS = [
    "from-blue-500 to-blue-700",
    "from-violet-500 to-purple-700",
    "from-emerald-500 to-teal-700",
    "from-rose-500 to-pink-700",
    "from-amber-500 to-orange-600",
    "from-cyan-500 to-sky-700",
];

function TutorAvatar({ name, image, size = "lg" }) {
    const initials = (name || "?").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
    const colourIdx = (name || "").charCodeAt(0) % AVATAR_COLOURS.length;
    const dim = size === "lg" ? "w-14 h-14 text-lg" : "w-10 h-10 text-sm";
    if (image) return <img src={image} alt={name} className={`${dim} rounded-full object-cover`} />;
    return (
        <div className={`${dim} rounded-full bg-gradient-to-br ${AVATAR_COLOURS[colourIdx]} text-white font-bold flex items-center justify-center shrink-0`}>
            {initials}
        </div>
    );
}

function ModeBadge({ modes = [] }) {
    const has = (m) => modes.includes(m);
    if (has("ONLINE") && has("HOME")) return <span className="text-xs text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full font-medium">Online + Home</span>;
    if (has("ONLINE")) return <span className="text-xs text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full font-medium">Online</span>;
    if (has("HOME")) return <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">Home Tuition</span>;
    return null;
}

function TutorCard({ listing }) {
    const { id, title, subjects = [], locations = [], hourlyRate, rating, reviewCount, experience, teachingModes = [], offersTrialClass, tutor } = listing;
    const name = tutor?.name || "Tutor";
    const verified = tutor?.isVerified || tutor?.isIdVerified;
    const city = locations[0] || "";

    return (
        <Link href={`/search/${id}`} className="group flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-blue-100 transition-all overflow-hidden">
            {/* Photo + name header */}
            <div className="p-5 pb-3 flex gap-4 items-center">
                <div className="relative shrink-0">
                    <TutorAvatar name={name} image={tutor?.image} size="lg" />
                    {verified && (
                        <span className="absolute -bottom-1 -right-1 size-5 bg-blue-600 rounded-full flex items-center justify-center border-2 border-white">
                            <BadgeCheck size={10} className="text-white" />
                        </span>
                    )}
                </div>
                <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-bold text-gray-900 text-sm">{name}</span>
                        {rating > 0 && (
                            <span className="flex items-center gap-0.5 text-xs font-semibold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-full">
                                <Star size={10} className="fill-amber-500 text-amber-500" /> {rating.toFixed(1)}
                            </span>
                        )}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-2 leading-relaxed">{title}</p>
                </div>
            </div>

            {/* Subjects */}
            <div className="px-5 pb-3 flex flex-wrap gap-1.5">
                {subjects.slice(0, 3).map(s => (
                    <span key={s} className="text-xs bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full font-medium">{s}</span>
                ))}
                {subjects.length > 3 && (
                    <span className="text-xs bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full">+{subjects.length - 3} more</span>
                )}
            </div>

            {/* Meta */}
            <div className="px-5 pb-4 flex flex-wrap items-center gap-3 text-xs text-gray-500 mt-auto">
                {city && <span className="flex items-center gap-1"><MapPin size={11} className="text-gray-400" />{city}</span>}
                {experience > 0 && <span className="flex items-center gap-1"><Award size={11} className="text-gray-400" />{experience} yrs exp</span>}
                <ModeBadge modes={teachingModes} />
                {offersTrialClass && (
                    <span className="flex items-center gap-1 text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
                        ✓ Free trial
                    </span>
                )}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-100 px-5 py-3 flex items-center justify-between bg-gray-50/50">
                <div className="text-xs text-gray-400">{reviewCount > 0 ? `${reviewCount} reviews` : "New tutor"}</div>
                <div className="flex items-center gap-3">
                    {hourlyRate && <span className="text-sm font-bold text-gray-900">₹{hourlyRate}<span className="text-xs font-normal text-gray-400">/hr</span></span>}
                    <span className="text-xs font-semibold text-blue-600 group-hover:underline flex items-center gap-0.5">
                        View Profile <ArrowRight size={11} />
                    </span>
                </div>
            </div>
        </Link>
    );
}

function InstituteCard({ listing }) {
    const { id, title, subjects = [], locations = [], hourlyRate, rating, reviewCount, experience, offersTrialClass, tutor } = listing;
    const name = tutor?.name || "Institute";
    const verified = tutor?.isVerified;
    const city = locations[0] || "";
    const initials = name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

    return (
        <Link href={`/search/${id}`} className="group flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-blue-100 transition-all overflow-hidden">
            {/* Header with logo */}
            <div className="p-5 pb-3 flex gap-4 items-center">
                <div className="relative shrink-0">
                    {tutor?.image ? (
                        <img src={tutor.image} alt={name} className="w-14 h-14 rounded-xl object-cover border border-gray-100" />
                    ) : (
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-bold text-lg border border-blue-200">
                            {initials}
                        </div>
                    )}
                    {verified && (
                        <span className="absolute -bottom-1 -right-1 size-5 bg-blue-600 rounded-full flex items-center justify-center border-2 border-white">
                            <BadgeCheck size={10} className="text-white" />
                        </span>
                    )}
                </div>
                <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-bold text-gray-900 text-sm">{name}</span>
                        {rating > 0 && (
                            <span className="flex items-center gap-0.5 text-xs font-semibold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-full">
                                <Star size={10} className="fill-amber-500 text-amber-500" /> {rating.toFixed(1)}
                            </span>
                        )}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-2 leading-relaxed">{title}</p>
                </div>
            </div>

            {/* Courses */}
            <div className="px-5 pb-3 flex flex-wrap gap-1.5">
                {subjects.slice(0, 3).map(s => (
                    <span key={s} className="text-xs bg-violet-50 text-violet-700 px-2.5 py-0.5 rounded-full font-medium">{s}</span>
                ))}
                {subjects.length > 3 && (
                    <span className="text-xs bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full">+{subjects.length - 3} more</span>
                )}
            </div>

            {/* Meta */}
            <div className="px-5 pb-4 flex flex-wrap items-center gap-3 text-xs text-gray-500 mt-auto">
                {city && <span className="flex items-center gap-1"><MapPin size={11} className="text-gray-400" />{city}</span>}
                {experience > 0 && <span className="flex items-center gap-1"><Clock size={11} className="text-gray-400" />Est. {new Date().getFullYear() - experience}</span>}
                {offersTrialClass && (
                    <span className="flex items-center gap-1 text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
                        ✓ Free demo class
                    </span>
                )}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-100 px-5 py-3 flex items-center justify-between bg-gray-50/50">
                <div className="text-xs text-gray-400">{reviewCount > 0 ? `${reviewCount} reviews` : "New listing"}</div>
                <span className="text-xs font-semibold text-blue-600 group-hover:underline flex items-center gap-0.5">
                    Explore <ArrowRight size={11} />
                </span>
            </div>
        </Link>
    );
}

import { ALL_SUBJECTS, BROAD_CATEGORIES, SUBJECT_CATEGORIES, getSubjectsForCategory, GRADE_OPTIONS, CITY_OPTIONS } from "../lib/subjects";

const SCHOOL_SUB_CATEGORIES = SUBJECT_CATEGORIES.filter(sc =>
    ["school_k5", "school_6_10", "school_11_12_sci", "school_11_12_comm", "school_11_12_hum", "college_uni"].includes(sc.id)
);

export default function Home() {
    const [searchCategory, setSearchCategory] = useState("");
    const [searchSchoolLevel, setSearchSchoolLevel] = useState("");
    const [searchSubject, setSearchSubject] = useState("");
    const [searchGrade, setSearchGrade] = useState("");
    const [searchLocation, setSearchLocation] = useState("");
    const [activeTab, setActiveTab] = useState("TUTOR");
    const [openFaq, setOpenFaq] = useState(null);
    const [featuredTutors, setFeaturedTutors] = useState([]);
    const [featuredInstitutes, setFeaturedInstitutes] = useState([]);

    useEffect(() => {
        fetch("/api/tutors/featured")
            .then(r => r.json())
            .then(data => { if (Array.isArray(data)) setFeaturedTutors(data); })
            .catch(() => {});
        fetch("/api/institutes/featured")
            .then(r => r.json())
            .then(data => { if (Array.isArray(data)) setFeaturedInstitutes(data); })
            .catch(() => {});
    }, []);

    const isAcademics = searchCategory === "academics";

    const heroContent = {
        TUTOR: {
            badge: "India's #1 Tutor Marketplace",
            headline: <>Find the Right Tutor<br /><span className="text-yellow-300">Near You</span></>,
            subtitle: "Free to search. No commission. Connect directly with verified tutors for home tuition, online classes, or coaching centres across India.",
            btnLabel: "Search Tutors",
        },
        STUDENT: {
            badge: "Post a requirement — tutors come to you",
            headline: <>Find Students<br /><span className="text-yellow-300">for Your Subjects</span></>,
            subtitle: "Create your tutor profile and get matched with students who need exactly what you teach. Free to list, zero commission.",
            btnLabel: "Search Students",
        },
        INSTITUTE: {
            badge: "500+ Cities Across India",
            headline: <>Find Coaching Centres<br /><span className="text-yellow-300">Near You</span></>,
            subtitle: "Browse verified coaching centres and institutes for any subject, exam, or skill — across 500+ cities in India.",
            btnLabel: "Search Institutes",
        },
    };
    const hero = heroContent[activeTab] || heroContent.TUTOR;

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
        <div className="bg-white text-gray-800">

            {/* ── HERO ── */}
            <section className="relative bg-gradient-to-br from-blue-950 via-blue-800 to-blue-700 text-white pt-20 pb-10 overflow-hidden">
                {/* Dot pattern overlay */}
                <div className="absolute inset-0 hero-dots" />
                {/* Soft glow */}
                <div className="absolute -top-32 -right-32 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl" />

                <div className="relative max-w-4xl mx-auto px-4 text-center">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white text-xs font-semibold px-4 py-1.5 rounded-full mb-6 backdrop-blur-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-yellow-300 animate-pulse" />
                        {hero.badge}
                    </div>

                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight tracking-tight">
                        {hero.headline}
                    </h1>
                    <p className="text-blue-100 text-sm md:text-base mb-8 max-w-lg mx-auto leading-relaxed">
                        {hero.subtitle}
                    </p>

                    {/* Search Box */}
                    <div className="bg-white rounded-2xl shadow-2xl overflow-visible">
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
                                    className={`flex-1 py-3 text-xs md:text-sm font-semibold transition-colors border-b-2 -mb-px whitespace-nowrap ${
                                        activeTab === tab.id
                                            ? "border-blue-600 text-blue-600"
                                            : "border-transparent text-gray-400 hover:text-gray-600"
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        <div className="p-3 space-y-2">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                <select
                                    value={searchCategory}
                                    onChange={(e) => { setSearchCategory(e.target.value); setSearchSubject(""); setSearchSchoolLevel(""); setSearchGrade(""); }}
                                    className="h-11 px-3 border border-gray-200 rounded-lg bg-gray-50 text-sm text-gray-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-100 cursor-pointer"
                                >
                                    <option value="">All Categories</option>
                                    {BROAD_CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                                </select>

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

                                <select
                                    value={searchSubject}
                                    onChange={(e) => setSearchSubject(e.target.value)}
                                    disabled={isAcademics && !searchSchoolLevel}
                                    className="h-11 px-3 border border-gray-200 rounded-lg bg-gray-50 text-sm text-gray-700 outline-none focus:border-blue-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <option value="">{isAcademics && !searchSchoolLevel ? "Pick level first" : "Subject"}</option>
                                    {availableSubjects.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>

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
                                className="w-full h-11 bg-blue-600 text-white rounded-lg font-semibold text-sm hover:bg-blue-700 active:scale-[0.99] transition-all flex items-center justify-center gap-2">
                                <Search size={15} /> {hero.btnLabel}
                            </button>
                        </div>
                    </div>

                    {/* Trust bar */}
                    <div className="mt-6 flex flex-wrap justify-center gap-5 text-blue-100 text-xs">
                        <span className="flex items-center gap-1.5"><ShieldCheck size={13} className="text-yellow-300" /> Verified Tutors</span>
                        <span className="w-px h-4 bg-white/20 self-center" />
                        <span className="flex items-center gap-1.5"><Star size={13} className="text-yellow-300 fill-yellow-300" /> Top Rated</span>
                        <span className="w-px h-4 bg-white/20 self-center" />
                        <span className="flex items-center gap-1.5"><MessageSquare size={13} className="text-yellow-300" /> Direct Contact</span>
                        <span className="w-px h-4 bg-white/20 self-center" />
                        <span className="flex items-center gap-1.5"><IndianRupee size={13} className="text-yellow-300" /> Zero Commission</span>
                    </div>
                </div>
            </section>

            {/* ── STATS STRIP ── */}
            <section className="bg-white border-b border-gray-100">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100">
                        {[
                            { value: "50,000+", label: "Tutors Listed", icon: Users },
                            { value: "1 Lakh+", label: "Students Connected", icon: GraduationCap },
                            { value: "500+", label: "Cities Covered", icon: MapPin },
                            { value: "4.7 ★", label: "Average Rating", icon: Star },
                        ].map((s, i) => (
                            <div key={i} className="py-7 px-4 text-center">
                                <div className="text-2xl md:text-3xl font-bold text-blue-600 tracking-tight">{s.value}</div>
                                <div className="text-xs text-gray-500 mt-1 font-medium">{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── HOW IT WORKS ── */}
            <section className="py-16 px-4 bg-blue-50">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <span className="text-xs font-semibold text-blue-600 tracking-widest mb-2 block">SIMPLE PROCESS</span>
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">How It Works</h2>
                        <p className="text-gray-500 mt-2 text-sm">Get started in just 3 simple steps</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        {[
                            { step: "1", title: "Search", desc: "Enter your subject, class level, and city to find matching tutors near you.", icon: Search },
                            { step: "2", title: "Compare", desc: "View profiles, ratings, and fees. Shortlist tutors that match your requirements.", icon: ShieldCheck },
                            { step: "3", title: "Connect", desc: "Contact the tutor directly — no middlemen, no commission charges.", icon: MessageSquare }
                        ].map((item, i) => (
                            <div key={i} className="relative bg-white rounded-2xl p-6 border border-blue-100 shadow-sm overflow-hidden">
                                {/* Large decorative step number */}
                                <span className="absolute -right-2 -top-2 text-8xl font-black text-blue-50 select-none leading-none">{item.step}</span>
                                <div className="relative">
                                    <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center mb-4">
                                        <item.icon size={18} strokeWidth={2} />
                                    </div>
                                    <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                                    <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── BROWSE BY CATEGORY ── */}
            <section className="py-16 px-4 bg-white">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <span className="text-xs font-semibold text-blue-600 tracking-widest mb-2 block">EXPLORE</span>
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Browse by Category</h2>
                        <p className="text-gray-500 mt-2 text-sm">Find tutors across all subjects and skill areas</p>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                        {BROAD_CATEGORIES.map((cat) => (
                            <Link key={cat.id} href={`/browse?category=${cat.id}`}
                                className="flex flex-col items-center gap-3 p-5 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50 cursor-pointer transition-all group text-center">
                                <div className="size-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                    <cat.icon size={22} strokeWidth={1.5} />
                                </div>
                                <span className="text-xs font-semibold text-gray-700 group-hover:text-blue-700 leading-tight">{cat.label}</span>
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

            {/* ── FEATURED TUTORS ── */}
            {featuredTutors.length > 0 && (
                <section className="py-16 px-4 bg-blue-50">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex items-end justify-between mb-10">
                            <div>
                                <span className="text-xs font-semibold text-blue-600 tracking-widest mb-2 block">FEATURED</span>
                                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Meet Our Tutors</h2>
                                <p className="text-gray-500 mt-1.5 text-sm">Real profiles, real expertise — browse and connect directly</p>
                            </div>
                            <Link href="/search?role=TUTOR" className="hidden md:flex items-center gap-1.5 text-blue-600 font-semibold text-sm hover:underline shrink-0 ml-4">
                                View all <ArrowRight size={14} />
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {featuredTutors.slice(0, 6).map(listing => (
                                <TutorCard key={listing.id} listing={listing} />
                            ))}
                        </div>
                        <div className="mt-8 text-center md:hidden">
                            <Link href="/search?role=TUTOR"
                                className="inline-flex items-center gap-2 px-6 py-2.5 border border-blue-600 text-blue-600 rounded-lg font-semibold text-sm hover:bg-blue-50 transition-colors">
                                View all tutors <ArrowRight size={14} />
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            {/* ── FEATURED INSTITUTES ── */}
            {featuredInstitutes.length > 0 && (
                <section className="py-16 px-4 bg-white">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex items-end justify-between mb-10">
                            <div>
                                <span className="text-xs font-semibold text-violet-600 mb-2 block">INSTITUTES</span>
                                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Featured Coaching Centres</h2>
                                <p className="text-gray-500 mt-1.5 text-sm">Verified institutes across India — find the right coaching centre for you</p>
                            </div>
                            <Link href="/search?role=INSTITUTE" className="hidden md:flex items-center gap-1.5 text-blue-600 font-semibold text-sm hover:underline shrink-0 ml-4">
                                View all <ArrowRight size={14} />
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {featuredInstitutes.slice(0, 6).map(listing => (
                                <InstituteCard key={listing.id} listing={listing} />
                            ))}
                        </div>
                        <div className="mt-8 text-center md:hidden">
                            <Link href="/search?role=INSTITUTE"
                                className="inline-flex items-center gap-2 px-6 py-2.5 border border-blue-600 text-blue-600 rounded-lg font-semibold text-sm hover:bg-blue-50 transition-colors">
                                View all institutes <ArrowRight size={14} />
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            {/* ── WHY CHOOSE US ── */}
            <section className="py-16 px-4 bg-white">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <span className="text-xs font-semibold text-blue-600 tracking-widest mb-2 block">TRUSTED PLATFORM</span>
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Why Students & Tutors Trust Us</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { icon: ShieldCheck, title: "Verified Tutors", desc: "Every tutor is profile-verified. Premium tutors are ID and qualification checked.", color: "text-blue-600 bg-blue-50" },
                            { icon: Users, title: "Wide Reach", desc: "500+ cities across India. Find tutors for home, online, or coaching centre.", color: "text-violet-600 bg-violet-50" },
                            { icon: BookOpen, title: "All Subjects", desc: "From school academics to competitive exams — NEET, JEE, UPSC, and more.", color: "text-emerald-600 bg-emerald-50" },
                            { icon: Zap, title: "Quick Match", desc: "Get matched with the right tutor in minutes, not days.", color: "text-amber-600 bg-amber-50" }
                        ].map((f, i) => (
                            <div key={i} className="rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                <div className={`size-11 rounded-xl flex items-center justify-center mb-4 ${f.color}`}>
                                    <f.icon size={22} strokeWidth={1.5} />
                                </div>
                                <h3 className="font-bold text-gray-900 mb-2 text-sm">{f.title}</h3>
                                <p className="text-gray-500 text-xs leading-relaxed">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── FAQ ── */}
            <section className="py-16 px-4 bg-blue-50">
                <div className="max-w-2xl mx-auto">
                    <div className="text-center mb-10">
                        <span className="text-xs font-semibold text-blue-600 tracking-widest mb-2 block">HELP</span>
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Frequently Asked Questions</h2>
                    </div>
                    <div className="space-y-2">
                        {faqs.map((item, i) => (
                            <div key={i} className={`bg-white rounded-xl overflow-hidden border transition-colors ${openFaq === i ? 'border-blue-200' : 'border-gray-100'}`}>
                                <button
                                    className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
                                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                >
                                    <span className="font-semibold text-gray-800 text-sm">{item.q}</span>
                                    <ChevronDown size={16} className={`text-gray-400 transition-transform shrink-0 ml-3 ${openFaq === i ? "rotate-180 text-blue-500" : ""}`} />
                                </button>
                                {openFaq === i && (
                                    <div className="px-5 pb-5 text-sm text-gray-500 leading-relaxed border-t border-blue-50 pt-3 border-l-4 border-l-blue-500 ml-0">
                                        {item.a}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── VIP SERVICE HIGHLIGHT ── */}
            <section className="py-16 px-4 bg-gradient-to-br from-blue-950 to-blue-800 text-white overflow-hidden relative">
                <div className="absolute inset-0 hero-dots opacity-50" />
                <div className="absolute -top-24 -right-24 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl" />
                <div className="relative max-w-4xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                        <div>
                            <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white text-xs font-semibold px-4 py-1.5 rounded-full mb-5">
                                <Award size={12} className="text-yellow-300" /> New — VIP Managed Service
                            </span>
                            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 leading-snug">
                                Don't have time to search?<br />We'll find the tutor for you.
                            </h2>
                            <p className="text-blue-200 text-sm leading-relaxed mb-6">
                                Tell us what you need. Our team handpicks the best verified tutors, arranges a monitored intro call, and manages everything — with 3 free replacements guaranteed.
                            </p>
                            <div className="flex flex-col sm:flex-row items-start gap-3">
                                <Link href="/vip"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-800 font-bold rounded-xl hover:bg-blue-50 transition-colors text-sm">
                                    Learn About VIP <ArrowRight size={15} />
                                </Link>
                                <Link href="/vip/apply"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 text-white border border-white/25 font-semibold rounded-xl hover:bg-white/20 transition-colors text-sm">
                                    Enroll — ₹2,000
                                </Link>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { value: "48 hrs", label: "First match sent", icon: Clock },
                                { value: "3×", label: "Free replacements", icon: CheckCircle2 },
                                { value: "4.5+", label: "Tutor rating", icon: Star },
                                { value: "₹2,000", label: "One-time fee", icon: IndianRupee },
                            ].map(stat => (
                                <div key={stat.label} className="bg-white/8 rounded-2xl p-5 border border-white/10 backdrop-blur-sm">
                                    <stat.icon size={18} className="text-yellow-300 mb-2" strokeWidth={1.5} />
                                    <p className="text-2xl font-bold text-white tracking-tight">{stat.value}</p>
                                    <p className="text-blue-300 text-xs mt-0.5">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── CTA BANNER ── */}
            <section className="py-16 px-4 bg-white border-t border-gray-100">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-10">
                        <span className="text-xs font-semibold text-blue-600 tracking-widest mb-2 block">GET STARTED</span>
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Join India's most trusted tuition marketplace</h2>
                        <p className="text-gray-500 text-sm mt-2">Free for everyone. No hidden charges.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                            {
                                icon: GraduationCap,
                                title: "For students",
                                desc: "Find the perfect tutor for any subject, exam, or skill.",
                                link: "/register/student",
                                btnLabel: "Sign up as student",
                                bg: "bg-blue-50 border-blue-100",
                                iconBg: "bg-blue-100 text-blue-600",
                                btn: "bg-blue-600 hover:bg-blue-700 text-white",
                            },
                            {
                                icon: Users,
                                title: "For tutors",
                                desc: "Grow your teaching business. Get student enquiries directly.",
                                link: "/register/tutor",
                                btnLabel: "Sign up as tutor",
                                bg: "bg-amber-50 border-amber-100",
                                iconBg: "bg-amber-100 text-amber-600",
                                btn: "bg-amber-500 hover:bg-amber-600 text-white",
                            },
                            {
                                icon: Building2,
                                title: "For institutes",
                                desc: "List your coaching centre or browse verified institutes near you.",
                                link: "/institutes",
                                btnLabel: "Browse institutes",
                                bg: "bg-emerald-50 border-emerald-100",
                                iconBg: "bg-emerald-100 text-emerald-600",
                                btn: "bg-emerald-600 hover:bg-emerald-700 text-white",
                            }
                        ].map((item, i) => (
                            <div key={i} className={`rounded-2xl p-6 text-center border ${item.bg}`}>
                                <div className={`size-12 rounded-xl flex items-center justify-center mx-auto mb-4 ${item.iconBg}`}>
                                    <item.icon size={24} strokeWidth={1.5} />
                                </div>
                                <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                                <p className="text-gray-500 text-xs leading-relaxed mb-5">{item.desc}</p>
                                <Link href={item.link}
                                    className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm transition-colors ${item.btn}`}>
                                    {item.btnLabel} <ArrowRight size={14} />
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── FOOTER ── */}
            <footer className="bg-gray-950 text-gray-400 py-12">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
                        {/* Brand */}
                        <div className="col-span-2 md:col-span-1">
                            <div className="flex items-center gap-2.5 mb-4">
                                <div className="size-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white shadow-md">
                                    <GraduationCap size={19} strokeWidth={2.2} />
                                </div>
                                <span className="text-sm font-bold text-white tracking-tight">
                                    Tuitions<span className="font-normal text-blue-400">in</span>India
                                </span>
                            </div>
                            <p className="text-xs leading-relaxed text-gray-500">India's trusted platform connecting students with verified tutors. Free to search, zero commission.</p>
                        </div>

                        {/* For Students */}
                        <div>
                            <h4 className="text-xs font-semibold text-white mb-4">For Students</h4>
                            <div className="space-y-2.5">
                                {[
                                    { label: "Find Tutors", href: "/search?role=TUTOR" },
                                    { label: "How it Works", href: "/how-it-works/student" },
                                    { label: "Pricing", href: "/pricing/student" },
                                    { label: "Post Requirement", href: "/post-requirement" },
                                    { label: "Sign Up", href: "/register/student" },
                                ].map((link, i) => (
                                    <Link key={i} href={link.href} className="block text-xs text-gray-500 hover:text-blue-400 transition-colors">{link.label}</Link>
                                ))}
                            </div>
                        </div>

                        {/* For Tutors */}
                        <div>
                            <h4 className="text-xs font-semibold text-white mb-4">For Tutors</h4>
                            <div className="space-y-2.5">
                                {[
                                    { label: "How it Works", href: "/how-it-works/tutor" },
                                    { label: "Pricing", href: "/pricing/tutor" },
                                    { label: "Find Students", href: "/search?role=STUDENT" },
                                    { label: "Sign Up", href: "/register/tutor" },
                                ].map((link, i) => (
                                    <Link key={i} href={link.href} className="block text-xs text-gray-500 hover:text-blue-400 transition-colors">{link.label}</Link>
                                ))}
                            </div>
                        </div>

                        {/* For Institutes */}
                        <div>
                            <h4 className="text-xs font-semibold text-white mb-4">For Institutes</h4>
                            <div className="space-y-2.5">
                                {[
                                    { label: "Browse Institutes", href: "/institutes" },
                                    { label: "How it Works", href: "/how-it-works/institute" },
                                    { label: "Pricing", href: "/pricing/institute" },
                                    { label: "Sign Up", href: "/register/institute" },
                                ].map((link, i) => (
                                    <Link key={i} href={link.href} className="block text-xs text-gray-500 hover:text-blue-400 transition-colors">{link.label}</Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Bottom bar */}
                    <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-3">
                        <p className="text-xs text-gray-600">© 2026 TuitionsInIndia.com. All rights reserved.</p>
                        <nav className="flex flex-wrap gap-x-4 gap-y-1">
                            {[
                                { label: "Contact", href: "/contact" },
                                { label: "Privacy Policy", href: "/legal/privacy" },
                                { label: "Terms", href: "/legal/terms" },
                            ].map((link, i) => (
                                <Link key={i} href={link.href} className="text-xs text-gray-600 hover:text-blue-400 transition-colors">{link.label}</Link>
                            ))}
                        </nav>
                    </div>
                </div>
            </footer>
        </div>
    );
}
