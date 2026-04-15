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
    BookOpen,
    Megaphone,
    Users,
    CreditCard,
    PlusCircle,
    ArrowRight,
    Lock,
    Zap,
    MessageCircle,
    Loader2,
    LogOut,
    Settings,
    UserPlus,
    Box,
    Target,
    Award
} from "lucide-react";

function InstituteDashboardContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [instituteId, setInstituteId] = useState(searchParams.get("instId") || searchParams.get("instituteId") || "");
    const [leads, setLeads] = useState([]);
    const [recruitmentLeads, setRecruitmentLeads] = useState([]);
    const [courses, setCourses] = useState([]);
    const [ads, setAds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [instituteData, setInstituteData] = useState(null);
    const [activeTab, setActiveTab] = useState("leads");

    // Chat States
    const [chatSessions, setChatSessions] = useState([]);
    const [selectedSession, setSelectedSession] = useState(null);
    const [loadingChat, setLoadingChat] = useState(false);

    // Course Form State
    const [showCourseForm, setShowCourseForm] = useState(false);

    useEffect(() => {
        const idFromUrl = searchParams.get("instId") || searchParams.get("instituteId");
        if (idFromUrl) {
            setInstituteId(idFromUrl);
            localStorage.setItem("ti_active_institute_id", idFromUrl);
        } else {
            const saved = localStorage.getItem("ti_active_institute_id");
            if (saved) setInstituteId(saved);
        }
    }, [searchParams]);

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
        if (!confirm("Spend 1 credit to view this student's contact details?")) return;
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
                alert(err.error || "Could not unlock. Please try again.");
            }
        } catch (err) { console.error(err); }
    };

    if (!instituteId) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4 font-sans">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 max-w-md w-full text-center">
                    <div className="size-16 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 mx-auto mb-6 border border-blue-100">
                        <Building2 size={32} strokeWidth={1.5} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Institute Dashboard</h2>
                    <p className="text-gray-500 mb-8 text-sm">Enter your institute ID to continue.</p>
                    <input
                        type="text"
                        placeholder="Enter your institute ID"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-gray-900 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-400 mb-4"
                        onKeyDown={(e) => { if (e.key === 'Enter') setInstituteId(e.target.value); }}
                        id="instInput"
                    />
                    <button
                        className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 shadow-sm transition-all flex items-center justify-center gap-2 text-sm"
                        onClick={() => setInstituteId(document.getElementById('instInput').value)}>
                        Continue <ArrowRight size={16} strokeWidth={2} />
                    </button>
                    <Link href="/" className="inline-block mt-6 text-sm text-gray-400 hover:text-blue-600 transition-colors">Back to Home</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="relative flex min-h-screen flex-col bg-gray-50 font-sans text-gray-900">
            <DashboardHeader
                user={instituteData}
                role="INSTITUTE"
                credits={instituteData?.credits || 0}
                onLogout={() => router.push("/")}
            />

            <div className="flex flex-1">
                <aside className="fixed left-0 top-[85px] bottom-0 w-20 md:w-72 bg-white border-r border-gray-200 flex flex-col items-center md:items-stretch py-6 px-3 md:px-5 z-50">
                    <div className="mb-6 hidden md:block px-3">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Institute Menu</p>
                    </div>

                    <nav className="space-y-1 w-full">
                        {[
                            { id: "leads", label: "Student Leads", icon: Target },
                            { id: "recruitment", label: "Hire Tutors", icon: UserPlus },
                            { id: "chat", label: "Messages", icon: MessageCircle },
                            { id: "courses", label: "Courses", icon: Box },
                            { id: "ads", label: "Promotions", icon: Megaphone },
                            { id: "billing", label: "Billing", icon: CreditCard },
                            { id: "settings", label: "Settings", icon: Settings }
                        ].map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`w-full flex items-center gap-3 px-3 md:px-4 py-3 rounded-xl font-semibold text-sm transition-all ${
                                    activeTab === item.id
                                    ? "bg-blue-50 text-blue-600 border border-blue-100"
                                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                                }`}
                            >
                                <item.icon size={18} strokeWidth={2} className={activeTab === item.id ? "text-blue-600" : "text-gray-400"} />
                                <span className="hidden md:block">{item.label}</span>
                            </button>
                        ))}
                    </nav>

                    <button
                        onClick={() => { localStorage.removeItem("ti_active_institute_id"); router.push("/"); }}
                        className="mt-auto flex items-center justify-center md:justify-start gap-3 px-3 md:px-4 py-3 text-red-400 hover:text-red-600 text-sm font-semibold transition-colors"
                    >
                        <LogOut size={16} strokeWidth={2} />
                        <span className="hidden md:block">Log Out</span>
                    </button>
                </aside>

                <main className="flex-1 ml-20 md:ml-72 p-5 md:p-8">
                    <div className="max-w-7xl mx-auto">

                        {(activeTab !== "chat" && activeTab !== "settings" && activeTab !== "billing") && (
                            <div className="mb-8">
                                <h1 className="text-2xl font-bold text-gray-900">
                                    {instituteData?.name || "Your Institute"}
                                </h1>
                                <p className="text-sm text-gray-500 mt-1 capitalize">{activeTab} overview</p>
                            </div>
                        )}

                        <div>
                            {activeTab === "settings" && <SettingsModule userData={instituteData} onUpdate={fetchInstituteData} />}
                            {activeTab === "billing" && <BillingModule userData={instituteData} />}

                            {activeTab === "chat" && (
                                <div className="h-[75vh] grid grid-cols-1 lg:grid-cols-12 gap-5">
                                    <div className="lg:col-span-4 bg-white rounded-2xl border border-gray-200 overflow-hidden flex flex-col shadow-sm">
                                        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                                            <h3 className="text-sm font-semibold text-gray-700">Conversations</h3>
                                            <span className="size-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-bold">{chatSessions.length}</span>
                                        </div>
                                        <div className="flex-1 overflow-y-auto p-3 space-y-2">
                                            {loadingChat ? (
                                                <div className="flex flex-col items-center justify-center py-16 gap-3 text-gray-400">
                                                    <Loader2 className="animate-spin" size={20} />
                                                    <span className="text-xs font-medium">Loading conversations...</span>
                                                </div>
                                            ) : chatSessions.length > 0 ? chatSessions.map((session) => {
                                                const recipient = session.tutorId === instituteId ? session.student : session.tutor;
                                                const isActive = selectedSession?.id === session.id;
                                                return (
                                                    <button
                                                        key={session.id}
                                                        onClick={() => setSelectedSession(session)}
                                                        className={`w-full p-3 rounded-xl flex items-center gap-3 transition-all text-left ${
                                                            isActive ? "bg-blue-600 text-white" : "bg-gray-50 hover:bg-gray-100 text-gray-900"
                                                        }`}
                                                    >
                                                        <div className={`size-10 rounded-xl flex items-center justify-center font-bold text-base shadow-sm ${isActive ? "bg-white text-blue-600" : "bg-blue-600 text-white"}`}>
                                                            {recipient?.name?.[0] || "?"}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-semibold truncate">{recipient?.name}</p>
                                                            <p className={`text-xs truncate mt-0.5 ${isActive ? "text-blue-100" : "text-gray-400"}`}>Tap to open chat</p>
                                                        </div>
                                                    </button>
                                                );
                                            }) : (
                                                <div className="py-16 text-center text-gray-400 text-sm">No conversations yet.</div>
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
                                            <div className="h-full flex flex-col items-center justify-center space-y-4 bg-white rounded-2xl border-2 border-dashed border-gray-200 p-10 text-center text-gray-400">
                                                <MessageCircle size={40} className="text-gray-300" />
                                                <h2 className="text-lg font-semibold text-gray-700">Select a conversation</h2>
                                                <p className="text-sm max-w-xs mx-auto">Choose a conversation from the list to start messaging.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {activeTab === "leads" && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pb-10">
                                    {loading ? (
                                        <div className="col-span-2 py-24 flex flex-col items-center justify-center text-gray-400 bg-white rounded-2xl border border-gray-200">
                                            <Loader2 className="animate-spin mb-4" size={32} />
                                            <p className="text-sm font-medium">Loading student leads...</p>
                                        </div>
                                    ) : leads.length > 0 ? leads.map((lead) => (
                                        <div key={lead.id} className="bg-white border border-gray-200 rounded-2xl p-5 hover:border-blue-200 transition-all shadow-sm flex flex-col">
                                            <div className="flex justify-between items-center mb-4">
                                                <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-semibold border border-blue-100">{lead.subjects?.[0] || 'General'}</span>
                                                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100">Active</span>
                                            </div>
                                            <p className="text-sm text-gray-700 mb-5 leading-relaxed">{lead.description}</p>

                                            {lead.isUnlocked ? (
                                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex items-center gap-4">
                                                    <div className="size-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold text-base">{lead.student?.name?.[0]}</div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="text-sm font-semibold text-gray-900 truncate">{lead.student?.name}</h4>
                                                        <p className="text-xs text-gray-400">Contact unlocked</p>
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
                                                        className="size-10 bg-blue-600 text-white rounded-xl flex items-center justify-center hover:bg-blue-700 transition-all"
                                                    >
                                                        <MessageCircle size={16} strokeWidth={2} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <button onClick={() => handleUnlock(lead.id)} className="w-full mt-auto bg-blue-600 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 text-sm hover:bg-blue-700 transition-all">
                                                    <Lock size={14} strokeWidth={2} />
                                                    Contact Student (1 credit)
                                                </button>
                                            )}
                                        </div>
                                    )) : (
                                        <div className="col-span-2 py-24 text-center text-gray-400 text-sm bg-white rounded-2xl border border-gray-200">No student leads found yet.</div>
                                    )}
                                </div>
                            )}

                            {activeTab === "recruitment" && (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pb-10">
                                    {loading ? (
                                        <div className="col-span-3 py-24 flex flex-col items-center justify-center text-gray-400">
                                            <Loader2 size={32} className="animate-spin mb-4" />
                                            <span className="text-sm font-medium">Loading tutors...</span>
                                        </div>
                                    ) : recruitmentLeads.length > 0 ? recruitmentLeads.map((tutor) => (
                                        <div key={tutor.id} className="bg-white border border-gray-200 rounded-2xl p-5 hover:border-blue-200 transition-all flex flex-col gap-4 shadow-sm">
                                            <div className="flex items-center gap-4">
                                                <div className="size-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-2xl">{tutor.tutor?.name?.[0]}</div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-semibold text-gray-900 text-base truncate">{tutor.tutor?.name}</h3>
                                                    <div className="flex items-center gap-1 text-amber-500 text-xs font-semibold mt-0.5">
                                                        <Award size={12} fill="currentColor" /> Tutor
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap gap-1.5 py-3 border-y border-gray-100">
                                                {tutor.subjects?.slice(0, 3).map(s => (
                                                    <span key={s} className="px-2 py-1 bg-gray-50 rounded-lg text-xs font-medium text-gray-600 border border-gray-100">{s}</span>
                                                ))}
                                            </div>
                                            <button
                                                className="w-full py-2.5 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 transition-all"
                                                onClick={() => router.push(`/search/${tutor.id}`)}
                                            >
                                                View Profile
                                            </button>
                                        </div>
                                    )) : (
                                        <div className="col-span-3 py-24 text-center text-gray-400 text-sm">No tutors found.</div>
                                    )}
                                </div>
                            )}

                            {activeTab === "courses" && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pb-10">
                                    {courses.length > 0 ? courses.map((course) => (
                                        <div key={course.id} className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col gap-4 hover:border-blue-200 transition-all shadow-sm">
                                            <div className="flex justify-between items-start">
                                                <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-semibold border border-blue-100">{course.category}</span>
                                                <div className="text-right">
                                                    <span className="text-xl font-bold text-gray-900">₹{course.price}</span>
                                                    <p className="text-xs text-gray-400">per student</p>
                                                </div>
                                            </div>
                                            <h3 className="text-base font-semibold text-gray-900">{course.title}</h3>
                                            <div className="grid grid-cols-2 gap-3 py-3 border-y border-gray-100 text-sm">
                                                <div>
                                                    <p className="text-xs text-gray-400 mb-1">Seats filled</p>
                                                    <p className="font-semibold text-gray-900">{course.enrolledCount} / {course.maxSeats}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-400 mb-1">Status</p>
                                                    <p className={`font-semibold text-sm ${course.isActive ? 'text-emerald-600' : 'text-gray-400'}`}>{course.isActive ? 'Active' : 'Inactive'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="col-span-2 py-24 flex flex-col items-center justify-center bg-white rounded-2xl border-2 border-dashed border-gray-200 text-gray-400">
                                            <Box size={36} className="mb-4 text-gray-300" />
                                            <p className="text-sm font-medium">No courses added yet.</p>
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
            <div className="flex items-center justify-center min-h-screen bg-gray-50 font-sans">
                <div className="flex flex-col items-center gap-4 text-gray-400">
                    <div className="size-10 rounded-full border-4 border-gray-200 border-t-blue-600 animate-spin"></div>
                    <p className="text-sm font-medium">Loading dashboard...</p>
                </div>
            </div>
        }>
            <InstituteDashboardContent />
        </Suspense>
    );
}
