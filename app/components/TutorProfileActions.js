"use client";

import { useState, useEffect } from "react";
import { Clock, Phone, Lock, LogIn, Bookmark } from "lucide-react";
import TrialBookingModal from "./TrialBookingModal";

export default function TutorProfileActions({ tutor, subject, offersTrialClass, trialDuration }) {
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [trialModal, setTrialModal] = useState(false);
    const [checked, setChecked] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [savePending, setSavePending] = useState(false);

    useEffect(() => {
        fetch("/api/auth/me")
            .then(r => r.ok ? r.json() : null)
            .then(data => {
                if (data?.id) {
                    setLoggedInUser(data);
                    if (data.role === "STUDENT") {
                        // Check if already saved
                        fetch(`/api/saved-tutors?studentId=${data.id}`)
                            .then(r => r.ok ? r.json() : { saved: [] })
                            .then(d => setIsSaved((d.saved || []).some(t => t.id === tutor.id)))
                            .catch(() => {});
                    }
                }
            })
            .catch(() => {})
            .finally(() => setChecked(true));
    }, []);

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
        } catch (err) { console.error(err); } finally { setSavePending(false); }
    };

    const handleContactClick = () => {
        if (!loggedInUser) {
            window.location.href = `/register/student?intent=unlock&tutorId=${tutor.id}&subject=${subject || ""}`;
        } else {
            window.location.href = `/dashboard/student?studentId=${loggedInUser.id}`;
        }
    };

    const handleTrialClick = () => {
        if (!loggedInUser) {
            window.location.href = `/register/student?intent=trial&tutorId=${tutor.id}&subject=${subject || ""}`;
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
            </div>
        );
    }

    return (
        <>
            <div className="flex flex-wrap gap-2 shrink-0">
                <button
                    onClick={handleContactClick}
                    className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors"
                >
                    {loggedInUser ? <><Lock size={14} /> Unlock Contact</> : <><Phone size={14} /> Contact Tutor</>}
                </button>

                {offersTrialClass && (
                    <button
                        onClick={handleTrialClick}
                        className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-colors"
                    >
                        <Clock size={14} /> Book Free Trial
                    </button>
                )}

                {loggedInUser?.role === "STUDENT" && (
                    <button
                        onClick={handleToggleSave}
                        disabled={savePending}
                        title={isSaved ? "Remove from saved" : "Save tutor"}
                        className={`flex items-center gap-2 px-4 py-2.5 border rounded-xl text-sm font-semibold transition-colors disabled:opacity-50 ${isSaved ? "bg-blue-50 border-blue-200 text-blue-600" : "border-gray-200 text-gray-500 hover:bg-gray-50"}`}
                    >
                        <Bookmark size={14} className={isSaved ? "fill-current" : ""} />
                        {isSaved ? "Saved" : "Save"}
                    </button>
                )}

                {!loggedInUser && (
                    <a
                        href="/login"
                        className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors"
                    >
                        <LogIn size={14} /> Log In
                    </a>
                )}
            </div>

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
