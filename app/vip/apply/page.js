"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2, Star } from "lucide-react";

const STEPS = [
    { number: 1, label: "What you need" },
    { number: 2, label: "Preferences" },
    { number: 3, label: "Extra details" },
    { number: 4, label: "Review & pay" },
];

const SCHEDULE_OPTIONS = [
    "Weekday mornings",
    "Weekday evenings",
    "Weekend mornings",
    "Weekend evenings",
];

const MODE_OPTIONS = [
    { value: "ONLINE", label: "Online" },
    { value: "OFFLINE", label: "In-person" },
    { value: "BOTH", label: "Either works" },
];

const GENDER_OPTIONS = [
    { value: "ANY", label: "No preference" },
    { value: "MALE", label: "Male tutor" },
    { value: "FEMALE", label: "Female tutor" },
];

// Tag input: type and press Enter or comma to add
function TagInput({ label, placeholder, value, onChange }) {
    const [inputVal, setInputVal] = useState("");

    const addTag = (raw) => {
        const tag = raw.trim();
        if (tag && !value.includes(tag)) {
            onChange([...value, tag]);
        }
        setInputVal("");
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            addTag(inputVal);
        } else if (e.key === "Backspace" && inputVal === "" && value.length > 0) {
            onChange(value.slice(0, -1));
        }
    };

    const handleBlur = () => {
        if (inputVal.trim()) addTag(inputVal);
    };

    return (
        <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
            <div className="flex flex-wrap gap-2 p-2 border border-gray-200 rounded-xl bg-gray-50 min-h-[44px] focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
                {value.map((tag) => (
                    <span
                        key={tag}
                        className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 text-sm px-2.5 py-0.5 rounded-full font-medium"
                    >
                        {tag}
                        <button
                            type="button"
                            onClick={() => onChange(value.filter((t) => t !== tag))}
                            className="text-blue-500 hover:text-blue-700 leading-none"
                        >
                            ×
                        </button>
                    </span>
                ))}
                <input
                    type="text"
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onBlur={handleBlur}
                    placeholder={value.length === 0 ? placeholder : "Add more…"}
                    className="flex-1 min-w-[120px] bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400"
                />
            </div>
            <p className="text-xs text-gray-400 mt-1">Press Enter or comma to add each item</p>
        </div>
    );
}

export default function VipApplyPage() {
    const router = useRouter();
    const [sessionLoading, setSessionLoading] = useState(true);
    const [step, setStep] = useState(1);
    const [form, setForm] = useState({
        subjects: [],
        grades: [],
        locations: [],
        modePreference: "BOTH",
        budget: "",
        schedule: [],
        genderPreference: "ANY",
        boardPreference: "",
        additionalNotes: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Auth check on mount
    useEffect(() => {
        fetch("/api/auth/session")
            .then((r) => r.json())
            .then((data) => {
                if (!data?.user) {
                    router.replace("/register/student?redirect=/vip/apply");
                } else {
                    setSessionLoading(false);
                }
            })
            .catch(() => {
                router.replace("/register/student?redirect=/vip/apply");
            });
    }, [router]);

    const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

    const toggleSchedule = (opt) => {
        set(
            "schedule",
            form.schedule.includes(opt)
                ? form.schedule.filter((s) => s !== opt)
                : [...form.schedule, opt]
        );
    };

    // Step validation
    const canProceed = () => {
        if (step === 1) return form.subjects.length > 0 && form.grades.length > 0 && form.locations.length > 0;
        if (step === 2) return form.schedule.length > 0;
        return true;
    };

    const handlePayment = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await fetch("/api/vip/apply", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...form,
                    budget: form.budget ? parseInt(form.budget) : null,
                }),
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.error || "Something went wrong.");
                setLoading(false);
                return;
            }

            const options = {
                key: data.keyId,
                amount: data.amount,
                currency: data.currency,
                name: "TuitionsinIndia VIP",
                description: "Managed Tuition Enrollment",
                order_id: data.orderId,
                handler: async (response) => {
                    const verifyRes = await fetch("/api/vip/payment/verify", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            applicationId: data.applicationId,
                            razorpayOrderId: response.razorpay_order_id,
                            razorpayPaymentId: response.razorpay_payment_id,
                            razorpaySignature: response.razorpay_signature,
                        }),
                    });
                    if (verifyRes.ok) {
                        router.push("/dashboard/student?tab=vip&enrolled=true");
                    } else {
                        setError("Payment verification failed. Please contact support.");
                        setLoading(false);
                    }
                },
                prefill: { name: "", email: "", contact: "" },
                theme: { color: "#2563eb" },
                modal: { ondismiss: () => setLoading(false) },
            };
            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch {
            setError("Something went wrong. Please try again.");
            setLoading(false);
        }
    };

    if (sessionLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <>
            <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

            <div className="min-h-screen bg-gray-50 py-10 px-4">
                <div className="max-w-xl mx-auto">
                    {/* Back link */}
                    <Link
                        href="/vip"
                        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-6"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to VIP service
                    </Link>

                    {/* Card */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        {/* Header */}
                        <div className="bg-blue-600 px-6 py-5">
                            <div className="flex items-center gap-2 mb-1">
                                <Star className="w-5 h-5 text-yellow-300 fill-yellow-300" />
                                <span className="text-white font-semibold text-base">VIP Enrollment</span>
                            </div>
                            <p className="text-blue-100 text-sm">We find and shortlist the best tutor for you.</p>
                        </div>

                        {/* Step indicator */}
                        <div className="px-6 pt-5 pb-2">
                            <div className="flex items-center justify-between relative">
                                <div className="absolute left-0 right-0 top-4 h-0.5 bg-gray-100 -z-0" />
                                {STEPS.map((s) => (
                                    <div key={s.number} className="flex flex-col items-center gap-1 z-10">
                                        <div
                                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-colors ${
                                                step > s.number
                                                    ? "bg-blue-600 border-blue-600 text-white"
                                                    : step === s.number
                                                    ? "bg-white border-blue-600 text-blue-600"
                                                    : "bg-white border-gray-200 text-gray-400"
                                            }`}
                                        >
                                            {step > s.number ? <CheckCircle2 className="w-4 h-4" /> : s.number}
                                        </div>
                                        <span
                                            className={`text-xs font-medium hidden sm:block ${
                                                step === s.number ? "text-blue-600" : "text-gray-400"
                                            }`}
                                        >
                                            {s.label}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Step content */}
                        <div className="px-6 py-5 space-y-5">
                            {step === 1 && <Step1 form={form} set={set} />}
                            {step === 2 && (
                                <Step2
                                    form={form}
                                    set={set}
                                    toggleSchedule={toggleSchedule}
                                />
                            )}
                            {step === 3 && <Step3 form={form} set={set} />}
                            {step === 4 && <Step4 form={form} />}

                            {error && (
                                <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                                    {error}
                                </p>
                            )}
                        </div>

                        {/* Navigation */}
                        <div className="px-6 pb-6 flex justify-between items-center">
                            {step > 1 ? (
                                <button
                                    onClick={() => { setError(""); setStep(step - 1); }}
                                    className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 font-medium"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    Back
                                </button>
                            ) : (
                                <span />
                            )}

                            {step < 4 ? (
                                <button
                                    onClick={() => { setError(""); setStep(step + 1); }}
                                    disabled={!canProceed()}
                                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-200 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
                                >
                                    Next
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            ) : (
                                <button
                                    onClick={handlePayment}
                                    disabled={loading}
                                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-colors"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Opening payment…
                                        </>
                                    ) : (
                                        <>
                                            Pay ₹2,000 to enroll
                                            <ArrowRight className="w-4 h-4" />
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    </div>

                    <p className="text-center text-xs text-gray-400 mt-4">
                        Secure payment via Razorpay · No recurring charges
                    </p>
                </div>
            </div>
        </>
    );
}

// ---- Step components ----

function Step1({ form, set }) {
    return (
        <div className="space-y-4">
            <h2 className="text-base font-semibold text-gray-900">What do you need help with?</h2>

            <TagInput
                label="Subjects"
                placeholder="e.g. Maths, Physics…"
                value={form.subjects}
                onChange={(v) => set("subjects", v)}
            />
            <TagInput
                label="Grade / Class"
                placeholder="e.g. Class 10, Grade 12…"
                value={form.grades}
                onChange={(v) => set("grades", v)}
            />
            <TagInput
                label="Location"
                placeholder="e.g. Andheri, Mumbai…"
                value={form.locations}
                onChange={(v) => set("locations", v)}
            />

            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Mode of teaching</label>
                <div className="flex gap-3">
                    {MODE_OPTIONS.map((m) => (
                        <button
                            key={m.value}
                            type="button"
                            onClick={() => set("modePreference", m.value)}
                            className={`flex-1 py-2 rounded-xl border text-sm font-medium transition-colors ${
                                form.modePreference === m.value
                                    ? "bg-blue-50 border-blue-500 text-blue-700"
                                    : "border-gray-200 text-gray-600 hover:border-gray-300"
                            }`}
                        >
                            {m.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

function Step2({ form, set, toggleSchedule }) {
    return (
        <div className="space-y-4">
            <h2 className="text-base font-semibold text-gray-900">Your preferences</h2>

            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Monthly budget (₹)
                </label>
                <input
                    type="number"
                    min={0}
                    value={form.budget}
                    onChange={(e) => set("budget", e.target.value)}
                    placeholder="e.g. 3000"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 placeholder-gray-400"
                />
            </div>

            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    When are you free? <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                    {SCHEDULE_OPTIONS.map((opt) => (
                        <button
                            key={opt}
                            type="button"
                            onClick={() => toggleSchedule(opt)}
                            className={`text-left px-3 py-2.5 rounded-xl border text-sm font-medium transition-colors ${
                                form.schedule.includes(opt)
                                    ? "bg-blue-50 border-blue-500 text-blue-700"
                                    : "border-gray-200 text-gray-600 hover:border-gray-300"
                            }`}
                        >
                            {opt}
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Tutor gender preference</label>
                <div className="flex gap-3">
                    {GENDER_OPTIONS.map((g) => (
                        <button
                            key={g.value}
                            type="button"
                            onClick={() => set("genderPreference", g.value)}
                            className={`flex-1 py-2 rounded-xl border text-sm font-medium transition-colors ${
                                form.genderPreference === g.value
                                    ? "bg-blue-50 border-blue-500 text-blue-700"
                                    : "border-gray-200 text-gray-600 hover:border-gray-300"
                            }`}
                        >
                            {g.label}
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Board preference <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <input
                    type="text"
                    value={form.boardPreference}
                    onChange={(e) => set("boardPreference", e.target.value)}
                    placeholder="e.g. CBSE, ICSE, State board…"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 placeholder-gray-400"
                />
            </div>
        </div>
    );
}

function Step3({ form, set }) {
    return (
        <div className="space-y-4">
            <h2 className="text-base font-semibold text-gray-900">Anything else we should know?</h2>
            <p className="text-sm text-gray-500">Share any specific needs or details that will help us find the right tutor.</p>

            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Additional notes <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <textarea
                    rows={5}
                    value={form.additionalNotes}
                    onChange={(e) => set("additionalNotes", e.target.value)}
                    placeholder="e.g. My child needs help with weak areas in algebra. We'd prefer someone patient and encouraging…"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 placeholder-gray-400 resize-none"
                />
            </div>
        </div>
    );
}

function ReviewRow({ label, value }) {
    if (!value || (Array.isArray(value) && value.length === 0)) return null;
    return (
        <div className="flex gap-3">
            <span className="text-sm text-gray-500 w-32 shrink-0">{label}</span>
            <span className="text-sm text-gray-800 font-medium">
                {Array.isArray(value) ? value.join(", ") : value}
            </span>
        </div>
    );
}

function Step4({ form }) {
    const modeLabel = { ONLINE: "Online", OFFLINE: "In-person", BOTH: "Either works" }[form.modePreference];
    const genderLabel = { ANY: "No preference", MALE: "Male tutor", FEMALE: "Female tutor" }[form.genderPreference];

    return (
        <div className="space-y-5">
            <h2 className="text-base font-semibold text-gray-900">Review your details</h2>

            <div className="bg-gray-50 rounded-xl p-4 space-y-3 border border-gray-100">
                <ReviewRow label="Subjects" value={form.subjects} />
                <ReviewRow label="Grade" value={form.grades} />
                <ReviewRow label="Location" value={form.locations} />
                <ReviewRow label="Mode" value={modeLabel} />
                {form.budget && <ReviewRow label="Monthly budget" value={`₹${parseInt(form.budget).toLocaleString("en-IN")}`} />}
                <ReviewRow label="Schedule" value={form.schedule} />
                <ReviewRow label="Gender preference" value={genderLabel} />
                {form.boardPreference && <ReviewRow label="Board" value={form.boardPreference} />}
                {form.additionalNotes && <ReviewRow label="Notes" value={form.additionalNotes} />}
            </div>

            <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-blue-900">VIP Enrollment fee</span>
                    <span className="text-lg font-bold text-blue-700">₹2,000</span>
                </div>
                <ul className="space-y-1">
                    {[
                        "Handpicked tutor recommendations",
                        "Monitored intro calls on platform",
                        "Up to 3 replacements if you're not satisfied",
                    ].map((point) => (
                        <li key={point} className="flex items-start gap-2 text-xs text-blue-700">
                            <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                            {point}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
