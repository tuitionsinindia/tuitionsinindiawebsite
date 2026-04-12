"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { GraduationCap, ArrowLeft } from "lucide-react";
import LeadCaptureFlow from "../../components/LeadCaptureFlow";
import RequirementForm from "../../components/RequirementForm";

export default function StudentRegisterPage() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [step, setStep] = useState(1);

    const handleLeadComplete = (verifiedUser) => {
        setUser(verifiedUser);
        setStep(2);
    };

    const handleRequirementComplete = () => {
        router.push(`/dashboard/student?studentId=${user.id}&success=true`);
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans pt-16 pb-16 px-6">
            <div className="max-w-xl mx-auto">

                <Link href="/register" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-700 transition-colors mb-8">
                    <ArrowLeft size={16} /> Back
                </Link>

                <div className="mb-8">
                    <div className="size-12 rounded-xl bg-blue-50 flex items-center justify-center mb-4">
                        <GraduationCap size={24} className="text-blue-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Register as a Student</h1>
                    <p className="text-gray-500 text-sm">
                        {step === 1 && "Start by verifying your mobile number. We'll send you an OTP."}
                        {step === 2 && "Tell us what you're looking for so we can find the right tutors."}
                    </p>
                </div>

                {/* Progress */}
                <div className="flex items-center gap-2 mb-6">
                    {[1, 2].map((s, i) => (
                        <div key={s} className="flex items-center gap-2">
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold ${
                                s === step ? "bg-blue-600 text-white" :
                                s < step ? "bg-blue-100 text-blue-600" :
                                "bg-gray-100 text-gray-400"
                            }`}>
                                {s < step ? "✓" : s}
                            </div>
                            {i === 0 && <div className={`h-px w-8 ${s < step ? "bg-blue-300" : "bg-gray-200"}`} />}
                        </div>
                    ))}
                    <span className="text-xs text-gray-400 ml-2">
                        {step === 1 ? "Step 1 of 2: Verify Number" : "Step 2 of 2: Your Requirements"}
                    </span>
                </div>

                <div className="w-full h-1 bg-gray-100 rounded-full mb-8">
                    <div className="h-full bg-blue-600 rounded-full transition-all duration-700" style={{ width: `${(step / 2) * 100}%` }} />
                </div>

                <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm">
                    {step === 1 && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <LeadCaptureFlow initialRole="STUDENT" onComplete={handleLeadComplete} />
                        </div>
                    )}
                    {step === 2 && (
                        <div className="animate-in fade-in duration-500">
                            <RequirementForm user={user} onComplete={handleRequirementComplete} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
