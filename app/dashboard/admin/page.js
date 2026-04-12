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
    RefreshCcw, 
    LogOut, 
    GraduationCap,
    School, 
    UserCheck, 
    Database, 
    TrendingUp, 
    FileText, 
    Search, 
    Bell, 
    Settings, 
    CheckCircle2, 
    XCircle, 
    BarChart3, 
    Boxes, 
    Activity, 
    Cpu, 
    Target, 
    ArrowRight, 
    Briefcase,
    BadgeCheck,
    Wallet,
    Phone,
    Mail,
    User
} from "lucide-react";

function AdminDashboardContent() {
    const router = useRouter();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("overview"); // overview, users, listings, financials

    useEffect(() => {
        fetchMetrics();
    }, []);

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

    const handleApproveTutor = async (tutorId) => {
        // Optimistic UI Update
        const tutorToApprove = data?.pendingTutors?.find(t => t.id === tutorId);
        if (!tutorToApprove) return;

        // Instantly update state
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
                // Rollback if failed
                fetchMetrics();
                alert("Failed to approve tutor on server. Rolling back...");
            }
        } catch (err) {
            console.error(err);
            fetchMetrics();
        }
    };

    return (
        <div className="flex h-screen bg-gray-50 font-sans text-gray-900 selection:bg-blue-100 selection:text-blue-600 overflow-hidden">
            {/* Professional Management Sidebar */}
            <aside className="w-72 border-r border-gray-200 bg-white flex flex-col hidden lg:flex shadow-sm z-50 overflow-hidden">
                <div className="p-8 border-b border-gray-100">
                    <Logo />
                </div>

                <div className="p-6 flex-1 overflow-y-auto space-y-8">
                    <div>
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 px-4">System Management</h4>
                        <nav className="space-y-1">
                            {[
                                { id: "overview", icon: LayoutDashboard, label: "Overview" },
                                { id: "users", icon: Users, label: "User Directory" },
                                { id: "listings", icon: GraduationCap, label: "Listing Approvals" },
                                { id: "financials", icon: CreditCard, label: "Financial Ledger" },
                                { id: "stats", icon: BarChart3, label: "System Analytics" }
                            ].map((item) => (
                                <button 
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-[13px] transition-all group ${activeTab === item.id ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
                                >
                                    <item.icon size={18} strokeWidth={activeTab === item.id ? 2.5 : 2} className={activeTab === item.id ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'} />
                                    {item.label}
                                </button>
                            ))}
                        </nav>
                    </div>

                    <div>
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 px-4">Resources</h4>
                        <nav className="space-y-1">
                            {[
                                { icon: Database, label: "Database Tools" },
                                { icon: Settings, label: "Global Settings" }
                            ].map((item, i) => (
                                <button key={i} className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-gray-900 rounded-xl font-bold text-[13px] transition-all">
                                    <item.icon size={18} strokeWidth={2} className="text-gray-400" />
                                    {item.label}
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>

                <div className="p-6 mt-auto border-t border-gray-100 bg-gray-50/50">
                    <button 
                        onClick={() => router.push("/")}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white text-red-500 border border-gray-200 hover:bg-red-50 hover:border-red-100 rounded-xl transition-all font-bold text-xs uppercase tracking-wider shadow-sm"
                    >
                        <LogOut size={14} strokeWidth={2.5} />
                        Exit Manager
                    </button>
                </div>
            </aside>

            {/* Tactical Content Area */}
            <main className="flex-1 overflow-y-auto relative bg-background-dark">
                <DashboardHeader 
                    user={{ name: "Administrator" }} 
                    role="ADMIN" 
                    onSync={fetchMetrics}
                    onLogout={() => router.push("/")}
                />

                <div className="p-8 pb-24">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-40">
                            <div className="size-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
                            <p className="mt-6 font-bold text-xs uppercase tracking-widest text-gray-400 animate-pulse">Syncing Global Data...</p>
                        </div>
                    ) : (
                        <div className="max-w-7xl mx-auto space-y-8">
                            {/* Overview Tab Content */}
                            {activeTab === "overview" && (
                                <>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                        {[
                                            { label: 'Total Experts', value: data?.metrics.totalTutors || 0, icon: GraduationCap, color: 'text-blue-600', bg: 'bg-blue-50' },
                                            { label: 'Verified Scholars', value: data?.metrics.totalStudents || 0, icon: UserCheck, color: 'text-amber-600', bg: 'bg-amber-50' },
                                            { label: 'Gross Revenue', value: `₹${data?.metrics.totalRevenue || 0}`, icon: Wallet, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                                            { label: 'Mandate Volume', value: data?.metrics.activeLeads || 0, icon: Target, color: 'text-purple-600', bg: 'bg-purple-50' }
                                        ].map((stat, i) => (
                                            <div key={i} className="p-8 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                                                <div className="flex items-center gap-4 mb-6">
                                                    <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                                                        <stat.icon size={20} strokeWidth={2.5} />
                                                    </div>
                                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-none">{stat.label}</p>
                                                </div>
                                                <p className="text-4xl font-bold text-gray-900 tracking-tight leading-none">{stat.value}</p>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                                        {/* Dashboard Recent Activity Widgets */}
                                        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8">
                                            <div className="flex items-center justify-between mb-8">
                                                <h3 className="font-bold text-lg text-gray-900">Recent Approvals</h3>
                                                <button onClick={() => setActiveTab("listings")} className="text-xs font-bold text-blue-600 hover:underline">View All</button>
                                            </div>
                                            <div className="space-y-4">
                                                {data?.pendingTutors?.slice(0, 3).map(tutor => (
                                                    <div key={tutor.id} className="p-4 bg-gray-50 rounded-2xl flex items-center justify-between group">
                                                        <div className="flex items-center gap-4">
                                                            <div className="size-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold text-lg">
                                                                {tutor.name?.[0]}
                                                            </div>
                                                            <div>
                                                                <p className="font-bold text-sm text-gray-900">{tutor.name}</p>
                                                                <p className="text-xs text-gray-400 uppercase font-black tracking-widest">{tutor.phone}</p>
                                                            </div>
                                                        </div>
                                                        <button onClick={() => handleApproveTutor(tutor.id)} className="px-4 py-2 bg-white text-blue-600 border border-blue-100 rounded-lg text-xs font-bold hover:bg-blue-600 hover:text-white transition-all shadow-sm">APPROVE</button>
                                                    </div>
                                                ))}
                                                {(!data?.pendingTutors || data.pendingTutors.length === 0) && (
                                                    <p className="text-center py-8 text-gray-300 font-bold text-xs uppercase tracking-widest">Queue Optimized</p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8">
                                            <div className="flex items-center justify-between mb-8">
                                                <h3 className="font-bold text-lg text-gray-900">Economic Stream</h3>
                                                <button onClick={() => setActiveTab("financials")} className="text-xs font-bold text-blue-600 hover:underline">View All</button>
                                            </div>
                                            <div className="space-y-4">
                                                {data?.recentTransactions?.slice(0, 3).map(txn => (
                                                    <div key={txn.id} className="p-4 bg-gray-50 rounded-2xl flex items-center justify-between">
                                                        <div className="flex items-center gap-4">
                                                            <div className="size-10 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center">
                                                                <Wallet size={18} />
                                                            </div>
                                                            <div>
                                                                <p className="font-bold text-sm text-gray-900">₹{txn.amount}</p>
                                                                <p className="text-xs text-gray-400 uppercase font-black tracking-widest">{txn.user?.name || "Member"}</p>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-xs font-bold text-gray-300 uppercase tracking-widest">{new Date(txn.createdAt).toLocaleDateString()}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* Users Tab Content */}
                            {activeTab === "users" && (
                                <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8">
                                    <div className="flex items-center justify-between mb-8">
                                        <h3 className="font-bold text-xl text-gray-900 uppercase tracking-tight">Global User Directory</h3>
                                        <div className="flex gap-4">
                                            <div className="relative">
                                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                                                <input placeholder="Search users..." className="pl-11 pr-6 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-100 outline-none w-64" />
                                            </div>
                                        </div>
                                    </div>
                                    {/* Placeholder user list */}
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left">
                                            <thead>
                                                <tr className="border-b border-gray-50">
                                                    <th className="pb-4 pt-2 px-4 text-xs uppercase font-black text-gray-400 tracking-widest">Identiy</th>
                                                    <th className="pb-4 pt-2 px-4 text-xs uppercase font-black text-gray-400 tracking-widest">Role</th>
                                                    <th className="pb-4 pt-2 px-4 text-xs uppercase font-black text-gray-400 tracking-widest">Status</th>
                                                    <th className="pb-4 pt-2 px-4 text-xs uppercase font-black text-gray-400 tracking-widest">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-50">
                                                {[1, 2, 3, 4, 5].map((_, i) => (
                                                    <tr key={i} className="group hover:bg-gray-50/50 transition-colors">
                                                        <td className="py-4 px-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="size-8 bg-gray-100 rounded-lg flex items-center justify-center font-bold text-gray-400 text-xs">U</div>
                                                                <div>
                                                                    <p className="font-bold text-sm text-gray-900">Actor_{i}</p>
                                                                    <p className="text-xs text-gray-400">user_{i}@tuitionsinindia.com</p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="py-4 px-4 text-xs font-bold text-gray-500 uppercase tracking-wide">TUTOR</td>
                                                        <td className="py-4 px-4">
                                                            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-black uppercase tracking-widest">ACTIVE</span>
                                                        </td>
                                                        <td className="py-4 px-4">
                                                            <button className="p-2 text-gray-300 hover:text-blue-600 transition-colors"><Settings size={16} /></button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* Listings Tab Content */}
                            {activeTab === "listings" && (
                                <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8">
                                    <h3 className="font-bold text-xl text-gray-900 uppercase tracking-tight mb-8">Verification Pipeline</h3>
                                    <div className="space-y-4">
                                        {data?.pendingTutors?.map(tutor => (
                                            <div key={tutor.id} className="p-8 bg-gray-50 border border-gray-100 rounded-3xl flex items-center justify-between group hover:border-blue-200 transition-all">
                                                <div className="flex items-center gap-6">
                                                    <div className="size-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center font-bold text-2xl shadow-sm group-hover:scale-105 transition-transform">
                                                        {tutor.name?.[0]}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-xl text-gray-900">{tutor.name}</p>
                                                        <div className="flex gap-4 mt-2">
                                                            <span className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest"><Phone size={12} className="text-gray-300" /> {tutor.phone}</span>
                                                            <span className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest"><Mail size={12} className="text-gray-300" /> {tutor.email}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <button 
                                                    onClick={() => handleApproveTutor(tutor.id)}
                                                    className="px-10 py-5 bg-blue-600 text-white text-xs font-black rounded-2xl hover:bg-gray-900 shadow-lg shadow-blue-600/10 transition-all uppercase tracking-widest"
                                                >
                                                    APPROVE FACULTY
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Financials Tab Content */}
                            {activeTab === "financials" && (
                                <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8">
                                    <h3 className="font-bold text-xl text-gray-900 uppercase tracking-tight mb-8">Strategic Economic Ledger</h3>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left">
                                            <thead>
                                                <tr className="border-b border-gray-100">
                                                    <th className="pb-4 pt-2 text-xs uppercase font-black text-gray-400 tracking-widest">Transaction</th>
                                                    <th className="pb-4 pt-2 text-xs uppercase font-black text-gray-400 tracking-widest">Actor</th>
                                                    <th className="pb-4 pt-2 text-xs uppercase font-black text-gray-400 tracking-widest text-right">Value</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-50">
                                                {data?.recentTransactions?.map(txn => (
                                                    <tr key={txn.id}>
                                                        <td className="py-6 pr-4">
                                                            <p className="font-bold text-sm text-gray-900 uppercase tracking-tight">Purchase_Credits</p>
                                                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">{new Date(txn.createdAt).toLocaleString()}</p>
                                                        </td>
                                                        <td className="py-6 px-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="size-8 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-xs font-bold">{txn.user?.name?.[0]}</div>
                                                                <div>
                                                                    <p className="font-bold text-xs text-gray-700">{txn.user?.name}</p>
                                                                    <p className="text-xs text-gray-300 font-black uppercase tracking-widest">{txn.user?.role}</p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="py-6 pl-4 text-right">
                                                            <p className="text-xl font-bold text-emerald-600 tracking-tight leading-none italic">₹{txn.amount}</p>
                                                            <span className="text-xs font-black uppercase text-emerald-400 tracking-widest italic">SUCCESS</span>
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
            <div className="flex items-center justify-center min-h-screen bg-background-dark font-sans overflow-hidden relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[400px] bg-primary/10 rounded-full blur-[100px] animate-pulse"></div>
                <div className="flex flex-col items-center relative z-10">
                    <div className="size-24 bg-surface-dark border border-border-dark rounded-[2.5rem] flex items-center justify-center mb-10 shadow-2xl animate-spin-slow">
                         <div className="size-12 bg-primary/20 rounded-2xl flex items-center justify-center">
                            <Cpu size={28} className="text-primary animate-pulse" />
                         </div>
                    </div>
                    <p className="font-black text-[12px] text-on-surface-dark/20 uppercase tracking-[0.6em] italic animate-pulse">Initializing Master Protocol...</p>
                </div>
            </div>
        }>
            <AdminDashboardContent />
        </Suspense>
    );
}
