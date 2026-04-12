"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
    Search, 
    MapPin, 
    ChevronDown, 
    Star, 
    ShieldCheck, 
    ArrowRight, 
    Filter,
    Layout,
    List,
    Map as MapIcon,
    X,
    Target,
    Layers,
    Activity,
    Zap,
    Users,
    ChevronRight,
    SearchCheck,
    Lock,
    GraduationCap,
    Building2,
    Monitor,
    Globe,
    User
} from "lucide-react";
import MapComponent from "../components/MapComponent";
import Header from "../components/Header";
import OmniSearch from "../components/OmniSearch";
import MatchBadge from "../components/MatchBadge";
import SkeletonLoader from "../components/SkeletonLoader";

function SearchContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    
    const [viewMode, setViewMode] = useState("split"); // split, list, map
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Core parameters from URL
    const subject = searchParams.get("subject") || "";
    const locationParam = searchParams.get("location") || "";
    const gradeParam = searchParams.get("grade") || "";
    const role = searchParams.get("role") || "TUTOR";

    // Side-bar Filter states
    const [grade, setGrade] = useState(gradeParam);
    const [maxRate, setMaxRate] = useState(10000);
    const [verifiedOnly, setVerifiedOnly] = useState(false);
    const [gender, setGender] = useState("");
    const [experience, setExperience] = useState("");
    const [teachingMode, setTeachingMode] = useState("");
    const [board, setBoard] = useState("");
    const [listingType, setListingType] = useState(role); 

    // Sync filters with URL on first load
    useEffect(() => {
        setGrade(gradeParam);
        setListingType(role);
    }, [gradeParam, role]);

    const fetchResults = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (subject) params.set("subject", subject);
            if (locationParam) params.set("location", locationParam);
            if (grade) params.set("grade", grade);
            params.set("role", listingType);
            params.set("maxRate", maxRate);
            if (gender) params.set("gender", gender);
            if (experience) params.set("experience", experience);
            if (teachingMode) params.set("teachingMode", teachingMode);
            if (board) params.set("board", board);

            const res = await fetch(`/api/search/tutors?${params.toString()}`);
            const data = await res.json();
            
            if (Array.isArray(data)) {
                setResults(data);
            } else {
                setResults([]);
            }
        } catch (error) {
            console.error("Discovery Pulse Failure:", error);
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    // Refetch when filters change
    useEffect(() => {
        fetchResults();
    }, [subject, locationParam, grade, listingType, maxRate, teachingMode, board, gender]);

    const resetFilters = () => {
        setGrade("");
        setMaxRate(10000);
        setVerifiedOnly(false);
        setGender("");
        setExperience("");
        setTeachingMode("");
        setBoard("");
        setListingType("TUTOR");
        // Clear URL as well
        router.push("/search?role=TUTOR");
    };

    return (
        <div className="flex flex-col h-screen bg-slate-50 pt-[70px] font-sans antialiased overflow-hidden selection:bg-blue-600/10 selection:text-blue-600">
            <Header />

            {/* TOP COMMAND BAR - INTEGRATED OMNISEARCH */}
            <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-20 shrink-0 gap-8">
                <div className="flex-1 max-w-2xl">
                    <OmniSearch 
                        initialSubject={subject} 
                        initialGrade={gradeParam} 
                        initialLocation={locationParam} 
                        initialRole={role}
                        variant="compact"
                    />
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center bg-gray-50 p-1.5 rounded-[1.25rem] border border-gray-100">
                        <button onClick={() => setViewMode("list")} className={`p-4 rounded-xl transition-all ${viewMode === "list" ? 'bg-white text-blue-600 shadow-xl' : 'text-gray-400 hover:text-gray-900'}`}><List size={22}/></button>
                        <button onClick={() => setViewMode("split")} className={`p-4 rounded-xl transition-all ${viewMode === "split" ? 'bg-white text-blue-600 shadow-xl' : 'text-gray-400 hover:text-gray-900'}`}><Layout size={22}/></button>
                        <button onClick={() => setViewMode("map")} className={`p-4 rounded-xl transition-all ${viewMode === "map" ? 'bg-white text-blue-600 shadow-xl' : 'text-gray-400 hover:text-gray-900'}`}><MapIcon size={22}/></button>
                    </div>
                    <Link href="/register?role=STUDENT" className="bg-blue-600 text-white px-8 py-5 rounded-[1.25rem] font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-600/20 hover:bg-gray-900 transition-all flex items-center gap-3 active:scale-95 italic">
                        Find Tutors <ArrowRight size={16} />
                    </Link>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden relative">
                {/* FILTER MATRIX SIDEBAR */}
                <aside className="w-80 bg-white border-r border-gray-200 flex flex-col hidden lg:flex relative z-10 shadow-2xl shadow-black/[0.02]">
                    <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
                        <div className="flex items-center gap-4">
                            <Target size={22} className="text-blue-600" />
                            <h2 className="font-black text-sm uppercase tracking-[0.2em] italic text-gray-900">Filters</h2>
                        </div>
                        <button 
                            onClick={resetFilters}
                            className="text-xs font-black text-blue-600/40 uppercase hover:text-blue-600 transition-colors"
                        >
                            Reset
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-8 space-y-12 pb-32 custom-scrollbar">
                        {/* Listing Type */}
                        <div className="space-y-6">
                            <label className="text-[10px] font-black text-gray-300 uppercase tracking-[0.4em] italic">Listing Type</label>
                            <div className="grid grid-cols-1 gap-3">
                                {[
                                    { id: "TUTOR", label: "Tutors", icon: GraduationCap },
                                    { id: "STUDENT", label: "Requirement Stream", icon: Users },
                                    { id: "INSTITUTE", label: "Academy Hubs", icon: Building2 }
                                ].map(t => (
                                    <button 
                                        key={t.id} 
                                        onClick={() => setListingType(t.id)}
                                        className={`flex items-center gap-4 p-5 rounded-2xl border text-[10px] font-black uppercase tracking-[0.2em] transition-all relative overflow-hidden ${listingType === t.id ? 'bg-blue-600 text-white border-blue-600 shadow-xl italic' : 'bg-gray-50/50 text-gray-400 border-gray-100 hover:bg-white hover:border-blue-600/30'}`}
                                    >
                                        <t.icon size={18} strokeWidth={listingType === t.id ? 3 : 2} /> {t.label}
                                        {listingType === t.id && <div className="absolute right-4 size-1.5 bg-white rounded-full animate-pulse"></div>}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Grade Level */}
                        <div className="space-y-6">
                            <label className="text-[10px] font-black text-gray-300 uppercase tracking-[0.4em] italic">Academic level</label>
                            <select 
                                value={grade} 
                                onChange={(e) => setGrade(e.target.value)}
                                className="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl p-5 text-[11px] font-black outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600/30 focus:bg-white uppercase tracking-widest italic transition-all"
                            >
                                <option value="">Global Network</option>
                                <option value="Primary (1-5)">Primary (1-5)</option>
                                <option value="Middle (6-8)">Middle (6-8)</option>
                                <option value="High School (9-10)">High School (9-10)</option>
                                <option value="Higher Secondary (11-12)">Higher Sec (11-12)</option>
                                <option value="College">College / Uni</option>
                                <option value="Competitive Exams">Competitive Exams</option>
                            </select>
                        </div>

                        {/* Budget Range */}
                        <div className="space-y-6">
                            <div className="flex justify-between items-center px-1">
                                <label className="text-[10px] font-black text-gray-300 uppercase tracking-[0.4em] italic">Budget Index</label>
                                <span className="text-sm font-black text-blue-600 italic">₹{maxRate}/hr</span>
                            </div>
                            <input 
                                type="range" min="0" max="5000" step="100" 
                                value={maxRate} onChange={(e) => setMaxRate(parseInt(e.target.value))}
                                className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                            />
                        </div>

                        {/* Teaching Mode */}
                        <div className="space-y-6">
                            <label className="text-[10px] font-black text-gray-300 uppercase tracking-[0.4em] italic">Instructional Mode</label>
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { id: "ONLINE", label: "Digital", icon: Monitor },
                                    { id: "OFFLINE", label: "Local", icon: MapPin }
                                ].map(m => (
                                    <button 
                                        key={m.id} 
                                        onClick={() => setTeachingMode(teachingMode === m.id ? "" : m.id)}
                                        className={`flex flex-col items-center justify-center p-6 rounded-2xl border text-[9px] font-black uppercase gap-4 transition-all tracking-widest ${teachingMode === m.id ? 'bg-blue-600 text-white border-blue-600 shadow-md italic' : 'bg-gray-50 text-gray-400 hover:bg-white border-gray-100'}`}
                                    >
                                        <m.icon size={20} /> {m.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Verification Toggle */}
                        <div className="pt-6">
                            <button 
                                onClick={() => setVerifiedOnly(!verifiedOnly)}
                                className={`w-full flex items-center justify-between p-6 rounded-[1.8rem] border transition-all ${verifiedOnly ? 'bg-blue-50 border-blue-200 text-blue-700 shadow-inner' : 'bg-gray-50 border-gray-100 text-gray-400'}`}
                            >
                                <div className="flex items-center gap-4">
                                    <ShieldCheck size={20} className={verifiedOnly ? 'text-blue-600' : 'text-gray-200'} strokeWidth={3} />
                                    <span className="text-[10px] font-black uppercase tracking-widest italic">Audit Only</span>
                                </div>
                                <div className={`w-10 h-5 rounded-full relative transition-all ${verifiedOnly ? 'bg-blue-600' : 'bg-gray-200'}`}>
                                    <div className={`absolute top-1 size-3 bg-white rounded-full transition-all ${verifiedOnly ? 'left-6' : 'left-1'}`}></div>
                                </div>
                            </button>
                        </div>
                    </div>
                </aside>

                {/* RESULTS MAIN AREA */}
                <main className="flex-1 flex flex-col bg-white overflow-hidden relative z-0">
                    {/* Active HUD Metrics */}
                    <div className="px-10 py-6 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
                        <div className="flex items-center gap-4">
                            <div className="px-5 py-2.5 bg-gray-50 rounded-xl text-[10px] font-black text-gray-400 uppercase tracking-widest border border-gray-100 italic">
                                Found {results.length} Active Node Matches
                            </div>
                        </div>
                        <div className="flex items-center gap-6">
                            <span className="text-[10px] font-black text-gray-200 uppercase tracking-[0.4em] italic">Cluster Priority:</span>
                            <select className="bg-transparent border-none text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] outline-none cursor-pointer italic">
                                <option>Neural Relevance</option>
                                <option>Budget: Minimal First</option>
                                <option>Pulse Ranking</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-10 space-y-6 custom-scrollbar bg-slate-50/30 pb-32">
                        {loading ? (
                            <div className="space-y-8 py-10">
                                {[1,2,3].map(i => <SkeletonLoader key={i} />)}
                            </div>
                        ) : results.length > 0 ? (
                            results.map((item, i) => (
                                <div key={i} className="group bg-white p-8 md:p-10 rounded-[3rem] border border-gray-100 hover:border-blue-600/20 hover:shadow-4xl transition-all flex flex-col md:flex-row gap-10 cursor-pointer relative overflow-hidden active:scale-[0.99] animate-in fade-in duration-500">
                                    <div className="absolute top-0 left-0 w-2 h-full bg-blue-600 opacity-0 group-hover:opacity-100 transition-all"></div>
                                    
                                    {/* Tutor Card */}
                                    <div className="size-36 md:size-44 bg-gray-50 rounded-[2.5rem] border border-gray-50 overflow-hidden shrink-0 relative group-hover:border-blue-600/10 transition-all shadow-inner">
                                        <div className="absolute inset-0 bg-gradient-to-tr from-gray-900/5 to-transparent"></div>
                                        <div className="w-full h-full flex items-center justify-center text-gray-200 group-hover:text-blue-100 transition-all">
                                            {item.image ? (
                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                            ) : (
                                                item.isInstitute ? <Building2 size={72} strokeWidth={1} /> : <User size={72} strokeWidth={1} />
                                            )}
                                        </div>
                                        <div className="absolute bottom-4 right-4">
                                            <MatchBadge score={item.matchScore || 85} />
                                        </div>
                                    </div>

                                    {/* Intelligence Metadata */}
                                    <div className="flex-1 space-y-6">
                                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                                            <div>
                                                <div className="flex items-center gap-3 mb-4">
                                                    <span className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-[9px] font-black uppercase tracking-[0.2em] border border-blue-100 italic">{listingType === 'STUDENT' ? 'REQUIREMENT' : item.isInstitute ? 'INSTITUTE' : 'FACULTY'}</span>
                                                    {item.isVerified && <span className="px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg text-[9px] font-black uppercase tracking-[0.2em] border border-emerald-100 italic flex items-center gap-1.5"><ShieldCheck size={12} strokeWidth={3} /> VERIFIED</span>}
                                                </div>
                                                <h3 className="text-3xl font-black text-gray-900 group-hover:text-blue-600 transition-colors uppercase italic tracking-tighter leading-none mb-6">{item.name}</h3>
                                                <div className="flex flex-wrap items-center gap-x-8 gap-y-3 text-[11px] font-black text-gray-400 uppercase tracking-widest italic">
                                                    <span className="flex items-center gap-2 text-blue-600/60"><Activity size={16} /> {item.subjects?.slice(0, 2).join(", ") || "Multiple Domains"}</span>
                                                    <span className="flex items-center gap-2"><MapPin size={16} /> {item.location}</span>
                                                    <span className="flex items-center gap-2"><Layers size={16} /> {item.grades?.[0] || "Global Level"}</span>
                                                </div>
                                            </div>
                                            <div className="text-left md:text-right space-y-1">
                                                <p className="text-4xl font-black text-gray-900 group-hover:text-blue-600 transition-colors italic tracking-tighter leading-none">₹{item.rate}<span className="text-[10px] text-gray-300 ml-1 tracking-widest">/HR</span></p>
                                                <p className="text-[9px] font-black text-gray-200 uppercase italic tracking-[0.3em]">Institutional Billing</p>
                                            </div>
                                        </div>

                                        <p className="text-gray-400 text-sm font-medium italic line-clamp-2 leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">
                                            {item.bio || "Professional educator available for tuition."}
                                        </p>

                                        <div className="flex flex-wrap items-center gap-5 pt-4">
                                            <div className="flex items-center gap-2 bg-gray-50/50 px-5 py-2.5 rounded-xl border border-gray-100">
                                                <Star size={14} className="text-blue-600 fill-blue-600" />
                                                <span className="text-[10px] font-black text-gray-900 italic">{item.rating || "5.0"}</span>
                                            </div>
                                            <div className="flex items-center gap-2 bg-gray-50/50 px-5 py-2.5 rounded-xl border border-gray-100">
                                                <Zap size={14} className="text-blue-600" />
                                                <span className="text-[10px] font-black text-gray-900 uppercase italic">{item.experience || "5Y+"} Tenure</span>
                                            </div>
                                            {item.boards?.length > 0 && (
                                                <div className="flex items-center gap-2 bg-gray-50/50 px-5 py-2.5 rounded-xl border border-gray-100">
                                                    <Globe size={14} className="text-blue-600" />
                                                    <span className="text-[10px] font-black text-gray-900 uppercase italic">{item.boards[0]} Board</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Tactical Action */}
                                    <div className="flex md:flex-col justify-end gap-3 shrink-0 pt-6 md:pt-0">
                                        <Link href={`/${item.isInstitute ? 'institute' : 'tutor'}/${item.id}`} className="flex-1 md:flex-none px-12 py-6 bg-gray-900 text-white rounded-[1.8rem] text-[10px] font-black uppercase tracking-[0.3em] hover:bg-blue-600 transition-all flex items-center justify-center gap-4 italic active:scale-95 shadow-2xl shadow-black/5">
                                            Get Started <ArrowRight size={16} strokeWidth={3} />
                                        </Link>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-center space-y-10 opacity-60 py-40 italic">
                                <SearchCheck size={100} strokeWidth={1} className="text-gray-200" />
                                <div className="space-y-4">
                                    <h3 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">Zero Matches Authenticated</h3>
                                    <p className="text-[10px] font-black uppercase tracking-[0.5em]">Adjust filters or re-calibrate Discovery Pulse</p>
                                </div>
                                <button onClick={resetFilters} className="mt-8 px-16 py-7 bg-gray-900 text-white rounded-[2rem] font-black text-[10px] uppercase tracking-[0.4em] italic shadow-2xl active:scale-95 transition-all">Purge All Filters</button>
                            </div>
                        )}
                    </div>
                </main>

                {/* GEOSPATIAL RADAR (MAP) */}
                {viewMode !== "list" && (
                    <aside className="hidden lg:block w-[450px] xl:w-[650px] bg-gray-50 border-l border-gray-100 relative shrink-0 overflow-hidden shadow-4xl shadow-black/5">
                        <MapComponent tutors={results} />
                        
                        {/* Overlay Controls */}
                        <div className="absolute top-10 left-10 flex flex-col gap-5 z-20">
                            <div className="bg-white/95 backdrop-blur-2xl p-6 rounded-[2.5rem] border border-white/50 shadow-4xl space-y-5 min-w-[240px]">
                                <div className="flex items-center gap-3 text-blue-600 border-b border-gray-50 pb-4">
                                    <Target size={20} className="animate-pulse" strokeWidth={3} />
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] italic">Neural Radar Active</span>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex justify-between text-[10px] font-black uppercase text-gray-300 italic">
                                        <span>Active Nodes</span>
                                        <span className="text-blue-600">{loading ? '...' : results.length}</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-gray-50 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-600 rounded-full transition-all duration-1000" style={{ width: loading ? '0%' : `${Math.min(results.length * 5, 100)}%` }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tactical Security Overlay */}
                        <div className="absolute bottom-10 right-10 bg-gray-900/95 backdrop-blur-2xl px-8 py-5 rounded-[2rem] border border-white/10 flex items-center gap-5 text-white shadow-4xl z-20">
                            <Lock size={18} className="text-blue-500 animate-pulse" strokeWidth={3} />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] italic leading-none">Encrypted Discovery Layer v6.2</span>
                        </div>
                    </aside>
                )}
            </div>
            
            {/* MOBILE FLOATING ACTIONS */}
            <div className="lg:hidden fixed bottom-10 left-1/2 -translate-x-1/2 flex items-center bg-gray-900/95 backdrop-blur-2xl p-3 rounded-[3rem] shadow-4xl border border-white/10 z-[100] gap-3">
                <button onClick={() => setViewMode("list")} className={`px-10 py-5 rounded-[2.5rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all italic ${viewMode === "list" ? 'bg-blue-600 text-white shadow-xl' : 'text-gray-400'}`}>Results</button>
                <button onClick={() => setViewMode("map")} className={`px-10 py-5 rounded-[2.5rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all italic ${viewMode === "map" ? 'bg-blue-600 text-white shadow-xl' : 'text-gray-400'}`}>Neural Map</button>
            </div>
        </div>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={
            <div className="flex h-screen items-center justify-center bg-white">
                <div className="text-center space-y-6">
                    <Zap size={64} className="text-blue-600 animate-pulse mx-auto" />
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600 italic">Synchronizing Discovery Node...</p>
                </div>
            </div>
        }>
            <SearchContent />
        </Suspense>
    );
}
