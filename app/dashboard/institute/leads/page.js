"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function InstituteLeadsContent() {
    const searchParams = useSearchParams();
    const instituteId = searchParams.get("instituteId");
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (instituteId) {
            fetchLeads();
        }
    }, [instituteId]);

    const fetchLeads = async () => {
        try {
            const res = await fetch(`/api/tutor/my-students?tutorId=${instituteId}`);
            if (res.ok) {
                const data = await res.json();
                setStudents(data);
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
                    <Link href={`/dashboard/institute?instituteId=${instituteId}`} className="flex items-center gap-2 text-indigo-600 font-bold mb-8 hover:underline">
                        <span className="material-symbols-outlined text-sm">arrow_back</span> Back to Overview
                    </Link>

                    <div className="flex items-center gap-6 mb-10">
                        <div className="size-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-600 shrink-0">
                            <span className="material-symbols-outlined text-3xl">ads_click</span>
                        </div>
                        <div>
                            <h1 className="text-3xl font-heading font-bold">Unlocked Student Leads</h1>
                            <p className="text-slate-500 font-medium">Manage and assign students whose contact details your institute has unlocked.</p>
                        </div>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[1, 2, 4].map(i => <div key={i} className="h-48 bg-white dark:bg-slate-900 rounded-3xl animate-pulse border border-slate-100 dark:border-slate-800"></div>)}
                        </div>
                    ) : students.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {students.map(student => (
                                <div key={student.id} className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="flex items-center gap-3">
                                            <div className="size-10 rounded-full bg-indigo-50 dark:bg-slate-800 flex items-center justify-center font-black text-indigo-600">
                                                {student.name ? student.name[0].toUpperCase() : 'S'}
                                            </div>
                                            <div>
                                                <h3 className="font-bold">{student.name || 'Anonymous'}</h3>
                                                <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">{student.subject}</p>
                                            </div>
                                        </div>
                                        <div className="px-2 py-1 bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase rounded">Unlocked</div>
                                    </div>

                                    <div className="space-y-2 mb-6 text-sm text-slate-500">
                                        <div className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-[16px]">call</span> {student.phone}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-[16px]">mail</span> {student.email}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-[16px]">location_on</span> {student.location}
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-slate-50 dark:border-slate-800 flex gap-2">
                                        <button className="flex-1 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold shadow-md shadow-indigo-200">Assign Instructor</button>
                                        <a href={`tel:${student.phone}`} className="px-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-lg text-slate-400 hover:text-indigo-600 transition-colors">
                                            <span className="material-symbols-outlined text-lg">call</span>
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
                            <h2 className="text-xl font-bold mb-2">No active leads</h2>
                            <p className="text-slate-500 mb-8 max-w-xs mx-auto">Unlocked leads will appear here for assignment to your faculty.</p>
                            <Link href={`/dashboard/institute?instituteId=${instituteId}`} className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20">Browse Lead Directory</Link>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default function InstituteLeads() {
    return (
        <Suspense fallback={<div className="p-10 text-center text-slate-500 font-bold animate-pulse">Loading Unlocked Leads...</div>}>
            <InstituteLeadsContent />
        </Suspense>
    );
}
