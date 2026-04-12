"use client";

import { useState, useEffect, useRef } from "react";

export default function ChatInterface({ studentId, tutorId, currentUserType }) {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [sessionData, setSessionData] = useState(null);
    const messagesEndRef = useRef(null);

    // 1. Initialize session
    useEffect(() => {
        const initSession = async () => {
            try {
                const res = await fetch("/api/chat/session", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                    studentId,
                    tutorId,
                    initiatorId: currentUserType === "STUDENT" ? studentId : tutorId
                })
                });
                if (res.ok) {
                    const data = await res.json();
                    setSessionData(data.session);
                    setMessages(data.session.messages || []);
                }
            } catch (err) {
                console.error("Failed to init session", err);
            } finally {
                setLoading(false);
            }
        };

        if (studentId && tutorId) {
            initSession();
        }
    }, [studentId, tutorId]);

    // 2. Poll for new messages every 3 seconds
    useEffect(() => {
        if (!sessionData?.id) return;

        const interval = setInterval(async () => {
            try {
                const res = await fetch(`/api/chat/messages?sessionId=${sessionData.id}`);
                if (res.ok) {
                    const data = await res.json();
                    if (data.messages.length > messages.length) {
                        setMessages(data.messages);
                    }
                }
            } catch (err) { }
        }, 3000);

        return () => clearInterval(interval);
    }, [sessionData?.id, messages.length]);

    // Auto scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !sessionData) return;

        const currentUserId = currentUserType === "STUDENT" ? studentId : tutorId;
        const tempMsg = {
            id: Date.now().toString(),
            content: newMessage,
            senderId: currentUserId,
            sender: { id: currentUserId, role: currentUserType },
            createdAt: new Date().toISOString()
        };

        // Optimistic UI update
        setMessages([...messages, tempMsg]);
        setNewMessage("");

        try {
            await fetch("/api/chat/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    sessionId: sessionData.id,
                    senderId: currentUserId,
                    content: tempMsg.content
                })
            });
            // We don't need to replace the local state immediately because polling fixes it
        } catch (err) {
            console.error("Message send failed", err);
        }
    };

    if (loading) {
        return (
            <div className="flex h-full items-center justify-center">
                <span className="material-symbols-outlined animate-spin text-3xl text-slate-300">refresh</span>
            </div>
        );
    }

    if (!sessionData) {
        return (
            <div className="flex h-full items-center justify-center text-slate-400 font-bold">
                Could not initiate chat session.
            </div>
        );
    }

    const otherPerson = currentUserType === "STUDENT" ? sessionData.tutor : sessionData.student;
    const currentUserId = currentUserType === "STUDENT" ? studentId : tutorId;

    return (
        <div className="flex flex-col h-[600px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xl shadow-slate-200/20">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/10">
                <div className="flex items-center gap-3">
                    <div className="size-10 rounded-full flex items-center justify-center font-bold text-white bg-blue-600">
                        {otherPerson?.name ? otherPerson.name[0].toUpperCase() : "?"}
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900 dark:text-white leading-tight">{otherPerson?.name || "User"}</h3>
                        <p className="text-xs font-semibold text-emerald-500">Online</p>
                    </div>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50 dark:bg-transparent">
                <div className="space-y-4">
                    {messages.length === 0 && (
                        <div className="text-center py-10">
                            <span className="material-symbols-outlined text-4xl text-slate-300 mb-2">forum</span>
                            <p className="text-sm font-semibold text-slate-400">This is the beginning of your conversation.</p>
                            <p className="text-xs text-slate-400 mt-1">Say hello!</p>
                        </div>
                    )}
                    {messages.map((msg, i) => {
                        const isMe = msg.senderId === currentUserId;
                        return (
                            <div key={msg.id || i} className={`w-full flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[75%] px-4 py-3 rounded-2xl ${isMe ? 'bg-blue-600 text-white rounded-br-sm' : 'bg-slate-200 text-slate-800 rounded-bl-sm'}`}>
                                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                                    <span className={`text-xs uppercase font-bold tracking-wider mt-1 block ${isMe ? 'text-blue-200 opacity-70' : 'text-slate-400'}`}>
                                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
                <form onSubmit={handleSend} className="relative flex items-center gap-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="w-full bg-slate-100 border-none rounded-full pl-6 pr-14 py-3.5 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm placeholder:font-semibold placeholder:text-slate-400"
                    />
                    <button
                        type="submit"
                        disabled={!newMessage.trim()}
                        className="absolute right-2 p-2 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        <span className="material-symbols-outlined text-[18px]">send</span>
                    </button>
                </form>
            </div>
        </div>
    );
}
