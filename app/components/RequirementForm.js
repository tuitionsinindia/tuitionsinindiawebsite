"use client";

import { useState } from "react";
import { BookOpen, MapPin, ArrowRight, ArrowLeft, Loader2, ChevronDown, User, Mail, Navigation } from "lucide-react";
import { BROAD_CATEGORIES, getSubjectsForCategory, getCategoryForSubject, GRADE_OPTIONS, CITY_OPTIONS, ALL_SUBJECTS } from "@/lib/subjects";

export default function RequirementForm({ user, prefill = {}, onStepChange, onComplete }) {
    const [loading, setLoading] = useState(false);
    const [isDetecting, setIsDetecting] = useState(false);
    const [step, setStep] = useState(1);
    const [subjectQuery, setSubjectQuery] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);

    // Auto-detect category from pre-filled subject
    const initialCategory = prefill.subject ? getCategoryForSubject(prefill.subject) : "";

    const [form, setForm] = useState({
        category: initialCategory,
        subjects: prefill.subject ? [prefill.subject] : [],
        grades: prefill.grade ? [prefill.grade] : [],
        location: prefill.location || "",
        modes: ["BOTH"],
        boards: [],
        timings: [],
        genderPreference: "ANY",
        budget: "",
        description: "",
        name: user?.name || "",
        email: "",
    });

    const BOARDS = ["CBSE", "ICSE", "IB", "State Board", "IGCSE"];
    const TIMING_SLOTS = ["Morning (7-12)", "Afternoon (12-4)", "Evening (4-8)", "Weekends"];

    // Subjects filtered by selected category
    const availableSubjects = form.category
        ? getSubjectsForCategory(form.category)
        : ALL_SUBJECTS;

    const filteredSuggestions = subjectQuery.length >= 1
        ? availableSubjects.filter(s => s.toLowerCase().includes(subjectQuery.toLowerCase()) && !form.subjects.includes(s)).slice(0, 8)
        : [];

    const addSubject = (subject) => {
        if (!form.subjects.includes(subject)) {
            setForm(f => ({ ...f, subjects: [...f.subjects, subject] }));
        }
        setSubjectQuery("");
        setShowSuggestions(false);
    };

    const goToStep = (s) => {
        setStep(s);
        if (onStepChange) onStepChange(s);
    };

    const detectLocation = () => {
        setIsDetecting(true);
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(async (pos) => {
                try {
                    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`);
                    const data = await res.json();
                    const city = data.address.city || data.address.town || data.address.state_district || "";
                    if (city) setForm(f => ({ ...f, location: city }));
                } catch {} finally { setIsDetecting(false); }
            }, () => setIsDetecting(false));
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            // Update user name + email
            if (user?.id) {
                fetch("/api/user/update", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ userId: user.id, name: form.name, email: form.email || undefined }),
                }).catch(() => {});
            }

            const res = await fetch("/api/leads/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    studentId: user.id,
                    subjects: form.subjects,
                    grades: form.grades,
                    locations: form.location ? [form.location] : [],
                    modes: form.modes,
                    boards: form.boards,
                    timings: form.timings,
                    budget: parseInt(form.budget) || 0,
                    genderPreference: form.genderPreference,
                    description: form.description || `Looking for a ${form.subjects.join(", ")} tutor${form.location ? ` in ${form.location}` : ""}.`,
                }),
            });
            if (res.ok) onComplete();
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    return (
        <div className="space-y-5">
            {/* ─── Step 1: Your Requirement ─── */}
            {step === 1 && (
                <div className="space-y-5">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">What do you need?</h2>
                        <p className="text-sm text-gray-500 mt-1">Tell us what subject and level you're looking for.</p>
                    </div>

                    {/* Category */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-gray-500">Category</label>
                        <select
                            value={form.category}
                            onChange={(e) => setForm(f => ({ ...f, category: e.target.value, subjects: [] }))}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 cursor-pointer"
                        >
                            <option value="">All Categories</option>
                            {BROAD_CATEGORIES.map(c => (
                                <option key={c.id} value={c.id}>{c.label}</option>
                            ))}
                        </select>
                    </div>

                    {/* Subject (autocomplete) */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-gray-500">Subject</label>
                        <div className="relative">
                            <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 z-10" size={16} />
                            <input
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 outline-none transition-all"
                                placeholder={form.category ? `Search ${BROAD_CATEGORIES.find(c => c.id === form.category)?.label || ""} subjects...` : "Start typing — e.g. Maths, Physics, NEET"}
                                value={subjectQuery}
                                onChange={(e) => { setSubjectQuery(e.target.value); setShowSuggestions(true); }}
                                onFocus={() => setShowSuggestions(true)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && subjectQuery.trim()) { e.preventDefault(); addSubject(subjectQuery.trim()); }
                                    if (e.key === "Escape") setShowSuggestions(false);
                                }}
                            />
                            {showSuggestions && filteredSuggestions.length > 0 && (
                                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-20 max-h-48 overflow-y-auto">
                                    {filteredSuggestions.map(s => (
                                        <button key={s} type="button"
                                            onMouseDown={(e) => { e.preventDefault(); addSubject(s); }}
                                            className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors first:rounded-t-xl last:rounded-b-xl"
                                        >{s}</button>
                                    ))}
                                </div>
                            )}
                        </div>
                        {form.subjects.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {form.subjects.map(s => (
                                    <span key={s} className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium">
                                        {s}
                                        <button onClick={() => setForm(f => ({ ...f, subjects: f.subjects.filter(x => x !== s) }))} className="ml-1 text-blue-400 hover:text-red-500">x</button>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Level / Grade */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-gray-500">Level / Class</label>
                        <select
                            value={form.grades[0] || ""}
                            onChange={(e) => setForm(f => ({ ...f, grades: e.target.value ? [e.target.value] : [] }))}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 cursor-pointer"
                        >
                            <option value="">Select level</option>
                            {GRADE_OPTIONS.map(g => <option key={g} value={g}>{g}</option>)}
                        </select>
                    </div>

                    {/* City */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-gray-500">City</label>
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                                <input
                                    list="city-options"
                                    value={form.location}
                                    onChange={(e) => setForm(f => ({ ...f, location: e.target.value }))}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 outline-none transition-all"
                                    placeholder="Your city"
                                />
                                <datalist id="city-options">
                                    {CITY_OPTIONS.map(c => <option key={c} value={c} />)}
                                </datalist>
                            </div>
                            <button onClick={detectLocation} disabled={isDetecting}
                                className="p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-500 hover:text-blue-600 hover:border-blue-300 transition-colors disabled:opacity-50" title="Detect my location">
                                {isDetecting ? <Loader2 size={16} className="animate-spin" /> : <Navigation size={16} />}
                            </button>
                        </div>
                    </div>

                    <button
                        disabled={form.subjects.length === 0}
                        onClick={() => goToStep(2)}
                        className="w-full py-3 bg-blue-600 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors disabled:opacity-40"
                    >
                        Next: Preferences <ArrowRight size={16} />
                    </button>
                </div>
            )}

            {/* ─── Step 2: Tuition Preferences ─── */}
            {step === 2 && (
                <div className="space-y-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">Tuition Preferences</h2>
                            <p className="text-sm text-gray-500 mt-1">Help us find the best match for you.</p>
                        </div>
                        <button onClick={() => goToStep(1)} className="text-sm text-gray-400 hover:text-blue-600 flex items-center gap-1"><ArrowLeft size={14} /> Back</button>
                    </div>

                    {/* Teaching Mode */}
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-gray-500">How would you like to learn?</label>
                        <div className="flex flex-wrap gap-2">
                            {[{ id: "ONLINE", label: "Online" }, { id: "STUDENT_HOME", label: "At My Home" }, { id: "CENTER", label: "At Centre" }, { id: "BOTH", label: "Any Mode" }].map(m => (
                                <button key={m.id} type="button"
                                    onClick={() => setForm(f => ({ ...f, modes: f.modes.includes(m.id) ? f.modes.filter(x => x !== m.id) : [...f.modes, m.id] }))}
                                    className={`px-3 py-2 rounded-lg border text-xs font-medium transition-colors ${
                                        form.modes.includes(m.id) ? "bg-blue-600 border-blue-600 text-white" : "bg-gray-50 border-gray-200 text-gray-600 hover:border-blue-300"
                                    }`}>{m.label}</button>
                            ))}
                        </div>
                    </div>

                    {/* Board */}
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-gray-500">Board (if applicable)</label>
                        <div className="flex flex-wrap gap-2">
                            {BOARDS.map(b => (
                                <button key={b} type="button"
                                    onClick={() => setForm(f => ({ ...f, boards: f.boards.includes(b) ? f.boards.filter(x => x !== b) : [...f.boards, b] }))}
                                    className={`px-3 py-2 rounded-lg border text-xs font-medium transition-colors ${
                                        form.boards.includes(b) ? "bg-blue-600 border-blue-600 text-white" : "bg-gray-50 border-gray-200 text-gray-600 hover:border-blue-300"
                                    }`}>{b}</button>
                            ))}
                        </div>
                    </div>

                    {/* Timings */}
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-gray-500">Preferred timings</label>
                        <div className="flex flex-wrap gap-2">
                            {TIMING_SLOTS.map(t => (
                                <button key={t} type="button"
                                    onClick={() => setForm(f => ({ ...f, timings: f.timings.includes(t) ? f.timings.filter(x => x !== t) : [...f.timings, t] }))}
                                    className={`px-3 py-2 rounded-lg border text-xs font-medium transition-colors ${
                                        form.timings.includes(t) ? "bg-amber-50 border-amber-300 text-amber-700" : "bg-gray-50 border-gray-200 text-gray-600 hover:border-blue-300"
                                    }`}>{t}</button>
                            ))}
                        </div>
                    </div>

                    {/* Gender + Budget */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-gray-500">Tutor gender</label>
                            <select value={form.genderPreference} onChange={(e) => setForm(f => ({ ...f, genderPreference: e.target.value }))}
                                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 cursor-pointer">
                                <option value="ANY">No preference</option>
                                <option value="MALE">Male</option>
                                <option value="FEMALE">Female</option>
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-gray-500">Budget / hr (optional)</label>
                            <input type="number" value={form.budget} onChange={(e) => setForm(f => ({ ...f, budget: e.target.value }))}
                                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500"
                                placeholder="e.g. 500" />
                        </div>
                    </div>

                    {/* Notes */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-gray-500">Additional details (optional)</label>
                        <textarea
                            value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
                            rows={2}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 resize-none"
                            placeholder="e.g. Need help with board exam prep, available after 5 PM"
                        />
                    </div>

                    <button onClick={() => goToStep(3)}
                        className="w-full py-3 bg-blue-600 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors">
                        Next: Contact Details <ArrowRight size={16} />
                    </button>
                </div>
            )}

            {/* ─── Step 3: Contact Details ─── */}
            {step === 3 && (
                <div className="space-y-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">Your Contact Details</h2>
                            <p className="text-sm text-gray-500 mt-1">So tutors can reach you.</p>
                        </div>
                        <button onClick={() => goToStep(2)} className="text-sm text-gray-400 hover:text-blue-600 flex items-center gap-1"><ArrowLeft size={14} /> Back</button>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-gray-500">Full Name <span className="text-red-400">*</span></label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                            <input
                                required value={form.name}
                                onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 outline-none transition-all"
                                placeholder="Your full name"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-gray-500">Email (optional, for notifications)</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                            <input
                                type="email" value={form.email}
                                onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 outline-none transition-all"
                                placeholder="your@email.com"
                            />
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                        <h3 className="text-xs font-semibold text-gray-700 mb-2">Your Requirement Summary</h3>
                        <div className="grid grid-cols-2 gap-y-1.5 gap-x-4 text-xs">
                            <div><span className="text-gray-400">Subject:</span> <span className="text-gray-700 font-medium">{form.subjects.join(", ") || "—"}</span></div>
                            <div><span className="text-gray-400">Level:</span> <span className="text-gray-700 font-medium">{form.grades.join(", ") || "Any"}</span></div>
                            <div><span className="text-gray-400">City:</span> <span className="text-gray-700 font-medium">{form.location || "Any"}</span></div>
                            <div><span className="text-gray-400">Mode:</span> <span className="text-gray-700 font-medium">{form.modes.includes("BOTH") ? "Any" : form.modes.join(", ")}</span></div>
                        </div>
                    </div>

                    <button onClick={handleSubmit} disabled={loading || !form.name.trim()}
                        className="w-full py-3 bg-blue-600 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors disabled:opacity-50">
                        {loading ? <Loader2 className="animate-spin" size={16} /> : <>Submit & Find Tutors <ArrowRight size={16} /></>}
                    </button>

                    <p className="text-xs text-gray-400 text-center">
                        Matching tutors will be notified and can contact you directly.
                    </p>
                </div>
            )}
        </div>
    );
}
