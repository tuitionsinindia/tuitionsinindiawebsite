"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import DashboardHeader from "@/app/components/DashboardHeader";
import FacultyChat from "@/app/components/chat/FacultyChat";
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
    CheckCircle2,
    Search,
    Lock,
    Zap,
    Award,
    MessageCircle,
    Loader2,
    LogOut,
    Settings,
    UserPlus,
    Box,
    LayoutDashboard,
    TrendingUp,
    GraduationCap,
    Wallet
} from "lucide-react";

function InstituteDashboardContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [instituteId, setInstituteId] = useState("");
    const [leads, setLeads] = useState([]);
    const [recruitmentLeads, setRecruitmentLeads] = useState([]);
    const [courses, setCourses] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [instituteData, setInstituteData] = useState(null);
    const [activeTab, setActiveTab] = useState("home");

    const [chatSessions, setChatSessions] = useState([]);
    const [selectedSession, setSelectedSession] = useState(null);
    const [loadingChat, setLoadingChat] = useState(false);

    useEffect(() => {
        const init = async () => {
            try {
                const res = await fetch("/api/auth/session");
                if (res.ok) {
                    const { user } = await res.json();
                    if (user?.role === "INSTITUTE") {
                        setInstituteId(user.id);
                        return;
                    }
                    if (user) {
                        const map = { STUDENT: "/dashboard/student", TUTOR: "/dashboard/tutor", ADMIN: "/dashboard/admin" };
                        router.replace(map[user.role] || "/login");
                        return;
                    }
                }
            } catch {}
            router.replace("/login");
        };
        init();
    }, []);

    useEffect(() => {
        if (instituteId) {
            fetchInstituteData();
            fetchChatSessions();
            fetchTransactions();
            if (activeTab === "leads" || activeTab === "home") fetchLeads();
            if (activeTab === "recruitment") fetchRecruitmentLeads();
            if (activeTab === "courses" || activeTab === "home") fetchCourses();
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

    const fetchInstituteData = async () => {
        try {
            const res = await fetch(`/api/user/info?id=${instituteId}`);
            if (res.ok) {
                const data = await res.json();
                setInstituteData(data);
            }
        } catch (err) { console.error(err); } finally { setLoading(false); }
    };

    const fetchTransactions = async () => {
        try {
            const res = await fetch(`/api/user/transactions?userId=${instituteId}`);
            if (res.ok) {
                const data = await res.json();
                setTransactions(data.transactions || []);
            }
        } catch (err) { console.error(err); }
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
        if (!confirm("Unlock this lead? 1 credit will be used.")) return;
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
                alert(err.error || "Failed to unlock. Please check your credit balance.");
            }
        } catch (err) { console.error(err); }
    };

    if (!instituteId) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <Loader2 size={32} className="animate-spin text-blue-600" />
            </div>
        );
    }

    const NAV_ITEMS = [
        { id: "home", label: "Overview", icon: LayoutDashboard },
        { id: "leads", label: "Student Leads", icon: Users },
        { id: "recruitment", label: "Hire Tutors", icon: UserPlus },
        { id: "chat", label: "Messages", icon: MessageCircle },
        { id: "courses", label: "Courses", icon: Box },
        { id: "billing", label: "Credits & Billing", icon: CreditCard },
        { id: "settings", label: "Settings", icon: Settings }
    ];

    return (
        <div className="flex min-h-screen flex-col bg-gray-50 font-sans">
            <DashboardHeader
                user={instituteData}
                role="INSTITUTE"
                credits={instituteData?.credits || 0}
                onLogout={async () => { await fetch("/api/auth/logout", { method: "POST" }); router.push("/login"); }}
            />

            <div className="flex flex-1">
                {/* Sidebar */}
                <aside className="fixed left-0 top-[85px] bottom-0 w-20 md:w-64 bg-white border-r border-gray-100 flex flex-col items-center md:items-stretch py-6 px-3 md:px-5 z-50">
                    <nav className="space-y-1 w-full">
                        {NAV_ITEMS.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all ${
                                    activeTab === item.id
                                    ? "bg-blue-50 text-blue-700"
                                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                                }`}
                            >
                                <item.icon size={18} className="shrink-0" />
                                <span className="hidden md:block">{item.label}</span>
                            </button>
                        ))}
                    </nav>

                    <button
                        onClick={async () => { await fetch("/api/auth/logout", { method: "POST" }); router.push("/login"); }}
                        className="mt-auto flex items-center justify-center md:justify-start gap-3 px-3 py-3 text-sm text-gray-400 hover:text-red-500 transition-colors w-full"
                    >
                        <LogOut size={16} className="shrink-0" />
                        <span className="hidden md:block">Log Out</span>
                    </button>
                </aside>

                {/* Main content */}
                <main className="flex-1 ml-20 md:ml-64 p-6 md:p-10">
                    <div className="max-w-5xl mx-auto">

                        {activeTab === "settings" && <SettingsModule userData={instituteData} onUpdate={fetchInstituteData} />}
                        {activeTab === "billing" && <BillingModule userData={instituteData} userId={instituteId} onRefresh={fetchInstituteData} />}

                        {activeTab === "home" && (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h1 className="text-2xl font-bold text-gray-900">
                                            Welcome, {instituteData?.name || "Institute"}
                                        </h1>
                                        <p className="text-gray-500 text-sm mt-1">Your institute overview at a glance.</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                    {[
                                        { label: "Student Leads", val: leads.length, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
                                        { label: "Active Courses", val: courses.filter(c => c.isActive).length, icon: Box, color: "text-violet-600", bg: "bg-violet-50" },
                                        { label: "Total Enrolled", val: courses.reduce((sum, c) => sum + (c.enrolledCount || 0), 0), icon: GraduationCap, color: "text-emerald-600", bg: "bg-emerald-50" },
                                        { label: "Credits", val: instituteData?.credits || 0, icon: Zap, color: "text-amber-600", bg: "bg-amber-50" },
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

                                {/* Recent Leads */}
                                <div className="bg-white rounded-xl border border-gray-200 p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h2 className="text-base font-semibold text-gray-900">Recent Student Leads</h2>
                                        <button onClick={() => setActiveTab("leads")} className="text-sm text-blue-600 hover:underline">View all →</button>
                                    </div>
                                    {leads.length > 0 ? (
                                        <div className="space-y-3">
                                            {leads.slice(0, 3).map(lead => (
                                                <div key={lead.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900">{lead.subjects?.[0] || "General"}</p>
                                                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{lead.description}</p>
                                                    </div>
                                                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${lead.isUnlocked ? "bg-emerald-50 text-emerald-700" : "bg-blue-50 text-blue-700"}`}>
                                                        {lead.isUnlocked ? "Unlocked" : "New"}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-400 text-center py-6">No leads yet. They'll appear here when students post requirements.</p>
                                    )}
                                </div>

                                {/* Courses snapshot */}
                                <div className="bg-white rounded-xl border border-gray-200 p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h2 className="text-base font-semibold text-gray-900">Your Courses</h2>
                                        <button onClick={() => setActiveTab("courses")} className="text-sm text-blue-600 hover:underline">View all →</button>
                                    </div>
                                    {courses.length > 0 ? (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {courses.slice(0, 4).map(course => (
                                                <div key={course.id} className="p-4 bg-gray-50 rounded-lg flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900 truncate max-w-[140px]">{course.title}</p>
                                                        <p className="text-xs text-gray-500 mt-0.5">{course.enrolledCount}/{course.maxSeats} seats</p>
                                                    </div>
                                                    <span className="text-sm font-bold text-gray-700">₹{course.price?.toLocaleString("en-IN")}</span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-400 text-center py-6">No courses yet.</p>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === "chat" && (
                            <div className="h-[75vh] grid grid-cols-1 lg:grid-cols-12 gap-5">
                                {/* Sessions list */}
                                <div className="lg:col-span-4 bg-white rounded-2xl border border-gray-200 overflow-hidden flex flex-col">
                                    <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                                        <h3 className="text-sm font-semibold text-gray-700">Messages</h3>
                                        <span className="size-6 rounded-lg bg-gray-100 text-gray-600 flex items-center justify-center text-xs font-bold">{chatSessions.length}</span>
                                    </div>
                                    <div className="flex-1 overflow-y-auto">
                                        {loadingChat ? (
                                            <div className="flex items-center justify-center py-10">
                                                <Loader2 className="animate-spin text-gray-400" size={20} />
                                            </div>
                                        ) : chatSessions.length > 0 ? chatSessions.map((session) => {
                                            const recipient = session.tutorId === instituteId ? session.student : session.tutor;
                                            const isActive = selectedSession?.id === session.id;
                                            return (
                                                <button
                                                    key={session.id}
                                                    onClick={() => setSelectedSession(session)}
                                                    className={`w-full p-4 flex items-center gap-3 transition-colors border-b border-gray-50 last:border-0 ${isActive ? "bg-blue-50" : "hover:bg-gray-50"}`}
                                                >
                                                    <div className={`size-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${isActive ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"}`}>
                                                        {recipient?.name?.[0] || "?"}
                                                    </div>
                                                    <div className="flex-1 text-left min-w-0">
                                                        <p className="text-sm font-semibold text-gray-900 truncate">{recipient?.name}</p>
                                                        <p className="text-xs text-gray-400 truncate">Tap to open chat</p>
                                                    </div>
                                                </button>
                                            );
                                        }) : (
                                            <div className="py-10 text-center text-sm text-gray-400">No conversations yet.</div>
                                        )}
                                    </div>
                                </div>

                                <div className="lg:col-span-8 overflow-hidden">
                                    {selectedSession ? (
                                        <FacultyChat
                                            sessionId={selectedSession.id}
                                            currentUser={{ id: instituteId, name: instituteData?.name }}
                                            recipientName={selectedSession.tutorId === instituteId ? selectedSession.student?.name : selectedSession.tutor?.name}
                                        />
                                    ) : (
                                        <div className="h-full flex flex-col items-center justify-center bg-white rounded-2xl border border-gray-200 text-center p-10">
                                            <MessageCircle size={40} className="text-gray-200 mb-4" />
                                            <h2 className="text-lg font-semibold text-gray-700 mb-1">Select a conversation</h2>
                                            <p className="text-sm text-gray-400">Choose a chat from the list to get started.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === "leads" && (
                            <div>
                                <div className="mb-6">
                                    <h1 className="text-2xl font-bold text-gray-900">Student Leads</h1>
                                    <p className="text-gray-500 text-sm mt-1">Students looking for tutors. Unlock a lead to see contact details.</p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {loading ? (
                                        <div className="col-span-2 flex justify-center py-20">
                                            <Loader2 className="animate-spin text-gray-400" size={32} />
                                        </div>
                                    ) : leads.length > 0 ? leads.map((lead) => (
                                        <div key={lead.id} className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col gap-4">
                                            <div className="flex items-start justify-between">
                                                <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">{lead.subjects?.[0] || 'General'}</span>
                                                <span className="px-2 py-1 bg-green-50 text-green-700 rounded-lg text-xs font-medium">Active</span>
                                            </div>
                                            <p className="text-gray-800 font-medium text-sm leading-relaxed">"{lead.description}"</p>

                                            {lead.isUnlocked ? (
                                                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                                                    <div className="size-10 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold text-sm shrink-0">
                                                        {lead.student?.name?.[0]}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-semibold text-gray-900">{lead.student?.name}</p>
                                                        <p className="text-xs text-green-600">Contact unlocked</p>
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
                                                        className="p-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                                                    >
                                                        <MessageCircle size={16} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <button onClick={() => handleUnlock(lead.id)} className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors">
                                                    <Lock size={14} />
                                                    Unlock Lead (1 credit)
                                                </button>
                                            )}
                                        </div>
                                    )) : (
                                        <div className="col-span-2 text-center py-16 text-gray-400 text-sm">No student leads found.</div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === "recruitment" && (
                            <div>
                                <div className="mb-6">
                                    <h1 className="text-2xl font-bold text-gray-900">Hire Tutors</h1>
                                    <p className="text-gray-500 text-sm mt-1">Browse verified tutors available to join your institute.</p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {loading ? (
                                        <div className="col-span-3 flex justify-center py-20">
                                            <Loader2 className="animate-spin text-gray-400" size={32} />
                                        </div>
                                    ) : recruitmentLeads.length > 0 ? recruitmentLeads.map((tutor) => (
                                        <div key={tutor.id} className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col gap-4 hover:shadow-sm transition-shadow">
                                            <div className="flex items-center gap-3">
                                                <div className="size-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg shrink-0">
                                                    {tutor.tutor?.name?.[0]}
                                                </div>
                                                <div className="min-w-0">
                                                    <h3 className="font-semibold text-gray-900 truncate">{tutor.tutor?.name}</h3>
                                                    <p className="text-xs text-amber-600 font-medium">Verified Tutor</p>
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap gap-1.5">
                                                {tutor.subjects?.slice(0, 3).map(s => (
                                                    <span key={s} className="px-2 py-1 bg-gray-100 rounded-md text-xs text-gray-600">{s}</span>
                                                ))}
                                            </div>
                                            <button
                                                className="w-full py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-gray-800 transition-colors"
                                                onClick={() => router.push(`/search/${tutor.id}`)}
                                            >
                                                View Profile
                                            </button>
                                        </div>
                                    )) : (
                                        <div className="col-span-3 text-center py-16 text-gray-400 text-sm">No tutors found.</div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === "courses" && (
                            <div>
                                <div className="mb-6">
                                    <h1 className="text-2xl font-bold text-gray-900">Courses & Batches</h1>
                                    <p className="text-gray-500 text-sm mt-1">Manage your courses and student batches.</p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {courses.length > 0 ? courses.map((course) => (
                                        <div key={course.id} className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col gap-4">
                                            <div className="flex items-start justify-between">
                                                <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-medium">{course.category}</span>
                                                <span className="text-lg font-bold text-gray-900">₹{course.price}</span>
                                            </div>
                                            <h3 className="text-base font-semibold text-gray-900">{course.title}</h3>
                                            <div className="flex gap-6 pt-2 border-t border-gray-100 text-sm text-gray-500">
                                                <span>{course.enrolledCount} / {course.maxSeats} seats</span>
                                                <span className={course.isActive ? 'text-green-600' : 'text-gray-400'}>{course.isActive ? 'Active' : 'Inactive'}</span>
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="col-span-2 flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-dashed border-gray-200 text-center">
                                            <Box size={32} className="text-gray-300 mb-3" />
                                            <p className="text-sm text-gray-400">No courses created yet.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}

export default function InstituteDashboard() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <Loader2 className="animate-spin text-blue-600" size={32} />
            </div>
        }>
            <InstituteDashboardContent />
        </Suspense>
    );
}
