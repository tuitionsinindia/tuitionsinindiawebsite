"use client";

import { useState } from "react";
import { Star, Send, X, ShieldCheck, Loader2 } from "lucide-react";

export default function ReviewModal({ isOpen, onClose, tutorId, studentId, tutorName, onSuccess }) {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    if (!isOpen) return null;

    const handleSubmit = async () => {
        if (rating === 0) {
            setError("Rating Required: Please select a quality coefficient.");
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            const res = await fetch("/api/review", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    authorId: studentId, 
                    targetId: tutorId, 
                    rating, 
                    comment 
                })
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Submission failure. Please try again.");
            }

            onSuccess();
            onClose();
        } catch (err) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-blue-900/10 backdrop-blur-xl" onClick={onClose}></div>

            {/* Modal Terminal */}
            <div className="relative w-full max-w-lg bg-white border border-gray-100 rounded-[3.5rem] shadow-4xl shadow-blue-900/20 overflow-hidden animate-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="p-10 border-b border-gray-50 flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <ShieldCheck size={14} className="text-blue-600" />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-300 italic">Faculty Evaluation</span>
                        </div>
                        <h3 className="text-3xl font-black text-gray-900 italic tracking-tighter uppercase leading-none">Rate: {tutorName}</h3>
                    </div>
                    <button onClick={onClose} className="p-3 text-gray-200 hover:text-blue-600 transition-colors bg-gray-50 rounded-2xl">
                        <X size={20} />
                    </button>
                </div>

                {/* Feedback Console */}
                <div className="p-10 space-y-12">
                    <div className="flex flex-col items-center gap-6">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 italic">Academic Experience Quality</p>
                        <div className="flex gap-3">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    onClick={() => setRating(star)}
                                    className="transition-all hover:scale-125 active:scale-95 group"
                                >
                                    <Star 
                                        size={44} 
                                        strokeWidth={1.5}
                                        fill={(hoverRating || rating) >= star ? "currentColor" : "none"}
                                        className={(hoverRating || rating) >= star ? "text-blue-600" : "text-gray-100 group-hover:text-blue-100"}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300 italic px-6">Performance Details (Optional)</label>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Share your academic experience..."
                            className="w-full h-36 bg-gray-50 border border-gray-100 rounded-[2.5rem] p-8 text-gray-900 font-medium text-sm outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-600 transition-all placeholder:text-gray-200 italic resize-none"
                        />
                    </div>

                    {error && (
                        <div className="p-5 bg-red-50 border border-red-100 rounded-2xl text-[10px] font-black text-red-500 uppercase tracking-widest text-center italic leading-none">
                            {error}
                        </div>
                    )}
                </div>

                {/* Execution Footer */}
                <div className="p-10 bg-gray-50/50 flex flex-col gap-6">
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="w-full bg-blue-600 text-white font-black py-6 rounded-2xl hover:bg-gray-900 shadow-2xl shadow-blue-600/30 transition-all flex items-center justify-center gap-4 uppercase tracking-[0.3em] text-xs active:scale-95 leading-none disabled:opacity-50"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                Synchronizing...
                            </>
                        ) : (
                            <>
                                Submit Evaluation <Send size={18} strokeWidth={3} />
                            </>
                        )}
                    </button>
                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.5em] text-center italic leading-none">
                        AUTH: REGISTERED_SCHOLAR_ONLY
                    </p>
                </div>
            </div>
        </div>
    );
}
