"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Script from "next/script";
import Link from "next/link";
import { 
    User, 
    GraduationCap, 
    Bolt, 
    Briefcase, 
    LayoutDashboard, 
    Search, 
    History, 
    ShieldCheck, 
    Settings, 
    ArrowRight, 
    MessageSquare, 
    Phone, 
    Mail, 
    Star, 
    Trophy,
    Target,
    Zap,
    Clock,
    BadgeCheck,
    LogOut,
    CheckCircle2
} from "lucide-react";

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
        const amount = 299; 

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
                            tutorId: studentId, 
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
                    color: "#f59e0b", 
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
            <div className="flex items-center justify-center min-h-screen bg-background-dark p-4 font-sans relative overflow-hidden">
                {/* Background Modern Decorative Elements */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[600px] bg-primary/10 rounded-full blur-[120px] -z-10 animate-pulse"></div>
                
                <div className="bg-surface-dark/40 backdrop-blur-3xl p-10 rounded-[2.5rem] shadow-2xl border border-border-dark max-w-md w-full relative z-10 text-center">
                    <div className="size-20 rounded-3xl bg-amber-500/10 flex items-center justify-center text-amber-500 mx-auto mb-8 border border-amber-500/20">
                        <GraduationCap size={40} strokeWidth={1.5} />
                    </div>
                    <h2 className="text-3xl font-black text-white mb-3 tracking-tighter uppercase italic">Student Access.</h2>
                    <p className="text-on-surface-dark/40 mb-10 text-[11px] font-black uppercase tracking-widest leading-relaxed">Please provide your institutional clearance ID to access the academic discovery hub.</p>
                    
                    <div className="relative mb-6">
                        <input
                            type="text"
                            placeholder="STUDENT PROTOCOL ID"
                            className="w-full bg-background-dark/50 border border-border-dark rounded-2xl p-5 text-white font-black text-xs uppercase tracking-widest focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 outline-none transition-all placeholder:text-white/10"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    setStudentId(e.target.value);
                                }
                            }}
                            id="studentInput"
                        />
                    </div>
                    
                    <button
                        className="group w-full bg-amber-500 text-white font-black py-5 rounded-2xl hover:bg-amber-600 shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-xs active:scale-95"
                        onClick={() => {
                            const id = document.getElementById('studentInput').value;
                            setStudentId(id);
                        }}>
                        EXECUTE LOGIN <ArrowRight size={16} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                    
                    <Link href="/" className="inline-block mt-8 text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-dark/20 hover:text-amber-500 transition-colors italic leading-none border-b border-transparent hover:border-amber-500 pb-1">Bypass to Terminal</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="relative flex min-h-screen flex-col bg-background-dark font-sans text-on-background-dark antialiased selection:bg-amber-500/20 selection:text-amber-500">
            <Script src="https://checkout.razorpay.com/v1/checkout.js" />

            {/* Premium Stitch Header */}
            <header className="sticky top-0 z-[60] w-full border-b border-border-dark bg-background-dark/80 backdrop-blur-2xl px-6 md:px-12 py-5 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="size-10 rounded-xl bg-amber-500 flex items-center justify-center text-white shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
                        <GraduationCap size={20} strokeWidth={2.5} />
                    </div>
                    <div className="flex flex-col leading-none">
                        <span className="text-lg font-black tracking-tighter text-white uppercase italic">tuitionsinindia</span>
                        <span className="text-[10px] font-black text-amber-500/40 tracking-[0.4em] uppercase">Student Hub</span>
                    </div>
                </Link>

                <div className="flex items-center gap-4 md:gap-8">
                    <div className="hidden sm:flex items-center gap-4 px-6 py-3 bg-surface-dark border border-border-dark rounded-2xl hover:border-amber-500/30 transition-colors group cursor-default">
                        <div className="text-right">
                            <p className="text-[9px] font-black uppercase tracking-widest text-on-surface-dark/30 leading-none mb-1">Matched Credits</p>
                            <p className="text-sm font-black text-amber-500 leading-none tracking-tighter uppercase italic">{studentData?.credits || 0} <span className="opacity-40 not-italic">ACQUIRED</span></p>
                        </div>
                        <button onClick={makePayment} className="size-9 rounded-xl bg-amber-500 text-white flex items-center justify-center hover:bg-amber-600 transition-all shadow-lg active:scale-90 group-hover:scale-110">
                            <Zap size={16} fill="currentColor" />
                        </button>
                    </div>

                    <div className="flex items-center gap-4 pl-6 border-l border-border-dark">
                        <div className="flex flex-col text-right hidden lg:block leading-none">
                            <span className="text-[10px] font-black text-white uppercase tracking-widest">{studentData?.name || "AUTHENTICATED"}</span>
                            <span className="text-[9px] font-medium text-on-surface-dark/30 uppercase tracking-widest mt-1">Verified Scholar</span>
                        </div>
                        <div className="size-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 border border-white/10 shadow-2xl flex items-center justify-center text-white font-black text-lg italic tracking-tighter">
                            {(studentData?.name || "S")[0].toUpperCase()}
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex flex-1">
                {/* Fixed Learning Sidebar */}
                <aside className="fixed left-0 top-[85px] bottom-0 w-80 bg-surface-dark/20 backdrop-blur-3xl border-r border-border-dark p-10 hidden xl:flex flex-col">
                    <div className="mb-12">
                        <h4 className="text-[10px] font-black text-on-surface-dark/20 uppercase tracking-[0.4em] mb-8 italic">Academic Command</h4>
                        <nav className="space-y-3">
                            <Link href="#" className="flex items-center gap-4 px-6 py-5 bg-amber-500 text-white rounded-2xl font-black text-[11px] tracking-widest shadow-xl shadow-amber-500/20 transition-all group active:scale-95">
                                <LayoutDashboard size={18} strokeWidth={2.5} />
                                PORTAL HOME
                                <ArrowRight size={14} strokeWidth={3} className="ml-auto opacity-40 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            {[
                                { icon: Search, label: "EXPERT DISCOVERY", href: "/search?role=TUTOR" },
                                { icon: History, label: "SYNC HISTORY" },
                                { icon: ShieldCheck, label: "VERIFICATION" },
                                { icon: Settings, label: "PREFERENCES" }
                            ].map((item, i) => (
                                <Link key={i} href={item.href || "#"} className="flex items-center gap-4 px-6 py-5 text-on-surface-dark/40 hover:bg-surface-dark hover:text-amber-500 rounded-2xl font-black text-[11px] tracking-widest transition-all hover:translate-x-1 border border-transparent hover:border-border-dark">
                                    <item.icon size={18} strokeWidth={2.5} className="opacity-40" />
                                    {item.label}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    <div className="mt-auto p-8 rounded-[3rem] bg-surface-dark border border-border-dark text-on-surface-dark relative overflow-hidden group">
                        <div className="absolute top-0 right-0 size-32 bg-amber-500/10 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-amber-500/20 transition-colors"></div>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-500 mb-4 italic">Pro Scholar Status</h4>
                        <p className="text-xs font-black text-white/40 leading-relaxed mb-8 uppercase tracking-widest">Architect your academic future with prioritized faculty matchmaking.</p>
                        <button className="w-full bg-white text-black py-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-500 hover:text-white transition-all shadow-xl active:scale-95 leading-none">
                            UPGRADE PROTOCOL
                        </button>
                    </div>

                    <button className="mt-8 flex items-center gap-4 px-6 py-4 text-red-500/40 hover:text-red-500 text-[10px] font-black uppercase tracking-[0.3em] transition-colors border-t border-border-dark pt-8">
                        <LogOut size={16} strokeWidth={3} />
                        EXIT SYSTEM
                    </button>
                </aside>

                {/* Portal Workspace */}
                <main className="flex-1 xl:pl-80 p-6 md:p-12 lg:p-16">
                    <div className="max-w-7xl mx-auto">
                        {/* High-Impact Hero */}
                        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 mb-24">
                            <div className="max-w-2xl relative">
                                <div className="absolute -left-12 top-0 text-[180px] font-black text-white/5 leading-none tracking-tighter italic select-none pointer-events-none uppercase">HUB</div>
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/5 rounded-full border border-amber-500/10 mb-8 relative z-10 box-border">
                                    <span className="size-2 rounded-full bg-amber-500 animate-pulse"></span>
                                    <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Protocol: Active Matching Engine</span>
                                </div>
                                <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 uppercase italic leading-[0.85] relative z-10 text-white">
                                    Academic <span className="text-amber-500 underline decoration-amber-500/20 decoration-8 underline-offset-8">Terminal.</span>
                                </h1>
                                <p className="text-xl text-on-surface-dark/60 font-medium leading-relaxed max-w-xl relative z-10">
                                    Strategizing the future of <span className="text-white font-black italic">{studentData?.name || "Candidate"}</span>. Managing {unlockedTutors.length} verified instructor connections.
                                </p>
                            </div>
                            <div className="flex gap-4 relative z-10">
                                <Link href="/post-requirement" className="group relative flex items-center gap-4 px-12 py-6 bg-primary text-white rounded-[2rem] font-black text-[11px] tracking-widest shadow-2xl shadow-primary/30 hover:scale-[1.05] transition-all active:scale-95 uppercase leading-none overflow-hidden">
                                   <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out"></div>
                                   <Target size={18} strokeWidth={3} />
                                   DEPLOY NEW MANDATE
                                </Link>
                            </div>
                        </div>

                        {/* Student Metrics Bento Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
                            {[
                                { label: "Academic Credits", val: studentData?.credits || 0, icon: Zap, theme: "text-amber-500" },
                                { label: "Active Pipelines", val: activeLeads.length || 0, icon: Briefcase, theme: "text-blue-500" },
                                { label: "Verified Faculty", val: unlockedTutors.length || 0, icon: BadgeCheck, theme: "text-emerald-500" },
                                { label: "Discovery Rank", val: "A1", icon: Trophy, theme: "text-purple-500" }
                            ].map((stat, i) => (
                                <div key={i} className="group p-10 rounded-[3rem] bg-surface-dark/40 backdrop-blur-md border border-border-dark border-b-4 hover:border-amber-500/50 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 relative overflow-hidden">
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

                        {/* Requirement Pipeline (Active Needs) */}
                        {activeLeads.length > 0 && (
                            <div className="relative mb-24">
                                <div className="flex items-center justify-between mb-12">
                                    <div>
                                        <div className="inline-flex items-center gap-2 text-emerald-500 mb-2">
                                            <div className="size-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                                            <span className="text-[10px] font-black uppercase tracking-[0.4em]">High Precision Matches</span>
                                        </div>
                                        <h2 className="text-4xl font-black text-white mb-2 uppercase italic tracking-tighter">Active <span className="text-emerald-500 not-italic font-serif font-light lowercase">Pipeline.</span></h2>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {activeLeads.map((lead) => (
                                        <div key={lead.id} className="group relative bg-surface-dark/20 backdrop-blur-sm border border-emerald-500/10 rounded-[3.5rem] p-12 hover:bg-surface-dark/40 hover:border-emerald-500/30 transition-all duration-500 overflow-hidden border-b-8">
                                            <div className="relative z-10 flex flex-col h-full">
                                                <div className="mb-10 flex justify-between items-center">
                                                    <div className="px-6 py-2.5 bg-emerald-500/10 text-emerald-500 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
                                                        {lead.subject}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-[10px] font-black text-on-surface-dark/20 uppercase tracking-widest leading-none">
                                                        <User size={14} />
                                                        {lead.unlockCount} INSTRUCTORS SYNCED
                                                    </div>
                                                </div>

                                                <h3 className="text-3xl font-black text-white mb-8 leading-[1.1] tracking-tighter group-hover:text-emerald-400 transition-colors duration-300 uppercase italic">
                                                    "{lead.description}"
                                                </h3>

                                                <div className="flex flex-wrap gap-6 mb-12">
                                                    <div className="flex items-center gap-3 text-[10px] font-black text-on-surface-dark/40 uppercase tracking-widest italic">
                                                        <Search size={14} className="text-emerald-500" />
                                                        Location: {lead.location}
                                                    </div>
                                                    <div className="flex items-center gap-3 text-[10px] font-black text-on-surface-dark/40 uppercase tracking-widest italic">
                                                        <Clock size={14} className="text-emerald-500" />
                                                        Status: Optimizing
                                                    </div>
                                                </div>

                                                <button
                                                    onClick={() => handleCloseLead(lead.id)}
                                                    className="w-full bg-emerald-500 text-white py-6 rounded-[2rem] font-black text-[11px] tracking-[0.4em] uppercase transition-all flex items-center justify-center gap-4 hover:shadow-2xl shadow-emerald-500/20 active:scale-95 leading-none"
                                                >
                                                    <CheckCircle2 size={18} strokeWidth={3} />
                                                    FINALIZE SYNC / CLOSE MANDATE
                                                </button>
                                            </div>
                                            <div className="absolute -bottom-24 -right-24 size-64 bg-emerald-500/5 rounded-full blur-[100px] group-hover:bg-emerald-500/10 transition-colors pointer-events-none"></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Elite Connections (Tutors) */}
                        <div className="relative">
                            <div className="flex items-center justify-between mb-12 flex-wrap gap-6">
                                <div>
                                    <div className="inline-flex items-center gap-2 text-primary mb-2">
                                        <div className="size-2 bg-primary rounded-full shadow-[0_0_10px_rgba(37,99,235,0.5)]"></div>
                                        <span className="text-[10px] font-black uppercase tracking-[0.4em]">Acquired Scholarly Assets</span>
                                    </div>
                                    <h2 className="text-4xl font-black text-white mb-2 uppercase italic tracking-tighter text-white">Elite <span className="text-primary not-italic font-serif font-light lowercase">Matchmaking.</span></h2>
                                </div>
                            </div>

                            {loading ? (
                                <div className="py-40 flex flex-col items-center justify-center opacity-50 bg-surface-dark/20 rounded-[4rem] border border-border-dark">
                                    <div className="size-20 rounded-[2rem] border-[8px] border-amber-500/5 border-t-amber-500 animate-spin mb-10 shadow-2xl"></div>
                                    <p className="font-black text-[11px] uppercase tracking-[0.5em] italic">Re-establishing Neural Sync...</p>
                                </div>
                            ) : unlockedTutors.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    {unlockedTutors.map((tutor) => (
                                        <div key={tutor.id} className="group relative bg-surface-dark/40 backdrop-blur-md border border-border-dark rounded-[3.5rem] p-12 hover:shadow-[0_40px_100px_-20px_rgba(37,99,235,0.15)] hover:border-primary/40 transition-all duration-700 overflow-hidden border-b-8">
                                            {/* ID Marker */}
                                            <div className="absolute top-0 left-0 p-8">
                                               <div className="text-[10px] font-black text-on-surface-dark/10 uppercase tracking-widest leading-none">TERMINAL_{tutor.id.substring(0,6)}</div>
                                            </div>

                                            <div className="relative z-10 flex flex-col h-full">
                                                <div className="flex items-center gap-8 mb-12">
                                                    <div className="size-24 rounded-[2.5rem] bg-gradient-to-br from-primary to-blue-800 text-white flex items-center justify-center font-black text-5xl italic tracking-tighter shadow-2xl relative overflow-hidden border border-white/10 group-hover:scale-105 transition-transform duration-700">
                                                        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                                        {tutor.name[0]}
                                                    </div>
                                                    <div>
                                                        <h3 className="text-3xl font-black uppercase italic tracking-tighter mb-2 text-white">{tutor.name}</h3>
                                                        <div className="flex items-center gap-3">
                                                            <div className="size-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                                                            <p className="text-[11px] font-black text-primary uppercase tracking-[0.2em] italic">
                                                                {tutor.tutorListing?.subjects?.slice(0,1).join('') || 'Verified Subject Master'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="bg-background-dark/80 rounded-[2.5rem] p-10 border border-border-dark mb-12 shadow-inner group-hover:border-primary/20 transition-colors">
                                                    <div className="grid grid-cols-1 gap-8">
                                                        <a href={`tel:${tutor.phone}`} className="flex items-center gap-5 group/contact hover:translate-x-2 transition-transform">
                                                            <div className="size-10 rounded-xl bg-surface-dark border border-white/5 flex items-center justify-center text-on-surface-dark/40 group-hover/contact:text-primary transition-colors">
                                                                <Phone size={18} strokeWidth={2.5} />
                                                            </div>
                                                            <div className="flex flex-col leading-none">
                                                                <span className="text-[9px] font-black uppercase tracking-[0.3em] opacity-20 mb-1 leading-none">Voice Protocol</span>
                                                                <span className="text-sm font-black tracking-widest uppercase text-white/80">{tutor.phone}</span>
                                                            </div>
                                                        </a>
                                                        <a href={`mailto:${tutor.email}`} className="flex items-center gap-5 group/contact hover:translate-x-2 transition-transform">
                                                            <div className="size-10 rounded-xl bg-surface-dark border border-white/5 flex items-center justify-center text-on-surface-dark/40 group-hover/contact:text-primary transition-colors">
                                                                <Mail size={18} strokeWidth={2.5} />
                                                            </div>
                                                            <div className="flex flex-col leading-none">
                                                                <span className="text-[9px] font-black uppercase tracking-[0.3em] opacity-20 mb-1 leading-none">Secure Transfer</span>
                                                                <span className="text-sm font-black tracking-widest uppercase text-white/80 truncate max-w-[200px]">{tutor.email}</span>
                                                            </div>
                                                        </a>
                                                    </div>
                                                </div>

                                                <div className="flex gap-4">
                                                    <a href={`https://wa.me/${tutor.phone}`} className="flex-1 bg-emerald-500 text-white py-6 rounded-2xl flex items-center justify-center gap-4 text-[11px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-emerald-500/20 active:scale-95 transition-all leading-none group-hover:shadow-emerald-500/40">
                                                        <MessageSquare size={18} strokeWidth={3} fill="currentColor" className="opacity-40" />
                                                        WHATSAPP SYNC
                                                    </a>
                                                    <Link href={`/tutor/${tutor.id}`} className="size-18 bg-surface-dark border border-border-dark rounded-2xl flex items-center justify-center hover:bg-primary/10 hover:border-primary/40 transition-all active:scale-95 shadow-xl text-white group-hover:scale-105">
                                                        <User size={24} strokeWidth={2.5} />
                                                    </Link>
                                                </div>
                                            </div>
                                            {/* Decorative Elements */}
                                            <div className="absolute -bottom-24 -right-24 size-80 bg-primary/5 rounded-full blur-[120px] group-hover:bg-primary/10 transition-colors duration-700 pointer-events-none"></div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-40 text-center bg-surface-dark/10 rounded-[5rem] border-4 border-dashed border-border-dark p-20 relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <div className="size-32 rounded-[3.5rem] bg-surface-dark/80 backdrop-blur-xl shadow-2xl flex items-center justify-center mx-auto mb-12 relative animate-float transition-all duration-700 group-hover:scale-110 group-hover:-rotate-6 border border-border-dark">
                                        <Search size={48} className="text-on-surface-dark/10 group-hover:text-amber-500 transition-colors" strokeWidth={1} />
                                    </div>
                                    <h3 className="text-3xl font-black mb-6 uppercase italic tracking-tighter text-white">Discovery <span className="text-amber-500 not-italic font-serif font-light lowercase">Protocol.</span></h3>
                                    <p className="text-on-surface-dark/40 max-w-sm mx-auto font-medium text-sm leading-relaxed mb-16 italic uppercase tracking-widest leading-loose">"The academy is vast. Initiate synchronization to identify the pedagogical partner that matches your mandate."</p>
                                    <Link href="/search?role=TUTOR" className="inline-flex items-center gap-6 px-16 py-8 bg-amber-500 text-white rounded-[2.5rem] font-black text-[13px] tracking-[0.4em] uppercase shadow-2xl shadow-amber-500/20 active:scale-95 transition-all group-hover:shadow-amber-500/40 relative z-10 leading-none">
                                        EXPLORE EXPERTS
                                        <Target size={18} strokeWidth={3} />
                                    </Link>
                                </div>
                            )}
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
            <div className="flex items-center justify-center min-h-screen bg-background-dark font-sans overflow-hidden relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[400px] bg-amber-500/10 rounded-full blur-[100px] animate-pulse"></div>
                <div className="flex flex-col items-center relative z-10">
                    <div className="size-20 bg-surface-dark border border-border-dark rounded-3xl flex items-center justify-center mb-10 shadow-2xl animate-spin-slow">
                         <div className="size-10 bg-amber-500/20 rounded-xl flex items-center justify-center">
                            <Zap size={24} className="text-amber-500 animate-pulse" />
                         </div>
                    </div>
                    <p className="font-black text-[11px] text-on-surface-dark/20 uppercase tracking-[0.5em] italic animate-pulse">Initializing Portal Terminal...</p>
                </div>
            </div>
        }>
            <StudentDashboardContent />
        </Suspense>
    );
}
