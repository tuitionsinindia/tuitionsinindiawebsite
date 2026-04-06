"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
    LayoutDashboard, 
    Users, 
    CreditCard, 
    ShieldCheck, 
    RefreshCcw, 
    LogOut, 
    School, 
    UserCheck, 
    Database, 
    TrendingUp, 
    FileText, 
    Search, 
    Bell, 
    Settings, 
    CheckCircle2, 
    XCircle, 
    BarChart3, 
    Boxes, 
    Activity, 
    Cpu, 
    Target, 
    ArrowRight, 
    Briefcase,
    BadgeCheck,
    Wallet,
    Phone,
    Mail,
    User
} from "lucide-react";

function AdminDashboardContent() {
    const router = useRouter();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMetrics();
    }, []);

    const fetchMetrics = async () => {
        try {
            const res = await fetch("/api/admin/metrics");
            const json = await res.json();
            if (json.success) {
                setData(json);
            }
        } catch (err) {
            console.error("Failed to load metrics", err);
        } finally {
            setLoading(false);
        }
    };

    const handleApproveTutor = async (tutorId) => {
        if (!confirm("Approve this tutor as a Verified Expert?")) return;

        try {
            const res = await fetch("/api/admin/tutor/approve", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ tutorId, isApproved: true })
            });
            const json = await res.json();
            if (json.success) {
                alert("Tutor Approved!");
                fetchMetrics(); 
            } else {
                alert("Failed to approve tutor");
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="flex h-screen bg-background-dark font-sans text-on-background-dark selection:bg-primary/20 selection:text-primary overflow-hidden">
            {/* Master Command Sidebar */}
            <aside className="w-80 border-r border-border-dark bg-surface-dark/40 backdrop-blur-3xl flex flex-col hidden lg:flex shadow-2xl z-50 overflow-hidden">
                <div className="p-10 border-b border-border-dark flex flex-col gap-2">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="size-10 bg-primary rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-lg shadow-primary/20">
                            <ShieldCheck size={24} strokeWidth={2.5} className="text-white" />
                        </div>
                        <div className="flex flex-col leading-none">
                            <span className="text-xl font-black tracking-tighter uppercase italic text-white leading-none mb-1">tuitionsinindia</span>
                            <span className="text-[10px] font-black text-primary/40 tracking-[0.4em] uppercase leading-none">Admin Hub</span>
                        </div>
                    </Link>
                </div>

                <div className="p-8 flex-1 overflow-y-auto space-y-12">
                    <div className="p-6 bg-background-dark/50 rounded-[2.5rem] border border-border-dark backdrop-blur-sm group hover:border-primary/20 transition-all">
                        <div className="flex items-center gap-4">
                            <div className="size-14 rounded-2xl bg-gradient-to-br from-primary to-blue-800 flex items-center justify-center text-white shadow-2xl relative overflow-hidden group-hover:scale-105 transition-transform duration-500">
                                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <span className="font-black text-2xl italic tracking-tighter">A</span>
                            </div>
                            <div className="overflow-hidden">
                                <p className="font-black text-white text-sm uppercase italic tracking-tighter leading-none mb-1.5">Super Admin</p>
                                <p className="text-[9px] text-primary/60 font-black uppercase tracking-[0.25em] leading-none">Master Controller</p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-[10px] font-black text-on-surface-dark/20 uppercase tracking-[0.4em] mb-6 italic px-4">System Oversight</h4>
                        <nav className="space-y-3">
                            <a href="#" className="flex items-center gap-4 px-6 py-5 bg-primary text-white rounded-2xl font-black transition-all shadow-xl shadow-primary/20 hover:shadow-primary/30 group text-[11px] tracking-widest active:scale-95 leading-none">
                                <LayoutDashboard size={18} strokeWidth={2.5} />
                                CENTRAL ANALYTICS
                                <ArrowRight size={14} strokeWidth={3} className="ml-auto opacity-40 group-hover:translate-x-1 transition-transform" />
                            </a>
                            {[
                                { icon: Users, label: "USER MANAGEMENT" },
                                { icon: CreditCard, label: "ECONOMIC LEDGER" },
                                { icon: Activity, label: "SYSTEM STATUS" },
                                { icon: Database, label: "KNOWLEDGE REPO" }
                            ].map((item, i) => (
                                <a key={i} href="#" className="flex items-center gap-4 px-6 py-5 text-on-surface-dark/40 hover:bg-surface-dark hover:text-primary rounded-2xl transition-all font-black group text-[11px] tracking-widest border border-transparent hover:border-border-dark active:scale-95 leading-none">
                                    <item.icon size={18} strokeWidth={2.5} className="opacity-40 group-hover:opacity-100 transition-opacity" />
                                    {item.label}
                                </a>
                            ))}
                        </nav>
                    </div>
                </div>

                <div className="p-8 mt-auto border-t border-border-dark bg-background-dark/20">
                    <Link href="/" className="flex items-center justify-center gap-4 px-6 py-5 bg-red-500/5 text-red-500 hover:bg-red-500 hover:text-white rounded-[2rem] transition-all font-black text-[10px] tracking-[0.4em] uppercase group leading-none border border-red-500/10">
                        <LogOut size={16} strokeWidth={3} className="transition-transform group-hover:-translate-x-1" />
                        EXIT SESSION
                    </Link>
                </div>
            </aside>

            {/* Tactical Content Area */}
            <main className="flex-1 overflow-y-auto relative bg-background-dark">
                <header className="sticky top-0 z-40 w-full px-6 md:px-12 py-10 flex items-center justify-between border-b border-border-dark bg-background-dark/80 backdrop-blur-2xl">
                    <div className="relative">
                        <div className="absolute -left-12 top-0 text-[120px] font-black text-white/5 leading-none tracking-tighter italic select-none pointer-events-none uppercase">CHRT</div>
                        <div className="flex items-center gap-3 mb-3 relative z-10">
                            <div className="size-2 bg-primary rounded-full animate-pulse shadow-[0_0_10px_rgba(37,99,235,0.5)]"></div>
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary italic">Global Intelligence Grid</p>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white uppercase italic leading-none relative z-10">
                            Master <span className="text-primary underline decoration-primary/20 decoration-8 underline-offset-8">Terminal.</span>
                        </h1>
                    </div>
                    <div className="flex items-center gap-4 relative z-10">
                        <button onClick={fetchMetrics} className="flex items-center gap-4 px-8 py-5 bg-surface-dark border border-border-dark text-white rounded-2xl font-black shadow-sm hover:shadow-2xl transition-all active:scale-95 text-[11px] tracking-widest uppercase group leading-none">
                            <RefreshCcw size={18} strokeWidth={3} className="text-primary group-active:rotate-180 transition-transform duration-700" />
                            SYNC ANALYTICS
                        </button>
                    </div>
                </header>

                <div className="px-6 md:px-12 pb-24 pt-12">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-40 bg-surface-dark/20 backdrop-blur-xl rounded-[4rem] border border-border-dark shadow-2xl relative overflow-hidden">
                             <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent animate-pulse"></div>
                            <div className="relative z-10">
                                <div className="size-24 border-[10px] border-primary/5 border-t-primary rounded-[3rem] animate-spin shadow-2xl"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="size-3 bg-primary rounded-full animate-pulse shadow-[0_0_15px_rgba(37,99,235,0.8)]"></div>
                                </div>
                            </div>
                            <p className="mt-12 font-black text-[12px] uppercase tracking-[0.6em] text-primary italic animate-pulse relative z-10">Hydrating Neural Assets...</p>
                        </div>
                    ) : (
                        <>
                            {/* Bento Metrics Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                                {[
                                    { label: 'Total Experts', value: data?.metrics.totalTutors || 0, icon: GraduationCap, color: 'text-primary', theme: 'primary' },
                                    { label: 'Verified Scholars', value: data?.metrics.totalStudents || 0, icon: UserCheck, color: 'text-amber-500', theme: 'amber' },
                                    { label: 'Gross Revenue', value: `₹${data?.metrics.totalRevenue || 0}`, icon: Wallet, color: 'text-emerald-500', theme: 'emerald' },
                                    { label: 'Mandate Volume', value: data?.metrics.activeLeads || 0, icon: Target, color: 'text-purple-500', theme: 'purple' }
                                ].map((stat, i) => (
                                    <div key={i} className="group p-10 bg-surface-dark/40 backdrop-blur-md rounded-[3rem] border border-border-dark border-b-4 hover:border-primary/50 shadow-sm hover:shadow-[0_40px_100px_-20px_rgba(37,99,235,0.15)] transition-all duration-500 relative overflow-hidden flex flex-col justify-between h-56">
                                        <div className="flex items-center justify-between relative z-10 transition-transform group-hover:-translate-y-1">
                                            <p className="text-[10px] font-black text-on-surface-dark/30 uppercase tracking-[0.4em] italic leading-none">{stat.label}</p>
                                            <div className={`p-4 bg-background-dark/50 border border-border-dark rounded-2xl group-hover:scale-110 transition-transform duration-500 ${stat.color}`}>
                                                <stat.icon size={24} strokeWidth={2.5} />
                                            </div>
                                        </div>
                                        <p className="text-5xl font-black text-white tracking-tighter italic uppercase leading-none relative z-10 group-hover:scale-105 origin-left transition-transform duration-500">
                                            {stat.value}
                                        </p>
                                        <div className="absolute -right-8 -bottom-8 opacity-[0.02] group-hover:opacity-[0.08] transition-all duration-1000 group-hover:-rotate-12 group-hover:scale-150 text-white pointer-events-none">
                                            <stat.icon size={200} strokeWidth={1} />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
                                {/* Verification Command Center */}
                                <section className="bg-surface-dark/40 backdrop-blur-xl rounded-[4rem] border border-border-dark shadow-2xl flex flex-col h-[650px] relative overflow-hidden group border-b-8 hover:border-primary/40 transition-all duration-700">
                                    <div className="p-12 border-b border-border-dark bg-gradient-to-br from-surface-dark/80 to-background-dark/50 relative z-10">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="flex items-center gap-3 mb-3">
                                                    <BadgeCheck size={20} className="text-primary" strokeWidth={2.5} />
                                                    <h3 className="text-2xl font-black tracking-tight text-white uppercase italic">Verification Nexus</h3>
                                                </div>
                                                <p className="text-[10px] text-primary/40 font-black uppercase tracking-[0.4em] italic">Awaiting Master Clearance</p>
                                            </div>
                                            <div className="size-14 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-center text-primary font-black italic shadow-inner">
                                                {data?.pendingTutors?.length || 0}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="overflow-y-auto p-8 flex-1 space-y-6 relative z-10 custom-scrollbar">
                                        {data?.pendingTutors && data.pendingTutors.length > 0 ? (
                                            data.pendingTutors.map(tutor => (
                                                <div key={tutor.id} className="p-8 bg-background-dark/40 border border-border-dark rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-8 hover:bg-surface-dark hover:border-primary/30 transition-all duration-500 shadow-sm hover:shadow-2xl border-b-4">
                                                    <div className="flex items-center gap-6 flex-1 min-w-0 w-full">
                                                        <div className="size-16 rounded-2xl bg-gradient-to-br from-primary to-blue-900 flex items-center justify-center text-white font-black text-2xl italic shadow-2xl group-hover:scale-105 transition-transform">
                                                            {tutor.name?.[0] || tutor.email?.[0]}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="font-black text-white truncate text-xl tracking-tighter uppercase italic leading-none mb-2">{tutor.name || "UNIDENTIFIED_USER"}</p>
                                                            <div className="flex flex-wrap gap-4">
                                                                <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-on-surface-dark/40 italic">
                                                                    <Mail size={12} className="text-primary" /> {tutor.email}
                                                                </span>
                                                                <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-on-surface-dark/40 italic">
                                                                    <Phone size={12} className="text-primary" /> {tutor.phone}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => handleApproveTutor(tutor.id)}
                                                        className="w-full md:w-auto px-10 py-5 bg-primary text-white text-[11px] font-black rounded-2xl hover:bg-white hover:text-primary transition-all shadow-2xl shadow-primary/20 active:scale-95 uppercase tracking-[0.3em] italic leading-none border border-transparent hover:border-primary">
                                                        EXECUTE SYNC
                                                    </button>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="h-full flex flex-col items-center justify-center text-on-surface-dark/10 opacity-50">
                                                <div className="size-24 rounded-[2.5rem] bg-surface-dark border border-border-dark flex items-center justify-center mb-8 shadow-inner animate-pulse">
                                                    <Boxes size={48} strokeWidth={1} />
                                                </div>
                                                <p className="font-black text-[12px] uppercase tracking-[0.8em] italic">Queue Optimized</p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="absolute -bottom-24 -right-24 size-96 bg-primary/5 rounded-full blur-[150px] pointer-events-none group-hover:bg-primary/10 transition-colors"></div>
                                </section>

                                {/* Economic Ledger */}
                                <section className="bg-surface-dark/40 backdrop-blur-xl rounded-[4rem] border border-border-dark shadow-2xl flex flex-col h-[650px] relative overflow-hidden group border-b-8 hover:border-emerald-500/40 transition-all duration-700">
                                    <div className="p-12 border-b border-border-dark bg-gradient-to-br from-surface-dark/80 to-background-dark/50 relative z-10">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="flex items-center gap-3 mb-3">
                                                    <BarChart3 size={20} className="text-emerald-500" strokeWidth={2.5} />
                                                    <h3 className="text-2xl font-black tracking-tight text-white uppercase italic">Economic Stream</h3>
                                                </div>
                                                <p className="text-[10px] text-emerald-500/40 font-black uppercase tracking-[0.4em] italic">Real-time Asset Transfer</p>
                                            </div>
                                            <div className="size-14 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 flex items-center justify-center text-emerald-500 font-black italic shadow-inner">
                                                <CreditCard size={24} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="overflow-y-auto p-8 flex-1 space-y-6 relative z-10 custom-scrollbar">
                                        {data?.recentTransactions && data.recentTransactions.length > 0 ? (
                                            data.recentTransactions.map(txn => (
                                                <div key={txn.id} className="p-8 bg-background-dark/40 border border-border-dark rounded-[2.5rem] flex items-center gap-8 hover:bg-surface-dark hover:border-emerald-500/30 transition-all duration-500 shadow-sm hover:shadow-2xl border-b-4 group/txn">
                                                    <div className="size-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shadow-xl group-hover/txn:scale-110 transition-transform">
                                                        <Wallet size={24} strokeWidth={2.5} />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-baseline gap-3 mb-2">
                                                            <p className="text-3xl font-black text-white tracking-tighter leading-none italic uppercase">₹{txn.amount}</p>
                                                            <div className="px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-[9px] font-black uppercase tracking-widest italic border border-emerald-500/20 leading-none">STRATEGIC_SYNC</div>
                                                        </div>
                                                        <p className="text-[10px] text-on-surface-dark/40 font-black uppercase tracking-widest italic leading-none">
                                                            {txn.user?.name || 'INSTITUTIONAL_ACTOR'} • <span className="text-primary">{txn.user?.role || "GUEST"}</span>
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="px-5 py-3 bg-background-dark rounded-2xl border border-border-dark shadow-inner">
                                                            <p className="text-[10px] font-black text-white uppercase tracking-[0.2em] italic leading-none mb-1">STAMP</p>
                                                            <p className="text-[9px] font-black text-on-surface-dark/20 uppercase tracking-widest leading-none">
                                                                {new Date(txn.createdAt).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: '2-digit' }).toUpperCase()}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="h-full flex flex-col items-center justify-center text-on-surface-dark/10 opacity-50">
                                                <div className="size-24 rounded-[2.5rem] bg-surface-dark border border-border-dark flex items-center justify-center mb-8 shadow-inner animate-pulse">
                                                    <Activity size={48} strokeWidth={1} />
                                                </div>
                                                <p className="font-black text-[12px] uppercase tracking-[0.8em] italic">Flow Static</p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="absolute -bottom-24 -right-24 size-96 bg-emerald-500/5 rounded-full blur-[150px] pointer-events-none group-hover:bg-emerald-500/10 transition-colors"></div>
                                </section>
                            </div>
                        </>
                    )}
                </div>
            </main>
        </div>
    );
}

export default function AdminDashboard() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen bg-background-dark font-sans overflow-hidden relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[400px] bg-primary/10 rounded-full blur-[100px] animate-pulse"></div>
                <div className="flex flex-col items-center relative z-10">
                    <div className="size-24 bg-surface-dark border border-border-dark rounded-[2.5rem] flex items-center justify-center mb-10 shadow-2xl animate-spin-slow">
                         <div className="size-12 bg-primary/20 rounded-2xl flex items-center justify-center">
                            <Cpu size={28} className="text-primary animate-pulse" />
                         </div>
                    </div>
                    <p className="font-black text-[12px] text-on-surface-dark/20 uppercase tracking-[0.6em] italic animate-pulse">Initializing Master Protocol...</p>
                </div>
            </div>
        }>
            <AdminDashboardContent />
        </Suspense>
    );
}
