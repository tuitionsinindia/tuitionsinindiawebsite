"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    Clock, Phone, MessageCircle, LogIn, Bookmark,
    Copy, Check, ExternalLink, Loader2, Send, X
} from "lucide-react";
import TrialBookingModal from "./TrialBookingModal";
import { saveIntent, clearIntent } from "@/lib/intentStore";

// ─── Contact Details Panel ────────────────────────────────────────────────────
function ContactPanel({ tutorId, onClose }) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [limitReached, setLimitReached] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        fetch(`/api/tutor/contact?tutorId=${tutorId}`)
            .then(r => r.json())
            .then(d => {
                if (d.limitReached) {
                    setLimitReached(true);
                } else if (d.phone || d.email) {
                    setData(d);
                } else {
                    setError(d.error || "Could not load contact details.");
                }
            })
            .catch(() => setError("Something went wrong. Please try again."))
            .finally(() => setLoading(false));
    }, [tutorId]);

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }).catch(() => {});
    };

    return (
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-blue-900">Contact Details</p>
                {onClose && (
                    <button onClick={onClose} className="text-blue-400 hover:text-blue-600">
                        <X size={14} />
                    </button>
                )}
            </div>
            {loading ? (
                <div className="flex items-center gap-2 py-2">
                    <Loader2 size={16} className="animate-spin text-blue-600" />
                    <span className="text-sm text-blue-600">Loading...</span>
                </div>
            ) : limitReached ? (
                <div className="space-y-1.5">
                    <p className="text-sm font-semibold text-amber-800">Monthly limit reached</p>
                    <p className="text-xs text-amber-700 leading-relaxed">You&apos;ve used your 3 free contact views this month. Limit resets on the 1st of next month.</p>
                    <p className="text-xs text-blue-600">Tip: Book a demo class — the tutor will reach out to you.</p>
                </div>
            ) : error ? (
                <p className="text-sm text-red-500">{error}</p>
            ) : data && (
                <div className="space-y-2">
                    {data.phone && (
                        <div className="flex items-center justify-between bg-white rounded-xl px-4 py-3 border border-blue-100">
                            <div>
                                <p className="text-xs text-gray-400 mb-0.5">Phone</p>
                                <p className="font-semibold text-gray-900 text-sm">{data.phone}</p>
                            </div>
                            <div className="flex gap-1.5">
                                <button onClick={() => handleCopy(data.phone)}
                                    title="Copy number"
                                    className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                    {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                                </button>
                                {data.whatsappUrl && (
                                    <a href={data.whatsappUrl} target="_blank" rel="noreferrer"
                                        title="Open WhatsApp"
                                        className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                                        <ExternalLink size={14} />
                                    </a>
                                )}
                            </div>
                        </div>
                    )}
                    {data.email && (
                        <div className="bg-white rounded-xl px-4 py-3 border border-blue-100">
                            <p className="text-xs text-gray-400 mb-0.5">Email</p>
                            <p className="font-semibold text-gray-900 text-sm break-all">{data.email}</p>
                        </div>
                    )}
                    {data.whatsappUrl && (
                        <a href={data.whatsappUrl} target="_blank" rel="noreferrer"
                            className="flex items-center justify-center gap-2 w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold rounded-xl transition-colors">
                            <ExternalLink size={14} /> Chat on WhatsApp
                        </a>
                    )}
                    <p className="text-xs text-blue-500 text-center">No commission · Pay the tutor directly</p>
                </div>
            )}
        </div>
    );
}

// ─── Inquiry Form Panel ───────────────────────────────────────────────────────
function InquiryPanel({ tutorId, tutorName, subject, onClose }) {
    const [message, setMessage] = useState(
        subject ? `Hi, I am looking for a ${subject} tutor. Are you available? Please share your schedule and fees.` : ""
    );
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState("");

    const handleSend = async () => {
        if (!message.trim()) return;
        setSending(true);
        setError("");
        try {
            const res = await fetch("/api/inquiry", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ toTutorId: tutorId, message, subject }),
            });
            const data = await res.json();
            if (res.ok && data.success) {
                setSent(true);
            } else {
                setError(data.error || "Failed to send. Please try again.");
            }
        } catch {
            setError("Something went wrong. Please try again.");
        } finally {
            setSending(false);
        }
    };

    if (sent) {
        return (
            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 text-center">
                <div className="size-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-3">
                    <Check size={22} className="text-emerald-600" />
                </div>
                <p className="font-semibold text-gray-900 mb-1">Inquiry sent to {tutorName}!</p>
                <p className="text-xs text-gray-500">They'll receive your message and contact you shortly.</p>
                <button onClick={onClose} className="mt-3 text-xs text-emerald-600 font-medium hover:underline">Close</button>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-gray-900">Send Inquiry to {tutorName}</p>
                {onClose && (
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X size={14} />
                    </button>
                )}
            </div>
            <textarea
                value={message}
                onChange={e => setMessage(e.target.value.slice(0, 500))}
                placeholder="Hi, I need help with..."
                rows={4}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 resize-none outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            />
            <p className="text-xs text-gray-400 text-right">{message.length}/500</p>
            {error && <p className="text-xs text-red-500">{error}</p>}
            <button onClick={handleSend} disabled={!message.trim() || sending}
                className="flex items-center justify-center gap-2 w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition-colors">
                {sending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                {sending ? "Sending..." : "Send Inquiry"}
            </button>
            <p className="text-xs text-gray-400 text-center">The tutor will receive your phone number and this message.</p>
        </div>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function TutorProfileActions({ tutor, subject, offersTrialClass, trialDuration, initialAction }) {
    const router = useRouter();
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [checked, setChecked] = useState(false);
    const [trialModal, setTrialModal] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [savePending, setSavePending] = useState(false);

    // Inline panels (shown below the buttons on the profile page)
    const [showContact, setShowContact] = useState(false);
    const [showInquiry, setShowInquiry] = useState(false);

    useEffect(() => {
        fetch("/api/auth/me")
            .then(r => r.ok ? r.json() : null)
            .then(data => {
                if (data?.id) {
                    setLoggedInUser(data);
                    if (data.role === "STUDENT") {
                        fetch(`/api/saved-tutors?studentId=${data.id}`)
                            .then(r => r.ok ? r.json() : { saved: [] })
                            .then(d => setIsSaved((d.saved || []).some(t => t.id === tutor.id)))
                            .catch(() => {});
                    }
                }
            })
            .catch(() => {})
            .finally(() => {
                setChecked(true);
            });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Auto-trigger action passed from parent (after login/signup redirect)
    useEffect(() => {
        if (!checked || !loggedInUser || !initialAction) return;
        clearIntent();
        if (initialAction === "contact") setShowContact(true);
        if (initialAction === "inquiry") setShowInquiry(true);
    }, [checked, loggedInUser, initialAction]);

    const handleToggleSave = async () => {
        if (!loggedInUser || loggedInUser.role !== "STUDENT") return;
        setSavePending(true);
        try {
            if (isSaved) {
                await fetch(`/api/saved-tutors?studentId=${loggedInUser.id}&tutorId=${tutor.id}`, { method: "DELETE" });
                setIsSaved(false);
            } else {
                await fetch("/api/saved-tutors", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ studentId: loggedInUser.id, tutorId: tutor.id }),
                });
                setIsSaved(true);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setSavePending(false);
        }
    };

    const handleViewContact = () => {
        if (!loggedInUser) {
            saveIntent({ action: "contact", tutorId: tutor.id, tutorName: tutor.name, subject });
            router.push(`/register/student?intent=contact&tutorId=${tutor.id}&subject=${subject || ""}`);
            return;
        }
        setShowInquiry(false);
        setShowContact(prev => !prev);
    };

    const handleSendInquiry = () => {
        if (!loggedInUser) {
            saveIntent({ action: "inquiry", tutorId: tutor.id, tutorName: tutor.name, subject });
            router.push(`/register/student?intent=inquiry&tutorId=${tutor.id}&subject=${subject || ""}`);
            return;
        }
        setShowContact(false);
        setShowInquiry(prev => !prev);
    };

    const handleTrialClick = () => {
        if (!loggedInUser) {
            saveIntent({ action: "inquiry", tutorId: tutor.id, tutorName: tutor.name, subject });
            router.push(`/register/student?intent=trial&tutorId=${tutor.id}&subject=${subject || ""}`);
        } else if (loggedInUser.role !== "STUDENT") {
            alert("Only students can book trial classes.");
        } else {
            setTrialModal(true);
        }
    };

    if (!checked) {
        return (
            <div className="flex flex-wrap gap-2 shrink-0">
                <div className="h-10 w-32 bg-gray-100 rounded-xl animate-pulse" />
                <div className="h-10 w-28 bg-gray-100 rounded-xl animate-pulse" />
            </div>
        );
    }

    return (
        <>
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2 shrink-0">
                {/* View Contact */}
                <button
                    onClick={handleViewContact}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                        showContact
                            ? "bg-blue-700 text-white"
                            : "bg-blue-600 hover:bg-blue-700 text-white"
                    }`}
                >
                    <Phone size={14} />
                    {loggedInUser ? (showContact ? "Hide Contact" : "View Contact") : "View Contact"}
                </button>

                {/* Send Inquiry */}
                <button
                    onClick={handleSendInquiry}
                    className={`flex items-center gap-2 px-5 py-2.5 border rounded-xl text-sm font-semibold transition-colors ${
                        showInquiry
                            ? "bg-blue-100 border-blue-300 text-blue-700"
                            : "border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100"
                    }`}
                >
                    <MessageCircle size={14} />
                    Send Inquiry
                </button>

                {/* Free Trial */}
                {offersTrialClass && (
                    <button
                        onClick={handleTrialClick}
                        className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition-colors"
                    >
                        <Clock size={14} /> Book Free Trial
                    </button>
                )}

                {/* Save */}
                {loggedInUser?.role === "STUDENT" && (
                    <button
                        onClick={handleToggleSave}
                        disabled={savePending}
                        title={isSaved ? "Remove from saved" : "Save tutor"}
                        className={`flex items-center gap-2 px-4 py-2.5 border rounded-xl text-sm font-semibold transition-colors disabled:opacity-50 ${
                            isSaved ? "bg-blue-50 border-blue-200 text-blue-600" : "border-gray-200 text-gray-500 hover:bg-gray-50"
                        }`}
                    >
                        <Bookmark size={14} className={isSaved ? "fill-current" : ""} />
                        {isSaved ? "Saved" : "Save"}
                    </button>
                )}

                {/* Log In prompt */}
                {!loggedInUser && (
                    <a
                        href="/login"
                        className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors"
                    >
                        <LogIn size={14} /> Log In
                    </a>
                )}
            </div>

            {/* Inline panels — shown below buttons on profile page */}
            {showContact && loggedInUser && (
                <div className="w-full mt-2">
                    <ContactPanel
                        tutorId={tutor.id}
                        onClose={() => setShowContact(false)}
                    />
                </div>
            )}

            {showInquiry && loggedInUser && (
                <div className="w-full mt-2">
                    <InquiryPanel
                        tutorId={tutor.id}
                        tutorName={tutor.name}
                        subject={subject}
                        onClose={() => setShowInquiry(false)}
                    />
                </div>
            )}

            {trialModal && (
                <TrialBookingModal
                    tutor={{ ...tutor, trialDuration }}
                    defaultSubject={subject}
                    onClose={() => setTrialModal(false)}
                    onSuccess={() => {}}
                />
            )}
        </>
    );
}
