"use client";

import { useState, useEffect, useRef } from "react";
import { 
    Send, 
    User, 
    Clock, 
    CheckCheck, 
    ShieldCheck, 
    Lock, 
    Loader2, 
    MoreHorizontal,
    Wifi,
    WifiOff,
    Zap,
    Activity,
    Cpu,
    BadgeCheck,
    MessageCircle
} from "lucide-react";

export default function FacultyChat({ sessionId, currentUser, recipientName }) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [online, setOnline] = useState(true);
    const messagesEndRef = useRef(null);

    // Initial load and Polling
    useEffect(() => {
        if (!sessionId) return;
        
        fetchMessages();
        const interval = setInterval(fetchMessages, 5000); // 5s Intelligent Polling
        
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

        // Optimistic UI Update
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
            <div className="flex flex-col items-center justify-center h-full gap-8 bg-gray-50/50 backdrop-blur-3xl rounded-[3.5rem] border border-gray-100 italic">
                <div className="relative">
                    <Loader2 className="animate-spin text-blue-600" size={64} strokeWidth={3} />
                    <div className="absolute inset-0 bg-blue-600/10 blur-3xl animate-pulse rounded-full scale-150"></div>
                </div>
                <div className="text-center space-y-3">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-900 italic">Synchronizing Dialogue...</p>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300">Initializing Secure Node Link</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-white backdrop-blur-3xl rounded-[3.5rem] border border-gray-100 overflow-hidden relative shadow-4xl shadow-blue-900/[0.03] border-b-[12px] border-blue-600 anim-fade-in group">
            
            {/* Tactical Identity Header */}
            <div className="p-8 md:p-12 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between relative z-10 shadow-sm">
                <div className="flex items-center gap-6">
                    <div className="size-16 rounded-[1.8rem] bg-blue-600 text-white flex items-center justify-center font-black text-2xl italic shadow-2xl shadow-blue-600/20 border border-blue-400/20 group-hover:rotate-6 transition-transform">
                        {recipientName?.[0] || <User size={28} />}
                    </div>
                    <div>
                        <div className="flex items-center gap-3 mb-1.5">
                            <h3 className="text-xl font-black text-gray-900 uppercase italic tracking-tighter leading-none">{recipientName || "Scholarly Node"}</h3>
                            <BadgeCheck size={18} className="text-blue-600" />
                        </div>
                        <div className="flex items-center gap-2.5">
                            <div className="relative flex items-center">
                                <span className={`size-2.5 rounded-full ${online ? "bg-emerald-500" : "bg-red-500"}`}></span>
                                {online && <span className="absolute inset-0 size-2.5 bg-emerald-500 rounded-full animate-ping"></span>}
                            </div>
                            <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] italic">
                                {online ? "Registry Link Active" : "Synchronization Suspended"}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-6 text-gray-200">
                    <div className="hidden md:flex items-center gap-3 px-5 py-2.5 bg-white rounded-xl border border-gray-100 shadow-sm italic">
                        <Cpu size={14} className="text-blue-600" strokeWidth={3} />
                        <span className="text-[10px] font-black tracking-widest uppercase text-gray-300">SECURE_SYNC: AES_256</span>
                    </div>
                    <button className="hover:text-blue-600 transition-colors p-2"><MoreHorizontal size={24} /></button>
                </div>
            </div>

            {/* Scholarly Dialogue Feed */}
            <div className="flex-1 overflow-y-auto p-10 md:p-14 space-y-12 scrollbar-hide relative z-10">
                {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-center space-y-8 opacity-20 select-none">
                        <div className="p-12 bg-gray-50 rounded-full border border-gray-100 animate-pulse relative">
                             <div className="absolute inset-0 bg-blue-600/5 blur-3xl rounded-full scale-150"></div>
                             <Lock size={64} strokeWidth={1} className="text-gray-300" />
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-[0.6em] max-w-[240px] leading-relaxed italic">Institutional Dialogue Link Established. End-to-End Encryption Active.</p>
                    </div>
                )}
                {messages.map((m, i) => {
                    const isMe = m.senderId === currentUser.id;
                    const showHeader = i === 0 || messages[i-1].senderId !== m.senderId;

                    return (
                        <div key={m.id} className={`flex flex-col ${isMe ? "items-end" : "items-start"} anim-slide-up`} style={{ animationDelay: `${i * 50}ms` }}>
                            {showHeader && (
                                <p className="text-[10px] font-black text-gray-200 uppercase tracking-[0.4em] mb-4 px-8 italic">
                                    {isMe ? "Node_Origin" : "Node_Remote"} • {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            )}
                            <div className={`max-w-[85%] md:max-w-[75%] px-10 py-7 rounded-[2.8rem] text-[15px] font-semibold leading-relaxed shadow-4xl break-words transition-all hover:scale-[1.01] relative border ${
                                isMe 
                                ? "bg-blue-600 text-white rounded-tr-none border-blue-600 shadow-blue-600/10 italic" 
                                : "bg-gray-50 border-gray-100 text-gray-900 rounded-tl-none shadow-blue-900/[0.02]"
                            } ${m.isOptimistic ? "opacity-30 grayscale" : ""}`}>
                                {m.content}
                            </div>
                            {isMe && i === messages.length - 1 && !m.isOptimistic && (
                                <div className="mt-4 px-4 flex items-center gap-2 text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] italic animate-in fade-in slide-in-from-right-4">
                                    <CheckCheck size={14} strokeWidth={3} /> Synchronized
                                </div>
                            )}
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-12 md:p-14 bg-gray-50/50 border-t border-gray-100 relative z-20 shadow-inner">
                {!online && (
                    <div className="absolute top-0 left-1/2 -translate-y-1/2 -translate-x-1/2 px-8 py-3 bg-red-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-3 shadow-2xl anim-fade-in border-4 border-white">
                        <WifiOff size={16} strokeWidth={3} className="animate-pulse" /> Connection lost. Retrying...
                    </div>
                )}
                
                <form onSubmit={handleSendMessage} className="relative group">
                    <input 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="INPUT SCHOLARLY DATA..."
                        className="w-full bg-white border-2 border-gray-100 rounded-[2.8rem] px-12 py-8 text-gray-900 font-bold text-base focus:outline-none focus:border-blue-600 focus:ring-[24px] focus:ring-blue-600/5 transition-all placeholder:text-gray-200 shadow-xl italic"
                    />
                    <button 
                        type="submit"
                        disabled={!input.trim() || sending}
                        className="absolute right-4 top-1/2 -translate-y-1/2 size-16 rounded-[2rem] bg-blue-600 text-white flex items-center justify-center hover:bg-gray-900 transition-all shadow-2xl active:scale-90 disabled:opacity-10 group/btn"
                    >
                        {sending ? <Loader2 className="animate-spin" size={24} /> : (
                            <Send size={28} strokeWidth={3} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                        )}
                    </button>
                </form>
                
                <div className="mt-10 flex items-center justify-between opacity-10 group-hover:opacity-30 transition-opacity">
                    <div className="flex items-center gap-8 text-[10px] font-black text-gray-900 uppercase tracking-[0.5em] italic leading-none">
                        <div className="flex items-center gap-2"><Lock size={12} strokeWidth={3} /> Secure_Vault</div>
                        <div className="flex items-center gap-2"><Zap size={12} strokeWidth={3} fill="currentColor" /> High_Bandwidth</div>
                    </div>
                    <Activity size={18} className="text-blue-600 animate-pulse" strokeWidth={3} />
                </div>
            </div>
        </div>
    );
}
