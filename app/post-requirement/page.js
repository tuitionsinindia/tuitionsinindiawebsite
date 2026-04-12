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
    Activity
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
            // Submit Lead with verified user data
            const res = await fetch("/api/lead/post", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    name: user.name,
                    phone: user.phone,
                    email: user.email || `${user.phone}@tuitionsinindia.com`, // Fallback for email
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
                <div className="max-w-xl bg-white rounded-[4rem] p-16 shadow-4xl shadow-blue-900/10 border border-blue-100 relative overflow-hidden">
                    <div className="absolute inset-0 bg-blue-600/5"></div>
                    <div className="relative z-10">
                        <div className="w-24 h-24 bg-blue-600/10 rounded-[2rem] flex items-center justify-center text-blue-600 mx-auto mb-10 shadow-2xl shadow-blue-600/20">
                            <CheckCircle size={48} strokeWidth={3} />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 italic uppercase tracking-tighter">Broadcast Live</h1>
                        <p className="text-gray-400 font-medium mb-12 leading-relaxed italic">
                            Your academic requirement has been synchronized with our verified faculty network. Expert mentors will contact you shortly.
                        </p>
                        <button 
                            className="w-full bg-blue-600 text-white py-6 rounded-2xl font-black text-xs shadow-2xl shadow-blue-600/30 hover:bg-gray-900 transition-all uppercase tracking-[0.3em]"
                            onClick={() => router.push('/search')}
                        >
                            Explore Global Directory
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-blue-50/50 font-sans text-gray-900 antialiased pt-32 pb-32">
            
            <Link href="/" className="mb-16 flex items-center gap-4 group max-w-7xl mx-auto px-6">
                <div className="size-14 bg-white rounded-2xl border border-gray-100 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform shadow-sm">
                    <GraduationCap size={28} strokeWidth={3} />
                </div>
                <div>
                   <span className="text-2xl font-black italic tracking-tighter text-gray-900 uppercase group-hover:text-blue-600 transition-colors leading-none">TuitionsInIndia</span>
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] italic">Requirement Placement Hub</p>
                </div>
            </Link>

            <div className="w-full max-w-4xl mx-auto container px-6">
                {/* Stepper Progress */}
                <div className="mb-20 relative">
                    <div className="absolute top-1/2 left-0 right-0 h-1.5 bg-gray-100 -translate-y-1/2 rounded-full overflow-hidden z-0">
                        <div
                            className="absolute top-0 left-0 h-full bg-blue-600 transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(37,99,235,0.3)]"
                            style={{ width: `${((step - 1) / 3) * 100}%` }}
                        ></div>
                    </div>

                    <div className="flex justify-between relative z-10">
                        {[1, 2, 3, 4].map((s) => (
                            <div key={s} className="flex flex-col items-center">
                                <div className={`size-12 rounded-2xl flex items-center justify-center font-black text-xs transition-all duration-500 border-4 border-white italic ${step > s ? 'bg-blue-600 text-white scale-90 opacity-40' :
                                    step === s ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/30 scale-110' :
                                        'bg-gray-100 text-gray-300'
                                    }`}>
                                    {step > s ? <CheckCircle2 size={16} strokeWidth={3} /> : `0${s}`}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Main Form Card */}
                <div className="bg-white rounded-[4rem] shadow-4xl shadow-blue-900/5 border border-gray-100 overflow-hidden relative group">
                    <div className="absolute inset-0 bg-blue-600/2"></div>
                    <div className="absolute top-0 left-0 w-full h-2 bg-blue-600/10"></div>

                    <div className="p-10 md:p-20">
                        {step === 1 && (
                            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 space-y-12">
                                <div className="space-y-4">
                                    <h2 className="text-5xl font-black text-gray-900 italic tracking-tighter uppercase leading-none">Target <span className="text-blue-600 font-serif lowercase tracking-normal not-italic px-2">academic</span> Interest.</h2>
                                    <p className="text-gray-400 italic font-medium">Specify the subject domain you wish to synchronize.</p>
                                </div>

                                <div className="space-y-8">
                                    <div className="space-y-4">
                                        <label className="block text-xs font-black text-gray-400 uppercase tracking-[0.3em] ml-6 italic">Subject / Field of Study</label>
                                        <div className="relative">
                                            <School className="absolute left-8 top-1/2 -translate-y-1/2 text-blue-600/40" size={20} />
                                            <input
                                                type="text"
                                                name="subject"
                                                placeholder="e.g. Advanced Calculus, Physics..."
                                                value={formData.subject}
                                                onChange={handleChange}
                                                className="w-full bg-gray-50 border border-gray-100 focus:bg-white focus:border-blue-600 rounded-2xl px-16 py-6 font-medium outline-none transition-all italic text-gray-900 placeholder:text-gray-200"
                                                required
                                                autoFocus
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        className="w-full bg-blue-600 text-white py-6 rounded-2xl font-black text-xs shadow-2xl shadow-blue-600/30 hover:bg-gray-900 transition-all flex items-center justify-center gap-6 disabled:opacity-20 uppercase tracking-[0.3em]"
                                        onClick={nextStep}
                                        disabled={!formData.subject}>
                                        Continue <ArrowRight size={16} strokeWidth={3} />
                                    </button>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 space-y-12">
                                <div className="space-y-4">
                                    <h2 className="text-5xl font-black text-gray-900 italic tracking-tighter uppercase leading-none">Level & <span className="text-blue-600 font-serif lowercase tracking-normal not-italic px-2">geographic</span> Hub.</h2>
                                    <p className="text-gray-400 italic font-medium">Define your academic grade and physical location coords.</p>
                                </div>

                                <div className="space-y-8">
                                    <div className="space-y-4">
                                        <label className="block text-xs font-black text-gray-400 uppercase tracking-[0.3em] ml-6 italic">Academic Grade Tier</label>
                                        <div className="relative">
                                            <PlusCircle className="absolute left-8 top-1/2 -translate-y-1/2 text-blue-600/40" size={20} />
                                            <select
                                                name="grade"
                                                value={formData.grade}
                                                onChange={handleChange}
                                                required
                                                className="w-full bg-gray-50 border border-gray-100 focus:bg-white focus:border-blue-600 rounded-2xl px-16 py-6 font-medium outline-none transition-all italic text-gray-900 appearance-none cursor-pointer">
                                                <option value="" disabled>Select Level</option>
                                                <option value="Primary (1-5)">Primary (1-5)</option>
                                                <option value="Middle (6-8)">Middle (6-8)</option>
                                                <option value="High School (9-10)">High School (9-10)</option>
                                                <option value="Higher Secondary (11-12)">Higher Secondary (11-12)</option>
                                                <option value="Undergraduate">Undergraduate Degree</option>
                                                <option value="Competitive Exams">Competitive Exams</option>
                                                <option value="Other">Custom Skills</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="block text-xs font-black text-gray-400 uppercase tracking-[0.3em] ml-6 italic">Deployment Area (City)</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-8 top-1/2 -translate-y-1/2 text-blue-600/40" size={20} />
                                            <input
                                                type="text"
                                                name="location"
                                                placeholder="e.g. Mumbai, Online Hub..."
                                                value={formData.location}
                                                onChange={handleChange}
                                                required
                                                className="w-full bg-gray-50 border border-gray-100 focus:bg-white focus:border-blue-600 rounded-2xl px-16 py-6 font-medium outline-none transition-all italic text-gray-900 placeholder:text-gray-200"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex gap-6">
                                        <button
                                            type="button"
                                            className="px-8 py-6 rounded-2xl font-black text-gray-300 hover:text-blue-600 transition-all uppercase tracking-[0.3em] text-xs"
                                            onClick={prevStep}>
                                            Back
                                        </button>
                                        <button
                                            type="button"
                                            className="flex-1 bg-blue-600 text-white py-6 rounded-2xl font-black text-xs shadow-2xl shadow-blue-600/30 hover:bg-gray-900 transition-all flex items-center justify-center gap-6 disabled:opacity-20 uppercase tracking-[0.3em]"
                                            onClick={nextStep}
                                            disabled={!formData.grade || !formData.location}>
                                            Authorize Hub <ArrowRight size={16} strokeWidth={3} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 space-y-12">
                                <div className="space-y-4">
                                    <h2 className="text-5xl font-black text-gray-900 italic tracking-tighter uppercase leading-none">Budget & <span className="text-blue-600 font-serif lowercase tracking-normal not-italic px-2">delivery</span> Constraints.</h2>
                                    <p className="text-gray-400 italic font-medium">Fine-tune your hourly allocation and detailed requirements.</p>
                                </div>

                                <div className="space-y-8">
                                    <div className="space-y-4">
                                        <label className="block text-xs font-black text-gray-400 uppercase tracking-[0.3em] ml-6 italic">Hourly Budget (₹)</label>
                                        <div className="relative">
                                            <span className="absolute left-8 top-1/2 -translate-y-1/2 text-blue-600 font-black italic">₹</span>
                                            <input
                                                type="text"
                                                name="budget"
                                                placeholder="e.g. 1000/hr"
                                                value={formData.budget}
                                                onChange={handleChange}
                                                className="w-full bg-gray-50 border border-gray-100 focus:bg-white focus:border-blue-600 rounded-2xl px-16 py-6 font-medium outline-none transition-all italic text-gray-900 placeholder:text-gray-200"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="block text-xs font-black text-gray-400 uppercase tracking-[0.3em] ml-6 italic">Detailed Specification</label>
                                        <textarea
                                            name="description"
                                            rows="4"
                                            placeholder="State your academic objectives and expectations..."
                                            value={formData.description}
                                            onChange={handleChange}
                                            className="w-full bg-gray-50 border border-gray-100 focus:bg-white focus:border-blue-600 rounded-[2rem] px-10 py-8 font-medium outline-none transition-all resize-none leading-relaxed italic text-gray-900 placeholder:text-gray-200"
                                        ></textarea>
                                    </div>

                                    <div className="flex gap-6">
                                        <button
                                            type="button"
                                            className="px-8 py-6 rounded-2xl font-black text-gray-300 hover:text-blue-600 transition-all uppercase tracking-[0.3em] text-xs"
                                            onClick={prevStep}>
                                            Back
                                        </button>
                                        <button
                                            type="button"
                                            className="flex-1 bg-blue-600 text-white py-6 rounded-2xl font-black text-xs shadow-2xl shadow-blue-600/30 hover:bg-gray-900 transition-all flex items-center justify-center gap-6 disabled:opacity-20 uppercase tracking-[0.3em]"
                                            onClick={nextStep}>
                                            Begin Sync <ArrowRight size={16} strokeWidth={3} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 4 && (
                            <div className="animate-in zoom-in-95 duration-700 space-y-12">
                                <div className="space-y-4 text-center">
                                    <h2 className="text-4xl font-black text-gray-900 italic uppercase tracking-tighter">Identity <span className="text-blue-600">Verification.</span></h2>
                                    <p className="text-gray-400 italic font-medium">Authenticate your placement request via secure identity protocol.</p>
                                </div>
                                <div className="bg-gray-50 p-8 md:p-12 rounded-[3.5rem] border border-gray-100 shadow-inner">
                                    <LeadCaptureFlow initialRole="STUDENT" onComplete={handleVerificationComplete} />
                                </div>
                                <button
                                    type="button"
                                    className="w-full text-xs font-black text-gray-300 hover:text-blue-600 transition-all uppercase tracking-[0.4em] italic leading-none"
                                    onClick={prevStep}>
                                    Refine Requirements
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            
            {/* Professional Hub Context */}
            <div className="max-w-4xl mx-auto mt-20 grid grid-cols-1 md:grid-cols-3 gap-10 px-6">
                {[
                    { label: "Verified Tutors", value: "24k+", icon: Award },
                    { label: "Sync Velocity", value: "Avg 15m", icon: Zap },
                    { label: "Secure Payments", icon: ShieldCheck }
                ].map((stat, i) => (
                    <div key={i} className="flex flex-col items-center text-center space-y-3 group">
                        <div className="size-10 bg-white rounded-xl border border-gray-100 flex items-center justify-center text-blue-600/30 group-hover:text-blue-600 transition-colors shadow-sm">
                            <stat.icon size={18} />
                        </div>
                        <div>
                           <p className="text-xl font-black text-gray-900 italic tracking-tighter">{stat.value}</p>
                           <p className="text-[10px] font-black uppercase text-gray-400 tracking-[0.3em]">{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Static operational indicator */}
            <div className="mt-16 text-center flex items-center justify-center gap-2 text-[10px] font-black text-gray-300 uppercase tracking-[0.8em] italic">
                <Activity size={12} strokeWidth={3} className="text-blue-600 animate-pulse" /> BROADCAST_STATION_ACTIVE
            </div>
        </div>
    );
}
