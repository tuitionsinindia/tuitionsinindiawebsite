"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterInstitute() {
    const [step, setStep] = useState(1);
    const router = useRouter();
    const [formData, setFormData] = useState({
        organizationName: "",
        email: "",
        phone: "",
        website: "",
        bio: "",
        subjects: "",
        locations: "",
        foundingYear: "",
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
                nextStep();
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

            const res = await fetch("/api/auth/register/institute", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                setIsSuccess(true);
            } else {
                const errData = await res.json();
                setOtpError(errData.error || "Registration failed.");
            }
        } catch (error) {
            console.error(error);
            setOtpError("Error during registration.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
                <div className="bg-white p-12 rounded-[3rem] shadow-2xl border border-slate-100 max-w-md w-full text-center">
                    <div className="size-20 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-8">
                        <span className="material-symbols-outlined text-5xl">verified</span>
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-4">Registration Complete!</h1>
                    <p className="text-slate-500 mb-8">
                        Your institute profile is now being processed. Our team will verify your details to activate your premium recruitment features.
                    </p>
                    <button
                        onClick={() => router.push('/dashboard/institute')}
                        className="w-full bg-primary text-white font-bold py-4 rounded-xl hover:opacity-90 shadow-xl transition-all"
                    >
                        Go to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center py-20 px-6">
            <Link href="/get-started" className="flex items-center gap-2 mb-12 group">
                <span className="material-symbols-outlined text-3xl font-bold text-primary group-hover:scale-110 transition-transform">school</span>
                <span className="text-2xl font-heading font-bold tracking-tight text-slate-900">TuitionsInIndia</span>
            </Link>

            <div className="w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 p-10 md:p-16 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 to-primary"></div>

                <div className="mb-10 text-center">
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Register your <span className="text-indigo-600">Institute</span></h1>
                    <p className="text-slate-500">List your coaching center and manage multiple instructors effortlessly.</p>
                </div>

                <div className="flex justify-between mb-12 relative max-w-xs mx-auto">
                    {[1, 2, 3, 4].map((s) => (
                        <div key={s} className={`size-10 rounded-full flex items-center justify-center font-bold text-sm transition-all z-10 border-4 border-white ${step >= s ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-slate-100 text-slate-400'}`}>
                            {s}
                        </div>
                    ))}
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2 -z-0">
                        <div className="h-full bg-indigo-600 transition-all duration-500" style={{ width: `${((step - 1) / 3) * 100}%` }}></div>
                    </div>
                </div>

                <form onSubmit={step === 4 ? handleVerifyAndSubmit : (e) => e.preventDefault()}>
                    {step === 1 && (
                        <div className="space-y-6 animate-fade-in">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Organization / Institute Name</label>
                                <input type="text" name="organizationName" value={formData.organizationName} onChange={handleChange} required placeholder="e.g. Imperial Academy of Sciences" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 focus:ring-2 focus:ring-indigo-500 outline-none" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Primary Email</label>
                                    <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="contact@institute.com" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 focus:ring-2 focus:ring-indigo-500 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Mobile Number</label>
                                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required placeholder="10-digit number" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 focus:ring-2 focus:ring-indigo-500 outline-none" />
                                </div>
                            </div>
                            <button type="button" onClick={nextStep} disabled={!formData.organizationName || !formData.email || !formData.phone} className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-100 hover:opacity-90 transition-all">Next Step</button>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6 animate-fade-in">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Main Subjects Offered</label>
                                <input type="text" name="subjects" value={formData.subjects} onChange={handleChange} required placeholder="IIT-JEE, NEET, CBSE Class 10-12" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 focus:ring-2 focus:ring-indigo-500 outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Branch Locations</label>
                                <input type="text" name="locations" value={formData.locations} onChange={handleChange} required placeholder="Andheri East, Powai, Borivali" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 focus:ring-2 focus:ring-indigo-500 outline-none" />
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Website (Optional)</label>
                                    <input type="url" name="website" value={formData.website} onChange={handleChange} placeholder="https://..." className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 focus:ring-2 focus:ring-indigo-500 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Founding Year</label>
                                    <input type="number" name="foundingYear" value={formData.foundingYear} onChange={handleChange} placeholder="2015" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 focus:ring-2 focus:ring-indigo-500 outline-none" />
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <button type="button" onClick={prevStep} className="flex-1 bg-slate-100 text-slate-600 font-bold py-4 rounded-xl">Back</button>
                                <button type="button" onClick={nextStep} disabled={!formData.subjects || !formData.locations} className="flex-[2] bg-indigo-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-100">Next Step</button>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-6 animate-fade-in">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">About Your Institute</label>
                                <textarea name="bio" rows="6" value={formData.bio} onChange={handleChange} required placeholder="Tell us about your teaching philosophy, faculty, and track record..." className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 focus:ring-2 focus:ring-indigo-500 outline-none resize-none"></textarea>
                            </div>
                            {otpError && <p className="text-red-500 text-sm font-bold">{otpError}</p>}
                            <div className="flex gap-4">
                                <button type="button" onClick={prevStep} className="flex-1 bg-slate-100 text-slate-600 font-bold py-4 rounded-xl">Back</button>
                                <button type="button" onClick={handleSendOTP} disabled={isSubmitting || !formData.bio} className="flex-[2] bg-indigo-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-100">
                                    {isSubmitting ? "Sending OTP..." : "Send Verification Code"}
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 4 && (
                        <div className="space-y-8 animate-fade-in text-center">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">Verify Registration</h3>
                                <p className="text-slate-500">We've sent a code to <span className="text-indigo-600 font-bold">{formData.phone}</span></p>
                            </div>
                            <div className="max-w-[300px] mx-auto">
                                <input
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    maxLength="6"
                                    required
                                    placeholder="• • • • • •"
                                    className="w-full bg-slate-50 border border-indigo-200 rounded-2xl px-5 py-5 text-center text-3xl font-bold tracking-[0.5em] focus:ring-4 focus:ring-indigo-100 outline-none transition-all"
                                />
                            </div>
                            {otpError && <p className="text-red-500 text-sm font-bold">{otpError}</p>}
                            <div className="flex gap-4">
                                <button type="button" onClick={prevStep} className="flex-1 bg-slate-100 text-slate-600 font-bold py-4 rounded-xl">Back</button>
                                <button type="submit" disabled={isSubmitting || otp.length < 6} className="flex-[2] bg-indigo-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-100">
                                    {isSubmitting ? "Processing..." : "Complete Registration"}
                                </button>
                            </div>
                        </div>
                    )}
                </form>
            </div>

            <p className="mt-8 text-slate-400 text-sm">
                Already registered? <Link href="/login" className="text-indigo-600 font-bold hover:underline">Log in</Link>
            </p>
        </div>
    );
}
