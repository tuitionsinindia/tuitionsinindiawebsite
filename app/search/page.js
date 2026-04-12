"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
    Search,
    Filter,
    Map as MapIcon,
    List,
    Star,
    MapPin,
    ShieldCheck,
    GraduationCap,
    ChevronDown,
    WifiOff,
    ArrowRight,
    Lock,
    BadgeCheck,
    User,
    Briefcase,
    Home,
    Monitor,
    Users,
    Building2,
    RefreshCw
} from "lucide-react";
import { ALL_SUBJECTS } from "../../lib/subjects";
import SkeletonLoader from "../components/SkeletonLoader";
import MapComponent from "../components/MapComponent";

function SearchResultsContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const querySubject = searchParams.get("subject") || "";
    const queryLocation = searchParams.get("location") || "";
    const queryRole = (searchParams.get("role") || "TUTOR").toUpperCase();
    const queryLat = searchParams.get("lat");
    const queryLng = searchParams.get("lng");

    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [viewMode, setViewMode] = useState("list"); // list, map
    const [filtersOpen, setFiltersOpen] = useState(false); // mobile filter drawer

    // Filter & Sort State
    const [grade, setGrade] = useState(searchParams.get("grade") || "");
    const [maxRate, setMaxRate] = useState(10000);
    const [sortBy, setSortBy] = useState("relevance");
    const [verifiedOnly, setVerifiedOnly] = useState(false);
    const [listingType, setListingType] = useState("ALL"); // ALL, PRIVATE, GROUP

    // Advanced Filters
    const [gender, setGender] = useState("");
    const [experience, setExperience] = useState("");
    const [teachingMode, setTeachingMode] = useState("");
    const [board, setBoard] = useState("");

    const grades = [
        "Primary (1-5)", "Middle (6-8)", "High School (9-10)",
        "Higher Secondary (11-12)", "Undergraduate", "Competitive Exams"
    ];

    const boards = ["CBSE", "ICSE", "State Board", "IB", "IGCSE", "Other"];

    useEffect(() => {
        // Persist browsing context
        try {
            if (querySubject) localStorage.setItem("last_browsed_subject", querySubject);
            if (grade) localStorage.setItem("last_browsed_grade", grade);
            if (queryLocation) localStorage.setItem("last_browsed_location", queryLocation);
        } catch (e) {}

        fetchResults();
    }, [querySubject, queryLocation, queryRole, queryLat, queryLng, grade, maxRate, sortBy, verifiedOnly, gender, experience, teachingMode, board, listingType]);

    const fetchResults = async () => {
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams({
                subject: querySubject,
                location: queryLocation,
                role: queryRole,
                grade: grade,
                maxRate: maxRate.toString(),
                sortBy: sortBy,
                verified: verifiedOnly.toString(),
                gender,
                experience,
                teachingMode,
                board,
                listingType
            });
            if (queryLat) params.set("lat", queryLat);
            if (queryLng) params.set("lng", queryLng);

            const res = await fetch(`/api/search/tutors?${params.toString()}`);
            const data = await res.json();

            if (res.ok && Array.isArray(data)) {
                setResults(data);
            } else if (data && data.error) {
                setError(data.error);
                setResults([]);
            } else {
                setResults([]);
                if (!res.ok) setError("Unable to reach the server. Please try again.");
            }
        } catch (err) {
            console.error(err);
            setError("Something went wrong. Please check your connection and try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleContactTutor = (tutor) => {
        const registerRoute = queryRole === "STUDENT" ? "/register/tutor" : "/register/student";
        const params = new URLSearchParams();
        if (querySubject) params.set("subject", querySubject);
        if (grade) params.set("grade", grade);
        if (queryLocation) params.set("location", queryLocation);
        const tutorId = tutor.id || tutor.userId || "";
        if (tutorId) params.set("tutorId", tutorId);
        params.set("intent", "unlock");
        router.push(`${registerRoute}?${params.toString()}`);
    };

    const roleLabel = queryRole === "STUDENT" ? "students" : queryRole === "INSTITUTE" ? "institutes" : "tutors";

    const resetFilters = () => {
        setGrade("");
        setMaxRate(10000);
        setVerifiedOnly(false);
        setGender("");
        setExperience("");
        setTeachingMode("");
        setBoard("");
        setListingType("ALL");
    };

    const teachingModeLabel = (mode) => {
        const map = {
            ONLINE: "Online",
            STUDENT_HOME: "At Student's Home",
            TUTOR_HOME: "At Tutor's Home",
            CENTER: "At Centre"
        };
        return map[mode] || mode;
    };

    return (
        <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50 font-sans pt-[85px]">

            {/* Mobile filter overlay backdrop */}
            {filtersOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-40 lg:hidden"
                    onClick={() => setFiltersOpen(false)}
                />
            )}

            {/* LEFT SIDEBAR FILTERS */}
            <aside className={`
                fixed lg:static inset-y-0 left-0 z-50 lg:z-40
                w-80 lg:w-72 xl:w-80
                bg-white border-r border-gray-200
                flex flex-col
                lg:sticky lg:top-[85px] lg:h-[calc(100vh-85px)]
                overflow-y-auto
                transition-transform duration-300
                ${filtersOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:translate-x-0"}
            `}>
                {/* Sidebar Header */}
                <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Filter size={16} className="text-gray-500" />
                        <h2 className="font-semibold text-gray-700 text-sm">Filters</h2>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={resetFilters} className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                            Reset all
                        </button>
                        <button
                            onClick={() => setFiltersOpen(false)}
                            className="lg:hidden text-gray-400 hover:text-gray-700 p-1"
                            aria-label="Close filters"
                        >
                            ✕
                        </button>
                    </div>
                </div>

                <div className="p-5 space-y-6">

                    {/* Teaching Mode */}
                    <div className="space-y-2">
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">Teaching Mode</label>
                        <div className="space-y-2">
                            {[
                                { id: "ALL", label: "All Modes" },
                                { id: "ONLINE", label: "Online" },
                                { id: "STUDENT_HOME", label: "At Student's Home" },
                                { id: "TUTOR_HOME", label: "At Tutor's Home" },
                                { id: "CENTER", label: "At Centre" }
                            ].map(mode => (
                                <label key={mode.id} className="flex items-center gap-2.5 cursor-pointer group">
                                    <input
                                        type="radio"
                                        name="teachingMode"
                                        value={mode.id === "ALL" ? "" : mode.id}
                                        checked={(mode.id === "ALL" ? teachingMode === "" : teachingMode === mode.id)}
                                        onChange={() => setTeachingMode(mode.id === "ALL" ? "" : mode.id)}
                                        className="accent-blue-600 w-4 h-4 cursor-pointer"
                                    />
                                    <span className="text-sm text-gray-700 group-hover:text-blue-600">{mode.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="border-t border-gray-100" />

                    {/* Session Type */}
                    <div className="space-y-2">
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">Session Type</label>
                        <div className="space-y-2">
                            {[
                                { id: "ALL", label: "All Types" },
                                { id: "PRIVATE", label: "Private (1-on-1)" },
                                { id: "GROUP", label: "Group / Batch" }
                            ].map(type => (
                                <label key={type.id} className="flex items-center gap-2.5 cursor-pointer group">
                                    <input
                                        type="radio"
                                        name="listingType"
                                        value={type.id}
                                        checked={listingType === type.id}
                                        onChange={() => setListingType(type.id)}
                                        className="accent-blue-600 w-4 h-4 cursor-pointer"
                                    />
                                    <span className="text-sm text-gray-700 group-hover:text-blue-600">{type.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="border-t border-gray-100" />

                    {/* Class / Level */}
                    <div className="space-y-2">
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">Class / Level</label>
                        <select
                            value={grade}
                            onChange={(e) => setGrade(e.target.value)}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 bg-white outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                        >
                            <option value="">All Classes</option>
                            {grades.map(g => <option key={g} value={g}>{g}</option>)}
                        </select>
                    </div>

                    <div className="border-t border-gray-100" />

                    {/* Max Fee */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">Max Fee / hr</label>
                            <span className="text-sm font-semibold text-blue-600">₹{maxRate.toLocaleString()}</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="5000"
                            step="100"
                            value={maxRate}
                            onChange={(e) => setMaxRate(parseInt(e.target.value))}
                            className="w-full accent-blue-600 cursor-pointer"
                        />
                        <div className="flex justify-between text-xs text-gray-400">
                            <span>₹0</span>
                            <span>₹5,000+</span>
                        </div>
                    </div>

                    <div className="border-t border-gray-100" />

                    {/* Verified Only */}
                    <label className="flex items-center justify-between cursor-pointer">
                        <div className="flex items-center gap-2">
                            <ShieldCheck size={16} className="text-blue-600" />
                            <span className="text-sm font-medium text-gray-700">Verified Only</span>
                        </div>
                        <div
                            onClick={() => setVerifiedOnly(!verifiedOnly)}
                            className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer ${verifiedOnly ? "bg-blue-600" : "bg-gray-200"}`}
                        >
                            <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${verifiedOnly ? "translate-x-5" : "translate-x-0.5"}`} />
                        </div>
                        <input type="checkbox" checked={verifiedOnly} onChange={(e) => setVerifiedOnly(e.target.checked)} className="hidden" />
                    </label>

                </div>
            </aside>

            {/* MAIN CONTENT AREA */}
            <div className="flex-1 flex flex-col min-w-0">

                {/* Search Results Header */}
                <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-[85px] z-30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                        {loading ? (
                            <p className="text-gray-500 text-sm">Searching...</p>
                        ) : (
                            <h1 className="text-base font-semibold text-gray-800">
                                {results.length > 0
                                    ? <><span className="text-blue-600">{results.length} {roleLabel}</span> found{querySubject ? <> for <span className="text-gray-900">{querySubject}</span></> : ""}{queryLocation ? <> in <span className="text-gray-900">{queryLocation}</span></> : ""}</>
                                    : `No ${roleLabel} found`
                                }
                            </h1>
                        )}
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Mobile filter toggle */}
                        <button
                            onClick={() => setFiltersOpen(true)}
                            className="lg:hidden flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                        >
                            <Filter size={14} /> Filters
                        </button>
                        {/* Sort */}
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                        >
                            <option value="relevance">Sort: Relevance</option>
                            <option value="rating">Highest Rated</option>
                            <option value="fee_low">Fee: Low to High</option>
                            <option value="fee_high">Fee: High to Low</option>
                            <option value="experience">Most Experienced</option>
                        </select>

                        {/* View Toggle */}
                        <div className="flex border border-gray-200 rounded-lg overflow-hidden">
                            <button
                                onClick={() => setViewMode("list")}
                                className={`flex items-center gap-1.5 px-3 py-2 text-sm transition-colors ${viewMode === "list" ? "bg-blue-600 text-white" : "bg-white text-gray-500 hover:bg-gray-50"}`}
                                title="List view"
                            >
                                <List size={15} />
                            </button>
                            <button
                                onClick={() => setViewMode("map")}
                                className={`flex items-center gap-1.5 px-3 py-2 text-sm transition-colors border-l border-gray-200 ${viewMode === "map" ? "bg-blue-600 text-white" : "bg-white text-gray-500 hover:bg-gray-50"}`}
                                title="Map view"
                            >
                                <MapIcon size={15} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Results Body */}
                <div className="flex-1">
                    {viewMode === "map" ? (
                        <div className="h-full p-4">
                            <MapComponent tutors={results} />
                        </div>
                    ) : (
                        <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-4">
                            {loading ? (
                                <div className="space-y-4">
                                    {[1, 2, 3].map(i => <SkeletonLoader key={i} />)}
                                </div>
                            ) : error ? (
                                /* Error State */
                                <div className="bg-white border border-red-100 rounded-xl p-10 text-center mt-4">
                                    <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <WifiOff size={24} className="text-red-400" />
                                    </div>
                                    <h2 className="text-base font-semibold text-gray-800 mb-1">Could not load results</h2>
                                    <p className="text-sm text-red-500 mb-5 max-w-sm mx-auto">{error}</p>
                                    <button
                                        onClick={fetchResults}
                                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
                                    >
                                        <RefreshCw size={14} />
                                        Retry
                                    </button>
                                </div>
                            ) : results.length > 0 ? (
                                /* Result Cards */
                                results.map((item, idx) => (
                                    <div
                                        key={idx}
                                        className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col md:flex-row gap-5"
                                    >
                                        {/* Avatar */}
                                        <div className="flex flex-col items-center shrink-0 gap-2">
                                            <div className="w-20 h-20 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center relative">
                                                {item.role === "INSTITUTE"
                                                    ? <Building2 size={32} className="text-blue-400" />
                                                    : <User size={32} className="text-blue-400" />
                                                }
                                                {item.isVerified && (
                                                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center border-2 border-white">
                                                        <BadgeCheck size={12} className="text-white" strokeWidth={2.5} />
                                                    </div>
                                                )}
                                            </div>
                                            {/* Rating */}
                                            <div className="flex items-center gap-0.5">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        size={12}
                                                        fill={i < Math.floor(item.rating || 4.5) ? "#f59e0b" : "none"}
                                                        className={i < Math.floor(item.rating || 4.5) ? "text-amber-400" : "text-gray-200"}
                                                    />
                                                ))}
                                                <span className="text-xs font-semibold text-gray-600 ml-1">{(item.rating || 4.5).toFixed(1)}</span>
                                            </div>
                                            <p className="text-xs text-gray-400">{item.reviewCount || "12"} reviews</p>
                                        </div>

                                        {/* Main Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                                                <div>
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <h3 className="text-lg font-bold text-gray-900">{item.name}</h3>
                                                        {item.isVerified && (
                                                            <span className="inline-flex items-center gap-1 text-xs text-blue-600 font-medium bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                                                                <ShieldCheck size={11} /> Verified
                                                            </span>
                                                        )}
                                                        {item.subscriptionTier !== "FREE" && (
                                                            <span className="inline-flex items-center gap-1 text-xs text-amber-700 font-medium bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
                                                                Premium
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="flex flex-wrap items-center gap-2 mt-1.5">
                                                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md">
                                                            <GraduationCap size={12} /> {item.subject || querySubject || "Academics"}
                                                        </span>
                                                        {item.location && (
                                                            <span className="inline-flex items-center gap-1.5 text-xs text-gray-500">
                                                                <MapPin size={12} /> {item.location}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Fee */}
                                                <div className="text-right shrink-0">
                                                    <p className="text-xl font-bold text-gray-900">₹{item.rate || "500"}</p>
                                                    <p className="text-xs text-gray-400">per hour</p>
                                                </div>
                                            </div>

                                            {/* Meta row */}
                                            <div className="flex flex-wrap gap-4 text-xs text-gray-500 mb-3">
                                                {item.experience && (
                                                    <span className="flex items-center gap-1">
                                                        <Briefcase size={12} className="text-gray-400" />
                                                        {item.experience} yrs experience
                                                    </span>
                                                )}
                                                {item.teachingMode && (
                                                    <span className="flex items-center gap-1">
                                                        <Monitor size={12} className="text-gray-400" />
                                                        {teachingModeLabel(item.teachingMode)}
                                                    </span>
                                                )}
                                                {item.listingType === "GROUP" && (
                                                    <span className="flex items-center gap-1">
                                                        <Users size={12} className="text-gray-400" />
                                                        Group &bull; {item.enrolledCount || 0}/{item.maxSeats || "—"} seats
                                                    </span>
                                                )}
                                                {item.listingType === "PRIVATE" && (
                                                    <span className="flex items-center gap-1">
                                                        <User size={12} className="text-gray-400" />
                                                        Private
                                                    </span>
                                                )}
                                            </div>

                                            {/* Bio */}
                                            {item.bio && (
                                                <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 mb-4">{item.bio}</p>
                                            )}

                                            {/* Action Buttons */}
                                            <div className="flex flex-col sm:flex-row gap-2 pt-1">
                                                <button
                                                    onClick={() => handleContactTutor(item)}
                                                    className="flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 active:scale-95 transition-all"
                                                >
                                                    <Lock size={13} />
                                                    Contact Tutor
                                                </button>
                                                <Link
                                                    href={`/search/${item.id || item.userId || "#"}`}
                                                    className="flex items-center justify-center gap-2 px-5 py-2.5 border border-gray-200 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all"
                                                >
                                                    View Profile
                                                    <ArrowRight size={13} />
                                                </Link>
                                                <a
                                                    href={`https://wa.me/?text=${encodeURIComponent(`Check out ${item.name} on TuitionsInIndia\nhttps://tuitionsinindia.com/search/${item.id}`)}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center justify-center size-10 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors shrink-0"
                                                    title="Share on WhatsApp"
                                                >
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                /* Empty State */
                                <div className="bg-white border border-gray-200 rounded-xl p-12 text-center mt-4">
                                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Search size={28} className="text-gray-300" />
                                    </div>
                                    <h2 className="text-base font-semibold text-gray-700 mb-1">No tutors found</h2>
                                    <p className="text-sm text-gray-400 mb-5">Try changing your filters or searching for a different subject or location.</p>
                                    <button
                                        onClick={resetFilters}
                                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        Clear Filters
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={
            <div className="h-screen w-full flex flex-col items-center justify-center bg-gray-50 font-sans">
                <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                <p className="text-sm text-gray-500">Loading results...</p>
            </div>
        }>
            <SearchResultsContent />
        </Suspense>
    );
}
