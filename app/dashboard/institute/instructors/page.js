"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function InstructorsContent() {
    const searchParams = useSearchParams();
    const instituteId = searchParams.get("instituteId");
    const [loading, setLoading] = useState(false);

    return (
        <div className="flex h-screen bg-slate-50 dark:bg-slate-950 font-sans">
            <main className="flex-1 overflow-y-auto p-10">
                <div className="max-w-4xl mx-auto">
                    <Link href={`/dashboard/institute?instituteId=${instituteId}`} className="flex items-center gap-2 text-indigo-600 font-bold mb-8 hover:underline">
                        <span className="material-symbols-outlined text-sm">arrow_back</span> Back to Overview
                    </Link>

                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-10 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/20 text-center">
                        <div className="size-20 bg-indigo-500/10 rounded-full flex items-center justify-center text-indigo-500 mx-auto mb-6">
                            <span className="material-symbols-outlined text-4xl">groups</span>
                        </div>
                        <h1 className="text-3xl font-heading font-bold mb-4">Instructor Management</h1>
                        <p className="text-slate-500 mb-8 max-w-lg mx-auto">Add and manage your institute's teaching staff. Assign instructors to leads and track their session performance.</p>

                        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-8 border border-dashed border-slate-300 dark:border-slate-700 text-center">
                            <div className="size-12 bg-white dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                                <span className="material-symbols-outlined">add_circle</span>
                            </div>
                            <h3 className="font-bold text-slate-900 dark:text-white mb-2">No instructors added yet</h3>
                            <p className="text-sm text-slate-500 mb-6">Start by adding your first faculty member to assign them student leads.</p>
                            <button className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20">Add Instructor</button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default function Instructors() {
    return (
        <Suspense fallback={<div className="p-10 text-center text-slate-500 font-bold animate-pulse">Loading Instructors...</div>}>
            <InstructorsContent />
        </Suspense>
    );
}
