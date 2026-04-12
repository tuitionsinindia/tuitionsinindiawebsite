"use client";

import { useState } from "react";
import { Zap, History, BadgeCheck, AlertCircle, Loader2, X } from "lucide-react";

const CREDIT_PACKAGES = [
    { id: "10", label: "10 Credits", credits: 10, price: 99, description: "Unlock ~10 basic leads" },
    { id: "25", label: "25 Credits", credits: 25, price: 249, description: "Best for active tutors", popular: true },
    { id: "50", label: "50 Credits", credits: 50, price: 449, description: "Stock up and save" },
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

export default function BillingModule({ userData, transactions = [], userId, onRefresh }) {
    const [showCreditModal, setShowCreditModal] = useState(false);
    const [selectedPackage, setSelectedPackage] = useState("25");
    const [paymentLoading, setPaymentLoading] = useState(false);
    const [paymentError, setPaymentError] = useState("");

    const handleBuyCredits = async () => {
        const pkg = CREDIT_PACKAGES.find(p => p.id === selectedPackage);
        if (!pkg || !userId) return;

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
                    amount: pkg.price,
                    currency: "INR",
                    receipt: `credits_${userId}_${Date.now()}`,
                    userId,
                    description: `${pkg.credits} Credits Pack`
                })
            });
            const order = await orderRes.json();

            if (!order.id) {
                setPaymentError("Could not create payment. Please try again.");
                setPaymentLoading(false);
                return;
            }

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: order.currency,
                name: "TuitionsInIndia",
                description: `${pkg.credits} Credits`,
                order_id: order.id,
                handler: async function (response) {
                    const verifyRes = await fetch("/api/payment/verify", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            userId,
                            creditsToAdd: pkg.credits,
                            subscriptionTier: userData?.subscriptionTier || "FREE"
                        })
                    });
                    const result = await verifyRes.json();
                    if (result.success) {
                        setShowCreditModal(false);
                        if (onRefresh) onRefresh();
                    } else {
                        setPaymentError("Payment verification failed. Contact support.");
                    }
                    setPaymentLoading(false);
                },
                prefill: {
                    name: userData?.name || "",
                    contact: userData?.phone ? `+91${userData.phone}` : ""
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
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Billing</h2>
                <p className="text-gray-500 text-sm mt-1">Manage your subscription and view transaction history.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Credits */}
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
                    <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center mb-3">
                        <Zap size={18} className="text-amber-600" />
                    </div>
                    <p className="text-sm text-amber-700 font-medium mb-1">Credits Available</p>
                    <p className="text-3xl font-bold text-amber-900">{userData?.credits || 0}</p>
                    <button
                        onClick={() => setShowCreditModal(true)}
                        className="mt-4 w-full py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700 transition-colors"
                    >
                        Buy Credits
                    </button>
                </div>

                {/* Plan */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center mb-3">
                        <BadgeCheck size={18} className="text-blue-600" />
                    </div>
                    <p className="text-sm text-gray-500 font-medium mb-1">Current Plan</p>
                    <p className="text-xl font-bold text-gray-900 capitalize">
                        {userData?.subscriptionTier?.toLowerCase() || "Free"}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                        {userData?.subscriptionStatus === "ACTIVE" ? "Active" : "No active subscription"}
                    </p>
                </div>

                {/* Transaction count */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6">
                    <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center mb-3">
                        <History size={18} className="text-indigo-600" />
                    </div>
                    <p className="text-sm text-gray-500 font-medium mb-1">Transactions</p>
                    <p className="text-3xl font-bold text-gray-900">{transactions.length}</p>
                    <p className="text-xs text-gray-400 mt-1">Total payments made</p>
                </div>
            </div>

            {/* Transaction History */}
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-900">Transaction History</h3>
                </div>
                {transactions.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {transactions.map((tx) => (
                                    <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 text-sm text-gray-700">
                                            {tx.description || "Credit Purchase"}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-semibold text-emerald-600">
                                            ₹{tx.amount}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-400">
                                            {new Date(tx.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                                                tx.status === "SUCCESS" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                                            }`}>
                                                {tx.status === "SUCCESS" ? "Paid" : tx.status?.charAt(0) + tx.status?.slice(1)?.toLowerCase()}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="py-16 text-center">
                        <AlertCircle size={32} className="text-gray-200 mx-auto mb-3" />
                        <p className="text-sm text-gray-400">No transactions yet.</p>
                    </div>
                )}
            </div>

            {/* Buy Credits Modal */}
            {showCreditModal && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="text-lg font-bold text-gray-900">Buy Credits</h3>
                            <button
                                onClick={() => { setShowCreditModal(false); setPaymentError(""); }}
                                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
                            >
                                <X size={16} className="text-gray-400" />
                            </button>
                        </div>

                        <p className="text-sm text-gray-500 mb-5">Credits are used to unlock student contact details. 1 basic lead = 1 credit.</p>

                        <div className="space-y-3 mb-5">
                            {CREDIT_PACKAGES.map((pkg) => (
                                <button
                                    key={pkg.id}
                                    type="button"
                                    onClick={() => setSelectedPackage(pkg.id)}
                                    className={`w-full text-left p-4 rounded-xl border-2 transition-all relative ${
                                        selectedPackage === pkg.id
                                            ? "border-blue-600 bg-blue-50"
                                            : "border-gray-200 hover:border-gray-300"
                                    }`}
                                >
                                    {pkg.popular && (
                                        <span className="absolute -top-2.5 right-4 bg-blue-600 text-white text-xs font-semibold px-2.5 py-0.5 rounded-full">
                                            Popular
                                        </span>
                                    )}
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-semibold text-gray-900 text-sm">{pkg.label}</p>
                                            <p className="text-xs text-gray-400 mt-0.5">{pkg.description}</p>
                                        </div>
                                        <p className="text-lg font-bold text-gray-900">₹{pkg.price}</p>
                                    </div>
                                </button>
                            ))}
                        </div>

                        {paymentError && (
                            <div className="text-red-600 text-xs bg-red-50 p-3 rounded-xl border border-red-100 mb-4">
                                {paymentError}
                            </div>
                        )}

                        <button
                            onClick={handleBuyCredits}
                            disabled={paymentLoading}
                            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {paymentLoading
                                ? <><Loader2 className="animate-spin" size={16} /> Opening payment...</>
                                : <>Pay ₹{CREDIT_PACKAGES.find(p => p.id === selectedPackage)?.price}</>
                            }
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
