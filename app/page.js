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
    Quote,
    Rocket,
    CheckCircle2,
    Lock,
    Zap
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

    const detectLocation = () => {
        setIsDetecting(true);
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const { latitude, longitude } = position.coords;
                setSearchCoords({ lat: latitude, lng: longitude });
                setSearchLocation("Current Location");
                setIsDetecting(false);
            }, () => setIsDetecting(false));
        }
    };

    return (
        <div className="snap-container bg-white text-gray-800 antialiased font-sans transition-all duration-700">
            {/* HERO SECTION */}
            <section className="snap-section pt-20 px-4">
                <div 
                    className="absolute inset-0 z-0 bg-cover bg-center"
                    style={{ backgroundImage: "url('/hero-bg.png')" }}
                >
                    <div className="absolute inset-0 bg-gradient-to-b from-gray-900/90 via-gray-900/70 to-gray-900/95"></div>
                </div>

                <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center">
                    <div className="mb-10 text-center space-y-6">
                        <span className="bg-blue-600 text-white text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-[0.3em] animate-fade-in">
                            India's Trusted Academic Matchmaker
                        </span>
                        <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter uppercase italic leading-[0.9] animate-fade-in-up">
                            What are you <br />
                            <span className="text-blue-500 font-serif lowercase tracking-normal not-italic px-4 underline decoration-blue-500/20">looking</span> for?
                        </h1>
                        <p className="text-gray-300 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed italic mt-8 opacity-80">
                            Architecting precision connections between verified faculty, institutions, and high-priority learning requirements.
                        </p>
                    </div>

                    {/* SEARCH INTERFACE */}
                    <div className="w-full max-w-4xl mx-auto shadow-4xl rounded-[3rem] overflow-visible animate-fade-in-up mt-8">
                        {/* Tabs */}
                        <div className="flex bg-white/5 backdrop-blur-xl rounded-t-[3rem] overflow-hidden border-b border-white/10">
                            {[
                                { id: "TUTOR", label: "Find Tutors" },
                                { id: "STUDENT", label: "Find Students" },
                                { id: "INSTITUTE", label: "Find Institutes" }
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex-1 py-5 text-xs font-black uppercase tracking-widest transition-all ${
                                        activeTab === tab.id 
                                        ? "bg-white text-blue-700 border-t-8 border-blue-600" 
                                        : "text-white/60 hover:bg-white/10"
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Search Bar */}
                        <div className="bg-white p-6 md:p-8 flex flex-col md:flex-row items-center gap-5 rounded-b-[3rem] shadow-inner relative">
                            <div className="w-full md:w-1/3 relative border-2 border-gray-50 rounded-2xl flex items-center px-5 py-4 bg-gray-50 focus-within:bg-white focus-within:border-blue-600 focus-within:ring-8 focus-within:ring-blue-100 transition-all">
                                <Search className="text-gray-400 mr-4" size={24} />
                                <input 
                                    className="w-full bg-transparent border-none focus:ring-0 text-gray-900 placeholder:text-gray-300 font-black text-sm uppercase outline-none" 
                                    placeholder="Domain / Subject" 
                                    type="text"
                                    value={searchSubject}
                                    onChange={(e) => setSearchSubject(e.target.value)}
                                />
                                {showSubjectSuggestions && (
                                    <div className="absolute top-full mt-4 left-0 w-full min-w-[250px] bg-white border border-gray-100 rounded-3xl shadow-4xl z-[60] py-4">
                                        {filteredSubjects.slice(0, 5).map((s, i) => (
                                            <div key={i} onMouseDown={() => {setSearchSubject(s); setShowSubjectSuggestions(false);}} className="px-8 py-3 hover:bg-blue-50 cursor-pointer text-left font-black text-xs uppercase tracking-tight text-gray-600 hover:text-blue-700 transition-colors">
                                                {s}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="w-full md:w-1/4 relative border-2 border-gray-50 rounded-2xl bg-gray-50 flex flex-col cursor-pointer hover:bg-white hover:border-blue-600 transition-all" onClick={() => setShowGradeDropdown(!showGradeDropdown)}>
                                <div className="flex items-center justify-between px-6 py-4">
                                    <Layers className="text-gray-400 mr-4" size={24} />
                                    <span className="font-black text-gray-900 text-xs uppercase tracking-tight truncate flex-1">{searchGrade || "Select Level"}</span>
                                    <ChevronDown size={20} className="text-gray-400" />
                                </div>
                                {showGradeDropdown && (
                                    <div className="absolute top-full mt-4 left-0 w-full bg-white border border-gray-100 rounded-3xl shadow-4xl z-[60] py-4">
                                        {gradesList.map((g, i) => (
                                            <div key={i} onClick={() => {setSearchGrade(g); setShowGradeDropdown(false);}} className="px-8 py-3 hover:bg-blue-50 cursor-pointer text-left font-black text-xs uppercase text-gray-600 hover:text-blue-700">{g}</div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <button 
                                onClick={() => {
                                    const params = new URLSearchParams();
                                    params.set("subject", searchSubject);
                                    params.set("role", activeTab);
                                    router.push(`/search?${params.toString()}`);
                                }} 
                                className="w-full md:w-auto md:ml-auto px-12 py-5 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-gray-900 active:scale-95 transition-all shadow-xl shadow-blue-600/30 flex items-center justify-center gap-4"
                            >
                                Initiate Discovery <ArrowRight size={20} />
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

            {/* Workflow section */}
            <section className="snap-section px-4 flex flex-col items-center justify-center bg-gray-50/30">
                <div className="max-w-6xl mx-auto w-full">
                    <div className="text-center mb-20">
                        <span className="text-blue-600 text-[10px] font-black uppercase tracking-[0.5em] mb-4 inline-block">Workflow Protocol</span>
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

            {/* Popular section */}
            <section className="snap-section px-4 flex flex-col items-center justify-center bg-white">
                <div className="max-w-6xl mx-auto w-full">
                    <div className="text-center mb-20">
                        <span className="text-blue-600 text-[10px] font-black uppercase tracking-[0.5em] mb-4 inline-block">Domain Excellence</span>
                        <h2 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tighter uppercase italic">Major <span className="text-blue-600">Verticles</span></h2>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
                        {POPULAR_SUBJECTS.map((cat, i) => (
                            <Link key={i} href={`/search?subject=${encodeURIComponent(cat.title)}&role=TUTOR`} className="bg-white p-12 rounded-[3.5rem] border border-gray-100 shadow-sm hover:shadow-4xl cursor-pointer flex flex-col items-center justify-center text-center group transition-all hover:scale-105">
                                <div className="text-blue-600 mb-10 bg-blue-50 p-8 rounded-[2.5rem] group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner"><cat.icon size={48} strokeWidth={1} /></div>
                                <h3 className="font-black text-gray-900 text-xl tracking-tighter italic uppercase">{cat.title}</h3>
                                <p className="text-[10px] font-black text-blue-500/20 uppercase mt-3 tracking-widest group-hover:text-blue-600 transition-colors">Elite Match</p>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA section */}
            <section className="snap-section px-4 flex flex-col items-center justify-center bg-gray-900 text-white relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-blue-600/5 blur-[120px] rounded-full -z-0"></div>
                <div className="max-w-4xl mx-auto w-full relative z-10 text-center">
                    <div className="size-24 rounded-[2rem] bg-blue-600 text-white flex items-center justify-center mx-auto mb-12 shadow-2xl shadow-blue-600/40 animate-pulse">
                        <Rocket size={48} strokeWidth={1} />
                    </div>
                    <h2 className="text-5xl md:text-8xl font-black text-white tracking-tighter uppercase italic mb-10 leading-[0.9]">
                        Deploy your <br />
                        <span className="text-blue-500 font-serif lowercase tracking-normal not-italic px-4 underline decoration-blue-500/20">academic</span> legacy.
                    </h2>
                    <p className="text-xl text-gray-400 font-medium mb-16 italic max-w-2xl mx-auto leading-relaxed">
                        Join India's most advanced educator matching network. Optimize your strategy; scale your legacy with institutional-grade precision.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row justify-center gap-8">
                        <Link href="/register/tutor" className="px-14 py-7 bg-blue-600 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] shadow-4xl shadow-blue-600/40 hover:bg-white hover:text-gray-900 transition-all active:scale-95">
                            Register as Tutor
                        </Link>
                        <Link href="/register/institute" className="px-14 py-7 bg-transparent border-2 border-white/20 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] hover:bg-white/5 transition-all active:scale-95">
                            Register as Institute
                        </Link>
                    </div>

                    <div className="mt-24 flex items-center justify-center gap-2 text-[10px] font-black text-gray-600 uppercase tracking-[0.6em]">
                        <Lock size={14} strokeWidth={3} /> Standard Security Protocols Active
                    </div>
                </div>
            </section>
        </div>
    );
}
