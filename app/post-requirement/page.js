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
    Key, 
    Zap, 
    MapPin, 
    User, 
    Mail, 
    Smartphone, 
    School, 
    PlusCircle,
    UserCircle,
    CheckCircle,
    Award
} from "lucide-react";

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
            <div className="min-h-screen bg-background-dark flex items-center justify-center p-6 text-center">
                <div className="max-w-xl bg-surface-dark rounded-[4rem] p-16 shadow-4xl border border-primary/20 relative overflow-hidden">
                    <div className="absolute inset-0 bg-primary/2"></div>
                    <div className="relative z-10">
                        <div className="w-24 h-24 bg-primary/10 rounded-[2rem] flex items-center justify-center text-primary mx-auto mb-10 shadow-2xl">
                            <CheckCircle size={48} strokeWidth={3} />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-white mb-6 italic uppercase tracking-tighter">Requirement Live</h1>
                        <p className="text-on-background-dark/40 font-medium mb-12 leading-relaxed italic">
                            Your academic demand has been broadcast to our elite verified faculty network. Matching mentors will synchronize with your terminal shortly.
                        </p>
                        <button 
                            className="w-full bg-primary text-white py-6 rounded-2xl font-black text-[10px] shadow-2xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all uppercase tracking-[0.3em]"
                            onClick={() => router.push('/search')}
                        >
                            Explore Faculty Discovery
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background-dark font-sans text-on-background-dark antialiased pt-40 pb-32">
            
            <Link href="/" className="mb-16 flex items-center gap-6 group max-w-7xl mx-auto px-6">
                <div className="w-16 h-16 bg-surface-dark rounded-2xl border border-border-dark flex items-center justify-center text-primary group-hover:scale-110 transition-transform shadow-inner">
                    <GraduationCap size={32} strokeWidth={3} />
                </div>
                <div>
                   <span className="text-3xl font-black italic tracking-tighter text-white uppercase group-hover:text-primary transition-colors">TuitionsInIndia</span>
                   <p className="text-[10px] font-black text-on-surface-dark/20 uppercase tracking-[0.3em] italic">Requirement Broadcast Interface</p>
                </div>
            </Link>

            <div className="w-full max-w-4xl mx-auto container px-6">
                {/* Stepper Progress */}
                <div className="mb-24 relative">
                    <div className="absolute top-1/2 left-0 right-0 h-1 bg-background-dark -translate-y-1/2 rounded-full overflow-hidden z-0 border border-border-dark/50 shadow-inner">
                        <div
                            className="absolute top-0 left-0 h-full bg-primary transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(255,107,0,0.5)]"
                            style={{ width: `${((step - 1) / 4) * 100}%` }}
                        ></div>
                    </div>

                    <div className="flex justify-between relative z-10">
                        {[1, 2, 3, 4, 5].map((s) => (
                            <div key={s} className="flex flex-col items-center">
                                <div className={`size-14 rounded-[1.2rem] flex items-center justify-center font-black text-[10px] transition-all duration-500 border-4 border-surface-dark italic ${step > s ? 'bg-primary text-white scale-90 opacity-50' :
                                    step === s ? 'bg-primary text-white shadow-2xl shadow-primary/30 scale-110' :
                                        'bg-background-dark text-on-surface-dark/20'
                                    }`}>
                                    {step > s ? <CheckCircle2 size={16} strokeWidth={3} /> : `0${s}`}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Main Form Card */}
                <div className="bg-surface-dark rounded-[4rem] shadow-4xl border border-border-dark overflow-hidden relative group">
                    <div className="absolute inset-0 bg-primary/2 -z-10"></div>
                    <div className="absolute top-0 left-0 w-full h-2 bg-primary shadow-[0_0_20px_rgba(255,107,0,0.4)]"></div>

                    <form onSubmit={step === 5 ? handleVerifyAndSubmit : (e) => e.preventDefault()} className="p-10 md:p-20">
                        {step === 1 && (
                            <div className="animate-fade-in-up space-y-12">
                                <div className="space-y-4">
                                    <h2 className="text-5xl font-black text-white italic tracking-tighter uppercase leading-none">Target <span className="text-primary font-serif lowercase tracking-normal not-italic px-2">academic</span> Specialization.</h2>
                                    <p className="text-on-background-dark/40 italic font-medium">Define your specific pedagogical demand coordinates.</p>
                                </div>

                                <div className="space-y-8">
                                    <div className="space-y-4">
                                        <label className="block text-[10px] font-black text-on-surface-dark/40 uppercase tracking-[0.3em] ml-6 italic">Subject / Research Area</label>
                                        <div className="relative">
                                            <School className="absolute left-8 top-1/2 -translate-y-1/2 text-primary opacity-50" size={20} />
                                            <input
                                                type="text"
                                                name="subject"
                                                placeholder="e.g. Advanced Calculus, Molecular Biology..."
                                                value={formData.subject}
                                                onChange={handleChange}
                                                className="w-full bg-background-dark border border-border-dark focus:border-primary rounded-2xl px-16 py-6 font-medium outline-none transition-all italic text-white placeholder:text-on-surface-dark/10 shadow-inner"
                                                required
                                                autoFocus
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        className="w-full bg-primary text-white py-6 rounded-2xl font-black text-[10px] shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-6 disabled:opacity-20 uppercase tracking-[0.3em]"
                                        onClick={nextStep}
                                        disabled={!formData.subject}>
                                        Proceed Phase <ArrowRight size={16} strokeWidth={3} />
                                    </button>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="animate-fade-in-up space-y-12">
                                <div className="space-y-4">
                                    <h2 className="text-5xl font-black text-white italic tracking-tighter uppercase leading-none">Level & <span className="text-primary font-serif lowercase tracking-normal not-italic px-2">spatial</span> coordinates.</h2>
                                    <p className="text-on-background-dark/40 italic font-medium">Specify academic depth and geographic broadcast hub.</p>
                                </div>

                                <div className="space-y-8">
                                    <div className="space-y-4">
                                        <label className="block text-[10px] font-black text-on-surface-dark/40 uppercase tracking-[0.3em] ml-6 italic">Academic Grade Tier</label>
                                        <div className="relative">
                                            <PlusCircle className="absolute left-8 top-1/2 -translate-y-1/2 text-primary opacity-50" size={20} />
                                            <select
                                                name="grade"
                                                value={formData.grade}
                                                onChange={handleChange}
                                                required
                                                className="w-full bg-background-dark border border-border-dark focus:border-primary rounded-2xl px-16 py-6 font-medium outline-none transition-all italic text-white appearance-none cursor-pointer shadow-inner">
                                                <option value="" disabled className="bg-surface-dark">Select Academic Level</option>
                                                <option value="Primary (1-5)" className="bg-surface-dark">Primary (1-5)</option>
                                                <option value="Middle (6-8)" className="bg-surface-dark">Middle (6-8)</option>
                                                <option value="High School (9-10)" className="bg-surface-dark">High School (9-10)</option>
                                                <option value="Higher Secondary (11-12)" className="bg-surface-dark">Higher Secondary (11-12)</option>
                                                <option value="Undergraduate" className="bg-surface-dark">Undergraduate Degree</option>
                                                <option value="Competitive Exams" className="bg-surface-dark">Competitive Exams</option>
                                                <option value="Other" className="bg-surface-dark">Expert Skills</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="block text-[10px] font-black text-on-surface-dark/40 uppercase tracking-[0.3em] ml-6 italic">Deployment Hub (City/Area)</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-8 top-1/2 -translate-y-1/2 text-primary opacity-50" size={20} />
                                            <input
                                                type="text"
                                                name="location"
                                                placeholder="e.g. Mumbai, Andheri, or Online Network"
                                                value={formData.location}
                                                onChange={handleChange}
                                                required
                                                className="w-full bg-background-dark border border-border-dark focus:border-primary rounded-2xl px-16 py-6 font-medium outline-none transition-all italic text-white placeholder:text-on-surface-dark/10 shadow-inner"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex gap-6">
                                        <button
                                            type="button"
                                            className="px-10 py-6 rounded-2xl font-black text-on-surface-dark/20 hover:text-white transition-all uppercase tracking-[0.3em] text-[10px]"
                                            onClick={prevStep}>
                                            Back
                                        </button>
                                        <button
                                            type="button"
                                            className="flex-1 bg-primary text-white py-6 rounded-2xl font-black text-[10px] shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-6 disabled:opacity-20 uppercase tracking-[0.3em]"
                                            onClick={nextStep}
                                            disabled={!formData.grade || !formData.location}>
                                            Confirm Hub <ArrowRight size={16} strokeWidth={3} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="animate-fade-in-up space-y-12">
                                <div className="space-y-4">
                                    <h2 className="text-5xl font-black text-white italic tracking-tighter uppercase leading-none">Valuation & <span className="text-primary font-serif lowercase tracking-normal not-italic px-2">matrix</span> Details.</h2>
                                    <p className="text-on-background-dark/40 italic font-medium">Configure resource allocation and detailed methodology.</p>
                                </div>

                                <div className="space-y-8">
                                    <div className="space-y-4">
                                        <label className="block text-[10px] font-black text-on-surface-dark/40 uppercase tracking-[0.3em] ml-6 italic">Allocated Hourly Budget (₹)</label>
                                        <div className="relative">
                                            <span className="absolute left-8 top-1/2 -translate-y-1/2 text-primary font-black italic">₹</span>
                                            <input
                                                type="text"
                                                name="budget"
                                                placeholder="e.g. 1500/hr or 5000/month"
                                                value={formData.budget}
                                                onChange={handleChange}
                                                className="w-full bg-background-dark border border-border-dark focus:border-primary rounded-2xl px-16 py-6 font-medium outline-none transition-all italic text-white placeholder:text-on-surface-dark/10 shadow-inner"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="block text-[10px] font-black text-on-surface-dark/40 uppercase tracking-[0.3em] ml-6 italic">Instructional Specification</label>
                                        <textarea
                                            name="description"
                                            rows="5"
                                            placeholder="Specify pedagogical objectives, exam timelines, and expected faculty engagement..."
                                            value={formData.description}
                                            onChange={handleChange}
                                            className="w-full bg-background-dark border border-border-dark focus:border-primary rounded-[2.5rem] px-10 py-8 font-medium outline-none transition-all resize-none leading-relaxed italic text-white placeholder:text-on-surface-dark/10 shadow-inner"
                                        ></textarea>
                                    </div>

                                    <div className="flex gap-6">
                                        <button
                                            type="button"
                                            className="px-10 py-6 rounded-2xl font-black text-on-surface-dark/20 hover:text-white transition-all uppercase tracking-[0.3em] text-[10px]"
                                            onClick={prevStep}>
                                            Back
                                        </button>
                                        <button
                                            type="button"
                                            className="flex-1 bg-primary text-white py-6 rounded-2xl font-black text-[10px] shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-6 disabled:opacity-20 uppercase tracking-[0.3em]"
                                            onClick={nextStep}>
                                            Authorize Phase <ArrowRight size={16} strokeWidth={3} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 4 && (
                            <div className="animate-fade-in-up space-y-12">
                                <div className="space-y-4">
                                    <h2 className="text-5xl font-black text-white italic tracking-tighter uppercase leading-none">Identity <span className="text-primary font-serif lowercase tracking-normal not-italic px-2">contact</span> Terminal.</h2>
                                    <p className="text-on-background-dark/40 italic font-medium">Broadcast authorized endpoint for mentor synchronization.</p>
                                </div>

                                <div className="space-y-8">
                                    <div className="space-y-4">
                                        <label className="block text-[10px] font-black text-on-surface-dark/40 uppercase tracking-[0.3em] ml-6 italic">Full Identity Name</label>
                                        <div className="relative">
                                            <UserCircle className="absolute left-8 top-1/2 -translate-y-1/2 text-primary opacity-50" size={20} />
                                            <input
                                                type="text"
                                                name="name"
                                                placeholder="Identity Holder Name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                required
                                                className="w-full bg-background-dark border border-border-dark focus:border-primary rounded-2xl px-16 py-6 font-medium outline-none transition-all italic text-white placeholder:text-on-surface-dark/10 shadow-inner"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="block text-[10px] font-black text-on-surface-dark/40 uppercase tracking-[0.3em] ml-6 italic">Command Variable (Mobile)</label>
                                        <div className="relative">
                                            <Smartphone className="absolute left-8 top-1/2 -translate-y-1/2 text-primary opacity-50" size={20} />
                                            <input
                                                type="tel"
                                                name="phone"
                                                placeholder="10-digit authorization terminal"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                required
                                                className="w-full bg-background-dark border border-border-dark focus:border-primary rounded-2xl px-16 py-6 font-medium outline-none transition-all italic text-white placeholder:text-on-surface-dark/10 shadow-inner"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="block text-[10px] font-black text-on-surface-dark/40 uppercase tracking-[0.3em] ml-6 italic">Verification Hub (Email)</label>
                                        <div className="relative">
                                            <Mail className="absolute left-8 top-1/2 -translate-y-1/2 text-primary opacity-50" size={20} />
                                            <input
                                                type="email"
                                                name="email"
                                                placeholder="auth@domain.com"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                                className="w-full bg-background-dark border border-border-dark focus:border-primary rounded-2xl px-16 py-6 font-medium outline-none transition-all italic text-white placeholder:text-on-surface-dark/10 shadow-inner"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex gap-6">
                                        <button
                                            type="button"
                                            className="px-10 py-6 rounded-2xl font-black text-on-surface-dark/20 hover:text-white transition-all uppercase tracking-[0.3em] text-[10px]"
                                            onClick={prevStep}>
                                            Back
                                        </button>
                                        <button
                                            type="button"
                                            className="flex-1 bg-primary text-white py-6 rounded-2xl font-black text-[10px] shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-6 disabled:opacity-20 uppercase tracking-[0.3em]"
                                            onClick={handleSendOTP}
                                            disabled={isSubmitting || !formData.name || !formData.phone || !formData.email}>
                                            {isSubmitting ? (
                                                <Zap size={18} className="animate-spin" />
                                            ) : (
                                                <>Broadcast Sync <ShieldCheck size={18} strokeWidth={3} /></>
                                            )}
                                        </button>
                                    </div>
                                    {otpError && <p className="text-center text-[10px] text-red-400 font-black uppercase tracking-widest bg-red-400/5 p-4 rounded-xl border border-red-400/20">{otpError}</p>}
                                </div>
                            </div>
                        )}

                        {step === 5 && (
                            <div className="animate-fade-in-up text-center py-10 space-y-12">
                                <div className="w-24 h-24 bg-primary/10 rounded-[2.5rem] flex items-center justify-center text-primary mx-auto mb-8 animate-pulse shadow-4xl shadow-primary/10 border border-primary/20">
                                    <Key size={48} strokeWidth={3} />
                                </div>
                                <div className="space-y-4">
                                    <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">Security Authorization</h2>
                                    <p className="text-on-background-dark/40 mb-12 italic font-medium">
                                        Entering the 6-digit verification string dispatched to <span className="text-primary font-black not-italic tracking-normal">+{formData.phone}</span>.
                                    </p>
                                </div>
                                <div className="max-w-sm mx-auto mb-12">
                                    <input
                                        type="text"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        maxLength="6"
                                        required
                                        placeholder="••••••"
                                        className="w-full bg-background-dark border border-border-dark focus:border-primary rounded-[2.5rem] px-8 py-10 text-5xl font-black text-center tracking-[0.5em] outline-none transition-all shadow-inner text-white placeholder:text-on-surface-dark/5 italic"
                                    />
                                </div>
                                {otpError && <p className="text-center text-[10px] text-red-400 font-black uppercase tracking-widest bg-red-400/5 p-4 rounded-xl border border-red-400/20 mb-10">{otpError}</p>}
                                <div className="flex gap-6 max-w-lg mx-auto">
                                    <button
                                        type="button"
                                        className="px-10 py-6 rounded-2xl font-black text-on-surface-dark/20 hover:text-white transition-all uppercase tracking-[0.3em] text-[10px]"
                                        onClick={prevStep}>
                                        Sync Refinement
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting || otp.length < 6}
                                        className="flex-1 bg-primary text-white py-6 rounded-2xl font-black text-[10px] shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-6 disabled:opacity-20 uppercase tracking-[0.3em]">
                                        {isSubmitting ? "Processing..." : "Authorize Broadcast"}
                                        <Zap size={16} strokeWidth={3} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </form>
                </div>
            </div>
            
            {/* Context Stats */}
            <div className="max-w-4xl mx-auto mt-24 grid grid-cols-1 md:grid-cols-3 gap-12 px-6">
                {[
                    { label: "Faculty Reach", value: "24k+", icon: Award },
                    { label: "Sync Velocity", value: "15 min", icon: Zap },
                    { label: "Verification Tier", value: "Shield-3", icon: ShieldCheck }
                ].map((stat, i) => (
                    <div key={i} className="flex flex-col items-center text-center space-y-4 group">
                        <div className="size-12 bg-surface-dark rounded-2xl border border-border-dark flex items-center justify-center text-primary/40 group-hover:text-primary transition-colors">
                            <stat.icon size={20} />
                        </div>
                        <div>
                           <p className="text-2xl font-black text-white italic tracking-tighter">{stat.value}</p>
                           <p className="text-[8px] font-black uppercase text-on-surface-dark/20 tracking-[0.3em]">{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
