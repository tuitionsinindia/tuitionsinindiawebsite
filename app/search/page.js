"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import SkeletonLoader from "../components/SkeletonLoader";

function SearchResultsContent() {
    const searchParams = useSearchParams();
    const querySubject = searchParams.get("subject") || "";
    const queryLocation = searchParams.get("location") || "";
    const queryRole = searchParams.get("role") || "TUTOR";
    const queryLat = searchParams.get("lat");
    const queryLng = searchParams.get("lng");

    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [viewMode, setViewMode] = useState("list"); // list, map, both
    
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
            setError("Failed to fetch results. Please check your connection.");
        } finally {
            setLoading(false);
        }
    };

    const handleContactTutor = (tutor) => {
        const isLoggedIn = false; // TODO: Connect to real auth session
        if (!isLoggedIn) {
            setSelectedTutor(tutor);
            setShowAuthModal(true);
        } else {
            window.location.href = `/tutors/${tutor.id}`;
        }
    };

    const roleLabel = queryRole === "STUDENT" ? "Requirements" : queryRole === "INSTITUTE" ? "Institutes" : "Tutors";

    return (
        <div className="flex flex-col lg:flex-row h-[calc(100vh-80px)] bg-slate-50 overflow-hidden font-sans">
            {/* SIDEBAR FILTERS */}
            <aside className="w-full lg:w-72 bg-white border-r border-slate-100 flex flex-col h-full overflow-y-auto">
                <div className="p-6 border-b border-slate-50">
                    <h2 className="text-sm font-black uppercase tracking-widest text-slate-400">Filters</h2>
                </div>
                
                <div className="p-6 space-y-8">
                    {/* Grade Filter */}
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase block mb-4">Grade / Level</label>
                        <select 
                            value={grade} 
                            onChange={(e) => setGrade(e.target.value)}
                            className="w-full bg-slate-50 border-none rounded-xl p-3 text-sm font-bold outline-none focus:ring-2 focus:ring-primary"
                        >
                            <option value="">All Levels</option>
                            {grades.map(g => <option key={g} value={g}>{g}</option>)}
                        </select>
                    </div>

                    {/* Price Filter */}
                    <div>
                        <div className="flex justify-between mb-4">
                            <label className="text-xs font-bold text-slate-500 uppercase">Max Hourly Rate</label>
                            <span className="text-xs font-black text-primary">₹{maxRate}</span>
                        </div>
                        <input 
                            type="range" min="0" max="5000" step="100" 
                            value={maxRate} 
                            onChange={(e) => setMaxRate(parseInt(e.target.value))}
                            className="w-full accent-primary"
                        />
                    </div>

                    {/* Verified Toggle */}
                    <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-emerald-600">verified</span>
                            <span className="text-xs font-black text-emerald-900">Verified Only</span>
                        </div>
                        <input 
                            type="checkbox" 
                            checked={verifiedOnly}
                            onChange={(e) => setVerifiedOnly(e.target.checked)}
                            className="size-5 rounded border-emerald-300 text-emerald-600 focus:ring-emerald-500"
                        />
                    </div>

                    {/* Sorting */}
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase block mb-4">Sort By</label>
                        <div className="grid grid-cols-1 gap-2">
                            {[
                                { id: "relevance", name: "Relevance", icon: "stars" },
                                { id: "price_low", name: "Lowest Price", icon: "trending_down" },
                                { id: "rating", name: "Highest Rating", icon: "thumb_up" },
                                { id: "distance", name: "Nearest First", icon: "distance" }
                            ].map(option => (
                                <button 
                                    key={option.id}
                                    onClick={() => setSortBy(option.id)}
                                    className={`flex items-center gap-3 px-5 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${sortBy === option.id ? 'bg-primary text-white shadow-[0_15px_30px_-5px_rgba(30,75,179,0.3)]' : 'bg-slate-50 text-slate-500 hover:bg-white hover:shadow-lg'}`}
                                >
                                    <span className="material-symbols-outlined text-[20px]">{option.icon}</span>
                                    {option.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </aside>

            {/* MAIN CONTENT AREA */}
            <div className="flex-1 flex flex-col h-full bg-white relative overflow-hidden">
                {/* VIEW TOGGLE - Floating on mobile, top bar on desktop */}
                <div className="lg:hidden fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
                    <button 
                        onClick={() => setViewMode(viewMode === 'list' ? 'map' : 'list')}
                        className="bg-slate-900 text-white px-8 py-4 rounded-full shadow-2xl flex items-center gap-3 font-black uppercase tracking-widest text-[12px] active:scale-95 transition-all border border-white/10"
                    >
                        <span className="material-symbols-outlined text-primary">
                            {viewMode === 'list' ? 'map' : 'list_alt'}
                        </span>
                        {viewMode === 'list' ? 'Show Map' : 'Show List'}
                    </button>
                </div>

                <div className="p-8 border-b border-slate-100 flex items-center justify-between flex-wrap gap-6 bg-white/70 backdrop-blur-xl sticky top-0 z-20">
                    <div>
                        <h1 className="text-2xl font-heading font-black text-slate-900 tracking-tight">
                            {Array.isArray(results) ? results.length : 0} {roleLabel} Found
                        </h1>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2">
                            {querySubject || 'All Subjects'} • {queryLocation || 'India'} {grade ? `• ${grade}` : ''}
                        </p>
                    </div>
                    <div className="hidden lg:flex bg-slate-100/50 p-1.5 rounded-2xl border border-slate-200/50">
                        <button 
                            onClick={() => setViewMode("list")}
                            className={`px-8 py-3 text-[11px] font-black uppercase tracking-widest rounded-xl transition-all ${viewMode === 'list' ? 'bg-white shadow-xl text-primary' : 'text-slate-500 hover:bg-white/50'}`}
                        >List View</button>
                        <button 
                            onClick={() => setViewMode("map")}
                            className={`px-8 py-3 text-[11px] font-black uppercase tracking-widest rounded-xl transition-all ${viewMode === 'map' ? 'bg-white shadow-xl text-primary' : 'text-slate-500 hover:bg-white/50'}`}
                        >Map Discovery</button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth pb-32 lg:pb-6">
                    {loading ? (
                        [1, 2, 3].map(i => <SkeletonLoader key={i} />)
                    ) : error ? (
                        <div className="bg-rose-50 border border-rose-100 p-10 rounded-[2.5rem] text-center">
                            <span className="material-symbols-outlined text-rose-500 text-6xl mb-4">error</span>
                            <h2 className="text-2xl font-black text-rose-900 mb-2 font-heading">Connectivity Issue</h2>
                            <p className="text-rose-600 font-bold mb-8">{error}</p>
                            <button onClick={fetchResults} className="px-10 py-4 bg-rose-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all">Retry Search</button>
                        </div>
                    ) : Array.isArray(results) && results.length > 0 ? (
                        results.map((item, idx) => (
                            <div key={idx} className="premium-card relative group">
                                {item.subscriptionTier === "ELITE" && (
                                    <div className="absolute top-0 right-10 px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-b-3xl shadow-xl flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[14px] fill-1">workspace_premium</span>
                                        Elite Partner
                                    </div>
                                )}
                                
                                <div className="flex flex-col sm:flex-row gap-8 sm:gap-12">
                                    <div className="size-32 sm:size-44 rounded-[2.5rem] bg-slate-50 shrink-0 overflow-hidden relative shadow-2xl shadow-slate-200 border border-white">
                                        <img src={item.image || `https://i.pravatar.cc/200?u=${item.id}`} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                        {item.isVerified && (
                                            <div className="absolute top-4 right-4 size-10 rounded-full glass-premium border-2 border-white flex items-center justify-center text-emerald-500 shadow-2xl">
                                                <span className="material-symbols-outlined text-[20px] font-black fill-1">verified</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex flex-col sm:flex-row justify-between items-start mb-6 gap-6">
                                            <div>
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="font-heading font-black text-2xl sm:text-3xl text-slate-900 tracking-tight">{item.name}</h3>
                                                    {item.rating != null && item.rating > 0 && (
                                                        <div className="flex items-center gap-1.5 bg-amber-50 text-amber-600 px-3 py-1 rounded-xl text-[11px] font-black border border-amber-100/50">
                                                            <span className="material-symbols-outlined text-sm fill-1">star</span>
                                                            {item.rating}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex flex-wrap gap-3 items-center">
                                                    <span className="px-4 py-1.5 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-wider rounded-full border border-primary/5">{item.subject}</span>
                                                    {item.grade && <span className="px-4 py-1.5 bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-wider rounded-full border border-slate-100">{item.grade}</span>}
                                                </div>
                                            </div>
                                            <div className="sm:text-right">
                                                <p className="text-3xl sm:text-4xl font-black text-slate-900 font-heading">₹{item.rate || '500'}<span className="text-xs text-slate-400 font-bold tracking-widest ml-1 uppercase">/hr</span></p>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center sm:justify-end gap-2 mt-2">
                                                    <span className="material-symbols-outlined text-[16px] text-primary">location_on</span>
                                                    {item.distance != null && item.distance < 999 ? `${item.distance.toFixed(1)} km away` : item.location}
                                                </p>
                                            </div>
                                        </div>
                                        
                                        <p className="text-base text-slate-500 line-clamp-2 mb-8 font-medium italic leading-relaxed">"{item.bio || 'Excellence in education through personalized guidance and conceptual mastery. Dedicated to helping students achieve their highest potential through verified expertise.'}"</p>
                                        
                                        <div className="flex flex-wrap items-center gap-4">
                                            <button 
                                                onClick={() => handleContactTutor(item)}
                                                className="flex-1 sm:flex-none px-12 py-5 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-primary hover:shadow-[0_20px_40px_-10px_rgba(30,75,179,0.5)] hover:-translate-y-1 active:scale-95 transition-all"
                                            >
                                                {queryRole === "STUDENT" ? "Secure Connection" : "Contact Elite Expert"}
                                            </button>
                                            <button className="flex-1 sm:flex-none px-10 py-5 glass-premium rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] text-slate-600 hover:bg-white hover:text-primary transition-all">Profile Intelligence</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-20 sm:py-32 bg-slate-50/50 rounded-[3rem] sm:rounded-[4rem] border-2 border-dashed border-slate-200 px-6">
                            <div className="size-20 sm:size-24 rounded-full bg-white flex items-center justify-center mx-auto mb-6 shadow-xl">
                                <span className="material-symbols-outlined text-4xl sm:text-5xl text-slate-100">search_off</span>
                            </div>
                            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-2">No Matching {roleLabel}</h2>
                            <p className="text-sm sm:text-base text-slate-400 font-bold">Try adjusting your filters or expanding your search area.</p>
                            <button onClick={() => { setGrade(""); setMaxRate(10000); setVerifiedOnly(false); }} className="mt-8 px-8 py-3 bg-white text-primary rounded-2xl text-[10px] sm:text-xs font-black uppercase tracking-widest shadow-xl ring-1 ring-primary/5 hover:bg-primary hover:text-white transition-all">Clear All Filters</button>
                        </div>
                    )}
                </div>
            </div>

            {/* MAP AREA */}
            <div className={`fixed inset-0 lg:relative flex-1 h-full bg-slate-100 z-40 transition-all duration-500 overflow-hidden ${viewMode === 'map' ? 'translate-x-0 opacity-100' : 'translate-x-full lg:hidden lg:opacity-0'}`}>
                {/* Leaflet Assets */}
                <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossOrigin="" />
                <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossOrigin=""></script>

                {/* Back button for mobile map view */}
                <button 
                    onClick={() => setViewMode("list")}
                    className="lg:hidden absolute top-6 left-6 z-50 size-12 bg-white rounded-2xl shadow-2xl flex items-center justify-center text-slate-900"
                >
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>

                {/* Map Interface Implementation */}
                <div id="map" className="absolute inset-0 z-10">
                    <div className="absolute inset-0 bg-slate-50 flex items-center justify-center">
                        <div className="text-center">
                            <span className="material-symbols-outlined text-4xl text-primary animate-bounce">location_on</span>
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mt-4">Initializing Interactive Map...</p>
                        </div>
                    </div>
                </div>

                {/* Map Logic Script Injection */}
                <script dangerouslySetInnerHTML={{ __html: `
                    (function initMap() {
                        if (typeof L === 'undefined') {
                            setTimeout(initMap, 500);
                            return;
                        }
                        
                        // Clear existing map if any
                        const mapContainer = document.getElementById('map');
                        if (mapContainer._leaflet_id) return; 

                        const map = L.map('map', { zoomControl: false }).setView([${queryLat || 20.5937}, ${queryLng || 78.9629}], ${queryLat ? 12 : 5});
                        
                        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
                            attribution: '&copy; OpenStreetMap contributors &copy; CARTO'
                        }).addTo(map);

                        L.control.zoom({ position: 'bottomright' }).addTo(map);

                        const results = ${JSON.stringify(Array.isArray(results) ? results.slice(0, 50) : [])};
                        
                        results.forEach(t => {
                            if (t.lat && t.lng) {
                                const marker = L.divIcon({
                                    className: 'custom-div-icon',
                                    html: \`
                                        <div class="bg-white px-3 py-1.5 rounded-xl shadow-xl border-2 border-primary font-black text-[10px] text-slate-900 flex items-center gap-1 hover:scale-110 transition-transform">
                                            ₹\${t.rate || '500'}
                                            \${t.rating > 0 ? '<span class="text-amber-500">★' + t.rating + '</span>' : ''}
                                        </div>
                                        <div class="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-primary mx-auto -mt-0.5 scale-x-50"></div>
                                    \`,
                                    iconSize: [60, 30],
                                    iconAnchor: [30, 30]
                                });
                                L.marker([t.lat, t.lng], { icon: marker }).addTo(map)
                                 .on('click', () => {
                                     // Trigger parent component method if needed
                                     window.dispatchEvent(new CustomEvent('map_marker_click', { detail: t }));
                                 });
                            }
                        });
                    })();
                `}} />

                {/* Floating Map Controls & Info */}
                <div className="absolute bottom-10 left-10 right-10 flex justify-between items-end pointer-events-none z-[20]">
                    <div className="flex flex-col gap-3 pointer-events-auto">
                        {/* Custom controls could go here */}
                    </div>
                    <div className="bg-white/90 backdrop-blur-xl p-6 rounded-[2.5rem] shadow-2xl border border-white max-w-sm pointer-events-auto animate-fade-in-up">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="font-heading font-black text-slate-900 tracking-tight">Interactive Discovery</h4>
                            <div className="size-2 bg-emerald-500 rounded-full animate-pulse"></div>
                        </div>
                        <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest mb-4">Real-time tutor mapping enabled</p>
                        <div className="flex items-center gap-3">
                            <div className="flex -space-x-3 overflow-hidden">
                                {Array.isArray(results) && results.slice(0, 3).map((r, i) => (
                                    <img key={i} className="inline-block h-10 w-10 rounded-full ring-4 ring-white" src={r.image || `https://i.pravatar.cc/100?u=\${r.id}`} alt="" />
                                ))}
                            </div>
                            <span className="text-xs font-black text-slate-900">+{Array.isArray(results) ? results.length : 0} experts nearby</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* AUTH MODAL WALL */}
            {showAuthModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-lg animate-fade-in">
                    <div className="bg-white rounded-[3rem] shadow-2xl max-w-md w-full p-12 relative overflow-hidden text-center animate-scale-up">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-accent"></div>
                        <button onClick={() => setShowAuthModal(false)} className="absolute top-8 right-8 text-slate-400 hover:text-slate-900 transition-colors">
                            <span className="material-symbols-outlined">close</span>
                        </button>
                        
                        <div className="size-24 rounded-full bg-primary/5 flex items-center justify-center mx-auto mb-8 ring-8 ring-primary/5">
                            <span className="material-symbols-outlined text-6xl text-primary animate-pulse">workspace_premium</span>
                        </div>
                        
                        <h2 className="text-3xl font-heading font-black text-slate-900 mb-4 tracking-tight leading-tight">Join India's <span className="text-primary italic font-serif">Elite Academic Circle.</span></h2>
                        <p className="text-slate-500 font-medium mb-12 leading-relaxed">
                            To maintain our standard of excellence and provide a personalized experience, we invite you to create a secure account before connecting with verified experts like <span className="font-black text-slate-900">{selectedTutor?.name}</span>.
                        </p>
                        
                        <div className="space-y-4">
                            <Link 
                                href={`/register/student?subject=${encodeURIComponent(querySubject)}&grade=${encodeURIComponent(grade)}&location=${encodeURIComponent(queryLocation)}`} 
                                className="block w-full bg-primary text-white font-black py-5 rounded-2xl hover:opacity-90 shadow-2xl shadow-primary/20 transition-all active:scale-[0.98]"
                            >
                                Sign Up as Student
                            </Link>
                            <p className="text-xs font-bold text-slate-400">Already have an account? <Link href="/login" className="text-primary hover:underline">Log In</Link></p>
                        </div>
                        
                        <div className="mt-12 pt-8 border-t border-slate-50 flex justify-center gap-8">
                            <div className="flex flex-col items-center gap-1">
                                <span className="text-lg font-black text-slate-900 tracking-tight">50k+</span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Verified Tutors</span>
                            </div>
                            <div className="flex flex-col items-center gap-1">
                                <span className="text-lg font-black text-slate-900 tracking-tight">100%</span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Data Privacy</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={<div className="p-20 text-center font-black animate-pulse text-slate-200">Loading Map View...</div>}>
            <SearchResultsContent />
        </Suspense>
    );
}
