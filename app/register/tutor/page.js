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

    const stepLabels = [
        { id: 1, label: "Verify Your Number" },
        { id: 2, label: "Set Up Your Profile" },
        { id: 3, label: "You Are All Set" }
    ];

    return (
        <div className="min-h-screen bg-white text-gray-900 antialiased">
            <div className="max-w-2xl mx-auto px-4 py-12">

                {/* Back link */}
                <Link
                    href="/register"
                    className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-700 transition-colors mb-10"
                >
                    <ArrowLeft size={16} />
                    Back
                </Link>

                {/* Header */}
                <div className="mb-10">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-5">
                        <Award size={24} className="text-blue-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Register as a Tutor
                    </h1>
                    <p className="text-gray-500 text-sm">
                        {step === 1 && "Start by verifying your mobile number. We'll send you an OTP."}
                        {step === 2 && "Tell us about your teaching experience and the subjects you teach."}
                        {step === 3 && "Review your profile visibility settings before going live."}
                    </p>
                </div>

                {/* Step Indicator */}
                <div className="flex items-center gap-3 mb-8">
                    {stepLabels.map((s, i) => (
                        <div key={s.id} className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                                <div
                                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${
                                        s.id === step
                                            ? "bg-blue-600 text-white"
                                            : s.id < step
                                            ? "bg-blue-100 text-blue-600"
                                            : "bg-gray-100 text-gray-400"
                                    }`}
                                >
                                    {s.id < step ? "✓" : s.id}
                                </div>
                                <span
                                    className={`text-sm hidden sm:inline transition-colors ${
                                        s.id === step ? "text-gray-900 font-medium" : "text-gray-400"
                                    }`}
                                >
                                    {s.id === step ? `Step ${s.id} of 3: ${s.label}` : ""}
                                </span>
                            </div>
                            {i < stepLabels.length - 1 && (
                                <div className={`h-px w-8 ${s.id < step ? "bg-blue-300" : "bg-gray-200"}`} />
                            )}
                        </div>
                    ))}
                </div>

                {/* Progress bar */}
                <div className="w-full h-1 bg-gray-100 rounded-full mb-8">
                    <div
                        className="h-full bg-blue-600 rounded-full transition-all duration-700"
                        style={{ width: `${(step / 3) * 100}%` }}
                    />
                </div>

                {/* Form Card */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-10 shadow-sm">

                    {step === 1 && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <LeadCaptureFlow initialRole="TUTOR" onComplete={handleLeadComplete} />
                        </div>
                    )}

                    {step === 2 && (
                        <div className="animate-in fade-in duration-500">
                            <TutorListingForm user={user} onComplete={handleListingComplete} />
                        </div>
                    )}

                    {step === 3 && (
                        <div className="animate-in fade-in duration-500 text-center space-y-6">
                            <div className="w-16 h-16 rounded-2xl bg-green-50 border border-green-100 flex items-center justify-center mx-auto">
                                <ShieldCheck size={32} className="text-green-600" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile Created</h2>
                                <p className="text-gray-500 text-sm max-w-sm mx-auto">
                                    Your tutor profile is now live. Students will be able to find and contact you through the directory. You can update your visibility settings anytime from your dashboard.
                                </p>
                            </div>

                            <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-between text-left">
                                <div>
                                    <p className="font-semibold text-gray-900 text-sm mb-0.5">Profile Visibility</p>
                                    <p className="text-gray-400 text-xs">Listed in public tutor directory</p>
                                </div>
                                <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                                    <Lock size={16} />
                                </div>
                            </div>

                            <button
                                onClick={handleFinalize}
                                className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors text-sm"
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
