"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MessageCircle, Loader2, Lock } from "lucide-react";

export default function ChatInitiator({ studentId, tutorId, currentUser, recipientRole, label = "Send Message" }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleInitiate = async () => {
        // Not logged in — redirect to register/login
        if (!studentId || !tutorId) {
            router.push('/register/student');
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("/api/chat/session", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    studentId,
                    tutorId,
                    initiatorId: currentUser?.id || studentId
                })
            });

            if (res.ok) {
                const redirectPath = recipientRole === 'TUTOR'
                    ? `/dashboard/student?studentId=${studentId}&activeTab=CHAT`
                    : `/dashboard/tutor?tutorId=${tutorId}&activeTab=CHAT`;
                router.push(redirectPath);
            } else if (res.status === 403) {
                router.push('/pricing?reason=chat');
            } else {
                const data = await res.json();
                alert(data.error || "Could not start conversation. Please try again.");
            }
        } catch (err) {
            console.error("Failed to initiate chat:", err);
            alert("Something went wrong. Please check your connection and try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleInitiate}
            disabled={loading}
            className="w-full border border-gray-200 bg-white text-gray-700 py-3 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
        >
            {loading ? (
                <Loader2 className="animate-spin" size={16} />
            ) : (
                <>
                    <MessageCircle size={16} />
                    {label}
                </>
            )}
        </button>
    );
}
