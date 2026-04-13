"use client";

import { useState } from "react";
import { X, Clock, BookOpen, Calendar, MessageSquare, CheckCircle2, Loader2 } from "lucide-react";

export default function TrialBookingModal({ tutor, defaultSubject = "", onClose, onSuccess }) {
    const [subject, setSubject] = useState(defaultSubject);
    const [preferredTime, setPreferredTime] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [done, setDone] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!subject.trim() || !preferredTime.trim()) return;

        setLoading(true);
        setError("");
        try {
            const res = await fetch("/api/trial/book", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    tutorId: tutor.id || tutor.userId,
                    subject: subject.trim(),
                    preferredTime: preferredTime.trim(),
                    message: message.trim() || undefined,
                }),
            });
            const data = await res.json();
            if (data.success) {
                setDone(true);
                onSuccess?.();
            } else {
                setError(data.error || "Could not book trial. Please try again.");
            }
        } catch {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
                >
                    <X size={20} />
                </button>

                {done ? (
                    <div className="p-8 text-center space-y-4">
                        <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto">
                            <CheckCircle2 size={32} className="text-emerald-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Trial request sent!</h2>
                            <p className="text-sm text-gray-500 mt-2">
                                {tutor.name || "The tutor"} will confirm your trial class shortly. You'll get a notification once they respond.
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-full py-3 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors"
                        >
                            Done
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Header */}
                        <div className="px-6 pt-6 pb-4 border-b border-gray-100">
                            <div className="flex items-center gap-2 mb-1">
                                <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                                    <Clock size={16} className="text-emerald-600" />
                                </div>
                                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                                    Free Trial
                                </span>
                            </div>
                            <h2 className="text-lg font-bold text-gray-900 mt-2">Book a free trial class</h2>
                            <p className="text-sm text-gray-500 mt-1">
                                with <span className="font-semibold text-gray-700">{tutor.name || "this tutor"}</span>
                                {tutor.trialDuration ? ` · ${tutor.trialDuration} min` : " · 30 min"}
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            {/* Subject */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-gray-600 flex items-center gap-1.5">
                                    <BookOpen size={12} /> Subject
                                </label>
                                <input
                                    required
                                    type="text"
                                    value={subject}
                                    onChange={e => setSubject(e.target.value)}
                                    placeholder="e.g. Maths, Physics, English..."
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                                    autoFocus
                                />
                            </div>

                            {/* Preferred Time */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-gray-600 flex items-center gap-1.5">
                                    <Calendar size={12} /> When are you free?
                                </label>
                                <input
                                    required
                                    type="text"
                                    value={preferredTime}
                                    onChange={e => setPreferredTime(e.target.value)}
                                    placeholder="e.g. Weekday evenings after 6 PM"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                                />
                                <p className="text-xs text-gray-400">The tutor will confirm and coordinate the exact time.</p>
                            </div>

                            {/* Message */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-gray-600 flex items-center gap-1.5">
                                    <MessageSquare size={12} /> Message <span className="text-gray-400 font-normal">(optional)</span>
                                </label>
                                <textarea
                                    rows={3}
                                    value={message}
                                    onChange={e => setMessage(e.target.value)}
                                    placeholder="Tell the tutor about your goal, current level, or anything they should know..."
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none"
                                />
                            </div>

                            {error && (
                                <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">{error}</p>
                            )}

                            <button
                                type="submit"
                                disabled={loading || !subject.trim() || !preferredTime.trim()}
                                className="w-full py-3 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {loading ? <Loader2 size={16} className="animate-spin" /> : "Send Trial Request"}
                            </button>

                            <p className="text-center text-xs text-gray-400">
                                This trial class is completely free. No payment needed.
                            </p>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}
