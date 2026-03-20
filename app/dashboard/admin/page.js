"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

function AdminDashboardContent() {
    const router = useRouter();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMetrics();
    }, []);

    const fetchMetrics = async () => {
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
        if (!confirm("Approve this tutor as a Verified Expert?")) return;

        try {
            const res = await fetch("/api/admin/tutor/approve", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ tutorId, isApproved: true })
            });
            const json = await res.json();
            if (json.success) {
                alert("Tutor Approved!");
                fetchMetrics(); // Refresh data
            } else {
                alert("Failed to approve tutor");
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="flex h-screen bg-slate-50 dark:bg-slate-950 font-sans">
            {/* Sidebar Navigation */}
            <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col hidden lg:flex">
                <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
                    <span className="material-symbols-outlined text-rose-500 text-3xl font-bold">admin_panel_settings</span>
                    <h2 className="text-xl font-heading font-bold text-slate-900 dark:text-white">Admin Portal</h2>
                </div>

                <div className="p-6">
                    <div className="flex items-center gap-3 mb-6 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-700">
                        <div className="size-10 rounded-full bg-slate-900 dark:bg-white flex items-center justify-center text-white dark:text-slate-900 font-bold">
                            A
                        </div>
                        <div>
                            <p className="font-bold text-sm">Super Admin</p>
                            <p className="text-xs text-slate-500">info@tuitionsinindia.com</p>
                        </div>
                    </div>

                    <nav className="space-y-2">
                        <a href="#" className="flex items-center gap-3 px-4 py-3 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-xl font-bold transition-all shadow-sm">
                            <span className="material-symbols-outlined">dashboard</span>
                            <span className="text-sm">Overview</span>
                        </a>
                        <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all font-medium">
                            <span className="material-symbols-outlined">manage_accounts</span>
                            <span className="text-sm">Users</span>
                        </a>
                    </nav>
                </div>

                <div className="mt-auto p-6">
                    <Link href="/" className="flex items-center gap-3 px-4 py-3 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-all font-bold">
                        <span className="material-symbols-outlined">logout</span>
                        <span className="text-sm">Log Out</span>
                    </Link>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto relative">
                <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-6 md:px-10 py-5 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-heading font-bold tracking-tight">System Overview</h1>
                        <p className="text-sm text-slate-500">Manage all platform activities and monitor metrics.</p>
                    </div>
                    <button onClick={fetchMetrics} className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 rounded-xl hover:text-primary transition-colors flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">refresh</span> Refresh
                    </button>
                </header>

                <div className="p-6 md:p-10">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <span className="material-symbols-outlined text-5xl text-slate-300 animate-spin">refresh</span>
                            <p className="mt-4 font-bold text-slate-500">Loading live data...</p>
                        </div>
                    ) : (
                        <>
                            {/* Metrics Overview */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
                                    <div className="flex items-center justify-between mb-4">
                                        <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Total Tutors</p>
                                        <span className="material-symbols-outlined text-primary bg-primary/10 p-2 rounded-xl">school</span>
                                    </div>
                                    <p className="text-4xl font-heading font-bold text-slate-900 dark:text-white">{data?.metrics.totalTutors || 0}</p>
                                </div>

                                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
                                    <div className="flex items-center justify-between mb-4">
                                        <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Total Students</p>
                                        <span className="material-symbols-outlined text-amber-500 bg-amber-500/10 p-2 rounded-xl">face</span>
                                    </div>
                                    <p className="text-4xl font-heading font-bold text-slate-900 dark:text-white">{data?.metrics.totalStudents || 0}</p>
                                </div>

                                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
                                    <div className="flex items-center justify-between mb-4">
                                        <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Revenue (INR)</p>
                                        <span className="material-symbols-outlined text-emerald-500 bg-emerald-500/10 p-2 rounded-xl">payments</span>
                                    </div>
                                    <p className="text-4xl font-heading font-bold text-slate-900 dark:text-white">₹{data?.metrics.totalRevenue || 0}</p>
                                </div>

                                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
                                    <div className="flex items-center justify-between mb-4">
                                        <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Active Leads</p>
                                        <span className="material-symbols-outlined text-indigo-500 bg-indigo-500/10 p-2 rounded-xl">forum</span>
                                    </div>
                                    <p className="text-4xl font-heading font-bold text-slate-900 dark:text-white">{data?.metrics.activeLeads || 0}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Pending Tutors Table */}
                                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col h-[500px]">
                                    <div className="p-6 border-b border-slate-200 dark:border-slate-800 sticky top-0 bg-white dark:bg-slate-900 z-10">
                                        <h3 className="text-lg font-bold font-heading">Tutors Pending Approval</h3>
                                        <p className="text-sm text-slate-500 font-medium">Verify profiles to allow them to access Premium features.</p>
                                    </div>
                                    <div className="overflow-y-auto p-4 flex-1">
                                        {data?.pendingTutors && data.pendingTutors.length > 0 ? (
                                            <div className="space-y-4">
                                                {data.pendingTutors.map(tutor => (
                                                    <div key={tutor.id} className="p-4 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-between gap-4">
                                                        <div className="overflow-hidden">
                                                            <p className="font-bold text-slate-900 dark:text-white truncate">{tutor.name || tutor.email}</p>
                                                            <p className="text-xs text-slate-500 truncate">{tutor.email} • {tutor.phone}</p>
                                                        </div>
                                                        <button
                                                            onClick={() => handleApproveTutor(tutor.id)}
                                                            className="shrink-0 px-4 py-2 bg-emerald-500 text-white text-xs font-bold rounded-lg hover:bg-emerald-600 transition-colors">
                                                            Approve
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="h-full flex flex-col items-center justify-center text-slate-400">
                                                <span className="material-symbols-outlined text-4xl mb-2">check_circle</span>
                                                <p className="font-semibold text-sm">No tutors pending approval</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Transactions Ledger Table */}
                                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col h-[500px]">
                                    <div className="p-6 border-b border-slate-200 dark:border-slate-800 sticky top-0 bg-white dark:bg-slate-900 z-10">
                                        <h3 className="text-lg font-bold font-heading">Transaction Ledger</h3>
                                        <p className="text-sm text-slate-500 font-medium">Recent successful credit & subscription purchases.</p>
                                    </div>
                                    <div className="overflow-y-auto p-4 flex-1">
                                        {data?.recentTransactions && data.recentTransactions.length > 0 ? (
                                            <div className="space-y-4">
                                                {data.recentTransactions.map(txn => (
                                                    <div key={txn.id} className="p-4 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                                        <div>
                                                            <div className="flex items-center gap-2">
                                                                <span className="material-symbols-outlined text-emerald-500 text-sm">payments</span>
                                                                <p className="font-bold text-slate-900 dark:text-white text-sm">₹{txn.amount}</p>
                                                            </div>
                                                            <p className="text-xs text-slate-500 mt-1">{txn.user?.name || 'Unknown User'} ({txn.user?.role})</p>
                                                        </div>
                                                        <div className="text-right">
                                                            <span className="inline-block px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 text-[10px] font-bold rounded uppercase tracking-wider">
                                                                {new Date(txn.createdAt).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="h-full flex flex-col items-center justify-center text-slate-400">
                                                <span className="material-symbols-outlined text-4xl mb-2">receipt_long</span>
                                                <p className="font-semibold text-sm">No recent transactions</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </main>
        </div>
    );
}

export default function AdminDashboard() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen bg-background-light dark:bg-background-dark">
                <span className="material-symbols-outlined text-5xl text-slate-900 dark:text-white animate-spin">sync</span>
            </div>
        }>
            <AdminDashboardContent />
        </Suspense>
    );
}
