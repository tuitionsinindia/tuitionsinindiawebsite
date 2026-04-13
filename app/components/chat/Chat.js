"use client";

import { useState, useEffect, useRef } from "react";
import {
    Send,
    User,
    CheckCheck,
    Lock,
    Loader2,
    MoreHorizontal,
    WifiOff,
    BadgeCheck
} from "lucide-react";

export default function Chat({ sessionId, currentUser, recipientName }) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [online, setOnline] = useState(true);
    const messagesEndRef = useRef(null);

    // Initial load and polling
    useEffect(() => {
        if (!sessionId) return;

        fetchMessages();
        const interval = setInterval(fetchMessages, 5000);

        return () => clearInterval(interval);
    }, [sessionId]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const fetchMessages = async () => {
        try {
            const res = await fetch(`/api/chat/messages?sessionId=${sessionId}`);
            if (res.ok) {
                const data = await res.json();
                setMessages(data.messages);
                setOnline(true);
            }
        } catch (err) {
            console.error("Failed to fetch messages:", err);
            setOnline(false);
        } finally {
            setLoading(false);
        }
    };

    const handleSendMessage = async (e) => {
        if (e) e.preventDefault();
        if (!input.trim() || sending) return;

        const content = input.trim();
        setInput("");
        setSending(true);

        // Optimistic UI update
        const tempId = Date.now().toString();
        const optimisticMessage = {
            id: tempId,
            content,
            senderId: currentUser.id,
            createdAt: new Date().toISOString(),
            isOptimistic: true,
            sender: { name: currentUser.name }
        };
        setMessages(prev => [...prev, optimisticMessage]);

        try {
            const res = await fetch("/api/chat/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ sessionId, senderId: currentUser.id, content })
            });

            if (res.ok) {
                const data = await res.json();
                setMessages(prev => prev.map(m => m.id === tempId ? data.message : m));
            }
        } catch (err) {
            console.error("Failed to send message:", err);
            setOnline(false);
        } finally {
            setSending(false);
        }
    };

    if (loading && messages.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full gap-4 bg-gray-50 rounded-xl border border-gray-200">
                <Loader2 className="animate-spin text-blue-600" size={32} />
                <p className="text-sm text-gray-400">Loading messages...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-white rounded-xl border border-gray-200 overflow-hidden">

            {/* Chat header */}
            <div className="px-5 py-4 bg-white border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="size-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-base">
                        {recipientName?.[0] || <User size={20} />}
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="text-sm font-semibold text-gray-900">{recipientName || "User"}</h3>
                            <BadgeCheck size={15} className="text-blue-600" />
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <span className={`size-2 rounded-full ${online ? "bg-green-500" : "bg-red-400"}`}></span>
                            <span className="text-xs text-gray-400">
                                {online ? "Online" : "Connection lost"}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-200 text-xs text-gray-500">
                        <Lock size={12} className="text-gray-400" />
                        Messages are private
                    </div>
                    <button className="text-gray-400 hover:text-gray-600 transition-colors p-1.5">
                        <MoreHorizontal size={20} />
                    </button>
                </div>
            </div>

            {/* Message feed */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
                {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-center space-y-3 text-gray-400">
                        <div className="size-14 rounded-full bg-gray-100 flex items-center justify-center">
                            <Lock size={24} className="text-gray-300" />
                        </div>
                        <p className="text-sm text-gray-400">No messages yet. Say hello!</p>
                    </div>
                )}
                {messages.map((m, i) => {
                    const isMe = m.senderId === currentUser.id;
                    const showHeader = i === 0 || messages[i - 1].senderId !== m.senderId;

                    return (
                        <div key={m.id} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                            {showHeader && (
                                <p className="text-xs text-gray-400 mb-1 px-1">
                                    {isMe ? "You" : recipientName} &middot; {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            )}
                            <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed break-words ${
                                isMe
                                    ? "bg-blue-600 text-white rounded-tr-sm"
                                    : "bg-gray-100 text-gray-900 rounded-tl-sm"
                            } ${m.isOptimistic ? "opacity-50" : ""}`}>
                                {m.content}
                            </div>
                            {isMe && i === messages.length - 1 && !m.isOptimistic && (
                                <div className="mt-1 px-1 flex items-center gap-1 text-xs text-green-500">
                                    <CheckCheck size={12} /> Sent
                                </div>
                            )}
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Message input */}
            <div className="px-4 py-3 bg-white border-t border-gray-200 relative">
                {!online && (
                    <div className="absolute top-0 left-1/2 -translate-y-full -translate-x-1/2 mb-2 px-4 py-2 bg-red-500 text-white rounded-full text-xs font-medium flex items-center gap-2 shadow-md">
                        <WifiOff size={13} /> Connection lost. Retrying...
                    </div>
                )}

                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all placeholder:text-gray-400"
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || sending}
                        className="size-10 rounded-xl bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors disabled:opacity-40 shrink-0"
                    >
                        {sending ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                    </button>
                </form>
            </div>
        </div>
    );
}
