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
    Award,
    Monitor,
    Home,
    Building2
} from "lucide-react";
import LeadCaptureFlow from "../components/LeadCaptureFlow";

export default function PostRequirement() {
    const [step, setStep] = useState(1);
    const router = useRouter();
    const [formData, setFormData] = useState({
        subject: "",
        grade: "",
        location: "",
        modes: [],
        budget: "",
        description: "",
    });

    const tuitionModes = [
        { id: "ONLINE", label: "Online", icon: Monitor },
        { id: "STUDENT_HOME", label: "At Student's Home", icon: Home },
        { id: "TUTOR_HOME", label: "At Tutor's Place", icon: MapPin },
        { id: "CENTER", label: "At Institute", icon: Building2 },
    ];

    const toggleMode = (modeId) => {
        setFormData(prev => ({
            ...prev,
            modes: prev.modes.includes(modeId)
                ? prev.modes.filter(m => m !== modeId)
                : [...prev.modes, modeId]
        }));
    };

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
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 text-center">
                <div className="max-w-md bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                    <div className="size-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mx-auto mb-6">
                        <CheckCircle size={36} />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-3">Request Submitted</h1>
                    <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                        Your tutor requirement has been posted successfully. Tutors in your area will contact you shortly.
                    </p>
                    <button
                        className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold text-sm shadow-sm hover:bg-blue-700 transition-all"
                        onClick={() => router.push('/search')}
                    >
                        Browse Tutors
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900 antialiased pt-28 pb-20">

            <Link href="/" className="mb-10 flex items-center gap-3 group max-w-3xl mx-auto px-6">
                <div className="size-10 bg-white rounded-xl border border-gray-100 flex items-center justify-center text-blue-600 shadow-sm">
                    <GraduationCap size={22} />
                </div>
                <div>
                    <span className="text-lg font-bold text-gray-900 tracking-tight group-hover:text-blue-600 transition-colors leading-none">
                        Tuitions<span className="text-blue-600">in</span>India
                    </span>
                    <p className="text-xs font-semibold text-gray-400">Post a Requirement</p>
                </div>
            </Link>

            <div className="w-full max-w-3xl mx-auto px-6">
                {/* Stepper Progress */}
                <div className="mb-12 relative">
                    <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-100 -translate-y-1/2 rounded-full overflow-hidden z-0">
                        <div
                            className="absolute top-0 left-0 h-full bg-blue-600 transition-all duration-700 ease-out"
                            style={{ width: `${((step - 1) / 3) * 100}%` }}
                        ></div>
                    </div>

                    <div className="flex justify-between relative z-10">
                        {[1, 2, 3, 4].map((s) => (
                            <div key={s} className="flex flex-col items-center">
                                <div className={`size-10 rounded-xl flex items-center justify-center font-bold text-sm transition-all duration-500 border-2 border-white ${step > s ? 'bg-blue-600 text-white scale-90 opacity-50' :
                                    step === s ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' :
                                        'bg-gray-100 text-gray-300'
                                    }`}>
                                    {step > s ? <CheckCircle2 size={16} /> : s}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Main Form Card */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="p-6 md:p-8">
                        {step === 1 && (
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <h2 className="text-2xl font-bold text-gray-900 tracking-tight">What subject do you need help with?</h2>
                                    <p className="text-gray-500 text-sm">Tell us the subject you're looking for a tutor in.</p>
                                </div>

                                <div className="space-y-5">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-semibold text-gray-700">Subject</label>
                                        <div className="relative">
                                            <School className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                                            <input
                                                type="text"
                                                name="subject"
                                                placeholder="e.g. Maths, Physics, English..."
                                                value={formData.subject}
                                                onChange={handleChange}
                                                className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-500 rounded-xl px-12 py-4 text-sm font-medium outline-none transition-all text-gray-900 placeholder:text-gray-300 focus:ring-2 focus:ring-blue-500/10"
                                                required
                                                autoFocus
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold text-sm shadow-sm hover:bg-blue-700 transition-all flex items-center justify-center gap-3 disabled:opacity-30"
                                        onClick={nextStep}
                                        disabled={!formData.subject}>
                                        Continue <ArrowRight size={16} />
                                    </button>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Grade level and location</h2>
                                    <p className="text-gray-500 text-sm">Select your grade and enter your city.</p>
                                </div>

                                <div className="space-y-5">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-semibold text-gray-700">Grade / Level</label>
                                        <div className="relative">
                                            <PlusCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                                            <select
                                                name="grade"
                                                value={formData.grade}
                                                onChange={handleChange}
                                                required
                                                className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-500 rounded-xl px-12 py-4 text-sm font-medium outline-none transition-all text-gray-900 appearance-none cursor-pointer focus:ring-2 focus:ring-blue-500/10">
                                                <option value="" disabled>Select level</option>
                                                <option value="Primary (1-5)">Primary (1-5)</option>
                                                <option value="Middle (6-8)">Middle (6-8)</option>
                                                <option value="High School (9-10)">High School (9-10)</option>
                                                <option value="Higher Secondary (11-12)">Higher Secondary (11-12)</option>
                                                <option value="Undergraduate">Undergraduate</option>
                                                <option value="Competitive Exams">Competitive Exams</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-semibold text-gray-700">City / Location</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                                            <input
                                                type="text"
                                                name="location"
                                                placeholder="e.g. Mumbai, Delhi, Online..."
                                                value={formData.location}
                                                onChange={handleChange}
                                                required
                                                className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-500 rounded-xl px-12 py-4 text-sm font-medium outline-none transition-all text-gray-900 placeholder:text-gray-300 focus:ring-2 focus:ring-blue-500/10"
                                            />
                                        </div>
                                    </div>

                                    {/* Tuition Mode Preference */}
                                    <div className="space-y-2">
                                        <label className="block text-sm font-semibold text-gray-700">Tuition mode preference</label>
                                        <p className="text-xs text-gray-400">Select all that work for you</p>
                                        <div className="grid grid-cols-2 gap-2">
                                            {tuitionModes.map((mode) => {
                                                const selected = formData.modes.includes(mode.id);
                                                return (
                                                    <button
                                                        key={mode.id}
                                                        type="button"
                                                        onClick={() => toggleMode(mode.id)}
                                                        className={`flex items-center gap-3 p-3 rounded-xl border text-sm font-medium text-left transition-all ${
                                                            selected
                                                                ? "border-blue-500 bg-blue-50 text-blue-700"
                                                                : "border-gray-200 bg-gray-50 text-gray-600 hover:border-blue-300 hover:bg-blue-50/50"
                                                        }`}
                                                    >
                                                        <mode.icon size={16} className={selected ? "text-blue-600" : "text-gray-400"} />
                                                        {mode.label}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    <div className="flex gap-3">
                                        <button
                                            type="button"
                                            className="px-6 py-3.5 rounded-xl font-semibold text-gray-400 hover:text-blue-600 transition-all text-sm"
                                            onClick={prevStep}>
                                            Back
                                        </button>
                                        <button
                                            type="button"
                                            className="flex-1 bg-blue-600 text-white py-3.5 rounded-xl font-bold text-sm shadow-sm hover:bg-blue-700 transition-all flex items-center justify-center gap-3 disabled:opacity-30"
                                            onClick={nextStep}
                                            disabled={!formData.grade || !formData.location}>
                                            Continue <ArrowRight size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Budget and details</h2>
                                    <p className="text-gray-500 text-sm">Set your budget and describe what you need.</p>
                                </div>

                                <div className="space-y-5">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-semibold text-gray-700">Hourly Budget (₹)</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span>
                                            <input
                                                type="text"
                                                name="budget"
                                                placeholder="e.g. 500, 1000"
                                                value={formData.budget}
                                                onChange={handleChange}
                                                className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-500 rounded-xl px-12 py-4 text-sm font-medium outline-none transition-all text-gray-900 placeholder:text-gray-300 focus:ring-2 focus:ring-blue-500/10"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-semibold text-gray-700">Additional details</label>
                                        <textarea
                                            name="description"
                                            rows="4"
                                            placeholder="Describe what you're looking for in a tutor..."
                                            value={formData.description}
                                            onChange={handleChange}
                                            className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-500 rounded-xl px-4 py-4 text-sm font-medium outline-none transition-all resize-none leading-relaxed text-gray-900 placeholder:text-gray-300 focus:ring-2 focus:ring-blue-500/10"
                                        ></textarea>
                                    </div>

                                    <div className="flex gap-3">
                                        <button
                                            type="button"
                                            className="px-6 py-3.5 rounded-xl font-semibold text-gray-400 hover:text-blue-600 transition-all text-sm"
                                            onClick={prevStep}>
                                            Back
                                        </button>
                                        <button
                                            type="button"
                                            className="flex-1 bg-blue-600 text-white py-3.5 rounded-xl font-bold text-sm shadow-sm hover:bg-blue-700 transition-all flex items-center justify-center gap-3"
                                            onClick={nextStep}>
                                            Next <ArrowRight size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 4 && (
                            <div className="space-y-6">
                                <div className="space-y-2 text-center">
                                    <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Verify your identity</h2>
                                    <p className="text-gray-500 text-sm">Confirm your phone number to submit your requirement.</p>
                                </div>
                                <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                                    <LeadCaptureFlow initialRole="STUDENT" onComplete={handleVerificationComplete} />
                                </div>
                                <button
                                    type="button"
                                    className="w-full text-sm font-semibold text-gray-400 hover:text-blue-600 transition-colors"
                                    onClick={prevStep}>
                                    Back
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Bottom stats */}
            <div className="max-w-3xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 px-6">
                {[
                    { label: "Verified Tutors", value: "24k+", icon: Award },
                    { label: "Response Time", value: "Avg 15 min", icon: Zap },
                    { label: "Secure Payments", icon: ShieldCheck }
                ].map((stat, i) => (
                    <div key={i} className="flex flex-col items-center text-center space-y-2 group">
                        <div className="size-9 bg-white rounded-xl border border-gray-100 flex items-center justify-center text-gray-300 group-hover:text-blue-600 transition-colors shadow-sm">
                            <stat.icon size={16} />
                        </div>
                        <div>
                            <p className="text-lg font-bold text-gray-900">{stat.value}</p>
                            <p className="text-xs font-semibold text-gray-400">{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
