"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { GraduationCap, ArrowLeft, ShieldCheck, Lock, Target, Zap, Activity } from "lucide-react";
import LeadCaptureFlow from "../../components/LeadCaptureFlow";
import RequirementForm from "../../components/RequirementForm";

export default function StudentRegisterPage() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [step, setStep] = useState(1); // 1: Identity/OTP, 2: Requirements

    const handleLeadComplete = (verifiedUser) => {
        setUser(verifiedUser);
        setStep(2);
    };

    const handleRequirementComplete = () => {
        router.push(`/dashboard/student?studentId=${user.id}&success=true`);
    };

    return (
        <div className="h-screen overflow-y-auto snap-y snap-mandatory bg-background-dark text-on-background-dark antialiased font-sans selection:bg-primary/30 selection:text-white">
            <section className="min-h-screen snap-start snap-always flex flex-col items-center justify-center py-12 px-4 relative overflow-hidden">
                
                {/* Tactical Backdrop */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[800px] bg-primary/5 rounded-full blur-[140px] -z-0 animate-pulse"></div>
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>

                <div className="w-full max-w-4xl mx-auto flex flex-col items-center relative z-10">
                    
                    {/* Synchronized Header */}
                    <div className="text-center mb-12 space-y-6">
                        <Link href="/register" className="inline-flex items-center gap-3 text-[10px] font-black text-white/20 hover:text-primary transition-all mb-4 uppercase tracking-[0.4em] italic leading-none">
                            <ArrowLeft size={16} strokeWidth={3} /> RECONFIGURE ENTITY LOGIC
                        </Link>
                        
                        <div className="flex items-center justify-center">
                            <div className="size-20 rounded-3xl bg-primary/10 text-primary flex items-center justify-center shadow-inner border border-primary/20 relative group">
                                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <GraduationCap size={40} strokeWidth={1.5} className="relative z-10" />
                            </div>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase italic leading-[0.85]">
                            Scholarly <br/><span className="text-primary underline decoration-primary/20 underline-offset-8">Onboarding.</span>
                        </h1>
                        
                        <p className="text-white/40 font-black text-[11px] max-w-lg mx-auto uppercase tracking-[0.2em] leading-relaxed italic">
                            {step === 1 && "PROTOCOL_INITIALIZED: Authenticate profile via secure identity synchronization."}
                            {step === 2 && "MANDATE_CONFIGURATION: Define your pedagogical constraints for the matching engine."}
                        </p>
                    </div>

                    {/* Terminal Flow Interface */}
                    <div className="w-full max-w-2xl bg-surface-dark/40 backdrop-blur-3xl border border-border-dark p-8 md:p-12 rounded-[3.5rem] shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-background-dark/50">
                            <div 
                                className="h-full bg-primary transition-all duration-1000 ease-out shadow-[0_0_20px_rgba(var(--primary-rgb),0.5)]" 
                                style={{ width: `${(step / 2) * 100}%` }}
                            />
                        </div>

                        {step === 1 && (
                            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                                <LeadCaptureFlow initialRole="STUDENT" onComplete={handleLeadComplete} />
                            </div>
                        )}

                        {step === 2 && (
                            <div className="animate-in zoom-in-95 duration-700">
                                <RequirementForm user={user} onComplete={handleRequirementComplete} />
                            </div>
                        )}
                    </div>
                
                    {/* Progress Status Bar */}
                    <div className="mt-16 flex items-center justify-center gap-12">
                        {[
                            { id: 1, label: "IDENTITY_SYNC" },
                            { id: 2, label: "MANDATE_GRID" }
                        ].map((s) => (
                            <div key={s.id} className="flex flex-col items-center gap-3">
                                <div 
                                    className={`h-1 rounded-full transition-all duration-1000 ${
                                        s.id === step 
                                        ? "w-24 bg-primary shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)]" 
                                        : s.id < step ? "w-16 bg-white/40" : "w-6 bg-white/5"
                                    }`}
                                />
                                <span className={`text-[9px] font-black uppercase tracking-widest leading-none ${s.id === step ? "text-primary" : "text-white/20"}`}>
                                    {s.label}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Operational Footer */}
                    <div className="mt-16 flex items-center gap-4 px-6 py-3 bg-white/5 rounded-full border border-white/5 text-[9px] font-black text-white/20 uppercase tracking-[0.5em] italic">
                        <Activity size={12} strokeWidth={3} className="animate-pulse text-primary" /> 
                        SYSTEM_STATUS: ENCRYPTED_TRANSMISSION_ACTIVE
                    </div>
                </div>
            </section>
        </div>
    );
}
