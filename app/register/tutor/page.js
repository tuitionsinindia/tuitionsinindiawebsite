"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
    ArrowLeft, Award, ShieldCheck, Lock, CheckCircle2,
    Crown, Briefcase, Loader2, ArrowRight, Zap
} from "lucide-react";
import LeadCaptureFlow from "../../components/LeadCaptureFlow";
import TutorListingForm from "../../components/TutorListingForm";

const PLANS = [
    {
        id: "free",
        name: "Free",
        price: 0,
        label: "Get started at no cost",
        features: ["Basic tutor profile", "Up to 5 student leads/month", "1 subject category"],
        icon: Briefcase,
        cta: "Continue Free",
        color: "gray"
    },
    {
        id: "expert",
        name: "Expert",
        price: 499,
        label: "For serious tutors",
        features: ["Verified badge", "Unlimited leads", "AI-powered matching", "Priority ranking"],
        icon: Crown,
        cta: "Pay ₹499 / month",
        color: "blue",
        recommended: true
    }
];

function loadRazorpayScript() {
    return new Promise((resolve) => {
        if (window.Razorpay) return resolve(true);
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
}

function TutorRegisterInner() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialPlan = searchParams.get("plan") || "free";

    const [user, setUser] = useState(null);
    const [step, setStep] = useState(1); // 1: Verify, 2: Profile, 3: Plan, 4: Done
    const [selectedPlan, setSelectedPlan] = useState(initialPlan);
    const [paymentLoading, setPaymentLoading] = useState(false);
    const [paymentError, setPaymentError] = useState("");

    const stepLabels = [
        { id: 1, label: "Verify Number" },
        { id: 2, label: "Set Up Profile" },
        { id: 3, label: "Choose Plan" },
        { id: 4, label: "You're All Set" }
    ];

    const handleLeadComplete = (verifiedUser) => {
        setUser(verifiedUser);
        setStep(2);
    };

    const handleListingComplete = () => {
        setStep(3);
    };

    const handleFreePlan = () => {
        router.push("/dashboard/tutor");
    };

    const handlePaidPlan = async () => {
        setPaymentLoading(true);
        setPaymentError("");

        try {
            const loaded = await loadRazorpayScript();
            if (!loaded) {
                setPaymentError("Payment system failed to load. Please try again.");
                setPaymentLoading(false);
                return;
            }

            const plan = PLANS.find(p => p.id === selectedPlan);

            // Create Razorpay order
            const orderRes = await fetch("/api/payment/order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    amount: plan.price,
                    currency: "INR",
                    receipt: `tutor_${user?.id}_${Date.now()}`,
                    userId: user?.id,
                    description: `${plan.name} Plan — Monthly Subscription`
                })
            });
            const order = await orderRes.json();

            if (!order.id) {
                setPaymentError("Could not create payment order. Please try again.");
                setPaymentLoading(false);
                return;
            }

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: order.currency,
                name: "TuitionsInIndia",
                description: `${plan.name} Plan`,
                order_id: order.id,
                handler: async function (response) {
                    const verifyRes = await fetch("/api/payment/verify", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            userId: user?.id,
                            creditsToAdd: 50,
                            subscriptionTier: "PRO"
                        })
                    });
                    const result = await verifyRes.json();
                    if (result.success) {
                        setStep(4);
                    } else {
                        setPaymentError("Payment verification failed. Contact support.");
                    }
                },
                prefill: {
                    name: user?.name || "",
                    contact: user?.phone ? `+91${user.phone}` : ""
                },
                theme: { color: "#2563EB" },
                modal: {
                    ondismiss: () => setPaymentLoading(false)
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.on("payment.failed", () => {
                setPaymentError("Payment failed. Please try again.");
                setPaymentLoading(false);
            });
            rzp.open();

        } catch (err) {
            setPaymentError("Something went wrong. Please try again.");
            setPaymentLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white text-gray-900 antialiased">
            <div className="max-w-2xl mx-auto px-4 py-12">

                <Link
                    href="/register"
                    className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-700 transition-colors mb-10"
                >
                    <ArrowLeft size={16} />
                    Back
                </Link>

                <div className="mb-10">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-5">
                        <Award size={24} className="text-blue-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Register as a Tutor</h1>
                    <p className="text-gray-500 text-sm">
                        {step === 1 && "Start by verifying your mobile number. We'll send you an OTP."}
                        {step === 2 && "Tell us about your teaching experience and the subjects you teach."}
                        {step === 3 && "Pick a plan that suits your goals. You can upgrade or change anytime."}
                        {step === 4 && "Your profile is live. Students can now find and contact you."}
                    </p>
                </div>

                {/* Step Indicator */}
                <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-1">
                    {stepLabels.map((s, i) => (
                        <div key={s.id} className="flex items-center gap-2 shrink-0">
                            <div className="flex items-center gap-2">
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${
                                    s.id === step ? "bg-blue-600 text-white"
                                    : s.id < step ? "bg-blue-100 text-blue-600"
                                    : "bg-gray-100 text-gray-400"
                                }`}>
                                    {s.id < step ? "✓" : s.id}
                                </div>
                                <span className={`text-xs hidden sm:inline transition-colors ${
                                    s.id === step ? "text-gray-900 font-medium" : "text-gray-400"
                                }`}>
                                    {s.label}
                                </span>
                            </div>
                            {i < stepLabels.length - 1 && (
                                <div className={`h-px w-6 shrink-0 ${s.id < step ? "bg-blue-300" : "bg-gray-200"}`} />
                            )}
                        </div>
                    ))}
                </div>

                {/* Progress bar */}
                <div className="w-full h-1 bg-gray-100 rounded-full mb-8">
                    <div
                        className="h-full bg-blue-600 rounded-full transition-all duration-700"
                        style={{ width: `${(step / 4) * 100}%` }}
                    />
                </div>

                <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-10 shadow-sm">

                    {/* Step 1: Phone Verification */}
                    {step === 1 && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <LeadCaptureFlow initialRole="TUTOR" onComplete={handleLeadComplete} />
                        </div>
                    )}

                    {/* Step 2: Profile Setup */}
                    {step === 2 && (
                        <div className="animate-in fade-in duration-500">
                            <TutorListingForm user={user} onComplete={handleListingComplete} />
                        </div>
                    )}

                    {/* Step 3: Plan Selection */}
                    {step === 3 && (
                        <div className="animate-in fade-in duration-500 space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {PLANS.map((plan) => {
                                    const Icon = plan.icon;
                                    const isSelected = selectedPlan === plan.id;
                                    return (
                                        <button
                                            key={plan.id}
                                            type="button"
                                            onClick={() => setSelectedPlan(plan.id)}
                                            className={`relative text-left p-6 rounded-2xl border-2 transition-all ${
                                                isSelected
                                                    ? "border-blue-600 bg-blue-50"
                                                    : "border-gray-200 bg-white hover:border-gray-300"
                                            }`}
                                        >
                                            {plan.recommended && (
                                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-semibold px-3 py-0.5 rounded-full">
                                                    Recommended
                                                </div>
                                            )}
                                            <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-4 ${
                                                isSelected ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-400"
                                            }`}>
                                                <Icon size={18} />
                                            </div>
                                            <p className="font-bold text-gray-900 text-lg mb-0.5">{plan.name}</p>
                                            <p className="text-2xl font-bold text-gray-900 mb-1">
                                                {plan.price === 0 ? "Free" : `₹${plan.price}`}
                                                {plan.price > 0 && <span className="text-sm font-normal text-gray-400 ml-1">/month</span>}
                                            </p>
                                            <p className="text-xs text-gray-400 mb-4">{plan.label}</p>
                                            <ul className="space-y-2">
                                                {plan.features.map((f, i) => (
                                                    <li key={i} className="flex items-center gap-2 text-xs text-gray-600">
                                                        <CheckCircle2 size={12} className={isSelected ? "text-blue-600" : "text-gray-400"} />
                                                        {f}
                                                    </li>
                                                ))}
                                            </ul>
                                        </button>
                                    );
                                })}
                            </div>

                            {paymentError && (
                                <div className="text-red-600 text-xs bg-red-50 p-3 rounded-xl border border-red-100">
                                    {paymentError}
                                </div>
                            )}

                            {selectedPlan === "free" ? (
                                <button
                                    onClick={handleFreePlan}
                                    className="w-full py-3 border border-gray-200 text-gray-700 font-semibold rounded-xl hover:border-blue-500 hover:text-blue-600 transition-colors text-sm flex items-center justify-center gap-2"
                                >
                                    Continue Free <ArrowRight size={16} />
                                </button>
                            ) : (
                                <button
                                    onClick={handlePaidPlan}
                                    disabled={paymentLoading}
                                    className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {paymentLoading
                                        ? <><Loader2 className="animate-spin" size={16} /> Opening payment...</>
                                        : <><Zap size={16} /> Pay ₹499 / month</>
                                    }
                                </button>
                            )}

                            <p className="text-center text-xs text-gray-400">
                                You can upgrade or downgrade anytime from your dashboard.
                            </p>
                        </div>
                    )}

                    {/* Step 4: Success */}
                    {step === 4 && (
                        <div className="animate-in fade-in duration-500 text-center space-y-6">
                            <div className="w-16 h-16 rounded-2xl bg-green-50 border border-green-100 flex items-center justify-center mx-auto">
                                <ShieldCheck size={32} className="text-green-600" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">You're all set!</h2>
                                <p className="text-gray-500 text-sm max-w-sm mx-auto">
                                    Your tutor profile is live and your Expert plan is active. Students can find and contact you directly.
                                </p>
                            </div>
                            <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-between text-left">
                                <div>
                                    <p className="font-semibold text-gray-900 text-sm mb-0.5">Expert Plan Active</p>
                                    <p className="text-gray-400 text-xs">Unlimited leads · Verified badge · Priority ranking</p>
                                </div>
                                <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                                    <Crown size={16} />
                                </div>
                            </div>
                            <button
                                onClick={() => router.push("/dashboard/tutor")}
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

export default function TutorRegisterPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="animate-spin text-blue-600" size={32} />
            </div>
        }>
            <TutorRegisterInner />
        </Suspense>
    );
}
