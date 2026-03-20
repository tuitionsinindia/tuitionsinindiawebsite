"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Script from "next/script";
import Link from "next/link";

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

    if (!instituteId) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-50 p-4 font-sans relative text-center">
                <div className="bg-white p-10 rounded-3xl shadow-2xl border border-slate-100 max-w-md w-full relative z-10">
                    <div className="size-16 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 mx-auto mb-6">
                        <span className="material-symbols-outlined text-3xl">corporate_fare</span>
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Institute Portal</h2>
                    <input
                        type="text"
                        placeholder="Enter Institute ID"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 mb-4 outline-none focus:ring-2 focus:ring-indigo-500"
                        onKeyDown={(e) => e.key === 'Enter' && setInstituteId(e.target.value)}
                        id="instInput"
                    />
                    <button className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl shadow-lg" onClick={() => setInstituteId(document.getElementById('instInput').value)}>Access Dashboard</button>
                    <Link href="/" className="inline-block mt-4 text-sm text-slate-400">Return Home</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen flex-col bg-slate-50 font-sans text-slate-900">
            <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md px-10 py-4 flex items-center justify-between shadow-sm">
                <Link href="/"><img src="/logo_horizontal.png" alt="Logo" className="h-10 w-auto" /></Link>
                <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold">{instituteData?.name || "Institute"}</p>
                        <p className="text-xs text-indigo-600 font-bold uppercase">{instituteData?.subscriptionTier || "FREE"} TIER</p>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold shadow-lg">
                        {(instituteData?.name || "I")[0].toUpperCase()}
                    </div>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                <aside className="w-64 border-r border-slate-200 bg-white p-6 gap-2 flex flex-col h-[calc(100vh-73px)] sticky top-[73px]">
                    <nav className="space-y-1">
                        <button onClick={() => setActiveTab("leads")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'leads' ? 'bg-indigo-50 text-indigo-600 shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}>
                            <span className="material-symbols-outlined text-[20px]">ads_click</span>
                            <span className="text-sm">Student Leads</span>
                        </button>
                        <button onClick={() => setActiveTab("courses")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'courses' ? 'bg-indigo-50 text-indigo-600 shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}>
                            <span className="material-symbols-outlined text-[20px]">school</span>
                            <span className="text-sm">My Courses</span>
                        </button>
                        <button onClick={() => setActiveTab("ads")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'ads' ? 'bg-indigo-50 text-indigo-600 shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}>
                            <span className="material-symbols-outlined text-[20px]">campaign</span>
                            <span className="text-sm">Ads & Promo</span>
                        </button>
                    </nav>

                    <div className="mt-auto bg-indigo-600 p-6 rounded-[2rem] text-white shadow-xl shadow-indigo-100">
                        <h4 className="font-bold mb-2">Credits: {instituteData?.credits || 0}</h4>
                        <p className="text-[10px] text-indigo-100 mb-4">Unlock premium leads instantly.</p>
                        <Link href={`/dashboard/subscription?tutorId=${instituteId}`} className="block w-full bg-white text-indigo-600 text-xs font-bold py-3 rounded-xl text-center">Manage Credits</Link>
                    </div>
                </aside>

                <main className="flex-1 overflow-y-auto p-10">
                    <div className="mb-10 flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold uppercase tracking-tight">Institute <span className="text-indigo-600 font-black">Portal</span></h1>
                            <p className="text-slate-500 font-medium">{activeTab === 'leads' ? 'Real-time student requirements' : activeTab === 'courses' ? 'Manage your academic programs' : 'Promote your institute'}</p>
                        </div>
                        {activeTab === 'courses' && (
                            <button onClick={() => setShowCourseForm(true)} className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:opacity-90 transition-all flex items-center gap-2">
                                <span className="material-symbols-outlined">add_circle</span> Add New Course
                            </button>
                        )}
                    </div>

                    {/* Trust & Verification Center */}
                    <div className="mb-10 bg-gradient-to-br from-indigo-500/10 to-blue-500/5 rounded-3xl border border-indigo-500/20 p-8 shadow-xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform text-indigo-500">
                            <span className="material-symbols-outlined text-[100px]">verified_user</span>
                        </div>
                        <div className="relative z-10 max-w-2xl">
                            <h2 className="text-2xl font-black text-slate-900 mb-2 flex items-center gap-3">
                                <span className="material-symbols-outlined text-indigo-600">gpp_good</span>
                                Verification Center
                            </h2>
                            <p className="text-slate-500 mb-8 font-medium italic">"Verified institutes gain higher placement and a 'Trust Badge' on their courses."</p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="bg-white/80 p-5 rounded-2xl flex items-center justify-between border border-indigo-500/10">
                                    <div className="flex items-center gap-3">
                                        <div className={`size-10 rounded-full flex items-center justify-center ${instituteData?.phone ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                            <span className="material-symbols-outlined text-[18px]">{instituteData?.phone ? 'check' : 'phone'}</span>
                                        </div>
                                        <div>
                                            <p className="text-xs font-black uppercase text-slate-400">Owner Phone</p>
                                            <p className="text-sm font-bold">{instituteData?.phone ? 'Verified' : 'Pending'}</p>
                                        </div>
                                    </div>
                                    {!instituteData?.phone && (
                                        <button className="text-[10px] font-black uppercase text-indigo-600 hover:underline">Verify</button>
                                    )}
                                </div>
                                <div className="bg-white/80 p-5 rounded-2xl flex items-center justify-between border border-indigo-500/10">
                                    <div className="flex items-center gap-3">
                                        <div className={`size-10 rounded-full flex items-center justify-center ${instituteData?.isIdVerified ? 'bg-indigo-600 text-white' : 'bg-amber-100 text-amber-500'}`}>
                                            <span className="material-symbols-outlined text-[18px]">{instituteData?.isIdVerified ? 'check' : 'business_center'}</span>
                                        </div>
                                        <div>
                                            <p className="text-xs font-black uppercase text-slate-400">Entity Details</p>
                                            <p className="text-sm font-bold">{instituteData?.isIdVerified ? 'Verified' : 'Unverified'}</p>
                                        </div>
                                    </div>
                                    {!instituteData?.isIdVerified && (
                                        <button className="text-[10px] font-black uppercase text-indigo-600 hover:underline">Complete KYC</button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content Switcher */}
                    {activeTab === "leads" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
                            {loading ? (
                                <p className="col-span-2 text-center py-20 text-slate-400 font-bold animate-pulse">Scanning Lead Marketplace...</p>
                            ) : leads.length > 0 ? (
                                leads.map((lead) => (
                                    <div key={lead.id} className="bg-white rounded-3xl border border-slate-100 p-8 shadow-xl shadow-slate-200/20 hover:-translate-y-1 transition-all group">
                                        <div className="flex justify-between items-center mb-6">
                                            <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-bold uppercase tracking-widest rounded-full">{lead.subject}</span>
                                            <span className="px-2 py-1 bg-slate-100 text-[10px] font-bold text-slate-400 rounded-md">Max 5 Unlocks</span>
                                        </div>
                                        <h3 className="text-xl font-black text-slate-900 mb-2 truncate">{lead.subject} in {lead.location}</h3>
                                        <p className="text-sm text-slate-500 mb-8 line-clamp-2 italic">"{lead.description}"</p>
                                        <button onClick={() => handleUnlock(lead.id)} className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl group-hover:bg-indigo-600 transition-all flex items-center justify-center gap-2 shadow-lg">
                                            <span className="material-symbols-outlined text-[20px]">lock_open</span> Unlock Contact
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-2 text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                                    <span className="material-symbols-outlined text-5xl text-slate-200 mb-4">search_off</span>
                                    <p className="text-slate-400 font-bold uppercase tracking-widest">No matching leads found</p>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === "courses" && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {courses.length > 0 ? (
                                courses.map(course => (
                                    <div key={course.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/20">
                                        <div className="flex justify-between items-start mb-4">
                                            <span className="px-2 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded uppercase">{course.category}</span>
                                            <p className="text-lg font-black text-indigo-600">₹{course.price}</p>
                                        </div>
                                        <h4 className="font-bold text-lg mb-2">{course.title}</h4>
                                        <p className="text-xs text-slate-400 mb-6">{course.duration}</p>
                                        <div className="flex gap-2">
                                            <button className="flex-1 py-3 bg-slate-50 text-slate-400 rounded-xl text-xs font-bold font-sans cursor-not-allowed">Edit</button>
                                            <button className="px-4 py-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors">
                                                <span className="material-symbols-outlined text-[18px]">delete</span>
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-3 text-center py-20 bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl">
                                    <p className="text-slate-400 font-bold uppercase text-xs">No courses listed yet. Start by adding a batch.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === "ads" && (
                        <div className="max-w-2xl mx-auto py-10 text-center">
                            <div className="size-20 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center mx-auto mb-6">
                                <span className="material-symbols-outlined text-4xl">workspace_premium</span>
                            </div>
                            <h2 className="text-2xl font-black mb-4">Promote Your Institute</h2>
                            <p className="text-slate-500 mb-8 font-medium italic">"Get 10x more visibility by placing ads on our homepage and top of search results. Our premium ad slots are exclusive to verified institutes."</p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                                <div className="p-6 bg-white border border-slate-100 rounded-3xl shadow-lg border-l-4 border-l-indigo-600">
                                    <h4 className="font-bold mb-2">Banner Ad</h4>
                                    <p className="text-xs text-slate-400 mb-4">Display your institute on the main homepage slider.</p>
                                    <button className="text-indigo-600 font-bold text-xs uppercase tracking-widest">Connect with Sales →</button>
                                </div>
                                <div className="p-6 bg-white border border-slate-100 rounded-3xl shadow-lg border-l-4 border-l-orange-500">
                                    <h4 className="font-bold mb-2">Search Priority</h4>
                                    <p className="text-xs text-slate-400 mb-4">Appear as the first result for subjects in your city.</p>
                                    <button className="text-orange-600 font-bold text-xs uppercase tracking-widest">Connect with Sales →</button>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>

            {/* Course Form Modal */}
            {showCourseForm && (
                <div className="fixed inset-0 z-[60] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-[2.5rem] p-10 max-w-lg w-full shadow-2xl relative">
                        <button onClick={() => setShowCourseForm(false)} className="absolute right-8 top-8 text-slate-400 hover:text-slate-900">
                            <span className="material-symbols-outlined">close</span>
                        </button>
                        <h2 className="text-2xl font-black mb-6">List a New <span className="text-indigo-600">Course</span></h2>
                        <form onSubmit={handleAddCourse} className="space-y-4">
                            <div>
                                <label className="text-xs font-black uppercase text-slate-400 mb-2 block">Course Title</label>
                                <input required type="text" className="w-full bg-slate-50 border-none p-4 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" placeholder="e.g., UPSC 2024 Foundations" value={newCourse.title} onChange={e => setNewCourse({ ...newCourse, title: e.target.value })} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-black uppercase text-slate-400 mb-2 block">Duration</label>
                                    <input required type="text" className="w-full bg-slate-50 border-none p-4 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" placeholder="e.g., 6 Months" value={newCourse.duration} onChange={e => setNewCourse({ ...newCourse, duration: e.target.value })} />
                                </div>
                                <div>
                                    <label className="text-xs font-black uppercase text-slate-400 mb-2 block">Price (₹)</label>
                                    <input required type="number" className="w-full bg-slate-50 border-none p-4 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" placeholder="e.g., 15000" value={newCourse.price} onChange={e => setNewCourse({ ...newCourse, price: e.target.value })} />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-black uppercase text-slate-400 mb-2 block">Category</label>
                                <select className="w-full bg-slate-50 border-none p-4 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" value={newCourse.category} onChange={e => setNewCourse({ ...newCourse, category: e.target.value })}>
                                    <option>Academic</option>
                                    <option>Competitive</option>
                                    <option>Vocational</option>
                                    <option>Languages</option>
                                </select>
                            </div>
                            <button type="submit" className="w-full bg-indigo-600 text-white font-black py-5 rounded-2xl shadow-xl shadow-indigo-600/20 mt-4 uppercase">Publish Course</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function InstituteDashboard() {
    return (
        <Suspense fallback={<div className="p-20 text-center text-slate-400 animate-pulse font-bold uppercase tracking-widest">Waking up the portal...</div>}>
            <InstituteDashboardContent />
        </Suspense>
    );
}
