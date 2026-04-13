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
    X
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

    // Autocomplete Logic
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

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (searchSubject) params.set("subject", searchSubject);
        if (searchGrade) params.set("grade", searchGrade);
        if (searchLocation) params.set("location", searchLocation);
        params.set("role", activeTab);
        router.push(`/search?${params.toString()}`);
    };

    if (variant === "compact") {
        return (
            <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-gray-200 shadow-sm max-w-2xl w-full mx-auto">
                <div className="flex-1 relative flex items-center px-4" ref={subjectRef}>
                    <Search size={16} className="text-gray-400 mr-3 shrink-0" />
                    <input
                        className="w-full bg-transparent border-none focus:ring-0 text-sm font-medium text-gray-900 outline-none placeholder:text-gray-300"
                        placeholder="Search subjects..."
                        value={searchSubject}
                        onChange={(e) => setSearchSubject(e.target.value)}
                        onFocus={() => searchSubject && setShowSubjectSuggestions(true)}
                    />
                    {showSubjectSuggestions && (
                        <div className="absolute top-full mt-3 left-0 w-full bg-white border border-gray-200 rounded-xl shadow-lg z-[100] py-2 overflow-hidden border-t-blue-600 border-t-2">
                            {filteredSubjects.slice(0, 5).map((s, i) => (
                                <button key={i} onClick={() => { setSearchSubject(s); setShowSubjectSuggestions(false); }} className="w-full px-4 py-2.5 hover:bg-blue-50 text-left text-sm font-medium text-gray-600 hover:text-blue-600 transition-all border-b border-gray-50 last:border-none">
                                    {s}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
                <button onClick={handleSearch} className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 transition-all active:scale-95 shadow-sm">
                    <ArrowRight size={18} />
                </button>
            </div>
        );
    }

    return (
        <div className={`w-full max-w-4xl mx-auto ${variant === 'hero' ? 'shadow-lg rounded-2xl bg-white border border-gray-200' : ''}`}>
            {variant === 'hero' && (
                <div className="flex bg-gray-50 rounded-t-2xl overflow-hidden border-b border-gray-100">
                    {[
                        { id: "TUTOR", label: "Find tutors", icon: GraduationCap },
                        { id: "STUDENT", label: "Student requirements", icon: Users },
                        { id: "INSTITUTE", label: "Find institutes", icon: Building2 }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 py-4 flex items-center justify-center gap-2 text-xs font-semibold transition-all relative ${
                                activeTab === tab.id ? "bg-white text-blue-600" : "text-gray-400 hover:bg-white/60"
                            }`}
                        >
                            {activeTab === tab.id && <div className="absolute top-0 left-0 w-full h-0.5 bg-blue-600"></div>}
                            <tab.icon size={16} className={activeTab === tab.id ? "text-blue-600" : "text-gray-300"} />
                            {tab.label}
                        </button>
                    ))}
                </div>
            )}

            <div className={`bg-white flex flex-col md:flex-row items-center gap-3 ${variant === 'hero' ? 'p-4 md:p-6 rounded-b-2xl' : 'rounded-2xl border border-gray-200 p-3 shadow-sm'}`}>
                {/* Subject */}
                <div className="w-full md:w-1/3 relative border border-gray-100 rounded-xl flex flex-col px-4 py-3 bg-gray-50 focus-within:bg-white focus-within:border-blue-300 transition-all group" ref={subjectRef}>
                    <span className="text-xs font-semibold text-gray-400 mb-1 flex items-center gap-1.5 group-focus-within:text-blue-600">
                        <Search size={12} /> Subject
                    </span>
                    <input
                        className="w-full bg-transparent border-none focus:ring-0 text-gray-900 font-medium text-sm outline-none placeholder:text-gray-300 p-0"
                        placeholder="e.g. Maths, Physics..."
                        value={searchSubject}
                        onChange={(e) => setSearchSubject(e.target.value)}
                        onFocus={() => searchSubject && setShowSubjectSuggestions(true)}
                    />
                    {showSubjectSuggestions && (
                        <div className="absolute top-full mt-3 left-0 w-full bg-white border border-gray-200 rounded-xl shadow-lg z-[100] py-2 overflow-hidden border-t-blue-600 border-t-2">
                            {filteredSubjects.slice(0, 6).map((s, i) => (
                                <button key={i} onClick={() => { setSearchSubject(s); setShowSubjectSuggestions(false); }} className="w-full px-4 py-2.5 hover:bg-blue-50 text-left text-sm font-medium text-gray-600 hover:text-blue-600 transition-all border-b border-gray-50 last:border-none">
                                    {s}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Grade Level */}
                <div className="w-full md:w-1/4 relative border border-gray-100 rounded-xl bg-gray-50 flex flex-col cursor-pointer hover:bg-white hover:border-blue-300 transition-all px-4 py-3 group" ref={gradeRef} onClick={() => setShowGradeDropdown(!showGradeDropdown)}>
                    <span className="text-xs font-semibold text-gray-400 mb-1 flex items-center gap-1.5 group-hover:text-blue-600">
                        <Layers size={12} /> Grade level
                    </span>
                    <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900 text-sm truncate">{searchGrade || "Any level"}</span>
                        <ChevronDown size={14} className={`text-gray-400 transition-transform duration-200 shrink-0 ${showGradeDropdown ? 'rotate-180' : ''}`} />
                    </div>
                    {showGradeDropdown && (
                        <div className="absolute top-full mt-3 left-0 w-full bg-white border border-gray-200 rounded-xl shadow-lg z-[100] py-2 overflow-hidden border-t-blue-600 border-t-2">
                            {gradesList.map((g, i) => (
                                <button key={i} onClick={(e) => { e.stopPropagation(); setSearchGrade(g); setShowGradeDropdown(false); }} className="w-full px-4 py-2.5 hover:bg-blue-50 text-left text-sm font-medium text-gray-600 hover:text-blue-600 border-b border-gray-50 last:border-none">
                                    {g}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Location */}
                <div className="w-full md:w-1/4 relative border border-gray-100 rounded-xl bg-gray-50 flex flex-col cursor-pointer hover:bg-white hover:border-blue-300 transition-all px-4 py-3 group" ref={locationRef} onClick={() => setShowLocationDropdown(!showLocationDropdown)}>
                    <span className="text-xs font-semibold text-gray-400 mb-1 flex items-center gap-1.5 group-hover:text-blue-600">
                        <MapPin size={12} /> Location
                    </span>
                    <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900 text-sm truncate">{searchLocation || "Any city"}</span>
                        <ChevronDown size={14} className={`text-gray-400 transition-transform duration-200 shrink-0 ${showLocationDropdown ? 'rotate-180' : ''}`} />
                    </div>
                    {showLocationDropdown && (
                        <div className="absolute top-full mt-3 left-0 w-full bg-white border border-gray-200 rounded-xl shadow-lg z-[100] py-2 overflow-hidden border-t-blue-600 border-t-2">
                            {majorCities.map((city, i) => (
                                <button key={i} onClick={(e) => { e.stopPropagation(); setSearchLocation(city); setShowLocationDropdown(false); }} className="w-full px-4 py-2.5 hover:bg-blue-50 text-left text-sm font-medium text-gray-600 hover:text-blue-600 border-b border-gray-50 last:border-none">
                                    {city}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Search Button */}
                <button
                    onClick={handleSearch}
                    className="w-full md:w-auto md:ml-auto px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 active:scale-95 transition-all shadow-sm flex items-center justify-center gap-2"
                >
                    Search <ArrowRight size={18} />
                </button>
            </div>
        </div>
    );
}
