"use client";

import { useState, useRef, useEffect } from "react";
import { MapPin, ArrowRight, ArrowLeft, Loader2, User, Mail, Navigation, CheckCircle2 } from "lucide-react";
import { BROAD_CATEGORIES, getSubjectsForCategory, getCategoryForSubject, GRADE_OPTIONS, CITY_OPTIONS } from "@/lib/subjects";
import { trackEnquiry } from "@/lib/analytics";

// Level options relevant per category
const LEVEL_CATEGORIES = ["academics"]; // only academics needs a level step

export default function RequirementForm({ user, prefill = {}, onStepChange, onComplete }) {
    const [loading, setLoading] = useState(false);
    const [isDetecting, setIsDetecting] = useState(false);
    const [step, setStep] = useState(1);       // outer: 1=requirement, 2=preferences, 3=contact
    const [subStep, setSubStep] = useState(0); // inner step 1: 0=category, 1=level, 2=subject, 3=location

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

    // City autocomplete
    const [cityInput, setCityInput] = useState(form.location || "");
    const [citySuggestions, setCitySuggestions] = useState([]);
    const cityRef = useRef(null);

    useEffect(() => {
        if (cityInput.length < 1) { setCitySuggestions([]); return; }
        const q = cityInput.toLowerCase();
        setCitySuggestions(
            CITY_OPTIONS.filter(c => c.toLowerCase().startsWith(q)).slice(0, 6)
        );
    }, [cityInput]);

    // Close city dropdown on outside click
    useEffect(() => {
        const handler = (e) => { if (cityRef.current && !cityRef.current.contains(e.target)) setCitySuggestions([]); };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const BOARDS = ["CBSE", "ICSE", "IB", "State Board", "IGCSE"];
    const TIMING_SLOTS = ["Morning (7-12)", "Afternoon (12-4)", "Evening (4-8)", "Weekends"];

    const availableSubjects = form.category
        ? getSubjectsForCategory(form.category)
        : getSubjectsForCategory("academics");

    const goToStep = (s) => { setStep(s); if (onStepChange) onStepChange(s); };

    const detectLocation = () => {
        setIsDetecting(true);
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(async (pos) => {
                const { latitude, longitude } = pos.coords;
                try {
                    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                    const data = await res.json();
                    const city = data.address.city || data.address.town || data.address.state_district || "";
                    if (city) { setForm(f => ({ ...f, location: city })); setCityInput(city); }
                    if (user?.id) {
                        fetch("/api/user/update", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ userId: user.id, lat: latitude, lng: longitude }),
                        }).catch(() => {});
                    }
                } catch {} finally { setIsDetecting(false); }
            }, () => setIsDetecting(false));
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
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
            if (res.ok) { trackEnquiry(user?.id, form.subjects.join(", ")); onComplete(); }
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    // ── Breadcrumb for step 1 sub-steps ────────────────────────────────────────
    const BreadcrumbBar = () => {
        const cat = BROAD_CATEGORIES.find(c => c.id === form.category);
        if (!cat) return null;
        return (
            <div className="flex items-center gap-1.5 flex-wrap mb-1">
                <button onClick={() => { setSubStep(0); setForm(f => ({ ...f, category: "", subjects: [], grades: [] })); }} className="text-xs text-blue-600 font-medium hover:underline">
                    {cat.label}
                </button>
                {form.grades[0] && (
                    <>
                        <span className="text-gray-300 text-xs">›</span>
                        <button onClick={() => { setSubStep(LEVEL_CATEGORIES.includes(form.category) ? 1 : 2); setForm(f => ({ ...f, subjects: [] })); }} className="text-xs text-blue-600 font-medium hover:underline">
                            {form.grades[0]}
                        </button>
                    </>
                )}
                {form.subjects[0] && (
                    <>
                        <span className="text-gray-300 text-xs">›</span>
                        <span className="text-xs text-gray-600 font-medium">{form.subjects[0]}</span>
                    </>
                )}
            </div>
        );
    };

    return (
        <div className="space-y-5">

            {/* ─── Step 1: Your Requirement — sub-steps ─── */}
            {step === 1 && (
                <div className="space-y-5">

                    {/* Sub-step 0: Category cards */}
                    {subStep === 0 && (
                        <>
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">What do you need help with?</h2>
                                <p className="text-sm text-gray-500 mt-1">Choose a category to get started.</p>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                {BROAD_CATEGORIES.map(cat => {
                                    const Icon = cat.icon;
                                    return (
                                        <button
                                            key={cat.id}
                                            type="button"
                                            onClick={() => {
                                                setForm(f => ({ ...f, category: cat.id, subjects: [], grades: [] }));
                                                setSubStep(LEVEL_CATEGORIES.includes(cat.id) ? 1 : 2);
                                            }}
                                            className="flex flex-col items-center gap-2.5 p-4 bg-gray-50 border-2 border-gray-200 rounded-2xl hover:border-blue-400 hover:bg-blue-50 transition-all text-center group"
                                        >
                                            <div className="size-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center group-hover:border-blue-200 group-hover:bg-blue-50 transition-all shadow-sm">
                                                <Icon size={20} className="text-blue-600" />
                                            </div>
                                            <span className="text-xs font-semibold text-gray-700 group-hover:text-blue-700 leading-tight">{cat.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </>
                    )}

                    {/* Sub-step 1: Level (academics only) */}
                    {subStep === 1 && (
                        <>
                            <div className="flex items-center gap-2">
                                <button onClick={() => { setSubStep(0); setForm(f => ({ ...f, category: "", subjects: [], grades: [] })); }} className="text-gray-400 hover:text-blue-600 transition-colors">
                                    <ArrowLeft size={16} />
                                </button>
                                <div>
                                    <BreadcrumbBar />
                                    <h2 className="text-lg font-bold text-gray-900">Which level?</h2>
                                </div>
                            </div>
                            <p className="text-sm text-gray-500 -mt-3">Select the class or level you need a tutor for.</p>
                            <div className="grid grid-cols-2 gap-2.5">
                                {GRADE_OPTIONS.map(g => (
                                    <button
                                        key={g}
                                        type="button"
                                        onClick={() => { setForm(f => ({ ...f, grades: [g], subjects: [] })); setSubStep(2); }}
                                        className="py-3 px-4 bg-gray-50 border-2 border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700 transition-all text-left"
                                    >
                                        {g}
                                    </button>
                                ))}
                            </div>
                        </>
                    )}

                    {/* Sub-step 2: Subject */}
                    {subStep === 2 && (
                        <>
                            <div className="flex items-center gap-2">
                                <button onClick={() => { setSubStep(LEVEL_CATEGORIES.includes(form.category) ? 1 : 0); setForm(f => ({ ...f, subjects: [], grades: LEVEL_CATEGORIES.includes(form.category) ? [] : f.grades })); }} className="text-gray-400 hover:text-blue-600 transition-colors">
                                    <ArrowLeft size={16} />
                                </button>
                                <div>
                                    <BreadcrumbBar />
                                    <h2 className="text-lg font-bold text-gray-900">Which subject?</h2>
                                </div>
                            </div>
                            <p className="text-sm text-gray-500 -mt-3">Pick the subject you need help with.</p>
                            <div className="flex flex-wrap gap-2">
                                {availableSubjects.map(s => (
                                    <button
                                        key={s}
                                        type="button"
                                        onClick={() => { setForm(f => ({ ...f, subjects: [s] })); setSubStep(3); }}
                                        className={`px-3 py-2 rounded-xl border text-sm font-medium transition-all ${
                                            form.subjects[0] === s
                                                ? "bg-blue-600 border-blue-600 text-white"
                                                : "bg-gray-50 border-gray-200 text-gray-700 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700"
                                        }`}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </>
                    )}

                    {/* Sub-step 3: Location */}
                    {subStep === 3 && (
                        <>
                            <div className="flex items-center gap-2">
                                <button onClick={() => { setSubStep(2); }} className="text-gray-400 hover:text-blue-600 transition-colors shrink-0">
                                    <ArrowLeft size={16} />
                                </button>
                                <div className="min-w-0">
                                    <BreadcrumbBar />
                                    <h2 className="text-lg font-bold text-gray-900">Where are you located?</h2>
                                </div>
                            </div>
                            <p className="text-sm text-gray-500 -mt-3">We'll find tutors near you for the best match.</p>

                            {/* City search with autocomplete */}
                            <div className="relative" ref={cityRef}>
                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                                        <input
                                            autoFocus
                                            value={cityInput}
                                            onChange={(e) => {
                                                setCityInput(e.target.value);
                                                setForm(f => ({ ...f, location: e.target.value }));
                                            }}
                                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                                            placeholder="Type your city..."
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={detectLocation}
                                        disabled={isDetecting}
                                        title="Auto-detect my location"
                                        className="p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-500 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50 transition-colors disabled:opacity-50"
                                    >
                                        {isDetecting ? <Loader2 size={16} className="animate-spin" /> : <Navigation size={16} />}
                                    </button>
                                </div>

                                {/* Dropdown suggestions */}
                                {citySuggestions.length > 0 && (
                                    <div className="absolute left-0 right-10 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-20 overflow-hidden">
                                        {citySuggestions.map(city => (
                                            <button
                                                key={city}
                                                type="button"
                                                onMouseDown={() => {
                                                    setForm(f => ({ ...f, location: city }));
                                                    setCityInput(city);
                                                    setCitySuggestions([]);
                                                }}
                                                className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-2 transition-colors"
                                            >
                                                <MapPin size={13} className="text-gray-400 shrink-0" />
                                                {city}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {/* Selected city confirmation */}
                                {form.location && citySuggestions.length === 0 && (
                                    <div className="flex items-center gap-1.5 mt-2 px-1">
                                        <CheckCircle2 size={13} className="text-emerald-500" />
                                        <span className="text-xs text-emerald-600 font-medium">{form.location}</span>
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col gap-2 pt-1">
                                <button
                                    onClick={() => goToStep(2)}
                                    disabled={!form.location.trim()}
                                    className="w-full py-3 bg-blue-600 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors disabled:opacity-40"
                                >
                                    Continue <ArrowRight size={16} />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => goToStep(2)}
                                    className="w-full py-2 text-sm text-gray-400 hover:text-blue-600 transition-colors font-medium"
                                >
                                    Skip — find tutors across India
                                </button>
                            </div>
                        </>
                    )}
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
                        <button onClick={() => { goToStep(1); setSubStep(3); }} className="text-sm text-gray-400 hover:text-blue-600 flex items-center gap-1">
                            <ArrowLeft size={14} /> Back
                        </button>
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
                        <label className="text-xs font-medium text-gray-500">Email <span className="text-gray-400 font-normal">(optional — for tutor notifications)</span></label>
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
                        <h3 className="text-xs font-semibold text-gray-700 mb-2">Your requirement</h3>
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
