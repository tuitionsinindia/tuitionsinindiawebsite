"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
    Search,
    Filter,
    Star,
    MapPin,
    ShieldCheck,
    GraduationCap,
    ChevronDown,
    WifiOff,
    ArrowRight,
    BadgeCheck,
    User,
    Briefcase,
    Monitor,
    Building2,
    RefreshCw,
    X,
    Phone,
    FileText,
    Clock,
    MessageCircle,
    Copy,
    Check,
    Send,
    ExternalLink,
    Loader2,
} from "lucide-react";
import { SUBJECT_CATEGORIES } from "../../lib/subjects";
import SkeletonLoader from "../components/SkeletonLoader";
import MapComponent from "../components/MapComponent";
import { trackSearch, trackViewProfile } from "@/lib/analytics";
import { saveIntent, getIntent, clearIntent } from "@/lib/intentStore";

// ─── Sign-up Modal (wraps LeadCaptureFlow) ──────────────────────────────────
import LeadCaptureFlow from "../components/LeadCaptureFlow";
import TrialBookingModal from "../components/TrialBookingModal";

function SignupModal({ onClose, onSuccess, signupRole = "STUDENT" }) {
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10">
                    <X size={20} />
                </button>
                <LeadCaptureFlow initialRole={signupRole} onComplete={onSuccess} />
            </div>
        </div>
    );
}

// ─── Filter Chips ──────────────────────────────────────────────────────────────
function FilterChips({ subject, location, grade, teachingMode, verifiedOnly, maxRate, onClear }) {
    const chips = [];
    if (subject) chips.push({ label: subject, key: "subject" });
    if (location) chips.push({ label: location, key: "location" });
    if (grade) {
        const cat = SUBJECT_CATEGORIES.find(c => c.id === grade);
        chips.push({ label: cat ? cat.name : grade, key: "grade" });
    }
    if (teachingMode) chips.push({ label: teachingMode === "ONLINE" ? "Online" : teachingMode === "STUDENT_HOME" ? "Home Tuition" : teachingMode === "TUTOR_HOME" ? "Tutor's Home" : "At Centre", key: "teachingMode" });
    if (verifiedOnly) chips.push({ label: "Verified Only", key: "verifiedOnly" });
    if (maxRate < 10000) chips.push({ label: `Up to ₹${maxRate}/hr`, key: "maxRate" });

    if (chips.length === 0) return null;

    return (
        <div className="flex flex-wrap gap-2 px-4 py-2 bg-white border-b border-gray-100">
            {chips.map(chip => (
                <span key={chip.key} className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1.5 rounded-full border border-blue-100">
                    {chip.label}
                    <button onClick={() => onClear(chip.key)} className="text-blue-400 hover:text-blue-700 transition-colors ml-0.5">
                        <X size={11} />
                    </button>
                </span>
            ))}
        </div>
    );
}

// ─── Contact Details Modal ────────────────────────────────────────────────────
function ContactModal({ tutor, onClose }) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [limitReached, setLimitReached] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        fetch(`/api/tutor/contact?tutorId=${tutor.id || tutor.userId}`)
            .then(r => r.json())
            .then(d => {
                if (d.limitReached) {
                    setLimitReached(true);
                } else if (d.phone || d.email) {
                    setData(d);
                } else {
                    setError(d.error || "Could not load contact details.");
                }
            })
            .catch(() => setError("Something went wrong. Please try again."))
            .finally(() => setLoading(false));
    }, [tutor.id, tutor.userId]);

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }).catch(() => {});
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                    <X size={18} />
                </button>
                <div className="mb-4">
                    <div className="size-10 rounded-xl bg-blue-100 flex items-center justify-center mb-3">
                        <Phone size={18} className="text-blue-600" />
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg">{tutor.name}</h3>
                    <p className="text-sm text-gray-500">Contact details</p>
                </div>
                {loading ? (
                    <div className="flex items-center justify-center py-8">
                        <Loader2 size={24} className="animate-spin text-blue-600" />
                    </div>
                ) : limitReached ? (
                    <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 space-y-2">
                        <p className="text-sm font-semibold text-amber-800">Monthly limit reached</p>
                        <p className="text-xs text-amber-700 leading-relaxed">You&apos;ve used your 3 free contact views this month. Your limit resets on the 1st of next month.</p>
                        <p className="text-xs text-amber-600">Tip: Book a demo class directly — the tutor will reach out to you.</p>
                    </div>
                ) : error ? (
                    <p className="text-sm text-red-500 py-4">{error}</p>
                ) : data && (
                    <div className="space-y-3">
                        {data.phone && (
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                                <div>
                                    <p className="text-xs text-gray-500 mb-0.5">Phone</p>
                                    <p className="font-semibold text-gray-900 text-sm">{data.phone}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => handleCopy(data.phone)}
                                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                        {copied ? <Check size={15} className="text-emerald-500" /> : <Copy size={15} />}
                                    </button>
                                    {data.whatsappUrl && (
                                        <a href={data.whatsappUrl} target="_blank" rel="noreferrer"
                                            className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                                            <ExternalLink size={15} />
                                        </a>
                                    )}
                                </div>
                            </div>
                        )}
                        {data.email && (
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                                <div className="min-w-0">
                                    <p className="text-xs text-gray-500 mb-0.5">Email</p>
                                    <p className="font-semibold text-gray-900 text-sm truncate">{data.email}</p>
                                </div>
                            </div>
                        )}
                        {data.whatsappUrl && (
                            <a href={data.whatsappUrl} target="_blank" rel="noreferrer"
                                className="flex items-center justify-center gap-2 w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold rounded-xl transition-colors">
                                <ExternalLink size={14} /> Chat on WhatsApp
                            </a>
                        )}
                    </div>
                )}
                <p className="text-xs text-gray-400 text-center mt-4">No commission · Pay the tutor directly</p>
            </div>
        </div>
    );
}

// ─── Inquiry Modal ────────────────────────────────────────────────────────────
function InquiryModal({ tutor, subject, onClose }) {
    const [message, setMessage] = useState(
        subject ? `Hi, I am looking for a ${subject} tutor. Are you available? Please let me know your schedule and fees.` : ""
    );
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState("");

    const handleSend = async () => {
        if (!message.trim()) return;
        setSending(true);
        setError("");
        try {
            const res = await fetch("/api/inquiry", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ toTutorId: tutor.id || tutor.userId, message, subject })
            });
            const data = await res.json();
            if (res.ok && data.success) {
                setSent(true);
            } else {
                setError(data.error || "Failed to send inquiry. Please try again.");
            }
        } catch {
            setError("Something went wrong. Please try again.");
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                    <X size={18} />
                </button>
                {sent ? (
                    <div className="text-center py-6">
                        <div className="size-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                            <Check size={28} className="text-emerald-600" />
                        </div>
                        <h3 className="font-bold text-gray-900 text-lg mb-2">Inquiry sent!</h3>
                        <p className="text-sm text-gray-500 mb-4">
                            {tutor.name} will receive your message and get back to you soon.
                        </p>
                        <button onClick={onClose}
                            className="px-6 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors">
                            Done
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="mb-4">
                            <div className="size-10 rounded-xl bg-blue-100 flex items-center justify-center mb-3">
                                <MessageCircle size={18} className="text-blue-600" />
                            </div>
                            <h3 className="font-bold text-gray-900 text-lg">Send Inquiry</h3>
                            <p className="text-sm text-gray-500">to {tutor.name}</p>
                        </div>
                        <textarea
                            value={message}
                            onChange={e => setMessage(e.target.value.slice(0, 500))}
                            placeholder="Hi, I need help with..."
                            rows={4}
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 resize-none outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-gray-400"
                        />
                        <p className="text-xs text-gray-400 text-right mt-1 mb-3">{message.length}/500</p>
                        {error && <p className="text-xs text-red-500 mb-3">{error}</p>}
                        <button onClick={handleSend} disabled={!message.trim() || sending}
                            className="flex items-center justify-center gap-2 w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition-colors">
                            {sending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                            {sending ? "Sending..." : "Send Inquiry"}
                        </button>
                        <p className="text-xs text-gray-400 text-center mt-3">The tutor will receive your phone number and message by email.</p>
                    </>
                )}
            </div>
        </div>
    );
}

// ─── Main Search Page ─────────────────────────────────────────────────────────
function SearchResultsContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const querySubject = searchParams.get("subject") || "";
    const queryLocation = searchParams.get("location") || "";
    const queryRole = (searchParams.get("role") || "TUTOR").toUpperCase();
    const queryLat = searchParams.get("lat");
    const queryLng = searchParams.get("lng");

    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filtersOpen, setFiltersOpen] = useState(false);
    const [visibleCount, setVisibleCount] = useState(12);

    // Auth state
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [signupModal, setSignupModal] = useState({ open: false, targetTutor: null, pendingAction: null });
    const [trialModal, setTrialModal] = useState({ open: false, tutor: null });
    // Inline modals for logged-in students
    const [contactModal, setContactModal] = useState({ open: false, tutor: null });
    const [inquiryModal, setInquiryModal] = useState({ open: false, tutor: null });

    // User's geolocation (for map + distance sort)
    const [userLat, setUserLat] = useState(queryLat ? parseFloat(queryLat) : null);
    const [userLng, setUserLng] = useState(queryLng ? parseFloat(queryLng) : null);
    const [isLocating, setIsLocating] = useState(false);

    // Sign-up role: if searching for tutors → sign up as student, and vice versa
    const signupRole = queryRole === "STUDENT" ? "TUTOR" : "STUDENT";

    // Filter & Sort State
    const [grade, setGrade] = useState(searchParams.get("grade") || "");
    const [maxRate, setMaxRate] = useState(10000);
    // Initialise sort from URL: ?sort=rating → sortBy="rating", ?nearby=true → sortBy="distance"
    const [sortBy, setSortBy] = useState(() => {
        if (searchParams.get("nearby") === "true") return "distance";
        return searchParams.get("sort") || "relevance";
    });
    const [verifiedOnly, setVerifiedOnly] = useState(false);
    const [listingType, setListingType] = useState("ALL");
    const [gender, setGender] = useState("");
    const [experience, setExperience] = useState("");
    const [teachingMode, setTeachingMode] = useState("");
    const [board, setBoard] = useState("");

    const grades = [
        "Primary (1-5)", "Middle (6-8)", "High School (9-10)",
        "Higher Secondary (11-12)", "Undergraduate", "Competitive Exams"
    ];

    // Check login state on mount
    useEffect(() => {
        fetch("/api/auth/me")
            .then(r => r.ok ? r.json() : null)
            .then(data => { if (data?.id) setLoggedInUser(data); })
            .catch(() => {});
    }, []);

    // Auto-detect location when ?nearby=true is in URL
    useEffect(() => {
        if (searchParams.get("nearby") === "true" && !queryLat && !queryLng) {
            detectLocation();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const detectLocation = () => {
        if (!("geolocation" in navigator)) return;
        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                const { latitude, longitude } = pos.coords;
                setUserLat(latitude);
                setUserLng(longitude);
                // Save to user record if logged in
                if (loggedInUser?.id) {
                    fetch("/api/user/update", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ userId: loggedInUser.id, lat: latitude, lng: longitude }),
                    }).catch(() => {});
                }
                // Re-fetch with coordinates for distance sorting
                const p = new URLSearchParams(searchParams.toString());
                p.set("lat", latitude.toString());
                p.set("lng", longitude.toString());
                p.set("sortBy", "distance");
                router.push(`/search?${p.toString()}`);
                setIsLocating(false);
            },
            () => setIsLocating(false)
        );
    };

    useEffect(() => {
        try {
            if (querySubject) localStorage.setItem("last_browsed_subject", querySubject);
            if (grade) localStorage.setItem("last_browsed_grade", grade);
            if (queryLocation) localStorage.setItem("last_browsed_location", queryLocation);
        } catch (e) {}
        fetchResults();
    }, [querySubject, queryLocation, queryRole, queryLat, queryLng, grade, maxRate, sortBy, verifiedOnly, gender, experience, teachingMode, board, listingType, userLat, userLng]);

    const fetchResults = async () => {
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams({
                subject: querySubject, location: queryLocation, role: queryRole,
                grade, maxRate: maxRate.toString(), sortBy,
                verified: verifiedOnly.toString(), gender, experience, teachingMode, board, listingType
            });
            const effectiveLat = userLat || queryLat;
            const effectiveLng = userLng || queryLng;
            if (effectiveLat) params.set("lat", effectiveLat.toString());
            if (effectiveLng) params.set("lng", effectiveLng.toString());
            const res = await fetch(`/api/search/tutors?${params.toString()}`);
            const data = await res.json();
            if (res.ok && Array.isArray(data)) {
                setResults(data);
                trackSearch({ subject: querySubject, location: queryLocation, role: queryRole, results_count: data.length });
            } else {
                setResults([]);
                if (!res.ok) setError(data?.error || "Unable to reach the server.");
            }
        } catch (err) {
            setError("Something went wrong. Please check your connection and try again.");
        } finally {
            setLoading(false);
        }
    };

    // ── Action handlers ───────────────────────────────────────────────────────

    const isUserPremium = (user) => {
        if (!user) return false;
        const hasSub = ["PRO", "ELITE"].includes(user.subscriptionTier) && user.subscriptionStatus === "ACTIVE";
        return hasSub || (user.credits || 0) > 0;
    };

    /** Student wants to view contact details. If not logged in → signup. If not premium → pricing. */
    const handleViewContact = (tutor) => {
        if (!loggedInUser) {
            saveIntent({
                action: "contact",
                tutorId: tutor.id || tutor.userId,
                tutorName: tutor.name,
                subject: querySubject || undefined,
            });
            setSignupModal({ open: true, targetTutor: tutor, pendingAction: "contact" });
            return;
        }
        if (!isUserPremium(loggedInUser)) {
            router.push("/pricing/student");
            return;
        }
        setContactModal({ open: true, tutor });
    };

    /** Student wants to send an inquiry. If not logged in → save intent, open signup. */
    const handleSendInquiry = (tutor) => {
        if (!loggedInUser) {
            saveIntent({
                action: "inquiry",
                tutorId: tutor.id || tutor.userId,
                tutorName: tutor.name,
                subject: querySubject || undefined,
            });
            setSignupModal({ open: true, targetTutor: tutor, pendingAction: "inquiry" });
            return;
        }
        setInquiryModal({ open: true, tutor });
    };

    /** Called after the inline signup modal completes — read stored intent and execute. */
    const handleSignupSuccess = (user) => {
        setLoggedInUser(user);
        const pending = signupModal.pendingAction;
        const targetTutor = signupModal.targetTutor;
        setSignupModal({ open: false, targetTutor: null, pendingAction: null });
        clearIntent();

        if (!targetTutor) return;
        if (pending === "contact") {
            setTimeout(() => setContactModal({ open: true, tutor: targetTutor }), 150);
        } else if (pending === "inquiry") {
            setTimeout(() => setInquiryModal({ open: true, tutor: targetTutor }), 150);
        }
    };

    const clearFilter = (key) => {
        if (key === "subject") { const p = new URLSearchParams(searchParams.toString()); p.delete("subject"); router.push(`/search?${p.toString()}`); }
        else if (key === "location") { const p = new URLSearchParams(searchParams.toString()); p.delete("location"); router.push(`/search?${p.toString()}`); }
        else if (key === "grade") setGrade("");
        else if (key === "teachingMode") setTeachingMode("");
        else if (key === "verifiedOnly") setVerifiedOnly(false);
        else if (key === "maxRate") setMaxRate(10000);
    };

    const roleLabel = queryRole === "STUDENT" ? "students" : queryRole === "INSTITUTE" ? "institutes" : "tutors";

    const resetFilters = () => {
        setGrade(""); setMaxRate(10000); setVerifiedOnly(false);
        setGender(""); setExperience(""); setTeachingMode(""); setBoard(""); setListingType("ALL");
    };

    const teachingModeLabel = (mode) => ({
        ONLINE: "Online", STUDENT_HOME: "At Student's Home",
        TUTOR_HOME: "At Tutor's Home", CENTER: "At Centre"
    }[mode] || mode);

    const activeFilterCount = [grade, teachingMode, verifiedOnly, board, gender, experience, listingType !== "ALL", maxRate < 10000].filter(Boolean).length;

    return (
        <>
            {/* Sign-up Modal */}
            {signupModal.open && (
                <SignupModal
                    onClose={() => setSignupModal({ open: false, targetTutor: null, pendingAction: null })}
                    onSuccess={handleSignupSuccess}
                    prefill={{ subject: querySubject, grade }}
                    signupRole={signupRole}
                />
            )}

            {/* Contact Details Modal */}
            {contactModal.open && contactModal.tutor && (
                <ContactModal
                    tutor={contactModal.tutor}
                    onClose={() => setContactModal({ open: false, tutor: null })}
                />
            )}

            {/* Inquiry Modal */}
            {inquiryModal.open && inquiryModal.tutor && (
                <InquiryModal
                    tutor={inquiryModal.tutor}
                    subject={querySubject}
                    onClose={() => setInquiryModal({ open: false, tutor: null })}
                />
            )}

            {trialModal.open && trialModal.tutor && (
                <TrialBookingModal
                    tutor={trialModal.tutor}
                    defaultSubject={querySubject}
                    onClose={() => setTrialModal({ open: false, tutor: null })}
                    onSuccess={() => {}}
                />
            )}

            <div className="flex min-h-screen bg-gray-50 font-sans pt-16">

                {/* Mobile filter overlay */}
                {filtersOpen && (
                    <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setFiltersOpen(false)} />
                )}

                {/* ── LEFT SIDEBAR: FILTERS ── */}
                <aside className={`
                    fixed lg:static inset-y-0 left-0 z-50 lg:z-auto
                    w-72
                    bg-white border-r border-gray-200
                    flex flex-col
                    lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)]
                    overflow-y-auto shrink-0
                    transition-transform duration-300
                    ${filtersOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:translate-x-0"}
                `}>
                    {/* Sidebar Header */}
                    <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
                        <div className="flex items-center gap-2">
                            <Filter size={15} className="text-gray-500" />
                            <h2 className="font-semibold text-gray-700 text-sm">Filters</h2>
                            {activeFilterCount > 0 && (
                                <span className="bg-blue-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                                    {activeFilterCount}
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-3">
                            {activeFilterCount > 0 && (
                                <button onClick={resetFilters} className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                                    Reset all
                                </button>
                            )}
                            <button onClick={() => setFiltersOpen(false)} className="lg:hidden text-gray-400 hover:text-gray-700 p-1">
                                <X size={16} />
                            </button>
                        </div>
                    </div>

                    <div className="p-5 space-y-6 flex-1">
                        {/* Teaching Mode */}
                        <div className="space-y-2.5">
                            <p className="text-xs font-semibold text-gray-500">Teaching Mode</p>
                            {[
                                { id: "", label: "All Modes" },
                                { id: "ONLINE", label: "Online" },
                                { id: "STUDENT_HOME", label: "At Student's Home" },
                                { id: "TUTOR_HOME", label: "At Tutor's Home" },
                                { id: "CENTER", label: "At Centre" }
                            ].map(mode => (
                                <label key={mode.id} className="flex items-center gap-2.5 cursor-pointer group">
                                    <input type="radio" name="teachingMode" value={mode.id}
                                        checked={teachingMode === mode.id}
                                        onChange={() => setTeachingMode(mode.id)}
                                        className="accent-blue-600 w-4 h-4 cursor-pointer" />
                                    <span className="text-sm text-gray-700 group-hover:text-blue-600">{mode.label}</span>
                                </label>
                            ))}
                        </div>

                        <div className="border-t border-gray-100" />

                        {/* Session Type */}
                        <div className="space-y-2.5">
                            <p className="text-xs font-semibold text-gray-500">Session Type</p>
                            {[
                                { id: "ALL", label: "All Types" },
                                { id: "PRIVATE", label: "Private (1-on-1)" },
                                { id: "GROUP", label: "Group / Batch" }
                            ].map(type => (
                                <label key={type.id} className="flex items-center gap-2.5 cursor-pointer group">
                                    <input type="radio" name="listingType" value={type.id}
                                        checked={listingType === type.id}
                                        onChange={() => setListingType(type.id)}
                                        className="accent-blue-600 w-4 h-4 cursor-pointer" />
                                    <span className="text-sm text-gray-700 group-hover:text-blue-600">{type.label}</span>
                                </label>
                            ))}
                        </div>

                        <div className="border-t border-gray-100" />

                        {/* Max Fee */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <p className="text-xs font-semibold text-gray-500">Max Fee / hour</p>
                                <span className="text-sm font-semibold text-blue-600">₹{maxRate >= 10000 ? "Any" : maxRate.toLocaleString()}</span>
                            </div>
                            <input type="range" min="0" max="10000" step="100" value={maxRate}
                                onChange={e => setMaxRate(parseInt(e.target.value))}
                                className="w-full accent-blue-600 cursor-pointer" />
                            <div className="flex justify-between text-xs text-gray-400">
                                <span>₹0</span><span>₹10,000+</span>
                            </div>
                        </div>

                        <div className="border-t border-gray-100" />

                        {/* Verified Only */}
                        <label className="flex items-center justify-between cursor-pointer">
                            <div className="flex items-center gap-2">
                                <ShieldCheck size={15} className="text-blue-600" />
                                <span className="text-sm font-medium text-gray-700">Verified Only</span>
                            </div>
                            <div onClick={() => setVerifiedOnly(!verifiedOnly)}
                                className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer ${verifiedOnly ? "bg-blue-600" : "bg-gray-200"}`}>
                                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${verifiedOnly ? "translate-x-5" : "translate-x-0.5"}`} />
                            </div>
                        </label>

                        <div className="border-t border-gray-100" />

                        {/* Board */}
                        <div className="space-y-2">
                            <p className="text-xs font-semibold text-gray-500">Board</p>
                            <select value={board} onChange={e => setBoard(e.target.value)}
                                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 bg-white outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer">
                                <option value="">All Boards</option>
                                {["CBSE", "ICSE", "IB", "IGCSE", "State Board"].map(b => <option key={b} value={b}>{b}</option>)}
                            </select>
                        </div>

                        <div className="border-t border-gray-100" />

                        {/* Gender Preference */}
                        <div className="space-y-2">
                            <p className="text-xs font-semibold text-gray-500">Tutor Gender</p>
                            <select value={gender} onChange={e => setGender(e.target.value)}
                                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 bg-white outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
                                <option value="">Any</option>
                                <option value="MALE">Male</option>
                                <option value="FEMALE">Female</option>
                            </select>
                        </div>

                        <div className="border-t border-gray-100" />

                        {/* Min Experience */}
                        <div className="space-y-2">
                            <p className="text-xs font-semibold text-gray-500">Min Experience</p>
                            <select value={experience} onChange={e => setExperience(e.target.value)}
                                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 bg-white outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
                                <option value="">Any</option>
                                <option value="1">1+ years</option>
                                <option value="3">3+ years</option>
                                <option value="5">5+ years</option>
                                <option value="10">10+ years</option>
                            </select>
                        </div>

                        <div className="border-t border-gray-100" />

                        {/* Post Requirement CTA */}
                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 space-y-2">
                            <div className="flex items-center gap-2">
                                <FileText size={15} className="text-blue-600" />
                                <p className="text-sm font-semibold text-blue-900">Can't find the right tutor?</p>
                            </div>
                            <p className="text-xs text-blue-700 leading-relaxed">Post your requirement and let tutors come to you — free.</p>
                            <Link href="/post-requirement"
                                className="block text-center text-xs font-semibold text-blue-600 border border-blue-200 bg-white rounded-lg py-2 hover:bg-blue-600 hover:text-white transition-colors">
                                Post Requirement
                            </Link>
                        </div>
                    </div>
                </aside>

                {/* ── CENTRE: RESULTS ── */}
                <div className="flex-1 flex flex-col min-w-0">

                    {/* Post-lead welcome banner — shown when user lands from chatbot/form after posting a requirement */}
                    {searchParams.get("welcome") === "lead" && (
                        <div className="bg-emerald-50 border-b border-emerald-100 px-4 py-3">
                            <div className="flex items-start gap-3 max-w-4xl mx-auto">
                                <BadgeCheck size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-emerald-900">
                                        Your requirement is posted ✓ Matching tutors will contact you within 12 hours.
                                    </p>
                                    <p className="text-xs text-emerald-700 mt-0.5">
                                        Meanwhile, here are {querySubject ? <><strong>{querySubject}</strong> </> : ""}tutors{queryLocation ? <> in <strong>{queryLocation}</strong></> : ""} you can browse and contact directly.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Results Toolbar */}
                    <div className="bg-white border-b border-gray-200 px-4 py-3 sticky top-16 z-30 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                            {/* Mobile filter toggle */}
                            <button onClick={() => setFiltersOpen(true)}
                                className="lg:hidden flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors shrink-0">
                                <Filter size={14} />
                                Filters
                                {activeFilterCount > 0 && <span className="bg-blue-600 text-white text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center">{activeFilterCount}</span>}
                            </button>

                            <div className="min-w-0">
                                {loading ? (
                                    <p className="text-sm text-gray-400">Searching...</p>
                                ) : (
                                    <p className="text-sm font-semibold text-gray-800 truncate">
                                        {results.length > 0
                                            ? <><span className="text-blue-600">{results.length} {roleLabel}</span>{querySubject ? <> for <span className="text-gray-900">{querySubject}</span></> : ""}{queryLocation ? <> in <span className="text-gray-900">{queryLocation}</span></> : ""}</>
                                            : `No ${roleLabel} found`
                                        }
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Sort */}
                        <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                            className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shrink-0">
                            <option value="relevance">Relevance</option>
                            <option value="rating">Highest Rated</option>
                            <option value="fee_low">Fee: Low to High</option>
                            <option value="fee_high">Fee: High to Low</option>
                            <option value="experience">Most Experienced</option>
                        </select>
                    </div>

                    {/* Active Filter Chips */}
                    <FilterChips
                        subject={querySubject} location={queryLocation}
                        grade={grade} teachingMode={teachingMode}
                        verifiedOnly={verifiedOnly} maxRate={maxRate}
                        onClear={clearFilter}
                    />

                    {/* Results List */}
                    <div className="flex-1 p-4 space-y-3 max-w-2xl w-full mx-auto lg:max-w-none">
                        {loading ? (
                            <div className="space-y-3">
                                {[1, 2, 3].map(i => <SkeletonLoader key={i} />)}
                            </div>
                        ) : error ? (
                            <div className="bg-white border border-red-100 rounded-xl p-10 text-center">
                                <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <WifiOff size={24} className="text-red-400" />
                                </div>
                                <h2 className="text-base font-semibold text-gray-800 mb-1">Could not load results</h2>
                                <p className="text-sm text-red-500 mb-5">{error}</p>
                                <button onClick={fetchResults}
                                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors">
                                    <RefreshCw size={14} /> Try Again
                                </button>
                            </div>
                        ) : results.length > 0 ? (
                            <>
                                {results.slice(0, visibleCount).map((item, idx) => (
                                    <div key={idx}
                                        className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:border-blue-100 transition-all p-4 flex gap-4">
                                        {/* Avatar */}
                                        <div className="flex flex-col items-center shrink-0 gap-1.5">
                                            <div className="w-16 h-16 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center relative overflow-hidden">
                                                {item.image
                                                    ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                    : item.isInstitute
                                                        ? <Building2 size={26} className="text-blue-400" />
                                                        : <User size={26} className="text-blue-400" />
                                                }
                                                {item.isVerified && (
                                                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center border-2 border-white">
                                                        <BadgeCheck size={10} className="text-white" strokeWidth={2.5} />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-0.5">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} size={10}
                                                        fill={i < Math.floor(item.rating || 4.5) ? "#f59e0b" : "none"}
                                                        className={i < Math.floor(item.rating || 4.5) ? "text-amber-400" : "text-gray-200"} />
                                                ))}
                                            </div>
                                            <p className="text-xs text-gray-400">{(item.rating || 4.5).toFixed(1)}</p>
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2 mb-1.5">
                                                <div className="min-w-0">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <h3 className="font-bold text-gray-900 text-base">{item.name}</h3>
                                                        {item.isVerified && (
                                                            <span className="inline-flex items-center gap-1 text-xs text-blue-600 font-medium bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                                                                <ShieldCheck size={10} /> Verified
                                                            </span>
                                                        )}
                                                        {item.isFeatured && (
                                                            <span className="text-xs text-amber-700 font-medium bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">Featured</span>
                                                        )}
                                                        {item.isVipEligible && (
                                                            <span className="inline-flex items-center gap-1 text-xs text-indigo-700 font-semibold bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                                                                <Star size={9} fill="currentColor" /> VIP
                                                            </span>
                                                        )}
                                                        {item.matchScore > 0 && (
                                                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                                                                item.matchScore >= 85 ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                                                                item.matchScore >= 60 ? "bg-blue-50 text-blue-700 border border-blue-200" :
                                                                "bg-gray-50 text-gray-600 border border-gray-200"
                                                            }`}>{item.matchScore}% match</span>
                                                        )}
                                                    </div>
                                                    <div className="flex flex-wrap items-center gap-2 mt-1">
                                                        <span className="inline-flex items-center gap-1 text-xs font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                                                            <GraduationCap size={11} /> {item.subject || querySubject || "Academics"}
                                                        </span>
                                                        {item.distance != null && item.distance < 9999 ? (
                                                            <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                                                                <MapPin size={11} /> {item.distance < 1 ? "< 1 km" : `${Math.round(item.distance)} km away`}
                                                            </span>
                                                        ) : item.location ? (
                                                            <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                                                                <MapPin size={11} /> {item.location}
                                                            </span>
                                                        ) : null}
                                                        {item.experience > 0 && (
                                                            <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                                                                <Briefcase size={11} /> {item.experience} yrs
                                                            </span>
                                                        )}
                                                        {item.teachingMode && (
                                                            <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                                                                <Monitor size={11} /> {teachingModeLabel(item.teachingMode)}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Fee */}
                                                <div className="text-right shrink-0">
                                                    {item.rate > 0 ? (
                                                        <>
                                                            <p className="text-lg font-bold text-gray-900">₹{item.rate}</p>
                                                            <p className="text-xs text-gray-400">{item.role === "INSTITUTE" ? "per course" : "per hour"}</p>
                                                        </>
                                                    ) : (
                                                        <p className="text-sm font-medium text-gray-400">{item.role === "INSTITUTE" ? "Ask for fees" : "Ask for rate"}</p>
                                                    )}
                                                </div>
                                            </div>

                                            {item.bio && (
                                                <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 mb-3">{item.bio}</p>
                                            )}

                                            {/* Actions */}
                                            <div className="flex items-center gap-2 flex-wrap">
                                                {/* Primary: Contact Tutor */}
                                                <button
                                                    onClick={() => handleViewContact(item)}
                                                    className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 active:scale-95 transition-all"
                                                >
                                                    <Phone size={12} />
                                                    {item.role === "INSTITUTE" ? "Contact Institute" : "Contact Tutor"}
                                                </button>

                                                {/* View Profile */}
                                                <Link href={`/search/${item.id || item.userId || "#"}`}
                                                    onClick={() => trackViewProfile(item.id)}
                                                    className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-50 transition-all">
                                                    View Profile <ArrowRight size={12} />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {visibleCount < results.length && (
                                    <button onClick={() => setVisibleCount(prev => prev + 12)}
                                        className="w-full py-3 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-blue-600 hover:bg-blue-50 hover:border-blue-200 transition-colors">
                                        Show more ({results.length - visibleCount} remaining)
                                    </button>
                                )}
                            </>
                        ) : (
                            <div className="space-y-4">
                                {/* Primary: post requirement — turn a dead-end into a lead */}
                                <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-2xl p-6 sm:p-8 shadow-sm">
                                    <div className="flex items-start gap-4">
                                        <div className="size-12 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center shrink-0">
                                            <MessageCircle size={22} className="text-white" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h2 className="text-lg sm:text-xl font-bold mb-1">
                                                {querySubject || queryLocation
                                                    ? <>No {roleLabel}{querySubject ? <> for <span className="text-yellow-200">{querySubject}</span></> : ""}{queryLocation ? <> in <span className="text-yellow-200">{queryLocation}</span></> : ""} yet — let them come to you.</>
                                                    : <>Tell us what you need. Tutors will contact you.</>
                                                }
                                            </h2>
                                            <p className="text-sm text-blue-100 leading-relaxed mb-4">
                                                Post a free requirement and matching tutors will reach out — usually within 12 hours.
                                            </p>
                                            <Link
                                                href={`/post-requirement?${querySubject ? `subject=${encodeURIComponent(querySubject)}&` : ""}${queryLocation ? `location=${encodeURIComponent(queryLocation)}` : ""}`}
                                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-blue-700 text-sm font-semibold rounded-lg hover:bg-blue-50 transition-colors"
                                            >
                                                Post a free requirement <ArrowRight size={14} />
                                            </Link>
                                        </div>
                                    </div>
                                </div>

                                {/* Secondary: tweak the search */}
                                <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
                                    <p className="text-sm font-semibold text-gray-700 mb-1">Or try a broader search</p>
                                    <p className="text-xs text-gray-400 mb-4">Some filters might be too narrow.</p>
                                    <button
                                        onClick={resetFilters}
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 text-sm font-semibold text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                                    >
                                        Clear all filters
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* ── RIGHT: STICKY MAP ── */}
                <div className="hidden lg:flex flex-col w-[360px] xl:w-[420px] shrink-0 sticky top-16 h-[calc(100vh-4rem)] p-3 gap-2">
                    {/* Map header row */}
                    <div className="flex items-center justify-between px-1">
                        <p className="text-xs font-semibold text-gray-500">
                            {results.length > 0 ? `${results.length} tutors on map` : "Map view"}
                        </p>
                        <button
                            onClick={detectLocation}
                            disabled={isLocating}
                            className="flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                        >
                            {isLocating
                                ? <><div className="w-3 h-3 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin" /> Locating...</>
                                : <><MapPin size={12} /> Near me</>
                            }
                        </button>
                    </div>
                    <div className="flex-1 min-h-0">
                        <MapComponent tutors={results} userLat={userLat} userLng={userLng} />
                    </div>
                    {!loggedInUser && (
                        <div className="bg-white border border-gray-200 rounded-xl p-3 flex items-center justify-between gap-3">
                            <div className="min-w-0">
                                <p className="text-xs font-semibold text-gray-800">Post your requirement free</p>
                                <p className="text-xs text-gray-400">Let tutors come to you</p>
                            </div>
                            <button onClick={() => setSignupModal({ open: true, targetTutor: null })}
                                className="px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition-colors shrink-0">
                                Sign Up
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={
            <div className="h-screen w-full flex flex-col items-center justify-center bg-gray-50">
                <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mb-4" />
                <p className="text-sm text-gray-500">Loading results...</p>
            </div>
        }>
            <SearchResultsContent />
        </Suspense>
    );
}
