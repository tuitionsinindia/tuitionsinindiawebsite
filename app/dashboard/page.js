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

    useEffect(() => {
        if (tutorId) {
            fetchLeads();
            fetchTutorData();
        }
    }, [tutorId]);

    const fetchLeads = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/lead/list?tutorId=${tutorId}`);
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
                body: JSON.stringify({ amount, currency: "INR", receipt: `receipt_${tutorId}` }),
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
            <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-4 md:px-10 py-4 flex items-center justify-between shadow-sm">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="text-primary group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-3xl font-bold">school</span>
                    </div>
                    <h2 className="text-xl font-heading font-bold tracking-tight hidden sm:block">TuitionsInIndia</h2>
                </Link>
                <div className="flex items-center gap-4">
                    <button className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-primary transition-colors">
                        <span className="material-symbols-outlined">notifications</span>
                    </button>
                    <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-800">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-bold">{tutorData?.name || "Tutor"}</p>
                            <p className="text-xs text-emerald-600 font-bold">{tutorData?.credits || 0} Credits</p>
                        </div>
                        <div className="h-10 w-10 rounded-full bg-primary-glow border border-primary/20 flex items-center justify-center text-white font-bold">
                            {(tutorData?.name || "T")[0].toUpperCase()}
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar Navigation */}
                <aside className="hidden lg:flex w-64 flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 gap-2 h-[calc(100vh-73px)] sticky top-[73px]">
                    <div className="flex items-center gap-3 p-4 mb-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                        <div className="relative">
                            <div className="size-12 rounded-full border-2 border-primary/20 bg-primary/10 flex items-center justify-center">
                                <span className="material-symbols-outlined text-primary">person</span>
                            </div>
                            {tutorData?.isVerified && (
                                <div className="absolute -bottom-1 -right-1 size-5 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center text-white">
                                    <span className="material-symbols-outlined" style={{ fontSize: '10px' }}>check</span>
                                </div>
                            )}
                        </div>
                        <div className="overflow-hidden">
                            <p className="font-bold truncate text-sm">{tutorData?.name || "Tutor Profile"}</p>
                            <p className="text-xs text-slate-500 truncate">{tutorData?.isVerified ? "Verified Expert" : "Under Review"}</p>
                        </div>
                    </div>

                    <nav className="space-y-2">
                        <a href="#" className="flex items-center gap-3 px-4 py-3 bg-primary/10 text-primary rounded-xl font-bold transition-all shadow-sm">
                            <span className="material-symbols-outlined">dashboard</span>
                            <span className="text-sm">Dashboard</span>
                        </a>
                        <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all font-medium">
                            <span className="material-symbols-outlined">groups</span>
                            <span className="text-sm">My Students</span>
                        </a>
                        <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all font-medium">
                            <span className="material-symbols-outlined">payments</span>
                            <span className="text-sm">Earnings</span>
                        </a>
                        <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all font-medium">
                            <span className="material-symbols-outlined">analytics</span>
                            <span className="text-sm">Profile Analytics</span>
                        </a>
                    </nav>

                    <div className="mt-auto bg-gradient-to-tr from-primary to-secondary p-5 rounded-2xl text-white relative overflow-hidden shadow-xl shadow-primary/20">
                        <div className="absolute -right-4 -top-4 size-20 bg-white/10 rounded-full blur-xl"></div>
                        <h4 className="font-heading font-bold mb-1 relative z-10">Running Low?</h4>
                        <p className="text-xs text-white/80 mb-4 relative z-10">Get more credits to unlock high-intent student leads.</p>
                        <button onClick={makePayment} className="w-full bg-white text-primary text-sm font-bold py-2 rounded-lg hover:bg-slate-50 transition-colors shadow-sm relative z-10">
                            Buy Credits (+10)
                        </button>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10 relative">
                    {/* Header Section */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 relative z-10">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-heading font-bold tracking-tight text-slate-900 dark:text-white">
                                Welcome, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">{tutorData?.name?.split(' ')[0] || "Tutor"}</span>
                            </h1>
                            <p className="text-slate-500 mt-2">Here's what's happening with your teaching business today.</p>
                        </div>
                        <div className="flex gap-3">
                            <button onClick={fetchLeads} className="p-3 text-primary border border-primary/20 bg-primary/5 rounded-xl hover:bg-primary/10 transition-colors shadow-sm font-bold flex items-center justify-center">
                                <span className="material-symbols-outlined">refresh</span>
                            </button>
                            <button onClick={makePayment} className="flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-glow transition-all shadow-lg shadow-primary/30">
                                <span className="material-symbols-outlined">add_circle</span>
                                Buy Credits
                            </button>
                        </div>
                    </div>

                    {/* Metrics Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10 relative z-10">
                        <div className="bg-white dark:bg-slate-900/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/20 dark:shadow-none hover:-translate-y-1 transition-transform">
                            <div className="flex items-center justify-between mb-4">
                                <p className="text-sm text-slate-500 font-bold uppercase tracking-wider">Available Credits</p>
                                <span className="material-symbols-outlined text-primary bg-primary/10 p-2 rounded-lg">toll</span>
                            </div>
                            <p className="text-3xl font-heading font-bold text-slate-900 dark:text-white">{tutorData?.credits || 0}</p>
                            <div className="mt-2 text-xs font-semibold text-emerald-500">
                                Ready to use
                            </div>
                        </div>
                        <div className="bg-white dark:bg-slate-900/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/20 dark:shadow-none hover:-translate-y-1 transition-transform">
                            <div className="flex items-center justify-between mb-4">
                                <p className="text-sm text-slate-500 font-bold uppercase tracking-wider">Profile Views</p>
                                <span className="material-symbols-outlined text-accent bg-accent/10 p-2 rounded-lg">visibility</span>
                            </div>
                            <p className="text-3xl font-heading font-bold text-slate-900 dark:text-white">1,204</p>
                            <div className="mt-2 text-xs font-semibold text-emerald-500 flex items-center gap-1">
                                <span className="material-symbols-outlined text-[14px]">trending_up</span> +12% this week
                            </div>
                        </div>
                        <div className="bg-white dark:bg-slate-900/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/20 dark:shadow-none hover:-translate-y-1 transition-transform">
                            <div className="flex items-center justify-between mb-4">
                                <p className="text-sm text-slate-500 font-bold uppercase tracking-wider">Leads Unlocked</p>
                                <span className="material-symbols-outlined text-emerald-500 bg-emerald-500/10 p-2 rounded-lg">lock_open</span>
                            </div>
                            <p className="text-3xl font-heading font-bold text-slate-900 dark:text-white">18</p>
                            <div className="mt-2 text-xs font-semibold text-emerald-500 flex items-center gap-1">
                                <span className="material-symbols-outlined text-[14px]">check_circle</span> Highly active
                            </div>
                        </div>
                        <div className="bg-white dark:bg-slate-900/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/20 dark:shadow-none hover:-translate-y-1 transition-transform relative overflow-hidden">
                            <div className="absolute -right-4 -bottom-4 size-24 bg-primary/5 rounded-full blur-xl pointer-events-none"></div>
                            <div className="flex items-center justify-between mb-4">
                                <p className="text-sm text-slate-500 font-bold uppercase tracking-wider">Verification</p>
                                <span className="material-symbols-outlined text-indigo-500 bg-indigo-500/10 p-2 rounded-lg">verified</span>
                            </div>
                            <p className="text-xl font-heading font-bold text-slate-900 dark:text-white mt-1 pt-2">{tutorData?.isVerified ? "Verified Expert" : "Pending Approval"}</p>
                            <div className="mt-2 text-xs font-semibold text-indigo-500 flex items-center gap-1">
                                Premium Status
                            </div>
                        </div>
                    </div>

                    {/* Leads Section */}
                    <div className="bg-white dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden relative z-10">
                        <div className="p-6 md:p-8 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between flex-wrap gap-4">
                            <div>
                                <h2 className="text-xl font-heading font-bold">Live Student Leads</h2>
                                <p className="text-sm text-slate-500 mt-1">Students actively looking for tutors in your subjects.</p>
                            </div>
                            <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                                <button className="px-4 py-2 text-sm font-bold bg-white dark:bg-slate-700 shadow-sm rounded-lg">Available</button>
                                <button className="px-4 py-2 text-sm font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">Unlocked</button>
                            </div>
                        </div>

                        <div className="p-6 md:p-8">
                            {loading ? (
                                <div className="text-center py-12">
                                    <span className="material-symbols-outlined text-5xl text-slate-300 animate-spin">refresh</span>
                                    <p className="mt-4 font-semibold text-slate-500">Loading the latest leads...</p>
                                </div>
                            ) : leads.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {leads.map((lead) => (
                                        <div key={lead.id} className={`rounded-2xl border transition-all duration-300 hover:shadow-xl p-6 relative overflow-hidden ${lead.isUnlocked ? "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800" : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-primary/50"}`}>

                                            {lead.isUnlocked && (
                                                <div className="absolute -right-10 -top-10 size-32 bg-emerald-500/10 rounded-full blur-2xl"></div>
                                            )}

                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={`px-3 py-1 text-xs font-bold rounded-full ${lead.isUnlocked ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400' : 'bg-primary/10 text-primary uppercase tracking-wider'}`}>
                                                        {lead.subject}
                                                    </div>
                                                    {lead.isUnlocked && (
                                                        <span className="flex items-center gap-1 text-xs font-bold text-emerald-600">
                                                            <span className="material-symbols-outlined text-[14px]">check_circle</span> Unlocked
                                                        </span>
                                                    )}
                                                </div>
                                                <span className="text-xs font-semibold text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                                                    {new Date(lead.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>

                                            <h3 className="text-lg font-heading font-bold mb-3 pr-4 leading-snug">Need tutor for {lead.subject} in {lead.location}</h3>
                                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800 line-clamp-2">
                                                "{lead.description}"
                                            </p>

                                            <div className="flex flex-wrap items-center gap-2 mb-6 text-sm font-semibold">
                                                <span className="flex items-center gap-1 text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg">
                                                    <span className="material-symbols-outlined text-[16px]">location_on</span> {lead.location}
                                                </span>
                                                <span className="flex items-center gap-1 text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg">
                                                    <span className="material-symbols-outlined text-[16px]">payments</span> {lead.budget || "Negotiable"}
                                                </span>
                                                <span className="flex items-center gap-1 text-orange-600 bg-orange-50 px-3 py-1.5 rounded-lg dark:bg-orange-900/30 dark:text-orange-400">
                                                    <span className="material-symbols-outlined text-[16px]">group</span> {lead.unlockCount}/{lead.maxUnlocks} Tutors Applied
                                                </span>
                                            </div>

                                            {lead.isUnlocked ? (
                                                <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-emerald-200 dark:border-emerald-800 shadow-sm relative z-10">
                                                    <div className="flex items-center gap-4 mb-4">
                                                        <div className="size-12 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex flex-col items-center justify-center text-emerald-700 dark:text-emerald-400 font-bold text-xl font-heading">
                                                            {lead.student.name[0]}
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-slate-900 dark:text-white">{lead.student.name}</p>
                                                            <p className="text-xs font-semibold text-slate-500">Student Contact details</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col gap-2 mb-4">
                                                        <a href={`tel:${lead.student.phone}`} className="flex items-center gap-3 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-primary transition-colors">
                                                            <span className="material-symbols-outlined text-slate-400">call</span> {lead.student.phone}
                                                        </a>
                                                        <a href={`mailto:${lead.student.email}`} className="flex items-center gap-3 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-primary transition-colors">
                                                            <span className="material-symbols-outlined text-slate-400">mail</span> {lead.student.email}
                                                        </a>
                                                    </div>
                                                    <button className="w-full bg-emerald-500 text-white font-bold py-3 rounded-xl hover:bg-emerald-600 shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2">
                                                        <span className="material-symbols-outlined text-[18px]">call</span> Call Student Now
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    className="w-full bg-slate-900 dark:bg-primary text-white font-bold py-4 rounded-xl hover:bg-primary shadow-lg hover:shadow-primary/30 transition-all flex items-center justify-center gap-2 group"
                                                    onClick={() => handleUnlock(lead.id)}>
                                                    <span className="material-symbols-outlined group-hover:animate-bounce">lock_open</span> Unlock Contact Details (1 Credit)
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-16 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
                                    <div className="size-20 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto mb-4">
                                        <span className="material-symbols-outlined text-4xl">inbox</span>
                                    </div>
                                    <h3 className="text-xl font-heading font-bold mb-2">No active leads found</h3>
                                    <p className="text-slate-500 max-w-sm mx-auto">We will notify you via email as soon as a student posts a requirement matching your subjects.</p>
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
