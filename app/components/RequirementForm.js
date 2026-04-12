"use client";

import { useState } from "react";
import { BookOpen, MapPin, ArrowRight, ArrowLeft, Loader2, Clock, Navigation } from "lucide-react";

export default function RequirementForm({ user, prefill = {}, onComplete }) {
    const [loading, setLoading] = useState(false);
    const [isDetecting, setIsDetecting] = useState(false);
    const [step, setStep] = useState(1);

    const [form, setForm] = useState({
        subjects: prefill.subject ? [prefill.subject] : [],
        grades: prefill.grade ? [prefill.grade] : [],
        locations: prefill.location ? [prefill.location] : [],
        timings: [],
        budget: "",
        modes: ["ONLINE"],
        boards: [],
        genderPreference: "ANY",
        groupPreference: "PRIVATE",
        description: "",
    });

    const TIMING_SLOTS = ["Morning (7-12 PM)", "Afternoon (12-4 PM)", "Evening (4-8 PM)", "Late Night (8 PM+)", "Weekends"];
    const BOARDS = ["CBSE", "ICSE", "IB", "State Board", "IGCSE"];
    const GRADES = ["Class 1-5", "Class 6-8", "Class 9-10", "Class 11-12", "Graduate", "Competitive Exams"];

    const toggleItem = (field, item) => {
        setForm(f => ({
            ...f,
            [field]: f[field].includes(item) ? f[field].filter(i => i !== item) : [...f[field], item],
        }));
    };

    const detectLocation = () => {
        setIsDetecting(true);
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                try {
                    const { latitude, longitude } = position.coords;
                    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                    const data = await res.json();
                    const area = data.address.suburb || data.address.neighbourhood || "";
                    const city = data.address.city || data.address.town || "";
                    const loc = [area, city].filter(Boolean).join(", ") || "Current Location";
                    if (!form.locations.includes(loc)) setForm(f => ({ ...f, locations: [...f.locations, loc] }));
                } catch {} finally { setIsDetecting(false); }
            }, () => setIsDetecting(false));
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
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

    return (
        <div className="space-y-6">
            {/* Progress */}
            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className={`h-full bg-blue-600 transition-all duration-500 rounded-full ${step === 1 ? "w-1/3" : step === 2 ? "w-2/3" : "w-full"}`} />
            </div>

            <div className="flex items-center justify-between">
                <div>
                    <p className="text-xs font-medium text-blue-600 mb-1">Step {step} of 3</p>
                    <h2 className="text-lg font-bold text-gray-900">
                        {step === 1 ? "What do you need?" : step === 2 ? "Preferences" : "Review & Submit"}
                    </h2>
                </div>
                {step > 1 && (
                    <button onClick={() => setStep(step - 1)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400">
                        <ArrowLeft size={18} />
                    </button>
                )}
            </div>

            {/* Step 1: Subject, Grade, Location */}
            {step === 1 && (
                <div className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-gray-500">Subjects</label>
                        <div className="relative">
                            <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                            <input
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 outline-none transition-all"
                                placeholder="Type a subject and press Enter"
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
                                <button key={s} onClick={() => toggleItem("subjects", s)} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium hover:bg-red-50 hover:text-red-600 transition-colors">
                                    {s} x
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-medium text-gray-500">Grade / Class Level</label>
                        <div className="flex flex-wrap gap-2">
                            {GRADES.map(g => (
                                <button key={g} type="button" onClick={() => toggleItem("grades", g)}
                                    className={`px-3 py-2 rounded-lg border text-xs font-medium transition-colors ${
                                        form.grades.includes(g) ? "bg-blue-600 border-blue-600 text-white" : "bg-gray-50 border-gray-200 text-gray-600 hover:border-blue-300"
                                    }`}>{g}</button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-medium text-gray-500">Location</label>
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                                <input
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 outline-none transition-all"
                                    placeholder="Type a city/area and press Enter"
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
                                className="p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-500 hover:text-blue-600 hover:border-blue-300 transition-colors disabled:opacity-50">
                                {isDetecting ? <Loader2 size={16} className="animate-spin" /> : <Navigation size={16} />}
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {form.locations.map(l => (
                                <button key={l} onClick={() => toggleItem("locations", l)} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium hover:bg-red-50 hover:text-red-600 transition-colors flex items-center gap-1">
                                    <MapPin size={10} /> {l} x
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        disabled={form.subjects.length === 0}
                        onClick={() => setStep(2)}
                        className="w-full py-3 bg-blue-600 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors disabled:opacity-40"
                    >
                        Next: Preferences <ArrowRight size={16} />
                    </button>
                </div>
            )}

            {/* Step 2: Preferences */}
            {step === 2 && (
                <div className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-gray-500">Teaching Mode</label>
                            <div className="flex flex-wrap gap-2">
                                {[{ id: "ONLINE", label: "Online" }, { id: "STUDENT_HOME", label: "At Home" }, { id: "CENTER", label: "At Centre" }, { id: "BOTH", label: "Any Mode" }].map(m => (
                                    <button key={m.id} type="button" onClick={() => toggleItem("modes", m.id)}
                                        className={`px-3 py-2 rounded-lg border text-xs font-medium transition-colors ${
                                            form.modes.includes(m.id) ? "bg-blue-600 border-blue-600 text-white" : "bg-gray-50 border-gray-200 text-gray-600 hover:border-blue-300"
                                        }`}>{m.label}</button>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-gray-500">Board</label>
                            <div className="flex flex-wrap gap-2">
                                {BOARDS.map(b => (
                                    <button key={b} type="button" onClick={() => toggleItem("boards", b)}
                                        className={`px-3 py-2 rounded-lg border text-xs font-medium transition-colors ${
                                            form.boards.includes(b) ? "bg-blue-600 border-blue-600 text-white" : "bg-gray-50 border-gray-200 text-gray-600 hover:border-blue-300"
                                        }`}>{b}</button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-medium text-gray-500">Available Timings</label>
                        <div className="flex flex-wrap gap-2">
                            {TIMING_SLOTS.map(t => (
                                <button key={t} type="button" onClick={() => toggleItem("timings", t)}
                                    className={`px-3 py-2 rounded-lg border text-xs font-medium transition-colors ${
                                        form.timings.includes(t) ? "bg-amber-50 border-amber-300 text-amber-700" : "bg-gray-50 border-gray-200 text-gray-600 hover:border-blue-300"
                                    }`}>{t}</button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-gray-500">Tutor Gender Preference</label>
                            <select value={form.genderPreference} onChange={(e) => setForm({ ...form, genderPreference: e.target.value })}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 cursor-pointer">
                                <option value="ANY">No Preference</option>
                                <option value="MALE">Male</option>
                                <option value="FEMALE">Female</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-gray-500">Budget (per hour)</label>
                            <input type="number" value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500"
                                placeholder="e.g. 500" />
                        </div>
                    </div>

                    <button onClick={() => setStep(3)}
                        className="w-full py-3 bg-blue-600 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors">
                        Next: Review <ArrowRight size={16} />
                    </button>
                </div>
            )}

            {/* Step 3: Review */}
            {step === 3 && (
                <div className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-gray-500">Additional details (optional)</label>
                        <textarea
                            value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                            rows={3}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 resize-none"
                            placeholder="Any specific requirements? e.g. 'Need help preparing for board exams'"
                        />
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4 space-y-3 text-sm">
                        <h3 className="font-semibold text-gray-900">Summary</h3>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                            <div><span className="text-gray-400">Subjects:</span> <span className="text-gray-700 font-medium">{form.subjects.join(", ") || "—"}</span></div>
                            <div><span className="text-gray-400">Grade:</span> <span className="text-gray-700 font-medium">{form.grades.join(", ") || "—"}</span></div>
                            <div><span className="text-gray-400">Location:</span> <span className="text-gray-700 font-medium">{form.locations.join(", ") || "Any"}</span></div>
                            <div><span className="text-gray-400">Budget:</span> <span className="text-gray-700 font-medium">{form.budget ? `₹${form.budget}/hr` : "Open"}</span></div>
                            <div><span className="text-gray-400">Mode:</span> <span className="text-gray-700 font-medium">{form.modes.join(", ")}</span></div>
                            <div><span className="text-gray-400">Board:</span> <span className="text-gray-700 font-medium">{form.boards.join(", ") || "Any"}</span></div>
                        </div>
                    </div>

                    <button onClick={handleSubmit} disabled={loading}
                        className="w-full py-3 bg-blue-600 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors disabled:opacity-50">
                        {loading ? <Loader2 className="animate-spin" size={16} /> : <>Submit Requirement <ArrowRight size={16} /></>}
                    </button>
                </div>
            )}
        </div>
    );
}
