"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { 
    LayoutDashboard, 
    Search, 
    Wallet, 
    TrendingUp, 
    Settings, 
    RefreshCcw, 
    Zap, 
    Lock, 
    ArrowRight, 
    GraduationCap, 
    MapPin, 
    Phone, 
    Mail, 
    MessageCircle, 
    CheckCircle2, 
    Clock, 
    ShieldCheck, 
    Star, 
    Target, 
    Award,
    Radar,
    LogOut,
    Loader2,
    CreditCard,
    Box,
    PlusCircle,
    Activity,
    Users,
    FileText,
    TrendingDown,
    ArrowUpRight
} from "lucide-react";
import DashboardHeader from "@/app/components/DashboardHeader";
import Chat from "@/app/components/chat/Chat";
import SettingsModule from "@/app/components/dashboard/SettingsModule";
import BillingModule from "@/app/components/dashboard/BillingModule";

function DashboardContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const paramTutorId = searchParams.get("tutorId");
    const [tutorId, setTutorId] = useState("");
    const [activeTab, setActiveTab] = useState("HOME"); // HOME, PIPELINE, BATCHES, CHAT, REVENUE, SETTINGS
    const [leads, setLeads] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tutorData, setTutorData] = useState(null);
    const [transactions, setTransactions] = useState([]);
    
    const [chatSessions, setChatSessions] = useState([]);
    const [selectedSession, setSelectedSession] = useState(null);
    const [loadingChat, setLoadingChat] = useState(false);
    const [showBatchForm, setShowBatchForm] = useState(false);

    // Persistence Pattern: Recovers identity from local registry if URL parameters are flushed.
    useEffect(() => {
        const savedId = localStorage.getItem("ti_active_tutor_id");
        if (paramTutorId) {
            setTutorId(paramTutorId);
            localStorage.setItem("ti_active_tutor_id", paramTutorId);
        } else if (savedId) {
            setTutorId(savedId);
        }
    }, [paramTutorId]);

    useEffect(() => {
        if (tutorId) {
            fetchTutorData();
            fetchChatSessions();
            fetchTransactions();
            if (activeTab === "HOME" || activeTab === "PIPELINE") fetchLeads();
            if (activeTab === "BATCHES") fetchCourses();
        }
    }, [tutorId, activeTab]);

    const fetchLeads = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({ tutorId });
            const res = await fetch(`/api/lead/list?${params.toString()}`);
            const data = await res.json();
            setLeads(data);
        } catch (err) { console.error(err); } finally { setLoading(false); }
    };

    const fetchCourses = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/institute/courses?instituteId=${tutorId}`);
            const data = await res.json();
            setCourses(data);
        } catch (err) { console.error(err); } finally { setLoading(false); }
    };

    const fetchTutorData = async () => {
        try {
            const res = await fetch(`/api/user/info?id=${tutorId}&viewerId=${tutorId}`);
            if (res.ok) {
                const data = await res.json();
                setTutorData(data);
            }
        } catch (err) { console.error(err); }
    };

    const fetchChatSessions = async () => {
        setLoadingChat(true);
        try {
            const res = await fetch(`/api/chat/session?userId=${tutorId}`);
            if (res.ok) {
                const data = await res.json();
                setChatSessions(data.sessions);
            }
        } catch (err) { console.error(err); } finally { setLoadingChat(false); }
    };

    const fetchTransactions = async () => {
        try {
            const res = await fetch(`/api/user/transactions?userId=${tutorId}`);
            if (res.ok) {
                const data = await res.json();
                setTransactions(data.transactions);
            }
        } catch (err) { console.error(err); }
    };

    const handleUnlock = async (leadId) => {
        if (!confirm("Confirm Identity Synchronization: 1 Credit will be deducted.")) return;
        try {
            const res = await fetch("/api/lead/unlock", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ leadId, tutorId }),
            });
            if (res.ok) {
                fetchLeads();
                fetchTutorData();
            } else {
                const err = await res.json();
                alert(err.error || "Institutional sync failed. Check credit balance.");
            }
        } catch (err) { console.error(err); }
    };

    if (!tutorId) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4 font-sans relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[600px] bg-blue-600/5 rounded-full blur-[120px] -z-10 animate-pulse"></div>
                <div className="bg-white border border-gray-100 p-12 rounded-[3.5rem] shadow-4xl shadow-blue-900/10 max-w-md w-full relative z-10 text-center">
                    <div className="size-20 rounded-3xl bg-blue-50 flex items-center justify-center text-blue-600 mx-auto mb-8 border border-blue-100 shadow-inner">
                        <GraduationCap size={40} strokeWidth={1.5} />
                    </div>
                    <h2 className="text-3xl font-black mb-3 tracking-tighter uppercase italic text-gray-900 leading-none">Tutor Dashboard</h2>
                    <p className="text-gray-400 mb-10 text-[10px] font-black uppercase tracking-widest leading-relaxed italic">Verification required to access the expert discovery pipeline.</p>
                    <input
                        type="text"
                        placeholder="ENTER FACULTY PROTOCOL ID"
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-6 text-gray-900 font-black text-xs uppercase tracking-widest focus:bg-white focus:border-blue-600 outline-none transition-all placeholder:text-gray-200 mb-6 italic shadow-inner"
                        onKeyDown={(e) => { if (e.key === 'Enter') setTutorId(e.target.value); }}
                        id="tutorInput"
                    />
                    <button
                        className="w-full bg-blue-600 text-white font-black py-6 rounded-2xl hover:bg-gray-900 shadow-2xl shadow-blue-600/20 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-[10px] active:scale-95 leading-none italic"
                        onClick={() => setTutorId(document.getElementById('tutorInput').value)}>
                        Synchronize Identity <ArrowRight size={16} strokeWidth={3} />
                    </button>
                    <Link href="/" className="inline-block mt-8 text-[10px] font-black uppercase tracking-[0.4em] text-gray-300 hover:text-blue-600 transition-colors italic">Return to Global Directory</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="relative flex min-h-screen flex-col bg-gray-50 font-sans text-gray-900 antialiased selection:bg-blue-600/10 selection:text-blue-900">
            <DashboardHeader 
                user={tutorData} 
                role="TUTOR" 
                credits={tutorData?.credits || 0} 
                onLogout={() => {
                    localStorage.removeItem("ti_active_tutor_id");
                    router.push("/");
                }}
            />

            <div className="flex flex-1">
                <aside className="fixed left-0 top-[85px] bottom-0 w-24 md:w-80 bg-white border-r border-gray-100 flex flex-col items-center md:items-stretch py-10 px-4 md:px-10 z-50 transition-all shadow-xl shadow-blue-900/5">
                    <div className="mb-12 hidden md:block px-6">
                        <h4 className="text-[10px] font-black text-gray-300 uppercase tracking-[0.4em] mb-8 italic">Management Controls</h4>
                    </div>

                    <nav className="space-y-4 w-full">
                        {[
                            { id: "HOME", label: "Dashboard", icon: LayoutDashboard },
                            { id: "PIPELINE", label: "Discovery Stream", icon: Radar },
                            { id: "BATCHES", label: "Cohort Manager", icon: Box },
                            { id: "CHAT", label: "Dialogue Hub", icon: MessageCircle },
                            { id: "REVENUE", label: "Financial Ledger", icon: CreditCard },
                            { id: "SETTINGS", label: "Registry Settings", icon: Settings }
                        ].map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`w-full flex items-center gap-4 px-4 md:px-6 py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all group relative overflow-hidden italic ${
                                    activeTab === item.id 
                                    ? "bg-blue-600 text-white shadow-2xl shadow-blue-600/30" 
                                    : "text-gray-300 hover:bg-gray-50 hover:text-blue-600"
                                }`}
                            >
                                <item.icon size={18} strokeWidth={3} className={activeTab === item.id ? "opacity-100" : "opacity-30 group-hover:opacity-100 transition-opacity"} />
                                <span className="hidden md:block">{item.label}</span>
                                {activeTab === item.id && <div className="absolute right-0 top-0 bottom-0 w-1 bg-white/20 md:hidden"></div>}
                            </button>
                        ))}
                    </nav>

                    <button 
                        onClick={() => {
                            localStorage.removeItem("ti_active_tutor_id");
                            router.push("/");
                        }}
                        className="mt-auto flex items-center justify-center md:justify-start gap-4 px-6 md:px-6 py-6 text-gray-300 hover:text-blue-600 text-[10px] font-black uppercase tracking-[0.4em] transition-all italic border-t border-gray-50 md:border-none"
                    >
                        <LogOut size={16} strokeWidth={3} />
                        <span className="hidden md:block">Deactivate Session</span>
                    </button>
                </aside>

                <main className="flex-1 ml-24 md:ml-80 p-8 md:p-14 lg:p-20 overflow-x-hidden">
                    <div className="max-w-7xl mx-auto">
                        
                        {(activeTab !== "CHAT" && activeTab !== "SETTINGS" && activeTab !== "REVENUE") && (
                            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 mb-20 anim-fade-up">
                                <div className="max-w-2xl relative">
                                    <div className="absolute -left-20 top-0 text-[160px] font-black text-gray-100 leading-none tracking-tighter italic select-none pointer-events-none uppercase opacity-50">HUB</div>
                                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full border border-blue-100 mb-8 relative z-10 shadow-sm">
                                        <Activity size={14} className="animate-pulse text-blue-600" />
                                        <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] italic">Dashboard active</span>
                                    </div>
                                    <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 uppercase italic leading-[0.85] text-gray-900 relative z-10">
                                        Tutor <span className="text-blue-600">Dashboard</span>
                                    </h1>
                                    <p className="text-lg text-gray-400 font-bold leading-relaxed max-w-xl italic uppercase tracking-tighter opacity-80">
                                        Monitoring <span className="text-gray-900 font-black underline decoration-blue-600/10">{tutorData?.name || "Tutors"}</span>. Global discovery active.
                                    </p>
                                </div>
                                {activeTab === 'BATCHES' && (
                                    <button onClick={() => setShowBatchForm(true)} className="group relative flex items-center gap-4 px-12 py-7 bg-blue-600 text-white rounded-[2.5rem] font-black text-[10px] tracking-[0.4em] shadow-4xl shadow-blue-600/30 hover:scale-[1.05] transition-all active:scale-95 uppercase leading-none italic h-fit">
                                       <PlusCircle size={20} strokeWidth={3} />
                                       Establish New Batch
                                    </button>
                                )}
                            </div>
                        )}

                        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                            {activeTab === "SETTINGS" && <SettingsModule userData={tutorData} onUpdate={fetchTutorData} />}
                            {activeTab === "REVENUE" && <BillingModule userData={tutorData} transactions={transactions} />}

                            {activeTab === "HOME" && (
                                <div className="space-y-24">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                                        {[
                                            { label: "Credit Asset Balance", val: tutorData?.credits || 0, icon: Wallet, theme: "text-blue-600", bg: "bg-blue-50" },
                                            { label: "Student Leads Density", val: leads.length, icon: Radar, theme: "text-indigo-600", bg: "bg-indigo-50" },
                                            { label: "Trust Score", val: "A+", icon: ShieldCheck, theme: "text-emerald-600", bg: "bg-emerald-50" },
                                            { label: "Enrollment Velocity", val: "14%", icon: TrendingUp, theme: "text-amber-600", bg: "bg-amber-50" }
                                        ].map((stat, i) => (
                                            <div key={i} className="group p-12 rounded-[3.5rem] bg-white border border-gray-100 shadow-4xl shadow-blue-900/[0.03] hover:shadow-blue-900/10 transition-all relative overflow-hidden">
                                                <stat.icon size={100} className="absolute -right-8 -top-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity" strokeWidth={3} />
                                                <div className={`size-16 rounded-2xl ${stat.bg} border-2 border-white flex items-center justify-center mb-10 shadow-lg ${stat.theme}`}>
                                                    <stat.icon size={28} strokeWidth={2.5} />
                                                </div>
                                                <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.4em] mb-3 italic leading-none">{stat.label}</p>
                                                <p className="text-6xl font-black text-gray-900 italic tracking-tighter leading-none">{stat.val}</p>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Actionable Insights Section */}
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                        <div className="lg:col-span-2 bg-white rounded-[4rem] p-12 border border-gray-100 shadow-4xl shadow-blue-900/[0.02] flex flex-col md:flex-row items-center gap-12 group hover:border-blue-600/20 transition-all">
                                            <div className="size-48 bg-gray-50 rounded-[3rem] items-center justify-center flex relative shrink-0">
                                                <div className="absolute inset-0 bg-blue-600/5 blur-2xl rounded-full scale-75 animate-pulse"></div>
                                                <Radar size={80} className="text-blue-600 opacity-20 group-hover:opacity-40 transition-opacity" strokeWidth={1} />
                                            </div>
                                            <div className="text-center md:text-left space-y-6">
                                                <h3 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic leading-[0.9]">Global Student <br/><span className="text-blue-600 lowercase font-serif font-light">discovery pool.</span></h3>
                                                <p className="text-gray-400 font-medium text-xs max-w-sm uppercase tracking-tight leading-relaxed italic">There are <span className="text-gray-900 font-black">24 new academic mandates</span> matching your specialized expertise in the last 24 hours.</p>
                                                <button onClick={() => setActiveTab("PIPELINE")} className="px-10 py-5 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] hover:bg-gray-900 transition-all active:scale-95 shadow-2xl shadow-blue-600/20 italic flex items-center gap-3">
                                                    Open Discovery Pipeline <ArrowUpRight size={16} strokeWidth={3} />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="bg-gray-900 rounded-[4rem] p-12 text-white flex flex-col justify-between relative overflow-hidden group">
                                            <div className="absolute top-0 right-0 size-48 bg-blue-600/20 rounded-full -mr-20 -mt-20 blur-3xl group-hover:bg-blue-600/40 transition-all"></div>
                                            <div className="space-y-2">
                                                <p className="text-[10px] font-black uppercase tracking-[0.5em] opacity-40 italic">Account Tier</p>
                                                <h3 className="text-3xl font-black italic uppercase tracking-tighter">Verified Tutors</h3>
                                            </div>
                                            <div className="space-y-6 relative z-10">
                                                <div className="flex items-center gap-4 py-4 px-6 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-md">
                                                    <Award className="text-blue-400" size={24} />
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-200">Elite Badge Pending</span>
                                                </div>
                                                <button className="w-full py-5 border-2 border-white/10 hover:border-blue-600 hover:text-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] transition-all italic">Upgrade Credentials</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === "PIPELINE" && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pb-24">
                                    {loading ? (
                                        <div className="col-span-2 py-40 flex flex-col items-center justify-center bg-white rounded-[4rem] border border-gray-100 shadow-4xl shadow-blue-900/[0.02]">
                                            <Loader2 className="animate-spin text-blue-600 mb-8" size={64} strokeWidth={3} />
                                            <p className="font-black text-[10px] uppercase tracking-[0.6em] italic text-gray-300">Synchronizing Discovery Stream...</p>
                                        </div>
                                    ) : leads.length > 0 ? leads.map((lead) => (
                                        <div key={lead.id} className="group relative bg-white border border-gray-100 rounded-[3.5rem] p-12 hover:border-blue-600/30 transition-all duration-700 overflow-hidden shadow-4xl shadow-blue-900/[0.02] flex flex-col min-h-[400px]">
                                            <div className="relative z-10 flex flex-col h-full">
                                                <div className="flex justify-between items-center mb-10 italic">
                                                    <span className="px-6 py-2.5 bg-blue-50 text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-blue-100 leading-none shadow-sm">{lead.subjects?.[0] || 'GENERAL'}</span>
                                                    <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 rounded-lg text-emerald-600 text-[10px] font-black uppercase tracking-widest leading-none border border-emerald-100 italic shadow-sm">
                                                        {lead.matchScore}% {lead.matchLabel || "Match Index"}
                                                    </div>
                                                </div>
                                                <h3 className="text-3xl font-black text-gray-900 mb-10 leading-[1.1] tracking-tighter uppercase italic group-hover:text-blue-600 transition-colors flex-1">"{lead.description}"</h3>
                                                
                                                {lead.isUnlocked ? (
                                                    <div className="p-10 bg-gray-50 rounded-[2.5rem] border border-gray-100 flex items-center gap-8 shadow-inner relative overflow-hidden">
                                                        <div className="size-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-2xl italic shadow-2xl shadow-blue-600/20">{lead.student?.name?.[0]}</div>
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="text-xl font-black uppercase italic text-gray-900 truncate tracking-tighter">{lead.student?.name}</h4>
                                                            <p className="text-[10px] font-black text-blue-600/60 uppercase tracking-widest leading-none mt-2 italic">Contact locked</p>
                                                        </div>
                                                        <button 
                                                            onClick={async () => {
                                                                setLoadingChat(true);
                                                                try {
                                                                    const res = await fetch("/api/chat/session", {
                                                                        method: "POST",
                                                                        headers: { "Content-Type": "application/json" },
                                                                        body: JSON.stringify({ 
                                                                            studentId: lead.studentId, 
                                                                            tutorId,
                                                                            initiatorId: tutorId
                                                                        })
                                                                    });
                                                                    if (res.ok) {
                                                                        await fetchChatSessions();
                                                                        setActiveTab("CHAT");
                                                                    }
                                                                } catch (err) { console.error(err); } finally { setLoadingChat(false); }
                                                            }}
                                                            className="size-16 bg-blue-600 text-white rounded-[2rem] flex items-center justify-center hover:bg-gray-900 transition-all active:scale-95 shadow-2xl shadow-blue-600/30"
                                                        >
                                                            {loadingChat ? <Loader2 className="animate-spin" size={24} /> : <MessageCircle size={28} className="font-black" strokeWidth={3} />}
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center justify-between gap-8 mt-auto pt-10 border-t border-gray-50">
                                                        <div className="flex items-center gap-4">
                                                            <div className="p-4 bg-blue-50 rounded-2xl text-blue-600 shadow-sm"><MapPin size={20} strokeWidth={3}/></div>
                                                            <div>
                                                                <p className="text-gray-300 font-black text-[10px] uppercase tracking-widest mb-1 italic">Location Node</p>
                                                                <p className="text-gray-900 font-black text-xs uppercase italic tracking-tighter leading-none">{lead.locations?.[0] || 'Remote/Digital'}</p>
                                                            </div>
                                                        </div>
                                                        <button 
                                                            onClick={() => handleUnlock(lead.id)}
                                                            className="px-12 py-5 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] hover:bg-gray-900 transition-all active:scale-95 shadow-2xl shadow-blue-600/20 flex items-center gap-4 italic"
                                                            disabled={loading}
                                                        >
                                                            <Zap size={14} fill="currentColor" strokeWidth={0} /> Synchronize
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="absolute -bottom-16 -right-16 size-48 bg-blue-600/3 rounded-full blur-3xl group-hover:bg-blue-600/8 transition-colors"></div>
                                        </div>
                                    )) : (
                                        <div className="col-span-full py-40 text-center bg-white rounded-[4rem] border-4 border-dashed border-gray-100 flex flex-col items-center justify-center">
                                            <Radar size={64} className="text-gray-100 mb-8" />
                                            <p className="font-black text-[10px] uppercase tracking-[0.5em] text-gray-200 italic">No scholastic signals detected in this sector.</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === "CHAT" && (
                                <div className="h-[calc(100vh-280px)] flex bg-white rounded-[3.5rem] border border-gray-100 shadow-4xl shadow-blue-900/[0.03] overflow-hidden anim-fade-up">
                                    <div className="w-full md:w-96 border-r border-gray-100 flex flex-col bg-gray-50/50">
                                        <div className="p-10 border-b border-gray-100 flex items-center justify-between bg-white shadow-sm">
                                            <h3 className="text-[10px] font-black text-gray-900 uppercase italic tracking-[0.4em]">Active Connections</h3>
                                            <div className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-widest leading-none border border-blue-100 shadow-inner">{chatSessions.length} NODES</div>
                                        </div>
                                        <div className="flex-1 overflow-y-auto scrollbar-hide py-6 space-y-2">
                                            {chatSessions.length > 0 ? chatSessions.map((session) => (
                                                <button
                                                    key={session.id}
                                                    onClick={() => setSelectedSession(session)}
                                                    className={`w-full px-8 py-7 text-left flex items-center gap-6 transition-all group relative overflow-hidden ${
                                                        selectedSession?.id === session.id 
                                                        ? "bg-white shadow-lg mx-2 w-[calc(100%-16px)] rounded-3xl z-10 scale-105 border border-blue-100" 
                                                        : "hover:bg-white/60"
                                                    }`}
                                                >
                                                    <div className={`size-16 rounded-[1.5rem] flex items-center justify-center font-black text-2xl italic shadow-xl shrink-0 transition-transform ${selectedSession?.id === session.id ? 'bg-blue-600 text-white rotate-6' : 'bg-gray-100 text-gray-300 group-hover:bg-blue-50 group-hover:text-blue-600'}`}>
                                                        {session.student?.name?.[0]}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <h4 className="text-sm font-black text-gray-900 uppercase italic tracking-tighter truncate">{session.student?.name}</h4>
                                                            <span className="text-[10px] font-black opacity-30 uppercase tabular-nums italic">{new Date(session.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                        </div>
                                                        <p className="text-[10px] font-bold text-gray-300 truncate uppercase tracking-tight italic group-hover:text-gray-400">
                                                            {session.messages?.[0]?.content || "STAND_BY: READY_FOR_SYNC"}
                                                        </p>
                                                    </div>
                                                </button>
                                            )) : (
                                                <div className="p-12 text-center flex flex-col items-center justify-center gap-6 opacity-20">
                                                    <MessageCircle size={64} className="text-gray-300" strokeWidth={1} />
                                                    <p className="italic font-black uppercase tracking-[0.4em] text-[10px]">Registry Empty</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex-1 bg-white relative">
                                        {selectedSession ? (
                                            <Chat 
                                                sessionId={selectedSession.id}
                                                currentUser={tutorData}
                                                recipientName={selectedSession.student?.name}
                                            />
                                        ) : (
                                            <div className="h-full flex flex-col items-center justify-center opacity-10 italic bg-dots-grid">
                                                <div className="relative mb-8">
                                                    <MessageCircle size={120} strokeWidth={1} />
                                                    <div className="absolute inset-0 bg-blue-600/20 blur-[80px] rounded-full scale-150 animate-pulse"></div>
                                                </div>
                                                <p className="text-[12px] font-black uppercase tracking-[0.8em] text-gray-900">Synchronize Global Node</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {activeTab === "BATCHES" && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pb-24">
                                    {courses.length > 0 ? courses.map((course) => (
                                        <div key={course.id} className="bg-white border border-gray-100 rounded-[3.5rem] p-12 flex flex-col gap-10 text-gray-900 group hover:border-blue-600/10 transition-all shadow-4xl shadow-blue-900/[0.02]">
                                            <div className="flex justify-between items-start">
                                                <div className="px-6 py-2.5 bg-blue-50 text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest italic border border-blue-100 shadow-sm">{course.category}</div>
                                                <div className="flex flex-col items-end">
                                                    <span className="text-4xl font-black italic tracking-tighter text-gray-900 leading-none mb-1">₹{course.price}</span>
                                                    <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest italic">Enrollment Fee</span>
                                                </div>
                                            </div>
                                            <h3 className="text-4xl font-black uppercase italic tracking-tighter group-hover:text-blue-600 transition-all leading-[0.9] flex-1">"{course.title}"</h3>
                                            <div className="grid grid-cols-2 gap-6 py-10 border-y border-gray-50 italic">
                                                <div className="flex flex-col gap-2">
                                                    <div className="flex items-center gap-2">
                                                        <Users size={16} className="text-blue-600" />
                                                        <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest leading-none">Occupancy</p>
                                                    </div>
                                                    <p className="font-black text-xl text-gray-900 italic tracking-tighter leading-none">{course.enrolledCount} / {course.maxSeats} Students</p>
                                                </div>
                                                <div className="flex flex-col gap-2">
                                                    <div className="flex items-center gap-2">
                                                        <Activity size={16} className="text-emerald-500" />
                                                        <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest leading-none">Status</p>
                                                    </div>
                                                    <p className="font-black text-xl text-emerald-500 italic tracking-tighter leading-none uppercase">{course.isActive ? 'Active_Live' : 'Inactive'}</p>
                                                </div>
                                            </div>
                                            <button className="w-full py-5 bg-gray-50 text-gray-300 hover:bg-gray-900 hover:text-white rounded-[2rem] font-black text-[10px] uppercase tracking-[0.4em] transition-all italic border border-gray-100">Establish Communication Hub</button>
                                        </div>
                                    )) : (
                                        <div className="col-span-2 py-48 flex flex-col items-center justify-center bg-white rounded-[4rem] border-4 border-dashed border-gray-100 text-gray-200">
                                            <Box size={80} className="mb-8 opacity-20" strokeWidth={1} />
                                            <p className="font-black text-[10px] uppercase tracking-[0.6em] italic">Cohort Registry Empty</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === "REVENUE" && (
                                <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                                    <div className="bg-white rounded-[4rem] border border-gray-100 shadow-4xl shadow-blue-900/[0.02] p-16 mb-12 flex flex-col md:flex-row items-center justify-between gap-12 group">
                                         <div className="space-y-4">
                                            <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.5em] italic">Total Accrued Assets</p>
                                            <h2 className="text-7xl font-black text-gray-900 italic tracking-tighter leading-none">₹{(transactions || []).reduce((sum, t) => sum + (t.amount || 0), 0)}</h2>
                                            <div className="flex items-center gap-2 text-emerald-500 font-black text-xs uppercase tracking-widest italic leading-none">
                                                <TrendingUp size={16} /> +12.4% Asset Growth
                                            </div>
                                         </div>
                                         <div className="flex flex-col items-center md:items-end gap-6 w-full md:w-auto">
                                            <div className="flex -space-x-4 mb-2">
                                                {[1,2,3,4].map(i => <div key={i} className="size-12 rounded-full border-4 border-white bg-blue-50 flex items-center justify-center font-black text-[10px] text-blue-600 ring-2 ring-gray-50">{String.fromCharCode(64+i)}</div>)}
                                                <div className="size-12 rounded-full border-4 border-white bg-gray-900 text-white flex items-center justify-center font-black text-[10px] ring-2 ring-gray-900">+12</div>
                                            </div>
                                            <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] italic mb-4">Transaction History</p>
                                            <button className="px-10 py-5 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] shadow-2xl shadow-blue-600/20 hover:scale-105 transition-all">Export Revenue Registry</button>
                                         </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="bg-white rounded-[3.5rem] p-12 border border-gray-100 shadow-4xl shadow-blue-900/[0.01] flex flex-col gap-6">
                                            <h4 className="text-[10px] font-black text-gray-300 uppercase tracking-[0.6em] mb-4 italic">Recent Inflows</h4>
                                            {transactions.slice(0, 5).map((t, i) => (
                                                <div key={i} className="flex items-center justify-between py-6 border-b border-gray-50 last:border-0 group">
                                                    <div className="flex items-center gap-6">
                                                        <div className="size-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black italic">INR</div>
                                                        <div>
                                                            <p className="text-sm font-black text-gray-900 uppercase italic tracking-tighter">Transaction: {t.id.slice(0, 8)}</p>
                                                            <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mt-1 italic">{new Date(t.createdAt).toLocaleDateString()}</p>
                                                        </div>
                                                    </div>
                                                    <p className="text-xl font-black text-emerald-500 italic tracking-tighter group-hover:scale-110 transition-transform">+₹{t.amount}</p>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="bg-white rounded-[3.5rem] p-12 border border-gray-100 shadow-4xl shadow-blue-900/[0.01] flex flex-col gap-6">
                                            <h4 className="text-[10px] font-black text-gray-300 uppercase tracking-[0.6em] mb-4 italic">Credit Expenditure</h4>
                                            {leads.filter(l => l.isUnlocked).slice(0, 5).map((l, i) => (
                                                <div key={i} className="flex items-center justify-between py-6 border-b border-gray-50 last:border-0 group">
                                                    <div className="flex items-center gap-6">
                                                        <div className="size-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black italic"><Zap size={20} fill="currentColor" strokeWidth={0} /></div>
                                                        <div>
                                                            <p className="text-sm font-black text-gray-900 uppercase italic tracking-tighter">Identity Unlock</p>
                                                            <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mt-1 italic">{new Date(l.updatedAt).toLocaleDateString()}</p>
                                                        </div>
                                                    </div>
                                                    <p className="text-xl font-black text-indigo-500 italic tracking-tighter group-hover:scale-110 transition-transform">-1 CR</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default function Dashboard() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen bg-gray-50 font-sans overflow-hidden text-blue-600 italic">
                 <div className="flex flex-col items-center gap-10">
                    <div className="size-24 rounded-[3.5rem] bg-blue-50 border-2 border-blue-100 flex items-center justify-center animate-spin-slow shadow-inner">
                        <Radar size={32} className="animate-pulse" strokeWidth={3} />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.8em] animate-pulse">Loading dashboard...</p>
                 </div>
            </div>
        }>
            <DashboardContent />
        </Suspense>
    );
}
