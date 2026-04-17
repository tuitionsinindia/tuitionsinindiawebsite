"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    Phone, ArrowRight, User, UserCheck, Building2,
    ShieldCheck, GraduationCap, Award, Check, Loader2
} from "lucide-react";

const loginTypes = [
    { id: 'student', title: 'Student', icon: User },
    { id: 'tutor', title: 'Tutor', icon: UserCheck },
    { id: 'institute', title: 'Institute', icon: Building2 }
];

const ROLE_MAP = { student: 'STUDENT', tutor: 'TUTOR', institute: 'INSTITUTE' };
const DASHBOARD_MAP = {
    STUDENT: (id) => `/dashboard/student?studentId=${id}`,
    TUTOR: (id) => `/dashboard/tutor?tutorId=${id}`,
    INSTITUTE: (id) => `/dashboard/institute?instId=${id}`
};

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

export default function LoginPage() {
    const router = useRouter();
    const [loginType, setLoginType] = useState("student");
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");
    const [step, setStep] = useState(1);
    const [userId, setUserId] = useState(null);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Google OAuth login handler
    const handleGoogleMessage = useCallback((event) => {
        if (event.origin !== window.location.origin) return;
        if (event.data.type === "GOOGLE_AUTH_SUCCESS") {
            const user = event.data.user;
            if (user.phoneVerified && user.phone) {
                router.push(DASHBOARD_MAP[user.role](user.id));
            } else {
                setError("Your account needs phone verification. Please register first.");
            }
        } else if (event.data.type === "GOOGLE_AUTH_ERROR") {
            setError(event.data.error || "Google sign-in failed.");
        }
    }, [router]);

    useEffect(() => {
        window.addEventListener("message", handleGoogleMessage);
        return () => window.removeEventListener("message", handleGoogleMessage);
    }, [handleGoogleMessage]);

    const handleGoogleLogin = () => {
        setError("");
        const w = 500, h = 600;
        const left = window.screenX + (window.outerWidth - w) / 2;
        const top = window.screenY + (window.outerHeight - h) / 2;
        const popup = window.open(
            `/api/auth/google?role=${ROLE_MAP[loginType]}&mode=login`,
            "google-auth",
            `width=${w},height=${h},left=${left},top=${top},toolbar=no,menubar=no`
        );
        if (!popup) setError("Please allow popups for this site to sign in with Google.");
    };

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);
        try {
            const res = await fetch("/api/auth/otp/send", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phone, role: ROLE_MAP[loginType], isRegistration: false })
            });
            const data = await res.json();
            if (data.success) {
                setUserId(data.userId);
                setStep(2);
            } else {
                setError(data.error || "Failed to send OTP.");
            }
        } catch {
            setError("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);
        try {
            const res = await fetch("/api/auth/otp/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, phone, otp })
            });
            const data = await res.json();
            if (data.success) {
                router.push(DASHBOARD_MAP[data.user.role](data.user.id));
            } else {
                setError(data.error || "Invalid OTP.");
            }
        } catch {
            setError("Verification failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans relative overflow-hidden antialiased">
            <div className="flex-1 flex items-center justify-center p-6 z-10 pt-32 pb-24">
                <div className="w-full max-w-md">

                    <div className="text-center mb-8">
                        <Link href="/" className="inline-flex items-center gap-2.5 mb-6 group">
                            <div className="size-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-sm">
                                <GraduationCap size={22} className="text-white" />
                            </div>
                            <span className="text-xl font-bold text-gray-900 tracking-tight">
                                Tuitions<span className="text-blue-600">in</span>India
                            </span>
                        </Link>
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">Welcome back</h1>
                        <p className="text-gray-500 text-sm">
                            {step === 1 ? "Enter your phone number to receive an OTP" : "Enter the 6-digit code sent to your phone"}
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                        <div className="h-1 bg-gray-50 w-full overflow-hidden">
                            <div className={`h-full bg-blue-600 transition-all duration-500 ${isLoading ? 'w-full opacity-100' : 'w-0 opacity-0'}`}></div>
                        </div>

                        <div className="p-6">
                            {/* Login Type Tabs */}
                            <div className="flex p-1 bg-gray-50 rounded-xl mb-6 border border-gray-100">
                                {loginTypes.map((type) => (
                                    <button
                                        key={type.id}
                                        onClick={() => { setLoginType(type.id); setError(""); setStep(1); setPhone(""); setOtp(""); }}
                                        className={`flex-1 py-3 px-2 text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${
                                            loginType === type.id
                                                ? 'bg-white text-blue-600 shadow-sm'
                                                : 'text-gray-400 hover:text-gray-600'
                                        }`}
                                    >
                                        <type.icon size={16} />
                                        <span className="hidden sm:inline">{type.title}</span>
                                    </button>
                                ))}
                            </div>

                            {error && (
                                <div className="mb-4 p-4 bg-red-50 text-red-600 text-sm font-medium rounded-xl text-center border border-red-100 flex items-center justify-center gap-2">
                                    <ShieldCheck size={16} /> {error}
                                </div>
                            )}

                            {step === 1 ? (
                                <div className="space-y-5">
                                    {/* Phone OTP — primary method */}
                                    <form onSubmit={handleSendOtp} className="space-y-5">
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-gray-700">Mobile Number</label>
                                            <div className="relative group">
                                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-600 transition-colors" size={18} />
                                                <div className="absolute left-11 top-1/2 -translate-y-1/2 text-gray-400 font-semibold border-r border-gray-200 pr-3 pointer-events-none text-sm">+91</div>
                                                <input
                                                    type="tel"
                                                    pattern="[0-9]{10}"
                                                    value={phone}
                                                    onChange={(e) => setPhone(e.target.value)}
                                                    required
                                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-20 pr-4 py-4 font-medium outline-none transition-all text-gray-900 placeholder:text-gray-300 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/10"
                                                    placeholder="10-digit number"
                                                />
                                            </div>
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-sm shadow-sm hover:bg-blue-700 active:scale-[0.99] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                                        >
                                            {isLoading ? <><Loader2 size={16} className="animate-spin" /> Sending OTP...</> : <>Send OTP <ArrowRight size={16} /></>}
                                        </button>
                                    </form>

                                    <div className="flex items-center gap-3">
                                        <div className="flex-1 h-px bg-gray-200" />
                                        <span className="text-xs text-gray-400 font-medium">or continue with</span>
                                        <div className="flex-1 h-px bg-gray-200" />
                                    </div>

                                    {/* Google Login — secondary */}
                                    <button
                                        type="button"
                                        onClick={handleGoogleLogin}
                                        className="w-full py-3.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center justify-center gap-3 shadow-sm"
                                    >
                                        <GoogleIcon size={18} />
                                        Continue with Google
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleVerifyOtp} className="space-y-5">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">Verification Code</label>
                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            pattern="[0-9]{6}"
                                            maxLength={6}
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                            required
                                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 font-bold text-center text-2xl tracking-[0.5em] outline-none transition-all text-gray-900 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/10"
                                            placeholder="------"
                                        />
                                        <p className="text-center text-sm text-gray-500">
                                            Sent to +91 {phone}
                                        </p>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-sm shadow-sm hover:bg-blue-700 active:scale-[0.99] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                                    >
                                        {isLoading ? <><Loader2 size={16} className="animate-spin" /> Verifying...</> : <>Log In <ArrowRight size={16} /></>}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => { setStep(1); setOtp(""); setError(""); }}
                                        className="w-full text-sm font-semibold text-gray-500 hover:text-blue-600 transition-colors"
                                    >
                                        Change Number
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>

                    <div className="mt-8 text-center">
                        <p className="text-sm text-gray-500">
                            New here?{' '}
                            <Link href="/get-started" className="text-blue-600 font-semibold hover:text-blue-700 transition-colors">
                                Create Account
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-md mx-auto px-6 grid grid-cols-3 gap-8 text-center mb-16 opacity-40">
                <div className="space-y-2">
                    <Award size={18} className="mx-auto text-gray-600" />
                    <p className="text-xs font-semibold text-gray-600">Trusted Platform</p>
                </div>
                <div className="space-y-2">
                    <ShieldCheck size={18} className="mx-auto text-gray-600" />
                    <p className="text-xs font-semibold text-gray-600">Safe & Secure</p>
                </div>
                <div className="space-y-2">
                    <Check size={18} className="mx-auto text-gray-600" />
                    <p className="text-xs font-semibold text-gray-600">Verified Tutors</p>
                </div>
            </div>
        </div>
    );
}
