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
        <div className="flex min-h-screen bg-gray-50 font-sans">
            <main className="flex-1 overflow-y-auto p-6">
                <div className="max-w-4xl mx-auto">
                    <Link href={`/dashboard/tutor?tutorId=${tutorId}`} className="flex items-center gap-2 text-blue-600 font-bold mb-8 hover:underline">
                        <span className="material-symbols-outlined text-sm">arrow_back</span> Back to Dashboard
                    </Link>

                    {activeChat ? (
                        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                            <ChatInterface studentId={activeChat} tutorId={tutorId} currentUserType="TUTOR" />
                        </div>
                    ) : (
                        <div>
                            <div className="flex items-center gap-4 mb-8">
                                <div className="size-14 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 shrink-0">
                                    <span className="material-symbols-outlined text-3xl">groups</span>
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">My Students</h1>
                                    <p className="text-gray-500 text-sm">Students whose contact details you have unlocked.</p>
                                </div>
                            </div>

                            {loading ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {[1, 2, 4].map(i => <div key={i} className="h-48 bg-white rounded-2xl animate-pulse border border-gray-200"></div>)}
                                </div>
                            ) : students.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {students.map(student => (
                                        <div key={student.id} className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="size-11 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-500">
                                                    {student.name ? student.name[0].toUpperCase() : 'S'}
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-gray-900">{student.name || 'Anonymous Student'}</h3>
                                                    <p className="text-xs font-semibold text-blue-600">{student.subject}</p>
                                                </div>
                                            </div>

                                            <div className="space-y-2 mb-4">
                                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                                    <span className="material-symbols-outlined text-[18px]">call</span> {student.phone}
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                                    <span className="material-symbols-outlined text-[18px]">location_on</span> {student.location}
                                                </div>
                                            </div>

                                            <div className="flex gap-2">
                                                <a href={`tel:${student.phone}`} className="flex-1 py-2.5 bg-gray-50 border border-gray-200 text-gray-700 rounded-xl text-center text-sm font-semibold hover:bg-gray-100 transition-colors">Call</a>
                                                <Link href={`/dashboard/tutor/students?tutorId=${tutorId}&activeChat=${student.id}`} className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl text-center text-sm font-semibold hover:bg-blue-700 transition-colors">Message</Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
                                    <div className="size-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mx-auto mb-4">
                                        <span className="material-symbols-outlined text-4xl">person_search</span>
                                    </div>
                                    <h2 className="text-lg font-semibold text-gray-900 mb-2">No students yet</h2>
                                    <p className="text-gray-500 mb-6 max-w-xs mx-auto text-sm">Browse available leads in your dashboard and use credits to connect with students.</p>
                                    <Link href={`/dashboard/tutor?tutorId=${tutorId}`} className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors">Browse Leads</Link>
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
        <Suspense fallback={<div className="p-10 text-center text-gray-500 font-semibold animate-pulse">Loading students...</div>}>
            <StudentsContent />
        </Suspense>
    );
}
