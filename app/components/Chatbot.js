"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { MessageCircle, X, Send, Loader2, Sparkles, CheckCircle2, ArrowRight, ArrowLeft } from "lucide-react";
import { SUBJECT_CATEGORIES } from "@/lib/subjects";
import {
    GRADE_CHOICES, BUDGET_CHOICES, TUTOR_RATE_CHOICES, MODE_CHOICES, EXPERIENCE_CHOICES,
    TOP_CITIES,
    shouldSkipGrade, getCategoryById, getFlowForRole, formatWizardSummary,
    budgetToMaxRupees, STAGE_PROMPTS,
} from "@/lib/chatbotWizard";

const STORAGE_KEY = "ti_chatbot_wizard";
const HIDDEN_PATH_PREFIXES = ["/dashboard/admin", "/admin/"];

const BOT_NAME = "Aarav";
const BOT_TAGLINE = "your TuitionsInIndia assistant";

// Role-picker chips. Always the entry point for non-logged-in users.
const ROLE_OPTIONS = [
    { value: "STUDENT",   label: "I'm a student or parent",   desc: "Find a tutor" },
    { value: "TUTOR",     label: "I'm a tutor",               desc: "Start teaching" },
    { value: "INSTITUTE", label: "I'm from an institute",     desc: "List our coaching centre" },
];

export default function Chatbot() {
    const pathname = usePathname();
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [userContext, setUserContext] = useState(null);
    const [wizard, setWizard] = useState({ role: null, stage: null, data: {}, stageIndex: -1 });
    const [submitting, setSubmitting] = useState(false);
    const scrollRef = useRef(null);
    const inputRef = useRef(null);

    const isHidden = HIDDEN_PATH_PREFIXES.some((p) => pathname?.startsWith(p));

    // Load session info (skip wizard for logged-in users).
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
                }
            })
            .catch(() => {});
    }, []);

    // Restore wizard + messages per-tab.
    useEffect(() => {
        try {
            const saved = sessionStorage.getItem(STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                if (parsed.messages) setMessages(parsed.messages);
                if (parsed.wizard) setWizard(parsed.wizard);
            }
        } catch {}
    }, []);

    useEffect(() => {
        try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ messages, wizard })); } catch {}
    }, [messages, wizard]);

    useEffect(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [messages, loading, open]);

    useEffect(() => {
        if (open && inputRef.current) setTimeout(() => inputRef.current?.focus(), 100);
    }, [open]);

    const appendAssistant = (content, widget = null) => {
        setMessages((prev) => [...prev, { role: "assistant", content, widget }]);
    };

    const appendUser = (content) => {
        setMessages((prev) => [...prev, { role: "user", content }]);
    };

    // Move wizard to the next relevant stage for the active flow.
    // Skips the grade stage when the category already implies a level.
    const advanceWizard = useCallback((nextWizard) => {
        setWizard(nextWizard);
        renderStage(nextWizard);
    }, []);

    const renderStage = (w) => {
        const { role, stage, data } = w;
        if (!role || !stage) return;
        const prompts = STAGE_PROMPTS[role] || {};
        const prompt = prompts[stage];

        if (stage === "category") {
            appendAssistant(prompt, { type: "category_pick" });
            return;
        }
        if (stage === "subject") {
            const cat = getCategoryById(data.categoryId);
            appendAssistant(prompt, { type: "subject_pick", subjects: cat?.subjects || [] });
            return;
        }
        if (stage === "grade") {
            appendAssistant(prompt, { type: "grade_pick" });
            return;
        }
        if (stage === "mode") {
            appendAssistant(prompt, { type: "mode_pick" });
            return;
        }
        if (stage === "city") {
            appendAssistant(prompt, { type: "city_pick" });
            return;
        }
        if (stage === "budget") {
            appendAssistant(prompt, { type: "budget_pick" });
            return;
        }
        if (stage === "rate") {
            appendAssistant(prompt, { type: "rate_pick" });
            return;
        }
        if (stage === "experience") {
            appendAssistant(prompt, { type: "experience_pick" });
            return;
        }
        if (stage === "institute_name") {
            appendAssistant(prompt, { type: "text_input", field: "institute_name", placeholder: "Your institute's name" });
            return;
        }
        if (stage === "contact") {
            appendAssistant(prompt, { type: "contact_form" });
            return;
        }
        if (stage === "otp") {
            appendAssistant(prompt, { type: "otp_form", role });
            return;
        }
        if (stage === "email") {
            appendAssistant(prompt, { type: "text_input", field: "email", placeholder: "you@example.com", inputType: "email" });
            return;
        }
        if (stage === "confirm") {
            appendAssistant(prompt, { type: "confirm", role, data });
            return;
        }
        if (stage === "handoff") {
            // Chat hands off to the dedicated signup page with everything we know
            // pre-filled via URL params. Dedicated page handles OTP + legal +
            // full profile + verification — best practice for high-trust signup.
            const params = new URLSearchParams();
            if (data.categoryId) params.set("category", data.categoryId);
            if (data.subject) params.set("subject", data.subject);
            if (data.city) params.set("location", data.city);
            if (role === "INSTITUTE" && data.institute_name) params.set("institute_name", data.institute_name);
            const target = role === "INSTITUTE" ? "/register/institute" : "/register/tutor";
            const href = `${target}?${params.toString()}`;
            appendAssistant(prompt, { type: "handoff_cta", href, role });
            return;
        }
        if (stage === "done") {
            appendAssistant(prompt);
            return;
        }
    };

    // Advance to next stage (role-aware, skips grade when implied).
    const gotoNextStage = (w, newData = {}) => {
        const data = { ...w.data, ...newData };
        const flow = getFlowForRole(w.role);
        let nextIndex = w.stageIndex + 1;
        let nextStage = flow[nextIndex];
        // Skip grade when category already implies it (e.g. "School 6-10")
        if (nextStage === "grade" && data.categoryId && shouldSkipGrade(data.categoryId)) {
            nextIndex++;
            nextStage = flow[nextIndex];
        }
        return { ...w, data, stage: nextStage, stageIndex: nextIndex };
    };

    const pickRole = (role) => {
        const label = ROLE_OPTIONS.find((r) => r.value === role)?.label || role;
        appendUser(label);
        const flow = getFlowForRole(role);
        const next = gotoNextStage({ role, stage: null, data: {}, stageIndex: -1 });
        advanceWizard(next);
    };

    const pickCategory = (categoryId) => {
        const cat = getCategoryById(categoryId);
        appendUser(cat?.name || categoryId);
        advanceWizard(gotoNextStage(wizard, { categoryId, category: cat?.name }));
    };

    const pickSubject = (subject) => {
        appendUser(subject);
        advanceWizard(gotoNextStage(wizard, { subject }));
    };

    const pickGrade = (grade) => {
        appendUser(grade);
        advanceWizard(gotoNextStage(wizard, { grade }));
    };

    const pickMode = (mode) => {
        appendUser(MODE_CHOICES.find((m) => m.value === mode)?.label || mode);
        advanceWizard(gotoNextStage(wizard, { mode }));
    };

    const pickCity = (city) => {
        appendUser(city);
        advanceWizard(gotoNextStage(wizard, { city }));
    };

    const pickBudget = (budget) => {
        appendUser(BUDGET_CHOICES.find((b) => b.value === budget)?.label || budget);
        advanceWizard(gotoNextStage(wizard, { budget }));
    };

    const pickRate = (rate) => {
        appendUser(`₹${rate}/hr`);
        advanceWizard(gotoNextStage(wizard, { rate }));
    };

    const pickExperience = (experience) => {
        appendUser(EXPERIENCE_CHOICES.find((e) => e.value === experience)?.label || `${experience} years`);
        advanceWizard(gotoNextStage(wizard, { experience }));
    };

    const submitText = (field, value) => {
        appendUser(value);
        advanceWizard(gotoNextStage(wizard, { [field]: value }));
    };

    const submitContactForm = ({ name, phone, email }) => {
        appendUser(`${name} · ${phone} · ${email}`);
        advanceWizard(gotoNextStage(wizard, { name, phone, email }));
    };

    const handleOtpVerified = ({ name, phone, userId }) => {
        appendUser(`✓ Phone ${phone} verified`);
        advanceWizard(gotoNextStage(wizard, { name, phone, userId }));
        // Refresh session since the verify endpoint set a cookie.
        fetch("/api/auth/session", { credentials: "include" })
            .then((r) => (r.ok ? r.json() : null))
            .then((data) => {
                if (data?.user) setUserContext({
                    userId: data.user.id,
                    userName: data.user.name,
                    userEmail: data.user.email,
                    userPhone: data.user.phone,
                    userRole: data.user.role,
                });
            })
            .catch(() => {});
    };

    // ─── Final submit — role-specific ────────────────────────────────────
    const submitWizard = async () => {
        setSubmitting(true);
        const { role, data } = wizard;
        try {
            if (role === "STUDENT") {
                const body = {
                    name: data.name,
                    email: data.email,
                    phone: data.phone,
                    subject: data.subject,
                    location: data.city,
                    grade: data.grade,
                    budget: budgetToMaxRupees(data.budget),
                    modes: data.mode ? [data.mode] : ["BOTH"],
                    description: `Posted via Aarav chatbot. Category: ${data.category || data.categoryId}${data.grade ? `, grade: ${data.grade}` : ""}${data.mode ? `, mode: ${data.mode}` : ""}.`,
                };
                const res = await fetch("/api/lead/post", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify(body),
                });
                const json = await res.json();
                if (!json.success) throw new Error(json.error || "Could not post your requirement.");

                appendAssistant("Request posted. Redirecting you to matching tutors…", { type: "success" });
                setTimeout(() => {
                    const params = new URLSearchParams();
                    if (data.subject) params.set("subject", data.subject);
                    if (data.city) params.set("location", data.city);
                    params.set("role", "TUTOR");
                    params.set("welcome", "lead");
                    router.push(`/search?${params.toString()}`);
                }, 800);

            }
            // Tutor / Institute paths don't reach confirm — they hand off via
            // the "handoff" stage's CTA, which navigates to /register/{role}
            // with URL params pre-filled.

            advanceWizard({ ...wizard, stage: "done", stageIndex: wizard.stageIndex + 1 });
        } catch (err) {
            appendAssistant(`Sorry — ${err.message || "something went wrong."} You can try again, or raise a ticket if this keeps happening.`);
        } finally {
            setSubmitting(false);
        }
    };

    // ─── Free-text fallback → send to LLM ────────────────────────────────
    const sendFreeText = useCallback(async (text) => {
        const trimmed = text.trim();
        if (!trimmed || loading) return;
        appendUser(trimmed);
        setInput("");
        setLoading(true);
        try {
            const res = await fetch("/api/chatbot/message", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    messages: [...messages, { role: "user", content: trimmed }]
                        .filter((m) => typeof m.content === "string")
                        .slice(-10),
                    context: {
                        pathname: pathname || "",
                        selectedRole: wizard.role || userContext?.userRole || null,
                        ...(userContext || {}),
                        wizardStage: wizard.stage,
                    },
                }),
            });
            const data = await res.json();
            if (data.success) {
                appendAssistant(data.reply);
            } else {
                appendAssistant(data.error || "Sorry, I couldn't process that. Try picking one of the options above.");
            }
        } catch {
            appendAssistant("Connection issue. Please try again in a moment.");
        } finally {
            setLoading(false);
        }
    }, [loading, messages, pathname, wizard.role, wizard.stage, userContext]);

    const resetChat = () => {
        setMessages([]);
        setWizard({ role: null, stage: null, data: {}, stageIndex: -1 });
        try { sessionStorage.removeItem(STORAGE_KEY); } catch {}
    };

    if (isHidden) return null;

    const showRolePicker = !wizard.role && messages.length === 0;

    return (
        <>
            {/* Floating launcher */}
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

            {open && (
                <div className="fixed bottom-0 sm:bottom-5 right-0 sm:right-5 z-40 w-full sm:w-[400px] h-[90vh] sm:h-[620px] sm:max-h-[90vh] bg-white sm:rounded-2xl border border-gray-200 shadow-xl flex flex-col overflow-hidden">
                    <div className="flex items-center justify-between gap-3 px-4 py-3 bg-gradient-to-br from-blue-600 to-blue-700 text-white shrink-0">
                        <div className="flex items-center gap-2.5">
                            <div className="size-9 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm">A</div>
                            <div>
                                <p className="font-bold text-sm leading-tight">{BOT_NAME}</p>
                                <p className="text-[11px] text-blue-100 leading-tight">{BOT_TAGLINE}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            {messages.length > 0 && (
                                <button onClick={resetChat} className="text-[11px] text-blue-100 hover:text-white px-2 py-1 rounded hover:bg-white/10 transition-colors">Reset</button>
                            )}
                            <button onClick={() => setOpen(false)} aria-label="Close chat" className="p-1.5 rounded-md hover:bg-white/10 transition-colors">
                                <X size={16} />
                            </button>
                        </div>
                    </div>

                    <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-gray-50">
                        {/* Opening greeting + role picker */}
                        {messages.length === 0 && (
                            <div className="space-y-3">
                                <AssistantBubble>
                                    <p className="text-sm text-gray-800 leading-relaxed">
                                        Hi, I'm <strong>{BOT_NAME}</strong> from TuitionsInIndia. I'll help you in a few quick steps.
                                    </p>
                                </AssistantBubble>
                                {showRolePicker && (
                                    <AssistantBubble>
                                        <p className="text-sm text-gray-800 leading-relaxed mb-3">First — who are you?</p>
                                        <div className="flex flex-col gap-2">
                                            {ROLE_OPTIONS.map((r) => (
                                                <button
                                                    key={r.value}
                                                    onClick={() => pickRole(r.value)}
                                                    className="flex items-center justify-between gap-2 text-left p-3 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 rounded-xl transition-colors"
                                                >
                                                    <div>
                                                        <div className="text-sm font-semibold">{r.label}</div>
                                                        <div className="text-[11px] text-blue-500">{r.desc}</div>
                                                    </div>
                                                    <ArrowRight size={16} />
                                                </button>
                                            ))}
                                        </div>
                                    </AssistantBubble>
                                )}
                            </div>
                        )}

                        {/* Conversation */}
                        {messages.map((m, i) => (
                            <MessageBubble
                                key={i}
                                message={m}
                                wizard={wizard}
                                submitting={submitting}
                                onPickCategory={pickCategory}
                                onPickSubject={pickSubject}
                                onPickGrade={pickGrade}
                                onPickMode={pickMode}
                                onPickCity={pickCity}
                                onPickBudget={pickBudget}
                                onPickRate={pickRate}
                                onPickExperience={pickExperience}
                                onSubmitText={submitText}
                                onSubmitContact={submitContactForm}
                                onOtpVerified={handleOtpVerified}
                                onConfirm={submitWizard}
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

                    <form
                        onSubmit={(e) => { e.preventDefault(); sendFreeText(input); }}
                        className="border-t border-gray-100 bg-white p-3 shrink-0"
                    >
                        <div className="flex items-end gap-2">
                            <textarea
                                ref={inputRef}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                        e.preventDefault();
                                        sendFreeText(input);
                                    }
                                }}
                                placeholder="Or type a question…"
                                rows={1}
                                className="flex-1 resize-none bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none max-h-28"
                                disabled={loading || submitting}
                            />
                            <button
                                type="submit"
                                disabled={loading || submitting || !input.trim()}
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

// ─── Presentational components ────────────────────────────────────────────

function AssistantBubble({ children }) {
    return (
        <div className="flex justify-start">
            <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-md px-3 py-2.5 max-w-[92%]">{children}</div>
        </div>
    );
}

function MessageBubble({
    message, wizard, submitting,
    onPickCategory, onPickSubject, onPickGrade, onPickMode, onPickCity, onPickBudget,
    onPickRate, onPickExperience, onSubmitText, onSubmitContact, onOtpVerified, onConfirm,
}) {
    const isUser = message.role === "user";
    return (
        <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
            <div
                className={`max-w-[92%] px-3 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    isUser
                        ? "bg-blue-600 text-white rounded-tr-md"
                        : "bg-white border border-gray-200 text-gray-800 rounded-tl-md"
                }`}
            >
                <div className="whitespace-pre-wrap">{renderMessageContent(message.content)}</div>
                {!isUser && message.widget && (
                    <WizardWidget
                        widget={message.widget}
                        wizard={wizard}
                        submitting={submitting}
                        onPickCategory={onPickCategory}
                        onPickSubject={onPickSubject}
                        onPickGrade={onPickGrade}
                        onPickMode={onPickMode}
                        onPickCity={onPickCity}
                        onPickBudget={onPickBudget}
                        onPickRate={onPickRate}
                        onPickExperience={onPickExperience}
                        onSubmitText={onSubmitText}
                        onSubmitContact={onSubmitContact}
                        onOtpVerified={onOtpVerified}
                        onConfirm={onConfirm}
                    />
                )}
            </div>
        </div>
    );
}

function WizardWidget(props) {
    const { widget } = props;
    switch (widget?.type) {
        case "category_pick":   return <CategoryPicker {...props} />;
        case "subject_pick":    return <SubjectPicker subjects={widget.subjects} {...props} />;
        case "grade_pick":      return <OptionsPicker options={GRADE_CHOICES} onPick={props.onPickGrade} />;
        case "mode_pick":       return <OptionsPicker options={MODE_CHOICES} onPick={props.onPickMode} />;
        case "city_pick":       return <CityPicker onPick={props.onPickCity} />;
        case "budget_pick":     return <OptionsPicker options={BUDGET_CHOICES} onPick={props.onPickBudget} />;
        case "rate_pick":       return <OptionsPicker options={TUTOR_RATE_CHOICES} onPick={props.onPickRate} />;
        case "experience_pick": return <OptionsPicker options={EXPERIENCE_CHOICES} onPick={props.onPickExperience} />;
        case "text_input":      return <TextInput widget={widget} onSubmit={props.onSubmitText} />;
        case "contact_form":    return <ContactForm onSubmit={props.onSubmitContact} />;
        case "otp_form":        return <OtpForm role={widget.role} onVerified={props.onOtpVerified} />;
        case "confirm":         return <ConfirmSummary wizard={props.wizard} submitting={props.submitting} onConfirm={props.onConfirm} />;
        case "handoff_cta":     return <HandoffCTA href={widget.href} role={widget.role} />;
        case "success":         return null;
        default:                return null;
    }
}

function HandoffCTA({ href, role }) {
    const label = role === "INSTITUTE" ? "Continue to institute signup →" : "Continue to tutor signup →";
    return (
        <a
            href={href}
            className="mt-3 inline-flex items-center justify-center w-full px-5 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors text-sm"
        >
            {label}
        </a>
    );
}

function CategoryPicker({ onPickCategory }) {
    return (
        <div className="mt-3 grid grid-cols-2 gap-2">
            {SUBJECT_CATEGORIES.map((c) => (
                <button
                    key={c.id}
                    onClick={() => onPickCategory(c.id)}
                    className="text-left p-2.5 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl transition-colors"
                >
                    <div className="text-[13px] font-semibold text-blue-800 leading-tight">{c.name}</div>
                </button>
            ))}
        </div>
    );
}

function SubjectPicker({ subjects, onPickSubject }) {
    if (!subjects || subjects.length === 0) {
        return <p className="mt-2 text-xs text-gray-500">No subjects configured for this category.</p>;
    }
    return (
        <div className="mt-3 flex flex-wrap gap-2">
            {subjects.map((s) => (
                <button
                    key={s}
                    onClick={() => onPickSubject(s)}
                    className="text-xs font-semibold px-3 py-1.5 rounded-full bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 transition-colors"
                >
                    {s}
                </button>
            ))}
        </div>
    );
}

function OptionsPicker({ options, onPick }) {
    return (
        <div className="mt-3 flex flex-col gap-2">
            {options.map((opt) => (
                <button
                    key={opt.value}
                    onClick={() => onPick(opt.value)}
                    className="text-left px-3 py-2 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 text-sm font-semibold rounded-xl transition-colors flex items-center justify-between"
                >
                    <span>{opt.label}</span>
                    <ArrowRight size={14} />
                </button>
            ))}
        </div>
    );
}

function CityPicker({ onPick }) {
    const [custom, setCustom] = useState("");
    const [showOther, setShowOther] = useState(false);

    if (showOther) {
        return (
            <div className="mt-3 space-y-2">
                <div className="flex items-center gap-2">
                    <button onClick={() => setShowOther(false)} className="size-8 rounded-lg bg-gray-50 border border-gray-200 text-gray-500 hover:bg-gray-100 flex items-center justify-center">
                        <ArrowLeft size={14} />
                    </button>
                    <input
                        autoFocus
                        value={custom}
                        onChange={(e) => setCustom(e.target.value)}
                        placeholder="Type your city"
                        className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600 outline-none"
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && custom.trim()) onPick(custom.trim());
                        }}
                    />
                    <button
                        onClick={() => custom.trim() && onPick(custom.trim())}
                        disabled={!custom.trim()}
                        className="px-3 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg disabled:opacity-50"
                    >
                        Go
                    </button>
                </div>
            </div>
        );
    }
    return (
        <div className="mt-3 flex flex-wrap gap-2">
            {TOP_CITIES.map((c) => (
                <button
                    key={c}
                    onClick={() => onPick(c)}
                    className="text-xs font-semibold px-3 py-1.5 rounded-full bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 transition-colors"
                >
                    {c}
                </button>
            ))}
            <button
                onClick={() => setShowOther(true)}
                className="text-xs font-semibold px-3 py-1.5 rounded-full bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-600 transition-colors"
            >
                Other…
            </button>
        </div>
    );
}

function TextInput({ widget, onSubmit }) {
    const [value, setValue] = useState("");
    const inputType = widget.inputType || "text";
    return (
        <div className="mt-3 flex items-center gap-2">
            <input
                autoFocus
                type={inputType}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={widget.placeholder}
                className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600 outline-none"
                onKeyDown={(e) => {
                    if (e.key === "Enter" && value.trim()) onSubmit(widget.field, value.trim());
                }}
            />
            <button
                onClick={() => value.trim() && onSubmit(widget.field, value.trim())}
                disabled={!value.trim()}
                className="px-3 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg disabled:opacity-50"
            >
                Save
            </button>
        </div>
    );
}

function ContactForm({ onSubmit }) {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = () => {
        setError("");
        if (!name.trim()) return setError("Please enter your name.");
        const cleanPhone = phone.replace(/[^0-9]/g, "").slice(-10);
        if (cleanPhone.length !== 10) return setError("Please enter a 10-digit Indian mobile number.");
        if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return setError("Please enter a valid email.");
        onSubmit({ name: name.trim(), phone: cleanPhone, email: email.trim().toLowerCase() });
    };

    return (
        <div className="mt-3 space-y-2">
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600 outline-none" />
            <input value={phone} onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ""))} maxLength={10} inputMode="numeric" placeholder="10-digit mobile" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600 outline-none" />
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600 outline-none" />
            {error && <p className="text-xs text-red-600">{error}</p>}
            <button onClick={handleSubmit} className="w-full py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700">
                Continue
            </button>
        </div>
    );
}

function OtpForm({ role, onVerified }) {
    const [stage, setStage] = useState("phone");
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");
    const [userId, setUserId] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const sendOtp = async () => {
        setError("");
        const cleanPhone = phone.replace(/[^0-9]/g, "").slice(-10);
        if (cleanPhone.length !== 10) return setError("10-digit mobile please.");
        if (!name.trim()) return setError("Please enter your name.");
        setLoading(true);
        try {
            const res = await fetch("/api/auth/otp/send", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ name: name.trim(), phone: cleanPhone, role, isRegistration: true }),
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
            setError("Network error.");
        } finally {
            setLoading(false);
        }
    };

    const verifyOtp = async () => {
        setError("");
        if (!/^\d{6}$/.test(otp)) return setError("Enter the 6-digit OTP.");
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
                onVerified({ name: name.trim(), phone, userId });
            } else {
                setError(data.error || "Invalid OTP.");
            }
        } catch {
            setError("Network error.");
        } finally {
            setLoading(false);
        }
    };

    if (stage === "done") {
        return (
            <div className="mt-3 flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                <CheckCircle2 size={16} className="text-emerald-600" />
                <p className="text-xs font-semibold text-emerald-800">Phone verified.</p>
            </div>
        );
    }

    return (
        <div className="mt-3 p-3 bg-gray-50 border border-gray-200 rounded-xl space-y-2.5">
            {stage === "phone" && (
                <>
                    <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600 outline-none" />
                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ""))} maxLength={10} placeholder="10-digit mobile" className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600 outline-none" />
                    {error && <p className="text-xs text-red-600">{error}</p>}
                    <button onClick={sendOtp} disabled={loading} className="w-full py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2">
                        {loading ? <><Loader2 size={14} className="animate-spin" /> Sending…</> : "Send OTP"}
                    </button>
                </>
            )}
            {stage === "otp" && (
                <>
                    <p className="text-xs text-gray-600">Sent a 6-digit code to <strong>{phone}</strong>.</p>
                    <input
                        type="text" inputMode="numeric" value={otp} autoFocus
                        onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, "").slice(0, 6))}
                        maxLength={6}
                        className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono tracking-[0.3em] text-center focus:ring-2 focus:ring-blue-600 outline-none"
                        placeholder="_ _ _ _ _ _"
                    />
                    {error && <p className="text-xs text-red-600">{error}</p>}
                    <div className="flex gap-2">
                        <button onClick={() => { setStage("phone"); setOtp(""); setError(""); }} className="flex-1 py-2 bg-white border border-gray-200 text-gray-600 text-xs font-semibold rounded-lg">
                            Change number
                        </button>
                        <button onClick={verifyOtp} disabled={loading} className="flex-[2] py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2">
                            {loading ? <><Loader2 size={14} className="animate-spin" /> Verifying…</> : "Verify"}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

function ConfirmSummary({ wizard, submitting, onConfirm }) {
    const summary = formatWizardSummary(wizard.role, wizard.data);
    return (
        <div className="mt-3 space-y-2">
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-3">
                <dl className="text-xs space-y-1.5">
                    {summary.map(([k, v]) => (
                        <div key={k} className="flex items-start gap-2">
                            <dt className="w-28 shrink-0 text-blue-700 font-semibold">{k}:</dt>
                            <dd className="flex-1 text-gray-800">{v}</dd>
                        </div>
                    ))}
                </dl>
            </div>
            <button onClick={onConfirm} disabled={submitting} className="w-full py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2">
                {submitting
                    ? <><Loader2 size={14} className="animate-spin" /> Submitting…</>
                    : wizard.role === "STUDENT" ? "Post my requirement" : "Create my profile"}
            </button>
        </div>
    );
}

function renderMessageContent(text) {
    if (!text) return null;
    const parts = [];
    const regex = /(\*\*[^*]+\*\*)|(\[[^\]]+\]\([^)]+\))/g;
    let lastIndex = 0, match, key = 0;
    while ((match = regex.exec(text)) !== null) {
        if (match.index > lastIndex) parts.push(<span key={key++}>{text.slice(lastIndex, match.index)}</span>);
        if (match[1]) parts.push(<strong key={key++}>{match[1].slice(2, -2)}</strong>);
        else if (match[2]) {
            const linkMatch = match[2].match(/\[([^\]]+)\]\(([^)]+)\)/);
            if (linkMatch) parts.push(
                <a key={key++} href={linkMatch[2]} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{linkMatch[1]}</a>
            );
        }
        lastIndex = match.index + match[0].length;
    }
    if (lastIndex < text.length) parts.push(<span key={key++}>{text.slice(lastIndex)}</span>);
    return parts;
}
