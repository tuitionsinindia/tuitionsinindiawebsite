"use client";

import { useState } from "react";
import {
    BookOpen,
    MapPin,
    Monitor,
    Home,
    ArrowRight,
    ArrowLeft,
    CheckCircle2,
    Loader2,
    CircleDollarSign,
    ShieldCheck,
    User,
    Lock,
    Users,
    Building2,
    Zap
} from "lucide-react";

export default function RequirementForm({ user, onComplete }) {
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1); // 1: Subjects, 2: Preferences, 3: Review

    const [form, setForm] = useState({
        subjects: [],
        grades: [],
        locations: [],
        timings: [],
        budget: "",
        modes: ["ONLINE"],
        boards: [],
        genderPreference: "ANY",
        groupPreference: "PRIVATE",
        description: ""
    });

    const BOARDS = ["CBSE", "ICSE", "IB", "State Board", "IGCSE"];

    const toggleItem = (field, item) => {
        setForm(f => ({
            ...f,
            [field]: f[field].includes(item)
                ? f[field].filter(i => i !== item)
                : [...f[field], item]
        }));
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch("/api/leads/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    studentId: user.id,
                    subjects: form.subjects,
                    grades: form.grades,
                    boards: form.boards,
                    locations: form.locations,
                    modes: form.modes,
                    timings: form.timings,
                    budget: parseInt(form.budget) || 0,
                    genderPreference: form.genderPreference,
                    description: `Session: ${form.groupPreference} | Tutor gender: ${form.genderPreference}\n\n${form.description}`
                })
            });
            if (res.ok) onComplete();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const stepTitles = ["What do you need help with?", "Your preferences", "Review & submit"];

    return (
        <div className="w-full">
            {/* Progress bar */}
            <div className="w-full h-1 bg-gray-100 rounded-full mb-6">
                <div
                    className={`h-full bg-blue-600 rounded-full transition-all duration-700 ${
                        step === 1 ? "w-1/3" : step === 2 ? "w-2/3" : "w-full"
                    }`}
                />
            </div>

            <div className="flex items-center justify-between mb-6">
                <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Step {step} of 3</p>
                    <h2 className="text-xl font-bold text-gray-900">{stepTitles[step - 1]}</h2>
                </div>
                {step > 1 && (
                    <button
                        onClick={() => setStep(step - 1)}
                        className="size-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:text-gray-700 transition-all"
                    >
                        <ArrowLeft size={20} />
                    </button>
                )}
            </div>

            {/* Step 1: Subjects & Grades */}
            {step === 1 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                    <div className="space-y-3">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Subjects (press Enter to add)</label>
                        <div className="relative">
                            <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none text-sm"
                                placeholder="e.g. Maths, Physics, English..."
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && e.target.value.trim()) {
                                        e.preventDefault();
                                        const val = e.target.value.trim();
                                        if (!form.subjects.includes(val)) {
                                            toggleItem('subjects', val);
                                        }
                                        e.target.value = '';
                                    }
                                }}
                            />
                        </div>
                        {form.subjects.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {form.subjects.map(s => (
                                    <button
                                        key={s}
                                        onClick={() => toggleItem('subjects', s)}
                                        className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 hover:bg-blue-700 transition-colors"
                                    >
                                        {s} <span className="text-blue-200">×</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Grade / Level</label>
                            <div className="flex flex-wrap gap-2">
                                {["Primary", "Middle", "High School", "Senior Secondary", "Competitive"].map(lvl => (
                                    <button
                                        key={lvl}
                                        type="button"
                                        onClick={() => toggleItem('grades', lvl)}
                                        className={`px-3 py-2 rounded-lg border text-xs font-medium transition-all ${
                                            form.grades.includes(lvl)
                                                ? "bg-gray-900 border-gray-900 text-white"
                                                : "bg-gray-50 border-gray-200 text-gray-500 hover:border-blue-300"
                                        }`}
                                    >
                                        {lvl}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-3">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Board (optional)</label>
                            <div className="flex flex-wrap gap-2">
                                {BOARDS.map(b => (
                                    <button
                                        key={b}
                                        type="button"
                                        onClick={() => toggleItem('boards', b)}
                                        className={`px-3 py-2 rounded-lg border text-xs font-medium transition-all ${
                                            form.boards.includes(b)
                                                ? "bg-blue-600 border-blue-600 text-white"
                                                : "bg-gray-50 border-gray-200 text-gray-500 hover:border-blue-300"
                                        }`}
                                    >
                                        {b}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <button
                        disabled={form.subjects.length === 0}
                        onClick={() => setStep(2)}
                        className="w-full py-3 bg-gray-900 text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors disabled:opacity-40"
                    >
                        Next <ArrowRight size={16} />
                    </button>
                </div>
            )}

            {/* Step 2: Preferences */}
            {step === 2 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Teaching mode</label>
                            <div className="grid grid-cols-2 gap-2">
                                {[
                                    { id: "ONLINE", icon: Monitor, label: "Online", desc: "Remote" },
                                    { id: "STUDENT_HOME", icon: Home, label: "At my home", desc: "Tutor travels" },
                                    { id: "TUTOR_HOME", icon: MapPin, label: "Tutor's home", desc: "I travel" },
                                    { id: "CENTER", icon: Building2, label: "Centre", desc: "Coaching centre" }
                                ].map((mode) => (
                                    <button
                                        key={mode.id}
                                        type="button"
                                        onClick={() => toggleItem('modes', mode.id)}
                                        className={`py-4 px-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                                            form.modes.includes(mode.id)
                                                ? "bg-blue-600 border-blue-600 text-white"
                                                : "bg-gray-50 border-gray-200 text-gray-400 hover:border-blue-300"
                                        }`}
                                    >
                                        <mode.icon size={20} />
                                        <div className="text-center">
                                            <p className="text-xs font-semibold leading-none mb-0.5">{mode.label}</p>
                                            <p className="text-xs opacity-60 leading-none">{mode.desc}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Session type</label>
                            <div className="space-y-2">
                                {[
                                    { id: "PRIVATE", label: "Private 1:1", icon: User, desc: "Personalised attention" },
                                    { id: "GROUP", label: "Group class", icon: Users, desc: "Cost-effective, collaborative" }
                                ].map(pref => (
                                    <button
                                        key={pref.id}
                                        type="button"
                                        onClick={() => setForm({ ...form, groupPreference: pref.id })}
                                        className={`w-full flex items-center gap-3 p-4 rounded-xl border transition-all ${
                                            form.groupPreference === pref.id
                                                ? "bg-gray-900 border-gray-900 text-white"
                                                : "bg-gray-50 border-gray-200 text-gray-500"
                                        }`}
                                    >
                                        <pref.icon size={16} />
                                        <div className="text-left">
                                            <p className="text-xs font-semibold leading-none mb-0.5">{pref.label}</p>
                                            <p className="text-xs opacity-60 leading-none">{pref.desc}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Budget per month (₹)</label>
                            <div className="relative">
                                <CircleDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                <input
                                    type="number"
                                    value={form.budget}
                                    onChange={(e) => setForm({ ...form, budget: e.target.value })}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none text-sm"
                                    placeholder="e.g. 5000"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Tutor gender preference</label>
                            <div className="grid grid-cols-3 gap-2">
                                {["Male", "Female", "Any"].map(g => (
                                    <button
                                        key={g}
                                        type="button"
                                        onClick={() => setForm({ ...form, genderPreference: g.toUpperCase() })}
                                        className={`py-3 rounded-xl border text-xs font-medium transition-all ${
                                            form.genderPreference === g.toUpperCase()
                                                ? "bg-gray-900 border-gray-900 text-white"
                                                : "bg-gray-50 border-gray-200 text-gray-500"
                                        }`}
                                    >
                                        {g}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <button
                        disabled={form.modes.length === 0}
                        onClick={() => setStep(3)}
                        className="w-full py-3 bg-gray-900 text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors disabled:opacity-40"
                    >
                        Review <ArrowRight size={16} />
                    </button>
                </div>
            )}

            {/* Step 3: Review & Submit */}
            {step === 3 && (
                <div className="space-y-6 animate-in fade-in duration-500">
                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 space-y-4">
                        <div className="flex flex-wrap gap-2">
                            {form.subjects.map(s => (
                                <span key={s} className="px-3 py-1.5 bg-white border border-blue-100 rounded-lg text-xs font-semibold text-gray-900">
                                    {s}
                                </span>
                            ))}
                        </div>
                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-blue-100 text-sm">
                            <div>
                                <p className="text-xs text-blue-500 font-medium mb-0.5">Boards</p>
                                <p className="font-semibold text-gray-900">{form.boards.join(', ') || 'Any'}</p>
                            </div>
                            <div>
                                <p className="text-xs text-blue-500 font-medium mb-0.5">Session type</p>
                                <p className="font-semibold text-gray-900">{form.groupPreference === 'PRIVATE' ? 'Private 1:1' : 'Group'}</p>
                            </div>
                            <div>
                                <p className="text-xs text-blue-500 font-medium mb-0.5">Budget</p>
                                <p className="font-semibold text-blue-600">{form.budget ? `₹${form.budget}/month` : 'Not specified'}</p>
                            </div>
                            <div>
                                <p className="text-xs text-blue-500 font-medium mb-0.5">Tutor gender</p>
                                <p className="font-semibold text-gray-900">{form.genderPreference === 'ANY' ? 'No preference' : form.genderPreference}</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Anything else tutors should know? (optional)</label>
                        <textarea
                            rows={3}
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none text-sm resize-none placeholder:text-gray-300"
                            placeholder="e.g. I need help with calculus for board exams in March..."
                        />
                    </div>

                    <button
                        disabled={loading}
                        onClick={handleSubmit}
                        className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="animate-spin" size={16} /> : (
                            <>Submit Requirement <ArrowRight size={16} /></>
                        )}
                    </button>

                    <p className="flex items-center justify-center gap-1.5 text-xs text-gray-400">
                        <ShieldCheck size={12} /> Your details are secure and only shared with verified tutors
                    </p>
                </div>
            )}
        </div>
    );
}
