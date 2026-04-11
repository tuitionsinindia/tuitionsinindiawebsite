"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { GraduationCap, ArrowLeft } from "lucide-react";
import LeadCaptureFlow from "../../components/LeadCaptureFlow";
import RequirementForm from "../../components/RequirementForm";

function StudentRegisterContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Pre-fill data from URL (set when coming from search/browse)
    const urlSubject = searchParams.get("subject") || "";
    const urlGrade = searchParams.get("grade") || "";
    const urlLocation = searchParams.get("location") || "";
    const urlTutorId = searchParams.get("tutorId") || "";
    const urlIntent = searchParams.get("intent") || "";

    const [user, setUser] = useState(null);
    const [step, setStep] = useState(1); // 1: Identity/OTP, 2: Requirements

    const handleLeadComplete = (verifiedUser) => {
        setUser(verifiedUser);
        setStep(2);
    };

    const handleRequirementComplete = () => {
        // If came from a specific tutor, include tutorId so dashboard can highlight them
        const params = new URLSearchParams({ studentId: user.id, success: "true" });
        if (urlTutorId) params.set("highlightTutor", urlTutorId);
        router.push(`/dashboard/student?${params.toString()}`);
    };

    const stepLabels = [
        { id: 1, label: "Verify Your Number" },
        { id: 2, label: "Tell Us What You Need" }
    ];

    const initialData = {
        subject: urlSubject,
        grade: urlGrade,
        location: urlLocation,
    };

    return (
        <div className="min-h-screen bg-white text-gray-900 antialiased">
            <div className="max-w-2xl mx-auto px-4 py-12">

                <Link
                    href={urlIntent === "unlock" ? "/search" : "/register"}
                    className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-700 transition-colors mb-10"
                >
                    <ArrowLeft size={16} />
                    Back
                </Link>

                <div className="mb-10">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-5">
                        <GraduationCap size={24} className="text-blue-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {urlIntent === "unlock" ? "Create Free Account to Contact Tutor" : "Find a Tutor"}
                    </h1>
                    <p className="text-gray-500 text-sm">
                        {step === 1 && "Start by verifying your mobile number. We'll send you an OTP."}
                        {step === 2 && "Tell us what you need — we'll match you with the right tutors."}
                    </p>
                    {urlIntent === "unlock" && urlSubject && (
                        <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-lg text-xs text-blue-700 font-medium">
                            Looking for: <span className="font-bold">{urlSubject}</span>
                            {urlGrade && <> · {urlGrade}</>}
                            {urlLocation && <> · {urlLocation}</>}
                        </div>
                    )}
                </div>

                {/* Step Indicator */}
                <div className="flex items-center gap-3 mb-8">
                    {stepLabels.map((s, i) => (
                        <div key={s.id} className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${
                                    s.id === step ? "bg-blue-600 text-white" : s.id < step ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-400"
                                }`}>
                                    {s.id < step ? "✓" : s.id}
                                </div>
                                <span className={`text-sm hidden sm:inline transition-colors ${s.id === step ? "text-gray-900 font-medium" : "text-gray-400"}`}>
                                    {s.id === step ? `Step ${s.id} of 2: ${s.label}` : ""}
                                </span>
                            </div>
                            {i < stepLabels.length - 1 && (
                                <div className={`h-px w-8 ${s.id < step ? "bg-blue-300" : "bg-gray-200"}`} />
                            )}
                        </div>
                    ))}
                </div>

                <div className="w-full h-1 bg-gray-100 rounded-full mb-8">
                    <div
                        className="h-full bg-blue-600 rounded-full transition-all duration-700"
                        style={{ width: `${(step / 2) * 100}%` }}
                    />
                </div>

                <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-10 shadow-sm">
                    {step === 1 && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <LeadCaptureFlow initialRole="STUDENT" onComplete={handleLeadComplete} />
                        </div>
                    )}
                    {step === 2 && (
                        <div className="animate-in fade-in duration-500">
                            <RequirementForm user={user} onComplete={handleRequirementComplete} initialData={initialData} />
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}

export default function StudentRegisterPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-400 text-sm">Loading...</div>}>
            <StudentRegisterContent />
        </Suspense>
    );
}
