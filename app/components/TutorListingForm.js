"use client";

import { useState } from "react";
import {
    User,
    GraduationCap,
    Star,
    ArrowRight,
    ArrowLeft,
    Loader2,
    CheckCircle2,
    Briefcase,
    Clock,
    MapPin,
    Monitor,
    Home,
    ShieldCheck,
    Lock,
    CircleDollarSign,
    Building2,
    Users
} from "lucide-react";
import { BROAD_CATEGORIES, getSubjectsForCategory } from "@/lib/subjects";

export default function TutorListingForm({ user, onComplete }) {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [step, setStep] = useState(1); // 1: Profile, 2: Subjects, 3: Availability

    const [form, setForm] = useState({
        title: "",
        bio: "",
        category: "",
        subjects: [],
        grades: [],
        locations: [],
        experience: 0,
        hourlyRate: 500,
        languages: ["ENGLISH", "HINDI"],
        expertiseLevel: "SECONDARY",
        teachingModes: ["ONLINE"],
        timings: [],
        boards: [],
        type: "PRIVATE",
        maxSeats: 1
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
            const res = await fetch("/api/tutor/profile/update", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...form,
                    userId: user.id
                })
            });
            if (res.ok) {
                setSuccess(true);
                setTimeout(() => onComplete(), 2000);
            }
        } catch (error) {
            console.error("Failed to update profile:", error);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="w-full max-w-sm mx-auto py-16 text-center space-y-6 animate-in fade-in duration-500">
                <div className="size-20 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-blue-200">
                    <CheckCircle2 size={40} />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile created!</h2>
                    <p className="text-gray-500 text-sm">Your tutor profile is now live. Students can find and contact you.</p>
                </div>
            </div>
        );
    }

    const stepTitles = ["Your profile", "Subjects & grades", "Availability & rates"];

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

            {/* Step 1: Profile */}
            {step === 1 && (
                <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-500">
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Professional headline</label>
                        <input
                            required
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none text-sm"
                            placeholder="e.g. IIT-JEE Maths specialist with 5 years experience"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Years of experience</label>
                            <div className="relative">
                                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                <input
                                    type="number"
                                    value={form.experience}
                                    onChange={(e) => setForm({ ...form, experience: parseInt(e.target.value) })}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none text-sm"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Expertise level</label>
                            <select
                                value={form.expertiseLevel}
                                onChange={(e) => setForm({ ...form, expertiseLevel: e.target.value })}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 transition-all outline-none text-sm appearance-none cursor-pointer text-gray-900"
                            >
                                <option value="PRIMARY">Primary (Class 1–5)</option>
                                <option value="SECONDARY">Secondary (Class 6–10)</option>
                                <option value="SENIOR">Senior Secondary (Class 11–12)</option>
                                <option value="COMPETITIVE">Competitive Exams</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">About You</label>
                        <textarea
                            value={form.bio || ""}
                            onChange={(e) => setForm({ ...form, bio: e.target.value })}
                            rows={3}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none text-sm resize-none"
                            placeholder="Tell students about your teaching style, qualifications, and what makes you stand out..."
                        />
                        <p className="text-xs text-gray-400">This will appear on your public profile.</p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Languages you teach in</label>
                        <div className="flex flex-wrap gap-2">
                            {["ENGLISH", "HINDI", "MARATHI", "BENGALI", "TAMIL", "FRENCH"].map(lang => (
                                <button
                                    key={lang}
                                    type="button"
                                    onClick={() => toggleItem('languages', lang)}
                                    className={`px-3 py-2 rounded-lg border text-xs font-medium transition-all ${
                                        form.languages.includes(lang)
                                            ? "bg-blue-600 border-blue-600 text-white"
                                            : "bg-gray-50 border-gray-200 text-gray-500 hover:border-blue-300"
                                    }`}
                                >
                                    {lang}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        disabled={!form.title}
                        onClick={() => setStep(2)}
                        className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors disabled:opacity-40"
                    >
                        Next <ArrowRight size={16} />
                    </button>
                </div>
            )}

            {/* Step 2: Subjects & Grades */}
            {step === 2 && (
                <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-500">
                    <div className="space-y-3">
                        <label className="text-xs font-medium text-gray-500">Category</label>
                        <select
                            value={form.category}
                            onChange={(e) => setForm({ ...form, category: e.target.value, subjects: [] })}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 cursor-pointer"
                        >
                            <option value="">Select category</option>
                            {BROAD_CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-medium text-gray-500">Subjects you teach</label>
                        <select
                            onChange={(e) => {
                                const val = e.target.value;
                                if (val && !form.subjects.includes(val)) {
                                    setForm(f => ({ ...f, subjects: [...f.subjects, val] }));
                                }
                                e.target.value = "";
                            }}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 cursor-pointer"
                        >
                            <option value="">Add a subject...</option>
                            {(form.category ? getSubjectsForCategory(form.category) : []).filter(s => !form.subjects.includes(s)).map(s => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                        {form.subjects.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {form.subjects.map(s => (
                                    <button
                                        key={s}
                                        onClick={() => toggleItem('subjects', s)}
                                        className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium flex items-center gap-1.5 hover:bg-red-50 hover:text-red-600 transition-colors"
                                    >
                                        {s} <span>×</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Grades you teach</label>
                            <div className="flex flex-wrap gap-2">
                                {["Primary", "Middle", "High School", "Senior Secondary", "Graduate"].map(lvl => (
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
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Boards</label>
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
                        onClick={() => setStep(3)}
                        className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors disabled:opacity-40"
                    >
                        Next <ArrowRight size={16} />
                    </button>
                </div>
            )}

            {/* Step 3: Availability & Rates */}
            {step === 3 && (
                <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-500">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-3">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Teaching modes</label>
                            <div className="grid grid-cols-2 gap-2">
                                {[
                                    { id: "ONLINE", icon: Monitor, label: "Online", desc: "Remote" },
                                    { id: "STUDENT_HOME", icon: Home, label: "Student's home", desc: "I travel" },
                                    { id: "TUTOR_HOME", icon: MapPin, label: "My home", desc: "Student travels" },
                                    { id: "CENTER", icon: Building2, label: "Centre", desc: "At centre" }
                                ].map((mode) => (
                                    <button
                                        key={mode.id}
                                        type="button"
                                        onClick={() => toggleItem('teachingModes', mode.id)}
                                        className={`py-4 px-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                                            form.teachingModes.includes(mode.id)
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
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Class format</label>
                            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Users size={16} className="text-blue-600" />
                                        <div>
                                            <p className="text-xs font-semibold text-gray-900 leading-none">Group classes</p>
                                            <p className="text-xs text-gray-400 leading-none mt-0.5">Teach multiple students</p>
                                        </div>
                                    </div>
                                    <label className={`w-12 h-7 rounded-full p-0.5 flex items-center transition-all cursor-pointer ${form.type === 'GROUP' ? 'bg-blue-600' : 'bg-gray-200'}`}>
                                        <div className={`size-6 bg-white rounded-full shadow transition-transform ${form.type === 'GROUP' ? 'translate-x-5' : 'translate-x-0'}`} />
                                        <input
                                            type="checkbox"
                                            className="hidden"
                                            checked={form.type === 'GROUP'}
                                            onChange={(e) => setForm({ ...form, type: e.target.checked ? 'GROUP' : 'PRIVATE', maxSeats: e.target.checked ? 5 : 1 })}
                                        />
                                    </label>
                                </div>
                                {form.type === 'GROUP' && (
                                    <div className="pt-3 border-t border-gray-100 space-y-2 animate-in slide-in-from-top-2 duration-300">
                                        <label className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Max students per batch</label>
                                        <input
                                            type="number"
                                            value={form.maxSeats}
                                            onChange={(e) => setForm({ ...form, maxSeats: parseInt(e.target.value) })}
                                            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold text-blue-600 outline-none"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Areas / cities you serve (press Enter to add)</label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none text-sm"
                                placeholder="e.g. Andheri, Mumbai, Online..."
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && e.target.value.trim()) {
                                        e.preventDefault();
                                        const val = e.target.value.trim();
                                        if (!form.locations.includes(val)) {
                                            toggleItem('locations', val);
                                        }
                                        e.target.value = '';
                                    }
                                }}
                            />
                        </div>
                        {form.locations.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {form.locations.map(l => (
                                    <span key={l} className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium">
                                        {l}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Hourly rate (₹)</label>
                        <div className="relative">
                            <CircleDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input
                                type="number"
                                value={form.hourlyRate}
                                onChange={(e) => setForm({ ...form, hourlyRate: parseInt(e.target.value) })}
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none text-sm font-semibold text-blue-600"
                            />
                        </div>
                    </div>

                    <button
                        disabled={loading}
                        onClick={handleSubmit}
                        className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="animate-spin" size={16} /> : (
                            <>Create my profile <ArrowRight size={16} /></>
                        )}
                    </button>

                    <p className="flex items-center justify-center gap-1.5 text-xs text-gray-400">
                        <ShieldCheck size={12} /> Your profile will be reviewed before going live
                    </p>
                </div>
            )}
        </div>
    );
}
