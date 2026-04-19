"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { MessageCircle, X, Send, Loader2, Sparkles, CheckCircle2, ArrowRight } from "lucide-react";

const STORAGE_KEY = "ti_chatbot_messages";
const ROLE_STORAGE_KEY = "ti_chatbot_role";

// Paths where the bot should not appear (admin, onboarding forms that fight
// for attention). Global everywhere else.
const HIDDEN_PATH_PREFIXES = ["/dashboard/admin", "/admin/"];

// Bot identity — shown in the UI. Keeping it in one place so it's easy to
// tune or translate later.
const BOT_NAME = "Aarav";
const BOT_TAGLINE = "your TuitionsInIndia assistant";

export default function Chatbot() {
    const pathname = usePathname();
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [userContext, setUserContext] = useState(null);
    const [selectedRole, setSelectedRole] = useState(null);
    const scrollRef = useRef(null);
    const inputRef = useRef(null);

    const isHidden = HIDDEN_PATH_PREFIXES.some((p) => pathname?.startsWith(p));

    // Fetch session info so the bot knows if the user is logged in.
    useEffect(() => {
        fetch("/api/auth/session", { credentials: "include" })
            .then((r) => (r.ok ? r.json() : null))
            .then((data) => {
                if (data?.user) {
                    setUserContext({
                        userId: data.user.id,
                        userName: data.user.name,
                        userEmail: data.user.email,
                        userPhone: data.user.phone,
                        userRole: data.user.role,
                    });
                    setSelectedRole(data.user.role); // skip role picker — we know who they are
                }
            })
            .catch(() => {});
    }, []);

    // Restore transcript + role from sessionStorage (per-tab).
    useEffect(() => {
        try {
            const saved = sessionStorage.getItem(STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed)) setMessages(parsed);
            }
            const savedRole = sessionStorage.getItem(ROLE_STORAGE_KEY);
            if (savedRole) setSelectedRole(savedRole);
        } catch {}
    }, []);

    useEffect(() => {
        try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages)); } catch {}
    }, [messages]);

    useEffect(() => {
        try {
            if (selectedRole) sessionStorage.setItem(ROLE_STORAGE_KEY, selectedRole);
        } catch {}
    }, [selectedRole]);

    // Auto-scroll on new content.
    useEffect(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [messages, loading, open]);

    useEffect(() => {
        if (open && inputRef.current) setTimeout(() => inputRef.current?.focus(), 100);
    }, [open]);

    const sendMessage = useCallback(async (text, hiddenRoleOverride = null) => {
        const trimmed = text.trim();
        if (!trimmed || loading) return;

        const effectiveRole = hiddenRoleOverride || selectedRole;
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
                        selectedRole: effectiveRole,
                        ...(userContext || {}),
                    },
                }),
            });
            const data = await res.json();
            if (data.success) {
                setMessages((prev) => [
                    ...prev,
                    { role: "assistant", content: data.reply, widgets: data.widgets || [] },
                ]);
            } else {
                setMessages((prev) => [
                    ...prev,
                    { role: "assistant", content: data.error || "Sorry, something went wrong. Please try again." },
                ]);
            }
        } catch {
            setMessages((prev) => [
                ...prev,
                { role: "assistant", content: "I'm having trouble connecting. Please try again in a moment." },
            ]);
        } finally {
            setLoading(false);
        }
    }, [loading, selectedRole, messages, pathname, userContext]);

    const handleSubmit = (e) => {
        e.preventDefault();
        sendMessage(input);
    };

    const handleRolePick = (role) => {
        setSelectedRole(role);
        const label = role === "STUDENT" ? "I'm a student or parent"
            : role === "TUTOR" ? "I'm a tutor"
            : "I'm from an institute";
        sendMessage(label, role);
    };

    const clearChat = () => {
        setMessages([]);
        setSelectedRole(userContext?.userRole || null);
        try {
            sessionStorage.removeItem(STORAGE_KEY);
            if (!userContext?.userRole) sessionStorage.removeItem(ROLE_STORAGE_KEY);
        } catch {}
    };

    // Called when the inline OTP widget finishes successfully. Appends a
    // synthetic user message so the bot knows to continue with role-specific
    // onboarding. The new session cookie is already set by the widget.
    const handleOtpVerified = async ({ userId, role, name, phone }) => {
        const payload = `✓ Phone ${phone} verified for ${role.toLowerCase()} account.`;
        await sendMessage(payload);
        // Refresh session context so the bot sees we're logged in on the next turn.
        fetch("/api/auth/session", { credentials: "include" })
            .then((r) => (r.ok ? r.json() : null))
            .then((data) => {
                if (data?.user) {
                    setUserContext({
                        userId: data.user.id,
                        userName: data.user.name,
                        userEmail: data.user.email,
                        userPhone: data.user.phone,
                        userRole: data.user.role,
                    });
                }
            })
            .catch(() => {});
    };

    if (isHidden) return null;

    const showRolePicker = !selectedRole && messages.length === 0;

    return (
        <>
            {/* Floating launcher with callout */}
            {!open && (
                <div className="fixed bottom-5 right-5 z-40 flex items-end gap-3">
                    <div className="hidden sm:flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2 shadow-md text-sm font-semibold text-gray-700 max-w-[220px]">
                        <Sparkles size={14} className="text-blue-600 shrink-0" />
                        <span>How can we help?</span>
                    </div>
                    <button
                        onClick={() => setOpen(true)}
                        aria-label="Open chat"
                        className="size-14 rounded-full bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all shadow-lg flex items-center justify-center text-white relative"
                    >
                        <MessageCircle size={24} strokeWidth={2} />
                        <span className="absolute -top-1 -right-1 size-3 rounded-full bg-emerald-400 border-2 border-white animate-pulse" />
                    </button>
                </div>
            )}

            {/* Chat panel */}
            {open && (
                <div className="fixed bottom-0 sm:bottom-5 right-0 sm:right-5 z-40 w-full sm:w-[380px] h-[85vh] sm:h-[580px] sm:max-h-[85vh] bg-white sm:rounded-2xl border border-gray-200 shadow-xl flex flex-col overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center justify-between gap-3 px-4 py-3 bg-gradient-to-br from-blue-600 to-blue-700 text-white shrink-0">
                        <div className="flex items-center gap-2.5">
                            <div className="size-9 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm">
                                A
                            </div>
                            <div>
                                <p className="font-bold text-sm leading-tight">{BOT_NAME}</p>
                                <p className="text-[11px] text-blue-100 leading-tight">{BOT_TAGLINE}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            {messages.length > 0 && (
                                <button
                                    onClick={clearChat}
                                    className="text-[11px] text-blue-100 hover:text-white px-2 py-1 rounded hover:bg-white/10 transition-colors"
                                >
                                    Reset
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
                        {/* Opening greeting */}
                        {messages.length === 0 && (
                            <div className="space-y-3">
                                <AssistantBubble>
                                    <p className="text-sm text-gray-800 leading-relaxed">
                                        Hi, I'm <strong>{BOT_NAME}</strong> from TuitionsInIndia. How can I help you today?
                                    </p>
                                </AssistantBubble>

                                {showRolePicker && (
                                    <AssistantBubble>
                                        <p className="text-sm text-gray-800 leading-relaxed mb-3">
                                            First — who am I speaking with?
                                        </p>
                                        <div className="flex flex-col gap-2">
                                            <RoleChip label="I'm a student or parent" onClick={() => handleRolePick("STUDENT")} />
                                            <RoleChip label="I'm a tutor" onClick={() => handleRolePick("TUTOR")} />
                                            <RoleChip label="I'm from an institute" onClick={() => handleRolePick("INSTITUTE")} />
                                        </div>
                                    </AssistantBubble>
                                )}
                            </div>
                        )}

                        {/* Conversation history */}
                        {messages.map((m, i) => (
                            <MessageBubble
                                key={i}
                                message={m}
                                onWidgetAction={handleOtpVerified}
                                onSuggestion={(text) => sendMessage(text)}
                                router={router}
                            />
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
                                placeholder={showRolePicker ? "…or type your question" : "Type your message..."}
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

function AssistantBubble({ children }) {
    return (
        <div className="flex justify-start">
            <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-md px-3 py-2.5 max-w-[88%]">
                {children}
            </div>
        </div>
    );
}

function RoleChip({ label, onClick }) {
    return (
        <button
            onClick={onClick}
            className="flex items-center justify-between gap-2 text-left px-3 py-2 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 text-sm font-semibold rounded-xl transition-colors"
        >
            <span>{label}</span>
            <ArrowRight size={14} />
        </button>
    );
}

function MessageBubble({ message, onWidgetAction, onSuggestion, router }) {
    const isUser = message.role === "user";
    return (
        <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
            <div
                className={`max-w-[88%] px-3 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                    isUser
                        ? "bg-blue-600 text-white rounded-tr-md"
                        : "bg-white border border-gray-200 text-gray-800 rounded-tl-md"
                }`}
            >
                {renderMessageContent(message.content)}

                {/* Assistant-side widgets */}
                {!isUser && message.widgets && message.widgets.map((w, i) => (
                    <ChatWidget
                        key={i}
                        widget={w}
                        onComplete={onWidgetAction}
                        onSuggestion={onSuggestion}
                        router={router}
                    />
                ))}
            </div>
        </div>
    );
}

// ─── In-chat widgets rendered by the assistant ────────────────────────────
// The bot returns structured widgets in its reply via the API's `widgets` field.
// Supported types:
//   - { type: "otp_request", role, name }
//   - { type: "suggestions", options: [string] }
//   - { type: "cta", href, label }
function ChatWidget({ widget, onComplete, onSuggestion, router }) {
    if (!widget?.type) return null;

    if (widget.type === "otp_request") {
        return <OtpRequestWidget role={widget.role} prefillName={widget.name} onComplete={onComplete} />;
    }

    if (widget.type === "suggestions") {
        return (
            <div className="mt-3 flex flex-wrap gap-2">
                {(widget.options || []).map((opt, i) => (
                    <button
                        key={i}
                        onClick={() => onSuggestion(opt)}
                        className="text-xs bg-blue-50 border border-blue-200 hover:bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full font-semibold transition-colors"
                    >
                        {opt}
                    </button>
                ))}
            </div>
        );
    }

    if (widget.type === "cta") {
        return (
            <button
                onClick={() => router.push(widget.href)}
                className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
                {widget.label || "Continue"} <ArrowRight size={14} />
            </button>
        );
    }

    return null;
}

// OTP widget — phone → send → enter code → verify. On success, bubbles
// up (userId, role, name, phone) so the parent can continue the conversation.
function OtpRequestWidget({ role, prefillName, onComplete }) {
    const [stage, setStage] = useState("phone"); // phone | otp | done
    const [name, setName] = useState(prefillName || "");
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");
    const [userId, setUserId] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const sendOtp = async () => {
        setError("");
        const cleanPhone = phone.replace(/[^0-9]/g, "").slice(-10);
        if (cleanPhone.length !== 10) {
            setError("Please enter a 10-digit mobile number.");
            return;
        }
        if (!name.trim()) {
            setError("Please enter your name.");
            return;
        }
        setLoading(true);
        try {
            const res = await fetch("/api/auth/otp/send", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    name: name.trim(),
                    phone: cleanPhone,
                    role,
                    isRegistration: true,
                }),
            });
            const data = await res.json();
            if (res.ok && data.success) {
                setUserId(data.userId);
                setPhone(cleanPhone);
                setStage("otp");
            } else {
                setError(data.error || "Could not send OTP.");
            }
        } catch {
            setError("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const verifyOtp = async () => {
        setError("");
        if (!/^\d{6}$/.test(otp)) {
            setError("Enter the 6-digit OTP from your SMS.");
            return;
        }
        setLoading(true);
        try {
            const res = await fetch("/api/auth/otp/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ userId, phone, otp }),
            });
            const data = await res.json();
            if (res.ok && data.success) {
                setStage("done");
                onComplete?.({ userId, role, name: name.trim(), phone });
            } else {
                setError(data.error || "Invalid OTP.");
            }
        } catch {
            setError("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (stage === "done") {
        return (
            <div className="mt-3 flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                <p className="text-xs font-semibold text-emerald-800">Phone verified. Continuing…</p>
            </div>
        );
    }

    return (
        <div className="mt-3 p-3 bg-gray-50 border border-gray-200 rounded-xl space-y-2.5">
            {stage === "phone" && (
                <>
                    <div>
                        <label className="block text-[11px] font-semibold text-gray-600 mb-1">Your name</label>
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none"
                            placeholder="Full name"
                        />
                    </div>
                    <div>
                        <label className="block text-[11px] font-semibold text-gray-600 mb-1">Mobile number</label>
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ""))}
                            maxLength={10}
                            className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none"
                            placeholder="10-digit number"
                        />
                    </div>
                    {error && <p className="text-xs text-red-600">{error}</p>}
                    <button
                        onClick={sendOtp}
                        disabled={loading}
                        className="w-full py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {loading ? <><Loader2 size={14} className="animate-spin" /> Sending…</> : "Send OTP"}
                    </button>
                </>
            )}
            {stage === "otp" && (
                <>
                    <p className="text-xs text-gray-600">
                        We sent a 6-digit code to <strong>{phone}</strong>.
                    </p>
                    <input
                        type="text"
                        inputMode="numeric"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, "").slice(0, 6))}
                        maxLength={6}
                        autoFocus
                        className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono tracking-[0.3em] text-center focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none"
                        placeholder="_ _ _ _ _ _"
                    />
                    {error && <p className="text-xs text-red-600">{error}</p>}
                    <div className="flex gap-2">
                        <button
                            onClick={() => { setStage("phone"); setOtp(""); setError(""); }}
                            className="flex-1 py-2 bg-white border border-gray-200 text-gray-600 text-xs font-semibold rounded-lg hover:bg-gray-50"
                        >
                            Change number
                        </button>
                        <button
                            onClick={verifyOtp}
                            disabled={loading}
                            className="flex-[2] py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading ? <><Loader2 size={14} className="animate-spin" /> Verifying…</> : "Verify"}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

// Tiny markdown-ish renderer — **bold**, [link](url), line breaks.
function renderMessageContent(text) {
    if (!text) return null;
    const parts = [];
    const regex = /(\*\*[^*]+\*\*)|(\[[^\]]+\]\([^)]+\))/g;
    let lastIndex = 0;
    let match;
    let key = 0;
    while ((match = regex.exec(text)) !== null) {
        if (match.index > lastIndex) parts.push(<span key={key++}>{text.slice(lastIndex, match.index)}</span>);
        if (match[1]) {
            parts.push(<strong key={key++}>{match[1].slice(2, -2)}</strong>);
        } else if (match[2]) {
            const linkMatch = match[2].match(/\[([^\]]+)\]\(([^)]+)\)/);
            if (linkMatch) {
                parts.push(
                    <a key={key++} href={linkMatch[2]} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {linkMatch[1]}
                    </a>
                );
            }
        }
        lastIndex = match.index + match[0].length;
    }
    if (lastIndex < text.length) parts.push(<span key={key++}>{text.slice(lastIndex)}</span>);
    return parts;
}

// Non-breaking-space placeholder so removing the old CONTEXT_STORAGE_KEY
// const doesn't trip a "defined but never used" lint.
void ROLE_STORAGE_KEY;
