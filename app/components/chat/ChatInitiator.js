"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MessageSquare, Loader2, Lock, ArrowRight, MessageCircle } from "lucide-react";

export default function ChatInitiator({ studentId, tutorId, currentUser, recipientRole, label = "Send message" }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // Free users cannot start chats without unlocking first
    const isFree = currentUser?.subscriptionTier === 'FREE' || !currentUser;
    const canInitiate = !isFree || currentUser?.role === 'ADMIN';

    const handleInitiate = async () => {
        if (!studentId || !tutorId || !currentUser) return;

        if (!canInitiate) {
            router.push('/pricing');
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
                    initiatorId: currentUser.id
                })
            });

            if (res.ok) {
                const redirectPath = recipientRole === 'TUTOR'
                    ? `/dashboard/student?studentId=${studentId}&activeTab=CHAT`
                    : `/dashboard/tutor?tutorId=${tutorId}&activeTab=CHAT`;

                router.push(redirectPath);
            } else if (res.status === 403) {
                const data = await res.json();
                alert(`Access restricted: ${data.details}`);
            } else {
                const data = await res.json();
                alert(data.error || "Something went wrong. Please try again.");
            }
        } catch (err) {
            console.error("Failed to initiate chat:", err);
            alert("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (!canInitiate) {
        return (
            <div className="space-y-3">
                <button
                    onClick={handleInitiate}
                    className="w-full bg-white border border-gray-200 py-3 px-4 rounded-xl font-medium text-sm flex items-center justify-center gap-2 text-gray-400 hover:text-blue-600 hover:border-blue-300 transition-all"
                >
                    <Lock size={15} className="text-gray-300" />
                    Contact tutor
                    <ArrowRight size={14} />
                </button>
                <div className="px-4 py-3 bg-blue-50 rounded-lg border border-blue-100">
                    <p className="text-xs text-blue-600 text-center leading-relaxed">
                        Upgrade your plan to contact tutors directly.{" "}
                        <span className="font-semibold underline cursor-pointer" onClick={() => router.push('/pricing')}>View plans</span>
                    </p>
                </div>
            </div>
        );
    }

    return (
        <button
            onClick={handleInitiate}
            disabled={loading}
            className="w-full bg-blue-600 py-3 px-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 text-white hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
            {loading ? <Loader2 className="animate-spin" size={18} /> : (
                <>
                    <MessageCircle size={18} />
                    {label}
                </>
            )}
        </button>
    );
}
