"use client";

import { useState, useEffect, useCallback } from "react";
import { Phone, ArrowRight, Loader2, ArrowLeft, ShieldCheck, Mail, User } from "lucide-react";
import { trackSignUp } from "@/lib/analytics";

// Inline Google "G" SVG — no external dependency
function GoogleIcon({ size = 18 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
    );
}

export default function LeadCaptureFlow({ initialRole = "STUDENT", onComplete }) {
    const [step, setStep] = useState(1); // 1=entry, 2=OTP verify, 3=Google phone verify
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [userId, setUserId] = useState(null);
    const [googleUser, setGoogleUser] = useState(null); // { id, name, email, image, ... }

    // Listen for Google OAuth popup messages
    const handleGoogleMessage = useCallback((event) => {
        if (event.origin !== window.location.origin) return;
        const data = event.data;

        if (data.type === "GOOGLE_AUTH_SUCCESS") {
            const user = data.user;
            if (user.phoneVerified && user.phone) {
                // Returning Google user — already verified, go straight to complete
                trackSignUp(initialRole);
                onComplete(user);
            } else {
                // New Google user — needs phone verification
                setGoogleUser(user);
                setUserId(user.id);
                setEmail(user.email || "");
                setStep(3);
            }
        } else if (data.type === "GOOGLE_AUTH_ERROR") {
            setError(data.error || "Google sign-in failed.");
        }
    }, [initialRole, onComplete]);

    useEffect(() => {
        window.addEventListener("message", handleGoogleMessage);
        return () => window.removeEventListener("message", handleGoogleMessage);
    }, [handleGoogleMessage]);

    const handleGoogleSignUp = () => {
        setError("");
        const w = 500, h = 600;
        const left = window.screenX + (window.outerWidth - w) / 2;
        const top = window.screenY + (window.outerHeight - h) / 2;
        const popup = window.open(
            `/api/auth/google?role=${initialRole}`,
            "google-auth",
            `width=${w},height=${h},left=${left},top=${top},toolbar=no,menubar=no`
        );
        if (!popup) {
            setError("Please allow popups for this site to sign in with Google.");
        }
    };

    const handleSendOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const body = { phone, role: initialRole, isRegistration: true };
            // If Google user is verifying phone, pass their userId
            if (googleUser?.id) body.userId = googleUser.id;

            const res = await fetch("/api/auth/otp/send", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
            const data = await res.json();
            if (data.success) {
                if (!googleUser) setUserId(data.userId); // phone flow sets userId from response
                setStep(2);
            } else {
                setError(data.error || "Failed to send OTP.");
            }
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
                // Save email if provided (phone flow) and not already set
                if (email && data.user?.id && !googleUser) {
                    fetch("/api/user/update", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ userId: data.user.id, email }),
                    }).catch(() => {});
                }
                onComplete(data.user);
            } else {
                setError(data.error || "Invalid OTP.");
            }
        } catch { setError("Verification failed. Please try again."); }
        finally { setLoading(false); }
    };

    // ─── Step 3: Google user verifying phone ────────────────────────────────────
    if (step === 3 && googleUser) {
        return (
            <div className="space-y-5">
                {/* Google profile confirmation */}
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                    {googleUser.image ? (
                        <img src={googleUser.image} alt="" className="w-10 h-10 rounded-full" referrerPolicy="no-referrer" />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <User size={18} className="text-blue-600" />
                        </div>
                    )}
                    <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">{googleUser.name}</p>
                        <p className="text-xs text-gray-500 truncate">{googleUser.email}</p>
                    </div>
                </div>

                <div>
                    <h2 className="text-lg font-bold text-gray-900">Verify your mobile number</h2>
                    <p className="text-sm text-gray-500 mt-1">Almost done! We need your phone number for tutors to contact you.</p>
                </div>

                {/* If OTP sent, show OTP input */}
                {step === 3 && otp !== "" || false ? null : null}

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

    // ─── Step 2: OTP verify (shared by phone and Google-phone flows) ────────────
    if (step === 2) {
        return (
            <div className="space-y-5">
                <button onClick={() => { setStep(googleUser ? 3 : 1); setOtp(""); setError(""); }} className="text-gray-400 hover:text-blue-600 transition-colors">
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
                    Didn't receive it? <button onClick={() => { setStep(googleUser ? 3 : 1); setError(""); setOtp(""); }} className="text-blue-600 hover:underline font-medium">Change number</button>
                </p>
            </div>
        );
    }

    // ─── Step 1: Entry — Google + Phone ─────────────────────────────────────────
    return (
        <div className="space-y-5">
            <div className="flex items-center gap-2 text-xs text-emerald-600 font-medium">
                <ShieldCheck size={14} /> Verified & Secure
            </div>
            <div>
                <h2 className="text-lg font-bold text-gray-900">Enter your mobile number</h2>
                <p className="text-sm text-gray-500 mt-1">We'll send a 6-digit OTP to verify your number.</p>
            </div>

            {/* Google Sign-up */}
            <button
                type="button"
                onClick={handleGoogleSignUp}
                className="w-full py-3 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center justify-center gap-3 shadow-sm"
            >
                <GoogleIcon size={18} />
                Continue with Google
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-xs text-gray-400 font-medium">or sign up with phone</span>
                <div className="flex-1 h-px bg-gray-200" />
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
