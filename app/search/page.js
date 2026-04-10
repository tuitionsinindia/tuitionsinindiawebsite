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
    Cpu,
    User,
    Briefcase,
    Clock,
    UserCheck,
    Calendar,
    Home,
    Monitor,
    Users,
    Building2,
    Calculator,
    Zap,
    Activity,
    Box,
    Sparkles,
    Target
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
                if (!res.ok) setError("PROTOCOL_SYNC_FAILURE: Server unreachable.");
            }
        } catch (err) {
            console.error(err);
            setError("DISCOVERY_ERROR: Interference in the neural discovery stream.");
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
        params.set("intent", "unlock");
        router.push(`${registerRoute}?${params.toString()}`);
    };

    const roleLabel = queryRole === "STUDENT" ? "Academic Requests" : queryRole === "INSTITUTE" ? "Command Centers" : "Faculty Members";

    return (
        <div className="flex flex-col lg:flex-row min-h-screen bg-background-dark font-sans text-on-surface-dark antialiased pt-[85px] selection:bg-indigo-500/20 selection:text-indigo-400">
            {/* SIDEBAR FILTERS (Tactical Module) */}
            <aside className="w-full lg:w-96 bg-surface-dark/20 backdrop-blur-3xl border-r border-border-dark flex flex-col lg:sticky lg:top-[85px] lg:h-[calc(100vh-85px)] overflow-y-auto scrollbar-hide z-40 transform transition-all">
                <div className="p-8 border-b border-border-dark flex items-center justify-between bg-surface-dark/10 sticky top-0 z-10 backdrop-blur-md">
                    <div className="flex items-center gap-3">
                        <div className="size-10 rounded-xl bg-indigo-600/10 text-indigo-500 flex items-center justify-center border border-indigo-500/10 shadow-lg shadow-indigo-500/5">
                            <Target size={20} />
                        </div>
                        <h2 className="font-black text-white text-sm uppercase tracking-[0.2em] italic">Filter Matrix</h2>
                    </div>
                    <button 
                        onClick={() => { 
                            setGrade(""); setMaxRate(10000); setVerifiedOnly(false); 
                            setGender(""); setExperience(""); setTeachingMode(""); setBoard("");
                            setListingType("ALL");
                        }}
                        className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] hover:text-indigo-500 transition-colors italic"
                    >
                        RESET_ALL
                    </button>
                </div>
                
                <div className="p-10 space-y-12 pb-32">
                    {/* Engagement Protocol (Interaction Model) */}
                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] ml-2 italic">Engagement Protocol</label>
                        <div className="grid grid-cols-1 gap-3">
                            {[
                                { id: "ALL", label: "UNIFIED_STREAM", icon: Layers },
                                { id: "PRIVATE", label: "PRIVATE_1:1", icon: User },
                                { id: "GROUP", label: "BATCH_COHORT", icon: Users }
                            ].map(type => (
                                <button 
                                    key={type.id} 
                                    onClick={() => setListingType(type.id)}
                                    className={`flex items-center gap-4 p-5 rounded-2xl border transition-all text-[11px] font-black tracking-widest uppercase italic group ${
                                        listingType === type.id 
                                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-xl shadow-indigo-600/20' 
                                        : 'bg-white/5 text-white/40 border-border-dark hover:bg-white/10'
                                    }`}
                                >
                                    <type.icon size={18} className={listingType === type.id ? 'opacity-100' : 'opacity-20 group-hover:opacity-100'} />
                                    {type.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Discovery Mode (Location Node) */}
                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] ml-2 italic">Discovery Mode (Location)</label>
                        <div className="grid grid-cols-1 gap-3">
                            {[
                                { id: "ONLINE", label: "DIGITAL_HUB", icon: MonitorCheck },
                                { id: "STUDENT_HOME", label: "STUDENT_FACILITY", icon: Home },
                                { id: "TUTOR_HOME", label: "TUTOR_HUB", icon: MapPin },
                                { id: "CENTER", label: "ACADEMY_CENTER", icon: Building2 }
                            ].map(loc => (
                                <button 
                                    key={loc.id} 
                                    onClick={() => setTeachingMode(loc.id)}
                                    className={`flex items-center gap-4 p-5 rounded-2xl border transition-all text-[11px] font-black tracking-widest uppercase italic group ${
                                        teachingMode === loc.id 
                                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-xl shadow-indigo-600/20' 
                                        : 'bg-white/5 text-white/40 border-border-dark hover:bg-white/10'
                                    }`}
                                >
                                    <loc.icon size={18} className={teachingMode === loc.id ? 'opacity-100' : 'opacity-20 group-hover:opacity-100'} />
                                    {loc.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Common Parameters */}
                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] ml-2 italic">Neural Level (Grade)</label>
                        <select 
                            value={grade} 
                            onChange={(e) => setGrade(e.target.value)}
                            className="w-full bg-background-dark/50 border border-border-dark rounded-2xl p-6 text-xs font-black text-white outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none italic uppercase tracking-widest cursor-pointer hover:bg-white/5 transition-all"
                        >
                            <option value="" className="bg-surface-dark bg-opacity-100">ALL_LEVELS</option>
                            {grades.map(g => <option key={g} value={g} className="bg-surface-dark">{g.toUpperCase()}</option>)}
                        </select>
                    </div>

                    <div className="space-y-8">
                        <div className="flex justify-between items-center px-2">
                            <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] italic">Budget Index</label>
                            <span className="text-xs font-black text-indigo-500 italic tracking-tighter">₹{maxRate}</span>
                        </div>
                        <div className="relative h-2 bg-white/5 rounded-full overflow-hidden">
                            <input 
                                type="range" min="0" max="5000" step="100" 
                                value={maxRate} 
                                onChange={(e) => setMaxRate(parseInt(e.target.value))}
                                className="absolute inset-0 w-full h-full bg-transparent appearance-none cursor-pointer accent-indigo-500 focus:outline-none z-10"
                            />
                            <div className="absolute left-0 top-0 h-full bg-indigo-600 transition-all pointer-events-none" style={{ width: `${(maxRate/5000)*100}%` }}></div>
                        </div>
                    </div>

                    {/* Specialized Matrix Toggles */}
                    <label className="flex items-center justify-between p-6 bg-indigo-500/5 rounded-[2.5rem] border border-indigo-500/10 cursor-pointer hover:bg-indigo-500/10 transition-all group overflow-hidden relative">
                         <div className="absolute -right-4 -bottom-4 text-indigo-500/10 rotate-12 group-hover:scale-125 transition-transform"><ShieldCheck size={100} /></div>
                        <div className="flex items-center gap-4 relative z-10">
                            <ShieldCheck size={20} className="text-indigo-500" />
                            <p className="text-[11px] font-black text-white uppercase italic tracking-widest leading-none">Verified_Only</p>
                        </div>
                        <div className={`w-12 h-6 rounded-full p-1.5 flex items-center transition-all relative z-10 ${verifiedOnly ? 'bg-indigo-600' : 'bg-white/10'}`}>
                            <div className={`size-3 bg-white rounded-full shadow-xl transition-transform ${verifiedOnly ? 'translate-x-6' : 'translate-x-0'}`}></div>
                        </div>
                        <input type="checkbox" checked={verifiedOnly} onChange={(e) => setVerifiedOnly(e.target.checked)} className="hidden" />
                    </label>
                </div>
            </aside>

            {/* MAIN DISCOVERY AREA */}
            <div className="flex-1 flex flex-col bg-background-dark relative">
                
                {/* Search HUD Header */}
                <div className="w-full p-8 md:p-12 lg:p-16 bg-surface-dark/10 border-b border-border-dark sticky top-[85px] z-30 backdrop-blur-3xl flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="relative">
                        <div className="absolute -left-12 -top-12 text-[140px] font-black text-white/5 leading-none tracking-tighter italic select-none pointer-events-none uppercase">SCAN</div>
                        <div className="flex items-center gap-3 mb-4">
                            <Activity size={16} className="text-indigo-500 animate-pulse" />
                            <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.5em] italic">Neural Discovery Active</p>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase italic leading-[0.85]">
                            {results.length} <span className="text-indigo-500 underline decoration-indigo-500/20 underline-offset-4 decoration-8">{roleLabel}.</span>
                        </h1>
                        <p className="text-white/20 font-black text-[10px] uppercase tracking-[0.4em] italic mt-6 flex items-center gap-3">
                            Syncing: <span className="text-on-surface-dark">{querySubject || 'General Hub'}</span> in <span className="text-on-surface-dark">{queryLocation || 'Geospatial Grid'}</span>
                        </p>
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="flex bg-white/5 p-2 rounded-2xl border border-border-dark shadow-2xl">
                            <button 
                                onClick={() => setViewMode("list")}
                                className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all italic ${viewMode === "list" ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' : 'text-white/20 hover:text-white'}`}
                            >
                                <List size={16} /> Grid_View
                            </button>
                            <button 
                                onClick={() => setViewMode("map")}
                                className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all italic ${viewMode === "map" ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' : 'text-white/20 hover:text-white'}`}
                            >
                                <MapIcon size={16} /> Radar_View
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto scrollbar-hide">
                    {viewMode === "map" ? (
                        <div className="h-full p-8 md:p-12 lg:p-16">
                            <MapComponent tutors={results} />
                        </div>
                    ) : (
                        <div className="max-w-7xl mx-auto p-8 md:p-12 lg:p-16 space-y-10">
                            {loading ? (
                                <div className="grid grid-cols-1 gap-10">
                                    {[1, 2, 3].map(i => <SkeletonLoader key={i} />) }
                                </div>
                            ) : error ? (
                                <div className="bg-red-500/5 border border-red-500/10 p-24 rounded-[4rem] text-center backdrop-blur-md relative overflow-hidden group">
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-80 bg-red-500/5 rounded-full blur-[100px] animate-pulse"></div>
                                    <WifiOff size={64} className="text-red-500/40 mx-auto mb-10 group-hover:scale-110 transition-transform" strokeWidth={1} />
                                    <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-4">Signal Terminal Offline</h2>
                                    <p className="text-white/20 mb-12 max-w-sm mx-auto font-black text-[11px] uppercase tracking-[0.3em] leading-loose leading-relaxed italic">{error}</p>
                                    <button onClick={fetchResults} className="px-12 py-6 bg-red-600 text-white font-black rounded-3xl hover:bg-white hover:text-red-600 transition-all shadow-2xl active:scale-95 text-[11px] tracking-widest uppercase italic">RE-INITIALIZE_LINK</button>
                                </div>
                            ) : results.length > 0 ? (
                                <div className="grid grid-cols-1 gap-10">
                                    {results.map((item, idx) => (
                                        <div key={idx} className="group bg-surface-dark/40 border border-border-dark rounded-[4rem] p-10 md:p-12 flex flex-col lg:flex-row gap-12 transition-all duration-700 relative overflow-hidden border-b-[12px] hover:border-indigo-500/30 shadow-2xl hover:shadow-indigo-500/5 anim-fade-up" style={{ animationDelay: `${idx * 100}ms` }}>
                                            
                                            {/* Tactical Badge Branding */}
                                            {item.role === 'INSTITUTE' ? (
                                                <div className="absolute top-0 right-0 px-10 py-3 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-[0.4em] rounded-bl-[2rem] shadow-2xl z-10 italic">
                                                    CORPORATE_COMMAND_SYNC
                                                </div>
                                            ) : item.subscriptionTier !== 'FREE' && (
                                                <div className="absolute top-0 right-0 px-10 py-3 bg-amber-500 text-black text-[10px] font-black uppercase tracking-[0.4em] rounded-bl-[2rem] shadow-2xl z-10 italic">
                                                    ELITE_FACULTY_NODE
                                                </div>
                                            )}

                                            {/* Profile Visualization Section */}
                                            <div className="lg:w-64 shrink-0 flex flex-col items-center">
                                                <div className="size-32 md:size-44 rounded-[2.5rem] shrink-0 overflow-hidden relative shadow-2xl border-4 border-white/5 bg-background-dark flex items-center justify-center mb-8 transition-all group-hover:scale-105 group-hover:rotate-2 group-hover:border-indigo-500/40">
                                                    {item.role === 'INSTITUTE' ? <Building2 size={64} className="text-indigo-500/40 group-hover:text-indigo-500 transition-colors" /> : <User size={80} className="text-white/5 group-hover:text-white/10 transition-colors" />}
                                                    {item.isVerified && (
                                                        <div className="absolute -bottom-1 -right-1 size-10 rounded-2xl bg-indigo-600 border-4 border-background-dark flex items-center justify-center text-white shadow-xl">
                                                            <ShieldCheck size={20} strokeWidth={3} />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex flex-col items-center gap-2">
                                                    <div className="flex items-center gap-1.5 text-amber-500">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star 
                                                                key={i} 
                                                                size={14} 
                                                                fill={i < Math.floor(item.rating || 4.5) ? "currentColor" : "none"} 
                                                                className={i < Math.floor(item.rating || 4.5) ? "" : "text-white/10"}
                                                            />
                                                        ))}
                                                        <span className="text-[12px] font-black text-white ml-2 italic">{(item.rating || 4.5).toFixed(1)}</span>
                                                    </div>
                                                    <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em] italic">{item.reviewCount || '12'} FEEDBACK_LOOPS</p>
                                                </div>
                                            </div>

                                            {/* Intelligence Data Grid */}
                                            <div className="flex-1 flex flex-col">
                                                <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-10">
                                                    <div className="space-y-4">
                                                        <h3 className="text-4xl md:text-5xl font-black text-white group-hover:text-indigo-500 transition-colors tracking-tighter uppercase italic leading-none">
                                                            {item.role === "INSTITUTE" ? item.name : item.name}
                                                        </h3>
                                                        <div className="flex flex-wrap gap-4">
                                                            <span className="flex items-center gap-3 px-6 py-2.5 bg-indigo-500/10 text-indigo-500 rounded-xl text-[10px] font-black uppercase tracking-widest border border-indigo-500/20 italic">
                                                                <GraduationCap size={16} strokeWidth={3} /> {item.subject || 'ACADEMICS'}
                                                            </span>
                                                            <span className="flex items-center gap-3 px-6 py-2.5 bg-white/5 text-white/40 rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/5 italic">
                                                                <MapPin size={16} className="text-indigo-500" /> {item.location || 'REMOTE'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="md:text-right bg-background-dark/80 px-10 py-8 rounded-[2.5rem] border border-border-dark italic shadow-inner group-hover:border-indigo-500/20 transition-all flex flex-col items-center md:items-end min-w-[200px]">
                                                        <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.5em] mb-4">Output Rate</p>
                                                        <p className="text-4xl font-black text-indigo-500 tracking-tighter">₹{item.rate || '500'}<span className="text-[10px] text-white/20 ml-2 uppercase tracking-widest">/SYNC_SESSION</span></p>
                                                    </div>
                                                </div>
                                                
                                                <div className="grid grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
                                                    <div className="space-y-3">
                                                        <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.5em] italic">Operational_Exp</p>
                                                        <div className="flex items-center gap-3">
                                                            <div className="p-3 bg-white/5 rounded-xl text-indigo-500"><Briefcase size={16} strokeWidth={3}/></div>
                                                            <p className="text-white font-black text-sm uppercase italic tracking-tighter leading-none">{item.experience || '5+'} Years</p>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-3">
                                                        <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.5em] italic">Capacity_Status</p>
                                                        <div className="flex items-center gap-3">
                                                            <div className="p-3 bg-white/5 rounded-xl text-emerald-500"><Users size={16} strokeWidth={3}/></div>
                                                            <p className="text-emerald-500 font-black text-sm uppercase italic tracking-tighter leading-none">
                                                                {item.listingType === 'GROUP' ? `${item.enrolledCount}/${item.maxSeats} SEATS` : 'INDIVIDUAL_PROTOCOL'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-3">
                                                        <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.5em] italic">Delivery_Mode</p>
                                                        <div className="flex items-center gap-3">
                                                            <div className="p-3 bg-white/5 rounded-xl text-amber-500"><Monitor size={16} strokeWidth={3}/></div>
                                                            <p className="text-white font-black text-sm uppercase italic tracking-tighter leading-none">HYBRID_NEURAL</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <p className="text-white/40 text-lg leading-relaxed mb-12 line-clamp-2 italic font-medium px-4 border-l-4 border-indigo-500/20">
                                                    "{item.bio || 'Maintaining professional pedagogical standards through rigorous discovery and academic execution.'}"
                                                </p>
                                                
                                                <div className="mt-auto flex flex-col sm:flex-row items-center gap-6">
                                                    <button 
                                                        onClick={() => handleContactTutor(item)}
                                                        className="w-full lg:w-auto px-12 py-6 bg-white text-background-dark rounded-[2rem] text-xs font-black uppercase tracking-[0.3em] hover:bg-indigo-600 hover:text-white active:scale-95 transition-all flex items-center justify-center gap-4 shadow-2xl shadow-indigo-600/10 group/btn italic"
                                                    >
                                                        <div className="size-8 bg-black/10 rounded-xl flex items-center justify-center group-hover/btn:bg-white/20"><Lock size={14} className="group-hover/btn:text-white" strokeWidth={3} /></div>
                                                        Sync Contact Data
                                                        <ArrowRight size={18} strokeWidth={3} className="group-hover/btn:translate-x-2 transition-transform" />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Visual Decorator */}
                                            <div className="absolute -bottom-24 -right-24 size-[500px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none group-hover:bg-indigo-500/10 transition-all duration-1000"></div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-40 text-center bg-surface-dark/20 rounded-[5rem] border-4 border-dashed border-border-dark p-20 animate-in fade-in zoom-in duration-1000">
                                    <div className="size-48 rounded-[3.5rem] bg-indigo-500/5 border border-indigo-500/10 flex items-center justify-center mb-12 relative">
                                        <div className="absolute inset-0 bg-indigo-500/10 rounded-full blur-3xl animate-pulse"></div>
                                        <Search size={80} className="text-indigo-500/40 relative z-10" strokeWidth={1} />
                                    </div>
                                    <h2 className="text-5xl font-black text-white mb-6 tracking-tighter uppercase italic">Signal Void Detected</h2>
                                    <p className="text-white/20 max-w-md mb-16 font-black text-[12px] uppercase tracking-[0.4em] leading-relaxed italic">The Discovery Scan returned zero active nodes at these coordinates. Recalibrate the filter matrix.</p>
                                    <button 
                                        onClick={() => { setGrade(""); setMaxRate(10000); setVerifiedOnly(false); setGender(""); setExperience(""); setTeachingMode(""); setBoard(""); setListingType("ALL"); }} 
                                        className="px-12 py-6 bg-indigo-600 text-white rounded-[2rem] font-black hover:bg-white hover:text-indigo-600 transition-all shadow-2xl shadow-indigo-600/20 active:scale-95 text-xs tracking-widest uppercase italic"
                                    >
                                        RE-INITIALIZE_SCAN
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
            <div className="h-screen w-full flex flex-col items-center justify-center bg-background-dark font-sans overflow-hidden">
                <div className="relative">
                    <div className="size-24 border-8 border-indigo-500/10 border-t-indigo-600 rounded-[2.5rem] animate-spin-slow shadow-[0_0_50px_rgba(79,70,229,0.2)]"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                         <div className="size-10 bg-indigo-600/20 rounded-xl animate-pulse"></div>
                    </div>
                </div>
                <div className="text-[11px] font-black text-indigo-500 mt-12 tracking-[1em] uppercase animate-pulse italic">Establishing Link...</div>
            </div>
        }>
            <SearchResultsContent />
        </Suspense>
    );
}
