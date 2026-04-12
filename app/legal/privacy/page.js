"use client";

import Link from "next/link";
import { ShieldCheck, Lock, ArrowLeft, ScrollText, CheckCircle2 } from "lucide-react";

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-white text-gray-900 font-sans pb-32 pt-10">
            {/* Header */}
            <div className="max-w-7xl mx-auto px-6 py-12 flex items-center justify-between border-b border-gray-100 mb-24">
                <Link href="/" className="flex items-center gap-4 text-xs font-black uppercase tracking-[0.4em] text-gray-400 hover:text-blue-600 transition-all hover:-translate-x-2">
                    <ArrowLeft size={16} /> Back to Home
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
                        <span className="text-xs font-black uppercase tracking-[0.3em] italic">Last updated: April 2026</span>
                    </div>
                    <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-gray-900 tracking-tighter uppercase italic leading-[0.8] mb-12">
                        Privacy <br /> <span className="text-blue-600 underline decoration-blue-600/10 decoration-[16px] underline-offset-8">Policy.</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-400 font-medium italic leading-relaxed max-w-2xl opacity-80">
                        This policy explains how TuitionsInIndia collects, uses, and protects your personal information when you use our platform.
                    </p>
                </div>

                {/* Policy Sections */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 mb-32">
                    <div className="space-y-8 flex flex-col items-start group">
                        <div className="size-20 rounded-3xl bg-gray-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner border border-gray-100">
                            <Lock size={32} strokeWidth={1} />
                        </div>
                        <h2 className="text-2xl font-black text-gray-900 uppercase italic tracking-tighter underline decoration-blue-600/10 decoration-8 underline-offset-4">01. Data Security</h2>
                        <p className="text-gray-500 leading-relaxed font-medium italic text-lg">
                            We use end-to-end encryption to keep your personal information and communications private and secure at all times.
                        </p>
                    </div>

                    <div className="space-y-8 flex flex-col items-start group">
                        <div className="size-20 rounded-3xl bg-gray-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner border border-gray-100">
                            <ScrollText size={32} strokeWidth={1} />
                        </div>
                        <h2 className="text-2xl font-black text-gray-900 uppercase italic tracking-tighter underline decoration-blue-600/10 decoration-8 underline-offset-4">02. Data We Collect</h2>
                        <p className="text-gray-500 leading-relaxed font-medium italic text-lg">
                            We collect information such as your name, phone number, and academic details only to verify your profile and connect you with the right match.
                        </p>
                    </div>

                    <div className="space-y-8 flex flex-col items-start group">
                        <div className="size-20 rounded-3xl bg-gray-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner border border-gray-100">
                            <CheckCircle2 size={32} strokeWidth={1} />
                        </div>
                        <h2 className="text-2xl font-black text-gray-900 uppercase italic tracking-tighter underline decoration-blue-600/10 decoration-8 underline-offset-4">03. Your Privacy</h2>
                        <p className="text-gray-500 leading-relaxed font-medium italic text-lg">
                            Your contact details are only shared with other users after you choose to connect with them. TuitionsInIndia does not store your payment details.
                        </p>
                    </div>

                    <div className="space-y-8 flex flex-col items-start group">
                        <div className="size-20 rounded-3xl bg-gray-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner border border-gray-100">
                            <ShieldCheck size={32} strokeWidth={1} />
                        </div>
                        <h2 className="text-2xl font-black text-gray-900 uppercase italic tracking-tighter underline decoration-blue-600/10 decoration-8 underline-offset-4">04. Your Rights</h2>
                        <p className="text-gray-500 leading-relaxed font-medium italic text-lg">
                            You have full control over your profile. You can deactivate it or request removal of your data at any time by contacting us.
                        </p>
                    </div>
                </div>

                {/* Contact Section */}
                <div className="p-16 md:p-24 bg-gray-50/50 rounded-[4rem] border border-gray-100 flex flex-col lg:flex-row items-center justify-between gap-16 group transition-all hover:border-blue-600/20 hover:bg-white relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-2 h-full bg-blue-600 opacity-10"></div>
                    <div className="space-y-6 relative z-10 max-w-xl">
                        <h3 className="text-xs font-black uppercase tracking-[0.5em] text-blue-600/40 group-hover:text-blue-600 transition-colors italic">Contact Us</h3>
                        <p className="text-3xl md:text-5xl font-black text-gray-900 uppercase italic tracking-tighter leading-none mb-6">Privacy <br /> Questions?</p>
                        <p className="text-gray-400 font-medium italic text-lg leading-relaxed">For privacy enquiries or data removal requests, contact our team at <span className="text-blue-600 font-bold border-b border-blue-600/10 pb-1">privacy@tuitionsinindia.com</span></p>
                    </div>
                    <div className="size-32 md:size-40 rounded-[3rem] bg-white border border-gray-100 flex items-center justify-center text-blue-600 shadow-2xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shrink-0">
                        <ShieldCheck size={56} strokeWidth={0.5} />
                    </div>
                </div>
            </main>
        </div>
    );
}
