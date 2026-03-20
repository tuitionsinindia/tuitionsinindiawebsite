"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function StudentRegisterContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    // 1. Pre-fill State from URL or Session
    const [formData, setFormData] = useState({
        name: "",
        subject: searchParams.get("subject") || "",
        grade: searchParams.get("grade") || "",
        location: searchParams.get("location") || "",
        phone: "",
        email: "",
        password: "DefaultPassword123!", // Hidden for simplified signup
    });

    useEffect(() => {
        // Fallback to session storage if not in URL
        if (!formData.subject) {
            const savedSubject = sessionStorage.getItem("last_search_subject");
            const savedGrade = sessionStorage.getItem("last_search_grade");
            if (savedSubject) setFormData(prev => ({ ...prev, subject: savedSubject, grade: savedGrade }));
        }
    }, []);

    const [step, setStep] = useState(1); // 1: Info, 2: OTP
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSendOTP = async (e) => {
        e.preventDefault();
        setError("");
        setIsSubmitting(true);
        try {
            const res = await fetch("/api/auth/send-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phone: formData.phone }),
            });
            if (res.ok) {
                setOtpSent(true);
                setStep(2);
            } else {
                const data = await res.json();
                setError(data.error || "Failed to send OTP.");
            }
        } catch (err) {
            setError("Request failed. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleVerifyAndRegister = async (e) => {
        e.preventDefault();
        setError("");
        setIsSubmitting(true);

        try {
            // 1. Verify OTP
            const verifyRes = await fetch("/api/auth/verify-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phone: formData.phone, otp }),
            });

            if (!verifyRes.ok) {
                setError("Invalid OTP code.");
                setIsSubmitting(false);
                return;
            }

            // 2. Register User (Student)
            const regRes = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...formData, role: "STUDENT" }),
            });

            if (!regRes.ok) {
                const regData = await regRes.json();
                setError(regData.error || "Registration failed.");
                setIsSubmitting(false);
                return;
            }

            // 3. Auto-Create Lead (Requirement) if context exists
            if (formData.subject) {
                await fetch("/api/lead/post", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        studentId: "current_user", // API handles session
                        subject: formData.subject,
                        grade: formData.grade,
                        location: formData.location || "Online / Not Specified",
                        description: `Automatically created requirement for ${formData.subject} - ${formData.grade} in ${formData.location || 'India'}`,
                        name: formData.name,
                        phone: formData.phone,
                        email: formData.email
                    }),
                });
            }

            // 4. Redirect to Dashboard
            router.push("/dashboard/student");
        } catch (err) {
            setError("An error occurred. Please try manually.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden font-sans">
            <div className="absolute inset-0 bg-primary/5 blur-[120px] rounded-full scale-150 -z-10 translate-y-20"></div>
            
            <div className="max-w-xl w-full bg-white rounded-[3rem] shadow-2xl border border-white/50 relative p-12 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-accent"></div>
                
                <div className="text-center mb-10">
                    <Link href="/" className="inline-flex items-center gap-2 mb-8 group">
                        <span className="material-symbols-outlined text-4xl font-bold text-primary group-hover:scale-110 transition-transform">school</span>
                        <span className="text-3xl font-black tracking-tight text-slate-900 leading-none">TuitionsInIndia</span>
                    </Link>
                    <h2 className="text-3xl font-black text-slate-900 mb-2">Student <span className="text-primary italic font-serif">Enrollment</span></h2>
                    <p className="text-slate-500 font-bold">Join 50,000+ students finding expert tutors daily.</p>
                </div>

                {/* CONTEXT CHIP */}
                {formData.subject && (
                    <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6 mb-10 flex items-center gap-4 animate-fade-in">
                        <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                            <span className="material-symbols-outlined">auto_fix_high</span>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1">Applying for</p>
                            <h4 className="text-sm font-black text-slate-900">{formData.subject} <span className="opacity-40mx-2">/</span> {formData.grade}</h4>
                        </div>
                    </div>
                )}

                {step === 1 ? (
                    <form onSubmit={handleSendOTP} className="space-y-6">
                        <div>
                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Full Name</label>
                            <input 
                                type="text" required
                                placeholder="Enter your name"
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-bold outline-none focus:ring-2 focus:ring-primary transition-all shadow-inner"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Mobile Number</label>
                            <div className="flex gap-2">
                                <span className="px-4 py-4 bg-slate-100 rounded-2xl font-black text-slate-400 flex items-center text-sm">+91</span>
                                <input 
                                    type="tel" required pattern="[0-9]{10}"
                                    placeholder="10-digit number"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                    className="flex-1 bg-slate-50 border-none rounded-2xl px-6 py-4 font-bold outline-none focus:ring-2 focus:ring-primary transition-all shadow-inner"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Email Address</label>
                            <input 
                                type="email" required
                                placeholder="name@example.com"
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-bold outline-none focus:ring-2 focus:ring-primary transition-all shadow-inner"
                            />
                        </div>

                        {error && <p className="text-center text-rose-500 font-bold text-sm bg-rose-50 p-4 rounded-xl border border-rose-100">{error}</p>}

                        <button 
                            type="submit" disabled={isSubmitting}
                            className="w-full bg-slate-900 text-white font-black py-5 rounded-2xl hover:bg-primary shadow-2xl shadow-indigo-900/10 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-sm"
                        >
                            {isSubmitting ? <span className="material-symbols-outlined animate-spin">refresh</span> : "Continue & Verify"}
                            <span className="material-symbols-outlined">arrow_forward</span>
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleVerifyAndRegister} className="space-y-10 animate-fade-in">
                        <div className="text-center">
                            <p className="text-slate-500 font-bold mb-4">Verification code sent to <span className="text-slate-900 font-black">{formData.phone}</span></p>
                            <input 
                                type="text" required maxLength="6"
                                placeholder="0 0 0 0 0 0"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                className="bg-slate-50 border-none rounded-2xl px-8 py-6 text-3xl font-black text-center tracking-[0.6em] outline-none focus:ring-2 focus:ring-primary w-full shadow-inner"
                            />
                        </div>

                        {error && <p className="text-center text-rose-500 font-bold text-sm bg-rose-50 p-4 rounded-xl border border-rose-100">{error}</p>}

                        <div className="flex gap-4">
                            <button 
                                type="button" onClick={() => setStep(1)}
                                className="flex-1 bg-slate-100 text-slate-600 font-black py-5 rounded-2xl hover:bg-slate-200 transition-all"
                            >Back</button>
                            <button 
                                type="submit" disabled={isSubmitting}
                                className="flex-[2] bg-primary text-white font-black py-5 rounded-2xl hover:bg-slate-900 shadow-2xl transition-all uppercase tracking-widest text-sm"
                            >Verify & Register</button>
                        </div>
                    </form>
                )}

                <p className="mt-10 text-center text-xs font-bold text-slate-400">
                    Already a member? <Link href="/login" className="text-primary hover:underline">Log In</Link>
                </p>
            </div>
        </div>
    );
}

export default function StudentRegisterPage() {
    return (
        <Suspense fallback={<div className="p-20 text-center font-black animate-pulse text-slate-200 uppercase tracking-widest">Waking up security engine...</div>}>
            <StudentRegisterContent />
        </Suspense>
    );
}
