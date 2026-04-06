"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Script from "next/script";
import Link from "next/link";
import { 
    LayoutDashboard, 
    Search, 
    Wallet, 
    TrendingUp, 
    Settings, 
    RefreshCcw, 
    Zap, 
    Lock, 
    Unlock, 
    ArrowRight, 
    GraduationCap, 
    MapPin, 
    Phone, 
    Mail, 
    MessageCircle, 
    CheckCircle2, 
    Clock, 
    ShieldCheck, 
    User, 
    Star, 
    Target, 
    Award,
    Radar
} from "lucide-react";

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
        const amount = 500; 

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
                    color: "#0066FF",
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
            <div className="flex items-center justify-center min-h-screen bg-background-dark p-4 font-sans relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[600px] bg-primary/10 rounded-full blur-[120px] -z-10 animate-pulse"></div>
                <div className="bg-surface-dark/40 backdrop-blur-3xl p-10 rounded-[2.5rem] shadow-2xl border border-border-dark max-w-md w-full relative z-10 text-center">
                    <div className="size-20 rounded-3xl bg-primary/10 flex items-center justify-center text-primary mx-auto mb-8 border border-primary/20">
                        <GraduationCap size={40} strokeWidth={1.5} />
                    </div>
                    <h2 className="text-3xl font-black text-white mb-3 tracking-tighter uppercase italic">Faculty Terminal.</h2>
                    <p className="text-on-surface-dark/40 mb-10 text-[11px] font-black uppercase tracking-widest leading-relaxed">Identity verification required to access the strategic discovery pipeline.</p>
                    <input
                        type="text"
                        placeholder="ENTER TUTOR PROTOCOL ID"
                        className="w-full bg-background-dark/50 border border-border-dark rounded-2xl p-5 text-white font-black text-xs uppercase tracking-widest focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-white/10 mb-6"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                setTutorId(e.target.value);
                            }
                        }}
                        id="tutorInput"
                    />
                    <button
                        className="group w-full bg-primary text-white font-black py-5 rounded-2xl hover:bg-primary/90 shadow-2xl shadow-primary/20 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-xs active:scale-95"
                        onClick={() => {
                            const id = document.getElementById('tutorInput').value;
                            setTutorId(id);
                        }}>
                        AUTHORIZE DISCOVERY <ArrowRight size={16} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                    <Link href="/" className="inline-block mt-8 text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-dark/20 hover:text-primary transition-colors italic border-b border-transparent hover:border-primary pb-1">Bypass Security</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="relative flex min-h-screen flex-col bg-background-dark font-sans text-on-background-dark antialiased selection:bg-primary/20 selection:text-primary">
            <Script src="https://checkout.razorpay.com/v1/checkout.js" />

            {/* Premium Stitch Header */}
            <header className="sticky top-0 z-[60] w-full border-b border-border-dark bg-background-dark/80 backdrop-blur-2xl px-6 md:px-12 py-5 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="size-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
                        <GraduationCap size={20} strokeWidth={2.5} />
                    </div>
                    <div className="flex flex-col leading-none">
                        <span className="text-lg font-black tracking-tighter text-white uppercase italic">tuitionsinindia</span>
                        <span className="text-[10px] font-black text-primary/40 tracking-[0.4em] uppercase">Intelligence Terminal</span>
                    </div>
                </Link>

                <div className="flex items-center gap-4 md:gap-8">
                    <div className="hidden sm:flex items-center gap-4 px-6 py-3 bg-surface-dark border border-border-dark rounded-2xl hover:border-primary/30 transition-colors group cursor-default">
                        <div className="text-right">
                            <p className="text-[9px] font-black uppercase tracking-widest text-on-surface-dark/30 leading-none mb-1">Asset Value</p>
                            <p className="text-sm font-black text-primary leading-none tracking-tighter uppercase italic">{tutorData?.credits || 0} <span className="opacity-40 not-italic">RETAINED</span></p>
                        </div>
                        <button onClick={makePayment} className="size-9 rounded-xl bg-primary text-white flex items-center justify-center hover:bg-primary/90 transition-all shadow-lg active:scale-90 group-hover:scale-110">
                            <Zap size={16} fill="currentColor" />
                        </button>
                    </div>

                    <div className="flex items-center gap-4 pl-6 border-l border-border-dark">
                        <div className="flex flex-col text-right hidden lg:block leading-none">
                            <span className="text-[10px] font-black text-white uppercase tracking-widest">{tutorData?.name || "AUTHENTICATED"}</span>
                            <span className="text-[9px] font-medium text-emerald-500 uppercase tracking-widest mt-1 italic">Verified Faculty</span>
                        </div>
                        <div className="size-12 rounded-2xl bg-gradient-to-tr from-primary to-blue-800 border border-white/10 shadow-2xl flex items-center justify-center text-white font-black text-lg italic tracking-tighter">
                            {(tutorData?.name || "T")[0].toUpperCase()}
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex flex-1">
                {/* Fixed Strategy Sidebar */}
                <aside className="fixed left-0 top-[85px] bottom-0 w-80 bg-surface-dark/20 backdrop-blur-3xl border-r border-border-dark p-10 hidden xl:flex flex-col">
                    <div className="mb-12">
                        <h4 className="text-[10px] font-black text-on-surface-dark/20 uppercase tracking-[0.4em] mb-8 italic">Strategic Operation</h4>
                        <nav className="space-y-3">
                            <Link href="#" className="flex items-center gap-4 px-6 py-5 bg-primary text-white rounded-2xl font-black text-[11px] tracking-widest shadow-xl shadow-primary/20 transition-all group active:scale-95">
                                <LayoutDashboard size={18} strokeWidth={2.5} />
                                INTELLIGENCE HUB
                                <ArrowRight size={14} strokeWidth={3} className="ml-auto opacity-40 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            {[
                                { icon: Radar, label: "LIVE PIPELINE" },
                                { icon: Wallet, label: "ASSET REVENUE" },
                                { icon: TrendingUp, label: "PERFORMANCE" },
                                { icon: Settings, label: "CONTROL CENTER", href: `/dashboard/tutor/profile?tutorId=${tutorId}` }
                            ].map((item, i) => (
                                <Link key={i} href={item.href || "#"} className="flex items-center gap-4 px-6 py-5 text-on-surface-dark/40 hover:bg-surface-dark hover:text-primary rounded-2xl font-black text-[11px] tracking-widest transition-all hover:translate-x-1 border border-transparent hover:border-border-dark">
                                    <item.icon size={18} strokeWidth={2.5} className="opacity-40" />
                                    {item.label}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    <div className="mt-auto p-8 rounded-[3rem] bg-surface-dark border border-border-dark text-on-surface-dark relative overflow-hidden group">
                        <div className="absolute top-0 right-0 size-32 bg-primary/10 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-primary/20 transition-colors"></div>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-4 italic">Elite Membership</h4>
                        <p className="text-xs font-black text-white/40 leading-relaxed mb-8 uppercase tracking-widest leading-loose">Scale your academic authority with priority lead discovery.</p>
                        <button className="w-full bg-white text-black py-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-xl active:scale-95 leading-none">
                            UPGRADE PROTOCOL
                        </button>
                    </div>
                </aside>

                {/* Intelligence Workspace */}
                <main className="flex-1 xl:pl-80 p-6 md:p-12 lg:p-16">
                    <div className="max-w-7xl mx-auto">
                        {/* High-Impact Hero */}
                        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 mb-24">
                            <div className="max-w-2xl relative">
                                <div className="absolute -left-12 top-0 text-[180px] font-black text-white/5 leading-none tracking-tighter italic select-none pointer-events-none uppercase">CORE</div>
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/5 rounded-full border border-primary/10 mb-8 relative z-10">
                                    <span className="size-2 rounded-full bg-primary animate-pulse"></span>
                                    <span className="text-[10px] font-black text-primary uppercase tracking-widest">Protocol: High Affinity Discovery Stream</span>
                                </div>
                                <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 uppercase italic leading-[0.85] relative z-10 text-white">
                                    Intelligence <span className="text-primary underline decoration-primary/20 decoration-8 underline-offset-8">Output.</span>
                                </h1>
                                <p className="text-xl text-on-surface-dark/60 font-medium leading-relaxed max-w-xl relative z-10">
                                    Welcome back, <span className="text-white font-black italic">{tutorData?.name || "Faculty Member"}</span>. Your discovery pipeline has been refreshed with {leads.length} active academic mandates.
                                </p>
                            </div>
                            <div className="flex gap-4 relative z-10">
                                <button onClick={fetchLeads} className="group relative flex items-center gap-4 px-10 py-6 bg-surface-dark/40 backdrop-blur-md border border-border-dark rounded-2xl font-black text-[11px] tracking-widest shadow-sm hover:shadow-2xl transition-all active:scale-95 uppercase leading-none overflow-hidden">
                                   <RefreshCcw size={18} strokeWidth={3} className="group-hover:rotate-180 transition-transform duration-700 text-primary" />
                                   SYNC STREAM
                                </button>
                            </div>
                        </div>

                        {/* Performance Bento Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
                            {[
                                { label: "Available Assets", val: tutorData?.credits || 0, icon: Wallet, theme: "text-primary" },
                                { label: "Discovery Index", val: "1.4k", icon: Radar, theme: "text-blue-500" },
                                { label: "Trust Score", val: "98.2", icon: ShieldCheck, theme: "text-emerald-500" },
                                { label: "Growth Vector", val: "12%", icon: TrendingUp, theme: "text-amber-500" }
                            ].map((stat, i) => (
                                <div key={i} className="group p-10 rounded-[3rem] bg-surface-dark/40 backdrop-blur-md border border-border-dark border-b-4 hover:border-primary/50 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.1] transition-opacity">
                                        <stat.icon size={80} strokeWidth={1} />
                                    </div>
                                    <div className={`size-16 rounded-3xl bg-background-dark border border-border-dark flex items-center justify-center mb-10 group-hover:scale-110 transition-transform duration-500 shadow-inner ${stat.theme}`}>
                                        <stat.icon size={28} strokeWidth={2} />
                                    </div>
                                    <p className="text-[10px] font-black text-on-surface-dark/30 uppercase tracking-[0.3em] mb-2 italic leading-none">{stat.label}</p>
                                    <p className="text-5xl font-black tracking-tighter text-white uppercase italic leading-none">{stat.val}</p>
                                </div>
                            ))}
                        </div>

                        {/* High-Fidelity Lead Pipeline */}
                        <div className="relative">
                            <div className="flex items-center justify-between mb-12 flex-wrap gap-6">
                                <div>
                                    <div className="inline-flex items-center gap-2 text-primary mb-2">
                                        <div className="size-2 bg-primary rounded-full shadow-[0_0_10px_rgba(37,99,235,0.5)]"></div>
                                        <span className="text-[10px] font-black uppercase tracking-[0.4em]">Optimized Mandate Matches</span>
                                    </div>
                                    <h2 className="text-4xl font-black text-white mb-2 uppercase italic tracking-tighter">Active <span className="text-primary not-italic font-serif font-light lowercase">Pipeline.</span></h2>
                                </div>
                            </div>

                            {loading ? (
                                <div className="py-40 flex flex-col items-center justify-center opacity-50 bg-surface-dark/20 rounded-[4rem] border border-border-dark">
                                    <div className="size-20 rounded-[2rem] border-[8px] border-primary/5 border-t-primary animate-spin mb-10 shadow-2xl"></div>
                                    <p className="font-black text-[11px] uppercase tracking-[0.5em] italic">Calibrating Discovery Stream...</p>
                                </div>
                            ) : leads.length > 0 ? (
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                                    {leads.map((lead) => (
                                        <div key={lead.id} className="group relative bg-surface-dark/40 backdrop-blur-md border border-border-dark rounded-[3.5rem] p-12 hover:shadow-[0_40px_100px_-20px_rgba(37,99,235,0.15)] hover:border-primary/40 transition-all duration-700 overflow-hidden border-b-8">
                                            {/* AI Match Overlay */}
                                            <div className="absolute top-0 right-0 p-10">
                                                <div className="size-24 rounded-full bg-background-dark border border-border-dark flex flex-col items-center justify-center shadow-2xl group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-700 border-b-4">
                                                    <span className="text-[10px] font-black uppercase leading-none mb-1 opacity-40">Match</span>
                                                    <span className="text-2xl font-black font-headline italic leading-none">94%</span>
                                                </div>
                                            </div>

                                            <div className="relative z-10 flex flex-col h-full">
                                                <div className="mb-10 flex flex-wrap gap-3">
                                                    <span className="px-5 py-2 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-widest border border-primary/20 leading-none">
                                                        {lead.subject}
                                                    </span>
                                                    <span className="px-5 py-2 bg-background-dark text-on-surface-dark/40 rounded-full text-[10px] font-black uppercase tracking-widest leading-none border border-border-dark">
                                                        {lead.location}
                                                    </span>
                                                </div>

                                                <h3 className="text-4xl font-black text-white mb-10 leading-[1.05] tracking-tighter group-hover:text-primary transition-colors duration-300 uppercase italic">
                                                    "{lead.description.length > 80 ? lead.description.substring(0, 80) + '...' : lead.description}"
                                                </h3>

                                                <div className="grid grid-cols-2 gap-10 mb-12">
                                                    <div className="flex flex-col">
                                                        <span className="text-[10px] font-black uppercase tracking-widest opacity-20 mb-2 leading-none italic">Asset Budget</span>
                                                        <span className="text-xl font-black text-emerald-500 italic tracking-tighter uppercase leading-none">{lead.budget || "MARKET_RATE"}</span>
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-[10px] font-black uppercase tracking-widest opacity-20 mb-2 leading-none italic">Latency</span>
                                                        <span className="text-xl font-black text-white tracking-widest leading-none">
                                                            {Math.floor((Date.now() - new Date(lead.createdAt)) / (1000 * 60 * 60 * 24))}D_SYNC
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="mt-auto">
                                                    {lead.isUnlocked ? (
                                                        <div className="p-8 bg-background-dark/80 rounded-[2.5rem] border border-border-dark flex flex-col sm:flex-row items-center gap-8 group/unlocked border-b-4 border-emerald-500/20">
                                                            <div className="size-20 rounded-[2rem] bg-gradient-to-br from-emerald-500 to-teal-700 text-white flex items-center justify-center font-black text-4xl italic tracking-tighter shadow-xl shadow-emerald-500/10">
                                                                {lead.student.name[0]}
                                                            </div>
                                                            <div className="flex-1 text-center sm:text-left">
                                                                <p className="text-[9px] font-black uppercase tracking-[0.3em] opacity-20 mb-1 leading-none">Verified Mandatary</p>
                                                                <h4 className="text-2xl font-black uppercase tracking-tighter italic text-white leading-none mb-1">{lead.student.name}</h4>
                                                                <div className="text-[10px] font-black text-emerald-500/60 uppercase tracking-widest leading-none italic">Sync Active</div>
                                                            </div>
                                                            <div className="flex gap-3">
                                                                <a href={`tel:${lead.student.phone}`} className="size-16 bg-surface-dark border border-border-dark rounded-2xl flex items-center justify-center hover:bg-emerald-500/10 hover:text-emerald-500 hover:border-emerald-500/40 transition-all active:scale-95 shadow-sm text-on-surface-dark/40">
                                                                    <Phone size={20} strokeWidth={3} />
                                                                </a>
                                                                <a href={`https://wa.me/${lead.student.phone}`} className="size-16 bg-emerald-500 text-white rounded-2xl flex items-center justify-center hover:bg-emerald-600 transition-all active:scale-95 shadow-xl shadow-emerald-500/20">
                                                                    <MessageCircle size={22} strokeWidth={3} fill="currentColor" className="opacity-40" />
                                                                </a>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <button 
                                                            onClick={() => handleUnlock(lead.id)}
                                                            className="w-full bg-primary text-white py-8 rounded-[2.5rem] font-black text-[12px] tracking-[0.4em] uppercase transition-all flex items-center justify-center gap-4 shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-95 group/btn leading-none"
                                                        >
                                                            <Lock size={18} strokeWidth={3} className="group-hover/btn:rotate-12 transition-transform" />
                                                            ACQUIRE ASSET ({lead.premiumTier === 2 ? '3' : lead.premiumTier === 1 ? '2' : '1'} INDEX)
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="absolute -bottom-24 -right-24 size-80 bg-primary/5 rounded-full blur-[120px] group-hover:bg-primary/10 transition-colors duration-700 pointer-events-none"></div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-40 text-center bg-surface-dark/10 rounded-[5rem] border-4 border-dashed border-border-dark p-20 relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <div className="size-32 rounded-[3.5rem] bg-surface-dark/80 backdrop-blur-xl shadow-2xl flex items-center justify-center mx-auto mb-12 relative animate-float transition-all duration-700 group-hover:scale-110 group-hover:rotate-6 border border-border-dark">
                                        <Radar size={48} className="text-on-surface-dark/10 group-hover:text-primary transition-colors" strokeWidth={1} />
                                    </div>
                                    <h3 className="text-3xl font-black mb-6 uppercase italic tracking-tighter text-white">Discovery <span className="text-primary not-italic font-serif font-light lowercase">Engine Standby.</span></h3>
                                    <p className="text-on-surface-dark/40 max-w-sm mx-auto font-medium text-sm leading-relaxed mb-16 italic uppercase tracking-widest leading-loose">"The global requirement stream is currently recalibrating. Synchronize in intervals to acquire high-fidelity mandates."</p>
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
            <div className="flex items-center justify-center min-h-screen bg-background-dark font-sans overflow-hidden relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[400px] bg-primary/10 rounded-full blur-[100px] animate-pulse"></div>
                <div className="flex flex-col items-center relative z-10">
                    <div className="size-20 bg-surface-dark border border-border-dark rounded-3xl flex items-center justify-center mb-10 shadow-2xl animate-spin-slow">
                         <div className="size-10 bg-primary/20 rounded-xl flex items-center justify-center">
                            <Radar size={24} className="text-primary animate-pulse" />
                         </div>
                    </div>
                    <p className="font-black text-[11px] text-on-surface-dark/20 uppercase tracking-[0.5em] italic animate-pulse">Initializing Faculty Terminal...</p>
                </div>
            </div>
        }>
            <DashboardContent />
        </Suspense>
    );
}
