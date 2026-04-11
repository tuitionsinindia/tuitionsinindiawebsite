"use client";

import { useState } from "react";
import {
    BookOpen,
    MapPin,
    Monitor,
    Home,
    ArrowRight,
    ArrowLeft,
    Loader2,
    Navigation,
    CircleDollarSign,
    User,
    Lock,
    Users,
    Building2,
    X
} from "lucide-react";

export default function RequirementForm({ user, onComplete, initialData = {} }) {
    const [loading, setLoading] = useState(false);
    const [isDetecting, setIsDetecting] = useState(false);
    const [step, setStep] = useState(1); // 1: Subjects & Class, 2: Preferences, 3: Review

    const [form, setForm] = useState({
        subjects: initialData.subject ? [initialData.subject] : [],
        grades: initialData.grade ? [initialData.grade] : [],
        locations: initialData.location ? [initialData.location] : [],
        timings: [],
        budget: "",
        modes: ["ONLINE"],
        boards: [],
        genderPreference: "ANY",
        groupPreference: "PRIVATE",
        description: ""
    });

    const [subjectInput, setSubjectInput] = useState("");
    const [locationInput, setLocationInput] = useState("");

    const GRADES = ["Primary (1-5)", "Middle (6-8)", "High School (9-10)", "Higher Secondary (11-12)", "Undergraduate", "Competitive Exams"];
    const BOARDS = ["CBSE", "ICSE", "IB", "State Board", "IGCSE"];
    const TIMING_SLOTS = ["Morning (7 AM – 12 PM)", "Afternoon (12 PM – 4 PM)", "Evening (4 PM – 8 PM)", "Late Night (8 PM+)", "Weekends"];

    const toggleItem = (field, item) => {
        setForm(f => ({
            ...f,
            [field]: f[field].includes(item)
                ? f[field].filter(i => i !== item)
                : [...f[field], item]
        }));
    };

    const addSubject = (val) => {
        const s = val.trim();
        if (s && !form.subjects.includes(s)) {
            setForm(f => ({ ...f, subjects: [...f.subjects, s] }));
        }
        setSubjectInput("");
    };

    const addLocation = (val) => {
        const l = val.trim();
        if (l && !form.locations.includes(l)) {
            setForm(f => ({ ...f, locations: [...f.locations, l] }));
        }
        setLocationInput("");
    };

    const detectLocation = () => {
        setIsDetecting(true);
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                try {
                    const { latitude, longitude } = position.coords;
                    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                    const data = await res.json();
                    const area = data.address.suburb || data.address.neighbourhood || data.address.residential || "";
                    const city = data.address.city || data.address.town || "";
                    const finalLoc = [area, city].filter(Boolean).join(", ") || "Current Location";
                    if (!form.locations.includes(finalLoc)) {
                        setForm(f => ({ ...f, locations: [...f.locations, finalLoc] }));
                    }
                } catch (err) { console.error(err); } finally { setIsDetecting(false); }
            }, () => setIsDetecting(false));
        }
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
                    ...form,
                    budget: parseInt(form.budget) || 0,
                    description: [
                        form.genderPreference !== "ANY" ? `Prefers ${form.genderPreference.toLowerCase()} tutor` : "",
                        form.groupPreference === "PRIVATE" ? "Private sessions" : "Group sessions",
                        form.boards.length ? `Boards: ${form.boards.join(", ")}` : "",
                        form.description
                    ].filter(Boolean).join(" · ")
                })
            });
            if (res.ok) onComplete();
        } catch (error) { console.error(error); } finally { setLoading(false); }
    };

    return (
        <div className="w-full">

            {/* Progress bar */}
            <div className="w-full h-1 bg-gray-100 rounded-full mb-8 overflow-hidden">
                <div className={`h-full bg-blue-600 rounded-full transition-all duration-500 ${step === 1 ? "w-1/3" : step === 2 ? "w-2/3" : "w-full"}`} />
            </div>

            {/* Step header */}
            <div className="flex items-center justify-between mb-6">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Step {step} of 3</p>
                {step > 1 && (
                    <button onClick={() => setStep(step - 1)} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 transition-colors">
                        <ArrowLeft size={15} /> Back
                    </button>
                )}
            </div>

            {/* Step 1: Subject & Class */}
            {step === 1 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 mb-1">What do you need help with?</h2>
                        <p className="text-sm text-gray-500">Enter the subjects and class level you're looking for.</p>
                    </div>

                    {/* Subjects */}
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">Subjects</label>
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                <input
                                    className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    placeholder="e.g. Maths, Physics"
                                    value={subjectInput}
                                    onChange={(e) => setSubjectInput(e.target.value)}
                                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSubject(subjectInput); } }}
                                />
                            </div>
                            <button
                                type="button"
                                onClick={() => addSubject(subjectInput)}
                                className="px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                            >
                                Add
                            </button>
                        </div>
                        {form.subjects.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {form.subjects.map(s => (
                                    <span key={s} className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-100">
                                        {s}
                                        <button onClick={() => toggleItem('subjects', s)} className="text-blue-400 hover:text-blue-700">
                                            <X size={12} />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Grade / Level */}
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">Class / Level</label>
                        <div className="flex flex-wrap gap-2">
                            {GRADES.map(g => (
                                <button
                                    key={g}
                                    type="button"
                                    onClick={() => toggleItem('grades', g)}
                                    className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors ${
                                        form.grades.includes(g)
                                            ? "bg-blue-600 border-blue-600 text-white"
                                            : "bg-white border-gray-200 text-gray-600 hover:border-blue-300"
                                    }`}
                                >
                                    {g}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Board */}
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">Board (optional)</label>
                        <div className="flex flex-wrap gap-2">
                            {BOARDS.map(b => (
                                <button
                                    key={b}
                                    type="button"
                                    onClick={() => toggleItem('boards', b)}
                                    className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors ${
                                        form.boards.includes(b)
                                            ? "bg-gray-900 border-gray-900 text-white"
                                            : "bg-white border-gray-200 text-gray-600 hover:border-gray-400"
                                    }`}
                                >
                                    {b}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        disabled={form.subjects.length === 0}
                        onClick={() => setStep(2)}
                        className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        Next: Your Preferences <ArrowRight size={16} />
                    </button>
                </div>
            )}

            {/* Step 2: Preferences */}
            {step === 2 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 mb-1">Your preferences</h2>
                        <p className="text-sm text-gray-500">How and where would you like to learn?</p>
                    </div>

                    {/* Teaching Mode */}
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">Teaching Mode</label>
                        <div className="grid grid-cols-2 gap-2">
                            {[
                                { id: "ONLINE", icon: Monitor, label: "Online" },
                                { id: "STUDENT_HOME", icon: Home, label: "At My Home" },
                                { id: "TUTOR_HOME", icon: MapPin, label: "At Tutor's Home" },
                                { id: "CENTER", icon: Building2, label: "At a Centre" }
                            ].map((mode) => (
                                <button
                                    key={mode.id}
                                    type="button"
                                    onClick={() => toggleItem('modes', mode.id)}
                                    className={`flex items-center gap-2.5 p-3 rounded-xl border text-sm font-medium transition-colors ${
                                        form.modes.includes(mode.id)
                                            ? "bg-blue-600 border-blue-600 text-white"
                                            : "bg-white border-gray-200 text-gray-600 hover:border-blue-300"
                                    }`}
                                >
                                    <mode.icon size={16} />
                                    {mode.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Session Type */}
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">Session Type</label>
                        <div className="grid grid-cols-2 gap-2">
                            {[
                                { id: "PRIVATE", icon: User, label: "Private (1-on-1)" },
                                { id: "GROUP", icon: Users, label: "Group / Batch" }
                            ].map(pref => (
                                <button
                                    key={pref.id}
                                    type="button"
                                    onClick={() => setForm({ ...form, groupPreference: pref.id })}
                                    className={`flex items-center gap-2.5 p-3 rounded-xl border text-sm font-medium transition-colors ${
                                        form.groupPreference === pref.id
                                            ? "bg-gray-900 border-gray-900 text-white"
                                            : "bg-white border-gray-200 text-gray-600 hover:border-gray-400"
                                    }`}
                                >
                                    <pref.icon size={16} />
                                    {pref.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Budget */}
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">Monthly Budget (₹)</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">₹</span>
                            <input
                                type="number"
                                value={form.budget}
                                onChange={(e) => setForm({ ...form, budget: e.target.value })}
                                className="w-full pl-7 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                placeholder="e.g. 5000"
                            />
                        </div>
                        <p className="text-xs text-gray-400">Enter your expected monthly budget for tuition fees.</p>
                    </div>

                    {/* Tutor Gender */}
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">Tutor Gender</label>
                        <div className="flex gap-2">
                            {["ANY", "MALE", "FEMALE"].map(g => (
                                <button
                                    key={g}
                                    type="button"
                                    onClick={() => setForm({ ...form, genderPreference: g })}
                                    className={`flex-1 py-2.5 rounded-xl border text-sm font-medium transition-colors capitalize ${
                                        form.genderPreference === g
                                            ? "bg-gray-900 border-gray-900 text-white"
                                            : "bg-white border-gray-200 text-gray-600 hover:border-gray-400"
                                    }`}
                                >
                                    {g === "ANY" ? "No preference" : g.charAt(0) + g.slice(1).toLowerCase()}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Location */}
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">Your Area / City</label>
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                <input
                                    className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    placeholder="e.g. Andheri, Mumbai"
                                    value={locationInput}
                                    onChange={(e) => setLocationInput(e.target.value)}
                                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addLocation(locationInput); } }}
                                />
                            </div>
                            <button
                                type="button"
                                onClick={() => addLocation(locationInput)}
                                className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                            >
                                Add
                            </button>
                            <button
                                type="button"
                                onClick={detectLocation}
                                disabled={isDetecting}
                                className="px-3 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                                title="Detect my location"
                            >
                                <Navigation size={16} className={isDetecting ? "animate-spin" : ""} />
                            </button>
                        </div>
                        {form.locations.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {form.locations.map(l => (
                                    <span key={l} className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                                        <MapPin size={11} />
                                        {l}
                                        <button onClick={() => toggleItem('locations', l)} className="text-gray-400 hover:text-gray-700">
                                            <X size={12} />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Timing */}
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">Preferred Timing (optional)</label>
                        <div className="flex flex-wrap gap-2">
                            {TIMING_SLOTS.map(slot => (
                                <button
                                    key={slot}
                                    type="button"
                                    onClick={() => toggleItem('timings', slot)}
                                    className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors ${
                                        form.timings.includes(slot)
                                            ? "bg-blue-600 border-blue-600 text-white"
                                            : "bg-white border-gray-200 text-gray-600 hover:border-blue-300"
                                    }`}
                                >
                                    {slot}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        disabled={form.modes.length === 0}
                        onClick={() => setStep(3)}
                        className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        Review & Submit <ArrowRight size={16} />
                    </button>
                </div>
            )}

            {/* Step 3: Review & Submit */}
            {step === 3 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 mb-1">Review your requirement</h2>
                        <p className="text-sm text-gray-500">Check the details below before posting.</p>
                    </div>

                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-gray-400 text-xs font-medium mb-1">Subjects</p>
                                <p className="font-semibold text-gray-900">{form.subjects.join(", ") || "—"}</p>
                            </div>
                            <div>
                                <p className="text-gray-400 text-xs font-medium mb-1">Level</p>
                                <p className="font-semibold text-gray-900">{form.grades.join(", ") || "—"}</p>
                            </div>
                            <div>
                                <p className="text-gray-400 text-xs font-medium mb-1">Budget</p>
                                <p className="font-semibold text-gray-900">{form.budget ? `₹${form.budget}/month` : "—"}</p>
                            </div>
                            <div>
                                <p className="text-gray-400 text-xs font-medium mb-1">Mode</p>
                                <p className="font-semibold text-gray-900">
                                    {form.modes.map(m => ({
                                        ONLINE: "Online", STUDENT_HOME: "At My Home",
                                        TUTOR_HOME: "At Tutor's Home", CENTER: "At Centre"
                                    }[m])).join(", ")}
                                </p>
                            </div>
                            <div>
                                <p className="text-gray-400 text-xs font-medium mb-1">Location</p>
                                <p className="font-semibold text-gray-900">{form.locations.join(", ") || "—"}</p>
                            </div>
                            <div>
                                <p className="text-gray-400 text-xs font-medium mb-1">Tutor Gender</p>
                                <p className="font-semibold text-gray-900 capitalize">{form.genderPreference === "ANY" ? "No preference" : form.genderPreference.toLowerCase()}</p>
                            </div>
                        </div>
                    </div>

                    {/* Additional notes */}
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">Additional notes (optional)</label>
                        <textarea
                            rows={3}
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 resize-none"
                            placeholder="Any other details for the tutor — e.g. exam prep, weak areas, preferred timing..."
                        />
                    </div>

                    <button
                        disabled={loading}
                        onClick={handleSubmit}
                        className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {loading ? <><Loader2 className="animate-spin" size={16} /> Posting requirement...</> : <>Post My Requirement <ArrowRight size={16} /></>}
                    </button>

                    <p className="text-xs text-center text-gray-400 flex items-center justify-center gap-1.5">
                        <Lock size={11} /> Your contact details are kept private until you choose to share them.
                    </p>
                </div>
            )}
        </div>
    );
}
