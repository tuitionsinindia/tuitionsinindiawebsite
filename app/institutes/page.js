"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
    Search, MapPin, BookOpen, Star, BadgeCheck,
    Building2, ArrowRight, Globe, Calendar, Filter
} from "lucide-react";
import { CITY_OPTIONS } from "../../lib/subjects";

const AVATAR_COLOURS = [
    "from-blue-500 to-blue-700",
    "from-violet-500 to-purple-700",
    "from-emerald-500 to-teal-700",
    "from-rose-500 to-pink-700",
    "from-amber-500 to-orange-600",
];

function InstituteAvatar({ name, image }) {
    const initials = (name || "?").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
    const idx = (name || "").charCodeAt(0) % AVATAR_COLOURS.length;
    if (image) return <img src={image} alt={name} className="w-12 h-12 rounded-xl object-cover" />;
    return (
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${AVATAR_COLOURS[idx]} text-white text-base font-bold flex items-center justify-center shrink-0`}>
            {initials}
        </div>
    );
}

function parseWebsite(bio) {
    const match = bio?.match(/Website:\s*(https?:\/\/[^\s\n]+)/);
    return match ? match[1] : null;
}

function parseFoundingYear(bio) {
    const match = bio?.match(/Established:\s*(\d{4})/);
    return match ? match[1] : null;
}

function cleanBio(bio) {
    return (bio || "")
        .replace(/\n+Website:\s*https?:\/\/[^\s\n]+/, "")
        .replace(/\n+Established:\s*\d{4}/, "")
        .trim();
}

function InstituteCard({ listing }) {
    const { id, title, bio, subjects = [], locations = [], rating, reviewCount, tutor } = listing;
    const website = parseWebsite(bio);
    const foundingYear = parseFoundingYear(bio);
    const cleanedBio = cleanBio(bio);

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all overflow-hidden">
            <div className="p-5">
                <div className="flex gap-4 items-start mb-4">
                    <InstituteAvatar name={title} image={tutor?.image} />
                    <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-2 mb-1">
                            <Link href={`/institute/${id}`} className="font-semibold text-gray-900 hover:text-blue-600 transition-colors leading-snug line-clamp-2">
                                {title}
                            </Link>
                            {tutor?.isVerified && (
                                <BadgeCheck size={15} className="text-blue-600 shrink-0 mt-0.5" />
                            )}
                        </div>
                        <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                            {locations.length > 0 && (
                                <span className="flex items-center gap-1">
                                    <MapPin size={11} /> {locations.slice(0, 2).join(", ")}
                                    {locations.length > 2 && ` +${locations.length - 2}`}
                                </span>
                            )}
                            {foundingYear && (
                                <span className="flex items-center gap-1">
                                    <Calendar size={11} /> Est. {foundingYear}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {cleanedBio && (
                    <p className="text-sm text-gray-500 leading-relaxed line-clamp-3 mb-4">{cleanedBio}</p>
                )}

                {/* Subjects */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                    {subjects.slice(0, 4).map(s => (
                        <span key={s} className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full font-medium">{s}</span>
                    ))}
                    {subjects.length > 4 && (
                        <span className="text-xs bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full">+{subjects.length - 4} more</span>
                    )}
                </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-100 px-5 py-3 flex items-center justify-between bg-gray-50">
                <div>
                    {rating > 0 ? (
                        <span className="flex items-center gap-1 text-xs font-medium text-gray-700">
                            <Star size={12} className="text-yellow-400 fill-yellow-400" />
                            {rating.toFixed(1)}
                            <span className="text-gray-400">({reviewCount})</span>
                        </span>
                    ) : (
                        <span className="text-xs text-gray-400">New listing</span>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    {website && (
                        <a href={website} target="_blank" rel="noopener noreferrer"
                            className="text-xs text-gray-500 hover:text-blue-600 flex items-center gap-1 transition-colors">
                            <Globe size={11} /> Website
                        </a>
                    )}
                    <Link href={`/institute/${id}`}
                        className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1">
                        View Profile <ArrowRight size={11} />
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function InstitutesPage() {
    const [institutes, setInstitutes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchCity, setSearchCity] = useState("");
    const [searchSubject, setSearchSubject] = useState("");

    useEffect(() => {
        const params = new URLSearchParams();
        if (searchCity) params.set("location", searchCity);
        if (searchSubject) params.set("subject", searchSubject);

        setLoading(true);
        fetch(`/api/institutes?${params.toString()}`)
            .then(r => r.json())
            .then(data => { if (Array.isArray(data)) setInstitutes(data); })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [searchCity, searchSubject]);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Page header */}
            <div className="bg-white border-b border-gray-100">
                <div className="max-w-5xl mx-auto px-4 py-8">
                    <div className="flex items-start justify-between mb-6">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">Coaching Centres & Institutes</h1>
                            <p className="text-gray-500 text-sm">Browse verified institutes across India for JEE, NEET, CBSE and more</p>
                        </div>
                        <Link href="/register/institute"
                            className="hidden md:flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors shrink-0 ml-4">
                            <Building2 size={15} /> List Your Institute
                        </Link>
                    </div>

                    {/* Filters */}
                    <div className="flex flex-wrap gap-3">
                        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
                            <MapPin size={14} className="text-gray-400" />
                            <select
                                value={searchCity}
                                onChange={e => setSearchCity(e.target.value)}
                                className="text-sm text-gray-700 bg-transparent outline-none cursor-pointer"
                            >
                                <option value="">All Cities</option>
                                {CITY_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>

                        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
                            <BookOpen size={14} className="text-gray-400" />
                            <input
                                type="text"
                                placeholder="Subject (e.g. Physics)"
                                value={searchSubject}
                                onChange={e => setSearchSubject(e.target.value)}
                                className="text-sm text-gray-700 bg-transparent outline-none w-40"
                            />
                        </div>

                        {(searchCity || searchSubject) && (
                            <button
                                onClick={() => { setSearchCity(""); setSearchSubject(""); }}
                                className="text-sm text-gray-500 hover:text-gray-700 underline"
                            >
                                Clear filters
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 py-8">
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="bg-white rounded-2xl border border-gray-100 h-52 animate-pulse" />
                        ))}
                    </div>
                ) : institutes.length === 0 ? (
                    <div className="text-center py-20">
                        <Building2 size={40} className="mx-auto text-gray-200 mb-4" />
                        <h2 className="text-lg font-semibold text-gray-700 mb-2">No institutes found</h2>
                        <p className="text-gray-400 text-sm mb-6">
                            {searchCity || searchSubject
                                ? "Try removing filters or search a different city."
                                : "Be the first to list your coaching centre!"}
                        </p>
                        <Link href="/register/institute"
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors">
                            List Your Institute <ArrowRight size={14} />
                        </Link>
                    </div>
                ) : (
                    <>
                        <p className="text-sm text-gray-500 mb-5">{institutes.length} institute{institutes.length !== 1 ? "s" : ""} found</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {institutes.map(inst => (
                                <InstituteCard key={inst.id} listing={inst} />
                            ))}
                        </div>
                    </>
                )}

                {/* CTA for institutes */}
                <div className="mt-12 bg-blue-600 rounded-2xl p-8 text-center text-white">
                    <Building2 size={32} className="mx-auto mb-3 text-blue-200" strokeWidth={1.5} />
                    <h3 className="text-xl font-bold mb-2">Own a coaching centre?</h3>
                    <p className="text-blue-100 text-sm mb-5 max-w-md mx-auto">
                        List your institute for free and reach thousands of students searching for coaching in your city.
                    </p>
                    <Link href="/register/institute"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-700 rounded-xl font-bold text-sm hover:bg-blue-50 transition-colors shadow-md">
                        Get Listed — It's Free <ArrowRight size={14} />
                    </Link>
                </div>
            </div>
        </div>
    );
}
