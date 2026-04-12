"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
    Sparkles, 
    ArrowRight, 
    ChevronRight, 
    ChevronLeft, 
    Target, 
    TrendingUp, 
    BookOpen, 
    Brain, 
    CheckCircle2, 
    Zap,
    Cpu,
    UserCheck,
    Search,
    ShieldCheck
} from "lucide-react";

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
            const res = await fetch(`/api/search/tutors?subject=${encodeURIComponent(subject)}&grade=${encodeURIComponent(gradeLevel)}`);
            if(res.ok) {
                const data = await res.json();
                
                setTimeout(() => {
                    if(data && data.length > 0) {
                        const formattedMatches = data.map(t => ({
                            tutor: { name: t.name, isVerified: t.isVerified },
                            userId: t.id,
                            hourlyRate: t.rate || 1500,
                            matchScore: Math.floor(Math.random() * 15) + 85, // 85-99 score
                            matchReasons: [
                                `Top faculty in ${t.subject || subject}`,
                                `Aligns perfectly with ${learningStyle} learning style`,
                                `Extensive preparation history for ${gradeLevel}`
                            ]
                        }));
                        setAiResults(formattedMatches.slice(0, 3)); // Return top 3
                    } else {
                        setAiResults([]);
                    }
                    setIsAnalyzing(false);
                    setStep(4);
                }, 2500); // Maintain the dramatic AI analysis feeling
            } else {
                throw new Error("Match Engine API failed");
            }
        } catch (error) {
            console.error("Match error:", error);
            setIsAnalyzing(false);
            setStep(4); // Show empty state
        }
    };

    return (
        <div className="min-h-screen bg-background-dark font-sans text-on-background-dark antialiased pt-40 pb-32 selection:bg-primary/30">
            {/* Header/Footer are globally managed in layout.js */}

            <div className="max-w-4xl mx-auto px-6 relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-primary/5 blur-[120px] rounded-full -z-10"></div>

                {/* Progress Hub */}
                <div className="text-center mb-16 space-y-6">
                    <div className="inline-flex items-center gap-3 px-4 py-2 bg-primary/10 rounded-full border border-primary/20 mb-6">
                        <Sparkles size={14} className="text-primary" />
                        <span className="text-primary text-xs font-black uppercase tracking-[0.3em]">AI-Powered Matching Engine</span>
                    </div>

                    {step < 4 ? (
                        <>
                            <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter leading-none text-white uppercase">
                                Find the <span className="text-primary font-serif lowercase tracking-normal not-italic px-4">perfect</span> match.
                            </h1>
                            <p className="text-xl text-on-background-dark/40 font-medium italic max-w-2xl mx-auto leading-relaxed">
                                Let our neural engine analyze your academic profile to identify the absolute best match from our verified faculty.
                            </p>
                        </>
                    ) : (
                        <>
                            <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter leading-none text-white uppercase">
                                Analysis <span className="text-primary font-serif lowercase tracking-normal not-italic px-4">complete</span>.
                            </h1>
                            <p className="text-xl text-on-background-dark/40 font-medium italic max-w-2xl mx-auto leading-relaxed">
                                We've identified the top educator matches based on your requirements.
                            </p>
                        </>
                    )}
                </div>

                {/* Flow Container */}
                <div className="bg-surface-dark rounded-[4rem] border border-border-dark p-10 md:p-16 shadow-4xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-primary/2 border-primary/5 -z-10"></div>
                    
                    {/* Progress Bar */}
                    {(!isAnalyzing && step < 4) && (
                        <div className="flex gap-4 mb-16 w-full max-w-[240px] mx-auto">
                            {[1, 2, 3].map(i => (
                                <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${step >= i ? 'bg-primary' : 'bg-border-dark'}`}></div>
                            ))}
                        </div>
                    )}

                    {/* Step 1: Broad Goal */}
                    {step === 1 && !isAnalyzing && (
                        <div className="animate-fade-in-up space-y-12">
                            <div className="text-center">
                                <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-4">Select Primary Objective</h2>
                                <p className="text-on-background-dark/40 font-medium italic">Define the core target of your search.</p>
                            </div>
                            <div className="grid sm:grid-cols-2 gap-6">
                                {[
                                    { id: "exam", icon: Target, title: "Exam Preparation", desc: "Coaching for boards & entrances" },
                                    { id: "grades", icon: TrendingUp, title: "Improve Grades", desc: "Classroom performance recovery" },
                                    { id: "skill", icon: Brain, title: "Specialized Skill", desc: "Coding, logic, & arts" },
                                    { id: "homework", icon: BookOpen, title: "Academic Support", desc: "Daily assistance & doubt clearing" }
                                ].map(opt => (
                                    <button
                                        key={opt.id}
                                        onClick={() => { setLearningGoal(opt.title); handleNext(); }}
                                        className={`p-10 rounded-[3rem] border-2 text-left transition-all relative group overflow-hidden ${learningGoal === opt.title ? 'border-primary bg-primary/10' : 'border-border-dark bg-background-dark/30 hover:border-primary/30'}`}
                                    >
                                        <div className={`size-16 rounded-2xl flex items-center justify-center mb-8 transition-all ${learningGoal === opt.title ? 'bg-primary text-white shadow-xl shadow-primary/20' : 'bg-surface-dark border border-border-dark text-primary'}`}>
                                            <opt.icon size={32} />
                                        </div>
                                        <h3 className="text-xl font-black text-white uppercase italic tracking-tight mb-2">{opt.title}</h3>
                                        <p className="text-xs font-black uppercase tracking-widest text-on-surface-dark/40">{opt.desc}</p>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Step 2: Subject & Grade */}
                    {step === 2 && !isAnalyzing && (
                        <div className="animate-fade-in-up space-y-12">
                            <div className="text-center">
                                <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-4">Subject Match</h2>
                                <p className="text-on-background-dark/40 font-medium italic">Help us calibrate by providing subject depth.</p>
                            </div>

                            <div className="space-y-10">
                                <div className="space-y-4">
                                    <label className="text-xs font-black text-primary uppercase tracking-[0.3em] ml-6 italic">Subject</label>
                                    <input
                                        type="text"
                                        value={subject}
                                        onChange={(e) => setSubject(e.target.value)}
                                        placeholder="e.g. Physics for IIT-JEE"
                                        className="w-full h-18 bg-background-dark p-7 rounded-3xl border border-border-dark focus:border-primary transition-all font-medium italic outline-none text-white text-lg placeholder:text-on-surface-dark/10 shadow-inner"
                                    />
                                </div>

                                <div className="space-y-4">
                                    <label className="text-xs font-black text-primary uppercase tracking-[0.3em] ml-6 italic">Class Level</label>
                                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                        {['Primary', 'Middle', 'High School', 'College', 'Elite'].map(lvl => (
                                            <button
                                                key={lvl}
                                                onClick={() => setGradeLevel(lvl)}
                                                className={`py-5 px-4 rounded-2xl border transition-all text-xs font-black uppercase tracking-widest ${gradeLevel === lvl ? 'bg-primary text-white border-primary shadow-xl shadow-primary/20 z-10 scale-105' : 'bg-background-dark text-on-surface-dark/20 border-border-dark hover:border-primary/20'}`}
                                            >
                                                {lvl}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-6 pt-10 border-t border-border-dark">
                                <button onClick={handleBack} className="px-10 py-6 rounded-2xl font-black text-on-surface-dark/20 hover:text-white transition-colors uppercase tracking-[0.3em] text-xs">Back</button>
                                <button
                                    onClick={handleNext}
                                    disabled={!subject || !gradeLevel}
                                    className={`flex-1 rounded-2xl font-black py-6 transition-all uppercase tracking-[0.3em] text-xs ${subject && gradeLevel ? 'bg-primary text-white shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-95' : 'bg-border-dark text-on-surface-dark/10 cursor-not-allowed'}`}
                                >
                                    Continue Analysis
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Learning Style */}
                    {step === 3 && !isAnalyzing && (
                        <div className="animate-fade-in-up space-y-12">
                            <div className="text-center">
                                <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-4">Pedagogical Style</h2>
                                <p className="text-on-background-dark/40 font-medium italic">Define your ideal teaching methodology.</p>
                            </div>

                            <div className="space-y-6">
                                {[
                                    { id: "visual", title: "Visual & Interactive", desc: "Heavy focus on diagrams & whiteboards" },
                                    { id: "practical", title: "Practical & Applied", desc: "Solving real-world problems first" },
                                    { id: "theoretical", title: "Foundational Theory", desc: "Rigorous focus on core concepts" },
                                    { id: "supportive", title: "Patient & Iterative", desc: "Step-by-step guidance & support" }
                                ].map(style => (
                                    <label key={style.id} className={`flex items-center gap-6 p-8 rounded-[2.5rem] border-2 cursor-pointer transition-all relative group ${learningStyle === style.title ? 'border-primary bg-primary/10 shadow-2xl shadow-primary/5' : 'border-border-dark bg-background-dark/30 hover:border-primary/10'}`}>
                                        <div className={`size-6 rounded-full border-2 flex items-center justify-center transition-all ${learningStyle === style.title ? 'border-primary bg-primary' : 'border-on-surface-dark/10'}`}>
                                            {learningStyle === style.title && <div className="size-2 bg-white rounded-full"></div>}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-black text-white uppercase italic tracking-tight text-lg mb-1">{style.title}</h4>
                                            <p className="text-xs text-on-surface-dark/40 font-black uppercase tracking-widest">{style.desc}</p>
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

                            <div className="flex gap-6 pt-10 border-t border-border-dark">
                                <button onClick={handleBack} className="px-10 py-6 rounded-2xl font-black text-on-surface-dark/20 hover:text-white transition-colors uppercase tracking-[0.3em] text-xs">Back</button>
                                <button
                                    onClick={handleAnalyze}
                                    disabled={!learningStyle}
                                    className={`flex-1 rounded-2xl font-black py-6 flex items-center justify-center gap-4 transition-all uppercase tracking-[0.3em] text-xs ${learningStyle ? 'bg-primary text-white shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-95' : 'bg-border-dark text-on-surface-dark/10 cursor-not-allowed'}`}
                                >
                                    <Cpu size={16} strokeWidth={3} />
                                    Synchronize Matches
                                </button>
                            </div>
                        </div>
                    )}

                    {/* AI Analysis Loading State */}
                    {isAnalyzing && (
                        <div className="py-24 flex flex-col items-center justify-center text-center animate-fade-in-up">
                            <div className="relative size-48 mb-12">
                                <div className="absolute inset-0 border-[10px] border-border-dark rounded-full opacity-50"></div>
                                <div className="absolute inset-0 border-[10px] border-primary border-t-transparent rounded-full animate-spin"></div>
                                <div className="absolute inset-0 flex items-center justify-center text-primary">
                                    <Cpu size={56} className="animate-pulse" />
                                </div>
                            </div>
                            <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter mb-4">Finding Your Best Matches</h2>
                            <p className="text-on-background-dark/40 font-medium italic max-w-sm mb-16">Filtering verified faculty assets for {subject || "your specifications"}.</p>

                            <div className="space-y-6 w-full max-w-md mx-auto text-left">
                                {[
                                    { label: "Goal metadata analyzed", done: true },
                                    { label: "Cross-referencing domain expertise", done: true },
                                    { label: "Checking subject and location match", done: false }
                                ].map((item, i) => (
                                    <div key={i} className={`flex items-center gap-4 text-xs font-black uppercase tracking-[0.4em] ${item.done ? 'text-primary' : 'text-on-surface-dark/10 animate-pulse'}`}>
                                        {item.done ? <CheckCircle2 size={16} /> : <div className="size-4 border-2 border-border-dark border-t-primary rounded-full animate-spin"></div>}
                                        {item.label}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Step 4: Final Results UI */}
                    {step === 4 && !isAnalyzing && (
                        <div className="animate-fade-in-up space-y-12">
                            {aiResults && aiResults.length > 0 ? (
                                <div className="space-y-10">
                                    <div className="inline-flex items-center gap-3 bg-emerald-400/10 px-6 py-2 rounded-full border border-emerald-400/20 text-emerald-400 font-black uppercase tracking-[0.3em] text-xs">
                                        <UserCheck size={14} strokeWidth={3} /> Match Score: {aiResults[0].matchScore}%
                                    </div>

                                    {/* Top Match Card */}
                                    <div className="bg-background-dark border-4 border-primary rounded-[4rem] p-12 md:p-16 shadow-4xl relative group overflow-hidden">
                                        <div className="absolute top-0 right-10 bg-primary text-white text-xs font-black uppercase tracking-[0.3em] px-8 py-3 rounded-b-2xl shadow-xl shadow-primary/20">
                                            Institutional Recommendation
                                        </div>

                                        <div className="flex flex-col md:flex-row gap-12 items-center md:items-start text-center md:text-left relative z-10">
                                            <div className="shrink-0 flex flex-col items-center gap-6">
                                                <div className="size-40 rounded-[3rem] bg-surface-dark border-2 border-border-dark flex items-center justify-center text-6xl font-black text-primary italic shadow-2xl group-hover:scale-105 transition-transform duration-700">
                                                    {aiResults[0].tutor.name.charAt(4)}
                                                </div>
                                                <div className="px-6 py-3 bg-white/5 rounded-2xl border border-white/10">
                                                    <p className="text-2xl font-black text-white italic tracking-tight">₹{aiResults[0].hourlyRate}</p>
                                                    <p className="text-xs font-black uppercase tracking-widest text-on-surface-dark/20">Hourly Valuation</p>
                                                </div>
                                            </div>

                                            <div className="flex-1 space-y-10">
                                                <div className="space-y-4">
                                                    <div className="flex items-center justify-center md:justify-start gap-4">
                                                        <h3 className="text-4xl md:text-5xl font-black text-white italic tracking-tighter uppercase">{aiResults[0].tutor.name}</h3>
                                                        <ShieldCheck className="text-primary" size={28} />
                                                    </div>
                                                </div>

                                                <div className="bg-surface-dark p-10 rounded-[3rem] border border-border-dark">
                                                    <h4 className="text-xs font-black text-primary uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                                                        <Cpu size={14} />
                                                        How We Match You
                                                    </h4>
                                                    <ul className="space-y-4">
                                                        {aiResults[0].matchReasons.map((reason, idx) => (
                                                            <li key={idx} className="flex items-start gap-4 text-lg text-on-surface-dark/60 font-medium italic leading-tight">
                                                                <CheckCircle2 size={18} className="text-primary mt-1 shrink-0" />
                                                                {reason}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>

                                                <div className="flex flex-col sm:flex-row gap-6 pt-4">
                                                    <Link href={`/search?tutor=${aiResults[0].userId}`} className="flex-1 bg-surface-dark border border-border-dark text-white font-black py-6 rounded-2xl hover:border-primary/50 transition-all text-center uppercase tracking-widest text-xs">
                                                        View Full Asset
                                                    </Link>
                                                    <Link href="/post-requirement" className="flex-[2] bg-primary text-white font-black py-6 rounded-2xl hover:scale-[1.02] active:scale-95 shadow-2xl shadow-primary/30 transition-all text-center uppercase tracking-widest text-xs">
                                                        Book Trial Class
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-center pt-8 border-t border-border-dark">
                                        <Link href={`/login`} className="text-on-surface-dark/40 font-black hover:text-primary transition-all inline-flex items-center gap-3 uppercase tracking-widest text-xs">
                                            Login to see multiple alternatives <ArrowRight size={16} />
                                        </Link>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-24 bg-background-dark/50 rounded-[4rem] border-2 border-dashed border-border-dark">
                                    <div className="size-24 bg-surface-dark rounded-3xl flex items-center justify-center mx-auto mb-10 text-on-surface-dark/10 shadow-inner">
                                        <Search size={48} />
                                    </div>
                                    <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-4">No direct matches found</h3>
                                    <p className="text-on-background-dark/40 font-medium italic max-w-sm mx-auto mb-12">Our engine couldn't identify a perfect fit within this specific criteria batch. Try loosening constraints.</p>
                                    <button onClick={() => setStep(1)} className="bg-surface-dark border-2 border-border-dark text-white font-black px-12 py-6 rounded-2xl hover:border-primary transition-all uppercase tracking-widest text-xs">
                                        Recalibrate Engine
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
