"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, MapPin, Loader2, CheckCircle2 } from "lucide-react";
import { BROAD_CATEGORIES, getSubjectsForCategory, GRADE_OPTIONS, CITY_OPTIONS } from "@/lib/subjects";

function BrowseContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialCategory = searchParams.get("category") || "";

    const [step, setStep] = useState(initialCategory ? 2 : 1); // skip category if pre-selected
    const [category, setCategory] = useState(initialCategory);
    const [subject, setSubject] = useState("");
    const [level, setLevel] = useState("");
    const [city, setCity] = useState("");

    const subjects = category ? getSubjectsForCategory(category) : [];
    const categoryLabel = BROAD_CATEGORIES.find(c => c.id === category)?.label || "";

    const steps = [
        { id: 1, label: "Category" },
        { id: 2, label: "Subject" },
        { id: 3, label: "Level" },
        { id: 4, label: "City" },
    ];

    const goToSearch = () => {
        const params = new URLSearchParams();
        if (category) params.set("category", category);
        if (subject) params.set("subject", subject);
        if (level) params.set("grade", level);
        if (city) params.set("location", city);
        params.set("role", "TUTOR");
        router.push(`/search?${params.toString()}`);
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-16">
            <div className="max-w-lg mx-auto px-6">
                <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-blue-600 transition-colors mb-6">
                    <ArrowLeft size={16} /> Back to Home
                </Link>

                {/* Header */}
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Find a Tutor</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        {step === 1 ? "What would you like to learn?" :
                         step === 2 ? `Choose a subject in ${categoryLabel}` :
                         step === 3 ? "What level are you at?" :
                         "Where are you located?"}
                    </p>
                </div>

                {/* Progress */}
                <div className="flex items-center justify-center gap-1 mb-8">
                    {steps.map((s, i) => (
                        <div key={s.id} className="flex items-center gap-1">
                            <div className={`size-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors ${
                                s.id < step ? "bg-blue-600 text-white" :
                                s.id === step ? "bg-blue-100 text-blue-600 ring-2 ring-blue-600" :
                                "bg-gray-100 text-gray-400"
                            }`}>
                                {s.id < step ? <CheckCircle2 size={12} /> : s.id}
                            </div>
                            {i < steps.length - 1 && <div className={`w-6 h-0.5 ${s.id < step ? "bg-blue-600" : "bg-gray-200"}`} />}
                        </div>
                    ))}
                </div>

                {/* Step 1: Category */}
                {step === 1 && (
                    <div className="space-y-3">
                        {BROAD_CATEGORIES.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => { setCategory(cat.id); setSubject(""); setStep(2); }}
                                className="w-full flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
                            >
                                <div className="size-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                    <cat.icon size={20} />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-900">{cat.label}</p>
                                    <p className="text-xs text-gray-400 mt-0.5">{getSubjectsForCategory(cat.id).length} subjects</p>
                                </div>
                                <ArrowRight size={16} className="text-gray-300 ml-auto" />
                            </button>
                        ))}
                    </div>
                )}

                {/* Step 2: Subject */}
                {step === 2 && (
                    <div className="space-y-3">
                        <button onClick={() => setStep(1)} className="text-sm text-gray-400 hover:text-blue-600 flex items-center gap-1 mb-2">
                            <ArrowLeft size={14} /> Change category
                        </button>
                        <div className="grid grid-cols-2 gap-2">
                            {subjects.map(s => (
                                <button
                                    key={s}
                                    onClick={() => { setSubject(s); setStep(3); }}
                                    className={`p-3 bg-white border rounded-xl text-sm font-medium text-left hover:border-blue-500 hover:bg-blue-50 transition-all ${
                                        subject === s ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-200 text-gray-700"
                                    }`}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Step 3: Level */}
                {step === 3 && (
                    <div className="space-y-3">
                        <button onClick={() => setStep(2)} className="text-sm text-gray-400 hover:text-blue-600 flex items-center gap-1 mb-2">
                            <ArrowLeft size={14} /> Change subject
                        </button>
                        {GRADE_OPTIONS.map(g => (
                            <button
                                key={g}
                                onClick={() => { setLevel(g); setStep(4); }}
                                className={`w-full p-4 bg-white border rounded-xl text-sm font-medium text-left hover:border-blue-500 hover:bg-blue-50 transition-all ${
                                    level === g ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-200 text-gray-700"
                                }`}
                            >
                                {g}
                            </button>
                        ))}
                        <button onClick={() => { setLevel(""); goToSearch(); }}
                            className="w-full p-3 text-sm text-blue-600 hover:underline font-medium">
                            Skip — show all levels
                        </button>
                    </div>
                )}

                {/* Step 4: City */}
                {step === 4 && (
                    <div className="space-y-3">
                        <button onClick={() => setStep(3)} className="text-sm text-gray-400 hover:text-blue-600 flex items-center gap-1 mb-2">
                            <ArrowLeft size={14} /> Change level
                        </button>
                        <div className="grid grid-cols-2 gap-2">
                            {CITY_OPTIONS.map(c => (
                                <button
                                    key={c}
                                    onClick={() => { setCity(c); }}
                                    className={`p-3 bg-white border rounded-xl text-sm font-medium text-left hover:border-blue-500 hover:bg-blue-50 transition-all flex items-center gap-2 ${
                                        city === c ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-200 text-gray-700"
                                    }`}
                                >
                                    <MapPin size={14} className="text-gray-400 shrink-0" /> {c}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={goToSearch}
                            className="w-full py-3 mt-4 bg-blue-600 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
                        >
                            Show Tutors <ArrowRight size={16} />
                        </button>
                        <button onClick={() => { setCity(""); goToSearch(); }}
                            className="w-full p-3 text-sm text-blue-600 hover:underline font-medium">
                            Skip — show all cities
                        </button>
                    </div>
                )}

                {/* Selection Summary */}
                {(category || subject || level || city) && (
                    <div className="mt-6 p-3 bg-white border border-gray-100 rounded-xl flex flex-wrap gap-2">
                        {categoryLabel && <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium">{categoryLabel}</span>}
                        {subject && <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium">{subject}</span>}
                        {level && <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium">{level}</span>}
                        {city && <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium">{city}</span>}
                    </div>
                )}
            </div>
        </div>
    );
}

export default function BrowsePage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-50"><Loader2 className="animate-spin text-blue-600" size={32} /></div>}>
            <BrowseContent />
        </Suspense>
    );
}
