"use client";

import { useState, useEffect, Suspense, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Logo from "@/app/components/Logo";
import VipAdminPanel from "@/app/components/VipAdminPanel";
import {
    LayoutDashboard,
    Users,
    CreditCard,
    RefreshCcw,
    LogOut,
    GraduationCap,
    UserCheck,
    Database,
    TrendingUp,
    Search,
    Settings,
    CheckCircle2,
    XCircle,
    BarChart3,
    Target,
    Wallet,
    Phone,
    Mail,
    Star,
    ShieldCheck,
    BookOpen,
    Calendar,
    Zap,
    ChevronLeft,
    ChevronRight,
    PlusCircle,
    Eye,
    Edit2,
    Trash2,
    Send,
    Play,
    CheckCircle,
    AlertCircle,
    Info,
    ArrowUpRight,
    ArrowDownRight,
    DollarSign,
    Clock
} from "lucide-react";

// Simple inline SVG bar chart — no external library needed
function BarChart({ data = [], height = 160, labelKey = "label", valueKey = "value" }) {
    const [hovered, setHovered] = useState(null);
    if (!data || data.length === 0) {
        return (
            <div className="flex items-center justify-center bg-gray-50 rounded-xl border border-gray-100" style={{ height }}>
                <p className="text-gray-400 text-sm">No data available</p>
            </div>
        );
    }

    const values = data.map(d => d[valueKey] || 0);
    const maxVal = Math.max(...values, 1);
    const barWidth = 100 / data.length;
    const chartPad = 8;

    return (
        <div className="relative" style={{ height }}>
            <svg width="100%" height={height} viewBox={`0 0 100 100`} preserveAspectRatio="none" className="absolute inset-0">
                {data.map((d, i) => {
                    const barH = ((d[valueKey] || 0) / maxVal) * 80;
                    const x = i * barWidth + barWidth * 0.15;
                    const w = barWidth * 0.7;
                    const y = 85 - barH;
                    return (
                        <rect
                            key={i}
                            x={`${x}%`}
                            y={`${y}%`}
                            width={`${w}%`}
                            height={`${barH}%`}
                            rx="1"
                            className={hovered === i ? "fill-blue-600" : "fill-blue-400"}
                            style={{ transition: "fill 0.15s" }}
                            onMouseEnter={() => setHovered(i)}
                            onMouseLeave={() => setHovered(null)}
                        />
                    );
                })}
                {/* X-axis line */}
                <line x1="0" y1="86%" x2="100%" y2="86%" stroke="#e5e7eb" strokeWidth="0.5" />
            </svg>
            {/* X-axis labels */}
            <div className="absolute bottom-0 left-0 right-0 flex" style={{ height: 16 }}>
                {data.map((d, i) => (
                    <div
                        key={i}
                        className="flex-1 text-center text-gray-400 overflow-hidden"
                        style={{ fontSize: 9 }}
                    >
                        {i % 5 === 0 || i === data.length - 1 ? d[labelKey] : ""}
                    </div>
                ))}
            </div>
            {/* Hover tooltip */}
            {hovered !== null && (
                <div
                    className="absolute bg-gray-800 text-white text-xs rounded-lg px-2 py-1 pointer-events-none z-10 whitespace-nowrap"
                    style={{
                        left: `${(hovered / data.length) * 100 + (100 / data.length) / 2}%`,
                        top: 4,
                        transform: "translateX(-50%)"
                    }}
                >
                    {data[hovered][labelKey]}: ₹{(data[hovered][valueKey] || 0).toLocaleString("en-IN")}
                </div>
            )}
        </div>
    );
}

// Colored progress bar for revenue breakdown
function BreakdownBar({ label, value, total, color = "bg-blue-500" }) {
    const pct = total > 0 ? Math.round((value / total) * 100) : 0;
    return (
        <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
                <span className="text-gray-700 font-semibold">{label}</span>
                <span className="text-gray-500">₹{value.toLocaleString("en-IN")} <span className="text-gray-400">({pct}%)</span></span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${pct}%` }} />
            </div>
        </div>
    );
}

// Status badge helper
function StatusBadge({ status }) {
    const map = {
        PENDING:   { label: "Pending",   cls: "bg-amber-50 text-amber-600 border-amber-100" },
        CONFIRMED: { label: "Confirmed", cls: "bg-blue-50 text-blue-600 border-blue-100" },
        COMPLETED: { label: "Completed", cls: "bg-emerald-50 text-emerald-600 border-emerald-100" },
        CANCELLED: { label: "Cancelled", cls: "bg-red-50 text-red-500 border-red-100" },
    };
    const s = map[status] || { label: status, cls: "bg-gray-50 text-gray-500 border-gray-200" };
    return <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${s.cls}`}>{s.label}</span>;
}

function DepositBadge({ status }) {
    const map = {
        UNPAID:   { label: "Unpaid",    cls: "bg-gray-50 text-gray-500 border-gray-200" },
        PAID:     { label: "Paid",      cls: "bg-blue-50 text-blue-600 border-blue-100" },
        CREDITED: { label: "Credited",  cls: "bg-purple-50 text-purple-600 border-purple-100" },
        RELEASED: { label: "Released",  cls: "bg-emerald-50 text-emerald-600 border-emerald-100" },
        REFUNDED: { label: "Refunded",  cls: "bg-red-50 text-red-500 border-red-100" },
    };
    const s = map[status] || { label: status || "Unknown", cls: "bg-gray-50 text-gray-500 border-gray-200" };
    return <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${s.cls}`}>{s.label}</span>;
}

// ─── Projections math ──────────────────────────────────────────────────────────
function computeProjection(assumptions, month) {
    const {
        tutorSignupsPerMonth,
        studentSignupsPerMonth,
        pctCreditBuyers,
        pctPro,
        pctElite,
        pctVerified,
        avgCreditValue,
        proPrice,
        elitePrice,
        verificationFee,
    } = assumptions;

    const tutors   = tutorSignupsPerMonth * month;
    const pro      = Math.round(tutors * (pctPro / 100));
    const elite    = Math.round(tutors * (pctElite / 100));
    const creditB  = Math.round(tutorSignupsPerMonth * (pctCreditBuyers / 100));
    const verifiedNew = Math.round(tutorSignupsPerMonth * (pctVerified / 100));

    const creditRev  = creditB * avgCreditValue;
    const subRev     = pro * proPrice + elite * elitePrice;
    const verifyRev  = verifiedNew * verificationFee;
    const total      = creditRev + subRev + verifyRev;

    return { tutors, pro, elite, creditRev, subRev, verifyRev, total };
}

// ─── Main component ────────────────────────────────────────────────────────────
function AdminDashboardContent() {
    const router = useRouter();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("overview");

    // Admin key gate
    const [adminKey, setAdminKey] = useState("");
    const [keyInput, setKeyInput] = useState("");
    const [keyError, setKeyError] = useState("");
    const [keyLoading, setKeyLoading] = useState(false);

    // Users tab
    const [users, setUsers] = useState([]);
    const [usersLoading, setUsersLoading] = useState(false);
    const [userSearch, setUserSearch] = useState("");
    const [userActionLoading, setUserActionLoading] = useState(null);
    const [userRoleFilter, setUserRoleFilter] = useState("ALL");
    const [userStatusFilter, setUserStatusFilter] = useState("ALL");
    const [userSort, setUserSort] = useState("createdAt_desc");
    const [userPage, setUserPage] = useState(1);
    const [userTotal, setUserTotal] = useState(0);
    const [userPages, setUserPages] = useState(1);
    const [selectedUser, setSelectedUser] = useState(null);
    const [userDrawerOpen, setUserDrawerOpen] = useState(false);
    const [userDrawerLoading, setUserDrawerLoading] = useState(false);
    const [userEditMode, setUserEditMode] = useState(false);
    const [userEditData, setUserEditData] = useState({});
    const [userEditSaving, setUserEditSaving] = useState(false);

    // Verification requests
    const [pendingVerifications, setPendingVerifications] = useState([]);
    const [verificationActionLoading, setVerificationActionLoading] = useState(null);

    // Analytics tab
    const [analyticsRevenue, setAnalyticsRevenue] = useState([]);
    const [analyticsGrowth, setAnalyticsGrowth] = useState(null);
    const [analyticsLoading, setAnalyticsLoading] = useState(false);

    // Bookings tab
    const [bookings, setBookings] = useState([]);
    const [bookingsLoading, setBookingsLoading] = useState(false);
    const [bookingFilter, setBookingFilter] = useState("All");
    const [bookingSearch, setBookingSearch] = useState("");
    const [bookingPage, setBookingPage] = useState(1);
    const [bookingTotal, setBookingTotal] = useState(0);
    const BOOKINGS_PER_PAGE = 20;

    // Blog tab
    const [blogPosts, setBlogPosts] = useState([]);
    const [blogLoading, setBlogLoading] = useState(false);
    const [blogView, setBlogView] = useState("list"); // "list" | "edit"
    const [editingPost, setEditingPost] = useState(null);
    const [blogForm, setBlogForm] = useState({
        title: "", slug: "", category: "Study Tips", excerpt: "",
        content: "", author: "TuitionsInIndia", readTime: "5 min read",
        coverImageUrl: "", isPublished: false
    });
    const [blogSaving, setBlogSaving] = useState(false);

    // Emails tab
    const [emailSegment, setEmailSegment] = useState("All users");
    const [emailSubject, setEmailSubject] = useState("");
    const [emailBody, setEmailBody] = useState("");
    const [emailPreview, setEmailPreview] = useState(null);
    const [emailSending, setEmailSending] = useState(false);
    const [emailStatus, setEmailStatus] = useState(null);

    // Automations tab
    const [cronStatus, setCronStatus] = useState({});

    // Projections tab
    const [projAssumptions, setProjAssumptions] = useState({
        tutorSignupsPerMonth: 50,
        studentSignupsPerMonth: 150,
        pctCreditBuyers: 20,
        pctPro: 10,
        pctElite: 2,
        pctVerified: 30,
        demosPerStudentMonth: 0.5,
        avgCreditValue: 249,
        proPrice: 499,
        elitePrice: 1999,
        verificationFee: 999,
        demoPlatformCut: 30,
        fixedMonthlyCosts: 15000,
    });

    // Goals tab
    const [goals, setGoals] = useState([]);
    const [goalsLoading, setGoalsLoading] = useState(false);

    // Budget tab
    const [budget, setBudget] = useState(null);
    const [budgetHistory, setBudgetHistory] = useState([]);
    const [budgetLoading, setBudgetLoading] = useState(false);

    // Insights
    const [insights, setInsights] = useState([]);
    const [insightsLoading, setInsightsLoading] = useState(false);
    const [unreadInsights, setUnreadInsights] = useState(0);

    // Goal form
    const [showGoalForm, setShowGoalForm] = useState(false);
    const [goalForm, setGoalForm] = useState({ title: "", category: "REVENUE", targetValue: 200000, deadline: "", notes: "" });

    // Budget form
    const [budgetForm, setBudgetForm] = useState({ totalBudget: 30000, adSpend: 0, breakdown: { facebook: 0, google: 0, whatsapp: 0, other: 0 }, notes: "" });

    // On mount: check localStorage (set by /admin/login) or sessionStorage fallback
    useEffect(() => {
        const saved = localStorage.getItem("ti_admin_key") || sessionStorage.getItem("adminKey");
        if (saved) setAdminKey(saved);
        else setLoading(false);
    }, []);

    useEffect(() => {
        if (adminKey) fetchMetrics(adminKey);
    }, [adminKey]);

    useEffect(() => {
        if (!adminKey) return;
        if (activeTab === "users") fetchUsers(userSearch, adminKey);
        if (activeTab === "stats") fetchAnalytics();
        if (activeTab === "bookings") fetchBookings();
        if (activeTab === "blog") fetchBlogPosts();
        if (activeTab === "goals") fetchGoals();
        if (activeTab === "budget") fetchBudget();
    }, [activeTab, adminKey]);

    const handleKeySubmit = async (e) => {
        e.preventDefault();
        setKeyError("");
        setKeyLoading(true);
        try {
            const res = await fetch("/api/admin/metrics", { headers: { "x-admin-key": keyInput } });
            if (res.status === 401) {
                setKeyError("Incorrect admin key. Please try again.");
                setKeyLoading(false);
                return;
            }
            localStorage.setItem("ti_admin_key", keyInput);
            sessionStorage.setItem("adminKey", keyInput);
            setAdminKey(keyInput);
        } catch {
            setKeyError("Could not connect. Please try again.");
        } finally {
            setKeyLoading(false);
        }
    };

    const adminHeaders = (key) => ({ "x-admin-key": key || adminKey, "Content-Type": "application/json" });

    const fetchMetrics = async (key) => {
        setLoading(true);
        try {
            const [metricsRes, verificationsRes] = await Promise.all([
                fetch("/api/admin/metrics", { headers: { "x-admin-key": key || adminKey } }),
                fetch("/api/admin/verification/requests", { headers: { "x-admin-key": key || adminKey } }),
            ]);
            const json = await metricsRes.json();
            if (json.success) setData(json);
            if (verificationsRes.ok) {
                const vJson = await verificationsRes.json();
                setPendingVerifications(vJson.requests || []);
            }
            fetchInsights();
        } catch (err) {
            console.error("Failed to load metrics", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchAnalytics = async () => {
        setAnalyticsLoading(true);
        try {
            const [revRes, growthRes] = await Promise.all([
                fetch("/api/admin/analytics/revenue?days=30", { headers: { "x-admin-key": adminKey } }),
                fetch("/api/admin/analytics/growth?days=30", { headers: { "x-admin-key": adminKey } }),
            ]);
            if (revRes.ok) {
                const j = await revRes.json();
                setAnalyticsRevenue(j.data || j.revenue || []);
            }
            if (growthRes.ok) {
                const j = await growthRes.json();
                setAnalyticsGrowth(j);
            }
        } catch (err) {
            console.error("Failed to load analytics", err);
        } finally {
            setAnalyticsLoading(false);
        }
    };

    const fetchBookings = async (page = bookingPage, filter = bookingFilter, search = bookingSearch) => {
        setBookingsLoading(true);
        try {
            const params = new URLSearchParams({ page, limit: BOOKINGS_PER_PAGE, status: filter === "All" ? "" : filter, search });
            const res = await fetch(`/api/admin/bookings?${params}`, { headers: { "x-admin-key": adminKey } });
            if (res.ok) {
                const j = await res.json();
                setBookings(j.bookings || []);
                setBookingTotal(j.total || 0);
            }
        } catch (err) {
            console.error("Failed to load bookings", err);
        } finally {
            setBookingsLoading(false);
        }
    };

    const fetchBlogPosts = async () => {
        setBlogLoading(true);
        try {
            const res = await fetch("/api/admin/blog", { headers: { "x-admin-key": adminKey } });
            if (res.ok) {
                const j = await res.json();
                setBlogPosts(j.posts || j || []);
            }
        } catch (err) {
            console.error("Failed to load blog posts", err);
        } finally {
            setBlogLoading(false);
        }
    };

    const fetchGoals = async () => {
        setGoalsLoading(true);
        try {
            const res = await fetch("/api/admin/goals", { headers: { "x-admin-key": adminKey } });
            const data = await res.json();
            if (data.goals) setGoals(data.goals);
        } catch {} finally { setGoalsLoading(false); }
    };

    const fetchBudget = async () => {
        setBudgetLoading(true);
        try {
            const res = await fetch("/api/admin/budget", { headers: { "x-admin-key": adminKey } });
            const data = await res.json();
            if (data.currentMonth) setBudget(data.currentMonth);
            if (data.budgets) setBudgetHistory(data.budgets);
        } catch {} finally { setBudgetLoading(false); }
    };

    const fetchInsights = async () => {
        setInsightsLoading(true);
        try {
            const res = await fetch("/api/admin/insights?limit=20", { headers: { "x-admin-key": adminKey } });
            const data = await res.json();
            if (data.insights) setInsights(data.insights);
            if (typeof data.unreadCount === "number") setUnreadInsights(data.unreadCount);
        } catch {} finally { setInsightsLoading(false); }
    };

    const handleVerificationReview = async (id, action) => {
        let rejectionReason;
        if (action === "REJECT") {
            rejectionReason = window.prompt("Enter a reason for rejection:");
            if (!rejectionReason) return;
        }
        setVerificationActionLoading(id + action);
        try {
            const res = await fetch(`/api/admin/verification/${id}/review`, {
                method: "PATCH",
                headers: adminHeaders(),
                body: JSON.stringify({ action, rejectionReason }),
            });
            const json = await res.json();
            if (json.success) {
                setPendingVerifications(prev => prev.filter(v => v.id !== id));
            } else {
                alert(json.error || "Something went wrong. Please try again.");
            }
        } catch (err) {
            console.error(err);
            alert("Something went wrong. Please try again.");
        } finally {
            setVerificationActionLoading(null);
        }
    };

    const fetchUsers = async (overrides = {}) => {
        setUsersLoading(true);
        const search = overrides.search  !== undefined ? overrides.search  : userSearch;
        const page   = overrides.page   !== undefined ? overrides.page   : userPage;
        const role   = overrides.role   !== undefined ? overrides.role   : userRoleFilter;
        const status = overrides.status !== undefined ? overrides.status : userStatusFilter;
        const sort   = overrides.sort   !== undefined ? overrides.sort   : userSort;
        try {
            const params = new URLSearchParams({ search, page, role, status, sort });
            const res = await fetch(`/api/admin/users?${params}`, { headers: { "x-admin-key": adminKey } });
            const json = await res.json();
            if (json.success) {
                setUsers(json.users || []);
                setUserTotal(json.total || 0);
                setUserPages(json.pages || 1);
            }
        } catch (err) {
            console.error("Failed to load users", err);
        } finally {
            setUsersLoading(false);
        }
    };

    const openUserDrawer = async (userId) => {
        setUserDrawerOpen(true);
        setUserEditMode(false);
        setUserEditData({});
        setSelectedUser(null);
        setUserDrawerLoading(true);
        try {
            const res = await fetch(`/api/admin/user/${userId}`, { headers: { "x-admin-key": adminKey } });
            const json = await res.json();
            if (json.success) setSelectedUser(json.user);
        } catch {} finally { setUserDrawerLoading(false); }
    };

    const handleEditUserSave = async () => {
        if (!selectedUser) return;
        setUserEditSaving(true);
        try {
            const res = await fetch(`/api/admin/user/${selectedUser.id}`, {
                method: "PATCH",
                headers: adminHeaders(),
                body: JSON.stringify(userEditData),
            });
            const json = await res.json();
            if (json.success) {
                setSelectedUser(prev => ({ ...prev, ...json.user }));
                setUsers(prev => prev.map(u => u.id === selectedUser.id ? { ...u, ...json.user } : u));
                setUserEditMode(false);
                setUserEditData({});
            }
        } catch {} finally { setUserEditSaving(false); }
    };

    const handleDeleteUser = async (userId) => {
        if (!confirm("Permanently delete this user and all their data? This cannot be undone.")) return;
        try {
            const res = await fetch(`/api/admin/user/${userId}`, { method: "DELETE", headers: adminHeaders() });
            const json = await res.json();
            if (json.success) {
                setUserDrawerOpen(false);
                setSelectedUser(null);
                fetchUsers();
            } else {
                alert(json.error || "Could not delete user.");
            }
        } catch { alert("Delete failed. Please try again."); }
    };

    const handleSuspend = async (userId, suspend) => {
        setUserActionLoading(userId + "-suspend");
        try {
            const res = await fetch("/api/admin/user/suspend", {
                method: "POST",
                headers: adminHeaders(),
                body: JSON.stringify({ userId, suspend }),
            });
            const json = await res.json();
            if (json.success) {
                setUsers(prev => prev.map(u => u.id === userId ? { ...u, isSuspended: json.isSuspended } : u));
                if (selectedUser?.id === userId) setSelectedUser(prev => ({ ...prev, isSuspended: json.isSuspended }));
            }
        } catch (err) {
            console.error(err);
        } finally {
            setUserActionLoading(null);
        }
    };

    const handleAddCredits = async (userId, amount) => {
        if (!amount) return;
        setUserActionLoading(userId + "-credits");
        try {
            const res = await fetch("/api/admin/user/credits", {
                method: "POST",
                headers: adminHeaders(),
                body: JSON.stringify({ userId, amount }),
            });
            const json = await res.json();
            if (json.success) {
                setUsers(prev => prev.map(u => u.id === userId ? { ...u, credits: json.credits } : u));
            }
        } catch (err) {
            console.error(err);
        } finally {
            setUserActionLoading(null);
        }
    };

    const handleApproveTutor = async (tutorId) => {
        const tutorToApprove = data?.pendingTutors?.find(t => t.id === tutorId);
        if (!tutorToApprove) return;
        setData(prev => ({
            ...prev,
            pendingTutors: prev.pendingTutors.filter(t => t.id !== tutorId),
            metrics: { ...prev.metrics, totalTutors: prev.metrics.totalTutors + 1 }
        }));
        try {
            const res = await fetch("/api/admin/tutor/approve", {
                method: "POST",
                headers: adminHeaders(),
                body: JSON.stringify({ tutorId, isApproved: true })
            });
            const json = await res.json();
            if (!json.success) { fetchMetrics(); alert("Failed to approve tutor. Please try again."); }
        } catch (err) {
            console.error(err);
            fetchMetrics();
        }
    };

    // Blog handlers
    const slugify = (text) =>
        text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    const startCreatePost = () => {
        setEditingPost(null);
        setBlogForm({ title: "", slug: "", category: "Study Tips", excerpt: "", content: "", author: "TuitionsInIndia", readTime: "5 min read", coverImageUrl: "", isPublished: false });
        setBlogView("edit");
    };

    const startEditPost = (post) => {
        setEditingPost(post);
        setBlogForm({
            title: post.title || "",
            slug: post.slug || "",
            category: post.category || "Study Tips",
            excerpt: post.excerpt || "",
            content: post.content || "",
            author: post.author || "TuitionsInIndia",
            readTime: post.readTime || "5 min read",
            coverImageUrl: post.coverImageUrl || "",
            isPublished: post.isPublished || false,
        });
        setBlogView("edit");
    };

    const handleBlogSave = async (publish = false) => {
        setBlogSaving(true);
        const body = { ...blogForm, isPublished: publish ? true : blogForm.isPublished };
        try {
            const method = editingPost ? "PUT" : "POST";
            const url = editingPost ? `/api/admin/blog/${editingPost.id}` : "/api/admin/blog";
            const res = await fetch(url, { method, headers: adminHeaders(), body: JSON.stringify(body) });
            if (res.ok) {
                setBlogView("list");
                fetchBlogPosts();
            } else {
                alert("Failed to save post. Please try again.");
            }
        } catch (err) {
            console.error(err);
            alert("Failed to save post. Please try again.");
        } finally {
            setBlogSaving(false);
        }
    };

    const handleBlogTogglePublish = async (post) => {
        try {
            await fetch(`/api/admin/blog/${post.id}`, {
                method: "PUT",
                headers: adminHeaders(),
                body: JSON.stringify({ ...post, isPublished: !post.isPublished }),
            });
            fetchBlogPosts();
        } catch (err) {
            console.error(err);
        }
    };

    const handleBlogDelete = async (post) => {
        if (!confirm(`Delete "${post.title}"? This cannot be undone.`)) return;
        try {
            await fetch(`/api/admin/blog/${post.id}`, { method: "DELETE", headers: adminHeaders() });
            fetchBlogPosts();
        } catch (err) {
            console.error(err);
        }
    };

    // Email handlers
    const handleEmailPreview = async () => {
        try {
            const res = await fetch("/api/admin/email/broadcast", {
                method: "POST",
                headers: adminHeaders(),
                body: JSON.stringify({ segment: emailSegment, subject: emailSubject, body: emailBody, preview: true }),
            });
            if (res.ok) {
                const j = await res.json();
                setEmailPreview(j);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleEmailSend = async () => {
        if (!confirm(`Send this email to all ${emailSegment}? This cannot be undone.`)) return;
        setEmailSending(true);
        setEmailStatus(null);
        try {
            const res = await fetch("/api/admin/email/broadcast", {
                method: "POST",
                headers: adminHeaders(),
                body: JSON.stringify({ segment: emailSegment, subject: emailSubject, body: emailBody }),
            });
            const j = await res.json();
            setEmailStatus(j.success ? { ok: true, message: `Email sent to ${j.sent || "all"} recipients.` } : { ok: false, message: j.error || "Failed to send. Please try again." });
        } catch (err) {
            setEmailStatus({ ok: false, message: "Could not send email. Please try again." });
        } finally {
            setEmailSending(false);
        }
    };

    // Cron handlers
    const handleCronRun = async (job) => {
        setCronStatus(prev => ({ ...prev, [job]: { loading: true, result: null } }));
        try {
            const res = await fetch("/api/admin/cron/trigger", {
                method: "POST",
                headers: adminHeaders(),
                body: JSON.stringify({ job }),
            });
            const j = await res.json();
            setCronStatus(prev => ({
                ...prev,
                [job]: { loading: false, result: j.success ? "success" : "error", message: j.message || j.error || "" }
            }));
        } catch (err) {
            setCronStatus(prev => ({ ...prev, [job]: { loading: false, result: "error", message: "Could not connect." } }));
        }
    };

    // ─── Auth gate ───────────────────────────────────────────────────────────────
    if (!adminKey) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
                <div className="bg-white border border-gray-200 rounded-2xl p-8 w-full max-w-sm shadow-sm">
                    <div className="mb-6 text-center">
                        <Logo />
                        <p className="text-gray-500 text-sm mt-3">Admin access only. Enter your admin key to continue.</p>
                    </div>
                    <form onSubmit={handleKeySubmit} className="space-y-4">
                        {keyError && (
                            <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-red-700 text-sm">{keyError}</div>
                        )}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Admin key</label>
                            <input
                                type="password"
                                value={keyInput}
                                onChange={(e) => setKeyInput(e.target.value)}
                                required
                                autoFocus
                                placeholder="Enter admin key"
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={keyLoading || !keyInput}
                            className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                        >
                            {keyLoading ? "Verifying..." : "Continue"}
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    // ─── Sidebar nav config ──────────────────────────────────────────────────────
    const navItems = [
        { id: "overview",   icon: LayoutDashboard, label: "Overview" },
        { id: "users",      icon: Users,           label: "User Directory" },
        { id: "listings",   icon: GraduationCap,   label: "Tutor Approvals" },
        { id: "vip",        icon: Star,            label: "VIP Service" },
        { id: "financials", icon: CreditCard,      label: "Transactions" },
        { id: "bookings",   icon: Calendar,        label: "Bookings" },
        { id: "stats",      icon: BarChart3,       label: "Analytics" },
        { id: "projections",icon: TrendingUp,      label: "Projections" },
        { id: "goals",      icon: Target,          label: "Goals & Roadmap" },
        { id: "budget",     icon: Wallet,          label: "Budget & ROI" },
        { id: "blog",       icon: BookOpen,        label: "Blog" },
        { id: "emails",     icon: Mail,            label: "Emails" },
        { id: "automations",icon: Zap,             label: "Automations" },
    ];

    // ─── Projections computed values ─────────────────────────────────────────────
    const projMonths = [1, 3, 6, 12];
    const projData = projMonths.map(m => ({ month: m, ...computeProjection(projAssumptions, m) }));
    // Break-even: month where total >= fixed costs
    const breakEvenMonth = projData.find(p => p.total >= projAssumptions.fixedMonthlyCosts);

    // ─── Render ──────────────────────────────────────────────────────────────────
    return (
        <div className="fixed inset-0 flex bg-gray-50 font-sans text-gray-900 overflow-hidden">
            {/* Sidebar */}
            <aside className="w-56 border-r border-gray-200 bg-white flex-col hidden lg:flex shadow-sm z-50 shrink-0">
                <div className="p-5 border-b border-gray-100">
                    <Logo />
                </div>

                <div className="p-3 flex-1 overflow-y-auto">
                    <h4 className="text-xs font-semibold text-gray-400 mb-2 px-2 mt-2">Management</h4>
                    <nav className="space-y-0.5">
                        {navItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-semibold text-sm transition-all ${activeTab === item.id ? "bg-blue-50 text-blue-600" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"}`}
                            >
                                <item.icon size={15} strokeWidth={activeTab === item.id ? 2.5 : 2} className={activeTab === item.id ? "text-blue-600" : "text-gray-400"} />
                                {item.label}
                                {item.id === "overview" && unreadInsights > 0 && (
                                    <span className="ml-auto text-xs bg-red-100 text-red-600 font-semibold px-1.5 py-0.5 rounded-full">{unreadInsights}</span>
                                )}
                            </button>
                        ))}
                    </nav>

                    <h4 className="text-xs font-semibold text-gray-400 mb-2 px-2 mt-4">Tools</h4>
                    <nav className="space-y-0.5">
                        {[
                            { icon: Database,  label: "Database Tools" },
                            { icon: Settings,  label: "Global Settings" }
                        ].map((item, i) => (
                            <button key={i} className="w-full flex items-center gap-2.5 px-3 py-2 text-gray-500 hover:bg-gray-50 hover:text-gray-900 rounded-xl font-semibold text-sm transition-all">
                                <item.icon size={15} strokeWidth={2} className="text-gray-400" />
                                {item.label}
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="p-3 border-t border-gray-100">
                    <button
                        onClick={() => { localStorage.removeItem("ti_admin_key"); sessionStorage.removeItem("adminKey"); router.push("/admin/login"); }}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-red-500 border border-gray-200 hover:bg-red-50 hover:border-red-100 rounded-xl transition-all font-semibold text-sm"
                    >
                        <LogOut size={14} strokeWidth={2} />
                        Log out
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <main className="flex-1 overflow-y-auto bg-gray-50 min-w-0">
                {/* Sticky topbar — inside main so it never overlaps the sidebar */}
                <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-gray-100 px-6 py-3 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-gray-900">Admin Dashboard</span>
                        <span className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 border border-blue-100 rounded-lg">
                            <span className="size-1.5 rounded-full bg-blue-600 animate-pulse"></span>
                            <span className="text-xs font-semibold text-blue-700">Live</span>
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        {/* Pending action badge */}
                        {(() => {
                            const pending = (data?.pendingTutors?.length || 0) + pendingVerifications.length + (unreadInsights || 0);
                            return pending > 0 ? (
                                <button onClick={() => setActiveTab("overview")} className="relative flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200 text-amber-700 rounded-lg text-xs font-semibold hover:bg-amber-100 transition-colors">
                                    <AlertCircle size={13} />
                                    {pending} item{pending !== 1 ? "s" : ""} need attention
                                </button>
                            ) : null;
                        })()}
                        <button onClick={fetchMetrics} className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-blue-600 transition-colors">
                            <RefreshCcw size={13} /> Refresh
                        </button>
                        <button
                            onClick={() => { localStorage.removeItem("ti_admin_key"); sessionStorage.removeItem("adminKey"); router.push("/admin/login"); }}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-500 bg-red-50 border border-red-100 rounded-lg hover:bg-red-100 transition-colors"
                        >
                            <LogOut size={13} /> Log out
                        </button>
                    </div>
                </div>

                <div className="p-6 pb-20">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-32">
                            <div className="size-10 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
                            <p className="mt-4 font-semibold text-sm text-gray-400">Loading data...</p>
                        </div>
                    ) : (
                        <div className="max-w-7xl mx-auto space-y-6">

                            {/* ─── OVERVIEW ─────────────────────────────────────────────────────── */}
                            {activeTab === "overview" && (
                                <>
                                    {/* ── Needs attention banner ── */}
                                    {(data?.pendingTutors?.length > 0 || pendingVerifications.length > 0 || unreadInsights > 0) && (
                                        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-wrap gap-3 items-center">
                                            <div className="flex items-center gap-2">
                                                <AlertCircle size={16} className="text-amber-600 shrink-0" />
                                                <span className="text-sm font-bold text-amber-800">Needs your attention</span>
                                            </div>
                                            <div className="flex flex-wrap gap-2 ml-1">
                                                {data?.pendingTutors?.length > 0 && (
                                                    <button onClick={() => setActiveTab("listings")} className="flex items-center gap-1.5 px-3 py-1 bg-white border border-amber-200 rounded-lg text-xs font-semibold text-amber-700 hover:bg-amber-100 transition-colors">
                                                        <GraduationCap size={12} /> {data.pendingTutors.length} tutor approval{data.pendingTutors.length !== 1 ? "s" : ""}
                                                    </button>
                                                )}
                                                {pendingVerifications.length > 0 && (
                                                    <button onClick={() => setActiveTab("overview")} className="flex items-center gap-1.5 px-3 py-1 bg-white border border-amber-200 rounded-lg text-xs font-semibold text-amber-700 hover:bg-amber-100 transition-colors">
                                                        <ShieldCheck size={12} /> {pendingVerifications.length} verification{pendingVerifications.length !== 1 ? "s" : ""}
                                                    </button>
                                                )}
                                                {unreadInsights > 0 && (
                                                    <span className="flex items-center gap-1.5 px-3 py-1 bg-white border border-amber-200 rounded-lg text-xs font-semibold text-amber-700">
                                                        <Info size={12} /> {unreadInsights} new insight{unreadInsights !== 1 ? "s" : ""}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* ── Platform metrics ── */}
                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                        {[
                                            { label: "Total tutors",     value: data?.metrics?.totalTutors || 0,    sub: `+${data?.metrics?.newUsersThisWeek || 0} this week`, icon: GraduationCap, color: "text-blue-600",    bg: "bg-blue-50",    tab: "users" },
                                            { label: "Students",          value: data?.metrics?.totalStudents || 0,  sub: `${data?.metrics?.totalInstitutes || 0} institutes`,  icon: UserCheck,     color: "text-amber-600",   bg: "bg-amber-50",   tab: "users" },
                                            { label: "Total revenue",     value: `₹${(data?.metrics?.totalRevenue || 0).toLocaleString("en-IN")}`, sub: `₹${(data?.metrics?.weeklyRevenue || 0).toLocaleString("en-IN")} this week`, icon: Wallet, color: "text-emerald-600", bg: "bg-emerald-50", tab: "financials" },
                                            { label: "Active leads",      value: data?.metrics?.activeLeads || 0,    sub: `${data?.metrics?.pendingBookings || 0} demo bookings pending`, icon: Target, color: "text-purple-600", bg: "bg-purple-50", tab: "bookings" },
                                        ].map((stat, i) => (
                                            <button key={i} onClick={() => setActiveTab(stat.tab)} className="p-5 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-200 transition-all text-left group">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <div className={`p-2.5 rounded-xl ${stat.bg} ${stat.color}`}>
                                                        <stat.icon size={17} strokeWidth={2} />
                                                    </div>
                                                    <p className="text-xs font-semibold text-gray-500">{stat.label}</p>
                                                </div>
                                                <p className="text-3xl font-bold text-gray-900 tracking-tight">{stat.value}</p>
                                                <p className="text-xs text-gray-400 mt-1.5">{stat.sub}</p>
                                            </button>
                                        ))}
                                    </div>

                                    {/* ── Section health at a glance ── */}
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        {[
                                            { label: "Tutor approvals", count: data?.pendingTutors?.length || 0, status: data?.pendingTutors?.length > 0 ? "warn" : "ok", tab: "listings" },
                                            { label: "ID verifications", count: pendingVerifications.length, status: pendingVerifications.length > 0 ? "warn" : "ok", tab: "overview" },
                                            { label: "Pending bookings", count: data?.metrics?.pendingBookings || 0, status: (data?.metrics?.pendingBookings || 0) > 5 ? "warn" : "ok", tab: "bookings" },
                                            { label: "Unread insights",  count: unreadInsights || 0, status: unreadInsights > 0 ? "info" : "ok", tab: "overview" },
                                        ].map((item, i) => (
                                            <button key={i} onClick={() => setActiveTab(item.tab)} className={`p-4 rounded-xl border text-left transition-all hover:shadow-sm ${item.status === "warn" ? "bg-amber-50 border-amber-200" : item.status === "info" ? "bg-blue-50 border-blue-200" : "bg-emerald-50 border-emerald-200"}`}>
                                                <p className={`text-2xl font-bold ${item.status === "warn" ? "text-amber-700" : item.status === "info" ? "text-blue-700" : "text-emerald-700"}`}>{item.count}</p>
                                                <p className={`text-xs font-semibold mt-0.5 ${item.status === "warn" ? "text-amber-600" : item.status === "info" ? "text-blue-600" : "text-emerald-600"}`}>{item.label}</p>
                                                <p className={`text-xs mt-1 ${item.status === "ok" ? "text-emerald-500" : "text-gray-500"}`}>{item.status === "ok" ? "All clear" : "Needs review"}</p>
                                            </button>
                                        ))}
                                    </div>

                                    {/* ── Main 3-column row ── */}
                                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
                                        {/* Pending Approvals */}
                                        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className="font-bold text-sm text-gray-900">Pending tutor approvals</h3>
                                                <button onClick={() => setActiveTab("listings")} className="text-xs font-semibold text-blue-600 hover:underline">View all →</button>
                                            </div>
                                            <div className="space-y-2">
                                                {data?.pendingTutors?.slice(0, 4).map(tutor => (
                                                    <div key={tutor.id} className="p-3 bg-gray-50 rounded-xl flex items-center justify-between border border-gray-100">
                                                        <div className="flex items-center gap-2.5">
                                                            <div className="size-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold text-xs">{tutor.name?.[0]}</div>
                                                            <div>
                                                                <p className="font-semibold text-xs text-gray-900">{tutor.name}</p>
                                                                <p className="text-xs text-gray-400">{tutor.phone || tutor.email || "—"}</p>
                                                            </div>
                                                        </div>
                                                        <button onClick={() => handleApproveTutor(tutor.id)} className="px-2.5 py-1 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition-all">Approve</button>
                                                    </div>
                                                ))}
                                                {(!data?.pendingTutors || data.pendingTutors.length === 0) && (
                                                    <div className="py-6 text-center">
                                                        <CheckCircle2 size={20} className="text-emerald-400 mx-auto mb-1" />
                                                        <p className="text-xs text-gray-400">All caught up</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Recent signups + transactions */}
                                        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className="font-bold text-sm text-gray-900">Recent signups</h3>
                                                <button onClick={() => setActiveTab("users")} className="text-xs font-semibold text-blue-600 hover:underline">User directory →</button>
                                            </div>
                                            <div className="space-y-2">
                                                {data?.recentSignups?.slice(0, 5).map(u => (
                                                    <div key={u.id} className="flex items-center justify-between py-1.5">
                                                        <div className="flex items-center gap-2.5">
                                                            <div className={`size-7 rounded-lg flex items-center justify-center font-bold text-xs ${u.role === "TUTOR" ? "bg-blue-100 text-blue-600" : u.role === "INSTITUTE" ? "bg-purple-100 text-purple-600" : "bg-amber-100 text-amber-600"}`}>{u.name?.[0]?.toUpperCase() || "?"}</div>
                                                            <div>
                                                                <p className="font-semibold text-xs text-gray-900">{u.name || "—"}</p>
                                                                <p className="text-xs text-gray-400">{u.role.charAt(0) + u.role.slice(1).toLowerCase()}</p>
                                                            </div>
                                                        </div>
                                                        <p className="text-xs text-gray-400">{new Date(u.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</p>
                                                    </div>
                                                ))}
                                                {(!data?.recentSignups || data.recentSignups.length === 0) && <p className="py-4 text-center text-xs text-gray-400">No signups yet.</p>}
                                            </div>
                                        </div>

                                        {/* Verification requests + recent transactions */}
                                        <div className="space-y-4">
                                            {/* Verifications */}
                                            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
                                                <div className="flex items-center justify-between mb-3">
                                                    <h3 className="font-bold text-sm text-gray-900">ID verifications</h3>
                                                    {pendingVerifications.length > 0 && <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full">{pendingVerifications.length} pending</span>}
                                                </div>
                                                <div className="space-y-2">
                                                    {pendingVerifications.slice(0, 3).map(v => (
                                                        <div key={v.id} className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <div className="size-7 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold text-xs shrink-0">{v.tutor?.name?.[0] || "?"}</div>
                                                                <p className="font-semibold text-xs text-gray-900 truncate">{v.tutor?.name || "—"}</p>
                                                            </div>
                                                            <div className="flex gap-1.5">
                                                                <button onClick={() => handleVerificationReview(v.id, "APPROVE")} disabled={verificationActionLoading === v.id + "APPROVE"} className="flex-1 py-1 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 disabled:opacity-50 transition-colors">{verificationActionLoading === v.id + "APPROVE" ? "..." : "Approve"}</button>
                                                                <button onClick={() => handleVerificationReview(v.id, "REJECT")} disabled={verificationActionLoading === v.id + "REJECT"} className="flex-1 py-1 bg-white text-red-500 border border-red-200 rounded-lg text-xs font-semibold hover:bg-red-50 disabled:opacity-50 transition-colors">{verificationActionLoading === v.id + "REJECT" ? "..." : "Reject"}</button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                    {pendingVerifications.length === 0 && (
                                                        <div className="py-3 text-center"><CheckCircle2 size={16} className="text-emerald-400 mx-auto mb-1" /><p className="text-xs text-gray-400">No pending verifications</p></div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Revenue snapshot */}
                                            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
                                                <div className="flex items-center justify-between mb-3">
                                                    <h3 className="font-bold text-sm text-gray-900">Recent transactions</h3>
                                                    <button onClick={() => setActiveTab("financials")} className="text-xs font-semibold text-blue-600 hover:underline">View all →</button>
                                                </div>
                                                <div className="space-y-2">
                                                    {data?.recentTransactions?.slice(0, 3).map(txn => (
                                                        <div key={txn.id} className="flex items-center justify-between py-1">
                                                            <div className="flex items-center gap-2">
                                                                <div className="size-7 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center"><Wallet size={12} /></div>
                                                                <p className="text-xs text-gray-600 font-medium">{txn.user?.name || "User"}</p>
                                                            </div>
                                                            <span className="text-xs font-bold text-emerald-600">₹{txn.amount}</span>
                                                        </div>
                                                    ))}
                                                    {(!data?.recentTransactions || data.recentTransactions.length === 0) && <p className="py-3 text-center text-xs text-gray-400">No transactions yet.</p>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* ── Weekly insights ── */}
                                    {insights.length > 0 && (
                                        <div>
                                            <div className="flex items-center justify-between mb-3">
                                                <h2 className="text-sm font-bold text-gray-900">
                                                    Weekly insights
                                                    {unreadInsights > 0 && <span className="ml-2 text-xs bg-red-100 text-red-600 font-semibold px-2 py-0.5 rounded-full">{unreadInsights} new</span>}
                                                </h2>
                                                <button onClick={async () => {
                                                    await fetch("/api/admin/insights", { method: "PATCH", headers: adminHeaders(), body: JSON.stringify({ markAllRead: true }) });
                                                    setUnreadInsights(0);
                                                    setInsights(prev => prev.map(i => ({ ...i, isRead: true })));
                                                }} className="text-xs text-blue-600 hover:underline">Mark all read</button>
                                            </div>
                                            <div className="space-y-2">
                                                {insights.slice(0, 4).map(insight => (
                                                    <div key={insight.id} className={`rounded-xl border p-4 flex gap-3 items-start ${!insight.isRead ? "border-blue-200 bg-blue-50" : "border-gray-100 bg-white"}`}>
                                                        <div className={`size-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${insight.priority === "HIGH" ? "bg-red-100 text-red-600" : insight.priority === "MEDIUM" ? "bg-amber-100 text-amber-600" : "bg-emerald-100 text-emerald-600"}`}>
                                                            {insight.priority === "HIGH" ? "!" : insight.priority === "MEDIUM" ? "~" : "✓"}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-semibold text-gray-900">{insight.title}</p>
                                                            <p className="text-xs text-gray-500 mt-0.5">{insight.body}</p>
                                                            {insight.action && <p className="text-xs text-blue-600 mt-1 font-medium">→ {insight.action}</p>}
                                                        </div>
                                                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${insight.category === "REVENUE" ? "bg-green-100 text-green-700" : insight.category === "GROWTH" ? "bg-blue-100 text-blue-700" : insight.category === "ALERT" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-600"}`}>{insight.category}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}

                            {/* ─── USERS ────────────────────────────────────────────────────────── */}
                            {activeTab === "users" && (
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="font-bold text-lg text-gray-900">User Directory</h3>
                                        <p className="text-xs text-gray-400 mt-0.5">{userTotal} total users</p>
                                    </div>

                                    {/* Filters bar */}
                                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 flex flex-wrap gap-3 items-center">
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={14} />
                                            <input
                                                placeholder="Search name, phone, email..."
                                                value={userSearch}
                                                onChange={e => { setUserSearch(e.target.value); setUserPage(1); fetchUsers({ search: e.target.value, page: 1 }); }}
                                                className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-100 outline-none w-56"
                                            />
                                        </div>
                                        <div className="flex gap-1.5 flex-wrap">
                                            {["ALL","STUDENT","TUTOR","INSTITUTE"].map(r => (
                                                <button key={r}
                                                    onClick={() => { setUserRoleFilter(r); setUserPage(1); fetchUsers({ role: r, page: 1 }); }}
                                                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${userRoleFilter === r ? "bg-blue-600 text-white" : "bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100"}`}
                                                >
                                                    {r === "ALL" ? "All roles" : r.charAt(0) + r.slice(1).toLowerCase()}
                                                </button>
                                            ))}
                                        </div>
                                        <div className="flex gap-1.5 flex-wrap">
                                            {["ALL","ACTIVE","PENDING","SUSPENDED"].map(s => (
                                                <button key={s}
                                                    onClick={() => { setUserStatusFilter(s); setUserPage(1); fetchUsers({ status: s, page: 1 }); }}
                                                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${userStatusFilter === s ? "bg-gray-800 text-white" : "bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100"}`}
                                                >
                                                    {s === "ALL" ? "All status" : s.charAt(0) + s.slice(1).toLowerCase()}
                                                </button>
                                            ))}
                                        </div>
                                        <select
                                            value={userSort}
                                            onChange={e => { setUserSort(e.target.value); setUserPage(1); fetchUsers({ sort: e.target.value, page: 1 }); }}
                                            className="ml-auto px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-600 focus:ring-2 focus:ring-blue-100 outline-none"
                                        >
                                            <option value="createdAt_desc">Newest first</option>
                                            <option value="createdAt_asc">Oldest first</option>
                                            <option value="name_asc">Name A–Z</option>
                                            <option value="credits_desc">Most credits</option>
                                            <option value="tier">Subscription tier</option>
                                        </select>
                                    </div>

                                    {/* Table */}
                                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                                        {usersLoading ? (
                                            <div className="flex items-center justify-center py-16">
                                                <div className="size-8 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
                                            </div>
                                        ) : (
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-left">
                                                    <thead>
                                                        <tr className="border-b border-gray-100 bg-gray-50">
                                                            <th className="pb-3 pt-3 px-4 text-xs font-semibold text-gray-500">User</th>
                                                            <th className="pb-3 pt-3 px-4 text-xs font-semibold text-gray-500">Role</th>
                                                            <th className="pb-3 pt-3 px-4 text-xs font-semibold text-gray-500">Plan</th>
                                                            <th className="pb-3 pt-3 px-4 text-xs font-semibold text-gray-500">Credits</th>
                                                            <th className="pb-3 pt-3 px-4 text-xs font-semibold text-gray-500">Status</th>
                                                            <th className="pb-3 pt-3 px-4 text-xs font-semibold text-gray-500">Joined</th>
                                                            <th className="pb-3 pt-3 px-4 text-xs font-semibold text-gray-500">Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-gray-50">
                                                        {users.map(u => (
                                                            <tr key={u.id} className="hover:bg-blue-50/30 transition-colors group">
                                                                <td className="py-3 px-4">
                                                                    <button onClick={() => openUserDrawer(u.id)} className="flex items-center gap-3 text-left">
                                                                        <div className={`size-9 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${u.role === "TUTOR" ? "bg-blue-100 text-blue-600" : u.role === "INSTITUTE" ? "bg-purple-100 text-purple-600" : "bg-amber-100 text-amber-600"}`}>
                                                                            {u.name?.[0]?.toUpperCase() || "?"}
                                                                        </div>
                                                                        <div>
                                                                            <p className="font-semibold text-sm text-gray-900 group-hover:text-blue-600 transition-colors">{u.name || "—"}</p>
                                                                            <p className="text-xs text-gray-400">{u.phone || u.email || "No contact"}</p>
                                                                        </div>
                                                                    </button>
                                                                </td>
                                                                <td className="py-3 px-4">
                                                                    <span className={`px-2 py-0.5 rounded-lg text-xs font-semibold ${u.role === "TUTOR" ? "bg-blue-50 text-blue-600" : u.role === "INSTITUTE" ? "bg-purple-50 text-purple-600" : "bg-amber-50 text-amber-600"}`}>
                                                                        {u.role.charAt(0) + u.role.slice(1).toLowerCase()}
                                                                    </span>
                                                                </td>
                                                                <td className="py-3 px-4">
                                                                    <span className={`px-2 py-0.5 rounded-lg text-xs font-semibold ${u.subscriptionTier === "ELITE" ? "bg-amber-50 text-amber-600" : u.subscriptionTier === "PRO" ? "bg-blue-50 text-blue-600" : "bg-gray-50 text-gray-500"}`}>
                                                                        {u.subscriptionTier}
                                                                    </span>
                                                                </td>
                                                                <td className="py-3 px-4 text-sm font-semibold text-gray-700">{u.credits}</td>
                                                                <td className="py-3 px-4">
                                                                    {u.isSuspended ? (
                                                                        <span className="px-2 py-0.5 bg-red-50 text-red-500 rounded-lg text-xs font-semibold border border-red-100">Suspended</span>
                                                                    ) : u.isVerified ? (
                                                                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-lg text-xs font-semibold border border-emerald-100">Active</span>
                                                                    ) : (
                                                                        <span className="px-2 py-0.5 bg-gray-50 text-gray-400 rounded-lg text-xs font-semibold border border-gray-200">Pending</span>
                                                                    )}
                                                                </td>
                                                                <td className="py-3 px-4 text-xs text-gray-400">
                                                                    {new Date(u.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                                                                </td>
                                                                <td className="py-3 px-4">
                                                                    <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                        <button onClick={() => openUserDrawer(u.id)} className="px-2.5 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-semibold hover:bg-blue-100 transition-colors flex items-center gap-1">
                                                                            <Eye size={11} /> View
                                                                        </button>
                                                                        <button
                                                                            onClick={() => handleSuspend(u.id, !u.isSuspended)}
                                                                            disabled={userActionLoading === u.id + "-suspend"}
                                                                            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${u.isSuspended ? "bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100" : "bg-red-50 text-red-500 border-red-100 hover:bg-red-100"}`}
                                                                        >
                                                                            {userActionLoading === u.id + "-suspend" ? "..." : u.isSuspended ? "Reinstate" : "Suspend"}
                                                                        </button>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                        {users.length === 0 && (
                                                            <tr><td colSpan={7} className="py-12 text-center text-gray-400 text-sm">No users found.</td></tr>
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                        {userPages > 1 && (
                                            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
                                                <span className="text-xs text-gray-400">Page {userPage} of {userPages} — {userTotal} users</span>
                                                <div className="flex gap-2">
                                                    <button disabled={userPage <= 1} onClick={() => { const p = userPage - 1; setUserPage(p); fetchUsers({ page: p }); }} className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-gray-50 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                                                        <ChevronLeft size={12} /> Prev
                                                    </button>
                                                    <button disabled={userPage >= userPages} onClick={() => { const p = userPage + 1; setUserPage(p); fetchUsers({ page: p }); }} className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-gray-50 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                                                        Next <ChevronRight size={12} />
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* ─── TUTOR APPROVALS ──────────────────────────────────────────────── */}
                            {activeTab === "listings" && (
                                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                                    <h3 className="font-bold text-lg text-gray-900 mb-6">Tutor approvals</h3>
                                    <div className="space-y-3">
                                        {data?.pendingTutors?.map(tutor => (
                                            <div key={tutor.id} className="p-5 bg-gray-50 border border-gray-200 rounded-2xl flex items-center justify-between hover:border-blue-200 transition-all">
                                                <div className="flex items-center gap-4">
                                                    <div className="size-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center font-bold text-lg">
                                                        {tutor.name?.[0]}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-base text-gray-900">{tutor.name}</p>
                                                        <div className="flex gap-4 mt-1">
                                                            <span className="flex items-center gap-1.5 text-xs text-gray-400"><Phone size={11} className="text-gray-300" /> {tutor.phone}</span>
                                                            <span className="flex items-center gap-1.5 text-xs text-gray-400"><Mail size={11} className="text-gray-300" /> {tutor.email}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleApproveTutor(tutor.id)}
                                                        className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 shadow-sm transition-all flex items-center gap-1.5"
                                                    >
                                                        <CheckCircle2 size={14} /> Approve
                                                    </button>
                                                    <button
                                                        onClick={async () => {
                                                            if (!confirm(`Reject ${tutor.name}?`)) return;
                                                            setData(prev => ({ ...prev, pendingTutors: prev.pendingTutors.filter(t => t.id !== tutor.id) }));
                                                            await fetch("/api/admin/tutor/approve", { method: "POST", headers: adminHeaders(), body: JSON.stringify({ tutorId: tutor.id, isApproved: false }) });
                                                        }}
                                                        className="px-4 py-2 bg-white text-red-500 border border-red-100 text-sm font-semibold rounded-xl hover:bg-red-50 transition-all flex items-center gap-1.5"
                                                    >
                                                        <XCircle size={14} /> Reject
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                        {(!data?.pendingTutors || data.pendingTutors.length === 0) && (
                                            <div className="text-center py-12 text-gray-400 text-sm">No tutors pending approval.</div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* ─── TRANSACTIONS ─────────────────────────────────────────────────── */}
                            {activeTab === "financials" && (
                                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                                    <h3 className="font-bold text-lg text-gray-900 mb-6">Transactions</h3>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left">
                                            <thead>
                                                <tr className="border-b border-gray-200 bg-gray-50">
                                                    <th className="pb-3 pt-2 px-4 text-xs font-semibold text-gray-500 rounded-tl-xl">Transaction</th>
                                                    <th className="pb-3 pt-2 px-4 text-xs font-semibold text-gray-500">User</th>
                                                    <th className="pb-3 pt-2 px-4 text-xs font-semibold text-gray-500 text-right rounded-tr-xl">Amount</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {data?.recentTransactions?.map(txn => (
                                                    <tr key={txn.id} className="hover:bg-gray-50 transition-colors">
                                                        <td className="py-5 px-4">
                                                            <p className="font-semibold text-sm text-gray-900">Credit purchase</p>
                                                            <p className="text-xs text-gray-400 mt-0.5">{new Date(txn.createdAt).toLocaleString()}</p>
                                                        </td>
                                                        <td className="py-5 px-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="size-8 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-xs font-bold">{txn.user?.name?.[0]}</div>
                                                                <div>
                                                                    <p className="font-semibold text-sm text-gray-700">{txn.user?.name}</p>
                                                                    <p className="text-xs text-gray-400 capitalize">{txn.user?.role?.toLowerCase()}</p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="py-5 px-4 text-right">
                                                            <p className="text-lg font-bold text-emerald-600">₹{txn.amount}</p>
                                                            <span className="text-xs font-semibold text-emerald-500">Paid</span>
                                                        </td>
                                                    </tr>
                                                ))}
                                                {(!data?.recentTransactions || data.recentTransactions.length === 0) && (
                                                    <tr><td colSpan={3} className="py-12 text-center text-gray-400 text-sm">No transactions yet.</td></tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* ─── BOOKINGS ─────────────────────────────────────────────────────── */}
                            {activeTab === "bookings" && (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-bold text-lg text-gray-900">Bookings</h3>
                                        <span className="text-sm text-gray-400">{bookingTotal} total</span>
                                    </div>

                                    {/* Filters */}
                                    <div className="flex flex-wrap gap-3 items-center">
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={14} />
                                            <input
                                                placeholder="Search student or tutor..."
                                                value={bookingSearch}
                                                onChange={e => { setBookingSearch(e.target.value); setBookingPage(1); fetchBookings(1, bookingFilter, e.target.value); }}
                                                className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-100 outline-none w-56"
                                            />
                                        </div>
                                        <div className="flex gap-1.5">
                                            {["All", "PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"].map(f => (
                                                <button
                                                    key={f}
                                                    onClick={() => { setBookingFilter(f); setBookingPage(1); fetchBookings(1, f, bookingSearch); }}
                                                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${bookingFilter === f ? "bg-blue-600 text-white" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"}`}
                                                >
                                                    {f === "All" ? "All" : f.charAt(0) + f.slice(1).toLowerCase()}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
                                        {bookingsLoading ? (
                                            <div className="flex items-center justify-center py-16">
                                                <div className="size-8 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
                                            </div>
                                        ) : (
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-left">
                                                    <thead>
                                                        <tr className="border-b border-gray-200 bg-gray-50">
                                                            {["Student", "Tutor", "Subject", "Date", "Status", "Deposit"].map((h, i) => (
                                                                <th key={i} className={`pb-3 pt-2 px-4 text-xs font-semibold text-gray-500 ${i === 0 ? "rounded-tl-2xl" : i === 5 ? "rounded-tr-2xl" : ""}`}>{h}</th>
                                                            ))}
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-gray-100">
                                                        {bookings.map(b => (
                                                            <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                                                                <td className="py-4 px-4">
                                                                    <p className="font-semibold text-sm text-gray-900">{b.student?.name || "—"}</p>
                                                                    <p className="text-xs text-gray-400">{b.student?.phone || ""}</p>
                                                                </td>
                                                                <td className="py-4 px-4">
                                                                    <p className="font-semibold text-sm text-gray-900">{b.tutor?.name || "—"}</p>
                                                                    <p className="text-xs text-gray-400">{b.tutor?.phone || ""}</p>
                                                                </td>
                                                                <td className="py-4 px-4 text-sm text-gray-700">{b.subject || "—"}</td>
                                                                <td className="py-4 px-4 text-xs text-gray-500 whitespace-nowrap">
                                                                    {b.scheduledAt ? new Date(b.scheduledAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                                                                </td>
                                                                <td className="py-4 px-4"><StatusBadge status={b.status} /></td>
                                                                <td className="py-4 px-4"><DepositBadge status={b.depositStatus} /></td>
                                                            </tr>
                                                        ))}
                                                        {bookings.length === 0 && (
                                                            <tr><td colSpan={6} className="py-12 text-center text-gray-400 text-sm">No bookings found.</td></tr>
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}

                                        {/* Pagination */}
                                        {bookingTotal > BOOKINGS_PER_PAGE && (
                                            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
                                                <p className="text-xs text-gray-400">
                                                    Showing {Math.min((bookingPage - 1) * BOOKINGS_PER_PAGE + 1, bookingTotal)}–{Math.min(bookingPage * BOOKINGS_PER_PAGE, bookingTotal)} of {bookingTotal}
                                                </p>
                                                <div className="flex gap-2">
                                                    <button
                                                        disabled={bookingPage === 1}
                                                        onClick={() => { const p = bookingPage - 1; setBookingPage(p); fetchBookings(p); }}
                                                        className="p-1.5 border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50 transition-all"
                                                    >
                                                        <ChevronLeft size={14} />
                                                    </button>
                                                    <button
                                                        disabled={bookingPage * BOOKINGS_PER_PAGE >= bookingTotal}
                                                        onClick={() => { const p = bookingPage + 1; setBookingPage(p); fetchBookings(p); }}
                                                        className="p-1.5 border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50 transition-all"
                                                    >
                                                        <ChevronRight size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* ─── ANALYTICS ────────────────────────────────────────────────────── */}
                            {activeTab === "stats" && (
                                <div className="space-y-6">
                                    {analyticsLoading ? (
                                        <div className="flex items-center justify-center py-24">
                                            <div className="size-10 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
                                        </div>
                                    ) : (
                                        <>
                                            {/* Stat cards row */}
                                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                                {[
                                                    {
                                                        label: "Total revenue",
                                                        value: `₹${analyticsRevenue.reduce((s, d) => s + (d.value || d.amount || 0), 0).toLocaleString("en-IN")}`,
                                                        icon: Wallet,
                                                        color: "text-emerald-600", bg: "bg-emerald-50"
                                                    },
                                                    {
                                                        label: "MRR (est.)",
                                                        value: `₹${Math.round(analyticsRevenue.reduce((s, d) => s + (d.value || d.amount || 0), 0) / 30 * 30).toLocaleString("en-IN")}`,
                                                        icon: TrendingUp,
                                                        color: "text-blue-600", bg: "bg-blue-50"
                                                    },
                                                    {
                                                        label: "This month",
                                                        value: `₹${analyticsRevenue.slice(-30).reduce((s, d) => s + (d.value || d.amount || 0), 0).toLocaleString("en-IN")}`,
                                                        icon: DollarSign,
                                                        color: "text-purple-600", bg: "bg-purple-50"
                                                    },
                                                    {
                                                        label: "Total tutors",
                                                        value: analyticsGrowth?.totalTutors || data?.metrics?.totalTutors || 0,
                                                        icon: GraduationCap,
                                                        color: "text-amber-600", bg: "bg-amber-50"
                                                    }
                                                ].map((s, i) => (
                                                    <div key={i} className="p-5 bg-white rounded-2xl border border-gray-200 shadow-sm">
                                                        <div className="flex items-center gap-3 mb-3">
                                                            <div className={`p-2 rounded-xl ${s.bg} ${s.color}`}><s.icon size={16} /></div>
                                                            <p className="text-xs font-semibold text-gray-500">{s.label}</p>
                                                        </div>
                                                        <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* 30-day revenue bar chart */}
                                            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                                                <h3 className="font-bold text-base text-gray-900 mb-4">Revenue — last 30 days</h3>
                                                {analyticsRevenue.length > 0 ? (
                                                    <BarChart data={analyticsRevenue} height={180} labelKey="label" valueKey="value" />
                                                ) : (
                                                    <div className="flex items-center justify-center h-40 text-gray-400 text-sm bg-gray-50 rounded-xl">No revenue data available</div>
                                                )}
                                            </div>

                                            {/* Revenue breakdown + user growth side by side */}
                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                                                {/* Revenue breakdown */}
                                                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                                                    <h3 className="font-bold text-base text-gray-900 mb-4">Revenue by source</h3>
                                                    <div className="space-y-4">
                                                        {(() => {
                                                            const total = analyticsGrowth?.revenueBySource
                                                                ? Object.values(analyticsGrowth.revenueBySource).reduce((a, b) => a + b, 0)
                                                                : 100;
                                                            const sources = analyticsGrowth?.revenueBySource || {
                                                                "Credit packs": 0,
                                                                "Subscriptions": 0,
                                                                "Verification": 0,
                                                                "Demo deposits": 0,
                                                                "VIP service": 0,
                                                                "Other": 0
                                                            };
                                                            const colors = ["bg-blue-500", "bg-purple-500", "bg-emerald-500", "bg-amber-500", "bg-rose-500", "bg-gray-400"];
                                                            return Object.entries(sources).map(([label, value], i) => (
                                                                <BreakdownBar key={label} label={label} value={value} total={total || 1} color={colors[i % colors.length]} />
                                                            ));
                                                        })()}
                                                    </div>
                                                </div>

                                                {/* User growth */}
                                                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                                                    <h3 className="font-bold text-base text-gray-900 mb-4">User growth</h3>
                                                    <div className="space-y-3">
                                                        {[
                                                            { label: "Total tutors",   value: analyticsGrowth?.totalTutors   || data?.metrics?.totalTutors   || 0 },
                                                            { label: "Total students", value: analyticsGrowth?.totalStudents || data?.metrics?.totalStudents || 0 },
                                                            { label: "Institutes",     value: analyticsGrowth?.totalInstitutes || 0 },
                                                            { label: "Verified tutors",value: analyticsGrowth?.verifiedTutors  || 0 },
                                                            { label: "Pro subscribers",value: analyticsGrowth?.proTutors       || 0 },
                                                            { label: "Elite subscribers", value: analyticsGrowth?.eliteTutors  || 0 },
                                                        ].map((row, i) => (
                                                            <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                                                                <span className="text-sm text-gray-600 font-semibold">{row.label}</span>
                                                                <span className="text-sm font-bold text-gray-900">{row.value.toLocaleString("en-IN")}</span>
                                                            </div>
                                                        ))}
                                                    </div>

                                                    {/* Conversion funnel */}
                                                    <h4 className="font-bold text-sm text-gray-900 mt-5 mb-3">Conversion funnel</h4>
                                                    {(() => {
                                                        const total = analyticsGrowth?.totalTutors || data?.metrics?.totalTutors || 1;
                                                        const steps = [
                                                            { label: "Tutor signups", n: total, pct: 100 },
                                                            { label: "Credit buyers", n: analyticsGrowth?.creditBuyers || 0, pct: Math.round(((analyticsGrowth?.creditBuyers || 0) / total) * 100) },
                                                            { label: "Pro subscribers", n: analyticsGrowth?.proTutors || 0, pct: Math.round(((analyticsGrowth?.proTutors || 0) / total) * 100) },
                                                            { label: "Elite subscribers", n: analyticsGrowth?.eliteTutors || 0, pct: Math.round(((analyticsGrowth?.eliteTutors || 0) / total) * 100) },
                                                        ];
                                                        return (
                                                            <div className="space-y-2">
                                                                {steps.map((s, i) => (
                                                                    <div key={i} className="space-y-1">
                                                                        <div className="flex justify-between text-xs">
                                                                            <span className="text-gray-600 font-semibold">{s.label}</span>
                                                                            <span className="text-gray-500">{s.n} ({s.pct}%)</span>
                                                                        </div>
                                                                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                                                            <div className="h-full bg-blue-500 rounded-full" style={{ width: `${s.pct}%` }} />
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        );
                                                    })()}
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}

                            {/* ─── PROJECTIONS ──────────────────────────────────────────────────── */}
                            {activeTab === "projections" && (
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-bold text-lg text-gray-900">Revenue projections</h3>
                                            <p className="text-sm text-gray-500 mt-0.5">Edit the assumptions below to update projections in real time.</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                                        {/* Assumptions editor */}
                                        <div className="lg:col-span-1 space-y-4">
                                            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
                                                <h4 className="font-bold text-sm text-gray-900 mb-4">Growth assumptions</h4>
                                                <div className="space-y-3">
                                                    {[
                                                        { key: "tutorSignupsPerMonth",    label: "New tutor signups/month" },
                                                        { key: "studentSignupsPerMonth",  label: "New student signups/month" },
                                                        { key: "pctCreditBuyers",         label: "% tutors who buy credits" },
                                                        { key: "pctPro",                  label: "% tutors who go Pro" },
                                                        { key: "pctElite",                label: "% tutors who go Elite" },
                                                        { key: "pctVerified",             label: "% tutors who get verified" },
                                                    ].map(({ key, label }) => (
                                                        <div key={key} className="flex items-center justify-between gap-3">
                                                            <label className="text-xs text-gray-600 font-semibold flex-1">{label}</label>
                                                            <input
                                                                type="number"
                                                                value={projAssumptions[key]}
                                                                onChange={e => setProjAssumptions(p => ({ ...p, [key]: parseFloat(e.target.value) || 0 }))}
                                                                className="w-20 text-right border border-gray-200 rounded-lg px-2 py-1.5 text-sm font-semibold bg-gray-50 focus:outline-none focus:border-blue-400"
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
                                                <h4 className="font-bold text-sm text-gray-900 mb-4">Revenue per unit (₹)</h4>
                                                <div className="space-y-3">
                                                    {[
                                                        { key: "avgCreditValue",   label: "Avg credit pack" },
                                                        { key: "proPrice",         label: "Pro subscription" },
                                                        { key: "elitePrice",       label: "Elite subscription" },
                                                        { key: "verificationFee",  label: "Verification fee" },
                                                        { key: "fixedMonthlyCosts",label: "Fixed monthly costs" },
                                                    ].map(({ key, label }) => (
                                                        <div key={key} className="flex items-center justify-between gap-3">
                                                            <label className="text-xs text-gray-600 font-semibold flex-1">{label}</label>
                                                            <div className="flex items-center gap-1">
                                                                <span className="text-xs text-gray-400">₹</span>
                                                                <input
                                                                    type="number"
                                                                    value={projAssumptions[key]}
                                                                    onChange={e => setProjAssumptions(p => ({ ...p, [key]: parseFloat(e.target.value) || 0 }))}
                                                                    className="w-24 text-right border border-gray-200 rounded-lg px-2 py-1.5 text-sm font-semibold bg-gray-50 focus:outline-none focus:border-blue-400"
                                                                />
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Break-even */}
                                            <div className={`rounded-2xl border p-5 ${breakEvenMonth ? "bg-emerald-50 border-emerald-100" : "bg-amber-50 border-amber-100"}`}>
                                                <h4 className="font-bold text-sm mb-1" style={{ color: breakEvenMonth ? "#059669" : "#92400e" }}>Break-even analysis</h4>
                                                {breakEvenMonth ? (
                                                    <p className="text-sm" style={{ color: "#065f46" }}>
                                                        At current assumptions, you break even at <strong>Month {breakEvenMonth.month}</strong> with <strong>{breakEvenMonth.tutors.toLocaleString("en-IN")} tutors</strong> on the platform.
                                                    </p>
                                                ) : (
                                                    <p className="text-sm text-amber-700">
                                                        Based on current assumptions, you don&apos;t break even within 12 months. Try increasing growth numbers or reducing fixed costs.
                                                    </p>
                                                )}
                                                <p className="text-xs text-gray-500 mt-2">Fixed monthly costs: ₹{projAssumptions.fixedMonthlyCosts.toLocaleString("en-IN")}</p>
                                            </div>
                                        </div>

                                        {/* Projections table */}
                                        <div className="lg:col-span-2 space-y-5">
                                            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                                                <div className="p-5 border-b border-gray-100">
                                                    <h4 className="font-bold text-sm text-gray-900">Projected revenue by month</h4>
                                                </div>
                                                <div className="overflow-x-auto">
                                                    <table className="w-full text-left">
                                                        <thead>
                                                            <tr className="bg-gray-50 border-b border-gray-100">
                                                                <th className="px-5 py-3 text-xs font-semibold text-gray-500">Metric</th>
                                                                {projMonths.map(m => (
                                                                    <th key={m} className="px-5 py-3 text-xs font-semibold text-gray-500 text-right">Month {m}</th>
                                                                ))}
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-gray-100">
                                                            {[
                                                                { label: "Tutors on platform", key: "tutors", fmt: n => n.toLocaleString("en-IN") },
                                                                { label: "Pro subscribers",    key: "pro",    fmt: n => n.toLocaleString("en-IN") },
                                                                { label: "Elite subscribers",  key: "elite",  fmt: n => n.toLocaleString("en-IN") },
                                                                { label: "Credit revenue",     key: "creditRev", fmt: n => `₹${n.toLocaleString("en-IN")}` },
                                                                { label: "Subscription revenue",key: "subRev", fmt: n => `₹${n.toLocaleString("en-IN")}` },
                                                                { label: "Verification revenue",key: "verifyRev", fmt: n => `₹${n.toLocaleString("en-IN")}` },
                                                                { label: "Total projected MRR", key: "total", fmt: n => `₹${n.toLocaleString("en-IN")}`, bold: true },
                                                            ].map(row => (
                                                                <tr key={row.key} className={row.bold ? "bg-blue-50" : "hover:bg-gray-50"}>
                                                                    <td className={`px-5 py-3 text-sm ${row.bold ? "font-bold text-blue-700" : "text-gray-700 font-semibold"}`}>{row.label}</td>
                                                                    {projData.map(p => (
                                                                        <td key={p.month} className={`px-5 py-3 text-sm text-right ${row.bold ? "font-bold text-blue-700" : "text-gray-900 font-semibold"}`}>
                                                                            {row.fmt(p[row.key])}
                                                                        </td>
                                                                    ))}
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>

                                            {/* Ad spend guide */}
                                            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
                                                <h4 className="font-bold text-sm text-gray-900 mb-1">Ad spend guide</h4>
                                                <p className="text-xs text-gray-500 mb-4">Estimated cost per lead (CPL) and recommended monthly spend by channel.</p>
                                                <div className="overflow-x-auto">
                                                    <table className="w-full text-left text-sm">
                                                        <thead>
                                                            <tr className="bg-gray-50 border-b border-gray-100">
                                                                {["Channel", "Target", "Est. CPL", "Budget/month"].map(h => (
                                                                    <th key={h} className="px-4 py-2.5 text-xs font-semibold text-gray-500">{h}</th>
                                                                ))}
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-gray-100">
                                                            {[
                                                                { channel: "Facebook / Instagram", target: "Tutors (teachers, 25–45)", cpl: "₹100–200", budget: "₹10,000–30,000/mo" },
                                                                { channel: "Google Search", target: "Students (\"home tutor near me\")", cpl: "₹150–300", budget: "₹15,000–40,000/mo" },
                                                                { channel: "WhatsApp groups", target: "Tutor communities (manual)", cpl: "₹0", budget: "Free" },
                                                                { channel: "LinkedIn", target: "Premium tutors, IIT/IIM coaches", cpl: "₹300–500", budget: "₹5,000–10,000/mo" },
                                                            ].map((row, i) => (
                                                                <tr key={i} className="hover:bg-gray-50">
                                                                    <td className="px-4 py-3 font-semibold text-gray-900 text-sm">{row.channel}</td>
                                                                    <td className="px-4 py-3 text-gray-600 text-sm">{row.target}</td>
                                                                    <td className="px-4 py-3 text-gray-700 font-semibold text-sm">{row.cpl}</td>
                                                                    <td className="px-4 py-3 text-gray-700 font-semibold text-sm">{row.budget}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>

                                                <h5 className="font-bold text-sm text-gray-900 mt-5 mb-3">Recommended budget by stage</h5>
                                                <div className="space-y-2">
                                                    {[
                                                        { phase: "Phase 1 (0–100 tutors)", budget: "₹0 — manual outreach only", color: "bg-gray-100 text-gray-700" },
                                                        { phase: "Phase 2 (100–500 tutors)", budget: "₹15,000–30,000/month", color: "bg-blue-50 text-blue-700" },
                                                        { phase: "Phase 3 (500–2,000 tutors)", budget: "₹50,000–1,50,000/month", color: "bg-purple-50 text-purple-700" },
                                                        { phase: "Phase 4 (2,000+ tutors)", budget: "₹2,00,000+/month", color: "bg-emerald-50 text-emerald-700" },
                                                    ].map((row, i) => (
                                                        <div key={i} className={`flex items-center justify-between px-4 py-3 rounded-xl ${row.color}`}>
                                                            <span className="text-sm font-semibold">{row.phase}</span>
                                                            <span className="text-sm font-bold">{row.budget}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* ─── BLOG ─────────────────────────────────────────────────────────── */}
                            {activeTab === "blog" && (
                                <div className="space-y-4">
                                    {blogView === "list" ? (
                                        <>
                                            <div className="flex items-center justify-between">
                                                <h3 className="font-bold text-lg text-gray-900">Blog posts</h3>
                                                <button
                                                    onClick={startCreatePost}
                                                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 transition-all"
                                                >
                                                    <PlusCircle size={14} />
                                                    Create new post
                                                </button>
                                            </div>

                                            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
                                                {blogLoading ? (
                                                    <div className="flex items-center justify-center py-16">
                                                        <div className="size-8 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
                                                    </div>
                                                ) : (
                                                    <div className="overflow-x-auto">
                                                        <table className="w-full text-left">
                                                            <thead>
                                                                <tr className="border-b border-gray-200 bg-gray-50">
                                                                    {["Title", "Category", "Status", "Author", "Published", "Actions"].map((h, i) => (
                                                                        <th key={i} className={`pb-3 pt-2 px-4 text-xs font-semibold text-gray-500 ${i === 0 ? "rounded-tl-2xl" : i === 5 ? "rounded-tr-2xl" : ""}`}>{h}</th>
                                                                    ))}
                                                                </tr>
                                                            </thead>
                                                            <tbody className="divide-y divide-gray-100">
                                                                {blogPosts.map(post => (
                                                                    <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                                                                        <td className="py-4 px-4">
                                                                            <p className="font-semibold text-sm text-gray-900 max-w-xs truncate">{post.title}</p>
                                                                            <p className="text-xs text-gray-400 truncate max-w-xs">{post.slug}</p>
                                                                        </td>
                                                                        <td className="py-4 px-4">
                                                                            <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-xs font-semibold">{post.category || "General"}</span>
                                                                        </td>
                                                                        <td className="py-4 px-4">
                                                                            {post.isPublished ? (
                                                                                <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full text-xs font-semibold">Published</span>
                                                                            ) : (
                                                                                <span className="px-2.5 py-0.5 bg-gray-100 text-gray-500 border border-gray-200 rounded-full text-xs font-semibold">Draft</span>
                                                                            )}
                                                                        </td>
                                                                        <td className="py-4 px-4 text-sm text-gray-600">{post.author || "—"}</td>
                                                                        <td className="py-4 px-4 text-xs text-gray-500">
                                                                            {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("en-IN") : "—"}
                                                                        </td>
                                                                        <td className="py-4 px-4">
                                                                            <div className="flex gap-1.5">
                                                                                <button onClick={() => startEditPost(post)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Edit">
                                                                                    <Edit2 size={14} />
                                                                                </button>
                                                                                <button onClick={() => handleBlogTogglePublish(post)} className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all" title={post.isPublished ? "Unpublish" : "Publish"}>
                                                                                    <Eye size={14} />
                                                                                </button>
                                                                                <button onClick={() => handleBlogDelete(post)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all" title="Delete">
                                                                                    <Trash2 size={14} />
                                                                                </button>
                                                                            </div>
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                                {blogPosts.length === 0 && (
                                                                    <tr><td colSpan={6} className="py-12 text-center text-gray-400 text-sm">No blog posts yet. Create your first one.</td></tr>
                                                                )}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                )}
                                            </div>
                                        </>
                                    ) : (
                                        /* Blog edit form */
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() => setBlogView("list")}
                                                    className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 font-semibold"
                                                >
                                                    <ChevronLeft size={16} />
                                                    Back to posts
                                                </button>
                                                <h3 className="font-bold text-lg text-gray-900">{editingPost ? "Edit post" : "Create new post"}</h3>
                                            </div>

                                            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Title</label>
                                                    <input
                                                        value={blogForm.title}
                                                        onChange={e => setBlogForm(f => ({ ...f, title: e.target.value }))}
                                                        onBlur={e => {
                                                            if (!blogForm.slug || blogForm.slug === slugify(blogForm.title)) {
                                                                setBlogForm(f => ({ ...f, slug: slugify(e.target.value) }));
                                                            }
                                                        }}
                                                        placeholder="Post title"
                                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-200 transition-colors text-base font-semibold"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-xs font-semibold text-gray-500 mb-1">Slug</label>
                                                    <input
                                                        value={blogForm.slug}
                                                        onChange={e => setBlogForm(f => ({ ...f, slug: e.target.value }))}
                                                        placeholder="post-url-slug"
                                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-gray-600 placeholder-gray-400 focus:outline-none focus:border-blue-400 text-sm font-medium transition-colors"
                                                    />
                                                </div>

                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category</label>
                                                        <select
                                                            value={blogForm.category}
                                                            onChange={e => setBlogForm(f => ({ ...f, category: e.target.value }))}
                                                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-blue-400 text-sm font-medium"
                                                        >
                                                            {["JEE/NEET", "CBSE/ICSE", "Study Tips", "Tutor Advice", "News"].map(c => (
                                                                <option key={c} value={c}>{c}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Read time</label>
                                                        <input
                                                            value={blogForm.readTime}
                                                            onChange={e => setBlogForm(f => ({ ...f, readTime: e.target.value }))}
                                                            placeholder="5 min read"
                                                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-400 text-sm font-medium"
                                                        />
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Excerpt <span className="text-gray-400 font-normal">(max 200 chars)</span></label>
                                                    <textarea
                                                        value={blogForm.excerpt}
                                                        onChange={e => setBlogForm(f => ({ ...f, excerpt: e.target.value.slice(0, 200) }))}
                                                        rows={2}
                                                        placeholder="Short description shown in previews..."
                                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-400 text-sm resize-none"
                                                    />
                                                    <p className="text-xs text-gray-400 mt-1 text-right">{blogForm.excerpt.length}/200</p>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Content <span className="text-gray-400 font-normal">(Markdown supported)</span></label>
                                                    <textarea
                                                        value={blogForm.content}
                                                        onChange={e => setBlogForm(f => ({ ...f, content: e.target.value }))}
                                                        rows={12}
                                                        placeholder="Write your post content here..."
                                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-400 text-sm font-mono resize-y"
                                                    />
                                                </div>

                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Author</label>
                                                        <input
                                                            value={blogForm.author}
                                                            onChange={e => setBlogForm(f => ({ ...f, author: e.target.value }))}
                                                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-blue-400 text-sm font-medium"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Cover image URL</label>
                                                        <input
                                                            value={blogForm.coverImageUrl}
                                                            onChange={e => setBlogForm(f => ({ ...f, coverImageUrl: e.target.value }))}
                                                            placeholder="https://..."
                                                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-400 text-sm font-medium"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-3 pt-1">
                                                    <label className="flex items-center gap-2 cursor-pointer select-none">
                                                        <input
                                                            type="checkbox"
                                                            checked={blogForm.isPublished}
                                                            onChange={e => setBlogForm(f => ({ ...f, isPublished: e.target.checked }))}
                                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                        />
                                                        <span className="text-sm font-semibold text-gray-700">Publish immediately</span>
                                                    </label>
                                                </div>

                                                <div className="flex gap-3 pt-2">
                                                    <button
                                                        onClick={() => handleBlogSave(false)}
                                                        disabled={blogSaving}
                                                        className="px-5 py-2.5 bg-white text-gray-700 border border-gray-200 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-all disabled:opacity-50"
                                                    >
                                                        {blogSaving ? "Saving..." : "Save as draft"}
                                                    </button>
                                                    <button
                                                        onClick={() => handleBlogSave(true)}
                                                        disabled={blogSaving}
                                                        className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 transition-all disabled:opacity-50"
                                                    >
                                                        {blogSaving ? "Publishing..." : "Publish"}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* ─── EMAILS ───────────────────────────────────────────────────────── */}
                            {activeTab === "emails" && (
                                <div className="space-y-5 max-w-3xl">
                                    <h3 className="font-bold text-lg text-gray-900">Broadcast email</h3>

                                    <div className="bg-amber-50 border border-amber-100 rounded-xl px-5 py-4 flex gap-3">
                                        <Info size={16} className="text-amber-600 mt-0.5 shrink-0" />
                                        <p className="text-sm text-amber-700 font-semibold">
                                            Emails are sent via Resend. Max 500 recipients per broadcast. Always preview before sending.
                                        </p>
                                    </div>

                                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Send to</label>
                                            <select
                                                value={emailSegment}
                                                onChange={e => { setEmailSegment(e.target.value); setEmailPreview(null); }}
                                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-blue-400 text-sm font-medium"
                                            >
                                                {["All users", "All Tutors", "All Students", "Pro Tutors", "Elite Tutors", "Unverified Tutors"].map(s => (
                                                    <option key={s} value={s}>{s}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Subject line</label>
                                            <input
                                                value={emailSubject}
                                                onChange={e => setEmailSubject(e.target.value)}
                                                placeholder="e.g. New feature alert on TuitionsinIndia"
                                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-400 text-sm font-medium"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email body <span className="text-gray-400 font-normal">(HTML tags allowed)</span></label>
                                            <textarea
                                                value={emailBody}
                                                onChange={e => setEmailBody(e.target.value)}
                                                rows={10}
                                                placeholder="Write your email here..."
                                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-400 text-sm resize-y"
                                            />
                                        </div>

                                        {emailPreview && (
                                            <div className="bg-blue-50 border border-blue-100 rounded-xl px-5 py-4">
                                                <p className="text-sm font-bold text-blue-800 mb-1">Preview: {emailPreview.count || 0} recipients</p>
                                                {emailPreview.sample?.length > 0 && (
                                                    <p className="text-xs text-blue-600">Sample: {emailPreview.sample.join(", ")}</p>
                                                )}
                                            </div>
                                        )}

                                        {emailStatus && (
                                            <div className={`rounded-xl px-5 py-4 flex gap-3 ${emailStatus.ok ? "bg-emerald-50 border border-emerald-100" : "bg-red-50 border border-red-100"}`}>
                                                {emailStatus.ok ? <CheckCircle size={16} className="text-emerald-600 mt-0.5 shrink-0" /> : <AlertCircle size={16} className="text-red-500 mt-0.5 shrink-0" />}
                                                <p className={`text-sm font-semibold ${emailStatus.ok ? "text-emerald-700" : "text-red-700"}`}>{emailStatus.message}</p>
                                            </div>
                                        )}

                                        <div className="flex gap-3 pt-1">
                                            <button
                                                onClick={handleEmailPreview}
                                                disabled={!emailSubject || !emailBody}
                                                className="px-5 py-2.5 bg-white text-gray-700 border border-gray-200 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-all disabled:opacity-50 flex items-center gap-2"
                                            >
                                                <Eye size={14} />
                                                Preview recipients
                                            </button>
                                            <button
                                                onClick={handleEmailSend}
                                                disabled={emailSending || !emailSubject || !emailBody}
                                                className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center gap-2"
                                            >
                                                <Send size={14} />
                                                {emailSending ? "Sending..." : "Send email"}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* ─── AUTOMATIONS ──────────────────────────────────────────────────── */}
                            {activeTab === "automations" && (
                                <div className="space-y-5 max-w-3xl">
                                    <h3 className="font-bold text-lg text-gray-900">Automations</h3>

                                    {/* Cron jobs */}
                                    <div className="space-y-3">
                                        {[
                                            {
                                                id: "monthly-credit-reset",
                                                label: "Monthly credit reset",
                                                schedule: "Runs on the 1st of each month at 6:00 AM",
                                                description: "Resets monthly credit allocations for Pro and Elite subscribers."
                                            },
                                            {
                                                id: "vip-billing",
                                                label: "VIP billing",
                                                schedule: "Runs on the 1st of each month at 7:00 AM",
                                                description: "Processes recurring billing for VIP service customers."
                                            },
                                            {
                                                id: "email-drip",
                                                label: "Email drip",
                                                schedule: "Runs daily at 9:00 AM",
                                                description: "Sends onboarding and re-engagement emails to new and inactive users."
                                            }
                                        ].map(job => {
                                            const s = cronStatus[job.id] || {};
                                            return (
                                                <div key={job.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
                                                    <div className="flex items-start justify-between gap-4">
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-2 mb-0.5">
                                                                <Zap size={14} className="text-blue-500 shrink-0" />
                                                                <h4 className="font-bold text-sm text-gray-900">{job.label}</h4>
                                                            </div>
                                                            <p className="text-xs text-gray-400 mb-1">{job.schedule}</p>
                                                            <p className="text-sm text-gray-600">{job.description}</p>
                                                            {s.result && (
                                                                <div className={`mt-2 flex items-center gap-2 text-xs font-semibold ${s.result === "success" ? "text-emerald-600" : "text-red-500"}`}>
                                                                    {s.result === "success" ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
                                                                    {s.result === "success" ? "Job completed successfully" : `Failed: ${s.message}`}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <button
                                                            onClick={() => handleCronRun(job.id)}
                                                            disabled={s.loading}
                                                            className="px-4 py-2 bg-white text-blue-600 border border-blue-100 rounded-xl font-semibold text-sm hover:bg-blue-50 transition-all disabled:opacity-50 flex items-center gap-2 shrink-0"
                                                        >
                                                            {s.loading ? (
                                                                <>
                                                                    <div className="size-3.5 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin" />
                                                                    Running...
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Play size={12} />
                                                                    Run now
                                                                </>
                                                            )}
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* System status */}
                                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
                                        <h4 className="font-bold text-sm text-gray-900 mb-4">System status</h4>
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between py-2 border-b border-gray-100">
                                                <span className="text-sm font-semibold text-gray-600">App version</span>
                                                <span className="text-sm font-bold text-gray-900">1.0.0</span>
                                            </div>
                                            <div className="flex items-center justify-between py-2 border-b border-gray-100">
                                                <span className="text-sm font-semibold text-gray-600">Database</span>
                                                <div className="flex items-center gap-2">
                                                    <span className="size-2 rounded-full bg-emerald-500 inline-block"></span>
                                                    <span className="text-sm font-bold text-emerald-700">Connected</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between py-2">
                                                <span className="text-sm font-semibold text-gray-600">Last deploy</span>
                                                <span className="text-sm font-bold text-gray-900">
                                                    {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {/* ─── GOALS & ROADMAP ──────────────────────────────────────────────── */}
                            {activeTab === "goals" && (
                                <div className="space-y-6">
                                    {/* Header */}
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h2 className="text-xl font-bold text-gray-900">Goals & Roadmap</h2>
                                            <p className="text-sm text-gray-500 mt-0.5">Track your revenue targets and platform milestones.</p>
                                        </div>
                                        <button onClick={() => setShowGoalForm(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors">
                                            + Add goal
                                        </button>
                                    </div>

                                    {/* Primary goal card */}
                                    {(() => {
                                        const primaryGoal = goals.find(g => g.category === "REVENUE" && g.isActive) || { title: "₹2 lakh monthly revenue", targetValue: 200000, currentValue: 0, progressPercent: 0, deadline: null };
                                        const pct = Math.min(100, primaryGoal.progressPercent || 0);
                                        const currentMRR = primaryGoal.currentValue || 0;
                                        const target = primaryGoal.targetValue || 200000;
                                        const monthsLeft = primaryGoal.deadline ? Math.max(0, Math.ceil((new Date(primaryGoal.deadline) - new Date()) / (1000 * 60 * 60 * 24 * 30))) : null;
                                        const requiredGrowthPct = currentMRR > 0 && monthsLeft > 0 ? (((target / currentMRR) ** (1 / monthsLeft) - 1) * 100).toFixed(1) : null;
                                        return (
                                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-6">
                                                <div className="flex items-start justify-between mb-4">
                                                    <div>
                                                        <p className="text-xs text-blue-600 font-semibold mb-1">Primary goal</p>
                                                        <h3 className="text-lg font-bold text-gray-900">{primaryGoal.title}</h3>
                                                        {primaryGoal.deadline && <p className="text-sm text-gray-500 mt-0.5">Target: {new Date(primaryGoal.deadline).toLocaleDateString("en-IN", { month: "long", year: "numeric" })}</p>}
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-3xl font-bold text-blue-600">₹{currentMRR.toLocaleString("en-IN")}</p>
                                                        <p className="text-sm text-gray-500">of ₹{target.toLocaleString("en-IN")}/mo</p>
                                                    </div>
                                                </div>
                                                <div className="h-3 bg-white/60 rounded-full overflow-hidden mb-3">
                                                    <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
                                                </div>
                                                <div className="flex items-center justify-between text-xs text-gray-500">
                                                    <span>{pct.toFixed(1)}% of target</span>
                                                    {requiredGrowthPct && <span>Need {requiredGrowthPct}% MoM growth to hit target</span>}
                                                    {monthsLeft !== null && <span>{monthsLeft} months remaining</span>}
                                                </div>
                                            </div>
                                        );
                                    })()}

                                    {/* Milestone Roadmap */}
                                    <div>
                                        <h3 className="text-base font-semibold text-gray-900 mb-3">Milestone roadmap</h3>
                                        {(() => {
                                            const tutorGoal = goals.find(g => g.category === "TUTORS");
                                            const tutorCount = tutorGoal?.currentValue || 0;
                                            const revenueGoal = goals.find(g => g.category === "REVENUE");
                                            const mrr = revenueGoal?.currentValue || 0;

                                            const milestones = [
                                                { label: "50 tutors signed up", done: tutorCount >= 50, value: `${tutorCount} tutors` },
                                                { label: "100 tutors — free verification slots filled", done: tutorCount >= 100, value: tutorCount >= 100 ? "Done" : `${tutorCount}/100` },
                                                { label: "First Pro subscriber", done: (data?.metrics?.totalTutors || 0) > 0, value: "" },
                                                { label: "₹25,000 monthly revenue", done: mrr >= 25000, value: `₹${mrr.toLocaleString("en-IN")}/mo` },
                                                { label: "₹50,000 monthly revenue", done: mrr >= 50000, value: `₹${mrr.toLocaleString("en-IN")}/mo` },
                                                { label: "₹1 lakh monthly revenue", done: mrr >= 100000, value: `₹${mrr.toLocaleString("en-IN")}/mo` },
                                                { label: "₹2 lakh monthly revenue — target", done: mrr >= 200000, value: `₹${mrr.toLocaleString("en-IN")}/mo`, isMain: true },
                                            ];
                                            return (
                                                <div className="space-y-2">
                                                    {milestones.map((m, i) => (
                                                        <div key={i} className={`flex items-center gap-3 p-4 rounded-xl border ${m.done ? "bg-emerald-50 border-emerald-200" : m.isMain ? "bg-blue-50 border-blue-200" : "bg-white border-gray-100"}`}>
                                                            <div className={`size-6 rounded-full flex items-center justify-center shrink-0 text-sm ${m.done ? "bg-emerald-500 text-white" : "bg-gray-100 text-gray-400"}`}>
                                                                {m.done ? "✓" : (i + 1)}
                                                            </div>
                                                            <span className={`flex-1 text-sm font-medium ${m.done ? "text-emerald-700 line-through" : m.isMain ? "text-blue-700 font-semibold" : "text-gray-700"}`}>{m.label}</span>
                                                            {m.value && <span className="text-xs text-gray-400">{m.value}</span>}
                                                        </div>
                                                    ))}
                                                </div>
                                            );
                                        })()}
                                    </div>

                                    {/* Custom Goals list */}
                                    {goals.length > 0 && (
                                        <div>
                                            <h3 className="text-base font-semibold text-gray-900 mb-3">Your goals</h3>
                                            <div className="space-y-3">
                                                {goals.map(goal => (
                                                    <div key={goal.id} className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-4">
                                                        <div className="flex-1">
                                                            <p className="text-sm font-semibold text-gray-900">{goal.title}</p>
                                                            <p className="text-xs text-gray-400">{goal.category} · Target: {goal.category === "REVENUE" ? `₹${goal.targetValue.toLocaleString("en-IN")}` : goal.targetValue} · Deadline: {goal.deadline ? new Date(goal.deadline).toLocaleDateString("en-IN") : "None"}</p>
                                                        </div>
                                                        <div className="text-right shrink-0">
                                                            <p className="text-sm font-bold text-gray-900">{Math.min(100, goal.progressPercent || 0).toFixed(0)}%</p>
                                                            <div className="w-20 h-1.5 bg-gray-100 rounded-full mt-1">
                                                                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.min(100, goal.progressPercent || 0)}%` }} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Add goal form */}
                                    {showGoalForm && (
                                        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
                                            <h3 className="text-base font-semibold text-gray-900 mb-4">Add new goal</h3>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="col-span-2">
                                                    <label className="block text-xs font-medium text-gray-600 mb-1">Goal title</label>
                                                    <input value={goalForm.title} onChange={e => setGoalForm(p => ({ ...p, title: e.target.value }))} placeholder="e.g. Reach 500 tutors" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500 bg-white" />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-600 mb-1">Category</label>
                                                    <select value={goalForm.category} onChange={e => setGoalForm(p => ({ ...p, category: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:border-blue-500">
                                                        <option value="REVENUE">Revenue (₹/month)</option>
                                                        <option value="TUTORS">Total tutors</option>
                                                        <option value="STUDENTS">Total students</option>
                                                        <option value="CONVERSIONS">Paid conversion %</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-600 mb-1">Target value</label>
                                                    <input type="number" value={goalForm.targetValue} onChange={e => setGoalForm(p => ({ ...p, targetValue: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500 bg-white" />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-600 mb-1">Target date</label>
                                                    <input type="date" value={goalForm.deadline} onChange={e => setGoalForm(p => ({ ...p, deadline: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500 bg-white" />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-600 mb-1">Notes</label>
                                                    <input value={goalForm.notes} onChange={e => setGoalForm(p => ({ ...p, notes: e.target.value }))} placeholder="Optional" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500 bg-white" />
                                                </div>
                                            </div>
                                            <div className="flex gap-2 mt-4">
                                                <button onClick={async () => {
                                                    const res = await fetch("/api/admin/goals", { method: "POST", headers: adminHeaders(), body: JSON.stringify(goalForm) });
                                                    const d = await res.json();
                                                    if (d.goal) { setGoals(prev => [d.goal, ...prev]); setShowGoalForm(false); setGoalForm({ title: "", category: "REVENUE", targetValue: 200000, deadline: "", notes: "" }); }
                                                }} className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700">Save goal</button>
                                                <button onClick={() => setShowGoalForm(false)} className="px-4 py-2 border border-gray-200 text-gray-600 text-sm rounded-xl hover:bg-gray-50">Cancel</button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Projections recommendation box */}
                                    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
                                        <p className="text-sm font-semibold text-amber-800 mb-1">To reach ₹2 lakh/month</p>
                                        <ul className="text-xs text-amber-700 space-y-1">
                                            <li>• You need approx. 300–400 active tutors with 10% on Pro (₹699) and 2% on Elite (₹2,499)</li>
                                            <li>• Verification revenue (₹999/tutor) is your fastest earner — push for 100+ verifications</li>
                                            <li>• Spend ₹20,000–35,000/month on ads by Month 3 for tutor acquisition</li>
                                            <li>• Each ₹150 CPL on Facebook brings one tutor who can generate ₹999–2,499 in revenue</li>
                                        </ul>
                                    </div>
                                </div>
                            )}

                            {/* ─── BUDGET & ROI ─────────────────────────────────────────────────── */}
                            {activeTab === "budget" && (
                                <div className="space-y-6">
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900">Budget & ROI</h2>
                                        <p className="text-sm text-gray-500 mt-0.5">Track your monthly ad spend and return on investment.</p>
                                    </div>

                                    {/* Current month budget cards */}
                                    <div className="grid grid-cols-3 gap-4">
                                        {[
                                            { label: "Monthly budget", value: budget ? `₹${budget.totalBudget?.toLocaleString("en-IN") || 0}` : "—" },
                                            { label: "Actual spend", value: budget ? `₹${budget.adSpend?.toLocaleString("en-IN") || 0}` : "—" },
                                            { label: "ROI", value: budget?.roi ? `${budget.roi.toFixed(1)}x` : "—", sub: budget?.revenueThisMonth ? `Revenue: ₹${budget.revenueThisMonth.toLocaleString("en-IN")}` : null, highlight: budget?.roi >= 3 }
                                        ].map((card, i) => (
                                            <div key={i} className={`rounded-2xl border p-5 ${card.highlight ? "bg-emerald-50 border-emerald-200" : "bg-white border-gray-200"}`}>
                                                <p className="text-xs text-gray-400 mb-1">{card.label}</p>
                                                <p className={`text-2xl font-bold ${card.highlight ? "text-emerald-700" : "text-gray-900"}`}>{card.value}</p>
                                                {card.sub && <p className="text-xs text-gray-400 mt-0.5">{card.sub}</p>}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Budget entry form */}
                                    <div className="bg-white border border-gray-200 rounded-2xl p-6">
                                        <h3 className="text-base font-semibold text-gray-900 mb-4">Update this month's budget</h3>
                                        <div className="grid grid-cols-2 gap-4 mb-4">
                                            <div>
                                                <label className="block text-xs font-medium text-gray-600 mb-1">Total budget (₹)</label>
                                                <input type="number" value={budgetForm.totalBudget} onChange={e => setBudgetForm(p => ({ ...p, totalBudget: parseInt(e.target.value) || 0 }))} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-600 mb-1">Actual spend so far (₹)</label>
                                                <input type="number" value={budgetForm.adSpend} onChange={e => setBudgetForm(p => ({ ...p, adSpend: parseInt(e.target.value) || 0 }))} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
                                            </div>
                                        </div>
                                        <p className="text-xs font-medium text-gray-600 mb-2">Spend breakdown by channel (₹)</p>
                                        <div className="grid grid-cols-4 gap-3 mb-4">
                                            {["facebook", "google", "whatsapp", "other"].map(ch => (
                                                <div key={ch}>
                                                    <label className="block text-xs text-gray-400 mb-1">{ch === "whatsapp" ? "WhatsApp" : ch.charAt(0).toUpperCase() + ch.slice(1)}</label>
                                                    <input type="number" value={budgetForm.breakdown?.[ch] || 0} onChange={e => setBudgetForm(p => ({ ...p, breakdown: { ...p.breakdown, [ch]: parseInt(e.target.value) || 0 } }))} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
                                                </div>
                                            ))}
                                        </div>
                                        <button onClick={async () => {
                                            const month = new Date().toISOString().slice(0, 7);
                                            const res = await fetch("/api/admin/budget", { method: "POST", headers: adminHeaders(), body: JSON.stringify({ month, ...budgetForm }) });
                                            const d = await res.json();
                                            if (d.budget) setBudget(prev => ({ ...prev, ...d.budget }));
                                        }} className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700">Save budget</button>
                                    </div>

                                    {/* Recommendations */}
                                    <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
                                        <p className="text-sm font-semibold text-blue-800 mb-3">Budget recommendations</p>
                                        <div className="space-y-2 text-xs text-blue-700">
                                            <p>• <strong>Phase 1 (0–100 tutors):</strong> Spend ₹0–5,000/month. Focus on manual WhatsApp outreach to teacher communities. No ads yet.</p>
                                            <p>• <strong>Phase 2 (100–500 tutors):</strong> ₹15,000–30,000/month. Facebook/Instagram targeting teachers aged 25–45 in metro cities. Expected CPL: ₹150–200.</p>
                                            <p>• <strong>Phase 3 (500–2000 tutors):</strong> ₹50,000–1,50,000/month. Add Google Search ("home tutor registration"). Expected CPL: ₹100–200.</p>
                                            <p>• <strong>Rule of thumb:</strong> If your ROI is above 5x, double the ad budget. If below 2x, pause ads and fix conversion first.</p>
                                            {budget?.roi > 0 && budget.roi < 2 && (
                                                <p className="text-red-700 font-medium mt-2">Your current ROI is {budget.roi.toFixed(1)}x — below 2x. Pause ads and focus on improving tutor-to-Pro conversion before spending more.</p>
                                            )}
                                            {budget?.roi >= 5 && (
                                                <p className="text-emerald-700 font-medium mt-2">Your ROI is {budget.roi.toFixed(1)}x — excellent! Consider increasing your budget by 30–50% to accelerate growth.</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Budget history table */}
                                    {budgetHistory.length > 0 && (
                                        <div>
                                            <h3 className="text-base font-semibold text-gray-900 mb-3">Budget history</h3>
                                            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
                                                <table className="w-full text-sm">
                                                    <thead className="bg-gray-50 border-b border-gray-100">
                                                        <tr>
                                                            {["Month", "Budget", "Spent", "Utilisation", "ROI"].map(h => (
                                                                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500">{h}</th>
                                                            ))}
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {budgetHistory.map(b => (
                                                            <tr key={b.id} className="border-b border-gray-50 last:border-0">
                                                                <td className="px-4 py-3 font-medium text-gray-900">{b.month}</td>
                                                                <td className="px-4 py-3 text-gray-600">₹{b.totalBudget?.toLocaleString("en-IN")}</td>
                                                                <td className="px-4 py-3 text-gray-600">₹{b.adSpend?.toLocaleString("en-IN")}</td>
                                                                <td className="px-4 py-3 text-gray-600">{b.totalBudget > 0 ? `${((b.adSpend / b.totalBudget) * 100).toFixed(0)}%` : "—"}</td>
                                                                <td className="px-4 py-3 text-gray-600">—</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                        </div>
                    )}

                    {activeTab === "vip" && <VipAdminPanel adminKey={adminKey} />}
                </div>
            </main>

            {/* ─── USER DETAIL DRAWER ─────────────────────────────────────────────── */}
            {userDrawerOpen && (
                <div className="fixed inset-0 z-[80] flex justify-end">
                    <div className="flex-1 bg-black/30 backdrop-blur-sm" onClick={() => { setUserDrawerOpen(false); setUserEditMode(false); }} />
                    <div className="w-full max-w-md bg-white h-full overflow-y-auto shadow-2xl flex flex-col">
                        <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-5 py-4 flex items-center justify-between">
                            <h3 className="font-bold text-base text-gray-900">User Profile</h3>
                            <button onClick={() => { setUserDrawerOpen(false); setUserEditMode(false); }} className="size-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 transition-colors">
                                <XCircle size={16} />
                            </button>
                        </div>

                        {userDrawerLoading ? (
                            <div className="flex-1 flex items-center justify-center">
                                <div className="size-8 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
                            </div>
                        ) : selectedUser ? (
                            <div className="flex-1 p-5 space-y-5">
                                {/* Avatar + name */}
                                <div className="flex items-start gap-4">
                                    <div className={`size-14 rounded-2xl flex items-center justify-center font-bold text-xl shrink-0 ${selectedUser.role === "TUTOR" ? "bg-blue-100 text-blue-600" : selectedUser.role === "INSTITUTE" ? "bg-purple-100 text-purple-600" : "bg-amber-100 text-amber-600"}`}>
                                        {selectedUser.name?.[0]?.toUpperCase() || "?"}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-lg text-gray-900 truncate">{selectedUser.name || "No name"}</p>
                                        <div className="flex flex-wrap gap-1.5 mt-1">
                                            <span className={`px-2 py-0.5 rounded-lg text-xs font-semibold ${selectedUser.role === "TUTOR" ? "bg-blue-50 text-blue-600" : selectedUser.role === "INSTITUTE" ? "bg-purple-50 text-purple-600" : "bg-amber-50 text-amber-600"}`}>
                                                {selectedUser.role.charAt(0) + selectedUser.role.slice(1).toLowerCase()}
                                            </span>
                                            <span className={`px-2 py-0.5 rounded-lg text-xs font-semibold ${selectedUser.subscriptionTier === "ELITE" ? "bg-amber-50 text-amber-600" : selectedUser.subscriptionTier === "PRO" ? "bg-blue-50 text-blue-600" : "bg-gray-50 text-gray-500"}`}>
                                                {selectedUser.subscriptionTier}
                                            </span>
                                            {selectedUser.isVerified && <span className="px-2 py-0.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-600">Verified</span>}
                                            {selectedUser.isSuspended && <span className="px-2 py-0.5 rounded-lg text-xs font-semibold bg-red-50 text-red-500">Suspended</span>}
                                        </div>
                                        <p className="text-xs text-gray-400 mt-1 font-mono">{selectedUser.id}</p>
                                    </div>
                                </div>

                                {/* Contact */}
                                <div className="bg-gray-50 rounded-xl p-4 space-y-2.5">
                                    <p className="text-xs font-bold text-gray-500 mb-1">Contact info</p>
                                    <div className="flex items-center gap-2 text-sm"><Phone size={13} className="text-gray-400 shrink-0" /><span className="text-gray-700 font-medium">{selectedUser.phone || "—"}</span></div>
                                    <div className="flex items-center gap-2 text-sm"><Mail size={13} className="text-gray-400 shrink-0" /><span className="text-gray-700 font-medium truncate">{selectedUser.email || "—"}</span></div>
                                    <div className="flex items-center gap-2 text-sm"><Calendar size={13} className="text-gray-400 shrink-0" /><span className="text-gray-700 font-medium">Joined {new Date(selectedUser.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</span></div>
                                    <div className="flex items-center gap-2 text-sm"><ShieldCheck size={13} className="text-gray-400 shrink-0" /><span className="text-gray-700 font-medium">Sign-in via {selectedUser.provider || "phone"}</span></div>
                                </div>

                                {/* Stats */}
                                <div className="grid grid-cols-3 gap-2">
                                    {[
                                        { label: "Credits", value: selectedUser.credits },
                                        { label: "Transactions", value: selectedUser._count?.transactions || 0 },
                                        { label: selectedUser.role === "STUDENT" ? "Leads" : "Reviews", value: selectedUser.role === "STUDENT" ? (selectedUser._count?.leadsPosted || 0) : (selectedUser._count?.reviewsReceived || 0) },
                                    ].map((s, i) => (
                                        <div key={i} className="bg-gray-50 rounded-xl p-3 text-center border border-gray-100">
                                            <p className="text-xl font-bold text-gray-900">{s.value}</p>
                                            <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* Tutor listing */}
                                {selectedUser.role === "TUTOR" && selectedUser.tutorListing && (
                                    <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                                        <p className="text-xs font-bold text-blue-700 mb-2">Tutor listing</p>
                                        <div className="space-y-1.5 text-sm">
                                            <p className="text-gray-700"><span className="font-semibold">Location:</span> {selectedUser.tutorListing.location || "—"}</p>
                                            <p className="text-gray-700"><span className="font-semibold">Rate:</span> ₹{selectedUser.tutorListing.hourlyRate || "—"}/hr</p>
                                            <p className="text-gray-700"><span className="font-semibold">Subjects:</span> {Array.isArray(selectedUser.tutorListing.subjects) ? selectedUser.tutorListing.subjects.join(", ") : "—"}</p>
                                            <p className="text-gray-700"><span className="font-semibold">Rating:</span> {selectedUser.tutorListing.rating ? `${selectedUser.tutorListing.rating} ★ (${selectedUser.tutorListing.reviewCount} reviews)` : "No reviews yet"}</p>
                                            <p className="text-gray-700"><span className="font-semibold">Listing approved:</span> {selectedUser.tutorListing.isApproved ? "Yes" : "No"}</p>
                                        </div>
                                    </div>
                                )}

                                {/* Verification */}
                                {selectedUser.verificationRequest && (
                                    <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                                        <p className="text-xs font-bold text-amber-700 mb-1">Verification request</p>
                                        <p className="text-sm text-gray-700">Status: <span className="font-semibold">{selectedUser.verificationRequest.status}</span></p>
                                        {selectedUser.verificationRequest.submittedAt && (
                                            <p className="text-xs text-gray-400 mt-0.5">Submitted {new Date(selectedUser.verificationRequest.submittedAt).toLocaleDateString("en-IN")}</p>
                                        )}
                                    </div>
                                )}

                                {/* Recent transactions */}
                                {selectedUser.transactions?.length > 0 && (
                                    <div>
                                        <p className="text-xs font-bold text-gray-500 mb-2">Recent transactions</p>
                                        <div className="space-y-2">
                                            {selectedUser.transactions.map(txn => (
                                                <div key={txn.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                                                    <div>
                                                        <p className="text-xs font-semibold text-gray-700">{txn.type || "Payment"}</p>
                                                        <p className="text-xs text-gray-400">{new Date(txn.createdAt).toLocaleDateString("en-IN")}</p>
                                                    </div>
                                                    <span className="text-sm font-bold text-emerald-600">₹{txn.amount}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Edit form */}
                                {userEditMode && (
                                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 space-y-3">
                                        <p className="text-xs font-bold text-blue-700">Edit user details</p>
                                        <div>
                                            <label className="text-xs font-semibold text-gray-600 block mb-1">Name</label>
                                            <input value={userEditData.name ?? selectedUser.name ?? ""} onChange={e => setUserEditData(p => ({ ...p, name: e.target.value }))} className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-200 outline-none" />
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold text-gray-600 block mb-1">Email</label>
                                            <input value={userEditData.email ?? selectedUser.email ?? ""} onChange={e => setUserEditData(p => ({ ...p, email: e.target.value }))} className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-200 outline-none" />
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold text-gray-600 block mb-1">Credits</label>
                                            <input type="number" value={userEditData.credits ?? selectedUser.credits ?? 0} onChange={e => setUserEditData(p => ({ ...p, credits: parseInt(e.target.value) || 0 }))} className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-200 outline-none" />
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold text-gray-600 block mb-1">Subscription tier</label>
                                            <select value={userEditData.subscriptionTier ?? selectedUser.subscriptionTier} onChange={e => setUserEditData(p => ({ ...p, subscriptionTier: e.target.value }))} className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-200 outline-none">
                                                <option value="FREE">Free</option>
                                                <option value="PRO">Pro</option>
                                                <option value="ELITE">Elite</option>
                                            </select>
                                        </div>
                                        <label className="flex items-center gap-2 text-xs font-semibold text-gray-600 cursor-pointer">
                                            <input type="checkbox" checked={userEditData.isVerified ?? selectedUser.isVerified} onChange={e => setUserEditData(p => ({ ...p, isVerified: e.target.checked }))} className="rounded" />
                                            Mark as verified
                                        </label>
                                        <div className="flex gap-2 pt-1">
                                            <button onClick={handleEditUserSave} disabled={userEditSaving} className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50">
                                                {userEditSaving ? "Saving..." : "Save changes"}
                                            </button>
                                            <button onClick={() => { setUserEditMode(false); setUserEditData({}); }} className="px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg text-xs font-semibold hover:bg-gray-50 transition-colors">
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Action buttons */}
                                <div className="grid grid-cols-2 gap-2 pt-2">
                                    {!userEditMode && (
                                        <button onClick={() => { setUserEditMode(true); setUserEditData({}); }} className="flex items-center justify-center gap-1.5 py-2.5 bg-blue-50 text-blue-600 rounded-xl text-xs font-semibold hover:bg-blue-100 transition-colors border border-blue-100">
                                            <Edit2 size={13} /> Edit details
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleSuspend(selectedUser.id, !selectedUser.isSuspended)}
                                        disabled={userActionLoading === selectedUser.id + "-suspend"}
                                        className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold transition-colors border ${selectedUser.isSuspended ? "bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100" : "bg-amber-50 text-amber-600 border-amber-100 hover:bg-amber-100"}`}
                                    >
                                        {userActionLoading === selectedUser.id + "-suspend" ? "..." : selectedUser.isSuspended ? "Reinstate account" : "Suspend account"}
                                    </button>
                                    <button onClick={() => handleDeleteUser(selectedUser.id)} className="col-span-2 flex items-center justify-center gap-1.5 py-2.5 bg-red-50 text-red-500 rounded-xl text-xs font-semibold hover:bg-red-100 transition-colors border border-red-100">
                                        <Trash2 size={13} /> Delete user permanently
                                    </button>
                                </div>
                            </div>
                        ) : null}
                    </div>
                </div>
            )}
        </div>
    );
}

export default function AdminDashboard() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen bg-gray-50 font-sans">
                <div className="flex flex-col items-center gap-4 text-gray-400">
                    <div className="size-10 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
                    <p className="text-sm font-semibold">Loading admin dashboard...</p>
                </div>
            </div>
        }>
            <AdminDashboardContent />
        </Suspense>
    );
}
