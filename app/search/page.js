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
    TrendingUp, 
    GraduationCap, 
    ChevronDown, 
    ChevronLeft,
    WifiOff, 
    ArrowRight, 
    X, 
    Lock, 
    UserPlus, 
    BadgeCheck,
    Layers,
    Award,
    Cpu
} from "lucide-react";
import SkeletonLoader from "../components/SkeletonLoader";

function SearchResultsContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const querySubject = searchParams.get("subject") || "";
    const queryLocation = searchParams.get("location") || "";
    const queryRole = searchParams.get("role") || "TUTOR";
    const queryLat = searchParams.get("lat");
    const queryLng = searchParams.get("lng");

    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [viewMode, setViewMode] = useState("list"); // list, map
    
    // Filter & Sort State
    const [grade, setGrade] = useState(searchParams.get("grade") || "");
    const [minRate, setMinRate] = useState(0);
    const [maxRate, setMaxRate] = useState(10000);
    const [sortBy, setSortBy] = useState("relevance");
    const [verifiedOnly, setVerifiedOnly] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [selectedTutor, setSelectedTutor] = useState(null);

    const grades = [
        "Primary (1-5)", "Middle (6-8)", "High School (9-10)", 
        "Higher Secondary (11-12)", "Undergraduate", "Competitive Exams"
    ];

    useEffect(() => {
        fetchResults();
    }, [querySubject, queryLocation, queryRole, queryLat, queryLng, grade, maxRate, sortBy, verifiedOnly]);

    const fetchResults = async () => {
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams({
                subject: querySubject,
                location: queryLocation,
                role: queryRole,
                grade: grade,
                minRate: minRate.toString(),
                maxRate: maxRate.toString(),
                sortBy: sortBy,
                verified: verifiedOnly.toString()
            });
            if (queryLat) params.set("lat", queryLat);
            if (queryLng) params.set("lng", queryLng);

            const res = await fetch(`/api/search/tutors?${params.toString()}`);
            const data = await res.json();
            
            if (Array.isArray(data)) {
                setResults(data);
            } else if (data.error) {
                setError(data.error + (data.details ? `: ${data.details}` : ""));
                setResults([]);
            } else {
                setResults([]);
            }
        } catch (err) {
            console.error(err);
            setError("Failed to fetch discovery results. Please verify your connection.");
        } finally {
            setLoading(false);
        }
    };

    const handleContactTutor = (tutor) => {
        // If viewer is searching FOR students, then the viewer is a Tutor.
        // If viewer is searching FOR tutors/institutes, then the viewer is a Student.
        const registerRoute = queryRole === "STUDENT" ? "/register/tutor" : "/register/student";
        
        const params = new URLSearchParams();
        if (querySubject) params.set("subject", querySubject);
        if (grade) params.set("grade", grade);
        if (queryLocation) params.set("location", queryLocation);
        
        router.push(`${registerRoute}?${params.toString()}`);
    };

    const roleLabel = queryRole === "STUDENT" ? "Requirements" : queryRole === "INSTITUTE" ? "Institutes" : "Tutors";

    return (
        <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50 font-sans text-gray-800 antialiased pt-20">
            {/* SIDEBAR FILTERS */}
            <aside className="w-full lg:w-80 bg-white border-r border-gray-200 flex flex-col lg:sticky lg:top-20 lg:h-[calc(100vh-5rem)] overflow-y-auto">
                <div className="p-6 border-b border-gray-200 flex items-center justify-between bg-white sticky top-0 z-10">
                    <h2 className="font-bold text-gray-900">Filters</h2>
                    <Filter size={18} className="text-gray-400" />
                </div>
                
                <div className="p-6 space-y-8">
                    {/* Grade Filter */}
                    <div className="space-y-3">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Level / Grade</label>
                        <div className="relative group">
                            <select 
                                value={grade} 
                                onChange={(e) => setGrade(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 text-sm font-medium text-gray-800 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 appearance-none cursor-pointer transition-all"
                            >
                                <option value="">All Levels</option>
                                {grades.map(g => <option key={g} value={g}>{g}</option>)}
                            </select>
                            <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>
                    </div>

                    {/* Price Filter */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Max Hourly Rate</label>
                            <span className="text-sm font-bold text-blue-600">₹{maxRate}</span>
                        </div>
                        <input 
                            type="range" min="0" max="5000" step="100" 
                            value={maxRate} 
                            onChange={(e) => setMaxRate(parseInt(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-blue-600"
                        />
                    </div>

                    {/* Verified Toggle */}
                    <label className="flex items-center justify-between p-4 bg-blue-50/50 rounded-xl border border-blue-100 cursor-pointer hover:bg-blue-50 transition-all group">
                        <div className="flex items-center gap-3">
                            <ShieldCheck size={20} className="text-blue-600" />
                            <p className="text-sm font-bold text-gray-800">Verified Only</p>
                        </div>
                        <div className={`w-10 h-6 rounded-full p-1 flex items-center transition-all ${verifiedOnly ? 'bg-blue-600' : 'bg-gray-300'}`}>
                            <div className={`size-4 bg-white rounded-full shadow-sm transition-transform ${verifiedOnly ? 'translate-x-4' : 'translate-x-0'}`}></div>
                        </div>
                        <input 
                            type="checkbox" 
                            checked={verifiedOnly}
                            onChange={(e) => setVerifiedOnly(e.target.checked)}
                            className="hidden"
                        />
                    </label>
                </div>
            </aside>

            {/* MAIN CONTENT AREA */}
            <div className="flex-1 flex flex-col items-center bg-gray-50 relative overflow-hidden">
                
                {/* Top Nav Control */}
                <div className="w-full max-w-5xl p-6 md:p-10 border-b border-gray-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-white sticky top-0 z-20 shadow-sm">
                    <div className="space-y-2">
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                            {Array.isArray(results) ? results.length : 0} {roleLabel} Found
                        </h1>
                        <div className="flex items-center gap-2 flex-wrap">
                            {querySubject && <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-lg flex items-center gap-1"><Search size={12} /> {querySubject}</span>}
                            {queryLocation && <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-lg flex items-center gap-1"><MapPin size={12} /> {queryLocation}</span>}
                            {grade && <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-lg flex items-center gap-1"><Layers size={12} /> {grade}</span>}
                        </div>
                    </div>
                </div>

                <div className="w-full max-w-5xl overflow-y-auto p-6 md:p-10 space-y-6 pb-24">
                    {loading ? (
                        <div className="grid grid-cols-1 gap-6">
                            {[1, 2, 3].map(i => <SkeletonLoader key={i} />) }
                        </div>
                    ) : error ? (
                        <div className="bg-red-50 border border-red-100 p-12 rounded-2xl text-center">
                            <WifiOff size={48} className="text-red-400 mx-auto mb-6" />
                            <h2 className="text-xl font-bold text-gray-900 mb-2">Connection Error</h2>
                            <p className="text-gray-500 mb-8">{error}</p>
                            <button onClick={fetchResults} className="px-6 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition">Try Again</button>
                        </div>
                    ) : Array.isArray(results) && results.length > 0 ? (
                        <div className="grid grid-cols-1 gap-6">
                            {results.map((item, idx) => (
                                <div key={idx} className="bg-white rounded-3xl p-6 md:p-8 flex flex-col md:flex-row gap-8 shadow-sm border border-gray-200 hover:shadow-md transition-shadow relative">
                                    
                                    {/* Image */}
                                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl shrink-0 overflow-hidden relative shadow-sm border border-gray-100 bg-gray-50 flex items-center justify-center">
                                        <User size={40} className="text-gray-300" />
                                        {item.isVerified && (
                                            <div className="absolute -bottom-1 -right-1 size-8 rounded-full bg-green-500 border-2 border-white flex items-center justify-center text-white">
                                                <ShieldCheck size={16} />
                                            </div>
                                        )}
                                    </div>

                                    {/* Details */}
                                    <div className="flex-1 flex flex-col">
                                        <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
                                            <div>
                                                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">{item.name}</h3>
                                                <div className="flex flex-wrap gap-2">
                                                    <span className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-bold">
                                                        <GraduationCap size={14} /> {item.subject}
                                                    </span>
                                                    <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-500">
                                                        <MapPin size={14} /> {item.location}
                                                    </span>
                                                </div>
                                            </div>
                                            
                                            <div className="md:text-right bg-gray-50 px-4 py-3 rounded-xl border border-gray-100">
                                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Fees</p>
                                                <p className="text-xl font-bold text-gray-900">₹{item.rate || '500'}<span className="text-xs text-gray-500 font-medium ml-1">/hr</span></p>
                                            </div>
                                        </div>
                                        
                                        <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-2">
                                            {item.bio || 'Looking to connect with passionate individuals for quality educational growth and success.'}
                                        </p>
                                        
                                        <div className="mt-auto flex flex-col sm:flex-row items-center gap-4">
                                            <button 
                                                onClick={() => handleContactTutor(item)}
                                                className="w-full px-6 py-4 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-sm"
                                            >
                                                <Lock size={16} /> Unlock Contact
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center bg-white rounded-3xl border border-gray-200 p-10 shadow-sm">
                            <div className="size-20 rounded-full bg-gray-100 flex items-center justify-center mb-6">
                                <Search size={32} className="text-gray-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Results Found</h2>
                            <p className="text-gray-500 max-w-sm mb-8">We couldn't find any exact matches. Try broadening your search filters or trying a different location.</p>
                            <button onClick={() => { setGrade(""); setMaxRate(10000); setVerifiedOnly(false); }} className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors">
                                Clear Filters
                            </button>
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
            <div className="h-screen w-full flex flex-col items-center justify-center bg-gray-50">
                <div className="text-sm font-bold text-gray-500 mt-6 animate-pulse">Loading Search Results...</div>
            </div>
        }>
            <SearchResultsContent />
        </Suspense>
    );
}
