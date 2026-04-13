"use client";

import { useState } from "react";
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

export default function LoginPage() {
    const router = useRouter();
    const [loginType, setLoginType] = useState("student");
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");
    const [step, setStep] = useState(1);
    const [userId, setUserId] = useState(null);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

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
