"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Building2, ArrowLeft, ShieldCheck, Building, Users, Crown, Loader2, CheckCircle2 } from "lucide-react";
import LeadCaptureFlow from "../../components/LeadCaptureFlow";
import InstituteListingForm from "../../components/InstituteListingForm";

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

export default function InstituteRegisterPage() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [step, setStep] = useState(1); // 1: Capture, 2: Listing, 3: Payment, 4: Done
    const [paymentLoading, setPaymentLoading] = useState(false);
    const [paymentError, setPaymentError] = useState("");

    const handleLeadComplete = (verifiedUser) => {
        setUser(verifiedUser);
        setStep(2);
    };

    const handleListingComplete = () => {
        setStep(3);
    };

    const handleFreeContinue = () => {
        router.push(`/dashboard/institute?instituteId=${user?.id}&success=true`);
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

            const orderRes = await fetch("/api/payment/order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    amount: 1999,
                    currency: "INR",
                    receipt: `institute_${user?.id}_${Date.now()}`,
                    userId: user?.id,
                    description: "Coaching Hub Plan — Monthly Subscription"
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
                description: "Coaching Hub Plan",
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
                            creditsToAdd: 100,
                            subscriptionTier: "ELITE"
                        })
                    });
                    const result = await verifyRes.json();
                    if (result.success) {
                        setStep(4);
                    } else {
                        setPaymentError("Payment verification failed. Contact support.");
                    }
                    setPaymentLoading(false);
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

    const stepLabels = [
        { id: 1, label: "Verify Contact" },
        { id: 2, label: "Set Up Institute" },
        { id: 3, label: "Choose Plan" },
        { id: 4, label: "You're Live" }
    ];

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
                        <Building2 size={24} className="text-blue-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Register Your Institute</h1>
                    <p className="text-gray-500 text-sm">
                        {step === 1 && "Start by verifying the contact person's mobile number."}
                        {step === 2 && "Set up your institute profile so students can find you."}
                        {step === 3 && "Pick a plan to unlock lead management and branding."}
                        {step === 4 && "Your institute is live and students can find you."}
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
                        <div className="animate-in fade-in duration-500 space-y-6">
                            {/* Coaching Hub plan card */}
                            <div className="border-2 border-blue-600 rounded-2xl p-6 bg-blue-50 relative">
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-semibold px-4 py-1 rounded-full">
                                    Recommended
                                </div>
                                <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center mb-4">
                                    <Crown size={20} />
                                </div>
                                <p className="font-bold text-gray-900 text-xl mb-1">Coaching Hub</p>
                                <p className="text-3xl font-bold text-gray-900 mb-1">
                                    ₹1,999
                                    <span className="text-sm font-normal text-gray-400 ml-1">/month</span>
                                </p>
                                <p className="text-xs text-blue-600 font-medium mb-5">Up to 10 tutors included</p>
                                <ul className="space-y-2">
                                    {[
                                        "Institute profile with branding",
                                        "Manage up to 10 tutors",
                                        "Bulk lead management",
                                        "Custom institute page",
                                        "Performance analytics dashboard",
                                        "100 credits included"
                                    ].map((f, i) => (
                                        <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                                            <CheckCircle2 size={14} className="text-blue-600 shrink-0" />
                                            {f}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {paymentError && (
                                <div className="text-red-600 text-xs bg-red-50 p-3 rounded-xl border border-red-100">
                                    {paymentError}
                                </div>
                            )}

                            <button
                                onClick={handlePaidPlan}
                                disabled={paymentLoading}
                                className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {paymentLoading
                                    ? <><Loader2 className="animate-spin" size={16} /> Opening payment...</>
                                    : <>Pay ₹1,999 / month</>
                                }
                            </button>

                            <button
                                onClick={handleFreeContinue}
                                className="w-full py-2.5 border border-gray-200 text-gray-500 font-medium rounded-xl hover:border-gray-300 transition-colors text-sm"
                            >
                                Skip for now — continue free
                            </button>

                            <p className="text-center text-xs text-gray-400">
                                You can subscribe anytime from your dashboard.
                            </p>
                        </div>
                    )}

                    {step === 4 && (
                        <div className="animate-in fade-in duration-500 text-center space-y-6">
                            <div className="w-16 h-16 rounded-2xl bg-green-50 border border-green-100 flex items-center justify-center mx-auto">
                                <ShieldCheck size={32} className="text-green-600" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">You're all set!</h2>
                                <p className="text-gray-500 text-sm max-w-sm mx-auto">
                                    Your institute is live and your Coaching Hub plan is active. Students can find and contact you directly.
                                </p>
                            </div>
                            <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-between text-left">
                                <div>
                                    <p className="font-semibold text-gray-900 text-sm mb-0.5">Coaching Hub Active</p>
                                    <p className="text-gray-400 text-xs">Up to 10 tutors · Bulk leads · Analytics</p>
                                </div>
                                <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                                    <Building size={16} />
                                </div>
                            </div>
                            <button
                                onClick={() => router.push(`/dashboard/institute?instituteId=${user?.id}&success=true`)}
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
