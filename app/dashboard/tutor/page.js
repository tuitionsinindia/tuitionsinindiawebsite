"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Script from "next/script";
import { trackPurchase, trackBeginCheckout } from "@/lib/analytics";
import {
    LayoutDashboard,
    Search,
    Wallet,
    TrendingUp,
    Settings,
    ArrowRight,
    GraduationCap,
    MapPin,
    Phone,
    MessageCircle,
    CheckCircle2,
    ShieldCheck,
    Star,
    Award,
    LogOut,
    Loader2,
    CreditCard,
    Box,
    PlusCircle,
    Users,
    Zap,
    Sparkles,
    Crown,
    Copy,
    Gift
} from "lucide-react";
import DashboardHeader from "@/app/components/DashboardHeader";
import Chat from "@/app/components/chat/Chat";
import SettingsModule from "@/app/components/dashboard/SettingsModule";
import BillingModule from "@/app/components/dashboard/BillingModule";

const CREDIT_PACKS = [
    { id: "pack_10", credits: 10, price: 99, label: "Starter", popular: false },
    { id: "pack_30", credits: 30, price: 249, label: "Popular", popular: true },
    { id: "pack_60", credits: 60, price: 449, label: "Best Value", popular: false }
];

const FEATURED_OPTIONS = [
    { id: "featured_week", duration: "week", price: 199, label: "1 Week", days: 7 },
    { id: "featured_month", duration: "month", price: 499, label: "1 Month", days: 30 }
];

function DashboardContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const paramTutorId = searchParams.get("tutorId");
    const [tutorId, setTutorId] = useState("");
    const [activeTab, setActiveTab] = useState("HOME");
    const [leads, setLeads] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tutorData, setTutorData] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [chatSessions, setChatSessions] = useState([]);
    const [selectedSession, setSelectedSession] = useState(null);
    const [loadingChat, setLoadingChat] = useState(false);
    const [showBatchForm, setShowBatchForm] = useState(false);
    const [processingPayment, setProcessingPayment] = useState(null);
    const [activeAds, setActiveAds] = useState([]);
    const [referralData, setReferralData] = useState(null);
    const [copiedRef, setCopiedRef] = useState(false);
    const [trials, setTrials] = useState([]);
    const [trialLoading, setTrialLoading] = useState(false);
    const [trialActionLoading, setTrialActionLoading] = useState(null);

    useEffect(() => {
        const savedId = localStorage.getItem("ti_active_tutor_id");
        if (paramTutorId) {
            setTutorId(paramTutorId);
            localStorage.setItem("ti_active_tutor_id", paramTutorId);
        } else if (savedId) {
            setTutorId(savedId);
        }
    }, [paramTutorId]);

    useEffect(() => {
        if (tutorId) {
            fetchTutorData();
            fetchChatSessions();
            fetchTransactions();
            fetchActiveAds();
            fetchReferralData();
            if (activeTab === "HOME" || activeTab === "LEADS") fetchLeads();
            if (activeTab === "BATCHES") fetchCourses();
            if (activeTab === "TRIALS") fetchTrials();
        }
    }, [tutorId, activeTab]);

    const fetchLeads = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({ tutorId });
            const res = await fetch(`/api/lead/list?${params.toString()}`);
            const data = await res.json();
            setLeads(data);
        } catch (err) { console.error(err); } finally { setLoading(false); }
    };

    const fetchCourses = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/institute/courses?instituteId=${tutorId}`);
            const data = await res.json();
            setCourses(data);
        } catch (err) { console.error(err); } finally { setLoading(false); }
    };

    const fetchTutorData = async () => {
        try {
            const res = await fetch(`/api/user/info?id=${tutorId}&viewerId=${tutorId}`);
            if (res.ok) {
                const data = await res.json();
                setTutorData(data);
            }
        } catch (err) { console.error(err); }
    };

    const fetchChatSessions = async () => {
        setLoadingChat(true);
        try {
            const res = await fetch(`/api/chat/session?userId=${tutorId}`);
            if (res.ok) {
                const data = await res.json();
                setChatSessions(data.sessions);
            }
        } catch (err) { console.error(err); } finally { setLoadingChat(false); }
    };

    const fetchTransactions = async () => {
        try {
            const res = await fetch(`/api/user/transactions?userId=${tutorId}`);
            if (res.ok) {
                const data = await res.json();
                setTransactions(data.transactions);
            }
        } catch (err) { console.error(err); }
    };

    const fetchActiveAds = async () => {
        try {
            const res = await fetch(`/api/ad/purchase?userId=${tutorId}`);
            if (res.ok) {
                const data = await res.json();
                setActiveAds(data.ads?.filter(a => a.isActive && new Date(a.endTime) > new Date()) || []);
            }
        } catch (err) { console.error(err); }
    };

    const fetchReferralData = async () => {
        try {
            const res = await fetch("/api/referral");
            if (res.ok) setReferralData(await res.json());
        } catch {}
    };

    const copyReferralLink = () => {
        if (!referralData?.referralLink) return;
        navigator.clipboard.writeText(referralData.referralLink);
        setCopiedRef(true);
        setTimeout(() => setCopiedRef(false), 2000);
    };

    const fetchTrials = async () => {
        setTrialLoading(true);
        try {
            const res = await fetch("/api/trial/list");
            if (res.ok) {
                const data = await res.json();
                setTrials(data.trials || []);
            }
        } catch (err) { console.error(err); } finally { setTrialLoading(false); }
    };

    const handleTrialAction = async (trialId, status, note) => {
        setTrialActionLoading(trialId);
        try {
            const res = await fetch(`/api/trial/${trialId}/status`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status, tutorNote: note }),
            });
            if (res.ok) {
                setTrials(prev => prev.map(t => t.id === trialId ? { ...t, status } : t));
            }
        } catch (err) { console.error(err); } finally { setTrialActionLoading(null); }
    };

    const handleUnlock = async (leadId) => {
        const balance = tutorData?.credits || 0;
        if (balance < 1) {
            alert("You don't have enough credits. Buy credits to unlock student contacts.");
            return;
        }
        if (!confirm(`Unlock for 1 credit? You have ${balance} credit${balance !== 1 ? "s" : ""} remaining.`)) return;
        try {
            const res = await fetch("/api/lead/unlock", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ leadId, tutorId }),
            });
            if (res.ok) {
                fetchLeads();
                fetchTutorData();
            } else {
                const err = await res.json();
                alert(err.error || "Could not unlock. Please check your credit balance.");
            }
        } catch (err) { console.error(err); }
    };

    const handleCreditPurchase = async (pack) => {
        setProcessingPayment(pack.id);
        trackBeginCheckout(pack.price / 100, "INR", `${pack.credits} Credits`);
        try {
            const orderRes = await fetch("/api/payment/order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    amount: pack.price,
                    receipt: `credits_${pack.credits}_${Date.now()}`,
                    userId: tutorId,
                    description: `${pack.credits} credits`
                })
            });
            const order = await orderRes.json();

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: order.currency,
                name: "TuitionsInIndia",
                description: `${pack.credits} Credits`,
                order_id: order.id,
                handler: async (response) => {
                    const verifyRes = await fetch("/api/payment/verify", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            userId: tutorId,
                            creditsToAdd: pack.credits
                        })
                    });
                    const result = await verifyRes.json();
                    if (result.success) {
                        trackPurchase(pack.price / 100, "INR", `${pack.credits} Credits`);
                        fetchTutorData();
                        fetchTransactions();
                        alert(`${pack.credits} credits added successfully!`);
                    }
                },
                prefill: {
                    name: tutorData?.name || "",
                    email: tutorData?.email || "",
                    contact: tutorData?.phone || ""
                },
                theme: { color: "#2563EB" }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (err) {
            console.error(err);
            alert("Something went wrong. Please try again.");
        } finally {
            setProcessingPayment(null);
        }
    };

    const handleFeaturedPurchase = async (option) => {
        setProcessingPayment(option.id);
        trackBeginCheckout(option.price / 100, "INR", `Featured - ${option.label}`);
        try {
            const orderRes = await fetch("/api/payment/order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    amount: option.price,
                    receipt: `featured_${option.duration}_${Date.now()}`,
                    userId: tutorId,
                    description: `Featured listing - ${option.label}`
                })
            });
            const order = await orderRes.json();

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: order.currency,
                name: "TuitionsInIndia",
                description: `Featured Listing - ${option.label}`,
                order_id: order.id,
                handler: async (response) => {
                    const verifyRes = await fetch("/api/payment/verify", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            userId: tutorId,
                            creditsToAdd: 0
                        })
                    });
                    const result = await verifyRes.json();
                    if (result.success) {
                        trackPurchase(option.price / 100, "INR", `Featured - ${option.label}`);
                        await fetch("/api/ad/purchase", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                userId: tutorId,
                                type: "FEATURED",
                                duration: option.duration
                            })
                        });
                        fetchActiveAds();
                        fetchTransactions();
                        alert("Your profile is now featured! You will appear at the top of search results.");
                    }
                },
                prefill: {
                    name: tutorData?.name || "",
                    email: tutorData?.email || "",
                    contact: tutorData?.phone || ""
                },
                theme: { color: "#2563EB" }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (err) {
            console.error(err);
            alert("Something went wrong. Please try again.");
        } finally {
            setProcessingPayment(null);
        }
    };

    const handleSubscriptionPurchase = async (tier) => {
        const plans = { PRO: { price: 499, credits: 30 }, ELITE: { price: 1999, credits: 100 } };
        const plan = plans[tier];
        if (!plan) return;
        setProcessingPayment(`sub_${tier}`);
        try {
            const orderRes = await fetch("/api/payment/order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    amount: plan.price,
                    receipt: `sub_${tier.toLowerCase()}_${Date.now()}`,
                    userId: tutorId,
                    description: `${tier} Plan — 1 month`
                })
            });
            const order = await orderRes.json();

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: order.currency,
                name: "TuitionsInIndia",
                description: `${tier} Plan`,
                order_id: order.id,
                handler: async (response) => {
                    const verifyRes = await fetch("/api/payment/verify", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            userId: tutorId,
                            creditsToAdd: plan.credits,
                            subscriptionTier: tier,
                        })
                    });
                    const result = await verifyRes.json();
                    if (result.success) {
                        fetchTutorData();
                        fetchTransactions();
                        alert(`You are now on the ${tier} plan! ${plan.credits} credits added.`);
                    }
                },
                prefill: {
                    name: tutorData?.name || "",
                    email: tutorData?.email || "",
                    contact: tutorData?.phone || ""
                },
                theme: { color: "#2563EB" }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (err) {
            console.error(err);
            alert("Something went wrong. Please try again.");
        } finally {
            setProcessingPayment(null);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("ti_active_tutor_id");
        router.push("/");
    };

    if (!tutorId) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4 font-sans">
                <div className="bg-white border border-gray-100 p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
                    <div className="size-16 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 mx-auto mb-6">
                        <GraduationCap size={32} />
                    </div>
                    <h2 className="text-2xl font-bold mb-2 text-gray-900 tracking-tight">Tutor Dashboard</h2>
                    <p className="text-gray-400 mb-8 text-sm">Enter your tutor ID to access your dashboard.</p>
                    <input
                        type="text"
                        placeholder="Enter your tutor ID"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-gray-900 font-medium text-sm focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 outline-none transition-all placeholder:text-gray-300 mb-4"
                        onKeyDown={(e) => { if (e.key === 'Enter') setTutorId(e.target.value); }}
                        id="tutorInput"
                    />
                    <button
                        className="w-full bg-blue-600 text-white font-semibold py-4 rounded-xl hover:bg-blue-700 shadow-sm transition-all flex items-center justify-center gap-2 text-sm"
                        onClick={() => setTutorId(document.getElementById('tutorInput').value)}>
                        Continue <ArrowRight size={16} />
                    </button>
                    <Link href="/" className="inline-block mt-6 text-sm font-medium text-gray-400 hover:text-blue-600 transition-colors">Back to Home</Link>
                </div>
            </div>
        );
    }

    const navItems = [
        { id: "HOME", label: "Dashboard", icon: LayoutDashboard },
        { id: "LEADS", label: "Student Leads", icon: Search },
        { id: "TRIALS", label: "Trial Requests", icon: Zap },
        { id: "BATCHES", label: "Batch Classes", icon: Box },
        { id: "CHAT", label: "Messages", icon: MessageCircle },
        { id: "BILLING", label: "Billing", icon: CreditCard },
        { id: "SETTINGS", label: "Settings", icon: Settings }
    ];

    return (
        <div className="relative flex min-h-screen flex-col bg-gray-50 font-sans text-gray-900 antialiased">
            <Script src="https://checkout.razorpay.com/v1/checkout.js" />
            <DashboardHeader
                user={tutorData}
                role="TUTOR"
                credits={tutorData?.credits || 0}
                onLogout={handleLogout}
            />

            <div className="flex flex-1">
                <aside className="fixed left-0 top-[73px] bottom-0 w-20 md:w-64 bg-white border-r border-gray-100 flex flex-col items-center md:items-stretch py-6 px-2 md:px-6 z-50">
                    <nav className="space-y-1 w-full mt-4">
                        {navItems.map((item) => {
                            const unread = item.id === "CHAT"
                                ? chatSessions.filter(s => {
                                    const last = s.messages?.[0];
                                    return last && !last.isRead && last.senderId !== tutorId;
                                }).length
                                : 0;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id)}
                                    className={`w-full flex items-center gap-3 px-3 md:px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                                        activeTab === item.id
                                        ? "bg-blue-600 text-white shadow-sm"
                                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                                    }`}
                                >
                                    <div className="relative">
                                        <item.icon size={18} />
                                        {unread > 0 && (
                                            <span className="absolute -top-1.5 -right-1.5 size-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                                                {unread > 9 ? "9+" : unread}
                                            </span>
                                        )}
                                    </div>
                                    <span className="hidden md:block">{item.label}</span>
                                    {unread > 0 && activeTab !== item.id && (
                                        <span className="hidden md:flex ml-auto size-5 bg-red-500 text-white text-[9px] font-bold rounded-full items-center justify-center">
                                            {unread > 9 ? "9+" : unread}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </nav>

                    <button
                        onClick={handleLogout}
                        className="mt-auto flex items-center justify-center md:justify-start gap-3 px-4 py-3 text-gray-400 hover:text-red-500 text-sm font-medium transition-all"
                    >
                        <LogOut size={16} />
                        <span className="hidden md:block">Log Out</span>
                    </button>
                </aside>

                <main className="flex-1 ml-20 md:ml-64 p-6 md:p-10">
                    <div className="max-w-6xl mx-auto">

                        {activeTab === "HOME" && (
                            <div className="space-y-8">
                                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                                    <div>
                                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">
                                            Welcome back, {tutorData?.name || "Tutor"}
                                        </h1>
                                        <p className="text-gray-500 text-sm">Here is a summary of your account.</p>
                                    </div>
                                    <Link href="/post-requirement" className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold text-sm shadow-sm hover:bg-blue-700 transition-all h-fit">
                                        <Search size={16} /> View Student Leads
                                    </Link>
                                </div>

                                {/* Stats */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {[
                                        { label: "Credits", val: tutorData?.credits || 0, icon: Wallet, color: "text-blue-600", bg: "bg-blue-50" },
                                        { label: "Student Leads", val: leads.length, icon: Users, color: "text-indigo-600", bg: "bg-indigo-50" },
                                        { label: "Verification", val: tutorData?.isVerified ? "Verified" : "Pending", icon: ShieldCheck, color: "text-emerald-600", bg: "bg-emerald-50" },
                                        { label: "Plan", val: tutorData?.subscriptionTier || "Free", icon: Award, color: "text-amber-600", bg: "bg-amber-50" }
                                    ].map((stat, i) => (
                                        <div key={i} className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm">
                                            <div className={`size-10 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center mb-3`}>
                                                <stat.icon size={20} />
                                            </div>
                                            <p className="text-xs font-medium text-gray-400 mb-1">{stat.label}</p>
                                            <p className="text-2xl font-bold text-gray-900">{stat.val}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* Verification Guide — shown only when not verified */}
                                {!tutorData?.isVerified && (
                                    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex gap-4 items-start">
                                        <div className="size-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                                            <ShieldCheck size={20} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-gray-900 mb-1">Complete your verification</h3>
                                            <p className="text-sm text-gray-600 mb-3">
                                                Verified tutors get a badge on their profile, appear higher in search results, and receive more student enquiries.
                                            </p>
                                            <p className="text-xs font-semibold text-gray-700 mb-2">What to upload:</p>
                                            <ul className="text-xs text-gray-500 space-y-1 mb-3">
                                                <li>• A government-issued photo ID (Aadhaar, PAN, Passport, or Driving Licence)</li>
                                                <li>• Your highest qualification certificate (degree, marksheet, or diploma)</li>
                                            </ul>
                                            <p className="text-xs text-gray-400 mb-3">Expected timeline: 2–3 working days after documents are submitted.</p>
                                            <a
                                                href="mailto:support@tuitionsinindia.com?subject=Verification Documents&body=Hi, I would like to complete my tutor verification. My tutor ID is: "
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg text-xs font-semibold hover:bg-amber-700 transition-colors"
                                            >
                                                Send Documents to Support
                                            </a>
                                        </div>
                                    </div>
                                )}

                                {/* Onboarding guide for new tutors */}
                                {leads.length === 0 && (tutorData?.credits || 0) === 0 && (
                                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-6">
                                        <h3 className="text-base font-bold text-gray-900 mb-1">How to get your first student</h3>
                                        <p className="text-sm text-gray-500 mb-5">Follow these steps to start receiving enquiries.</p>
                                        <div className="space-y-3">
                                            {[
                                                { step: "1", title: "Buy credits", desc: "Credits let you unlock student contact details.", action: () => setActiveTab("BILLING"), label: "Buy credits", color: "bg-blue-600" },
                                                { step: "2", title: "Browse student leads", desc: "Find students looking for tutors in your subject.", action: () => setActiveTab("LEADS"), label: "View leads", color: "bg-indigo-600" },
                                                { step: "3", title: "Enable free trial", desc: "Offer a free 30-min class to attract more students.", action: () => setActiveTab("SETTINGS"), label: "Enable trial", color: "bg-emerald-600" },
                                            ].map(item => (
                                                <div key={item.step} className="bg-white rounded-xl p-4 flex items-center gap-4 shadow-sm">
                                                    <div className={`size-8 rounded-full ${item.color} text-white text-sm font-bold flex items-center justify-center shrink-0`}>{item.step}</div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-semibold text-gray-900">{item.title}</p>
                                                        <p className="text-xs text-gray-400">{item.desc}</p>
                                                    </div>
                                                    <button onClick={item.action} className={`px-3 py-1.5 ${item.color} text-white text-xs font-semibold rounded-lg hover:opacity-90 transition-opacity shrink-0`}>
                                                        {item.label}
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Buy Credits Section */}
                                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                                    <div className="flex items-center gap-3 mb-5">
                                        <div className="size-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                            <CreditCard size={20} />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900">Buy Credits</h3>
                                            <p className="text-sm text-gray-400">Use credits to unlock student contacts and start teaching</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        {CREDIT_PACKS.map((pack) => (
                                            <div key={pack.id} className={`relative p-5 rounded-xl border-2 transition-all ${
                                                pack.popular ? "border-blue-600 shadow-md shadow-blue-100" : "border-gray-100 hover:border-blue-300"
                                            }`}>
                                                {pack.popular && (
                                                    <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-semibold px-3 py-0.5 rounded-full">
                                                        Most Popular
                                                    </div>
                                                )}
                                                <div className="text-center">
                                                    <p className="text-3xl font-bold text-gray-900 mb-1">{pack.credits}</p>
                                                    <p className="text-sm text-gray-400 mb-4">credits</p>
                                                    <p className="text-2xl font-bold text-blue-600 mb-1">₹{pack.price}</p>
                                                    <p className="text-xs text-gray-400 mb-4">₹{(pack.price / pack.credits).toFixed(0)} per credit</p>
                                                    <button
                                                        onClick={() => handleCreditPurchase(pack)}
                                                        disabled={processingPayment === pack.id}
                                                        className={`w-full py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                                                            pack.popular
                                                            ? "bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
                                                            : "bg-gray-50 text-gray-700 border border-gray-200 hover:border-blue-500 hover:text-blue-600"
                                                        } disabled:opacity-50`}
                                                    >
                                                        {processingPayment === pack.id ? <Loader2 size={16} className="animate-spin" /> : <>Buy Now</>}
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Get Featured Section */}
                                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                                    <div className="flex items-center gap-3 mb-5">
                                        <div className="size-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                                            <Sparkles size={20} />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900">Get Featured</h3>
                                            <p className="text-sm text-gray-400">Appear at the top of search results and get more student enquiries</p>
                                        </div>
                                    </div>

                                    {activeAds.length > 0 && (
                                        <div className="mb-4 p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-3">
                                            <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                                            <div>
                                                <p className="text-sm font-semibold text-emerald-700">Your profile is currently featured</p>
                                                <p className="text-xs text-emerald-600">Expires: {new Date(activeAds[0].endTime).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {FEATURED_OPTIONS.map((option) => (
                                            <div key={option.id} className="p-5 rounded-xl border border-gray-100 hover:border-amber-300 transition-all">
                                                <div className="flex items-center justify-between mb-3">
                                                    <div className="flex items-center gap-2">
                                                        <Crown size={16} className="text-amber-500" />
                                                        <span className="font-bold text-gray-900">{option.label}</span>
                                                    </div>
                                                    <span className="text-xl font-bold text-gray-900">₹{option.price}</span>
                                                </div>
                                                <ul className="space-y-2 mb-4">
                                                    {[
                                                        "Appear first in search results",
                                                        "\"Featured\" badge on your profile",
                                                        `Active for ${option.days} days`
                                                    ].map((f, i) => (
                                                        <li key={i} className="flex items-center gap-2 text-sm text-gray-500">
                                                            <CheckCircle2 size={14} className="text-amber-500 shrink-0" />
                                                            {f}
                                                        </li>
                                                    ))}
                                                </ul>
                                                <button
                                                    onClick={() => handleFeaturedPurchase(option)}
                                                    disabled={processingPayment === option.id}
                                                    className="w-full py-3 bg-amber-50 text-amber-700 border border-amber-200 rounded-xl font-semibold text-sm hover:bg-amber-100 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                                >
                                                    {processingPayment === option.id ? <Loader2 size={16} className="animate-spin" /> : <>Get Featured</>}
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Refer & Earn Section */}
                                {referralData && (
                                    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                                        <div className="flex items-center gap-3 mb-5">
                                            <div className="size-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                                <Gift size={20} />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-900">Refer and Earn</h3>
                                                <p className="text-sm text-gray-400">Refer 3 tutors and get 1 month of Pro free</p>
                                            </div>
                                        </div>

                                        {/* Referral link */}
                                        <div className="flex items-center gap-2 mb-4">
                                            <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-600 truncate">
                                                {referralData.referralLink}
                                            </div>
                                            <button
                                                onClick={copyReferralLink}
                                                className="px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2 shrink-0"
                                            >
                                                <Copy size={14} /> {copiedRef ? "Copied!" : "Copy"}
                                            </button>
                                        </div>

                                        {/* Stats */}
                                        <div className="grid grid-cols-2 gap-4 mb-4">
                                            <div className="bg-gray-50 rounded-xl p-4 text-center">
                                                <p className="text-2xl font-bold text-gray-900">{referralData.totalReferrals}</p>
                                                <p className="text-xs text-gray-500 mt-1">Tutors Referred</p>
                                            </div>
                                            <div className="bg-gray-50 rounded-xl p-4 text-center">
                                                <p className="text-2xl font-bold text-emerald-600">{Math.floor(referralData.totalReferrals / 3)}</p>
                                                <p className="text-xs text-gray-500 mt-1">Free Pro Months Earned</p>
                                            </div>
                                        </div>

                                        {/* Progress to next reward */}
                                        {referralData.totalReferrals % 3 !== 0 && (
                                            <div className="bg-blue-50 rounded-lg p-3 text-sm text-blue-700">
                                                {3 - (referralData.totalReferrals % 3)} more referral{3 - (referralData.totalReferrals % 3) > 1 ? "s" : ""} to earn your next free Pro month!
                                            </div>
                                        )}

                                        {/* WhatsApp share */}
                                        <a
                                            href={`https://wa.me/?text=${encodeURIComponent(`Join TuitionsInIndia and grow your tutoring career — zero commission, direct student contact! Sign up here: ${referralData.referralLink}`)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="mt-4 w-full py-3 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
                                        >
                                            Share on WhatsApp
                                        </a>
                                    </div>
                                )}

                                {/* Upgrade CTA */}
                                {tutorData?.subscriptionTier === 'FREE' && (
                                    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                                        <div className="mb-4">
                                            <h3 className="text-lg font-bold text-gray-900">Upgrade your plan</h3>
                                            <p className="text-sm text-gray-400 mt-0.5">Get more credits, a verified badge, and better search ranking.</p>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="border-2 border-blue-600 rounded-xl p-4 relative">
                                                <div className="absolute -top-2.5 left-4 bg-blue-600 text-white text-xs font-semibold px-2 py-0.5 rounded-full">Recommended</div>
                                                <p className="font-bold text-gray-900 mt-1">Pro</p>
                                                <p className="text-2xl font-bold text-gray-900 mt-1">₹499<span className="text-sm font-normal text-gray-400">/month</span></p>
                                                <ul className="text-xs text-gray-500 mt-2 space-y-1 mb-4">
                                                    <li>30 credits per month</li>
                                                    <li>Verified badge on profile</li>
                                                    <li>Priority search ranking</li>
                                                </ul>
                                                <button
                                                    onClick={() => handleSubscriptionPurchase("PRO")}
                                                    disabled={!!processingPayment}
                                                    className="w-full py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                                >
                                                    {processingPayment === "sub_PRO" ? <Loader2 size={14} className="animate-spin" /> : null}
                                                    Get Pro
                                                </button>
                                            </div>
                                            <div className="border border-gray-200 rounded-xl p-4">
                                                <p className="font-bold text-gray-900">Elite</p>
                                                <p className="text-2xl font-bold text-gray-900 mt-1">₹1,999<span className="text-sm font-normal text-gray-400">/month</span></p>
                                                <ul className="text-xs text-gray-500 mt-2 space-y-1 mb-4">
                                                    <li>100 credits per month</li>
                                                    <li>Featured listing in search</li>
                                                    <li>Top search ranking</li>
                                                </ul>
                                                <button
                                                    onClick={() => handleSubscriptionPurchase("ELITE")}
                                                    disabled={!!processingPayment}
                                                    className="w-full py-2.5 border border-gray-200 text-gray-700 text-sm font-semibold rounded-lg hover:border-blue-500 hover:text-blue-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                                >
                                                    {processingPayment === "sub_ELITE" ? <Loader2 size={14} className="animate-spin" /> : null}
                                                    Get Elite
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === "LEADS" && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Student Leads</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {loading ? (
                                        <div className="col-span-2 py-20 flex flex-col items-center justify-center bg-white rounded-2xl border border-gray-100">
                                            <Loader2 className="animate-spin text-blue-600 mb-4" size={32} />
                                            <p className="text-sm text-gray-400">Loading leads...</p>
                                        </div>
                                    ) : leads.length > 0 ? leads.map((lead) => (
                                        <div key={lead.id} className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-md transition-all shadow-sm">
                                            <div className="flex justify-between items-center mb-4">
                                                <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-semibold border border-blue-100">{lead.subjects?.[0] || 'General'}</span>
                                                {lead.matchScore > 0 && (
                                                    <div className="flex items-center gap-1.5 text-emerald-600 text-xs font-semibold">
                                                        <Star size={12} fill="currentColor" />
                                                        {lead.matchScore}% match
                                                    </div>
                                                )}
                                            </div>
                                            <p className="text-gray-900 font-medium mb-4 leading-relaxed line-clamp-3">{lead.description}</p>

                                            {lead.isUnlocked ? (
                                                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 space-y-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="size-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0">{lead.student?.name?.[0]?.toUpperCase()}</div>
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="font-bold text-gray-900 text-sm">{lead.student?.name?.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ")}</h4>
                                                            <p className="text-xs text-emerald-600 font-medium">Contact unlocked</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-wrap gap-2">
                                                        {lead.student?.phone && lead.student.phone !== "Hidden" && (
                                                            <a href={`tel:${lead.student.phone}`}
                                                                className="flex items-center gap-1.5 px-3 py-2 bg-white border border-emerald-200 text-emerald-700 text-xs font-semibold rounded-lg hover:bg-emerald-100 transition-colors">
                                                                <Phone size={12} /> {lead.student.phone}
                                                            </a>
                                                        )}
                                                        {lead.student?.phone && lead.student.phone !== "Hidden" && (
                                                            <a href={`https://wa.me/91${lead.student.phone.replace(/\D/g, "")}`} target="_blank" rel="noreferrer"
                                                                className="flex items-center gap-1.5 px-3 py-2 bg-white border border-green-200 text-green-700 text-xs font-semibold rounded-lg hover:bg-green-50 transition-colors">
                                                                WhatsApp
                                                            </a>
                                                        )}
                                                        <button
                                                        onClick={async () => {
                                                            setLoadingChat(true);
                                                            try {
                                                                const res = await fetch("/api/chat/session", {
                                                                    method: "POST",
                                                                    headers: { "Content-Type": "application/json" },
                                                                    body: JSON.stringify({
                                                                        studentId: lead.studentId,
                                                                        tutorId,
                                                                        initiatorId: tutorId
                                                                    })
                                                                });
                                                                if (res.ok) {
                                                                    await fetchChatSessions();
                                                                    setActiveTab("CHAT");
                                                                }
                                                            } catch (err) { console.error(err); } finally { setLoadingChat(false); }
                                                        }}
                                                        className="flex items-center gap-1.5 px-3 py-2 bg-white border border-blue-200 text-blue-700 text-xs font-semibold rounded-lg hover:bg-blue-50 transition-colors"
                                                    >
                                                        {loadingChat ? <Loader2 className="animate-spin" size={12} /> : <><MessageCircle size={12} /> Message</>}
                                                    </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-between gap-4 pt-4 border-t border-gray-50">
                                                    <div className="flex items-center gap-2">
                                                        <MapPin size={14} className="text-gray-400" />
                                                        <span className="text-sm text-gray-500">{lead.locations?.[0] || 'Online'}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs text-gray-400">{tutorData?.credits || 0} credits left</span>
                                                        <button
                                                            onClick={() => handleUnlock(lead.id)}
                                                            className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-all flex items-center gap-1.5"
                                                            disabled={loading}
                                                        >
                                                            <Zap size={13} /> Unlock (1 credit)
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )) : (
                                        <div className="col-span-full py-16 text-center bg-white rounded-2xl border border-dashed border-gray-200">
                                            <Search size={32} className="text-gray-200 mx-auto mb-3" />
                                            <p className="text-sm text-gray-400">No matching student leads right now. Check back soon.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === "CHAT" && (
                            <div className="h-[calc(100vh-180px)] flex bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                                <div className="w-full md:w-72 border-r border-gray-100 flex flex-col">
                                    <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                                        <h3 className="text-sm font-bold text-gray-900">Messages</h3>
                                        <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-md text-xs font-semibold">{chatSessions.length}</span>
                                    </div>
                                    <div className="flex-1 overflow-y-auto py-2">
                                        {chatSessions.length > 0 ? chatSessions.map((session) => (
                                            <button
                                                key={session.id}
                                                onClick={() => setSelectedSession(session)}
                                                className={`w-full px-4 py-3 text-left flex items-center gap-3 transition-all ${
                                                    selectedSession?.id === session.id
                                                    ? "bg-blue-50 border-r-2 border-blue-600"
                                                    : "hover:bg-gray-50"
                                                }`}
                                            >
                                                <div className={`size-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                                                    selectedSession?.id === session.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500'
                                                }`}>
                                                    {session.student?.name?.[0]}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-sm font-semibold text-gray-900 truncate">{session.student?.name}</h4>
                                                    <p className="text-xs text-gray-400 truncate">
                                                        {session.messages?.[0]?.content || "No messages yet"}
                                                    </p>
                                                </div>
                                            </button>
                                        )) : (
                                            <div className="p-8 text-center">
                                                <MessageCircle size={24} className="text-gray-200 mx-auto mb-2" />
                                                <p className="text-xs text-gray-400">No messages yet</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="flex-1 bg-white">
                                    {selectedSession ? (
                                        <Chat
                                            sessionId={selectedSession.id}
                                            currentUser={tutorData}
                                            recipientName={selectedSession.student?.name}
                                        />
                                    ) : (
                                        <div className="h-full flex flex-col items-center justify-center text-center p-8">
                                            <MessageCircle size={48} className="text-gray-200 mb-4" />
                                            <h3 className="text-lg font-bold text-gray-300 mb-1">No conversation selected</h3>
                                            <p className="text-sm text-gray-400">Select a student from the list to start chatting.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === "BATCHES" && (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Batch Classes</h2>
                                    <button onClick={() => setShowBatchForm(true)} className="flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-xl font-semibold text-sm shadow-sm hover:bg-blue-700 transition-all">
                                        <PlusCircle size={16} /> Create Batch
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {courses.length > 0 ? courses.map((course) => (
                                        <div key={course.id} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
                                            <div className="flex justify-between items-start mb-4">
                                                <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-semibold">{course.category}</span>
                                                <div className="text-right">
                                                    <span className="text-xl font-bold text-gray-900">₹{course.price}</span>
                                                    <p className="text-xs text-gray-400">per student</p>
                                                </div>
                                            </div>
                                            <h3 className="text-lg font-bold text-gray-900 mb-4">{course.title}</h3>
                                            <div className="grid grid-cols-2 gap-4 py-4 border-t border-gray-50">
                                                <div>
                                                    <p className="text-xs text-gray-400 mb-1">Enrolled</p>
                                                    <p className="font-bold text-gray-900">{course.enrolledCount} / {course.maxSeats}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-400 mb-1">Status</p>
                                                    <p className={`font-bold ${course.isActive ? 'text-emerald-600' : 'text-gray-400'}`}>{course.isActive ? 'Active' : 'Inactive'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="col-span-2 py-16 text-center bg-white rounded-2xl border border-dashed border-gray-200">
                                            <Box size={32} className="text-gray-200 mx-auto mb-3" />
                                            <p className="text-sm text-gray-400">No batch classes yet. Create one to get started.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === "TRIALS" && (
                            <div className="p-6 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-lg font-bold text-gray-900">Trial Class Requests</h2>
                                        <p className="text-sm text-gray-500 mt-0.5">Students who want a free trial with you</p>
                                    </div>
                                    {!tutorData?.tutorListing?.offersTrialClass && (
                                        <div className="text-right">
                                            <p className="text-xs text-gray-400">Trial classes are off</p>
                                            <button
                                                onClick={async () => {
                                                    await fetch("/api/trial/settings", {
                                                        method: "PATCH",
                                                        headers: { "Content-Type": "application/json" },
                                                        body: JSON.stringify({ offersTrialClass: true, trialDuration: 30 }),
                                                    });
                                                    fetchTutorData();
                                                }}
                                                className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
                                            >
                                                Turn on trials
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {trialLoading ? (
                                    <div className="flex items-center justify-center py-16">
                                        <Loader2 size={24} className="animate-spin text-blue-400" />
                                    </div>
                                ) : trials.length === 0 ? (
                                    <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
                                        <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Zap size={24} className="text-emerald-400" />
                                        </div>
                                        <h3 className="text-base font-semibold text-gray-700 mb-1">No trial requests yet</h3>
                                        <p className="text-sm text-gray-400">
                                            {tutorData?.tutorListing?.offersTrialClass
                                                ? "Students will see a \"Free Trial\" button on your profile. Requests will appear here."
                                                : "Enable trial classes so students can book a free session with you."
                                            }
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {trials.map(trial => (
                                            <div key={trial.id} className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <p className="font-semibold text-gray-900">{trial.student?.name || "Student"}</p>
                                                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                                                                trial.status === "PENDING" ? "bg-amber-50 text-amber-700 border border-amber-100" :
                                                                trial.status === "CONFIRMED" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" :
                                                                trial.status === "COMPLETED" ? "bg-blue-50 text-blue-700 border border-blue-100" :
                                                                "bg-gray-100 text-gray-500"
                                                            }`}>
                                                                {trial.status === "PENDING" ? "Waiting for your response" :
                                                                 trial.status === "CONFIRMED" ? "Confirmed" :
                                                                 trial.status === "COMPLETED" ? "Completed" :
                                                                 trial.status === "DECLINED" ? "Declined" : "Cancelled"}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-gray-600">Subject: <span className="font-medium">{trial.subject}</span></p>
                                                        <p className="text-sm text-gray-500">Preferred time: {trial.preferredTime}</p>
                                                        {trial.message && <p className="text-sm text-gray-400 italic">&ldquo;{trial.message}&rdquo;</p>}
                                                    </div>
                                                    <div className="text-right shrink-0">
                                                        <p className="text-xs text-gray-400">{new Date(trial.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</p>
                                                        <p className="text-xs text-emerald-600 font-medium">{trial.duration} min · Free</p>
                                                    </div>
                                                </div>

                                                {trial.status === "PENDING" && (
                                                    <div className="flex items-center gap-2 pt-1 border-t border-gray-100">
                                                        <button
                                                            disabled={trialActionLoading === trial.id}
                                                            onClick={() => handleTrialAction(trial.id, "CONFIRMED")}
                                                            className="flex-1 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5"
                                                        >
                                                            {trialActionLoading === trial.id ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                                                            Accept
                                                        </button>
                                                        <button
                                                            disabled={trialActionLoading === trial.id}
                                                            onClick={() => handleTrialAction(trial.id, "DECLINED")}
                                                            className="flex-1 py-2 border border-gray-200 text-gray-600 text-sm font-semibold rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                                                        >
                                                            Decline
                                                        </button>
                                                    </div>
                                                )}
                                                {trial.status === "CONFIRMED" && (
                                                    <div className="flex items-center gap-2 pt-1 border-t border-gray-100">
                                                        <button
                                                            disabled={trialActionLoading === trial.id}
                                                            onClick={() => handleTrialAction(trial.id, "COMPLETED")}
                                                            className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                                                        >
                                                            Mark as Done
                                                        </button>
                                                        <p className="text-xs text-gray-400">Coordinate the exact time with the student via chat.</p>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === "BILLING" && <BillingModule userData={tutorData} transactions={transactions} />}
                        {activeTab === "SETTINGS" && <SettingsModule userData={tutorData} onUpdate={fetchTutorData} />}
                    </div>
                </main>
            </div>
        </div>
    );
}

export default function Dashboard() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen bg-gray-50 font-sans">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 size={32} className="animate-spin text-blue-600" />
                    <p className="text-sm text-gray-400">Loading dashboard...</p>
                </div>
            </div>
        }>
            <DashboardContent />
        </Suspense>
    );
}
