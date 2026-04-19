"use client";

import { useState, useEffect, Suspense } from "react";
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
    Calendar,
    Edit2,
    Trash2,
    Eye,
    EyeOff,
    ChevronLeft,
    ChevronRight,
    GitBranch,
    Server,
    HardDrive,
    Clock,
    ArrowUpCircle,
    RotateCcw,
    ExternalLink,
    AlertTriangle,
    FileText,
    Megaphone,
    Send,
    Plus,
    Tag,
    Globe,
    X,
    Rocket,
    HelpCircle,
} from "lucide-react";

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

    // Users tab state
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

    // Deployments tab
    const [versionData, setVersionData] = useState(null);
    const [versionLoading, setVersionLoading] = useState(false);
    const [deployRuns, setDeployRuns] = useState({});
    const [deployTriggering, setDeployTriggering] = useState(null); // "staging" | "production" | null
    const [deployResult, setDeployResult] = useState(null);

    // Blog tab
    const [blogPosts, setBlogPosts] = useState([]);
    const [blogLoading, setBlogLoading] = useState(false);
    const [blogEditing, setBlogEditing] = useState(null); // null | "new" | post object
    const [blogSaving, setBlogSaving] = useState(false);
    const [blogForm, setBlogForm] = useState({ title: "", slug: "", excerpt: "", content: "", category: "", author: "TuitionsInIndia", readTime: "5 min read", isPublished: false });
    const [blogDeleteLoading, setBlogDeleteLoading] = useState(null);

    // Attribution tab
    const [attrData, setAttrData] = useState(null);
    const [attrLoading, setAttrLoading] = useState(false);
    const [attrRange, setAttrRange] = useState("30d");

    const fetchAttribution = async (range = attrRange) => {
        if (!adminKey) return;
        setAttrLoading(true);
        try {
            const res = await fetch(`/api/admin/attribution?range=${range}`, { headers: { "x-admin-key": adminKey } });
            const json = await res.json();
            if (json.success) setAttrData(json);
        } finally {
            setAttrLoading(false);
        }
    };

    // Launch readiness tab
    const [launchData, setLaunchData] = useState(null);
    const [launchLoading, setLaunchLoading] = useState(false);

    const fetchLaunchReadiness = async () => {
        if (!adminKey) return;
        setLaunchLoading(true);
        try {
            const res = await fetch("/api/admin/launch-readiness", { headers: { "x-admin-key": adminKey } });
            const json = await res.json();
            if (json.success) setLaunchData(json);
        } finally {
            setLaunchLoading(false);
        }
    };

    // Marketing tab
    const [mktSegment, setMktSegment] = useState("ALL");
    const [mktSubject, setMktSubject] = useState("");
    const [mktBody, setMktBody] = useState("");
    const [mktSending, setMktSending] = useState(false);
    const [mktPreviewResult, setMktPreviewResult] = useState(null);
    const [mktSendResult, setMktSendResult] = useState(null);

    // On mount, check sessionStorage for saved key
    useEffect(() => {
        const saved = sessionStorage.getItem("adminKey");
        if (saved) setAdminKey(saved);
        else setLoading(false);
    }, []);

    useEffect(() => {
        if (adminKey) fetchMetrics(adminKey);
    }, [adminKey]);

    useEffect(() => {
        if (activeTab === "users" && adminKey) fetchUsers();
        if (activeTab === "deployments" && adminKey) {
            fetchVersionData();
            fetchDeployRuns();
        }
        if (activeTab === "blog" && adminKey) fetchBlogPosts();
        if (activeTab === "launch" && adminKey) fetchLaunchReadiness();
        if (activeTab === "attribution" && adminKey) fetchAttribution();
    }, [activeTab]);

    // Poll deploy run status every 8s while deployments tab is active
    useEffect(() => {
        if (activeTab !== "deployments" || !adminKey) return;
        const interval = setInterval(fetchDeployRuns, 8000);
        return () => clearInterval(interval);
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
            if (json.success) {
                setData(json);
            }
            if (verificationsRes.ok) {
                const vJson = await verificationsRes.json();
                setPendingVerifications(vJson.requests || []);
            }
        } catch (err) {
            console.error("Failed to load metrics", err);
        } finally {
            setLoading(false);
        }
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
        const search = overrides.search ?? userSearch;
        const page   = overrides.page   ?? userPage;
        const role   = overrides.role   ?? userRoleFilter;
        const status = overrides.status ?? userStatusFilter;
        const sort   = overrides.sort   ?? userSort;
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

    const fetchVersionData = async () => {
        setVersionLoading(true);
        try {
            const res = await fetch("/api/admin/version", { headers: { "x-admin-key": adminKey } });
            const json = await res.json();
            if (json.success) setVersionData(json);
        } catch (err) {
            console.error("Failed to load version data", err);
        } finally {
            setVersionLoading(false);
        }
    };

    const fetchDeployRuns = async () => {
        try {
            const res = await fetch("/api/admin/deploy", { headers: { "x-admin-key": adminKey } });
            const json = await res.json();
            if (json.success) {
                setDeployRuns({
                    webhookOnline: json.webhookOnline,
                    currentlyDeploying: json.currentlyDeploying || [],
                });
            }
        } catch {}
    };

    const triggerDeploy = async (env) => {
        if (!confirm(env === "production"
            ? "This will deploy to PRODUCTION (tuitionsinindia.com). Are you sure everything has been tested on staging?"
            : "Deploy the current staging branch to tuitionsinindia.in?")) return;
        setDeployTriggering(env);
        setDeployResult(null);
        try {
            const res = await fetch("/api/admin/deploy", {
                method: "POST",
                headers: { ...adminHeaders(), "x-admin-key": adminKey },
                body: JSON.stringify({ env }),
            });
            const json = await res.json();
            setDeployResult(json);
            if (json.success) {
                setTimeout(fetchDeployRuns, 3000);
                setTimeout(fetchDeployRuns, 10000);
            }
        } catch (err) {
            setDeployResult({ success: false, error: "Network error. Please try again." });
        } finally {
            setDeployTriggering(null);
        }
    };

    // ── Blog handlers ──────────────────────────────────────────────────────────
    const fetchBlogPosts = async () => {
        setBlogLoading(true);
        try {
            const res = await fetch("/api/admin/blog", { headers: { "x-admin-key": adminKey } });
            const json = await res.json();
            if (json.posts) setBlogPosts(json.posts);
        } catch {} finally { setBlogLoading(false); }
    };

    const openNewBlog = () => {
        setBlogForm({ title: "", slug: "", excerpt: "", content: "", category: "", author: "TuitionsInIndia", readTime: "5 min read", isPublished: false });
        setBlogEditing("new");
    };

    const openEditBlog = (post) => {
        setBlogForm({ title: post.title, slug: post.slug, excerpt: post.excerpt, content: post.content, category: post.category, author: post.author || "TuitionsInIndia", readTime: post.readTime || "5 min read", isPublished: post.isPublished });
        setBlogEditing(post);
    };

    const saveBlogPost = async () => {
        if (!blogForm.title || !blogForm.excerpt || !blogForm.content || !blogForm.category) {
            alert("Title, excerpt, content, and category are required.");
            return;
        }
        setBlogSaving(true);
        try {
            const isNew = blogEditing === "new";
            const res = await fetch("/api/admin/blog", {
                method: isNew ? "POST" : "PATCH",
                headers: { ...adminHeaders(), "x-admin-key": adminKey },
                body: JSON.stringify(isNew ? blogForm : { id: blogEditing.id, ...blogForm }),
            });
            const json = await res.json();
            if (json.post) {
                setBlogEditing(null);
                fetchBlogPosts();
            } else {
                alert(json.error || "Could not save post.");
            }
        } catch { alert("Save failed. Please try again."); }
        finally { setBlogSaving(false); }
    };

    const deleteBlogPost = async (id) => {
        if (!confirm("Delete this blog post? This cannot be undone.")) return;
        setBlogDeleteLoading(id);
        try {
            const res = await fetch("/api/admin/blog", {
                method: "DELETE",
                headers: { ...adminHeaders(), "x-admin-key": adminKey },
                body: JSON.stringify({ id }),
            });
            const json = await res.json();
            if (json.success) setBlogPosts(prev => prev.filter(p => p.id !== id));
            else alert(json.error || "Could not delete post.");
        } catch { alert("Delete failed."); }
        finally { setBlogDeleteLoading(null); }
    };

    const togglePublish = async (post) => {
        try {
            const res = await fetch("/api/admin/blog", {
                method: "PATCH",
                headers: { ...adminHeaders(), "x-admin-key": adminKey },
                body: JSON.stringify({ id: post.id, isPublished: !post.isPublished }),
            });
            const json = await res.json();
            if (json.post) setBlogPosts(prev => prev.map(p => p.id === post.id ? json.post : p));
        } catch {}
    };

    // ── Marketing handlers ─────────────────────────────────────────────────────
    const previewBroadcast = async () => {
        if (!mktSubject || !mktBody) { alert("Subject and message are required."); return; }
        setMktPreviewResult(null);
        try {
            const res = await fetch("/api/admin/email/broadcast", {
                method: "POST",
                headers: { ...adminHeaders(), "x-admin-key": adminKey },
                body: JSON.stringify({ subject: mktSubject, body: mktBody, segment: mktSegment, preview: true }),
            });
            const json = await res.json();
            setMktPreviewResult(json);
        } catch { alert("Preview failed."); }
    };

    const sendBroadcast = async () => {
        if (!mktSubject || !mktBody) { alert("Subject and message are required."); return; }
        if (!confirm(`Send to all ${mktSegment === "ALL" ? "users" : mktSegment.toLowerCase() + "s"}? This will send real emails.`)) return;
        setMktSending(true);
        setMktSendResult(null);
        try {
            const res = await fetch("/api/admin/email/broadcast", {
                method: "POST",
                headers: { ...adminHeaders(), "x-admin-key": adminKey },
                body: JSON.stringify({ subject: mktSubject, body: mktBody, segment: mktSegment }),
            });
            const json = await res.json();
            setMktSendResult(json);
        } catch { setMktSendResult({ error: "Send failed. Please try again." }); }
        finally { setMktSending(false); }
    };

    const handleApproveTutor = async (tutorId) => {
        const tutorToApprove = data?.pendingTutors?.find(t => t.id === tutorId);
        if (!tutorToApprove) return;

        setData(prev => ({
            ...prev,
            pendingTutors: prev.pendingTutors.filter(t => t.id !== tutorId),
            metrics: {
                ...prev.metrics,
                totalTutors: prev.metrics.totalTutors + 1
            }
        }));

        try {
            const res = await fetch("/api/admin/tutor/approve", {
                method: "POST",
                headers: adminHeaders(),
                body: JSON.stringify({ tutorId, isApproved: true })
            });
            const json = await res.json();
            if (!json.success) {
                fetchMetrics();
                alert("Failed to approve tutor. Please try again.");
            }
        } catch (err) {
            console.error(err);
            fetchMetrics();
        }
    };

    // Show key entry gate if not authenticated
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

    return (
        <div className="flex h-screen bg-gray-50 font-sans text-gray-900 overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 border-r border-gray-200 bg-white flex flex-col hidden lg:flex shadow-sm z-50">
                <div className="p-6 border-b border-gray-100">
                    <Logo />
                </div>

                <div className="p-4 flex-1 overflow-y-auto space-y-6">
                    <div>
                        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">Management</h4>
                        <nav className="space-y-1">
                            {[
                                { id: "overview", icon: LayoutDashboard, label: "Overview" },
                                { id: "launch", icon: Rocket, label: "Launch Readiness" },
                                { id: "attribution", icon: Megaphone, label: "Ad Attribution" },
                                { id: "users", icon: Users, label: "User Directory" },
                                { id: "listings", icon: GraduationCap, label: "Tutor Approvals" },
                                { id: "vip", icon: Star, label: "VIP Service" },
                                { id: "financials", icon: CreditCard, label: "Transactions" },
                                { id: "stats", icon: BarChart3, label: "Analytics" },
                                { id: "blog", icon: FileText, label: "Blog" },
                                { id: "marketing", icon: Megaphone, label: "Marketing" },
                                { id: "deployments", icon: GitBranch, label: "Deployments" }
                            ].map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id)}
                                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-sm transition-all ${activeTab === item.id ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
                                >
                                    <item.icon size={16} strokeWidth={activeTab === item.id ? 2.5 : 2} className={activeTab === item.id ? 'text-blue-600' : 'text-gray-400'} />
                                    {item.label}
                                </button>
                            ))}
                        </nav>
                    </div>

                    <div>
                        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">Tools</h4>
                        <nav className="space-y-1">
                            {[
                                { icon: Database, label: "Database Tools" },
                                { icon: Settings, label: "Global Settings" }
                            ].map((item, i) => (
                                <button key={i} className="w-full flex items-center gap-3 px-3 py-2.5 text-gray-500 hover:bg-gray-50 hover:text-gray-900 rounded-xl font-semibold text-sm transition-all">
                                    <item.icon size={16} strokeWidth={2} className="text-gray-400" />
                                    {item.label}
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>

                <div className="p-4 border-t border-gray-100">
                    <button
                        onClick={() => { sessionStorage.removeItem("adminKey"); router.push("/"); }}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-red-500 border border-gray-200 hover:bg-red-50 hover:border-red-100 rounded-xl transition-all font-semibold text-sm"
                    >
                        <LogOut size={14} strokeWidth={2} />
                        Log Out
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <main className="flex-1 overflow-y-auto bg-gray-50 min-w-0">
                {/* Sticky topbar — inside main scroll container so it doesn't overlap sidebar */}
                <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-gray-100 px-6 py-3 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-gray-900">Admin Dashboard</span>
                        <span className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 border border-blue-100 rounded-lg">
                            <span className="size-1.5 rounded-full bg-blue-600 animate-pulse"></span>
                            <span className="text-xs font-semibold text-blue-700">Live</span>
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
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

                            {/* Overview Tab */}
                            {activeTab === "overview" && (
                                <>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                        {[
                                            { label: 'Total Tutors', value: data?.metrics.totalTutors || 0, icon: GraduationCap, color: 'text-blue-600', bg: 'bg-blue-50' },
                                            { label: 'Students', value: data?.metrics.totalStudents || 0, icon: UserCheck, color: 'text-amber-600', bg: 'bg-amber-50' },
                                            { label: 'Total Revenue', value: `₹${data?.metrics.totalRevenue || 0}`, icon: Wallet, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                                            { label: 'Active Leads', value: data?.metrics.activeLeads || 0, icon: Target, color: 'text-purple-600', bg: 'bg-purple-50' }
                                        ].map((stat, i) => (
                                            <div key={i} className="p-5 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all">
                                                <div className="flex items-center gap-3 mb-4">
                                                    <div className={`p-2.5 rounded-xl ${stat.bg} ${stat.color}`}>
                                                        <stat.icon size={18} strokeWidth={2} />
                                                    </div>
                                                    <p className="text-xs font-semibold text-gray-500">{stat.label}</p>
                                                </div>
                                                <p className="text-3xl font-bold text-gray-900 tracking-tight">{stat.value}</p>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
                                        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                                            <div className="flex items-center justify-between mb-5">
                                                <h3 className="font-bold text-base text-gray-900">Pending Approvals</h3>
                                                <button onClick={() => setActiveTab("listings")} className="text-xs font-semibold text-blue-600 hover:underline">View all</button>
                                            </div>
                                            <div className="space-y-3">
                                                {data?.pendingTutors?.slice(0, 3).map(tutor => (
                                                    <div key={tutor.id} className="p-3 bg-gray-50 rounded-xl flex items-center justify-between border border-gray-100">
                                                        <div className="flex items-center gap-3">
                                                            <div className="size-9 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold text-sm">
                                                                {tutor.name?.[0]}
                                                            </div>
                                                            <div>
                                                                <p className="font-semibold text-sm text-gray-900">{tutor.name}</p>
                                                                <p className="text-xs text-gray-400">{tutor.phone}</p>
                                                            </div>
                                                        </div>
                                                        <button onClick={() => handleApproveTutor(tutor.id)} className="px-3 py-1.5 bg-white text-blue-600 border border-blue-100 rounded-lg text-xs font-semibold hover:bg-blue-600 hover:text-white transition-all">Approve</button>
                                                    </div>
                                                ))}
                                                {(!data?.pendingTutors || data.pendingTutors.length === 0) && (
                                                    <p className="text-center py-6 text-gray-400 text-sm">No pending approvals.</p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                                            <div className="flex items-center justify-between mb-5">
                                                <h3 className="font-bold text-base text-gray-900">Recent Transactions</h3>
                                                <button onClick={() => setActiveTab("financials")} className="text-xs font-semibold text-blue-600 hover:underline">View all</button>
                                            </div>
                                            <div className="space-y-3">
                                                {data?.recentTransactions?.slice(0, 3).map(txn => (
                                                    <div key={txn.id} className="p-3 bg-gray-50 rounded-xl flex items-center justify-between border border-gray-100">
                                                        <div className="flex items-center gap-3">
                                                            <div className="size-9 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center">
                                                                <Wallet size={16} strokeWidth={2} />
                                                            </div>
                                                            <div>
                                                                <p className="font-semibold text-sm text-gray-900">₹{txn.amount}</p>
                                                                <p className="text-xs text-gray-400">{txn.user?.name || "User"}</p>
                                                            </div>
                                                        </div>
                                                        <p className="text-xs text-gray-400">{new Date(txn.createdAt).toLocaleDateString()}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Pending Verification Requests */}
                                        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                                            <div className="flex items-center gap-3 mb-5">
                                                <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                                                    <ShieldCheck size={16} strokeWidth={2} />
                                                </div>
                                                <h3 className="font-bold text-base text-gray-900">Verification Requests</h3>
                                                {pendingVerifications.length > 0 && (
                                                    <span className="ml-auto px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">{pendingVerifications.length}</span>
                                                )}
                                            </div>
                                            <div className="space-y-3">
                                                {pendingVerifications.slice(0, 5).map(v => (
                                                    <div key={v.id} className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <div className="size-9 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold text-sm shrink-0">
                                                                {v.tutor?.name?.[0] || "?"}
                                                            </div>
                                                            <div className="min-w-0 flex-1">
                                                                <p className="font-semibold text-sm text-gray-900 truncate">{v.tutor?.name || "—"}</p>
                                                                <p className="text-xs text-gray-400 truncate">{v.tutor?.phone || v.tutor?.email || "—"}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => handleVerificationReview(v.id, "APPROVE")}
                                                                disabled={verificationActionLoading === v.id + "APPROVE"}
                                                                className="flex-1 px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50"
                                                            >
                                                                {verificationActionLoading === v.id + "APPROVE" ? "..." : "Approve"}
                                                            </button>
                                                            <button
                                                                onClick={() => handleVerificationReview(v.id, "REJECT")}
                                                                disabled={verificationActionLoading === v.id + "REJECT"}
                                                                className="flex-1 px-3 py-1.5 bg-white text-red-500 border border-red-200 rounded-lg text-xs font-semibold hover:bg-red-50 transition-colors disabled:opacity-50"
                                                            >
                                                                {verificationActionLoading === v.id + "REJECT" ? "..." : "Reject"}
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                                {pendingVerifications.length === 0 && (
                                                    <p className="text-center py-6 text-gray-400 text-sm">No pending verification requests.</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* ─── USERS ────────────────────────────────────────────────────────── */}
                            {activeTab === "users" && (
                                <div className="space-y-4">
                                    {/* Header row */}
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-bold text-lg text-gray-900">User Directory</h3>
                                            <p className="text-xs text-gray-400 mt-0.5">{userTotal} total users</p>
                                        </div>
                                    </div>

                                    {/* Filters */}
                                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 flex flex-wrap gap-3 items-center">
                                        {/* Search */}
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={14} />
                                            <input
                                                placeholder="Search name, phone, email..."
                                                value={userSearch}
                                                onChange={e => {
                                                    setUserSearch(e.target.value);
                                                    setUserPage(1);
                                                    fetchUsers({ search: e.target.value, page: 1 });
                                                }}
                                                className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-100 outline-none w-56"
                                            />
                                        </div>

                                        {/* Role filter */}
                                        <div className="flex gap-1.5 flex-wrap">
                                            {["ALL", "STUDENT", "TUTOR", "INSTITUTE"].map(r => (
                                                <button key={r}
                                                    onClick={() => { setUserRoleFilter(r); setUserPage(1); fetchUsers({ role: r, page: 1 }); }}
                                                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${userRoleFilter === r ? "bg-blue-600 text-white" : "bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100"}`}
                                                >
                                                    {r === "ALL" ? "All roles" : r.charAt(0) + r.slice(1).toLowerCase()}
                                                </button>
                                            ))}
                                        </div>

                                        {/* Status filter */}
                                        <div className="flex gap-1.5 flex-wrap">
                                            {["ALL", "ACTIVE", "PENDING", "SUSPENDED"].map(s => (
                                                <button key={s}
                                                    onClick={() => { setUserStatusFilter(s); setUserPage(1); fetchUsers({ status: s, page: 1 }); }}
                                                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${userStatusFilter === s ? "bg-gray-800 text-white" : "bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100"}`}
                                                >
                                                    {s === "ALL" ? "All status" : s.charAt(0) + s.slice(1).toLowerCase()}
                                                </button>
                                            ))}
                                        </div>

                                        {/* Sort */}
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
                                                                    <button
                                                                        onClick={() => openUserDrawer(u.id)}
                                                                        className="flex items-center gap-3 text-left"
                                                                    >
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
                                                                        <button
                                                                            onClick={() => openUserDrawer(u.id)}
                                                                            className="px-2.5 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-semibold hover:bg-blue-100 transition-colors flex items-center gap-1"
                                                                        >
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

                                        {/* Pagination */}
                                        {userPages > 1 && (
                                            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
                                                <span className="text-xs text-gray-400">Page {userPage} of {userPages} — {userTotal} users</span>
                                                <div className="flex gap-2">
                                                    <button
                                                        disabled={userPage <= 1}
                                                        onClick={() => { const p = userPage - 1; setUserPage(p); fetchUsers({ page: p }); }}
                                                        className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-gray-50 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                                                    >
                                                        <ChevronLeft size={12} /> Prev
                                                    </button>
                                                    <button
                                                        disabled={userPage >= userPages}
                                                        onClick={() => { const p = userPage + 1; setUserPage(p); fetchUsers({ page: p }); }}
                                                        className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-gray-50 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                                                    >
                                                        Next <ChevronRight size={12} />
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Listings / Approvals Tab */}
                            {activeTab === "listings" && (
                                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                                    <h3 className="font-bold text-lg text-gray-900 mb-6">Tutor Approvals</h3>
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

                            {/* Financials Tab */}
                            {activeTab === "financials" && (
                                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                                    <h3 className="font-bold text-lg text-gray-900 mb-6">Transactions</h3>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left">
                                            <thead>
                                                <tr className="border-b border-gray-200 bg-gray-50">
                                                    <th className="pb-3 pt-2 text-xs font-semibold text-gray-500 uppercase tracking-wider pr-4 rounded-tl-xl">Transaction</th>
                                                    <th className="pb-3 pt-2 text-xs font-semibold text-gray-500 uppercase tracking-wider px-4">User</th>
                                                    <th className="pb-3 pt-2 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right pl-4 rounded-tr-xl">Amount</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {data?.recentTransactions?.map(txn => (
                                                    <tr key={txn.id} className="hover:bg-gray-50 transition-colors">
                                                        <td className="py-5 pr-4">
                                                            <p className="font-semibold text-sm text-gray-900">Credit Purchase</p>
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
                                                        <td className="py-5 pl-4 text-right">
                                                            <p className="text-lg font-bold text-emerald-600">₹{txn.amount}</p>
                                                            <span className="text-xs font-semibold text-emerald-500">Paid</span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === "vip" && <VipAdminPanel adminKey={adminKey} />}

                            {/* ─── BLOG ──────────────────────────────────────────────────────── */}
                            {activeTab === "blog" && (
                                <div className="space-y-4">
                                    {/* Header */}
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-bold text-lg text-gray-900">Blog Posts</h3>
                                            <p className="text-xs text-gray-400 mt-0.5">{blogPosts.length} posts total</p>
                                        </div>
                                        <button
                                            onClick={openNewBlog}
                                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors"
                                        >
                                            <Plus size={14} /> New Post
                                        </button>
                                    </div>

                                    {/* Editor / Form */}
                                    {blogEditing && (
                                        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 space-y-4">
                                            <div className="flex items-center justify-between">
                                                <h4 className="font-bold text-gray-900">{blogEditing === "new" ? "New Post" : "Edit Post"}</h4>
                                                <button onClick={() => setBlogEditing(null)} className="text-gray-400 hover:text-gray-600 transition-colors"><X size={16} /></button>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Title</label>
                                                    <input
                                                        value={blogForm.title}
                                                        onChange={e => setBlogForm(f => ({ ...f, title: e.target.value }))}
                                                        placeholder="Post title"
                                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Slug (URL)</label>
                                                    <input
                                                        value={blogForm.slug}
                                                        onChange={e => setBlogForm(f => ({ ...f, slug: e.target.value }))}
                                                        placeholder="auto-generated if blank"
                                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 font-mono"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Category</label>
                                                    <input
                                                        value={blogForm.category}
                                                        onChange={e => setBlogForm(f => ({ ...f, category: e.target.value }))}
                                                        placeholder="e.g. Tips, News, Guides"
                                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Author</label>
                                                    <input
                                                        value={blogForm.author}
                                                        onChange={e => setBlogForm(f => ({ ...f, author: e.target.value }))}
                                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Excerpt (shown in listing)</label>
                                                <textarea
                                                    value={blogForm.excerpt}
                                                    onChange={e => setBlogForm(f => ({ ...f, excerpt: e.target.value }))}
                                                    rows={2}
                                                    placeholder="Short summary shown on the blog listing page"
                                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 resize-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Content (Markdown supported)</label>
                                                <textarea
                                                    value={blogForm.content}
                                                    onChange={e => setBlogForm(f => ({ ...f, content: e.target.value }))}
                                                    rows={14}
                                                    placeholder="Write your full post content here. Markdown is supported."
                                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 resize-y"
                                                />
                                            </div>
                                            <div className="flex items-center justify-between pt-2">
                                                <label className="flex items-center gap-2 cursor-pointer select-none">
                                                    <input
                                                        type="checkbox"
                                                        checked={blogForm.isPublished}
                                                        onChange={e => setBlogForm(f => ({ ...f, isPublished: e.target.checked }))}
                                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                    />
                                                    <span className="text-sm font-semibold text-gray-700">Publish immediately</span>
                                                </label>
                                                <div className="flex items-center gap-3">
                                                    <button onClick={() => setBlogEditing(null)} className="px-4 py-2 text-sm font-semibold text-gray-500 hover:text-gray-700 transition-colors">Cancel</button>
                                                    <button
                                                        onClick={saveBlogPost}
                                                        disabled={blogSaving}
                                                        className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors"
                                                    >
                                                        {blogSaving ? "Saving…" : "Save post"}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Post list */}
                                    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                                        {blogLoading ? (
                                            <div className="flex items-center justify-center py-16">
                                                <div className="size-8 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
                                            </div>
                                        ) : blogPosts.length === 0 ? (
                                            <div className="py-16 text-center">
                                                <FileText size={32} className="text-gray-200 mx-auto mb-3" />
                                                <p className="text-sm font-semibold text-gray-400">No posts yet</p>
                                                <p className="text-xs text-gray-400 mt-1">Click "New Post" to write your first article.</p>
                                            </div>
                                        ) : (
                                            <div className="divide-y divide-gray-100">
                                                {blogPosts.map(post => (
                                                    <div key={post.id} className="px-5 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                                                                <span className="text-sm font-semibold text-gray-900 truncate">{post.title}</span>
                                                                <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${post.isPublished ? "bg-emerald-50 text-emerald-600" : "bg-gray-100 text-gray-500"}`}>
                                                                    {post.isPublished ? "Published" : "Draft"}
                                                                </span>
                                                                {post.category && (
                                                                    <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-50 text-blue-600 flex items-center gap-1">
                                                                        <Tag size={9} /> {post.category}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <p className="text-xs text-gray-400">{post.author} · {post.slug} · {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "Unpublished"}</p>
                                                        </div>
                                                        <div className="flex items-center gap-2 shrink-0">
                                                            {post.isPublished && (
                                                                <a
                                                                    href={`/blog/${post.slug}`}
                                                                    target="_blank" rel="noopener noreferrer"
                                                                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                                    title="View live post"
                                                                >
                                                                    <Globe size={14} />
                                                                </a>
                                                            )}
                                                            <button
                                                                onClick={() => togglePublish(post)}
                                                                title={post.isPublished ? "Unpublish" : "Publish"}
                                                                className={`p-2 rounded-lg transition-colors ${post.isPublished ? "text-emerald-600 hover:bg-emerald-50" : "text-gray-400 hover:bg-gray-100"}`}
                                                            >
                                                                {post.isPublished ? <Eye size={14} /> : <EyeOff size={14} />}
                                                            </button>
                                                            <button
                                                                onClick={() => openEditBlog(post)}
                                                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                                title="Edit post"
                                                            >
                                                                <Edit2 size={14} />
                                                            </button>
                                                            <button
                                                                onClick={() => deleteBlogPost(post.id)}
                                                                disabled={blogDeleteLoading === post.id}
                                                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                                title="Delete post"
                                                            >
                                                                {blogDeleteLoading === post.id ? <div className="size-3.5 border-2 border-gray-200 border-t-red-400 rounded-full animate-spin" /> : <Trash2 size={14} />}
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* ─── LAUNCH READINESS ─────────────────────────────────────────── */}
                            {activeTab === "launch" && (() => {
                                const statusStyles = {
                                    ok:     { icon: CheckCircle2,  bg: "bg-emerald-50", border: "border-emerald-100", fg: "text-emerald-700", dot: "bg-emerald-500", label: "Ready" },
                                    warn:   { icon: AlertTriangle, bg: "bg-amber-50",   border: "border-amber-100",   fg: "text-amber-700",   dot: "bg-amber-500",   label: "Attention" },
                                    fail:   { icon: XCircle,       bg: "bg-red-50",     border: "border-red-100",     fg: "text-red-700",     dot: "bg-red-500",     label: "Blocker" },
                                    manual: { icon: HelpCircle,    bg: "bg-gray-50",    border: "border-gray-200",    fg: "text-gray-600",    dot: "bg-gray-400",    label: "Manual check" },
                                };
                                const groupedChecks = (launchData?.checks || []).reduce((acc, c) => {
                                    (acc[c.category] = acc[c.category] || []).push(c);
                                    return acc;
                                }, {});
                                const summary = launchData?.summary;
                                const ready = launchData?.launchReady;

                                return (
                                    <div className="max-w-5xl space-y-6">
                                        {/* Header */}
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h2 className="text-xl font-bold text-gray-900">Launch Readiness</h2>
                                                <p className="text-sm text-gray-400 mt-0.5">
                                                    Go/no-go checklist for production. Re-run any time.
                                                </p>
                                            </div>
                                            <button
                                                onClick={fetchLaunchReadiness}
                                                disabled={launchLoading}
                                                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-100 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50"
                                            >
                                                <RefreshCcw size={13} className={launchLoading ? "animate-spin" : ""} />
                                                {launchLoading ? "Checking…" : "Re-run checks"}
                                            </button>
                                        </div>

                                        {/* Go/no-go banner + summary */}
                                        {launchLoading && !launchData ? (
                                            <div className="flex items-center gap-3 p-4 bg-white border border-gray-100 rounded-xl">
                                                <div className="size-5 border-2 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
                                                <p className="text-sm text-gray-500 font-medium">Running readiness checks…</p>
                                            </div>
                                        ) : launchData ? (
                                            <>
                                                <div className={`p-5 rounded-2xl border ${ready ? "bg-emerald-50 border-emerald-100" : "bg-amber-50 border-amber-100"}`}>
                                                    <div className="flex items-start gap-4">
                                                        <div className={`p-2.5 rounded-xl ${ready ? "bg-white text-emerald-600" : "bg-white text-amber-600"}`}>
                                                            <Rocket size={18} />
                                                        </div>
                                                        <div className="flex-1">
                                                            <h3 className={`font-bold text-base ${ready ? "text-emerald-900" : "text-amber-900"}`}>
                                                                {ready ? "Ready to launch" : "Not ready yet"}
                                                            </h3>
                                                            <p className={`text-sm mt-0.5 ${ready ? "text-emerald-700" : "text-amber-700"}`}>
                                                                {ready
                                                                    ? "All blockers clear. You can push to production."
                                                                    : `${summary.fail} blocker${summary.fail === 1 ? "" : "s"} and ${summary.warn} warning${summary.warn === 1 ? "" : "s"} to resolve first.`}
                                                            </p>
                                                            <p className="text-xs text-gray-500 mt-2">
                                                                Last checked: {new Date(launchData.generatedAt).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Summary tiles */}
                                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                                    {[
                                                        { key: "ok",     label: "Ready",         value: summary.ok,     ...statusStyles.ok },
                                                        { key: "warn",   label: "Warnings",      value: summary.warn,   ...statusStyles.warn },
                                                        { key: "fail",   label: "Blockers",      value: summary.fail,   ...statusStyles.fail },
                                                        { key: "manual", label: "Manual checks", value: summary.manual, ...statusStyles.manual },
                                                    ].map(tile => (
                                                        <div key={tile.key} className={`p-4 rounded-xl border ${tile.border} ${tile.bg}`}>
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <span className={`size-2 rounded-full ${tile.dot}`} />
                                                                <p className={`text-xs font-semibold ${tile.fg}`}>{tile.label}</p>
                                                            </div>
                                                            <p className={`text-2xl font-bold ${tile.fg}`}>{tile.value}</p>
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* Checks by category */}
                                                {Object.entries(groupedChecks).map(([category, items]) => (
                                                    <div key={category} className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
                                                        <div className="px-5 py-3 border-b border-gray-100 bg-gray-50">
                                                            <h3 className="text-sm font-bold text-gray-900">{category}</h3>
                                                        </div>
                                                        <div className="divide-y divide-gray-100">
                                                            {items.map(check => {
                                                                const s = statusStyles[check.status] || statusStyles.manual;
                                                                const Icon = s.icon;
                                                                return (
                                                                    <div key={check.id} className="px-5 py-4 flex items-start gap-3">
                                                                        <div className={`p-1.5 rounded-lg ${s.bg} ${s.border} border shrink-0`}>
                                                                            <Icon size={14} className={s.fg} />
                                                                        </div>
                                                                        <div className="flex-1 min-w-0">
                                                                            <div className="flex items-center gap-2 flex-wrap">
                                                                                <p className="text-sm font-semibold text-gray-900">{check.label}</p>
                                                                                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${s.bg} ${s.fg} border ${s.border}`}>
                                                                                    {s.label}
                                                                                </span>
                                                                            </div>
                                                                            <p className="text-xs text-gray-500 mt-1">{check.detail}</p>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                ))}

                                                <div className="text-xs text-gray-400 pt-2">
                                                    Tip: environment variables come from the running container. Update <code className="bg-gray-100 px-1.5 py-0.5 rounded">.env.production</code> on the VPS and redeploy to refresh.
                                                </div>
                                            </>
                                        ) : null}
                                    </div>
                                );
                            })()}

                            {/* ─── AD ATTRIBUTION ───────────────────────────────────────────── */}
                            {activeTab === "attribution" && (() => {
                                const fmtDateShort = (d) => d ? new Date(d).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : "—";
                                const rangeOptions = [
                                    { id: "7d",  label: "Last 7 days" },
                                    { id: "30d", label: "Last 30 days" },
                                    { id: "90d", label: "Last 90 days" },
                                    { id: "all", label: "All time" },
                                ];
                                const maxCount = (rows) => rows.reduce((max, r) => Math.max(max, r.count), 0) || 1;
                                const BarRow = ({ label, count, max }) => (
                                    <div className="flex items-center gap-3">
                                        <div className="w-48 shrink-0 text-sm text-gray-700 truncate" title={label}>{label}</div>
                                        <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
                                            <div
                                                className="h-full bg-blue-500 rounded-full flex items-center justify-end pr-2 transition-all"
                                                style={{ width: `${Math.max(6, (count / max) * 100)}%` }}
                                            >
                                                <span className="text-[11px] font-semibold text-white">{count}</span>
                                            </div>
                                        </div>
                                    </div>
                                );

                                return (
                                    <div className="max-w-5xl space-y-6">
                                        {/* Header */}
                                        <div className="flex items-center justify-between flex-wrap gap-3">
                                            <div>
                                                <h2 className="text-xl font-bold text-gray-900">Ad Attribution</h2>
                                                <p className="text-sm text-gray-400 mt-0.5">
                                                    First-touch attribution — the ad that <em>acquired</em> each user.
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-lg p-1">
                                                    {rangeOptions.map(opt => (
                                                        <button
                                                            key={opt.id}
                                                            onClick={() => { setAttrRange(opt.id); fetchAttribution(opt.id); }}
                                                            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${attrRange === opt.id ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-900"}`}
                                                        >
                                                            {opt.label}
                                                        </button>
                                                    ))}
                                                </div>
                                                <button
                                                    onClick={() => fetchAttribution(attrRange)}
                                                    disabled={attrLoading}
                                                    className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-100 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50"
                                                >
                                                    <RefreshCcw size={13} className={attrLoading ? "animate-spin" : ""} />
                                                    Refresh
                                                </button>
                                            </div>
                                        </div>

                                        {attrLoading && !attrData ? (
                                            <div className="flex items-center gap-3 p-4 bg-white border border-gray-100 rounded-xl">
                                                <div className="size-5 border-2 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
                                                <p className="text-sm text-gray-500 font-medium">Loading attribution…</p>
                                            </div>
                                        ) : attrData ? (
                                            <>
                                                {/* Summary tiles */}
                                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                                    <div className="p-4 bg-white rounded-xl border border-gray-200">
                                                        <p className="text-xs font-semibold text-gray-400 mb-1">New users in range</p>
                                                        <p className="text-2xl font-bold text-gray-900">{attrData.totalUsers}</p>
                                                    </div>
                                                    <div className="p-4 bg-white rounded-xl border border-gray-200">
                                                        <p className="text-xs font-semibold text-gray-400 mb-1">From a tracked ad</p>
                                                        <p className="text-2xl font-bold text-blue-600">{attrData.attributedUsers}</p>
                                                    </div>
                                                    <div className="p-4 bg-white rounded-xl border border-gray-200">
                                                        <p className="text-xs font-semibold text-gray-400 mb-1">Attribution rate</p>
                                                        <p className="text-2xl font-bold text-emerald-600">{attrData.attributionRate}%</p>
                                                    </div>
                                                </div>

                                                {/* By source */}
                                                <div className="bg-white border border-gray-200 rounded-2xl p-5">
                                                    <div className="flex items-center justify-between mb-4">
                                                        <h3 className="font-bold text-gray-900">Signups by source</h3>
                                                        <span className="text-xs text-gray-400">utm_source (or referrer for direct)</span>
                                                    </div>
                                                    {attrData.bySource.length === 0 ? (
                                                        <p className="text-sm text-gray-400">No attributed signups in this range yet.</p>
                                                    ) : (
                                                        <div className="space-y-2">
                                                            {(() => {
                                                                const max = maxCount(attrData.bySource);
                                                                return attrData.bySource.map((row, i) => (
                                                                    <BarRow key={i} label={row.key} count={row.count} max={max} />
                                                                ));
                                                            })()}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* By campaign */}
                                                <div className="bg-white border border-gray-200 rounded-2xl p-5">
                                                    <div className="flex items-center justify-between mb-4">
                                                        <h3 className="font-bold text-gray-900">Signups by campaign</h3>
                                                        <span className="text-xs text-gray-400">utm_campaign</span>
                                                    </div>
                                                    {attrData.byCampaign.length === 0 ? (
                                                        <p className="text-sm text-gray-400">No campaign-tagged traffic yet. Use <code className="bg-gray-100 px-1.5 py-0.5 rounded">utm_campaign=</code> on your ad URLs.</p>
                                                    ) : (
                                                        <div className="space-y-2">
                                                            {(() => {
                                                                const max = maxCount(attrData.byCampaign);
                                                                return attrData.byCampaign.map((row, i) => (
                                                                    <BarRow key={i} label={row.key} count={row.count} max={max} />
                                                                ));
                                                            })()}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* By landing path */}
                                                <div className="bg-white border border-gray-200 rounded-2xl p-5">
                                                    <div className="flex items-center justify-between mb-4">
                                                        <h3 className="font-bold text-gray-900">Signups by landing page</h3>
                                                        <span className="text-xs text-gray-400">page they first hit</span>
                                                    </div>
                                                    {attrData.byLandingPath.length === 0 ? (
                                                        <p className="text-sm text-gray-400">No landing-page data yet.</p>
                                                    ) : (
                                                        <div className="space-y-2">
                                                            {(() => {
                                                                const max = maxCount(attrData.byLandingPath);
                                                                return attrData.byLandingPath.map((row, i) => (
                                                                    <BarRow key={i} label={row.key} count={row.count} max={max} />
                                                                ));
                                                            })()}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Role × source matrix */}
                                                {Object.keys(attrData.roleSourceMatrix).length > 0 && (
                                                    <div className="bg-white border border-gray-200 rounded-2xl p-5 overflow-x-auto">
                                                        <div className="flex items-center justify-between mb-4">
                                                            <h3 className="font-bold text-gray-900">Role × source</h3>
                                                            <span className="text-xs text-gray-400">who each channel brought in</span>
                                                        </div>
                                                        <table className="w-full text-sm">
                                                            <thead>
                                                                <tr className="text-left text-xs font-semibold text-gray-500 border-b border-gray-100">
                                                                    <th className="py-2 px-3">Source</th>
                                                                    <th className="py-2 px-3 text-right">Students</th>
                                                                    <th className="py-2 px-3 text-right">Tutors</th>
                                                                    <th className="py-2 px-3 text-right">Institutes</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {Object.entries(attrData.roleSourceMatrix).map(([source, counts]) => (
                                                                    <tr key={source} className="border-b border-gray-50">
                                                                        <td className="py-2 px-3 font-semibold text-gray-900">{source}</td>
                                                                        <td className="py-2 px-3 text-right text-gray-700">{counts.STUDENT || 0}</td>
                                                                        <td className="py-2 px-3 text-right text-gray-700">{counts.TUTOR || 0}</td>
                                                                        <td className="py-2 px-3 text-right text-gray-700">{counts.INSTITUTE || 0}</td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                )}

                                                {/* Recent attributed signups */}
                                                <div className="bg-white border border-gray-200 rounded-2xl p-5 overflow-x-auto">
                                                    <h3 className="font-bold text-gray-900 mb-4">Recent attributed signups</h3>
                                                    {attrData.recentUsers.length === 0 ? (
                                                        <p className="text-sm text-gray-400">No attributed signups yet.</p>
                                                    ) : (
                                                        <table className="w-full text-sm">
                                                            <thead>
                                                                <tr className="text-left text-xs font-semibold text-gray-500 border-b border-gray-100">
                                                                    <th className="py-2 px-3">When</th>
                                                                    <th className="py-2 px-3">Name</th>
                                                                    <th className="py-2 px-3">Role</th>
                                                                    <th className="py-2 px-3">Source</th>
                                                                    <th className="py-2 px-3">Campaign</th>
                                                                    <th className="py-2 px-3">Landing</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {attrData.recentUsers.map((u) => (
                                                                    <tr key={u.id} className="border-b border-gray-50">
                                                                        <td className="py-2 px-3 text-gray-500 whitespace-nowrap">{fmtDateShort(u.createdAt)}</td>
                                                                        <td className="py-2 px-3 text-gray-900 font-medium">{u.name}</td>
                                                                        <td className="py-2 px-3 text-gray-600">{u.role?.toLowerCase()}</td>
                                                                        <td className="py-2 px-3 text-gray-700">{u.utmSource || "—"}</td>
                                                                        <td className="py-2 px-3 text-gray-700 truncate max-w-[160px]" title={u.utmCampaign || ""}>{u.utmCampaign || "—"}</td>
                                                                        <td className="py-2 px-3 text-gray-500 truncate max-w-[160px]" title={u.landingPath || ""}>{u.landingPath || "—"}</td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    )}
                                                </div>

                                                <div className="text-xs text-gray-400 pt-2">
                                                    Updated: {fmtDateShort(attrData.generatedAt)} · First-touch attribution is permanent — later visits don't overwrite the original source.
                                                </div>
                                            </>
                                        ) : null}
                                    </div>
                                );
                            })()}

                            {/* ─── MARKETING ─────────────────────────────────────────────────── */}
                            {activeTab === "marketing" && (
                                <div className="space-y-5 max-w-3xl">
                                    <div>
                                        <h3 className="font-bold text-lg text-gray-900">Marketing</h3>
                                        <p className="text-xs text-gray-400 mt-0.5">Send email campaigns to your users.</p>
                                    </div>

                                    {/* Email Broadcast */}
                                    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 space-y-4">
                                        <div className="flex items-center gap-2 mb-1">
                                            <div className="p-2 bg-blue-50 rounded-xl">
                                                <Send size={14} className="text-blue-600" />
                                            </div>
                                            <h4 className="font-bold text-gray-900">Email Broadcast</h4>
                                        </div>

                                        {/* Segment selector */}
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-600 mb-2">Send to</label>
                                            <div className="flex flex-wrap gap-2">
                                                {[
                                                    { value: "ALL", label: "All users" },
                                                    { value: "TUTOR", label: "All tutors" },
                                                    { value: "STUDENT", label: "All students" },
                                                    { value: "PRO", label: "Pro tutors" },
                                                    { value: "ELITE", label: "Elite tutors" },
                                                    { value: "UNVERIFIED_TUTOR", label: "Unverified tutors" },
                                                ].map(({ value, label }) => (
                                                    <button
                                                        key={value}
                                                        onClick={() => { setMktSegment(value); setMktPreviewResult(null); }}
                                                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${mktSegment === value ? "bg-blue-600 text-white" : "bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100"}`}
                                                    >
                                                        {label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Subject */}
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Email subject</label>
                                            <input
                                                value={mktSubject}
                                                onChange={e => setMktSubject(e.target.value)}
                                                placeholder="e.g. New features on TuitionsinIndia!"
                                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
                                            />
                                        </div>

                                        {/* Body */}
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Message body</label>
                                            <textarea
                                                value={mktBody}
                                                onChange={e => setMktBody(e.target.value)}
                                                rows={8}
                                                placeholder={"Hi,\n\nWrite your message here. It will be sent as a branded email.\n\nThanks,\nTeam TuitionsinIndia"}
                                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 resize-y"
                                            />
                                        </div>

                                        {/* Preview result */}
                                        {mktPreviewResult && (
                                            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                                                <p className="text-sm font-semibold text-blue-800 mb-1">{mktPreviewResult.count} recipients found</p>
                                                {mktPreviewResult.emails?.length > 0 && (
                                                    <p className="text-xs text-blue-700">Sample: {mktPreviewResult.emails.filter(Boolean).join(", ")}{mktPreviewResult.count > 5 ? ` …and ${mktPreviewResult.count - 5} more` : ""}</p>
                                                )}
                                                {mktPreviewResult.count === 0 && (
                                                    <p className="text-xs text-blue-600">No matching users found for this segment.</p>
                                                )}
                                            </div>
                                        )}

                                        {/* Send result */}
                                        {mktSendResult && (
                                            <div className={`rounded-xl p-4 border ${mktSendResult.success ? "bg-emerald-50 border-emerald-100" : "bg-red-50 border-red-100"}`}>
                                                {mktSendResult.success ? (
                                                    <p className="text-sm font-semibold text-emerald-800">
                                                        Sent to {mktSendResult.sent} recipients{mktSendResult.failed > 0 ? `, ${mktSendResult.failed} failed` : ""}.
                                                    </p>
                                                ) : (
                                                    <p className="text-sm font-semibold text-red-700">{mktSendResult.error}</p>
                                                )}
                                            </div>
                                        )}

                                        {/* Actions */}
                                        <div className="flex items-center gap-3 pt-1">
                                            <button
                                                onClick={previewBroadcast}
                                                disabled={mktSending}
                                                className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-200 disabled:opacity-50 transition-colors"
                                            >
                                                <Eye size={14} /> Preview recipients
                                            </button>
                                            <button
                                                onClick={sendBroadcast}
                                                disabled={mktSending || !mktSubject || !mktBody}
                                                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors"
                                            >
                                                {mktSending ? <><div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sending…</> : <><Send size={14} /> Send campaign</>}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Placeholder for future channels */}
                                    <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 text-center">
                                        <Megaphone size={24} className="text-gray-300 mx-auto mb-2" />
                                        <p className="text-sm font-semibold text-gray-400">SMS campaigns coming soon</p>
                                        <p className="text-xs text-gray-400 mt-1">WhatsApp and SMS broadcasts will be available here.</p>
                                    </div>
                                </div>
                            )}

                    {/* ─── DEPLOYMENTS TAB ─── */}
                    {activeTab === "deployments" && (() => {
                        const fmtDate = (d) => d ? new Date(d).toLocaleString("en-IN", { day:"numeric", month:"short", hour:"2-digit", minute:"2-digit" }) : "—";
                        const isDeploying = (env) => (deployRuns.currentlyDeploying || []).includes(env);

                        return (
                        <div className="max-w-5xl mx-auto space-y-6">
                            {/* Header */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">Deployments & Backups</h2>
                                    <p className="text-sm text-gray-400 mt-0.5">Trigger deploys, track what's live, and manage backups.</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold ${deployRuns.webhookOnline ? "bg-emerald-50 border-emerald-100 text-emerald-700" : "bg-gray-50 border-gray-200 text-gray-400"}`}>
                                        <span className={`size-1.5 rounded-full ${deployRuns.webhookOnline ? "bg-emerald-500 animate-pulse" : "bg-gray-300"}`} />
                                        {deployRuns.webhookOnline ? "Deploy server online" : "Checking…"}
                                    </div>
                                    <button onClick={() => { fetchVersionData(); fetchDeployRuns(); }}
                                        className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-100 rounded-lg hover:bg-blue-100 transition-colors">
                                        <RefreshCcw size={13} /> Refresh
                                    </button>
                                </div>
                            </div>

                            {/* Deploy result banner */}
                            {deployResult && (
                                <div className={`flex items-start gap-3 p-4 rounded-xl border ${deployResult.success ? "bg-emerald-50 border-emerald-100" : "bg-red-50 border-red-100"}`}>
                                    {deployResult.success
                                        ? <CheckCircle2 size={16} className="text-emerald-600 mt-0.5 shrink-0" />
                                        : <AlertTriangle size={16} className="text-red-500 mt-0.5 shrink-0" />}
                                    <div className="flex-1">
                                        <p className={`text-sm font-semibold ${deployResult.success ? "text-emerald-800" : "text-red-700"}`}>
                                            {deployResult.success ? deployResult.message : deployResult.error}
                                        </p>
                                        {deployResult.runUrl && (
                                            <a href={deployResult.runUrl} target="_blank" rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline mt-1">
                                                Watch live build <ExternalLink size={10} />
                                            </a>
                                        )}
                                    </div>
                                    <button onClick={() => setDeployResult(null)} className="text-gray-400 hover:text-gray-600 text-xs">✕</button>
                                </div>
                            )}

                            {/* ── Deploy Buttons ── */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Staging */}
                                <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <Server size={15} className="text-blue-600" />
                                            <span className="font-bold text-sm text-gray-900">Staging</span>
                                            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">staging branch</span>
                                        </div>
                                        <a href="https://tuitionsinindia.in" target="_blank" rel="noopener noreferrer"
                                            className="text-xs text-gray-400 hover:text-blue-600 flex items-center gap-1 transition-colors">
                                            tuitionsinindia.in <ExternalLink size={11} />
                                        </a>
                                    </div>

                                    {/* Current version */}
                                    {versionData?.staging?.current ? (
                                        <div className="mb-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-mono text-xs bg-white border border-gray-200 text-gray-600 px-1.5 py-0.5 rounded">
                                                    {versionData.staging.current.shortSha || versionData.staging.current.sha?.slice(0,7)}
                                                </span>
                                                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                <span className="text-xs text-emerald-600 font-semibold">Live</span>
                                            </div>
                                            <p className="text-xs text-gray-600 truncate">{versionData.staging.current.message}</p>
                                            <p className="text-xs text-gray-400 mt-0.5">{fmtDate(versionData.staging.current.deployedAt)} · {versionData.staging.current.author}</p>
                                        </div>
                                    ) : (
                                        <div className="mb-4 p-3 bg-gray-50 rounded-xl text-xs text-gray-400">Not deployed yet</div>
                                    )}

                                    {isDeploying("staging") && (
                                        <div className="flex items-center gap-2 mb-3 px-3 py-2 bg-amber-50 border border-amber-100 rounded-lg">
                                            <div className="size-3 border-2 border-amber-300 border-t-amber-600 rounded-full animate-spin shrink-0" />
                                            <span className="text-xs text-amber-700 font-semibold">Build in progress… ~3 min</span>
                                        </div>
                                    )}

                                    <button
                                        onClick={() => triggerDeploy("staging")}
                                        disabled={deployTriggering === "staging" || isDeploying("staging")}
                                        className="w-full py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-60 transition-colors flex items-center justify-center gap-2"
                                    >
                                        {deployTriggering === "staging"
                                            ? <><div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Triggering…</>
                                            : isDeploying("staging")
                                            ? <><div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Building…</>
                                            : <><ArrowUpCircle size={15} /> Deploy to Staging</>}
                                    </button>
                                    <p className="text-xs text-gray-400 mt-2 text-center">Pulls <code className="font-mono">staging</code> branch and rebuilds. ~3 min.</p>
                                </div>

                                {/* Production */}
                                <div className="bg-white border-2 border-emerald-200 rounded-2xl p-5 shadow-sm">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <Server size={15} className="text-emerald-600" />
                                            <span className="font-bold text-sm text-gray-900">Production</span>
                                            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">main branch</span>
                                        </div>
                                        <a href="https://tuitionsinindia.com" target="_blank" rel="noopener noreferrer"
                                            className="text-xs text-gray-400 hover:text-blue-600 flex items-center gap-1 transition-colors">
                                            tuitionsinindia.com <ExternalLink size={11} />
                                        </a>
                                    </div>

                                    {versionData?.production?.current ? (
                                        <div className="mb-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-mono text-xs bg-white border border-gray-200 text-gray-600 px-1.5 py-0.5 rounded">
                                                    {versionData.production.current.shortSha || versionData.production.current.sha?.slice(0,7)}
                                                </span>
                                                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                <span className="text-xs text-emerald-600 font-semibold">Live</span>
                                            </div>
                                            <p className="text-xs text-gray-600 truncate">{versionData.production.current.message}</p>
                                            <p className="text-xs text-gray-400 mt-0.5">{fmtDate(versionData.production.current.deployedAt)} · {versionData.production.current.author}</p>
                                        </div>
                                    ) : (
                                        <div className="mb-4 p-3 bg-gray-50 rounded-xl text-xs text-gray-400">No version info yet</div>
                                    )}

                                    {isDeploying("production") && (
                                        <div className="flex items-center gap-2 mb-3 px-3 py-2 bg-amber-50 border border-amber-100 rounded-lg">
                                            <div className="size-3 border-2 border-amber-300 border-t-amber-600 rounded-full animate-spin shrink-0" />
                                            <span className="text-xs text-amber-700 font-semibold">Production build in progress… ~3 min</span>
                                        </div>
                                    )}

                                    <button
                                        onClick={() => triggerDeploy("production")}
                                        disabled={deployTriggering === "production" || isDeploying("production")}
                                        className="w-full py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 disabled:opacity-60 transition-colors flex items-center justify-center gap-2"
                                    >
                                        {deployTriggering === "production"
                                            ? <><div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Triggering…</>
                                            : isDeploying("production")
                                            ? <><div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Building…</>
                                            : <><ArrowUpCircle size={15} /> Promote to Production</>}
                                    </button>
                                    <p className="text-xs text-gray-400 mt-2 text-center">Pulls <code className="font-mono">main</code> branch and deploys to the live site.</p>
                                </div>
                            </div>

                            {/* ── Workflow tip ── */}
                            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-start gap-3">
                                <GitBranch size={15} className="text-blue-600 mt-0.5 shrink-0" />
                                <div className="text-xs text-blue-800 leading-relaxed">
                                    <span className="font-bold">Workflow:</span> Push changes from your computer → click <span className="font-semibold">Deploy to Staging</span> → test on tuitionsinindia.in → click <span className="font-semibold">Promote to Production</span> to go live.
                                </div>
                            </div>

                            {/* ── Deployment History ── */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {[
                                    { label: "Production history", history: versionData?.production?.history },
                                    { label: "Staging history", history: versionData?.staging?.history }
                                ].map(({ label, history }) => (
                                    <div key={label} className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                                        <div className="px-5 py-4 border-b border-gray-100">
                                            <h3 className="font-bold text-sm text-gray-900">{label}</h3>
                                        </div>
                                        <div className="divide-y divide-gray-50">
                                            {history && history.length > 0 ? history.map((entry, i) => (
                                                <div key={i} className="px-5 py-3 flex items-start gap-3 hover:bg-gray-50 transition-colors">
                                                    <div className={`mt-1 size-2 rounded-full shrink-0 ${entry.status === "success" ? "bg-emerald-400" : "bg-red-400"}`} />
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-0.5">
                                                            <span className="font-mono text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">{entry.sha}</span>
                                                            <span className="text-xs text-gray-600 truncate">{entry.message}</span>
                                                        </div>
                                                        <p className="text-xs text-gray-400">{entry.author} · {fmtDate(entry.deployedAt)}</p>
                                                    </div>
                                                </div>
                                            )) : (
                                                <div className="px-5 py-8 text-center text-xs text-gray-400">
                                                    No history yet. Run a deploy to start tracking.
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* ── Database Backups ── */}
                            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                                <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <HardDrive size={15} className="text-gray-500" />
                                        <h3 className="font-bold text-sm text-gray-900">Database Backups</h3>
                                    </div>
                                    {versionData?.backups?.lastRun && (
                                        <span className="text-xs text-gray-400 flex items-center gap-1">
                                            <Clock size={11} /> Last: {fmtDate(versionData.backups.lastRun)}
                                        </span>
                                    )}
                                </div>
                                <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
                                    {[
                                        { label: "Production backups", files: versionData?.backups?.production },
                                        { label: "Staging backups", files: versionData?.backups?.staging }
                                    ].map(({ label, files }) => (
                                        <div key={label}>
                                            <p className="text-xs font-semibold text-gray-600 mb-2">{label}</p>
                                            <div className="space-y-1.5">
                                                {files && files.length > 0 ? files.map((f, i) => (
                                                    <div key={i} className="flex items-center justify-between text-xs py-1.5 px-3 bg-gray-50 rounded-lg border border-gray-100">
                                                        <span className="font-mono text-gray-600 truncate">{f.name}</span>
                                                        <span className="text-gray-400 ml-2 shrink-0">{(f.size / 1024).toFixed(1)} KB</span>
                                                    </div>
                                                )) : (
                                                    <p className="text-xs text-gray-400 py-2">No backups yet — first backup runs at 2 AM.</p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="px-5 py-3 bg-gray-50 border-t border-gray-100">
                                    <p className="text-xs text-gray-400">Daily at 2 AM. 14 days retained at <code className="font-mono">/root/db-backups/</code> on the VPS.</p>
                                </div>
                            </div>

                            {/* ── Rollback ── */}
                            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                                <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
                                    <RotateCcw size={15} className="text-amber-600" />
                                    <h3 className="font-bold text-sm text-gray-900">Rollback to a previous version</h3>
                                </div>
                                <div className="divide-y divide-gray-50">
                                    {[...(versionData?.production?.history || []), ...(versionData?.staging?.history || [])]
                                        .sort((a, b) => new Date(b.deployedAt) - new Date(a.deployedAt))
                                        .slice(0, 10)
                                        .map((entry, i) => (
                                            <div key={i} className="px-5 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors">
                                                <div className={`size-2 rounded-full shrink-0 ${entry.status === "success" ? "bg-emerald-400" : "bg-red-400"}`} />
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <span className={`text-xs font-semibold ${entry.env === "production" ? "text-emerald-600" : "text-blue-600"}`}>{entry.env}</span>
                                                        <span className="font-mono text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">{entry.sha}</span>
                                                        <span className="text-xs text-gray-600 truncate">{entry.message}</span>
                                                    </div>
                                                    <p className="text-xs text-gray-400">{entry.author} · {fmtDate(entry.deployedAt)}</p>
                                                </div>
                                                <button
                                                    onClick={() => {
                                                        if (confirm(`Roll back ${entry.env} to commit ${entry.sha}?\n\n"${entry.message}"\n\nThis will redeploy the ${entry.env} environment from this commit.`)) {
                                                            triggerDeploy(entry.env);
                                                        }
                                                    }}
                                                    className="shrink-0 flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-100 rounded-lg hover:bg-amber-100 transition-colors"
                                                >
                                                    <RotateCcw size={11} /> Rollback
                                                </button>
                                            </div>
                                        ))}
                                    {(!versionData?.production?.history?.length && !versionData?.staging?.history?.length) && (
                                        <div className="px-5 py-8 text-center text-xs text-gray-400">No deploy history yet. Run a deploy to start tracking versions.</div>
                                    )}
                                </div>
                            </div>
                        </div>
                        );
                    })()}
                </div>
            </main>

            {/* ─── USER DETAIL DRAWER ─────────────────────────────────────────────── */}
            {userDrawerOpen && (
                <div className="fixed inset-0 z-[80] flex">
                    {/* Backdrop */}
                    <div className="flex-1 bg-black/30 backdrop-blur-sm" onClick={() => { setUserDrawerOpen(false); setUserEditMode(false); }} />
                    {/* Drawer */}
                    <div className="w-full max-w-md bg-white h-full overflow-y-auto shadow-2xl flex flex-col">
                        {/* Drawer header */}
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
                                {/* Avatar + name + role */}
                                <div className="flex items-start gap-4">
                                    <div className={`size-14 rounded-2xl flex items-center justify-center font-bold text-xl shrink-0 ${selectedUser.role === "TUTOR" ? "bg-blue-100 text-blue-600" : selectedUser.role === "INSTITUTE" ? "bg-purple-100 text-purple-600" : "bg-amber-100 text-amber-600"}`}>
                                        {selectedUser.name?.[0]?.toUpperCase() || "?"}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-lg text-gray-900 truncate">{selectedUser.name || "No name"}</p>
                                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                                            <span className={`px-2 py-0.5 rounded-lg text-xs font-semibold ${selectedUser.role === "TUTOR" ? "bg-blue-50 text-blue-600" : selectedUser.role === "INSTITUTE" ? "bg-purple-50 text-purple-600" : "bg-amber-50 text-amber-600"}`}>
                                                {selectedUser.role.charAt(0) + selectedUser.role.slice(1).toLowerCase()}
                                            </span>
                                            <span className={`px-2 py-0.5 rounded-lg text-xs font-semibold ${selectedUser.subscriptionTier === "ELITE" ? "bg-amber-50 text-amber-600" : selectedUser.subscriptionTier === "PRO" ? "bg-blue-50 text-blue-600" : "bg-gray-50 text-gray-500"}`}>
                                                {selectedUser.subscriptionTier}
                                            </span>
                                            {selectedUser.isVerified && <span className="px-2 py-0.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-600">Verified</span>}
                                            {selectedUser.isSuspended && <span className="px-2 py-0.5 rounded-lg text-xs font-semibold bg-red-50 text-red-500">Suspended</span>}
                                        </div>
                                        <p className="text-xs text-gray-400 mt-1">ID: {selectedUser.id}</p>
                                    </div>
                                </div>

                                {/* Contact info */}
                                <div className="bg-gray-50 rounded-xl p-4 space-y-2.5">
                                    <p className="text-xs font-bold text-gray-500 mb-1">Contact</p>
                                    <div className="flex items-center gap-2 text-sm">
                                        <Phone size={13} className="text-gray-400 shrink-0" />
                                        <span className="text-gray-700 font-medium">{selectedUser.phone || "—"}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <Mail size={13} className="text-gray-400 shrink-0" />
                                        <span className="text-gray-700 font-medium truncate">{selectedUser.email || "—"}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <Calendar size={13} className="text-gray-400 shrink-0" />
                                        <span className="text-gray-700 font-medium">Joined {new Date(selectedUser.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <ShieldCheck size={13} className="text-gray-400 shrink-0" />
                                        <span className="text-gray-700 font-medium">Sign-in via {selectedUser.provider || "phone"}</span>
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="grid grid-cols-3 gap-3">
                                    {[
                                        { label: "Credits", value: selectedUser.credits },
                                        { label: "Transactions", value: selectedUser._count?.transactions || 0 },
                                        { label: selectedUser.role === "STUDENT" ? "Leads posted" : "Reviews", value: selectedUser.role === "STUDENT" ? (selectedUser._count?.leadsPosted || 0) : (selectedUser._count?.reviewsReceived || 0) },
                                    ].map((s, i) => (
                                        <div key={i} className="bg-gray-50 rounded-xl p-3 text-center border border-gray-100">
                                            <p className="text-xl font-bold text-gray-900">{s.value}</p>
                                            <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* Tutor listing summary */}
                                {selectedUser.role === "TUTOR" && selectedUser.tutorListing && (
                                    <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                                        <p className="text-xs font-bold text-blue-700 mb-2">Tutor listing</p>
                                        <div className="space-y-1.5 text-sm">
                                            <p className="text-gray-700"><span className="font-semibold">Location:</span> {selectedUser.tutorListing.location || "—"}</p>
                                            <p className="text-gray-700"><span className="font-semibold">Rate:</span> ₹{selectedUser.tutorListing.hourlyRate || "—"}/hr</p>
                                            <p className="text-gray-700"><span className="font-semibold">Subjects:</span> {Array.isArray(selectedUser.tutorListing.subjects) ? selectedUser.tutorListing.subjects.join(", ") : "—"}</p>
                                            <p className="text-gray-700"><span className="font-semibold">Rating:</span> {selectedUser.tutorListing.rating ? `${selectedUser.tutorListing.rating} ★ (${selectedUser.tutorListing.reviewCount} reviews)` : "No reviews"}</p>
                                            <p className="text-gray-700"><span className="font-semibold">Approved:</span> {selectedUser.tutorListing.isApproved ? "Yes" : "No"}</p>
                                        </div>
                                    </div>
                                )}

                                {/* Verification request */}
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
                                                        <p className="text-xs font-semibold text-gray-700">{txn.type || "Transaction"}</p>
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
                                            <input
                                                value={userEditData.name ?? selectedUser.name ?? ""}
                                                onChange={e => setUserEditData(prev => ({ ...prev, name: e.target.value }))}
                                                className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-200 outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold text-gray-600 block mb-1">Email</label>
                                            <input
                                                value={userEditData.email ?? selectedUser.email ?? ""}
                                                onChange={e => setUserEditData(prev => ({ ...prev, email: e.target.value }))}
                                                className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-200 outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold text-gray-600 block mb-1">Credits</label>
                                            <input
                                                type="number"
                                                value={userEditData.credits ?? selectedUser.credits ?? 0}
                                                onChange={e => setUserEditData(prev => ({ ...prev, credits: parseInt(e.target.value) || 0 }))}
                                                className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-200 outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold text-gray-600 block mb-1">Subscription tier</label>
                                            <select
                                                value={userEditData.subscriptionTier ?? selectedUser.subscriptionTier}
                                                onChange={e => setUserEditData(prev => ({ ...prev, subscriptionTier: e.target.value }))}
                                                className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-200 outline-none"
                                            >
                                                <option value="FREE">Free</option>
                                                <option value="PRO">Pro</option>
                                                <option value="ELITE">Elite</option>
                                            </select>
                                        </div>
                                        <div className="flex gap-2">
                                            <label className="flex items-center gap-2 text-xs font-semibold text-gray-600 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={userEditData.isVerified ?? selectedUser.isVerified}
                                                    onChange={e => setUserEditData(prev => ({ ...prev, isVerified: e.target.checked }))}
                                                    className="rounded"
                                                />
                                                Mark as verified
                                            </label>
                                        </div>
                                        <div className="flex gap-2 pt-1">
                                            <button
                                                onClick={handleEditUserSave}
                                                disabled={userEditSaving}
                                                className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                                            >
                                                {userEditSaving ? "Saving..." : "Save changes"}
                                            </button>
                                            <button
                                                onClick={() => { setUserEditMode(false); setUserEditData({}); }}
                                                className="px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg text-xs font-semibold hover:bg-gray-50 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Action buttons */}
                                <div className="grid grid-cols-2 gap-2 pt-2">
                                    {!userEditMode && (
                                        <button
                                            onClick={() => { setUserEditMode(true); setUserEditData({}); }}
                                            className="flex items-center justify-center gap-1.5 py-2.5 bg-blue-50 text-blue-600 rounded-xl text-xs font-semibold hover:bg-blue-100 transition-colors border border-blue-100"
                                        >
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
                                    <button
                                        onClick={() => handleDeleteUser(selectedUser.id)}
                                        className="col-span-2 flex items-center justify-center gap-1.5 py-2.5 bg-red-50 text-red-500 rounded-xl text-xs font-semibold hover:bg-red-100 transition-colors border border-red-100"
                                    >
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
