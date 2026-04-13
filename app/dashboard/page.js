"use client";

import Link from "next/link";
import { User, ShieldCheck, GraduationCap } from "lucide-react";

export default function DashboardPortal() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 font-sans">
            <div className="max-w-4xl w-full text-center">
                <div className="mb-10">
                    <span className="bg-blue-600 text-white text-xs font-semibold px-4 py-2 rounded-full inline-block mb-6">
                        Go to Dashboard
                    </span>
                    <h1 className="text-3xl font-bold text-gray-900 mb-3">Choose your dashboard</h1>
                    <p className="text-gray-500 text-base max-w-sm mx-auto">Select whether you are a student or a tutor to continue.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                    {/* Student Portal */}
                    <Link href="/dashboard/student" className="group bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 flex flex-col text-center">
                        <div className="size-16 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-5 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                            <User size={32} strokeWidth={1.5} />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">Student Dashboard</h2>
                        <ul className="text-left text-gray-500 space-y-2 mb-8 mx-auto text-sm leading-relaxed">
                            <li className="flex gap-3 items-center"><ShieldCheck size={14} className="text-blue-600 shrink-0" /> Find verified tutors near you</li>
                            <li className="flex gap-3 items-center"><ShieldCheck size={14} className="text-blue-600 shrink-0" /> Track your enquiries</li>
                        </ul>
                        <div className="mt-auto py-3 bg-gray-50 rounded-xl text-blue-600 font-semibold text-sm group-hover:bg-blue-600 group-hover:text-white transition-all">
                            Go to Student Dashboard
                        </div>
                    </Link>

                    {/* Tutor Portal */}
                    <Link href="/dashboard/tutor" className="group bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 flex flex-col text-center">
                        <div className="size-16 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-5 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                            <GraduationCap size={32} strokeWidth={1.5} />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">Tutor Dashboard</h2>
                        <ul className="text-left text-gray-500 space-y-2 mb-8 mx-auto text-sm leading-relaxed">
                            <li className="flex gap-3 items-center"><ShieldCheck size={14} className="text-blue-600 shrink-0" /> View and reply to enquiries</li>
                            <li className="flex gap-3 items-center"><ShieldCheck size={14} className="text-blue-600 shrink-0" /> Track your profile performance</li>
                        </ul>
                        <div className="mt-auto py-3 bg-gray-50 rounded-xl text-blue-600 font-semibold text-sm group-hover:bg-blue-600 group-hover:text-white transition-all">
                            Get Started
                        </div>
                    </Link>
                </div>

                <div className="mt-10 text-sm text-gray-400">
                    New here? <Link href="/register" className="text-blue-600 hover:underline font-medium">Sign Up Free</Link>
                </div>
            </div>
        </div>
    );
}
