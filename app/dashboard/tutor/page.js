"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import DashboardHeader from "@/app/components/DashboardHeader";
import FacultyChat from "@/app/components/chat/FacultyChat";
import { 
    LayoutDashboard, 
    Search, 
    Wallet, 
    TrendingUp, 
    Settings, 
    RefreshCcw, 
    Zap, 
    Lock, 
    Unlock, 
    ArrowRight, 
    GraduationCap, 
    MapPin, 
    Phone, 
    Mail, 
    MessageCircle, 
    CheckCircle2, 
    Clock, 
    ShieldCheck, 
    User, 
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
    Users
} from "lucide-react";
import SettingsModule from "@/app/components/dashboard/SettingsModule";
import BillingModule from "@/app/components/dashboard/BillingModule";

function DashboardContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [tutorId, setTutorId] = useState(searchParams.get("tutorId") || "");
    const [activeTab, setActiveTab] = useState("HOME"); // HOME, PIPELINE, BATCHES, CHAT, REVENUE, SETTINGS
    const [leads, setLeads] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tutorData, setTutorData] = useState(null);
    const [transactions, setTransactions] = useState([]);
    
    // Chat States
    const [chatSessions, setChatSessions] = useState([]);
    const [selectedSession, setSelectedSession] = useState(null);
    const [loadingChat, setLoadingChat] = useState(false);

    // Batch Form State
    const [showBatchForm, setShowBatchForm] = useState(false);

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
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
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
            const res = await fetch(`/api/user/info?id=${tutorId}`);
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
        if (!confirm("UNLOCK_MANDATE: Spend 1 credit to synchronize with this scholar?")) return;
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
                alert(err.error || "PROTOCOL_SYNC_FAILED");
            }
        } catch (err) { console.error(err); }
    };

    if (!tutorId) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background-dark p-4 font-sans relative overflow-hidden text-white italic">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[600px] bg-primary/10 rounded-full blur-[120px] -z-10 animate-pulse"></div>
                <div className="bg-surface-dark/40 backdrop-blur-3xl p-10 rounded-[2.5rem] shadow-2xl border border-border-dark max-w-md w-full relative z-10 text-center">
                    <div className="size-20 rounded-3xl bg-primary/10 flex items-center justify-center text-primary mx-auto mb-8 border border-primary/20">
                        <GraduationCap size={40} strokeWidth={1.5} />
                    </div>
                    <h2 className="text-3xl font-black mb-3 tracking-tighter uppercase">Faculty Terminal.</h2>
                    <p className="text-on-surface-dark/40 mb-10 text-[11px] font-black uppercase tracking-widest leading-relaxed italic">Identity verification required to access the strategic discovery pipeline.</p>
                    <input
                        type="text"
                        placeholder="ENTER TUTOR PROTOCOL ID"
                        className="w-full bg-background-dark/50 border border-border-dark rounded-2xl p-5 text-white font-black text-xs uppercase tracking-widest focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-white/10 mb-6 italic"
                        onKeyDown={(e) => { if (e.key === 'Enter') setTutorId(e.target.value); }}
                        id="tutorInput"
                    />
                    <button
                        className="w-full bg-primary text-white font-black py-5 rounded-2xl hover:bg-white hover:text-primary shadow-xl transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-xs active:scale-95 leading-none"
                        onClick={() => setTutorId(document.getElementById('tutorInput').value)}>
                        AUTHORIZE DISCOVERY <ArrowRight size={16} strokeWidth={3} />
                    </button>
                    <Link href="/" className="inline-block mt-8 text-[10px] font-black uppercase tracking-[0.3em] text-white/20 hover:text-primary transition-colors italic">Bypass Security</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="relative flex min-h-screen flex-col bg-background-dark font-sans text-on-background-dark antialiased selection:bg-primary/30">
            <DashboardHeader 
                user={tutorData} 
                role="TUTOR" 
                credits={tutorData?.credits || 0} 
                onLogout={() => router.push("/")}
            />

            <div className="flex flex-1">
                <aside className="fixed left-0 top-[85px] bottom-0 w-24 md:w-80 bg-surface-dark/20 backdrop-blur-3xl border-r border-border-dark flex flex-col items-center md:items-stretch py-8 px-4 md:px-10 z-50 transition-all duration-500">
                    <div className="mb-12 hidden md:block px-6">
                        <h4 className="text-[10px] font-black text-on-surface-dark/20 uppercase tracking-[0.4em] mb-8 italic">Management Controls</h4>
                    </div>

                    <nav className="space-y-4 w-full">
                        {[
                            { id: "HOME", label: "INTELLIGENCE_HUB", icon: LayoutDashboard },
                            { id: "PIPELINE", label: "SIGNAL_STREAM", icon: Radar },
                            { id: "BATCHES", label: "BATCH_MANAGER", icon: Box },
                            { id: "CHAT", label: "MESSAGING_HUB", icon: MessageCircle },
                            { id: "REVENUE", label: "FINANCIAL_LEDGER", icon: CreditCard },
                            { id: "SETTINGS", label: "SYNC_SETTINGS", icon: Settings }
                        ].map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`w-full flex items-center gap-4 px-4 md:px-6 py-4 rounded-2xl font-black text-[11px] tracking-widest transition-all group relative overflow-hidden ${
                                    activeTab === item.id 
                                    ? "bg-primary text-white shadow-xl shadow-primary/20" 
                                    : "text-on-surface-dark/40 hover:bg-surface-dark hover:text-primary border border-transparent hover:border-border-dark"
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
                        className="mt-auto flex items-center justify-center md:justify-start gap-4 px-6 md:px-6 py-4 text-red-500/40 hover:text-red-500 text-[10px] font-black uppercase tracking-[0.3em] transition-colors"
                    >
                        <LogOut size={16} strokeWidth={3} />
                        <span className="hidden md:block">EXIT HUB</span>
                    </button>
                </aside>

                <main className="flex-1 ml-24 md:ml-80 p-6 md:p-12 lg:p-16">
                    <div className="max-w-7xl mx-auto">
                        
                        {(activeTab !== "CHAT" && activeTab !== "SETTINGS" && activeTab !== "REVENUE") && (
                            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 mb-24 anim-fade-up">
                                <div className="max-w-2xl relative">
                                    <div className="absolute -left-12 top-0 text-[180px] font-black text-white/5 leading-none tracking-tighter italic select-none pointer-events-none uppercase">CORE</div>
                                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/5 rounded-full border border-primary/10 mb-8">
                                        <Activity size={14} className="animate-pulse text-primary" />
                                        <span className="text-[10px] font-black text-primary uppercase tracking-widest italic tracking-[0.2em]">Faculty Terminal Synchronized</span>
                                    </div>
                                    <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 uppercase italic leading-[0.85] text-white">
                                        Strategic <br/><span className="text-primary underline decoration-primary/20 decoration-8 underline-offset-8">Intelligence.</span>
                                    </h1>
                                    <p className="text-xl text-on-surface-dark/60 font-medium leading-relaxed max-w-xl italic">
                                        Monitoring <span className="text-white font-black italic">{tutorData?.name || "Professor"}</span>. {activeTab}_SCAN active.
                                    </p>
                                </div>
                                {activeTab === 'BATCHES' && (
                                    <button onClick={() => setShowBatchForm(true)} className="group relative flex items-center gap-4 px-12 py-6 bg-primary text-white rounded-[2.5rem] font-black text-[11px] tracking-widest shadow-2xl shadow-primary/20 hover:scale-[1.05] transition-all active:scale-95 uppercase leading-none italic h-fit">
                                       <PlusCircle size={18} strokeWidth={3} />
                                       NEW_BATCH_GROUP
                                    </button>
                                )}
                            </div>
                        )}

                        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                            {activeTab === "SETTINGS" && <SettingsModule userData={tutorData} onUpdate={fetchTutorData} />}
                            {activeTab === "REVENUE" && <BillingModule userData={tutorData} transactions={transactions} />}

                            {activeTab === "HOME" && (
                                <div className="space-y-24">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                        {[
                                            { label: "Asset Reserve", val: tutorData?.credits || 0, icon: Wallet, theme: "text-primary" },
                                            { label: "Signal Density", val: leads.length, icon: Radar, theme: "text-blue-500" },
                                            { label: "Trust Index", val: "99.1", icon: ShieldCheck, theme: "text-emerald-500" },
                                            { label: "Output Vector", val: "14%", icon: TrendingUp, theme: "text-amber-500" }
                                        ].map((stat, i) => (
                                            <div key={i} className="group p-10 rounded-[3rem] bg-surface-dark/40 backdrop-blur-md border border-border-dark border-b-6 border-transparent hover:border-primary/50 transition-all group relative overflow-hidden">
                                                <stat.icon size={80} className="absolute -right-4 -top-4 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity" />
                                                <div className={`size-14 rounded-2xl bg-background-dark border border-border-dark flex items-center justify-center mb-8 ${stat.theme}`}>
                                                    <stat.icon size={24} strokeWidth={2.5} />
                                                </div>
                                                <p className="text-[10px] font-black text-on-surface-dark/20 uppercase tracking-[0.3em] mb-2 italic leading-none">{stat.label}</p>
                                                <p className="text-5xl font-black text-white italic tracking-tighter">{stat.val}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeTab === "PIPELINE" && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pb-24">
                                    {loading ? (
                                        <div className="col-span-2 py-40 flex flex-col items-center justify-center opacity-50 bg-surface-dark/20 rounded-[4rem] border border-border-dark text-white italic">
                                            <Loader2 className="animate-spin mb-10" size={48} strokeWidth={3} />
                                            <p className="font-black text-[12px] uppercase tracking-[0.6em] italic">Synthesizing Signal Grid...</p>
                                        </div>
                                    ) : leads.length > 0 ? leads.map((lead) => (
                                        <div key={lead.id} className="group relative bg-surface-dark/40 border border-border-dark rounded-[3.5rem] p-12 hover:border-primary/30 transition-all duration-700 overflow-hidden border-b-8 flex flex-col text-white">
                                            <div className="relative z-10">
                                                <div className="flex justify-between items-center mb-10 italic">
                                                    <span className="px-6 py-2.5 bg-primary/10 text-primary rounded-xl text-[10px] font-black uppercase tracking-widest border border-primary/20 leading-none">{lead.subjects?.[0] || 'GENERAL'}</span>
                                                    <div className="flex items-center gap-2 px-3 py-1 bg-background-dark/80 rounded-lg text-emerald-500/60 text-[9px] font-black uppercase tracking-widest leading-none border border-emerald-500/10 italic">PRIORITY_SIGNAL</div>
                                                </div>
                                                <h3 className="text-4xl font-black text-white mb-10 leading-[1.05] tracking-tighter uppercase italic group-hover:text-primary transition-colors">"{lead.description}"</h3>
                                                
                                                {lead.isUnlocked ? (
                                                    <div className="p-8 bg-background-dark/80 rounded-[2.5rem] border border-border-dark flex items-center gap-8 border-b-4 border-emerald-500/20 overflow-hidden">
                                                        <div className="size-16 rounded-2xl bg-emerald-500 text-white flex items-center justify-center font-black text-2xl italic shadow-xl">{lead.student?.name?.[0]}</div>
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="text-xl font-black uppercase italic text-white truncate">{lead.student?.name}</h4>
                                                            <p className="text-[9px] font-black text-emerald-500/60 uppercase tracking-widest leading-none mt-1">SECURE_SYNC_LOCKED</p>
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
                                                            className="size-14 bg-emerald-500 text-white rounded-2xl flex items-center justify-center hover:bg-white hover:text-emerald-500 transition-all active:scale-95 shadow-xl shadow-emerald-500/10"
                                                        >
                                                            {loadingChat ? <Loader2 className="animate-spin" size={20} /> : <MessageCircle size={24} className="font-black" strokeWidth={3} />}
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center justify-between gap-8 mt-4 pt-10 border-t border-white/5">
                                                        <div className="flex items-center gap-3">
                                                            <div className="p-3 bg-primary/5 rounded-xl text-primary"><Search size={16} strokeWidth={3}/></div>
                                                            <p className="text-white font-black text-sm uppercase italic tracking-tighter leading-none">{lead.locations?.[0] || 'REMOTE_NODE'}</p>
                                                        </div>
                                                        <button 
                                                            onClick={() => handleUnlock(lead.id)}
                                                            className="px-10 py-5 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-primary transition-all active:scale-95 shadow-xl shadow-primary/10 flex items-center gap-3 italic"
                                                            disabled={loading}
                                                        >
                                                            <Zap size={14} fill="currentColor" strokeWidth={0} /> REVEAL_NODE
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="absolute -bottom-12 -right-12 size-48 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors"></div>
                                        </div>
                                    )) : (
                                        <div className="col-span-full py-40 text-center opacity-30 italic font-black uppercase tracking-[0.4em] border-2 border-dashed border-border-dark rounded-[4rem] text-white">Establishing Discovery Signal...</div>
                                    )}
                                </div>
                            )}

                            {activeTab === "CHAT" && (
                                <div className="h-[calc(100vh-280px)] flex bg-surface-dark/20 backdrop-blur-3xl rounded-[3.5rem] border border-border-dark overflow-hidden anim-fade-up border-b-8">
                                    <div className="w-full md:w-96 border-r border-border-dark flex flex-col bg-background-dark/30">
                                        <div className="p-8 border-b border-border-dark flex items-center justify-between">
                                            <h3 className="text-sm font-black text-white uppercase italic tracking-[0.2em]">Active_Feeds</h3>
                                            <div className="px-3 py-1 bg-primary/10 text-primary rounded-lg text-[9px] font-black uppercase tracking-widest leading-none border border-primary/20 italic">{chatSessions.length} NODES</div>
                                        </div>
                                        <div className="flex-1 overflow-y-auto scrollbar-hide py-4">
                                            {chatSessions.length > 0 ? chatSessions.map((session) => (
                                                <button
                                                    key={session.id}
                                                    onClick={() => setSelectedSession(session)}
                                                    className={`w-full p-6 text-left flex items-center gap-6 transition-all border-l-4 ${
                                                        selectedSession?.id === session.id 
                                                        ? "bg-primary/10 border-primary" 
                                                        : "border-transparent hover:bg-white/5"
                                                    }`}
                                                >
                                                    <div className="size-14 rounded-2xl bg-surface-dark border border-border-dark flex items-center justify-center font-black text-xl italic text-white shadow-lg overflow-hidden shrink-0">
                                                        {session.student?.name?.[0]}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center justify-between mb-1">
                                                            <h4 className="text-sm font-black text-white uppercase italic tracking-tighter truncate">{session.student?.name}</h4>
                                                            <span className="text-[8px] font-black opacity-40 uppercase tabular-nums">{new Date(session.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                        </div>
                                                        <p className="text-[10px] font-medium text-white/30 truncate uppercase tracking-tight italic">
                                                            {session.messages?.[0]?.content || "PROTOCOL_STBY: STANDING BY..."}
                                                        </p>
                                                    </div>
                                                </button>
                                            )) : (
                                                <div className="p-10 text-center opacity-20 italic font-black uppercase tracking-widest text-xs mt-20">Link Buffer Empty</div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        {selectedSession ? (
                                            <FacultyChat 
                                                sessionId={selectedSession.id}
                                                currentUser={tutorData}
                                                recipientName={selectedSession.student?.name}
                                            />
                                        ) : (
                                            <div className="h-full flex flex-col items-center justify-center opacity-10 italic">
                                                <div className="relative mb-8">
                                                    <MessageCircle size={100} strokeWidth={1} />
                                                    <div className="absolute inset-0 bg-primary/20 blur-[60px] rounded-full"></div>
                                                </div>
                                                <p className="text-[12px] font-black uppercase tracking-[0.5em]">Select Node to Synchronize</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {activeTab === "BATCHES" && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pb-24">
                                    {courses.length > 0 ? courses.map((course) => (
                                        <div key={course.id} className="bg-surface-dark/40 border border-border-dark rounded-[3rem] p-10 flex flex-col gap-8 text-white group hover:border-primary/20 transition-all">
                                            <div className="flex justify-between items-start">
                                                <div className="px-5 py-2 bg-primary/10 text-primary rounded-xl text-[9px] font-black uppercase tracking-widest italic border border-primary/10">{course.category}</div>
                                                <div className="flex flex-col items-end">
                                                    <span className="text-3xl font-black italic tracking-tighter text-white">₹{course.price}</span>
                                                    <span className="text-[8px] font-black text-white/20 uppercase tracking-widest italic">PER_SCHOLAR_INDEX</span>
                                                </div>
                                            </div>
                                            <h3 className="text-3xl font-black uppercase italic tracking-tighter group-hover:text-primary transition-all leading-none">{course.title}</h3>
                                            <div className="grid grid-cols-2 gap-4 py-8 border-y border-white/5 italic">
                                                <div>
                                                    <p className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-2 leading-none">Cohort_Occupancy</p>
                                                    <p className="font-black text-xs text-primary italic leading-none">{course.enrolledCount} / {course.maxSeats} SEATS</p>
                                                </div>
                                                <div>
                                                    <p className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-2 leading-none">Operational_Status</p>
                                                    <p className="font-black text-xs text-emerald-500 italic leading-none">{course.isActive ? 'ACTIVE_BATCH' : 'DECOMMISSIONED'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="col-span-2 py-40 flex flex-col items-center justify-center bg-white/5 rounded-[4rem] border border-dashed border-white/10 italic text-white/20">
                                            <Box size={48} className="mb-6 opacity-20" />
                                            <p className="font-black text-[10px] uppercase tracking-[0.5em]">Inventory Empty: Deploy Batches</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === "CHAT" && (
                                <div className="h-[75vh] grid grid-cols-1 lg:grid-cols-12 gap-10">
                                    <div className="lg:col-span-4 bg-surface-dark/20 backdrop-blur-3xl rounded-[3rem] border border-border-dark overflow-hidden flex flex-col">
                                        <div className="p-8 border-b border-border-dark flex items-center justify-between">
                                            <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.5em] italic">Signal Nodes</h3>
                                            <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-black text-xs">{chatSessions.length}</div>
                                        </div>
                                        <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide">
                                            {loadingChat ? (
                                                <div className="flex flex-col items-center justify-center py-20 gap-4 opacity-20 italic font-black uppercase text-[10px] tracking-widest">
                                                    <Loader2 className="animate-spin" size={24} />
                                                    Syncing Nodes...
                                                </div>
                                            ) : chatSessions.length > 0 ? chatSessions.map((session) => {
                                                const recipient = session.tutorId === tutorId ? session.student : session.tutor;
                                                const isActive = selectedSession?.id === session.id;
                                                return (
                                                    <button
                                                        key={session.id}
                                                        onClick={() => setSelectedSession(session)}
                                                        className={`w-full p-6 rounded-[2rem] flex items-center gap-4 transition-all border border-transparent hover:scale-[1.02] active:scale-95 group overflow-hidden relative ${
                                                            isActive ? "bg-primary border-primary shadow-xl shadow-primary/20 text-white" : "bg-white/5 hover:bg-white/10 text-white"
                                                        }`}
                                                    >
                                                        <div className={`size-12 rounded-2xl flex items-center justify-center font-black text-lg italic shadow-xl transition-all ${isActive ? "bg-white text-primary" : "bg-primary text-white"}`}>
                                                            {recipient?.name?.[0] || "?"}
                                                        </div>
                                                        <div className="flex-1 text-left min-w-0">
                                                            <p className="text-[10px] font-black uppercase tracking-tight truncate italic leading-none mb-2">{recipient?.name}</p>
                                                            <p className={`text-[9px] font-medium tracking-wide truncate italic opacity-40 leading-none ${isActive ? "text-white" : "text-white/60"}`}>NEURAL_SYNC_ACTIVE</p>
                                                        </div>
                                                    </button>
                                                )
                                            }) : (
                                                <div className="py-20 text-center opacity-20 italic font-black uppercase tracking-[0.3em] text-[10px] px-10 text-white leading-relaxed">No scholarly nodes detected.</div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="lg:col-span-8 overflow-hidden">
                                        {selectedSession ? (
                                            <FacultyChat 
                                                sessionId={selectedSession.id} 
                                                currentUser={{ id: tutorId, name: tutorData?.name }} 
                                                recipientName={selectedSession.tutorId === tutorId ? selectedSession.student?.name : selectedSession.tutor?.name}
                                            />
                                        ) : (
                                            <div className="h-full flex flex-col items-center justify-center space-y-8 bg-surface-dark/10 rounded-[4rem] border-4 border-dashed border-border-dark/50 p-20 text-center text-white italic">
                                                <MessageCircle size={64} className="text-primary/20" />
                                                <h2 className="text-4xl font-black uppercase tracking-tighter">Scholarly <span className="text-primary">Dialogue.</span></h2>
                                                <p className="text-white/20 max-w-sm mx-auto font-black text-[10px] tracking-widest uppercase">Select an active neural link to initiate synchronization protocol.</p>
                                            </div>
                                        )}
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
            <div className="flex items-center justify-center min-h-screen bg-background-dark font-sans overflow-hidden text-primary italic">
                 <div className="flex flex-col items-center gap-10">
                    <div className="size-24 rounded-[3.5rem] bg-primary/10 border-2 border-primary/20 flex items-center justify-center animate-spin-slow">
                        <Radar size={32} className="animate-pulse" strokeWidth={3} />
                    </div>
                    <p className="text-[11px] font-black uppercase tracking-[0.8em] animate-pulse">Initializing Faculty Terminal...</p>
                 </div>
            </div>
        }>
            <DashboardContent />
        </Suspense>
    );
}
