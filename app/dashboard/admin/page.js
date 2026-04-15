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
    Mail
} from "lucide-react";

function AdminDashboardContent() {
    const router = useRouter();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("overview");

    // Users tab state
    const [users, setUsers] = useState([]);
    const [usersLoading, setUsersLoading] = useState(false);
    const [userSearch, setUserSearch] = useState("");
    const [userActionLoading, setUserActionLoading] = useState(null);

    useEffect(() => {
        fetchMetrics();
    }, []);

    useEffect(() => {
        if (activeTab === "users") fetchUsers();
    }, [activeTab]);

    const fetchMetrics = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/metrics");
            const json = await res.json();
            if (json.success) {
                setData(json);
            }
        } catch (err) {
            console.error("Failed to load metrics", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchUsers = async (search = userSearch) => {
        setUsersLoading(true);
        try {
            const params = new URLSearchParams({ search });
            const res = await fetch(`/api/admin/users?${params}`);
            const json = await res.json();
            if (json.success) setUsers(json.users || []);
        } catch (err) {
            console.error("Failed to load users", err);
        } finally {
            setUsersLoading(false);
        }
    };

    const handleSuspend = async (userId, suspend) => {
        setUserActionLoading(userId + "-suspend");
        try {
            const res = await fetch("/api/admin/user/suspend", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, suspend }),
            });
            const json = await res.json();
            if (json.success) {
                setUsers(prev => prev.map(u => u.id === userId ? { ...u, isSuspended: json.isSuspended } : u));
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
                headers: { "Content-Type": "application/json" },
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
                headers: { "Content-Type": "application/json" },
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
                                { id: "financials", icon: CreditCard, label: "Transactions" },
                                { id: "stats", icon: BarChart3, label: "Analytics" }
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
                        onClick={() => router.push("/")}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-red-500 border border-gray-200 hover:bg-red-50 hover:border-red-100 rounded-xl transition-all font-semibold text-sm"
                    >
                        <LogOut size={14} strokeWidth={2} />
                        Log Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto bg-gray-50">
                <DashboardHeader
                    user={{ name: "Administrator" }}
                    role="ADMIN"
                    onSync={fetchMetrics}
                    onLogout={() => router.push("/")}
                />

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

                                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
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
                                    </div>
                                </>
                            )}

                            {/* Users Tab */}
                            {activeTab === "users" && (
                                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="font-bold text-lg text-gray-900">User Directory</h3>
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={14} />
                                            <input
                                                placeholder="Search by name, phone, email..."
                                                value={userSearch}
                                                onChange={e => { setUserSearch(e.target.value); fetchUsers(e.target.value); }}
                                                className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-100 outline-none w-64"
                                            />
                                        </div>
                                    </div>
                                    {usersLoading ? (
                                        <div className="flex items-center justify-center py-16">
                                            <div className="size-8 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
                                        </div>
                                    ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left">
                                            <thead>
                                                <tr className="border-b border-gray-200 bg-gray-50">
                                                    <th className="pb-3 pt-2 px-4 text-xs font-semibold text-gray-500 rounded-tl-xl">Name</th>
                                                    <th className="pb-3 pt-2 px-4 text-xs font-semibold text-gray-500">Role</th>
                                                    <th className="pb-3 pt-2 px-4 text-xs font-semibold text-gray-500">Credits</th>
                                                    <th className="pb-3 pt-2 px-4 text-xs font-semibold text-gray-500">Status</th>
                                                    <th className="pb-3 pt-2 px-4 text-xs font-semibold text-gray-500 rounded-tr-xl">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {users.map(u => (
                                                    <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                                                        <td className="py-4 px-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="size-8 bg-blue-50 rounded-lg flex items-center justify-center font-bold text-blue-400 text-xs">
                                                                    {u.name?.[0] || "?"}
                                                                </div>
                                                                <div>
                                                                    <p className="font-semibold text-sm text-gray-900">{u.name || "—"}</p>
                                                                    <p className="text-xs text-gray-400">{u.phone || u.email || "—"}</p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="py-4 px-4">
                                                            <span className={`px-2 py-0.5 rounded text-xs font-semibold ${u.role === "TUTOR" ? "bg-blue-50 text-blue-600" : u.role === "STUDENT" ? "bg-amber-50 text-amber-600" : "bg-gray-100 text-gray-500"}`}>
                                                                {u.role}
                                                            </span>
                                                        </td>
                                                        <td className="py-4 px-4">
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-sm font-semibold text-gray-700">{u.credits}</span>
                                                                <button
                                                                    onClick={() => {
                                                                        const amt = prompt(`Add credits to ${u.name}? (use negative to remove)`, "5");
                                                                        if (amt !== null && !isNaN(parseInt(amt))) handleAddCredits(u.id, parseInt(amt));
                                                                    }}
                                                                    disabled={userActionLoading === u.id + "-credits"}
                                                                    className="text-xs px-2 py-0.5 border border-gray-200 rounded-lg text-blue-600 hover:border-blue-300 transition-colors"
                                                                >
                                                                    {userActionLoading === u.id + "-credits" ? "..." : "+/-"}
                                                                </button>
                                                            </div>
                                                        </td>
                                                        <td className="py-4 px-4">
                                                            {u.isSuspended ? (
                                                                <span className="px-2.5 py-1 bg-red-50 text-red-500 rounded-full text-xs font-semibold border border-red-100">Suspended</span>
                                                            ) : u.isVerified ? (
                                                                <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-semibold border border-emerald-100">Active</span>
                                                            ) : (
                                                                <span className="px-2.5 py-1 bg-gray-50 text-gray-400 rounded-full text-xs font-semibold border border-gray-200">Pending</span>
                                                            )}
                                                        </td>
                                                        <td className="py-4 px-4">
                                                            <button
                                                                onClick={() => handleSuspend(u.id, !u.isSuspended)}
                                                                disabled={userActionLoading === u.id + "-suspend"}
                                                                className={`text-xs px-3 py-1.5 rounded-lg font-semibold border transition-all ${u.isSuspended ? "bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100" : "bg-red-50 text-red-500 border-red-100 hover:bg-red-100"}`}
                                                            >
                                                                {userActionLoading === u.id + "-suspend" ? "..." : u.isSuspended ? "Reinstate" : "Suspend"}
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                                {users.length === 0 && (
                                                    <tr><td colSpan={5} className="py-12 text-center text-gray-400 text-sm">No users found.</td></tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                    )}
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
                                                            await fetch("/api/admin/tutor/approve", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ tutorId: tutor.id, isApproved: false }) });
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
                </div>
            </main>
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
