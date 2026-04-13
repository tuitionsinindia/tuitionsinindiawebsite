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
    Lock,
    BadgeCheck,
    User,
    Briefcase,
    Monitor,
    Users,
    Building2,
    RefreshCw,
    X,
    Phone,
    BookOpen,
    FileText
} from "lucide-react";
import { SUBJECT_CATEGORIES } from "../../lib/subjects";
import SkeletonLoader from "../components/SkeletonLoader";
import MapComponent from "../components/MapComponent";
import { trackSearch, trackViewProfile } from "@/lib/analytics";

// ─── Sign-up Modal ─────────────────────────────────────────────────────────────
// signupRole: "STUDENT" when searching for tutors, "TUTOR" when searching for students
function SignupModal({ onClose, onSuccess, prefill = {}, signupRole = "STUDENT" }) {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");
    const [userId, setUserId] = useState(null);

    const roleLabel = signupRole === "TUTOR" ? "tutor" : "student";
    const roleTitle = signupRole === "TUTOR" ? "Sign up as a Tutor" : "Sign up to contact tutors";
    const roleDesc = signupRole === "TUTOR"
        ? "Create your free tutor account to connect with students."
        : "Create your free student account to unlock tutor contact details.";

    const handleSendOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const res = await fetch("/api/auth/otp/send", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phone, role: signupRole, isRegistration: true }),
            });
            const data = await res.json();
            if (data.success) { setUserId(data.userId); setStep(2); }
            else setError(data.error || "Failed to send OTP.");
        } catch { setError("Something went wrong. Please try again."); }
        finally { setLoading(false); }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const res = await fetch("/api/auth/otp/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, phone, otp }),
            });
            const data = await res.json();
            if (data.success) onSuccess(data.user);
            else setError(data.error || "Invalid OTP.");
        } catch { setError("Verification failed. Please try again."); }
        finally { setLoading(false); }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-5">
                {/* Close */}
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
                    <X size={20} />
                </button>

                {/* Header */}
                <div className="pr-8">
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mb-3">
                        <GraduationCap size={20} className="text-blue-600" />
                    </div>
                    <h2 className="text-lg font-bold text-gray-900">
                        {step === 1 ? roleTitle : "Enter OTP"}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        {step === 1 ? roleDesc : `Enter the 6-digit code sent to +91 ${phone}`}
                    </p>
                    {prefill.subject && (
                        <div className="mt-2 inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1 rounded-full">
                            <BookOpen size={11} /> {prefill.subject}
                            {prefill.grade ? ` · ${prefill.grade}` : ""}
                        </div>
                    )}
                </div>

                {step === 1 ? (
                    <form onSubmit={handleSendOTP} className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-gray-500">Mobile Number</label>
                            <div className="relative flex items-center border border-gray-200 rounded-xl bg-gray-50 focus-within:bg-white focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                                <Phone size={15} className="text-gray-400 ml-3 shrink-0" />
                                <span className="text-gray-500 text-sm font-medium px-2 border-r border-gray-200">+91</span>
                                <input
                                    required type="tel" pattern="[0-9]{10}" value={phone}
                                    onChange={e => setPhone(e.target.value)}
                                    placeholder="10-digit number"
                                    className="flex-1 bg-transparent px-3 py-3 text-sm outline-none text-gray-900"
                                    autoFocus
                                />
                            </div>
                        </div>
                        {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>}
                        <button type="submit" disabled={loading}
                            className="w-full py-3 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
                            {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Send OTP <ArrowRight size={15} /></>}
                        </button>
                        <p className="text-xs text-gray-400 text-center">
                            Already have an account? <Link href="/login" className="text-blue-600 hover:underline font-medium">Log in</Link>
                        </p>
                    </form>
                ) : (
                    <form onSubmit={handleVerifyOTP} className="space-y-4">
                        <input
                            required type="text" maxLength="6" value={otp}
                            onChange={e => setOtp(e.target.value)}
                            className="w-full text-center text-2xl tracking-[0.5em] font-bold py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                            placeholder="------" autoFocus
                        />
                        {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg text-center">{error}</p>}
                        <button type="submit" disabled={loading}
                            className="w-full py-3 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
                            {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Verify & Continue <ArrowRight size={15} /></>}
                        </button>
                        <p className="text-center text-xs text-gray-400">
                            Wrong number? <button type="button" onClick={() => { setStep(1); setOtp(""); setError(""); }} className="text-blue-600 hover:underline font-medium">Change</button>
                        </p>
                    </form>
                )}
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
    const [signupModal, setSignupModal] = useState({ open: false, targetTutor: null });

    // User's geolocation (for map + distance sort)
    const [userLat, setUserLat] = useState(queryLat ? parseFloat(queryLat) : null);
    const [userLng, setUserLng] = useState(queryLng ? parseFloat(queryLng) : null);
    const [isLocating, setIsLocating] = useState(false);

    // Sign-up role: if searching for tutors → sign up as student, and vice versa
    const signupRole = queryRole === "STUDENT" ? "TUTOR" : "STUDENT";

    // Filter & Sort State
    const [grade, setGrade] = useState(searchParams.get("grade") || "");
    const [maxRate, setMaxRate] = useState(10000);
    const [sortBy, setSortBy] = useState("relevance");
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

    const handleContactTutor = (tutor) => {
        if (!loggedInUser) {
            setSignupModal({ open: true, targetTutor: tutor });
            return;
        }
        // Logged in — go to registration/unlock flow
        const registerRoute = queryRole === "STUDENT" ? "/register/tutor" : "/register/student";
        const params = new URLSearchParams();
        const queryCategory = searchParams.get("category");
        if (queryCategory) params.set("category", queryCategory);
        if (querySubject) params.set("subject", querySubject);
        if (grade) params.set("grade", grade);
        if (queryLocation) params.set("location", queryLocation);
        const tutorId = tutor.id || tutor.userId || "";
        if (tutorId) params.set("tutorId", tutorId);
        params.set("intent", "unlock");
        router.push(`${registerRoute}?${params.toString()}`);
    };

    const handleSignupSuccess = (user) => {
        setLoggedInUser(user);
        setSignupModal({ open: false, targetTutor: null });
        // If there's a target tutor, proceed to contact
        if (signupModal.targetTutor) {
            setTimeout(() => handleContactTutor(signupModal.targetTutor), 100);
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
                    onClose={() => setSignupModal({ open: false, targetTutor: null })}
                    onSuccess={handleSignupSuccess}
                    prefill={{ subject: querySubject, grade }}
                    signupRole={signupRole}
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
                                            <div className="w-16 h-16 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center relative">
                                                {item.role === "INSTITUTE"
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
                                                        {item.location && (
                                                            <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                                                                <MapPin size={11} /> {item.location}
                                                            </span>
                                                        )}
                                                        {item.experience && (
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
                                                    <p className="text-lg font-bold text-gray-900">₹{item.rate || "500"}</p>
                                                    <p className="text-xs text-gray-400">per hour</p>
                                                </div>
                                            </div>

                                            {item.bio && (
                                                <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 mb-3">{item.bio}</p>
                                            )}

                                            {/* Actions */}
                                            <div className="flex items-center gap-2">
                                                <button onClick={() => handleContactTutor(item)}
                                                    className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 active:scale-95 transition-all">
                                                    {loggedInUser ? <><Lock size={12} /> Unlock Contact</> : <><Phone size={12} /> Contact Tutor</>}
                                                </button>
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
                            <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
                                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Search size={28} className="text-gray-300" />
                                </div>
                                <h2 className="text-base font-semibold text-gray-700 mb-1">No {roleLabel} found</h2>
                                <p className="text-sm text-gray-400 mb-5">Try adjusting your filters or searching for a different subject or location.</p>
                                <button onClick={resetFilters}
                                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors">
                                    Clear Filters
                                </button>
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
