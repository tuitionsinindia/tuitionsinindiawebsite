"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
        <div className="min-h-screen bg-slate-50 dark:bg-background-dark font-sans relative overflow-hidden flex flex-col pt-24 pb-20 px-4 md:px-8">
            {/* Background Effects */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[100px] pointer-events-none translate-y-1/3 -translate-x-1/3"></div>

            <div className="max-w-3xl mx-auto w-full relative z-10 flex flex-col flex-1 mt-10">
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-bold tracking-wider mb-6 border border-primary/20 shadow-sm animate-pulse-slow">
                        <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
                        AI-Powered Matching Engine
                    </div>
                    {step < 4 ? (
                        <>
                            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4 text-slate-900 dark:text-white tracking-tight">
                                Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Perfect Tutor</span>
                            </h1>
                            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
                                Tell our AI about your learning goals and style, and we'll math you with the exact right educator for your needs.
                            </p>
                        </>
                    ) : (
                        <>
                            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4 text-slate-900 dark:text-white tracking-tight">
                                Analysis <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-400">Complete</span>
                            </h1>
                            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
                                We scanned verified tutors and found the absolute best matches based on your unique profile.
                            </p>
                        </>
                    )}
                </div>

                {/* Main Card */}
                <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-12 border border-white/50 dark:border-slate-800 shadow-2xl shadow-primary/5 relative overflow-hidden">

                    {/* Progress Bar */}
                    {(!isAnalyzing && step < 4) && (
                        <div className="flex gap-2 mb-10 w-full">
                            {[1, 2, 3].map(i => (
                                <div key={i} className={`h-2 flex-1 rounded-full transition-colors duration-500 ${step >= i ? 'bg-primary shadow-sm shadow-primary/50' : 'bg-slate-200 dark:bg-slate-800'}`}></div>
                            ))}
                        </div>
                    )}

                    {/* Step 1: Broad Goal */}
                    {step === 1 && !isAnalyzing && (
                        <div className="animate-fade-in-up space-y-8">
                            <div>
                                <h2 className="text-2xl font-heading font-bold mb-2">What is your primary learning goal?</h2>
                                <p className="text-slate-500">Select the option that best describes why you need a tutor right now.</p>
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
                                        className={`p-6 rounded-2xl border-2 text-left transition-all ${learningGoal === opt.title ? 'border-primary bg-primary/5 scale-[1.02]' : 'border-slate-200 dark:border-slate-800 hover:border-primary/50 bg-white dark:bg-slate-800'}`}
                                    >
                                        <span className={`material-symbols-outlined text-4xl mb-4 ${learningGoal === opt.title ? 'text-primary' : 'text-slate-400'}`}>{opt.icon}</span>
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{opt.title}</h3>
                                        <p className="text-sm text-slate-500">{opt.desc}</p>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Step 2: Subject & Grade */}
                    {step === 2 && !isAnalyzing && (
                        <div className="animate-fade-in-up space-y-8">
                            <div>
                                <h2 className="text-2xl font-heading font-bold mb-2">What do you want to learn?</h2>
                                <p className="text-slate-500">Provide specific details so our AI can narrow down the expertise needed.</p>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Specific Subject / Topic</label>
                                    <input
                                        type="text"
                                        value={subject}
                                        onChange={(e) => setSubject(e.target.value)}
                                        placeholder="e.g. Class 12 CBSE Physics, Python for Beginners"
                                        className="w-full h-14 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-6 focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-slate-400 font-medium"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Current Academic Level</label>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        {['Primary', 'Middle', 'High School', 'College', 'Professional'].map(lvl => (
                                            <button
                                                key={lvl}
                                                onClick={() => setGradeLevel(lvl)}
                                                className={`py-3 px-4 rounded-xl border text-sm font-bold transition-colors ${gradeLevel === lvl ? 'bg-primary text-white border-primary' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-primary/50'}`}
                                            >
                                                {lvl}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                                <button onClick={handleBack} className="px-6 py-4 rounded-xl font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">Back</button>
                                <button
                                    onClick={handleNext}
                                    disabled={!subject || !gradeLevel}
                                    className={`flex-1 rounded-xl font-bold py-4 transition-all ${subject && gradeLevel ? 'bg-primary text-white hover:bg-primary-glow shadow-lg shadow-primary/30' : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'}`}
                                >
                                    Continue
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Learning Style */}
                    {step === 3 && !isAnalyzing && (
                        <div className="animate-fade-in-up space-y-8">
                            <div>
                                <h2 className="text-2xl font-heading font-bold mb-2">How do you learn best?</h2>
                                <p className="text-slate-500">This helps the AI match you with a tutor whose teaching style aligns with your learning style.</p>
                            </div>

                            <div className="space-y-4">
                                {[
                                    { id: "visual", title: "Visual & Interactive", desc: "Diagrams, videos, whiteboards, and interactive tools" },
                                    { id: "practical", title: "Practical & Hands-on", desc: "Solving problems together, real-world examples" },
                                    { id: "theoretical", title: "Deep Theoretical Focus", desc: "Understanding the core 'why' and foundational concepts" },
                                    { id: "pace", title: "Patient & Slow-paced", desc: "I need someone who will repeat concepts patiently" }
                                ].map(style => (
                                    <label key={style.id} className={`flex items-start gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all ${learningStyle === style.title ? 'border-primary bg-primary/5' : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 hover:border-primary/30'}`}>
                                        <div className={`mt-1 size-6 rounded-full border-2 flex items-center justify-center ${learningStyle === style.title ? 'border-primary' : 'border-slate-300 dark:border-slate-600'}`}>
                                            {learningStyle === style.title && <div className="size-3 bg-primary rounded-full"></div>}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 dark:text-white mb-1">{style.title}</h4>
                                            <p className="text-sm text-slate-500">{style.desc}</p>
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

                            <div className="flex gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                                <button onClick={handleBack} className="px-6 py-4 rounded-xl font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">Back</button>
                                <button
                                    onClick={handleAnalyze}
                                    disabled={!learningStyle}
                                    className={`flex-1 rounded-xl font-bold py-4 flex items-center justify-center gap-2 transition-all ${learningStyle ? 'bg-gradient-to-r from-primary to-accent text-white hover:shadow-lg hover:shadow-primary/30' : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'}`}
                                >
                                    <span className="material-symbols-outlined">psychology</span>
                                    Analyze & Match
                                </button>
                            </div>
                        </div>
                    )}

                    {/* AI Analysis Loading State */}
                    {isAnalyzing && (
                        <div className="py-12 flex flex-col items-center justify-center text-center animate-fade-in-up">
                            <div className="relative size-32 mb-8">
                                <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
                                <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                                <div className="absolute inset-0 flex items-center justify-center text-primary">
                                    <span className="material-symbols-outlined text-4xl animate-pulse">auto_awesome</span>
                                </div>
                            </div>
                            <h2 className="text-2xl font-heading font-bold mb-2">Analyzing your profile...</h2>
                            <p className="text-slate-500 max-w-sm">Our AI is scanning thousands of tutor profiles to find the perfect match for {subject || "your needs"}.</p>

                            <div className="mt-8 space-y-3 w-full max-w-sm mx-auto text-left">
                                <div className="flex items-center gap-3 text-sm font-semibold text-slate-600 dark:text-slate-300">
                                    <span className="material-symbols-outlined text-emerald-500 text-[18px]">check_circle</span>
                                    Goal analysis complete
                                </div>
                                <div className="flex items-center gap-3 text-sm font-semibold text-slate-600 dark:text-slate-300 relative overflow-hidden">
                                    <span className="material-symbols-outlined text-emerald-500 text-[18px]">check_circle</span>
                                    Filtering by {gradeLevel} level
                                </div>
                                <div className="flex items-center gap-3 text-sm font-semibold text-slate-400 animate-pulse">
                                    <span className="material-symbols-outlined text-slate-300 text-[18px]">psychology</span>
                                    Matching pedagogical styles...
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Final Results UI */}
                    {step === 4 && !isAnalyzing && (
                        <div className="animate-fade-in-up space-y-8">
                            {aiResults && aiResults.length > 0 ? (
                                <div className="space-y-6">
                                    <div className="bg-emerald-50 dark:bg-emerald-900/10 p-4 border border-emerald-100 dark:border-emerald-800/30 rounded-2xl flex items-center justify-between shadow-inner">
                                        <div className="flex items-center gap-3 text-emerald-800 dark:text-emerald-400 font-bold">
                                            <span className="material-symbols-outlined">target</span> Match Score: <span className="text-xl">{Math.floor(Math.min(99, Math.max(75, (aiResults[0].matchScore / 100) * 110)))}%</span>
                                        </div>
                                    </div>

                                    {/* Top Match Card */}
                                    <div className="bg-gradient-to-tr from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 rounded-3xl p-6 md:p-8 border-[3px] border-primary shadow-2xl shadow-primary/20 relative overflow-hidden group">
                                        <div className="absolute -top-4 -right-4 size-32 bg-primary/10 blur-2xl rounded-full"></div>
                                        <div className="absolute top-0 right-0 bg-primary text-white text-[10px] font-bold uppercase tracking-widest px-4 py-1 rounded-bl-2xl shadow-sm">
                                            #1 Recommended
                                        </div>

                                        <div className="flex flex-col md:flex-row gap-6 relative z-10 pt-2">
                                            <div className="flex-shrink-0 text-center mx-auto md:mx-0">
                                                <div className="size-24 rounded-[2rem] bg-gradient-to-tr from-primary to-accent p-[2px] shadow-lg shadow-primary/30 mx-auto mb-3">
                                                    <div className="w-full h-full rounded-[1.9rem] bg-white dark:bg-slate-900 flex items-center justify-center text-3xl font-heading font-bold text-slate-900 dark:text-white border-2 border-white dark:border-slate-800">
                                                        {aiResults[0].tutor.name.charAt(0)}
                                                    </div>
                                                </div>
                                                <div className="bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 text-sm font-bold shadow-inner inline-block text-primary">
                                                    ₹{aiResults[0].hourlyRate}/hr
                                                </div>
                                            </div>

                                            <div className="flex-1 w-full">
                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                                                    <div className="flex items-center gap-2">
                                                        <h3 className="text-2xl font-bold font-heading text-slate-900 dark:text-white">{aiResults[0].tutor.name}</h3>
                                                        {aiResults[0].tutor.isVerified && <span className="material-symbols-outlined text-emerald-500 fill-current" title="Verified">verified</span>}
                                                    </div>
                                                </div>

                                                <div className="bg-primary/5 dark:bg-primary/10 p-5 rounded-2xl border border-primary/10 mb-5">
                                                    <h4 className="text-xs font-bold text-primary uppercase tracking-widest mb-3 flex items-center gap-2">
                                                        <span className="material-symbols-outlined text-[16px]">psychology</span>
                                                        Why we chose them for you:
                                                    </h4>
                                                    <ul className="space-y-2">
                                                        {aiResults[0].matchReasons.map((reason, idx) => (
                                                            <li key={idx} className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300 font-semibold">
                                                                <span className="material-symbols-outlined text-[16px] text-emerald-500 mt-0.5 font-bold">done</span>
                                                                {reason}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>

                                                <div className="flex flex-col sm:flex-row gap-3">
                                                    <Link href={`/tutor/${aiResults[0].userId}`} className="flex-1 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold py-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-primary transition-all text-center flex items-center justify-center gap-2">
                                                        <span className="material-symbols-outlined text-[20px]">person</span> Full Profile
                                                    </Link>
                                                    <Link href="/post-requirement" className="flex-[2] bg-primary text-white font-bold py-4 rounded-xl hover:bg-primary-glow shadow-xl shadow-primary/30 transition-all text-center flex items-center justify-center gap-2">
                                                        <span className="material-symbols-outlined text-[20px]">how_to_reg</span> Book Trial Class
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-center pt-4">
                                        <Link href={`/tutors?subject=${encodeURIComponent(subject)}`} className="text-slate-500 font-bold hover:text-primary transition-colors flex items-center justify-center gap-2">
                                            Or view all {aiResults.length - 1} other matches <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                                        </Link>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-12 px-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700">
                                    <div className="size-20 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-400 shadow-sm border border-slate-100 dark:border-slate-700">
                                        <span className="material-symbols-outlined text-4xl">search_off</span>
                                    </div>
                                    <h3 className="text-2xl font-heading font-bold mb-3">No perfect matches found</h3>
                                    <p className="text-slate-500 max-w-sm mx-auto mb-8 leading-relaxed">We couldn't find verified tutors matching your exact highly-specific criteria right now. Try broadening your subject or grade level.</p>
                                    <button onClick={() => setStep(2)} className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold px-8 py-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-primary transition-all shadow-sm">
                                        Adjust Initial Criteria
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
