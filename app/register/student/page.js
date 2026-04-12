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
        <div className="min-h-screen bg-blue-50/50 text-gray-900 antialiased font-sans selection:bg-blue-600/10 selection:text-blue-600 pt-32 pb-24">
            <section className="max-w-4xl mx-auto px-6 relative flex flex-col items-center">
                
                {/* Institutional Backdrop */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[600px] bg-blue-600/5 rounded-full blur-[120px] -z-0 animate-pulse"></div>

                <div className="w-full flex flex-col items-center relative z-10">
                    
                    {/* Professional Header */}
                    <div className="text-center mb-16 space-y-4">
                        <Link href="/register" className="inline-flex items-center gap-2 text-xs font-black text-gray-400 hover:text-blue-600 transition-all mb-4 uppercase tracking-[0.3em] italic leading-none group">
                            <ArrowLeft size={16} strokeWidth={3} className="group-hover:-translate-x-1 transition-transform" /> BACK TO REGISTRATION
                        </Link>
                        
                        <div className="flex items-center justify-center">
                            <div className="size-20 rounded-3xl bg-blue-600 text-white flex items-center justify-center shadow-2xl shadow-blue-600/20 border border-blue-500/10 relative group">
                                <GraduationCap size={40} strokeWidth={1.5} className="relative z-10" />
                            </div>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter uppercase italic leading-[0.85]">
                            Student <br/><span className="text-blue-600 underline decoration-blue-600/10 underline-offset-8">Enrollment.</span>
                        </h1>
                        
                        <p className="text-gray-400 font-black text-xs max-w-lg mx-auto uppercase tracking-[0.2em] leading-relaxed italic">
                            {step === 1 && "Identity synchronization initialized. Authenticate profile via secure identity protocol."}
                            {step === 2 && "Academic preference configuration. Define your pedagogical constraints for matching."}
                        </p>
                    </div>

                    {/* Premium Flow Interface */}
                    <div className="w-full max-w-2xl bg-white border border-gray-100 p-8 md:p-12 rounded-[3.5rem] shadow-4xl shadow-blue-900/5 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gray-50">
                            <div 
                                className="h-full bg-blue-600 transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(37,99,235,0.3)]" 
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
                
                    {/* Professional Status */}
                    <div className="mt-16 flex items-center gap-12 text-center">
                        {[
                            { id: 1, label: "Identity Sync" },
                            { id: 2, label: "Match Config" }
                        ].map((s) => (
                            <div key={s.id} className="flex flex-col items-center gap-3">
                                <div 
                                    className={`h-1.5 rounded-full transition-all duration-1000 ${
                                        s.id === step 
                                        ? "w-24 bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.3)]" 
                                        : s.id < step ? "w-16 bg-blue-200" : "w-8 bg-gray-100"
                                    }`}
                                />
                                <span className={`text-[10px] font-black uppercase tracking-[0.2em] leading-none ${s.id === step ? "text-blue-600" : "text-gray-300"}`}>
                                    {s.label}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Operational Guard */}
                    <div className="mt-16 flex items-center gap-3 px-8 py-3 bg-white border border-gray-100 rounded-full text-xs font-black text-gray-400 uppercase tracking-[0.4em] italic shadow-sm">
                        <Activity size={14} strokeWidth={3} className="animate-pulse text-blue-600" /> 
                        SECURE_PROTOCOL_ACTIVE
                    </div>
                </div>
            </section>
        </div>
    );
}
