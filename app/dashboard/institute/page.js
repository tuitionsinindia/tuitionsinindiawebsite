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
    LayoutDashboard,
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
    Target,
    Award
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
    const [activeTab, setActiveTab] = useState("leads");

    const [chatSessions, setChatSessions] = useState([]);
    const [selectedSession, setSelectedSession] = useState(null);
    const [loadingChat, setLoadingChat] = useState(false);

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
        if (!confirm("Unlock this student? This will spend 1 credit.")) return;
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
                alert(err.error || "Failed to unlock. Please try again.");
            }
        } catch (err) { console.error(err); }
    };

    if (!instituteId) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-10 max-w-md w-full text-center">
                    <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-6">
                        <Building2 size={32} className="text-blue-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Institute Dashboard</h2>
                    <p className="text-gray-500 text-sm mb-8">Enter your Institute ID to access your dashboard.</p>
                    <input
                        type="text"
                        placeholder="Enter your Institute ID"
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 outline-none focus:border-blue-500 mb-4"
                        onKeyDown={(e) => { if (e.key === 'Enter') setInstituteId(e.target.value); }}
                        id="instInput"
                    />
                    <button
                        className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                        onClick={() => setInstituteId(document.getElementById('instInput').value)}
                    >
                        Access Dashboard <ArrowRight size={16} />
                    </button>
                    <Link href="/" className="inline-block mt-6 text-sm text-gray-400 hover:text-blue-600 transition-colors">← Back to Home</Link>
                </div>
            </div>
        );
    }

    const navItems = [
        { id: "leads", label: "Student Leads", icon: Target },
        { id: "recruitment", label: "Find Tutors", icon: UserPlus },
        { id: "chat", label: "Messages", icon: MessageCircle },
        { id: "courses", label: "Courses", icon: BookOpen },
        { id: "ads", label: "Ads", icon: Megaphone },
        { id: "billing", label: "Billing", icon: CreditCard },
        { id: "settings", label: "Settings", icon: Settings },
    ];

    return (
        <div className="flex min-h-screen flex-col bg-gray-50">
            <DashboardHeader
                user={instituteData}
                role="INSTITUTE"
                credits={instituteData?.credits || 0}
                onLogout={() => router.push("/")}
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
                        onClick={() => router.push("/")}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
                    >
                        <LogOut size={18} />
                        <span className="hidden md:block">Logout</span>
                    </button>
                </aside>

                <main className="flex-1 ml-16 md:ml-64 p-6">
                    <div className="max-w-5xl mx-auto">

                        {activeTab === "settings" && <SettingsModule user={instituteData} onUpdate={fetchInstituteData} />}
                        {activeTab === "billing" && <BillingModule user={instituteData} />}

                        {activeTab === "leads" && (
                            <div className="space-y-6">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">Student Leads</h1>
                                    <p className="text-gray-500 text-sm mt-1">Students looking for courses at institutes like yours.</p>
                                </div>
                                {loading ? (
                                    <div className="flex items-center justify-center py-20 text-gray-400">
                                        <Loader2 className="animate-spin mr-2" size={20} /> Loading leads...
                                    </div>
                                ) : leads.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {leads.map((lead) => (
                                            <div key={lead.id} className="bg-white rounded-xl border border-gray-200 p-6">
                                                <div className="flex items-center justify-between mb-3">
                                                    <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-semibold">
                                                        {lead.subjects?.[0] || 'General'}
                                                    </span>
                                                    <span className="text-xs text-emerald-600 font-medium">Active</span>
                                                </div>
                                                <p className="text-gray-700 font-medium mb-4 line-clamp-2">"{lead.description}"</p>
                                                {lead.isUnlocked ? (
                                                    <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                                                        <div className="w-10 h-10 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-lg">
                                                            {lead.student?.name?.[0]}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="font-semibold text-gray-900 text-sm">{lead.student?.name}</p>
                                                            <p className="text-xs text-emerald-600">Contact unlocked</p>
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
                                                            className="px-3 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors flex items-center gap-1"
                                                        >
                                                            <MessageCircle size={14} /> Chat
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => handleUnlock(lead.id)}
                                                        className="w-full py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                                                    >
                                                        <Lock size={14} /> Unlock Student (1 credit)
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-20 text-gray-400">
                                        <Target size={40} className="mx-auto mb-3 opacity-30" />
                                        <p className="font-medium">No student leads yet.</p>
                                        <p className="text-sm mt-1">Complete your profile to start receiving leads.</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === "recruitment" && (
                            <div className="space-y-6">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">Find Tutors</h1>
                                    <p className="text-gray-500 text-sm mt-1">Browse tutors available for hire at your institute.</p>
                                </div>
                                {loading ? (
                                    <div className="flex items-center justify-center py-20 text-gray-400">
                                        <Loader2 className="animate-spin mr-2" size={20} /> Searching tutors...
                                    </div>
                                ) : recruitmentLeads.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {recruitmentLeads.map((tutor) => (
                                            <div key={tutor.id} className="bg-white rounded-xl border border-gray-200 p-6">
                                                <div className="flex items-center gap-3 mb-4">
                                                    <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xl">
                                                        {tutor.tutor?.name?.[0]}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-semibold text-gray-900">{tutor.tutor?.name}</h3>
                                                        <div className="flex items-center gap-1 text-amber-500 text-xs mt-0.5">
                                                            <Award size={12} /> Expert Tutor
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex flex-wrap gap-1.5 mb-4">
                                                    {tutor.subjects?.slice(0, 3).map(s => (
                                                        <span key={s} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">{s}</span>
                                                    ))}
                                                </div>
                                                <button
                                                    onClick={() => router.push(`/search/${tutor.id}`)}
                                                    className="w-full py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                                                >
                                                    View Profile
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-20 text-gray-400">
                                        <UserPlus size={40} className="mx-auto mb-3 opacity-30" />
                                        <p className="font-medium">No tutors found.</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === "chat" && (
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
                                                const recipient = session.tutorId === instituteId ? session.student : session.tutor;
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
                                                currentUser={{ id: instituteId, name: instituteData?.name }}
                                                recipientName={selectedSession.tutorId === instituteId ? selectedSession.student?.name : selectedSession.tutor?.name}
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

                        {activeTab === "courses" && (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h1 className="text-2xl font-bold text-gray-900">Courses</h1>
                                        <p className="text-gray-500 text-sm mt-1">Manage your course offerings.</p>
                                    </div>
                                    <button
                                        onClick={() => setShowCourseForm(true)}
                                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                                    >
                                        <PlusCircle size={16} /> Add Course
                                    </button>
                                </div>
                                {courses.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {courses.map((course) => (
                                            <div key={course.id} className="bg-white rounded-xl border border-gray-200 p-6">
                                                <div className="flex justify-between items-start mb-3">
                                                    <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">{course.category}</span>
                                                    <span className="text-xl font-bold text-gray-900">₹{course.price}</span>
                                                </div>
                                                <h3 className="font-semibold text-gray-900 mb-4">{course.title}</h3>
                                                <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-100 text-sm">
                                                    <div>
                                                        <p className="text-gray-400 text-xs">Seats</p>
                                                        <p className="font-semibold text-gray-900">{course.enrolledCount} / {course.maxSeats}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-gray-400 text-xs">Status</p>
                                                        <p className={`font-semibold ${course.isActive ? 'text-emerald-600' : 'text-gray-400'}`}>
                                                            {course.isActive ? 'Active' : 'Inactive'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-20 text-gray-400">
                                        <BookOpen size={40} className="mx-auto mb-3 opacity-30" />
                                        <p className="font-medium">No courses added yet.</p>
                                        <p className="text-sm mt-1">Add your first course to start enrolling students.</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === "ads" && (
                            <div className="space-y-6">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">Ads</h1>
                                    <p className="text-gray-500 text-sm mt-1">Promote your institute to students.</p>
                                </div>
                                <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-400">
                                    <Megaphone size={40} className="mx-auto mb-3 opacity-30" />
                                    <p className="font-medium">Ads feature coming soon.</p>
                                    <p className="text-sm mt-1">You'll be able to run targeted campaigns for students in your area.</p>
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
                <div className="flex flex-col items-center gap-3 text-gray-400">
                    <Loader2 size={32} className="animate-spin text-blue-600" />
                    <p className="text-sm">Loading dashboard...</p>
                </div>
            </div>
        }>
            <InstituteDashboardContent />
        </Suspense>
    );
}
