"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import ChatInterface from "@/app/components/ChatInterface";

function MessagesContent() {
    const searchParams = useSearchParams();
    const studentId = searchParams.get("studentId");
    const activeChat = searchParams.get("activeChat");

    return (
        <div className="flex h-screen bg-slate-50 dark:bg-slate-950 font-sans">
            <main className="flex-1 overflow-y-auto p-10">
                <div className="max-w-4xl mx-auto">
                    <Link href={`/dashboard/student?studentId=${studentId}`} className="flex items-center gap-2 text-primary font-bold mb-8 hover:underline">
                        <span className="material-symbols-outlined text-sm">arrow_back</span> Back to Dashboard
                    </Link>

                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-10 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/20">
                        {activeChat ? (
                            <ChatInterface studentId={studentId} tutorId={activeChat} currentUserType="STUDENT" />
                        ) : (
                            <div className="text-center py-10">
                                <div className="size-20 bg-amber-500/10 rounded-full flex items-center justify-center text-amber-500 mx-auto mb-6">
                                    <span className="material-symbols-outlined text-4xl">forum</span>
                                </div>
                                <h1 className="text-3xl font-heading font-bold mb-4">Messages Inbox</h1>
                                <p className="text-slate-500 mb-8 max-w-lg mx-auto">Select a tutor from your dashboard to start a conversation, negotiate rates, and plan your curriculum.</p>

                                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-dashed border-slate-300 dark:border-slate-700 inline-block">
                                    <p className="font-semibold text-slate-500">Go to Dashboard and click 'Internal Chat'</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}

export default function Messages() {
    return (
        <Suspense fallback={<div className="p-10 text-center text-slate-500">Loading...</div>}>
            <MessagesContent />
        </Suspense>
    );
}
