"use client";

import { useState, useEffect } from "react";
import Script from "next/script";
import {
    X, Clock, BookOpen, Calendar, MessageSquare,
    CheckCircle2, Loader2, ShieldCheck, AlertCircle, CreditCard
} from "lucide-react";

export default function TrialBookingModal({ tutor, defaultSubject = "", onClose, onSuccess }) {
    const [subject, setSubject] = useState(defaultSubject);
    const [preferredTime, setPreferredTime] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [done, setDone] = useState(false);
    const [paidWithCredit, setPaidWithCredit] = useState(false);
    const [scriptReady, setScriptReady] = useState(false);

    const tutorName = tutor?.name || "this tutor";
    const duration = tutor?.trialDuration || 30;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!subject.trim() || !preferredTime.trim()) return;

        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/trial/book", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    tutorId: tutor.id || tutor.userId,
                    subject: subject.trim(),
                    preferredTime: preferredTime.trim(),
                    message: message.trim() || undefined,
                }),
            });
            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Could not book demo. Please try again.");
                setLoading(false);
                return;
            }

            // Paid with platform credit — no Razorpay needed
            if (data.paidWithCredit) {
                setPaidWithCredit(true);
                setDone(true);
                onSuccess?.();
                setLoading(false);
                return;
            }

            // Open Razorpay modal
            const options = {
                key: data.keyId,
                amount: data.amount,
                currency: data.currency,
                name: "TuitionsinIndia",
                description: `Demo class deposit — ${tutorName}`,
                order_id: data.orderId,
                handler: async (response) => {
                    // Verify payment server-side
                    const verifyRes = await fetch("/api/trial/deposit/verify", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            trialId: data.trialId,
                            razorpayOrderId: response.razorpay_order_id,
                            razorpayPaymentId: response.razorpay_payment_id,
                            razorpaySignature: response.razorpay_signature,
                        }),
                    });
                    if (verifyRes.ok) {
                        setDone(true);
                        onSuccess?.();
                    } else {
                        setError("Payment done but verification failed. Please contact support with your payment ID: " + response.razorpay_payment_id);
                    }
                    setLoading(false);
                },
                prefill: { name: "", email: "", contact: "" },
                theme: { color: "#2563eb" },
                modal: {
                    ondismiss: () => {
                        setLoading(false);
                        setError("Payment was cancelled. Your booking slot is still reserved for 15 minutes.");
                    },
                },
            };
            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch {
            setError("Something went wrong. Please try again.");
            setLoading(false);
        }
    };

    return (
        <>
            <Script
                src="https://checkout.razorpay.com/v1/checkout.js"
                strategy="lazyOnload"
                onLoad={() => setScriptReady(true)}
            />

            <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
                <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
                    >
                        <X size={20} />
                    </button>

                    {/* ── Success state ── */}
                    {done ? (
                        <div className="p-8 text-center space-y-4">
                            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto">
                                <CheckCircle2 size={32} className="text-emerald-600" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Demo booked!</h2>
                                <p className="text-sm text-gray-500 mt-2">
                                    {paidWithCredit
                                        ? "Your platform credit has been applied. "
                                        : "Your ₹149 deposit is held securely. "}
                                    {tutorName} will confirm and set a time. You'll get a notification.
                                </p>
                            </div>
                            {!paidWithCredit && (
                                <div className="bg-blue-50 rounded-xl p-3 text-left space-y-1">
                                    <p className="text-xs font-semibold text-blue-700">What happens next?</p>
                                    <p className="text-xs text-blue-600">• Tutor accepts → you get the demo</p>
                                    <p className="text-xs text-blue-600">• Free demo → ₹149 returned as platform credit</p>
                                    <p className="text-xs text-blue-600">• Not happy → transfer credit to another tutor</p>
                                </div>
                            )}
                            <button
                                onClick={onClose}
                                className="w-full py-3 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors"
                            >
                                Done
                            </button>
                        </div>
                    ) : (
                        <>
                            {/* ── Header ── */}
                            <div className="px-6 pt-6 pb-4 border-b border-gray-100">
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                                        <Clock size={16} className="text-blue-600" />
                                    </div>
                                    <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
                                        Demo Class
                                    </span>
                                </div>
                                <h2 className="text-lg font-bold text-gray-900 mt-2">Book a demo class</h2>
                                <p className="text-sm text-gray-500 mt-1">
                                    with <span className="font-semibold text-gray-700">{tutorName}</span>
                                    {" · "}{duration} min
                                </p>
                            </div>

                            {/* ── Deposit notice ── */}
                            <div className="mx-6 mt-4 bg-amber-50 border border-amber-100 rounded-xl p-3 flex items-start gap-2.5">
                                <ShieldCheck size={15} className="text-amber-600 shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-xs font-semibold text-amber-800">₹149 refundable deposit required</p>
                                    <p className="text-xs text-amber-700 mt-0.5 leading-relaxed">
                                        Ensures only serious students book. If the tutor offers a free demo, your ₹149 is returned as platform credit for your next booking. Not happy? Transfer the credit to another tutor.
                                    </p>
                                </div>
                            </div>

                            {/* ── Form ── */}
                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-gray-600 flex items-center gap-1.5">
                                        <BookOpen size={12} /> Subject
                                    </label>
                                    <input
                                        required
                                        type="text"
                                        value={subject}
                                        onChange={e => setSubject(e.target.value)}
                                        placeholder="e.g. Maths, Physics, English..."
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                                        autoFocus
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-gray-600 flex items-center gap-1.5">
                                        <Calendar size={12} /> When are you free?
                                    </label>
                                    <input
                                        required
                                        type="text"
                                        value={preferredTime}
                                        onChange={e => setPreferredTime(e.target.value)}
                                        placeholder="e.g. Weekday evenings after 6 PM"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                                    />
                                    <p className="text-xs text-gray-400">The tutor will confirm and coordinate the exact time.</p>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-gray-600 flex items-center gap-1.5">
                                        <MessageSquare size={12} /> Message <span className="text-gray-400 font-normal">(optional)</span>
                                    </label>
                                    <textarea
                                        rows={2}
                                        value={message}
                                        onChange={e => setMessage(e.target.value)}
                                        placeholder="Your goal, current level, or anything the tutor should know..."
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none"
                                    />
                                </div>

                                {error && (
                                    <div className="flex items-start gap-2 bg-red-50 border border-red-100 rounded-xl p-3">
                                        <AlertCircle size={14} className="text-red-500 shrink-0 mt-0.5" />
                                        <p className="text-sm text-red-600">{error}</p>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading || !subject.trim() || !preferredTime.trim()}
                                    className="w-full py-3 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {loading
                                        ? <Loader2 size={16} className="animate-spin" />
                                        : <><CreditCard size={15} /> Pay ₹149 &amp; Book Demo</>
                                    }
                                </button>

                                <p className="text-center text-xs text-gray-400">
                                    Secure payment via Razorpay · UPI, card, net banking accepted
                                </p>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}
