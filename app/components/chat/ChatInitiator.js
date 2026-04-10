"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MessageSquare, Loader2, Lock, Zap, ArrowRight } from "lucide-react";

export default function ChatInitiator({ studentId, tutorId, currentUser, recipientRole, label = "DIRECT MESSAGE" }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // Protocol Check: Free users cannot initiate proactive neural links
    const isFree = currentUser?.subscriptionTier === 'FREE' || !currentUser;
    const canInitiate = !isFree || currentUser?.role === 'ADMIN';

    const handleInitiate = async () => {
        if (!studentId || !tutorId || !currentUser) return;
        
        if (!canInitiate) {
            router.push('/pricing'); // Redirect to upgrade protocol
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
                alert(`ACADEMY_PROTOCOL_RESTRICTION: ${data.details}`);
            } else {
                const data = await res.json();
                alert(`SYSTEM_ERROR: ${data.error || "CONNECTION_FAILED"}`);
            }
        } catch (err) {
            console.error("Failed to initiate chat:", err);
            alert("NETWORK_STABILITY_FAILURE: RE-INITIALIZE_LINK");
        } finally {
            setLoading(false);
        }
    };

    if (!canInitiate) {
        return (
            <button 
                onClick={handleInitiate}
                className="w-full bg-white/5 border border-white/10 py-6 rounded-[1.5rem] font-black text-[10px] tracking-[0.3em] uppercase flex items-center justify-center gap-4 text-white/40 hover:bg-indigo-600 hover:text-white transition-all group italic"
            >
                <Lock size={16} strokeWidth={3} className="text-indigo-500" />
                UPGRADE_TO_UNLOCK_MESSAGING
                <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </button>
        );
    }

    return (
        <button 
            onClick={handleInitiate}
            disabled={loading}
            className="w-full bg-indigo-600 border border-indigo-500 py-6 rounded-[1.5rem] font-black text-[10px] tracking-[0.4em] uppercase flex items-center justify-center gap-4 transition-all text-white hover:bg-white hover:text-indigo-600 hover:shadow-[0_0_30px_rgba(79,70,229,0.3)] shadow-2xl group disabled:opacity-50 italic"
        >
            {loading ? <Loader2 className="animate-spin" size={18} /> : (
                <>
                    <Zap size={18} fill="currentColor" strokeWidth={0} className="group-hover:scale-110 transition-transform" />
                    {label}
                </>
            )}
        </button>
    );
}
