"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Logo from "@/app/components/Logo";
import VipAdminPanel from "@/app/components/VipAdminPanel";
import {
    LayoutDashboard,
    Users,
    CreditCard,
    RefreshCcw,
    LogOut,
    GraduationCap,
    UserCheck,
    Database,
    TrendingUp,
    Search,
    Settings,
    CheckCircle2,
    XCircle,
    BarChart3,
    Target,
    Wallet,
    Phone,
    Mail,
    Star,
    ShieldCheck,
    Calendar,
    Edit2,
    Trash2,
    Eye,
    ChevronLeft,
    ChevronRight,
    GitBranch,
    Server,
    HardDrive,
    Clock,
    ArrowUpCircle,
    RotateCcw,
    ExternalLink,
    AlertTriangle
} from "lucide-react";

function AdminDashboardContent() {
    const router = useRouter();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("overview");

    // Admin key gate
    const [adminKey, setAdminKey] = useState("");
    const [keyInput, setKeyInput] = useState("");
    const [keyError, setKeyError] = useState("");
    const [keyLoading, setKeyLoading] = useState(false);

    // Users tab state
    const [users, setUsers] = useState([]);
    const [usersLoading, setUsersLoading] = useState(false);
    const [userSearch, setUserSearch] = useState("");
    const [userActionLoading, setUserActionLoading] = useState(null);
    const [userRoleFilter, setUserRoleFilter] = useState("ALL");
    const [userStatusFilter, setUserStatusFilter] = useState("ALL");
    const [userSort, setUserSort] = useState("createdAt_desc");
    const [userPage, setUserPage] = useState(1);
    const [userTotal, setUserTotal] = useState(0);
    const [userPages, setUserPages] = useState(1);
    const [selectedUser, setSelectedUser] = useState(null);
    const [userDrawerOpen, setUserDrawerOpen] = useState(false);
    const [userDrawerLoading, setUserDrawerLoading] = useState(false);
    const [userEditMode, setUserEditMode] = useState(false);
    const [userEditData, setUserEditData] = useState({});
    const [userEditSaving, setUserEditSaving] = useState(false);

    // Verification requests
    const [pendingVerifications, setPendingVerifications] = useState([]);
    const [verificationActionLoading, setVerificationActionLoading] = useState(null);

    // Deployments tab
    const [versionData, setVersionData] = useState(null);
    const [versionLoading, setVersionLoading] = useState(false);

    // On mount, check sessionStorage for saved key
    useEffect(() => {
        const saved = sessionStorage.getItem("adminKey");
        if (saved) setAdminKey(saved);
        else setLoading(false);
    }, []);

    useEffect(() => {
        if (adminKey) fetchMetrics(adminKey);
    }, [adminKey]);

    useEffect(() => {
        if (activeTab === "users" && adminKey) fetchUsers();
        if (activeTab === "deployments" && adminKey) fetchVersionData();
    }, [activeTab]);

    const handleKeySubmit = async (e) => {
        e.preventDefault();
        setKeyError("");
        setKeyLoading(true);
        try {
            const res = await fetch("/api/admin/metrics", { headers: { "x-admin-key": keyInput } });
            if (res.status === 401) {
                setKeyError("Incorrect admin key. Please try again.");
                setKeyLoading(false);
                return;
            }
            sessionStorage.setItem("adminKey", keyInput);
            setAdminKey(keyInput);
        } catch {
            setKeyError("Could not connect. Please try again.");
        } finally {
            setKeyLoading(false);
        }
    };

    const adminHeaders = (key) => ({ "x-admin-key": key || adminKey, "Content-Type": "application/json" });

    const fetchMetrics = async (key) => {
        setLoading(true);
        try {
            const [metricsRes, verificationsRes] = await Promise.all([
                fetch("/api/admin/metrics", { headers: { "x-admin-key": key || adminKey } }),
                fetch("/api/admin/verification/requests", { headers: { "x-admin-key": key || adminKey } }),
            ]);
            const json = await metricsRes.json();
            if (json.success) {
                setData(json);
            }
            if (verificationsRes.ok) {
                const vJson = await verificationsRes.json();
                setPendingVerifications(vJson.requests || []);
            }
        } catch (err) {
            console.error("Failed to load metrics", err);
        } finally {
            setLoading(false);
        }
    };

    const handleVerificationReview = async (id, action) => {
        let rejectionReason;
        if (action === "REJECT") {
            rejectionReason = window.prompt("Enter a reason for rejection:");
            if (!rejectionReason) return;
        }
        setVerificationActionLoading(id + action);
        try {
            const res = await fetch(`/api/admin/verification/${id}/review`, {
                method: "PATCH",
                headers: adminHeaders(),
                body: JSON.stringify({ action, rejectionReason }),
            });
            const json = await res.json();
            if (json.success) {
                setPendingVerifications(prev => prev.filter(v => v.id !== id));
            } else {
                alert(json.error || "Something went wrong. Please try again.");
            }
        } catch (err) {
            console.error(err);
            alert("Something went wrong. Please try again.");
        } finally {
            setVerificationActionLoading(null);
        }
    };

    const fetchUsers = async (overrides = {}) => {
        setUsersLoading(true);
        const search = overrides.search ?? userSearch;
        const page   = overrides.page   ?? userPage;
        const role   = overrides.role   ?? userRoleFilter;
        const status = overrides.status ?? userStatusFilter;
        const sort   = overrides.sort   ?? userSort;
        try {
            const params = new URLSearchParams({ search, page, role, status, sort });
            const res = await fetch(`/api/admin/users?${params}`, { headers: { "x-admin-key": adminKey } });
            const json = await res.json();
            if (json.success) {
                setUsers(json.users || []);
                setUserTotal(json.total || 0);
                setUserPages(json.pages || 1);
            }
        } catch (err) {
            console.error("Failed to load users", err);
        } finally {
            setUsersLoading(false);
        }
    };

    const openUserDrawer = async (userId) => {
        setUserDrawerOpen(true);
        setUserEditMode(false);
        setUserEditData({});
        setUserDrawerLoading(true);
        try {
            const res = await fetch(`/api/admin/user/${userId}`, { headers: { "x-admin-key": adminKey } });
            const json = await res.json();
            if (json.success) setSelectedUser(json.user);
        } catch {} finally { setUserDrawerLoading(false); }
    };

    const handleEditUserSave = async () => {
        if (!selectedUser) return;
        setUserEditSaving(true);
        try {
            const res = await fetch(`/api/admin/user/${selectedUser.id}`, {
                method: "PATCH",
                headers: adminHeaders(),
                body: JSON.stringify(userEditData),
            });
            const json = await res.json();
            if (json.success) {
                setSelectedUser(prev => ({ ...prev, ...json.user }));
                setUsers(prev => prev.map(u => u.id === selectedUser.id ? { ...u, ...json.user } : u));
                setUserEditMode(false);
                setUserEditData({});
            }
        } catch {} finally { setUserEditSaving(false); }
    };

    const handleDeleteUser = async (userId) => {
        if (!confirm("Permanently delete this user and all their data? This cannot be undone.")) return;
        try {
            const res = await fetch(`/api/admin/user/${userId}`, { method: "DELETE", headers: adminHeaders() });
            const json = await res.json();
            if (json.success) {
                setUserDrawerOpen(false);
                setSelectedUser(null);
                fetchUsers();
            } else {
                alert(json.error || "Could not delete user.");
            }
        } catch { alert("Delete failed. Please try again."); }
    };

    const handleSuspend = async (userId, suspend) => {
        setUserActionLoading(userId + "-suspend");
        try {
            const res = await fetch("/api/admin/user/suspend", {
                method: "POST",
                headers: adminHeaders(),
                body: JSON.stringify({ userId, suspend }),
            });
            const json = await res.json();
            if (json.success) {
                setUsers(prev => prev.map(u => u.id === userId ? { ...u, isSuspended: json.isSuspended } : u));
                if (selectedUser?.id === userId) setSelectedUser(prev => ({ ...prev, isSuspended: json.isSuspended }));
            }
        } catch (err) {
            console.error(err);
        } finally {
            setUserActionLoading(null);
        }
    };

    const handleAddCredits = async (userId, amount) => {
        if (!amount) return;
        setUserActionLoading(userId + "-credits");
        try {
            const res = await fetch("/api/admin/user/credits", {
                method: "POST",
                headers: adminHeaders(),
                body: JSON.stringify({ userId, amount }),
            });
            const json = await res.json();
            if (json.success) {
                setUsers(prev => prev.map(u => u.id === userId ? { ...u, credits: json.credits } : u));
            }
        } catch (err) {
            console.error(err);
        } finally {
            setUserActionLoading(null);
        }
    };

    const fetchVersionData = async () => {
        setVersionLoading(true);
        try {
            const res = await fetch("/api/admin/version", { headers: { "x-admin-key": adminKey } });
            const json = await res.json();
            if (json.success) setVersionData(json);
        } catch (err) {
            console.error("Failed to load version data", err);
        } finally {
            setVersionLoading(false);
        }
    };

    const handleApproveTutor = async (tutorId) => {
        const tutorToApprove = data?.pendingTutors?.find(t => t.id === tutorId);
        if (!tutorToApprove) return;

        setData(prev => ({
            ...prev,
            pendingTutors: prev.pendingTutors.filter(t => t.id !== tutorId),
            metrics: {
                ...prev.metrics,
                totalTutors: prev.metrics.totalTutors + 1
            }
        }));

        try {
            const res = await fetch("/api/admin/tutor/approve", {
                method: "POST",
                headers: adminHeaders(),
                body: JSON.stringify({ tutorId, isApproved: true })
            });
            const json = await res.json();
            if (!json.success) {
                fetchMetrics();
                alert("Failed to approve tutor. Please try again.");
            }
        } catch (err) {
            console.error(err);
            fetchMetrics();
        }
    };

    // Show key entry gate if not authenticated
    if (!adminKey) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
                <div className="bg-white border border-gray-200 rounded-2xl p-8 w-full max-w-sm shadow-sm">
                    <div className="mb-6 text-center">
                        <Logo />
                        <p className="text-gray-500 text-sm mt-3">Admin access only. Enter your admin key to continue.</p>
                    </div>
                    <form onSubmit={handleKeySubmit} className="space-y-4">
                        {keyError && (
                            <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-red-700 text-sm">{keyError}</div>
                        )}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Admin key</label>
                            <input
                                type="password"
                                value={keyInput}
                                onChange={(e) => setKeyInput(e.target.value)}
                                required
                                autoFocus
                                placeholder="Enter admin key"
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={keyLoading || !keyInput}
                            className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                        >
                            {keyLoading ? "Verifying..." : "Continue"}
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-gray-50 font-sans text-gray-900 overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 border-r border-gray-200 bg-white flex flex-col hidden lg:flex shadow-sm z-50">
                <div className="p-6 border-b border-gray-100">
                    <Logo />
                </div>

                <div className="p-4 flex-1 overflow-y-auto space-y-6">
                    <div>
                        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">Management</h4>
                        <nav className="space-y-1">
                            {[
                                { id: "overview", icon: LayoutDashboard, label: "Overview" },
                                { id: "users", icon: Users, label: "User Directory" },
                                { id: "listings", icon: GraduationCap, label: "Tutor Approvals" },
                                { id: "vip", icon: Star, label: "VIP Service" },
                                { id: "financials", icon: CreditCard, label: "Transactions" },
                                { id: "stats", icon: BarChart3, label: "Analytics" },
                                { id: "deployments", icon: GitBranch, label: "Deployments" }
                            ].map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id)}
                                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-sm transition-all ${activeTab === item.id ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
                                >
                                    <item.icon size={16} strokeWidth={activeTab === item.id ? 2.5 : 2} className={activeTab === item.id ? 'text-blue-600' : 'text-gray-400'} />
                                    {item.label}
                                </button>
                            ))}
                        </nav>
                    </div>

                    <div>
                        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">Tools</h4>
                        <nav className="space-y-1">
                            {[
                                { icon: Database, label: "Database Tools" },
                                { icon: Settings, label: "Global Settings" }
                            ].map((item, i) => (
                                <button key={i} className="w-full flex items-center gap-3 px-3 py-2.5 text-gray-500 hover:bg-gray-50 hover:text-gray-900 rounded-xl font-semibold text-sm transition-all">
                                    <item.icon size={16} strokeWidth={2} className="text-gray-400" />
                                    {item.label}
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>

                <div className="p-4 border-t border-gray-100">
                    <button
                        onClick={() => { sessionStorage.removeItem("adminKey"); router.push("/"); }}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-red-500 border border-gray-200 hover:bg-red-50 hover:border-red-100 rounded-xl transition-all font-semibold text-sm"
                    >
                        <LogOut size={14} strokeWidth={2} />
                        Log Out
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <main className="flex-1 overflow-y-auto bg-gray-50 min-w-0">
                {/* Sticky topbar — inside main scroll container so it doesn't overlap sidebar */}
                <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-gray-100 px-6 py-3 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-gray-900">Admin Dashboard</span>
                        <span className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 border border-blue-100 rounded-lg">
                            <span className="size-1.5 rounded-full bg-blue-600 animate-pulse"></span>
                            <span className="text-xs font-semibold text-blue-700">Live</span>
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={fetchMetrics} className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-blue-600 transition-colors">
                            <RefreshCcw size={13} /> Refresh
                        </button>
                        <button
                            onClick={() => { localStorage.removeItem("ti_admin_key"); sessionStorage.removeItem("adminKey"); router.push("/admin/login"); }}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-500 bg-red-50 border border-red-100 rounded-lg hover:bg-red-100 transition-colors"
                        >
                            <LogOut size={13} /> Log out
                        </button>
                    </div>
                </div>

                <div className="p-6 pb-20">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-32">
                            <div className="size-10 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
                            <p className="mt-4 font-semibold text-sm text-gray-400">Loading data...</p>
                        </div>
                    ) : (
                        <div className="max-w-7xl mx-auto space-y-6">

                            {/* Overview Tab */}
                            {activeTab === "overview" && (
                                <>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                        {[
                                            { label: 'Total Tutors', value: data?.metrics.totalTutors || 0, icon: GraduationCap, color: 'text-blue-600', bg: 'bg-blue-50' },
                                            { label: 'Students', value: data?.metrics.totalStudents || 0, icon: UserCheck, color: 'text-amber-600', bg: 'bg-amber-50' },
                                            { label: 'Total Revenue', value: `₹${data?.metrics.totalRevenue || 0}`, icon: Wallet, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                                            { label: 'Active Leads', value: data?.metrics.activeLeads || 0, icon: Target, color: 'text-purple-600', bg: 'bg-purple-50' }
                                        ].map((stat, i) => (
                                            <div key={i} className="p-5 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all">
                                                <div className="flex items-center gap-3 mb-4">
                                                    <div className={`p-2.5 rounded-xl ${stat.bg} ${stat.color}`}>
                                                        <stat.icon size={18} strokeWidth={2} />
                                                    </div>
                                                    <p className="text-xs font-semibold text-gray-500">{stat.label}</p>
                                                </div>
                                                <p className="text-3xl font-bold text-gray-900 tracking-tight">{stat.value}</p>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
                                        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                                            <div className="flex items-center justify-between mb-5">
                                                <h3 className="font-bold text-base text-gray-900">Pending Approvals</h3>
                                                <button onClick={() => setActiveTab("listings")} className="text-xs font-semibold text-blue-600 hover:underline">View all</button>
                                            </div>
                                            <div className="space-y-3">
                                                {data?.pendingTutors?.slice(0, 3).map(tutor => (
                                                    <div key={tutor.id} className="p-3 bg-gray-50 rounded-xl flex items-center justify-between border border-gray-100">
                                                        <div className="flex items-center gap-3">
                                                            <div className="size-9 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold text-sm">
                                                                {tutor.name?.[0]}
                                                            </div>
                                                            <div>
                                                                <p className="font-semibold text-sm text-gray-900">{tutor.name}</p>
                                                                <p className="text-xs text-gray-400">{tutor.phone}</p>
                                                            </div>
                                                        </div>
                                                        <button onClick={() => handleApproveTutor(tutor.id)} className="px-3 py-1.5 bg-white text-blue-600 border border-blue-100 rounded-lg text-xs font-semibold hover:bg-blue-600 hover:text-white transition-all">Approve</button>
                                                    </div>
                                                ))}
                                                {(!data?.pendingTutors || data.pendingTutors.length === 0) && (
                                                    <p className="text-center py-6 text-gray-400 text-sm">No pending approvals.</p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                                            <div className="flex items-center justify-between mb-5">
                                                <h3 className="font-bold text-base text-gray-900">Recent Transactions</h3>
                                                <button onClick={() => setActiveTab("financials")} className="text-xs font-semibold text-blue-600 hover:underline">View all</button>
                                            </div>
                                            <div className="space-y-3">
                                                {data?.recentTransactions?.slice(0, 3).map(txn => (
                                                    <div key={txn.id} className="p-3 bg-gray-50 rounded-xl flex items-center justify-between border border-gray-100">
                                                        <div className="flex items-center gap-3">
                                                            <div className="size-9 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center">
                                                                <Wallet size={16} strokeWidth={2} />
                                                            </div>
                                                            <div>
                                                                <p className="font-semibold text-sm text-gray-900">₹{txn.amount}</p>
                                                                <p className="text-xs text-gray-400">{txn.user?.name || "User"}</p>
                                                            </div>
                                                        </div>
                                                        <p className="text-xs text-gray-400">{new Date(txn.createdAt).toLocaleDateString()}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Pending Verification Requests */}
                                        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                                            <div className="flex items-center gap-3 mb-5">
                                                <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                                                    <ShieldCheck size={16} strokeWidth={2} />
                                                </div>
                                                <h3 className="font-bold text-base text-gray-900">Verification Requests</h3>
                                                {pendingVerifications.length > 0 && (
                                                    <span className="ml-auto px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">{pendingVerifications.length}</span>
                                                )}
                                            </div>
                                            <div className="space-y-3">
                                                {pendingVerifications.slice(0, 5).map(v => (
                                                    <div key={v.id} className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <div className="size-9 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold text-sm shrink-0">
                                                                {v.tutor?.name?.[0] || "?"}
                                                            </div>
                                                            <div className="min-w-0 flex-1">
                                                                <p className="font-semibold text-sm text-gray-900 truncate">{v.tutor?.name || "—"}</p>
                                                                <p className="text-xs text-gray-400 truncate">{v.tutor?.phone || v.tutor?.email || "—"}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => handleVerificationReview(v.id, "APPROVE")}
                                                                disabled={verificationActionLoading === v.id + "APPROVE"}
                                                                className="flex-1 px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50"
                                                            >
                                                                {verificationActionLoading === v.id + "APPROVE" ? "..." : "Approve"}
                                                            </button>
                                                            <button
                                                                onClick={() => handleVerificationReview(v.id, "REJECT")}
                                                                disabled={verificationActionLoading === v.id + "REJECT"}
                                                                className="flex-1 px-3 py-1.5 bg-white text-red-500 border border-red-200 rounded-lg text-xs font-semibold hover:bg-red-50 transition-colors disabled:opacity-50"
                                                            >
                                                                {verificationActionLoading === v.id + "REJECT" ? "..." : "Reject"}
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                                {pendingVerifications.length === 0 && (
                                                    <p className="text-center py-6 text-gray-400 text-sm">No pending verification requests.</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* ─── USERS ────────────────────────────────────────────────────────── */}
                            {activeTab === "users" && (
                                <div className="space-y-4">
                                    {/* Header row */}
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-bold text-lg text-gray-900">User Directory</h3>
                                            <p className="text-xs text-gray-400 mt-0.5">{userTotal} total users</p>
                                        </div>
                                    </div>

                                    {/* Filters */}
                                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 flex flex-wrap gap-3 items-center">
                                        {/* Search */}
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={14} />
                                            <input
                                                placeholder="Search name, phone, email..."
                                                value={userSearch}
                                                onChange={e => {
                                                    setUserSearch(e.target.value);
                                                    setUserPage(1);
                                                    fetchUsers({ search: e.target.value, page: 1 });
                                                }}
                                                className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-100 outline-none w-56"
                                            />
                                        </div>

                                        {/* Role filter */}
                                        <div className="flex gap-1.5 flex-wrap">
                                            {["ALL", "STUDENT", "TUTOR", "INSTITUTE"].map(r => (
                                                <button key={r}
                                                    onClick={() => { setUserRoleFilter(r); setUserPage(1); fetchUsers({ role: r, page: 1 }); }}
                                                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${userRoleFilter === r ? "bg-blue-600 text-white" : "bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100"}`}
                                                >
                                                    {r === "ALL" ? "All roles" : r.charAt(0) + r.slice(1).toLowerCase()}
                                                </button>
                                            ))}
                                        </div>

                                        {/* Status filter */}
                                        <div className="flex gap-1.5 flex-wrap">
                                            {["ALL", "ACTIVE", "PENDING", "SUSPENDED"].map(s => (
                                                <button key={s}
                                                    onClick={() => { setUserStatusFilter(s); setUserPage(1); fetchUsers({ status: s, page: 1 }); }}
                                                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${userStatusFilter === s ? "bg-gray-800 text-white" : "bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100"}`}
                                                >
                                                    {s === "ALL" ? "All status" : s.charAt(0) + s.slice(1).toLowerCase()}
                                                </button>
                                            ))}
                                        </div>

                                        {/* Sort */}
                                        <select
                                            value={userSort}
                                            onChange={e => { setUserSort(e.target.value); setUserPage(1); fetchUsers({ sort: e.target.value, page: 1 }); }}
                                            className="ml-auto px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-600 focus:ring-2 focus:ring-blue-100 outline-none"
                                        >
                                            <option value="createdAt_desc">Newest first</option>
                                            <option value="createdAt_asc">Oldest first</option>
                                            <option value="name_asc">Name A–Z</option>
                                            <option value="credits_desc">Most credits</option>
                                            <option value="tier">Subscription tier</option>
                                        </select>
                                    </div>

                                    {/* Table */}
                                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                                        {usersLoading ? (
                                            <div className="flex items-center justify-center py-16">
                                                <div className="size-8 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
                                            </div>
                                        ) : (
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-left">
                                                    <thead>
                                                        <tr className="border-b border-gray-100 bg-gray-50">
                                                            <th className="pb-3 pt-3 px-4 text-xs font-semibold text-gray-500">User</th>
                                                            <th className="pb-3 pt-3 px-4 text-xs font-semibold text-gray-500">Role</th>
                                                            <th className="pb-3 pt-3 px-4 text-xs font-semibold text-gray-500">Plan</th>
                                                            <th className="pb-3 pt-3 px-4 text-xs font-semibold text-gray-500">Credits</th>
                                                            <th className="pb-3 pt-3 px-4 text-xs font-semibold text-gray-500">Status</th>
                                                            <th className="pb-3 pt-3 px-4 text-xs font-semibold text-gray-500">Joined</th>
                                                            <th className="pb-3 pt-3 px-4 text-xs font-semibold text-gray-500">Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-gray-50">
                                                        {users.map(u => (
                                                            <tr key={u.id} className="hover:bg-blue-50/30 transition-colors group">
                                                                <td className="py-3 px-4">
                                                                    <button
                                                                        onClick={() => openUserDrawer(u.id)}
                                                                        className="flex items-center gap-3 text-left"
                                                                    >
                                                                        <div className={`size-9 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${u.role === "TUTOR" ? "bg-blue-100 text-blue-600" : u.role === "INSTITUTE" ? "bg-purple-100 text-purple-600" : "bg-amber-100 text-amber-600"}`}>
                                                                            {u.name?.[0]?.toUpperCase() || "?"}
                                                                        </div>
                                                                        <div>
                                                                            <p className="font-semibold text-sm text-gray-900 group-hover:text-blue-600 transition-colors">{u.name || "—"}</p>
                                                                            <p className="text-xs text-gray-400">{u.phone || u.email || "No contact"}</p>
                                                                        </div>
                                                                    </button>
                                                                </td>
                                                                <td className="py-3 px-4">
                                                                    <span className={`px-2 py-0.5 rounded-lg text-xs font-semibold ${u.role === "TUTOR" ? "bg-blue-50 text-blue-600" : u.role === "INSTITUTE" ? "bg-purple-50 text-purple-600" : "bg-amber-50 text-amber-600"}`}>
                                                                        {u.role.charAt(0) + u.role.slice(1).toLowerCase()}
                                                                    </span>
                                                                </td>
                                                                <td className="py-3 px-4">
                                                                    <span className={`px-2 py-0.5 rounded-lg text-xs font-semibold ${u.subscriptionTier === "ELITE" ? "bg-amber-50 text-amber-600" : u.subscriptionTier === "PRO" ? "bg-blue-50 text-blue-600" : "bg-gray-50 text-gray-500"}`}>
                                                                        {u.subscriptionTier}
                                                                    </span>
                                                                </td>
                                                                <td className="py-3 px-4 text-sm font-semibold text-gray-700">{u.credits}</td>
                                                                <td className="py-3 px-4">
                                                                    {u.isSuspended ? (
                                                                        <span className="px-2 py-0.5 bg-red-50 text-red-500 rounded-lg text-xs font-semibold border border-red-100">Suspended</span>
                                                                    ) : u.isVerified ? (
                                                                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-lg text-xs font-semibold border border-emerald-100">Active</span>
                                                                    ) : (
                                                                        <span className="px-2 py-0.5 bg-gray-50 text-gray-400 rounded-lg text-xs font-semibold border border-gray-200">Pending</span>
                                                                    )}
                                                                </td>
                                                                <td className="py-3 px-4 text-xs text-gray-400">
                                                                    {new Date(u.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                                                                </td>
                                                                <td className="py-3 px-4">
                                                                    <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                        <button
                                                                            onClick={() => openUserDrawer(u.id)}
                                                                            className="px-2.5 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-semibold hover:bg-blue-100 transition-colors flex items-center gap-1"
                                                                        >
                                                                            <Eye size={11} /> View
                                                                        </button>
                                                                        <button
                                                                            onClick={() => handleSuspend(u.id, !u.isSuspended)}
                                                                            disabled={userActionLoading === u.id + "-suspend"}
                                                                            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${u.isSuspended ? "bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100" : "bg-red-50 text-red-500 border-red-100 hover:bg-red-100"}`}
                                                                        >
                                                                            {userActionLoading === u.id + "-suspend" ? "..." : u.isSuspended ? "Reinstate" : "Suspend"}
                                                                        </button>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                        {users.length === 0 && (
                                                            <tr><td colSpan={7} className="py-12 text-center text-gray-400 text-sm">No users found.</td></tr>
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}

                                        {/* Pagination */}
                                        {userPages > 1 && (
                                            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
                                                <span className="text-xs text-gray-400">Page {userPage} of {userPages} — {userTotal} users</span>
                                                <div className="flex gap-2">
                                                    <button
                                                        disabled={userPage <= 1}
                                                        onClick={() => { const p = userPage - 1; setUserPage(p); fetchUsers({ page: p }); }}
                                                        className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-gray-50 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                                                    >
                                                        <ChevronLeft size={12} /> Prev
                                                    </button>
                                                    <button
                                                        disabled={userPage >= userPages}
                                                        onClick={() => { const p = userPage + 1; setUserPage(p); fetchUsers({ page: p }); }}
                                                        className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-gray-50 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                                                    >
                                                        Next <ChevronRight size={12} />
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Listings / Approvals Tab */}
                            {activeTab === "listings" && (
                                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                                    <h3 className="font-bold text-lg text-gray-900 mb-6">Tutor Approvals</h3>
                                    <div className="space-y-3">
                                        {data?.pendingTutors?.map(tutor => (
                                            <div key={tutor.id} className="p-5 bg-gray-50 border border-gray-200 rounded-2xl flex items-center justify-between hover:border-blue-200 transition-all">
                                                <div className="flex items-center gap-4">
                                                    <div className="size-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center font-bold text-lg">
                                                        {tutor.name?.[0]}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-base text-gray-900">{tutor.name}</p>
                                                        <div className="flex gap-4 mt-1">
                                                            <span className="flex items-center gap-1.5 text-xs text-gray-400"><Phone size={11} className="text-gray-300" /> {tutor.phone}</span>
                                                            <span className="flex items-center gap-1.5 text-xs text-gray-400"><Mail size={11} className="text-gray-300" /> {tutor.email}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleApproveTutor(tutor.id)}
                                                        className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 shadow-sm transition-all flex items-center gap-1.5"
                                                    >
                                                        <CheckCircle2 size={14} /> Approve
                                                    </button>
                                                    <button
                                                        onClick={async () => {
                                                            if (!confirm(`Reject ${tutor.name}?`)) return;
                                                            setData(prev => ({ ...prev, pendingTutors: prev.pendingTutors.filter(t => t.id !== tutor.id) }));
                                                            await fetch("/api/admin/tutor/approve", { method: "POST", headers: adminHeaders(), body: JSON.stringify({ tutorId: tutor.id, isApproved: false }) });
                                                        }}
                                                        className="px-4 py-2 bg-white text-red-500 border border-red-100 text-sm font-semibold rounded-xl hover:bg-red-50 transition-all flex items-center gap-1.5"
                                                    >
                                                        <XCircle size={14} /> Reject
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                        {(!data?.pendingTutors || data.pendingTutors.length === 0) && (
                                            <div className="text-center py-12 text-gray-400 text-sm">No tutors pending approval.</div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Financials Tab */}
                            {activeTab === "financials" && (
                                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                                    <h3 className="font-bold text-lg text-gray-900 mb-6">Transactions</h3>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left">
                                            <thead>
                                                <tr className="border-b border-gray-200 bg-gray-50">
                                                    <th className="pb-3 pt-2 text-xs font-semibold text-gray-500 uppercase tracking-wider pr-4 rounded-tl-xl">Transaction</th>
                                                    <th className="pb-3 pt-2 text-xs font-semibold text-gray-500 uppercase tracking-wider px-4">User</th>
                                                    <th className="pb-3 pt-2 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right pl-4 rounded-tr-xl">Amount</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {data?.recentTransactions?.map(txn => (
                                                    <tr key={txn.id} className="hover:bg-gray-50 transition-colors">
                                                        <td className="py-5 pr-4">
                                                            <p className="font-semibold text-sm text-gray-900">Credit Purchase</p>
                                                            <p className="text-xs text-gray-400 mt-0.5">{new Date(txn.createdAt).toLocaleString()}</p>
                                                        </td>
                                                        <td className="py-5 px-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="size-8 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-xs font-bold">{txn.user?.name?.[0]}</div>
                                                                <div>
                                                                    <p className="font-semibold text-sm text-gray-700">{txn.user?.name}</p>
                                                                    <p className="text-xs text-gray-400 capitalize">{txn.user?.role?.toLowerCase()}</p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="py-5 pl-4 text-right">
                                                            <p className="text-lg font-bold text-emerald-600">₹{txn.amount}</p>
                                                            <span className="text-xs font-semibold text-emerald-500">Paid</span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === "vip" && <VipAdminPanel adminKey={adminKey} />}

                    {/* ─── DEPLOYMENTS TAB ─── */}
                    {activeTab === "deployments" && (
                        <div className="max-w-5xl mx-auto space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">Deployments & Backups</h2>
                                    <p className="text-sm text-gray-400 mt-0.5">Track what's live, review history, and manage database backups.</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <a href="https://github.com/tuitionsinindia/tuitionsinindiawebsite/actions" target="_blank" rel="noopener noreferrer"
                                        className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-gray-600 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:text-blue-600 transition-colors">
                                        <ExternalLink size={13} /> GitHub Actions
                                    </a>
                                    <button onClick={fetchVersionData} className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-100 rounded-lg hover:bg-blue-100 transition-colors">
                                        <RefreshCcw size={13} /> Refresh
                                    </button>
                                </div>
                            </div>

                            {versionLoading ? (
                                <div className="flex items-center justify-center py-24">
                                    <div className="size-8 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
                                </div>
                            ) : (
                                <>
                                    {/* ── Live Environments ── */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {[
                                            { label: "Production", env: "production", domain: "tuitionsinindia.com", branch: "main", data: versionData?.production?.current, color: "emerald" },
                                            { label: "Staging", env: "staging", domain: "tuitionsinindia.in", branch: "staging", data: versionData?.staging?.current, color: "blue" },
                                        ].map(({ label, env, domain, branch, data: v, color }) => (
                                            <div key={env} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                                                <div className="flex items-center justify-between mb-4">
                                                    <div className="flex items-center gap-2">
                                                        <Server size={15} className={`text-${color}-600`} />
                                                        <span className="font-bold text-sm text-gray-900">{label}</span>
                                                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full bg-${color}-50 text-${color}-700 border border-${color}-100`}>
                                                            {branch}
                                                        </span>
                                                    </div>
                                                    <a href={`https://${domain}`} target="_blank" rel="noopener noreferrer"
                                                        className="text-xs text-gray-400 hover:text-blue-600 flex items-center gap-1 transition-colors">
                                                        {domain} <ExternalLink size={11} />
                                                    </a>
                                                </div>
                                                {v ? (
                                                    <div className="space-y-2.5">
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-mono text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-lg">{v.shortSha || v.sha?.slice(0,7)}</span>
                                                            <span className="text-sm text-gray-700 font-medium truncate">{v.message}</span>
                                                        </div>
                                                        <div className="flex items-center gap-3 text-xs text-gray-400">
                                                            <span className="flex items-center gap-1"><Clock size={11} /> {new Date(v.deployedAt).toLocaleString("en-IN", { day:"numeric", month:"short", hour:"2-digit", minute:"2-digit" })}</span>
                                                            <span>by {v.author}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1.5 mt-1">
                                                            <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                            <span className="text-xs text-emerald-600 font-semibold">Live</span>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-2 text-sm text-gray-400 py-3">
                                                        <AlertTriangle size={14} className="text-amber-400" />
                                                        No version info yet — deploy once to populate.
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    {/* ── How to deploy ── */}
                                    <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
                                        <h3 className="font-bold text-sm text-blue-900 mb-3 flex items-center gap-2">
                                            <ArrowUpCircle size={15} className="text-blue-600" /> Deployment Procedure
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                                            {[
                                                {
                                                    step: "1",
                                                    title: "Push to staging branch",
                                                    desc: "All changes go to the staging branch first. GitHub Actions auto-deploys to tuitionsinindia.in within ~2 minutes.",
                                                    code: "git checkout staging\ngit merge main\ngit push origin staging"
                                                },
                                                {
                                                    step: "2",
                                                    title: "Test on staging",
                                                    desc: "Verify every change on tuitionsinindia.in — check all flows, payments, auth. Only proceed when everything looks good.",
                                                    code: "https://tuitionsinindia.in"
                                                },
                                                {
                                                    step: "3",
                                                    title: "Promote to production",
                                                    desc: "Merge staging → main. GitHub Actions requires manual approval before deploying to production.",
                                                    code: "git checkout main\ngit merge staging\ngit push origin main"
                                                }
                                            ].map(({ step, title, desc, code }) => (
                                                <div key={step} className="bg-white rounded-xl p-4 border border-blue-100">
                                                    <div className="size-6 bg-blue-600 text-white rounded-lg flex items-center justify-center text-xs font-bold mb-2">{step}</div>
                                                    <p className="font-semibold text-gray-800 mb-1">{title}</p>
                                                    <p className="text-gray-500 mb-2 leading-relaxed">{desc}</p>
                                                    <pre className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs font-mono text-gray-600 whitespace-pre-wrap">{code}</pre>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* ── Deployment History ── */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        {[
                                            { label: "Production history", history: versionData?.production?.history },
                                            { label: "Staging history", history: versionData?.staging?.history }
                                        ].map(({ label, history }) => (
                                            <div key={label} className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                                                <div className="px-5 py-4 border-b border-gray-100">
                                                    <h3 className="font-bold text-sm text-gray-900">{label}</h3>
                                                </div>
                                                <div className="divide-y divide-gray-50">
                                                    {history && history.length > 0 ? history.map((entry, i) => (
                                                        <div key={i} className="px-5 py-3 flex items-start gap-3 hover:bg-gray-50 transition-colors">
                                                            <div className={`mt-0.5 size-2 rounded-full shrink-0 ${entry.status === "success" ? "bg-emerald-500" : "bg-red-400"}`} />
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-center gap-2 mb-0.5">
                                                                    <span className="font-mono text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">{entry.sha}</span>
                                                                    <span className="text-xs text-gray-500 truncate">{entry.message}</span>
                                                                </div>
                                                                <p className="text-xs text-gray-400">{entry.author} · {new Date(entry.deployedAt).toLocaleString("en-IN", { day:"numeric", month:"short", hour:"2-digit", minute:"2-digit" })}</p>
                                                            </div>
                                                        </div>
                                                    )) : (
                                                        <div className="px-5 py-8 text-center text-xs text-gray-400">
                                                            No deployment history yet. Run a deploy to start tracking.
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* ── Database Backups ── */}
                                    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                                        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <HardDrive size={15} className="text-gray-500" />
                                                <h3 className="font-bold text-sm text-gray-900">Database Backups</h3>
                                            </div>
                                            {versionData?.backups?.lastRun && (
                                                <span className="text-xs text-gray-400 flex items-center gap-1">
                                                    <Clock size={11} /> Last: {new Date(versionData.backups.lastRun).toLocaleString("en-IN", { day:"numeric", month:"short", hour:"2-digit", minute:"2-digit" })}
                                                </span>
                                            )}
                                        </div>
                                        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
                                            {[
                                                { label: "Production backups", files: versionData?.backups?.production },
                                                { label: "Staging backups", files: versionData?.backups?.staging }
                                            ].map(({ label, files }) => (
                                                <div key={label}>
                                                    <p className="text-xs font-semibold text-gray-600 mb-2">{label}</p>
                                                    <div className="space-y-1.5">
                                                        {files && files.length > 0 ? files.map((f, i) => (
                                                            <div key={i} className="flex items-center justify-between text-xs py-1.5 px-3 bg-gray-50 rounded-lg border border-gray-100">
                                                                <span className="font-mono text-gray-600 truncate">{f.name}</span>
                                                                <span className="text-gray-400 ml-2 shrink-0">{(f.size / 1024).toFixed(1)}KB</span>
                                                            </div>
                                                        )) : (
                                                            <p className="text-xs text-gray-400 py-2">No backups yet. First backup runs at 2 AM.</p>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="px-5 py-3 bg-gray-50 border-t border-gray-100">
                                            <p className="text-xs text-gray-400">
                                                Backups run daily at 2 AM IST. Last 14 days are retained on the VPS at <code className="font-mono">/root/db-backups/</code>
                                            </p>
                                        </div>
                                    </div>

                                    {/* ── Rollback Instructions ── */}
                                    <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5">
                                        <h3 className="font-bold text-sm text-amber-900 mb-3 flex items-center gap-2">
                                            <RotateCcw size={15} className="text-amber-600" /> Emergency Rollback
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                                            <div>
                                                <p className="font-semibold text-amber-800 mb-2">Roll back the app (code only):</p>
                                                <pre className="bg-white border border-amber-200 rounded-lg px-3 py-2 font-mono text-gray-600 whitespace-pre-wrap leading-relaxed">{`# SSH into VPS
ssh root@187.77.188.36
cd /root/tuitionsinindia

# Find previous commit
git log --oneline -10

# Roll back to that commit
git checkout <commit-sha>
docker compose build --no-cache
docker compose up -d`}</pre>
                                            </div>
                                            <div>
                                                <p className="font-semibold text-amber-800 mb-2">Restore database from backup:</p>
                                                <pre className="bg-white border border-amber-200 rounded-lg px-3 py-2 font-mono text-gray-600 whitespace-pre-wrap leading-relaxed">{`# List backups
ls /root/db-backups/production/

# Restore a backup
gunzip < /root/db-backups/production/prod_DATE.sql.gz \\
  | docker exec -i tuitionsinindia-db \\
    psql -U tuitions_admin tuitionsinindia`}</pre>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </main>

            {/* ─── USER DETAIL DRAWER ─────────────────────────────────────────────── */}
            {userDrawerOpen && (
                <div className="fixed inset-0 z-[80] flex">
                    {/* Backdrop */}
                    <div className="flex-1 bg-black/30 backdrop-blur-sm" onClick={() => { setUserDrawerOpen(false); setUserEditMode(false); }} />
                    {/* Drawer */}
                    <div className="w-full max-w-md bg-white h-full overflow-y-auto shadow-2xl flex flex-col">
                        {/* Drawer header */}
                        <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-5 py-4 flex items-center justify-between">
                            <h3 className="font-bold text-base text-gray-900">User Profile</h3>
                            <button onClick={() => { setUserDrawerOpen(false); setUserEditMode(false); }} className="size-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 transition-colors">
                                <XCircle size={16} />
                            </button>
                        </div>

                        {userDrawerLoading ? (
                            <div className="flex-1 flex items-center justify-center">
                                <div className="size-8 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
                            </div>
                        ) : selectedUser ? (
                            <div className="flex-1 p-5 space-y-5">
                                {/* Avatar + name + role */}
                                <div className="flex items-start gap-4">
                                    <div className={`size-14 rounded-2xl flex items-center justify-center font-bold text-xl shrink-0 ${selectedUser.role === "TUTOR" ? "bg-blue-100 text-blue-600" : selectedUser.role === "INSTITUTE" ? "bg-purple-100 text-purple-600" : "bg-amber-100 text-amber-600"}`}>
                                        {selectedUser.name?.[0]?.toUpperCase() || "?"}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-lg text-gray-900 truncate">{selectedUser.name || "No name"}</p>
                                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                                            <span className={`px-2 py-0.5 rounded-lg text-xs font-semibold ${selectedUser.role === "TUTOR" ? "bg-blue-50 text-blue-600" : selectedUser.role === "INSTITUTE" ? "bg-purple-50 text-purple-600" : "bg-amber-50 text-amber-600"}`}>
                                                {selectedUser.role.charAt(0) + selectedUser.role.slice(1).toLowerCase()}
                                            </span>
                                            <span className={`px-2 py-0.5 rounded-lg text-xs font-semibold ${selectedUser.subscriptionTier === "ELITE" ? "bg-amber-50 text-amber-600" : selectedUser.subscriptionTier === "PRO" ? "bg-blue-50 text-blue-600" : "bg-gray-50 text-gray-500"}`}>
                                                {selectedUser.subscriptionTier}
                                            </span>
                                            {selectedUser.isVerified && <span className="px-2 py-0.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-600">Verified</span>}
                                            {selectedUser.isSuspended && <span className="px-2 py-0.5 rounded-lg text-xs font-semibold bg-red-50 text-red-500">Suspended</span>}
                                        </div>
                                        <p className="text-xs text-gray-400 mt-1">ID: {selectedUser.id}</p>
                                    </div>
                                </div>

                                {/* Contact info */}
                                <div className="bg-gray-50 rounded-xl p-4 space-y-2.5">
                                    <p className="text-xs font-bold text-gray-500 mb-1">Contact</p>
                                    <div className="flex items-center gap-2 text-sm">
                                        <Phone size={13} className="text-gray-400 shrink-0" />
                                        <span className="text-gray-700 font-medium">{selectedUser.phone || "—"}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <Mail size={13} className="text-gray-400 shrink-0" />
                                        <span className="text-gray-700 font-medium truncate">{selectedUser.email || "—"}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <Calendar size={13} className="text-gray-400 shrink-0" />
                                        <span className="text-gray-700 font-medium">Joined {new Date(selectedUser.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <ShieldCheck size={13} className="text-gray-400 shrink-0" />
                                        <span className="text-gray-700 font-medium">Sign-in via {selectedUser.provider || "phone"}</span>
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="grid grid-cols-3 gap-3">
                                    {[
                                        { label: "Credits", value: selectedUser.credits },
                                        { label: "Transactions", value: selectedUser._count?.transactions || 0 },
                                        { label: selectedUser.role === "STUDENT" ? "Leads posted" : "Reviews", value: selectedUser.role === "STUDENT" ? (selectedUser._count?.leadsPosted || 0) : (selectedUser._count?.reviewsReceived || 0) },
                                    ].map((s, i) => (
                                        <div key={i} className="bg-gray-50 rounded-xl p-3 text-center border border-gray-100">
                                            <p className="text-xl font-bold text-gray-900">{s.value}</p>
                                            <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* Tutor listing summary */}
                                {selectedUser.role === "TUTOR" && selectedUser.tutorListing && (
                                    <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                                        <p className="text-xs font-bold text-blue-700 mb-2">Tutor listing</p>
                                        <div className="space-y-1.5 text-sm">
                                            <p className="text-gray-700"><span className="font-semibold">Location:</span> {selectedUser.tutorListing.location || "—"}</p>
                                            <p className="text-gray-700"><span className="font-semibold">Rate:</span> ₹{selectedUser.tutorListing.hourlyRate || "—"}/hr</p>
                                            <p className="text-gray-700"><span className="font-semibold">Subjects:</span> {Array.isArray(selectedUser.tutorListing.subjects) ? selectedUser.tutorListing.subjects.join(", ") : "—"}</p>
                                            <p className="text-gray-700"><span className="font-semibold">Rating:</span> {selectedUser.tutorListing.rating ? `${selectedUser.tutorListing.rating} ★ (${selectedUser.tutorListing.reviewCount} reviews)` : "No reviews"}</p>
                                            <p className="text-gray-700"><span className="font-semibold">Approved:</span> {selectedUser.tutorListing.isApproved ? "Yes" : "No"}</p>
                                        </div>
                                    </div>
                                )}

                                {/* Verification request */}
                                {selectedUser.verificationRequest && (
                                    <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                                        <p className="text-xs font-bold text-amber-700 mb-1">Verification request</p>
                                        <p className="text-sm text-gray-700">Status: <span className="font-semibold">{selectedUser.verificationRequest.status}</span></p>
                                        {selectedUser.verificationRequest.submittedAt && (
                                            <p className="text-xs text-gray-400 mt-0.5">Submitted {new Date(selectedUser.verificationRequest.submittedAt).toLocaleDateString("en-IN")}</p>
                                        )}
                                    </div>
                                )}

                                {/* Recent transactions */}
                                {selectedUser.transactions?.length > 0 && (
                                    <div>
                                        <p className="text-xs font-bold text-gray-500 mb-2">Recent transactions</p>
                                        <div className="space-y-2">
                                            {selectedUser.transactions.map(txn => (
                                                <div key={txn.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                                                    <div>
                                                        <p className="text-xs font-semibold text-gray-700">{txn.type || "Transaction"}</p>
                                                        <p className="text-xs text-gray-400">{new Date(txn.createdAt).toLocaleDateString("en-IN")}</p>
                                                    </div>
                                                    <span className="text-sm font-bold text-emerald-600">₹{txn.amount}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Edit form */}
                                {userEditMode && (
                                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 space-y-3">
                                        <p className="text-xs font-bold text-blue-700">Edit user details</p>
                                        <div>
                                            <label className="text-xs font-semibold text-gray-600 block mb-1">Name</label>
                                            <input
                                                value={userEditData.name ?? selectedUser.name ?? ""}
                                                onChange={e => setUserEditData(prev => ({ ...prev, name: e.target.value }))}
                                                className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-200 outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold text-gray-600 block mb-1">Email</label>
                                            <input
                                                value={userEditData.email ?? selectedUser.email ?? ""}
                                                onChange={e => setUserEditData(prev => ({ ...prev, email: e.target.value }))}
                                                className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-200 outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold text-gray-600 block mb-1">Credits</label>
                                            <input
                                                type="number"
                                                value={userEditData.credits ?? selectedUser.credits ?? 0}
                                                onChange={e => setUserEditData(prev => ({ ...prev, credits: parseInt(e.target.value) || 0 }))}
                                                className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-200 outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold text-gray-600 block mb-1">Subscription tier</label>
                                            <select
                                                value={userEditData.subscriptionTier ?? selectedUser.subscriptionTier}
                                                onChange={e => setUserEditData(prev => ({ ...prev, subscriptionTier: e.target.value }))}
                                                className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-200 outline-none"
                                            >
                                                <option value="FREE">Free</option>
                                                <option value="PRO">Pro</option>
                                                <option value="ELITE">Elite</option>
                                            </select>
                                        </div>
                                        <div className="flex gap-2">
                                            <label className="flex items-center gap-2 text-xs font-semibold text-gray-600 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={userEditData.isVerified ?? selectedUser.isVerified}
                                                    onChange={e => setUserEditData(prev => ({ ...prev, isVerified: e.target.checked }))}
                                                    className="rounded"
                                                />
                                                Mark as verified
                                            </label>
                                        </div>
                                        <div className="flex gap-2 pt-1">
                                            <button
                                                onClick={handleEditUserSave}
                                                disabled={userEditSaving}
                                                className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                                            >
                                                {userEditSaving ? "Saving..." : "Save changes"}
                                            </button>
                                            <button
                                                onClick={() => { setUserEditMode(false); setUserEditData({}); }}
                                                className="px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg text-xs font-semibold hover:bg-gray-50 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Action buttons */}
                                <div className="grid grid-cols-2 gap-2 pt-2">
                                    {!userEditMode && (
                                        <button
                                            onClick={() => { setUserEditMode(true); setUserEditData({}); }}
                                            className="flex items-center justify-center gap-1.5 py-2.5 bg-blue-50 text-blue-600 rounded-xl text-xs font-semibold hover:bg-blue-100 transition-colors border border-blue-100"
                                        >
                                            <Edit2 size={13} /> Edit details
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleSuspend(selectedUser.id, !selectedUser.isSuspended)}
                                        disabled={userActionLoading === selectedUser.id + "-suspend"}
                                        className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold transition-colors border ${selectedUser.isSuspended ? "bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100" : "bg-amber-50 text-amber-600 border-amber-100 hover:bg-amber-100"}`}
                                    >
                                        {userActionLoading === selectedUser.id + "-suspend" ? "..." : selectedUser.isSuspended ? "Reinstate account" : "Suspend account"}
                                    </button>
                                    <button
                                        onClick={() => handleDeleteUser(selectedUser.id)}
                                        className="col-span-2 flex items-center justify-center gap-1.5 py-2.5 bg-red-50 text-red-500 rounded-xl text-xs font-semibold hover:bg-red-100 transition-colors border border-red-100"
                                    >
                                        <Trash2 size={13} /> Delete user permanently
                                    </button>
                                </div>
                            </div>
                        ) : null}
                    </div>
                </div>
            )}
        </div>
    );
}

export default function AdminDashboard() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen bg-gray-50 font-sans">
                <div className="flex flex-col items-center gap-4 text-gray-400">
                    <div className="size-10 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
                    <p className="text-sm font-semibold">Loading admin dashboard...</p>
                </div>
            </div>
        }>
            <AdminDashboardContent />
        </Suspense>
    );
}
