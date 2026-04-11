"use client";

import { useState } from "react";
import {
    User,
    Phone,
    ChevronRight,
    Loader2,
    CheckCircle2,
    ArrowLeft,
    ShieldCheck,
    XCircle,
    Lock
} from "lucide-react";

export default function LeadCaptureFlow({ initialRole = "STUDENT", onComplete }) {
    const [step, setStep] = useState(1); // 1: Lead Capture, 2: OTP
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
                body: JSON.stringify(form)
            });
            const data = await res.json();
            
            if (data.success) {
                setUserId(data.userId);
                setStep(2);
            } else {
                setError(data.error || "Failed to send OTP.");
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
                setError(data.error || "Invalid OTP code.");
            }
        } catch (err) {
            setError("Verification failed. Please check your network.");
        } finally {
            setLoading(false);
        }
    };

    if (step === 1) {
        return (
            <div className="w-full max-w-sm mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-white rounded-[2rem] p-6 md:p-8 border border-gray-100 shadow-2xl shadow-blue-100/50">
                    <div className="space-y-2 mb-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100">
                            <ShieldCheck size={12} /> Secure Sign Up
                        </div>
                        <h2 className="text-2xl font-black text-gray-900 tracking-tight">Create your account</h2>
                        <p className="text-gray-500 font-medium text-sm">Enter your name and mobile number — we'll verify with a quick OTP.</p>
                    </div>

                    <form onSubmit={handleSendOTP} className="space-y-4">
                        <div className="space-y-2 text-left">
                            <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-2">Full Name</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-600 transition-colors" size={18} />
                                <input 
                                    required
                                    type="text" 
                                    placeholder="Your official name"
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl flex items-center focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all outline-none font-bold text-sm placeholder:text-gray-300"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2 text-left">
                            <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-2">Mobile Number (OTP required)</label>
                            <div className="relative group">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-600 transition-colors" size={18} />
                                <div className="absolute left-10 top-1/2 -translate-y-1/2 text-gray-400 font-bold border-r border-gray-200 pr-2 pointer-events-none">+91</div>
                                <input 
                                    required
                                    type="tel" 
                                    pattern="[0-9]{10}"
                                    placeholder="10-digit number"
                                    className="w-full pl-16 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all outline-none font-bold text-sm placeholder:text-gray-300"
                                    value={form.phone}
                                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                />
                            </div>
                        </div>

                        {error && <p className="text-red-500 text-xs font-bold bg-red-50 p-3 rounded-xl border border-red-100">{error}</p>}

                        <button 
                            disabled={loading}
                            type="submit" 
                            className="w-full py-4 bg-blue-600 text-white rounded-xl font-black text-sm shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group"
                        >
                            {loading ? <Loader2 className="animate-spin" size={18} /> : (
                                <>Get Verified <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" /></>
                            )}
                        </button>
                    </form>
                </div>
                <p className="mt-8 text-center text-gray-400 text-xs font-medium">
                    By continuing, you agree to receive an OTP via SMS for verification.
                </p>
            </div>
        );
    }

    if (step === 2) {
        return (
            <div className="w-full max-w-sm mx-auto animate-in zoom-in-95 duration-500">
                <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-2xl shadow-blue-100/50 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gray-50">
                        <div className="h-full bg-blue-600 w-1/2 animate-pulse"></div>
                    </div>

                    <button onClick={() => setStep(1)} className="absolute top-8 left-8 text-gray-300 hover:text-blue-600 transition-all active:scale-90">
                        <ArrowLeft size={18} strokeWidth={2.5} />
                    </button>
                    
                    <div className="size-20 rounded-[1.8rem] bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-8 shadow-inner border border-blue-100">
                        <ShieldCheck size={32} strokeWidth={2.5} className="animate-pulse" />
                    </div>

                    <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Enter OTP</h2>
                    <p className="text-gray-500 font-bold text-xs mb-8 uppercase tracking-widest leading-relaxed">
                        SENT TO <span className="text-blue-600 border-b-2 border-blue-100">+91 {form.phone}</span>
                    </p>

                    <form onSubmit={handleVerifyOTP} className="space-y-6">
                        <div className="space-y-4">
                            <input 
                                required
                                type="text"
                                maxLength="6"
                                placeholder="******"
                                className="w-full text-center text-4xl tracking-[0.6em] font-black py-4 bg-gray-50/50 border-2 border-gray-100 rounded-2xl focus:bg-white focus:border-blue-600 focus:ring-8 focus:ring-blue-100/50 transition-all outline-none text-gray-900 placeholder:text-gray-200"
                                value={form.otp}
                                onChange={(e) => setForm({ ...form, otp: e.target.value })}
                                autoFocus
                            />
                        </div>

                        {error && (
                            <div className="flex items-center justify-center gap-2 text-red-500 text-[10px] font-black uppercase tracking-widest bg-red-50 py-2 px-4 rounded-full border border-red-100 animate-bounce">
                                <XCircle size={14} /> {error}
                            </div>
                        )}

                        <button 
                            disabled={loading}
                            type="submit" 
                            className="w-full py-5 bg-gray-900 text-white rounded-2xl font-black text-sm shadow-xl shadow-gray-200 hover:bg-blue-600 transition-all active:scale-[0.97] flex items-center justify-center gap-3 group"
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : (
                                <>Verify OTP <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" /></>
                            )}
                        </button>
                    </form>

                    <div className="mt-10 pt-8 border-t border-gray-100 flex flex-col gap-2">
                        <button className="text-blue-600 font-black text-[11px] uppercase tracking-widest hover:text-gray-900 transition-colors">Resend OTP</button>
                    </div>
                </div>
            </div>
        );
    }

    return null;
}
