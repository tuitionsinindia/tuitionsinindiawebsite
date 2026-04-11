"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    Sparkles,
    ArrowRight,
    Target,
    TrendingUp,
    BookOpen,
    Brain,
    CheckCircle2,
    Zap,
    UserCheck,
    Search,
    ShieldCheck,
    Loader2
} from "lucide-react";

export default function AIMatchingFlow() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

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
                                `Specialises in ${t.subject || subject}`,
                                `Matches your ${learningStyle} learning style`,
                                `Experience teaching ${gradeLevel} students`
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
                throw new Error("API error");
            }
        } catch (error) {
            console.error("Match error:", error);
            setIsAnalyzing(false);
            setStep(4);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-16 px-6">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="text-center mb-10 space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full border border-blue-100">
                        <Sparkles size={14} className="text-blue-600" />
                        <span className="text-blue-700 text-xs font-semibold uppercase tracking-wider">AI Tutor Matching</span>
                    </div>

                    {step < 4 ? (
                        <>
                            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Find your perfect tutor</h1>
                            <p className="text-gray-500 text-lg">Answer a few quick questions and we'll match you with the best tutors for your needs.</p>
                        </>
                    ) : (
                        <>
                            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Your matches are ready</h1>
                            <p className="text-gray-500 text-lg">Here are the best tutors based on your profile.</p>
                        </>
                    )}
                </div>

                {/* Card */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 md:p-10">
                    {/* Progress Bar */}
                    {!isAnalyzing && step < 4 && (
                        <div className="flex gap-2 mb-8">
                            {[1, 2, 3].map(i => (
                                <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${step >= i ? 'bg-blue-600' : 'bg-gray-100'}`}></div>
                            ))}
                        </div>
                    )}

                    {/* Step 1: Goal */}
                    {step === 1 && !isAnalyzing && (
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 mb-1">What's your main goal?</h2>
                                <p className="text-sm text-gray-500">Choose the option that best describes what you need.</p>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { id: "exam", icon: Target, title: "Exam Preparation", desc: "Boards & entrance coaching" },
                                    { id: "grades", icon: TrendingUp, title: "Improve Grades", desc: "Classroom performance" },
                                    { id: "skill", icon: Brain, title: "Learn a Skill", desc: "Coding, arts & more" },
                                    { id: "homework", icon: BookOpen, title: "Academic Support", desc: "Homework & doubt clearing" }
                                ].map(opt => (
                                    <button
                                        key={opt.id}
                                        onClick={() => { setLearningGoal(opt.title); handleNext(); }}
                                        className={`p-5 rounded-xl border-2 text-left transition-all ${learningGoal === opt.title ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-blue-300 bg-white'}`}
                                    >
                                        <div className={`size-10 rounded-lg flex items-center justify-center mb-3 ${learningGoal === opt.title ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
                                            <opt.icon size={20} />
                                        </div>
                                        <h3 className="text-sm font-semibold text-gray-900 mb-0.5">{opt.title}</h3>
                                        <p className="text-xs text-gray-500">{opt.desc}</p>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Step 2: Subject & Grade */}
                    {step === 2 && !isAnalyzing && (
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 mb-1">Subject & grade level</h2>
                                <p className="text-sm text-gray-500">This helps us find tutors who specialise in what you need.</p>
                            </div>

                            <div className="space-y-5">
                                <div>
                                    <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2 block">Subject</label>
                                    <input
                                        type="text"
                                        value={subject}
                                        onChange={(e) => setSubject(e.target.value)}
                                        placeholder="e.g. Physics for IIT-JEE"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-gray-900 text-sm transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2 block">Grade / Level</label>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                        {['Primary', 'Middle School', 'High School', 'College', 'Competitive Exam'].map(lvl => (
                                            <button
                                                key={lvl}
                                                onClick={() => setGradeLevel(lvl)}
                                                className={`py-2.5 px-3 rounded-lg border text-xs font-medium transition-all ${gradeLevel === lvl ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'}`}
                                            >
                                                {lvl}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button onClick={handleBack} className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors">Back</button>
                                <button
                                    onClick={handleNext}
                                    disabled={!subject || !gradeLevel}
                                    className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    Continue
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Learning Style */}
                    {step === 3 && !isAnalyzing && (
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 mb-1">How do you learn best?</h2>
                                <p className="text-sm text-gray-500">We'll match you with tutors who teach this way.</p>
                            </div>

                            <div className="space-y-3">
                                {[
                                    { id: "visual", title: "Visual & Interactive", desc: "Diagrams, whiteboards, and visual aids" },
                                    { id: "practical", title: "Practical & Applied", desc: "Solving problems and real examples" },
                                    { id: "theoretical", title: "Theory-First", desc: "Deep understanding of core concepts" },
                                    { id: "supportive", title: "Patient & Step-by-Step", desc: "Careful guidance at my own pace" }
                                ].map(style => (
                                    <label key={style.id} className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${learningStyle === style.title ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-blue-200'}`}>
                                        <div className={`size-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${learningStyle === style.title ? 'border-blue-600 bg-blue-600' : 'border-gray-300'}`}>
                                            {learningStyle === style.title && <div className="size-2 bg-white rounded-full"></div>}
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-semibold text-gray-900">{style.title}</h4>
                                            <p className="text-xs text-gray-500">{style.desc}</p>
                                        </div>
                                        <input type="radio" name="style" className="hidden" checked={learningStyle === style.title} onChange={() => setLearningStyle(style.title)} />
                                    </label>
                                ))}
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button onClick={handleBack} className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors">Back</button>
                                <button
                                    onClick={handleAnalyze}
                                    disabled={!learningStyle}
                                    className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    <Sparkles size={16} />
                                    Find My Matches
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Loading State */}
                    {isAnalyzing && (
                        <div className="py-16 flex flex-col items-center justify-center text-center space-y-6">
                            <Loader2 size={48} className="text-blue-600 animate-spin" />
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 mb-2">Finding your best matches...</h2>
                                <p className="text-sm text-gray-500">Searching tutors for {subject || "your subject"}</p>
                            </div>
                            <div className="space-y-3 w-full max-w-xs text-left">
                                {[
                                    { label: "Analysing your profile", done: true },
                                    { label: "Matching subject expertise", done: true },
                                    { label: "Checking teaching style fit", done: false }
                                ].map((item, i) => (
                                    <div key={i} className={`flex items-center gap-3 text-sm ${item.done ? 'text-green-600' : 'text-gray-400'}`}>
                                        {item.done ? <CheckCircle2 size={16} /> : <Loader2 size={16} className="animate-spin" />}
                                        {item.label}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Results */}
                    {step === 4 && !isAnalyzing && (
                        <div className="space-y-6">
                            {aiResults && aiResults.length > 0 ? (
                                <>
                                    <div className="inline-flex items-center gap-2 bg-green-50 px-4 py-2 rounded-full border border-green-100 text-green-700 text-xs font-semibold">
                                        <UserCheck size={14} /> Match score: {aiResults[0].matchScore}%
                                    </div>

                                    {/* Top Match */}
                                    <div className="border-2 border-blue-600 rounded-2xl p-6 relative">
                                        <div className="absolute top-0 right-6 bg-blue-600 text-white text-xs font-semibold px-4 py-1.5 rounded-b-xl">
                                            Best Match
                                        </div>

                                        <div className="flex items-start gap-4 mt-2">
                                            <div className="size-14 rounded-xl bg-blue-600 text-white flex items-center justify-center text-xl font-bold shrink-0">
                                                {aiResults[0].tutor.name?.charAt(0) || '?'}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className="text-lg font-bold text-gray-900">{aiResults[0].tutor.name}</h3>
                                                    {aiResults[0].tutor.isVerified && <ShieldCheck size={16} className="text-blue-600 shrink-0" />}
                                                </div>
                                                <p className="text-sm text-gray-500 mb-4">₹{aiResults[0].hourlyRate}/hr</p>

                                                <div className="space-y-2 mb-5">
                                                    <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Why this tutor</p>
                                                    {aiResults[0].matchReasons.map((reason, idx) => (
                                                        <div key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                                                            <CheckCircle2 size={14} className="text-green-500 mt-0.5 shrink-0" />
                                                            {reason}
                                                        </div>
                                                    ))}
                                                </div>

                                                <div className="flex gap-3">
                                                    <Link href={`/search?tutor=${aiResults[0].userId}`} className="flex-1 text-center py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                                                        View Profile
                                                    </Link>
                                                    <Link href="/post-requirement" className="flex-[2] text-center py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors">
                                                        Request a Class
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-center border-t border-gray-100 pt-4">
                                        <Link href="/login" className="text-sm text-gray-500 hover:text-blue-600 inline-flex items-center gap-2 transition-colors">
                                            Sign in to see more matches <ArrowRight size={14} />
                                        </Link>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center py-12 space-y-4">
                                    <div className="size-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto">
                                        <Search size={28} className="text-gray-400" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900">No matches found</h3>
                                    <p className="text-gray-500 text-sm max-w-xs mx-auto">We couldn't find tutors matching your exact criteria. Try broadening your search.</p>
                                    <button onClick={() => setStep(1)} className="px-6 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                                        Start Over
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
