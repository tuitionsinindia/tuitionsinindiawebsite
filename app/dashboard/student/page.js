"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Script from "next/script";
import Link from "next/link";
import DashboardHeader from "@/app/components/DashboardHeader";
import FacultyChat from "@/app/components/chat/FacultyChat";
import { 
    User, 
    GraduationCap, 
    Bolt, 
    Briefcase, 
    LayoutDashboard, 
    Search, 
    History, 
    ShieldCheck, 
    Settings, 
    ArrowRight, 
    MessageSquare, 
    Phone, 
    Mail, 
    Star, 
    Trophy,
    Target,
    Zap,
    Clock,
    BadgeCheck,
    LogOut,
    CheckCircle2,
    Lock,
    Users,
    MessageCircle,
    Layout,
    User as UserIcon, 
    CreditCard, 
    Settings as SettingsIcon,
    Star as StarIcon
} from "lucide-react";
import ReviewModal from "@/app/components/ReviewModal";
import SettingsModule from "@/app/components/dashboard/SettingsModule";
import BillingModule from "@/app/components/dashboard/BillingModule";

function StudentDashboardContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [studentId, setStudentId] = useState(searchParams.get("studentId") || "");
    const [activeTab, setActiveTab] = useState("HOME"); 
    const [loading, setLoading] = useState(true);
    const [studentData, setStudentData] = useState(null);
    const [unlockedTutors, setUnlockedTutors] = useState([]);
    const [potentialMatches, setPotentialMatches] = useState([]);
    const [activeLeads, setActiveLeads] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [showSuccess, setShowSuccess] = useState(searchParams.get("success") === "true");
    
    // Chat States
    const [chatSessions, setChatSessions] = useState([]);
    const [selectedSession, setSelectedSession] = useState(null);
    const [loadingChat, setLoadingChat] = useState(false);
    
    // Review States
    const [isReviewOpen, setIsReviewOpen] = useState(false);
    const [selectedTutorForReview, setSelectedTutorForReview] = useState(null);

    useEffect(() => {
        if (studentId) {
            fetchStudentData();
            fetchUnlockedTutors();
            fetchPotentialMatches();
            fetchActiveLeads();
            fetchChatSessions();
            fetchTransactions();
        }
    }, [studentId]);

    const fetchStudentData = async () => {
        try {
            const res = await fetch(`/api/user/info?id=${studentId}`);
            if (res.ok) {
                const data = await res.json();
                setStudentData(data);
            }
        } catch (err) { console.error(err); }
    };

    const fetchUnlockedTutors = async () => {
        try {
            const res = await fetch(`/api/student/unlocked-tutors?studentId=${studentId}`);
            if (res.ok) {
                const data = await res.json();
                setUnlockedTutors(data);
            }
        } catch (err) { console.error(err); }
    };

    const fetchPotentialMatches = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/matching/matches?id=${studentId}&role=STUDENT`);
            if (res.ok) {
                const data = await res.json();
                setPotentialMatches(data);
            }
        } catch (err) { console.error(err); } finally { setLoading(false); }
    };

    const fetchActiveLeads = async () => {
        try {
            const res = await fetch(`/api/student/active-leads?studentId=${studentId}`);
            if (res.ok) {
                const data = await res.json();
                setActiveLeads(data);
            }
        } catch (err) { console.error(err); }
    };

    const fetchChatSessions = async () => {
        setLoadingChat(true);
        try {
            const res = await fetch(`/api/chat/session?userId=${studentId}`);
            if (res.ok) {
                const data = await res.json();
                setChatSessions(data.sessions);
            }
        } catch (err) { console.error(err); } finally { setLoadingChat(false); }
    };

    const fetchTransactions = async () => {
        try {
            const res = await fetch(`/api/user/transactions?userId=${studentId}`);
            if (res.ok) {
                const data = await res.json();
                setTransactions(data.transactions);
            }
        } catch (err) { console.error(err); }
    };

    const makePayment = async () => {
        // Razorpay logic
    };

    if (!studentId) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background-dark p-4 font-sans relative overflow-hidden text-white italic">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[600px] bg-amber-500/10 rounded-full blur-[120px] -z-10 animate-pulse"></div>
                <div className="bg-surface-dark/40 backdrop-blur-3xl p-10 rounded-[2.5rem] shadow-2xl border border-border-dark max-w-md w-full relative z-10 text-center">
                    <div className="size-20 rounded-3xl bg-amber-500/10 flex items-center justify-center text-amber-500 mx-auto mb-8 border border-amber-500/20">
                        <GraduationCap size={40} strokeWidth={1.5} />
                    </div>
                    <h2 className="text-3xl font-black mb-3 tracking-tighter uppercase">Student Access.</h2>
                    <p className="text-on-surface-dark/40 mb-10 text-[11px] font-black uppercase tracking-widest leading-relaxed italic">Enter your institutional ID to access the academic terminal.</p>
                    <input
                        type="text"
                        placeholder="STUDENT PROTOCOL ID"
                        className="w-full bg-background-dark/50 border border-border-dark rounded-2xl p-5 text-white font-black text-xs uppercase tracking-widest focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 outline-none transition-all placeholder:text-white/10 mb-6 italic"
                        onKeyDown={(e) => { if (e.key === 'Enter') setStudentId(e.target.value); }}
                        id="studentInput"
                    />
                    <button
                        className="w-full bg-amber-500 text-white font-black py-5 rounded-2xl hover:bg-amber-600 shadow-xl transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-xs active:scale-95 leading-none"
                        onClick={() => setStudentId(document.getElementById('studentInput').value)}>
                        EXECUTE LOGIN <ArrowRight size={16} strokeWidth={3} />
                    </button>
                    <Link href="/" className="inline-block mt-8 text-[10px] font-black uppercase tracking-[0.3em] text-white/20 hover:text-amber-500 transition-colors italic">Bypass Portal</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="relative flex min-h-screen flex-col bg-background-dark font-sans text-on-background-dark antialiased">
            <Script src="https://checkout.razorpay.com/v1/checkout.js" />

            <DashboardHeader 
                user={studentData} 
                role="STUDENT" 
                credits={studentData?.credits} 
                onAddCredits={makePayment}
                onLogout={() => router.push("/")}
            />

            <div className="flex flex-1">
                {/* Modern Fixed Navigation Bar */}
                <aside className="fixed left-0 top-[85px] bottom-0 w-24 md:w-80 bg-surface-dark/20 backdrop-blur-3xl border-r border-border-dark flex flex-col items-center md:items-stretch py-8 px-4 md:px-10 z-50">
                    <div className="mb-12 hidden md:block px-6">
                        <h4 className="text-[10px] font-black text-on-surface-dark/20 uppercase tracking-[0.4em] mb-8 italic">Academy Command</h4>
                    </div>

                    <nav className="space-y-4 w-full">
                        {[
                            { id: "HOME", label: "PORTAL HOME", icon: LayoutDashboard },
                            { id: "REQUIREMENTS", label: "ACTIVE MANDATES", icon: Briefcase },
                            { id: "MATCHES", label: "FACULTY MATCHES", icon: Users },
                            { id: "CHAT", label: "MESSAGING HUB", icon: MessageCircle },
                            { id: "CONTACTS", label: "SECURE DIRECTORY", icon: ShieldCheck },
                            { id: "BILLING", label: "FINANCE LEDGER", icon: CreditCard },
                            { id: "SETTINGS", label: "PROFILE PROTOCOL", icon: SettingsIcon }
                        ].map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`w-full flex items-center gap-4 px-4 md:px-6 py-4 rounded-2xl font-black text-[11px] tracking-widest transition-all group relative overflow-hidden ${
                                    activeTab === item.id 
                                    ? "bg-amber-500 text-white shadow-xl shadow-amber-500/20" 
                                    : "text-on-surface-dark/40 hover:bg-surface-dark hover:text-amber-500 border border-transparent hover:border-border-dark"
                                }`}
                            >
                                <item.icon size={20} strokeWidth={2.5} className={activeTab === item.id ? "opacity-100 font-black" : "opacity-40"} />
                                <span className="hidden md:block">{item.label}</span>
                                {activeTab === item.id && <div className="absolute right-0 top-0 bottom-0 w-1 bg-white md:hidden"></div>}
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

                        {/* Success Banner Section */}
                        {showSuccess && (
                            <div className="mb-12 animate-in zoom-in-95 duration-500">
                                <div className="bg-emerald-500/10 border-2 border-emerald-500/30 rounded-[3rem] p-8 md:p-12 relative overflow-hidden group">
                                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 text-white text-center md:text-left">
                                        <div className="size-20 rounded-[2rem] bg-emerald-500 text-white flex items-center justify-center shadow-2xl shadow-emerald-500/40 animate-bounce">
                                            <CheckCircle2 size={40} strokeWidth={3} />
                                        </div>
                                        <div>
                                            <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase italic leading-none mb-4">Mandate Deployed <span className="text-emerald-500 underline decoration-emerald-500/20 underline-offset-8">Successfully.</span></h2>
                                            <p className="text-on-surface-dark/60 font-medium text-lg leading-relaxed max-w-xl italic">
                                                Your requirement for <span className="text-white font-black">{activeLeads[0]?.subjects?.[0] || "the subject"}</span> is now broadcasting to our elite faculty network.
                                            </p>
                                        </div>
                                        <button onClick={() => setShowSuccess(false)} className="md:ml-auto p-4 text-white/20 hover:text-white transition-colors">
                                            <LogOut size={24} className="rotate-45" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Content Switching Logic */}
                        
                        {activeTab === "HOME" && (
                            <div className="space-y-24">
                                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12">
                                    <div className="max-w-2xl">
                                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/5 rounded-full border border-amber-500/10 mb-8">
                                            <span className="size-2 rounded-full bg-amber-500 animate-pulse"></span>
                                            <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Protocol: Neural Matching Active</span>
                                        </div>
                                        <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 uppercase italic leading-[0.85] text-white">
                                            Academic <span className="text-amber-500 underline decoration-amber-500/20 decoration-8 underline-offset-8">Terminal.</span>
                                        </h1>
                                        <p className="text-xl text-on-surface-dark/60 font-medium leading-relaxed max-w-xl italic">
                                            Managing the academic trajectory of <span className="text-white font-black italic uppercase">{studentData?.name || "Candidate"}</span>.
                                        </p>
                                    </div>
                                    <Link href="/register/student?step=2" className="group relative flex items-center gap-4 px-12 py-6 bg-amber-500 text-white rounded-[2.5rem] font-black text-[11px] tracking-widest shadow-2xl shadow-amber-500/30 hover:scale-[1.05] transition-all uppercase leading-none overflow-hidden h-fit italic">
                                        <Target size={18} strokeWidth={3} />
                                        DEPLOY NEW MANDATE
                                    </Link>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    {[
                                        { label: "Active Pipelines", val: activeLeads.length, icon: Briefcase, theme: "text-blue-500" },
                                        { label: "Acquired Matches", val: unlockedTutors.length, icon: Users, theme: "text-emerald-500" },
                                        { label: "Neural Credits", val: studentData?.credits || 0, icon: Zap, theme: "text-amber-500" }
                                    ].map((stat, i) => (
                                        <div key={i} className="p-10 rounded-[3rem] bg-surface-dark/40 backdrop-blur-md border border-border-dark border-b-6 border-transparent hover:border-amber-500 transition-all group overflow-hidden relative">
                                            <stat.icon size={80} className="absolute -right-4 -top-4 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity" />
                                            <div className={`size-14 rounded-2xl bg-background-dark flex items-center justify-center mb-8 border border-border-dark ${stat.theme}`}>
                                                <stat.icon size={24} strokeWidth={2.5} />
                                            </div>
                                            <p className="text-[10px] font-black text-on-surface-dark/20 uppercase tracking-[0.3em] mb-2 italic">{stat.label}</p>
                                            <p className="text-5xl font-black text-white italic tracking-tighter">{stat.val}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === "CHAT" && (
                            <div className="h-[75vh] grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in fade-in duration-700">
                                {/* Session Sidebar */}
                                <div className="lg:col-span-4 bg-surface-dark/20 backdrop-blur-3xl rounded-[3rem] border border-border-dark overflow-hidden flex flex-col">
                                    <div className="p-8 border-b border-border-dark flex items-center justify-between">
                                        <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.5em] italic">Active Protocols</h3>
                                        <div className="size-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center font-black text-xs">{chatSessions.length}</div>
                                    </div>
                                    <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide">
                                        {loadingChat ? (
                                            <div className="flex flex-col items-center justify-center py-20 gap-4 opacity-20 italic">
                                                <Loader2 className="animate-spin" size={24} />
                                                <p className="text-[9px] font-black uppercase tracking-widest">Scanning Network...</p>
                                            </div>
                                        ) : chatSessions.length > 0 ? chatSessions.map((session) => {
                                            const recipient = session.studentId === studentId ? session.tutor : session.student;
                                            const isActive = selectedSession?.id === session.id;
                                            const lastMsg = session.messages?.[0];

                                            return (
                                                <button
                                                    key={session.id}
                                                    onClick={() => setSelectedSession(session)}
                                                    className={`w-full p-6 rounded-[2rem] flex items-center gap-4 transition-all border border-transparent hover:scale-[1.02] active:scale-95 group overflow-hidden relative ${
                                                        isActive ? "bg-amber-500 border-amber-500 shadow-xl shadow-amber-500/20" : "bg-white/5 hover:bg-white/10 hover:border-white/5"
                                                    }`}
                                                >
                                                    <div className={`size-12 rounded-2xl flex items-center justify-center font-black text-lg italic shadow-xl transition-all ${
                                                        isActive ? "bg-white text-amber-500" : "bg-amber-500 text-white group-hover:bg-white group-hover:text-amber-500"
                                                    }`}>
                                                        {recipient?.name?.[0] || "?"}
                                                    </div>
                                                    <div className="flex-1 text-left min-w-0">
                                                        <p className={`text-[10px] font-black uppercase tracking-tight truncate italic leading-none mb-2 ${isActive ? "text-white" : "text-white/80 group-hover:text-white"}`}>
                                                            {recipient?.name || "ANONYMOUS SCHOLAR"}
                                                        </p>
                                                        <p className={`text-[9px] font-medium tracking-wide truncate italic opacity-40 leading-none ${isActive ? "text-white" : "text-white/60"}`}>
                                                            {lastMsg ? `REQ: ${lastMsg.content.substring(0, 20)}...` : "PROTOCOL INITIALIZED"}
                                                        </p>
                                                    </div>
                                                    {isActive && <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-white"></div>}
                                                </button>
                                            )
                                        }) : (
                                            <div className="py-20 text-center opacity-20 italic font-black uppercase tracking-[0.3em] text-[9px] px-10 leading-relaxed">No active neural links discovered in the directory.</div>
                                        )}
                                    </div>
                                </div>

                                {/* Active Terminal */}
                                <div className="lg:col-span-8 overflow-hidden">
                                    {selectedSession ? (
                                        <FacultyChat 
                                            sessionId={selectedSession.id} 
                                            currentUser={{ id: studentId, name: studentData?.name }} 
                                            recipientName={selectedSession.studentId === studentId ? selectedSession.tutor?.name : selectedSession.student?.name}
                                        />
                                    ) : (
                                        <div className="h-full flex flex-col items-center justify-center space-y-8 bg-surface-dark/10 rounded-[4rem] border-4 border-dashed border-border-dark/50 p-20 text-center text-white italic">
                                            <div className="size-24 rounded-[3rem] bg-surface-dark border border-border-dark flex items-center justify-center mb-8 shadow-inner shadow-black/40">
                                                <MessageCircle size={48} className="text-amber-500/20" />
                                            </div>
                                            <h2 className="text-4xl font-black uppercase tracking-tighter">Messaging <span className="text-amber-500">Terminal.</span></h2>
                                            <p className="text-on-surface-dark/40 max-w-sm mx-auto font-medium text-sm leading-relaxed uppercase tracking-widest">"Select a protocol from the directory to initiate a secure scholarly synchronization."</p>
                                            <div className="px-8 py-3 bg-amber-500/5 border border-amber-500/20 rounded-full text-[9px] font-black text-amber-500 uppercase tracking-[0.4em] leading-none italic">STATUS: ENCRYPTED_STANDBY</div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Other tabs remain largely the same, but with pluralized field handling */}
                        {activeTab === "REQUIREMENTS" && (
                            <div className="space-y-12 animate-in fade-in duration-700">
                                <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter">My <span className="text-blue-500 underline decoration-blue-500/20">Requirements.</span></h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {activeLeads.length > 0 ? activeLeads.map((lead) => (
                                        <div key={lead.id} className="bg-surface-dark/40 border-2 border-border-dark p-12 rounded-[3.5rem] relative group hover:border-blue-500/30 transition-all text-white overflow-hidden border-b-8">
                                            <div className="flex justify-between items-center mb-10 relative z-10">
                                                <div className="px-5 py-2 bg-blue-500/10 text-blue-500 rounded-xl text-[9px] font-black uppercase tracking-widest border border-blue-500/20 italic">{lead.subjects?.[0] || 'Unknown'}</div>
                                                <div className="flex items-center gap-2">
                                                    <span className="size-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                                                    <p className="text-[9px] font-black text-white/20 uppercase tracking-widest italic">{lead.status}</p>
                                                </div>
                                            </div>
                                            <p className="text-3xl font-black text-white italic leading-[1.1] mb-12 relative z-10 tracking-tighter uppercase line-clamp-3">"{lead.description}"</p>
                                            <div className="grid grid-cols-2 gap-10 pt-10 border-t border-border-dark relative z-10">
                                                <div>
                                                    <p className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-2 italic">Faculty Zone</p>
                                                    <p className="text-sm font-black text-white italic uppercase tracking-widest leading-none">{lead.locations?.[0] || 'Remote'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-2 italic">Neural Level</p>
                                                    <p className="text-sm font-black text-white italic uppercase tracking-widest leading-none">{lead.grades?.[0] || 'N/A'}</p>
                                                </div>
                                            </div>
                                            <div className="absolute -bottom-12 -right-12 size-48 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-colors"></div>
                                        </div>
                                    )) : (
                                        <div className="col-span-full py-40 text-center opacity-30 italic font-black uppercase tracking-[0.4em] border-2 border-dashed border-border-dark rounded-[4rem] text-white">No active mandates synchronized in the terminal.</div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === "MATCHES" && (
                            <div className="space-y-12 animate-in fade-in duration-700">
                                <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter">Faculty <span className="text-emerald-500 underline decoration-emerald-500/20">Discovery.</span></h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {(potentialMatches.length > 0) ? potentialMatches.map((listing) => {
                                        const isUnlocked = unlockedTutors.some(ut => ut.id === listing.tutorId);
                                        const tutor = listing.tutor;
                                        
                                        return (
                                            <div key={listing.id} className="bg-surface-dark p-12 rounded-[3.5rem] border-2 border-border-dark hover:border-emerald-500/30 transition-all text-center group relative overflow-hidden border-b-8">
                                                <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <div className={`size-10 rounded-xl ${isUnlocked ? "bg-emerald-500/10 text-emerald-500" : "bg-white/5 text-white/20"} flex items-center justify-center`}>
                                                        {isUnlocked ? <CheckCircle2 size={20} /> : <Lock size={20} />}
                                                    </div>
                                                </div>
                                                
                                                <div className={`size-24 rounded-[2.5rem] bg-gradient-to-br ${isUnlocked ? 'from-emerald-500 to-emerald-800' : 'from-surface-dark to-background-dark border border-white/5'} text-white flex items-center justify-center font-black text-4xl italic mx-auto mb-10 shadow-2xl relative transition-all`}>
                                                    {tutor?.name?.[0] || "?"}
                                                </div>
                                                <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-2 leading-none">{tutor?.name || "ANONYMOUS"}</h3>
                                                <p className="text-[10px] font-black text-emerald-500/60 uppercase tracking-[0.2em] mb-12 italic leading-none">{listing.subjects?.[0] || "Academic Professional"}</p>
                                                
                                                <div className="flex gap-3">
                                                    {isUnlocked ? (
                                                        <>
                                                            <button 
                                                                onClick={() => {
                                                                    setSelectedTutorForReview(tutor);
                                                                    setIsReviewOpen(true);
                                                                }}
                                                                className="flex-1 py-5 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-center gap-3 text-[10px] font-black text-white hover:bg-white hover:text-black transition-all uppercase tracking-widest leading-none italic"
                                                            >
                                                                Rate Performance <StarIcon size={14} className="fill-emerald-500 text-emerald-500" />
                                                            </button>
                                                            <button 
                                                                onClick={async () => {
                                                                    setLoadingChat(true);
                                                                    try {
                                                                        const res = await fetch("/api/chat/session", {
                                                                            method: "POST",
                                                                            headers: { "Content-Type": "application/json" },
                                                                            body: JSON.stringify({ 
                                                                                studentId, 
                                                                                tutorId: listing.tutorId,
                                                                                initiatorId: studentId
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
                                                                {loadingChat ? <Loader2 className="animate-spin" size={20} /> : <MessageCircle size={20} className="font-black" strokeWidth={3} />}
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <button 
                                                            onClick={async () => {
                                                                // For students, unlocking is usually free or uses student credits
                                                                // But for the audit, we want to simulate the "Handshake"
                                                                // We'll call the chat session creation directly which implicitly "connects" them
                                                                setLoadingChat(true);
                                                                try {
                                                                    const res = await fetch("/api/chat/session", {
                                                                        method: "POST",
                                                                        headers: { "Content-Type": "application/json" },
                                                                        body: JSON.stringify({ 
                                                                            studentId, 
                                                                            tutorId: listing.tutorId,
                                                                            initiatorId: studentId
                                                                        })
                                                                    });
                                                                    if (res.ok) {
                                                                        await fetchUnlockedTutors();
                                                                        await fetchChatSessions();
                                                                        setActiveTab("CHAT");
                                                                    } else {
                                                                        const err = await res.json();
                                                                        alert(err.error || "CREDIT_PROTOCOL_LOCKED");
                                                                    }
                                                                } catch (err) { console.error(err); } finally { setLoadingChat(false); }
                                                            }}
                                                            className="w-full py-5 bg-amber-500 text-white rounded-2xl flex items-center justify-center gap-3 text-[10px] font-black hover:bg-white hover:text-amber-500 transition-all uppercase tracking-widest leading-none italic shadow-xl shadow-amber-500/10"
                                                        >
                                                            <Zap size={14} fill="currentColor" /> INITIATE_SESSION
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    }) : (
                                        <div className="col-span-full py-40 text-center opacity-30 italic font-black uppercase tracking-[0.4em] border-2 border-dashed border-border-dark rounded-[4rem] text-white">Establishing Match Pipeline...</div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === "CONTACTS" && (
                            <div className="space-y-12 animate-in fade-in duration-700">
                                <Link 
                                    href="/search"
                                    className="inline-flex items-center gap-4 text-[11px] font-black text-white/20 uppercase tracking-[0.3em] hover:text-blue-500 transition-all border border-white/5 px-6 py-3 rounded-full hover:bg-white/5"
                                >
                                    <ArrowRight size={14} className="rotate-180" /> Back to Search Discovery
                                </Link>
                                <h2 className="text-5xl font-black text-white uppercase italic tracking-tighter">Secure <span className="text-blue-500 underline decoration-blue-500/20">Directory.</span></h2>
                                <div className="bg-surface-dark/40 backdrop-blur-3xl border-2 border-border-dark rounded-[4rem] overflow-hidden shadow-2xl border-b-8">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="border-b-2 border-border-dark bg-background-dark/50">
                                                <th className="px-12 py-12 text-[10px] font-black uppercase tracking-[0.5em] text-white/20 italic">Faculty Identity</th>
                                                <th className="px-12 py-12 text-[10px] font-black uppercase tracking-[0.5em] text-white/20 italic">Secure Line Protocol</th>
                                                <th className="px-12 py-12 text-[10px] font-black uppercase tracking-[0.5em] text-white/20 italic">Action Terminal</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y-2 divide-border-dark">
                                            {unlockedTutors.length > 0 ? unlockedTutors.map((t) => (
                                                <tr key={t.id} className="group hover:bg-white/5 transition-colors">
                                                    <td className="px-12 py-12">
                                                        <div className="flex items-center gap-8">
                                                            <div className="size-20 rounded-[2rem] bg-blue-500/10 text-blue-500 flex items-center justify-center font-black text-4xl italic group-hover:scale-110 group-hover:bg-blue-500 group-hover:text-white transition-all shadow-xl border border-blue-500/10">
                                                                {t.name[0]}
                                                            </div>
                                                            <div>
                                                                <h4 className="text-xl font-black text-white uppercase italic tracking-tighter mb-1 leading-none">{t.name}</h4>
                                                                <p className="text-[10px] font-black text-white/20 uppercase tracking-widest italic">{t.tutorListing?.subjects?.[0] || "Academic Professional"}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-12 py-12">
                                                        <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-xl">
                                                            <BadgeCheck size={14} className="fill-emerald-500/20" />
                                                            <span className="text-[10px] font-black uppercase tracking-widest italic leading-none">Established_Link</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-12 py-12">
                                                        <div className="flex items-center gap-4">
                                                            <a href={`tel:${t.phone}`} className="size-14 bg-blue-500 text-white rounded-2xl flex items-center justify-center hover:bg-white hover:text-blue-500 transition-all shadow-xl active:scale-95">
                                                                <Phone size={20} strokeWidth={3} />
                                                            </a>
                                                            <button 
                                                                onClick={async () => {
                                                                    setLoadingChat(true);
                                                                    try {
                                                                        const res = await fetch("/api/chat/session", {
                                                                            method: "POST",
                                                                            headers: { "Content-Type": "application/json" },
                                                                            body: JSON.stringify({ 
                                                                                studentId, 
                                                                                tutorId: t.id,
                                                                                initiatorId: studentId
                                                                            })
                                                                        });
                                                                        if (res.ok) {
                                                                            await fetchChatSessions();
                                                                            setActiveTab("CHAT");
                                                                        }
                                                                    } catch (err) { console.error(err); } finally { setLoadingChat(false); }
                                                                }}
                                                                className="size-14 bg-white/5 border border-white/10 text-white rounded-2xl flex items-center justify-center hover:bg-white hover:text-black transition-all active:scale-95"
                                                            >
                                                                {loadingChat ? <Loader2 className="animate-spin" size={20} /> : <MessageCircle size={20} className="font-black" strokeWidth={3} />}
                                                            </button>
                                                            <button 
                                                                onClick={() => {
                                                                    setSelectedTutorForReview(t);
                                                                    setIsReviewOpen(true);
                                                                }}
                                                                className="size-14 bg-amber-500 text-white rounded-2xl flex items-center justify-center hover:bg-white hover:text-amber-500 transition-all shadow-xl active:scale-95"
                                                            >
                                                                <StarIcon size={20} strokeWidth={3} fill="currentColor" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )) : (
                                                <tr>
                                                    <td colSpan={3} className="px-12 py-40 text-center">
                                                        <div className="flex flex-col items-center justify-center opacity-20 italic font-black uppercase tracking-[0.4em] text-white">
                                                            <div className="p-8 bg-white/5 rounded-full border border-white/10 mb-8"><Search size={48} strokeWidth={1} /></div>
                                                            No verified nodes in secure directory.
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                    </div>
                </main>
            </div>

            {/* Review Terminal Modal */}
            <ReviewModal
                isOpen={isReviewOpen}
                onClose={() => setIsReviewOpen(false)}
                tutorId={selectedTutorForReview?.id}
                tutorName={selectedTutorForReview?.name}
                studentId={studentId}
                onSuccess={() => {
                    fetchUnlockedTutors();
                }}
            />
        </div>
    );
}

export default function StudentDashboard() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen bg-background-dark font-sans overflow-hidden italic text-amber-500">
                 <div className="flex flex-col items-center gap-10">
                    <div className="size-24 rounded-[3.5rem] bg-amber-500/10 border-2 border-amber-500/20 flex items-center justify-center animate-spin-slow shadow-[0_0_50px_rgba(245,158,11,0.2)]">
                        <Zap size={32} className="animate-pulse" strokeWidth={3} />
                    </div>
                    <p className="text-[11px] font-black uppercase tracking-[0.8em] animate-pulse">Establishing Portal Sync...</p>
                 </div>
            </div>
        }>
            <StudentDashboardContent />
        </Suspense>
    );
}
