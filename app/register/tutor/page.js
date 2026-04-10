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
        router.push("/dashboard/tutor");
    };

    return (
        <div className="h-screen overflow-y-auto snap-y snap-mandatory bg-background-dark text-on-background-dark antialiased font-sans selection:bg-amber-500/30 selection:text-white">
            <section className="min-h-screen snap-start snap-always flex flex-col items-center justify-center py-12 px-4 relative overflow-hidden">
                
                {/* Tactical Backdrop */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[800px] bg-amber-500/5 rounded-full blur-[140px] -z-0 animate-pulse"></div>
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500/20 to-transparent"></div>

                <div className="w-full max-w-4xl mx-auto flex flex-col items-center relative z-10">
                    
                    {/* Synchronized Header */}
                    <div className="text-center mb-12 space-y-6">
                        <Link href="/register" className="inline-flex items-center gap-3 text-[10px] font-black text-white/20 hover:text-amber-500 transition-all mb-4 uppercase tracking-[0.4em] italic leading-none">
                            <ArrowLeft size={16} strokeWidth={3} /> RECONFIGURE ENTITY LOGIC
                        </Link>
                        
                        <div className="flex items-center justify-center">
                            <div className="size-20 rounded-3xl bg-amber-500/10 text-amber-500 flex items-center justify-center shadow-inner border border-amber-500/20 relative group">
                                <div className="absolute inset-0 bg-amber-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <Award size={40} strokeWidth={1.5} className="relative z-10" />
                            </div>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase italic leading-[0.85]">
                            Faculty <br/><span className="text-amber-500 underline decoration-amber-500/20 underline-offset-8">Mobilization.</span>
                        </h1>
                        
                        <p className="text-white/40 font-black text-[11px] max-w-lg mx-auto uppercase tracking-[0.2em] leading-relaxed italic">
                            {step === 1 && "Start your journey as an expert by verifying your identity via secure synchronization."}
                            {step === 2 && "Setup your professional profile to start receiving academic mandates."}
                            {step === 3 && "Finalize privacy controls and visibility protocols."}
                        </p>
                    </div>

                    {/* Terminal Flow Interface */}
                    <div className="w-full max-w-2xl bg-surface-dark/40 backdrop-blur-3xl border border-border-dark p-8 md:p-12 rounded-[3.5rem] shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-background-dark/50">
                            <div 
                                className="h-full bg-amber-500 transition-all duration-1000 ease-out shadow-[0_0_20px_rgba(245,158,11,0.5)]" 
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
                                    <div className="size-24 rounded-[2.5rem] bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto mb-6 shadow-inner border border-emerald-500/20">
                                        <ShieldCheck size={48} strokeWidth={1.5} />
                                    </div>
                                    <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic leading-none">Privacy Standards</h2>
                                    <p className="text-white/40 font-medium text-xs leading-relaxed uppercase tracking-widest italic">
                                        As a verified tutor, we prioritize your professional visibility while protecting your identity. You can toggle public data visibility in your control center at any time.
                                    </p>
                                    
                                    <div className="p-6 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between">
                                        <div className="text-left">
                                            <p className="font-black text-white text-[10px] uppercase tracking-widest mb-1">Profile Visibility</p>
                                            <p className="text-white/20 text-[8px] font-black uppercase tracking-[0.2em] italic">SYNCED: PUBLIC_DIRECTORY</p>
                                        </div>
                                        <div className="size-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-lg">
                                            <Lock size={20} strokeWidth={3} />
                                        </div>
                                    </div>

                                    <button 
                                        onClick={handleFinalize}
                                        className="w-full py-6 bg-amber-500 text-white rounded-[2rem] font-black text-xs shadow-xl hover:bg-white hover:text-amber-500 transition-all active:scale-95 uppercase tracking-[0.4em] italic"
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
                                        ? "w-20 bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)]" 
                                        : s.id < step ? "w-12 bg-white/30" : "w-6 bg-white/5"
                                    } rounded-full`}
                                />
                                <span className={`text-[9px] font-black uppercase tracking-widest leading-none ${s.id === step ? "text-amber-500" : "text-white/20"}`}>
                                    {s.label}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Operational Footer */}
                    <div className="mt-16 flex items-center gap-4 px-6 py-3 bg-white/5 rounded-full border border-white/5 text-[9px] font-black text-white/20 uppercase tracking-[0.5em] italic">
                        <Activity size={12} strokeWidth={3} className="animate-pulse text-amber-500" /> 
                        SYSTEM_STATUS: FACULTY_SYNC_INITIATED
                    </div>
                </div>
            </section>
        </div>
    );
}

