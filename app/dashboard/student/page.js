"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Script from "next/script";
import Link from "next/link";

function StudentDashboardContent() {
    const searchParams = useSearchParams();
    const [studentId, setStudentId] = useState(searchParams.get("studentId") || "");
    const [loading, setLoading] = useState(true);
    const [studentData, setStudentData] = useState(null);
    const [unlockedTutors, setUnlockedTutors] = useState([]);
    const [activeLeads, setActiveLeads] = useState([]);

    useEffect(() => {
        if (studentId) {
            fetchStudentData();
            fetchUnlockedTutors();
            fetchActiveLeads();
        }
    }, [studentId]);

    const fetchStudentData = async () => {
        try {
            // Reusing user/info endpoint or creating a specific one if needed
            const res = await fetch(`/api/user/info?id=${studentId}`);
            if (res.ok) {
                const data = await res.json();
                setStudentData(data);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const fetchUnlockedTutors = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/student/unlocked-tutors?studentId=${studentId}`);
            if (res.ok) {
                const data = await res.json();
                setUnlockedTutors(data);
            } else {
                setUnlockedTutors([]);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchActiveLeads = async () => {
        try {
            const res = await fetch(`/api/student/active-leads?studentId=${studentId}`);
            if (res.ok) {
                const data = await res.json();
                setActiveLeads(data);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleCloseLead = async (leadId) => {
        if (!confirm("Have you found a tutor? This will stop other tutors from contacting you.")) return;

        try {
            const res = await fetch("/api/lead/close", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ leadId, studentId }),
            });

            if (res.ok) {
                alert("Requirement closed successfully!");
                fetchActiveLeads();
            }
        } catch (err) {
            console.error(err);
        }
    };

    const makePayment = async () => {
        const creditsToAdd = 5;
        const amount = 299; // ₹299 for 5 credits (Pro Learner Top-up)

        try {
            const res = await fetch("/api/payment/order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    amount,
                    currency: "INR",
                    receipt: `receipt_student_${studentId}`,
                    userId: studentId,
                    description: `Purchase ${creditsToAdd} Credits (Pro Learner Top-up)`
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
                            tutorId: studentId, // Reuse existing logic that expects ID
                            creditsToAdd,
                        }),
                    });
                    const verifyData = await verifyRes.json();
                    if (verifyData.success) {
                        alert("Payment Successful! Credits added.");
                        fetchStudentData();
                    } else {
                        alert("Payment verification failed.");
                    }
                },
                prefill: {
                    name: studentData?.name,
                    email: studentData?.email,
                    contact: studentData?.phone,
                },
                theme: {
                    color: "#f59e0b", // amber-500
                },
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();
        } catch (err) {
            console.error(err);
            alert("Error initiating payment.");
        }
    };

    if (!studentId) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-background-dark p-4 font-sans relative">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] opacity-5 bg-cover bg-center"></div>
                <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-white/50 dark:border-slate-800 max-w-md w-full relative z-10 text-center">
                    <div className="size-16 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 mx-auto mb-6">
                        <span className="material-symbols-outlined text-3xl">face</span>
                    </div>
                    <h2 className="text-2xl font-heading font-bold mb-2">Student Access</h2>
                    <p className="text-slate-500 mb-8 text-sm">Please provide your Student ID to access the dashboard (Demo Mode).</p>
                    <input
                        type="text"
                        placeholder="Enter Student ID"
                        className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-4 mb-4 focus:ring-2 focus:ring-amber-500 outline-none"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                setStudentId(e.target.value);
                            }
                        }}
                        id="studentInput"
                    />
                    <button
                        className="w-full bg-amber-500 text-white font-bold py-4 rounded-xl hover:bg-amber-600 shadow-lg shadow-amber-500/20 transition-all"
                        onClick={() => {
                            const id = document.getElementById('studentInput').value;
                            setStudentId(id);
                        }}>
                        Access Dashboard
                    </button>
                    <Link href="/" className="inline-block mt-6 text-sm font-semibold text-slate-400 hover:text-amber-500 transition-colors">Return to Home</Link>
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
                    <button className="size-10 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-amber-500 hover:bg-white dark:hover:bg-slate-700 transition-all flex items-center justify-center shadow-sm">
                        <span className="material-symbols-outlined text-[20px]">notifications</span>
                    </button>
                    <div className="flex items-center gap-4 pl-6 border-l border-slate-200 dark:border-slate-800">
                        <div className="text-right hidden sm:block">
                            <p className="text-[13px] font-black font-heading tracking-wide uppercase">{studentData?.name || "Student"}</p>
                            <div className="flex items-center justify-end gap-3 mt-0.5">
                                <span className="text-[9px] font-black uppercase tracking-[0.2em] bg-amber-500/10 text-amber-600 px-2 py-0.5 rounded-full border border-amber-500/20">
                                    {studentData?.subscriptionTier || "FREE"}
                                </span>
                                <p className="text-[11px] text-amber-600 font-bold tracking-tight">{studentData?.credits || 0} Credits</p>
                            </div>
                        </div>
                        <div className="h-12 w-12 rounded-[1.25rem] bg-gradient-to-br from-amber-500 to-orange-500 border-2 border-white dark:border-slate-800 flex items-center justify-center text-white font-black text-lg shadow-xl shadow-amber-500/20">
                            {(studentData?.name || "S")[0].toUpperCase()}
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar Navigation */}
                <aside className="hidden lg:flex w-72 flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 gap-3 h-[calc(100vh-73px)] sticky top-[73px]">
                    <div className="flex items-center gap-4 p-5 mb-8 glass-premium rounded-[2rem] border border-white/50 dark:border-slate-800 shadow-xl shadow-amber-500/5">
                        <div className="size-14 rounded-2xl border-2 border-amber-500/20 bg-amber-500/5 flex items-center justify-center shadow-inner">
                            <span className="material-symbols-outlined text-amber-500 text-[28px]">face</span>
                        </div>
                        <div className="overflow-hidden">
                            <p className="font-heading font-black truncate text-sm tracking-wide">{studentData?.name || "Premium Learner"}</p>
                            <p className="text-[10px] uppercase font-black tracking-widest text-slate-400 mt-0.5">{studentData?.subscriptionPlanId ? "Pro Member" : "Active Student"}</p>
                        </div>
                    </div>

                    <nav className="space-y-3">
                        <Link href={`/dashboard/student?studentId=${studentId}`} className="flex items-center gap-4 px-5 py-4 bg-amber-500 text-white rounded-[1.5rem] font-black transition-all shadow-xl shadow-amber-500/30 font-heading tracking-wide">
                            <span className="material-symbols-outlined text-[22px]">grid_view</span>
                            <span className="text-xs uppercase tracking-[0.2em]">Learning Hub</span>
                        </Link>
                        <Link href="/tutors" className="group flex items-center gap-4 px-5 py-4 text-slate-500 font-black hover:text-amber-600 hover:bg-amber-500/5 rounded-[1.5rem] transition-all font-heading tracking-wide border border-transparent hover:border-amber-500/10">
                            <span className="material-symbols-outlined text-[22px] text-slate-400 group-hover:text-amber-500">search</span>
                            <span className="text-xs uppercase tracking-[0.2em]">Find Educators</span>
                        </Link>
                        <Link href={`/dashboard/student/messages?studentId=${studentId}`} className="group flex items-center gap-4 px-5 py-4 text-slate-500 font-black hover:text-amber-600 hover:bg-amber-500/5 rounded-[1.5rem] transition-all font-heading tracking-wide border border-transparent hover:border-amber-500/10">
                            <span className="material-symbols-outlined text-[22px] text-slate-400 group-hover:text-amber-500">forum</span>
                            <span className="text-xs uppercase tracking-[0.2em]">Active Chats</span>
                        </Link>
                        <Link href={`/dashboard/student/subscription?studentId=${studentId}`} className="group flex items-center gap-4 px-5 py-4 text-slate-500 font-black hover:text-amber-600 hover:bg-amber-500/5 rounded-[1.5rem] transition-all font-heading tracking-wide border border-transparent hover:border-amber-500/10">
                            <span className="material-symbols-outlined text-[22px] text-slate-400 group-hover:text-amber-500">credit_card</span>
                            <span className="text-xs uppercase tracking-[0.2em]">Memberships</span>
                        </Link>
                    </nav>

                    <div className="mt-auto glass-premium p-6 rounded-[2.25rem] relative overflow-hidden shadow-2xl border border-white/20">
                        <div className="absolute -right-6 -top-6 size-24 bg-amber-500/10 rounded-full blur-2xl"></div>
                        <h4 className="font-heading font-black mb-1 relative z-10 text-amber-600 uppercase text-[10px] tracking-[0.3em]">Pro Insights</h4>
                        <p className="text-[11px] text-slate-500 mb-5 relative z-10 font-medium">Get priority matches with India's top 1% verified tutors.</p>
                        <button onClick={makePayment} className="w-full btn-primary bg-amber-500 hover:bg-amber-600 border-amber-400 py-3 rounded-2xl text-[10px] tracking-[0.2em] relative z-10 flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 text-white font-black">
                            RECHARGE (+5)
                            <span className="material-symbols-outlined text-sm">bolt</span>
                        </button>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto p-6 md:p-12 lg:p-16 relative bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.03),transparent_40%)]">
                    {/* Header Section */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12 relative z-10">
                        <div>
                            <h1 className="text-3xl md:text-5xl font-heading font-black tracking-tight text-slate-900 dark:text-white leading-tight">
                                Student <span className="text-amber-500">Portal</span>
                            </h1>
                            <p className="text-slate-400 mt-3 font-medium text-lg italic">Welcome back, {studentData?.name?.split(' ')[0] || "Learner"}</p>
                        </div>
                        <div className="flex gap-4 items-center">
                            <button onClick={fetchUnlockedTutors} className="size-14 text-slate-400 border border-slate-200 bg-white rounded-2xl hover:text-amber-500 hover:border-amber-500/20 transition-all shadow-sm flex items-center justify-center group active:scale-90">
                                <span className="material-symbols-outlined text-[24px] group-active:rotate-180 transition-transform">refresh</span>
                            </button>
                            <Link href="/post-requirement" className="btn-primary bg-slate-900 hover:bg-black text-white flex items-center gap-3 px-8 py-4 shadow-2xl shadow-slate-900/20 border-none font-black text-xs tracking-[0.2em]">
                                <span className="material-symbols-outlined text-[20px]">post_add</span>
                                POST REQUIREMENT
                            </Link>
                        </div>
                    </div>

                    {/* Metrics Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 relative z-10">
                        <div className="glass-premium p-8 rounded-[2.5rem] border border-white/50 dark:border-slate-800 shadow-2xl shadow-slate-200/40 dark:shadow-none hover:-translate-y-2 transition-all group">
                            <div className="flex items-center justify-between mb-6">
                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Available Credits</p>
                                <div className="size-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-all shadow-inner">
                                    <span className="material-symbols-outlined text-[22px]">stars</span>
                                </div>
                            </div>
                            <p className="text-4xl font-heading font-black text-slate-900 dark:text-white tracking-tighter">{studentData?.credits || 0}</p>
                            <div className="mt-3 text-[11px] font-black text-amber-600 uppercase tracking-widest flex items-center gap-2">
                                <span className="size-2 rounded-full bg-amber-500 animate-pulse"></span>
                                READY TO CONNECT
                            </div>
                        </div>
                        <div className="glass-premium p-8 rounded-[2.5rem] border border-white/50 dark:border-slate-800 shadow-2xl shadow-slate-200/40 dark:shadow-none hover:-translate-y-2 transition-all group">
                            <div className="flex items-center justify-between mb-6">
                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Active Needs</p>
                                <div className="size-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-all shadow-inner">
                                    <span className="material-symbols-outlined text-[22px]">campaign</span>
                                </div>
                            </div>
                            <p className="text-4xl font-heading font-black text-slate-900 dark:text-white tracking-tighter">{activeLeads.length || 0}</p>
                            <div className="mt-3 text-[11px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2">
                                <span className="material-symbols-outlined text-[14px]">bolt</span>
                                LIVE REQUESTS
                            </div>
                        </div>
                        <div className="glass-premium p-8 rounded-[2.5rem] border border-white/50 dark:border-slate-800 shadow-2xl shadow-slate-200/40 dark:shadow-none hover:-translate-y-2 transition-all group">
                            <div className="flex items-center justify-between mb-6">
                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Unlocked Tutors</p>
                                <div className="size-12 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-all shadow-inner">
                                    <span className="material-symbols-outlined text-[22px]">school</span>
                                </div>
                            </div>
                            <p className="text-4xl font-heading font-black text-slate-900 dark:text-white tracking-tighter">{unlockedTutors.length || 0}</p>
                            <div className="mt-3 text-[11px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-2">
                                <span className="material-symbols-outlined text-[14px]">person</span>
                                ELITE EDUCATORS
                            </div>
                        </div>
                        <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-[0_20px_50px_-15px_rgba(0,0,0,0.5)] hover:-translate-y-2 transition-all relative overflow-hidden group">
                            <div className="absolute -right-6 -bottom-6 size-32 bg-amber-500/20 rounded-full blur-3xl group-hover:bg-amber-500/30 transition-all"></div>
                            <div className="flex items-center justify-between mb-6">
                                <p className="text-[10px] text-white/40 font-black uppercase tracking-[0.2em]">Membership Tier</p>
                                <div className="size-12 rounded-2xl bg-white/10 text-amber-500 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-all">
                                    <span className="material-symbols-outlined text-[22px]">workspace_premium</span>
                                </div>
                            </div>
                            <p className="text-2xl font-heading font-black text-white uppercase tracking-wider">{studentData?.subscriptionTier || "FREE"}</p>
                            <div className="mt-4">
                                <Link href="/pricing" className="text-[10px] font-black text-amber-500 uppercase tracking-[0.2em] border-b border-amber-500/30 hover:border-amber-500 transition-all">
                                    {studentData?.subscriptionTier === 'FREE' ? "GO PRO FOR PRIORITY" : "VIEW MEMBERSHIP PERKS"}
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Active Requirements Section */}
                    {activeLeads.length > 0 && (
                        <div className="mb-12 bg-white dark:bg-slate-900/80 backdrop-blur-xl rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-3xl overflow-hidden relative z-10">
                            <div className="p-10 md:p-12 border-b border-slate-100 dark:border-slate-800">
                                <h2 className="text-2xl font-heading font-black tracking-tight">Active Learning Pipeline</h2>
                                <p className="text-sm text-slate-400 mt-2 font-medium tracking-wide">Manage your open tutor requests and close them once you've found a match.</p>
                            </div>
                            <div className="p-10 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-8">
                                {activeLeads.map(lead => (
                                    <div key={lead.id} className="p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 relative overflow-hidden group/req">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="px-5 py-2 bg-amber-500 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full shadow-lg shadow-amber-500/20">
                                                {lead.subject}
                                            </div>
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest pt-2">
                                                {lead.unlockCount} EDUCATORS APPLIED
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-heading font-black mb-4 tracking-tight uppercase italic group-hover/req:text-amber-600 transition-colors">Requirement in {lead.location}</h3>
                                        <p className="text-sm text-slate-500 line-clamp-2 mb-8 italic font-medium leading-relaxed">"{lead.description}"</p>
                                        <button
                                            onClick={() => handleCloseLead(lead.id)}
                                            className="w-full py-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[10px] font-black uppercase tracking-[0.3em] rounded-[1.5rem] hover:bg-emerald-500 hover:text-white hover:border-emerald-500 transition-all flex items-center justify-center gap-3 shadow-sm hover:shadow-emerald-500/30 active:scale-[0.98]"
                                        >
                                            <span className="material-symbols-outlined text-[18px]">verified</span>
                                            MARK AS HIRED / CLOSE
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Unlocked Tutors Section */}
                    <div className="bg-white dark:bg-slate-900/80 backdrop-blur-xl rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-3xl overflow-hidden relative z-10">
                        <div className="p-10 md:p-12 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between flex-wrap gap-6">
                            <div>
                                <h2 className="text-2xl font-heading font-black tracking-tight">Expert Connections</h2>
                                <p className="text-sm text-slate-400 mt-2 font-medium tracking-wide">Your shortlist of unlocked elite educators. Ready for connection.</p>
                            </div>
                        </div>

                        <div className="p-10 md:p-12">
                            {loading ? (
                                <div className="text-center py-24">
                                    <div className="size-20 rounded-[2.5rem] bg-slate-50 dark:bg-slate-800 flex items-center justify-center mx-auto mb-6 shadow-2xl animate-pulse">
                                        <span className="material-symbols-outlined text-amber-500 text-[40px] animate-spin">sync</span>
                                    </div>
                                    <p className="font-heading font-black text-slate-400 uppercase tracking-[0.4em] text-[10px]">Restoring Connections...</p>
                                </div>
                            ) : unlockedTutors.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                                    {unlockedTutors.map((tutor) => (
                                        <div key={tutor.id} className="rounded-[3rem] border bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 transition-all duration-700 hover:-translate-y-3 hover:shadow-4xl p-8 md:p-12 relative overflow-hidden group/card shadow-sm">
                                            
                                            <div className="flex justify-between items-start mb-8">
                                                <div className="flex justify-start gap-6">
                                                    <div className="size-20 rounded-[1.5rem] bg-slate-900 flex items-center justify-center text-white font-heading font-black text-2xl shadow-2xl group-hover/card:scale-110 transition-transform">
                                                        {tutor.name[0]}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-heading font-black text-2xl tracking-tight flex items-center gap-3 uppercase italic">
                                                            {tutor.name}
                                                            {tutor.isVerified && (
                                                                <span className="material-symbols-outlined text-[20px] text-emerald-500 pulse-gentle">verified</span>
                                                            )}
                                                        </h3>
                                                        <p className="text-[10px] font-black text-amber-600 uppercase tracking-[0.2em] mt-2">{tutor.tutorListing?.subjects?.join(', ') || 'Multidisciplinary Educator'}</p>
                                                        <div className="flex items-center gap-2 mt-2">
                                                            <div className="flex text-amber-400">
                                                                {[1,2,3,4,5].map(s => <span key={s} className="material-symbols-outlined text-[14px]">star</span>)}
                                                            </div>
                                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">(4.9/5)</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <Link href={`/tutor/${tutor.id}`} className="size-12 flex items-center justify-center text-slate-400 hover:text-amber-500 bg-slate-50 dark:bg-slate-800 rounded-2xl transition-all hover:rotate-12">
                                                    <span className="material-symbols-outlined text-[20px]">open_in_new</span>
                                                </Link>
                                            </div>

                                            <div className="bg-slate-50/50 dark:bg-slate-800/50 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800 mb-8 animate-premium-fade">
                                                <div className="flex flex-col gap-5">
                                                    <a href={`tel:${tutor.phone}`} className="flex items-center justify-between group/link">
                                                        <div className="flex items-center gap-4">
                                                            <div className="size-10 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center text-amber-500 shadow-sm group-hover/link:bg-amber-500 group-hover/link:text-white transition-all">
                                                                <span className="material-symbols-outlined text-[20px]">call</span>
                                                            </div>
                                                            <span className="text-sm font-black tracking-widest text-slate-700 dark:text-slate-300">{tutor.phone || 'HIDDEN'}</span>
                                                        </div>
                                                        <span className="material-symbols-outlined text-[16px] text-slate-300 group-hover/link:translate-x-1 transition-transform">arrow_forward</span>
                                                    </a>
                                                    <a href={`mailto:${tutor.email}`} className="flex items-center justify-between group/link">
                                                        <div className="flex items-center gap-4">
                                                            <div className="size-10 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center text-amber-500 shadow-sm group-hover/link:bg-amber-500 group-hover/link:text-white transition-all">
                                                                <span className="material-symbols-outlined text-[20px]">mail</span>
                                                            </div>
                                                            <span className="text-sm font-black tracking-widest text-slate-700 dark:text-slate-300 truncate max-w-[150px]">{tutor.email || 'HIDDEN'}</span>
                                                        </div>
                                                        <span className="material-symbols-outlined text-[16px] text-slate-300 group-hover/link:translate-x-1 transition-transform">arrow_forward</span>
                                                    </a>
                                                </div>
                                            </div>

                                            <div className="flex gap-4">
                                                <a href={`https://wa.me/${tutor.phone}`} target="_blank" rel="noreferrer" className="flex-1 bg-emerald-500 text-white font-black py-5 rounded-[1.5rem] hover:bg-emerald-600 transition-all flex items-center justify-center gap-3 shadow-xl shadow-emerald-500/20 text-[10px] tracking-[0.25em]">
                                                    <span className="material-symbols-outlined text-[18px]">chat</span> WHATSAPP
                                                </a>
                                                <Link href={`/dashboard/student/messages?studentId=${studentId}&activeChat=${tutor.id}`} className="size-16 bg-slate-900 text-white rounded-[1.5rem] hover:bg-slate-800 transition-all flex items-center justify-center shadow-xl">
                                                    <span className="material-symbols-outlined text-[22px]">forum</span>
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-20 bg-slate-50/50 dark:bg-slate-800/30 rounded-[3rem] border border-dashed border-slate-200 dark:border-slate-800">
                                    <div className="size-24 rounded-[2.5rem] bg-white dark:bg-slate-900 flex items-center justify-center mx-auto mb-8 shadow-2xl">
                                        <span className="material-symbols-outlined text-slate-300 text-[48px]">person_search</span>
                                    </div>
                                    <h3 className="text-2xl font-heading font-black tracking-tight mb-3">Discovery Mode</h3>
                                    <p className="text-slate-400 max-w-sm mx-auto text-sm font-medium italic mb-10">"The journey of a thousand miles begins with a single mentor. Start your discovery to find the perfect educator."</p>
                                    <Link href="/tutors" className="btn-primary bg-amber-500 hover:bg-amber-600 text-white border-none px-10 py-5 rounded-[1.5rem] font-black text-[11px] tracking-[0.3em] inline-flex items-center gap-3 shadow-2xl shadow-amber-500/20">
                                        BROWSE ELITE TUTORS
                                        <span className="material-symbols-outlined">explore</span>
                                    </Link>
                                </div>
                            ) }
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default function StudentDashboard() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen bg-background-light dark:bg-background-dark">
                <div className="flex flex-col items-center">
                    <span className="material-symbols-outlined text-5xl text-amber-500 animate-spin">sync</span>
                    <p className="mt-4 font-heading font-bold text-slate-500">Loading Student Portal...</p>
                </div>
            </div>
        }>
            <StudentDashboardContent />
        </Suspense>
    );
}
