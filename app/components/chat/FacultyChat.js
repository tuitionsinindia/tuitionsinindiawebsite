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
    BadgeCheck
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
            <div className="flex flex-col items-center justify-center h-full gap-6 bg-background-dark/50 backdrop-blur-3xl rounded-[3rem] border border-border-dark italic">
                <div className="relative">
                    <Loader2 className="animate-spin text-indigo-500" size={48} strokeWidth={1.5} />
                    <div className="absolute inset-0 bg-indigo-500/20 blur-2xl animate-pulse rounded-full"></div>
                </div>
                <div className="text-center space-y-2">
                    <p className="text-[11px] font-black uppercase tracking-[0.5em] text-white italic">Connecting...</p>
                    <p className="text-[8px] font-black uppercase tracking-[0.3em] text-white/20">Loading messages...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-surface-dark/40 backdrop-blur-3xl rounded-[3.5rem] border border-border-dark overflow-hidden relative shadow-2xl border-b-[12px] anim-fade-in group">
            
            {/* Visual Grid Decorator */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

            {/* Tactical Header */}
            <div className="p-8 md:p-10 bg-background-dark/80 border-b border-border-dark flex items-center justify-between relative z-10">
                <div className="flex items-center gap-6">
                    <div className="size-16 rounded-[1.8rem] bg-indigo-600 text-white flex items-center justify-center font-black text-2xl italic shadow-2xl shadow-indigo-600/20 border border-white/10 group-hover:rotate-3 transition-transform">
                        {recipientName?.[0] || <User size={24} />}
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1.5">
                            <h3 className="text-xl font-black text-white uppercase italic tracking-tighter leading-none">{recipientName || "SCHOLARLY PEER"}</h3>
                            <BadgeCheck size={16} className="text-indigo-500 fill-indigo-500/10" />
                        </div>
                        <div className="flex items-center gap-2.5">
                            <div className="relative flex items-center">
                                <span className={`size-2.5 rounded-full ${online ? "bg-emerald-500" : "bg-red-500"}`}></span>
                                {online && <span className="absolute inset-0 size-2.5 bg-emerald-500 rounded-full animate-ping"></span>}
                            </div>
                            <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] italic">
                                {online ? "Secure Frequency Active" : "Link Interrupted"}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-6 text-white/20">
                    <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-white/5 rounded-xl border border-white/5 italic">
                        <Cpu size={14} className="text-indigo-500" />
                        <span className="text-[9px] font-black tracking-widest uppercase">Node_Encr: AES-256</span>
                    </div>
                    <button className="hover:text-indigo-500 transition-colors p-2"><MoreHorizontal size={24} /></button>
                </div>
            </div>

            {/* Strategic Message Feed */}
            <div className="flex-1 overflow-y-auto p-8 md:p-12 space-y-10 scrollbar-hide relative z-10">
                {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-center space-y-6 opacity-30 select-none">
                        <div className="p-10 bg-white/5 rounded-full border border-white/5 animate-pulse">
                            <Lock size={48} strokeWidth={1} />
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-[0.5em] max-w-[200px]">End-to-End Encrypted Session Initialized.</p>
                    </div>
                )}
                {messages.map((m, i) => {
                    const isMe = m.senderId === currentUser.id;
                    const showHeader = i === 0 || messages[i-1].senderId !== m.senderId;

                    return (
                        <div key={m.id} className={`flex flex-col ${isMe ? "items-end" : "items-start"} anim-slide-up`} style={{ animationDelay: `${i * 50}ms` }}>
                            {showHeader && (
                                <p className="text-[10px] font-black text-white/10 uppercase tracking-[0.3em] mb-3 px-6 italic">
                                    {isMe ? "Node_Origin" : "Node_Remote"} • {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            )}
                            <div className={`max-w-[85%] md:max-w-[70%] px-8 py-6 rounded-[2.2rem] text-[15px] font-medium leading-relaxed shadow-2xl break-words transition-all hover:scale-[1.01] relative ${
                                isMe 
                                ? "bg-indigo-600 text-white rounded-tr-none shadow-indigo-600/10 border border-white/10" 
                                : "bg-surface-dark border border-border-dark text-white/90 rounded-tl-none shadow-black/5"
                            } ${m.isOptimistic ? "opacity-50 grayscale" : ""}`}>
                                {m.content}
                            </div>
                            {isMe && i === messages.length - 1 && !m.isOptimistic && (
                                <div className="mt-3 px-2 flex items-center gap-2 text-[9px] font-black text-emerald-500 uppercase tracking-[0.3em] italic animate-in fade-in slide-in-from-right-4">
                                    <CheckCheck size={12} strokeWidth={3} /> Transmission_Confirmed
                                </div>
                            )}
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Interaction Terminal */}
            <div className="p-10 md:p-12 bg-background-dark/80 border-t border-border-dark relative z-20 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
                {!online && (
                    <div className="absolute top-0 left-1/2 -translate-y-1/2 -translate-x-1/2 px-6 py-2.5 bg-red-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-3 shadow-[0_0_30px_rgba(220,38,38,0.5)] anim-fade-in">
                        <WifiOff size={14} strokeWidth={3} className="animate-pulse" /> Signal Variance: Link Unstable
                    </div>
                )}
                
                <form onSubmit={handleSendMessage} className="relative group">
                    <input 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="INPUT SCHOLARLY DATA..."
                        className="w-full bg-background-dark/80 border-2 border-border-dark rounded-[2.5rem] pl-10 pr-24 py-7 text-white font-medium text-base focus:outline-none focus:border-indigo-500 focus:ring-[20px] focus:ring-indigo-500/5 transition-all placeholder:text-white/5 shadow-inner"
                    />
                    <button 
                        type="submit"
                        disabled={!input.trim() || sending}
                        className="absolute right-3 top-1/2 -translate-y-1/2 size-16 rounded-[1.8rem] bg-indigo-600 text-white flex items-center justify-center hover:bg-white hover:text-indigo-600 transition-all shadow-2xl active:scale-90 disabled:opacity-10 group/btn"
                    >
                        {sending ? <Loader2 className="animate-spin" size={24} /> : (
                            <Send size={28} strokeWidth={2.5} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                        )}
                    </button>
                </form>
                
                <div className="mt-8 flex items-center justify-between opacity-20 group-hover:opacity-40 transition-opacity">
                    <div className="flex items-center gap-6 text-[10px] font-black text-white uppercase tracking-[0.4em] italic leading-none">
                        <div className="flex items-center gap-2"><Lock size={12} strokeWidth={3} /> Crypt_Vault</div>
                        <div className="flex items-center gap-2"><Zap size={12} strokeWidth={3} /> Low_Lat</div>
                    </div>
                    <Activity size={16} className="text-white animate-pulse" />
                </div>
            </div>
        </div>
    );
}
