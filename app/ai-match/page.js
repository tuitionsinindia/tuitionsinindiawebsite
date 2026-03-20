"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AIMatchingFlow() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    // Form State
    const [learningGoal, setLearningGoal] = useState("");
    const [subject, setSubject] = useState("");
    const [learningStyle, setLearningStyle] = useState("");
    const [gradeLevel, setGradeLevel] = useState("");

    const [aiResults, setAiResults] = useState(null);

    const handleNext = () => setStep(s => s + 1);
    const handleBack = () => setStep(s => s - 1);

    const handleAnalyze = async () => {
        setIsAnalyzing(true);
        try {
            const res = await fetch('/api/ai-match', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ learningGoal, subject, learningStyle, gradeLevel })
            });
            const data = await res.json();

            // Artificial delay for UX "thinking" effect
            setTimeout(() => {
                setIsAnalyzing(false);
                setAiResults(data.matches || []);
                setStep(4);
            }, 2500);
        } catch (error) {
            console.error("Match error:", error);
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans relative overflow-hidden flex flex-col pt-32 pb-20 px-4 md:px-8">
            <div className="max-w-3xl mx-auto w-full relative z-10 flex flex-col flex-1 mt-10">
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 text-primary text-[10px] font-bold tracking-widest uppercase mb-6 border border-primary/10 shadow-sm">
                        <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
                        AI-Powered Matching Engine
                    </div>
                    {step < 4 ? (
                        <>
                            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900 tracking-tight">
                                Find Your <span className="text-primary">Perfect Tutor</span>
                            </h1>
                            <p className="text-lg text-slate-500 font-medium max-w-xl mx-auto">
                                Let AI analyze your learning style to find the absolute best match from our verified network.
                            </p>
                        </>
                    ) : (
                        <>
                            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900 tracking-tight">
                                Analysis <span className="text-emerald-500">Complete</span>
                            </h1>
                            <p className="text-lg text-slate-500 font-medium max-w-xl mx-auto">
                                We've found the top educator matches based on your unique academic profile.
                            </p>
                        </>
                    )}
                </div>

                {/* Main Card */}
                <div className="bg-white rounded-[3rem] p-8 md:p-16 border border-slate-100 shadow-2xl shadow-primary/5 relative overflow-hidden">

                    {/* Progress Bar */}
                    {(!isAnalyzing && step < 4) && (
                        <div className="flex gap-3 mb-12 w-full max-w-[200px] mx-auto">
                            {[1, 2, 3].map(i => (
                                <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${step >= i ? 'bg-primary' : 'bg-slate-100'}`}></div>
                            ))}
                        </div>
                    )}

                    {/* Step 1: Broad Goal */}
                    {step === 1 && !isAnalyzing && (
                        <div className="animate-fade-in-up space-y-10">
                            <div className="text-center">
                                <h2 className="text-2xl font-bold mb-3">What is your primary goal?</h2>
                                <p className="text-slate-400 font-medium">Select the option that best describes your current need.</p>
                            </div>
                            <div className="grid sm:grid-cols-2 gap-4">
                                {[
                                    { id: "exam", icon: "assignment", title: "Exam Preparation", desc: "Board exams, entrance tests" },
                                    { id: "grades", icon: "trending_up", title: "Improve Grades", desc: "Catch up or get ahead in school" },
                                    { id: "skill", icon: "psychology", title: "Learn a Skill", desc: "Coding, languages, arts" },
                                    { id: "homework", icon: "menu_book", title: "Homework Help", desc: "Daily assistance & doubt clearing" }
                                ].map(opt => (
                                    <button
                                        key={opt.id}
                                        onClick={() => { setLearningGoal(opt.title); handleNext(); }}
                                        className={`p-8 rounded-[2rem] border-2 text-left transition-all group ${learningGoal === opt.title ? 'border-primary bg-primary/5' : 'border-slate-50 bg-slate-50/30 hover:border-primary/20 hover:bg-white'}`}
                                    >
                                        <span className={`material-symbols-outlined text-4xl mb-6 flex items-center justify-center size-16 rounded-2xl transition-all ${learningGoal === opt.title ? 'bg-primary text-white' : 'bg-white text-primary/40 group-hover:bg-primary/10 group-hover:text-primary'}`}>{opt.icon}</span>
                                        <h3 className="text-lg font-bold text-slate-900 mb-1">{opt.title}</h3>
                                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{opt.desc}</p>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Step 2: Subject & Grade */}
                    {step === 2 && !isAnalyzing && (
                        <div className="animate-fade-in-up space-y-10">
                            <div className="text-center">
                                <h2 className="text-2xl font-bold mb-3">Provide more details</h2>
                                <p className="text-slate-400 font-medium">Our AI uses this to filter expertise levels.</p>
                            </div>

                            <div className="space-y-8">
                                <div>
                                    <label className="block text-[10px] font-bold text-primary uppercase tracking-widest mb-3">Specific Subject / Topic</label>
                                    <input
                                        type="text"
                                        value={subject}
                                        onChange={(e) => setSubject(e.target.value)}
                                        placeholder="e.g. Class 12 CBSE Physics"
                                        className="w-full h-16 bg-slate-50 border-none rounded-2xl px-8 focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-slate-300 font-bold text-slate-700"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold text-primary uppercase tracking-widest mb-3">Academic Level</label>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                        {['Primary', 'Middle', 'High School', 'College', 'Professional'].map(lvl => (
                                            <button
                                                key={lvl}
                                                onClick={() => setGradeLevel(lvl)}
                                                className={`py-4 px-4 rounded-xl border-2 text-xs font-bold transition-all ${gradeLevel === lvl ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'bg-white text-slate-500 border-slate-50 hover:border-primary/20'}`}
                                            >
                                                {lvl}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4 pt-10 border-t border-slate-50">
                                <button onClick={handleBack} className="px-8 py-5 rounded-2xl font-bold text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest text-xs">Back</button>
                                <button
                                    onClick={handleNext}
                                    disabled={!subject || !gradeLevel}
                                    className={`flex-1 rounded-2xl font-bold py-5 transition-all uppercase tracking-widest text-xs ${subject && gradeLevel ? 'bg-primary text-white shadow-xl shadow-primary/20 hover:opacity-90' : 'bg-slate-100 text-slate-300 cursor-not-allowed'}`}
                                >
                                    Continue
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Learning Style */}
                    {step === 3 && !isAnalyzing && (
                        <div className="animate-fade-in-up space-y-10">
                            <div className="text-center">
                                <h2 className="text-2xl font-bold mb-3">Teaching approach preference</h2>
                                <p className="text-slate-400 font-medium">How do you learn most effectively?</p>
                            </div>

                            <div className="space-y-4">
                                {[
                                    { id: "visual", title: "Visual & Interactive", desc: "Diagrams, videos, whiteboards" },
                                    { id: "practical", title: "Practical & Hands-on", desc: "Solving problems together" },
                                    { id: "theoretical", title: "Deep Theory Focus", desc: "Understanding the core foundational concepts" },
                                    { id: "pace", title: "Patient & Slow-paced", desc: "I need step-by-step repetition" }
                                ].map(style => (
                                    <label key={style.id} className={`flex items-center gap-5 p-6 rounded-[1.5rem] border-2 cursor-pointer transition-all ${learningStyle === style.title ? 'border-primary bg-primary/5' : 'border-slate-50 bg-slate-50/20 hover:border-primary/10'}`}>
                                        <div className={`size-6 rounded-full border-2 flex items-center justify-center transition-all ${learningStyle === style.title ? 'border-primary bg-primary' : 'border-slate-200'}`}>
                                            {learningStyle === style.title && <div className="size-2 bg-white rounded-full"></div>}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-slate-900 mb-1">{style.title}</h4>
                                            <p className="text-xs text-slate-400 font-medium">{style.desc}</p>
                                        </div>
                                        <input
                                            type="radio"
                                            name="style"
                                            className="hidden"
                                            checked={learningStyle === style.title}
                                            onChange={() => setLearningStyle(style.title)}
                                        />
                                    </label>
                                ))}
                            </div>

                            <div className="flex gap-4 pt-10 border-t border-slate-50">
                                <button onClick={handleBack} className="px-8 py-5 rounded-2xl font-bold text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest text-xs">Back</button>
                                <button
                                    onClick={handleAnalyze}
                                    disabled={!learningStyle}
                                    className={`flex-1 rounded-2xl font-bold py-5 flex items-center justify-center gap-3 transition-all uppercase tracking-widest text-xs ${learningStyle ? 'bg-primary text-white shadow-xl shadow-primary/20' : 'bg-slate-100 text-slate-300 cursor-not-allowed'}`}
                                >
                                    <span className="material-symbols-outlined text-lg">psychology</span>
                                    Analyze & Match
                                </button>
                            </div>
                        </div>
                    )}

                    {/* AI Analysis Loading State */}
                    {isAnalyzing && (
                        <div className="py-20 flex flex-col items-center justify-center text-center animate-fade-in-up">
                            <div className="relative size-40 mb-10">
                                <div className="absolute inset-0 border-8 border-slate-50 rounded-full"></div>
                                <div className="absolute inset-0 border-8 border-primary border-t-transparent rounded-full animate-spin"></div>
                                <div className="absolute inset-0 flex items-center justify-center text-primary">
                                    <span className="material-symbols-outlined text-5xl animate-pulse">auto_awesome</span>
                                </div>
                            </div>
                            <h2 className="text-3xl font-bold mb-3 text-slate-900">Matching with Educators</h2>
                            <p className="text-slate-400 font-medium max-w-sm">Scanning our network of experts for {subject || "your needs"}.</p>

                            <div className="mt-12 space-y-4 w-full max-w-xs mx-auto text-left">
                                {[
                                    { label: "Goal analysis complete", done: true },
                                    { label: `Filtering by ${gradeLevel} depth`, done: true },
                                    { label: "Validating pedagogical fit", done: false }
                                ].map((item, i) => (
                                    <div key={i} className={`flex items-center gap-3 text-xs font-bold uppercase tracking-widest ${item.done ? 'text-emerald-500' : 'text-slate-300 animate-pulse'}`}>
                                        <span className="material-symbols-outlined text-[18px]">{item.done ? 'check_circle' : 'hourglass_top'}</span>
                                        {item.label}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Step 4: Final Results UI */}
                    {step === 4 && !isAnalyzing && (
                        <div className="animate-fade-in-up space-y-10">
                            {aiResults && aiResults.length > 0 ? (
                                <div className="space-y-8">
                                    <div className="inline-flex items-center gap-3 bg-emerald-50 px-6 py-2 rounded-full border border-emerald-100 text-emerald-600 font-bold uppercase tracking-widest text-[10px]">
                                        <span className="material-symbols-outlined text-sm">target</span> Match Score: {Math.floor(Math.min(99, Math.max(75, (aiResults[0].matchScore / 100) * 110)))}%
                                    </div>

                                    {/* Top Match Card */}
                                    <div className="bg-white rounded-[3rem] p-10 border-4 border-primary shadow-2xl shadow-primary/10 relative group">
                                        <div className="absolute top-0 right-10 bg-primary text-white text-[10px] font-bold uppercase tracking-widest px-6 py-2 rounded-b-2xl">
                                            Recommended Match
                                        </div>

                                        <div className="flex flex-col md:flex-row gap-10 items-center md:items-start text-center md:text-left">
                                            <div className="shrink-0">
                                                <div className="size-32 rounded-[2.5rem] bg-slate-50 flex items-center justify-center text-4xl font-bold text-primary border-4 border-white shadow-xl shadow-primary/5">
                                                    {aiResults[0].tutor.name.charAt(0)}
                                                </div>
                                                <div className="mt-6 text-xl font-bold text-slate-900">₹{aiResults[0].hourlyRate}/hr</div>
                                            </div>

                                            <div className="flex-1">
                                                <div className="flex items-center justify-center md:justify-start gap-2 mb-6">
                                                    <h3 className="text-3xl font-bold text-slate-900">{aiResults[0].tutor.name}</h3>
                                                    {aiResults[0].tutor.isVerified && <span className="material-symbols-outlined text-emerald-500 fill-current">verified</span>}
                                                </div>

                                                <div className="bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100 mb-8">
                                                    <h4 className="text-[10px] font-bold text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
                                                        <span className="material-symbols-outlined text-[16px]">psychology</span>
                                                        AI Recommendation Basis
                                                    </h4>
                                                    <ul className="space-y-3">
                                                        {aiResults[0].matchReasons.map((reason, idx) => (
                                                            <li key={idx} className="flex items-start gap-3 text-sm text-slate-600 font-bold">
                                                                <span className="material-symbols-outlined text-sm text-emerald-500 mt-0.5">check</span>
                                                                {reason}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>

                                                <div className="flex flex-col sm:flex-row gap-4">
                                                    <Link href={`/tutor/${aiResults[0].userId}`} className="flex-1 bg-slate-50 text-slate-900 font-bold py-5 rounded-2xl hover:bg-slate-100 transition-all text-center uppercase tracking-widest text-xs">
                                                        View Profile
                                                    </Link>
                                                    <Link href="/post-requirement" className="flex-[2] bg-primary text-white font-bold py-5 rounded-2xl hover:opacity-90 shadow-xl shadow-primary/10 transition-all text-center uppercase tracking-widest text-xs">
                                                        Book Trial Class
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-center pt-6">
                                        <Link href={`/tutors?subject=${encodeURIComponent(subject)}`} className="text-slate-400 font-bold hover:text-primary transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-[10px]">
                                            See {aiResults.length - 1} other matches <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                        </Link>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-20 bg-slate-50/50 rounded-[3rem] border-2 border-dashed border-slate-100">
                                    <div className="size-24 bg-white rounded-[2rem] flex items-center justify-center mx-auto mb-8 text-slate-200 shadow-sm">
                                        <span className="material-symbols-outlined text-5xl">search_off</span>
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-900 mb-4">No direct matches found</h3>
                                    <p className="text-slate-400 font-medium max-w-xs mx-auto mb-10">We couldn't find a perfect pedagogical fit for this specific request. Try broader criteria.</p>
                                    <button onClick={() => setStep(2)} className="bg-white text-slate-900 font-bold px-10 py-5 rounded-2xl border-2 border-slate-100 hover:border-primary transition-all uppercase tracking-widest text-xs">
                                        Adjust Criteria
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}
