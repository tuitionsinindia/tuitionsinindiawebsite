"use client";

import { useState } from "react";
import { Phone, ArrowRight, Loader2, ArrowLeft, ShieldCheck, Mail } from "lucide-react";
import { trackSignUp } from "@/lib/analytics";

export default function LeadCaptureFlow({ initialRole = "STUDENT", onComplete }) {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [userId, setUserId] = useState(null);

    const handleSendOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const res = await fetch("/api/auth/otp/send", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phone, role: initialRole, isRegistration: true }),
            });
            const data = await res.json();
            if (data.success) { setUserId(data.userId); setStep(2); }
            else { setError(data.error || "Failed to send OTP."); }
        } catch { setError("Something went wrong. Please try again."); }
        finally { setLoading(false); }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const res = await fetch("/api/auth/otp/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, phone, otp }),
            });
            const data = await res.json();
            if (data.success) {
                trackSignUp(initialRole);
                if (email && data.user?.id) {
                    fetch("/api/user/update", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ userId: data.user.id, email }),
                    }).catch(() => {});
                }
                onComplete(data.user);
            }
            else { setError(data.error || "Invalid OTP."); }
        } catch { setError("Verification failed. Please try again."); }
        finally { setLoading(false); }
    };

    if (step === 1) {
        return (
            <div className="space-y-5">
                <div className="flex items-center gap-2 text-xs text-emerald-600 font-medium">
                    <ShieldCheck size={14} /> Verified & Secure
                </div>
                <div>
                    <h2 className="text-lg font-bold text-gray-900">Enter your mobile number</h2>
                    <p className="text-sm text-gray-500 mt-1">We'll send a 6-digit OTP to verify your number.</p>
                </div>
                <form onSubmit={handleSendOTP} className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-gray-500">Mobile Number</label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                            <span className="absolute left-9 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium border-r border-gray-200 pr-2">+91</span>
                            <input
                                required type="tel" pattern="[0-9]{10}" value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full pl-[4.5rem] pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                                placeholder="10-digit number"
                                autoFocus
                            />
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-gray-500">Email (optional — for notifications)</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                            <input
                                type="email" value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                                placeholder="your@email.com"
                            />
                        </div>
                    </div>
                    {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">{error}</p>}
                    <button
                        disabled={loading} type="submit"
                        className="w-full py-3 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="animate-spin" size={16} /> : <>Send OTP <ArrowRight size={16} /></>}
                    </button>
                </form>
            </div>
        );
    }

    return (
        <div className="space-y-5">
            <button onClick={() => { setStep(1); setOtp(""); setError(""); }} className="text-gray-400 hover:text-blue-600 transition-colors">
                <ArrowLeft size={18} />
            </button>
            <div className="text-center">
                <h2 className="text-lg font-bold text-gray-900">Enter OTP</h2>
                <p className="text-sm text-gray-500 mt-1">
                    Sent to <span className="font-medium text-gray-700">+91 {phone}</span>
                </p>
            </div>
            <form onSubmit={handleVerifyOTP} className="space-y-5">
                <input
                    required type="text" maxLength="6" value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full text-center text-2xl tracking-[0.5em] font-bold py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                    placeholder="------" autoFocus
                />
                {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100 text-center">{error}</p>}
                <button
                    disabled={loading} type="submit"
                    className="w-full py-3 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                    {loading ? <Loader2 className="animate-spin" size={16} /> : <>Verify & Continue <ArrowRight size={16} /></>}
                </button>
            </form>
            <p className="text-center text-xs text-gray-400">
                Didn't receive it? <button onClick={() => { setStep(1); setError(""); setOtp(""); }} className="text-blue-600 hover:underline font-medium">Change number</button>
            </p>
        </div>
    );
}
