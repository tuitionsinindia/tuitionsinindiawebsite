"use client";

import { useState } from "react";
import { 
    Activity, 
    Zap, 
    ShieldCheck, 
    Lock, 
    Unlock, 
    ExternalLink, 
    Trash2, 
    Globe, 
    Cpu,
    Target,
    Loader2,
    CheckCircle2,
    Users,
    Search,
    BadgeCheck,
    Phone,
    MessageCircle,
    Star
} from "lucide-react";

/**
 * Production Audit Hub & Mission Control
 * Definitively verify Matching (v3.1) and Messaging Protocols on the live server.
 */
export default function ProductionAuditHub() {
    const [phase, setPhase] = useState(0); // 0: Ready, 1: Free Seeded, 2: Pro Upgraded
    const [loading, setLoading] = useState(false);
    const [logs, setLogs] = useState([]);
    const [nodeData, setNodeData] = useState(null);

    const addLog = (msg, type = 'info') => {
        setLogs(prev => [...prev, { msg, type, time: new Date().toLocaleTimeString() }]);
    };

    const triggerPhase = async (p) => {
        setLoading(true);
        addLog(`COMMAND_EXECUTED: PHASE_${p}`, 'system');
        
        try {
            const res = await fetch(`/api/admin/audit-seed?phase=${p}&key=academy_audit_2026`);
            const data = await res.json();
            
            if (!res.ok) throw new Error(data.error || "UNAUTHORIZED_ACCESS");

            addLog(data.message, 'success');
            if (p === 1) {
                setNodeData(data);
                setPhase(1);
            } else if (p === 2) {
                setPhase(2);
            } else if (p === 0) {
                setPhase(0);
                setNodeData(null);
            }
        } catch (err) {
            addLog(`CRITICAL_FAILURE: ${err.message}`, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] p-6 md:p-20 font-sans text-white selection:bg-blue-500/30">
            <div className="max-w-6xl mx-auto space-y-10">
                
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 border-b border-white/10 pb-12">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-3 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full">
                            <Globe size={10} className="text-blue-500 animate-pulse" />
                            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-blue-500">Live Production Sync</span>
                        </div>
                        <h1 className="text-6xl font-black italic uppercase tracking-tighter leading-none">
                            Audit <span className="text-blue-500">Manifest.</span>
                        </h1>
                        <p className="text-xs font-medium text-white/40 uppercase tracking-widest italic">Operational Security Protocol (OPS-MKT-PROD)</p>
                    </div>
                    
                    <button 
                        onClick={() => triggerPhase(0)}
                        className="p-5 bg-white/5 border border-white/10 rounded-2xl hover:bg-red-500 hover:border-red-600 transition-all group"
                        title="Scrub Production Data"
                    >
                        <Trash2 size={20} className="text-white/40 group-hover:text-white" />
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    
                    {/* Left Column: Mission Controls */}
                    <div className="space-y-8">
                        {/* Control Core */}
                        <div className="bg-[#0A0A0A] border border-white/5 rounded-[3rem] p-10 space-y-10 shadow-2xl">
                            <div className="flex items-center gap-3">
                                <Cpu size={16} className="text-blue-500" />
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Mission Control Core</span>
                            </div>

                            <div className="space-y-4">
                                <button 
                                    onClick={() => triggerPhase(1)}
                                    disabled={loading || phase > 0}
                                    className={`w-full p-8 rounded-3xl border text-left transition-all relative overflow-hidden group ${
                                        phase >= 1 ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-white/5 border-white/5 hover:border-blue-500/40 hover:bg-blue-500/5'
                                    }`}
                                >
                                    <div className="flex items-center gap-6">
                                        <div className={`size-14 rounded-2xl flex items-center justify-center ${phase >= 1 ? 'bg-emerald-500 text-white' : 'bg-white/10 text-white/40'}`}>
                                            <Users size={20} strokeWidth={3} />
                                        </div>
                                        <div>
                                            <p className="text-xl font-black uppercase italic leading-none mb-2">Phase_1: Node Seeding</p>
                                            <p className="text-[9px] font-black uppercase tracking-widest text-white/20 italic">Initialize Triad: Student-Tutor-Institute.</p>
                                        </div>
                                    </div>
                                    {phase >= 1 && <CheckCircle2 className="absolute top-1/2 -translate-y-1/2 right-8 text-emerald-500" size={24} />}
                                </button>

                                <button 
                                    onClick={() => triggerPhase(2)}
                                    disabled={loading || phase !== 1}
                                    className={`w-full p-8 rounded-3xl border text-left transition-all relative overflow-hidden group ${
                                        phase >= 2 ? 'bg-blue-600 border-blue-700' : 'bg-white/5 border-white/5'
                                    } ${phase === 1 ? 'hover:border-blue-500' : 'opacity-20 grayscale'}`}
                                >
                                    <div className="flex items-center gap-6">
                                        <div className={`size-14 rounded-2xl flex items-center justify-center ${phase >= 2 ? 'bg-white text-blue-600' : 'bg-white/10 text-white/40'}`}>
                                            <Zap size={20} strokeWidth={3} />
                                        </div>
                                        <div>
                                            <p className="text-xl font-black uppercase italic leading-none mb-2 text-white">Phase_2: Elite Upgrade</p>
                                            <p className="text-[9px] font-black uppercase tracking-widest text-white/40 italic">Elevate Nodes to PRO Subscription.</p>
                                        </div>
                                    </div>
                                    {phase >= 2 && <CheckCircle2 className="absolute top-1/2 -translate-y-1/2 right-8 text-white" size={24} />}
                                </button>
                            </div>
                        </div>

                        {/* Node Navigator */}
                        {nodeData && (
                            <div className="bg-[#0A0A0A] border border-white/5 rounded-[3rem] p-10 space-y-8 animate-in fade-in duration-500">
                                <div className="flex items-center gap-3">
                                    <Target size={16} className="text-amber-500" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Node Navigator</span>
                                </div>
                                <div className="space-y-3">
                                    {[
                                        { l: "Aman (Student)", id: nodeData.studentId, path: 'student' },
                                        { l: "Rajesh (Tutor)", id: nodeData.tutorId, path: 'tutor' },
                                        { l: "Elite Academy", id: nodeData.instituteId, path: 'tutor' }
                                    ].map((n, i) => (
                                        <a 
                                            key={i}
                                            href={`/dashboard/${n.path}?${n.path}Id=${n.id}`}
                                            target="_blank"
                                            className="flex items-center justify-between p-5 bg-white/5 border border-white/5 rounded-2xl hover:bg-blue-600 group transition-all"
                                        >
                                            <span className="text-[10px] font-black uppercase tracking-widest italic">{n.l}</span>
                                            <ExternalLink size={14} className="opacity-20 group-hover:opacity-100 transition-opacity" />
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Signal Matrix Logs */}
                    <div className="bg-[#0A0A0A] border border-white/5 rounded-[3rem] p-10 flex flex-col h-[650px] shadow-2xl relative overflow-hidden">
                        <div className="flex items-center gap-3 mb-8 border-b border-white/5 pb-6">
                            <Activity size={16} className="text-white/20" />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Signal_Matrix.log</span>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto space-y-5 font-black text-[10px] uppercase tracking-[0.2em] italic scrollbar-hide pr-2">
                            {logs.length === 0 && <div className="text-white/5">Awaiting Signal Ignition...</div>}
                            {logs.map((l, i) => (
                                <div key={i} className={`flex gap-5 ${
                                    l.type === 'success' ? 'text-emerald-500' : 
                                    l.type === 'error' ? 'text-red-500' : 
                                    l.type === 'system' ? 'text-blue-500' : 
                                    'text-white/30'
                                }`}>
                                    <span className="opacity-20">[{l.time}]</span>
                                    <span>{l.msg}</span>
                                </div>
                            ))}
                            {loading && (
                                <div className="flex items-center gap-3 text-blue-500 animate-pulse">
                                    <Loader2 className="animate-spin" size={12} />
                                    <span>>>> Establishing Peer Encryption...</span>
                                </div>
                            )}
                        </div>

                        {/* Status Guard */}
                        <div className="mt-10 p-6 bg-white/5 border border-white/10 rounded-3xl flex items-center gap-6">
                            <div className={`size-12 rounded-xl flex items-center justify-center ${phase > 0 ? 'bg-emerald-500 text-white' : 'bg-white/5 text-white/20'}`}>
                                {phase === 0 ? <Lock size={18} /> : <ShieldCheck size={18} />}
                            </div>
                            <div>
                                <p className="text-[8px] font-black uppercase tracking-widest text-white/20 leading-none mb-1 text-center">Protocol Integrity</p>
                                <p className="text-xl font-black uppercase italic tracking-tighter leading-none text-center">
                                    {phase === 0 ? 'LOCKED_MKT' : phase === 1 ? 'FREE_NODES' : 'ELITE_COMM'}
                                </p>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Footer Info */}
                <div className="flex flex-col items-center gap-4 text-center py-10 opacity-20 group hover:opacity-100 transition-opacity">
                    <p className="text-[9px] font-black uppercase tracking-[0.6em] italic leading-none">TuitionsInIndia Academy Intelligence Operations</p>
                    <div className="flex items-center gap-2">
                        <div className="size-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                        <span className="text-[8px] font-black uppercase tracking-[0.2em]">Live Connection Encrypted</span>
                    </div>
                </div>

            </div>
        </div>
    );
}
