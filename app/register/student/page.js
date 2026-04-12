"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { GraduationCap, ArrowLeft, Loader2 } from "lucide-react";
import LeadCaptureFlow from "../../components/LeadCaptureFlow";
import RequirementForm from "../../components/RequirementForm";

function StudentRegisterContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [user, setUser] = useState(null);
    const [step, setStep] = useState(1);

    // Pre-fill data from search params (when coming from "Contact Tutor")
    const prefill = {
        subject: searchParams.get("subject") || "",
        grade: searchParams.get("grade") || "",
        location: searchParams.get("location") || "",
        tutorId: searchParams.get("tutorId") || "",
        intent: searchParams.get("intent") || "",
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-28 pb-16">
            <div className="max-w-lg mx-auto px-6">
                {/* Back link */}
                <Link href="/get-started" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-blue-600 transition-colors mb-8">
                    <ArrowLeft size={16} /> Back
                </Link>

                {/* Header */}
                <div className="text-center mb-8">
                    <div className="size-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto mb-4">
                        <GraduationCap size={28} />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">Register as a Student</h1>
                    <p className="text-sm text-gray-500 mt-2">
                        {step === 1 ? "Start by verifying your phone number. We'll send you an OTP." : "Tell us what you need so we can find the right tutor for you."}
                    </p>
                </div>

                {/* Progress */}
                <div className="flex items-center gap-3 mb-8 justify-center">
                    {[
                        { id: 1, label: "Verify Phone" },
                        { id: 2, label: "Your Requirements" },
                    ].map((s, i) => (
                        <div key={s.id} className="flex items-center gap-3">
                            <div className={`flex items-center gap-2 ${s.id <= step ? "text-blue-600" : "text-gray-300"}`}>
                                <div className={`size-7 rounded-full flex items-center justify-center text-xs font-bold ${
                                    s.id < step ? "bg-blue-600 text-white" : s.id === step ? "bg-blue-100 text-blue-600 border-2 border-blue-600" : "bg-gray-100 text-gray-400"
                                }`}>{s.id}</div>
                                <span className="text-xs font-medium hidden sm:inline">{s.label}</span>
                            </div>
                            {i < 1 && <div className={`w-8 h-0.5 ${s.id < step ? "bg-blue-600" : "bg-gray-200"}`} />}
                        </div>
                    ))}
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-sm">
                    {step === 1 && (
                        <LeadCaptureFlow initialRole="STUDENT" onComplete={(verifiedUser) => { setUser(verifiedUser); setStep(2); }} />
                    )}
                    {step === 2 && (
                        <RequirementForm user={user} prefill={prefill} onComplete={() => {
                            router.push(`/dashboard/student?success=true${prefill.tutorId ? `&highlightTutor=${prefill.tutorId}` : ""}`);
                        }} />
                    )}
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
