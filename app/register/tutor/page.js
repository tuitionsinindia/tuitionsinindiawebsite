"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { 
    UserPlus, ArrowRight, ArrowLeft, Verified, ShieldCheck, Zap, Star, BellRing, LayoutDashboard, 
    CheckCircle2, Key, Smartphone, UserCheck, Award, Mail, User, MapPin, BookOpen, Monitor, Briefcase, GraduationCap
} from "lucide-react";


function TutorRegisterContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        title: "",
        bio: "",
        subjects: searchParams.get("subject") || "",
        grades: searchParams.get("grade") || "",
        locations: searchParams.get("location") || "",
        hourlyRate: "",
        qualification: "",
        experience: "",
        teachingMode: "",
        password: "DefaultTutorPassword123!",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState("");
    const [error, setError] = useState("");

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSendOTP = async (e) => {
        if (e) e.preventDefault();
        setIsSubmitting(true);
        setError("");
        try {
            const res = await fetch("/api/auth/send-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phone: formData.phone }),
            });
            if (res.ok) {
                setOtpSent(true);
                nextStep();
            } else {
                const data = await res.json();
                setError(data.error || "Failed to send OTP.");
            }
        } catch (err) {
            setError("Error sending verification code.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleVerifyAndSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");

        try {
            const verifyRes = await fetch("/api/auth/verify-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phone: formData.phone, otp }),
            });

            if (!verifyRes.ok) {
                setError("Invalid verification code.");
                setIsSubmitting(false);
                return;
            }

            const res = await fetch("/api/auth/register/tutor", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                setIsSuccess(true);
            } else {
                const errData = await res.json();
                setError(errData.error || "Registration failed. Please try again.");
            }
        } catch (err) {
            setError("Error during registration.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 text-center pt-24 pb-12">
                <div className="max-w-xl w-full bg-white rounded-3xl p-10 md:p-14 shadow-sm border border-gray-200">
                    <div className="w-20 h-20 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 mx-auto mb-8">
                        <UserCheck size={40} />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Registration Complete</h1>
                    <p className="text-gray-500 font-medium mb-10 leading-relaxed">
                        Your profile has been created successfully. Our team will verify your details within 24 hours to make your profile live.
                    </p>
                    <button 
                        className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-sm shadow-sm hover:bg-blue-700 active:scale-95 transition-all"
                        onClick={() => router.push('/dashboard/tutor')}
                    >
                        Go to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    const progressValue = (step / 4) * 100;

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-800 antialiased pt-28 pb-20">
            {/* Header is handled in layout.js */}

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                 {/* Progress Indicator */}
                 <div className="max-w-3xl mx-auto mb-16 space-y-6 md:space-y-8">
                    <div className="flex justify-between items-end mb-2">
                        <div className="space-y-2">
                            <span className="text-blue-600 font-bold uppercase text-[10px] sm:text-xs tracking-wider block">Tutor Registration</span>
                            {searchParams.get('intent') === 'unlock' ? (
                                <div className="space-y-1">
                                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-3">
                                        <div className="size-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shrink-0">
                                            <Star size={20} fill="currentColor" />
                                        </div>
                                        Complete Profile to Connect
                                    </h2>
                                    <p className="text-blue-600 font-bold text-[10px] uppercase tracking-[0.2em] italic ml-13">Verified Identity Required to Unlock Platform Benefits</p>
                                </div>
                            ) : (
                                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-none">
                                    {step === 1 ? "Personal Details" : step === 2 ? "Teaching Experience" : step === 3 ? "Your Bio" : "Verify Phone"}
                                </h2>
                            )}
                        </div>
                        <div className="text-right pb-1">
                            <p className="text-gray-400 font-bold text-xs">Step {step} / 4</p>
                        </div>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-blue-600 rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${progressValue}%` }}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
                    {/* Left side Form */}
                    <div className="lg:col-span-8">
                        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-200">
                            <form onSubmit={step === 4 ? handleVerifyAndSubmit : (e) => e.preventDefault()}>
                                {step === 1 && (
                                    <div className="animate-fade-in-up space-y-8">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-gray-500 tracking-wider ml-1">Full Name</label>
                                                <div className="relative">
                                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                                    <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="e.g. Ramesh Sharma" className="w-full bg-white border border-gray-300 focus:border-blue-500 rounded-xl pl-12 pr-6 py-4 font-medium outline-none transition-all text-gray-900 shadow-sm" />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-gray-500 tracking-wider ml-1">Email Address</label>
                                                <div className="relative">
                                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                                    <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="ramesh@example.com" className="w-full bg-white border border-gray-300 focus:border-blue-500 rounded-xl pl-12 pr-6 py-4 font-medium outline-none transition-all text-gray-900 shadow-sm" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-500 tracking-wider ml-1">Phone Number (WhatsApp Enabled)</label>
                                            <div className="flex gap-3">
                                                <div className="px-5 py-4 bg-gray-50 border border-gray-300 rounded-xl text-gray-600 font-bold flex items-center shadow-sm text-sm">+91</div>
                                                <div className="relative flex-1">
                                                    <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required placeholder="10-digit number" className="w-full bg-white border border-gray-300 focus:border-blue-500 rounded-xl pl-12 pr-6 py-4 font-medium outline-none transition-all text-gray-900 shadow-sm" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-gray-500 tracking-wider ml-1">Highest Qualification</label>
                                                <div className="relative">
                                                    <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                                    <select name="qualification" value={formData.qualification} onChange={handleChange} className="w-full bg-white border border-gray-300 focus:border-blue-500 rounded-xl pl-12 pr-6 py-4 font-medium outline-none transition-all text-gray-900 shadow-sm appearance-none">
                                                        <option value="">Select qualification</option>
                                                        <option value="12th Pass">12th Pass</option>
                                                        <option value="B.A.">B.A.</option>
                                                        <option value="B.Sc.">B.Sc.</option>
                                                        <option value="B.Com.">B.Com.</option>
                                                        <option value="B.Tech/B.E.">B.Tech/B.E.</option>
                                                        <option value="B.Ed.">B.Ed.</option>
                                                        <option value="M.A.">M.A.</option>
                                                        <option value="M.Sc.">M.Sc.</option>
                                                        <option value="M.Tech">M.Tech</option>
                                                        <option value="MBA">MBA</option>
                                                        <option value="Ph.D.">Ph.D.</option>
                                                        <option value="Other">Other</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-gray-500 tracking-wider ml-1">Years of Teaching Experience</label>
                                                <div className="relative">
                                                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                                    <select name="experience" value={formData.experience} onChange={handleChange} className="w-full bg-white border border-gray-300 focus:border-blue-500 rounded-xl pl-12 pr-6 py-4 font-medium outline-none transition-all text-gray-900 shadow-sm appearance-none">
                                                        <option value="">Select experience</option>
                                                        <option value="0-1 years">0-1 years</option>
                                                        <option value="2-3 years">2-3 years</option>
                                                        <option value="4-5 years">4-5 years</option>
                                                        <option value="6-10 years">6-10 years</option>
                                                        <option value="10+ years">10+ years</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <button type="button" onClick={nextStep} disabled={!formData.name || !formData.email || !formData.phone} className="w-full mt-4 bg-blue-600 text-white py-4 rounded-xl font-bold text-sm shadow-sm hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                                            Continue <ArrowRight size={16} />
                                        </button>
                                    </div>
                                )}

                                {step === 2 && (
                                    <div className="animate-fade-in-up space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-500 tracking-wider ml-1">Profile Tagline</label>
                                            <input type="text" name="title" value={formData.title} onChange={handleChange} required placeholder="e.g. Senior Math Tutor with 10 years experience" className="w-full bg-white border border-gray-300 focus:border-blue-500 rounded-xl px-6 py-4 font-medium outline-none transition-all text-gray-900 shadow-sm" />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-gray-500 tracking-wider ml-1">Subjects Taught</label>
                                                <input type="text" name="subjects" value={formData.subjects} onChange={handleChange} required placeholder="e.g. Mathematics, Physics" className="w-full bg-white border border-gray-300 focus:border-blue-500 rounded-xl px-6 py-4 font-medium outline-none transition-all text-gray-900 shadow-sm" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-gray-500 tracking-wider ml-1">Classes / Grades</label>
                                                <input type="text" name="grades" value={formData.grades} onChange={handleChange} required placeholder="Class 11, Class 12, Competitive" className="w-full bg-white border border-gray-300 focus:border-blue-500 rounded-xl px-6 py-4 font-medium outline-none transition-all text-gray-900 shadow-sm" />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-gray-500 tracking-wider ml-1">Locations (or Online)</label>
                                                <div className="relative">
                                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                                    <input type="text" name="locations" value={formData.locations} onChange={handleChange} required placeholder="South Delhi, Online" className="w-full bg-white border border-gray-300 focus:border-blue-500 rounded-xl pl-12 pr-6 py-4 font-medium outline-none transition-all text-gray-900 shadow-sm" />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-gray-500 tracking-wider ml-1">Hourly Rate (₹)</label>
                                                <input type="number" name="hourlyRate" value={formData.hourlyRate} onChange={handleChange} required placeholder="e.g. 500" className="w-full bg-white border border-gray-300 focus:border-blue-500 rounded-xl px-6 py-4 font-medium outline-none transition-all text-gray-900 shadow-sm" />
                                            </div>
                                        </div>
                                        {/* Teaching Mode */}
                                        <div className="space-y-3">
                                            <label className="text-xs font-bold text-gray-500 tracking-wider ml-1">Teaching Mode</label>
                                            <div className="grid grid-cols-3 gap-3">
                                                {[
                                                    { id: "online", label: "Online", icon: Monitor },
                                                    { id: "home", label: "Home Tuition", icon: MapPin },
                                                    { id: "both", label: "Both", icon: BookOpen }
                                                ].map(m => (
                                                    <button key={m.id} type="button" onClick={() => setFormData({...formData, teachingMode: m.id})} className={`p-4 rounded-xl border-2 text-sm font-semibold transition-all flex flex-col items-center gap-2 ${formData.teachingMode === m.id ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-gray-50 border-gray-200 hover:border-blue-300 text-gray-700'}`}>
                                                        <m.icon size={20} />
                                                        {m.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="flex gap-4 mt-6 pt-4">
                                            <button type="button" onClick={prevStep} className="px-6 py-4 rounded-xl font-bold text-gray-500 hover:text-gray-800 transition-all text-sm bg-gray-100 hover:bg-gray-200">Back</button>
                                            <button type="button" onClick={nextStep} disabled={!formData.title || !formData.subjects} className="flex-1 bg-blue-600 text-white py-4 rounded-xl font-bold text-sm shadow-sm hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                                                Next: Your Bio <ArrowRight size={16} />
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {step === 3 && (
                                    <div className="animate-fade-in-up space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-500 tracking-wider ml-1">About Your Experience</label>
                                            <textarea 
                                                name="bio" rows="8" value={formData.bio} onChange={handleChange} required 
                                                placeholder="Tell students about your teaching style, achievements, and what makes your classes special..."
                                                className="w-full bg-white border border-gray-300 focus:border-blue-500 rounded-xl px-6 py-4 font-medium outline-none transition-all resize-none leading-relaxed text-gray-900 shadow-sm"
                                            />
                                        </div>
                                        {error && <p className="text-center text-red-600 font-semibold text-sm bg-red-50 p-4 rounded-xl border border-red-100">{error}</p>}
                                        <div className="flex gap-4 mt-8 pt-4">
                                            <button type="button" onClick={prevStep} className="px-6 py-4 rounded-xl font-bold text-gray-500 hover:text-gray-800 transition-all text-sm bg-gray-100 hover:bg-gray-200">Back</button>
                                            <button 
                                                type="button" onClick={handleSendOTP}
                                                disabled={isSubmitting || !formData.bio}
                                                className="flex-1 bg-blue-600 text-white py-4 rounded-xl font-bold text-sm shadow-sm hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                            >
                                                {isSubmitting ? <CheckCircle2 size={16} className="animate-spin" /> : "Verify Phone & Finish"}
                                                <Smartphone size={16} />
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {step === 4 && (
                                    <div className="animate-fade-in-up text-center py-6 space-y-8">
                                        <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mx-auto mb-4 tracking-tighter">
                                            <Key size={40} />
                                        </div>
                                        <div className="space-y-2">
                                            <h2 className="text-3xl font-bold text-gray-900">Verify Phone Number</h2>
                                            <p className="text-gray-500 font-medium">Entering the 6-digit OTP sent to <span className="text-gray-900 font-bold">+{formData.phone}</span></p>
                                        </div>
                                        
                                        <input 
                                            type="text" maxLength="6"
                                            placeholder="••••••"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                            className="w-full max-w-[200px] mx-auto bg-white border border-gray-300 focus:border-blue-500 rounded-2xl px-6 py-6 text-3xl font-bold text-center tracking-[0.5em] outline-none transition-all shadow-sm block text-gray-900"
                                        />

                                        {error && <p className="mb-6 text-center text-red-600 font-semibold text-sm bg-red-50 p-4 rounded-xl border border-red-100">{error}</p>}

                                        <div className="flex gap-4 max-w-sm mx-auto">
                                            <button type="button" onClick={() => setStep(3)} className="px-6 py-4 rounded-xl font-bold text-gray-500 hover:text-gray-800 transition-all text-sm bg-gray-100 hover:bg-gray-200">Back</button>
                                            <button 
                                                type="submit"
                                                disabled={isSubmitting || otp.length < 6}
                                                className="flex-1 bg-green-600 text-white py-4 rounded-xl font-bold text-sm shadow-sm hover:bg-green-700 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                            >
                                                {isSubmitting ? "Verifying..." : "Complete Setup"}
                                                <Zap size={16} />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </form>
                        </div>
                    </div>

                    {/* Right side Info */}
                    <aside className="lg:col-span-4 space-y-8">
                        <div className="bg-white p-8 md:p-10 rounded-3xl border border-gray-200 shadow-sm">
                            <h3 className="text-xl font-bold text-gray-900 mb-8">Why Join Us?</h3>
                            <ul className="space-y-6">
                                {[
                                    { icon: Star, title: "Premium Visibility", desc: "Get seen by thousands of students searching in your local area." },
                                    { icon: ShieldCheck, title: "Verified Trust", desc: "A verification badge tells parents you are a trusted professional." },
                                    { icon: BellRing, title: "Instant Leads", desc: "Receive immediate notifications when someone needs a tutor like you." }
                                ].map((item, i) => (
                                    <li key={i} className="flex gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                                            <item.icon size={20} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900 text-sm">{item.title}</p>
                                            <p className="text-xs text-gray-500 mt-1 leading-relaxed font-medium">{item.desc}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                            
                            <div className="mt-8 pt-8 border-t border-gray-100">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Platform Stats</p>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="text-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                        <p className="text-xl font-bold text-blue-600">12k+</p>
                                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wide mt-1">Verified Tutors</p>
                                    </div>
                                    <div className="text-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                        <p className="text-xl font-bold text-blue-600">₹2.4M+</p>
                                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wide mt-1">Tutor Earnings</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Support Card */}
                        <div className="bg-white p-8 rounded-3xl border border-gray-200 text-center shadow-sm">
                            <p className="text-xs font-bold text-gray-500 tracking-wider mb-4">Need help?</p>
                            <button className="text-blue-600 font-bold text-sm flex items-center justify-center gap-2 mx-auto hover:text-blue-700 hover:underline transition-all group/btn">
                                <Award size={16} />
                                Contact Support Team
                            </button>
                        </div>
                    </aside>
                </div>
            </main>
            
            <p className="mt-12 text-gray-400 text-sm font-medium text-center">
                Already have an account? <Link href="/login" className="text-blue-600 hover:underline font-bold">Log In</Link>
            </p>
        </div>
    );
}

export default function RegisterTutor() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><p className="text-gray-400 font-medium animate-pulse">Setting up registration...</p></div>}>
            <TutorRegisterContent />
        </Suspense>
    );
}
