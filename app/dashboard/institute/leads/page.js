"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
    ArrowLeft,
    Phone,
    Mail,
    MapPin,
    Users,
    Target,
    MessageCircle,
    Loader2
} from "lucide-react";

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
        <div className="flex min-h-screen bg-gray-50 font-sans text-gray-900">
            <main className="flex-1 overflow-y-auto p-6 md:p-10">
                <div className="max-w-4xl mx-auto">
                    <Link
                        href={`/dashboard/institute?instituteId=${instituteId}`}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-blue-600 transition-colors group mb-8"
                    >
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
                    </Link>

                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-gray-900">Student contacts</h1>
                        <p className="text-sm text-gray-500 mt-1">Students you have unlocked and can contact directly.</p>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {[1, 2, 4].map(i => <div key={i} className="h-48 bg-white rounded-2xl animate-pulse border border-gray-100 shadow-sm"></div>)}
                        </div>
                    ) : students.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {students.map(student => (
                                <div key={student.id} className="group bg-white border border-gray-200 rounded-2xl p-5 hover:border-blue-200 transition-all shadow-sm flex flex-col">
                                    <div className="flex items-center gap-4 mb-5">
                                        <div className="size-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-xl shadow-sm">
                                            {student.name ? student.name[0].toUpperCase() : 'S'}
                                        </div>
                                        <div>
                                            <h3 className="text-base font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{student.name || 'Student'}</h3>
                                            <p className="text-xs font-semibold text-blue-600">{student.subject || 'General'}</p>
                                        </div>
                                        <span className="ml-auto px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-xs font-semibold border border-emerald-100">Unlocked</span>
                                    </div>

                                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-3 mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="size-8 bg-white rounded-lg flex items-center justify-center text-gray-400 border border-gray-100 shadow-sm">
                                                <Phone size={14} strokeWidth={2} />
                                            </div>
                                            <p className="text-sm font-semibold text-gray-900">{student.phone}</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="size-8 bg-white rounded-lg flex items-center justify-center text-gray-400 border border-gray-100 shadow-sm">
                                                <Mail size={14} strokeWidth={2} />
                                            </div>
                                            <p className="text-sm text-gray-600 truncate">{student.email}</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="size-8 bg-white rounded-lg flex items-center justify-center text-gray-400 border border-gray-100 shadow-sm">
                                                <MapPin size={14} strokeWidth={2} />
                                            </div>
                                            <p className="text-sm text-gray-600">{student.location || 'Location not shared'}</p>
                                        </div>
                                    </div>

                                    <div className="mt-auto flex gap-3">
                                        <button className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
                                            <Target size={14} strokeWidth={2} /> Assign Tutor
                                        </button>
                                        <a href={`tel:${student.phone}`} className="size-10 bg-gray-50 text-gray-400 hover:text-blue-600 hover:bg-blue-50 border border-gray-200 rounded-xl flex items-center justify-center transition-all">
                                            <Phone size={16} strokeWidth={2} />
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-24 bg-white rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center">
                            <Users size={48} className="text-gray-200 mb-4" strokeWidth={1.5} />
                            <h2 className="text-lg font-semibold text-gray-900 mb-2">No students yet</h2>
                            <p className="text-gray-400 mb-8 max-w-xs mx-auto text-sm">Student enquiries matching your subjects will appear here once you unlock them.</p>
                            <Link href={`/dashboard/institute?instituteId=${instituteId}`} className="px-6 py-2.5 bg-blue-600 text-white font-semibold text-sm rounded-xl shadow-sm hover:bg-blue-700 transition-all">
                                View Student Leads
                            </Link>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default function InstituteLeads() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen bg-gray-50 font-sans">
                <div className="flex flex-col items-center gap-4 text-gray-400">
                    <div className="size-10 rounded-full border-4 border-gray-200 border-t-blue-600 animate-spin"></div>
                    <p className="text-sm font-medium">Loading leads...</p>
                </div>
            </div>
        }>
            <InstituteLeadsContent />
        </Suspense>
    );
}
