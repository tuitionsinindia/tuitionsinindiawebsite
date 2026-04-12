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
                        alert(`Welcome to ${plan.name}! Your account has been upgraded.`);
                        router.push(`/dashboard/tutor?tutorId=${tutorId}`);
                    }
                },
                prefill: {
                    name: tutorData?.name,
                    email: tutorData?.email,
                },
                theme: { color: "#6366f1" }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (err) {
            console.error(err);
            alert("Error initiating payment.");
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans py-20 px-6">
            <Script src="https://checkout.razorpay.com/v1/checkout.js" />

            <div className="max-w-5xl mx-auto text-center mb-16">
                <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">
                    Scale Your Teaching <span className="text-blue-600 italic font-serif">Business</span>
                </h1>
                <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto">
                    Choose a plan that fits your growth. Get more leads, better visibility, and professional tools to succeed.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                {/* Starter Plan */}
                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col">
                    <h3 className="text-xl font-bold mb-2">Starter</h3>
                    <div className="text-3xl font-black mb-6">₹0 <span className="text-sm text-slate-400 font-medium">/ forever</span></div>
                    <ul className="space-y-4 mb-10 flex-1">
                        {["Standard Ranking", "Pay-per-lead (1 credit)", "Direct Chat Enquiries", "Basic Profile"].map(f => (
                            <li key={f} className="flex items-center gap-3 text-sm font-medium text-slate-600 dark:text-slate-400">
                                <span className="material-symbols-outlined text-slate-300 text-[18px]">check_circle</span> {f}
                            </li>
                        ))}
                    </ul>
                    <button disabled className="w-full py-4 rounded-2xl bg-slate-100 text-slate-400 font-bold cursor-not-allowed">
                        Current Plan
                    </button>
                </div>

                {/* Pro Plan */}
                {plans.filter(p => p.tier === 'PRO').map(plan => (
                    <div key={plan.id} className="bg-slate-900 rounded-[2.5rem] p-10 border-4 border-blue-600 shadow-2xl shadow-blue-600/20 flex flex-col relative overflow-hidden transform scale-105">
                        <div className="absolute top-0 right-0 p-6">
                            <span className="bg-blue-600 text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest">Most Popular</span>
                        </div>
                        <h3 className="text-xl font-bold mb-2 text-white">{plan.name}</h3>
                        <div className="text-3xl font-black mb-6 text-white italic">₹{plan.price} <span className="text-sm text-white/50 font-medium">/ {plan.interval}</span></div>
                        <ul className="space-y-4 mb-10 flex-1">
                            {plan.features.map(f => (
                                <li key={f} className="flex items-center gap-3 text-sm font-medium text-white/80">
                                    <span className="material-symbols-outlined text-blue-600 text-[18px]">verified</span> {f}
                                </li>
                            ))}
                        </ul>
                        <button
                            onClick={() => handleSubscribe(plan)}
                            className="w-full py-4 rounded-2xl bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-xl shadow-blue-600/30 transition-all font-black uppercase tracking-widest text-xs"
                        >
                            Upgrade to Pro
                        </button>
                    </div>
                ))}

                {/* Elite Plan */}
                {plans.filter(p => p.tier === 'ELITE').map(plan => (
                    <div key={plan.id} className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col">
                        <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                        <div className="text-3xl font-black mb-6">₹8,999 <span className="text-sm text-slate-400 font-medium">/ year</span></div>
                        <ul className="space-y-4 mb-10 flex-1">
                            {plan.features.map(f => (
                                <li key={f} className="flex items-center gap-3 text-sm font-medium text-slate-600 dark:text-slate-400">
                                    <span className="material-symbols-outlined text-blue-600 text-[18px]">auto_awesome</span> {f}
                                </li>
                            ))}
                        </ul>
                        <button
                            onClick={() => handleSubscribe(plan)}
                            className="w-full py-4 rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold hover:opacity-90 transition-all font-black uppercase tracking-widest text-xs"
                        >
                            Go Elite
                        </button>
                    </div>
                ))}
            </div>

            <div className="mt-20 text-center">
                <Link href={`/dashboard/tutor?tutorId=${tutorId}`} className="text-slate-500 hover:text-blue-600 font-bold flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined">arrow_back</span>
                    Back to Dashboard
                </Link>
            </div>
        </div>
    );
}

export default function SubscriptionPage() {
    return (
        <Suspense fallback={<div>Loading Plans...</div>}>
            <SubscriptionContent />
        </Suspense>
    );
}
