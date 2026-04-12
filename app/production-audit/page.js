"use client";

import { useState } from "react";

export default function ProductionAudit() {
    const [phase, setPhase] = useState(0);
    const [loading, setLoading] = useState(false);
    const [logs, setLogs] = useState([]);
    const [seedData, setSeedData] = useState(null);
    const [auditKey, setAuditKey] = useState("");

    const addLog = (msg) => {
        setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${msg}`]);
    };

    const triggerPhase = async (p) => {
        if (!auditKey) {
            addLog("Error: Audit key is required");
            return;
        }
        setLoading(true);
        addLog(`Starting Phase ${p}...`);

        try {
            const res = await fetch(`/api/admin/audit-seed?phase=${p}&key=${encodeURIComponent(auditKey)}`);
            const data = await res.json();

            if (!res.ok) throw new Error(data.error || "Request failed");

            addLog(data.message);
            if (p === 1) {
                setSeedData(data);
                setPhase(1);
            } else if (p === 2) {
                setPhase(2);
            } else if (p === 0) {
                setPhase(0);
                setSeedData(null);
            }
        } catch (err) {
            addLog(`Error: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ background: '#000', color: '#fff', minHeight: '100vh', padding: '50px', fontFamily: 'monospace' }}>
            <h1 style={{ fontSize: '40px' }}>TuitionsInIndia — Production Audit</h1>
            <hr style={{ borderColor: '#333', marginBottom: '30px' }} />

            <div style={{ marginBottom: '30px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#aaa' }}>Audit Key</label>
                <input
                    type="password"
                    value={auditKey}
                    onChange={(e) => setAuditKey(e.target.value)}
                    placeholder="Enter AUDIT_SEED_KEY"
                    style={{ padding: '10px', background: '#111', border: '1px solid #333', color: '#fff', width: '400px', fontFamily: 'monospace' }}
                />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '50px' }}>
                <div style={{ border: '1px solid #333', padding: '30px' }}>
                    <h2>Commands</h2>
                    <button onClick={() => triggerPhase(1)} disabled={loading} style={{ padding: '20px', background: 'blue', color: 'white', width: '100%', marginBottom: '10px', cursor: 'pointer' }}>
                        1. Seed Test Data
                    </button>
                    <button onClick={() => triggerPhase(2)} disabled={loading} style={{ padding: '20px', background: 'green', color: 'white', width: '100%', marginBottom: '10px', cursor: 'pointer' }}>
                        2. Upgrade to Pro
                    </button>
                    <button onClick={() => triggerPhase(0)} disabled={loading} style={{ padding: '20px', background: 'darkred', color: 'white', width: '100%', cursor: 'pointer' }}>
                        0. Cleanup Test Data
                    </button>

                    {seedData && (
                        <div style={{ marginTop: '30px' }}>
                            <h3>Quick Links</h3>
                            <a href={`/dashboard/student?studentId=${seedData.studentId}`} target="_blank" style={{ color: 'cyan', display: 'block' }}>Student Dashboard</a>
                            <a href={`/dashboard/tutor?tutorId=${seedData.tutorId}`} target="_blank" style={{ color: 'cyan', display: 'block' }}>Tutor Dashboard</a>
                            <a href={`/dashboard/tutor?tutorId=${seedData.instituteId}`} target="_blank" style={{ color: 'cyan', display: 'block' }}>Institute Dashboard</a>
                        </div>
                    )}
                </div>

                <div style={{ border: '1px solid #333', padding: '30px', background: '#111' }}>
                    <h2>Logs</h2>
                    <div style={{ height: '400px', overflowY: 'auto' }}>
                        {logs.map((log, i) => <div key={i}>{log}</div>)}
                        {loading && <div style={{ color: '#aaa' }}>Working...</div>}
                    </div>
                </div>
            </div>
        </div>
    );
}
