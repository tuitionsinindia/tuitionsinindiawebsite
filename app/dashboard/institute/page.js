"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import DashboardHeader from "@/app/components/DashboardHeader";
import Chat from "@/app/components/chat/Chat";
import SettingsModule from "@/app/components/dashboard/SettingsModule";
import BillingModule from "@/app/components/dashboard/BillingModule";
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
    Target,
    MessageCircle,
    Loader2,
    LogOut,
    Clock,
    Settings,
    UserPlus,
    Activity,
    Box
} from "lucide-react";

function InstituteDashboardContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [instituteId, setInstituteId] = useState(searchParams.get("instituteId") || "");
    const [leads, setLeads] = useState([]);
    const [recruitmentLeads, setRecruitmentLeads] = useState([]);
    const [courses, setCourses] = useState([]);
    const [ads, setAds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [instituteData, setInstituteData] = useState(null);
    const [activeTab, setActiveTab] = useState("leads"); // leads, recruitment, courses, ads, settings, billing, chat
    
    // Chat States
    const [chatSessions, setChatSessions] = useState([]);
    const [selectedSession, setSelectedSession] = useState(null);
    const [loadingChat, setLoadingChat] = useState(false);

    // Course Form State
    const [showCourseForm, setShowCourseForm] = useState(false);

    useEffect(() => {
        if (instituteId) {
            fetchInstituteData();
            fetchChatSessions();
            if (activeTab === "leads") fetchLeads();
            if (activeTab === "recruitment") fetchRecruitmentLeads();
            if (activeTab === "courses") fetchCourses();
            if (activeTab === "ads") fetchAds();
        }
    }, [instituteId, activeTab]);

    const fetchLeads = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/lead/list?tutorId=${instituteId}`);
            const data = await res.json();
            setLeads(data);
        } catch (err) { console.error(err); } finally { setLoading(false); }
    };

    const fetchRecruitmentLeads = async () => {
        setLoading(true);
        try {
            // Fetch tutors looking for work (role: TUTOR)
            const res = await fetch(`/api/search?role=TUTOR`);
            const data = await res.json();
            setRecruitmentLeads(data.results || []);
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
        } catch (err) { console.error(err); } finally { setLoading(false); }
    };

    const fetchChatSessions = async () => {
        setLoadingChat(true);
        try {
            const res = await fetch(`/api/chat/session?userId=${instituteId}`);
            if (res.ok) {
                const data = await res.json();
                setChatSessions(data.sessions);
            }
        } catch (err) { console.error(err); } finally { setLoadingChat(false); }
    };

    const handleUnlock = async (leadId) => {
        if (!confirm("UNLOCK_MANDATE: Spend 1 credit to synchronize with this student?")) return;
        try {
            const res = await fetch("/api/lead/unlock", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ leadId, tutorId: instituteId }),
            });
            if (res.ok) {
                fetchLeads();
                fetchInstituteData();
            } else {
                const err = await res.json();
                alert(err.error || "PROTOCOL_SYNC_FAILED");
            }
        } catch (err) { console.error(err); }
    };

    if (!instituteId) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background-dark p-4 font-sans relative overflow-hidden text-white italic">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[600px] bg-indigo-500/10 rounded-full blur-[120px] -z-10 animate-pulse"></div>
                <div className="bg-surface-dark/40 backdrop-blur-3xl p-10 rounded-[2.5rem] shadow-2xl border border-border-dark max-w-md w-full relative z-10 text-center">
                    <div className="size-20 rounded-3xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 mx-auto mb-8 border border-indigo-500/20">
                        <Building2 size={40} strokeWidth={1.5} />
                    </div>
                    <h2 className="text-3xl font-black mb-3 tracking-tighter uppercase">Institutional Portal.</h2>
                    <p className="text-on-surface-dark/40 mb-10 text-xs font-black uppercase tracking-widest leading-relaxed italic">Verification required to access the academic command center.</p>
                    <input
                        type="text"
                        placeholder="ENTER INSTITUTE PROTOCOL ID"
                        className="w-full bg-background-dark/50 border border-border-dark rounded-2xl p-5 text-white font-black text-xs uppercase tracking-widest focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-white/10 mb-6 italic"
                        onKeyDown={(e) => { if (e.key === 'Enter') setInstituteId(e.target.value); }}
                        id="instInput"
                    />
                    <button
                        className="w-full bg-indigo-600 text-white font-black py-5 rounded-2xl hover:bg-white hover:text-indigo-600 shadow-xl transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-xs active:scale-95 leading-none"
                        onClick={() => setInstituteId(document.getElementById('instInput').value)}>
                        AUTHORIZE ACCESS <ArrowRight size={16} strokeWidth={3} />
                    </button>
                    <Link href="/" className="inline-block mt-8 text-xs font-black uppercase tracking-[0.3em] text-white/20 hover:text-indigo-500 transition-colors italic">Back to Home</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="relative flex min-h-screen flex-col bg-background-dark font-sans text-on-background-dark antialiased selection:bg-indigo-500/30">
            <DashboardHeader 
                user={instituteData} 
                role="INSTITUTE" 
                credits={instituteData?.credits || 0} 
                onLogout={() => router.push("/")}
            />

            <div className="flex flex-1">
                <aside className="fixed left-0 top-[85px] bottom-0 w-24 md:w-80 bg-surface-dark/20 backdrop-blur-3xl border-r border-border-dark flex flex-col items-center md:items-stretch py-8 px-4 md:px-10 z-50">
                    <div className="mb-12 hidden md:block px-6">
                        <h4 className="text-xs font-black text-on-surface-dark/20 uppercase tracking-[0.4em] mb-8 italic">Academy Command</h4>
                    </div>

                    <nav className="space-y-4 w-full">
                        {[
                            { id: "leads", label: "ADMISSIONS_LEADS", icon: Target },
                            { id: "recruitment", label: "FACULTY_RECRUIT", icon: UserPlus },
                            { id: "chat", label: "MESSAGING_HUB", icon: MessageCircle },
                            { id: "courses", label: "BATCH_MANAGER", icon: Box },
                            { id: "ads", label: "CAMPAIGNS", icon: Megaphone },
                            { id: "billing", label: "BILLING_LEDGER", icon: CreditCard },
                            { id: "settings", label: "SYNC_SETTINGS", icon: Settings }
                        ].map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`w-full flex items-center gap-4 px-4 md:px-6 py-4 rounded-2xl font-black text-xs tracking-widest transition-all group relative overflow-hidden ${
                                    activeTab === item.id 
                                    ? "bg-indigo-600 text-white shadow-xl shadow-indigo-600/20" 
                                    : "text-on-surface-dark/40 hover:bg-surface-dark hover:text-indigo-500 border border-transparent hover:border-border-dark"
                                }`}
                            >
                                <item.icon size={20} strokeWidth={2.5} className={activeTab === item.id ? "opacity-100 font-black" : "opacity-40"} />
                                <span className="hidden md:block">{item.label}</span>
                                {activeTab === item.id && <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-white md:hidden"></div>}
                            </button>
                        ))}
                    </nav>

                    <button 
                        onClick={() => router.push("/")}
                        className="mt-auto flex items-center justify-center md:justify-start gap-4 px-6 md:px-6 py-4 text-red-500/40 hover:text-red-500 text-xs font-black uppercase tracking-[0.3em] transition-colors"
                    >
                        <LogOut size={16} strokeWidth={3} />
                        <span className="hidden md:block">EXIT HUB</span>
                    </button>
                </aside>

                <main className="flex-1 ml-24 md:ml-80 p-6 md:p-12 lg:p-16">
                    <div className="max-w-7xl mx-auto">
                        
                        {(activeTab !== "chat" && activeTab !== "settings" && activeTab !== "billing") && (
                            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 mb-24">
                                <div className="max-w-2xl relative">
                                    <div className="absolute -left-12 top-0 text-[180px] font-black text-white/5 leading-none tracking-tighter italic select-none pointer-events-none uppercase">HUB</div>
                                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/5 rounded-full border border-indigo-500/10 mb-8">
                                        <Activity size={14} className="animate-pulse text-indigo-500" />
                                        <span className="text-xs font-black text-indigo-500 uppercase tracking-widest italic tracking-[0.2em]">Institutional Command Active</span>
                                    </div>
                                    <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 uppercase italic leading-[0.85] text-white">
                                        Strategic <br/><span className="text-indigo-500 underline decoration-indigo-500/20 decoration-8 underline-offset-8">Output.</span>
                                    </h1>
                                    <p className="text-xl text-on-surface-dark/60 font-medium leading-relaxed max-w-xl italic">
                                        Monitoring <span className="text-white font-black italic">{instituteData?.name || "Corporate Hub"}</span>. {activeTab.toUpperCase()}_SCAN active.
                                    </p>
                                </div>
                            </div>
                        )}

                        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                            {activeTab === "settings" && <SettingsModule user={instituteData} onUpdate={fetchInstituteData} />}
                            {activeTab === "billing" && <BillingModule user={instituteData} />}

                            {activeTab === "chat" && (
                                <div className="h-[75vh] grid grid-cols-1 lg:grid-cols-12 gap-10">
                                    <div className="lg:col-span-4 bg-surface-dark/20 backdrop-blur-3xl rounded-[3rem] border border-border-dark overflow-hidden flex flex-col">
                                        <div className="p-8 border-b border-border-dark flex items-center justify-between">
                                            <h3 className="text-xs font-black text-white/40 uppercase tracking-[0.5em] italic">Secure Directory</h3>
                                            <div className="size-8 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-black text-xs">{chatSessions.length}</div>
                                        </div>
                                        <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide">
                                            {loadingChat ? (
                                                <div className="flex flex-col items-center justify-center py-20 gap-4 opacity-20 italic font-black uppercase text-xs tracking-widest">
                                                    <Loader2 className="animate-spin" size={24} />
                                                    Syncing Nodes...
                                                </div>
                                            ) : chatSessions.length > 0 ? chatSessions.map((session) => {
                                                const recipient = session.tutorId === instituteId ? session.student : session.tutor;
                                                const isActive = selectedSession?.id === session.id;
                                                return (
                                                    <button
                                                        key={session.id}
                                                        onClick={() => setSelectedSession(session)}
                                                        className={`w-full p-6 rounded-[2rem] flex items-center gap-4 transition-all border border-transparent hover:scale-[1.02] active:scale-95 group overflow-hidden relative ${
                                                            isActive ? "bg-indigo-600 border-indigo-600 shadow-xl shadow-indigo-600/20 text-white" : "bg-white/5 hover:bg-white/10 text-white"
                                                        }`}
                                                    >
                                                        <div className={`size-12 rounded-2xl flex items-center justify-center font-black text-lg italic shadow-xl transition-all ${isActive ? "bg-white text-indigo-600" : "bg-indigo-600 text-white"}`}>
                                                            {recipient?.name?.[0] || "?"}
                                                        </div>
                                                        <div className="flex-1 text-left min-w-0">
                                                            <p className="text-xs font-black uppercase tracking-tight truncate italic leading-none mb-2">{recipient?.name}</p>
                                                            <p className={`text-xs font-medium tracking-wide truncate italic opacity-40 leading-none ${isActive ? "text-white" : "text-white/60"}`}>FACULTY SYNCHRONIZATION ACTIVE</p>
                                                        </div>
                                                    </button>
                                                )
                                            }) : (
                                                <div className="py-20 text-center opacity-20 italic font-black uppercase tracking-[0.3em] text-xs px-10 text-white leading-relaxed">No scholarly nodes detected.</div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="lg:col-span-8 overflow-hidden">
                                        {selectedSession ? (
                                            <Chat 
                                                sessionId={selectedSession.id} 
                                                currentUser={{ id: instituteId, name: instituteData?.name }} 
                                                recipientName={selectedSession.tutorId === instituteId ? selectedSession.student?.name : selectedSession.tutor?.name}
                                            />
                                        ) : (
                                            <div className="h-full flex flex-col items-center justify-center space-y-8 bg-surface-dark/10 rounded-[4rem] border-4 border-dashed border-border-dark/50 p-20 text-center text-white italic">
                                                <MessageCircle size={64} className="text-indigo-500/20" />
                                                <h2 className="text-4xl font-black uppercase tracking-tighter">Secure <span className="text-indigo-500">Dialogue.</span></h2>
                                                <p className="text-white/20 max-w-sm mx-auto font-black text-xs tracking-widest uppercase">Select an active neural link to initiate synchronization protocol.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {activeTab === "leads" && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pb-24">
                                    {loading ? (
                                        <div className="col-span-2 py-40 flex flex-col items-center justify-center opacity-50 bg-surface-dark/20 rounded-[4rem] border border-border-dark text-white italic">
                                            <Loader2 className="animate-spin mb-10" size={48} strokeWidth={3} />
                                            <p className="font-black text-[12px] uppercase tracking-[0.6em] italic">Synthesizing Admission Demand Grid...</p>
                                        </div>
                                    ) : leads.length > 0 ? leads.map((lead) => (
                                        <div key={lead.id} className="group relative bg-surface-dark/40 border border-border-dark rounded-[3.5rem] p-12 hover:border-indigo-500/30 transition-all duration-700 overflow-hidden border-b-8 flex flex-col text-white">
                                            <div className="relative z-10">
                                                <div className="flex justify-between items-center mb-10 italic">
                                                    <span className="px-6 py-2.5 bg-indigo-500/10 text-indigo-500 rounded-xl text-xs font-black uppercase tracking-widest border border-indigo-500/20 leading-none">{lead.subjects?.[0] || 'ADMISSIONS'}</span>
                                                    <div className="flex items-center gap-2 px-3 py-1 bg-background-dark/80 rounded-lg text-emerald-500/60 text-xs font-black uppercase tracking-widest leading-none border border-emerald-500/10 italic">ACTIVE_ENROLLMENT</div>
                                                </div>
                                                <h3 className="text-4xl font-black text-white mb-10 leading-[1.05] tracking-tighter uppercase italic group-hover:text-indigo-400 transition-colors">"{lead.description}"</h3>
                                                
                                                {lead.isUnlocked ? (
                                                    <div className="p-8 bg-background-dark/80 rounded-[2.5rem] border border-border-dark flex items-center gap-8 border-b-4 border-emerald-500/20 overflow-hidden">
                                                        <div className="size-16 rounded-2xl bg-emerald-500 text-white flex items-center justify-center font-black text-2xl italic shadow-xl">{lead.student?.name?.[0]}</div>
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="text-xl font-black uppercase italic text-white truncate">{lead.student?.name}</h4>
                                                            <p className="text-xs font-black text-emerald-500/60 uppercase tracking-widest leading-none mt-1">SECURE_SYNC_LOCKED</p>
                                                        </div>
                                                        <button 
                                                            onClick={async () => {
                                                                const res = await fetch("/api/chat/session", {
                                                                    method: "POST",
                                                                    headers: { "Content-Type": "application/json" },
                                                                    body: JSON.stringify({ studentId: lead.studentId, tutorId: instituteId })
                                                                });
                                                                if (res.ok) { await fetchChatSessions(); setActiveTab("chat"); }
                                                            }}
                                                            className="size-14 bg-emerald-500 text-white rounded-2xl flex items-center justify-center hover:bg-white hover:text-emerald-500 transition-all active:scale-95 shadow-xl"
                                                        >
                                                            <MessageCircle size={20} strokeWidth={3} />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button onClick={() => handleUnlock(lead.id)} className="w-full bg-indigo-600 text-white font-black py-8 rounded-[2.5rem] flex items-center justify-center gap-4 text-[12px] tracking-[0.4em] uppercase transition-all shadow-2xl hover:bg-white hover:text-indigo-600 active:scale-95 leading-none italic">
                                                        <Lock size={18} strokeWidth={3} className="opacity-40" />
                                                        ENROLL STUDENT
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="col-span-2 py-40 text-center opacity-20 italic font-black uppercase tracking-[0.8em] text-white">Market Consensus: Zero Demand</div>
                                    )}
                                </div>
                            )}

                            {activeTab === "recruitment" && (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-24">
                                    {loading ? (
                                        <div className="col-span-3 py-40 flex flex-col items-center justify-center opacity-50 italic text-white font-black uppercase tracking-[0.5em]">
                                            <Loader2 size={48} className="animate-spin mb-6" />
                                            Loading tutors...
                                        </div>
                                    ) : recruitmentLeads.length > 0 ? recruitmentLeads.map((tutor) => (
                                        <div key={tutor.id} className="bg-surface-dark/40 border border-border-dark rounded-[2.5rem] p-8 hover:border-indigo-500/30 transition-all flex flex-col gap-6 text-white group relative overflow-hidden">
                                            <div className="flex items-center gap-6">
                                                <div className="size-20 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black text-3xl italic shadow-xl shadow-indigo-600/20">{tutor.tutor?.name?.[0]}</div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-black uppercase italic tracking-tighter text-xl truncate group-hover:text-indigo-400">{tutor.tutor?.name}</h3>
                                                    <div className="flex items-center gap-1.5 text-amber-500 text-xs font-black uppercase tracking-widest mt-1">
                                                        <Award size={12} fill="currentColor" /> EXPERT_FACULTY
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap gap-2 py-4 border-y border-white/5 italic">
                                                {tutor.subjects?.slice(0, 3).map(s => (
                                                    <span key={s} className="px-3 py-1 bg-white/5 rounded-lg text-xs font-black uppercase tracking-widest text-white/40">{s}</span>
                                                ))}
                                            </div>
                                            <button 
                                                className="w-full py-5 bg-white text-indigo-600 rounded-2xl font-black text-xs tracking-widest uppercase hover:bg-indigo-600 hover:text-white transition-all active:scale-95 italic"
                                                onClick={() => router.push(`/search/${tutor.id}`)}
                                            >
                                                RECRUIT_PROFILE
                                            </button>
                                        </div>
                                    )) : (
                                        <div className="col-span-3 py-40 text-center opacity-20 italic font-black uppercase tracking-[0.8em] text-white">No tutors found</div>
                                    )}
                                </div>
                            )}

                            {activeTab === "courses" && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pb-24">
                                    {courses.length > 0 ? courses.map((course) => (
                                        <div key={course.id} className="bg-surface-dark/40 border border-border-dark rounded-[3rem] p-10 flex flex-col gap-8 text-white group hover:border-indigo-500/20 transition-all">
                                            <div className="flex justify-between items-start">
                                                <div className="px-5 py-2 bg-indigo-500/10 text-indigo-500 rounded-xl text-xs font-black uppercase tracking-widest italic border border-indigo-500/10">{course.category}</div>
                                                <div className="flex flex-col items-end">
                                                    <span className="text-3xl font-black italic tracking-tighter text-white">₹{course.price}</span>
                                                    <span className="text-xs font-black text-white/20 uppercase tracking-widest italic">PER_SEAT_INDEX</span>
                                                </div>
                                            </div>
                                            <h3 className="text-3xl font-black uppercase italic tracking-tighter group-hover:text-indigo-400 transition-all leading-none">{course.title}</h3>
                                            <div className="grid grid-cols-2 gap-4 py-8 border-y border-white/5 italic">
                                                <div>
                                                    <p className="text-xs font-black text-white/20 uppercase tracking-widest mb-2 leading-none">Occupancy</p>
                                                    <p className="font-black text-xs text-indigo-400 italic leading-none">{course.enrolledCount} / {course.maxSeats} SEATS</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs font-black text-white/20 uppercase tracking-widest mb-2 leading-none">Status</p>
                                                    <p className="font-black text-xs text-emerald-500 italic leading-none">{course.isActive ? 'OPERATIONAL' : 'DEACTIVATED'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="col-span-2 py-40 flex flex-col items-center justify-center bg-white/5 rounded-[4rem] border border-dashed border-white/10 italic text-white/20">
                                            <Box size={48} className="mb-6 opacity-20" />
                                            <p className="font-black text-xs uppercase tracking-[0.5em]">Inventory Empty: Deploy Batches</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default function InstituteDashboard() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen bg-background-dark font-sans overflow-hidden text-indigo-500 italic">
                 <div className="flex flex-col items-center gap-10">
                    <div className="size-24 rounded-[3.5rem] bg-indigo-500/10 border-2 border-indigo-500/20 flex items-center justify-center animate-spin-slow shadow-[0_0_50px_rgba(79,70,229,0.2)]">
                        <Building2 size={32} className="animate-pulse" strokeWidth={3} />
                    </div>
                    <p className="text-xs font-black uppercase tracking-[0.8em] animate-pulse">Loading dashboard...</p>
                 </div>
            </div>
        }>
            <InstituteDashboardContent />
        </Suspense>
    );
}
