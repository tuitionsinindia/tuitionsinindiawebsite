"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, Shield } from "lucide-react";

export default function LeadForm({ defaultSubject = "", defaultLocation = "", utm = {} }) {
    const [form, setForm] = useState({
        name: "",
        phone: "",
        email: "",
        subject: defaultSubject,
        location: defaultLocation,
        grade: "",
        budget: "",
        description: "",
    });
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState("");

    const update = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!form.name.trim() || !form.phone.trim() || !form.email.trim()) {
            setError("Please fill in your name, phone and email so a tutor can reach you.");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("/api/lead/post", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...form,
                    budget: form.budget ? Number(form.budget) : null,
                    utm,
                }),
            });
            const json = await res.json();
            if (json.success) {
                setSubmitted(true);
                if (typeof window !== "undefined" && window.fbq) {
                    window.fbq("track", "Lead");
                }
                if (typeof window !== "undefined" && window.gtag) {
                    window.gtag("event", "generate_lead", {
                        subject: form.subject,
                        location: form.location,
                    });
                }
            } else {
                setError(json.error || "Something went wrong. Please try again.");
            }
        } catch {
            setError("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="bg-white rounded-2xl border border-emerald-200 p-6 shadow-sm">
                <div className="flex flex-col items-center text-center">
                    <div className="size-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                        <CheckCircle2 size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">Request received</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                        Matching tutors will contact you within 12 hours on <span className="font-semibold text-gray-900">{form.phone}</span>.
                        You'll also get an email with their profiles.
                    </p>
                    <p className="mt-4 text-xs text-gray-400">
                        Didn't get a call? WhatsApp us on +91-XXX-XXX-XXXX.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
            <div>
                <h3 className="text-lg font-bold text-gray-900">Tell us what you need</h3>
                <p className="text-xs text-gray-500 mt-1">Takes 30 seconds. Tutors contact you — no need to search.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Your name</label>
                    <input
                        value={form.name}
                        onChange={e => update("name", e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none"
                        placeholder="Parent or student name"
                        required
                    />
                </div>
                <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Phone (WhatsApp)</label>
                    <input
                        type="tel"
                        value={form.phone}
                        onChange={e => update("phone", e.target.value.replace(/[^0-9]/g, ""))}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none"
                        placeholder="10 digit mobile"
                        maxLength={10}
                        required
                    />
                </div>
            </div>

            <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Email</label>
                <input
                    type="email"
                    value={form.email}
                    onChange={e => update("email", e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none"
                    placeholder="you@example.com"
                    required
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Subject</label>
                    <input
                        value={form.subject}
                        onChange={e => update("subject", e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none"
                        placeholder="e.g. Mathematics"
                    />
                </div>
                <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Area / City</label>
                    <input
                        value={form.location}
                        onChange={e => update("location", e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none"
                        placeholder="e.g. Delhi"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Grade / Level</label>
                    <select
                        value={form.grade}
                        onChange={e => update("grade", e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none"
                    >
                        <option value="">Select grade</option>
                        <option value="Primary (1-5)">Primary (1-5)</option>
                        <option value="Middle (6-8)">Middle (6-8)</option>
                        <option value="High School (9-10)">High School (9-10)</option>
                        <option value="Higher Secondary (11-12)">Higher Secondary (11-12)</option>
                        <option value="JEE / NEET">JEE / NEET</option>
                        <option value="College / University">College / University</option>
                        <option value="Adult / Other">Adult / Other</option>
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Budget (₹/hour)</label>
                    <input
                        type="number"
                        min="0"
                        value={form.budget}
                        onChange={e => update("budget", e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none"
                        placeholder="e.g. 600"
                    />
                </div>
            </div>

            <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Anything else? (optional)</label>
                <textarea
                    value={form.description}
                    onChange={e => update("description", e.target.value)}
                    rows={3}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none resize-none"
                    placeholder="Board, timing preference, specific topic..."
                />
            </div>

            {error && (
                <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-700">
                    {error}
                </div>
            )}

            <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 active:scale-[0.99] disabled:opacity-60 transition-all text-sm"
            >
                {loading ? <><Loader2 size={16} className="animate-spin" /> Submitting…</> : "Get matched with tutors"}
            </button>

            <div className="flex items-center gap-2 text-xs text-gray-400 pt-1">
                <Shield size={12} /> We don't share your contact with anyone except matching tutors.
            </div>
        </form>
    );
}
