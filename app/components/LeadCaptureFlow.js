"use client";

import { useState } from "react";
import {
    User,
    Phone,
    ChevronRight,
    Loader2,
    ShieldCheck,
    ArrowLeft,
    AlertCircle
} from "lucide-react";

export default function LeadCaptureFlow({ initialRole = "STUDENT", onComplete }) {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [form, setForm] = useState({
        name: "",
        phone: "",
        role: initialRole,
        otp: ""
    });
    const [userId, setUserId] = useState(null);

    const handleSendOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/otp/send", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...form, isRegistration: true })
            });
            const data = await res.json();

            if (data.success) {
                setUserId(data.userId);
                setStep(2);
            } else {
                setError(data.error || "Failed to send OTP. Please try again.");
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/otp/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, phone: form.phone, otp: form.otp })
            });
            const data = await res.json();

            if (data.success) {
                onComplete(data.user);
            } else {
                setError(data.error || "Invalid OTP. Please try again.");
            }
        } catch (err) {
            setError("Verification failed. Please check your network.");
        } finally {
            setLoading(false);
        }
    };

    const handleResendOTP = async () => {
        setError("");
        setLoading(true);
        try {
            const res = await fetch("/api/auth/otp/send", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...form, isRegistration: true })
            });
            const data = await res.json();
            if (!data.success) setError("Failed to resend OTP.");
        } catch {
            setError("Failed to resend OTP.");
        } finally {
            setLoading(false);
        }
    };

    if (step === 1) {
        return (
            <div className="w-full max-w-sm mx-auto">
                <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-200 shadow-sm">
                    <div className="mb-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-semibold border border-blue-100 mb-3">
                            <ShieldCheck size={12} /> Verified & Secure
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">Your contact details</h2>
                        <p className="text-gray-500 text-sm mt-1">We'll send an OTP to confirm your number.</p>
                    </div>

                    <form onSubmit={handleSendOTP} className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                <input
                                    required
                                    type="text"
                                    placeholder="Your name"
                                    className="w-full pl-9 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm transition-all"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Mobile Number</label>
                            <div className="relative flex items-center">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                <span className="absolute left-9 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium border-r border-gray-200 pr-2">+91</span>
                                <input
                                    required
                                    type="tel"
                                    pattern="[0-9]{10}"
                                    placeholder="10-digit number"
                                    className="w-full pl-20 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm transition-all"
                                    value={form.phone}
                                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="flex items-center gap-2 text-red-600 text-xs bg-red-50 p-3 rounded-xl border border-red-100">
                                <AlertCircle size={14} className="shrink-0" /> {error}
                            </div>
                        )}

                        <button
                            disabled={loading}
                            type="submit"
                            className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="animate-spin" size={16} /> : (
                                <>Send OTP <ChevronRight size={16} /></>
                            )}
                        </button>
                    </form>
                </div>
                <p className="mt-4 text-center text-gray-400 text-xs">
                    By continuing, you agree to receive an OTP via SMS for verification.
                </p>
            </div>
        );
    }

    if (step === 2) {
        return (
            <div className="w-full max-w-sm mx-auto">
                <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-200 shadow-sm text-center">
                    <button onClick={() => setStep(1)} className="absolute top-4 left-4 text-gray-400 hover:text-gray-600 transition-colors">
                        <ArrowLeft size={18} />
                    </button>

                    <div className="size-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-5">
                        <ShieldCheck size={24} />
                    </div>

                    <h2 className="text-xl font-bold text-gray-900 mb-1">Enter OTP</h2>
                    <p className="text-gray-500 text-sm mb-6">
                        Sent to <span className="font-semibold text-gray-700">+91 {form.phone}</span>
                    </p>

                    <form onSubmit={handleVerifyOTP} className="space-y-4">
                        <input
                            required
                            type="text"
                            maxLength="6"
                            placeholder="——————"
                            className="w-full text-center text-3xl tracking-[0.5em] font-bold py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-gray-900 transition-all"
                            value={form.otp}
                            onChange={(e) => setForm({ ...form, otp: e.target.value })}
                            autoFocus
                        />

                        {error && (
                            <div className="flex items-center justify-center gap-2 text-red-600 text-xs bg-red-50 p-3 rounded-xl border border-red-100">
                                <AlertCircle size={14} className="shrink-0" /> {error}
                            </div>
                        )}

                        <button
                            disabled={loading}
                            type="submit"
                            className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="animate-spin" size={16} /> : "Verify & Continue"}
                        </button>
                    </form>

                    <div className="mt-5 pt-4 border-t border-gray-100">
                        <button
                            onClick={handleResendOTP}
                            disabled={loading}
                            className="text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors disabled:opacity-50"
                        >
                            Resend OTP
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return null;
}
