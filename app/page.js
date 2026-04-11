"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
export default function Home() {
  const [searchSubject, setSearchSubject] = useState("");
  const [searchGrade, setSearchGrade] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [searchCoords, setSearchCoords] = useState(null); // {lat, lng}
  const [activeTab, setActiveTab] = useState("tutors"); // tutors, students, institutes
  const [isDetecting, setIsDetecting] = useState(false);
  const [searchError, setSearchError] = useState("");
  
  const [subjects, setSubjects] = useState([]);
  const [filteredSubjects, setFilteredSubjects] = useState([]);
  const [showSubjectSuggestions, setShowSubjectSuggestions] = useState(false);
  
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [showGradeDropdown, setShowGradeDropdown] = useState(false);

  const majorCities = [
    { name: "Mumbai", lat: 19.0760, lng: 72.8777 },
    { name: "Delhi", lat: 28.6139, lng: 77.2090 },
    { name: "Bangalore", lat: 12.9716, lng: 77.5946 },
    { name: "Calcutta", lat: 22.5726, lng: 88.3639 },
    { name: "Hyderabad", lat: 17.3850, lng: 78.4867 }
  ];

  const gradesList = [
    "Primary (1-5)", "Middle (6-8)", "High School (9-10)", 
    "Higher Secondary (11-12)", "Undergraduate", "Competitive Exams", "Other"
  ];

  const router = useRouter();

  useEffect(() => {
    fetch("/api/subjects")
      .then(res => res.json())
      .then(data => setSubjects(data))
      .catch(err => console.error("Failed to fetch subjects", err));
  }, []);

  useEffect(() => {
    if (searchSubject.length > 1) {
      const filtered = subjects.filter(s => 
        s.toLowerCase().includes(searchSubject.toLowerCase())
      );
      setFilteredSubjects(filtered);
      setShowSubjectSuggestions(filtered.length > 0);
    } else {
      setShowSubjectSuggestions(false);
    }
  }, [searchSubject, subjects]);

  const handleSearch = () => {
    setSearchError("");
    if (!searchSubject || !searchGrade) {
      setSearchError("Please select both a Subject and a Grade level.");
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
    
    // Map plural tabs to singular enum roles
    const roleMapping = {
      tutors: "TUTOR",
      students: "STUDENT",
      institutes: "INSTITUTE"
    };
    params.set("role", roleMapping[activeTab] || "TUTOR");

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

  return (
    <div className="bg-white text-slate-900 font-sans min-h-screen">
      <main className="flex-grow pt-24">
        {/* REFINED MINIMALIST HERO SECTION - 100vh LOCK */}
        <section className="relative h-screen min-h-[750px] flex flex-col items-center justify-center">
          {/* Background Layer - Restored Public Asset */}
          <div className="absolute inset-0 z-0">
            <img 
              src="/indian_hero.png" 
              alt="Indian Tutor Teaching Student" 
              className="w-full h-full object-cover scale-100"
              onError={(e) => {
                e.target.src = "https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80";
              }}
            />
            {/* Darker Overlay for White Text contrast */}
            <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-[1px]"></div>
          </div>

          <div className="container-premium relative z-10 pt-32 pb-80 text-center">
            <div className="max-w-4xl mx-auto space-y-12">
              {/* Marketplace Focused Messaging - White for Premium Look */}
              <div className="space-y-3 animate-premium-fade">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-heading font-black tracking-tight text-white leading-[1.1] drop-shadow-2xl">
                  India's Trusted Marketplace for <br />
                  <span className="text-primary italic font-serif">Personalized</span> Tutoring.
                </h1>
                <p className="max-w-xl mx-auto text-[15px] text-white/90 font-medium leading-relaxed px-4 text-center drop-shadow-md opacity-80">
                  Connecting ambitious students with world-class verified tutors. <br />
                  Simple, direct, and zero-commission learning discovery.
                </p>
              </div>

              {/* CENTER-ALIGNED MINIMALIST CLEAN WHITE SEARCH HUB */}
              <div className="w-full max-w-5xl mx-auto px-4">
                <div className="bg-white rounded-xl shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)] border border-white/20 p-2 relative">
                  
                  {/* SEARCH TYPE TABS - Minimalist */}
                  <div className="flex justify-center md:justify-start gap-5 mb-1 ml-0 md:ml-6">
                    {["tutors", "students", "institutes"].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`py-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative ${activeTab === tab
                          ? "text-[#0d40a5] after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#0d40a5]"
                          : "text-slate-400 hover:text-slate-600"
                          }`}
                      >
                        {tab === "tutors" ? "Search Tutors" : tab === "students" ? "Student Leads" : "Institutes"}
                      </button>
                    ))}
                  </div>

                  {/* SEGMENTED SEARCH BAR - CLEAN WHITE MINIMAL */}
                  <div className="flex flex-col md:flex-row items-stretch gap-0 relative">
                    <div className="flex-1 relative px-6 py-4 border-b md:border-b-0 md:border-r border-slate-100 hover:bg-slate-50 transition-all rounded-t-lg md:rounded-l-lg md:rounded-tr-none">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-0.5 text-left">Subject / Skill</p>
                      <input
                        className="w-full bg-transparent text-lg font-bold text-slate-900 outline-none placeholder:text-slate-400"
                        placeholder="e.g. Mathematics"
                        type="text"
                        value={searchSubject}
                        onChange={(e) => setSearchSubject(e.target.value)}
                        onFocus={() => filteredSubjects.length > 0 && setShowSubjectSuggestions(true)}
                        onBlur={() => setTimeout(() => setShowSubjectSuggestions(false), 200)}
                      />
                      {showSubjectSuggestions && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-lg shadow-2xl z-50 max-h-60 overflow-y-auto p-2">
                          {filteredSubjects.map((s, i) => (
                            <div key={i} onClick={() => {setSearchSubject(s); setShowSubjectSuggestions(false);}} className="px-5 py-3 hover:bg-slate-50 rounded-xl cursor-pointer text-left font-bold text-sm text-slate-700">
                              {s}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex-[0.7] relative px-6 py-4 border-b md:border-b-0 md:border-r border-slate-100 hover:bg-slate-50 transition-all cursor-pointer" onClick={() => setShowGradeDropdown(!showGradeDropdown)}>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-0.5 text-left">Level / Grade</p>
                      <div className="flex justify-between items-center text-left">
                        <span className={`text-lg font-bold ${searchGrade ? "text-slate-900" : "text-slate-400"}`}>
                          {searchGrade || "Select Grade"}
                        </span>
                        <span className="material-symbols-outlined text-slate-300 text-[18px]">expand_more</span>
                      </div>
                      {showGradeDropdown && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-lg shadow-2xl z-50 max-h-60 overflow-y-auto p-2">
                          {gradesList.map((g, i) => (
                            <div key={i} onClick={() => {setSearchGrade(g); setShowGradeDropdown(false);}} className={`px-5 py-3 rounded-xl hover:bg-slate-50 cursor-pointer text-left font-bold text-sm transition-all ${searchGrade === g ? 'bg-primary/5 text-primary' : 'text-slate-700'}`}>
                              {g}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex-1 relative px-6 py-4 hover:bg-slate-50 transition-all md:rounded-r-lg cursor-pointer" onClick={() => setShowCityDropdown(!showCityDropdown)}>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-0.5 text-left">Location (5 Cities)</p>
                      <div className="flex justify-between items-center text-left">
                        <span className={`text-lg font-bold ${searchLocation ? "text-slate-900" : "text-slate-400"}`}>
                          {searchLocation || "Select City"}
                        </span>
                        <span className="material-symbols-outlined text-slate-300 text-[18px]">location_on</span>
                      </div>
                      {showCityDropdown && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-lg shadow-2xl z-50 max-h-60 overflow-y-auto p-2">
                          {["Mumbai", "Delhi", "Bangalore", "Calcutta", "Hyderabad"].map((city, i) => (
                            <div key={i} onClick={() => {setSearchLocation(city); setShowCityDropdown(false);}} className="px-5 py-4 hover:bg-slate-50 rounded-xl cursor-pointer text-left font-bold text-sm text-slate-700 flex items-center justify-between">
                              {city}
                              {searchLocation === city && <span className="material-symbols-outlined text-primary text-sm">check_circle</span>}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* SEARCH ACTION BUTTON */}
                    <div className="md:absolute md:-right-3 md:top-1/2 md:-translate-y-1/2 p-2 md:p-0">
                      <button
                        onClick={handleSearch}
                        className="w-full md:size-14 bg-[#0d40a5] text-white font-black rounded-lg hover:bg-[#0a358a] hover:shadow-2xl transition-all flex items-center justify-center group"
                      >
                        <span className="md:hidden px-4 uppercase text-[12px] tracking-widest font-black">Find Tutors</span>
                        <span className="material-symbols-outlined text-[28px]">search</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* SIMPLIFIED TRUST BADGES - WHITE VERSION */}
              <div className="mt-16 flex flex-wrap justify-center gap-16 opacity-90">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary text-xl font-bold animate-pulse">verified</span>
                  <span className="text-[11px] font-black uppercase tracking-[0.2em] text-white">Verified Identity</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary text-xl font-bold animate-pulse">home_pin</span>
                  <span className="text-[11px] font-black uppercase tracking-[0.2em] text-white">Local Experts</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary text-xl font-bold animate-pulse">payments</span>
                  <span className="text-[11px] font-black uppercase tracking-[0.2em] text-white">Direct Engagement</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Live Activity Feed - Small & Subtle */}
        <section className="bg-slate-50 py-4 border-y border-slate-100 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 whitespace-nowrap animate-marquee flex gap-12 items-center">
            {[
              "Rahul from Mumbai just booked a Physics trial",
              "New Verified Tutor joined in Bangalore: Dr. Sharma (Mathematics)",
              "Sneha unlocked 5 leads in Delhi",
              "Satisfaction Guarantee: 100% refund for your first trial if not happy",
              "AI Matchmaker: 450 matches found today",
              "New Blog: 10 Tips for Finding the Perfect Math Tutor"
            ].map((text, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="size-2 rounded-full bg-emerald-500"></div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{text}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Categories Section - Clean White Grid */}
        <section className="py-24 bg-white border-b border-slate-50">
          <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
            <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-6">
              <div className="text-center md:text-left">
                <h3 className="text-4xl font-bold mb-4">Master Any <span className="text-primary tracking-tight">Subject</span></h3>
                <p className="text-slate-500 text-lg max-w-xl font-medium">Find verified local mentors for in-person home tuition. From primary school to competitive exams.</p>
              </div>
              <Link href="/search?role=TUTOR" className="px-8 py-3 bg-slate-50 text-slate-900 border border-slate-200 rounded-2xl font-bold hover:bg-slate-100 transition-all flex items-center gap-2 group">
                Browse Local Tutors
                <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6 mb-12">
              {[
                { name: "Mathematics", icon: "calculate", color: "blue", desc: "IIT/CBSE/ICSE" },
                { name: "Science", icon: "science", color: "amber", desc: "Physics/Che/Bio" },
                { name: "English", icon: "translate", color: "emerald", desc: "Spoken/Grammar" },
                { name: "Coding", icon: "terminal", color: "purple", desc: "Python/Web/AI" },
                { name: "Music", icon: "music_note", color: "rose", desc: "Guitar/Piano/Vocal" },
                { name: "Arts", icon: "palette", color: "orange", desc: "Drawing/Painting" },
                { name: "Competitive", icon: "assignment", color: "indigo", desc: "JEE/NEET/UPSC" },
                { name: "Languages", icon: "language", color: "teal", desc: "Hindi/French/German" },
              ].map((cat, idx) => (
                <Link key={idx} href={`/search?role=TUTOR&subject=${cat.name}`}
                  className="group flex flex-col items-center p-8 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl transition-all hover:shadow-2xl hover:border-primary/5 hover:-translate-y-2">
                  <div className={`size-16 rounded-2xl bg-slate-50 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 mb-6 shadow-sm`}>
                    <span className="material-symbols-outlined text-3xl">{cat.icon}</span>
                  </div>
                  <span className="font-bold text-slate-900 mb-1 text-center">{cat.name}</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">{cat.desc}</span>
                </Link>
              ))}
            </div>

            <div className="flex justify-center">
              <Link href="/subjects" className="px-12 py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-primary transition-all shadow-xl shadow-slate-900/10 flex items-center gap-3 group">
                View All Subjects
                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Testimonials Section - Premium Design */}
        <section className="py-32 bg-slate-50/50">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <div className="text-center mb-20">
              <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-[10px] font-bold uppercase tracking-[0.2em] mb-6 inline-block">Success Stories</span>
              <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-slate-900">What our <span className="text-primary italic font-serif">Community</span> says</h2>
              <p className="text-slate-500 text-lg max-w-2xl mx-auto font-medium">Join thousands of students and educators who have transformed their academic journey with us.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  quote: "Found the perfect Physics tutor for my son within 24 hours. The AI Matchmaker is truly a game changer for busy parents.",
                  author: "Anita Sharma",
                  role: "Parent, Delhi",
                  img: "https://i.pravatar.cc/100?img=1"
                },
                {
                  quote: "As a tutor, the quality of leads here is unmatched. I've grown my teaching business by 3x in just 3 months.",
                  author: "Vikram Malhotra",
                  role: "Mathematics Expert",
                  img: "https://i.pravatar.cc/100?img=12"
                },
                {
                  quote: "I was struggling with JEE Prep, but my TuitionsInIndia tutor made complex concepts so simple. Top-tier professionals!",
                  author: "Aditya Verma",
                  role: "Student, Mumbai",
                  img: "https://i.pravatar.cc/100?img=33"
                }
              ].map((t, i) => (
                <div key={i} className="bg-white p-10 rounded-xl border border-slate-100 shadow-sm hover:shadow-xl transition-all flex flex-col">
                  <div className="flex text-amber-400 mb-6">
                    {[1, 2, 3, 4, 5].map(s => <span key={s} className="material-symbols-outlined fill-1">star</span>)}
                  </div>
                  <p className="text-slate-700 font-medium italic mb-10 flex-1 leading-relaxed">"{t.quote}"</p>
                  <div className="flex items-center gap-4">
                    <img src={t.img} alt={t.author} className="size-12 rounded-full object-cover" />
                    <div>
                      <p className="font-bold text-slate-900">{t.author}</p>
                      <p className="text-xs font-bold text-slate-400 uppercase items-center tracking-widest">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* UNIFIED HOW IT WORKS - 3 STEP FLOW */}
        <section className="py-32 bg-slate-50/50">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <div className="text-center mb-20 text-slate-900">
              <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-[10px] font-bold uppercase tracking-[0.2em] mb-6 inline-block">Simple Methodology</span>
              <h2 className="text-4xl lg:text-5xl font-bold mb-6">How it <span className="text-primary">Works</span></h2>
              <p className="text-slate-500 text-lg max-w-2xl mx-auto font-medium">Your journey to academic excellence simplified into three easy stages.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
              {/* Connector Line (Desktop) */}
              <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 -translate-y-24 z-0"></div>
              
              {[
                { step: "01", title: "Discover & Match", desc: "Search through thousands of verified tutors or use our AI Matchmaker to find your perfect academic partner.", icon: "person_search" },
                { step: "02", title: "Verify & Connect", desc: "Review profiles, check background verification, and connect directly with tutors to discuss your goals.", icon: "verified_user" },
                { step: "03", title: "Start Learning", desc: "Schedule your first trial class and begin your personalized education journey with 100% platform support.", icon: "calendar_month" }
              ].map((item, i) => (
                <div key={i} className="relative z-10 flex flex-col items-center text-center group">
                  <div className="size-20 rounded-full bg-white border border-slate-100 flex items-center justify-center text-primary text-2xl font-black shadow-xl group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-500 mb-8">
                    <span className="material-symbols-outlined text-3xl">{item.icon}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-slate-900">{item.title}</h3>
                  <p className="text-slate-500 text-sm font-medium leading-relaxed px-4">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ SECTION - ACCORDION STYLE */}
        <section className="py-32 bg-white">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-20">
              <h2 className="text-4xl font-bold text-slate-900 mb-6">Common <span className="text-primary italic font-serif">Questions</span></h2>
              <p className="text-slate-500 font-medium">Everything you need to know about India's elite tuition marketplace.</p>
            </div>

            <div className="space-y-4">
              {[
                { q: "How do I find a verified tutor?", a: "Simply use our segmented search bar on the hero section. You can filter by subject, grade, and city to find the best local matches." },
                { q: "Are all tutors background checked?", a: "Yes, we implement a multi-stage verification process including ID checks and academic credential verification for all listed tutors." },
                { q: "How much does it cost?", a: "TuitionsInIndia is a transparent marketplace. Tutors set their own rates, and we charge zero commission on your payments to them." },
                { q: "Can I request a trial class?", a: "Most of our elite tutors offer a trial session to ensure a perfect match before commitment. Look for the 'Trial Available' badge on profiles." }
              ].map((faq, i) => (
                <details key={i} className="group bg-slate-50 rounded-3xl border border-slate-100 open:bg-white open:shadow-2xl transition-all duration-300">
                  <summary className="flex items-center justify-between p-8 cursor-pointer list-none">
                    <span className="text-lg font-bold text-slate-900">{faq.q}</span>
                    <span className="material-symbols-outlined text-primary group-open:rotate-180 transition-transform">expand_more</span>
                  </summary>
                  <div className="p-8 pt-0 text-slate-500 font-medium leading-relaxed">
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Selection */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <div className="bg-primary rounded-[3.5rem] p-12 lg:p-24 text-white relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-[120px] -mr-40 -mt-40"></div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10">
                <div>
                  <h2 className="text-4xl lg:text-6xl font-bold mb-8 leading-tight">Join the Elite <br /><span className="text-accent italic font-serif">Academic Circle</span></h2>
                  <p className="text-white/70 text-lg font-medium mb-12">Whether you need homework help or a career-defining certification, we have the resources to get you there.</p>
                  <div className="flex gap-4">
                    <Link href="/pricing/student" className="px-8 py-4 bg-white text-primary font-bold rounded-2xl hover:bg-slate-50 transition-all shadow-xl">Detailed Pricing</Link>
                    <Link href="/kb/student" className="px-8 py-4 bg-white/10 border border-white/20 text-white font-bold rounded-2xl hover:bg-white/20 transition-all">Knowledge Base</Link>
                  </div>
                </div>
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-10 space-y-8">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="size-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                        <span className="material-symbols-outlined">shield</span>
                      </div>
                      <span className="font-bold">Verified Leads</span>
                    </div>
                    <span className="text-emerald-400 font-bold">100% Secure</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="size-10 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center">
                        <span className="material-symbols-outlined">support_agent</span>
                      </div>
                      <span className="font-bold">24/7 Support</span>
                    </div>
                    <span className="text-blue-400 font-bold">Always Live</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="size-10 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center">
                        <span className="material-symbols-outlined">payments</span>
                      </div>
                      <span className="font-bold">Direct Payments</span>
                    </div>
                    <span className="text-orange-400 font-bold">No Commission</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-32 bg-white text-center">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-5xl font-bold text-slate-900 mb-8 leading-tight">Ready to start your <br /><span className="text-primary italic font-serif">Success Story?</span></h2>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/get-started" className="px-12 py-5 bg-primary text-white font-bold rounded-2xl hover:opacity-90 transition-all shadow-xl shadow-primary/20 text-lg">Detailed Enrollment</Link>
              <Link href="/post-requirement" className="px-12 py-5 bg-slate-50 text-slate-900 border border-slate-200 font-bold rounded-2xl hover:bg-slate-100 transition-all text-lg">Post Requirement</Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer - Compact & Horizontal */}
      <footer className="bg-slate-50 border-t border-slate-100 py-8">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 pb-8 border-b border-slate-200">
            <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
              <Link href="/" className="shrink-0">
                <img src="/logo_horizontal.png" alt="Tuitions In India" className="h-10 w-auto object-contain" />
              </Link>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest max-w-xs">
                India's leading managed marketplace for private tuitions since 2024.
              </p>
            </div>

            <nav className="flex flex-wrap justify-center gap-x-8 gap-y-4">
              <Link href="/tutors" className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-primary transition-colors">Find Tutors</Link>
              <Link href="/ai-match" className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-primary transition-colors">AI Matchmaker</Link>
              <Link href="/pricing/student" className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-primary transition-colors">Pricing</Link>
              <Link href="/register/tutor" className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-primary transition-colors">Join as Tutor</Link>
              <Link href="/how-it-works/tutor" className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-primary transition-colors">Methodology</Link>
              <Link href="/legal/privacy" className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-primary transition-colors">Privacy</Link>
              <Link href="/legal/terms" className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-primary transition-colors">Terms</Link>
            </nav>

            <div className="flex gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="size-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-primary transition-colors cursor-pointer">
                  <span className="material-symbols-outlined text-lg">share</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8">
            <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.2em]">© 2026 TuitionsInIndia. Proudly Made in India.</p>
            <div className="flex items-center gap-4 opacity-40 grayscale hover:grayscale-0 transition-all">
              <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/Razorpay_logo.svg" alt="Razorpay" className="h-4" />
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
