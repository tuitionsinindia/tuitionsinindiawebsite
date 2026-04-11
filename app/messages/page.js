"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Send, ArrowLeft, MessageCircle, Loader2, Search } from "lucide-react";

function MessagesContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const userId = searchParams.get("userId");
    const preselect = searchParams.get("sessionId");

    const [sessions, setSessions] = useState([]);
    const [selectedSession, setSelectedSession] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [loadingSessions, setLoadingSessions] = useState(true);
    const [sendingMessage, setSendingMessage] = useState(false);
    const [search, setSearch] = useState("");
    const messagesEndRef = useRef(null);
    const pollRef = useRef(null);

    // Load sessions
    useEffect(() => {
        if (!userId) return;
        const fetchSessions = async () => {
            try {
                const res = await fetch(`/api/chat/session?userId=${userId}`);
                if (res.ok) {
                    const data = await res.json();
                    setSessions(data.sessions || []);
                    // Pre-select if sessionId in URL
                    if (preselect) {
                        const found = data.sessions?.find(s => s.id === preselect);
                        if (found) selectSession(found);
                    }
                }
            } catch (err) {
                console.error("Failed to fetch sessions", err);
            } finally {
                setLoadingSessions(false);
            }
        };
        fetchSessions();
    }, [userId]);

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Poll for new messages
    useEffect(() => {
        if (!selectedSession) return;
        pollRef.current = setInterval(async () => {
            try {
                const res = await fetch(`/api/chat/messages?sessionId=${selectedSession.id}`);
                if (res.ok) {
                    const data = await res.json();
                    setMessages(data.messages || []);
                }
            } catch (err) {}
        }, 3000);
        return () => clearInterval(pollRef.current);
    }, [selectedSession?.id]);

    const selectSession = async (session) => {
        setSelectedSession(session);
        clearInterval(pollRef.current);
        try {
            const res = await fetch(`/api/chat/messages?sessionId=${session.id}`);
            if (res.ok) {
                const data = await res.json();
                setMessages(data.messages || []);
            }
        } catch (err) {}
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedSession || !userId) return;

        setSendingMessage(true);
        const content = newMessage.trim();
        setNewMessage("");

        // Optimistic update
        setMessages(prev => [...prev, {
            id: Date.now().toString(),
            content,
            senderId: userId,
            sender: { id: userId },
            createdAt: new Date().toISOString()
        }]);

        try {
            await fetch("/api/chat/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ sessionId: selectedSession.id, senderId: userId, content })
            });
        } catch (err) {
            console.error("Send failed", err);
        } finally {
            setSendingMessage(false);
        }
    };

    if (!userId) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <MessageCircle size={48} className="text-gray-200 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">Please log in to view your messages.</p>
                    <Link href="/login" className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors">Log In</Link>
                </div>
            </div>
        );
    }

    const filteredSessions = sessions.filter(s => {
        const other = s.studentId === userId ? s.tutor : s.student;
        return !search || other?.name?.toLowerCase().includes(search.toLowerCase());
    });

    const getOther = (session) => session.studentId === userId ? session.tutor : session.student;
    const getLastMessage = (session) => session.messages?.[0];

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Top bar */}
            <div className="bg-white border-b border-gray-200 py-4 px-6 flex items-center justify-between sticky top-0 z-20">
                <div className="flex items-center gap-3">
                    <Link href={`/dashboard/student?studentId=${userId}`} className="text-gray-400 hover:text-gray-700 transition-colors">
                        <ArrowLeft size={18} />
                    </Link>
                    <h1 className="text-lg font-semibold text-gray-900">Messages</h1>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden" style={{ height: "calc(100vh - 65px)" }}>

                {/* Sidebar */}
                <div className="w-80 bg-white border-r border-gray-200 flex flex-col shrink-0">
                    <div className="p-3 border-b border-gray-100">
                        <div className="relative">
                            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search conversations..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        {loadingSessions ? (
                            <div className="flex items-center justify-center h-20">
                                <Loader2 size={20} className="animate-spin text-gray-300" />
                            </div>
                        ) : filteredSessions.length === 0 ? (
                            <div className="text-center py-12 px-6">
                                <MessageCircle size={32} className="text-gray-200 mx-auto mb-3" />
                                <p className="text-sm text-gray-400">No conversations yet</p>
                            </div>
                        ) : filteredSessions.map(session => {
                            const other = getOther(session);
                            const lastMsg = getLastMessage(session);
                            const isSelected = selectedSession?.id === session.id;
                            return (
                                <button
                                    key={session.id}
                                    onClick={() => selectSession(session)}
                                    className={`w-full text-left px-4 py-3.5 flex items-start gap-3 hover:bg-gray-50 transition-colors border-b border-gray-50 ${isSelected ? "bg-blue-50 border-l-2 border-l-blue-600" : ""}`}
                                >
                                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold text-sm shrink-0">
                                        {(other?.name || "?")[0].toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-baseline mb-0.5">
                                            <span className="font-medium text-sm text-gray-900 truncate">{other?.name || "User"}</span>
                                            {lastMsg && (
                                                <span className="text-xs text-gray-400 shrink-0 ml-2">
                                                    {new Date(lastMsg.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                                                </span>
                                            )}
                                        </div>
                                        {lastMsg && (
                                            <p className="text-xs text-gray-500 truncate">{lastMsg.content}</p>
                                        )}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Chat area */}
                {selectedSession ? (
                    <div className="flex-1 flex flex-col bg-white">
                        {/* Chat header */}
                        <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-3 bg-white shrink-0">
                            <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold text-sm">
                                {(getOther(selectedSession)?.name || "?")[0].toUpperCase()}
                            </div>
                            <div>
                                <p className="font-semibold text-sm text-gray-900">{getOther(selectedSession)?.name || "User"}</p>
                                <p className="text-xs text-gray-400 capitalize">{getOther(selectedSession)?.role?.toLowerCase()}</p>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
                            {messages.length === 0 && (
                                <div className="text-center py-16">
                                    <MessageCircle size={32} className="text-gray-200 mx-auto mb-3" />
                                    <p className="text-sm text-gray-400">No messages yet. Say hello!</p>
                                </div>
                            )}
                            {messages.map((msg, i) => {
                                const isMe = msg.senderId === userId;
                                return (
                                    <div key={msg.id || i} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                                        <div className={`max-w-[70%] px-4 py-2.5 rounded-2xl ${isMe ? "bg-blue-600 text-white rounded-br-sm" : "bg-white text-gray-800 rounded-bl-sm border border-gray-200"}`}>
                                            <p className="text-sm leading-relaxed">{msg.content}</p>
                                            <p className={`text-xs mt-1 ${isMe ? "text-blue-200" : "text-gray-400"}`}>
                                                {new Date(msg.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <form onSubmit={handleSend} className="px-4 py-4 bg-white border-t border-gray-200 flex items-center gap-3 shrink-0">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={e => setNewMessage(e.target.value)}
                                placeholder="Type a message..."
                                className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300"
                            />
                            <button
                                type="submit"
                                disabled={!newMessage.trim() || sendingMessage}
                                className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors disabled:opacity-40 shrink-0"
                            >
                                {sendingMessage ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                            </button>
                        </form>
                    </div>
                ) : (
                    <div className="flex-1 flex items-center justify-center bg-gray-50">
                        <div className="text-center">
                            <MessageCircle size={48} className="text-gray-200 mx-auto mb-4" />
                            <p className="text-gray-500 text-sm">Select a conversation to start messaging</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function MessagesPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 size={24} className="animate-spin text-gray-300" /></div>}>
            <MessagesContent />
        </Suspense>
    );
}
