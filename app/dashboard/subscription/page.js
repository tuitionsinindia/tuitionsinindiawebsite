"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Script from "next/script";
import Link from "next/link";

function SubscriptionContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const tutorId = searchParams.get("tutorId");
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tutorData, setTutorData] = useState(null);

    useEffect(() => {
        fetchPlans();
        if (tutorId) fetchTutorData();
    }, [tutorId]);

    const fetchPlans = async () => {
        const res = await fetch("/api/subscription/plans");
        const data = await res.json();
        setPlans(data);
        setLoading(false);
    };

    const fetchTutorData = async () => {
        const res = await fetch(`/api/user/info?id=${tutorId}`);
        if (res.ok) setTutorData(await res.json());
    };

    const handleSubscribe = async (plan) => {
        if (!tutorId) {
            alert("Please log in to subscribe.");
            return;
        }

        try {
            // Initiate Razorpay Order/Subscription
            const res = await fetch("/api/payment/order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    amount: plan.price,
                    currency: "INR",
                    userId: tutorId,
                    description: `Upgrade to ${plan.name} (${plan.interval})`
                }),
            });
            const order = await res.json();

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_mock_id",
                amount: order.amount,
                currency: order.currency,
                name: "TuitionsInIndia",
                description: plan.name,
                order_id: order.id,
                handler: async function (response) {
                    const verifyRes = await fetch("/api/payment/verify", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            ...response,
                            userId: tutorId,
                            subscriptionTier: plan.tier,
                            creditsToAdd: plan.credits
                        }),
                    });
                    const verifyData = await verifyRes.json();
                    if (verifyData.success) {
                        alert(`You are now on ${plan.name}! Your account has been upgraded.`);
                        router.push(`/dashboard/tutor?tutorId=${tutorId}`);
                    }
                },
                prefill: {
                    name: tutorData?.name,
                    email: tutorData?.email,
                },
                theme: { color: "#2563EB" }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (err) {
            console.error(err);
            alert("Payment could not start. Please try again.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans py-16 px-6">
            <Script src="https://checkout.razorpay.com/v1/checkout.js" />

            <div className="max-w-4xl mx-auto text-center mb-12">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 tracking-tight">
                    Choose a plan
                </h1>
                <p className="text-gray-500 max-w-xl mx-auto">
                    Get more leads, better visibility, and the tools you need to grow your tutoring business.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {/* Starter Plan */}
                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm flex flex-col">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">Free</h3>
                    <div className="text-2xl font-bold text-gray-900 mb-5">₹0 <span className="text-sm text-gray-400 font-normal">/ forever</span></div>
                    <ul className="space-y-3 mb-8 flex-1">
                        {["Standard listing", "Pay per lead (1 credit)", "Receive enquiries", "Basic profile"].map(f => (
                            <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                                <span className="material-symbols-outlined text-gray-300 text-[18px]">check_circle</span> {f}
                            </li>
                        ))}
                    </ul>
                    <button disabled className="w-full py-3 rounded-xl bg-gray-100 text-gray-400 font-semibold text-sm cursor-not-allowed">
                        Current plan
                    </button>
                </div>

                {/* Pro Plan */}
                {plans.filter(p => p.tier === 'PRO').map(plan => (
                    <div key={plan.id} className="bg-blue-600 rounded-2xl p-6 border-2 border-blue-600 shadow-lg flex flex-col relative">
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                            <span className="bg-white text-blue-600 text-xs font-bold px-3 py-1 rounded-full border border-blue-100 shadow-sm">Most popular</span>
                        </div>
                        <h3 className="text-lg font-bold text-white mb-1">{plan.name}</h3>
                        <div className="text-2xl font-bold text-white mb-5">₹{plan.price} <span className="text-sm text-blue-200 font-normal">/ {plan.interval}</span></div>
                        <ul className="space-y-3 mb-8 flex-1">
                            {plan.features.map(f => (
                                <li key={f} className="flex items-center gap-2 text-sm text-blue-50">
                                    <span className="material-symbols-outlined text-blue-200 text-[18px]">verified</span> {f}
                                </li>
                            ))}
                        </ul>
                        <button
                            onClick={() => handleSubscribe(plan)}
                            className="w-full py-3 rounded-xl bg-white text-blue-600 font-bold text-sm hover:bg-blue-50 transition-colors"
                        >
                            Upgrade to Pro
                        </button>
                    </div>
                ))}

                {/* Elite Plan */}
                {plans.filter(p => p.tier === 'ELITE').map(plan => (
                    <div key={plan.id} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm flex flex-col">
                        <h3 className="text-lg font-bold text-gray-900 mb-1">{plan.name}</h3>
                        <div className="text-2xl font-bold text-gray-900 mb-5">₹{plan.price} <span className="text-sm text-gray-400 font-normal">/ {plan.interval}</span></div>
                        <ul className="space-y-3 mb-8 flex-1">
                            {plan.features.map(f => (
                                <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                                    <span className="material-symbols-outlined text-blue-600 text-[18px]">auto_awesome</span> {f}
                                </li>
                            ))}
                        </ul>
                        <button
                            onClick={() => handleSubscribe(plan)}
                            className="w-full py-3 rounded-xl bg-gray-900 text-white font-bold text-sm hover:bg-gray-800 transition-colors"
                        >
                            Get {plan.name}
                        </button>
                    </div>
                ))}
            </div>

            <div className="mt-12 text-center">
                <Link href={`/dashboard/tutor?tutorId=${tutorId}`} className="text-gray-500 hover:text-blue-600 font-semibold flex items-center justify-center gap-2 text-sm transition-colors">
                    <span className="material-symbols-outlined text-base">arrow_back</span>
                    Back to Dashboard
                </Link>
            </div>
        </div>
    );
}

export default function SubscriptionPage() {
    return (
        <Suspense fallback={<div className="p-10 text-center text-gray-500 font-semibold animate-pulse">Loading plans...</div>}>
            <SubscriptionContent />
        </Suspense>
    );
}
