"use client";

import { useState } from "react";
import { Star, Send, X, Loader2 } from "lucide-react";

export default function ReviewModal({ isOpen, onClose, tutorId, studentId, tutorName, onSuccess }) {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    if (!isOpen) return null;

    const handleSubmit = async () => {
        if (rating === 0) {
            setError("Please select a rating.");
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            const res = await fetch("/api/review", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ authorId: studentId, targetId: tutorId, rating, comment })
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to submit review.");
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
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

            <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">Rate {tutorName}</h3>
                        <p className="text-xs text-gray-400 mt-0.5">Share your experience with this tutor</p>
                    </div>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100">
                        <X size={18} />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    <div className="flex flex-col items-center gap-3">
                        <p className="text-sm font-medium text-gray-500">How was your experience?</p>
                        <div className="flex gap-1.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    onClick={() => setRating(star)}
                                    className="transition-all hover:scale-110 active:scale-95"
                                >
                                    <Star
                                        size={36}
                                        strokeWidth={1.5}
                                        fill={(hoverRating || rating) >= star ? "currentColor" : "none"}
                                        className={(hoverRating || rating) >= star ? "text-amber-400" : "text-gray-200"}
                                    />
                                </button>
                            ))}
                        </div>
                        {rating > 0 && (
                            <p className="text-xs text-gray-400">
                                {rating === 5 ? "Excellent!" : rating === 4 ? "Very Good" : rating === 3 ? "Good" : rating === 2 ? "Fair" : "Poor"}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Write a review (optional)</label>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="What did you like about this tutor? How was the teaching quality?"
                            className="w-full h-28 bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm text-gray-900 focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none placeholder:text-gray-300 resize-none"
                        />
                    </div>

                    {error && (
                        <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600 text-center">
                            {error}
                        </div>
                    )}
                </div>

                <div className="px-6 pb-6 flex gap-3">
                    <button onClick={onClose} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting || rating === 0}
                        className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                        {isSubmitting ? "Submitting..." : "Submit Review"}
                    </button>
                </div>
            </div>
        </div>
    );
}
