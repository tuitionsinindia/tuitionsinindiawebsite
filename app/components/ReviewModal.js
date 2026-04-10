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
            setError("PROTOCOL_ERROR: SELECT_RATING_COEFFICIENT");
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
                throw new Error(data.error || "SUBMISSION_FAILURE");
            }

            onSuccess();
            onClose();
        } catch (err) {
            setError(err.message.toUpperCase());
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-background-dark/80 backdrop-blur-xl" onClick={onClose}></div>

            {/* Modal Terminal */}
            <div className="relative w-full max-w-lg bg-surface-dark border border-border-dark rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                {/* Dynamic Header */}
                <div className="p-8 border-b border-border-dark flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <ShieldCheck size={14} className="text-amber-500" />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 italic">Reputation Terminal</span>
                        </div>
                        <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase">Rating: {tutorName}</h3>
                    </div>
                    <button onClick={onClose} className="p-2 text-white/20 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Feedback Console */}
                <div className="p-8 space-y-10">
                    <div className="flex flex-col items-center gap-4">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60 italic">Quality Coefficient</p>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    onClick={() => setRating(star)}
                                    className="transition-all hover:scale-125 active:scale-95"
                                >
                                    <Star 
                                        size={40} 
                                        strokeWidth={1.5}
                                        fill={(hoverRating || rating) >= star ? "currentColor" : "none"}
                                        className={(hoverRating || rating) >= star ? "text-amber-500" : "text-white/10"}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60 italic px-4">Performance Log (Optional)</label>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="INITIALIZE_FEEDBACK_ENTRY..."
                            className="w-full h-32 bg-background-dark/50 border border-border-dark rounded-3xl p-6 text-white font-black text-xs uppercase tracking-widest focus:ring-2 focus:ring-amber-500/50 outline-none placeholder:text-white/10 italic resize-none"
                        />
                    </div>

                    {error && (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-[10px] font-black text-red-500 uppercase tracking-widest text-center italic">
                            {error}
                        </div>
                    )}
                </div>

                {/* Execution Footer */}
                <div className="p-8 bg-background-dark/50 flex flex-col gap-4">
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="w-full bg-amber-500 text-white font-black py-5 rounded-2xl hover:bg-amber-600 shadow-2xl shadow-amber-500/10 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-xs active:scale-95 leading-none disabled:opacity-50"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 size={16} className="animate-spin" />
                                COMMITTING_PROTOCOL...
                            </>
                        ) : (
                            <>
                                EXECUTE_SUBMISSION <Send size={16} strokeWidth={3} />
                            </>
                        )}
                    </button>
                    <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.3em] text-center italic leading-none">
                        AUTH_SIG: VERIFIED_ACADEMIC_FEEDBACK_ONLY
                    </p>
                </div>
            </div>
        </div>
    );
}
