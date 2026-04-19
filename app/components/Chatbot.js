"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { MessageCircle, X, Send, Loader2, ShieldCheck } from "lucide-react";

const STORAGE_KEY = "ti_chatbot_messages";
const CONTEXT_STORAGE_KEY = "ti_chatbot_context";

// Paths where the bot should not appear (admin, onboarding forms that fight
// for attention). Global everywhere else.
const HIDDEN_PATH_PREFIXES = ["/dashboard/admin", "/admin/"];

export default function Chatbot() {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [userContext, setUserContext] = useState(null);
    const scrollRef = useRef(null);
    const inputRef = useRef(null);

    // Hide on admin and similar paths.
    const isHidden = HIDDEN_PATH_PREFIXES.some((p) => pathname?.startsWith(p));

    // Fetch session info once so the bot knows if the user is logged in.
    useEffect(() => {
        fetch("/api/auth/session", { credentials: "include" })
            .then((r) => (r.ok ? r.json() : null))
            .then((data) => {
                if (data?.user) {
                    setUserContext({
                        userName: data.user.name,
                        userEmail: data.user.email,
                        userPhone: data.user.phone,
                    });
                }
            })
            .catch(() => {});
    }, []);

    // Restore transcript from sessionStorage (per-tab) so a reload keeps context.
    useEffect(() => {
        try {
            const saved = sessionStorage.getItem(STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed)) setMessages(parsed);
            }
        } catch {}
    }, []);

    useEffect(() => {
        try {
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
        } catch {}
    }, [messages]);

    // Auto-scroll on new message.
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, loading, open]);

    // Focus input when opening.
    useEffect(() => {
        if (open && inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [open]);

    const sendMessage = async (text) => {
        const trimmed = text.trim();
        if (!trimmed || loading) return;

        const nextMessages = [...messages, { role: "user", content: trimmed }];
        setMessages(nextMessages);
        setInput("");
        setLoading(true);

        try {
            const res = await fetch("/api/chatbot/message", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    messages: nextMessages,
                    context: {
                        pathname: pathname || "",
                        ...(userContext || {}),
                    },
                }),
            });
            const data = await res.json();
            if (data.success) {
                setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
            } else {
                setMessages((prev) => [
                    ...prev,
                    {
                        role: "assistant",
                        content:
                            data.error ||
                            "Sorry, something went wrong. Please try again, or use the contact form at the bottom of the page.",
                    },
                ]);
            }
        } catch {
            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content:
                        "I'm having trouble connecting. Please try again in a moment.",
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        sendMessage(input);
    };

    const clearChat = () => {
        setMessages([]);
        try { sessionStorage.removeItem(STORAGE_KEY); } catch {}
    };

    if (isHidden) return null;

    // Suggested openers — only shown when the chat is empty.
    const openers = userContext
        ? [
            "How do I unlock a student lead?",
            "How do I get verified?",
            "My payment isn't showing up",
        ]
        : [
            "I need a Maths tutor in Delhi",
            "How much does it cost?",
            "Are the tutors verified?",
        ];

    return (
        <>
            {/* Floating launcher */}
            {!open && (
                <button
                    onClick={() => setOpen(true)}
                    aria-label="Open chat"
                    className="fixed bottom-5 right-5 z-40 size-14 rounded-full bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all shadow-lg flex items-center justify-center text-white"
                >
                    <MessageCircle size={24} strokeWidth={2} />
                    <span className="absolute -top-1 -right-1 size-3 rounded-full bg-emerald-400 border-2 border-white animate-pulse" />
                </button>
            )}

            {/* Chat panel */}
            {open && (
                <div className="fixed bottom-0 sm:bottom-5 right-0 sm:right-5 z-40 w-full sm:w-[380px] h-[85vh] sm:h-[560px] sm:max-h-[85vh] bg-white sm:rounded-2xl border border-gray-200 shadow-xl flex flex-col overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center justify-between gap-3 px-4 py-3 bg-blue-600 text-white shrink-0">
                        <div className="flex items-center gap-2">
                            <div className="size-8 rounded-full bg-white/20 flex items-center justify-center">
                                <ShieldCheck size={16} />
                            </div>
                            <div>
                                <p className="font-bold text-sm">TuitionsInIndia Assistant</p>
                                <p className="text-[11px] text-blue-100">Ask about tutors, pricing, or your account</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            {messages.length > 0 && (
                                <button
                                    onClick={clearChat}
                                    className="text-[11px] text-blue-100 hover:text-white px-2 py-1 rounded hover:bg-white/10 transition-colors"
                                >
                                    Clear
                                </button>
                            )}
                            <button
                                onClick={() => setOpen(false)}
                                aria-label="Close chat"
                                className="p-1.5 rounded-md hover:bg-white/10 transition-colors"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    </div>

                    {/* Messages */}
                    <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-gray-50">
                        {messages.length === 0 && (
                            <div className="space-y-3">
                                <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-md p-3 max-w-[85%]">
                                    <p className="text-sm text-gray-800 leading-relaxed">
                                        Hi! I can help you find a tutor, answer questions about pricing or verification, or raise a ticket if you're stuck. What can I help with?
                                    </p>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {openers.map((o, i) => (
                                        <button
                                            key={i}
                                            onClick={() => sendMessage(o)}
                                            className="text-xs bg-white border border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-gray-700 px-3 py-1.5 rounded-full transition-colors"
                                        >
                                            {o}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                        {messages.map((m, i) => (
                            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                                <div
                                    className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                                        m.role === "user"
                                            ? "bg-blue-600 text-white rounded-tr-md"
                                            : "bg-white border border-gray-200 text-gray-800 rounded-tl-md"
                                    }`}
                                >
                                    {renderMessageContent(m.content)}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-md px-3 py-2 flex items-center gap-2">
                                    <div className="flex gap-1">
                                        <span className="size-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                                        <span className="size-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                                        <span className="size-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input */}
                    <form onSubmit={handleSubmit} className="border-t border-gray-100 bg-white p-3 shrink-0">
                        <div className="flex items-end gap-2">
                            <textarea
                                ref={inputRef}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                        e.preventDefault();
                                        sendMessage(input);
                                    }
                                }}
                                placeholder="Type your message..."
                                rows={1}
                                className="flex-1 resize-none bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none max-h-28"
                                disabled={loading}
                            />
                            <button
                                type="submit"
                                disabled={loading || !input.trim()}
                                aria-label="Send message"
                                className="size-10 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white flex items-center justify-center shrink-0 transition-colors"
                            >
                                {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </>
    );
}

// Very small markdown-ish renderer. Handles **bold**, links, and line breaks.
// Not a full markdown parser — just enough for the chatbot's output style.
function renderMessageContent(text) {
    if (!text) return null;
    const parts = [];
    const regex = /(\*\*[^*]+\*\*)|(\[[^\]]+\]\([^)]+\))/g;
    let lastIndex = 0;
    let match;
    let key = 0;
    while ((match = regex.exec(text)) !== null) {
        if (match.index > lastIndex) {
            parts.push(<span key={key++}>{text.slice(lastIndex, match.index)}</span>);
        }
        if (match[1]) {
            parts.push(<strong key={key++}>{match[1].slice(2, -2)}</strong>);
        } else if (match[2]) {
            const linkMatch = match[2].match(/\[([^\]]+)\]\(([^)]+)\)/);
            if (linkMatch) {
                parts.push(
                    <a
                        key={key++}
                        href={linkMatch[2]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                    >
                        {linkMatch[1]}
                    </a>
                );
            }
        }
        lastIndex = match.index + match[0].length;
    }
    if (lastIndex < text.length) {
        parts.push(<span key={key++}>{text.slice(lastIndex)}</span>);
    }
    return parts;
}
