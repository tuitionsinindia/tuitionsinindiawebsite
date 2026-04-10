"use client";

import { useState } from "react";
import { 
    User, 
    Mortarboard, 
    Star, 
    ArrowRight,
    ArrowLeft,
    Loader2,
    CheckCircle2,
    Briefcase,
    Languages,
    Clock,
    MapPin,
    MonitorCheck,
    Home,
    ShieldCheck,
    Lock,
    Zap
} from "lucide-react";

export default function TutorListingForm({ user, onComplete }) {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [step, setStep] = useState(1); // 1: Personal/Identity, 2: Academic, 3: Logistics
    
    const [form, setForm] = useState({
        title: "",
        bio: "",
        subjects: [],
        grades: [],
        locations: [],
        experience: 0,
        hourlyRate: 500,
        languages: ["ENGLISH", "HINDI"],
        expertiseLevel: "SECONDARY",
        teachingModes: ["ONLINE"],
        timings: [],
        boards: [],
        type: "PRIVATE",
        maxSeats: 1
    });

    const TIMING_SLOTS = ["Morning (7 AM - 12 PM)", "Afternoon (12 PM - 4 PM)", "Evening (4 PM - 8 PM)", "Late Night (8 PM+)", "Weekends"];
    const BOARDS = ["CBSE", "ICSE", "IB", "State Board", "IGCSE"];

    const toggleItem = (field, item) => {
        setForm(f => ({
            ...f,
            [field]: f[field].includes(item) 
                ? f[field].filter(i => i !== item) 
                : [...f[field], item]
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
                    userId: user.id
                })
            });
            if (res.ok) {
                setSuccess(true);
                setTimeout(() => onComplete(), 2000);
            }
        } catch (error) {
            console.error("Failed to update profile:", error);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="w-full max-w-sm mx-auto py-20 text-center space-y-10 animate-in zoom-in-95 duration-700">
                <div className="size-24 rounded-[2.5rem] bg-indigo-500 text-white flex items-center justify-center mx-auto shadow-4xl shadow-indigo-500/30 animate-bounce">
                    <CheckCircle2 size={48} strokeWidth={3} />
                </div>
                <div>
                    <h2 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic mb-2">Protocol Verified.</h2>
                    <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">Your expert terminal is now active and broadcasting.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-2xl mx-auto">
            <div className="bg-white rounded-[3rem] p-8 md:p-12 border border-gray-100 shadow-4xl shadow-indigo-100/40 relative overflow-hidden">
                
                {/* Visual Progress Map */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gray-50 flex">
                    <div className={`h-full bg-indigo-600 transition-all duration-1000 ${step === 1 ? "w-1/3" : step === 2 ? "w-2/3" : "w-full"}`}></div>
                </div>

                {/* Header Section */}
                <div className="mb-12 flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-2 text-indigo-600 font-black text-[10px] uppercase tracking-[0.4em] mb-4 leading-none">
                            <Star size={14} className="animate-pulse" /> Faculty Protocol: Step 0{step + 2}
                        </div>
                        <h2 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic leading-[0.9]">
                            {step === 1 && "Identity <br/><span className='text-indigo-600'>Branding.</span>"}
                            {step === 2 && "Pedagogical <br/><span className='text-indigo-600'>Coverage.</span>"}
                            {step === 3 && "Operational <br/><span className='text-indigo-600'>Capacity.</span>"}
                        </h2>
                    </div>
                    {step > 1 && (
                        <button onClick={() => setStep(step - 1)} className="size-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 hover:text-indigo-600 transition-all active:scale-95">
                            <ArrowLeft size={24} strokeWidth={3} />
                        </button>
                    )}
                </div>

                {/* Step 1: Branding / Identity */}
                {step === 1 && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-700">
                        <div className="space-y-3">
                            <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-2">Professional Headline</label>
                            <input 
                                required
                                value={form.title}
                                onChange={(e) => setForm({...form, title: e.target.value.toUpperCase()})}
                                className="w-full px-6 py-5 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-indigo-600 focus:ring-8 focus:ring-indigo-100 transition-all outline-none font-black text-sm uppercase italic tracking-tight"
                                placeholder="E.G. SENIOR IIT-JEE MATHEMATICS SPECIALIST"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-2">Years of Pedigree (Exp)</label>
                                <div className="relative group">
                                    <Briefcase className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-indigo-600 transition-all" size={20} />
                                    <input 
                                        type="number"
                                        value={form.experience}
                                        onChange={(e) => setForm({...form, experience: parseInt(e.target.value)})}
                                        className="w-full pl-14 pr-4 py-5 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-indigo-600 transition-all outline-none font-black text-xl text-indigo-600"
                                    />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-2">Expertise Proficiency</label>
                                <select 
                                    value={form.expertiseLevel}
                                    onChange={(e) => setForm({...form, expertiseLevel: e.target.value})}
                                    className="w-full px-6 py-5 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-indigo-600 transition-all outline-none font-black text-xs uppercase tracking-widest appearance-none cursor-pointer"
                                >
                                    <option value="PRIMARY">PRIMARY (K-5)</option>
                                    <option value="SECONDARY">SECONDARY (6-10)</option>
                                    <option value="SENIOR">SENIOR (11-12+)</option>
                                    <option value="COMPETITIVE">COMPETITIVE EXAMS</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-2">Linguistic Capability</label>
                            <div className="flex flex-wrap gap-2">
                                {["ENGLISH", "HINDI", "MARATHI", "BENGALI", "TAMIL", "FRENCH"].map(lang => (
                                    <button 
                                        key={lang}
                                        type="button"
                                        onClick={() => toggleItem('languages', lang)}
                                        className={`px-4 py-3 rounded-xl border-2 font-black text-[9px] uppercase tracking-widest transition-all ${
                                            form.languages.includes(lang) ? "bg-indigo-600 border-indigo-600 text-white shadow-xl" : "bg-gray-50 border-transparent text-gray-400"
                                        }`}
                                    >
                                        {lang}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button 
                            disabled={!form.title}
                            onClick={() => setStep(2)}
                            className="w-full py-6 bg-gray-900 text-white rounded-[2rem] font-black text-[11px] uppercase tracking-[0.4em] flex items-center justify-center gap-4 shadow-4xl hover:bg-indigo-600 transition-all active:scale-95 disabled:opacity-30 group"
                        >
                            Coverage Parameters <ArrowRight size={20} strokeWidth={3} className="group-hover:translate-x-2 transition-transform" />
                        </button>
                    </div>
                )}

                {/* Step 2: Academic Coverage */}
                {step === 2 && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-700">
                        <div className="space-y-4">
                            <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-2">Subjects (Area of Dominion)</label>
                            <div className="relative group">
                                <Mortarboard className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-indigo-600 transition-all" size={20} />
                                <input 
                                    className="w-full pl-14 pr-4 py-5 bg-gray-50 border-2 border-transparent rounded-[1.8rem] focus:bg-white focus:border-indigo-600 transition-all outline-none font-black text-sm uppercase"
                                    placeholder="TYPE SUBJECT & PRESS ENTER"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && e.target.value) {
                                            e.preventDefault();
                                            if (!form.subjects.includes(e.target.value.toUpperCase())) {
                                                toggleItem('subjects', e.target.value.toUpperCase());
                                            }
                                            e.target.value = '';
                                        }
                                    }}
                                />
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {form.subjects.map(s => (
                                    <button key={s} onClick={() => toggleItem('subjects', s)} className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg">
                                        {s} <Lock size={10} />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-2">Grades Authorized</label>
                                <div className="flex flex-wrap gap-2">
                                    {["PRIMARY", "MIDDLE", "HIGH", "SENIOR", "GRADUATE"].map(lvl => (
                                        <button 
                                            key={lvl}
                                            type="button"
                                            onClick={() => toggleItem('grades', lvl)}
                                            className={`px-4 py-3 rounded-xl border-2 font-black text-[9px] uppercase tracking-widest transition-all ${
                                                form.grades.includes(lvl) ? "bg-gray-900 border-gray-900 text-white shadow-xl" : "bg-gray-50 border-transparent text-gray-400"
                                            }`}
                                        >
                                            {lvl}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-4">
                                <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-2">Board Specialization</label>
                                <div className="flex flex-wrap gap-2">
                                    {BOARDS.map(b => (
                                        <button 
                                            key={b}
                                            type="button"
                                            onClick={() => toggleItem('boards', b)}
                                            className={`px-4 py-3 rounded-xl border-2 font-black text-[9px] uppercase tracking-widest transition-all ${
                                                form.boards.includes(b) ? "bg-indigo-600 border-indigo-600 text-white shadow-xl" : "bg-gray-50 border-transparent text-gray-400"
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
                            className="w-full py-6 bg-gray-900 text-white rounded-[2rem] font-black text-[11px] uppercase tracking-[0.4em] flex items-center justify-center gap-4 shadow-4xl hover:bg-indigo-600 transition-all active:scale-95 disabled:opacity-30 group"
                        >
                            Final Protocol <ArrowRight size={20} strokeWidth={3} className="group-hover:translate-x-2 transition-transform" />
                        </button>
                    </div>
                )}

                 {/* Step 3: Operational Capacity */}
                 {step === 3 && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-700">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                                <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-2 text-center block">Authorized Delivery Protocols (Location)</label>
                                <div className="grid grid-cols-2 gap-4">
                                    {[
                                        { id: "ONLINE", icon: MonitorCheck, label: "Digital Hub", desc: "Remote delivery" },
                                        { id: "STUDENT_HOME", icon: Home, label: "Travel", desc: "I visit student" },
                                        { id: "TUTOR_HOME", icon: MapPin, label: "In-House", desc: "Students visit me" },
                                        { id: "CENTER", icon: Building2, label: "Facility", desc: "Teach at center" }
                                    ].map((mode) => (
                                        <button
                                            key={mode.id}
                                            type="button"
                                            onClick={() => toggleItem('teachingModes', mode.id)}
                                            className={`py-8 px-4 rounded-[2rem] border-2 flex flex-col items-center gap-3 transition-all ${
                                                form.teachingModes.includes(mode.id) 
                                                ? "bg-indigo-600 border-indigo-600 text-white shadow-2xl scale-105" 
                                                : "bg-gray-50 border-transparent text-gray-300 hover:border-indigo-200"
                                            }`}
                                        >
                                            <mode.icon size={32} strokeWidth={1} />
                                            <div className="text-center">
                                                <p className="font-black text-[10px] uppercase tracking-widest leading-none mb-1">{mode.label}</p>
                                                <p className="text-[8px] opacity-60 uppercase tracking-tighter leading-none">{mode.desc}</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-2">Interaction Protocol</label>
                                <div className="bg-indigo-50/50 border border-indigo-100 rounded-[2rem] p-8 space-y-6">
                                     <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Users size={20} className="text-indigo-600" />
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-900 leading-none">Batch/Group Mode</p>
                                                <p className="text-[9px] font-medium text-gray-400 uppercase tracking-tighter leading-none mt-1">Accept multiple enrollments</p>
                                            </div>
                                        </div>
                                        <label className={`w-14 h-8 rounded-full p-1 flex items-center transition-all cursor-pointer ${form.type === 'GROUP' ? 'bg-indigo-600' : 'bg-gray-200'}`}>
                                            <div className={`size-6 bg-white rounded-full shadow-md transition-transform ${form.type === 'GROUP' ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                            <input 
                                                type="checkbox" 
                                                className="hidden" 
                                                checked={form.type === 'GROUP'}
                                                onChange={(e) => setForm({...form, type: e.target.checked ? 'GROUP' : 'PRIVATE', maxSeats: e.target.checked ? 5 : 1})}
                                            />
                                        </label>
                                     </div>
                                     {form.type === 'GROUP' && (
                                         <div className="pt-4 border-t border-indigo-100 space-y-4 animate-in slide-in-from-top-4 duration-500">
                                             <label className="text-[9px] font-black uppercase tracking-widest text-indigo-400">Default Seat Capacity</label>
                                             <input 
                                                type="number"
                                                value={form.maxSeats}
                                                onChange={(e) => setForm({...form, maxSeats: parseInt(e.target.value)})}
                                                className="w-full bg-white border border-indigo-100 rounded-xl p-4 text-sm font-black text-indigo-600 outline-none"
                                             />
                                         </div>
                                     )}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-2">Target Locations (Authorized Hubs)</label>
                            <div className="relative group">
                                <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-indigo-600 transition-all" size={20} />
                                <input 
                                    className="w-full pl-14 pr-4 py-5 bg-gray-50 border-2 border-transparent rounded-[1.8rem] focus:bg-white focus:border-indigo-600 transition-all outline-none font-black text-xs uppercase italic tracking-widest"
                                    placeholder="TYPE LOCATION & PRESS ENTER"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && e.target.value) {
                                            e.preventDefault();
                                            if (!form.locations.includes(e.target.value.toUpperCase())) {
                                                toggleItem('locations', e.target.value.toUpperCase());
                                            }
                                            e.target.value = '';
                                        }
                                    }}
                                />
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {form.locations.map(l => (
                                    <div key={l} className="px-5 py-2.5 bg-gray-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-md">
                                        {l}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                             <div className="space-y-3">
                                <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-2">Hourly Rate (INR)</label>
                                <div className="relative group">
                                    <CircleDollarSign className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-indigo-600 transition-all" size={24} />
                                    <input 
                                        type="number"
                                        value={form.hourlyRate}
                                        onChange={(e) => setForm({...form, hourlyRate: parseInt(e.target.value)})}
                                        className="w-full pl-14 pr-4 py-5 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-indigo-600 transition-all outline-none font-black text-xl text-indigo-600"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col justify-end">
                                <p className="text-[10px] font-black text-gray-300 uppercase leading-relaxed tracking-widest text-center">Protocol ensures market competitive rates for your specialized pedigree.</p>
                            </div>
                        </div>

                        <button 
                            disabled={loading || form.timings.length === 0}
                            onClick={handleSubmit}
                            className="w-full py-8 bg-indigo-600 text-white rounded-[2.5rem] font-black text-xs uppercase tracking-[0.5em] shadow-4xl shadow-indigo-600/30 hover:bg-gray-900 transition-all flex items-center justify-center gap-6 active:scale-95 group"
                        >
                            {loading ? <Loader2 className="animate-spin" size={24} /> : (
                                <>Deploy Expert Terminal <ArrowRight size={24} strokeWidth={3} className="group-hover:translate-x-4 transition-transform" /></>
                            )}
                        </button>
                    </div>
                )}
                
                <div className="mt-12 text-center flex items-center justify-center gap-2 text-[10px] font-black text-gray-300 uppercase tracking-[0.7em]">
                    <ShieldCheck size={14} strokeWidth={3} /> Identity Verified & Encrypted
                </div>
            </div>
        </div>
    );
}
