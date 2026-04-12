"use client";

import { useState } from "react";
import { BookOpen, MapPin, ArrowRight, ArrowLeft, Loader2, Navigation, ChevronDown, CheckCircle2, Mail } from "lucide-react";

export default function RequirementForm({ user, prefill = {}, initialStep = 1, onStepChange, onComplete }) {
    const [loading, setLoading] = useState(false);
    const [isDetecting, setIsDetecting] = useState(false);
    const [step, setStep] = useState(initialStep);
    const [showOptional, setShowOptional] = useState(false);
    const [email, setEmail] = useState("");

    const [form, setForm] = useState({
        subjects: prefill.subject ? [prefill.subject] : [],
        grades: prefill.grade ? [prefill.grade] : [],
        locations: prefill.location ? [prefill.location] : [],
        timings: [],
        budget: "",
        modes: ["BOTH"],
        boards: [],
        genderPreference: "ANY",
        groupPreference: "PRIVATE",
        description: "",
    });

    const GRADES = ["Class 1-5", "Class 6-8", "Class 9-10", "Class 11-12", "Graduate", "Competitive Exams"];
    const BOARDS = ["CBSE", "ICSE", "IB", "State Board", "IGCSE"];
    const TIMING_SLOTS = ["Morning (7-12)", "Afternoon (12-4)", "Evening (4-8)", "Weekends"];

    const toggleItem = (field, item) => {
        setForm(f => ({
            ...f,
            [field]: f[field].includes(item) ? f[field].filter(i => i !== item) : [...f[field], item],
        }));
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
                    const loc = [data.address.suburb, data.address.city || data.address.town].filter(Boolean).join(", ") || "Current Location";
                    if (!form.locations.includes(loc)) setForm(f => ({ ...f, locations: [...f.locations, loc] }));
                } catch {} finally { setIsDetecting(false); }
            }, () => setIsDetecting(false));
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            // Update email if provided
            if (email && user?.id) {
                fetch("/api/user/update", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ userId: user.id, email }),
                }).catch(() => {});
            }

            const res = await fetch("/api/leads/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    studentId: user.id,
                    ...form,
                    budget: parseInt(form.budget) || 0,
                    description: form.description || `Looking for a ${form.subjects.join(", ")} tutor${form.locations.length ? ` in ${form.locations.join(", ")}` : ""}.`,
                }),
            });
            if (res.ok) onComplete();
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const hasPrefilled = prefill.subject || prefill.grade || prefill.location;

    return (
        <div className="space-y-5">
            {/* Step 1: Core Requirements */}
            {step === 1 && (
                <div className="space-y-5">
                    {/* Subject */}
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-gray-500">What subject do you need help with?</label>
                        <div className="relative">
                            <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                            <input
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 outline-none transition-all"
                                placeholder="e.g. Maths, Physics — press Enter to add"
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && e.target.value.trim()) {
                                        e.preventDefault();
                                        const val = e.target.value.trim();
                                        if (!form.subjects.includes(val)) toggleItem("subjects", val);
                                        e.target.value = "";
                                    }
                                }}
                            />
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {form.subjects.map(s => (
                                <span key={s} className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium">
                                    {hasPrefilled && prefill.subject === s && <CheckCircle2 size={11} className="text-emerald-500" />}
                                    {s}
                                    <button onClick={() => toggleItem("subjects", s)} className="ml-1 text-blue-400 hover:text-red-500">x</button>
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Grade */}
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-gray-500">Class / Grade level</label>
                        <div className="flex flex-wrap gap-2">
                            {GRADES.map(g => (
                                <button key={g} type="button" onClick={() => toggleItem("grades", g)}
                                    className={`px-3 py-2 rounded-lg border text-xs font-medium transition-colors ${
                                        form.grades.includes(g)
                                            ? "bg-blue-600 border-blue-600 text-white"
                                            : "bg-gray-50 border-gray-200 text-gray-600 hover:border-blue-300"
                                    }`}>
                                    {form.grades.includes(g) && hasPrefilled && prefill.grade === g && <CheckCircle2 size={10} className="inline mr-1" />}
                                    {g}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Location */}
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-gray-500">Your city / area</label>
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                                <input
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 outline-none transition-all"
                                    placeholder="e.g. Delhi, Mumbai — press Enter"
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" && e.target.value.trim()) {
                                            e.preventDefault();
                                            const val = e.target.value.trim();
                                            if (!form.locations.includes(val)) toggleItem("locations", val);
                                            e.target.value = "";
                                        }
                                    }}
                                />
                            </div>
                            <button onClick={detectLocation} disabled={isDetecting}
                                className="p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-500 hover:text-blue-600 hover:border-blue-300 transition-colors disabled:opacity-50"
                                title="Detect my location">
                                {isDetecting ? <Loader2 size={16} className="animate-spin" /> : <Navigation size={16} />}
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {form.locations.map(l => (
                                <span key={l} className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium">
                                    <MapPin size={10} /> {l}
                                    <button onClick={() => toggleItem("locations", l)} className="ml-1 text-gray-400 hover:text-red-500">x</button>
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Optional Preferences (collapsed) */}
                    <button
                        onClick={() => setShowOptional(!showOptional)}
                        className="w-full flex items-center justify-between py-3 text-sm text-gray-500 hover:text-blue-600 transition-colors"
                    >
                        <span className="font-medium">More preferences (optional)</span>
                        <ChevronDown size={16} className={`transition-transform ${showOptional ? "rotate-180" : ""}`} />
                    </button>

                    {showOptional && (
                        <div className="space-y-4 pt-2 border-t border-gray-100">
                            {/* Teaching Mode */}
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-gray-500">Teaching mode</label>
                                <div className="flex flex-wrap gap-2">
                                    {[{ id: "ONLINE", label: "Online" }, { id: "STUDENT_HOME", label: "At Home" }, { id: "CENTER", label: "At Centre" }, { id: "BOTH", label: "Any" }].map(m => (
                                        <button key={m.id} type="button" onClick={() => toggleItem("modes", m.id)}
                                            className={`px-3 py-2 rounded-lg border text-xs font-medium transition-colors ${
                                                form.modes.includes(m.id) ? "bg-blue-600 border-blue-600 text-white" : "bg-gray-50 border-gray-200 text-gray-600"
                                            }`}>{m.label}</button>
                                    ))}
                                </div>
                            </div>

                            {/* Board */}
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-gray-500">Board (if applicable)</label>
                                <div className="flex flex-wrap gap-2">
                                    {BOARDS.map(b => (
                                        <button key={b} type="button" onClick={() => toggleItem("boards", b)}
                                            className={`px-3 py-2 rounded-lg border text-xs font-medium transition-colors ${
                                                form.boards.includes(b) ? "bg-blue-600 border-blue-600 text-white" : "bg-gray-50 border-gray-200 text-gray-600"
                                            }`}>{b}</button>
                                    ))}
                                </div>
                            </div>

                            {/* Timings */}
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-gray-500">Preferred timings</label>
                                <div className="flex flex-wrap gap-2">
                                    {TIMING_SLOTS.map(t => (
                                        <button key={t} type="button" onClick={() => toggleItem("timings", t)}
                                            className={`px-3 py-2 rounded-lg border text-xs font-medium transition-colors ${
                                                form.timings.includes(t) ? "bg-amber-50 border-amber-300 text-amber-700" : "bg-gray-50 border-gray-200 text-gray-600"
                                            }`}>{t}</button>
                                    ))}
                                </div>
                            </div>

                            {/* Gender + Budget */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-gray-500">Tutor gender</label>
                                    <select value={form.genderPreference} onChange={(e) => setForm({ ...form, genderPreference: e.target.value })}
                                        className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 cursor-pointer">
                                        <option value="ANY">No preference</option>
                                        <option value="MALE">Male</option>
                                        <option value="FEMALE">Female</option>
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-gray-500">Budget / hr</label>
                                    <input type="number" value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })}
                                        className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500"
                                        placeholder="e.g. 500" />
                                </div>
                            </div>
                        </div>
                    )}

                    <button
                        disabled={form.subjects.length === 0}
                        onClick={() => goToStep(3)}
                        className="w-full py-3 bg-blue-600 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors disabled:opacity-40"
                    >
                        Review & Submit <ArrowRight size={16} />
                    </button>
                </div>
            )}

            {/* Step 3: Review & Submit */}
            {step === 3 && (
                <div className="space-y-5">
                    <button onClick={() => goToStep(1)} className="text-gray-400 hover:text-blue-600 transition-colors flex items-center gap-1 text-sm">
                        <ArrowLeft size={14} /> Edit details
                    </button>

                    {/* Summary */}
                    <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                        <h3 className="text-sm font-semibold text-gray-900 mb-3">Your requirement</h3>
                        <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs">
                            <div><span className="text-gray-400">Subjects:</span> <span className="text-gray-700 font-medium">{form.subjects.join(", ") || "—"}</span></div>
                            <div><span className="text-gray-400">Grade:</span> <span className="text-gray-700 font-medium">{form.grades.join(", ") || "Any"}</span></div>
                            <div><span className="text-gray-400">Location:</span> <span className="text-gray-700 font-medium">{form.locations.join(", ") || "Any"}</span></div>
                            <div><span className="text-gray-400">Mode:</span> <span className="text-gray-700 font-medium">{form.modes.includes("BOTH") ? "Any" : form.modes.join(", ")}</span></div>
                            {form.budget && <div><span className="text-gray-400">Budget:</span> <span className="text-gray-700 font-medium">{`₹${form.budget}/hr`}</span></div>}
                            {form.boards.length > 0 && <div><span className="text-gray-400">Board:</span> <span className="text-gray-700 font-medium">{form.boards.join(", ")}</span></div>}
                        </div>
                    </div>

                    {/* Additional details */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-gray-500">Anything else? (optional)</label>
                        <textarea
                            value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                            rows={2}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 resize-none"
                            placeholder="e.g. Need help with board exam prep, available after 5 PM"
                        />
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-gray-500">Email address (optional, for notifications)</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                            <input
                                type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 transition-all"
                                placeholder="your@email.com"
                            />
                        </div>
                    </div>

                    <button onClick={handleSubmit} disabled={loading}
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
