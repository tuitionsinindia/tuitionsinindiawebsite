"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Script from "next/script";
import Link from "next/link";

function DashboardContent() {
    const searchParams = useSearchParams();
    const [tutorId, setTutorId] = useState(searchParams.get("tutorId") || "");
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tutorData, setTutorData] = useState(null);
    const [viewMode, setViewMode] = useState("list");
    const [filters, setFilters] = useState({
        subject: "",
        location: "",
        minBudget: ""
    });

    useEffect(() => {
        if (tutorId) {
            fetchLeads();
            fetchTutorData();
        }
    }, [tutorId, filters]);

    const fetchLeads = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({ tutorId });
            if (filters.subject) params.append("subject", filters.subject);
            if (filters.location) params.append("location", filters.location);
            if (filters.minBudget) params.append("minBudget", filters.minBudget);

            const res = await fetch(`/api/lead/list?${params.toString()}`);
            const data = await res.json();
            setLeads(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchTutorData = async () => {
        try {
            const res = await fetch(`/api/user/info?id=${tutorId}`);
            if (res.ok) {
                const data = await res.json();
                setTutorData(data);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleUnlock = async (leadId) => {
        if (!confirm("Unlock this lead for 1 credit?")) return;

        try {
            const res = await fetch("/api/lead/unlock", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ leadId, tutorId }),
            });

            if (res.ok) {
                alert("Lead unlocked successfully!");
                fetchLeads();
                fetchTutorData();
            } else {
                const err = await res.json();
                alert(err.error || "Failed to unlock lead.");
            }
        } catch (err) {
            console.error(err);
            alert("Error unlocking lead.");
        }
    };

    const makePayment = async () => {
        const creditsToAdd = 10;
        const amount = 500; // ₹500 for 10 credits

        try {
            const res = await fetch("/api/payment/order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    amount,
                    currency: "INR",
                    receipt: `receipt_${tutorId}`,
                    userId: tutorId,
                    description: `Purchase ${creditsToAdd} Credits`
                }),
            });
            const order = await res.json();

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_mock_id",
                amount: order.amount,
                currency: order.currency,
                name: "TuitionsInIndia VIP",
                description: `Purchase ${creditsToAdd} Credits`,
                order_id: order.id,
                handler: async function (response) {
                    const verifyRes = await fetch("/api/payment/verify", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            ...response,
                            tutorId,
                            creditsToAdd,
                        }),
                    });
                    const verifyData = await verifyRes.json();
                    if (verifyData.success) {
                        alert("Payment Successful! Credits added.");
                        fetchTutorData();
                    } else {
                        alert("Payment verification failed.");
                    }
                },
                prefill: {
                    name: tutorData?.name,
                    email: tutorData?.email,
                    contact: tutorData?.phone,
                },
                theme: {
                    color: "#6366f1",
                },
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();
        } catch (err) {
            console.error(err);
            alert("Error initiating payment. Make sure you are using a Tutor ID.");
        }
    };

    if (!tutorId) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-background-dark p-4 font-sans relative">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] opacity-5 bg-cover bg-center"></div>
                <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-white/50 dark:border-slate-800 max-w-md w-full relative z-10 text-center">
                    <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto mb-6">
                        <span className="material-symbols-outlined text-3xl">admin_panel_settings</span>
                    </div>
                    <h2 className="text-2xl font-heading font-bold mb-2">Tutor Access</h2>
                    <p className="text-slate-500 mb-8 text-sm">Please provide your Tutor ID to access the dashboard (Demo Mode).</p>
                    <input
                        type="text"
                        placeholder="Enter Tutor ID"
                        className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-4 mb-4 focus:ring-2 focus:ring-primary outline-none"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                setTutorId(e.target.value);
                            }
                        }}
                        id="tutorInput"
                    />
                    <button
                        className="w-full bg-primary text-white font-bold py-4 rounded-xl hover:bg-primary-glow shadow-lg transition-all"
                        onClick={() => {
                            const id = document.getElementById('tutorInput').value;
                            setTutorId(id);
                        }}>
                        Access Dashboard
                    </button>
                    <Link href="/" className="inline-block mt-6 text-sm font-semibold text-slate-400 hover:text-primary transition-colors">Return to Home</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="relative flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100">
            <Script src="https://checkout.razorpay.com/v1/checkout.js" />

            {/* Top Navigation Bar */}
            <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl px-6 md:px-12 py-3 flex items-center justify-between shadow-2xl">
                <Link href="/" className="flex items-center gap-4 group transition-transform hover:scale-[1.02]">
                    <div className="shrink-0 bg-white p-1 rounded-xl shadow-inner">
                        <img src="/logo_horizontal.png" alt="Tuitions In India" className="h-14 w-auto object-contain" />
                    </div>
                </Link>
                <div className="flex items-center gap-6">
                    <button className="size-10 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-primary hover:bg-white dark:hover:bg-slate-700 transition-all flex items-center justify-center shadow-sm">
                        <span className="material-symbols-outlined text-[20px]">notifications</span>
                    </button>
                    <div className="flex items-center gap-4 pl-6 border-l border-slate-200 dark:border-slate-800">
                        <div className="text-right hidden sm:block">
                            <p className="text-[13px] font-black font-heading tracking-wide uppercase">{tutorData?.name || "Tutor"}</p>
                            <div className="flex items-center justify-end gap-3 mt-0.5">
                                <span className="text-[9px] font-black uppercase tracking-[0.2em] bg-primary/10 text-primary px-2 py-0.5 rounded-full border border-primary/20">
                                    {tutorData?.subscriptionTier || "FREE"}
                                </span>
                                <p className="text-[11px] text-emerald-600 font-bold tracking-tight">{tutorData?.credits || 0} Credits</p>
                            </div>
                        </div>
                        <div className="h-12 w-12 rounded-[1.25rem] bg-gradient-to-br from-primary to-accent border-2 border-white dark:border-slate-800 flex items-center justify-center text-white font-black text-lg shadow-xl shadow-primary/20">
                            {(tutorData?.name || "T")[0].toUpperCase()}
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar Navigation */}
                <aside className="hidden lg:flex w-72 flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 gap-3 h-[calc(100vh-73px)] sticky top-[73px]">
                    <div className="flex items-center gap-4 p-5 mb-8 glass-premium rounded-[2rem] border border-white/50 dark:border-slate-800 shadow-xl shadow-primary/5">
                        <div className="relative">
                            <div className="size-14 rounded-2xl border-2 border-primary/20 bg-primary/5 flex items-center justify-center shadow-inner">
                                <span className="material-symbols-outlined text-primary text-[28px]">account_box</span>
                            </div>
                            {tutorData?.isVerified && (
                                <div className="absolute -bottom-1 -right-1 size-6 bg-emerald-500 rounded-xl border-2 border-white dark:border-slate-900 flex items-center justify-center text-white shadow-lg">
                                    <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>verified</span>
                                </div>
                            )}
                        </div>
                        <div className="overflow-hidden">
                            <p className="font-heading font-black truncate text-sm tracking-wide">{tutorData?.name || "Elite Tutor"}</p>
                            <p className="text-[10px] uppercase font-black tracking-widest text-slate-400 mt-0.5">{tutorData?.isVerified ? "Certified Expert" : "Verification Pending"}</p>
                        </div>
                    </div>

                    <nav className="space-y-3">
                        <Link href={`/dashboard/tutor?tutorId=${tutorId}`} className="flex items-center gap-4 px-5 py-4 bg-primary text-white rounded-[1.5rem] font-black transition-all shadow-xl shadow-primary/30 font-heading tracking-wide">
                            <span className="material-symbols-outlined text-[22px]">grid_view</span>
                            <span className="text-xs uppercase tracking-[0.2em]">Command Center</span>
                        </Link>
                        <Link href={`/dashboard/tutor/students?tutorId=${tutorId}`} className="group flex items-center gap-4 px-5 py-4 text-slate-500 font-black hover:text-primary hover:bg-primary/5 rounded-[1.5rem] transition-all font-heading tracking-wide border border-transparent hover:border-primary/10">
                            <span className="material-symbols-outlined text-[22px] text-slate-400 group-hover:text-primary">group</span>
                            <span className="text-xs uppercase tracking-[0.2em]">Managed Students</span>
                        </Link>
                        <Link href={`/dashboard/tutor/earnings?tutorId=${tutorId}`} className="group flex items-center gap-4 px-5 py-4 text-slate-500 font-black hover:text-primary hover:bg-primary/5 rounded-[1.5rem] transition-all font-heading tracking-wide border border-transparent hover:border-primary/10">
                            <span className="material-symbols-outlined text-[22px] text-slate-400 group-hover:text-primary">monetization_on</span>
                            <span className="text-xs uppercase tracking-[0.2em]">Revenue & Growth</span>
                        </Link>
                        <Link href={`/dashboard/tutor/analytics?tutorId=${tutorId}`} className="group flex items-center gap-4 px-5 py-4 text-slate-500 font-black hover:text-primary hover:bg-primary/5 rounded-[1.5rem] transition-all font-heading tracking-wide border border-transparent hover:border-primary/10">
                            <span className="material-symbols-outlined text-[22px] text-slate-400 group-hover:text-primary">query_stats</span>
                            <span className="text-xs uppercase tracking-[0.2em]">Performance Insights</span>
                        </Link>
                    </nav>

                    <div className="mt-auto glass-premium p-6 rounded-[2.25rem] relative overflow-hidden shadow-2xl border border-white/20">
                        <div className="absolute -right-6 -top-6 size-24 bg-primary/10 rounded-full blur-2xl"></div>
                        <h4 className="font-heading font-black mb-1 relative z-10 text-primary uppercase text-[10px] tracking-[0.3em]">Institutional Access</h4>
                        <p className="text-[11px] text-slate-500 mb-5 relative z-10 font-medium">Unlock priority placement & unlimited verified leads.</p>
                        <Link href={`/dashboard/subscription?tutorId=${tutorId}`} className="w-full btn-primary py-3 rounded-2xl text-[10px] tracking-[0.2em] relative z-10 flex items-center justify-center gap-2 shadow-xl shadow-primary/20">
                            GO ELITE
                            <span className="material-symbols-outlined text-sm">bolt</span>
                        </Link>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto p-6 md:p-12 lg:p-16 relative bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.03),transparent_40%)]">
                    {/* Header Section */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12 relative z-10">
                        <div>
                            <h1 className="text-3xl md:text-5xl font-heading font-black tracking-tight text-slate-900 dark:text-white leading-tight">
                                Intelligence <span className="text-primary">Hub</span>
                            </h1>
                            <p className="text-slate-400 mt-3 font-medium text-lg italic">Welcome back, {tutorData?.name?.split(' ')[0] || "Educator"}</p>
                        </div>
                        <div className="flex gap-4 items-center">
                            <button onClick={fetchLeads} className="size-14 text-slate-400 border border-slate-200 bg-white rounded-2xl hover:text-primary hover:border-primary/20 transition-all shadow-sm flex items-center justify-center group active:scale-90">
                                <span className="material-symbols-outlined text-[24px] group-active:rotate-180 transition-transform">refresh</span>
                            </button>
                            <button onClick={makePayment} className="btn-primary flex items-center gap-3 px-8 py-4 shadow-2xl shadow-primary/20">
                                <span className="material-symbols-outlined text-[20px]">bolt</span>
                                REPLENISH CREDITS
                            </button>
                        </div>
                    </div>

                    {/* Metrics Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 relative z-10">
                        <div className="glass-premium p-8 rounded-[2.5rem] border border-white/50 dark:border-slate-800 shadow-2xl shadow-slate-200/40 dark:shadow-none hover:-translate-y-2 transition-all group">
                            <div className="flex items-center justify-between mb-6">
                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Liquidity</p>
                                <div className="size-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all shadow-inner">
                                    <span className="material-symbols-outlined text-[22px]">toll</span>
                                </div>
                            </div>
                            <p className="text-4xl font-heading font-black text-slate-900 dark:text-white tracking-tighter">{tutorData?.credits || 0}</p>
                            <div className="mt-3 text-[11px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                                <span className="size-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                READY ASSETS
                            </div>
                        </div>
                        <div className="glass-premium p-8 rounded-[2.5rem] border border-white/50 dark:border-slate-800 shadow-2xl shadow-slate-200/40 dark:shadow-none hover:-translate-y-2 transition-all group">
                            <div className="flex items-center justify-between mb-6">
                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Visibility</p>
                                <div className="size-12 rounded-2xl bg-accent/10 text-accent flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-all shadow-inner">
                                    <span className="material-symbols-outlined text-[22px]">visibility</span>
                                </div>
                            </div>
                            <p className="text-4xl font-heading font-black text-slate-900 dark:text-white tracking-tighter">1,204</p>
                            <div className="mt-3 text-[11px] font-black text-accent uppercase tracking-widest flex items-center gap-2">
                                <span className="material-symbols-outlined text-[14px]">trending_up</span>
                                +12% GROWTH
                            </div>
                        </div>
                        <div className="glass-premium p-8 rounded-[2.5rem] border border-white/50 dark:border-slate-800 shadow-2xl shadow-slate-200/40 dark:shadow-none hover:-translate-y-2 transition-all group">
                            <div className="flex items-center justify-between mb-6">
                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Conversions</p>
                                <div className="size-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-all shadow-inner">
                                    <span className="material-symbols-outlined text-[22px]">key</span>
                                </div>
                            </div>
                            <p className="text-4xl font-heading font-black text-slate-900 dark:text-white tracking-tighter">18</p>
                            <div className="mt-3 text-[11px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                                <span className="material-symbols-outlined text-[14px]">bolt</span>
                                ELITE CONNECTIONS
                            </div>
                        </div>
                        <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-[0_20px_50px_-15px_rgba(0,0,0,0.5)] hover:-translate-y-2 transition-all relative overflow-hidden group">
                            <div className="absolute -right-6 -bottom-6 size-32 bg-primary/20 rounded-full blur-3xl group-hover:bg-primary/30 transition-all"></div>
                            <div className="flex items-center justify-between mb-6">
                                <p className="text-[10px] text-white/40 font-black uppercase tracking-[0.2em]">Tier Status</p>
                                <div className="size-12 rounded-2xl bg-white/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                                    <span className="material-symbols-outlined text-[22px]">workspace_premium</span>
                                </div>
                            </div>
                            <p className="text-2xl font-heading font-black text-white uppercase tracking-wider">{tutorData?.subscriptionTier || "FREE"}</p>
                            <div className="mt-4">
                                <Link href="/pricing" className="text-[10px] font-black text-primary uppercase tracking-[0.2em] border-b border-primary/30 hover:border-primary transition-all">
                                    {tutorData?.subscriptionTier === 'FREE' ? "Upgrade for Elite Badge" : "View Premium Perks"}
                                </Link>
                            </div>
                        </div>
                    </div>                    {/* Trust & Verification Center */}
                    <div className="mb-12 bg-slate-900 rounded-[3rem] p-10 md:p-14 shadow-3xl relative overflow-hidden group border border-white/5">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none"></div>
                        <div className="absolute -right-20 -bottom-20 p-8 opacity-5 group-hover:scale-110 transition-transform duration-1000">
                            <span className="material-symbols-outlined text-[300px] text-white">verified</span>
                        </div>
                        <div className="relative z-10 max-w-3xl">
                            <h2 className="text-3xl md:text-4xl font-heading font-black text-white mb-4 flex items-center gap-5">
                                <div className="size-14 rounded-2xl bg-primary/20 flex items-center justify-center text-primary shadow-2xl">
                                    <span className="material-symbols-outlined text-[32px]">verified</span>
                                </div>
                                Verification Center
                            </h2>
                            <p className="text-slate-400 mb-10 text-lg font-medium italic">"Maximize your pedagogical impact. Verified educators receive elite listing priority and 3x engagement rates."</p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="bg-white/5 backdrop-blur-xl p-8 rounded-[2rem] flex items-center justify-between border border-white/10 group/item hover:bg-white/10 transition-all">
                                    <div className="flex items-center gap-5">
                                        <div className={`size-14 rounded-2xl flex items-center justify-center shadow-2xl ${tutorData?.phone ? 'bg-emerald-500 text-white shadow-emerald-500/20' : 'bg-slate-700 text-slate-400'}`}>
                                            <span className="material-symbols-outlined text-[24px]">{tutorData?.phone ? 'check' : 'phone_iphone'}</span>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Contact Authentication</p>
                                            <p className="text-sm font-black text-white tracking-wide mt-1">{tutorData?.phone ? 'Verified Secure' : 'Action Required'}</p>
                                        </div>
                                    </div>
                                    {!tutorData?.phone && (
                                        <button className="text-[10px] font-black uppercase text-primary hover:text-white transition-colors tracking-widest border-b border-primary/30">VERIFY</button>
                                    )}
                                </div>
                                <div className="bg-white/5 backdrop-blur-xl p-8 rounded-[2rem] flex items-center justify-wrap border border-white/10 group/item hover:bg-white/10 transition-all justify-between">
                                    <div className="flex items-center gap-5">
                                        <div className={`size-14 rounded-2xl flex items-center justify-center shadow-2xl ${tutorData?.isIdVerified ? 'bg-emerald-500 text-white shadow-emerald-500/20' : 'bg-slate-700 text-slate-400'}`}>
                                            <span className="material-symbols-outlined text-[24px]">{tutorData?.isIdVerified ? 'check' : 'fingerprint'}</span>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Identity Clearance</p>
                                            <p className="text-sm font-black text-white tracking-wide mt-1">{tutorData?.isIdVerified ? 'Identity Cleared' : 'Pending Upload'}</p>
                                        </div>
                                    </div>
                                    {!tutorData?.isIdVerified && (
                                        <button className="text-[10px] font-black uppercase text-primary hover:text-white transition-colors tracking-widest border-b border-primary/30">SUBMIT</button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Leads Section */}
                    <div className="bg-white dark:bg-slate-900/80 backdrop-blur-xl rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-3xl overflow-hidden relative z-10">
                        <div className="p-10 md:p-12 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between flex-wrap gap-6">
                            <div>
                                <h2 className="text-2xl font-heading font-black tracking-tight">Active Requirement Pipeline</h2>
                                <p className="text-sm text-slate-400 mt-2 font-medium tracking-wide">Real-time learning requests synchronized to your expertise.</p>
                            </div>
                            <div className="flex items-center gap-4 flex-wrap">
                                <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl shadow-inner">
                                    <button
                                        onClick={() => setViewMode("list")}
                                        className={`px-6 py-2.5 text-[11px] font-black uppercase tracking-widest rounded-xl transition-all ${viewMode === 'list' ? "bg-white dark:bg-slate-700 shadow-lg text-primary" : "text-slate-400 hover:text-slate-600"}`}
                                    >
                                        List Flow
                                    </button>
                                    <button
                                        onClick={() => setViewMode("map")}
                                        className={`px-6 py-2.5 text-[11px] font-black uppercase tracking-widest rounded-xl transition-all ${viewMode === 'map' ? "bg-white dark:bg-slate-700 shadow-lg text-primary" : "text-slate-400 hover:text-slate-600"}`}
                                    >
                                        Spatial Map
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Search & Filters */}
                        <div className="px-10 md:px-12 py-6 bg-slate-50/30 dark:bg-slate-800/20 border-b border-slate-100 dark:border-slate-800 flex flex-wrap gap-6 items-center">
                            <div className="relative flex-1 min-w-[250px] group">
                                <span className="absolute left-5 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-[20px] group-focus-within:text-primary transition-colors">book_2</span>
                                <input
                                    type="text"
                                    placeholder="Filter by Subject..."
                                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl pl-14 pr-6 py-3.5 text-xs font-bold outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all shadow-sm"
                                    value={filters.subject}
                                    onChange={(e) => setFilters(prev => ({ ...prev, subject: e.target.value }))}
                                />
                            </div>
                            <div className="relative flex-1 min-w-[250px] group">
                                <span className="absolute left-5 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-[20px] group-focus-within:text-primary transition-colors">distance</span>
                                <input
                                    type="text"
                                    placeholder="Filter by Area..."
                                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl pl-14 pr-6 py-3.5 text-xs font-bold outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all shadow-sm"
                                    value={filters.location}
                                    onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                                />
                            </div>
                            <div className="relative w-48 group">
                                <span className="absolute left-5 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-[20px] group-focus-within:text-primary transition-colors">payments</span>
                                <input
                                    type="text"
                                    placeholder="Min Budget"
                                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl pl-14 pr-6 py-3.5 text-xs font-bold outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all shadow-sm"
                                    value={filters.minBudget}
                                    onChange={(e) => setFilters(prev => ({ ...prev, minBudget: e.target.value }))}
                                />
                            </div>
                        </div>

                        <div className="p-10 md:p-12">
                            {loading ? (
                                <div className="text-center py-24">
                                    <div className="size-20 rounded-[2.5rem] bg-slate-50 dark:bg-slate-800 flex items-center justify-center mx-auto mb-6 shadow-2xl animate-pulse">
                                        <span className="material-symbols-outlined text-primary text-[40px] animate-spin">sync</span>
                                    </div>
                                    <p className="font-heading font-black text-slate-400 uppercase tracking-[0.4em] text-[10px]">Synchronizing Pipeline...</p>
                                </div>
                            ) : viewMode === "map" ? (
                                <MapComponent tutors={leads.map(l => ({ id: l.id, name: l.student.name, location: l.location }))} />
                            ) : leads.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                                    {leads.map((lead) => (
                                        <div key={lead.id} className={`rounded-[3rem] border transition-all duration-700 hover:-translate-y-3 hover:shadow-4xl p-8 md:p-12 relative overflow-hidden group/card ${lead.isUnlocked ? "bg-primary/[0.02] border-primary/20" : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800"}`}>
                                            
                                            <div className="flex justify-between items-start mb-8">
                                                <div className="flex flex-col gap-2">
                                                    <div className={`w-fit px-5 py-2 text-[10px] font-black uppercase tracking-[0.2em] rounded-full shadow-sm ${lead.isUnlocked ? 'bg-primary text-white' : 'bg-slate-900 text-white'}`}>
                                                        {lead.subject}
                                                    </div>
                                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 italic">
                                                        Posted {new Date(lead.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric'})}
                                                    </span>
                                                </div>
                                                {lead.isUnlocked && (
                                                    <div className="size-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xl shadow-emerald-500/20 pulse-gentle">
                                                        <span className="material-symbols-outlined text-[20px]">verified_user</span>
                                                    </div>
                                                )}
                                            </div>

                                            <h3 className="text-2xl md:text-3xl font-heading font-black mb-6 leading-[1.15] group-hover/card:text-primary transition-colors tracking-tight italic">"{lead.description.length > 80 ? lead.description.substring(0, 80) + '...' : lead.description}"</h3>

                                            <div className="flex flex-wrap items-center gap-4 mb-10">
                                                <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/50 px-5 py-2.5 rounded-2xl border border-slate-100 dark:border-slate-800 group/info">
                                                    <span className="material-symbols-outlined text-[18px] text-primary group-hover/info:scale-110 transition-transform">distance</span>
                                                    <span className="text-[11px] font-black text-slate-500 uppercase tracking-wide">{lead.location}</span>
                                                </div>
                                                <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/50 px-5 py-2.5 rounded-2xl border border-slate-100 dark:border-slate-800 group/info">
                                                    <span className="material-symbols-outlined text-[18px] text-emerald-500 group-hover/info:scale-110 transition-transform">payments</span>
                                                    <span className="text-[11px] font-black text-slate-500 uppercase tracking-wide">{lead.budget || "Negotiable"}</span>
                                                </div>
                                            </div>

                                            {lead.isUnlocked ? (
                                                <div className="bg-slate-50/50 dark:bg-slate-800/50 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800 relative z-10 animate-premium-fade">
                                                    <div className="flex items-center gap-6 mb-8">
                                                        <div className="size-16 rounded-[1.5rem] bg-slate-900 flex flex-col items-center justify-center text-white font-black text-2xl font-heading shadow-2xl">
                                                            {lead.student.name[0]}
                                                        </div>
                                                        <div>
                                                            <p className="font-heading font-black text-xl tracking-tight uppercase">{lead.student.name}</p>
                                                            <div className="flex items-center gap-2 mt-1">
                                                                <span className="size-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                                                <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] italic">Direct Access Granted</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-1 gap-4 mb-8">
                                                        <a href={`tel:${lead.student.phone}`} className="flex items-center justify-between p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700 hover:border-primary/30 transition-all group/link shadow-sm">
                                                            <div className="flex items-center gap-4">
                                                                <div className="size-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover/link:text-primary transition-colors">
                                                                    <span className="material-symbols-outlined text-[20px]">phone_enabled</span>
                                                                </div>
                                                                <span className="text-sm font-black tracking-widest">{lead.student.phone}</span>
                                                            </div>
                                                            <span className="material-symbols-outlined text-slate-300 text-[18px] group-hover/link:translate-x-1 transition-transform">arrow_forward</span>
                                                        </a>
                                                    </div>
                                                    <div className="flex gap-4">
                                                        <button className="flex-1 btn-primary py-5 rounded-[1.5rem] text-[10px] tracking-[0.3em] flex items-center justify-center gap-3">
                                                            INVITATION SENT
                                                            <span className="material-symbols-outlined text-sm">done_all</span>
                                                        </button>
                                                        <Link href={`/dashboard/tutor/students?tutorId=${tutorId}&activeChat=${lead.studentId}`} className="size-14 bg-slate-900 text-white rounded-[1.5rem] hover:bg-slate-800 transition-all flex items-center justify-center shadow-xl">
                                                            <span className="material-symbols-outlined text-[22px]">chat_bubble</span>
                                                        </Link>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="space-y-6">
                                                    <div className="flex items-center justify-between px-2">
                                                        <div className="flex -space-x-3">
                                                            {[1, 2, 3].map(i => (
                                                                <div key={i} className="size-10 rounded-full border-4 border-white dark:border-slate-900 bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                                                    <span className="material-symbols-outlined text-slate-300 text-[16px]">person</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.25em] italic">{lead.unlockCount}/{lead.maxUnlocks} EDUCATORS SHORTLISTED</p>
                                                    </div>
                                                    <button
                                                        className={`w-full font-black py-6 rounded-[2rem] transition-all flex items-center justify-center gap-4 group text-[11px] tracking-[0.3em] shadow-2xl active:scale-[0.98] ${lead.premiumTier > 0 ? 'bg-gradient-to-r from-amber-400 to-amber-600 text-white' : 'bg-slate-900 text-white hover:bg-primary shadow-primary/20'}`}
                                                        onClick={() => handleUnlock(lead.id)}>
                                                        <span className="material-symbols-outlined group-hover:rotate-12 transition-transform">verified_user</span>
                                                        ACQUIRE LEAD ({lead.premiumTier === 2 ? '3 CREDITS' : lead.premiumTier === 1 ? '2 CREDITS' : '1 CREDIT'})
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-20 bg-slate-50/50 dark:bg-slate-800/30 rounded-[3rem] border border-dashed border-slate-200 dark:border-slate-800">
                                    <div className="size-24 rounded-[2.5rem] bg-white dark:bg-slate-900 flex items-center justify-center mx-auto mb-8 shadow-2xl">
                                        <span className="material-symbols-outlined text-slate-300 text-[48px]">auto_stories</span>
                                    </div>
                                    <h3 className="text-2xl font-heading font-black tracking-tight mb-3">Quiet Period</h3>
                                    <p className="text-slate-400 max-w-sm mx-auto text-sm font-medium italic">"The best educators stay prepared. New requirements in your subjects will appear here as soon as they are validated."</p>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default function Dashboard() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen bg-background-light dark:bg-background-dark">
                <div className="flex flex-col items-center">
                    <span className="material-symbols-outlined text-5xl text-primary animate-spin">sync</span>
                    <p className="mt-4 font-heading font-bold text-slate-500">Loading Dashboard...</p>
                </div>
            </div>
        }>
            <DashboardContent />
        </Suspense>
    );
}
