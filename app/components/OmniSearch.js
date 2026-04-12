"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { 
    Search, 
    Layers, 
    MapPin, 
    ChevronDown, 
    ArrowRight, 
    GraduationCap, 
    Users, 
    Building2,
    Activity,
    X,
    Sparkles
} from "lucide-react";
import { ALL_SUBJECTS } from "../../lib/subjects";

export default function OmniSearch({ 
    initialSubject = "", 
    initialGrade = "", 
    initialLocation = "", 
    initialRole = "TUTOR",
    variant = "hero" // hero, compact, overlay
}) {
    const router = useRouter();
    const [searchSubject, setSearchSubject] = useState(initialSubject);
    const [searchGrade, setSearchGrade] = useState(initialGrade);
    const [searchLocation, setSearchLocation] = useState(initialLocation);
    const [activeTab, setActiveTab] = useState(initialRole);
    
    const [showSubjectSuggestions, setShowSubjectSuggestions] = useState(false);
    const [showGradeDropdown, setShowGradeDropdown] = useState(false);
    const [showLocationDropdown, setShowLocationDropdown] = useState(false);
    const [filteredSubjects, setFilteredSubjects] = useState([]);
    
    const subjectRef = useRef(null);
    const gradeRef = useRef(null);
    const locationRef = useRef(null);

    const majorCities = ["Mumbai", "Delhi", "Bangalore", "Kolkata", "Hyderabad", "Chennai", "Pune", "Ahmedabad", "Online"];
    const gradesList = ["Primary (1-5)", "Middle (6-8)", "High School (9-10)", "Higher Secondary (11-12)", "College", "Competitive Exams"];

    // Predictive Autocomplete Logic
    useEffect(() => {
        if (searchSubject.length >= 1) {
            const query = searchSubject.toLowerCase().trim();
            const filtered = ALL_SUBJECTS.filter(s => s.toLowerCase().includes(query));
            setFilteredSubjects(filtered);
            setShowSubjectSuggestions(filtered.length > 0);
        } else {
            setShowSubjectSuggestions(false);
        }
    }, [searchSubject]);

    // Click Outside listener
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (subjectRef.current && !subjectRef.current.contains(event.target)) setShowSubjectSuggestions(false);
            if (gradeRef.current && !gradeRef.current.contains(event.target)) setShowGradeDropdown(false);
            if (locationRef.current && !locationRef.current.contains(event.target)) setShowLocationDropdown(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handlePulse = () => {
        const params = new URLSearchParams();
        if (searchSubject) params.set("subject", searchSubject);
        if (searchGrade) params.set("grade", searchGrade);
        if (searchLocation) params.set("location", searchLocation);
        params.set("role", activeTab);
        router.push(`/search?${params.toString()}`);
    };

    if (variant === "compact") {
        return (
            <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-gray-100 shadow-xl shadow-blue-900/5 max-w-2xl w-full mx-auto">
                <div className="flex-1 relative flex items-center px-4" ref={subjectRef}>
                   <Search size={16} className="text-gray-300 mr-3" />
                   <input 
                        className="w-full bg-transparent border-none focus:ring-0 text-[10px] font-black uppercase tracking-widest text-gray-900 outline-none placeholder:text-gray-200 italic"
                        placeholder="Search..."
                        value={searchSubject}
                        onChange={(e) => setSearchSubject(e.target.value)}
                        onFocus={() => searchSubject && setShowSubjectSuggestions(true)}
                   />
                   {showSubjectSuggestions && (
                        <div className="absolute top-full mt-4 left-0 w-full bg-white border border-gray-100 rounded-2xl shadow-4xl z-[100] py-4 overflow-hidden border-t-blue-600 border-t-4 animate-in slide-in-from-top-4">
                            {filteredSubjects.slice(0, 5).map((s, i) => (
                                <button key={i} onClick={() => {setSearchSubject(s); setShowSubjectSuggestions(false);}} className="w-full px-6 py-3 hover:bg-blue-50 text-left font-black text-[10px] uppercase tracking-tight text-gray-400 hover:text-blue-600 transition-all italic border-b border-gray-50 last:border-none">
                                    {s}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
                <button onClick={handlePulse} className="bg-blue-600 text-white p-4 rounded-xl hover:bg-gray-900 transition-all active:scale-95 shadow-lg shadow-blue-600/20">
                    <ArrowRight size={18} strokeWidth={3} />
                </button>
            </div>
        );
    }

    return (
        <div className={`w-full max-w-4xl mx-auto ${variant === 'hero' ? 'shadow-4xl rounded-[3.5rem] bg-white p-2 border border-gray-100/50' : ''}`}>
            {variant === 'hero' && (
                <div className="flex bg-gray-50/50 rounded-t-[3rem] overflow-hidden border-b border-gray-100">
                    {[
                        { id: "TUTOR", label: "Find Tutors", icon: GraduationCap },
                        { id: "STUDENT", label: "Requirement Stream", icon: Users },
                        { id: "INSTITUTE", label: "Institutional Hubs", icon: Building2 }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 py-6 flex items-center justify-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative italic ${
                                activeTab === tab.id ? "bg-white text-blue-600 shadow-inner" : "text-gray-300 hover:bg-white/50"
                            }`}
                        >
                            {activeTab === tab.id && <div className="absolute top-0 left-0 w-full h-1 bg-blue-600"></div>}
                            <tab.icon size={18} className={activeTab === tab.id ? "text-blue-600" : "text-gray-200"} strokeWidth={2.5} />
                            {tab.label}
                        </button>
                    ))}
                </div>
            )}

            <div className={`bg-white flex flex-col md:flex-row items-center gap-4 relative ${variant === 'hero' ? 'p-5 md:p-8 rounded-b-[3rem]' : 'rounded-[2.5rem] border border-gray-100 p-4 shadow-xl shadow-blue-900/5'}`}>
                {/* Subjects */}
                <div className="w-full md:w-1/3 relative border-2 border-gray-50 rounded-[1.8rem] flex flex-col px-7 py-5 bg-gray-50/50 focus-within:bg-white focus-within:border-blue-600/30 transition-all group" ref={subjectRef}>
                    <span className="text-[9px] font-black uppercase tracking-[0.4em] text-gray-300 mb-1 flex items-center gap-2 group-focus-within:text-blue-600 italic">
                        <Search size={14} strokeWidth={3} /> Subject
                    </span>
                    <input 
                        className="w-full bg-transparent border-none focus:ring-0 text-gray-900 font-black text-sm uppercase outline-none placeholder:text-gray-200 italic p-0" 
                        placeholder="Target Logic..." 
                        value={searchSubject}
                        onChange={(e) => setSearchSubject(e.target.value)}
                        onFocus={() => searchSubject && setShowSubjectSuggestions(true)}
                    />
                    {showSubjectSuggestions && (
                        <div className="absolute top-full mt-4 left-0 w-full bg-white border border-gray-100 rounded-[2rem] shadow-4xl z-[100] py-4 overflow-hidden border-t-blue-600 border-t-4 animate-in fade-in slide-in-from-top-4 duration-500">
                            {filteredSubjects.slice(0, 6).map((s, i) => (
                                <button key={i} onClick={() => {setSearchSubject(s); setShowSubjectSuggestions(false);}} className="w-full px-8 py-4 hover:bg-blue-50 text-left font-black text-[10px] uppercase tracking-widest text-gray-400 hover:text-blue-600 transition-all italic border-b border-gray-50 last:border-none">
                                    <Sparkles size={12} className="inline mr-3 opacity-0 group-hover:opacity-100" /> {s}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Level Threshold */}
                <div className="w-full md:w-1/4 relative border-2 border-gray-50 rounded-[1.8rem] bg-gray-50/50 flex flex-col cursor-pointer hover:bg-white hover:border-blue-600/30 transition-all px-7 py-5 group" ref={gradeRef} onClick={() => setShowGradeDropdown(!showGradeDropdown)}>
                    <span className="text-[9px] font-black uppercase tracking-[0.4em] text-gray-300 mb-1 flex items-center gap-2 group-hover:text-blue-600 italic">
                        <Layers size={14} strokeWidth={3} /> Grade Level
                    </span>
                    <div className="flex items-center justify-between">
                        <span className="font-black text-gray-900 text-sm uppercase italic truncate">{searchGrade || "Global Stratum"}</span>
                        <ChevronDown size={14} className={`text-gray-300 transition-transform duration-300 ${showGradeDropdown ? 'rotate-180' : ''}`} strokeWidth={3} />
                    </div>
                    {showGradeDropdown && (
                        <div className="absolute top-full mt-4 left-0 w-full bg-white border border-gray-100 rounded-[2rem] shadow-4xl z-[100] py-4 overflow-hidden border-t-blue-600 border-t-4 animate-in fade-in slide-in-from-top-4 duration-500">
                            {gradesList.map((g, i) => (
                                <button key={i} onClick={(e) => {e.stopPropagation(); setSearchGrade(g); setShowGradeDropdown(false);}} className="w-full px-8 py-4 hover:bg-blue-50 text-left text-[10px] font-black uppercase text-gray-400 hover:text-blue-600 border-b border-gray-50 last:border-none italic tracking-widest">
                                    {g}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Geographic Node */}
                <div className="w-full md:w-1/4 relative border-2 border-gray-50 rounded-[1.8rem] bg-gray-50/50 flex flex-col cursor-pointer hover:bg-white hover:border-blue-600/30 transition-all px-7 py-5 group" ref={locationRef} onClick={() => setShowLocationDropdown(!showLocationDropdown)}>
                    <span className="text-[9px] font-black uppercase tracking-[0.4em] text-gray-300 mb-1 flex items-center gap-2 group-hover:text-blue-600 italic">
                        <MapPin size={14} strokeWidth={3} /> Location Node
                    </span>
                    <div className="flex items-center justify-between">
                        <span className="font-black text-gray-900 text-sm uppercase italic truncate">{searchLocation || "All Sectors"}</span>
                        <ChevronDown size={14} className={`text-gray-300 transition-transform duration-300 ${showLocationDropdown ? 'rotate-180' : ''}`} strokeWidth={3} />
                    </div>
                    {showLocationDropdown && (
                        <div className="absolute top-full mt-4 left-0 w-full bg-white border border-gray-100 rounded-[2rem] shadow-4xl z-[100] py-4 overflow-hidden border-t-blue-600 border-t-4 animate-in fade-in slide-in-from-top-4 duration-500">
                            {majorCities.map((city, i) => (
                                <button key={i} onClick={(e) => {e.stopPropagation(); setSearchLocation(city); setShowLocationDropdown(false);}} className="w-full px-8 py-4 hover:bg-blue-50 text-left text-[10px] font-black uppercase text-gray-400 hover:text-blue-600 border-b border-gray-50 last:border-none italic tracking-widest">
                                    {city}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Pulse Execution */}
                <button 
                    onClick={handlePulse} 
                    className="w-full md:w-auto md:ml-auto px-12 py-7 bg-blue-600 text-white rounded-[1.8rem] font-black text-[11px] uppercase tracking-[0.4em] hover:bg-gray-900 active:scale-95 transition-all shadow-2xl shadow-blue-600/30 flex items-center justify-center gap-5 leading-none italic"
                >
                    Initiate Pulse <ArrowRight size={20} className="animate-pulse" strokeWidth={3} />
                </button>
            </div>
        </div>
    );
}
