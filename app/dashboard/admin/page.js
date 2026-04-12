"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Logo from "@/app/components/Logo";
import {
    LayoutDashboard, Users, CreditCard, ShieldCheck, LogOut,
    GraduationCap, UserCheck, TrendingUp, Search, CheckCircle2,
    Target, Wallet, Phone, Mail, Loader2, ChevronLeft, ChevronRight,
    FileText, Zap, Crown, Ban, RefreshCw, X, AlertCircle, BadgeCheck
} from "lucide-react";

const ROLE_COLORS = {
    TUTOR: "bg-blue-50 text-blue-700",
    STUDENT: "bg-amber-50 text-amber-700",
    INSTITUTE: "bg-purple-50 text-purple-700",
    ADMIN: "bg-red-50 text-red-700"
};

const TIER_COLORS = {
    FREE: "text-gray-400",
    PRO: "text-blue-600 font-semibold",
    ELITE: "text-purple-600 font-semibold"
};

const STATUS_COLORS = {
    OPEN: "bg-emerald-50 text-emerald-700",
    CLOSED: "bg-gray-100 text-gray-500",
    CLOSED_STUDENT: "bg-amber-50 text-amber-700",
    CLOSED_ADMIN: "bg-red-50 text-red-600"
};

function AdminDashboardContent() {
    const router = useRouter();
    const [adminKey, setAdminKey] = useState("");
    const [activeTab, setActiveTab] = useState("overview");

    // Overview
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    // Users tab
    const [users, setUsers] = useState([]);
    const [usersTotal, setUsersTotal] = useState(0);
    const [usersPage, setUsersPage] = useState(1);
    const [usersPages, setUsersPages] = useState(1);
    const [usersSearch, setUsersSearch] = useState("");
    const [usersRole, setUsersRole] = useState("");
    const [usersLoading, setUsersLoading] = useState(false);

    // User action modal
    const [selectedUser, setSelectedUser] = useState(null);
    const [actionModal, setActionModal] = useState(""); // "credits" | "tier" | ""
    const [creditAmount, setCreditAmount] = useState("");
    const [selectedTier, setSelectedTier] = useState("FREE");
    const [actionLoading, setActionLoading] = useState(false);
    const [actionMsg, setActionMsg] = useState("");

    // Leads tab
    const [leads, setLeads] = useState([]);
    const [leadsTotal, setLeadsTotal] = useState(0);
    const [leadsPage, setLeadsPage] = useState(1);
    const [leadsPages, setLeadsPages] = useState(1);
    const [leadsStatus, setLeadsStatus] = useState("");
    const [leadsLoading, setLeadsLoading] = useState(false);

    // Financials tab
    const [transactions, setTransactions] = useState([]);
    const [txPage, setTxPage] = useState(1);
    const [txPages, setTxPages] = useState(1);
    const [txTotal, setTxTotal] = useState(0);
    const [txLoading, setTxLoading] = useState(false);

    useEffect(() => {
        const key = localStorage.getItem("ti_admin_key") || "";
        setAdminKey(key);
        if (!key) { router.push("/admin/login"); return; }
    }, []);

    useEffect(() => {
        if (adminKey) fetchMetrics();
    }, [adminKey]);

    useEffect(() => {
        if (activeTab === "users" && adminKey) fetchUsers();
    }, [activeTab, usersPage, usersRole, adminKey]);

    useEffect(() => {
        if (activeTab === "leads" && adminKey) fetchLeads();
    }, [activeTab, leadsPage, leadsStatus, adminKey]);

    useEffect(() => {
        if (activeTab === "financials" && adminKey) fetchTransactions();
    }, [activeTab, txPage, adminKey]);

    const headers = useCallback(() => ({
        "Content-Type": "application/json",
        "x-admin-key": adminKey
    }), [adminKey]);

    const fetchMetrics = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/metrics", { headers: headers() });
            const json = await res.json();
            if (json.success) setData(json);
            else if (res.status === 401) router.push("/admin/login");
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const fetchUsers = async (searchOverride) => {
        setUsersLoading(true);
        const q = searchOverride !== undefined ? searchOverride : usersSearch;
        const params = new URLSearchParams({ page: usersPage, ...(q && { search: q }), ...(usersRole && { role: usersRole }) });
        try {
            const res = await fetch(`/api/admin/users?${params}`, { headers: headers() });
            const json = await res.json();
            if (json.success) { setUsers(json.users); setUsersTotal(json.total); setUsersPages(json.pages); }
        } catch (err) { console.error(err); }
        finally { setUsersLoading(false); }
    };

    const fetchLeads = async () => {
        setLeadsLoading(true);
        const params = new URLSearchParams({ page: leadsPage, ...(leadsStatus && { status: leadsStatus }) });
        try {
            const res = await fetch(`/api/admin/leads?${params}`, { headers: headers() });
            const json = await res.json();
            if (json.success) { setLeads(json.leads); setLeadsTotal(json.total); setLeadsPages(json.pages); }
        } catch (err) { console.error(err); }
        finally { setLeadsLoading(false); }
    };

    const fetchTransactions = async () => {
        setTxLoading(true);
        try {
            const res = await fetch(`/api/admin/metrics`, { headers: headers() });
            const json = await res.json();
            if (json.success) {
                setTransactions(json.recentTransactions || []);
                setTxTotal(json.recentTransactions?.length || 0);
            }
        } catch (err) { console.error(err); }
        finally { setTxLoading(false); }
    };

    const handleApproveTutor = async (tutorId) => {
        try {
            await fetch("/api/admin/tutor/approve", {
                method: "POST",
                headers: headers(),
                body: JSON.stringify({ tutorId, isApproved: true })
            });
            fetchMetrics();
        } catch (err) { console.error(err); }
    };

    const handleSuspend = async (user) => {
        if (!confirm(`${user.isSuspended ? "Unsuspend" : "Suspend"} ${user.name}?`)) return;
        try {
            const res = await fetch("/api/admin/user/suspend", {
                method: "POST",
                headers: headers(),
                body: JSON.stringify({ userId: user.id, suspend: !user.isSuspended })
            });
            const json = await res.json();
            if (json.success) {
                setUsers(prev => prev.map(u => u.id === user.id ? { ...u, isSuspended: json.isSuspended } : u));
            }
        } catch (err) { console.error(err); }
    };

    const handleCreditAction = async () => {
        if (!creditAmount || isNaN(parseInt(creditAmount))) return;
        setActionLoading(true);
        setActionMsg("");
        try {
            const res = await fetch("/api/admin/user/credits", {
                method: "POST",
                headers: headers(),
                body: JSON.stringify({ userId: selectedUser.id, amount: parseInt(creditAmount) })
            });
            const json = await res.json();
            if (json.success) {
                setUsers(prev => prev.map(u => u.id === selectedUser.id ? { ...u, credits: json.credits } : u));
                setActionMsg(`Credits updated to ${json.credits}`);
                setCreditAmount("");
            } else {
                setActionMsg(json.error || "Failed");
            }
        } catch { setActionMsg("Error updating credits"); }
        finally { setActionLoading(false); }
    };

    const handleTierAction = async () => {
        setActionLoading(true);
        setActionMsg("");
        try {
            const res = await fetch("/api/admin/user/tier", {
                method: "POST",
                headers: headers(),
                body: JSON.stringify({ userId: selectedUser.id, tier: selectedTier })
            });
            const json = await res.json();
            if (json.success) {
                setUsers(prev => prev.map(u => u.id === selectedUser.id ? { ...u, subscriptionTier: json.subscriptionTier } : u));
                setActionMsg(`Plan changed to ${json.subscriptionTier}`);
            } else {
                setActionMsg(json.error || "Failed");
            }
        } catch { setActionMsg("Error changing plan"); }
        finally { setActionLoading(false); }
    };

    const handleLeadStatusChange = async (leadId, status) => {
        try {
            const res = await fetch("/api/admin/leads", {
                method: "PATCH",
                headers: headers(),
                body: JSON.stringify({ leadId, status })
            });
            const json = await res.json();
            if (json.success) {
                setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: json.lead.status } : l));
            }
        } catch (err) { console.error(err); }
    };

    const openActionModal = (user, type) => {
        setSelectedUser(user);
        setSelectedTier(user.subscriptionTier || "FREE");
        setCreditAmount("");
        setActionMsg("");
        setActionModal(type);
    };

    const navItems = [
        { id: "overview", icon: LayoutDashboard, label: "Overview" },
        { id: "users", icon: Users, label: "Users" },
        { id: "leads", icon: FileText, label: "Leads" },
        { id: "listings", icon: GraduationCap, label: "Approvals" },
        { id: "financials", icon: CreditCard, label: "Transactions" },
    ];

    return (
        <div className="flex h-screen bg-gray-50 text-gray-900 overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 border-r border-gray-200 bg-white hidden lg:flex flex-col shadow-sm z-50">
                <div className="p-6 border-b border-gray-100">
                    <Logo />
                    <p className="text-xs text-gray-400 mt-1 font-medium">Admin Panel</p>
                </div>
                <nav className="p-4 flex-1 space-y-0.5">
                    {navItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                                activeTab === item.id ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            }`}
                        >
                            <item.icon size={16} className={activeTab === item.id ? "text-blue-600" : "text-gray-400"} />
                            {item.label}
                        </button>
                    ))}
                </nav>
                <div className="p-4 border-t border-gray-100">
                    <button
                        onClick={() => { localStorage.removeItem("ti_admin_key"); router.push("/admin/login"); }}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-red-500 border border-gray-200 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors"
                    >
                        <LogOut size={14} /> Log Out
                    </button>
                </div>
            </aside>

            {/* Main */}
            <main className="flex-1 overflow-y-auto">
                {/* Top bar */}
                <div className="sticky top-0 z-40 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
                    <div>
                        <h1 className="text-sm font-semibold text-gray-900 capitalize">{navItems.find(n => n.id === activeTab)?.label || "Dashboard"}</h1>
                        <p className="text-xs text-gray-400">Administrator Portal</p>
                    </div>
                    <button onClick={fetchMetrics} className="p-2 rounded-lg hover:bg-gray-50 text-gray-400 transition-colors" title="Refresh">
                        <RefreshCw size={16} />
                    </button>
                </div>

                <div className="p-6 pb-20 max-w-7xl mx-auto space-y-6">
                    {loading && activeTab === "overview" ? (
                        <div className="flex flex-col items-center justify-center py-40">
                            <Loader2 size={28} className="animate-spin text-blue-500" />
                            <p className="mt-3 text-sm text-gray-400">Loading...</p>
                        </div>
                    ) : (
                        <>
                            {/* ── OVERVIEW ── */}
                            {activeTab === "overview" && (
                                <>
                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                        {[
                                            { label: "Total Tutors", value: data?.metrics?.totalTutors ?? 0, icon: GraduationCap, color: "text-blue-600", bg: "bg-blue-50" },
                                            { label: "Total Students", value: data?.metrics?.totalStudents ?? 0, icon: UserCheck, color: "text-amber-600", bg: "bg-amber-50" },
                                            { label: "Total Revenue", value: `₹${(data?.metrics?.totalRevenue ?? 0).toLocaleString("en-IN")}`, icon: Wallet, color: "text-emerald-600", bg: "bg-emerald-50" },
                                            { label: "Active Leads", value: data?.metrics?.activeLeads ?? 0, icon: Target, color: "text-purple-600", bg: "bg-purple-50" }
                                        ].map((s, i) => (
                                            <div key={i} className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <div className={`p-2 rounded-xl ${s.bg}`}><s.icon size={16} className={s.color} /></div>
                                                    <p className="text-xs font-medium text-gray-400">{s.label}</p>
                                                </div>
                                                <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className="font-semibold text-gray-900 text-sm">Pending Approvals</h3>
                                                <button onClick={() => setActiveTab("listings")} className="text-xs text-blue-600 hover:underline">View All</button>
                                            </div>
                                            <div className="space-y-2">
                                                {data?.pendingTutors?.slice(0, 5).map(t => (
                                                    <div key={t.id} className="p-3 bg-gray-50 rounded-xl flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-semibold text-xs">{t.name?.[0]}</div>
                                                            <div>
                                                                <p className="font-medium text-sm text-gray-900">{t.name}</p>
                                                                <p className="text-xs text-gray-400">{t.phone}</p>
                                                            </div>
                                                        </div>
                                                        <button onClick={() => handleApproveTutor(t.id)} className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors">Approve</button>
                                                    </div>
                                                ))}
                                                {(!data?.pendingTutors?.length) && <p className="text-center py-8 text-sm text-gray-400">No pending approvals</p>}
                                            </div>
                                        </div>

                                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className="font-semibold text-gray-900 text-sm">Recent Transactions</h3>
                                                <button onClick={() => setActiveTab("financials")} className="text-xs text-blue-600 hover:underline">View All</button>
                                            </div>
                                            <div className="space-y-2">
                                                {data?.recentTransactions?.slice(0, 5).map(tx => (
                                                    <div key={tx.id} className="p-3 bg-gray-50 rounded-xl flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center"><Wallet size={14} /></div>
                                                            <div>
                                                                <p className="font-medium text-sm text-gray-900">₹{tx.amount}</p>
                                                                <p className="text-xs text-gray-400">{tx.user?.name || "Member"}</p>
                                                            </div>
                                                        </div>
                                                        <p className="text-xs text-gray-400">{new Date(tx.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</p>
                                                    </div>
                                                ))}
                                                {(!data?.recentTransactions?.length) && <p className="text-center py-8 text-sm text-gray-400">No transactions yet</p>}
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* ── USERS ── */}
                            {activeTab === "users" && (
                                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
                                    <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                        <h3 className="font-semibold text-gray-900">Users <span className="text-gray-400 font-normal text-sm">({usersTotal})</span></h3>
                                        <div className="flex gap-2 flex-wrap">
                                            <select
                                                value={usersRole}
                                                onChange={e => { setUsersRole(e.target.value); setUsersPage(1); }}
                                                className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none"
                                            >
                                                <option value="">All Roles</option>
                                                <option value="TUTOR">Tutor</option>
                                                <option value="STUDENT">Student</option>
                                                <option value="INSTITUTE">Institute</option>
                                                <option value="ADMIN">Admin</option>
                                            </select>
                                            <form onSubmit={e => { e.preventDefault(); setUsersPage(1); fetchUsers(usersSearch); }} className="flex gap-2">
                                                <div className="relative">
                                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={13} />
                                                    <input
                                                        type="text"
                                                        value={usersSearch}
                                                        onChange={e => setUsersSearch(e.target.value)}
                                                        placeholder="Name, phone, email..."
                                                        className="pl-8 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none w-52"
                                                    />
                                                </div>
                                                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">Search</button>
                                            </form>
                                        </div>
                                    </div>

                                    {usersLoading ? (
                                        <div className="flex items-center justify-center py-16"><Loader2 size={24} className="animate-spin text-gray-300" /></div>
                                    ) : (
                                        <>
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-left">
                                                    <thead>
                                                        <tr className="border-b border-gray-100 bg-gray-50">
                                                            <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                                                            <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                                                            <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Plan</th>
                                                            <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Credits</th>
                                                            <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                                            <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Joined</th>
                                                            <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-gray-50">
                                                        {users.map(user => (
                                                            <tr key={user.id} className={`hover:bg-gray-50 transition-colors ${user.isSuspended ? "opacity-50" : ""}`}>
                                                                <td className="px-5 py-3">
                                                                    <div className="flex items-center gap-3">
                                                                        <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-semibold text-xs shrink-0">
                                                                            {(user.name || "?")?.[0]?.toUpperCase()}
                                                                        </div>
                                                                        <div>
                                                                            <p className="font-medium text-sm text-gray-900 flex items-center gap-1">
                                                                                {user.name || "—"}
                                                                                {user.isVerified && <BadgeCheck size={12} className="text-blue-500" />}
                                                                                {user.isSuspended && <Ban size={12} className="text-red-500" />}
                                                                            </p>
                                                                            <p className="text-xs text-gray-400">{user.email || user.phone}</p>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td className="px-5 py-3">
                                                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${ROLE_COLORS[user.role] || "bg-gray-50 text-gray-600"}`}>
                                                                        {user.role?.charAt(0) + user.role?.slice(1)?.toLowerCase()}
                                                                    </span>
                                                                </td>
                                                                <td className="px-5 py-3">
                                                                    <span className={`text-xs capitalize ${TIER_COLORS[user.subscriptionTier] || "text-gray-400"}`}>
                                                                        {user.subscriptionTier?.toLowerCase() || "free"}
                                                                    </span>
                                                                </td>
                                                                <td className="px-5 py-3">
                                                                    <span className="flex items-center gap-1 text-sm text-amber-600 font-semibold">
                                                                        <Zap size={12} />{user.credits ?? 0}
                                                                    </span>
                                                                </td>
                                                                <td className="px-5 py-3">
                                                                    {user.isSuspended
                                                                        ? <span className="text-xs text-red-500 font-medium">Suspended</span>
                                                                        : <span className="text-xs text-emerald-600 font-medium">Active</span>
                                                                    }
                                                                </td>
                                                                <td className="px-5 py-3 text-xs text-gray-400 whitespace-nowrap">
                                                                    {new Date(user.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "2-digit" })}
                                                                </td>
                                                                <td className="px-5 py-3">
                                                                    <div className="flex items-center gap-1">
                                                                        <button
                                                                            onClick={() => openActionModal(user, "credits")}
                                                                            className="px-2.5 py-1 bg-amber-50 text-amber-700 rounded-lg text-xs font-medium hover:bg-amber-100 transition-colors"
                                                                            title="Add/remove credits"
                                                                        >Credits</button>
                                                                        <button
                                                                            onClick={() => openActionModal(user, "tier")}
                                                                            className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium hover:bg-blue-100 transition-colors"
                                                                            title="Change plan"
                                                                        >Plan</button>
                                                                        <button
                                                                            onClick={() => handleSuspend(user)}
                                                                            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${user.isSuspended ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100" : "bg-red-50 text-red-600 hover:bg-red-100"}`}
                                                                        >{user.isSuspended ? "Unsuspend" : "Suspend"}</button>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                        {users.length === 0 && (
                                                            <tr><td colSpan={7} className="px-5 py-16 text-center text-sm text-gray-400">No users found</td></tr>
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                            {usersPages > 1 && (
                                                <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between">
                                                    <p className="text-xs text-gray-400">Page {usersPage} of {usersPages} · {usersTotal} total</p>
                                                    <div className="flex gap-2">
                                                        <button onClick={() => setUsersPage(p => Math.max(1, p - 1))} disabled={usersPage === 1} className="p-1.5 rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50 disabled:opacity-40"><ChevronLeft size={14} /></button>
                                                        <button onClick={() => setUsersPage(p => Math.min(usersPages, p + 1))} disabled={usersPage === usersPages} className="p-1.5 rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50 disabled:opacity-40"><ChevronRight size={14} /></button>
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            )}

                            {/* ── LEADS ── */}
                            {activeTab === "leads" && (
                                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
                                    <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                        <h3 className="font-semibold text-gray-900">Leads <span className="text-gray-400 font-normal text-sm">({leadsTotal})</span></h3>
                                        <select
                                            value={leadsStatus}
                                            onChange={e => { setLeadsStatus(e.target.value); setLeadsPage(1); }}
                                            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none"
                                        >
                                            <option value="">All Status</option>
                                            <option value="OPEN">Open</option>
                                            <option value="CLOSED">Closed</option>
                                            <option value="CLOSED_STUDENT">Closed by Student</option>
                                            <option value="CLOSED_ADMIN">Closed by Admin</option>
                                        </select>
                                    </div>

                                    {leadsLoading ? (
                                        <div className="flex items-center justify-center py-16"><Loader2 size={24} className="animate-spin text-gray-300" /></div>
                                    ) : (
                                        <>
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-left">
                                                    <thead>
                                                        <tr className="border-b border-gray-100 bg-gray-50">
                                                            <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Student</th>
                                                            <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Subjects</th>
                                                            <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Budget</th>
                                                            <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Unlocks</th>
                                                            <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                                            <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Posted</th>
                                                            <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-gray-50">
                                                        {leads.map(lead => (
                                                            <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                                                                <td className="px-5 py-3">
                                                                    <p className="font-medium text-sm text-gray-900">{lead.student?.name || "—"}</p>
                                                                    <p className="text-xs text-gray-400">{lead.student?.phone || lead.student?.email || ""}</p>
                                                                </td>
                                                                <td className="px-5 py-3">
                                                                    <div className="flex flex-wrap gap-1">
                                                                        {lead.subjects?.slice(0, 2).map(s => (
                                                                            <span key={s} className="px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded text-xs">{s}</span>
                                                                        ))}
                                                                        {lead.subjects?.length > 2 && <span className="text-xs text-gray-400">+{lead.subjects.length - 2}</span>}
                                                                    </div>
                                                                </td>
                                                                <td className="px-5 py-3 text-sm text-gray-600">
                                                                    {lead.budget ? `₹${lead.budget}` : "—"}
                                                                </td>
                                                                <td className="px-5 py-3 text-sm text-gray-600">
                                                                    {lead._count?.unlockedBy ?? lead.unlockCount ?? 0} / {lead.maxUnlocks ?? 3}
                                                                </td>
                                                                <td className="px-5 py-3">
                                                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[lead.status] || "bg-gray-100 text-gray-500"}`}>
                                                                        {lead.status?.replace("_", " ")}
                                                                    </span>
                                                                </td>
                                                                <td className="px-5 py-3 text-xs text-gray-400 whitespace-nowrap">
                                                                    {new Date(lead.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "2-digit" })}
                                                                </td>
                                                                <td className="px-5 py-3">
                                                                    {lead.status === "OPEN" ? (
                                                                        <button
                                                                            onClick={() => handleLeadStatusChange(lead.id, "CLOSED_ADMIN")}
                                                                            className="px-2.5 py-1 bg-red-50 text-red-600 rounded-lg text-xs font-medium hover:bg-red-100 transition-colors"
                                                                        >Close</button>
                                                                    ) : (
                                                                        <button
                                                                            onClick={() => handleLeadStatusChange(lead.id, "OPEN")}
                                                                            className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-medium hover:bg-emerald-100 transition-colors"
                                                                        >Reopen</button>
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                        {leads.length === 0 && (
                                                            <tr><td colSpan={7} className="px-5 py-16 text-center text-sm text-gray-400">No leads found</td></tr>
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                            {leadsPages > 1 && (
                                                <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between">
                                                    <p className="text-xs text-gray-400">Page {leadsPage} of {leadsPages} · {leadsTotal} total</p>
                                                    <div className="flex gap-2">
                                                        <button onClick={() => setLeadsPage(p => Math.max(1, p - 1))} disabled={leadsPage === 1} className="p-1.5 rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50 disabled:opacity-40"><ChevronLeft size={14} /></button>
                                                        <button onClick={() => setLeadsPage(p => Math.min(leadsPages, p + 1))} disabled={leadsPage === leadsPages} className="p-1.5 rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50 disabled:opacity-40"><ChevronRight size={14} /></button>
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            )}

                            {/* ── APPROVALS ── */}
                            {activeTab === "listings" && (
                                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                                    <h3 className="font-semibold text-gray-900 mb-5">Pending Tutor Approvals</h3>
                                    <div className="space-y-3">
                                        {data?.pendingTutors?.map(tutor => (
                                            <div key={tutor.id} className="p-4 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-between hover:border-blue-200 transition-colors">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-11 h-11 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center font-semibold text-lg">{tutor.name?.[0]}</div>
                                                    <div>
                                                        <p className="font-medium text-gray-900">{tutor.name}</p>
                                                        <div className="flex gap-4 mt-1">
                                                            {tutor.phone && <span className="flex items-center gap-1 text-xs text-gray-400"><Phone size={11} /> {tutor.phone}</span>}
                                                            {tutor.email && <span className="flex items-center gap-1 text-xs text-gray-400"><Mail size={11} /> {tutor.email}</span>}
                                                        </div>
                                                        {tutor.tutorListing?.subjects?.length > 0 && (
                                                            <div className="flex gap-1 mt-2 flex-wrap">
                                                                {tutor.tutorListing.subjects.slice(0, 4).map(s => (
                                                                    <span key={s} className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs">{s}</span>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleApproveTutor(tutor.id)}
                                                        className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                                                    >
                                                        <CheckCircle2 size={14} className="inline mr-1.5" />Approve
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                        {(!data?.pendingTutors?.length) && (
                                            <div className="text-center py-16">
                                                <CheckCircle2 size={32} className="text-emerald-300 mx-auto mb-3" />
                                                <p className="text-sm text-gray-400">No pending approvals</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* ── FINANCIALS ── */}
                            {activeTab === "financials" && (
                                <>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        <div className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm">
                                            <p className="text-xs font-medium text-gray-400 mb-2">Total Revenue</p>
                                            <p className="text-2xl font-bold text-gray-900">₹{(data?.metrics?.totalRevenue ?? 0).toLocaleString("en-IN")}</p>
                                        </div>
                                        <div className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm">
                                            <p className="text-xs font-medium text-gray-400 mb-2">Transactions</p>
                                            <p className="text-2xl font-bold text-gray-900">{data?.recentTransactions?.length ?? 0}</p>
                                        </div>
                                        <div className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm">
                                            <p className="text-xs font-medium text-gray-400 mb-2">Avg. Transaction</p>
                                            <p className="text-2xl font-bold text-gray-900">
                                                {data?.recentTransactions?.length
                                                    ? `₹${Math.round((data?.metrics?.totalRevenue ?? 0) / data.recentTransactions.length).toLocaleString("en-IN")}`
                                                    : "—"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
                                        <div className="p-5 border-b border-gray-100">
                                            <h3 className="font-semibold text-gray-900">All Transactions</h3>
                                        </div>
                                        {txLoading ? (
                                            <div className="flex items-center justify-center py-16"><Loader2 size={24} className="animate-spin text-gray-300" /></div>
                                        ) : (
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-left">
                                                    <thead>
                                                        <tr className="border-b border-gray-100 bg-gray-50">
                                                            <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                                                            <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</th>
                                                            <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                                                            <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Amount</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-gray-50">
                                                        {transactions.map(tx => (
                                                            <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                                                                <td className="px-5 py-3">
                                                                    <div className="flex items-center gap-3">
                                                                        <div className="w-7 h-7 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 text-xs font-semibold">{tx.user?.name?.[0]}</div>
                                                                        <div>
                                                                            <p className="font-medium text-sm text-gray-900">{tx.user?.name || "—"}</p>
                                                                            <p className="text-xs text-gray-400 capitalize">{tx.user?.role?.toLowerCase()}</p>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td className="px-5 py-3 text-sm text-gray-500">{tx.description || "Subscription"}</td>
                                                                <td className="px-5 py-3 text-sm text-gray-400">{new Date(tx.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</td>
                                                                <td className="px-5 py-3 text-right">
                                                                    <p className="font-semibold text-emerald-600">₹{tx.amount}</p>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                        {transactions.length === 0 && (
                                                            <tr><td colSpan={4} className="px-5 py-16 text-center text-sm text-gray-400">No transactions yet</td></tr>
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                        </>
                    )}
                </div>
            </main>

            {/* ── USER ACTION MODAL ── */}
            {actionModal && selectedUser && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="font-bold text-gray-900">{actionModal === "credits" ? "Adjust Credits" : "Change Plan"}</h3>
                                <p className="text-xs text-gray-400 mt-0.5">{selectedUser.name}</p>
                            </div>
                            <button onClick={() => { setActionModal(""); setActionMsg(""); }} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-gray-100">
                                <X size={14} className="text-gray-400" />
                            </button>
                        </div>

                        {actionModal === "credits" && (
                            <div className="space-y-4">
                                <p className="text-sm text-gray-500">Current credits: <span className="font-bold text-amber-600">{selectedUser.credits}</span></p>
                                <div>
                                    <label className="text-xs font-medium text-gray-600 block mb-1">Amount (use negative to deduct)</label>
                                    <input
                                        type="number"
                                        value={creditAmount}
                                        onChange={e => setCreditAmount(e.target.value)}
                                        placeholder="e.g. 10 or -5"
                                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-100"
                                    />
                                </div>
                                {actionMsg && <p className={`text-xs ${actionMsg.includes("Error") || actionMsg.includes("Failed") ? "text-red-500" : "text-emerald-600"}`}>{actionMsg}</p>}
                                <button
                                    onClick={handleCreditAction}
                                    disabled={actionLoading}
                                    className="w-full py-2.5 bg-amber-600 text-white font-semibold rounded-xl hover:bg-amber-700 transition-colors text-sm disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {actionLoading ? <><Loader2 size={14} className="animate-spin" /> Updating...</> : "Update Credits"}
                                </button>
                            </div>
                        )}

                        {actionModal === "tier" && (
                            <div className="space-y-4">
                                <p className="text-sm text-gray-500">Current plan: <span className="font-bold capitalize">{selectedUser.subscriptionTier?.toLowerCase()}</span></p>
                                <div className="space-y-2">
                                    {["FREE", "PRO", "ELITE"].map(tier => (
                                        <button
                                            key={tier}
                                            onClick={() => setSelectedTier(tier)}
                                            className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all text-sm font-medium ${selectedTier === tier ? "border-blue-600 bg-blue-50 text-blue-700" : "border-gray-200 hover:border-gray-300 text-gray-700"}`}
                                        >
                                            {tier === "FREE" && "Free — 5 credits/month, limited unlocks"}
                                            {tier === "PRO" && "Expert (PRO) — Unlimited leads, ₹499/mo"}
                                            {tier === "ELITE" && "Coaching Hub (ELITE) — Institute plan, ₹1,999/mo"}
                                        </button>
                                    ))}
                                </div>
                                {actionMsg && <p className={`text-xs ${actionMsg.includes("Error") || actionMsg.includes("Failed") ? "text-red-500" : "text-emerald-600"}`}>{actionMsg}</p>}
                                <button
                                    onClick={handleTierAction}
                                    disabled={actionLoading}
                                    className="w-full py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors text-sm disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {actionLoading ? <><Loader2 size={14} className="animate-spin" /> Updating...</> : "Change Plan"}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default function AdminDashboard() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <Loader2 size={32} className="animate-spin text-blue-500" />
            </div>
        }>
            <AdminDashboardContent />
        </Suspense>
    );
}
