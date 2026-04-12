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
    Settings,
    ArrowRight,
    Phone,
    Star,
    Zap,
    LogOut,
    CheckCircle2,
    Users,
    MessageCircle,
    CreditCard,
    Loader2
} from "lucide-react";
import ReviewModal from "@/app/components/ReviewModal";
import SettingsModule from "@/app/components/dashboard/SettingsModule";
import BillingModule from "@/app/components/dashboard/BillingModule";

function StudentDashboardContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [studentId, setStudentId] = useState("");
    const [sessionLoading, setSessionLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("HOME");
    const [loading, setLoading] = useState(true);
    const [studentData, setStudentData] = useState(null);
    const [unlockedTutors, setUnlockedTutors] = useState([]);
    const [activeLeads, setActiveLeads] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [showSuccess, setShowSuccess] = useState(searchParams.get("success") === "true");
    const highlightTutorId = searchParams.get("highlightTutor") || "";

    const [chatSessions, setChatSessions] = useState([]);
    const [selectedSession, setSelectedSession] = useState(null);
    const [loadingChat, setLoadingChat] = useState(false);

    const [isReviewOpen, setIsReviewOpen] = useState(false);
    const [selectedTutorForReview, setSelectedTutorForReview] = useState(null);

    // Resolve identity: session cookie first, URL param as fallback
    useEffect(() => {
        const init = async () => {
            try {
                const res = await fetch("/api/auth/session");
                if (res.ok) {
                    const { user } = await res.json();
                    if (user?.role === "STUDENT") {
                        setStudentId(user.id);
                        setSessionLoading(false);
                        return;
                    }
                    if (user) {
                        // Logged in but wrong role — redirect to correct dashboard
                        const map = { TUTOR: "/dashboard/tutor", INSTITUTE: "/dashboard/institute", ADMIN: "/dashboard/admin" };
                        router.replace(map[user.role] || "/login");
                        return;
                    }
                }
            } catch {}
            // Fallback: URL param (for email deep links)
            const urlId = searchParams.get("studentId");
            if (urlId) { setStudentId(urlId); setSessionLoading(false); return; }
            router.replace("/login");
        };
        init();
    }, []);

    useEffect(() => {
        if (studentId) {
            fetchStudentData();
            fetchUnlockedTutors();
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
            console.error("Match fetch error:", err);
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

    if (sessionLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <Loader2 size={32} className="animate-spin text-blue-600" />
            </div>
        );
    }

    const navItems = [
        { id: "HOME", label: "Home", icon: LayoutDashboard },
        { id: "REQUIREMENTS", label: "My Requests", icon: Briefcase },
        { id: "MATCHES", label: "My Tutors", icon: Users },
        { id: "CHAT", label: "Messages", icon: MessageCircle },
        { id: "CONTACTS", label: "Contacts", icon: ShieldCheck },
        { id: "BILLING", label: "Billing", icon: CreditCard },
        { id: "SETTINGS", label: "Settings", icon: Settings },
    ];

    return (
        <div className="flex min-h-screen flex-col bg-gray-50">
            <Script src="https://checkout.razorpay.com/v1/checkout.js" />

            <DashboardHeader
                user={studentData}
                role="STUDENT"
                credits={studentData?.credits}
                onAddCredits={makePayment}
                onLogout={async () => { await fetch("/api/auth/logout", { method: "POST" }); router.push("/login"); }}
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
                        onClick={async () => { await fetch("/api/auth/logout", { method: "POST" }); router.push("/login"); }}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
                    >
                        <LogOut size={18} />
                        <span className="hidden md:block">Logout</span>
                    </button>
                </aside>

                <main className="flex-1 ml-16 md:ml-64 p-6">
                    <div className="max-w-5xl mx-auto">

                        {showSuccess && (
                            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3">
                                <CheckCircle2 size={20} className="text-emerald-600 shrink-0" />
                                <div className="flex-1">
                                    <p className="font-semibold text-emerald-800 text-sm">Requirement posted successfully!</p>
                                    <p className="text-emerald-600 text-xs mt-0.5">
                                        {highlightTutorId
                                            ? "Your requirement is live. Check the My Tutors tab to connect with the tutor you were viewing."
                                            : "Your request is live. Matching tutors will be shown in the My Tutors tab."}
                                    </p>
                                </div>
                                <button onClick={() => setShowSuccess(false)} className="text-emerald-400 hover:text-emerald-600 text-lg leading-none">×</button>
                            </div>
                        )}

                        {activeTab === "SETTINGS" && <SettingsModule userData={studentData} onUpdate={fetchStudentData} />}
                        {activeTab === "BILLING" && <BillingModule userData={studentData} userId={studentId} transactions={transactions} onRefresh={fetchStudentData} />}

                        {activeTab === "HOME" && (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h1 className="text-2xl font-bold text-gray-900">
                                            Welcome back, {studentData?.name || "Student"}
                                        </h1>
                                        <p className="text-gray-500 text-sm mt-1">Manage your tutor search from here.</p>
                                    </div>
                                    <Link
                                        href="/register/student?step=2"
                                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors whitespace-nowrap shrink-0"
                                    >
                                        + Post New Request
                                    </Link>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    {[
                                        { label: "Active Requests", val: activeLeads.length, icon: Briefcase, color: "text-blue-600", bg: "bg-blue-50" },
                                        { label: "Matched Tutors", val: unlockedTutors.length, icon: Users, color: "text-emerald-600", bg: "bg-emerald-50" },
                                        { label: "Credits", val: studentData?.credits || 0, icon: Zap, color: "text-amber-600", bg: "bg-amber-50" },
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
                            </div>
                        )}

                        {activeTab === "REQUIREMENTS" && (
                            <div className="space-y-6">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">My Requests</h1>
                                    <p className="text-gray-500 text-sm mt-1">Your active tutor requests.</p>
                                </div>
                                {activeLeads.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {activeLeads.map((lead) => (
                                            <div key={lead.id} className="bg-white rounded-xl border border-gray-200 p-6">
                                                <div className="flex items-center justify-between mb-3">
                                                    <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-semibold">
                                                        {lead.subjects?.[0] || 'Unknown'}
                                                    </span>
                                                    <span className="text-xs text-emerald-600 font-medium capitalize">{lead.status?.toLowerCase()}</span>
                                                </div>
                                                <p className="text-gray-700 mb-4 line-clamp-3">"{lead.description}"</p>
                                                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100 text-sm">
                                                    <div>
                                                        <p className="text-gray-400 text-xs">Location</p>
                                                        <p className="font-medium text-gray-700">{lead.locations?.[0] || 'Remote'}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-gray-400 text-xs">Grade / Level</p>
                                                        <p className="font-medium text-gray-700">{lead.grades?.[0] || 'N/A'}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-20 text-gray-400">
                                        <Briefcase size={40} className="mx-auto mb-3 opacity-30" />
                                        <p className="font-medium">No active requests.</p>
                                        <Link href="/register/student?step=2" className="inline-block mt-3 text-blue-600 text-sm hover:underline">
                                            Post your first request →
                                        </Link>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === "MATCHES" && (
                            <div className="space-y-6">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">My Tutors</h1>
                                    <p className="text-gray-500 text-sm mt-1">Tutors matched or unlocked for you.</p>
                                </div>
                                {unlockedTutors.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {unlockedTutors.map((t) => (
                                            <div key={t.id} className={`bg-white rounded-xl border p-6 text-center ${t.id === highlightTutorId ? "border-blue-400 ring-2 ring-blue-100" : "border-gray-200"}`}>
                                                <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-2xl mx-auto mb-4">
                                                    {t.name?.[0]}
                                                </div>
                                                <h3 className="font-semibold text-gray-900 mb-1">{t.name}</h3>
                                                <p className="text-sm text-blue-600 mb-4">{t.tutorListing?.subjects?.[0] || "Tutor"}</p>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => { setSelectedTutorForReview(t); setIsReviewOpen(true); }}
                                                        className="flex-1 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 flex items-center justify-center gap-1.5 transition-colors"
                                                    >
                                                        <Star size={14} className="text-amber-500" /> Rate
                                                    </button>
                                                    <button
                                                        onClick={async () => {
                                                            setLoadingChat(true);
                                                            try {
                                                                const res = await fetch("/api/chat/session", {
                                                                    method: "POST",
                                                                    headers: { "Content-Type": "application/json" },
                                                                    body: JSON.stringify({ studentId, tutorId: t.id, initiatorId: studentId })
                                                                });
                                                                if (res.ok) { await fetchChatSessions(); setActiveTab("CHAT"); }
                                                            } catch (err) { console.error(err); } finally { setLoadingChat(false); }
                                                        }}
                                                        className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center justify-center gap-1.5 transition-colors"
                                                    >
                                                        {loadingChat ? <Loader2 className="animate-spin" size={14} /> : <MessageCircle size={14} />}
                                                        Chat
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-20 text-gray-400">
                                        <Users size={40} className="mx-auto mb-3 opacity-30" />
                                        <p className="font-medium">No tutors matched yet.</p>
                                        <p className="text-sm mt-1">Post a request and tutors will be matched to you.</p>
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
                                            ) : chatSessions.length > 0 ? chatSessions.map((session) => {
                                                const recipient = session.studentId === studentId ? session.tutor : session.student;
                                                const lastMsg = session.messages?.[0];
                                                return (
                                                    <button
                                                        key={session.id}
                                                        onClick={() => setSelectedSession(session)}
                                                        className={`w-full p-4 text-left flex items-center gap-3 transition-colors border-b border-gray-50 ${
                                                            selectedSession?.id === session.id ? "bg-blue-50" : "hover:bg-gray-50"
                                                        }`}
                                                    >
                                                        <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-sm shrink-0">
                                                            {recipient?.name?.[0] || "?"}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="font-medium text-gray-900 text-sm truncate">{recipient?.name || "Unknown"}</p>
                                                            <p className="text-xs text-gray-400 truncate">
                                                                {lastMsg ? lastMsg.content.substring(0, 30) + "..." : "No messages yet"}
                                                            </p>
                                                        </div>
                                                    </button>
                                                );
                                            }) : (
                                                <div className="p-6 text-center text-gray-400 text-sm">No conversations yet.</div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        {selectedSession ? (
                                            <FacultyChat
                                                sessionId={selectedSession.id}
                                                currentUser={{ id: studentId, name: studentData?.name }}
                                                recipientName={selectedSession.studentId === studentId ? selectedSession.tutor?.name : selectedSession.student?.name}
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

                        {activeTab === "CONTACTS" && (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h1 className="text-2xl font-bold text-gray-900">Contacts</h1>
                                        <p className="text-gray-500 text-sm mt-1">Tutors you've unlocked or been matched with.</p>
                                    </div>
                                    <Link href="/search" className="text-sm text-blue-600 hover:underline">Find more tutors →</Link>
                                </div>
                                {unlockedTutors.length > 0 ? (
                                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                                        <table className="w-full text-left">
                                            <thead className="bg-gray-50 border-b border-gray-200">
                                                <tr>
                                                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tutor</th>
                                                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Subject</th>
                                                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {unlockedTutors.map((t) => (
                                                    <tr key={t.id} className="hover:bg-gray-50">
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-sm">
                                                                    {t.name[0]}
                                                                </div>
                                                                <p className="font-medium text-gray-900 text-sm">{t.name}</p>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-gray-500">
                                                            {t.tutorListing?.subjects?.[0] || "—"}
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-2">
                                                                <a href={`tel:${t.phone}`} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors" title="Call">
                                                                    <Phone size={16} />
                                                                </a>
                                                                <button
                                                                    onClick={async () => {
                                                                        setLoadingChat(true);
                                                                        try {
                                                                            const res = await fetch("/api/chat/session", {
                                                                                method: "POST",
                                                                                headers: { "Content-Type": "application/json" },
                                                                                body: JSON.stringify({ studentId, tutorId: t.id, initiatorId: studentId })
                                                                            });
                                                                            if (res.ok) { await fetchChatSessions(); setActiveTab("CHAT"); }
                                                                        } catch (err) { console.error(err); } finally { setLoadingChat(false); }
                                                                    }}
                                                                    className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors" title="Message"
                                                                >
                                                                    {loadingChat ? <Loader2 className="animate-spin" size={16} /> : <MessageCircle size={16} />}
                                                                </button>
                                                                <button
                                                                    onClick={() => { setSelectedTutorForReview(t); setIsReviewOpen(true); }}
                                                                    className="p-2 bg-amber-50 text-amber-600 rounded-lg hover:bg-amber-100 transition-colors" title="Rate"
                                                                >
                                                                    <Star size={16} />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="text-center py-20 text-gray-400">
                                        <Search size={40} className="mx-auto mb-3 opacity-30" />
                                        <p className="font-medium">No contacts yet.</p>
                                        <Link href="/search" className="inline-block mt-3 text-blue-600 text-sm hover:underline">Find a tutor →</Link>
                                    </div>
                                )}
                            </div>
                        )}

                    </div>
                </main>
            </div>

            <ReviewModal
                isOpen={isReviewOpen}
                onClose={() => setIsReviewOpen(false)}
                tutorId={selectedTutorForReview?.id}
                tutorName={selectedTutorForReview?.name}
                studentId={studentId}
                onSuccess={() => { fetchUnlockedTutors(); }}
            />
        </div>
    );
}

export default function StudentDashboard() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="flex flex-col items-center gap-3 text-gray-400">
                    <Loader2 size={32} className="animate-spin text-blue-600" />
                    <p className="text-sm">Loading dashboard...</p>
                </div>
            </div>
        }>
            <StudentDashboardContent />
        </Suspense>
    );
}
