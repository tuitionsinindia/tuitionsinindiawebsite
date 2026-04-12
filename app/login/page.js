"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    Phone, ArrowRight, User, UserCheck, Building2,
    ShieldCheck, Zap, Award, Check, Loader2
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
    const [step, setStep] = useState(1); // 1: phone, 2: OTP
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
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans relative overflow-hidden antialiased selection:bg-blue-100">
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-500/5 blur-[120px] rounded-full -mr-96 -mt-96 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-400/5 blur-[100px] rounded-full -ml-64 -mb-64 pointer-events-none"></div>

            <div className="flex-1 flex items-center justify-center p-6 z-10 pt-40 pb-32">
                <div className="w-full max-w-[500px] animate-in fade-in slide-in-from-bottom-8 duration-700">

                    <div className="text-center mb-10">
                        <Link href="/" className="inline-flex items-center gap-3 mb-6 group">
                            <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-xl shadow-blue-600/20 group-hover:scale-110 transition-transform">
                                <Zap size={24} className="text-white fill-white" />
                            </div>
                            <span className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic">TuitionsInIndia</span>
                        </Link>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase mb-2">Welcome Back</h1>
                        <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest italic">
                            {step === 1 ? "Enter your phone number to receive an OTP" : "Enter the 6-digit code sent to your phone"}
                        </p>
                    </div>

                    <div className="bg-white rounded-[3rem] shadow-2xl shadow-blue-900/5 border border-slate-100 overflow-hidden relative">
                        <div className="h-1.5 bg-slate-50 w-full overflow-hidden">
                            <div className={`h-full bg-blue-600 transition-all duration-500 ${isLoading ? 'w-full opacity-100' : 'w-0 opacity-0'}`}></div>
                        </div>

                        <div className="p-8 md:p-14">
                            {/* Login Type Tabs */}
                            <div className="flex p-1.5 bg-slate-50 rounded-[1.5rem] mb-12 border border-slate-100 shadow-inner">
                                {loginTypes.map((type) => (
                                    <button
                                        key={type.id}
                                        onClick={() => { setLoginType(type.id); setError(""); setStep(1); setPhone(""); setOtp(""); }}
                                        className={`flex-1 py-4 px-2 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 italic ${
                                            loginType === type.id
                                                ? 'bg-white text-blue-600 shadow-xl shadow-blue-900/5 scale-[1.05]'
                                                : 'text-slate-400 hover:text-slate-600'
                                        }`}
                                    >
                                        <type.icon size={14} strokeWidth={3} />
                                        <span className="hidden sm:inline">{type.title}</span>
                                    </button>
                                ))}
                            </div>

                            {error && (
                                <div className="mb-6 p-5 bg-red-50 text-red-600 text-[10px] font-black rounded-2xl text-center border border-red-100 uppercase tracking-widest flex items-center justify-center gap-3 italic">
                                    <ShieldCheck size={16} strokeWidth={3} /> {error}
                                </div>
                            )}

                            {step === 1 ? (
                                <form onSubmit={handleSendOtp} className="space-y-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 italic">Mobile Number</label>
                                        <div className="relative group">
                                            <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" size={20} strokeWidth={2} />
                                            <div className="absolute left-14 top-1/2 -translate-y-1/2 text-slate-400 font-bold border-r border-slate-200 pr-3 pointer-events-none text-sm">+91</div>
                                            <input
                                                type="tel"
                                                pattern="[0-9]{10}"
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                required
                                                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl pl-24 pr-8 py-5 font-bold outline-none transition-all italic text-slate-700 placeholder:text-slate-200 shadow-inner focus:border-blue-500/20 focus:bg-white"
                                                placeholder="10-digit number"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full bg-blue-600 text-white py-6 rounded-2xl font-black text-[11px] shadow-2xl shadow-blue-600/20 hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-6 uppercase tracking-[0.3em] disabled:opacity-50"
                                    >
                                        {isLoading ? <><Loader2 size={16} className="animate-spin" /> Sending OTP...</> : <>Send OTP <ArrowRight size={16} strokeWidth={3} /></>}
                                    </button>
                                </form>
                            ) : (
                                <form onSubmit={handleVerifyOtp} className="space-y-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 italic">Verification Code</label>
                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            pattern="[0-9]{6}"
                                            maxLength={6}
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                            required
                                            className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-8 py-5 font-black text-center text-2xl tracking-[0.5em] outline-none transition-all text-slate-700 shadow-inner focus:border-blue-500/20 focus:bg-white"
                                            placeholder="------"
                                        />
                                        <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest italic">
                                            Sent to +91 {phone}
                                        </p>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full bg-blue-600 text-white py-6 rounded-2xl font-black text-[11px] shadow-2xl shadow-blue-600/20 hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-6 uppercase tracking-[0.3em] disabled:opacity-50"
                                    >
                                        {isLoading ? <><Loader2 size={16} className="animate-spin" /> Verifying...</> : <>Verify & Login <ArrowRight size={16} strokeWidth={3} /></>}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => { setStep(1); setOtp(""); setError(""); }}
                                        className="w-full text-[10px] font-black text-slate-400 uppercase tracking-widest italic hover:text-blue-600 transition-colors"
                                    >
                                        Change Number
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>

                    <div className="mt-12 text-center">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">
                            New here?{' '}
                            <Link href="/get-started" className="text-blue-600 hover:text-blue-700 transition-all ml-2 underline decoration-blue-200 underline-offset-8">
                                Create Account
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto container px-6 grid grid-cols-3 gap-12 text-center mb-20 opacity-30">
                <div className="space-y-3">
                    <Award size={20} className="mx-auto text-slate-900" />
                    <p className="text-[9px] font-black text-slate-900 uppercase tracking-widest italic">Tier-1 Market</p>
                </div>
                <div className="space-y-3">
                    <ShieldCheck size={20} className="mx-auto text-slate-900" />
                    <p className="text-[9px] font-black text-slate-900 uppercase tracking-widest italic">Secure Endpoints</p>
                </div>
                <div className="space-y-3">
                    <Check size={20} className="mx-auto text-slate-900" />
                    <p className="text-[9px] font-black text-slate-900 uppercase tracking-widest italic">Verified Logs</p>
                </div>
            </div>
        </div>
    );
}
