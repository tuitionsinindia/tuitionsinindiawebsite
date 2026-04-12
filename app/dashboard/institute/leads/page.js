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
    Zap, 
    Target, 
    Activity,
    ShieldCheck,
    CheckCircle2,
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
        <div className="flex min-h-screen bg-gray-50 font-sans text-gray-900 antialiased selection:bg-blue-600/10 relative overflow-hidden">
            {/* Ambient Background Strategy */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-600/[0.03] rounded-full blur-[160px]"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/[0.02] rounded-full blur-[140px]"></div>
            </div>

            <main className="flex-1 overflow-y-auto p-12 md:p-20 relative z-10">
                <div className="max-w-5xl mx-auto">
                    <Link href={`/dashboard/institute?instituteId=${instituteId}`} className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-gray-300 hover:text-blue-600 transition-all group italic mb-16">
                        <ArrowLeft size={16} className="group-hover:-translate-x-2 transition-transform" /> Back to Overview
                    </Link>

                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 mb-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
                        <div className="max-w-2xl relative">
                            <div className="absolute -left-20 top-0 text-[160px] font-black text-gray-100 leading-none tracking-tighter italic select-none pointer-events-none uppercase opacity-50">LEADS</div>
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full border border-blue-100 mb-8 relative z-10">
                                <Activity size={14} className="animate-pulse text-blue-600" />
                                <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] italic">Unlocked Tutors</span>
                            </div>
                            <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 uppercase italic leading-[0.85] text-gray-900 relative z-10">
                                Student Leads
                            </h1>
                            <p className="text-lg text-gray-400 font-bold leading-relaxed max-w-xl italic uppercase tracking-tighter opacity-80">
                                Managing acquired academic mandates for <span className="text-gray-900 font-black">Authorized Institute</span>. Direct contact protocol enabled.
                            </p>
                        </div>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            {[1, 2, 4].map(i => <div key={i} className="h-64 bg-white rounded-[3.5rem] animate-pulse border border-gray-100 shadow-4xl shadow-blue-900/[0.02]"></div>)}
                        </div>
                    ) : students.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            {students.map(student => (
                                <div key={student.id} className="group relative bg-white border border-gray-100 rounded-[3.5rem] p-12 hover:border-blue-600/30 transition-all duration-700 overflow-hidden shadow-4xl shadow-blue-900/[0.02] flex flex-col min-h-[450px]">
                                    <div className="relative z-10 flex flex-col h-full">
                                        <div className="flex justify-between items-center mb-10 italic">
                                            <div className="flex items-center gap-4">
                                                <div className="size-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-2xl italic shadow-2xl shadow-blue-600/20">
                                                    {student.name ? student.name[0].toUpperCase() : 'S'}
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-black text-gray-900 uppercase italic tracking-tighter leading-none mb-1 group-hover:text-blue-600 transition-colors">{student.name || 'Anonymous'}</h3>
                                                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest leading-none">{student.subject || 'GENERAL ACADEMICS'}</p>
                                                </div>
                                            </div>
                                            <div className="px-5 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-emerald-100 shadow-sm">Established_Link</div>
                                        </div>

                                        <div className="p-10 bg-gray-50 rounded-[2.5rem] border border-gray-100 space-y-6 mb-10 shadow-inner relative overflow-hidden">
                                            <div className="flex items-center gap-4 group/item">
                                                <div className="size-10 bg-white rounded-xl flex items-center justify-center text-gray-300 group-hover/item:text-blue-600 border border-gray-50 shadow-sm transition-colors">
                                                    <Phone size={16} strokeWidth={3} />
                                                </div>
                                                <p className="text-sm font-black text-gray-900 tabular-nums italic tracking-tighter">{student.phone}</p>
                                            </div>
                                            <div className="flex items-center gap-4 group/item">
                                                <div className="size-10 bg-white rounded-xl flex items-center justify-center text-gray-300 group-hover/item:text-blue-600 border border-gray-50 shadow-sm transition-colors">
                                                    <Mail size={16} strokeWidth={3} />
                                                </div>
                                                <p className="text-sm font-black text-gray-400 lowercase italic tracking-tighter truncate">{student.email}</p>
                                            </div>
                                            <div className="flex items-center gap-4 group/item">
                                                <div className="size-10 bg-white rounded-xl flex items-center justify-center text-gray-300 group-hover/item:text-blue-600 border border-gray-50 shadow-sm transition-colors">
                                                    <MapPin size={16} strokeWidth={3} />
                                                </div>
                                                <p className="text-sm font-black text-gray-400 uppercase italic tracking-tighter leading-none">{student.location || 'GLOBAL NODE'}</p>
                                            </div>
                                        </div>

                                        <div className="mt-auto pt-10 border-t border-gray-50 flex gap-4">
                                            <button className="flex-1 px-8 py-5 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] hover:bg-gray-900 transition-all active:scale-95 shadow-2xl shadow-blue-600/20 italic flex items-center justify-center gap-3">
                                                <Target size={14} strokeWidth={3} /> Assign Expert
                                            </button>
                                            <a href={`tel:${student.phone}`} className="size-16 bg-gray-50 text-gray-300 hover:text-blue-600 hover:bg-white border border-gray-100 rounded-2xl flex items-center justify-center transition-all group/call">
                                                <Phone size={24} strokeWidth={3} className="group-hover/call:scale-110 transition-transform" />
                                            </a>
                                        </div>
                                    </div>
                                    <div className="absolute -bottom-16 -right-16 size-48 bg-blue-600/3 rounded-full blur-3xl group-hover:bg-blue-600/8 transition-colors"></div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-48 bg-white rounded-[4rem] border-4 border-dashed border-gray-100 flex flex-col items-center justify-center anim-fade-up">
                            <div className="relative mb-12">
                                <Users size={120} className="text-gray-100" strokeWidth={1} />
                                <div className="absolute inset-0 bg-blue-600/5 blur-[80px] rounded-full scale-150 animate-pulse"></div>
                            </div>
                            <h2 className="text-3xl font-black mb-4 uppercase italic tracking-tighter text-gray-900">Lead Registry Empty.</h2>
                            <p className="text-gray-400 mb-12 max-w-xs mx-auto font-black text-[10px] uppercase tracking-[0.3em] leading-relaxed italic">Student requirements matching your subjects will appear here.</p>
                            <Link href={`/dashboard/institute?instituteId=${instituteId}`} className="px-12 py-6 bg-blue-600 text-white font-black text-[10px] uppercase tracking-[0.4em] rounded-[2rem] shadow-2xl shadow-blue-600/30 hover:bg-gray-900 transition-all italic">
                                Calibrate Discovery Feed
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
            <div className="flex items-center justify-center min-h-screen bg-gray-50 font-sans overflow-hidden italic text-blue-600">
                 <div className="flex flex-col items-center gap-10">
                    <div className="size-24 rounded-[3.5rem] bg-blue-50 border-2 border-blue-100 flex items-center justify-center animate-spin-slow shadow-3xl shadow-blue-900/10">
                        <Loader2 size={32} className="animate-pulse" strokeWidth={3} />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.8em] animate-pulse">Loading leads...</p>
                 </div>
            </div>
        }>
            <InstituteLeadsContent />
        </Suspense>
    );
}
