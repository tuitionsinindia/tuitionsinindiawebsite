"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { 
    Building2, 
    ArrowRight, 
    CheckCircle2, 
    ShieldCheck, 
    Zap, 
    Mail, 
    Smartphone, 
    Globe, 
    Calendar, 
    Layers, 
    MapPin,
    Star,
    BellRing,
    Award,
    Users,
    GraduationCap,
    School,
    ChevronLeft,
    Check
} from "lucide-react";

const INSTITUTE_TYPES = [
    { id: 'coaching', title: 'Coaching Center', desc: 'Private tuition or test prep centers', icon: GraduationCap },
    { id: 'school', title: 'School', desc: 'K-12 Educational Institution', icon: School },
    { id: 'academy', title: 'Sports/Arts Academy', desc: 'Specialized skill training centers', icon: Award },
    { id: 'other', title: 'Others', desc: 'NGOs or freelance collectives', icon: Building2 }
];

const MODES = [
    { id: 'offline', title: 'Offline / Center', desc: 'At institute premises', icon: Building2 },
    { id: 'online', title: 'Online Classes', desc: 'Live virtual classroom', icon: Globe },
    { id: 'hybrid', title: 'Hybrid Mode', desc: 'Both online and offline', icon: Zap }
];

const STRENGTHS = ['1-5 Faculty', '6-20 Faculty', '21-50 Faculty', '50+ Faculty'];

function InstituteRegisterContent() {
    const [step, setStep] = useState(1);
    const router = useRouter();
    const searchParams = useSearchParams();

    const [formData, setFormData] = useState({
        organizationName: "",
        email: "",
        phone: "",
        website: "",
        bio: "",
        subjects: "",
        locations: "",
        foundingYear: "",
        instituteType: "",
        trainingMode: "",
        facultyStrength: ""
    });

    useEffect(() => {
        // Pre-fill from search context
        const subject = searchParams.get("subject") || sessionStorage.getItem("search_subject") || "";
        const location = searchParams.get("location") || sessionStorage.getItem("search_city") || "";
        
        if (subject || location) {
            setFormData(prev => ({
                ...prev,
                subjects: subject,
                locations: location
            }));
        }
    }, [searchParams]);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState("");
    const [error, setError] = useState("");

    const nextStep = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setStep(step + 1);
    };
    const prevStep = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setStep(step - 1);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSelect = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleSendOTP = async () => {
        setIsSubmitting(true);
        setError("");
        try {
            // Demo Mode: Mock OTP send
            setTimeout(() => {
                setOtpSent(true);
                nextStep();
                setIsSubmitting(false);
            }, 1000);
            
            /* Real API Integration
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
            */
        } catch (err) {
            setError("Error sending OTP.");
            setIsSubmitting(false);
        }
    };

    const handleVerifyAndSubmit = async (e) => {
        if (e) e.preventDefault();
        setIsSubmitting(true);
        setError("");

        try {
            // Demo Mode: Direct success
            setTimeout(() => {
                setIsSuccess(true);
                setIsSubmitting(false);
            }, 1500);

            /* Real API
            const res = await fetch("/api/auth/register/institute", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            if (res.ok) setIsSuccess(true);
            */
        } catch (err) {
            setError("Error during registration.");
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center font-sans">
                <div className="max-w-xl bg-white rounded-[3rem] p-12 md:p-20 shadow-2xl shadow-blue-500/5 border border-slate-100">
                    <div className="w-24 h-24 bg-emerald-50 rounded-[2rem] flex items-center justify-center text-emerald-500 mx-auto mb-10 shadow-inner">
                        <CheckCircle2 size={48} strokeWidth={2.5} />
                    </div>
                    <h1 className="text-4xl font-bold text-slate-900 mb-6 tracking-tight">Institute Registered!</h1>
                    <p className="text-slate-500 font-medium mb-12 leading-relaxed text-lg">
                        Your professional profile is being processed. You can now access your management console to list tutors and handle enquiries.
                    </p>
                    <button 
                        className="w-full bg-blue-600 text-white py-5 rounded-2xl font-bold text-sm shadow-xl shadow-blue-600/20 hover:bg-blue-700 active:scale-[0.98] transition-all"
                        onClick={() => router.push('/dashboard')}
                    >
                        Enter Marketplace Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 antialiased pt-32 pb-24 selection:bg-blue-100">
            <main className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
                    
                    {/* Left: Interactive Form */}
                    <div className="lg:col-span-8">
                        <div className="bg-white rounded-[3rem] shadow-2xl shadow-blue-900/5 border border-slate-100 overflow-hidden">
                            
                            {/* Visual Progress Bar */}
                            <div className="h-2 bg-slate-100 w-full overflow-hidden">
                                <div 
                                    className="h-full bg-blue-600 transition-all duration-700 ease-out shadow-[0_0_15px_rgba(37,99,235,0.5)]" 
                                    style={{ width: `${(step / 5) * 100}%` }}
                                ></div>
                            </div>

                            <div className="p-8 md:p-16">
                                {/* Header Context */}
                                <div className="mb-12 flex justify-between items-end">
                                    <div>
                                        <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-widest mb-3">
                                            <Building2 size={14} /> Phase 0{step} <span className="text-slate-300">/</span> 05
                                        </div>
                                        <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter">
                                            {step === 1 && "Identity variables"}
                                            {step === 2 && "Classification"}
                                            {step === 3 && "Operational Scope"}
                                            {step === 4 && "About & Growth"}
                                            {step === 5 && "Verification"}
                                        </h1>
                                    </div>
                                    <div className="hidden md:block">
                                        <Link href="/login" className="text-xs font-bold text-slate-400 hover:text-blue-600 transition-colors uppercase tracking-widest">Client Portal Login</Link>
                                    </div>
                                </div>

                                <form onSubmit={(e) => e.preventDefault()} className="min-h-[400px] flex flex-col">
                                    
                                    {/* Step 1: Identity */}
                                    {step === 1 && (
                                        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                            <div className="space-y-4">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Official Organization Name</label>
                                                <div className="relative group">
                                                    <Building2 className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" size={20} />
                                                    <input type="text" name="organizationName" value={formData.organizationName} onChange={handleChange} required placeholder="e.g. Skyline Academic Institute" className="w-full bg-slate-50/50 border-2 border-slate-100 focus:border-blue-500/50 focus:bg-white rounded-[1.5rem] pl-16 pr-8 py-5 font-bold outline-none transition-all text-slate-700 placeholder:text-slate-300 shadow-inner" />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                <div className="space-y-4">
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Administrative Email</label>
                                                    <div className="relative group">
                                                        <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" size={20} />
                                                        <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="contact@institute.in" className="w-full bg-slate-50/50 border-2 border-slate-100 focus:border-blue-500/50 focus:bg-white rounded-[1.5rem] pl-16 pr-8 py-5 font-bold outline-none transition-all text-slate-700 placeholder:text-slate-300 shadow-inner" />
                                                    </div>
                                                </div>
                                                <div className="space-y-4">
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Contact Terminal (Phone)</label>
                                                    <div className="relative group">
                                                        <Smartphone className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" size={20} />
                                                        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required placeholder="10-digit mobile number" className="w-full bg-slate-50/50 border-2 border-slate-100 focus:border-blue-500/50 focus:bg-white rounded-[1.5rem] pl-16 pr-8 py-5 font-bold outline-none transition-all text-slate-700 placeholder:text-slate-300 shadow-inner" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex-1"></div>
                                            <button 
                                                type="button" 
                                                onClick={nextStep} 
                                                disabled={!formData.organizationName || !formData.email || !formData.phone} 
                                                className="w-full bg-blue-600 text-white py-6 rounded-2xl font-bold text-sm shadow-xl shadow-blue-600/20 hover:bg-blue-700 active:scale-[0.98] transition-all flex items-center justify-center gap-4 disabled:opacity-30 disabled:cursor-not-allowed group"
                                            >
                                                Initialize Selection <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                                            </button>
                                        </div>
                                    )}

                                    {/* Step 2: Classification */}
                                    {step === 2 && (
                                        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                            <div className="space-y-6">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Select Institute Classification</label>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {INSTITUTE_TYPES.map((type) => (
                                                        <button
                                                            key={type.id}
                                                            onClick={() => handleSelect('instituteType', type.id)}
                                                            className={`flex items-start gap-4 p-6 rounded-2xl border-2 transition-all text-left group ${
                                                                formData.instituteType === type.id 
                                                                ? 'bg-blue-600 border-blue-600 shadow-xl shadow-blue-600/20 scale-[1.02]' 
                                                                : 'bg-slate-50/50 border-slate-100 hover:border-blue-200'
                                                            }`}
                                                        >
                                                            <div className={`p-3 rounded-xl transition-colors ${formData.instituteType === type.id ? 'bg-white/20 text-white' : 'bg-white text-blue-600 shadow-sm'}`}>
                                                                <type.icon size={24} />
                                                            </div>
                                                            <div>
                                                                <p className={`font-bold text-sm leading-tight mb-1 ${formData.instituteType === type.id ? 'text-white' : 'text-slate-900'}`}>{type.title}</p>
                                                                <p className={`text-[10px] font-medium leading-relaxed ${formData.instituteType === type.id ? 'text-blue-100' : 'text-slate-400'}`}>{type.desc}</p>
                                                            </div>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="space-y-6">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mode of Academic Delivery</label>
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    {MODES.map((mode) => (
                                                        <button
                                                            key={mode.id}
                                                            onClick={() => handleSelect('trainingMode', mode.id)}
                                                            className={`flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all text-center ${
                                                                formData.trainingMode === mode.id 
                                                                ? 'bg-blue-50 border-blue-600 shadow-lg shadow-blue-600/5' 
                                                                : 'bg-slate-50/50 border-slate-100 hover:border-blue-200'
                                                            }`}
                                                        >
                                                            <div className={`p-4 rounded-full transition-colors ${formData.trainingMode === mode.id ? 'bg-blue-600 text-white' : 'bg-white text-slate-400 shadow-sm'}`}>
                                                                <mode.icon size={22} />
                                                            </div>
                                                            <div>
                                                                <p className={`font-bold text-xs ${formData.trainingMode === mode.id ? 'text-blue-600' : 'text-slate-900'}`}>{mode.title}</p>
                                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter mt-1">{mode.id}</p>
                                                            </div>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="flex gap-4 pt-10">
                                                <button type="button" onClick={prevStep} className="px-8 py-5 rounded-2xl font-bold text-slate-400 hover:text-slate-900 transition-all flex items-center gap-2 hover:bg-slate-50 bg-transparent text-sm">
                                                    <ChevronLeft size={18} /> Prev
                                                </button>
                                                <button type="button" onClick={nextStep} disabled={!formData.instituteType || !formData.trainingMode} className="flex-1 bg-blue-600 text-white py-5 rounded-2xl font-bold text-sm shadow-xl shadow-blue-600/20 hover:bg-blue-700 active:scale-[0.98] transition-all flex items-center justify-center gap-4 disabled:opacity-30 group">
                                                    Configure Scope <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Step 3: Scope */}
                                    {step === 3 && (
                                        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                            <div className="space-y-4">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Subjects & Specializations</label>
                                                <div className="relative group">
                                                    <Layers className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" size={20} />
                                                    <input type="text" name="subjects" value={formData.subjects} onChange={handleChange} required placeholder="e.g. Science, Mathematics, NEET/JEE Coaching" className="w-full bg-slate-50/50 border-2 border-slate-100 focus:border-blue-500/50 focus:bg-white rounded-[1.5rem] pl-16 pr-8 py-5 font-bold outline-none transition-all text-slate-700 placeholder:text-slate-300 shadow-inner" />
                                                </div>
                                            </div>
                                            <div className="space-y-4">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Serviceable Locations (City/Area)</label>
                                                <div className="relative group">
                                                    <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" size={20} />
                                                    <input type="text" name="locations" value={formData.locations} onChange={handleChange} required placeholder="e.g. Mumbai, Andheri East, New Delhi" className="w-full bg-slate-50/50 border-2 border-slate-100 focus:border-blue-500/50 focus:bg-white rounded-[1.5rem] pl-16 pr-8 py-5 font-bold outline-none transition-all text-slate-700 placeholder:text-slate-300 shadow-inner" />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                <div className="space-y-4">
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Corporate Domain (Website)</label>
                                                    <div className="relative group">
                                                        <Globe className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" size={20} />
                                                        <input type="url" name="website" value={formData.website} onChange={handleChange} placeholder="https://secure-site.com" className="w-full bg-slate-50/50 border-2 border-slate-100 focus:border-blue-500/50 focus:bg-white rounded-[1.5rem] pl-16 pr-8 py-5 font-bold outline-none transition-all text-slate-700 placeholder:text-slate-300 shadow-inner" />
                                                    </div>
                                                </div>
                                                <div className="space-y-4">
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Year of Foundation</label>
                                                    <div className="relative group">
                                                        <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" size={20} />
                                                        <input type="number" name="foundingYear" value={formData.foundingYear} onChange={handleChange} placeholder="20XX" className="w-full bg-slate-50/50 border-2 border-slate-100 focus:border-blue-500/50 focus:bg-white rounded-[1.5rem] pl-16 pr-8 py-5 font-bold outline-none transition-all text-slate-700 placeholder:text-slate-300 shadow-inner" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex gap-4 pt-10">
                                                <button type="button" onClick={prevStep} className="px-8 py-5 rounded-2xl font-bold text-slate-400 hover:text-slate-900 transition-all flex items-center gap-2 hover:bg-slate-50 bg-transparent text-sm">
                                                    <ChevronLeft size={18} /> Prev
                                                </button>
                                                <button type="button" onClick={nextStep} disabled={!formData.subjects || !formData.locations} className="flex-1 bg-blue-600 text-white py-5 rounded-2xl font-bold text-sm shadow-xl shadow-blue-600/20 hover:bg-blue-700 active:scale-[0.98] transition-all flex items-center justify-center gap-4 disabled:opacity-30 group">
                                                    Growth Parameters <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Step 4: Growth */}
                                    {step === 4 && (
                                        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                            <div className="space-y-6">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Faculty & Workforce Strength</label>
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                                    {STRENGTHS.map((str) => (
                                                        <button
                                                            key={str}
                                                            onClick={() => handleSelect('facultyStrength', str)}
                                                            className={`py-6 rounded-2xl border-2 font-bold text-[10px] uppercase tracking-widest transition-all ${
                                                                formData.facultyStrength === str 
                                                                ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-600/20' 
                                                                : 'bg-slate-50/50 border-slate-100 text-slate-400 hover:border-blue-200 hover:text-slate-600'
                                                            }`}
                                                        >
                                                            {str}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Institutional Profile & Achievements</label>
                                                <textarea name="bio" rows="6" value={formData.bio} onChange={handleChange} required placeholder="Detail your institute's specialized methodology, verified achievements, and student success stories..." className="w-full bg-slate-50/50 border-2 border-slate-100 focus:border-blue-500/50 focus:bg-white rounded-[1.5rem] px-8 py-6 font-bold outline-none transition-all resize-none leading-relaxed text-slate-700 placeholder:text-slate-300 shadow-inner"></textarea>
                                            </div>

                                            <div className="flex gap-4 pt-10">
                                                <button type="button" onClick={prevStep} className="px-8 py-5 rounded-2xl font-bold text-slate-400 hover:text-slate-900 transition-all flex items-center gap-2 hover:bg-slate-50 bg-transparent text-sm">
                                                    <ChevronLeft size={18} /> Prev
                                                </button>
                                                <button 
                                                    type="button" 
                                                    onClick={handleSendOTP} 
                                                    disabled={isSubmitting || !formData.bio || !formData.facultyStrength} 
                                                    className="flex-1 bg-blue-600 text-white py-5 rounded-2xl font-bold text-sm shadow-xl shadow-blue-600/20 hover:bg-blue-700 active:scale-[0.98] transition-all flex items-center justify-center gap-4 disabled:opacity-30 group"
                                                >
                                                    {isSubmitting ? "Authenticating..." : "Synchronize Identity"}
                                                    <Zap size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Step 5: Verification */}
                                    {step === 5 && (
                                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 text-center py-10 flex flex-col items-center">
                                            <div className="w-24 h-24 bg-blue-50 rounded-[2rem] flex items-center justify-center text-blue-600 mb-8 border border-blue-100 shadow-xl shadow-blue-600/5">
                                                <ShieldCheck size={48} strokeWidth={2} />
                                            </div>
                                            <div className="space-y-3 mb-12">
                                                <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">Identity Verification</h2>
                                                <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest leading-relaxed">
                                                    Enter the security token sent to <br/>
                                                    <span className="text-blue-600 selection:bg-blue-600 selection:text-white">+{formData.phone}</span>
                                                </p>
                                            </div>
                                            
                                            <input 
                                                type="text" maxLength="6"
                                                placeholder="••••••"
                                                value={otp}
                                                onChange={(e) => setOtp(e.target.value)}
                                                className="w-full max-w-[280px] bg-slate-50 border-2 border-slate-100 focus:border-blue-500 focus:bg-white rounded-[2rem] px-8 py-8 text-4xl font-black text-center tracking-[0.4em] outline-none transition-all shadow-inner text-slate-900 placeholder:text-slate-200 mb-8"
                                            />

                                            {error && <p className="mb-8 text-red-500 font-bold text-xs uppercase tracking-widest bg-red-50 py-4 px-8 rounded-2xl border border-red-100">{error}</p>}

                                            <div className="flex gap-4 w-full max-w-sm mt-8">
                                                <button type="button" onClick={prevStep} className="px-8 py-5 rounded-2xl font-bold text-slate-400 hover:text-slate-900 transition-all flex items-center gap-2 hover:bg-slate-50 bg-transparent text-sm">
                                                    <ChevronLeft size={18} /> Cancel
                                                </button>
                                                <button 
                                                    type="button"
                                                    onClick={handleVerifyAndSubmit}
                                                    disabled={isSubmitting || otp.length < 6}
                                                    className="flex-1 bg-emerald-600 text-white py-5 rounded-2xl font-bold text-sm shadow-xl shadow-emerald-600/20 hover:bg-emerald-700 active:scale-[0.98] transition-all flex items-center justify-center gap-4 disabled:opacity-30 group"
                                                >
                                                    {isSubmitting ? "Processing..." : "Authorize Listing"}
                                                    <Check size={18} className="group-hover:scale-125 transition-transform" />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </form>
                            </div>
                        </div>
                    </div>

                    {/* Right: Value Proposition Sidecard */}
                    <aside className="lg:col-span-4 space-y-10 lg:sticky lg:top-32">
                        <div className="bg-slate-900 rounded-[3rem] p-10 md:p-12 text-white relative overflow-hidden group shadow-2xl shadow-blue-900/40">
                            {/* Decorative Background Element */}
                            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600/20 blur-[80px] rounded-full -mr-20 -mt-20"></div>
                            <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-400/10 blur-[60px] rounded-full -ml-16 -mb-16"></div>

                            <div className="relative z-10">
                                <h3 className="text-2xl font-black mb-8 tracking-tight italic uppercase">Institutional <span className="text-blue-500">Tier</span></h3>
                                <div className="space-y-8">
                                    {[
                                        { icon: Star, title: "Alpha-Grade Visibility", desc: "Priority placement in premium search results across your metropolis." },
                                        { icon: ShieldCheck, title: "Verified Enterprise", desc: "Gain the Institutional Trust Badge once academic audit is finalized." },
                                        { icon: Users, title: "Faculty Management", desc: "Onboard up to 200 educators under your centralized digital umbrella." }
                                    ].map((item, i) => (
                                        <div key={i} className="flex gap-6">
                                            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-blue-400 shrink-0 group-hover:scale-110 transition-transform duration-500">
                                                <item.icon size={22} strokeWidth={2.5} />
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm uppercase tracking-wider text-slate-100">{item.title}</p>
                                                <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase tracking-widest leading-loose">{item.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                
                                <div className="mt-12 pt-10 border-t border-white/5">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="text-center p-5 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-sm">
                                            <p className="text-2xl font-black text-blue-400 tracking-tighter">800+</p>
                                            <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mt-2 leading-none">Registered Centers</p>
                                        </div>
                                        <div className="text-center p-5 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-sm">
                                            <p className="text-2xl font-black text-blue-400 tracking-tighter">1.2M</p>
                                            <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mt-2 leading-none">Annual Matching</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Direct Line Support */}
                        <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 text-center shadow-2xl shadow-blue-900/5 group">
                            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 mx-auto mb-6 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all duration-500">
                                <Award size={32} strokeWidth={1.5} />
                            </div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Onboarding Assistance</p>
                            <button className="text-blue-600 font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-3 mx-auto hover:gap-5 transition-all">
                                Institutional Helpdesk <ArrowRight size={14} />
                            </button>
                        </div>
                    </aside>
                </div>
            </main>

            <div className="mt-20 flex flex-col items-center gap-6">
                <div className="h-px w-24 bg-slate-200"></div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] italic">
                    Already authenticated? <Link href="/login" className="text-blue-600 hover:text-blue-700 transition-colors ml-2 underline underline-offset-8 decoration-blue-200">Execute Login</Link>
                </p>
            </div>
        </div>
    );
}

export default function RegisterInstitute() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans">
                <div className="flex flex-col items-center gap-6">
                    <div className="size-16 border-4 border-blue-600/10 border-t-blue-600 rounded-full animate-spin"></div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest animate-pulse italic">Synchronizing assets...</p>
                </div>
            </div>
        }>
            <InstituteRegisterContent />
        </Suspense>
    );
}
