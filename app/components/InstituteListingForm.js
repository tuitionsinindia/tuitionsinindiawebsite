"use client";

import { useState } from "react";
import {
    Building2, Users, ArrowRight, ArrowLeft, Loader2, CheckCircle2,
    BookOpen, MapPin, Monitor, Home, Clock
} from "lucide-react";

export default function InstituteListingForm({ user, onComplete, prefill = {} }) {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");
    const [step, setStep] = useState(1);
    const [isDetecting, setIsDetecting] = useState(false);

    // Prefill from chatbot handoff URL params where available.
    const [form, setForm] = useState({
        instituteName: prefill.institute_name || "",
        bio: "",
        subjects: prefill.subject ? [prefill.subject] : [],
        grades: [],
        locations: prefill.location ? [prefill.location] : [],
        contactPerson: user?.name || "",
        hourlyRate: 500,
        teachingModes: ["OFFLINE"],
        timings: [],
        boards: [],
        languages: ["ENGLISH", "HINDI"]
    });

    const TIMING_SLOTS = ["Morning (7 AM - 12 PM)", "Afternoon (12 PM - 4 PM)", "Evening (4 PM - 8 PM)", "Late Night (8 PM+)", "Weekends"];
    const BOARDS = ["CBSE", "ICSE", "IB", "State Board", "IGCSE"];

    const detectLocation = () => {
        if (!("geolocation" in navigator)) return;
        setIsDetecting(true);
        navigator.geolocation.getCurrentPosition(async (pos) => {
            const { latitude, longitude } = pos.coords;
            try {
                const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                const data = await res.json();
                const city = data.address.city || data.address.town || data.address.state_district || "";
                if (city && !form.locations.includes(city)) {
                    setForm(f => ({ ...f, locations: [...f.locations, city] }));
                }
                if (user?.id) {
                    fetch("/api/user/update", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ userId: user.id, lat: latitude, lng: longitude }),
                    }).catch(() => {});
                }
            } catch {} finally { setIsDetecting(false); }
        }, () => setIsDetecting(false));
    };

    const toggleItem = (field, item) => {
        setForm(f => ({
            ...f,
            [field]: Array.isArray(f[field])
                ? (f[field].includes(item) ? f[field].filter(i => i !== item) : [...f[field], item])
                : item
        }));
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const res = await fetch("/api/tutor/profile/update", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...form, userId: user.id, title: form.instituteName, isInstitute: true })
            });
            if (res.ok) {
                setSuccess(true);
                setTimeout(() => onComplete(), 2000);
            } else {
                const data = await res.json().catch(() => ({}));
                setError(data.error || "Something went wrong. Please try again.");
            }
        } catch {
            setError("Could not connect to the server. Please check your internet and try again.");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="w-full max-w-sm mx-auto py-20 text-center space-y-6">
                <div className="size-20 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 size={40} />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile Saved!</h2>
                    <p className="text-gray-500 text-sm">Your institute profile has been set up. Redirecting to dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl p-8 md:p-10 border border-gray-200 shadow-sm">

                {/* Progress Bar */}
                <div className="w-full h-1.5 bg-gray-100 rounded-full mb-8 overflow-hidden">
                    <div className={`h-full bg-blue-600 transition-all duration-500 rounded-full ${step === 1 ? "w-1/3" : step === 2 ? "w-2/3" : "w-full"}`} />
                </div>

                {/* Header */}
                <div className="mb-8 flex justify-between items-start">
                    <div>
                        <p className="text-xs font-semibold text-blue-600 mb-2">Step {step} of 3</p>
                        <h2 className="text-2xl font-bold text-gray-900">
                            {step === 1 && "Institute Details"}
                            {step === 2 && "Subjects & Curriculum"}
                            {step === 3 && "Schedule & Location"}
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            {step === 1 && "Tell us about your institute"}
                            {step === 2 && "What do you teach?"}
                            {step === 3 && "When and where do you operate?"}
                        </p>
                    </div>
                    {step > 1 && (
                        <button onClick={() => setStep(step - 1)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors">
                            <ArrowLeft size={20} />
                        </button>
                    )}
                </div>

                {/* Step 1: Institute Details */}
                {step === 1 && (
                    <div className="space-y-5 animate-in fade-in duration-300">
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-gray-500">Institute Name</label>
                            <input
                                required
                                value={form.instituteName}
                                onChange={(e) => setForm({ ...form, instituteName: e.target.value })}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none"
                                placeholder="e.g. Excel Coaching Academy"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-medium text-gray-500">Contact Person</label>
                            <div className="relative">
                                <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                                <input
                                    required
                                    value={form.contactPerson}
                                    onChange={(e) => setForm({ ...form, contactPerson: e.target.value })}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none"
                                    placeholder="Your name"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-medium text-gray-500">About Your Institute</label>
                            <textarea
                                required
                                rows={3}
                                value={form.bio}
                                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none resize-none"
                                placeholder="Describe your institute's teaching approach, achievements, and specialties..."
                            />
                        </div>

                        <button
                            disabled={!form.instituteName || !form.contactPerson}
                            onClick={() => setStep(2)}
                            className="w-full py-3 bg-blue-600 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors disabled:opacity-40"
                        >
                            Next: Subjects <ArrowRight size={16} />
                        </button>
                    </div>
                )}

                {/* Step 2: Subjects & Curriculum */}
                {step === 2 && (
                    <div className="space-y-6 animate-in fade-in duration-300">
                        <div className="space-y-3">
                            <label className="text-xs font-medium text-gray-500">Subjects You Teach</label>
                            <div className="relative">
                                <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                                <input
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 transition-all outline-none"
                                    placeholder="Type a subject and press Enter"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && e.target.value) {
                                            e.preventDefault();
                                            toggleItem('subjects', e.target.value.trim());
                                            e.target.value = '';
                                        }
                                    }}
                                />
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {form.subjects.map(s => (
                                    <button key={s} onClick={() => toggleItem('subjects', s)} className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium hover:bg-red-50 hover:text-red-600 transition-colors">
                                        {s} x
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <label className="text-xs font-medium text-gray-500">Grade Levels</label>
                                <div className="flex flex-wrap gap-2">
                                    {["Primary (1-5)", "Middle (6-8)", "High (9-10)", "Senior (11-12)", "Graduate"].map(lvl => (
                                        <button
                                            key={lvl} type="button"
                                            onClick={() => toggleItem('grades', lvl)}
                                            className={`px-3 py-2 rounded-lg border text-xs font-medium transition-colors ${
                                                form.grades.includes(lvl) ? "bg-blue-600 border-blue-600 text-white" : "bg-gray-50 border-gray-200 text-gray-600 hover:border-blue-300"
                                            }`}
                                        >
                                            {lvl}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="text-xs font-medium text-gray-500">Boards</label>
                                <div className="flex flex-wrap gap-2">
                                    {BOARDS.map(b => (
                                        <button
                                            key={b} type="button"
                                            onClick={() => toggleItem('boards', b)}
                                            className={`px-3 py-2 rounded-lg border text-xs font-medium transition-colors ${
                                                form.boards.includes(b) ? "bg-blue-600 border-blue-600 text-white" : "bg-gray-50 border-gray-200 text-gray-600 hover:border-blue-300"
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
                            className="w-full py-3 bg-blue-600 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors disabled:opacity-40"
                        >
                            Next: Schedule <ArrowRight size={16} />
                        </button>
                    </div>
                )}

                {/* Step 3: Schedule & Location */}
                {step === 3 && (
                    <div className="space-y-6 animate-in fade-in duration-300">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <label className="text-xs font-medium text-gray-500">Teaching Mode</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        { id: "OFFLINE", icon: Building2, label: "In-Centre" },
                                        { id: "ONLINE", icon: Monitor, label: "Online" }
                                    ].map((mode) => (
                                        <button
                                            key={mode.id} type="button"
                                            onClick={() => toggleItem('teachingModes', mode.id)}
                                            className={`py-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                                                form.teachingModes.includes(mode.id)
                                                    ? "bg-blue-50 border-blue-600 text-blue-700"
                                                    : "bg-gray-50 border-gray-200 text-gray-400 hover:border-blue-300"
                                            }`}
                                        >
                                            <mode.icon size={24} strokeWidth={1.5} />
                                            <span className="text-xs font-medium">{mode.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-xs font-medium text-gray-500">Class Timings</label>
                                <div className="flex flex-wrap gap-2">
                                    {TIMING_SLOTS.map(t => (
                                        <button
                                            key={t} type="button"
                                            onClick={() => toggleItem('timings', t)}
                                            className={`px-3 py-2 rounded-lg border text-xs font-medium transition-colors ${
                                                form.timings.includes(t) ? "bg-amber-50 border-amber-300 text-amber-700" : "bg-gray-50 border-gray-200 text-gray-600 hover:border-blue-300"
                                            }`}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-medium text-gray-500">Locations Served</label>
                                <button type="button" onClick={detectLocation} disabled={isDetecting}
                                    className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 disabled:opacity-50 transition-colors">
                                    <MapPin size={11} /> {isDetecting ? "Detecting..." : "Detect my location"}
                                </button>
                            </div>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                                <input
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 transition-all outline-none"
                                    placeholder="Type a city/area and press Enter"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && e.target.value) {
                                            e.preventDefault();
                                            toggleItem('locations', e.target.value.trim());
                                            e.target.value = '';
                                        }
                                    }}
                                />
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {form.locations.map(l => (
                                    <button key={l} onClick={() => toggleItem('locations', l)} className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium hover:bg-red-50 hover:text-red-600 transition-colors flex items-center gap-1">
                                        <MapPin size={10} /> {l} x
                                    </button>
                                ))}
                            </div>
                        </div>

                        {error && (
                            <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-center">
                                {error}
                            </p>
                        )}
                        <button
                            disabled={loading || form.timings.length === 0}
                            onClick={handleSubmit}
                            className="w-full py-3 bg-blue-600 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="animate-spin" size={16} /> : <>Save & Continue <ArrowRight size={16} /></>}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
