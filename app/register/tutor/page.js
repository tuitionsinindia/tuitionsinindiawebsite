"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Award, ArrowLeft, CheckCircle2, MapPin, BookOpen, Search, Loader2 } from "lucide-react";
import LeadCaptureFlow from "../../components/LeadCaptureFlow";
import TutorListingForm from "../../components/TutorListingForm";
import EarlyTutorPromoBanner from "../../components/EarlyTutorPromoBanner";

function TutorRegisterContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const refCode = searchParams.get("ref");
    const [user, setUser] = useState(null);
    const [step, setStep] = useState(1);

    const context = {
        subject: searchParams.get("subject") || "",
        location: searchParams.get("location") || "",
        grade: searchParams.get("grade") || "",
        intent: searchParams.get("intent") || "",
    };
    const hasContext = context.subject || context.location;

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
        <div className="min-h-screen bg-gray-50 pt-24 pb-16">
            <div className="max-w-lg mx-auto px-6">
                {/* Back link */}
                <Link
                    href={hasContext ? "/search" : "/get-started"}
                    className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-blue-600 transition-colors mb-6"
                >
                    <ArrowLeft size={16} /> Back
                </Link>

                {/* Context Banner — shown when coming from search */}
                {hasContext && step === 1 && (
                    <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-start gap-3">
                        <Search size={16} className="text-blue-500 mt-0.5 shrink-0" />
                        <div>
                            <p className="text-sm font-medium text-blue-900">
                                {context.intent === "unlock"
                                    ? "Create a free tutor account to connect with this student"
                                    : "Sign up to appear in search results for students near you"}
                            </p>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {context.subject && (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white text-blue-700 rounded-lg text-xs font-medium border border-blue-200">
                                        <BookOpen size={11} /> {context.subject}
                                    </span>
                                )}
                                {context.location && (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white text-blue-700 rounded-lg text-xs font-medium border border-blue-200">
                                        <MapPin size={11} /> {context.location}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Founding-tutor PRO offer (only on the first step, only while slots remain) */}
                {step === 1 && (
                    <div className="mb-5">
                        <EarlyTutorPromoBanner variant="compact" ctaHref="#top" />
                    </div>
                )}

                {/* Header */}
                <div className="text-center mb-6">
                    <div className="size-12 rounded-xl bg-blue-600 text-white flex items-center justify-center mx-auto mb-3">
                        <Award size={24} />
                    </div>
                    <h1 className="text-xl font-bold text-gray-900">Register as a Tutor</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        {step === 1 ? "Start by verifying your mobile number. We'll send you an OTP." :
                         step === 2 ? "Build your tutor profile so students can find you." :
                         "You're all set! Your profile is now live."}
                    </p>
                </div>

                {/* Progress */}
                <div className="flex items-center gap-3 mb-6 justify-center">
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
                        <LeadCaptureFlow
                            initialRole="TUTOR"
                            onComplete={(verifiedUser) => {
                                setUser(verifiedUser);
                                applyReferral(verifiedUser.id);
                                setStep(2);
                            }}
                        />
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
                                onClick={() => router.push(`/dashboard/tutor?success=true&tutorId=${user?.id}`)}
                                className="w-full py-3 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors"
                            >
                                Go to Dashboard
                            </button>
                        </div>
                    )}
                </div>

                {/* Trust badges */}
                <div className="mt-6 flex items-center justify-center gap-4 text-xs text-gray-400">
                    <span>No spam</span>
                    <span className="size-1 rounded-full bg-gray-300" />
                    <span>Free to sign up</span>
                    <span className="size-1 rounded-full bg-gray-300" />
                    <span>1 Lakh+ students</span>
                </div>
            </div>
        </div>
    );
}

export default function TutorRegisterPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-50"><Loader2 className="animate-spin text-blue-600" size={32} /></div>}>
            <TutorRegisterContent />
        </Suspense>
    );
}
