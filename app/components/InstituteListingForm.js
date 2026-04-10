"use client";

import { useState } from "react";
import { 
    Building, 
    Users, 
    ArrowRight,
    ArrowLeft,
    Loader2,
    CheckCircle2,
    BookOpen,
    ShieldCheck,
    Lock,
    MapPin,
    MonitorCheck,
    Home,
    Clock,
    Zap,
    Trophy,
    Activity
} from "lucide-react";

export default function InstituteListingForm({ user, onComplete }) {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [step, setStep] = useState(1); // 1: Center Identity, 2: Coverage, 3: Capacity
    
    const [form, setForm] = useState({
        instituteName: "",
        bio: "",
        subjects: [],
        grades: [],
        locations: [],
        contactPerson: user?.name || "",
        hourlyRate: 500,
        teachingModes: ["OFFLINE"],
        timings: [],
        boards: [],
        languages: ["ENGLISH", "HINDI"]
    });

    const TIMING_SLOTS = ["Morning (7 AM - 12 PM)", "Afternoon (12 PM - 4 PM)", "Evening (4 PM - 8 PM)", "Late Night (8 PM+)", "Weekends"];
    const BOARDS = ["CBSE", "ICSE", "IB", "State Board", "IGCSE"];

    const toggleItem = (field, item) => {
        setForm(f => ({
            ...f,
            [field]: Array.isArray(f[field])
                ? (f[field].includes(item) ? f[field].filter(i => i !== item) : [...f[field], item])
                : item
        }));
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch("/api/tutor/profile/update", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    ...form, 
                    userId: user.id, 
                    title: form.instituteName,
                    isInstitute: true 
                })
            });
            if (res.ok) {
                setSuccess(true);
                setTimeout(() => onComplete(), 2000);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="w-full max-w-sm mx-auto py-20 text-center space-y-10 animate-in zoom-in-95 duration-700">
                <div className="size-24 rounded-[2.5rem] bg-indigo-500/10 text-indigo-500 flex items-center justify-center mx-auto shadow-inner border border-indigo-500/20 animate-bounce">
                    <CheckCircle2 size={48} strokeWidth={1.5} />
                </div>
                <div>
                    <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic mb-4 leading-none">Center Deployed.</h2>
                    <p className="text-white/40 font-black text-[10px] uppercase tracking-widest leading-relaxed italic">Your institutional terminal is now active in the academy directory.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-2xl mx-auto selection:bg-indigo-500/30">
            <div className="bg-surface-dark/40 backdrop-blur-3xl rounded-[3rem] p-8 md:p-12 border border-border-dark shadow-2xl relative overflow-hidden">
                
                {/* Tactical Progress Map */}
                <div className="absolute top-0 left-0 w-full h-2 bg-background-dark/50 flex">
                    <div className={`h-full bg-indigo-500 transition-all duration-1000 shadow-[0_0_15px_rgba(79,70,229,0.5)] ${step === 1 ? "w-1/3" : step === 2 ? "w-2/3" : "w-full"}`}></div>
                </div>

                {/* Header Section */}
                <div className="mb-12 flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-2 text-white/20 font-black text-[10px] uppercase tracking-[0.4em] mb-4 leading-none italic">
                            <Activity size={14} className="animate-pulse text-indigo-500" /> SYNC_STEP: 0{step + 1}
                        </div>
                        <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-[0.9]">
                            {step === 1 && "Campus <br/><span className='text-indigo-500'>Identity.</span>"}
                            {step === 2 && "Syllabus <br/><span className='text-indigo-500'>Matrix.</span>"}
                            {step === 3 && "Operational <br/><span className='text-indigo-500'>Capacity.</span>"}
                        </h2>
                    </div>
                    {step > 1 && (
                        <button onClick={() => setStep(step - 1)} className="size-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-white/40 hover:text-white transition-all active:scale-95">
                            <ArrowLeft size={24} strokeWidth={3} />
                        </button>
                    )}
                </div>

                {/* Step 1: Center Identity */}
                {step === 1 && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-700">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-white/20 ml-2">Registered Center Name</label>
                            <input 
                                required
                                value={form.instituteName}
                                onChange={(e) => setForm({...form, instituteName: e.target.value.toUpperCase()})}
                                className="w-full px-6 py-5 bg-background-dark/50 border border-border-dark rounded-2xl focus:bg-background-dark focus:border-indigo-500 transition-all outline-none font-black text-sm uppercase italic tracking-tight text-white placeholder:text-white/5"
                                placeholder="E.G. EXCELLENCE COACHING ACADEMY"
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-white/20 ml-2">Lead Administrator / POC</label>
                            <div className="relative group">
                                <Users className="absolute left-5 top-1/2 -translate-y-1/2 text-white/10 group-focus-within:text-indigo-500 transition-all" size={20} />
                                <input 
                                    required
                                    value={form.contactPerson}
                                    onChange={(e) => setForm({...form, contactPerson: e.target.value})}
                                    className="w-full pl-14 pr-6 py-5 bg-background-dark/50 border border-border-dark rounded-2xl focus:bg-background-dark focus:border-indigo-500 transition-all outline-none font-black text-sm uppercase tracking-widest text-white placeholder:text-white/5"
                                    placeholder="CONTACT NAME"
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-white/20 ml-2">Institutional Vision</label>
                            <textarea 
                                required
                                rows={3}
                                value={form.bio}
                                onChange={(e) => setForm({...form, bio: e.target.value})}
                                className="w-full px-6 py-5 bg-background-dark/50 border border-border-dark rounded-2xl focus:bg-background-dark focus:border-indigo-500 transition-all outline-none font-medium text-sm text-white/80 placeholder:text-white/5 italic"
                                placeholder="State your center's teaching philosophy and highlights."
                            />
                        </div>

                        <button 
                            disabled={!form.instituteName || !form.contactPerson}
                            onClick={() => setStep(2)}
                            className="w-full py-6 bg-indigo-600 text-white rounded-[2rem] font-black text-[11px] uppercase tracking-[0.4em] flex items-center justify-center gap-4 shadow-xl hover:bg-white hover:text-indigo-600 transition-all active:scale-95 disabled:opacity-20 group italic leading-none"
                        >
                            COVERAGE_MATRIX <ArrowRight size={20} strokeWidth={3} className="group-hover:translate-x-2 transition-transform" />
                        </button>
                    </div>
                )}

                {/* Step 2: Syllabus Matrix */}
                {step === 2 && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-700">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-widest text-white/20 ml-2">Course Categories (Multiple)</label>
                            <div className="relative group">
                                <BookOpen className="absolute left-5 top-1/2 -translate-y-1/2 text-white/10 group-focus-within:text-indigo-500 transition-all" size={20} />
                                <input 
                                    className="w-full pl-14 pr-6 py-5 bg-background-dark/50 border border-border-dark rounded-[2rem] focus:bg-background-dark focus:border-indigo-500 transition-all outline-none font-black text-sm uppercase text-white placeholder:text-white/5"
                                    placeholder="TYPE COURSE & PRESS ENTER"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && e.target.value) {
                                            e.preventDefault();
                                            toggleItem('subjects', e.target.value.toUpperCase());
                                            e.target.value = '';
                                        }
                                    }}
                                />
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {form.subjects.map(s => (
                                    <button key={s} onClick={() => toggleItem('subjects', s)} className="px-5 py-2.5 bg-white text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-xl hover:bg-red-500 hover:text-white transition-all">
                                        {s} <Zap size={10} fill="currentColor" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-widest text-white/20 ml-2">Target Grade Tier</label>
                                <div className="flex flex-wrap gap-2">
                                    {["PRIMARY", "MIDDLE", "HIGH", "SENIOR", "GRADUATE"].map(lvl => (
                                        <button 
                                            key={lvl}
                                            type="button"
                                            onClick={() => toggleItem('grades', lvl)}
                                            className={`px-4 py-3 rounded-xl border font-black text-[9px] uppercase tracking-widest transition-all ${
                                                form.grades.includes(lvl) ? "bg-indigo-600 border-indigo-600 text-white shadow-lg" : "bg-white/5 border-white/5 text-white/20"
                                            }`}
                                        >
                                            {lvl}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-widest text-white/20 ml-2">Academic Boards</label>
                                <div className="flex flex-wrap gap-2">
                                    {BOARDS.map(b => (
                                        <button 
                                            key={b}
                                            type="button"
                                            onClick={() => toggleItem('boards', b)}
                                            className={`px-4 py-3 rounded-xl border font-black text-[9px] uppercase tracking-widest transition-all ${
                                                form.boards.includes(b) ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-600/20" : "bg-white/5 border-white/5 text-white/20"
                                            }`}
                                        >
                                            {b}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <button 
                            disabled={form.subjects.length === 0}
                            onClick={() => setStep(3)}
                            className="w-full py-6 bg-indigo-600 text-white rounded-[2rem] font-black text-[11px] uppercase tracking-[0.4em] flex items-center justify-center gap-4 shadow-xl hover:bg-white hover:text-indigo-600 transition-all active:scale-95 disabled:opacity-20 group italic leading-none"
                        >
                            FINAL_PROTOCOL <ArrowRight size={20} strokeWidth={3} className="group-hover:translate-x-2 transition-transform" />
                        </button>
                    </div>
                )}

                {/* Step 3: Center Capacity */}
                {step === 3 && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-700">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-widest text-white/20 ml-2 text-center block">Authorized Delivery</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        { id: "OFFLINE", icon: Building, label: "Campus" },
                                        { id: "ONLINE", icon: MonitorCheck, label: "Digital" }
                                    ].map((mode) => (
                                        <button
                                            key={mode.id}
                                            type="button"
                                            onClick={() => toggleItem('teachingModes', mode.id)}
                                            className={`py-8 px-4 rounded-[2rem] border transition-all flex flex-col items-center gap-4 ${
                                                form.teachingModes.includes(mode.id) 
                                                ? "bg-indigo-600 border-indigo-600 text-white shadow-xl scale-[1.05]" 
                                                : "bg-white/5 border-white/5 text-white/10 hover:border-white/20"
                                            }`}
                                        >
                                            <mode.icon size={32} strokeWidth={1} />
                                            <span className="font-black text-[9px] uppercase tracking-[0.2em] leading-none">{mode.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-widest text-white/20 ml-2">Batch Sync Slots</label>
                                <div className="flex flex-wrap gap-2">
                                    {TIMING_SLOTS.map(t => (
                                        <button 
                                            key={t}
                                            type="button"
                                            onClick={() => toggleItem('timings', t)}
                                            className={`px-4 py-3 rounded-xl border font-black text-[8px] uppercase tracking-widest transition-all ${
                                                form.timings.includes(t) ? "bg-amber-500 border-amber-500 text-white shadow-lg shadow-amber-500/20" : "bg-white/5 border-white/5 text-white/20"
                                            }`}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-white/20 ml-2 text-center block leading-none mb-1">Catchment Area (Direct Proximity)</label>
                            <div className="relative group">
                                <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-white/10 group-focus-within:text-indigo-500 transition-all" size={20} />
                                <input 
                                    className="w-full pl-14 pr-6 py-5 bg-background-dark/50 border border-border-dark rounded-[2rem] focus:bg-background-dark focus:border-indigo-500 transition-all outline-none font-black text-xs uppercase italic tracking-widest text-white placeholder:text-white/5"
                                    placeholder="TYPE REGION & PRESS ENTER"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && e.target.value) {
                                            e.preventDefault();
                                            toggleItem('locations', e.target.value.toUpperCase());
                                            e.target.value = '';
                                        }
                                    }}
                                />
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {form.locations.map(l => (
                                    <div key={l} className="px-5 py-2.5 bg-white/5 border border-white/5 text-white/40 rounded-xl text-[9px] font-black uppercase tracking-widest italic flex items-center gap-2">
                                        <MapPin size={10} /> {l}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <button 
                            disabled={loading || form.timings.length === 0}
                            onClick={handleSubmit}
                            className="w-full py-8 bg-indigo-600 text-white rounded-[2.5rem] font-black text-xs uppercase tracking-[0.5em] shadow-2xl hover:bg-white hover:text-indigo-600 transition-all flex items-center justify-center gap-6 active:scale-95 group italic leading-none"
                        >
                            {loading ? <Loader2 className="animate-spin" size={24} /> : (
                                <>DEPLOY_HUB <ArrowRight size={24} strokeWidth={3} className="group-hover:translate-x-4 transition-transform text-white/40" /></>
                            )}
                        </button>
                    </div>
                )}
                
                <div className="mt-12 text-center flex items-center justify-center gap-3 text-[10px] font-black text-white/10 uppercase tracking-[0.6em] italic leading-none">
                    <ShieldCheck size={14} strokeWidth={3} className="text-indigo-500/40" /> INSTITUTIONAL_INTEGRITY_VERIFIED
                </div>
            </div>
        </div>
    );
}
