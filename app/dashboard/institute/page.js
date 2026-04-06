"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Script from "next/script";
import Link from "next/link";
import { 
    Building2, 
    LayoutDashboard, 
    BookOpen, 
    Megaphone, 
    Users, 
    CreditCard, 
    ShieldCheck, 
    PlusCircle, 
    ArrowRight, 
    CheckCircle2, 
    Search, 
    Lock, 
    Trash2, 
    X, 
    Zap, 
    TrendingUp, 
    Award,
    BadgeCheck,
    Globe,
    Target
} from "lucide-react";

function InstituteDashboardContent() {
    const searchParams = useSearchParams();
    const [instituteId, setInstituteId] = useState(searchParams.get("instituteId") || "");
    const [leads, setLeads] = useState([]);
    const [courses, setCourses] = useState([]);
    const [ads, setAds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [instituteData, setInstituteData] = useState(null);
    const [stats, setStats] = useState(null);
    const [activeTab, setActiveTab] = useState("leads"); // leads, courses, ads

    // Course Form State
    const [showCourseForm, setShowCourseForm] = useState(false);
    const [newCourse, setNewCourse] = useState({ title: "", description: "", duration: "", price: "", category: "Academic" });

    useEffect(() => {
        if (instituteId) {
            fetchInstituteData();
            fetchStats();
            if (activeTab === "leads") fetchLeads();
            if (activeTab === "courses") fetchCourses();
            if (activeTab === "ads") fetchAds();
        }
    }, [instituteId, activeTab]);

    const fetchStats = async () => {
        try {
            const res = await fetch(`/api/tutor/stats?tutorId=${instituteId}`);
            if (res.ok) {
                const data = await res.json();
                setStats(data);
            }
        } catch (err) { console.error(err); }
    };

    const fetchLeads = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/lead/list?tutorId=${instituteId}`);
            const data = await res.json();
            setLeads(data);
        } catch (err) { console.error(err); } finally { setLoading(false); }
    };

    const fetchCourses = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/institute/courses?instituteId=${instituteId}`);
            const data = await res.json();
            setCourses(data);
        } catch (err) { console.error(err); } finally { setLoading(false); }
    };

    const fetchAds = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/institute/ads?userId=${instituteId}`);
            const data = await res.json();
            setAds(data);
        } catch (err) { console.error(err); } finally { setLoading(false); }
    };

    const fetchInstituteData = async () => {
        try {
            const res = await fetch(`/api/user/info?id=${instituteId}`);
            if (res.ok) {
                const data = await res.json();
                setInstituteData(data);
            }
        } catch (err) { console.error(err); }
    };

    const handleAddCourse = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch("/api/institute/courses", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...newCourse, instituteId }),
            });
            if (res.ok) {
                alert("Course added!");
                setShowCourseForm(false);
                fetchCourses();
            }
        } catch (err) { console.error(err); }
    };

    const handleUnlock = async (leadId) => {
        if (!confirm("Unlock this lead?")) return;
        try {
            const res = await fetch("/api/lead/unlock", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ leadId, tutorId: instituteId }),
            });
            if (res.ok) {
                alert("Lead unlocked!");
                fetchLeads();
                fetchInstituteData();
            } else {
                const err = await res.json();
                alert(err.error || "Failed to unlock.");
            }
        } catch (err) { console.error(err); }
    };


    const handleKYCUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("userId", instituteId);
            formData.append("documentType", "GOVERNMENT_ID");

            alert("Uploading document for verification...");

            const res = await fetch("/api/kyc/upload", {
                method: "POST",
                body: formData,
            });

            if (res.ok) {
                alert("Document verified successfully!");
                fetchInstituteData(); // Refresh UI to show CLEAR status
            } else {
                alert("Failed to verify document.");
            }
        } catch (err) { console.error(err); }
    };

    if (!instituteId) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background-dark p-4 font-sans relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[600px] bg-primary/10 rounded-full blur-[120px] -z-10 animate-pulse"></div>
                <div className="bg-surface-dark/40 backdrop-blur-3xl p-10 rounded-[2.5rem] shadow-2xl border border-border-dark max-w-md w-full relative z-10 text-center">
                    <div className="size-20 rounded-3xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 mx-auto mb-8 border border-indigo-500/20">
                        <Building2 size={40} strokeWidth={1.5} />
                    </div>
                    <h2 className="text-3xl font-black text-white mb-3 tracking-tighter uppercase italic">Institutional Portal.</h2>
                    <p className="text-on-surface-dark/40 mb-10 text-[11px] font-black uppercase tracking-widest leading-relaxed italic">Verification required to access the B2B academic command center.</p>
                    <input
                        type="text"
                        placeholder="ENTER INSTITUTE PROTOCOL ID"
                        className="w-full bg-background-dark/50 border border-border-dark rounded-2xl p-5 text-white font-black text-xs uppercase tracking-widest focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-white/10 mb-6"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                setInstituteId(e.target.value);
                            }
                        }}
                        id="instInput"
                    />
                    <button
                        className="group w-full bg-indigo-600 text-white font-black py-5 rounded-2xl hover:bg-indigo-700 shadow-2xl shadow-indigo-500/20 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-xs active:scale-95 leading-none"
                        onClick={() => {
                            const id = document.getElementById('instInput').value;
                            setInstituteId(id);
                        }}>
                        AUTHORIZE ACCESS <ArrowRight size={16} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                    <Link href="/" className="inline-block mt-8 text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-dark/20 hover:text-indigo-500 transition-colors italic border-b border-transparent hover:border-indigo-500 pb-1">Bypass Terminal</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="relative flex min-h-screen flex-col bg-background-dark font-sans text-on-background-dark antialiased selection:bg-indigo-500/20 selection:text-indigo-500">
            <header className="sticky top-0 z-[60] w-full border-b border-border-dark bg-background-dark/80 backdrop-blur-2xl px-6 md:px-12 py-5 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="size-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/20 group-hover:scale-110 transition-transform">
                        <Building2 size={20} strokeWidth={2.5} />
                    </div>
                    <div className="flex flex-col leading-none">
                        <span className="text-xl font-black tracking-tighter text-white uppercase italic">tuitionsinindia</span>
                        <span className="text-[10px] font-black text-indigo-500/40 tracking-[0.4em] uppercase">Institute Terminal</span>
                    </div>
                </Link>

                <div className="flex items-center gap-4 md:gap-8">
                    <div className="hidden sm:flex items-center gap-4 px-6 py-3 bg-surface-dark border border-border-dark rounded-2xl hover:border-indigo-500/30 transition-colors cursor-default group">
                        <div className="text-right">
                             <p className="text-[9px] font-black uppercase tracking-widest text-on-surface-dark/30 leading-none mb-1">Corporate Asset</p>
                            <p className="text-sm font-black text-indigo-500 leading-none tracking-tighter uppercase italic">{instituteData?.subscriptionTier || "BASE"} <span className="opacity-40 not-italic">TIER</span></p>
                        </div>
                        <div className="size-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            <Zap size={16} fill="currentColor" />
                        </div>
                    </div>

                    <div className="flex items-center gap-4 pl-6 border-l border-border-dark">
                        <div className="flex flex-col text-right hidden lg:block leading-none">
                            <span className="text-[10px] font-black text-white uppercase tracking-widest">{instituteData?.name || "AUTHENTICATED_ENTITY"}</span>
                            <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mt-1 italic">Verified Partner</span>
                        </div>
                        <div className="size-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-800 border border-white/10 shadow-2xl flex items-center justify-center text-white font-black text-lg italic tracking-tighter">
                            {(instituteData?.name || "I")[0].toUpperCase()}
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex flex-1">
                {/* Fixed B2B Sidebar */}
                <aside className="fixed left-0 top-[85px] bottom-0 w-80 bg-surface-dark/20 backdrop-blur-3xl border-r border-border-dark p-10 hidden xl:flex flex-col">
                    <div className="mb-12">
                        <h4 className="text-[10px] font-black text-on-surface-dark/20 uppercase tracking-[0.4em] mb-8 italic">Management Controls</h4>
                        <nav className="space-y-3">
                            {[
                                { id: "leads", icon: Target, label: "STUDENT LEADS" },
                                { id: "courses", icon: BookOpen, label: "MY COURSES" },
                                { id: "ads", icon: Megaphone, label: "ADS & PROMO" }
                            ].map((item) => (
                                <button 
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id)}
                                    className={`w-full flex items-center gap-4 px-6 py-5 rounded-2xl font-black text-[11px] tracking-widest transition-all group active:scale-95 leading-none italic border ${activeTab === item.id ? 'bg-indigo-600 text-white border-transparent shadow-xl shadow-indigo-600/20' : 'bg-transparent text-on-surface-dark/40 border-transparent hover:bg-surface-dark hover:text-indigo-500 hover:border-border-dark'}`}
                                >
                                    <item.icon size={18} strokeWidth={2.5} className={activeTab === item.id ? 'opacity-100' : 'opacity-40 group-hover:opacity-100'} />
                                    {item.label}
                                    {activeTab === item.id && <ArrowRight size={14} strokeWidth={3} className="ml-auto opacity-40 animate-pulse" />}
                                </button>
                            ))}
                        </nav>
                    </div>

                    <div className="mt-auto p-10 rounded-[3rem] bg-surface-dark border border-border-dark text-on-surface-dark relative overflow-hidden group">
                        <div className="absolute top-0 right-0 size-32 bg-indigo-600/10 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-indigo-600/20 transition-colors"></div>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500 mb-4 italic">B2B Inventory</h4>
                        <p className="text-xl font-black text-white leading-none tracking-tighter italic mb-4">{instituteData?.credits || 0} <span className="text-[10px] not-italic opacity-20">POINTS</span></p>
                        <p className="text-[9px] font-black text-on-surface-dark/30 leading-relaxed mb-8 uppercase tracking-widest">Acquire premium student mandates instantly.</p>
                        <Link href={`/dashboard/subscription?tutorId=${instituteId}`} className="block w-full bg-white text-black py-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all shadow-xl active:scale-95 leading-none text-center">
                            SCALE PROTOCOL
                        </Link>
                    </div>
                </aside>

                {/* Institute Workspace */}
                <main className="flex-1 xl:pl-80 p-6 md:p-12 lg:p-16">
                    <div className="max-w-7xl mx-auto">
                        {/* High-Impact Hero */}
                        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 mb-24">
                            <div className="max-w-2xl relative">
                                <div className="absolute -left-12 top-0 text-[180px] font-black text-white/5 leading-none tracking-tighter italic select-none pointer-events-none uppercase">INST</div>
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/5 rounded-full border border-indigo-500/10 mb-8 relative z-10">
                                    <span className="size-2 rounded-full bg-indigo-500 animate-pulse"></span>
                                    <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest italic">Protocol: Corporate Academic Suite</span>
                                </div>
                                <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 uppercase italic leading-[0.85] relative z-10 text-white">
                                    Strategic <span className="text-indigo-500 underline decoration-indigo-500/20 decoration-8 underline-offset-8">Output.</span>
                                </h1>
                                <p className="text-xl text-on-surface-dark/60 font-medium leading-relaxed max-w-xl relative z-10">
                                    Welcome back, <span className="text-white font-black italic">{instituteData?.name || "Managing Director"}</span>. Tracking assets for {activeTab === 'leads' ? 'Student Mandates' : activeTab === 'courses' ? 'Institutional Batches' : 'Market Presence'}.
                                </p>
                            </div>
                            {activeTab === 'courses' && (
                                <div className="flex gap-4 relative z-10">
                                    <button onClick={() => setShowCourseForm(true)} className="group relative flex items-center gap-4 px-12 py-6 bg-indigo-600 text-white rounded-[2rem] font-black text-[11px] tracking-widest shadow-2xl shadow-indigo-600/20 hover:scale-[1.05] transition-all active:scale-95 uppercase leading-none box-border">
                                       <PlusCircle size={18} strokeWidth={3} />
                                       PUBLISH BATCH
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Verification & Trust Center (Embedded) */}
                        <div className="mb-24 bg-surface-dark/40 backdrop-blur-xl rounded-[4rem] border border-border-dark p-12 shadow-2xl relative overflow-hidden group border-b-8 hover:border-indigo-500/30 transition-all duration-700">
                             <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-[0.1] transition-all duration-1000 group-hover:scale-125 group-hover:rotate-6 text-white pointer-events-none">
                                <ShieldCheck size={200} strokeWidth={1} />
                            </div>
                            <div className="relative z-10 max-w-3xl">
                                <div className="flex items-center gap-3 text-indigo-500 mb-4 leading-none">
                                    <BadgeCheck size={20} strokeWidth={2.5} />
                                    <span className="text-[10px] font-black uppercase tracking-[0.4em] italic">Institutional Clearance Hub</span>
                                </div>
                                <h2 className="text-4xl font-black text-white mb-6 uppercase italic tracking-tighter">Verification <span className="text-indigo-500 not-italic font-serif font-light lowercase">Status.</span></h2>
                                <p className="text-on-surface-dark/40 mb-12 font-medium text-sm italic uppercase tracking-widest leading-loose">"The academy rewards verified entities with higher discovery placement and premium lead affinity."</p>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    {[
                                        { label: "Owner Phone", val: instituteData?.phone ? 'AUTHENTICATED' : 'SYNC_PENDING', verified: instituteData?.phone, icon: Phone },
                                        { label: "Entity Profile", val: instituteData?.isIdVerified ? 'CLEARED' : 'UNVERIFIED', verified: instituteData?.isIdVerified, icon: Globe }
                                    ].map((item, i) => (
                                        <div key={i} className="bg-background-dark/80 p-8 rounded-[2.5rem] flex items-center justify-between border border-border-dark border-b-4 hover:bg-surface-dark transition-all group/item shadow-inner">
                                            <div className="flex items-center gap-6">
                                                <div className={`size-14 rounded-2xl flex items-center justify-center border border-border-dark shadow-2xl group-hover/item:scale-105 transition-transform ${item.verified ? 'bg-indigo-600 text-white' : 'bg-surface-dark text-on-surface-dark/20'}`}>
                                                    <item.icon size={22} strokeWidth={2.5} />
                                                </div>
                                                <div>
                                                    <p className="text-[9px] font-black uppercase tracking-[0.3em] text-on-surface-dark/20 mb-1 leading-none">{item.label}</p>
                                                    <p className={`text-sm font-black uppercase italic tracking-widest leading-none ${item.verified ? 'text-white' : 'text-amber-500/60'}`}>{item.val}</p>
                                                </div>
                                            </div>
                                            {!item.verified && (
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500 hover:text-white transition-colors flex items-center gap-2 cursor-pointer">
                                                    INITIATE <ArrowRight size={10} strokeWidth={4} />
                                                    <input type="file" className="hidden" onChange={handleKYCUpload} accept=".pdf,.jpg,.jpeg,.png" />
                                                </label>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Content Tab Area */}
                        <div className="relative">
                            {activeTab === "leads" && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pb-24">
                                    {loading ? (
                                        <div className="col-span-2 py-40 flex flex-col items-center justify-center opacity-50 bg-surface-dark/20 rounded-[4rem] border border-border-dark">
                                            <div className="size-20 rounded-[2rem] border-[8px] border-indigo-500/5 border-t-indigo-500 animate-spin mb-10 shadow-2xl"></div>
                                            <p className="font-black text-[12px] uppercase tracking-[0.6em] italic">Synthesizing Mandate Grid...</p>
                                        </div>
                                    ) : leads.length > 0 ? (
                                        leads.map((lead) => (
                                            <div key={lead.id} className="group relative bg-surface-dark/40 backdrop-blur-md border border-border-dark rounded-[3.5rem] p-12 hover:shadow-[0_40px_100px_-20px_rgba(79,70,229,0.15)] hover:border-indigo-500/30 transition-all duration-700 overflow-hidden border-b-8 flex flex-col h-full">
                                                <div className="relative z-10">
                                                    <div className="flex justify-between items-center mb-10">
                                                        <span className="px-6 py-2.5 bg-indigo-500/10 text-indigo-500 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-500/20 leading-none italic">{lead.subject}</span>
                                                        <div className="flex items-center gap-2 px-3 py-1 bg-background-dark/80 rounded-lg text-emerald-500/60 text-[9px] font-black uppercase tracking-widest leading-none border border-emerald-500/10">ACTIVE_DEMAND</div>
                                                    </div>
                                                    <h3 className="text-3xl font-black text-white mb-4 leading-[1.05] tracking-tighter uppercase italic group-hover:text-indigo-400 transition-colors">"{lead.description}"</h3>
                                                    <div className="flex items-center gap-3 text-[10px] font-black text-on-surface-dark/40 uppercase tracking-widest mb-12 italic opacity-60">
                                                        <Search size={14} className="text-indigo-500" strokeWidth={3} />
                                                        LOCATION: {lead.location}
                                                    </div>
                                                    <button onClick={() => handleUnlock(lead.id)} className="w-full bg-indigo-600 text-white font-black py-8 rounded-[2.5rem] flex items-center justify-center gap-4 text-[12px] tracking-[0.4em] uppercase transition-all shadow-2xl shadow-indigo-600/20 active:scale-95 leading-none">
                                                        <Lock size={18} strokeWidth={3} className="opacity-40" />
                                                        ACQUIRE MANDATE
                                                    </button>
                                                </div>
                                                <div className="absolute -bottom-24 -right-24 size-80 bg-indigo-600/5 rounded-full blur-[120px] pointer-events-none group-hover:bg-indigo-600/10 transition-colors"></div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="col-span-2 py-40 text-center bg-surface-dark/10 rounded-[5rem] border-4 border-dashed border-border-dark p-20 relative overflow-hidden group">
                                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                            <div className="size-32 rounded-[3.5rem] bg-surface-dark border border-border-dark shadow-2xl flex items-center justify-center mx-auto mb-10 group-hover:scale-110 group-hover:rotate-12 transition-all duration-700">
                                                <Target size={48} className="opacity-10 text-white" strokeWidth={1} />
                                            </div>
                                            <p className="text-on-surface-dark/20 font-black uppercase tracking-[0.8em] italic">No active pipelines found</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === "courses" && (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-24">
                                    {courses.length > 0 ? (
                                        courses.map(course => (
                                            <div key={course.id} className="bg-surface-dark/40 backdrop-blur-md rounded-[3rem] border border-border-dark p-10 hover:shadow-2xl hover:border-indigo-500/30 transition-all duration-500 relative overflow-hidden group border-b-8">
                                                <div className="flex justify-between items-start mb-10 relative z-10">
                                                    <span className="px-5 py-2 bg-emerald-500/10 text-emerald-500 text-[10px] font-black rounded-full uppercase tracking-widest italic border border-emerald-500/20 leading-none">{course.category}</span>
                                                    <p className="text-3xl font-black text-white italic tracking-tighter uppercase leading-none">₹{course.price}</p>
                                                </div>
                                                <h4 className="font-black text-2xl text-white mb-3 uppercase italic tracking-tighter leading-tight group-hover:text-indigo-400 transition-colors">{course.title}</h4>
                                                <p className="text-[10px] font-black text-on-surface-dark/40 mb-12 uppercase tracking-[0.2em] italic flex items-center gap-2">
                                                    <Clock size={12} className="text-indigo-500" /> {course.duration}
                                                </p>
                                                <div className="flex gap-4 relative z-10">
                                                    <button className="flex-1 py-5 bg-background-dark/80 border border-border-dark text-on-surface-dark/20 rounded-2xl text-[10px] font-black uppercase tracking-widest cursor-not-allowed leading-none italic">EDIT_LOCKED</button>
                                                    <button className="size-16 bg-red-500/5 text-red-500 rounded-2xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all active:scale-95 border border-red-500/10">
                                                        <Trash2 size={20} strokeWidth={2.5} />
                                                    </button>
                                                </div>
                                                 <div className="absolute -bottom-24 -right-24 size-64 bg-indigo-500/5 rounded-full blur-[80px] pointer-events-none transition-opacity opacity-0 group-hover:opacity-100"></div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="col-span-3 py-40 text-center bg-surface-dark/10 rounded-[5rem] border-4 border-dashed border-border-dark p-20 relative overflow-hidden group">
                                             <div className="size-24 rounded-[2.5rem] bg-surface-dark border border-border-dark flex items-center justify-center mx-auto mb-10">
                                                <BookOpen size={40} className="opacity-10 text-white" strokeWidth={1} />
                                            </div>
                                            <p className="text-on-surface-dark/20 font-black uppercase tracking-[0.6em] italic">Protocol Inventory Empty</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === "ads" && (
                                <div className="max-w-4xl mx-auto py-24 text-center">
                                    <div className="size-32 rounded-[3.5rem] bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 flex items-center justify-center mx-auto mb-12 shadow-2xl relative group cursor-default">
                                        <div className="absolute inset-0 bg-indigo-600/10 rounded-[3.5rem] animate-ping opacity-20"></div>
                                        <Award size={48} className="relative z-10 transition-transform group-hover:scale-110" strokeWidth={1} />
                                    </div>
                                    <h2 className="text-5xl font-black mb-8 uppercase italic tracking-tighter text-white">Market <span className="text-indigo-500 not-italic font-serif font-light lowercase">Authority.</span></h2>
                                    <p className="text-xl text-on-surface-dark/60 font-medium leading-relaxed mb-20 italic">"Accelerate institutional authority by placing Batches on the global homepage and prioritzer search matrices."</p>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-left">
                                        <div className="p-10 bg-surface-dark/40 backdrop-blur-xl border border-border-dark rounded-[3.5rem] hover:shadow-2xl transition-all duration-500 border-l-8 border-l-indigo-600 group">
                                            <div className="size-16 rounded-2xl bg-indigo-600/5 border border-indigo-600/10 flex items-center justify-center mb-10 text-indigo-600 group-hover:scale-110 transition-transform">
                                                <TrendingUp size={28} strokeWidth={2.5} />
                                            </div>
                                            <h4 className="text-2xl font-black text-white mb-4 uppercase italic tracking-tighter">Strategic Banner</h4>
                                            <p className="text-[12px] font-black text-on-surface-dark/40 mb-10 uppercase tracking-widest leading-loose">Integrate your institution on the primary portal slider.</p>
                                            <button className="flex items-center gap-4 text-indigo-500 font-black text-[10px] uppercase tracking-[0.3em] hover:text-white transition-colors">CONNECT_SALES <ArrowRight size={14} strokeWidth={3} /></button>
                                        </div>
                                        <div className="p-10 bg-surface-dark/40 backdrop-blur-xl border border-border-dark rounded-[3.5rem] hover:shadow-2xl transition-all duration-500 border-l-8 border-l-amber-500 group">
                                            <div className="size-16 rounded-2xl bg-amber-500/5 border border-amber-500/10 flex items-center justify-center mb-10 text-amber-500 group-hover:scale-110 transition-transform">
                                                <Target size={28} strokeWidth={2.5} />
                                            </div>
                                            <h4 className="text-2xl font-black text-white mb-4 uppercase italic tracking-tighter">Discovery Priority</h4>
                                            <p className="text-[12px] font-black text-on-surface-dark/40 mb-10 uppercase tracking-widest leading-loose">Appear as the primary mandate match for city-wide subjects.</p>
                                            <button className="flex items-center gap-4 text-amber-500 font-black text-[10px] uppercase tracking-[0.3em] hover:text-white transition-colors">CONNECT_SALES <ArrowRight size={14} strokeWidth={3} /></button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>

            {/* Course Form Modal */}
            {showCourseForm && (
                <div className="fixed inset-0 z-[100] bg-background-dark/90 backdrop-blur-3xl flex items-center justify-center p-6">
                    <div className="bg-surface-dark border border-border-dark rounded-[4rem] p-16 max-w-2xl w-full shadow-[0_0_150px_-20px_rgba(79,70,229,0.2)] relative overflow-hidden border-b-[12px] animate-in fade-in zoom-in duration-500">
                         <div className="absolute top-0 right-0 p-12 opacity-[0.03] text-white pointer-events-none">
                            <BookOpen size={180} strokeWidth={1} />
                        </div>
                        <button onClick={() => setShowCourseForm(false)} className="absolute right-12 top-12 text-on-surface-dark/20 hover:text-white transition-colors">
                            <X size={32} strokeWidth={3} />
                        </button>
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 text-indigo-500 mb-4 leading-none">
                                <PlusCircle size={20} strokeWidth={2.5} />
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] italic">Mandate Creation Protocol</span>
                            </div>
                            <h2 className="text-5xl font-black mb-12 uppercase italic tracking-tighter text-white leading-none">New <span className="text-indigo-500">Batch.</span></h2>
                            <form onSubmit={handleAddCourse} className="space-y-10">
                                <div>
                                    <label className="text-[10px] font-black uppercase text-on-surface-dark/40 mb-3 block tracking-widest italic">Inventory Label (Title)</label>
                                    <input required type="text" className="w-full bg-background-dark/50 border border-border-dark p-6 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 text-white font-black uppercase tracking-widest text-xs transition-all placeholder:text-white/5" placeholder="E.G., UPSC_FOUNDATION_2024" value={newCourse.title} onChange={e => setNewCourse({ ...newCourse, title: e.target.value })} />
                                </div>
                                <div className="grid grid-cols-2 gap-8">
                                    <div>
                                        <label className="text-[10px] font-black uppercase text-on-surface-dark/40 mb-3 block tracking-widest italic">Latency (Duration)</label>
                                        <input required type="text" className="w-full bg-background-dark/50 border border-border-dark p-6 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 text-white font-black uppercase tracking-widest text-xs transition-all placeholder:text-white/5" placeholder="E.G., 6_MONTHS" value={newCourse.duration} onChange={e => setNewCourse({ ...newCourse, duration: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black uppercase text-on-surface-dark/40 mb-3 block tracking-widest italic">Value (INR)</label>
                                        <input required type="number" className="w-full bg-background-dark/50 border border-border-dark p-6 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 text-white font-black uppercase tracking-widest text-xs transition-all placeholder:text-white/5" placeholder="E.G., 15000" value={newCourse.price} onChange={e => setNewCourse({ ...newCourse, price: e.target.value })} />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase text-on-surface-dark/40 mb-3 block tracking-widest italic">Vector Category</label>
                                    <select className="w-full bg-background-dark/50 border border-border-dark p-6 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 text-white font-black uppercase tracking-[0.2em] text-[10px] transition-all appearance-none cursor-pointer" value={newCourse.category} onChange={e => setNewCourse({ ...newCourse, category: e.target.value })}>
                                        <option className="bg-background-dark">ACADEMIC</option>
                                        <option className="bg-background-dark">COMPETITIVE</option>
                                        <option className="bg-background-dark">VOCATIONAL</option>
                                        <option className="bg-background-dark">LANGUAGES</option>
                                    </select>
                                </div>
                                <button type="submit" className="w-full bg-indigo-600 text-white font-black py-8 rounded-[2.5rem] shadow-2xl shadow-indigo-600/20 mt-6 uppercase tracking-[0.4em] text-[12px] italic hover:bg-white hover:text-indigo-600 transition-all active:scale-95 leading-none">EXECUTE_PUBLISH</button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function InstituteDashboard() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen bg-background-dark font-sans overflow-hidden relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[400px] bg-indigo-600/10 rounded-full blur-[100px] animate-pulse"></div>
                <div className="flex flex-col items-center relative z-10">
                    <div className="size-24 bg-surface-dark border border-border-dark rounded-[2.5rem] flex items-center justify-center mb-10 shadow-2xl animate-spin-slow">
                         <div className="size-12 bg-indigo-600/20 rounded-2xl flex items-center justify-center">
                            <Building2 size={28} className="text-indigo-600 animate-pulse" />
                         </div>
                    </div>
                    <p className="font-black text-[12px] text-on-surface-dark/20 uppercase tracking-[0.6em] italic animate-pulse">Initializing Corporate Terminal...</p>
                </div>
            </div>
        }>
            <InstituteDashboardContent />
        </Suspense>
    );
}
