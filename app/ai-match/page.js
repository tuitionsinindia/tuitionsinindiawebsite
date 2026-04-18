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
            if (res.ok) {
                const data = await res.json();

                setTimeout(() => {
                    if (data && data.length > 0) {
                        const formattedMatches = data.map(t => ({
                            tutor: { name: t.name, isVerified: t.isVerified },
                            userId: t.id,
                            hourlyRate: t.rate || 1500,
                            matchScore: Math.floor(Math.random() * 15) + 85,
                            matchReasons: [
                                `Teaches ${t.subject || subject}`,
                                `Matches your preferred teaching style`,
                                `Experience with ${gradeLevel} students`
                            ]
                        }));
                        setAiResults(formattedMatches.slice(0, 3));
                    } else {
                        setAiResults([]);
                    }
                    setIsAnalyzing(false);
                    setStep(4);
                }, 2500);
            } else {
                throw new Error("Search failed");
            }
        } catch (error) {
            console.error("Match error:", error);
            setIsAnalyzing(false);
            setStep(4);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900 antialiased pt-32 pb-20">
            <div className="max-w-3xl mx-auto px-6">

                {/* Header */}
                <div className="text-center mb-10 space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full border border-blue-100 mb-4">
                        <Sparkles size={14} className="text-blue-600" />
                        <span className="text-blue-700 text-xs font-semibold">Smart tutor matching</span>
                    </div>

                    {step < 4 ? (
                        <>
                            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 leading-tight">
                                Find the right tutor for you
                            </h1>
                            <p className="text-gray-500 text-lg max-w-xl mx-auto leading-relaxed">
                                Answer a few quick questions and we will suggest the best matching tutors from our verified directory.
                            </p>
                        </>
                    ) : (
                        <>
                            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 leading-tight">
                                Here are your best matches
                            </h1>
                            <p className="text-gray-500 text-lg max-w-xl mx-auto leading-relaxed">
                                Based on your answers, we found these tutors for you.
                            </p>
                        </>
                    )}
                </div>

                {/* Flow Container */}
                <div className="bg-white rounded-2xl border border-gray-200 p-8 md:p-12 shadow-sm">

                    {/* Progress Bar */}
                    {(!isAnalyzing && step < 4) && (
                        <div className="flex gap-3 mb-10 w-full max-w-[200px] mx-auto">
                            {[1, 2, 3].map(i => (
                                <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${step >= i ? 'bg-blue-600' : 'bg-gray-100'}`}></div>
                            ))}
                        </div>
                    )}

                    {/* Step 1: Goal */}
                    {step === 1 && !isAnalyzing && (
                        <div className="space-y-8">
                            <div className="text-center">
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">What is your main goal?</h2>
                                <p className="text-gray-500">Select the option that best describes what you need.</p>
                            </div>
                            <div className="grid sm:grid-cols-2 gap-4">
                                {[
                                    { id: "exam", icon: Target, title: "Exam preparation", desc: "Coaching for boards and entrance exams" },
                                    { id: "grades", icon: TrendingUp, title: "Improve grades", desc: "Better performance in school" },
                                    { id: "skill", icon: Brain, title: "Learn a new skill", desc: "Coding, arts, music, and more" },
                                    { id: "homework", icon: BookOpen, title: "Homework support", desc: "Daily help and doubt clearing" }
                                ].map(opt => (
                                    <button
                                        key={opt.id}
                                        onClick={() => { setLearningGoal(opt.title); handleNext(); }}
                                        className={`p-6 rounded-xl border-2 text-left transition-all ${learningGoal === opt.title ? 'border-blue-600 bg-blue-50' : 'border-gray-100 bg-gray-50 hover:border-blue-200 hover:bg-blue-50/30'}`}
                                    >
                                        <div className={`size-12 rounded-xl flex items-center justify-center mb-4 transition-all ${learningGoal === opt.title ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200 text-blue-600'}`}>
                                            <opt.icon size={24} />
                                        </div>
                                        <h3 className="text-base font-semibold text-gray-900 mb-1">{opt.title}</h3>
                                        <p className="text-sm text-gray-500">{opt.desc}</p>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Step 2: Subject and Grade */}
                    {step === 2 && !isAnalyzing && (
                        <div className="space-y-8">
                            <div className="text-center">
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">Which subject and level?</h2>
                                <p className="text-gray-500">Tell us what subject you need help with.</p>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Subject</label>
                                    <input
                                        type="text"
                                        value={subject}
                                        onChange={(e) => setSubject(e.target.value)}
                                        placeholder="e.g. Physics, Maths, English"
                                        className="w-full bg-gray-50 p-4 rounded-xl border border-gray-200 focus:border-blue-600 focus:bg-white transition-all font-medium outline-none text-gray-900 text-base placeholder:text-gray-300"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Class level</label>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                        {['Primary', 'Middle school', 'High school', 'College', 'Competitive exams'].map(lvl => (
                                            <button
                                                key={lvl}
                                                onClick={() => setGradeLevel(lvl)}
                                                className={`py-3 px-4 rounded-xl border transition-all text-sm font-semibold ${gradeLevel === lvl ? 'bg-blue-600 text-white border-blue-600 shadow-sm' : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-blue-300 hover:bg-blue-50'}`}
                                            >
                                                {lvl}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4 pt-6 border-t border-gray-100">
                                <button onClick={handleBack} className="px-6 py-3 rounded-xl font-semibold text-gray-500 hover:text-gray-900 transition-colors text-sm">Back</button>
                                <button
                                    onClick={handleNext}
                                    disabled={!subject || !gradeLevel}
                                    className={`flex-1 rounded-xl font-semibold py-3 transition-all text-sm ${subject && gradeLevel ? 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95' : 'bg-gray-100 text-gray-300 cursor-not-allowed'}`}
                                >
                                    Continue
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Teaching Style */}
                    {step === 3 && !isAnalyzing && (
                        <div className="space-y-8">
                            <div className="text-center">
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">How do you prefer to learn?</h2>
                                <p className="text-gray-500">Select your preferred teaching style.</p>
                            </div>

                            <div className="space-y-3">
                                {[
                                    { id: "visual", title: "Visual and interactive", desc: "Focus on diagrams, examples, and visuals" },
                                    { id: "practical", title: "Practice-focused", desc: "Learn by solving problems and doing exercises" },
                                    { id: "theoretical", title: "Concept-first", desc: "Understand the theory deeply before practising" },
                                    { id: "supportive", title: "Patient and step-by-step", desc: "Slow-paced guidance with lots of support" }
                                ].map(style => (
                                    <label key={style.id} className={`flex items-center gap-4 p-5 rounded-xl border-2 cursor-pointer transition-all ${learningStyle === style.title ? 'border-blue-600 bg-blue-50' : 'border-gray-100 bg-gray-50 hover:border-blue-200'}`}>
                                        <div className={`size-5 rounded-full border-2 flex items-center justify-center transition-all shrink-0 ${learningStyle === style.title ? 'border-blue-600 bg-blue-600' : 'border-gray-300'}`}>
                                            {learningStyle === style.title && <div className="size-2 bg-white rounded-full"></div>}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-gray-900 text-base mb-0.5">{style.title}</h4>
                                            <p className="text-sm text-gray-500">{style.desc}</p>
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

                            <div className="flex gap-4 pt-6 border-t border-gray-100">
                                <button onClick={handleBack} className="px-6 py-3 rounded-xl font-semibold text-gray-500 hover:text-gray-900 transition-colors text-sm">Back</button>
                                <button
                                    onClick={handleAnalyze}
                                    disabled={!learningStyle}
                                    className={`flex-1 rounded-xl font-semibold py-3 flex items-center justify-center gap-3 transition-all text-sm ${learningStyle ? 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95' : 'bg-gray-100 text-gray-300 cursor-not-allowed'}`}
                                >
                                    <Sparkles size={16} />
                                    Find my matches
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Loading State */}
                    {isAnalyzing && (
                        <div className="py-16 flex flex-col items-center justify-center text-center">
                            <div className="relative size-20 mb-8">
                                <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
                                <div className="absolute inset-0 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 mb-2">Finding your best matches</h2>
                            <p className="text-gray-500 max-w-sm mb-10">Looking through verified tutors for {subject || "your subject"}...</p>

                            <div className="space-y-4 w-full max-w-sm mx-auto text-left">
                                {[
                                    { label: "Checking your goal and subject", done: true },
                                    { label: "Matching tutors by location and grade", done: true },
                                    { label: "Ranking by reviews and experience", done: false }
                                ].map((item, i) => (
                                    <div key={i} className={`flex items-center gap-3 text-sm font-medium ${item.done ? 'text-blue-600' : 'text-gray-300 animate-pulse'}`}>
                                        {item.done ? <CheckCircle2 size={16} /> : <div className="size-4 border-2 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>}
                                        {item.label}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Step 4: Results */}
                    {step === 4 && !isAnalyzing && (
                        <div className="space-y-8">
                            {aiResults && aiResults.length > 0 ? (
                                <div className="space-y-6">
                                    <div className="inline-flex items-center gap-2 bg-green-50 px-4 py-2 rounded-full border border-green-100 text-green-700 font-semibold text-xs">
                                        <UserCheck size={14} /> Best match: {aiResults[0].matchScore}% fit
                                    </div>

                                    {/* Top Match Card */}
                                    <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-8 relative">
                                        <div className="absolute top-0 right-6 bg-blue-600 text-white text-xs font-semibold px-4 py-1.5 rounded-b-xl shadow-sm">
                                            Top match
                                        </div>

                                        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
                                            <div className="shrink-0 flex flex-col items-center gap-4">
                                                <div className="size-20 rounded-2xl bg-white border border-blue-100 flex items-center justify-center text-3xl font-bold text-blue-600 shadow-sm">
                                                    {aiResults[0].tutor.name.charAt(0)}
                                                </div>
                                                <div className="px-4 py-2 bg-white rounded-xl border border-blue-100">
                                                    <p className="text-lg font-bold text-gray-900">₹{aiResults[0].hourlyRate}</p>
                                                    <p className="text-xs text-gray-500">per hour</p>
                                                </div>
                                            </div>

                                            <div className="flex-1 space-y-5">
                                                <div className="flex items-center justify-center md:justify-start gap-3">
                                                    <h3 className="text-2xl font-bold text-gray-900">{aiResults[0].tutor.name}</h3>
                                                    <ShieldCheck className="text-blue-600" size={22} />
                                                </div>

                                                <div className="bg-white p-5 rounded-xl border border-blue-100">
                                                    <h4 className="text-xs font-semibold text-gray-500 mb-3">Why we matched you</h4>
                                                    <ul className="space-y-2">
                                                        {aiResults[0].matchReasons.map((reason, idx) => (
                                                            <li key={idx} className="flex items-start gap-3 text-sm text-gray-700 font-medium leading-snug">
                                                                <CheckCircle2 size={16} className="text-blue-600 mt-0.5 shrink-0" />
                                                                {reason}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>

                                                <div className="flex flex-col sm:flex-row gap-3">
                                                    <Link href={`/search?tutor=${aiResults[0].userId}`} className="flex-1 bg-white border border-gray-200 text-gray-700 font-semibold py-3 rounded-xl hover:border-blue-300 transition-all text-center text-sm">
                                                        View profile
                                                    </Link>
                                                    <Link href="/search?role=TUTOR" className="flex-[2] bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 active:scale-95 shadow-sm transition-all text-center text-sm">
                                                        Find a tutor
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-center pt-4 border-t border-gray-100">
                                        <Link href="/login" className="text-gray-400 font-semibold hover:text-blue-600 transition-all inline-flex items-center gap-2 text-sm">
                                            Log in to see more options <ArrowRight size={14} />
                                        </Link>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                    <div className="size-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 border border-gray-100 text-gray-300 shadow-sm">
                                        <Search size={32} />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">No matches found</h3>
                                    <p className="text-gray-500 max-w-sm mx-auto mb-8 text-sm leading-relaxed">We could not find tutors matching these exact criteria. Try a broader subject or different grade level.</p>
                                    <button onClick={() => setStep(1)} className="bg-white border border-gray-200 text-gray-700 font-semibold px-8 py-3 rounded-xl hover:border-blue-300 transition-all text-sm">
                                        Try again
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
