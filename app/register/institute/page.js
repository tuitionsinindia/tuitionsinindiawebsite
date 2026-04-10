"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Building2, ArrowLeft, ShieldCheck, Lock, Building, Activity, Zap, Users } from "lucide-react";
import LeadCaptureFlow from "../../components/LeadCaptureFlow";
import InstituteListingForm from "../../components/InstituteListingForm";

export default function InstituteRegisterPage() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [step, setStep] = useState(1); // 1: Capture, 2: Listing, 3: Preferences

    const handleLeadComplete = (verifiedUser) => {
        setUser(verifiedUser);
        setStep(2);
    };

    const handleListingComplete = () => {
        setStep(3);
    };

    const handleFinalize = () => {
        router.push("/dashboard/institute");
    };

    return (
        <div className="h-screen overflow-y-auto snap-y snap-mandatory bg-background-dark text-on-background-dark antialiased font-sans selection:bg-indigo-500/30 selection:text-white">
            <section className="min-h-screen snap-start snap-always flex flex-col items-center justify-center py-12 px-4 relative overflow-hidden">
                
                {/* Strategic Backdrop */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[800px] bg-indigo-500/5 rounded-full blur-[140px] -z-0 animate-pulse"></div>
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent"></div>

                <div className="w-full max-w-4xl mx-auto flex flex-col items-center relative z-10">
                    
                    {/* Synchronized Header */}
                    <div className="text-center mb-12 space-y-6">
                        <Link href="/register" className="inline-flex items-center gap-3 text-[10px] font-black text-white/20 hover:text-indigo-500 transition-all mb-4 uppercase tracking-[0.4em] italic leading-none">
                            <ArrowLeft size={16} strokeWidth={3} /> RECONFIGURE ENTITY LOGIC
                        </Link>
                        
                        <div className="flex items-center justify-center">
                            <div className="size-20 rounded-3xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center shadow-inner border border-indigo-500/20 relative group">
                                <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <Building2 size={40} strokeWidth={1.5} className="relative z-10" />
                            </div>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase italic leading-[0.85]">
                            Institutional <br/><span className="text-indigo-500 underline decoration-indigo-500/20 underline-offset-8">Command.</span>
                        </h1>
                        
                        <p className="text-white/40 font-black text-[11px] max-w-lg mx-auto uppercase tracking-[0.2em] leading-relaxed italic">
                            {step === 1 && "PROTOCOL_INITIALIZED: Authenticate an official point of contact via secure identity synchronization."}
                            {step === 2 && "ORCHESTRATION_SETUP: Configure your organization profile to start mobilizing students."}
                            {step === 3 && "FINAL_CALIBRATION: Configure business visibility and privacy protocols."}
                        </p>
                    </div>

                    {/* Terminal Flow Interface */}
                    <div className="w-full max-w-2xl bg-surface-dark/40 backdrop-blur-3xl border border-border-dark p-8 md:p-12 rounded-[3.5rem] shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-background-dark/50">
                            <div 
                                className="h-full bg-indigo-500 transition-all duration-1000 ease-out shadow-[0_0_20px_rgba(79,70,229,0.5)]" 
                                style={{ width: `${(step / 3) * 100}%` }}
                            />
                        </div>

                        {step === 1 && (
                            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                                <LeadCaptureFlow initialRole="INSTITUTE" onComplete={handleLeadComplete} />
                            </div>
                        )}

                        {step === 2 && (
                            <div className="animate-in zoom-in-95 duration-700">
                                <InstituteListingForm user={user} onComplete={handleListingComplete} />
                            </div>
                        )}

                        {step === 3 && (
                            <div className="w-full max-w-md mx-auto flex items-center justify-center">
                                <div className="animate-in zoom-in-95 duration-500 text-center space-y-8">
                                    <div className="size-24 rounded-[2.5rem] bg-indigo-500/10 text-indigo-500 flex items-center justify-center mx-auto mb-6 shadow-inner border border-indigo-500/20">
                                        <Users size={48} strokeWidth={1.5} />
                                    </div>
                                    <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic leading-none">Business Visibility</h2>
                                    <p className="text-white/40 font-medium text-xs leading-relaxed uppercase tracking-widest italic">
                                        Institutes benefit from prioritized discovery. Your institutional metadata will be accessible within the directory to facilitate rapid student synchronization.
                                    </p>
                                    
                                    <div className="p-6 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between">
                                        <div className="text-left">
                                            <p className="font-black text-white text-[10px] uppercase tracking-widest mb-1">Status: High Visibility</p>
                                            <p className="text-white/20 text-[8px] font-black uppercase tracking-[0.2em] italic">SYNCED: GLOBAL_CAMPUS_DIRECTORY</p>
                                        </div>
                                        <div className="size-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-lg">
                                            <Building size={20} strokeWidth={3} />
                                        </div>
                                    </div>

                                    <button 
                                        onClick={handleFinalize}
                                        className="w-full py-6 bg-indigo-600 text-white rounded-[2rem] font-black text-xs shadow-xl hover:bg-white hover:text-indigo-600 transition-all active:scale-95 uppercase tracking-[0.4em] italic"
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
                            { id: 1, label: "POC_SYNC" },
                            { id: 2, label: "CAMPUS_GRID" },
                            { id: 3, label: "VISIBILITY" }
                        ].map((s) => (
                            <div key={s.id} className="flex flex-col items-center gap-3">
                                <div 
                                    className={`h-1 transition-all duration-1000 ${
                                        s.id === step 
                                        ? "w-20 bg-indigo-600 shadow-[0_0_15px_rgba(79,70,229,0.5)]" 
                                        : s.id < step ? "w-12 bg-white/30" : "w-6 bg-white/5"
                                    } rounded-full`}
                                />
                                <span className={`text-[9px] font-black uppercase tracking-widest leading-none ${s.id === step ? "text-indigo-600" : "text-white/20"}`}>
                                    {s.label}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Operational Footer */}
                    <div className="mt-16 flex items-center gap-4 px-6 py-3 bg-white/5 rounded-full border border-white/5 text-[9px] font-black text-white/20 uppercase tracking-[0.5em] italic">
                        <Activity size={12} strokeWidth={3} className="animate-pulse text-indigo-500" /> 
                        SYSTEM_STATUS: CAMPUS_MOBILIZATION_READY
                    </div>
                </div>
            </section>
        </div>
    );
}
