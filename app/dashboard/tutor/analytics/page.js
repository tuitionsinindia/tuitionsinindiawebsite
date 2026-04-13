"use client";

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
        <div className="flex min-h-screen bg-gray-50 font-sans">
            <main className="flex-1 overflow-y-auto p-6">
                <div className="max-w-4xl mx-auto">
                    <Link href={`/dashboard/tutor?tutorId=${tutorId}`} className="flex items-center gap-2 text-blue-600 font-bold mb-8 hover:underline">
                        <span className="material-symbols-outlined text-sm">arrow_back</span> Back to Dashboard
                    </Link>

                    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="size-14 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 shrink-0">
                                <span className="material-symbols-outlined text-3xl">analytics</span>
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Profile Stats</h1>
                                <p className="text-gray-500 text-sm">See how your profile is performing — views, leads, and rating.</p>
                            </div>
                        </div>

                        {loading ? (
                            <div className="animate-pulse space-y-3">
                                <div className="h-20 w-full bg-gray-100 rounded-xl"></div>
                                <div className="h-20 w-full bg-gray-100 rounded-xl"></div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                                    <p className="text-sm font-semibold text-gray-500 mb-1">Profile views</p>
                                    <p className="text-3xl font-bold text-gray-900">{stats?.profileViews || 0}</p>
                                </div>
                                <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                                    <p className="text-sm font-semibold text-gray-500 mb-1">Leads unlocked</p>
                                    <p className="text-3xl font-bold text-gray-900">{stats?.leadsUnlocked || 0}</p>
                                </div>
                                <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                                    <p className="text-sm font-semibold text-gray-500 mb-1">Average rating</p>
                                    <div className="flex items-center gap-1">
                                        <p className="text-3xl font-bold text-gray-900">{stats?.rating?.toFixed(1) || "5.0"}</p>
                                        <span className="material-symbols-outlined text-amber-400 text-xl">star</span>
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
        <Suspense fallback={<div className="p-10 text-center text-gray-500 font-semibold animate-pulse">Loading stats...</div>}>
            <AnalyticsContent />
        </Suspense>
    );
}
