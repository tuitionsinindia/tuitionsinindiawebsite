"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { GraduationCap, ArrowLeft, Loader2, Search, MapPin, BookOpen, CheckCircle2 } from "lucide-react";
import LeadCaptureFlow from "../../components/LeadCaptureFlow";
import RequirementForm from "../../components/RequirementForm";

function StudentRegisterContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [user, setUser] = useState(null);
    const [step, setStep] = useState(1);

    const prefill = {
        subject: searchParams.get("subject") || "",
        grade: searchParams.get("grade") || "",
        location: searchParams.get("location") || "",
        tutorId: searchParams.get("tutorId") || "",
        intent: searchParams.get("intent") || "",
    };

    const hasContext = prefill.subject || prefill.location || prefill.tutorId;
    const steps = [
        { id: 1, label: "Verify Phone" },
        { id: 2, label: "Your Requirement" },
        { id: 3, label: "Confirm" },
    ];

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-16">
            <div className="max-w-lg mx-auto px-6">
                <Link href={hasContext ? "/search" : "/get-started"} className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-blue-600 transition-colors mb-6">
                    <ArrowLeft size={16} /> Back
                </Link>

                {/* Context Banner — shows what they searched for */}
                {hasContext && step === 1 && (
                    <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-start gap-3">
                        <Search size={16} className="text-blue-500 mt-0.5 shrink-0" />
                        <div>
                            <p className="text-sm font-medium text-blue-900">
                                {prefill.intent === "unlock" ? "Create a free account to contact this tutor" : "Find the right tutor for you"}
                            </p>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {prefill.subject && (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white text-blue-700 rounded-lg text-xs font-medium border border-blue-200">
                                        <BookOpen size={11} /> {prefill.subject}
                                    </span>
                                )}
                                {prefill.location && (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white text-blue-700 rounded-lg text-xs font-medium border border-blue-200">
                                        <MapPin size={11} /> {prefill.location}
                                    </span>
                                )}
                                {prefill.grade && (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white text-blue-700 rounded-lg text-xs font-medium border border-blue-200">
                                        <GraduationCap size={11} /> {prefill.grade}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Header */}
                <div className="text-center mb-6">
                    <div className="size-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto mb-4">
                        <GraduationCap size={28} />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        {step === 1 ? "Verify Your Phone" : step === 2 ? "Tell Us What You Need" : "Review & Submit"}
                    </h1>
                    <p className="text-sm text-gray-500 mt-2">
                        {step === 1 ? "Quick verification — we'll send a 6-digit OTP to your mobile." :
                         step === 2 ? (hasContext ? "We've pre-filled your details. Review and add anything else." : "A few details so we can find the best tutors for you.") :
                         "Check your details and submit. You'll see matching tutors in your dashboard."}
                    </p>
                </div>

                {/* Progress Steps */}
                <div className="flex items-center justify-center gap-2 mb-8">
                    {steps.map((s, i) => (
                        <div key={s.id} className="flex items-center gap-2">
                            <div className={`size-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                                s.id < step ? "bg-blue-600 text-white" :
                                s.id === step ? "bg-blue-100 text-blue-600 border-2 border-blue-600" :
                                "bg-gray-100 text-gray-400"
                            }`}>
                                {s.id < step ? <CheckCircle2 size={14} /> : s.id}
                            </div>
                            <span className="text-xs font-medium text-gray-500 hidden sm:inline">{s.label}</span>
                            {i < steps.length - 1 && <div className={`w-6 h-0.5 ${s.id < step ? "bg-blue-600" : "bg-gray-200"}`} />}
                        </div>
                    ))}
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-sm">
                    {step === 1 && (
                        <LeadCaptureFlow
                            initialRole="STUDENT"
                            onComplete={(verifiedUser) => { setUser(verifiedUser); setStep(2); }}
                        />
                    )}
                    {(step === 2 || step === 3) && (
                        <RequirementForm
                            user={user}
                            prefill={prefill}
                            initialStep={step === 2 ? 1 : 3}
                            onStepChange={(s) => setStep(s === 3 ? 3 : 2)}
                            onComplete={() => {
                                router.push(`/dashboard/student?success=true${prefill.tutorId ? `&highlightTutor=${prefill.tutorId}` : ""}`);
                            }}
                        />
                    )}
                </div>

                {/* Trust badges */}
                <div className="mt-6 flex items-center justify-center gap-4 text-xs text-gray-400">
                    <span>No spam</span>
                    <span className="size-1 rounded-full bg-gray-300" />
                    <span>Free to sign up</span>
                    <span className="size-1 rounded-full bg-gray-300" />
                    <span>50,000+ tutors</span>
                </div>
            </div>
        </div>
    );
}

export default function StudentRegisterPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-50"><Loader2 className="animate-spin text-blue-600" size={32} /></div>}>
            <StudentRegisterContent />
        </Suspense>
    );
}
