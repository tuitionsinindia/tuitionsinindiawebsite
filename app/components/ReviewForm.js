"use client";

import { useState, useEffect } from "react";
import { Star, Loader2, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function ReviewForm({ tutorId }) {
    const [status, setStatus] = useState("loading"); // loading | can | already | guest | ineligible
    const [userId, setUserId] = useState(null);
    const [rating, setRating] = useState(0);
    const [hovered, setHovered] = useState(0);
    const [comment, setComment] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        fetch(`/api/review?targetId=${tutorId}`)
            .then(r => r.json())
            .then(data => {
                setUserId(data.userId);
                if (!data.userId) setStatus("guest");
                else if (data.alreadyReviewed) setStatus("already");
                else if (data.canReview) setStatus("can");
                else setStatus("ineligible");
            })
            .catch(() => setStatus("ineligible"));
    }, [tutorId]);

    const handleSubmit = async () => {
        if (!rating) { setError("Please select a star rating."); return; }
        setSubmitting(true);
        setError("");
        try {
            const res = await fetch("/api/review", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ authorId: userId, targetId: tutorId, rating, comment }),
            });
            const data = await res.json();
            if (res.ok) {
                setSubmitted(true);
            } else {
                setError(data.error || "Could not submit review. Please try again.");
            }
        } catch {
            setError("Could not connect to the server. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    if (status === "loading") return null;

    if (submitted) {
        return (
            <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-700 text-sm font-medium">
                <CheckCircle2 size={18} className="shrink-0" />
                Thank you! Your review has been submitted.
            </div>
        );
    }

    if (status === "already") {
        return (
            <p className="text-sm text-gray-400 italic">You have already reviewed this tutor.</p>
        );
    }

    if (status === "guest") {
        return (
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-600">
                <Link href="/login" className="text-blue-600 font-medium hover:underline">Log in</Link> to leave a review.
            </div>
        );
    }

    if (status === "ineligible") {
        return (
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-500">
                You can leave a review after connecting with this tutor.
            </div>
        );
    }

    // status === "can"
    return (
        <div className="space-y-4 pt-2">
            <h3 className="text-sm font-semibold text-gray-700">Write a Review</h3>

            {/* Star picker */}
            <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map(n => (
                    <button
                        key={n}
                        type="button"
                        onClick={() => setRating(n)}
                        onMouseEnter={() => setHovered(n)}
                        onMouseLeave={() => setHovered(0)}
                        className="transition-transform hover:scale-110"
                        aria-label={`Rate ${n} star${n !== 1 ? "s" : ""}`}
                    >
                        <Star
                            size={28}
                            className={(hovered || rating) >= n ? "text-amber-400 fill-amber-400" : "text-gray-300"}
                        />
                    </button>
                ))}
                {rating > 0 && (
                    <span className="ml-2 text-sm text-gray-500">
                        {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][rating]}
                    </span>
                )}
            </div>

            {/* Comment */}
            <textarea
                value={comment}
                onChange={e => setComment(e.target.value)}
                rows={3}
                maxLength={500}
                placeholder="Share your experience (optional)"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all resize-none"
            />
            <p className="text-xs text-gray-400 -mt-2 text-right">{comment.length}/500</p>

            {error && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">{error}</p>
            )}

            <button
                onClick={handleSubmit}
                disabled={submitting || !rating}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
                {submitting ? <Loader2 size={14} className="animate-spin" /> : null}
                {submitting ? "Submitting..." : "Submit Review"}
            </button>
        </div>
    );
}
