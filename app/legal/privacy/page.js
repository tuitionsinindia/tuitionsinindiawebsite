"use client";

import Link from "next/link";
import { ShieldCheck, Lock, ArrowLeft, FileText, ScrollText, CheckCircle2 } from "lucide-react";

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-blue-600/10 selection:text-blue-600 pb-32 pt-10">
            {/* Minimal Header */}
            <div className="max-w-7xl mx-auto px-6 py-12 flex items-center justify-between border-b border-gray-50 mb-24">
                <Link href="/" className="flex items-center gap-4 text-xs font-black uppercase tracking-[0.4em] text-gray-400 hover:text-blue-600 transition-all hover:-translate-x-2">
                    <ArrowLeft size={16} /> Return to Grid
                </Link>
                <div className="flex items-center gap-4 text-blue-600">
                    <ShieldCheck size={28} strokeWidth={1.5} />
                    <span className="text-xs font-black uppercase tracking-[0.2em] italic">Privacy Policy</span>
                </div>
            </div>

            <main className="max-w-4xl mx-auto px-6 lg:px-12">
                {/* Hero Header */}
                <div className="mb-28">
                    <div className="inline-flex items-center gap-3 px-5 py-2 bg-blue-50 text-blue-600 rounded-full border border-blue-100 mb-10">
                         <div className="size-2 bg-blue-600 rounded-full animate-pulse"></div>
                         <span className="text-xs font-black uppercase tracking-[0.3em] italic">Standard v5.2 Active</span>
                    </div>
                    <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-gray-900 tracking-tighter uppercase italic leading-[0.8] mb-12">
                        Privacy Policy
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-400 font-medium italic leading-relaxed max-w-2xl opacity-80">
                        This document explains how we collect, use, and protect your personal information. Last Audit: April 2026.
                    </p>
                </div>

                {/* Privacy Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 mb-32">
                    <div className="space-y-8 flex flex-col items-start group">
                        <div className="size-20 rounded-3xl bg-gray-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner border border-gray-100">
                            <Lock size={32} strokeWidth={1} />
                        </div>
                        <h2 className="text-2xl font-black text-gray-900 uppercase italic tracking-tighter underline decoration-blue-600/10 decoration-8 underline-offset-4">01. Data Security</h2>
                        <p className="text-gray-500 leading-relaxed font-medium italic text-lg">
                            We collect only the information necessary to connect students with tutors. Your data is encrypted and never shared without your consent.
                        </p>
                    </div>

                    <div className="space-y-8 flex flex-col items-start group">
                        <div className="size-20 rounded-3xl bg-gray-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner border border-gray-100">
                            <ScrollText size={32} strokeWidth={1} />
                        </div>
                        <h2 className="text-2xl font-black text-gray-900 uppercase italic tracking-tighter underline decoration-blue-600/10 decoration-8 underline-offset-4">02. Acquisition Audit</h2>
                        <p className="text-gray-500 leading-relaxed font-medium italic text-lg">
                            We acquire identifiers (Identity, Credentials, Contact Vectors) solely for node verification. Academic histories are audited via multi-staged pipelines.
                        </p>
                    </div>

                    <div className="space-y-8 flex flex-col items-start group">
                        <div className="size-20 rounded-3xl bg-gray-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner border border-gray-100">
                            <CheckCircle2 size={32} strokeWidth={1} />
                        </div>
                        <h2 className="text-2xl font-black text-gray-900 uppercase italic tracking-tighter underline decoration-blue-600/10 decoration-8 underline-offset-4">03. How We Use Your Data</h2>
                        <p className="text-gray-500 leading-relaxed font-medium italic text-lg">
                            Explicit contact fields remain encrypted until a formal link protocol is initialized. TuitionsInIndia does not participate in financial tolls or store payment assets.
                        </p>
                    </div>

                    <div className="space-y-8 flex flex-col items-start group">
                        <div className="size-20 rounded-3xl bg-gray-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner border border-gray-100">
                            <ShieldCheck size={32} strokeWidth={1} />
                        </div>
                        <h2 className="text-2xl font-black text-gray-900 uppercase italic tracking-tighter underline decoration-blue-600/10 decoration-8 underline-offset-4">04. Sovereignty Rights</h2>
                        <p className="text-gray-500 leading-relaxed font-medium italic text-lg">
                            Matchmaking profiles (nodes) are user-governed. You maintain 100% control over profile deactivation and discovery status within the live network grid.
                        </p>
                    </div>
                </div>

                {/* Contact Us */}
                <div className="p-16 md:p-24 bg-gray-50/50 rounded-[4rem] border border-gray-100 flex flex-col lg:flex-row items-center justify-between gap-16 group transition-all hover:border-blue-600/20 hover:bg-white relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-2 h-full bg-blue-600 opacity-10"></div>
                    <div className="space-y-6 relative z-10 max-w-xl">
                        <h3 className="text-xs font-black uppercase tracking-[0.5em] text-blue-600/40 group-hover:text-blue-600 transition-colors italic">Data Sovereignty Console</h3>
                        <p className="text-3xl md:text-5xl font-black text-gray-900 uppercase italic tracking-tighter leading-none mb-6">Questions About Privacy?</p>
                        <p className="text-gray-400 font-medium italic text-lg leading-relaxed">For protocol inquiries or data sovereignty audits, contact the network counsel at <span className="text-blue-600 font-bold border-b border-blue-600/10 pb-1">privacy@tuitionsinindia.com</span></p>
                    </div>
                    <div className="size-32 md:size-40 rounded-[3rem] bg-white border border-gray-100 flex items-center justify-center text-blue-600 shadow-2xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shrink-0">
                        <ShieldCheck size={56} strokeWidth={0.5} />
                    </div>
                </div>
            </main>
        </div>
    );
}
