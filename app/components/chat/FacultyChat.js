"use client";

import { useState, useEffect, useRef } from "react";
import {
    Send,
    User,
    CheckCheck,
    Loader2,
    WifiOff,
    BadgeCheck
} from "lucide-react";

export default function FacultyChat({ sessionId, currentUser, recipientName }) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [online, setOnline] = useState(true);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (!sessionId) return;
        fetchMessages();
        const interval = setInterval(fetchMessages, 5000);
        return () => clearInterval(interval);
    }, [sessionId]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => { scrollToBottom(); }, [messages]);

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
            <div className="flex flex-col items-center justify-center h-full gap-4 bg-white rounded-2xl border border-gray-200">
                <Loader2 className="animate-spin text-blue-600" size={32} />
                <p className="text-sm text-gray-400">Loading messages...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-white rounded-2xl border border-gray-200 overflow-hidden">

            {/* Header */}
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="size-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-sm">
                        {recipientName?.[0] || <User size={18} />}
                    </div>
                    <div>
                        <div className="flex items-center gap-1.5">
                            <h3 className="text-sm font-semibold text-gray-900">{recipientName || "User"}</h3>
                            <BadgeCheck size={14} className="text-blue-500" />
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <span className={`size-1.5 rounded-full ${online ? "bg-emerald-500" : "bg-gray-300"}`}></span>
                            <span className="text-[10px] text-gray-400">
                                {online ? "Online" : "Offline"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-center text-gray-300">
                        <Send size={32} className="mb-3 opacity-30" />
                        <p className="text-sm font-medium">No messages yet</p>
                        <p className="text-xs mt-1">Send a message to start the conversation.</p>
                    </div>
                )}
                {messages.map((m, i) => {
                    const isMe = m.senderId === currentUser.id;
                    const showTime = i === 0 || messages[i - 1].senderId !== m.senderId;

                    return (
                        <div key={m.id} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                            {showTime && (
                                <p className="text-[10px] text-gray-400 mb-1 px-2">
                                    {isMe ? "You" : recipientName} · {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            )}
                            <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed break-words ${
                                isMe
                                    ? "bg-blue-600 text-white rounded-br-md"
                                    : "bg-gray-100 text-gray-900 rounded-bl-md"
                            } ${m.isOptimistic ? "opacity-50" : ""}`}>
                                {m.content}
                            </div>
                            {isMe && i === messages.length - 1 && !m.isOptimistic && (
                                <div className="mt-1 px-1 flex items-center gap-1 text-[10px] text-emerald-500">
                                    <CheckCheck size={10} /> Sent
                                </div>
                            )}
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-gray-50 border-t border-gray-100">
                {!online && (
                    <div className="mb-3 flex items-center justify-center gap-2 text-xs text-red-500 font-medium">
                        <WifiOff size={12} /> Connection lost. Retrying...
                    </div>
                )}
                <form onSubmit={handleSendMessage} className="relative">
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type a message..."
                        className="w-full bg-white border border-gray-200 rounded-xl pl-4 pr-14 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all placeholder:text-gray-300"
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || sending}
                        className="absolute right-2 top-1/2 -translate-y-1/2 size-9 rounded-lg bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors active:scale-95 disabled:opacity-30"
                    >
                        {sending ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
                    </button>
                </form>
            </div>
        </div>
    );
}
