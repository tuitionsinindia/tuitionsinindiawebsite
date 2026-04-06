"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { 
    GraduationCap, ArrowRight, UserCheck, ShieldCheck, MapPin, Smartphone, 
    CheckCircle2, Key, Star, Zap, Mail, User, BookOpen, Clock, Monitor, Award
} from "lucide-react";

const SUBJECTS = [
    "Mathematics", "Physics", "Chemistry", "Biology", "Science",
    "English", "Hindi", "Sanskrit", "French", "German", "Spanish",
    "Tamil", "Telugu", "Kannada", "Malayalam", "Marathi", "Bengali", "Gujarati", "Punjabi", "Urdu",
    "Social Science", "History", "Geography", "Economics", "Civics", "Political Science",
    "Accountancy", "Business Studies", "Commerce", "Statistics",
    "Computer Science", "Coding", "Python", "Java", "C++", "Web Development",
    "JEE Preparation", "NEET Preparation", "UPSC Exams", "Banking Exams", "SSC Exams", "CLAT", "CAT", "GATE",
    "IELTS", "TOEFL", "GRE", "GMAT", "SAT", "IB Curriculum", "IGCSE",
    "Vocal Music", "Guitar", "Piano", "Keyboard", "Flute",
    "Classical Dance", "Western Dance", "Yoga",
    "Drawing", "Painting", "Art & Craft",
    "Personality Development", "Spoken English", "Public Speaking",
    "Vedic Maths", "Abacus", "Chess"
];

const GRADES = [
    "Pre-School (Nursery/KG)", "Class 1-5 (Primary)", "Class 6-8 (Middle)",
    "Class 9-10 (High School)", "Class 11-12 (Science)", "Class 11-12 (Commerce)",
    "Class 11-12 (Arts/Humanities)", "Undergraduate", "Postgraduate",
    "Competitive Exams", "Hobby / Skill-based"
];

const BOARDS = ["CBSE", "ICSE/ISC", "State Board", "IB", "IGCSE", "NIOS", "Other"];

const MODES = [
    { id: "online", label: "Online Classes", icon: Monitor },
    { id: "home", label: "Home Tuition", icon: MapPin },
    { id: "both", label: "Both", icon: BookOpen }
];

function StudentRegisterContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        subject: searchParams.get("subject") || "",
        grade: searchParams.get("grade") || "",
        board: "",
        location: searchParams.get("location") || "",
        mode: "",
        preferredTiming: "",
        password: "DefaultPassword123!",
    });

    const [step, setStep] = useState(1);
    const [otp, setOtp] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Hydrate from sessionStorage if URL params are empty
    useEffect(() => {
        if (!formData.subject) {
            const savedSubject = sessionStorage.getItem("last_search_subject");
            const savedGrade = sessionStorage.getItem("last_search_grade");
            const savedLocation = sessionStorage.getItem("last_search_location");
            if (savedSubject) setFormData(prev => ({ ...prev, subject: savedSubject, grade: savedGrade || prev.grade, location: savedLocation || prev.location }));
        }
        // If subject/grade already pre-filled, skip to step 2
        if (formData.subject && formData.grade) setStep(2);
    }, []);

    const handleSendOTP = async () => {
        setError("");
        setIsSubmitting(true);
        try {
            const res = await fetch("/api/auth/send-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phone: formData.phone }),
            });
            if (res.ok) {
                setStep(4);
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

            // Post requirement after successful registration
            if (formData.subject) {
                await fetch("/api/lead/post", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        studentId: "current_user",
                        subject: formData.subject,
                        grade: formData.grade,
                        location: formData.location || "Online",
                        description: `Requirement for ${formData.subject} - ${formData.grade}`,
                        name: formData.name,
                        phone: formData.phone,
                        email: formData.email
                    }),
                });
            }
            router.push("/dashboard/student?welcome=true");
        } catch (err) {
            setError("An error occurred. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const progressValue = (step / 4) * 100;

    // Subject autocomplete state
    const [subjectQuery, setSubjectQuery] = useState(formData.subject);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const filteredSubjects = subjectQuery 
        ? SUBJECTS.filter(s => s.toLowerCase().includes(subjectQuery.toLowerCase())).slice(0, 8) 
        : SUBJECTS.slice(0, 10);

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900 antialiased pt-28 pb-24">
            <main className="max-w-7xl mx-auto px-6">
                {/* Progress Header */}
                <div className="max-w-3xl mx-auto mb-12 space-y-4">
                    <div className="flex justify-between items-end px-1">
                        <div>
                            <span className="text-blue-600 font-bold uppercase text-[10px] tracking-wider block mb-2">Student Registration</span>
                            {searchParams.get('intent') === 'unlock' ? (
                                <div className="space-y-1">
                                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 flex items-center gap-3">
                                        <div className="size-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shrink-0">
                                            <Star size={20} fill="currentColor" />
                                        </div>
                                        Unlock Tutor Details
                                    </h1>
                                    <p className="text-blue-600 font-bold text-[10px] uppercase tracking-[0.2em] italic ml-13">Verified Identity Required for Contact Access</p>
                                </div>
                            ) : (
                                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                                    {step === 1 ? "What do you need?" : step === 2 ? "Preferences" : step === 3 ? "Your Details" : "Verify Phone"}
                                </h1>
                            )}
                        </div>
                        <p className="text-sm text-gray-400 font-bold">Step {step} of 4</p>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600 rounded-full transition-all duration-500" style={{ width: `${progressValue}%` }} />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                    {/* Main Form */}
                    <div className="lg:col-span-8">
                        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-200">
                            
                            {/* Step 1: Subject & Grade */}
                            {step === 1 && (
                                <div className="animate-fade-in-up space-y-8">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-14 h-14 bg-blue-50 rounded-2xl border border-blue-100 flex items-center justify-center text-blue-600">
                                            <GraduationCap size={28} />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold text-gray-900">Subject & Grade</h2>
                                            <p className="text-sm text-gray-500 font-medium">Tell us what you need help with</p>
                                        </div>
                                    </div>
                                    
                                    {/* Grade Selection */}
                                    <div className="space-y-3">
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Grade / Level</label>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                            {GRADES.map(g => (
                                                <button key={g} onClick={() => setFormData({...formData, grade: g})} className={`p-4 rounded-xl border-2 text-sm font-semibold transition-all text-left ${formData.grade === g ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-gray-50 border-gray-200 hover:border-blue-300 text-gray-700'}`}>
                                                    {g}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Subject with autocomplete */}
                                    <div className="space-y-3 relative">
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Subject Needed</label>
                                        <input 
                                            type="text"
                                            placeholder="e.g. Mathematics, Physics, English"
                                            value={subjectQuery}
                                            onChange={(e) => { setSubjectQuery(e.target.value); setFormData({...formData, subject: e.target.value}); setShowSuggestions(true); }}
                                            onFocus={() => setShowSuggestions(true)}
                                            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                                            className="w-full bg-white border border-gray-300 focus:border-blue-500 rounded-xl px-5 py-4 font-medium outline-none transition-all text-gray-900 shadow-sm"
                                        />
                                        {showSuggestions && filteredSubjects.length > 0 && (
                                            <div className="absolute top-full mt-1 left-0 w-full bg-white border border-gray-200 rounded-xl shadow-xl z-50 max-h-48 overflow-y-auto py-2">
                                                {filteredSubjects.map((s, i) => (
                                                    <div key={i} onMouseDown={() => { setSubjectQuery(s); setFormData({...formData, subject: s}); setShowSuggestions(false); }} className="px-5 py-3 hover:bg-blue-50 cursor-pointer text-sm font-medium text-gray-700 hover:text-blue-700 transition-colors">
                                                        {s}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Board */}
                                    <div className="space-y-3">
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Academic Board (Optional)</label>
                                        <div className="flex flex-wrap gap-2">
                                            {BOARDS.map(b => (
                                                <button key={b} onClick={() => setFormData({...formData, board: b})} className={`px-4 py-2.5 rounded-lg border text-sm font-semibold transition-all ${formData.board === b ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-gray-50 border-gray-200 hover:border-blue-300 text-gray-600'}`}>
                                                    {b}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <button onClick={() => setStep(2)} disabled={!formData.grade || !formData.subject} className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-sm hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-4">
                                        Continue <ArrowRight size={16} />
                                    </button>
                                </div>
                            )}

                            {/* Step 2: Location, Mode, Timing */}
                            {step === 2 && (
                                <div className="animate-fade-in-up space-y-8">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-14 h-14 bg-blue-50 rounded-2xl border border-blue-100 flex items-center justify-center text-blue-600">
                                            <MapPin size={28} />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold text-gray-900">Your Preferences</h2>
                                            <p className="text-sm text-gray-500 font-medium">Where and how do you want to learn?</p>
                                        </div>
                                    </div>

                                    {/* Mode of Learning */}
                                    <div className="space-y-3">
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Mode of Learning</label>
                                        <div className="grid grid-cols-3 gap-3">
                                            {MODES.map(m => (
                                                <button key={m.id} onClick={() => setFormData({...formData, mode: m.id})} className={`p-5 rounded-xl border-2 text-sm font-semibold transition-all flex flex-col items-center gap-2 text-center ${formData.mode === m.id ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-gray-50 border-gray-200 hover:border-blue-300 text-gray-700'}`}>
                                                    <m.icon size={24} />
                                                    {m.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Location */}
                                    <div className="space-y-3">
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">City / Area</label>
                                        <input type="text" placeholder="e.g. Andheri West, Mumbai" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} className="w-full bg-white border border-gray-300 focus:border-blue-500 rounded-xl px-5 py-4 font-medium outline-none transition-all text-gray-900 shadow-sm" />
                                    </div>

                                    {/* Preferred Timing */}
                                    <div className="space-y-3">
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Preferred Timing (Optional)</label>
                                        <div className="flex flex-wrap gap-2">
                                            {["Morning (8-12)", "Afternoon (12-4)", "Evening (4-8)", "Night (8-10)", "Flexible"].map(t => (
                                                <button key={t} onClick={() => setFormData({...formData, preferredTiming: t})} className={`px-4 py-2.5 rounded-lg border text-sm font-semibold transition-all ${formData.preferredTiming === t ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-gray-50 border-gray-200 hover:border-blue-300 text-gray-600'}`}>
                                                    <Clock size={14} className="inline mr-1.5 -mt-0.5" />{t}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {error && <p className="text-center text-red-600 font-semibold text-sm bg-red-50 p-4 rounded-xl border border-red-100">{error}</p>}

                                    <div className="flex gap-4 mt-6">
                                        <button onClick={() => setStep(1)} className="px-6 py-4 rounded-xl font-bold text-gray-500 hover:text-gray-800 transition-all text-sm bg-gray-100 hover:bg-gray-200">Back</button>
                                        <button onClick={() => setStep(3)} disabled={!formData.mode || !formData.location} className="flex-1 bg-blue-600 text-white py-4 rounded-xl font-bold text-sm hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                                            Next: Contact Details <ArrowRight size={16} />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Personal Info */}
                            {step === 3 && (
                                <div className="animate-fade-in-up space-y-8">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-14 h-14 bg-blue-50 rounded-2xl border border-blue-100 flex items-center justify-center text-blue-600">
                                            <UserCheck size={28} />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold text-gray-900">Your Contact Details</h2>
                                            <p className="text-sm text-gray-500 font-medium">So tutors can reach out to you safely</p>
                                        </div>
                                    </div>

                                    <div className="space-y-5">
                                        <div className="space-y-2">
                                            <label className="block text-xs font-bold text-gray-500 tracking-wider ml-1">Full Name</label>
                                            <div className="relative">
                                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                                <input type="text" placeholder="e.g. Priya Sharma" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-white border border-gray-300 focus:border-blue-500 rounded-xl pl-12 pr-5 py-4 font-medium outline-none transition-all text-gray-900 shadow-sm" />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="block text-xs font-bold text-gray-500 tracking-wider ml-1">Phone Number</label>
                                            <div className="flex gap-3">
                                                <div className="px-5 py-4 bg-gray-50 border border-gray-300 rounded-xl font-bold text-gray-600 flex items-center text-sm shadow-sm">+91</div>
                                                <div className="relative flex-1">
                                                    <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                                    <input type="tel" placeholder="10-digit mobile number" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full bg-white border border-gray-300 focus:border-blue-500 rounded-xl pl-12 pr-5 py-4 font-medium outline-none transition-all text-gray-900 shadow-sm" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="block text-xs font-bold text-gray-500 tracking-wider ml-1">Email Address</label>
                                            <div className="relative">
                                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                                <input type="email" placeholder="name@email.com" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full bg-white border border-gray-300 focus:border-blue-500 rounded-xl pl-12 pr-5 py-4 font-medium outline-none transition-all text-gray-900 shadow-sm" />
                                            </div>
                                        </div>
                                    </div>

                                    {error && <p className="text-center text-red-600 font-semibold text-sm bg-red-50 p-4 rounded-xl border border-red-100">{error}</p>}

                                    <div className="flex gap-4 mt-6">
                                        <button onClick={() => setStep(2)} className="px-6 py-4 rounded-xl font-bold text-gray-500 hover:text-gray-800 transition-all text-sm bg-gray-100 hover:bg-gray-200">Back</button>
                                        <button onClick={handleSendOTP} disabled={isSubmitting || !formData.phone || !formData.name || !formData.email} className="flex-1 bg-blue-600 text-white py-4 rounded-xl font-bold text-sm hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                                            {isSubmitting ? <CheckCircle2 size={16} className="animate-spin" /> : "Verify & Register"}
                                            <ShieldCheck size={16} />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Step 4: OTP */}
                            {step === 4 && (
                                <form onSubmit={handleVerifyAndRegister} className="animate-fade-in-up text-center py-8 space-y-8">
                                    <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mx-auto">
                                        <Key size={40} />
                                    </div>
                                    <div className="space-y-2">
                                        <h2 className="text-3xl font-bold text-gray-900">Verify Phone Number</h2>
                                        <p className="text-gray-500 font-medium">Enter the 6-digit OTP sent to <span className="text-gray-900 font-bold">+91 {formData.phone}</span></p>
                                    </div>
                                    
                                    <input type="text" maxLength="6" placeholder="••••••" value={otp} onChange={(e) => setOtp(e.target.value)} className="w-full max-w-[220px] mx-auto bg-white border border-gray-300 focus:border-blue-500 rounded-2xl px-6 py-6 text-3xl font-bold text-center tracking-[0.5em] outline-none transition-all shadow-sm block text-gray-900" />

                                    {error && <p className="text-center text-red-600 font-semibold text-sm bg-red-50 p-4 rounded-xl border border-red-100">{error}</p>}

                                    <div className="flex gap-4 max-w-sm mx-auto">
                                        <button type="button" onClick={() => setStep(3)} className="px-6 py-4 rounded-xl font-bold text-gray-500 hover:text-gray-800 transition-all text-sm bg-gray-100 hover:bg-gray-200">Back</button>
                                        <button type="submit" disabled={isSubmitting || otp.length < 6} className="flex-1 bg-green-600 text-white py-4 rounded-xl font-bold text-sm hover:bg-green-700 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                                            {isSubmitting ? "Verifying..." : "Complete Registration"}
                                            <CheckCircle2 size={16} />
                                        </button>
                                    </div>
                                    
                                    <p className="mt-4 text-sm font-medium text-gray-500">
                                        Didn't receive code? <button type="button" onClick={handleSendOTP} className="text-blue-600 hover:underline font-bold">Resend OTP</button>
                                    </p>
                                </form>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <aside className="lg:col-span-4 space-y-6">
                        {/* Summary Panel */}
                        {(formData.subject || formData.grade || formData.location) && (
                            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                                <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">Your Selection</h3>
                                <div className="space-y-3 text-sm">
                                    {formData.grade && <div className="flex justify-between"><span className="text-gray-500">Grade</span><span className="font-bold text-gray-800">{formData.grade}</span></div>}
                                    {formData.subject && <div className="flex justify-between"><span className="text-gray-500">Subject</span><span className="font-bold text-gray-800">{formData.subject}</span></div>}
                                    {formData.board && <div className="flex justify-between"><span className="text-gray-500">Board</span><span className="font-bold text-gray-800">{formData.board}</span></div>}
                                    {formData.location && <div className="flex justify-between"><span className="text-gray-500">Location</span><span className="font-bold text-gray-800">{formData.location}</span></div>}
                                    {formData.mode && <div className="flex justify-between"><span className="text-gray-500">Mode</span><span className="font-bold text-gray-800 capitalize">{formData.mode === 'both' ? 'Online + Home' : formData.mode}</span></div>}
                                </div>
                            </div>
                        )}

                        {/* Trust Panel */}
                        <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm">
                            <h3 className="text-lg font-bold text-gray-900 mb-6">Why Students Trust Us</h3>
                            <ul className="space-y-5">
                                {[
                                    { icon: ShieldCheck, title: "100% Verified Tutors", desc: "Every tutor undergoes credential verification." },
                                    { icon: Zap, title: "Fast Matching", desc: "Get tutor responses within 15 minutes." },
                                    { icon: Star, title: "No Commission", desc: "Pay fees directly to the tutor. Zero platform fees." }
                                ].map((item, i) => (
                                    <li key={i} className="flex gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                                            <item.icon size={18} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900 text-sm">{item.title}</p>
                                            <p className="text-xs text-gray-500 font-medium mt-0.5">{item.desc}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Testimonial */}
                        <div className="bg-blue-600 text-white p-8 rounded-3xl shadow-md">
                            <div className="flex gap-1 mb-4">
                                {[1,2,3,4,5].map(i => <Star key={i} size={14} className="fill-yellow-400 text-yellow-400" />)}
                            </div>
                            <p className="text-sm font-medium text-blue-100 italic leading-relaxed mb-6">"Found a verified Physics tutor near my home within 2 hours of signing up. The whole process was seamless and trustworthy."</p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center font-bold text-sm">MS</div>
                                <div>
                                    <p className="font-bold text-sm">Meera S.</p>
                                    <p className="text-xs text-blue-200">Class 12 Student, Bangalore</p>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </main>
            
            <p className="mt-16 text-gray-400 text-sm font-medium text-center">
                Already have an account? <Link href="/login" className="text-blue-600 hover:underline font-bold">Log In</Link>
            </p>
        </div>
    );
}

export default function StudentRegisterPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><p className="text-gray-400 font-medium animate-pulse">Setting up registration...</p></div>}>
            <StudentRegisterContent />
        </Suspense>
    );
}
