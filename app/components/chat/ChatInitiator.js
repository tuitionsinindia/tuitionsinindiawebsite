"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MessageSquare, Loader2, Lock, Zap, ArrowRight, MessageCircle } from "lucide-react";

export default function ChatInitiator({ studentId, tutorId, currentUser, recipientRole, label = "DIRECT MESSAGE" }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // Free users cannot start chats without unlocking first
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
                alert(`Access restricted: ${data.details}`);
            } else {
                const data = await res.json();
                alert(`System Error: ${data.error || "Connection failed."}`);
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
            <div className="space-y-4">
                <button 
                    onClick={handleInitiate}
                    className="w-full bg-white border border-gray-100 py-7 rounded-[2rem] font-black text-[10px] tracking-[0.4em] uppercase flex items-center justify-center gap-4 text-gray-300 hover:text-blue-600 hover:border-blue-600/20 transition-all group italic shadow-sm"
                >
                    <Lock size={16} strokeWidth={3} className="text-blue-600/30 group-hover:text-blue-600 transition-colors" />
                    Unlock Expert Dialogue
                    <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </button>
                <div className="px-6 py-4 bg-blue-50/50 rounded-2xl border border-blue-100/50">
                    <p className="text-[9px] font-black text-blue-600/60 uppercase tracking-widest text-center leading-relaxed italic">
                        Proactive neural links require <br/> <span className="text-blue-600 underline">Premium Registry Access.</span>
                    </p>
                </div>
            </div>
        );
    }

    return (
        <button 
            onClick={handleInitiate}
            disabled={loading}
            className="w-full bg-blue-600 border border-blue-600 py-7 rounded-[2rem] font-black text-[10px] tracking-[0.4em] uppercase flex items-center justify-center gap-4 transition-all text-white hover:bg-gray-900 hover:border-gray-900 hover:shadow-4xl hover:shadow-blue-900/20 shadow-2xl shadow-blue-600/20 group disabled:opacity-50 italic active:scale-95"
        >
            {loading ? <Loader2 className="animate-spin" size={20} /> : (
                <>
                    <MessageCircle size={20} strokeWidth={3} className="group-hover:rotate-12 transition-transform" />
                    {label}
                </>
            )}
        </button>
    );
}
