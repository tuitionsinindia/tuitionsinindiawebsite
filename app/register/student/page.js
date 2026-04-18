"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { GraduationCap, ArrowLeft, Loader2, Search, MapPin, BookOpen, CheckCircle2, Phone } from "lucide-react";
import LeadCaptureFlow from "../../components/LeadCaptureFlow";
import RequirementForm from "../../components/RequirementForm";
import { getIntent, clearIntent } from "@/lib/intentStore";

function StudentRegisterContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [user, setUser] = useState(null);
    const [step, setStep] = useState(1); // 1=OTP, 2=Requirement, 3=Preferences, 4=Contact

    const prefill = {
        subject: searchParams.get("subject") || "",
        grade: searchParams.get("grade") || "",
        location: searchParams.get("location") || "",
        category: searchParams.get("category") || "",
        tutorId: searchParams.get("tutorId") || "",
        intent: searchParams.get("intent") || "",
    };

    const hasContext = prefill.subject || prefill.location || prefill.tutorId;

    const stepLabels = [
        { id: 1, label: "Verify Phone", icon: Phone },
        { id: 2, label: "Requirement", icon: BookOpen },
        { id: 3, label: "Preferences", icon: Search },
        { id: 4, label: "Contact Info", icon: GraduationCap },
    ];

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-16">
            <div className="max-w-lg mx-auto px-6">
                <Link href={hasContext ? "/search" : "/get-started"} className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-blue-600 transition-colors mb-6">
                    <ArrowLeft size={16} /> Back
                </Link>

                {/* Context Banner */}
                {hasContext && step === 1 && (
                    <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-start gap-3">
                        <Search size={16} className="text-blue-500 mt-0.5 shrink-0" />
                        <div>
                            <p className="text-sm font-medium text-blue-900">
                                {prefill.intent === "unlock" ? "Create a free account to contact this tutor" : "Sign up to find the right tutor"}
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
                    <div className="size-12 rounded-xl bg-blue-600 text-white flex items-center justify-center mx-auto mb-3">
                        <GraduationCap size={24} />
                    </div>
                    <h1 className="text-xl font-bold text-gray-900">
                        {step === 1 ? "Verify Your Phone" :
                         step === 2 ? "What Do You Need?" :
                         step === 3 ? "Tuition Preferences" :
                         "Your Contact Details"}
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        {step === 1 ? "Quick OTP verification to get started." :
                         step === 2 ? (hasContext ? "We've pre-filled your details — review and continue." : "Tell us what subject and level you need.") :
                         step === 3 ? "Help us find the best tutor for you." :
                         "Almost done — just your name so tutors can reach you."}
                    </p>
                </div>

                {/* Progress Steps */}
                <div className="flex items-center justify-center gap-1 mb-6">
                    {stepLabels.map((s, i) => (
                        <div key={s.id} className="flex items-center gap-1">
                            <div className={`size-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors ${
                                s.id < step ? "bg-blue-600 text-white" :
                                s.id === step ? "bg-blue-100 text-blue-600 ring-2 ring-blue-600" :
                                "bg-gray-100 text-gray-400"
                            }`}>
                                {s.id < step ? <CheckCircle2 size={12} /> : s.id}
                            </div>
                            {i < stepLabels.length - 1 && <div className={`w-5 h-0.5 ${s.id < step ? "bg-blue-600" : "bg-gray-200"}`} />}
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
                    {step >= 2 && (
                        <RequirementForm
                            user={user}
                            prefill={prefill}
                            onStepChange={(formStep) => setStep(formStep + 1)} // formStep 1=req, 2=pref, 3=contact → page step 2,3,4
                            onComplete={() => {
                                // Check for a deferred intent (e.g. student clicked "View Contact" before signing up)
                                const intent = getIntent();
                                if (intent?.tutorId) {
                                    clearIntent();
                                    router.push(`/search/${intent.tutorId}?action=${intent.action}&from=signup`);
                                    return;
                                }
                                // Fallback: if tutorId came via URL, redirect to that tutor profile
                                if (prefill.tutorId) {
                                    const action = prefill.intent === "contact" ? "contact" : "inquiry";
                                    router.push(`/search/${prefill.tutorId}?action=${action}&from=signup`);
                                    return;
                                }
                                // Default: go to student dashboard
                                router.push(`/dashboard/student?success=true&studentId=${user.id}`);
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
