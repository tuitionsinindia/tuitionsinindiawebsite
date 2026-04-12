"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, ArrowLeft, ShieldCheck, Lock, Award, Activity, Zap } from "lucide-react";
import LeadCaptureFlow from "../../components/LeadCaptureFlow";
import TutorListingForm from "../../components/TutorListingForm";

export default function TutorRegisterPage() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [step, setStep] = useState(1); // 1: Capture, 2: Listing, 3: Success

    const handleLeadComplete = (verifiedUser) => {
        setUser(verifiedUser);
        setStep(2);
    };

    const handleListingComplete = () => {
        setStep(3);
    };

    const handleFinalize = () => {
        router.push("/dashboard/tutor?tutorId=" + user.id);
    };

    return (
        <div className="h-screen overflow-y-auto snap-y snap-mandatory bg-gray-50 text-gray-900 antialiased font-sans selection:bg-blue-500/30 selection:text-blue-900">
            <section className="min-h-screen snap-start snap-always flex flex-col items-center justify-center py-12 px-4 relative overflow-hidden">
                
                {/* Institutional Backdrop */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[800px] bg-blue-600/5 rounded-full blur-[140px] -z-0 animate-pulse"></div>
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-600/20 to-transparent"></div>

                <div className="w-full max-w-4xl mx-auto flex flex-col items-center relative z-10">
                    
                    {/* Synchronized Header */}
                    <div className="text-center mb-12 space-y-6">
                        <Link href="/register" className="inline-flex items-center gap-3 text-[10px] font-black text-gray-300 hover:text-blue-600 transition-all mb-4 uppercase tracking-[0.4em] italic leading-none">
                            <ArrowLeft size={16} strokeWidth={3} /> Return to Portal Selection
                        </Link>
                        
                        <div className="flex items-center justify-center">
                            <div className="size-20 rounded-3xl bg-white text-blue-600 flex items-center justify-center shadow-2xl shadow-blue-900/10 border border-gray-100 relative group">
                                <div className="absolute inset-0 bg-blue-600/5 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <Award size={40} strokeWidth={1.5} className="relative z-10" />
                            </div>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter uppercase italic leading-[0.85]">
                            Faculty <br/><span className="text-blue-600 underline decoration-blue-600/10 underline-offset-8">Enrollment.</span>
                        </h1>
                        
                        <p className="text-gray-400 font-black text-[10px] max-w-lg mx-auto uppercase tracking-[0.2em] leading-relaxed italic">
                            {step === 1 && "Start your professional journey by verifying your institutional identity."}
                            {step === 2 && "Calibrate your faculty profile to start receiving academic mandates."}
                            {step === 3 && "Finalize privacy controls and visibility protocols."}
                        </p>
                    </div>

                    {/* Operational Interface */}
                    <div className="w-full max-w-2xl bg-white border border-gray-100 p-8 md:p-12 rounded-[3.5rem] shadow-4xl shadow-blue-900/10 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-gray-50">
                            <div 
                                className="h-full bg-blue-600 transition-all duration-1000 ease-out shadow-[0_0_20px_rgba(37,99,235,0.3)]" 
                                style={{ width: `${(step / 3) * 100}%` }}
                            />
                        </div>

                        {step === 1 && (
                            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                                <LeadCaptureFlow initialRole="TUTOR" onComplete={handleLeadComplete} />
                            </div>
                        )}

                        {step === 2 && (
                            <div className="animate-in zoom-in-95 duration-700">
                                <TutorListingForm user={user} onComplete={handleListingComplete} />
                            </div>
                        )}

                        {step === 3 && (
                            <div className="w-full max-w-md mx-auto flex items-center justify-center">
                                <div className="animate-in zoom-in-95 duration-500 text-center space-y-8">
                                    <div className="size-24 rounded-[2.5rem] bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-6 shadow-inner border border-blue-100">
                                        <ShieldCheck size={48} strokeWidth={1.5} />
                                    </div>
                                    <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase italic leading-none">Privacy Registry</h2>
                                    <p className="text-gray-400 font-medium text-[10px] leading-relaxed uppercase tracking-widest italic">
                                        As a verified faculty member, we prioritize your professional visibility while protecting your identity. You can toggle public data visibility in your control center at any time.
                                    </p>
                                    
                                    <div className="p-6 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-between">
                                        <div className="text-left">
                                            <p className="font-black text-gray-900 text-[10px] uppercase tracking-widest mb-1">Visibility Status</p>
                                            <p className="text-blue-600 text-[10px] font-black uppercase tracking-[0.2em] italic">SYNCED: PUBLIC_DIRECTORY</p>
                                        </div>
                                        <div className="size-10 rounded-xl bg-white border border-gray-100 text-blue-600 flex items-center justify-center shadow-lg">
                                            <Lock size={20} strokeWidth={3} />
                                        </div>
                                    </div>

                                    <button 
                                        onClick={handleFinalize}
                                        className="w-full py-6 bg-blue-600 text-white rounded-[2rem] font-black text-xs shadow-2xl shadow-blue-600/30 hover:bg-gray-900 transition-all active:scale-95 uppercase tracking-[0.4em] italic"
                                    >
                                        ENTER HUB <Zap size={16} fill="currentColor" className="inline ml-2" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                
                    {/* Progress Status Bar */}
                    <div className="mt-16 flex items-center justify-center gap-10">
                        {[
                            { id: 1, label: "IDENTITY" },
                            { id: 2, label: "LISTING" },
                            { id: 3, label: "PRIVACY" }
                        ].map((s) => (
                            <div key={s.id} className="flex flex-col items-center gap-3">
                                <div 
                                    className={`h-1 transition-all duration-1000 ${
                                        s.id === step 
                                        ? "w-20 bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.4)]" 
                                        : s.id < step ? "w-12 bg-gray-200" : "w-6 bg-gray-100"
                                    } rounded-full`}
                                />
                                <span className={`text-[10px] font-black uppercase tracking-widest leading-none ${s.id === step ? "text-blue-600" : "text-gray-300"}`}>
                                    {s.label}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Operational Footer */}
                    <div className="mt-16 flex items-center gap-4 px-6 py-3 bg-white rounded-full border border-gray-100 text-[10px] font-black text-gray-300 uppercase tracking-[0.5em] italic shadow-sm">
                        <Activity size={12} strokeWidth={3} className="animate-pulse text-blue-600" /> 
                        FACULTY_SYNC_INITIATED
                    </div>
                </div>
            </section>
        </div>
    );
}

