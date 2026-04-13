"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Award, ArrowLeft, CheckCircle2 } from "lucide-react";
import LeadCaptureFlow from "../../components/LeadCaptureFlow";
import TutorListingForm from "../../components/TutorListingForm";

export default function TutorRegisterPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const refCode = searchParams.get("ref");
    const [user, setUser] = useState(null);
    const [step, setStep] = useState(1);

    const applyReferral = async (userId) => {
        if (!refCode) return;
        try {
            await fetch("/api/referral", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, referralCode: refCode }),
            });
        } catch {}
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
                        <Award size={28} />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">Register as a Tutor</h1>
                    <p className="text-sm text-gray-500 mt-2">
                        {step === 1 ? "Start by verifying your mobile number. We'll send you an OTP." :
                         step === 2 ? "Build your tutor profile so students can find you." :
                         "You're all set! Your profile is now live."}
                    </p>
                </div>

                {/* Progress */}
                <div className="flex items-center gap-3 mb-8 justify-center">
                    {[
                        { id: 1, label: "Verify Phone" },
                        { id: 2, label: "Your Profile" },
                        { id: 3, label: "Done" },
                    ].map((s, i) => (
                        <div key={s.id} className="flex items-center gap-3">
                            <div className={`flex items-center gap-2 ${s.id <= step ? "text-blue-600" : "text-gray-300"}`}>
                                <div className={`size-7 rounded-full flex items-center justify-center text-xs font-bold ${
                                    s.id < step ? "bg-blue-600 text-white" : s.id === step ? "bg-blue-100 text-blue-600 border-2 border-blue-600" : "bg-gray-100 text-gray-400"
                                }`}>{s.id < step ? <CheckCircle2 size={14} /> : s.id}</div>
                                <span className="text-xs font-medium hidden sm:inline">{s.label}</span>
                            </div>
                            {i < 2 && <div className={`w-8 h-0.5 ${s.id < step ? "bg-blue-600" : "bg-gray-200"}`} />}
                        </div>
                    ))}
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-sm">
                    {step === 1 && (
                        <LeadCaptureFlow initialRole="TUTOR" onComplete={(verifiedUser) => { setUser(verifiedUser); applyReferral(verifiedUser.id); setStep(2); }} />
                    )}
                    {step === 2 && (
                        <TutorListingForm user={user} onComplete={() => setStep(3)} />
                    )}
                    {step === 3 && (
                        <div className="text-center py-8 space-y-6">
                            <div className="size-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                                <CheckCircle2 size={32} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 mb-2">Profile Created!</h2>
                                <p className="text-sm text-gray-500">Your tutor profile is now live. Students can find you in search results.</p>
                            </div>
                            <button
                                onClick={() => router.push("/dashboard/tutor")}
                                className="w-full py-3 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors"
                            >
                                Go to Dashboard
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
