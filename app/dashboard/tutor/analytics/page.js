import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function AnalyticsContent() {
    const searchParams = useSearchParams();
    const tutorId = searchParams.get("tutorId");
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (tutorId) {
            fetchStats();
        }
    }, [tutorId]);

    const fetchStats = async () => {
        try {
            const res = await fetch(`/api/tutor/stats?tutorId=${tutorId}`);
            if (res.ok) {
                const data = await res.json();
                setStats(data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 font-sans">
            <main className="flex-1 overflow-y-auto p-10">
                <div className="max-w-4xl mx-auto">
                    <Link href={`/dashboard/tutor?tutorId=${tutorId}`} className="flex items-center gap-2 text-primary font-bold mb-8 hover:underline">
                        <span className="material-symbols-outlined text-sm">arrow_back</span> Back to Dashboard
                    </Link>

                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-10 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/20 text-center">
                        <div className="size-20 bg-indigo-500/10 rounded-full flex items-center justify-center text-indigo-500 mx-auto mb-6">
                            <span className="material-symbols-outlined text-4xl">analytics</span>
                        </div>
                        <h1 className="text-3xl font-heading font-bold mb-4">Profile Analytics</h1>
                        <p className="text-slate-500 mb-8 max-w-lg mx-auto">Monitor your directory ranking, profile impressions, and student conversion rates.</p>

                        {loading ? (
                            <div className="animate-pulse flex flex-col items-center">
                                <div className="h-20 w-full bg-slate-100 dark:bg-slate-800 rounded-2xl mb-4"></div>
                                <div className="h-20 w-full bg-slate-100 dark:bg-slate-800 rounded-2xl"></div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-100 dark:border-slate-700">
                                    <p className="font-bold text-slate-400 text-xs tracking-widest uppercase mb-1">Total Profile Views</p>
                                    <p className="text-2xl font-black">{stats?.profileViews || 0}</p>
                                </div>
                                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-100 dark:border-slate-700">
                                    <p className="font-bold text-slate-400 text-xs tracking-widest uppercase mb-1">Leads Unlocked</p>
                                    <p className="text-2xl font-black">{stats?.leadsUnlocked || 0}</p>
                                </div>
                                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-100 dark:border-slate-700">
                                    <p className="font-bold text-slate-400 text-xs tracking-widest uppercase mb-1">Average Rating</p>
                                    <div className="flex items-center justify-center gap-1">
                                        <p className="text-2xl font-black">{stats?.rating?.toFixed(1) || "5.0"}</p>
                                        <span className="material-symbols-outlined text-amber-500 text-lg">star</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}

export default function Analytics() {
    return (
        <Suspense fallback={<div className="p-10 text-center text-slate-500 font-bold animate-pulse">Loading Analytics...</div>}>
            <AnalyticsContent />
        </Suspense>
    );
}
