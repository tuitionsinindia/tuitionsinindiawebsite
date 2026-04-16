"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import MapComponent from "@/app/components/MapComponent";
import MatchBadge from "@/app/components/MatchBadge";
import {
    Search, MapPin, BookOpen, Filter, ShieldCheck, Star,
    ArrowRight, Lock, ChevronDown, LayoutGrid, Map as MapIcon
} from "lucide-react";

export default function DirectoryLayout({ tutors, subject, location, filters, title }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const [viewMode, setViewMode] = useState("list");
    const [openFaq, setOpenFaq] = useState(null);

    const updateFilter = (key, value) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) params.set(key, value); else params.delete(key);
        router.push(`${pathname}?${params.toString()}`);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        const sub = e.target.subject.value;
        const loc = e.target.location.value;
        const params = new URLSearchParams(searchParams.toString());
        if (sub) params.set("subject", sub); else params.delete("subject");
        if (loc) params.set("location", loc); else params.delete("location");
        router.push(`${pathname}?${params.toString()}`);
    };

    // Computed stats for enrichment
    const tutorCount = tutors.length;
    const rates = tutors.map(t => parseInt(String(t.hourlyRate).replace(/[^\d]/g, "")) || 0).filter(r => r > 0);
    const avgRate = rates.length > 0 ? Math.round(rates.reduce((a, b) => a + b, 0) / rates.length) : null;
    const topTutors = tutors.filter(t => t.rating >= 4).slice(0, 3);

    const capitalSubject = subject ? subject.charAt(0).toUpperCase() + subject.slice(1) : "";
    const capitalLocation = location ? location.charAt(0).toUpperCase() + location.slice(1) : "";
    const pageTitle = title || (location
        ? `${capitalSubject} Tutors in ${capitalLocation}`
        : `${capitalSubject} Tutors in India`);

    // Dynamic FAQ based on subject + location
    const faqs = [
        {
            q: `How do I find a good ${capitalSubject.toLowerCase()} tutor${location ? ` in ${capitalLocation}` : ""}?`,
            a: `Browse our list of ${tutorCount} verified ${capitalSubject.toLowerCase()} tutors${location ? ` in ${capitalLocation}` : ""}, compare ratings and fees, and contact them directly. There's no commission — you pay only the tutor.`
        },
        {
            q: `What is the average fee for ${capitalSubject.toLowerCase()} tuition${location ? ` in ${capitalLocation}` : ""}?`,
            a: avgRate ? `The average hourly rate for ${capitalSubject.toLowerCase()} tutors${location ? ` in ${capitalLocation}` : ""} on TuitionsInIndia is approximately ₹${avgRate}/hour. Rates vary based on experience and teaching mode.` : `Rates vary based on the tutor's experience, qualifications, and teaching mode. Browse profiles to compare fees.`
        },
        {
            q: "Is it free to contact a tutor?",
            a: "Yes, searching and browsing tutors is completely free. Students can connect with tutors without any commission or platform fees."
        },
        {
            q: "Are the tutors on TuitionsInIndia verified?",
            a: "All tutors go through a profile review. Premium tutors are ID-verified with qualification checks and display a verified badge on their profile."
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero */}
            <section className="bg-gradient-to-br from-blue-700 via-blue-600 to-blue-800 text-white pt-28 pb-10">
                <div className="max-w-5xl mx-auto px-4 text-center">
                    <h1 className="text-2xl md:text-4xl font-bold mb-3">{pageTitle}</h1>
                    <p className="text-blue-100 text-sm md:text-base mb-6 max-w-xl mx-auto">
                        {tutorCount > 0
                            ? `${tutorCount} verified tutors available. Free to search, no commission.`
                            : `Find verified ${capitalSubject.toLowerCase()} tutors${location ? ` in ${capitalLocation}` : ""} — free to search, no commission.`}
                    </p>

                    {/* Quick stats */}
                    {tutorCount > 0 && (
                        <div className="flex justify-center gap-6 text-sm mb-6">
                            <div className="bg-white/20 rounded-xl px-4 py-2">
                                <span className="font-bold">{tutorCount}</span> <span className="text-blue-200">tutors</span>
                            </div>
                            {avgRate && (
                                <div className="bg-white/20 rounded-xl px-4 py-2">
                                    <span className="font-bold">₹{avgRate}</span> <span className="text-blue-200">avg/hour</span>
                                </div>
                            )}
                            {topTutors.length > 0 && (
                                <div className="bg-white/20 rounded-xl px-4 py-2">
                                    <span className="font-bold">{topTutors.length}+</span> <span className="text-blue-200">top-rated</span>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Search */}
                    <form onSubmit={handleSearch} className="bg-white rounded-2xl shadow-xl p-3 max-w-2xl mx-auto">
                        <div className="flex flex-col sm:flex-row gap-2">
                            <div className="relative flex-1">
                                <BookOpen size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input type="text" name="subject" placeholder="Subject" defaultValue={subject}
                                    className="w-full h-11 pl-9 pr-3 border border-gray-200 rounded-lg bg-gray-50 text-sm text-gray-700 outline-none focus:border-blue-500" />
                            </div>
                            <div className="relative flex-1">
                                <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input type="text" name="location" placeholder="City" defaultValue={location}
                                    className="w-full h-11 pl-9 pr-3 border border-gray-200 rounded-lg bg-gray-50 text-sm text-gray-700 outline-none focus:border-blue-500" />
                            </div>
                            <button type="submit" className="h-11 px-6 bg-blue-600 text-white rounded-lg font-semibold text-sm hover:bg-blue-700 transition-colors flex items-center gap-2">
                                <Search size={15} /> Search
                            </button>
                        </div>
                    </form>
                </div>
            </section>

            <div className="max-w-5xl mx-auto px-4 py-10">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Filters sidebar */}
                    <aside className="w-full lg:w-64 shrink-0">
                        <div className="bg-white rounded-xl border border-gray-200 p-5 sticky top-24">
                            <div className="flex items-center gap-2 mb-4">
                                <Filter size={16} className="text-blue-600" />
                                <h3 className="text-sm font-semibold text-gray-900">Filters</h3>
                            </div>

                            {/* Verified filter */}
                            <div className="mb-5">
                                <p className="text-xs font-semibold text-gray-500 mb-2">Verification</p>
                                <button
                                    onClick={() => updateFilter("verified", filters?.verified === "true" ? null : "true")}
                                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                                        filters?.verified === "true" ? "bg-blue-50 text-blue-600 font-semibold border border-blue-200" : "bg-gray-50 text-gray-600 border border-gray-100 hover:border-blue-300"
                                    }`}
                                >
                                    <ShieldCheck size={14} /> Verified Tutors Only
                                </button>
                            </div>

                            {/* Level filter */}
                            <div className="mb-5">
                                <p className="text-xs font-semibold text-gray-500 mb-2">Level</p>
                                <div className="flex flex-wrap gap-1.5">
                                    {["Primary", "Middle", "High School", "Higher Secondary", "College"].map(level => (
                                        <button key={level}
                                            onClick={() => updateFilter("levels", filters?.levels === level ? null : level)}
                                            className={`px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                                                filters?.levels === level ? "bg-blue-600 text-white" : "bg-gray-50 text-gray-600 border border-gray-100 hover:border-blue-300"
                                            }`}
                                        >{level}</button>
                                    ))}
                                </div>
                            </div>

                            {/* Rating filter */}
                            <div>
                                <p className="text-xs font-semibold text-gray-500 mb-2">Minimum Rating</p>
                                <div className="flex gap-2">
                                    {[4, 4.5, 4.8].map(r => (
                                        <button key={r}
                                            onClick={() => updateFilter("rating", filters?.rating == r ? null : r)}
                                            className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-colors ${
                                                filters?.rating == r ? "bg-amber-50 text-amber-600 border border-amber-200" : "bg-gray-50 text-gray-500 border border-gray-100 hover:border-amber-200"
                                            }`}
                                        >{r}+ ★</button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* AI Match CTA */}
                        <div className="bg-gray-900 rounded-xl p-5 mt-4 text-white">
                            <h4 className="font-bold text-sm mb-2">Can't decide?</h4>
                            <p className="text-gray-400 text-xs mb-4">Let our smart matching find the best tutor for your needs.</p>
                            <Link href="/ai-match" className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors">
                                Find My Match <ArrowRight size={14} />
                            </Link>
                        </div>
                    </aside>

                    {/* Main content */}
                    <main className="flex-1">
                        {/* View toggle + count */}
                        <div className="flex items-center justify-between mb-6">
                            <p className="text-sm text-gray-500">
                                <span className="font-semibold text-gray-900">{tutorCount}</span> {tutorCount === 1 ? "tutor" : "tutors"} found
                            </p>
                            <div className="flex bg-white rounded-lg border border-gray-200 p-1">
                                <button onClick={() => setViewMode("list")}
                                    className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors ${viewMode === "list" ? "bg-blue-600 text-white" : "text-gray-500 hover:text-gray-700"}`}>
                                    <LayoutGrid size={13} /> List
                                </button>
                                <button onClick={() => setViewMode("map")}
                                    className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors ${viewMode === "map" ? "bg-blue-600 text-white" : "text-gray-500 hover:text-gray-700"}`}>
                                    <MapIcon size={13} /> Map
                                </button>
                            </div>
                        </div>

                        {viewMode === "map" ? (
                            <div className="rounded-xl overflow-hidden border border-gray-200">
                                <MapComponent tutors={tutors} />
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {tutors.length > 0 ? tutors.map(tutor => (
                                    <div key={tutor.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:border-blue-300 hover:shadow-sm transition-all">
                                        <div className="flex flex-col sm:flex-row gap-5">
                                            {/* Avatar */}
                                            <div className="flex flex-col items-center gap-2 shrink-0">
                                                <div className="w-16 h-16 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-2xl">
                                                    {tutor.name.charAt(0)}
                                                </div>
                                                {tutor.isVerified && (
                                                    <span className="flex items-center gap-1 text-emerald-600 text-xs font-semibold">
                                                        <ShieldCheck size={12} /> Verified
                                                    </span>
                                                )}
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1">
                                                <div className="flex items-start justify-between mb-2">
                                                    <div>
                                                        <h3 className="font-bold text-gray-900 text-lg">{tutor.name}</h3>
                                                        <p className="flex items-center gap-1 text-sm text-gray-500">
                                                            <MapPin size={13} /> {tutor.location}
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-bold text-blue-600 text-lg">{tutor.hourlyRate}</p>
                                                        <p className="text-xs text-gray-400">per hour</p>
                                                    </div>
                                                </div>

                                                {/* Subjects */}
                                                <div className="flex flex-wrap gap-1.5 mb-3">
                                                    {tutor.subjects.map(sub => (
                                                        <span key={sub} className="px-2.5 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-md">{sub}</span>
                                                    ))}
                                                </div>

                                                {/* Rating + Match */}
                                                <div className="flex items-center gap-4 mb-3">
                                                    <div className="flex items-center gap-1">
                                                        <Star size={14} fill="currentColor" className="text-amber-400" />
                                                        <span className="text-sm font-semibold text-gray-900">{tutor.rating}</span>
                                                        <span className="text-xs text-gray-400">({tutor.reviews} reviews)</span>
                                                    </div>
                                                    <MatchBadge score={tutor.matchScore} label={tutor.matchLabel} factors={tutor.matchFactors} showDetails={false} />
                                                </div>

                                                {/* Bio preview */}
                                                {tutor.bio && (
                                                    <p className="text-sm text-gray-500 line-clamp-2 mb-4">{tutor.bio}</p>
                                                )}

                                                {/* Actions */}
                                                <div className="flex gap-3">
                                                    <Link href={`/search/${tutor.id}`}
                                                        className="px-4 py-2.5 bg-gray-50 text-gray-700 border border-gray-200 rounded-lg text-sm font-semibold hover:border-blue-500 hover:text-blue-600 transition-colors">
                                                        View Profile
                                                    </Link>
                                                    <Link href={`/get-started?intent=unlock&tutorId=${tutor.id}&subject=${subject || ""}&location=${location || ""}`}
                                                        className="px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2">
                                                        Contact Tutor
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                                        <Search size={48} className="text-gray-300 mx-auto mb-4" />
                                        <h3 className="text-lg font-bold text-gray-900 mb-2">No Tutors Found</h3>
                                        <p className="text-sm text-gray-500 mb-4 max-w-sm mx-auto">
                                            We couldn't find any {capitalSubject.toLowerCase()} tutors{location ? ` in ${capitalLocation}` : ""} right now. Try a different search.
                                        </p>
                                        <button onClick={() => router.push(pathname)}
                                            className="px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors">
                                            Clear Filters
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </main>
                </div>

                {/* Top Rated Tutor Snippets */}
                {topTutors.length > 0 && (
                    <section className="mt-12">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">
                            Top Rated {capitalSubject} Tutors{location ? ` in ${capitalLocation}` : ""}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {topTutors.map(t => (
                                <Link key={t.id} href={`/search/${t.id}`} className="bg-white rounded-xl border border-gray-200 p-4 hover:border-blue-300 transition-all">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">{t.name.charAt(0)}</div>
                                        <div>
                                            <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                                            <p className="flex items-center gap-1 text-xs text-gray-400"><Star size={11} fill="currentColor" className="text-amber-400" /> {t.rating} ({t.reviews} reviews)</p>
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-500 line-clamp-2">{t.bio}</p>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                {/* FAQ Section (dynamic per city × subject) */}
                <section className="mt-12 mb-8">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">
                        Frequently Asked Questions
                    </h2>
                    <div className="space-y-3">
                        {faqs.map((faq, i) => (
                            <div key={i} className="border border-gray-200 rounded-xl overflow-hidden bg-white">
                                <button
                                    className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                >
                                    <span className="font-semibold text-gray-800 text-sm">{faq.q}</span>
                                    <ChevronDown size={16} className={`text-gray-400 transition-transform shrink-0 ml-3 ${openFaq === i ? "rotate-180" : ""}`} />
                                </button>
                                {openFaq === i && (
                                    <div className="px-4 pb-4 text-sm text-gray-500 leading-relaxed border-t border-gray-100 pt-3">
                                        {faq.a}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            {/* JSON-LD structured data */}
            <script type="application/ld+json" dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "ItemList",
                    "itemListElement": tutors.slice(0, 10).map((t, i) => ({
                        "@type": "ListItem",
                        "position": i + 1,
                        "item": {
                            "@type": "LocalBusiness",
                            "name": t.name,
                            "description": t.bio,
                            "address": { "@type": "PostalAddress", "addressLocality": t.location }
                        }
                    }))
                })
            }} />
        </div>
    );
}
