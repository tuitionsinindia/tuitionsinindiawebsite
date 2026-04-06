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
    Zap, 
    ShieldCheck, 
    Award, 
    ArrowRight, 
    ArrowLeft,
    BadgeCheck, 
    TrendingUp, 
    BookOpen, 
    CodeIcon, 
    Languages, 
    MessageSquare, 
    Quote, 
    Rocket,
    CheckCircle,
    CheckCircle2,
    UserPlus,
    Navigation,
    Globe,
    Atom
} from "lucide-react";

export default function Home() {
    // Comprehensive local subject list (loads instantly)
    const LOCAL_SUBJECTS = [
        "Mathematics", "Physics", "Chemistry", "Biology", "Science",
        "English", "Hindi", "Sanskrit", "French", "German", "Spanish",
        "Tamil", "Telugu", "Kannada", "Malayalam", "Marathi", "Bengali", "Gujarati", "Punjabi", "Urdu",
        "Social Science", "History", "Geography", "Economics", "Civics", "Political Science",
        "Accountancy", "Business Studies", "Commerce", "Statistics",
        "Computer Science", "Coding", "Python", "Java", "C++", "Web Development", "Data Science", "Machine Learning",
        "JEE Preparation", "NEET Preparation", "UPSC Exams", "Banking Exams", "SSC Exams", "CLAT", "CAT", "GATE", "GRE", "GMAT",
        "IELTS", "TOEFL", "SAT", "IB Curriculum", "IGCSE",
        "Vocal Music", "Guitar", "Piano", "Keyboard", "Flute", "Tabla", "Harmonium",
        "Classical Dance", "Western Dance", "Yoga",
        "Drawing", "Painting", "Art & Craft", "Photography",
        "Personality Development", "Spoken English", "Public Speaking",
        "Vedic Maths", "Abacus", "Chess", "Financial Literacy",
        "Environmental Science", "Psychology", "Sociology", "Philosophy",
        "Mechanical Engineering", "Electrical Engineering", "Civil Engineering"
    ];

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

    const majorCities = [
        { name: "Mumbai", lat: 19.0760, lng: 72.8777 },
        { name: "Delhi", lat: 28.6139, lng: 77.2090 },
        { name: "Bangalore", lat: 12.9716, lng: 77.5946 },
        { name: "Kolkata", lat: 22.5726, lng: 88.3639 },
        { name: "Hyderabad", lat: 17.3850, lng: 78.4867 },
        { name: "Chennai", lat: 13.0827, lng: 80.2707 },
        { name: "Pune", lat: 18.5204, lng: 73.8567 },
        { name: "Ahmedabad", lat: 23.0225, lng: 72.5714 },
        { name: "Jaipur", lat: 26.9124, lng: 75.7873 },
        { name: "Lucknow", lat: 26.8467, lng: 80.9462 },
        { name: "Chandigarh", lat: 30.7333, lng: 76.7794 },
        { name: "Kochi", lat: 9.9312, lng: 76.2673 },
        { name: "Indore", lat: 22.7196, lng: 75.8577 },
        { name: "Bhopal", lat: 23.2599, lng: 77.4126 },
        { name: "Noida", lat: 28.5355, lng: 77.3910 }
    ];

    const gradesList = [
        "Pre-School (Nursery/KG)", "Primary (1-5)", "Middle (6-8)", "High School (9-10)", 
        "Higher Secondary (11-12)", "Undergraduate", "Postgraduate", "Competitive Exams", "Hobby / Skill-based"
    ];

    const router = useRouter();

    useEffect(() => {
        fetch("/api/subjects")
            .then(res => res.json())
            .then(data => {
                // Merge API subjects with local fallback, deduplicate
                const merged = Array.from(new Set([...LOCAL_SUBJECTS, ...data])).sort();
                setSubjects(merged);
            })
            .catch(err => console.error("Failed to fetch subjects", err));
    }, []);

    useEffect(() => {
        if (searchSubject.length > 0) {
            const filtered = subjects.filter(s => 
                s.toLowerCase().includes(searchSubject.toLowerCase())
            );
            setFilteredSubjects(filtered);
            if (filtered.length > 0) setShowSubjectSuggestions(true);
            else setShowSubjectSuggestions(false);
        } else {
            // Show popular subjects when field is empty but focused
            setFilteredSubjects(subjects.slice(0, 15));
        }
    }, [searchSubject, subjects]);

    const handleSearch = () => {
        if (!searchSubject || !searchGrade) {
            alert("Please input a Subject and Grade level to search.");
            return;
        }

        const params = new URLSearchParams();
        params.set("subject", searchSubject);
        params.set("grade", searchGrade);
        if (searchLocation) params.set("location", searchLocation);
        if (searchCoords) {
            params.set("lat", searchCoords.lat);
            params.set("lng", searchCoords.lng);
        }
        params.set("role", "TUTOR");
        router.push(`/search?${params.toString()}`);
    };

    const detectLocation = () => {
        setIsDetecting(true);
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                try {
                    const { latitude, longitude } = position.coords;
                    setSearchCoords({ lat: latitude, lng: longitude });
                    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                    const data = await res.json();
                    const city = data.address.city || data.address.town || data.address.village || data.address.state || "Current Location";
                    setSearchLocation(city);
                } catch (err) {
                    console.error("Location detection failed", err);
                    setSearchLocation("Current Location");
                } finally {
                    setIsDetecting(false);
                }
            }, () => {
                setIsDetecting(false);
                alert("Location access denied.");
            });
        } else {
            setIsDetecting(false);
            alert("Geolocation not supported by your browser.");
        }
    };

    const [activeTab, setActiveTab] = useState("TUTOR"); // TUTOR, STUDENT, INSTITUTE

    return (
        <div className="w-full bg-white text-gray-800 antialiased font-sans">
            {/* HERO SECTION (Single Viewport) */}
            <section className="relative h-screen flex flex-col items-center justify-center pt-32 px-4">
                {/* Background Image with Overlay */}
                <div 
                    className="absolute inset-0 z-0 bg-cover bg-center"
                    style={{ backgroundImage: "url('/hero-bg.png')" }}
                >
                    {/* Dark gradient overlay so text is highly readable */}
                    <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 via-gray-900/60 to-gray-900/90"></div>
                </div>

                <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center">
                    <div className="mb-6 text-center space-y-3">
                        <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                            India's Trusted Tuition Platform
                        </span>
                        <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
                            What are you looking for?
                        </h1>
                        <p className="text-gray-200 text-base md:text-lg font-medium max-w-2xl mx-auto">
                            Connect with verified tutors, enthusiastic students, and top institutes in your city.
                        </p>
                    </div>

                    {/* SEARCH INTERFACE */}
                    <div className="w-full max-w-4xl mx-auto shadow-2xl rounded-2xl overflow-visible animate-fade-in">
                        {/* Tabs */}
                        <div className="flex bg-white/10 backdrop-blur-md rounded-t-2xl overflow-hidden border-b border-white/20">
                            {[
                                { id: "TUTOR", label: "Find Tutors" },
                                { id: "STUDENT", label: "Find Students" },
                                { id: "INSTITUTE", label: "Find Institutes" }
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex-1 py-3 text-sm md:text-base font-bold transition-all ${
                                        activeTab === tab.id 
                                        ? "bg-white text-blue-700 border-t-4 border-blue-600" 
                                        : "text-white hover:bg-white/20"
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Search Bar Container */}
                        <div className="bg-white p-4 md:p-5 flex flex-col md:flex-row items-center gap-3 rounded-b-2xl shadow-inner relative">
                            
                            {/* Subject Field */}
                            <div className="w-full md:w-1/3 relative border border-gray-300 rounded-xl flex items-center px-4 py-3 bg-gray-50 focus-within:ring-2 focus-within:ring-blue-500 transition-all">
                                <Search className="text-gray-400 mr-3" size={20} />
                                <input 
                                    className="w-full bg-transparent border-none focus:ring-0 text-gray-800 placeholder:text-gray-400 font-medium outline-none" 
                                    placeholder="Subject (e.g. Mathematics)" 
                                    type="text"
                                    value={searchSubject}
                                    onChange={(e) => setSearchSubject(e.target.value)}
                                    onFocus={() => {
                                        if (searchSubject.length > 1 && filteredSubjects.length > 0) {
                                            setShowSubjectSuggestions(true);
                                        } else if (searchSubject.length <= 1 && subjects.length > 0) {
                                            setFilteredSubjects(subjects.slice(0, 15));
                                            setShowSubjectSuggestions(true);
                                        }
                                    }}
                                    onBlur={() => setTimeout(() => setShowSubjectSuggestions(false), 250)}
                                />
                                {showSubjectSuggestions && filteredSubjects.length > 0 && (
                                    <div className="absolute bottom-full mb-2 left-0 w-full min-w-[250px] bg-white border border-gray-200 rounded-xl shadow-2xl z-[60] max-h-48 overflow-y-auto py-2">
                                        {filteredSubjects.slice(0, 10).map((s, i) => (
                                            <div key={i} onMouseDown={() => {setSearchSubject(s); setShowSubjectSuggestions(false);}} className="px-5 py-3 hover:bg-blue-50 cursor-pointer text-left font-medium text-gray-700 hover:text-blue-700 transition-colors">
                                                {s}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Divider Line Hidden on Mobile */}
                            <div className="hidden md:block w-px h-10 bg-gray-200"></div>

                            {/* Grade Menu */}
                            <div className="w-full md:w-1/4 relative border border-gray-300 rounded-xl bg-gray-50 flex flex-col cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => {setShowGradeDropdown(!showGradeDropdown); setShowCityDropdown(false); setShowSubjectSuggestions(false)}}>
                                <div className="flex items-center justify-between px-4 py-3">
                                    <div className="flex items-center">
                                        <Layers className="text-gray-400 mr-3" size={20} />
                                        <span className="font-medium text-gray-700 truncate">{searchGrade || "Select Level"}</span>
                                    </div>
                                    <ChevronDown size={16} className={`text-gray-500 transition-transform ${showGradeDropdown ? 'rotate-180' : ''}`} />
                                </div>
                                {showGradeDropdown && (
                                    <div className="absolute bottom-full mb-2 left-0 w-full min-w-[200px] bg-white border border-gray-200 rounded-xl shadow-2xl z-[60] max-h-48 overflow-y-auto py-2">
                                        {gradesList.map((g, i) => (
                                            <div key={i} onClick={() => {setSearchGrade(g); setShowGradeDropdown(false);}} className={`px-5 py-3 rounded-lg hover:bg-blue-50 cursor-pointer text-left font-medium text-sm transition-colors ${searchGrade === g ? 'text-blue-700 bg-blue-50' : 'text-gray-700'}`}>
                                                {g}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Divider Line Hidden on Mobile */}
                            <div className="hidden md:block w-px h-10 bg-gray-200"></div>

                            {/* City / Location Field */}
                            <div className="w-full md:w-1/4 relative border border-gray-300 rounded-xl bg-gray-50 flex flex-col cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => {setShowCityDropdown(!showCityDropdown); setShowGradeDropdown(false); setShowSubjectSuggestions(false)}}>
                                <div className="flex items-center justify-between px-4 py-3">
                                    <div className="flex items-center">
                                        <MapPin className="text-gray-400 mr-3" size={20} />
                                        <span className="font-medium text-gray-700 truncate">{searchLocation || "Select City"}</span>
                                    </div>
                                    <ChevronDown size={16} className={`text-gray-500 transition-transform ${showCityDropdown ? 'rotate-180' : ''}`} />
                                </div>
                                {showCityDropdown && (
                                    <div className="absolute bottom-full mb-2 right-0 w-full min-w-[260px] bg-white border border-gray-200 rounded-xl shadow-2xl z-[60] max-h-48 overflow-y-auto py-2">
                                        <div onClick={() => {setSearchLocation(''); setSearchCoords(null); setShowCityDropdown(false);}} className="px-5 py-3 hover:bg-gray-50 cursor-pointer text-left font-medium text-sm text-gray-500">
                                            Online / Anywhere
                                        </div>
                                        <div onClick={detectLocation} className="px-5 py-3 hover:bg-blue-50 cursor-pointer text-left font-bold text-sm text-blue-600 flex items-center gap-2 border-b border-gray-100 pb-3 mb-2">
                                            <Navigation size={14} fill="currentColor" />
                                            {isDetecting ? 'Detecting Location...' : 'Detect My Location'}
                                        </div>
                                        {majorCities.map((cityObj, i) => (
                                            <div key={i} onClick={() => {setSearchLocation(cityObj.name); setSearchCoords({lat: cityObj.lat, lng: cityObj.lng}); setShowCityDropdown(false);}} className="px-5 py-3 hover:bg-gray-50 cursor-pointer text-left font-medium text-sm text-gray-800 flex items-center justify-between transition-colors">
                                                {cityObj.name}
                                                {searchLocation === cityObj.name && <CheckCircle2 size={16} className="text-blue-600" />}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Search Button */}
                            <button 
                                onClick={() => {
                                    if (!searchSubject) { alert("Please type a subject."); return; }
                                    // Save search context for registration pre-fill
                                    try {
                                        sessionStorage.setItem("last_search_subject", searchSubject);
                                        sessionStorage.setItem("last_search_grade", searchGrade);
                                        sessionStorage.setItem("last_search_location", searchLocation);
                                        sessionStorage.setItem("last_search_role", activeTab);
                                    } catch(e) {}
                                    const params = new URLSearchParams();
                                    params.set("subject", searchSubject);
                                    if (searchGrade) params.set("grade", searchGrade);
                                    if (searchLocation) params.set("location", searchLocation);
                                    if (searchCoords) {
                                        params.set("lat", searchCoords.lat);
                                        params.set("lng", searchCoords.lng);
                                    }
                                    params.set("role", activeTab);
                                    router.push(`/search?${params.toString()}`);
                                }} 
                                className="w-full md:w-auto md:ml-auto px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 active:scale-95 transition-all shadow-md flex items-center justify-center gap-2"
                            >
                                Search <ArrowRight size={18} />
                            </button>
                        </div>
                    </div>

                    <div className="mt-8 flex flex-wrap justify-center gap-6 md:gap-12 text-white/80 text-sm font-medium">
                        <div className="flex items-center gap-2 drop-shadow-md">
                            <ShieldCheck size={18} className="text-green-400" />
                            <span>100% Verified Profiles</span>
                        </div>
                        <div className="flex items-center gap-2 drop-shadow-md">
                            <Star size={18} className="text-yellow-400 fill-yellow-400" />
                            <span>Top Rated Instructors</span>
                        </div>
                        <div className="flex items-center gap-2 drop-shadow-md">
                            <MessageSquare size={18} className="text-blue-300" />
                            <span>Direct Chat Access</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* How it Works Section */}
            <section className="py-24 bg-gray-50 border-t border-gray-200">
                <div className="max-w-6xl mx-auto px-6 text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">How TuitionsInIndia Works</h2>
                    <p className="text-gray-500 max-w-2xl mx-auto mb-16">Finding the perfect match for your academic needs is easier than ever. Follow these simple steps.</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {[
                            { step: "1", title: "Search", desc: "Enter your subject, grade, and city to find matching profiles instantly.", icon: Search },
                            { step: "2", title: "Review", desc: "Check reviews, ratings, and verified credentials to pick the best fit.", icon: ShieldCheck },
                            { step: "3", title: "Connect", desc: "Chat directly and easily finalize tuition timings and fees.", icon: MessageSquare }
                        ].map((item, i) => (
                            <div key={i} className="flex flex-col items-center bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
                                <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-6 relative">
                                    <item.icon size={28} />
                                    <span className="absolute -top-2 -right-2 bg-yellow-400 text-gray-900 font-black text-xs w-6 h-6 rounded-full flex items-center justify-center border-2 border-white">{item.step}</span>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                                <p className="text-gray-500 line-clamp-3">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Platform Stats / Assets */}
            <section className="py-24 bg-white border-t border-gray-200">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="bg-blue-600 rounded-[3rem] p-12 text-white shadow-xl flex flex-col md:flex-row justify-between items-center bg-[url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80')] bg-blend-multiply border border-blue-700">
                        <div className="text-center md:text-left mb-8 md:mb-0">
                            <h2 className="text-3xl md:text-5xl font-bold mb-4">India's Growing Tuition Network</h2>
                            <p className="text-blue-100 text-lg">Join thousands of parents and teachers on our platform.</p>
                        </div>
                        <div className="flex gap-12">
                            <div className="text-center">
                                <p className="text-5xl font-black mb-2">50k+</p>
                                <p className="text-blue-200 font-medium">Registered Tutors</p>
                            </div>
                            <div className="text-center">
                                <p className="text-5xl font-black mb-2">2M+</p>
                                <p className="text-blue-200 font-medium">Monthly Classes</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Popular Subjects */}
            <section className="py-24 bg-gray-50">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Popular Categories</h2>
                        <p className="text-gray-500">Explore the most demanded subjects in your city.</p>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                            { title: "Mathematics", icon: TrendingUp },
                            { title: "Science", icon: Atom },
                            { title: "English", icon: Languages },
                            { title: "Computer Science", icon: CodeIcon },
                            { title: "Physics", icon: ArrowRight },
                            { title: "Chemistry", icon: BookOpen },
                            { title: "Class 1st - 5th", icon: Layers },
                            { title: "IIT JEE", icon: Award }
                        ].map((cat, i) => (
                            <div key={i} onClick={() => { setSearchSubject(cat.title); window.scrollTo({top: 0, behavior: 'smooth'}); }} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md cursor-pointer flex flex-col items-center justify-center text-center group transition-all">
                                <div className="text-blue-600 mb-4 bg-blue-50 p-4 rounded-full group-hover:scale-110 transition-transform"><cat.icon size={28} /></div>
                                <h3 className="font-bold text-gray-800">{cat.title}</h3>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-24 bg-white border-t border-gray-200">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Trusted by the Community</h2>
                        <p className="text-gray-500">See what our users are saying about TuitionsInIndia.</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Student Testimonial */}
                        <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100 flex flex-col relative text-center shadow-sm">
                            <Quote className="text-blue-100 absolute top-6 right-6" size={48} />
                            <div className="mb-6 relative z-10">
                                <div className="flex justify-center text-yellow-400 mb-4">
                                    <Star size={20} className="fill-yellow-400" />
                                    <Star size={20} className="fill-yellow-400" />
                                    <Star size={20} className="fill-yellow-400" />
                                    <Star size={20} className="fill-yellow-400" />
                                    <Star size={20} className="fill-yellow-400" />
                                </div>
                                <p className="text-gray-700 italic relative z-10 leading-relaxed font-medium">"I was struggling with Physics until I found an amazing tutor through this platform. The verified reviews helped me choose confidently, and my grades have improved drastically."</p>
                            </div>
                            <div className="mt-auto pt-6 border-t border-gray-200 relative z-10">
                                <p className="font-bold text-gray-900">Priya S.</p>
                                <p className="text-sm text-gray-500 font-medium">Class 12 Student • Bangalore</p>
                            </div>
                        </div>

                        {/* Tutor Testimonial */}
                        <div className="bg-blue-600 text-white p-8 rounded-3xl border border-blue-700 flex flex-col relative text-center shadow-md">
                            <Quote className="text-blue-500 absolute top-6 right-6" size={48} />
                            <div className="mb-6 relative z-10">
                                <div className="flex justify-center text-yellow-400 mb-4">
                                    <Star size={20} className="fill-yellow-400" />
                                    <Star size={20} className="fill-yellow-400" />
                                    <Star size={20} className="fill-yellow-400" />
                                    <Star size={20} className="fill-yellow-400" />
                                    <Star size={20} className="fill-yellow-400" />
                                </div>
                                <p className="text-blue-50 italic relative z-10 leading-relaxed font-medium">"As an independent educator, getting a verified badge here completely changed my career. I now get a steady stream of highly relevant student requests within my exact locality."</p>
                            </div>
                            <div className="mt-auto pt-6 border-t border-blue-500 relative z-10">
                                <p className="font-bold">Rahul M.</p>
                                <p className="text-sm text-blue-200 font-medium">Mathematics Tutor • Delhi</p>
                            </div>
                        </div>

                        {/* Institute Testimonial */}
                        <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100 flex flex-col relative text-center shadow-sm">
                            <Quote className="text-blue-100 absolute top-6 right-6" size={48} />
                            <div className="mb-6 relative z-10">
                                <div className="flex justify-center text-yellow-400 mb-4">
                                    <Star size={20} className="fill-yellow-400" />
                                    <Star size={20} className="fill-yellow-400" />
                                    <Star size={20} className="fill-yellow-400" />
                                    <Star size={20} className="fill-yellow-400" />
                                    <Star size={20} className="fill-yellow-400" />
                                </div>
                                <p className="text-gray-700 italic relative z-10 leading-relaxed font-medium">"Managing multiple tutors and finding new students used to be a hassle. But listing our academy here significantly boosted our visibility and enrollments. Highly professional platform."</p>
                            </div>
                            <div className="mt-auto pt-6 border-t border-gray-200 relative z-10">
                                <p className="font-bold text-gray-900">Apex Learning Institute</p>
                                <p className="text-sm text-gray-500 font-medium">Coaching Center • Mumbai</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final Call to Action */}
            <section className="py-24 bg-white border-t border-gray-200 text-center">
                <div className="max-w-3xl mx-auto px-6">
                    <h2 className="text-4xl font-bold text-gray-900 mb-6">Are you a Teacher or an Institute?</h2>
                    <p className="text-xl text-gray-500 mb-10">Start getting verified leads from students in your local area and grow your tuition business today.</p>
                    
                    <div className="flex flex-col sm:flex-row justify-center gap-6">
                        <Link href="/register/tutor" className="px-10 py-5 bg-blue-600 text-white rounded-full font-bold text-lg shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all">
                            Register as Tutor
                        </Link>
                        <Link href="/register/institute" className="px-10 py-5 bg-gray-100 text-gray-800 border border-gray-300 rounded-full font-bold text-lg hover:bg-gray-200 transition-all">
                            Register as Institute
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}

function PlusCircle({ size, className, strokeWidth }) {
    return <UserPlus size={size} className={className} strokeWidth={strokeWidth} />;
}
