"use client";
import { useState, useEffect, useCallback } from "react";
import {
    CheckCircle2,
    Clock,
    Phone,
    Mail,
    Video,
    ThumbsUp,
    ThumbsDown,
    Loader2,
    Star,
    ArrowRight,
    AlertCircle,
} from "lucide-react";
import Link from "next/link";

export default function VipStudentTab({ studentId }) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [responding, setResponding] = useState(false);
    const [confirming, setConfirming] = useState(false);
    const [rejectNote, setRejectNote] = useState("");
    const [showRejectForm, setShowRejectForm] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const fetchData = useCallback(async () => {
        try {
            const res = await fetch("/api/vip/application");
            if (res.ok) {
                const json = await res.json();
                setData(json);
            } else {
                setData(null);
            }
        } catch {
            setData(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const getCurrentMatch = () => {
        if (!data?.application?.matches?.length) return null;
        const eligible = data.application.matches.filter(
            (m) => m.status === "SENT" || m.status === "ACCEPTED"
        );
        if (!eligible.length) return null;
        return eligible.reduce((best, m) =>
            m.recommendationNumber > best.recommendationNumber ? m : best
        );
    };

    const handleRespond = async (response) => {
        setResponding(true);
        setError("");
        const match = getCurrentMatch();
        if (!match) { setResponding(false); return; }
        try {
            const res = await fetch("/api/vip/match/respond", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ matchId: match.id, response, note: rejectNote }),
            });
            if (res.ok) {
                setSuccess(
                    response === "ACCEPTED"
                        ? "Your intro call link is being sent to your email."
                        : "We're finding you another match. Please check back soon."
                );
                setShowRejectForm(false);
                setRejectNote("");
                setTimeout(() => { setSuccess(""); fetchData(); }, 2500);
            } else {
                const json = await res.json();
                setError(json.error || "Something went wrong. Please try again.");
            }
        } catch {
            setError("Something went wrong. Please try again.");
        }
        setResponding(false);
    };

    const handleConfirm = async () => {
        setConfirming(true);
        setError("");
        const match = getCurrentMatch();
        if (!match) { setConfirming(false); return; }
        try {
            const res = await fetch("/api/vip/match/confirm", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ matchId: match.id }),
            });
            if (res.ok) {
                setSuccess("Tutor confirmed! Contact details have been sent to your email.");
                setTimeout(() => { setSuccess(""); fetchData(); }, 2500);
            } else {
                const json = await res.json();
                setError(json.error || "Something went wrong. Please try again.");
            }
        } catch {
            setError("Something went wrong. Please try again.");
        }
        setConfirming(false);
    };

    // --- Loading skeleton ---
    if (loading) {
        return (
            <div className="space-y-4 animate-pulse">
                <div className="h-6 bg-gray-100 rounded-xl w-48" />
                <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
                    <div className="h-5 bg-gray-100 rounded w-3/4" />
                    <div className="h-4 bg-gray-100 rounded w-1/2" />
                    <div className="h-4 bg-gray-100 rounded w-2/3" />
                    <div className="h-10 bg-gray-100 rounded-xl w-32 mt-2" />
                </div>
            </div>
        );
    }

    const application = data?.application;

    // --- No application ---
    if (!application) {
        return (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center max-w-md mx-auto">
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Star className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-1">You haven't enrolled in VIP yet</h3>
                <p className="text-sm text-gray-500 mb-5">
                    Our team handpicks tutors for you, monitors the intro call, and gives you up to 3 replacements.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                        href="/vip"
                        className="text-sm text-blue-600 hover:underline font-medium"
                    >
                        Learn more
                    </Link>
                    <Link
                        href="/vip/apply"
                        className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
                    >
                        Enroll now — ₹2,000
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        );
    }

    // --- Pending payment ---
    if (application.status === "PENDING_PAYMENT") {
        return (
            <div className="bg-white rounded-2xl border border-amber-200 shadow-sm p-6 max-w-md">
                <div className="flex items-start gap-3 mb-4">
                    <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                        <h3 className="text-base font-semibold text-gray-900 mb-1">Complete your payment</h3>
                        <p className="text-sm text-gray-500">
                            Your application is saved. Pay ₹2,000 to activate it and we'll start finding your tutor.
                        </p>
                    </div>
                </div>
                <Link
                    href="/vip/apply"
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
                >
                    Finish and pay
                    <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        );
    }

    // --- Refunded ---
    if (application.status === "REFUNDED") {
        return (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 max-w-md">
                <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                    <div>
                        <h3 className="text-base font-semibold text-gray-900 mb-1">Refund processed</h3>
                        <p className="text-sm text-gray-500">
                            Your VIP enrollment fee has been refunded. It should appear in your account within 5–7 business days.
                            If you need help, write to us at support@tuitionsinindia.com.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // --- Matched (confirmed tutor) ---
    if (application.status === "MATCHED") {
        const contract = application.contract;
        // Find the accepted match to get tutor contact info (revealed by API when MATCHED)
        const acceptedMatch = application.matches?.find(m => m.status === "ACCEPTED");
        const tutorName = acceptedMatch?.tutor?.name;
        const tutorPhone = acceptedMatch?.tutor?.phone;
        const tutorEmail = acceptedMatch?.tutor?.email;
        const tutorSubjects = acceptedMatch?.tutor?.tutorListing?.subjects;
        const monthlyFee = contract?.monthlyFee ? Math.round(contract.monthlyFee / 100) : null;
        return (
            <div className="space-y-4 max-w-lg">
                <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <h3 className="text-base font-semibold text-gray-900">Your tutor is confirmed</h3>
                </div>

                <div className="bg-white rounded-2xl border border-green-100 shadow-sm p-5 space-y-4">
                    <div>
                        <p className="text-xs text-gray-400 mb-0.5">Tutor</p>
                        <p className="text-base font-semibold text-gray-900">{tutorName || "Your tutor"}</p>
                        {tutorSubjects?.length > 0 && (
                            <p className="text-sm text-gray-500">{tutorSubjects.join(", ")}</p>
                        )}
                    </div>

                    <div className="border-t border-gray-100 pt-4 space-y-2">
                        <p className="text-xs font-semibold text-gray-500 mb-2">Contact details</p>
                        {tutorPhone && (
                            <a href={`tel:${tutorPhone}`}
                                className="flex items-center gap-2 text-sm text-gray-700 hover:text-blue-600">
                                <Phone className="w-4 h-4 text-gray-400" />
                                {tutorPhone}
                            </a>
                        )}
                        {tutorEmail && (
                            <a href={`mailto:${tutorEmail}`}
                                className="flex items-center gap-2 text-sm text-gray-700 hover:text-blue-600">
                                <Mail className="w-4 h-4 text-gray-400" />
                                {tutorEmail}
                            </a>
                        )}
                        {monthlyFee && (
                            <p className="text-sm text-gray-600">
                                Agreed monthly budget: <span className="font-semibold text-gray-900">₹{monthlyFee.toLocaleString("en-IN")}</span>
                            </p>
                        )}
                    </div>
                    <p className="text-xs text-gray-400 bg-gray-50 rounded-xl px-3 py-2">
                        Full contact details have also been sent to your email.
                    </p>
                </div>
            </div>
        );
    }

    // --- Active (receiving matches) ---
    const currentMatch = getCurrentMatch();
    const totalMatches = application.matches?.length || 0;
    const replacementsUsed = Math.max(0, totalMatches - 1);
    const replacementsRemaining = Math.max(0, 3 - replacementsUsed);

    return (
        <div className="space-y-4 max-w-lg">
            <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-gray-900">Your VIP match</h3>
                <span className="text-xs text-gray-400 bg-gray-100 rounded-full px-3 py-1">
                    Recommendation {currentMatch?.recommendationNumber || 1} of 5 · {replacementsRemaining} replacements remaining
                </span>
            </div>

            {/* Status alerts */}
            {success && (
                <div className="flex items-start gap-2 bg-green-50 border border-green-100 rounded-xl px-4 py-3">
                    <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                    <p className="text-sm text-green-700">{success}</p>
                </div>
            )}
            {error && (
                <div className="flex items-start gap-2 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                    <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <p className="text-sm text-red-600">{error}</p>
                </div>
            )}

            {!currentMatch ? (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center">
                    <Clock className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm font-medium text-gray-700 mb-1">Finding your tutor</p>
                    <p className="text-sm text-gray-500">
                        Our team is reviewing your requirements and will send you a recommendation within 24 hours.
                    </p>
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
                    {/* Tutor info */}
                    <div>
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <p className="text-base font-semibold text-gray-900">{currentMatch.tutor?.name || "Your matched tutor"}</p>
                                {currentMatch.tutor?.tutorListing?.subjects?.length > 0 && (
                                    <p className="text-sm text-gray-500 mt-0.5">
                                        {currentMatch.tutor.tutorListing.subjects.join(", ")}
                                    </p>
                                )}
                            </div>
                            <span
                                className={`text-xs font-medium px-2.5 py-1 rounded-full shrink-0 ${
                                    currentMatch.status === "ACCEPTED"
                                        ? "bg-green-100 text-green-700"
                                        : "bg-blue-100 text-blue-700"
                                }`}
                            >
                                {currentMatch.status === "ACCEPTED" ? "Accepted" : "New match"}
                            </span>
                        </div>

                        <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-600">
                            {currentMatch.tutor?.tutorListing?.locations?.[0] && (
                                <span>{currentMatch.tutor.tutorListing.locations[0]}</span>
                            )}
                            {currentMatch.tutor?.tutorListing?.experience > 0 && (
                                <span>{currentMatch.tutor.tutorListing.experience} years experience</span>
                            )}
                            {currentMatch.tutor?.tutorListing?.hourlyRate > 0 && (
                                <span>₹{currentMatch.tutor.tutorListing.hourlyRate}/hr</span>
                            )}
                        </div>
                    </div>

                    <div className="border-t border-gray-100 pt-4">
                        {/* SENT state — accept or decline */}
                        {currentMatch.status === "SENT" && !showRejectForm && (
                            <div className="flex gap-3">
                                <button
                                    onClick={() => handleRespond("ACCEPTED")}
                                    disabled={responding}
                                    className="flex-1 inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors"
                                >
                                    {responding ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <ThumbsUp className="w-4 h-4" />
                                    )}
                                    Accept
                                </button>
                                <button
                                    onClick={() => setShowRejectForm(true)}
                                    disabled={responding}
                                    className="flex-1 inline-flex items-center justify-center gap-2 border border-gray-200 text-gray-600 hover:border-gray-300 hover:text-gray-800 text-sm font-medium py-2.5 rounded-xl transition-colors"
                                >
                                    <ThumbsDown className="w-4 h-4" />
                                    Decline
                                </button>
                            </div>
                        )}

                        {/* Decline form */}
                        {currentMatch.status === "SENT" && showRejectForm && (
                            <div className="space-y-3">
                                <label className="block text-sm font-semibold text-gray-700">
                                    Why are you declining? <span className="text-gray-400 font-normal">(optional)</span>
                                </label>
                                <textarea
                                    rows={3}
                                    value={rejectNote}
                                    onChange={(e) => setRejectNote(e.target.value)}
                                    placeholder="e.g. Location doesn't work, looking for more experience in IIT-JEE coaching…"
                                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 placeholder-gray-400 resize-none"
                                />
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => handleRespond("REJECTED")}
                                        disabled={responding}
                                        className="flex-1 inline-flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 text-sm font-semibold py-2.5 rounded-xl transition-colors"
                                    >
                                        {responding && <Loader2 className="w-4 h-4 animate-spin" />}
                                        Confirm decline
                                    </button>
                                    <button
                                        onClick={() => { setShowRejectForm(false); setRejectNote(""); }}
                                        className="text-sm text-gray-500 hover:text-gray-700 font-medium px-4"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* ACCEPTED state — intro call + confirm */}
                        {currentMatch.status === "ACCEPTED" && (
                            <div className="space-y-3">
                                {currentMatch.introCallUrl && (
                                    <a
                                        href={currentMatch.introCallUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold py-2.5 px-4 rounded-xl transition-colors w-full"
                                    >
                                        <Video className="w-4 h-4" />
                                        Join intro call
                                    </a>
                                )}
                                <button
                                    onClick={handleConfirm}
                                    disabled={confirming}
                                    className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-sm font-semibold py-2.5 px-4 rounded-xl transition-colors w-full"
                                >
                                    {confirming ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <CheckCircle2 className="w-4 h-4" />
                                    )}
                                    Confirm this tutor
                                </button>
                                <p className="text-xs text-center text-gray-400">
                                    Had the call and happy with the tutor? Click confirm to get their contact details.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Info blurb */}
            <div className="bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
                <p className="text-xs text-gray-500">
                    You can decline up to 3 tutors. After 3 declines, our team will review your case and may issue a partial refund if we're unable to find a suitable match.
                </p>
            </div>
        </div>
    );
}
