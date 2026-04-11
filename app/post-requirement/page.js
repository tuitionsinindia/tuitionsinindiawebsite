"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    GraduationCap,
    ArrowRight,
    ArrowLeft,
    CheckCircle2,
    ShieldCheck,
    Zap,
    MapPin,
    School,
    PlusCircle,
    CheckCircle,
    Award
} from "lucide-react";
import LeadCaptureFlow from "../components/LeadCaptureFlow";

export default function PostRequirement() {
    const [step, setStep] = useState(1);
    const router = useRouter();
    const [formData, setFormData] = useState({
        subject: "",
        grade: "",
        location: "",
        budget: "",
        description: "",
    });

    const [isSuccess, setIsSuccess] = useState(false);

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleVerificationComplete = async (user) => {
        try {
            const res = await fetch("/api/lead/post", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    name: user.name,
                    phone: user.phone,
                    email: user.email || `${user.phone}@tuitionsinindia.com`,
                    studentId: user.id
                }),
            });

            if (res.ok) {
                setIsSuccess(true);
            } else {
                alert("Something went wrong. Please try again.");
            }
        } catch (error) {
            console.error("Submission error:", error);
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-blue-50/50 flex items-center justify-center p-6 text-center">
                <div className="max-w-xl bg-white rounded-2xl p-12 shadow-sm border border-blue-100">
                    <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mx-auto mb-6">
                        <CheckCircle size={32} />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-3">Requirement Posted!</h1>
                    <p className="text-gray-500 mb-8 leading-relaxed">
                        Your requirement has been shared with verified tutors in your area. Tutors will contact you shortly.
                    </p>
                    <button
                        className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold text-sm hover:bg-blue-700 transition-colors"
                        onClick={() => router.push('/search')}
                    >
                        Browse Tutors
                    </button>
                </div>
            </div>
        );
    }

    const inputCls = "w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-xl px-4 py-3 text-sm outline-none transition-all text-gray-900 placeholder:text-gray-300";

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900 antialiased pt-24 pb-16">

            <div className="w-full max-w-xl mx-auto px-6">
                {/* Header */}
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Post a Tutor Requirement</h1>
                    <p className="text-gray-500 text-sm">Tell us what you need and verified tutors will reach out to you.</p>
                </div>

                {/* Progress */}
                <div className="mb-8 relative">
                    <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 rounded-full overflow-hidden">
                        <div
                            className="absolute top-0 left-0 h-full bg-blue-600 transition-all duration-500"
                            style={{ width: `${((step - 1) / 3) * 100}%` }}
                        />
                    </div>
                    <div className="flex justify-between relative">
                        {[1, 2, 3, 4].map((s) => (
                            <div key={s} className={`size-8 rounded-full flex items-center justify-center text-xs font-bold border-2 border-white transition-all ${
                                step > s ? 'bg-blue-600 text-white' :
                                step === s ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' :
                                'bg-gray-200 text-gray-400'
                            }`}>
                                {step > s ? <CheckCircle2 size={14} /> : s}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">

                    {/* Step 1: Subject */}
                    {step === 1 && (
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 mb-1">What subject do you need help with?</h2>
                                <p className="text-sm text-gray-500">Be specific — e.g. "Maths for Class 10 CBSE" or "JEE Physics".</p>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">Subject</label>
                                <div className="relative">
                                    <School className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                    <input
                                        type="text"
                                        name="subject"
                                        placeholder="e.g. Maths, Physics, English..."
                                        value={formData.subject}
                                        onChange={handleChange}
                                        className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-xl pl-10 pr-4 py-3 text-sm outline-none transition-all placeholder:text-gray-300"
                                        required
                                        autoFocus
                                    />
                                </div>
                            </div>
                            <button
                                type="button"
                                className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold text-sm hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-40"
                                onClick={nextStep}
                                disabled={!formData.subject}
                            >
                                Continue <ArrowRight size={16} />
                            </button>
                        </div>
                    )}

                    {/* Step 2: Grade & Location */}
                    {step === 2 && (
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 mb-1">Grade level & location</h2>
                                <p className="text-sm text-gray-500">This helps us match you with tutors in your area.</p>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">Grade / Level</label>
                                    <div className="relative">
                                        <PlusCircle className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                        <select
                                            name="grade"
                                            value={formData.grade}
                                            onChange={handleChange}
                                            required
                                            className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-500 rounded-xl pl-10 pr-4 py-3 text-sm outline-none transition-all appearance-none cursor-pointer text-gray-900"
                                        >
                                            <option value="" disabled>Select grade</option>
                                            <option value="Primary (1-5)">Primary (Class 1–5)</option>
                                            <option value="Middle (6-8)">Middle School (Class 6–8)</option>
                                            <option value="High School (9-10)">High School (Class 9–10)</option>
                                            <option value="Higher Secondary (11-12)">Higher Secondary (Class 11–12)</option>
                                            <option value="Undergraduate">Undergraduate</option>
                                            <option value="Competitive Exams">Competitive Exams</option>
                                            <option value="Other">Other / Skills</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">Your City</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                        <input
                                            type="text"
                                            name="location"
                                            placeholder="e.g. Mumbai, Delhi, Online"
                                            value={formData.location}
                                            onChange={handleChange}
                                            required
                                            className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-xl pl-10 pr-4 py-3 text-sm outline-none transition-all placeholder:text-gray-300"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button type="button" onClick={prevStep} className="px-4 py-3 text-sm text-gray-500 hover:text-gray-700 transition-colors">
                                    Back
                                </button>
                                <button
                                    type="button"
                                    className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold text-sm hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-40"
                                    onClick={nextStep}
                                    disabled={!formData.grade || !formData.location}
                                >
                                    Continue <ArrowRight size={16} />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Budget & Details */}
                    {step === 3 && (
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 mb-1">Budget & additional details</h2>
                                <p className="text-sm text-gray-500">Optional but helps tutors understand your needs better.</p>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">Budget per hour (₹)</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">₹</span>
                                        <input
                                            type="text"
                                            name="budget"
                                            placeholder="e.g. 500"
                                            value={formData.budget}
                                            onChange={handleChange}
                                            className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-xl pl-8 pr-4 py-3 text-sm outline-none transition-all placeholder:text-gray-300"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">Anything else tutors should know?</label>
                                    <textarea
                                        name="description"
                                        rows="4"
                                        placeholder="e.g. I need help with calculus for my board exams in March..."
                                        value={formData.description}
                                        onChange={handleChange}
                                        className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-xl px-4 py-3 text-sm outline-none transition-all resize-none placeholder:text-gray-300"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button type="button" onClick={prevStep} className="px-4 py-3 text-sm text-gray-500 hover:text-gray-700 transition-colors">
                                    Back
                                </button>
                                <button
                                    type="button"
                                    className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold text-sm hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                                    onClick={nextStep}
                                >
                                    Continue <ArrowRight size={16} />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Verify identity */}
                    {step === 4 && (
                        <div className="space-y-6">
                            <div className="text-center">
                                <h2 className="text-xl font-bold text-gray-900 mb-1">Verify your identity</h2>
                                <p className="text-sm text-gray-500">We'll confirm your number with a quick OTP before posting.</p>
                            </div>
                            <LeadCaptureFlow initialRole="STUDENT" onComplete={handleVerificationComplete} />
                            <button
                                type="button"
                                className="w-full text-xs text-gray-400 hover:text-gray-600 transition-colors py-2"
                                onClick={prevStep}
                            >
                                ← Back to edit details
                            </button>
                        </div>
                    )}
                </div>

                {/* Trust indicators */}
                <div className="mt-8 grid grid-cols-3 gap-4">
                    {[
                        { label: "Verified Tutors", value: "24k+", icon: Award },
                        { label: "Avg Response", value: "15 min", icon: Zap },
                        { label: "Secure & Free", value: "Always", icon: ShieldCheck }
                    ].map((stat, i) => (
                        <div key={i} className="flex flex-col items-center text-center bg-white rounded-xl p-4 border border-gray-200">
                            <stat.icon size={16} className="text-blue-600 mb-1" />
                            <p className="text-sm font-bold text-gray-900">{stat.value}</p>
                            <p className="text-xs text-gray-400">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
