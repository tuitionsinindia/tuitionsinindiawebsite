"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Script from "next/script";
import Link from "next/link";
import DashboardHeader from "@/app/components/DashboardHeader";
import Chat from "@/app/components/chat/Chat";
import {
    GraduationCap,
    Briefcase,
    LayoutDashboard,
    Search,
    ShieldCheck,
    ArrowRight,
    Phone,
    LogOut,
    CheckCircle2,
    Users,
    MessageCircle,
    Loader2,
    Star,
    Zap,
    CreditCard
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
    const [chatSessions, setChatSessions] = useState([]);
    const [selectedSession, setSelectedSession] = useState(null);
    const [loadingChat, setLoadingChat] = useState(false);
    const [isReviewOpen, setIsReviewOpen] = useState(false);
    const [selectedTutorForReview, setSelectedTutorForReview] = useState(null);
    const [boostingLead, setBoostingLead] = useState(null);

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
            console.error(err);
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

    const handleBoostLead = async (lead) => {
        setBoostingLead(lead.id);
        try {
            const orderRes = await fetch("/api/payment/order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    amount: 49,
                    receipt: `boost_${lead.id}_${Date.now()}`,
                    userId: studentId,
                    description: "Lead boost"
                })
            });
            const order = await orderRes.json();

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: order.currency,
                name: "TuitionsInIndia",
                description: "Boost Your Requirement",
                order_id: order.id,
                handler: async (response) => {
                    const verifyRes = await fetch("/api/payment/verify", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            userId: studentId,
                            creditsToAdd: 0
                        })
                    });
                    const result = await verifyRes.json();
                    if (result.success) {
                        await fetch("/api/lead/boost", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                leadId: lead.id,
                                studentId,
                                premiumTier: 1
                            })
                        });
                        fetchActiveLeads();
                        alert("Your requirement has been boosted! More tutors will see it now.");
                    }
                },
                prefill: {
                    name: studentData?.name || "",
                    email: studentData?.email || "",
                    contact: studentData?.phone || ""
                },
                theme: { color: "#2563EB" }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (err) {
            console.error(err);
            alert("Something went wrong. Please try again.");
        } finally {
            setBoostingLead(null);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("ti_active_student_id");
        router.push("/");
    };

    if (!studentId) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4 font-sans">
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 max-w-md w-full text-center">
                    <div className="size-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto mb-6">
                        <GraduationCap size={32} />
                    </div>
                    <h2 className="text-2xl font-bold mb-2 text-gray-900 tracking-tight">Student Dashboard</h2>
                    <p className="text-gray-400 mb-8 text-sm">Enter your student ID to access your dashboard.</p>
                    <input
                        type="text"
                        placeholder="Enter your student ID"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-gray-900 font-medium text-sm focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 outline-none transition-all placeholder:text-gray-300 mb-4"
                        onKeyDown={(e) => { if (e.key === 'Enter') setStudentId(e.target.value); }}
                        id="studentInput"
                    />
                    <button
                        className="w-full bg-blue-600 text-white font-semibold py-4 rounded-xl hover:bg-blue-700 shadow-sm transition-all flex items-center justify-center gap-2 text-sm"
                        onClick={() => setStudentId(document.getElementById('studentInput').value)}>
                        Continue <ArrowRight size={16} />
                    </button>
                    <Link href="/" className="inline-block mt-6 text-sm font-medium text-gray-400 hover:text-blue-600 transition-colors">Back to Home</Link>
                </div>
            </div>
        );
    }

    const navItems = [
        { id: "HOME", label: "Dashboard", icon: LayoutDashboard },
        { id: "REQUIREMENTS", label: "My Requirements", icon: Briefcase },
        { id: "MATCHES", label: "Tutor Matches", icon: Users },
        { id: "CHAT", label: "Messages", icon: MessageCircle },
        { id: "CONTACTS", label: "Contacts", icon: ShieldCheck },
    ];

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
                <aside className="fixed left-0 top-[73px] bottom-0 w-20 md:w-64 bg-white border-r border-gray-100 flex flex-col items-center md:items-stretch py-6 px-2 md:px-6 z-50">
                    <nav className="space-y-1 w-full mt-4">
                        {navItems.map((item) => {
                            const unread = item.id === "CHAT"
                                ? chatSessions.filter(s => {
                                    const last = s.messages?.[0];
                                    return last && !last.isRead && last.senderId !== studentId;
                                }).length
                                : 0;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id)}
                                    className={`w-full flex items-center gap-3 px-3 md:px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                                        activeTab === item.id
                                        ? "bg-blue-600 text-white shadow-sm"
                                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                                    }`}
                                >
                                    <div className="relative">
                                        <item.icon size={18} />
                                        {unread > 0 && (
                                            <span className="absolute -top-1.5 -right-1.5 size-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                                                {unread > 9 ? "9+" : unread}
                                            </span>
                                        )}
                                    </div>
                                    <span className="hidden md:block">{item.label}</span>
                                    {unread > 0 && activeTab !== item.id && (
                                        <span className="hidden md:flex ml-auto size-5 bg-red-500 text-white text-[9px] font-bold rounded-full items-center justify-center">
                                            {unread > 9 ? "9+" : unread}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </nav>

                    <button
                        onClick={handleLogout}
                        className="mt-auto flex items-center justify-center md:justify-start gap-3 px-4 py-3 text-gray-400 hover:text-red-500 text-sm font-medium transition-all"
                    >
                        <LogOut size={16} />
                        <span className="hidden md:block">Log Out</span>
                    </button>
                </aside>

                <main className="flex-1 ml-20 md:ml-64 p-6 md:p-10">
                    <div className="max-w-6xl mx-auto">

                        {/* Success Banner */}
                        {showSuccess && (
                            <div className="mb-6">
                                <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 flex items-center gap-4">
                                    <div className="size-12 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0">
                                        <CheckCircle2 size={24} />
                                    </div>
                                    <div className="flex-1">
                                        <h2 className="text-lg font-bold text-gray-900">Requirement Posted</h2>
                                        <p className="text-sm text-gray-500">Your requirement has been shared with matching tutors. They will contact you soon.</p>
                                    </div>
                                    <button onClick={() => setShowSuccess(false)} className="text-gray-400 hover:text-gray-600 p-2">
                                        &times;
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeTab === "HOME" && (
                            <div className="space-y-8">
                                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                                    <div>
                                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">
                                            Welcome, {studentData?.name || "Student"}
                                        </h1>
                                        <p className="text-gray-500 text-sm">Track your requirements and connect with tutors.</p>
                                    </div>
                                    <Link href="/post-requirement" className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold text-sm shadow-sm hover:bg-blue-700 transition-all h-fit">
                                        <Briefcase size={16} /> Post a Requirement
                                    </Link>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {[
                                        { label: "Active Requirements", val: activeLeads.length, icon: Briefcase, color: "text-blue-600", bg: "bg-blue-50" },
                                        { label: "Tutor Matches", val: unlockedTutors.length, icon: Users, color: "text-emerald-600", bg: "bg-emerald-50" },
                                        { label: "Credits", val: studentData?.credits || 0, icon: CreditCard, color: "text-blue-600", bg: "bg-blue-50" }
                                    ].map((stat, i) => (
                                        <div key={i} className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm">
                                            <div className={`size-10 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center mb-3`}>
                                                <stat.icon size={20} />
                                            </div>
                                            <p className="text-xs font-medium text-gray-400 mb-1">{stat.label}</p>
                                            <p className="text-2xl font-bold text-gray-900">{stat.val}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* Quick Actions */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Link href="/search?role=TUTOR" className="p-5 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center gap-4 group">
                                        <div className="size-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                            <Search size={20} />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-gray-900 text-sm">Search Tutors</h3>
                                            <p className="text-xs text-gray-400">Browse verified tutors near you</p>
                                        </div>
                                        <ArrowRight size={16} className="text-gray-300 group-hover:text-blue-600 transition-colors" />
                                    </Link>
                                    <Link href="/categories" className="p-5 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center gap-4 group">
                                        <div className="size-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                            <GraduationCap size={20} />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-gray-900 text-sm">Browse Categories</h3>
                                            <p className="text-xs text-gray-400">Explore subjects and categories</p>
                                        </div>
                                        <ArrowRight size={16} className="text-gray-300 group-hover:text-emerald-600 transition-colors" />
                                    </Link>
                                </div>
                            </div>
                        )}

                        {activeTab === "REQUIREMENTS" && (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-2xl font-bold text-gray-900 tracking-tight">My Requirements</h2>
                                    <Link href="/post-requirement" className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-semibold text-sm shadow-sm hover:bg-blue-700 transition-all">
                                        <Briefcase size={14} /> Post New
                                    </Link>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {activeLeads.length > 0 ? activeLeads.map((lead) => (
                                        <div key={lead.id} className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all">
                                            <div className="flex justify-between items-center mb-3">
                                                <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-semibold border border-blue-100">{lead.subjects?.[0] || 'General'}</span>
                                                <div className="flex items-center gap-1.5">
                                                    <span className="size-1.5 rounded-full bg-emerald-500"></span>
                                                    <span className="text-xs font-medium text-gray-400">{lead.status}</span>
                                                </div>
                                            </div>
                                            <p className="text-gray-900 font-medium mb-4 leading-relaxed line-clamp-3">{lead.description}</p>
                                            <div className="grid grid-cols-2 gap-4 py-3 border-t border-gray-50 mb-4">
                                                <div>
                                                    <p className="text-xs text-gray-400 mb-0.5">Location</p>
                                                    <p className="text-sm font-medium text-gray-900">{lead.locations?.[0] || 'Online'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-400 mb-0.5">Grade</p>
                                                    <p className="text-sm font-medium text-gray-900">{lead.grades?.[0] || 'Any'}</p>
                                                </div>
                                            </div>

                                            {/* Boost Button */}
                                            {lead.isPremium ? (
                                                <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-100 rounded-xl">
                                                    <Zap size={14} className="text-amber-600" />
                                                    <span className="text-xs font-semibold text-amber-700">Boosted — getting priority responses</span>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => handleBoostLead(lead)}
                                                    disabled={boostingLead === lead.id}
                                                    className="w-full py-2.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-xl font-semibold text-sm hover:bg-amber-100 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                                >
                                                    {boostingLead === lead.id ? (
                                                        <Loader2 size={14} className="animate-spin" />
                                                    ) : (
                                                        <>
                                                            <Zap size={14} />
                                                            Boost for ₹49 — get more tutor responses
                                                        </>
                                                    )}
                                                </button>
                                            )}
                                        </div>
                                    )) : (
                                        <div className="col-span-full py-16 text-center bg-white rounded-2xl border border-dashed border-gray-200">
                                            <Briefcase size={32} className="text-gray-200 mx-auto mb-3" />
                                            <p className="text-sm text-gray-400 mb-4">No requirements posted yet.</p>
                                            <Link href="/post-requirement" className="text-sm font-semibold text-blue-600 hover:text-blue-700">Post your first requirement</Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === "CHAT" && (
                            <div className="h-[calc(100vh-180px)] flex bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                                <div className="w-full md:w-72 border-r border-gray-100 flex flex-col">
                                    <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                                        <h3 className="text-sm font-bold text-gray-900">Messages</h3>
                                        <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-md text-xs font-semibold">{chatSessions.length}</span>
                                    </div>
                                    <div className="flex-1 overflow-y-auto py-2">
                                        {loadingChat ? (
                                            <div className="flex flex-col items-center justify-center py-12">
                                                <Loader2 className="animate-spin text-blue-600 mb-2" size={20} />
                                                <p className="text-xs text-gray-400">Loading...</p>
                                            </div>
                                        ) : chatSessions.length > 0 ? chatSessions.map((session) => {
                                            const recipient = session.studentId === studentId ? session.tutor : session.student;
                                            const isActive = selectedSession?.id === session.id;
                                            const lastMsg = session.messages?.[0];

                                            return (
                                                <button
                                                    key={session.id}
                                                    onClick={() => setSelectedSession(session)}
                                                    className={`w-full px-4 py-3 text-left flex items-center gap-3 transition-all ${
                                                        isActive ? "bg-blue-50 border-r-2 border-blue-600" : "hover:bg-gray-50"
                                                    }`}
                                                >
                                                    <div className={`size-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                                                        isActive ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500'
                                                    }`}>
                                                        {recipient?.name?.[0] || "?"}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="text-sm font-semibold text-gray-900 truncate">{recipient?.name || "User"}</h4>
                                                        <p className="text-xs text-gray-400 truncate">
                                                            {lastMsg ? lastMsg.content.substring(0, 30) : "No messages yet"}
                                                        </p>
                                                    </div>
                                                </button>
                                            );
                                        }) : (
                                            <div className="p-8 text-center">
                                                <MessageCircle size={24} className="text-gray-200 mx-auto mb-2" />
                                                <p className="text-xs text-gray-400">No messages yet</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex-1 bg-white">
                                    {selectedSession ? (
                                        <Chat
                                            sessionId={selectedSession.id}
                                            currentUser={{ id: studentId, name: studentData?.name }}
                                            recipientName={selectedSession.studentId === studentId ? selectedSession.tutor?.name : selectedSession.student?.name}
                                        />
                                    ) : (
                                        <div className="h-full flex flex-col items-center justify-center text-center p-8">
                                            <MessageCircle size={48} className="text-gray-200 mb-4" />
                                            <h3 className="text-lg font-bold text-gray-300 mb-1">No conversation selected</h3>
                                            <p className="text-sm text-gray-400">Select a conversation from the list to start chatting.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === "MATCHES" && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Tutor Matches</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {unlockedTutors.length > 0 ? unlockedTutors.map((t) => (
                                        <div key={t.id} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all">
                                            <div className="flex items-start gap-4 mb-4">
                                                <div className="size-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg shrink-0">
                                                    {t.name?.[0]}
                                                </div>
                                                <div className="min-w-0">
                                                    <h3 className="font-bold text-gray-900 truncate">{t.name}</h3>
                                                    <p className="text-sm text-blue-600 font-medium">{t.tutorListing?.subjects?.slice(0, 2).join(", ") || "Tutor"}</p>
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap gap-x-4 gap-y-1 mb-4 text-xs text-gray-500">
                                                {t.tutorListing?.hourlyRate && (
                                                    <span className="font-semibold text-gray-900">₹{t.tutorListing.hourlyRate}/hr</span>
                                                )}
                                                {t.tutorListing?.locations?.[0] && (
                                                    <span>{t.tutorListing.locations[0]}</span>
                                                )}
                                                {t.tutorListing?.experience && (
                                                    <span>{t.tutorListing.experience} yrs exp</span>
                                                )}
                                                {t.tutorListing?.rating && (
                                                    <span>★ {t.tutorListing.rating.toFixed(1)}</span>
                                                )}
                                            </div>
                                            <div className="flex gap-2">
                                                <Link
                                                    href={`/search/${t.id}`}
                                                    className="flex-1 py-2 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-center gap-1.5 text-xs font-semibold text-gray-700 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all"
                                                >
                                                    View Profile
                                                </Link>
                                                <button
                                                    onClick={() => {
                                                        setSelectedTutorForReview(t);
                                                        setIsReviewOpen(true);
                                                    }}
                                                    className="py-2 px-3 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-center text-xs font-semibold text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 transition-all"
                                                >
                                                    <Star size={13} />
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
                                                    className="size-9 bg-blue-600 text-white rounded-xl flex items-center justify-center hover:bg-blue-700 transition-all"
                                                >
                                                    {loadingChat ? <Loader2 className="animate-spin" size={14} /> : <MessageCircle size={14} />}
                                                </button>
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="col-span-full py-16 text-center bg-white rounded-2xl border border-dashed border-gray-200">
                                            <Users size={32} className="text-gray-200 mx-auto mb-3" />
                                            <p className="text-sm text-gray-400">No tutor matches yet. Post a requirement to get matched.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === "CONTACTS" && (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Contacts</h2>
                                    <Link href="/search" className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1">
                                        <Search size={14} /> Search More Tutors
                                    </Link>
                                </div>
                                <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="border-b border-gray-50 bg-gray-50">
                                                <th className="px-6 py-4 text-xs font-semibold text-gray-500">Tutor</th>
                                                <th className="px-6 py-4 text-xs font-semibold text-gray-500">Status</th>
                                                <th className="px-6 py-4 text-xs font-semibold text-gray-500">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {unlockedTutors.length > 0 ? unlockedTutors.map((t) => (
                                                <tr key={t.id} className="hover:bg-gray-50/50 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="size-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                                                                {t.name[0]}
                                                            </div>
                                                            <div>
                                                                <h4 className="text-sm font-semibold text-gray-900">{t.name}</h4>
                                                                <p className="text-xs text-gray-400">{t.tutorListing?.subjects?.[0] || "Tutor"}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="px-3 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-lg text-xs font-semibold">
                                                            Connected
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-2">
                                                            <a href={`tel:${t.phone}`} className="size-9 bg-blue-600 text-white rounded-lg flex items-center justify-center hover:bg-blue-700 transition-all">
                                                                <Phone size={14} />
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
                                                                className="size-9 bg-gray-50 border border-gray-100 text-gray-700 rounded-lg flex items-center justify-center hover:border-blue-500 transition-all"
                                                            >
                                                                {loadingChat ? <Loader2 className="animate-spin" size={14} /> : <MessageCircle size={14} />}
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )) : (
                                                <tr>
                                                    <td colSpan={3} className="px-6 py-16 text-center">
                                                        <Search size={32} className="text-gray-200 mx-auto mb-3" />
                                                        <p className="text-sm text-gray-400">No contacts yet. Post a requirement or search for tutors.</p>
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
            <div className="flex items-center justify-center min-h-screen bg-gray-50 font-sans">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 size={32} className="animate-spin text-blue-600" />
                    <p className="text-sm text-gray-400">Loading dashboard...</p>
                </div>
            </div>
        }>
            <StudentDashboardContent />
        </Suspense>
    );
}
