"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function PostRequirement() {
    const [step, setStep] = useState(1);
    const router = useRouter();
    const [formData, setFormData] = useState({
        subject: "",
        grade: "",
        location: "",
        budget: "",
        description: "",
        name: "",
        phone: "",
        email: "",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState("");
    const [otpError, setOtpError] = useState("");

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSendOTP = async () => {
        setIsSubmitting(true);
        setOtpError("");
        try {
            const res = await fetch("/api/auth/send-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phone: formData.phone }),
            });
            const data = await res.json();
            if (res.ok) {
                setOtpSent(true);
                nextStep(); // Move to OTP entry step (Step 5)
            } else {
                setOtpError(data.error || "Failed to send OTP.");
            }
        } catch (error) {
            console.error(error);
            setOtpError("Error sending OTP.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleVerifyAndSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setOtpError("");

        try {
            // 1. Verify OTP
            const verifyRes = await fetch("/api/auth/verify-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phone: formData.phone, otp }),
            });

            if (!verifyRes.ok) {
                const verifyData = await verifyRes.json();
                setOtpError(verifyData.error || "Invalid OTP.");
                setIsSubmitting(false);
                return;
            }

            // 2. Submit Lead
            const res = await fetch("/api/lead/post", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                setIsSuccess(true);
            } else {
                alert("Something went wrong. Please try again.");
            }
        } catch (error) {
            console.error(error);
            setOtpError("Error submitting requirement.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-background-dark font-sans flex items-center justify-center p-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] opacity-5 bg-cover bg-center"></div>

                <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-10 md:p-16 rounded-[2rem] shadow-2xl border border-white/50 dark:border-slate-800 max-w-lg w-full text-center relative z-10 animate-fade-in-up">
                    <div className="size-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-8 shadow-inner">
                        <span className="material-symbols-outlined text-6xl text-primary">task_alt</span>
                    </div>
                    <h1 className="text-3xl font-heading font-bold mb-4 text-slate-900 dark:text-white">Request Sent!</h1>
                    <p className="text-slate-500 mb-8 leading-relaxed">
                        We've shared your request with our top verified tutors. You will be contacted shortly by experts matching your criteria.
                    </p>
                    <button
                        onClick={() => router.push('/tutors')}
                        className="w-full bg-primary text-white font-bold py-4 rounded-xl hover:bg-primary-glow shadow-lg transition-all flex items-center justify-center gap-2">
                        Browse Tutors
                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </button>
                    <button
                        onClick={() => router.push('/')}
                        className="w-full mt-4 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold py-4 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">
                        Return Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-background-dark font-sans flex flex-col items-center py-12 md:py-20 px-4 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-primary/5 rounded-bl-full blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-accent/5 rounded-tr-full blur-[100px] pointer-events-none"></div>

            <Link href="/" className="flex items-center gap-2 mb-12 relative z-10 group">
                <span className="material-symbols-outlined text-3xl font-bold text-primary group-hover:scale-110 transition-transform">school</span>
                <span className="text-2xl font-heading font-bold tracking-tight text-slate-900 dark:text-white">TuitionsInIndia</span>
            </Link>

            <div className="w-full max-w-2xl relative z-10">
                {/* Stepper Progress */}
                <div className="mb-12 relative">
                    <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-200 dark:bg-slate-800 -translate-y-1/2 rounded-full overflow-hidden z-0">
                        <div
                            className="absolute top-0 left-0 h-full bg-primary transition-all duration-500 ease-out"
                            style={{ width: `${((step - 1) / 3) * 100}%` }}
                        ></div>
                    </div>

                    <div className="flex justify-between relative z-10">
                        {[1, 2, 3, 4, 5].map((s) => (
                            <div key={s} className={`flex flex-col items-center ${s === 5 ? 'hidden sm:flex' : ''}`}>
                                <div className={`size-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 border-4 border-slate-50 dark:border-background-dark ${step > s ? 'bg-primary text-white' :
                                    step === s ? 'bg-primary text-white shadow-lg shadow-primary/30 scale-110' :
                                        'bg-slate-200 dark:bg-slate-800 text-slate-400'
                                    }`}>
                                    {step > s ? <span className="material-symbols-outlined text-[20px]">check</span> : s}
                                </div>
                                <span className={`text-xs mt-2 font-semibold absolute top-12 whitespace-nowrap hidden sm:block ${step >= s ? 'text-primary' : 'text-slate-400'}`}>
                                    {s === 1 && "Subject"}
                                    {s === 2 && "Level"}
                                    {s === 3 && "Details"}
                                    {s === 4 && "Contact"}
                                    {s === 5 && "Verify"}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Main Form Card */}
                <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-[2rem] shadow-2xl border border-white/50 dark:border-slate-800 overflow-hidden relative">

                    <div className="h-2 w-full bg-gradient-to-r from-primary via-secondary to-accent"></div>

                    <form onSubmit={step === 5 ? handleVerifyAndSubmit : (e) => e.preventDefault()} className="p-8 md:p-12">
                        {step === 1 && (
                            <div className="animate-fade-in-up">
                                <span className="text-primary font-bold text-sm tracking-wide uppercase mb-2 block">Step 1 of 4</span>
                                <h2 className="text-3xl font-heading font-bold mb-8 text-slate-900 dark:text-white">
                                    What do you want to <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">learn?</span>
                                </h2>

                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Subject / Topic</label>
                                        <input
                                            type="text"
                                            name="subject"
                                            placeholder="e.g. Mathematics, Physics, French..."
                                            value={formData.subject}
                                            onChange={handleChange}
                                            className="w-full bg-slate-50 dark:bg-slate-800 border box-border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-4 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-lg placeholder:text-slate-400"
                                            required
                                            autoFocus
                                        />
                                    </div>

                                    <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                                        <button
                                            type="button"
                                            className="w-full bg-primary text-white font-bold py-4 rounded-xl hover:bg-primary-glow shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                            onClick={nextStep}
                                            disabled={!formData.subject}>
                                            Continue <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="animate-fade-in-up">
                                <span className="text-primary font-bold text-sm tracking-wide uppercase mb-2 block">Step 2 of 4</span>
                                <h2 className="text-3xl font-heading font-bold mb-8 text-slate-900 dark:text-white">
                                    Tell us about the <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">level & location.</span>
                                </h2>

                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Grade / Class Level</label>
                                        <select
                                            name="grade"
                                            value={formData.grade}
                                            onChange={handleChange}
                                            required
                                            className="w-full bg-slate-50 dark:bg-slate-800 border box-border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-4 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-base appearance-none cursor-pointer">
                                            <option value="" disabled>Select the academic level</option>
                                            <option value="Primary (1-5)">Primary (1-5)</option>
                                            <option value="Middle (6-8)">Middle (6-8)</option>
                                            <option value="High School (9-10)">High School (9-10)</option>
                                            <option value="Higher Secondary (11-12)">Higher Secondary (11-12)</option>
                                            <option value="Undergraduate">Undergraduate Degree</option>
                                            <option value="Competitive Exams">Competitive Exams</option>
                                            <option value="Other">Other Skills</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">City or Area</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400">location_on</span>
                                            <input
                                                type="text"
                                                name="location"
                                                placeholder="e.g. Mumbai, Andheri, or Online"
                                                value={formData.location}
                                                onChange={handleChange}
                                                required
                                                className="w-full bg-slate-50 dark:bg-slate-800 border box-border border-slate-200 dark:border-slate-700 rounded-xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-base placeholder:text-slate-400"
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex gap-4">
                                        <button
                                            type="button"
                                            className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold py-4 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-2"
                                            onClick={prevStep}>
                                            <span className="material-symbols-outlined text-sm">arrow_back</span> Back
                                        </button>
                                        <button
                                            type="button"
                                            className="flex-[2] bg-primary text-white font-bold py-4 rounded-xl hover:bg-primary-glow shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                            onClick={nextStep}
                                            disabled={!formData.grade || !formData.location}>
                                            Continue <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="animate-fade-in-up">
                                <span className="text-primary font-bold text-sm tracking-wide uppercase mb-2 block">Step 3 of 4</span>
                                <h2 className="text-3xl font-heading font-bold mb-8 text-slate-900 dark:text-white">
                                    What is your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">budget?</span>
                                </h2>

                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Estimated Budget</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                                            <input
                                                type="text"
                                                name="budget"
                                                placeholder="e.g. 5000/month or 500/hr"
                                                value={formData.budget}
                                                onChange={handleChange}
                                                className="w-full bg-slate-50 dark:bg-slate-800 border box-border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-4 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-base placeholder:text-slate-400"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Brief Requirements (Optional)</label>
                                        <textarea
                                            name="description"
                                            rows="3"
                                            placeholder="I am looking for a tutor who can help with..."
                                            value={formData.description}
                                            onChange={handleChange}
                                            className="w-full bg-slate-50 dark:bg-slate-800 border box-border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-4 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-base resize-none placeholder:text-slate-400"
                                        ></textarea>
                                    </div>

                                    <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex gap-4">
                                        <button
                                            type="button"
                                            className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold py-4 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-2"
                                            onClick={prevStep}>
                                            <span className="material-symbols-outlined text-sm">arrow_back</span> Back
                                        </button>
                                        <button
                                            type="button"
                                            className="flex-[2] bg-primary text-white font-bold py-4 rounded-xl hover:bg-primary-glow shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2"
                                            onClick={nextStep}>
                                            Continue <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 4 && (
                            <div className="animate-fade-in-up">
                                <span className="text-primary font-bold text-sm tracking-wide uppercase mb-2 block">Final Step</span>
                                <h2 className="text-3xl font-heading font-bold mb-8 text-slate-900 dark:text-white">
                                    Where should <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">tutors reach you?</span>
                                </h2>

                                <div className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Student / Parent Name</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400">person</span>
                                            <input
                                                type="text"
                                                name="name"
                                                placeholder="Full Name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                required
                                                className="w-full bg-slate-50 dark:bg-slate-800 border box-border border-slate-200 dark:border-slate-700 rounded-xl pl-12 pr-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-base placeholder:text-slate-400"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Mobile Number</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400">call</span>
                                            <input
                                                type="tel"
                                                name="phone"
                                                placeholder="10-digit mobile number"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                required
                                                className="w-full bg-slate-50 dark:bg-slate-800 border box-border border-slate-200 dark:border-slate-700 rounded-xl pl-12 pr-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-base placeholder:text-slate-400"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Email Address</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400">mail</span>
                                            <input
                                                type="email"
                                                name="email"
                                                placeholder="email@example.com"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                                className="w-full bg-slate-50 dark:bg-slate-800 border box-border border-slate-200 dark:border-slate-700 rounded-xl pl-12 pr-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-base placeholder:text-slate-400"
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex gap-4">
                                        <button
                                            type="button"
                                            className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold py-4 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-2"
                                            onClick={prevStep}>
                                            <span className="material-symbols-outlined text-sm">arrow_back</span> Back
                                        </button>
                                        <button
                                            type="button"
                                            className="flex-[2] bg-primary text-white font-bold py-4 rounded-xl hover:bg-primary-glow shadow-lg shadow-primary/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                            onClick={handleSendOTP}
                                            disabled={isSubmitting || !formData.name || !formData.phone || !formData.email}>
                                            {isSubmitting ? (
                                                <><span className="material-symbols-outlined text-[18px] animate-spin">refresh</span> Processing...</>
                                            ) : (
                                                <><span className="material-symbols-outlined text-[18px]">send</span> Send OTP</>
                                            )}
                                        </button>
                                    </div>
                                    <p className="text-center text-xs text-slate-400 mt-2">
                                        Your details are secure. Tutors can only contact you if they choose to use credits.
                                    </p>
                                    {otpError && <p className="text-center text-sm text-red-500 font-bold mt-2">{otpError}</p>}
                                </div>
                            </div>
                        )}

                        {step === 5 && (
                            <div className="animate-fade-in-up text-center">
                                <h3 className="text-3xl font-heading font-bold mb-4 text-slate-900 dark:text-white">Verify your Number</h3>
                                <p className="text-slate-500 mb-8 max-w-sm mx-auto">
                                    We sent a 6-digit code to <span className="font-bold text-slate-700 dark:text-slate-300">{formData.phone}</span>.
                                    <br />(Check server logs in demo mode).
                                </p>
                                <div className="max-w-[250px] mx-auto mb-8">
                                    <input
                                        type="text"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        maxLength="6"
                                        required
                                        placeholder="• • • • • •"
                                        className="w-full bg-slate-50 dark:bg-slate-800 border box-border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-4 focus:ring-2 focus:ring-primary outline-none transition-all text-2xl tracking-[0.5em] text-center font-bold"
                                    />
                                </div>
                                {otpError && <p className="text-center text-sm text-red-500 font-bold mb-6">{otpError}</p>}
                                <div className="flex gap-4">
                                    <button
                                        type="button"
                                        className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold py-4 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                                        onClick={prevStep}>
                                        Change Number
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting || otp.length < 6}
                                        className="flex-[2] bg-primary text-white font-bold py-4 rounded-xl hover:bg-primary-glow shadow-lg shadow-primary/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                                        {isSubmitting ? "Verifying..." : "Verify & Post Requirement"}
                                    </button>
                                </div>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
}

