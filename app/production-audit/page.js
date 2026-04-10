"use client";

import { useState } from "react";

export default function ProductionAuditHub() {
    const [phase, setPhase] = useState(0);
    const [loading, setLoading] = useState(false);
    const [logs, setLogs] = useState([]);
    const [nodeData, setNodeData] = useState(null);

    const addLog = (msg) => {
        setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${msg}`]);
    };

    const triggerPhase = async (p) => {
        setLoading(true);
        addLog(`Initiating Phase ${p}...`);
        
        try {
            const res = await fetch(`/api/admin/audit-seed?phase=${p}&key=academy_audit_2026`);
            const data = await res.json();
            
            if (!res.ok) throw new Error(data.error || "FAIL");

            addLog(data.message);
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
            addLog(`Error: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ background: '#000', color: '#fff', minHeight: '100vh', padding: '50px', fontFamily: 'monospace' }}>
            <h1 style={{ fontSize: '40px' }}>TuitionsInIndia - Production Audit</h1>
            <hr style={{ borderColor: '#333' }} />
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '50px', marginTop: '50px' }}>
                <div style={{ border: '1px solid #333', padding: '30px' }}>
                    <h2>Commands</h2>
                    <button onClick={() => triggerPhase(1)} disabled={loading} style={{ padding: '20px', background: 'blue', color: 'white', width: '100%', marginBottom: '10px' }}>
                        1. SEED FREE NODES
                    </button>
                    <button onClick={() => triggerPhase(2)} disabled={loading} style={{ padding: '20px', background: 'green', color: 'white', width: '100%', marginBottom: '10px' }}>
                        2. UPGRADE TO PRO
                    </button>
                    <button onClick={() => triggerPhase(0)} disabled={loading} style={{ padding: '20px', background: 'red', color: 'white', width: '100%' }}>
                        0. CLEANUP DATA
                    </button>

                    {nodeData && (
                        <div style={{ marginTop: '30px' }}>
                            <h3>Node Links</h3>
                            <a href={`/dashboard/student?studentId=${nodeData.studentId}`} target="_blank" style={{ color: 'cyan', display: 'block' }}>Student Dashboard</a>
                            <a href={`/dashboard/tutor?tutorId=${nodeData.tutorId}`} target="_blank" style={{ color: 'cyan', display: 'block' }}>Tutor Dashboard</a>
                            <a href={`/dashboard/tutor?tutorId=${nodeData.instituteId}`} target="_blank" style={{ color: 'cyan', display: 'block' }}>Institute Dashboard</a>
                        </div>
                    )}
                </div>

                <div style={{ border: '1px solid #333', padding: '30px', background: '#111' }}>
                    <h2>Logs</h2>
                    <div style={{ height: '400px', overflowY: 'auto' }}>
                        {logs.map((log, i) => <div key={i}>{log}</div>)}
                        {loading && <div>Working...</div>}
                    </div>
                </div>
            </div>
        </div>
    );
}
