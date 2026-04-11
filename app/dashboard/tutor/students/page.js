"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import ChatInterface from "@/app/components/ChatInterface";

function StudentsContent() {
    const searchParams = useSearchParams();
    const tutorId = searchParams.get("tutorId");
    const activeChat = searchParams.get("activeChat");
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (tutorId) {
            fetchStudents();
        }
    }, [tutorId]);

    const fetchStudents = async () => {
        try {
            const res = await fetch(`/api/tutor/my-students?tutorId=${tutorId}`);
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
                    <Link href={`/dashboard/tutor?tutorId=${tutorId}`} className="flex items-center gap-2 text-blue-600 font-bold mb-8 hover:underline">
                        <span className="material-symbols-outlined text-sm">arrow_back</span> Back to Dashboard
                    </Link>

                    {activeChat ? (
                        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-10 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/20">
                            <ChatInterface studentId={activeChat} tutorId={tutorId} currentUserType="TUTOR" />
                        </div>
                    ) : (
                        <div>
                            <div className="flex items-center gap-6 mb-10">
                                <div className="size-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shrink-0">
                                    <span className="material-symbols-outlined text-3xl">groups</span>
                                </div>
                                <div>
                                    <h1 className="text-3xl font-heading font-bold">My Student Connections</h1>
                                    <p className="text-slate-500 font-medium">Students whose contact details you've unlocked.</p>
                                </div>
                            </div>

                            {loading ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {[1, 2, 4].map(i => <div key={i} className="h-48 bg-white dark:bg-slate-900 rounded-3xl animate-pulse border border-slate-100 dark:border-slate-800"></div>)}
                                </div>
                            ) : students.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {students.map(student => (
                                        <div key={student.id} className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group">
                                            <div className="flex items-center gap-4 mb-6">
                                                <div className="size-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-black text-slate-400">
                                                    {student.name ? student.name[0].toUpperCase() : 'S'}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-lg">{student.name || 'Anonymous Student'}</h3>
                                                    <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">{student.subject}</p>
                                                </div>
                                            </div>

                                            <div className="space-y-2 mb-6">
                                                <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                                                    <span className="material-symbols-outlined text-[18px]">call</span> {student.phone}
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                                                    <span className="material-symbols-outlined text-[18px]">location_on</span> {student.location}
                                                </div>
                                            </div>

                                            <div className="flex gap-2">
                                                <a href={`tel:${student.phone}`} className="flex-1 py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl text-center text-xs font-bold hover:bg-slate-100 transition-colors">Call Now</a>
                                                <Link href={`/dashboard/tutor/students?tutorId=${tutorId}&activeChat=${student.id}`} className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl text-center text-xs font-bold hover:bg-blue-700 transition-all">Message</Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
                                    <div className="size-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-300 mx-auto mb-6">
                                        <span className="material-symbols-outlined text-4xl">person_search</span>
                                    </div>
                                    <h2 className="text-xl font-bold mb-2">No students yet</h2>
                                    <p className="text-slate-500 mb-8 max-w-xs mx-auto">Explore available leads in your dashboard and use credits to start teaching.</p>
                                    <Link href={`/dashboard/tutor?tutorId=${tutorId}`} className="px-8 py-3 bg-blue-600 text-white font-bold rounded-xl">Browse Leads</Link>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default function MyStudents() {
    return (
        <Suspense fallback={<div className="p-10 text-center text-slate-500 font-bold animate-pulse">Loading Connections...</div>}>
            <StudentsContent />
        </Suspense>
    );
}
