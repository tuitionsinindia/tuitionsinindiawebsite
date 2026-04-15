"use client";

import { useState, useEffect } from "react";
import { Clock, Phone, Lock, LogIn } from "lucide-react";
import TrialBookingModal from "./TrialBookingModal";

export default function TutorProfileActions({ tutor, subject, offersTrialClass, trialDuration }) {
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [trialModal, setTrialModal] = useState(false);
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        fetch("/api/auth/me")
            .then(r => r.ok ? r.json() : null)
            .then(data => { if (data?.id) setLoggedInUser(data); })
            .catch(() => {})
            .finally(() => setChecked(true));
    }, []);

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
