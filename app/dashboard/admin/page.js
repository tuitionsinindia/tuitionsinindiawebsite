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
    Mail,
    FileText,
    PlusCircle,
    Eye,
    EyeOff,
    Loader2,
    Pencil,
    ArrowLeft
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

    // Blog tab state
    const [blogPosts, setBlogPosts] = useState([]);
    const [blogLoading, setBlogLoading] = useState(false);
    const [blogForm, setBlogForm] = useState(null); // null = list view, {} = new post, {id,...} = edit
    const [blogSaving, setBlogSaving] = useState(false);
    const [blogMsg, setBlogMsg] = useState(null);

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
        if (activeTab === "users" && adminKey) fetchUsers(userSearch, adminKey);
        if (activeTab === "blog") fetchBlogPosts();
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
            const res = await fetch("/api/admin/metrics", { headers: { "x-admin-key": key || adminKey } });
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

    const fetchUsers = async (search = userSearch, key = adminKey) => {
        setUsersLoading(true);
        try {
            const params = new URLSearchParams({ search });
            const res = await fetch(`/api/admin/users?${params}`, { headers: { "x-admin-key": key } });
            const json = await res.json();
            if (json.success) setUsers(json.users || []);
        } catch (err) {
            console.error("Failed to load users", err);
        } finally {
            setUsersLoading(false);
        }
    };

    const fetchBlogPosts = async () => {
        setBlogLoading(true);
        try {
            const res = await fetch("/api/blog?all=true");
            const json = await res.json();
            if (Array.isArray(json)) setBlogPosts(json);
        } catch (err) {
            console.error("Failed to load blog posts", err);
        } finally {
            setBlogLoading(false);
        }
    };

    const saveBlogPost = async () => {
        if (!blogForm?.title || !blogForm?.slug || !blogForm?.content || !blogForm?.category) {
            setBlogMsg({ type: "error", text: "Title, slug, content, and category are required." });
            return;
        }
        setBlogSaving(true);
        setBlogMsg(null);
        try {
            const isEdit = !!blogForm.id;
            const res = await fetch("/api/blog", {
                method: isEdit ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(blogForm),
            });
            const json = await res.json();
            if (res.ok) {
                setBlogMsg({ type: "success", text: isEdit ? "Post updated." : "Post created." });
                await fetchBlogPosts();
                setTimeout(() => setBlogForm(null), 800);
            } else {
                setBlogMsg({ type: "error", text: json.error || "Something went wrong." });
            }
        } catch {
            setBlogMsg({ type: "error", text: "Could not save post. Please try again." });
        } finally {
            setBlogSaving(false);
        }
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
                                { id: "financials", icon: CreditCard, label: "Transactions" },
                                { id: "stats", icon: BarChart3, label: "Analytics" },
                                { id: "blog", icon: FileText, label: "Blog" }
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

                    {/* ── BLOG TAB ── */}
                    {activeTab === "blog" && (
                        <div className="space-y-6">
                            {blogForm === null ? (
                                <>
                                    {/* Header */}
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h2 className="text-xl font-bold text-gray-900">Blog Posts</h2>
                                            <p className="text-sm text-gray-500 mt-0.5">{blogPosts.length} posts total</p>
                                        </div>
                                        <button
                                            onClick={() => { setBlogForm({ title: "", slug: "", excerpt: "", content: "", category: "Tips", author: "TuitionsInIndia", readTime: "5 min read", isPublished: false }); setBlogMsg(null); }}
                                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
                                        >
                                            <PlusCircle size={16} /> New Post
                                        </button>
                                    </div>

                                    {/* Posts list */}
                                    {blogLoading ? (
                                        <div className="flex justify-center py-12"><Loader2 size={24} className="animate-spin text-gray-300" /></div>
                                    ) : blogPosts.length === 0 ? (
                                        <div className="text-center py-16 text-gray-400">
                                            <FileText size={40} className="mx-auto mb-3 opacity-30" />
                                            <p className="font-medium">No blog posts yet</p>
                                            <p className="text-sm mt-1">Click "New Post" to write your first article.</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {blogPosts.map(post => (
                                                <div key={post.id} className="bg-white border border-gray-200 rounded-xl p-5 flex items-start justify-between gap-4">
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 flex-wrap mb-1">
                                                            <h3 className="font-semibold text-gray-900 text-sm truncate">{post.title}</h3>
                                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${post.isPublished ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                                                                {post.isPublished ? "Published" : "Draft"}
                                                            </span>
                                                            <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full text-[10px] font-medium">{post.category}</span>
                                                        </div>
                                                        <p className="text-xs text-gray-400">/blog/{post.slug} · {post.readTime} · by {post.author}</p>
                                                        {post.excerpt && <p className="text-xs text-gray-500 mt-1 line-clamp-1">{post.excerpt}</p>}
                                                    </div>
                                                    <div className="flex items-center gap-2 shrink-0">
                                                        <Link href={`/blog/${post.slug}`} target="_blank"
                                                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                                            <Eye size={15} />
                                                        </Link>
                                                        <button
                                                            onClick={() => { setBlogForm({ ...post }); setBlogMsg(null); }}
                                                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                                            <Pencil size={15} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </>
                            ) : (
                                /* ── Create / Edit form ── */
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3">
                                        <button onClick={() => { setBlogForm(null); setBlogMsg(null); }} className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                                            <ArrowLeft size={18} />
                                        </button>
                                        <h2 className="text-xl font-bold text-gray-900">{blogForm.id ? "Edit Post" : "New Post"}</h2>
                                    </div>

                                    <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-5">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-medium text-gray-500">Title *</label>
                                                <input
                                                    value={blogForm.title}
                                                    onChange={e => {
                                                        const title = e.target.value;
                                                        const slug = title.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");
                                                        setBlogForm(f => ({ ...f, title, slug: f.slug || slug }));
                                                    }}
                                                    placeholder="How to Find the Best Maths Tutor"
                                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-medium text-gray-500">Slug * (URL)</label>
                                                <input
                                                    value={blogForm.slug}
                                                    onChange={e => setBlogForm(f => ({ ...f, slug: e.target.value }))}
                                                    placeholder="how-to-find-best-maths-tutor"
                                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-mono"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-medium text-gray-500">Category *</label>
                                                <select
                                                    value={blogForm.category}
                                                    onChange={e => setBlogForm(f => ({ ...f, category: e.target.value }))}
                                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 transition-all"
                                                >
                                                    {["Tips", "Guides", "News", "Success Stories", "Exams", "Parenting"].map(c => (
                                                        <option key={c} value={c}>{c}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-medium text-gray-500">Author</label>
                                                <input
                                                    value={blogForm.author}
                                                    onChange={e => setBlogForm(f => ({ ...f, author: e.target.value }))}
                                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 transition-all"
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-medium text-gray-500">Read Time</label>
                                                <input
                                                    value={blogForm.readTime}
                                                    onChange={e => setBlogForm(f => ({ ...f, readTime: e.target.value }))}
                                                    placeholder="5 min read"
                                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 transition-all"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-xs font-medium text-gray-500">Excerpt (shown in listings)</label>
                                            <input
                                                value={blogForm.excerpt}
                                                onChange={e => setBlogForm(f => ({ ...f, excerpt: e.target.value }))}
                                                placeholder="A short description of the post..."
                                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                                            />
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-xs font-medium text-gray-500">Content * (plain text or Markdown)</label>
                                            <textarea
                                                value={blogForm.content}
                                                onChange={e => setBlogForm(f => ({ ...f, content: e.target.value }))}
                                                rows={16}
                                                placeholder="Write your article here..."
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all resize-y font-mono leading-relaxed"
                                            />
                                        </div>

                                        {blogMsg && (
                                            <p className={`text-sm px-4 py-3 rounded-xl ${blogMsg.type === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-red-50 text-red-600 border border-red-100"}`}>
                                                {blogMsg.text}
                                            </p>
                                        )}

                                        <div className="flex items-center justify-between pt-2">
                                            <label className="flex items-center gap-3 cursor-pointer">
                                                <div className="relative">
                                                    <input type="checkbox" className="sr-only"
                                                        checked={blogForm.isPublished}
                                                        onChange={e => setBlogForm(f => ({ ...f, isPublished: e.target.checked }))} />
                                                    <div className={`w-10 h-6 rounded-full transition-colors ${blogForm.isPublished ? "bg-blue-600" : "bg-gray-200"}`} />
                                                    <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${blogForm.isPublished ? "translate-x-4" : ""}`} />
                                                </div>
                                                <span className="text-sm font-medium text-gray-700">
                                                    {blogForm.isPublished ? <><Eye size={14} className="inline mr-1" />Published</> : <><EyeOff size={14} className="inline mr-1" />Draft</>}
                                                </span>
                                            </label>
                                            <button
                                                onClick={saveBlogPost}
                                                disabled={blogSaving}
                                                className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                                            >
                                                {blogSaving ? <Loader2 size={14} className="animate-spin" /> : null}
                                                {blogSaving ? "Saving..." : blogForm.id ? "Update Post" : "Create Post"}
                                            </button>
                                        </div>
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
