"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Script from "next/script";
import Link from "next/link";
import DashboardHeader from "@/app/components/DashboardHeader";
import FacultyChat from "@/app/components/chat/FacultyChat";
import { 
    GraduationCap, 
    Briefcase, 
    LayoutDashboard, 
    Search, 
    ShieldCheck, 
    ArrowRight, 
    Phone, 
    Target,
    Zap,
    BadgeCheck,
    LogOut,
    CheckCircle2,
    Users,
    MessageCircle,
    Loader2,
    Activity
} from "lucide-react";
import ReviewModal from "@/app/components/ReviewModal";

function StudentDashboardContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [studentId, setStudentId] = useState("");
    const [activeTab, setActiveTab] = useState("HOME"); 
    const [loading, setLoading] = useState(true);
    const [studentData, setStudentData] = useState(null);
    const [unlockedTutors, setUnlockedTutors] = useState([]);
    const [activeLeads, setActiveLeads] = useState([]);
    const [showSuccess, setShowSuccess] = useState(searchParams.get("success") === "true");
    
    // Chat States
    const [chatSessions, setChatSessions] = useState([]);
    const [selectedSession, setSelectedSession] = useState(null);
    const [loadingChat, setLoadingChat] = useState(false);
    
    // Review States
    const [isReviewOpen, setIsReviewOpen] = useState(false);
    const [selectedTutorForReview, setSelectedTutorForReview] = useState(null);

    // Initial ID recovery and storage
    useEffect(() => {
        const idFromUrl = searchParams.get("studentId");
        if (idFromUrl) {
            setStudentId(idFromUrl);
            localStorage.setItem("ti_active_student_id", idFromUrl);
        } else {
            const savedId = localStorage.getItem("ti_active_student_id");
            if (savedId) setStudentId(savedId);
        }
    }, [searchParams]);

    useEffect(() => {
        if (studentId) {
            fetchStudentData();
            fetchUnlockedTutors();
            fetchActiveLeads();
            fetchChatSessions();
        }
    }, [studentId]);

    const fetchStudentData = async () => {
        try {
            const res = await fetch(`/api/user/info?id=${studentId}&viewerId=${studentId}`);
            if (res.ok) {
                const data = await res.json();
                setStudentData(data);
            }
        } catch (err) { console.error(err); }
    };

    const fetchUnlockedTutors = async () => {
        try {
            const resUnlocked = await fetch(`/api/student/unlocked-tutors?studentId=${studentId}`);
            let unlocked = [];
            if (resUnlocked.ok) {
                unlocked = await resUnlocked.json();
            }

            const resMatches = await fetch(`/api/matching/matches?id=${studentId}&role=STUDENT`);
            if (resMatches.ok) {
                const matches = await resMatches.json();
                const combined = [...unlocked, ...matches];
                const unique = Array.from(new Map(combined.map(t => [t.id, t])).values());
                setUnlockedTutors(unique);
            } else {
                setUnlockedTutors(unlocked);
            }
        } catch (err) { 
            console.error("Match sync error:", err); 
        } finally { 
            setLoading(false); 
        }
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

    const handleLogout = () => {
        localStorage.removeItem("ti_active_student_id");
        router.push("/");
    };

    if (!studentId) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-blue-50/30 p-4 font-sans relative overflow-hidden text-gray-900">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[600px] bg-blue-600/5 rounded-full blur-[120px] -z-10 animate-pulse"></div>
                <div className="bg-white p-10 rounded-[3rem] shadow-4xl shadow-blue-900/10 border border-gray-100 max-w-md w-full relative z-10 text-center">
                    <div className="size-20 rounded-3xl bg-blue-600 text-white flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-blue-600/20">
                        <GraduationCap size={40} strokeWidth={1.5} />
                    </div>
                    <h2 className="text-3xl font-black mb-3 tracking-tighter uppercase italic leading-none">Student Hub.</h2>
                    <p className="text-gray-400 mb-10 text-xs font-black uppercase tracking-[0.2em] leading-relaxed italic">Synchronize with your academic ID to access the dashboard terminal.</p>
                    <input
                        type="text"
                        placeholder="STUDENT PROTOCOL ID"
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-5 text-gray-900 font-bold text-sm tracking-tight focus:ring-4 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all placeholder:text-gray-300 mb-6 italic"
                        onKeyDown={(e) => { if (e.key === 'Enter') setStudentId(e.target.value); }}
                        id="studentInput"
                    />
                    <button
                        className="w-full bg-blue-600 text-white font-black py-5 rounded-2xl hover:bg-gray-900 shadow-xl transition-all flex items-center justify-center gap-3 uppercase tracking-[0.3em] text-xs active:scale-95 leading-none"
                        onClick={() => setStudentId(document.getElementById('studentInput').value)}>
                        INITIATE PORTAL <ArrowRight size={16} strokeWidth={3} />
                    </button>
                    <Link href="/" className="inline-block mt-8 text-xs font-black uppercase tracking-[0.4em] text-gray-300 hover:text-blue-600 transition-colors italic">Bypass Hub</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="relative flex min-h-screen flex-col bg-gray-50 font-sans text-gray-900 antialiased">
            <Script src="https://checkout.razorpay.com/v1/checkout.js" />

            <DashboardHeader 
                user={studentData} 
                role="STUDENT" 
                credits={studentData?.credits} 
                onLogout={handleLogout}
            />

            <div className="flex flex-1">
                {/* Sidestream Navigation */}
                <aside className="fixed left-0 top-[85px] bottom-0 w-24 md:w-80 bg-white border-r border-gray-100 flex flex-col items-center md:items-stretch py-8 px-4 md:px-10 z-50 shadow-sm">
                    <div className="mb-12 hidden md:block px-6">
                        <h4 className="text-xs font-black text-gray-300 uppercase tracking-[0.4em] mb-8 italic">Academy Command</h4>
                    </div>

                    <nav className="space-y-4 w-full">
                        {[
                            { id: "HOME", label: "DASHBOARD", icon: LayoutDashboard },
                            { id: "REQUIREMENTS", label: "ACTIVE MANDATES", icon: Briefcase },
                            { id: "MATCHES", label: "FACULTY MATCHES", icon: Users },
                            { id: "CHAT", label: "MESSAGING HUB", icon: MessageCircle },
                            { id: "CONTACTS", label: "SECURE DIRECTORY", icon: ShieldCheck },
                        ].map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`w-full flex items-center gap-4 px-4 md:px-6 py-4 rounded-2xl font-black text-xs tracking-[0.2em] transition-all group relative overflow-hidden ${
                                    activeTab === item.id 
                                    ? "bg-blue-600 text-white shadow-2xl shadow-blue-600/20" 
                                    : "text-gray-400 hover:bg-gray-50 hover:text-blue-600 border border-transparent hover:border-gray-100"
                                }`}
                            >
                                <item.icon size={20} strokeWidth={2.5} className={activeTab === item.id ? "opacity-100" : "opacity-40"} />
                                <span className="hidden md:block">{item.label}</span>
                                {activeTab === item.id && <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-white md:hidden"></div>}
                            </button>
                        ))}
                    </nav>

                    <button 
                        onClick={handleLogout}
                        className="mt-auto flex items-center justify-center md:justify-start gap-4 px-6 py-4 text-red-400 hover:text-red-600 text-[10px] font-black uppercase tracking-[0.5em] transition-all italic"
                    >
                        <LogOut size={16} strokeWidth={3} />
                        <span className="hidden md:block text-xs">EXIT HUB</span>
                    </button>
                </aside>

                <main className="flex-1 ml-24 md:ml-80 p-6 md:p-12 lg:p-16">
                    <div className="max-w-7xl mx-auto">

                        {/* Success Notification */}
                        {showSuccess && (
                            <div className="mb-12 animate-in zoom-in-95 duration-500">
                                <div className="bg-emerald-50 border border-emerald-100 rounded-[3rem] p-8 md:p-12 relative overflow-hidden shadow-sm">
                                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
                                        <div className="size-20 rounded-[2rem] bg-emerald-500 text-white flex items-center justify-center shadow-2xl shadow-emerald-500/30 animate-bounce">
                                            <CheckCircle2 size={40} strokeWidth={3} />
                                        </div>
                                        <div>
                                            <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase italic leading-[0.85] mb-4 text-gray-900">Requirement <br/><span className="text-emerald-500">Posted</span></h2>
                                            <p className="text-gray-500 font-medium text-lg leading-relaxed max-w-xl italic">
                                                Your requirement has been synchronized with our verified faculty network. Expert mentors will contact you shortly.
                                            </p>
                                        </div>
                                        <button onClick={() => setShowSuccess(false)} className="md:ml-auto p-4 text-gray-300 hover:text-gray-500 transition-colors">
                                            <LogOut size={24} className="rotate-45" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "HOME" && (
                            <div className="space-y-24">
                                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12">
                                    <div className="max-w-2xl">
                                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full border border-blue-100 mb-8">
                                            <span className="size-2 rounded-full bg-blue-600 animate-pulse"></span>
                                            <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] italic">Smart matching enabled</span>
                                        </div>
                                        <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 uppercase italic leading-[0.85] text-gray-900">
                                            Your <span className="text-blue-600">Dashboard</span>
                                        </h1>
                                        <p className="text-xl text-gray-400 font-medium leading-relaxed max-w-xl italic">
                                            Managing the academic trajectory of <span className="text-gray-900 font-black italic uppercase">{studentData?.name || "Candidate"}</span>.
                                        </p>
                                    </div>
                                    <Link href="/post-requirement" className="group relative flex items-center gap-4 px-12 py-6 bg-blue-600 text-white rounded-[2.5rem] font-black text-[10px] tracking-[0.3em] shadow-2xl shadow-blue-600/30 hover:bg-gray-900 transition-all uppercase leading-none italic h-fit">
                                        <Target size={18} strokeWidth={3} />
                                        DEPLOY NEW MANDATE
                                    </Link>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    {[
                                        { label: "Active Pipelines", val: activeLeads.length, icon: Briefcase, color: "text-blue-600", bg: "bg-blue-50" },
                                        { label: "Acquired Matches", val: unlockedTutors.length, icon: Users, color: "text-emerald-600", bg: "bg-emerald-50" },
                                        { label: "Secure Credits", val: studentData?.credits || 0, icon: Zap, color: "text-blue-600", bg: "bg-blue-50" }
                                    ].map((stat, i) => (
                                        <div key={i} className="p-10 rounded-[3rem] bg-white border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-blue-900/5 transition-all group overflow-hidden relative">
                                            <div className={`size-14 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center mb-8 border border-transparent group-hover:border-current transition-all`}>
                                                <stat.icon size={24} strokeWidth={2.5} />
                                            </div>
                                            <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.4em] mb-2 italic">{stat.label}</p>
                                            <p className="text-5xl font-black text-gray-900 italic tracking-tighter">{stat.val}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === "CHAT" && (
                            <div className="h-[75vh] grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in fade-in duration-700">
                                {/* Session Sidebar */}
                                <div className="lg:col-span-4 bg-white rounded-[3rem] border border-gray-100 overflow-hidden flex flex-col shadow-sm">
                                    <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.5em] italic">Your Requests</h3>
                                        <div className="size-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-black text-xs shadow-lg shadow-blue-600/20">{chatSessions.length}</div>
                                    </div>
                                    <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide">
                                        {loadingChat ? (
                                            <div className="flex flex-col items-center justify-center py-20 gap-4 opacity-30 italic">
                                                <Loader2 className="animate-spin text-blue-600" size={24} />
                                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Scanning Network...</p>
                                            </div>
                                        ) : chatSessions.length > 0 ? chatSessions.map((session) => {
                                            const recipient = session.studentId === studentId ? session.tutor : session.student;
                                            const isActive = selectedSession?.id === session.id;
                                            const lastMsg = session.messages?.[0];

                                            return (
                                                <button
                                                    key={session.id}
                                                    onClick={() => setSelectedSession(session)}
                                                    className={`w-full p-6 rounded-[2rem] flex items-center gap-4 transition-all border group overflow-hidden relative ${
                                                        isActive ? "bg-blue-600 border-blue-600 text-white shadow-2xl shadow-blue-600/20" : "bg-gray-50 border-gray-100 hover:bg-white hover:border-blue-600"
                                                    }`}
                                                >
                                                    <div className={`size-12 rounded-2xl flex items-center justify-center font-black text-lg italic shadow-sm transition-all ${
                                                        isActive ? "bg-white text-blue-600" : "bg-blue-600 text-white"
                                                    }`}>
                                                        {recipient?.name?.[0] || "?"}
                                                    </div>
                                                    <div className="flex-1 text-left min-w-0">
                                                        <p className={`text-[10px] font-black uppercase tracking-tight truncate italic leading-none mb-2 ${isActive ? "text-white" : "text-gray-900"}`}>
                                                            {recipient?.name || "User"}
                                                        </p>
                                                        <p className={`text-[10px] font-medium tracking-wide truncate italic opacity-60 leading-none ${isActive ? "text-white/80" : "text-gray-400"}`}>
                                                            {lastMsg ? lastMsg.content.substring(0, 20) : "No messages yet"}
                                                        </p>
                                                    </div>
                                                    {isActive && <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-white"></div>}
                                                </button>
                                            )
                                        }) : (
                                            <div className="py-20 text-center opacity-30 italic font-black uppercase tracking-[0.3em] text-[10px] px-10 leading-relaxed text-gray-400">No active neural links discovered in the directory.</div>
                                        )}
                                    </div>
                                </div>

                                {/* Active Chats */}
                                <div className="lg:col-span-8 overflow-hidden rounded-[4rem] bg-white border border-gray-100 shadow-sm relative">
                                    {selectedSession ? (
                                        <FacultyChat 
                                            sessionId={selectedSession.id} 
                                            currentUser={{ id: studentId, name: studentData?.name }} 
                                            recipientName={selectedSession.studentId === studentId ? selectedSession.tutor?.name : selectedSession.student?.name}
                                        />
                                    ) : (
                                        <div className="h-full flex flex-col items-center justify-center space-y-8 p-12 text-center italic">
                                            <div className="size-24 rounded-[3rem] bg-gray-50 border border-gray-100 flex items-center justify-center mb-8 shadow-inner shadow-blue-100/50">
                                                <MessageCircle size={48} className="text-blue-600/20" />
                                            </div>
                                            <h2 className="text-4xl font-black uppercase tracking-tighter text-gray-900">Messaging Hub.</h2>
                                            <p className="text-gray-400 max-w-sm mx-auto font-medium text-sm leading-relaxed uppercase tracking-[0.3em]">Select a protocol from the directory to initiate secure scholarly synchronization.</p>
                                            <div className="px-8 py-3 bg-blue-50 border border-blue-100 rounded-full text-[10px] font-black text-blue-600 uppercase tracking-[0.4em] leading-none italic animate-pulse">STATUS: ENCRYPTED_STANDBY</div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === "REQUIREMENTS" && (
                            <div className="space-y-12 animate-in fade-in duration-700">
                                <h2 className="text-4xl font-black text-gray-900 uppercase italic tracking-tighter">My <span className="text-blue-600">Requirements.</span></h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {activeLeads.length > 0 ? activeLeads.map((lead) => (
                                        <div key={lead.id} className="bg-white border border-gray-100 p-12 rounded-[3.5rem] relative group hover:border-blue-600 transition-all text-gray-900 overflow-hidden shadow-sm border-b-8">
                                            <div className="flex justify-between items-center mb-10 relative z-10">
                                                <div className="px-5 py-2 bg-blue-50 text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] border border-blue-100 italic">{lead.subjects?.[0] || 'Unknown Subject'}</div>
                                                <div className="flex items-center gap-2">
                                                    <span className="size-2 rounded-full bg-blue-600 animate-pulse"></span>
                                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] italic">{lead.status}</p>
                                                </div>
                                            </div>
                                            <p className="text-3xl font-black text-gray-900 italic leading-[1.1] mb-12 relative z-10 tracking-tighter uppercase line-clamp-3">"{lead.description}"</p>
                                            <div className="grid grid-cols-2 gap-10 pt-10 border-t border-gray-50 relative z-10">
                                                <div>
                                                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-2 italic">Tutor</p>
                                                    <p className="text-xs font-black text-gray-900 italic uppercase tracking-widest leading-none">{lead.locations?.[0] || 'Remote'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-2 italic">Neural Level</p>
                                                    <p className="text-xs font-black text-gray-900 italic uppercase tracking-widest leading-none">{lead.grades?.[0] || 'Global'}</p>
                                                </div>
                                            </div>
                                            <div className="absolute -bottom-16 -right-16 size-48 bg-blue-600/5 rounded-full blur-3xl group-hover:bg-blue-600/10 transition-all"></div>
                                        </div>
                                    )) : (
                                        <div className="col-span-full py-40 text-center opacity-30 italic font-black uppercase tracking-[0.5em] border-4 border-dashed border-gray-200 rounded-[4rem] text-gray-300">No active mandates synchronized in the terminal.</div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === "MATCHES" && (
                            <div className="space-y-12 animate-in fade-in duration-700">
                                <h2 className="text-4xl font-black text-gray-900 uppercase italic tracking-tighter">Tutor <span className="text-emerald-500">Search</span></h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {unlockedTutors.length > 0 ? unlockedTutors.map((t) => (
                                        <div key={t.id} className="bg-white p-12 rounded-[3.5rem] border border-gray-100 hover:border-emerald-500 transition-all text-center group relative overflow-hidden shadow-sm border-b-8">
                                             <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <div className="size-10 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center border border-emerald-100 shadow-sm"><CheckCircle2 size={20} /></div>
                                            </div>
                                            
                                            <div className="size-24 rounded-[2.5rem] bg-gradient-to-br from-blue-500 to-blue-700 text-white flex items-center justify-center font-black text-4xl italic mx-auto mb-10 shadow-2xl relative">
                                                {t.name?.[0]}
                                            </div>
                                            <h3 className="text-2xl font-black text-gray-900 uppercase italic tracking-tighter mb-2 leading-none">{t.name}</h3>
                                            <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] mb-12 italic leading-none">{t.tutorListing?.subjects?.[0] || "Academic Professional"}</p>
                                            <div className="flex gap-3">
                                                <button 
                                                    onClick={() => {
                                                        setSelectedTutorForReview(t);
                                                        setIsReviewOpen(true);
                                                    }}
                                                    className="flex-1 py-5 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center gap-3 text-[10px] font-black text-gray-900 hover:bg-emerald-500 hover:text-white transition-all uppercase tracking-widest leading-none italic"
                                                >
                                                    Rate Performance <StarIcon size={14} className="fill-emerald-400 text-emerald-400 group-hover:fill-white group-hover:text-white" />
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
                                                    className="size-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center hover:bg-gray-900 transition-all active:scale-95 shadow-xl shadow-blue-600/20"
                                                >
                                                    {loadingChat ? <Loader2 className="animate-spin" size={20} /> : <MessageCircle size={20} className="font-black" strokeWidth={3} />}
                                                </button>
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="col-span-full py-40 text-center opacity-30 italic font-black uppercase tracking-[0.5em] border-4 border-dashed border-gray-200 rounded-[4rem] text-gray-300">Establishing Match Pipeline...</div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === "CONTACTS" && (
                            <div className="space-y-12 animate-in fade-in duration-700">
                                <Link 
                                    href="/search"
                                    className="inline-flex items-center gap-4 text-[10px] font-black text-gray-300 uppercase tracking-[0.4em] hover:text-blue-600 transition-all border border-gray-100 px-6 py-3 rounded-full hover:bg-white shadow-sm italic leading-none"
                                >
                                    <ArrowRight size={14} className="rotate-180" /> Back to Search Discovery
                                </Link>
                                <h2 className="text-5xl font-black text-gray-900 uppercase italic tracking-tighter">Secure <span className="text-blue-600 underline decoration-blue-600/10">Directory.</span></h2>
                                <div className="bg-white border border-gray-100 rounded-[4rem] overflow-hidden shadow-2xl border-b-8">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="border-b border-gray-50 bg-gray-50/50">
                                                <th className="px-12 py-10 text-[10px] font-black uppercase tracking-[0.5em] text-gray-400 italic">Tutor</th>
                                                <th className="px-12 py-10 text-[10px] font-black uppercase tracking-[0.5em] text-gray-400 italic">Contact</th>
                                                <th className="px-12 py-10 text-[10px] font-black uppercase tracking-[0.5em] text-gray-400 italic">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {unlockedTutors.length > 0 ? unlockedTutors.map((t) => (
                                                <tr key={t.id} className="group hover:bg-gray-50/50 transition-colors">
                                                    <td className="px-12 py-10">
                                                        <div className="flex items-center gap-8">
                                                            <div className="size-20 rounded-[2rem] bg-blue-50 text-blue-600 flex items-center justify-center font-black text-4xl italic group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm border border-blue-100">
                                                                {t.name[0]}
                                                            </div>
                                                            <div>
                                                                <h4 className="text-xl font-black text-gray-900 uppercase italic tracking-tighter mb-1 leading-none">{t.name}</h4>
                                                                <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] italic">{t.tutorListing?.subjects?.[0] || "Academic Professional"}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-12 py-10">
                                                        <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl shadow-inner-white">
                                                            <BadgeCheck size={14} className="fill-emerald-100" />
                                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] italic leading-none">Established_Link</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-12 py-10">
                                                        <div className="flex items-center gap-4">
                                                            <a href={`tel:${t.phone}`} className="size-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center hover:bg-gray-900 transition-all shadow-xl active:scale-95 shadow-blue-600/10">
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
                                                                className="size-14 bg-gray-50 border border-gray-100 text-gray-900 rounded-2xl flex items-center justify-center hover:bg-white hover:border-blue-600 transition-all active:scale-95 shadow-sm"
                                                            >
                                                                {loadingChat ? <Loader2 className="animate-spin" size={20} /> : <MessageCircle size={20} className="font-black" strokeWidth={3} />}
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )) : (
                                                <tr>
                                                    <td colSpan={3} className="px-12 py-40 text-center">
                                                        <div className="flex flex-col items-center justify-center opacity-30 italic font-black uppercase tracking-[0.5em] text-gray-300">
                                                            <div className="p-8 bg-gray-50 rounded-full border border-gray-100 mb-8"><Search size={48} strokeWidth={1} /></div>
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

            {/* Review Modal */}
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

            {/* Operational Guard */}
            <div className="mt-auto px-12 py-12 flex items-center justify-center gap-4 text-[10px] font-black text-gray-300 uppercase tracking-[1em] italic leading-none border-t border-gray-50 bg-white">
                <Activity size={12} strokeWidth={3} className="text-blue-600 animate-pulse" /> SECURE_ADULT_MONITORING_ACTIVE
            </div>
        </div>
    );
}

export default function StudentDashboard() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen bg-gray-50 font-sans overflow-hidden italic text-blue-600">
                 <div className="flex flex-col items-center gap-10">
                    <div className="size-24 rounded-[3.5rem] bg-blue-50 border-2 border-blue-100 flex items-center justify-center animate-spin-slow shadow-3xl shadow-blue-900/10">
                        <Zap size={32} className="animate-pulse" strokeWidth={3} />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.8em] animate-pulse">Establishing Portal Sync...</p>
                 </div>
            </div>
        }>
            <StudentDashboardContent />
        </Suspense>
    );
}
