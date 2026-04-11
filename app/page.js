"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
    Search, 
    Layers, 
    MapPin, 
    ChevronDown, 
    Star, 
    ShieldCheck, 
    MessageSquare, 
    ArrowRight, 
    Navigation,
    Rocket,
    CheckCircle2,
    Lock,
    Zap,
    GraduationCap,
    School,
    Activity,
    Code,
    Music,
    Globe,
    Calculator,
    Atom
} from "lucide-react";
import { SUBJECT_CATEGORIES, ALL_SUBJECTS, POPULAR_SUBJECTS } from "../lib/subjects";

export default function Home() {
    const LOCAL_SUBJECTS = ALL_SUBJECTS;
    const [searchSubject, setSearchSubject] = useState("");
    const [searchGrade, setSearchGrade] = useState("");
    const [searchLocation, setSearchLocation] = useState("");
    const [searchCoords, setSearchCoords] = useState(null); 
    const [isDetecting, setIsDetecting] = useState(false);
    
    const [subjects, setSubjects] = useState(LOCAL_SUBJECTS);
    const [filteredSubjects, setFilteredSubjects] = useState([]);
    const [showSubjectSuggestions, setShowSubjectSuggestions] = useState(false);
    
    const [showCityDropdown, setShowCityDropdown] = useState(false);
    const [showGradeDropdown, setShowGradeDropdown] = useState(false);
    const [activeTab, setActiveTab] = useState("TUTOR");

    const majorCities = [
        { name: "Mumbai", lat: 19.0760, lng: 72.8777 },
        { name: "Delhi", lat: 28.6139, lng: 77.2090 },
        { name: "Bangalore", lat: 12.9716, lng: 77.5946 },
        { name: "Kolkata", lat: 22.5726, lng: 88.3639 },
        { name: "Hyderabad", lat: 17.3850, lng: 78.4867 },
        { name: "Chennai", lat: 13.0827, lng: 80.2707 }
    ];

    const gradesList = [
        "Primary (1-5)", "Middle (6-8)", "High School (9-10)", 
        "Higher Secondary (11-12)", "Competitive Exams"
    ];

    const router = useRouter();

    useEffect(() => {
        if (searchSubject.length >= 1) {
            const query = searchSubject.toLowerCase().trim();
            const filtered = subjects.filter(s => s.toLowerCase().includes(query));
            setFilteredSubjects(filtered);
            setShowSubjectSuggestions(filtered.length > 0);
        } else {
            setShowSubjectSuggestions(false);
        }
    }, [searchSubject, subjects]);

    const handleSearch = () => {
        const params = new URLSearchParams();
        params.set("subject", searchSubject);
        params.set("grade", searchGrade);
        params.set("role", activeTab);
        if (searchLocation) params.set("location", searchLocation);
        router.push(`/search?${params.toString()}`);
    };

    return (
        <div className="bg-white text-gray-800 antialiased font-sans transition-all duration-700">
            {/* HERO SECTION - REFINED MODERN TABBED INTERFACE */}
            <section className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-32">
                <div 
                    className="absolute inset-0 z-0 bg-cover bg-center"
                    style={{ backgroundImage: "url('/indian_hero.png')" }}
                >
                    <div className="absolute inset-0 bg-gradient-to-b from-gray-900/90 via-gray-900/70 to-gray-900/95"></div>
                </div>

                <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center px-4">
                    <div className="mb-12 text-center space-y-8">
                        <span className="bg-blue-600 text-white text-[10px] font-black px-5 py-2.5 rounded-full uppercase tracking-[0.4em] inline-block shadow-xl shadow-blue-600/20">
                            India's Trusted Academic Matchmaker
                        </span>
                        <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter uppercase italic leading-[0.9]">
                            What are you <br />
                            <span className="text-blue-500 font-serif lowercase tracking-normal not-italic px-4 underline decoration-blue-500/20">looking</span> for?
                        </h1>
                        <p className="text-gray-300 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed italic mt-8 opacity-80">
                            Architecting precision connections between verified faculty, institutions, and high-priority learning requirements.
                        </p>
                    </div>

                    {/* SEARCH INTERFACE - HARVESTED FROM LATEST REFINEMENTS */}
                    <div className="w-full max-w-4xl mx-auto shadow-[0_50px_100px_-20px_rgba(0,0,0,0.6)] rounded-[3rem] overflow-visible">
                        {/* Tabs */}
                        <div className="flex bg-white/5 backdrop-blur-3xl rounded-t-[3rem] overflow-hidden border-b border-white/10">
                            {[
                                { id: "TUTOR", label: "Find Tutors" },
                                { id: "STUDENT", label: "Find Students" },
                                { id: "INSTITUTE", label: "Find Institutes" }
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex-1 py-6 text-[10px] font-black uppercase tracking-[0.3em] transition-all relative ${
                                        activeTab === tab.id 
                                        ? "bg-white text-blue-700" 
                                        : "text-white/60 hover:bg-white/10"
                                    }`}
                                >
                                    {activeTab === tab.id && <div className="absolute top-0 left-0 w-full h-1.5 bg-blue-600"></div>}
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Search Bar */}
                        <div className="bg-white p-4 md:p-6 flex flex-col md:flex-row items-center gap-4 rounded-b-[3rem] shadow-inner relative">
                            {/* Subject field */}
                            <div className="w-full md:w-1/3 relative border-2 border-slate-50 rounded-2xl flex flex-col px-6 py-3 bg-slate-50 focus-within:bg-white focus-within:border-blue-600 focus-within:ring-8 focus-within:ring-blue-100 transition-all">
                                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1 flex items-center gap-2">
                                    <Search size={12} /> Domain / Subject
                                </span>
                                <input 
                                    className="w-full bg-transparent border-none focus:ring-0 text-gray-900 placeholder:text-gray-300 font-black text-sm uppercase outline-none" 
                                    placeholder="e.g. Mathematics" 
                                    type="text"
                                    value={searchSubject}
                                    onChange={(e) => setSearchSubject(e.target.value)}
                                />
                                {showSubjectSuggestions && (
                                    <div className="absolute top-full mt-4 left-0 w-full min-w-[280px] bg-white border border-gray-100 rounded-[2rem] shadow-4xl z-[60] py-4 overflow-hidden">
                                        {filteredSubjects.slice(0, 5).map((s, i) => (
                                            <div key={i} onMouseDown={() => {setSearchSubject(s); setShowSubjectSuggestions(false);}} className="px-8 py-3.5 hover:bg-blue-50 cursor-pointer text-left font-black text-[10px] uppercase tracking-tight text-gray-600 hover:text-blue-700 transition-colors border-b border-gray-50 last:border-none">
                                                {s}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Grade field */}
                            <div className="w-full md:w-1/4 relative border-2 border-slate-50 rounded-2xl bg-slate-50 flex flex-col cursor-pointer hover:bg-white hover:border-blue-600 transition-all" onClick={() => setShowGradeDropdown(!showGradeDropdown)}>
                                <div className="px-6 py-3">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1 flex items-center gap-2">
                                        <Layers size={12} /> Academic Level
                                    </span>
                                    <div className="flex items-center justify-between">
                                        <span className="font-black text-gray-900 text-[11px] uppercase tracking-tight truncate flex-1">{searchGrade || "Select Level"}</span>
                                        <ChevronDown size={14} className="text-gray-400" />
                                    </div>
                                </div>
                                {showGradeDropdown && (
                                    <div className="absolute top-full mt-4 left-0 w-full bg-white border border-gray-100 rounded-[2rem] shadow-4xl z-[60] py-4 overflow-hidden">
                                        {gradesList.map((g, i) => (
                                            <div key={i} onClick={() => {setSearchGrade(g); setShowGradeDropdown(false);}} className="px-8 py-3.5 hover:bg-blue-50 cursor-pointer text-left font-black text-[10px] uppercase text-gray-600 hover:text-blue-700 border-b border-gray-50 last:border-none">{g}</div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Location field */}
                            <div className="w-full md:w-1/4 relative border-2 border-slate-50 rounded-2xl bg-slate-50 flex flex-col cursor-pointer hover:bg-white hover:border-blue-600 transition-all" onClick={() => setShowCityDropdown(!showCityDropdown)}>
                                <div className="px-6 py-3">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1 flex items-center gap-2">
                                        <MapPin size={12} /> Geographic Zone
                                    </span>
                                    <div className="flex items-center justify-between">
                                        <span className="font-black text-gray-900 text-[11px] uppercase tracking-tight truncate flex-1">{searchLocation || "Select City"}</span>
                                        <ChevronDown size={14} className="text-gray-400" />
                                    </div>
                                </div>
                                {showCityDropdown && (
                                    <div className="absolute top-full mt-4 left-0 w-full bg-white border border-gray-100 rounded-[2rem] shadow-4xl z-[60] py-4 overflow-hidden">
                                        {majorCities.map((city, i) => (
                                            <div key={i} onClick={() => {setSearchLocation(city.name); setShowCityDropdown(false);}} className="px-8 py-3.5 hover:bg-blue-50 cursor-pointer text-left font-black text-[10px] uppercase text-gray-600 hover:text-blue-700 border-b border-gray-50 last:border-none flex items-center justify-between">
                                                {city.name}
                                                <Navigation size={10} className="opacity-20" />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Action Button */}
                            <button 
                                onClick={handleSearch} 
                                className="w-full md:w-auto md:ml-auto px-10 py-5 bg-blue-600 text-white rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.3em] hover:bg-gray-900 active:scale-95 transition-all shadow-xl shadow-blue-600/30 flex items-center justify-center gap-4"
                            >
                                Initiate Discovery <ArrowRight size={18} />
                            </button>
                        </div>
                    </div>

                    <div className="mt-16 flex flex-wrap justify-center gap-16 text-white/30 text-[10px] font-black uppercase tracking-[0.4em]">
                        <div className="flex items-center gap-3"><ShieldCheck size={14} className="text-blue-500" /> Verified Faculty</div>
                        <div className="flex items-center gap-3"><Star size={14} className="text-blue-500" /> Top Rated</div>
                        <div className="flex items-center gap-3"><MessageSquare size={14} className="text-blue-500" /> Direct Comms</div>
                    </div>
                </div>
            </section>

            {/* MARKETING SECTION: WORKFLOW PROTOCOL */}
            <section className="py-32 px-4 flex flex-col items-center justify-center bg-gray-50/50">
                <div className="max-w-6xl mx-auto w-full">
                    <div className="text-center mb-24">
                        <span className="text-blue-600 text-[10px] font-black uppercase tracking-[0.5em] mb-4 inline-block">Methodology</span>
                        <h2 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tighter uppercase italic">How It <span className="text-blue-600">Calculates</span></h2>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {[
                            { step: "01", title: "Discovery", desc: "Define your domain and geographic constraints for precision matching.", icon: Search },
                            { step: "02", title: "Audit", desc: "Analyze verified credentials and historical performance benchmarks.", icon: ShieldCheck },
                            { step: "03", title: "Connect", desc: "Establish direct pedagogical channels with zero hidden tolls.", icon: MessageSquare }
                        ].map((item, i) => (
                            <div key={i} className="flex flex-col items-center bg-white p-14 rounded-[4rem] shadow-sm border border-gray-100 hover:shadow-4xl transition-all group hover:-translate-y-4">
                                <div className="w-24 h-24 rounded-[2rem] bg-gray-50 text-gray-300 flex items-center justify-center mb-10 relative group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner">
                                    <item.icon size={44} strokeWidth={1} />
                                    <span className="absolute -top-4 -right-4 bg-blue-600 text-white font-black text-xs w-10 h-10 rounded-2xl flex items-center justify-center border-4 border-white shadow-xl">{item.step}</span>
                                </div>
                                <h3 className="text-2xl font-black text-gray-900 mb-6 uppercase italic tracking-tight">{item.title}</h3>
                                <p className="text-gray-500 font-medium italic leading-relaxed text-center">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* MARKETING SECTION: POPULAR CATEGORIES */}
            <section className="py-32 px-4 flex flex-col items-center justify-center bg-white">
                <div className="max-w-7xl mx-auto w-full">
                    <div className="text-center mb-24">
                        <span className="text-blue-600 text-[10px] font-black uppercase tracking-[0.5em] mb-4 inline-block">Domain Excellence</span>
                        <h2 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tighter uppercase italic">Master Any <span className="text-blue-600">Subject</span></h2>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {POPULAR_SUBJECTS.map((cat, i) => (
                            <Link key={i} href={`/search?subject=${encodeURIComponent(cat.title)}&role=TUTOR`} className="bg-white p-10 rounded-[3.5rem] border border-gray-100 shadow-sm hover:shadow-4xl cursor-pointer flex flex-col items-center justify-center text-center group transition-all hover:scale-105">
                                <div className="text-blue-600 mb-8 bg-blue-50 p-6 rounded-[2rem] group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner">
                                    <cat.icon size={36} strokeWidth={1.5} />
                                </div>
                                <h3 className="font-black text-gray-900 text-lg tracking-tighter italic uppercase">{cat.title}</h3>
                                <p className="text-[10px] font-black text-blue-500/20 uppercase mt-2 tracking-widest group-hover:text-blue-600 transition-colors">Elite Match</p>
                            </Link>
                        ))}
                    </div>

                    <div className="mt-20 flex justify-center">
                        <Link href="/subjects" className="px-12 py-5 bg-gray-900 text-white rounded-[2rem] font-black text-[10px] uppercase tracking-[0.4em] hover:bg-blue-600 transition-all shadow-2xl shadow-gray-900/10 flex items-center gap-4">
                            Expose All Verticles <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* MARKETING SECTION: STATISTICS */}
            <section className="py-32 bg-gray-900 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-600/5 blur-[120px] rounded-full"></div>
                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-12 lg:gap-24">
                        {[
                            { value: "450k+", label: "Verified Faculty", icon: GraduationCap },
                            { value: "1.2M", label: "Learning Match", icon: Zap },
                            { value: "50+", label: "Academic Hubs", icon: MapPin },
                            { value: "100%", label: "Direct Comms", icon: MessageSquare }
                        ].map((stat, i) => (
                            <div key={i} className="space-y-4">
                                <div className="size-16 rounded-2xl bg-white/5 mx-auto flex items-center justify-center text-blue-500 mb-6">
                                    <stat.icon size={32} strokeWidth={1} />
                                </div>
                                <div className="text-4xl md:text-6xl font-black text-white italic tracking-tighter">{stat.value}</div>
                                <div className="text-[10px] font-black text-gray-500 uppercase tracking-[0.5em]">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* MARKETING SECTION: FAQ ACCORDION */}
            <section className="py-32 bg-white">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="text-center mb-24">
                        <span className="text-blue-600 text-[10px] font-black uppercase tracking-[0.5em] mb-4 inline-block">Inquiry Hub</span>
                        <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter uppercase italic">Common <span className="text-blue-600">Questions</span></h2>
                    </div>

                    <div className="space-y-6">
                        {[
                            { q: "How do I define my requirements?", a: "Simply use our segmented search interface. Define your subject, academic level, and location to immediately pulse our 450k+ faculty database." },
                            { q: "Is there a toll on matching?", a: "No. Our matchmaking engine connects you directly. We do not participate in your financial transactions or academic tolls." },
                            { q: "How are faculty credentials audited?", a: "Our system multi-stages verification including ID authentication and academic history validation for all elite listings." }
                        ].map((item, i) => (
                            <details key={i} className="group bg-gray-50 rounded-[2.5rem] border border-gray-100 open:bg-white open:shadow-4xl transition-all duration-300">
                                <summary className="flex items-center justify-between p-8 md:p-10 cursor-pointer list-none">
                                    <span className="text-lg font-black text-gray-900 uppercase italic tracking-tight">{item.q}</span>
                                    <ChevronDown size={24} className="text-blue-600 transition-transform group-open:rotate-180" />
                                </summary>
                                <div className="px-10 pb-10 text-gray-500 font-medium italic leading-relaxed text-lg">
                                    {item.a}
                                </div>
                            </details>
                        ))}
                    </div>
                </div>
            </section>

            {/* MARKETING SECTION: CTA */}
            <section className="py-32 px-4 flex flex-col items-center justify-center bg-gray-900 text-white relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-blue-600/5 blur-[120px] rounded-full -z-0"></div>
                <div className="max-w-4xl mx-auto w-full relative z-10 text-center">
                    <div className="size-24 rounded-[2.5rem] bg-blue-600 text-white flex items-center justify-center mx-auto mb-12 shadow-2xl shadow-blue-600/40 animate-pulse">
                        <Rocket size={48} strokeWidth={1} />
                    </div>
                    <h2 className="text-5xl md:text-8xl font-black text-white tracking-tighter uppercase italic mb-10 leading-[0.9]">
                        Deploy your <br />
                        <span className="text-blue-500 font-serif lowercase tracking-normal not-italic px-4 underline decoration-blue-500/20">academic</span> legacy.
                    </h2>
                    <p className="text-xl text-gray-400 font-medium mb-16 italic max-w-2xl mx-auto leading-relaxed opacity-70">
                        Join India's most advanced educator matching network. Optimize your strategy; scale your legacy with institutional-grade precision.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row justify-center gap-8">
                        <Link href="/register?role=TUTOR" className="px-14 py-7 bg-blue-600 text-white rounded-[2rem] font-black text-[10px] uppercase tracking-[0.4em] shadow-4xl shadow-blue-600/40 hover:bg-white hover:text-gray-900 transition-all active:scale-95 leading-none h-[80px] flex items-center justify-center">
                            Register as Tutor
                        </Link>
                        <Link href="/register?role=STUDENT" className="px-14 py-7 bg-transparent border-2 border-white/20 text-white rounded-[2rem] font-black text-[10px] uppercase tracking-[0.4em] hover:bg-white/5 transition-all active:scale-95 leading-none h-[80px] flex items-center justify-center">
                            Find Verified Faculty
                        </Link>
                    </div>

                    <div className="mt-24 flex items-center justify-center gap-3 text-[10px] font-black text-gray-700 uppercase tracking-[0.6em]">
                        <Lock size={14} strokeWidth={3} className="text-blue-500" /> Standard Security Protocols Active
                    </div>
                </div>
            </section>

            {/* INLINE FOOTER - RESTORED PREMIUM COMPACT VERSION */}
            <footer className="bg-white border-t border-gray-100 py-16">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-12 pb-12 border-b border-gray-50">
                        <div className="flex flex-col md:flex-row items-center gap-10 text-center md:text-left">
                            <Link href="/">
                                <img src="/logo_minimal.png" alt="Branding" className="h-12 w-auto grayscale contrast-125" />
                            </Link>
                            <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.3em] max-w-xs leading-relaxed">
                                India's most advanced pedagogical matchmaking infrastructure. Precision matching for an elite academic legacy.
                            </p>
                        </div>
                        <nav className="flex flex-wrap justify-center gap-x-10 gap-y-4">
                            {["Find Tutors", "Student Leads", "Methodology", "Pricing", "Privacy"].map((link, i) => (
                                <Link key={i} href="/" className="text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-blue-600 transition-colors">{link}</Link>
                            ))}
                        </nav>
                    </div>
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-12">
                        <p className="text-gray-300 text-[9px] font-black uppercase tracking-[0.4em]">© 2026 TuitionsInIndia. Industrial Grade Integrity.</p>
                        <div className="flex items-center gap-4 opacity-30 grayscale saturate-0">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/Razorpay_logo.svg" alt="Payments" className="h-4" />
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
