"use client";

import { useState, useEffect, useCallback } from "react";
import { Phone, ArrowRight, Loader2, ArrowLeft, ShieldCheck, Mail, User, CheckCircle2 } from "lucide-react";
import { trackSignUp } from "@/lib/analytics";

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
    // Steps: 1=phone, 2=OTP, 3=complete profile (Google or manual)
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");
    const [userId, setUserId] = useState(null);
    const [verifiedUser, setVerifiedUser] = useState(null);

    // Profile completion (step 3)
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [googleImage, setGoogleImage] = useState("");
    const [googleConnected, setGoogleConnected] = useState(false);

    // Listen for Google OAuth popup messages (step 3)
    const handleGoogleMessage = useCallback((event) => {
        if (event.origin !== window.location.origin) return;
        if (event.data.type === "GOOGLE_AUTH_SUCCESS") {
            const gUser = event.data.user;
            // Link Google to existing phone-verified user — save name, email, photo
            if (verifiedUser?.id) {
                fetch("/api/user/update", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        userId: verifiedUser.id,
                        name: gUser.name || undefined,
                        email: gUser.email || undefined,
                        image: gUser.image || undefined,
                    }),
                }).catch(() => {});
            }
            setName(gUser.name || "");
            setEmail(gUser.email || "");
            setGoogleImage(gUser.image || "");
            setGoogleConnected(true);
            trackSignUp(initialRole);
            onComplete({
                ...verifiedUser,
                name: gUser.name || verifiedUser?.name,
                email: gUser.email || verifiedUser?.email,
                image: gUser.image || verifiedUser?.image,
            });
        } else if (event.data.type === "GOOGLE_AUTH_ERROR") {
            setError(event.data.error || "Google sign-in failed.");
        }
    }, [initialRole, onComplete, verifiedUser]);

    useEffect(() => {
        window.addEventListener("message", handleGoogleMessage);
        return () => window.removeEventListener("message", handleGoogleMessage);
    }, [handleGoogleMessage]);

    const handleGoogleConnect = () => {
        setError("");
        const w = 500, h = 600;
        const left = window.screenX + (window.outerWidth - w) / 2;
        const top = window.screenY + (window.outerHeight - h) / 2;
        // Pass the verified user's ID so the callback links Google to this account
        const linkUserId = verifiedUser?.id ? `&linkUserId=${verifiedUser.id}` : "";
        const popup = window.open(
            `/api/auth/google?role=${initialRole}${linkUserId}`,
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
            const res = await fetch("/api/auth/otp/send", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phone, role: initialRole, isRegistration: true }),
            });
            const data = await res.json();
            if (data.success) {
                setUserId(data.userId);
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
                setVerifiedUser(data.user);
                setStep(3); // Go to profile completion
            } else {
                setError(data.error || "Invalid OTP.");
            }
        } catch { setError("Verification failed. Please try again."); }
        finally { setLoading(false); }
    };

    const handleManualComplete = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (verifiedUser?.id && (name || email)) {
                await fetch("/api/user/update", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        userId: verifiedUser.id,
                        name: name || undefined,
                        email: email || undefined,
                    }),
                });
            }
            trackSignUp(initialRole);
            onComplete({ ...verifiedUser, name: name || verifiedUser.name, email: email || verifiedUser.email });
        } catch {
            trackSignUp(initialRole);
            onComplete(verifiedUser);
        } finally { setLoading(false); }
    };

    // ─── Step 3: Complete your profile ──────────────────────────────────────────
    if (step === 3 && verifiedUser) {
        return (
            <div className="space-y-5">
                {/* Verified confirmation */}
                <div className="flex items-center gap-2.5 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                    <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                    <div>
                        <p className="text-sm font-semibold text-emerald-900">Phone verified ✓</p>
                        <p className="text-xs text-emerald-600">+91 {phone}</p>
                    </div>
                </div>

                <div>
                    <h2 className="text-lg font-bold text-gray-900">One last step</h2>
                    <p className="text-sm text-gray-500 mt-1">Add your name so tutors know who to contact.</p>
                </div>

                {/* Google — primary option */}
                <button
                    type="button"
                    onClick={handleGoogleConnect}
                    className="w-full py-3.5 bg-white border-2 border-gray-200 rounded-xl font-semibold text-gray-800 hover:border-blue-400 hover:bg-blue-50 transition-all flex items-center justify-center gap-3 shadow-sm"
                >
                    <GoogleIcon size={20} />
                    <span>
                        Continue with Google
                        <span className="block text-xs font-normal text-gray-400 mt-0.5">Auto-fills your name, email & profile photo</span>
                    </span>
                </button>

                {/* Divider */}
                <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-gray-200" />
                    <span className="text-xs text-gray-400 font-medium">or enter manually</span>
                    <div className="flex-1 h-px bg-gray-200" />
                </div>

                {/* Manual form */}
                <form onSubmit={handleManualComplete} className="space-y-4">
                    {/* Name field — with optional profile photo preview */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-gray-500">Your name <span className="text-red-400">*</span></label>
                        <div className="relative flex items-center gap-2">
                            {googleImage ? (
                                <img src={googleImage} alt="" className="size-9 rounded-full border border-gray-200 shrink-0 object-cover" />
                            ) : (
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <User size={16} className="text-gray-300" />
                                </div>
                            )}
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className={`w-full py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all ${googleImage ? "pl-3" : "pl-10"}`}
                                placeholder="Full name"
                                autoFocus={!googleConnected}
                                required
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-gray-500">
                            Email <span className="text-gray-400 font-normal">(optional — for tutor notifications)</span>
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                                placeholder="your@email.com"
                            />
                        </div>
                    </div>

                    {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">{error}</p>}

                    <button
                        disabled={loading || !name.trim()}
                        type="submit"
                        className="w-full py-3 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="animate-spin" size={16} /> : <>Continue <ArrowRight size={16} /></>}
                    </button>
                </form>

                {/* Skip */}
                <button
                    type="button"
                    onClick={() => { trackSignUp(initialRole); onComplete(verifiedUser); }}
                    className="w-full text-sm text-gray-400 hover:text-blue-600 transition-colors font-medium"
                >
                    Skip for now →
                </button>
            </div>
        );
    }

    // ─── Step 2: OTP verify ─────────────────────────────────────────────────────
    if (step === 2) {
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

    // ─── Step 1: Phone only ─────────────────────────────────────────────────────
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
