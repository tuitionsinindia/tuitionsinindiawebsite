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

    const stepLabels = [
        { id: 1, label: "Verify Contact" },
        { id: 2, label: "Set Up Your Institute" },
        { id: 3, label: "Go Live" }
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
                        <Building2 size={24} className="text-blue-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Register Your Institute
                    </h1>
                    <p className="text-gray-500 text-sm">
                        {step === 1 && "Start by verifying the contact person's mobile number."}
                        {step === 2 && "Set up your institute profile so students can find you."}
                        {step === 3 && "Review your visibility settings before publishing."}
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
                            <LeadCaptureFlow initialRole="INSTITUTE" onComplete={handleLeadComplete} />
                        </div>
                    )}

                    {step === 2 && (
                        <div className="animate-in fade-in duration-500">
                            <InstituteListingForm user={user} onComplete={handleListingComplete} />
                        </div>
                    )}

                    {step === 3 && (
                        <div className="animate-in fade-in duration-500 text-center space-y-6">
                            <div className="w-16 h-16 rounded-2xl bg-green-50 border border-green-100 flex items-center justify-center mx-auto">
                                <Users size={32} className="text-green-600" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">Institute Profile Created</h2>
                                <p className="text-gray-500 text-sm max-w-sm mx-auto">
                                    Your institute is now listed in our directory. Students looking for coaching centres in your area will be able to find you. You can manage visibility from your dashboard.
                                </p>
                            </div>

                            <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-between text-left">
                                <div>
                                    <p className="font-semibold text-gray-900 text-sm mb-0.5">Visibility: High</p>
                                    <p className="text-gray-400 text-xs">Listed in the institute directory</p>
                                </div>
                                <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                                    <Building size={16} />
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
