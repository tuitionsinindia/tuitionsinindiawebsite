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
    Zap,
    Lock,
    ArrowRight,
    GraduationCap,
    MapPin,
    Phone,
    Mail,
    MessageCircle,
    CheckCircle2,
    ShieldCheck,
    Star,
    Award,
    LogOut,
    Loader2,
    CreditCard,
    Box,
    PlusCircle,
    Activity,
    Users,
    FileText,
    ArrowUpRight,
    BookOpen
} from "lucide-react";
import DashboardHeader from "@/app/components/DashboardHeader";
import FacultyChat from "@/app/components/chat/FacultyChat";
import SettingsModule from "@/app/components/dashboard/SettingsModule";
import BillingModule from "@/app/components/dashboard/BillingModule";

function DashboardContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const paramTutorId = searchParams.get("tutorId");
    const [tutorId, setTutorId] = useState("");
    const [activeTab, setActiveTab] = useState("HOME");
    const [leads, setLeads] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tutorData, setTutorData] = useState(null);
    const [transactions, setTransactions] = useState([]);

    const [chatSessions, setChatSessions] = useState([]);
    const [selectedSession, setSelectedSession] = useState(null);
    const [loadingChat, setLoadingChat] = useState(false);
    const [showBatchForm, setShowBatchForm] = useState(false);
    const [upgradePrompt, setUpgradePrompt] = useState(false);

    useEffect(() => {
        const init = async () => {
            try {
                const res = await fetch("/api/auth/session");
                if (res.ok) {
                    const { user } = await res.json();
                    if (user?.role === "TUTOR" || user?.role === "INSTITUTE") {
                        setTutorId(user.id);
                        return;
                    }
                    if (user) {
                        const map = { STUDENT: "/dashboard/student", INSTITUTE: "/dashboard/institute", ADMIN: "/dashboard/admin" };
                        router.replace(map[user.role] || "/login");
                        return;
                    }
                }
            } catch {}
            // Fallback: URL param or localStorage
            if (paramTutorId) { setTutorId(paramTutorId); return; }
            const savedId = localStorage.getItem("ti_active_tutor_id");
            if (savedId) { setTutorId(savedId); return; }
            router.replace("/login");
        };
        init();
    }, [paramTutorId]);

    useEffect(() => {
        if (tutorId) {
            fetchTutorData();
            fetchChatSessions();
            fetchTransactions();
            if (activeTab === "HOME" || activeTab === "LEADS") fetchLeads();
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
        if (!confirm("Unlock this lead? Credits will be used.")) return;
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
                if (err.upgradeRequired) {
                    setUpgradePrompt(true);
                } else {
                    alert(err.error || "Failed to unlock. Please check your credit balance.");
                }
            }
        } catch (err) { console.error(err); }
    };

    if (!tutorId) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <Loader2 size={32} className="animate-spin text-blue-600" />
            </div>
        );
    }

    const navItems = [
        { id: "HOME", label: "Home", icon: LayoutDashboard },
        { id: "LEADS", label: "Student Leads", icon: Users },
        { id: "BATCHES", label: "Batches", icon: BookOpen },
        { id: "CHAT", label: "Messages", icon: MessageCircle },
        { id: "REVENUE", label: "Revenue", icon: CreditCard },
        { id: "SETTINGS", label: "Settings", icon: Settings }
    ];

    return (
        <div className="flex min-h-screen flex-col bg-gray-50">
            <DashboardHeader
                user={tutorData}
                role="TUTOR"
                credits={tutorData?.credits || 0}
                onLogout={async () => {
                    localStorage.removeItem("ti_active_tutor_id");
                    await fetch("/api/auth/logout", { method: "POST" });
                    router.push("/login");
                }}
            />

            <div className="flex flex-1 pt-16">
                <aside className="fixed left-0 top-16 bottom-0 w-16 md:w-64 bg-white border-r border-gray-200 flex flex-col py-6 px-3 md:px-4 z-40">
                    <nav className="flex-1 space-y-1">
                        {navItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                                    activeTab === item.id
                                        ? "bg-blue-600 text-white"
                                        : "text-gray-600 hover:bg-gray-100"
                                }`}
                            >
                                <item.icon size={18} />
                                <span className="hidden md:block">{item.label}</span>
                            </button>
                        ))}
                    </nav>
                    <button
                        onClick={async () => {
                            localStorage.removeItem("ti_active_tutor_id");
                            await fetch("/api/auth/logout", { method: "POST" });
                            router.push("/login");
                        }}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
                    >
                        <LogOut size={18} />
                        <span className="hidden md:block">Log Out</span>
                    </button>
                </aside>

                <main className="flex-1 ml-16 md:ml-64 p-6">
                    <div className="max-w-5xl mx-auto">

                        {activeTab === "SETTINGS" && <SettingsModule userData={tutorData} userId={tutorId} onUpdate={fetchTutorData} />}
                        {activeTab === "REVENUE" && <BillingModule userData={tutorData} transactions={transactions} userId={tutorId} onRefresh={fetchTutorData} />}

                        {upgradePrompt && (
                            <div className="fixed inset-x-0 bottom-6 flex justify-center z-50 px-4">
                                <div className="bg-white border border-blue-200 shadow-xl rounded-2xl p-5 max-w-md w-full flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
                                        <Zap size={18} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-semibold text-gray-900 text-sm mb-1">Free plan limit reached</p>
                                        <p className="text-gray-500 text-xs mb-3">You've used all 5 free leads this month. Upgrade to Expert for unlimited access.</p>
                                        <div className="flex gap-2">
                                            <Link
                                                href="/pricing/tutor"
                                                className="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                                            >
                                                Upgrade to Expert
                                            </Link>
                                            <button
                                                onClick={() => setUpgradePrompt(false)}
                                                className="px-4 py-2 border border-gray-200 text-gray-600 text-xs font-medium rounded-lg hover:border-gray-300 transition-colors"
                                            >
                                                Dismiss
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "HOME" && (
                            <div className="space-y-6">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">
                                        Welcome back, {tutorData?.name || "Tutor"}
                                    </h1>
                                    <p className="text-gray-500 text-sm mt-1">Manage your students and leads from here.</p>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                    {[
                                        { label: "Credits", val: tutorData?.credits || 0, icon: Zap, color: "text-blue-600", bg: "bg-blue-50" },
                                        { label: "Student Leads", val: leads.length, icon: Users, color: "text-indigo-600", bg: "bg-indigo-50" },
                                        { label: "Profile Views", val: tutorData?.tutorListing?.viewCount || 0, icon: Activity, color: "text-violet-600", bg: "bg-violet-50" },
                                        { label: "Earnings", val: `₹${(transactions || []).filter(t => t.status === "SUCCESS").reduce((sum, t) => sum + (t.amount || 0), 0).toLocaleString("en-IN")}`, icon: Wallet, color: "text-emerald-600", bg: "bg-emerald-50" }
                                    ].map((stat, i) => (
                                        <div key={i} className="bg-white rounded-xl border border-gray-200 p-5">
                                            <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center mb-3`}>
                                                <stat.icon size={20} className={stat.color} />
                                            </div>
                                            <p className="text-sm text-gray-500">{stat.label}</p>
                                            <p className="text-2xl font-bold text-gray-900 mt-1">{stat.val}</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="font-semibold text-gray-900">New Student Leads</h3>
                                            <button onClick={() => setActiveTab("LEADS")} className="text-xs text-blue-600 hover:underline font-medium">View All</button>
                                        </div>
                                        {leads.filter(l => !l.isUnlocked).length > 0 ? (
                                            <div className="space-y-3">
                                                {leads.filter(l => !l.isUnlocked).slice(0, 3).map(lead => (
                                                    <div key={lead.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-900">{lead.subjects?.[0] || "General"}</p>
                                                            <p className="text-xs text-gray-400">{lead.locations?.[0] || "Remote"}</p>
                                                        </div>
                                                        <button
                                                            onClick={() => handleUnlock(lead.id)}
                                                            className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors flex items-center gap-1.5"
                                                        >
                                                            <Zap size={12} /> Unlock
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-sm text-gray-400 py-4 text-center">No new leads at the moment.</p>
                                        )}
                                    </div>

                                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="font-semibold text-gray-900">Recent Messages</h3>
                                            <button onClick={() => setActiveTab("CHAT")} className="text-xs text-blue-600 hover:underline font-medium">View All</button>
                                        </div>
                                        {chatSessions.length > 0 ? (
                                            <div className="space-y-3">
                                                {chatSessions.slice(0, 3).map(session => (
                                                    <button
                                                        key={session.id}
                                                        onClick={() => { setSelectedSession(session); setActiveTab("CHAT"); }}
                                                        className="w-full flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left"
                                                    >
                                                        <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold text-sm shrink-0">
                                                            {session.student?.name?.[0] || "?"}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-medium text-gray-900 truncate">{session.student?.name}</p>
                                                            <p className="text-xs text-gray-400 truncate">{session.messages?.[0]?.content || "No messages yet"}</p>
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-sm text-gray-400 py-4 text-center">No conversations yet.</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "LEADS" && (
                            <div className="space-y-6">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">Student Leads</h1>
                                    <p className="text-gray-500 text-sm mt-1">Tuition requests matching your profile. Unlock to see student contact details.</p>
                                </div>

                                {loading ? (
                                    <div className="flex items-center justify-center py-20">
                                        <Loader2 className="animate-spin text-blue-500" size={28} />
                                    </div>
                                ) : leads.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {leads.map((lead) => (
                                            <div key={lead.id} className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col gap-4">
                                                <div className="flex items-center justify-between">
                                                    <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-semibold">
                                                        {lead.subjects?.[0] || "General"}
                                                    </span>
                                                    {lead.matchScore && (
                                                        <span className="text-xs text-emerald-600 font-medium">{lead.matchScore}% match</span>
                                                    )}
                                                </div>

                                                <p className="text-gray-700 text-sm line-clamp-3">"{lead.description}"</p>

                                                {lead.isUnlocked ? (
                                                    <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-9 h-9 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                                                                {lead.student?.name?.[0]}
                                                            </div>
                                                            <div>
                                                                <p className="font-semibold text-sm text-gray-900">{lead.student?.name}</p>
                                                                <p className="text-xs text-gray-500">{lead.student?.phone}</p>
                                                            </div>
                                                        </div>
                                                        <button
                                                            onClick={async () => {
                                                                setLoadingChat(true);
                                                                try {
                                                                    const res = await fetch("/api/chat/session", {
                                                                        method: "POST",
                                                                        headers: { "Content-Type": "application/json" },
                                                                        body: JSON.stringify({ studentId: lead.studentId, tutorId, initiatorId: tutorId })
                                                                    });
                                                                    if (res.ok) {
                                                                        await fetchChatSessions();
                                                                        setActiveTab("CHAT");
                                                                    }
                                                                } catch (err) { console.error(err); } finally { setLoadingChat(false); }
                                                            }}
                                                            className="w-9 h-9 bg-blue-600 text-white rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors"
                                                        >
                                                            {loadingChat ? <Loader2 className="animate-spin" size={16} /> : <MessageCircle size={16} />}
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                                            <MapPin size={14} className="text-gray-400" />
                                                            {lead.locations?.[0] || "Remote"}
                                                        </div>
                                                        <button
                                                            onClick={() => handleUnlock(lead.id)}
                                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
                                                            disabled={loading}
                                                        >
                                                            <Zap size={14} /> Unlock (1 credit)
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-20 text-gray-400">
                                        <Users size={40} className="mx-auto mb-3 opacity-30" />
                                        <p className="font-medium">No student leads yet.</p>
                                        <p className="text-sm mt-1">Leads matching your subjects and location will appear here.</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === "CHAT" && (
                            <div className="space-y-4">
                                <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
                                <div className="flex h-[calc(100vh-220px)] bg-white rounded-xl border border-gray-200 overflow-hidden">
                                    <div className="w-72 border-r border-gray-200 flex flex-col">
                                        <div className="p-4 border-b border-gray-100">
                                            <h3 className="font-semibold text-gray-900 text-sm">Conversations</h3>
                                            <p className="text-xs text-gray-500 mt-0.5">{chatSessions.length} active</p>
                                        </div>
                                        <div className="flex-1 overflow-y-auto">
                                            {loadingChat ? (
                                                <div className="flex items-center justify-center py-10 text-gray-400">
                                                    <Loader2 className="animate-spin mr-2" size={16} /> Loading...
                                                </div>
                                            ) : chatSessions.length > 0 ? chatSessions.map((session) => (
                                                <button
                                                    key={session.id}
                                                    onClick={() => setSelectedSession(session)}
                                                    className={`w-full p-4 text-left flex items-center gap-3 transition-colors border-b border-gray-50 ${
                                                        selectedSession?.id === session.id ? "bg-blue-50" : "hover:bg-gray-50"
                                                    }`}
                                                >
                                                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold text-sm shrink-0">
                                                        {session.student?.name?.[0] || "?"}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-medium text-gray-900 text-sm truncate">{session.student?.name || "Student"}</p>
                                                        <p className="text-xs text-gray-400 truncate">
                                                            {session.messages?.[0]?.content || "No messages yet"}
                                                        </p>
                                                    </div>
                                                </button>
                                            )) : (
                                                <div className="p-6 text-center text-gray-400 text-sm">No conversations yet.</div>
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
                                            <div className="h-full flex flex-col items-center justify-center text-gray-400">
                                                <MessageCircle size={48} className="mb-3 opacity-30" />
                                                <p className="font-medium">Select a conversation</p>
                                                <p className="text-sm mt-1">Choose a chat from the left to start messaging.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "BATCHES" && (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h1 className="text-2xl font-bold text-gray-900">Batches</h1>
                                        <p className="text-gray-500 text-sm mt-1">Manage your group classes and batch enrolments.</p>
                                    </div>
                                    <button
                                        onClick={() => setShowBatchForm(true)}
                                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                                    >
                                        <PlusCircle size={16} /> New Batch
                                    </button>
                                </div>

                                {loading ? (
                                    <div className="flex items-center justify-center py-20">
                                        <Loader2 className="animate-spin text-blue-500" size={28} />
                                    </div>
                                ) : courses.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {courses.map((course) => (
                                            <div key={course.id} className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col gap-4">
                                                <div className="flex justify-between items-start">
                                                    <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-semibold">{course.category}</span>
                                                    <span className="text-lg font-bold text-gray-900">₹{course.price}</span>
                                                </div>
                                                <h3 className="font-semibold text-gray-900">{course.title}</h3>
                                                <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-100 text-sm">
                                                    <div>
                                                        <p className="text-gray-400 text-xs mb-1">Enrolled</p>
                                                        <p className="font-medium text-gray-700">{course.enrolledCount} / {course.maxSeats} students</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-gray-400 text-xs mb-1">Status</p>
                                                        <span className={`text-xs font-medium ${course.isActive ? "text-emerald-600" : "text-gray-400"}`}>
                                                            {course.isActive ? "Active" : "Inactive"}
                                                        </span>
                                                    </div>
                                                </div>
                                                <button className="w-full py-2 bg-gray-50 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium transition-colors border border-gray-200">
                                                    Manage Batch
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-20 text-gray-400">
                                        <BookOpen size={40} className="mx-auto mb-3 opacity-30" />
                                        <p className="font-medium">No batches yet.</p>
                                        <p className="text-sm mt-1">Create a batch to manage group classes.</p>
                                    </div>
                                )}
                            </div>
                        )}

                    </div>
                </main>
            </div>
        </div>
    );
}

export default function Dashboard() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="flex flex-col items-center gap-3 text-gray-400">
                    <Loader2 size={32} className="animate-spin text-blue-600" />
                    <p className="text-sm">Loading dashboard...</p>
                </div>
            </div>
        }>
            <DashboardContent />
        </Suspense>
    );
}
