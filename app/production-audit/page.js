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
    Users
} from "lucide-react";

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
            
            if (!res.ok) throw new Error(data.error || "U_AUTH_FAIL");

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
        <div className="min-h-screen bg-background-dark p-8 md:p-24 font-sans text-white">
            <div className="max-w-6xl mx-auto space-y-12">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-end gap-12 border-b-2 border-border-dark pb-16">
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full flex items-center gap-3">
                                <Globe size={12} className="text-blue-500 animate-pulse" />
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500 italic">Production Node Sync</span>
                            </div>
                        </div>
                        <h1 className="text-7xl font-black italic uppercase tracking-tighter leading-none">Marketplace <br/><span className="text-blue-500 underline decoration-blue-500/10">Audit Hub.</span></h1>
                    </div>
                    <div className="flex gap-4">
                        <button 
                            onClick={() => triggerPhase(0)}
                            className="p-6 bg-white/5 border-2 border-white/5 rounded-3xl hover:bg-red-500 hover:text-white transition-all group"
                            title="Scrub Production Data"
                        >
                            <Trash2 size={24} className="opacity-40 group-hover:opacity-100" />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    
                    {/* Control Core */}
                    <div className="space-y-8">
                        
                        <div className="bg-surface-dark border-2 border-border-dark rounded-[4rem] p-12 space-y-12 relative overflow-hidden border-b-8">
                            <div className="flex items-center gap-4 border-b border-border-dark pb-8">
                                <Cpu size={20} className="text-blue-500" />
                                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 italic font-black leading-none">Mission Control System</h3>
                            </div>
                            
                            <div className="grid grid-cols-1 gap-6">
                                {/* PHASE 1: FREE SEED */}
                                <button 
                                    onClick={() => triggerPhase(1)}
                                    disabled={loading || phase > 0}
                                    className={`p-8 rounded-[2.5rem] border-2 flex flex-col items-start gap-4 transition-all text-left relative overflow-hidden group ${
                                        phase >= 1 ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-white/5 border-white/5 hover:border-blue-500/40 hover:bg-blue-500/5'
                                    }`}
                                >
                                    <div className={`p-4 rounded-2xl ${phase >= 1 ? 'bg-emerald-500 text-white' : 'bg-white/10 text-white opacity-40'}`}>
                                        <Users size={24} strokeWidth={3} />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-black italic uppercase leading-none mb-2">Phase_1: Node Injection</p>
                                        <p className="text-[10px] font-black uppercase tracking-widest opacity-40 leading-relaxed italic">Seed Free Student, Tutor, and Institute Nodes into Production DB.</p>
                                    </div>
                                    {phase >= 1 && <CheckCircle2 className="absolute top-8 right-8 text-emerald-500" size={32} />}
                                </button>

                                {/* PHASE 2: PRO UPGRADE */}
                                <button 
                                    onClick={() => triggerPhase(2)}
                                    disabled={loading || phase !== 1}
                                    className={`p-8 rounded-[2.5rem] border-2 flex flex-col items-start gap-4 transition-all text-left relative overflow-hidden group ${
                                        phase >= 2 ? 'bg-blue-500 border-blue-600' : 'bg-white/5 border-white/5'
                                    } ${phase === 1 ? 'hover:border-blue-500' : 'opacity-20 grayscale'}`}
                                >
                                    <div className={`p-4 rounded-2xl ${phase >= 2 ? 'bg-white text-blue-500' : 'bg-white/10 text-white opacity-40'}`}>
                                        <Zap size={24} strokeWidth={3} />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-black italic uppercase leading-none mb-2">Phase_2: Premium Upgrade</p>
                                        <p className="text-[10px] font-black uppercase tracking-widest opacity-40 leading-relaxed italic">Elevate all Audit Nodes to PRO Tier for Messenger Verification.</p>
                                    </div>
                                    {phase >= 2 && <CheckCircle2 className="absolute top-8 right-8 text-white" size={32} />}
                                </button>
                            </div>
                        </div>

                        {/* Node Explorer */}
                        {nodeData && (
                            <div className="p-12 bg-surface-dark/40 border-2 border-border-dark rounded-[4rem] space-y-8 anim-fade-in border-b-8">
                                <div className="flex items-center gap-4 border-b border-border-dark pb-8">
                                    <Target size={20} className="text-amber-500" />
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 italic font-black leading-none">Aura Node Explorer</h3>
                                </div>
                                <div className="space-y-4">
                                    {[
                                        { label: "Aman (Student)", id: nodeData.studentId, path: 'student' },
                                        { label: "Rajesh (Tutor)", id: nodeData.tutorId, path: 'tutor' },
                                        { label: "Elite (Institute)", id: nodeData.instituteId, path: 'tutor' }
                                    ].map((node, i) => (
                                        <a 
                                            key={i}
                                            href={`/dashboard/${node.path}?${node.path}Id=${node.id}`}
                                            target="_blank"
                                            className="flex items-center justify-between p-6 bg-background-dark/50 border border-white/5 rounded-2xl hover:bg-blue-500 group transition-all"
                                        >
                                            <span className="text-[11px] font-black uppercase tracking-widest italic group-hover:text-white transition-colors">{node.label}</span>
                                            <div className="flex items-center gap-4">
                                                <span className="text-[9px] font-black uppercase tracking-widest text-white/20 group-hover:text-white/40">Open Dashboard</span>
                                                <ExternalLink size={14} className="opacity-20 group-hover:opacity-100 group-hover:text-white" />
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Live Activity Matrix */}
                    <div className="bg-surface-dark border-2 border-border-dark rounded-[4rem] p-12 flex flex-col h-[700px] shadow-2xl relative overflow-hidden border-b-8">
                        <div className="flex items-center gap-4 mb-8 border-b border-border-dark pb-8">
                            <Activity size={20} className="text-white/20" />
                            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 italic font-black leading-none">System_Activity.log</h3>
                        </div>
                        <div className="flex-1 overflow-y-auto space-y-6 font-black text-[11px] uppercase tracking-[0.2em] italic pr-4 scrollbar-hide">
                            {logs.length === 0 && <div className="text-white/10">Establishing Secure Telemetry Line...</div>}
                            {logs.map((log, i) => (
                                <div key={i} className={`flex gap-6 ${
                                    log.type === 'success' ? 'text-emerald-500' : 
                                    log.type === 'error' ? 'text-red-500' : 
                                    log.type === 'system' ? 'text-blue-500' : 
                                    'text-white/40'
                                }`}>
                                    <span className="opacity-20 shrink-0">[{log.time}]</span>
                                    <span className="leading-relaxed">{log.msg}</span>
                                </div>
                            ))}
                            {loading && <div className="flex items-center gap-4 text-blue-500 animate-pulse">
                                <Loader2 className="animate-spin" size={14} />
                                <span>>>> Communicating with Node_{phase}...</span>
                            </div>}
                        </div>
                        
                        {/* Summary Card */}
                        <div className="mt-12 p-8 bg-white/5 border border-white/5 rounded-[2.5rem] flex items-center gap-8">
                            <div className={`size-16 rounded-2xl flex items-center justify-center border-2 ${phase > 0 ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-500' : 'bg-white/5 border-white/10 text-white/40'}`}>
                                {phase === 0 ? <Lock size={24} /> : <Unlock size={24} />}
                            </div>
                            <div>
                                <p className="text-[9px] font-black uppercase tracking-widest text-white/20 mb-1 leading-none italic">Protocol Status</p>
                                <p className="text-2xl font-black italic uppercase leading-none tracking-tighter">
                                    {phase === 0 ? 'Marketplace_Locked' : 
                                     phase === 1 ? 'Discovery_Active' : 
                                     'Communication_Full'}
                                </p>
                            </div>
                        </div>
                    </div>

                </div>

                <div className="text-center py-12 border-t-2 border-border-dark flex flex-col items-center gap-6">
                    <p className="text-[9px] font-black uppercase tracking-[0.6em] text-white/10 italic leading-none">Operational Security Protocol (OPS-MKT-PROD) | TII_PLATFORM_VER_3.1</p>
                    <div className="flex items-center gap-3">
                        <div className="size-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-emerald-500/60 italic">Production Link Synchronized</span>
                    </div>
                </div>

            </div>
        </div>
    );
}
