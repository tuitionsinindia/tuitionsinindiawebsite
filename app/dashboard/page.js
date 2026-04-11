"use client";

import Link from "next/link";
import { User, ShieldCheck, GraduationCap, ArrowRight } from "lucide-react";

export default function DashboardPortal() {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 relative font-sans">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-transparent pointer-events-none"></div>

            <div className="max-w-4xl w-full z-10 text-center">
                <div className="mb-12">
                    <span className="bg-blue-600 text-white text-xs font-black px-5 py-2 rounded-full uppercase tracking-[0.4em] inline-block shadow-lg mb-8">
                        Access Neural Grid
                    </span>
                    <h1 className="mb-6">Portal <span className="text-blue-600">Entry</span></h1>
                    <p className="text-gray-500 font-medium text-base max-w-sm mx-auto italic uppercase tracking-widest opacity-60">Select your operational identity to synchronize with discovery streams.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                    {/* Student Portal */}
                    <Link href="/dashboard/student" className="group bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm hover:shadow-4xl transition-all hover:-translate-y-1 relative overflow-hidden flex flex-col text-center">
                        <div className="size-16 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-6 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                            <User size={32} strokeWidth={1.5} />
                        </div>
                        <h2 className="text-2xl mb-4 italic">Student <span className="text-blue-600">Node</span></h2>
                        <ul className="text-left text-gray-400 space-y-3 mb-10 mx-auto text-xs font-black uppercase tracking-widest leading-relaxed">
                            <li className="flex gap-3 items-center"><ShieldCheck size={14} className="text-blue-600" /> Unlock Verified Nodes</li>
                            <li className="flex gap-3 items-center"><ShieldCheck size={14} className="text-blue-600" /> Manage Discoveries</li>
                        </ul>
                        <div className="mt-auto py-5 bg-gray-50 rounded-2xl text-blue-600 font-black text-xs uppercase tracking-widest group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                            Enter Grid
                        </div>
                    </Link>

                    {/* Tutor Portal */}
                    <Link href="/dashboard/tutor" className="group bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm hover:shadow-4xl transition-all hover:-translate-y-1 relative overflow-hidden flex flex-col text-center">
                        <div className="size-16 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-6 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                            <GraduationCap size={32} strokeWidth={1.5} />
                        </div>
                        <h2 className="text-2xl mb-4 italic">Faculty <span className="text-blue-600">Hub</span></h2>
                        <ul className="text-left text-gray-400 space-y-3 mb-10 mx-auto text-xs font-black uppercase tracking-widest leading-relaxed">
                            <li className="flex gap-3 items-center"><ShieldCheck size={14} className="text-blue-600" /> Sync Match Inquiries</li>
                            <li className="flex gap-3 items-center"><ShieldCheck size={14} className="text-blue-600" /> Optimize Analytics</li>
                        </ul>
                        <div className="mt-auto py-5 bg-gray-50 rounded-2xl text-blue-600 font-black text-xs uppercase tracking-widest group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                            Initialize Link
                        </div>
                    </Link>
                </div>

                <div className="mt-12 flex items-center justify-center gap-2 text-xs font-black text-gray-300 uppercase tracking-[0.5em] italic">
                    Establish New Identity? <Link href="/register" className="text-blue-600 hover:underline">Sync Registration Trace</Link>
                </div>
            </div>
        </div>
    );
}
