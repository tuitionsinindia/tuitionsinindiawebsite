"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import DashboardHeader from "@/app/components/DashboardHeader";
import Logo from "@/app/components/Logo";
import {
    LayoutDashboard,
    Users,
    CreditCard,
    ShieldCheck,
    LogOut,
    GraduationCap,
    UserCheck,
    Database,
    TrendingUp,
    Search,
    Settings,
    CheckCircle2,
    BarChart3,
    Target,
    BadgeCheck,
    Wallet,
    Phone,
    Mail,
    Loader2,
    ChevronLeft,
    ChevronRight
} from "lucide-react";

function AdminDashboardContent() {
    const router = useRouter();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("overview");

    // Users tab state
    const [users, setUsers] = useState([]);
    const [usersTotal, setUsersTotal] = useState(0);
    const [usersPage, setUsersPage] = useState(1);
    const [usersPages, setUsersPages] = useState(1);
    const [usersSearch, setUsersSearch] = useState("");
    const [usersRole, setUsersRole] = useState("");
    const [usersLoading, setUsersLoading] = useState(false);

    useEffect(() => {
        fetchMetrics();
    }, []);

    useEffect(() => {
        if (activeTab === "users") {
            fetchUsers();
        }
    }, [activeTab, usersPage, usersRole]);

    const fetchMetrics = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/metrics");
            const json = await res.json();
            if (json.success) setData(json);
        } catch (err) {
            console.error("Failed to load metrics", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchUsers = async (searchOverride) => {
        setUsersLoading(true);
        const q = searchOverride !== undefined ? searchOverride : usersSearch;
        try {
            const params = new URLSearchParams({ page: usersPage, ...(q && { search: q }), ...(usersRole && { role: usersRole }) });
            const res = await fetch(`/api/admin/users?${params}`);
            const json = await res.json();
            if (json.success) {
                setUsers(json.users);
                setUsersTotal(json.total);
                setUsersPages(json.pages);
            }
        } catch (err) {
            console.error("Failed to load users", err);
        } finally {
            setUsersLoading(false);
        }
    };

    const handleUserSearch = (e) => {
        e.preventDefault();
        setUsersPage(1);
        fetchUsers(usersSearch);
    };

    const handleApproveTutor = async (tutorId) => {
        setData(prev => ({
            ...prev,
            pendingTutors: prev.pendingTutors.filter(t => t.id !== tutorId),
            metrics: { ...prev.metrics, totalTutors: prev.metrics.totalTutors + 1 }
        }));
        try {
            const res = await fetch("/api/admin/tutor/approve", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ tutorId, isApproved: true })
            });
            const json = await res.json();
            if (!json.success) fetchMetrics();
        } catch (err) {
            console.error(err);
            fetchMetrics();
        }
    };

    const roleColors = {
        TUTOR: "bg-blue-50 text-blue-700",
        STUDENT: "bg-amber-50 text-amber-700",
        INSTITUTE: "bg-purple-50 text-purple-700",
        ADMIN: "bg-red-50 text-red-700"
    };

    return (
        <div className="flex h-screen bg-gray-50 font-sans text-gray-900 overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 border-r border-gray-200 bg-white flex flex-col hidden lg:flex shadow-sm z-50">
                <div className="p-6 border-b border-gray-100">
                    <Logo />
                </div>

                <div className="p-4 flex-1 overflow-y-auto space-y-6">
                    <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-3">Management</p>
                        <nav className="space-y-0.5">
                            {[
                                { id: "overview", icon: LayoutDashboard, label: "Overview" },
                                { id: "users", icon: Users, label: "Users" },
                                { id: "listings", icon: GraduationCap, label: "Tutor Approvals" },
                                { id: "financials", icon: CreditCard, label: "Transactions" }
                            ].map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id)}
                                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === item.id ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}
                                >
                                    <item.icon size={16} className={activeTab === item.id ? "text-blue-600" : "text-gray-400"} />
                                    {item.label}
                                </button>
                            ))}
                        </nav>
                    </div>

                    <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-3">Settings</p>
                        <nav className="space-y-0.5">
                            {[
                                { icon: Database, label: "Database" },
                                { icon: Settings, label: "Configuration" }
                            ].map((item, i) => (
                                <button key={i} className="w-full flex items-center gap-3 px-3 py-2.5 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg text-sm font-medium transition-colors">
                                    <item.icon size={16} className="text-gray-400" />
                                    {item.label}
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>

                <div className="p-4 border-t border-gray-100">
                    <button
                        onClick={() => router.push("/")}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-red-500 border border-gray-200 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium"
                    >
                        <LogOut size={14} />
                        Log Out
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <main className="flex-1 overflow-y-auto bg-gray-50">
                <DashboardHeader
                    user={{ name: "Administrator" }}
                    role="ADMIN"
                    onSync={fetchMetrics}
                    onLogout={() => router.push("/")}
                />

                <div className="p-6 pb-20">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-40">
                            <Loader2 size={32} className="animate-spin text-blue-500" />
                            <p className="mt-4 text-sm text-gray-400">Loading...</p>
                        </div>
                    ) : (
                        <div className="max-w-7xl mx-auto space-y-6">

                            {/* Overview Tab */}
                            {activeTab === "overview" && (
                                <>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                        {[
                                            { label: "Total Tutors", value: data?.metrics?.totalTutors || 0, icon: GraduationCap, color: "text-blue-600", bg: "bg-blue-50" },
                                            { label: "Total Students", value: data?.metrics?.totalStudents || 0, icon: UserCheck, color: "text-amber-600", bg: "bg-amber-50" },
                                            { label: "Revenue", value: `₹${data?.metrics?.totalRevenue || 0}`, icon: Wallet, color: "text-emerald-600", bg: "bg-emerald-50" },
                                            { label: "Active Leads", value: data?.metrics?.activeLeads || 0, icon: Target, color: "text-purple-600", bg: "bg-purple-50" }
                                        ].map((stat, i) => (
                                            <div key={i} className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
                                                <div className="flex items-center gap-3 mb-4">
                                                    <div className={`p-2.5 rounded-xl ${stat.bg}`}>
                                                        <stat.icon size={18} className={stat.color} />
                                                    </div>
                                                    <p className="text-xs font-medium text-gray-500">{stat.label}</p>
                                                </div>
                                                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                                        {/* Pending approvals */}
                                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                                            <div className="flex items-center justify-between mb-5">
                                                <h3 className="font-semibold text-gray-900">Pending Approvals</h3>
                                                <button onClick={() => setActiveTab("listings")} className="text-xs font-medium text-blue-600 hover:underline">View All</button>
                                            </div>
                                            <div className="space-y-3">
                                                {data?.pendingTutors?.slice(0, 3).map(tutor => (
                                                    <div key={tutor.id} className="p-3 bg-gray-50 rounded-xl flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-9 h-9 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-semibold text-sm">
                                                                {tutor.name?.[0]}
                                                            </div>
                                                            <div>
                                                                <p className="font-medium text-sm text-gray-900">{tutor.name}</p>
                                                                <p className="text-xs text-gray-400">{tutor.phone}</p>
                                                            </div>
                                                        </div>
                                                        <button onClick={() => handleApproveTutor(tutor.id)} className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors">Approve</button>
                                                    </div>
                                                ))}
                                                {(!data?.pendingTutors || data.pendingTutors.length === 0) && (
                                                    <p className="text-center py-8 text-sm text-gray-400">No pending approvals</p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Recent transactions */}
                                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                                            <div className="flex items-center justify-between mb-5">
                                                <h3 className="font-semibold text-gray-900">Recent Transactions</h3>
                                                <button onClick={() => setActiveTab("financials")} className="text-xs font-medium text-blue-600 hover:underline">View All</button>
                                            </div>
                                            <div className="space-y-3">
                                                {data?.recentTransactions?.slice(0, 3).map(txn => (
                                                    <div key={txn.id} className="p-3 bg-gray-50 rounded-xl flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-9 h-9 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center">
                                                                <Wallet size={16} />
                                                            </div>
                                                            <div>
                                                                <p className="font-medium text-sm text-gray-900">₹{txn.amount}</p>
                                                                <p className="text-xs text-gray-400">{txn.user?.name || "Member"}</p>
                                                            </div>
                                                        </div>
                                                        <p className="text-xs text-gray-400">{new Date(txn.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</p>
                                                    </div>
                                                ))}
                                                {(!data?.recentTransactions || data.recentTransactions.length === 0) && (
                                                    <p className="text-center py-8 text-sm text-gray-400">No transactions yet</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* Users Tab */}
                            {activeTab === "users" && (
                                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
                                    <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <h3 className="font-semibold text-gray-900">Users <span className="text-gray-400 font-normal text-sm">({usersTotal})</span></h3>
                                        <div className="flex gap-3">
                                            <select
                                                value={usersRole}
                                                onChange={e => { setUsersRole(e.target.value); setUsersPage(1); }}
                                                className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-100"
                                            >
                                                <option value="">All Roles</option>
                                                <option value="TUTOR">Tutor</option>
                                                <option value="STUDENT">Student</option>
                                                <option value="INSTITUTE">Institute</option>
                                                <option value="ADMIN">Admin</option>
                                            </select>
                                            <form onSubmit={handleUserSearch} className="flex gap-2">
                                                <div className="relative">
                                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                                                    <input
                                                        type="text"
                                                        value={usersSearch}
                                                        onChange={e => setUsersSearch(e.target.value)}
                                                        placeholder="Search by name, email, phone..."
                                                        className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-100 w-64"
                                                    />
                                                </div>
                                                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">Search</button>
                                            </form>
                                        </div>
                                    </div>

                                    {usersLoading ? (
                                        <div className="flex items-center justify-center py-16">
                                            <Loader2 size={24} className="animate-spin text-gray-300" />
                                        </div>
                                    ) : (
                                        <>
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-left">
                                                    <thead>
                                                        <tr className="border-b border-gray-100">
                                                            <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                                                            <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                                                            <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Plan</th>
                                                            <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Verified</th>
                                                            <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Joined</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-gray-50">
                                                        {users.map(user => (
                                                            <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                                                <td className="px-6 py-4">
                                                                    <div className="flex items-center gap-3">
                                                                        <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-semibold text-xs">
                                                                            {(user.name || "?")?.[0]?.toUpperCase()}
                                                                        </div>
                                                                        <div>
                                                                            <p className="font-medium text-sm text-gray-900">{user.name || "—"}</p>
                                                                            <p className="text-xs text-gray-400">{user.email || user.phone}</p>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-4">
                                                                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${roleColors[user.role] || "bg-gray-50 text-gray-600"}`}>
                                                                        {user.role?.charAt(0) + user.role?.slice(1)?.toLowerCase()}
                                                                    </span>
                                                                </td>
                                                                <td className="px-6 py-4">
                                                                    <span className="text-xs text-gray-500 capitalize">{user.subscriptionTier?.toLowerCase() || "Free"}</span>
                                                                </td>
                                                                <td className="px-6 py-4">
                                                                    {user.isVerified
                                                                        ? <span className="text-emerald-600 text-xs font-medium flex items-center gap-1"><CheckCircle2 size={13} /> Yes</span>
                                                                        : <span className="text-gray-400 text-xs">No</span>
                                                                    }
                                                                </td>
                                                                <td className="px-6 py-4 text-xs text-gray-400">
                                                                    {new Date(user.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                        {users.length === 0 && (
                                                            <tr>
                                                                <td colSpan={5} className="px-6 py-16 text-center text-sm text-gray-400">No users found</td>
                                                            </tr>
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>

                                            {/* Pagination */}
                                            {usersPages > 1 && (
                                                <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                                                    <p className="text-sm text-gray-500">Page {usersPage} of {usersPages}</p>
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => setUsersPage(p => Math.max(1, p - 1))}
                                                            disabled={usersPage === 1}
                                                            className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 transition-colors"
                                                        >
                                                            <ChevronLeft size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => setUsersPage(p => Math.min(usersPages, p + 1))}
                                                            disabled={usersPage === usersPages}
                                                            className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 transition-colors"
                                                        >
                                                            <ChevronRight size={16} />
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            )}

                            {/* Listings / Tutor Approvals Tab */}
                            {activeTab === "listings" && (
                                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                                    <h3 className="font-semibold text-gray-900 mb-5">Tutor Approvals</h3>
                                    <div className="space-y-3">
                                        {data?.pendingTutors?.map(tutor => (
                                            <div key={tutor.id} className="p-4 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-between hover:border-blue-200 transition-colors">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center font-semibold text-lg">
                                                        {tutor.name?.[0]}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900">{tutor.name}</p>
                                                        <div className="flex gap-4 mt-1">
                                                            {tutor.phone && <span className="flex items-center gap-1 text-xs text-gray-400"><Phone size={11} /> {tutor.phone}</span>}
                                                            {tutor.email && <span className="flex items-center gap-1 text-xs text-gray-400"><Mail size={11} /> {tutor.email}</span>}
                                                        </div>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => handleApproveTutor(tutor.id)}
                                                    className="px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                                                >
                                                    Approve
                                                </button>
                                            </div>
                                        ))}
                                        {(!data?.pendingTutors || data.pendingTutors.length === 0) && (
                                            <div className="text-center py-16">
                                                <CheckCircle2 size={32} className="text-emerald-300 mx-auto mb-3" />
                                                <p className="text-sm text-gray-400">No pending approvals</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Financials Tab */}
                            {activeTab === "financials" && (
                                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
                                    <div className="p-6 border-b border-gray-100">
                                        <h3 className="font-semibold text-gray-900">Transactions</h3>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left">
                                            <thead>
                                                <tr className="border-b border-gray-100">
                                                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                                                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Plan</th>
                                                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                                                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Amount</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-50">
                                                {data?.recentTransactions?.map(txn => (
                                                    <tr key={txn.id} className="hover:bg-gray-50 transition-colors">
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 text-xs font-semibold">{txn.user?.name?.[0]}</div>
                                                                <div>
                                                                    <p className="font-medium text-sm text-gray-900">{txn.user?.name || "—"}</p>
                                                                    <p className="text-xs text-gray-400 capitalize">{txn.user?.role?.toLowerCase()}</p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-gray-600 capitalize">{txn.plan?.toLowerCase() || "Subscription"}</td>
                                                        <td className="px-6 py-4 text-sm text-gray-400">{new Date(txn.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</td>
                                                        <td className="px-6 py-4 text-right">
                                                            <p className="font-semibold text-emerald-600">₹{txn.amount}</p>
                                                        </td>
                                                    </tr>
                                                ))}
                                                {(!data?.recentTransactions || data.recentTransactions.length === 0) && (
                                                    <tr>
                                                        <td colSpan={4} className="px-6 py-16 text-center text-sm text-gray-400">No transactions yet</td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>
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
