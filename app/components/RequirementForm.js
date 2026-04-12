"use client";

import { useState, useEffect } from "react";
import { 
    BookOpen, 
    MapPin, 
    Monitor, 
    Home, 
    ArrowRight,
    ArrowLeft,
    CheckCircle2,
    Loader2,
    Clock,
    Navigation,
    CircleDollarSign,
    ShieldCheck,
    Phone,
    User,
    Lock,
    Users,
    Layers,
    Trophy
} from "lucide-react";

export default function RequirementForm({ user, onComplete }) {
    const [loading, setLoading] = useState(false);
    const [isDetecting, setIsDetecting] = useState(false);
    const [step, setStep] = useState(1); // 1: Academic, 2: Preferences, 3: Finalize
    
    const [form, setForm] = useState({
        subjects: [],
        grades: [],
        locations: [],
        timings: [],
        budget: "",
        modes: ["ONLINE"],
        boards: [],
        genderPreference: "ANY",
        groupPreference: "PRIVATE",
        description: ""
    });

    const TIMING_SLOTS = [
        "Morning (7 AM - 12 PM)",
        "Afternoon (12 PM - 4 PM)",
        "Evening (4 PM - 8 PM)",
        "Late Night (8 PM+)",
        "Weekends"
    ];

    const BOARDS = ["CBSE", "ICSE", "IB", "State Board", "IGCSE"];

    const toggleItem = (field, item) => {
        setForm(f => ({
            ...f,
            [field]: f[field].includes(item) 
                ? f[field].filter(i => i !== item) 
                : [...f[field], item]
        }));
    };

    const detectLocation = () => {
        setIsDetecting(true);
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                try {
                    const { latitude, longitude } = position.coords;
                    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                    const data = await res.json();
                    const area = data.address.suburb || data.address.neighbourhood || data.address.residential || "";
                    const city = data.address.city || data.address.town || "";
                    const finalLoc = [area, city].filter(Boolean).join(", ") || "Current Location";
                    if (!form.locations.includes(finalLoc)) {
                        setForm(f => ({ ...f, locations: [...f.locations, finalLoc] }));
                    }
                } catch (err) { console.error(err); } finally { setIsDetecting(false); }
            }, () => setIsDetecting(false));
        }
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch("/api/leads/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    studentId: user.id,
                    ...form,
                    budget: parseInt(form.budget) || 0,
                    groupPreference: form.groupPreference,
                    description: `Preferences: ${form.genderPreference} Tutor | Interaction: ${form.groupPreference} | Boards: ${form.boards.join(', ')}\n\n${form.description}`
                })
            });
            if (res.ok) onComplete();
        } catch (error) { console.error(error); } finally { setLoading(false); }
    };

    return (
        <div className="w-full max-w-2xl mx-auto">
            <div className="bg-white rounded-[3rem] p-8 md:p-12 border border-gray-100 shadow-4xl shadow-blue-100/40 relative overflow-hidden">
                
                {/* Progress Hub */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gray-50 flex">
                    <div className={`h-full bg-blue-600 transition-all duration-1000 ${step === 1 ? "w-1/3" : step === 2 ? "w-2/3" : "w-full"}`}></div>
                </div>

                {/* Header */}
                <div className="mb-12 flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-2 text-blue-600 font-black text-xs uppercase tracking-[0.4em] mb-4 leading-none">
                            <Zap size={14} className="animate-pulse" /> Alignment Step 0{step + 1}
                        </div>
                        <h2 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic leading-[0.9]">
                            {step === 1 && "Your <br/><span className='text-blue-600'>Requirements</span>"}
                            {step === 2 && "Logistics <br/><span className='text-blue-600'>Constraints.</span>"}
                            {step === 3 && "Review & <span className='text-blue-600'>Submit</span>"}
                        </h2>
                    </div>
                    {step > 1 && (
                        <button onClick={() => setStep(step - 1)} className="size-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 hover:text-blue-600 transition-all active:scale-95">
                            <ArrowLeft size={24} strokeWidth={3} />
                        </button>
                    )}
                </div>

                {/* Step 1: Your Requirements */}
                {step === 1 && (
                    <div className="space-y-10 animate-in fade-in slide-in-from-right-8 duration-700">
                        <div className="space-y-4">
                            <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-2">Subjects (Define Multiple)</label>
                            <div className="relative group">
                                <BookOpen className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-600 transition-all" size={20} />
                                <input 
                                    className="w-full pl-14 pr-4 py-5 bg-gray-50 border-2 border-transparent rounded-[1.8rem] focus:bg-white focus:border-blue-600 focus:ring-8 focus:ring-blue-100 transition-all outline-none font-black text-sm uppercase"
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
                                    <button key={s} onClick={() => toggleItem('subjects', s)} className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:bg-black transition-all">
                                        {s} <Lock size={10} />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-2">Class / Academic Levels</label>
                                <div className="flex flex-wrap gap-2">
                                    {["PRIMARY", "MIDDLE", "HIGH", "SENIOR", "COMPETITIVE"].map(lvl => (
                                        <button 
                                            key={lvl}
                                            type="button"
                                            onClick={() => toggleItem('grades', lvl)}
                                            className={`px-4 py-3 rounded-xl border-2 font-black text-xs uppercase tracking-widest transition-all ${
                                                form.grades.includes(lvl) ? "bg-gray-900 border-gray-900 text-white shadow-xl" : "bg-gray-50 border-transparent text-gray-400 hover:border-blue-200"
                                            }`}
                                        >
                                            {lvl}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-4">
                                <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-2">Curriculum Boards</label>
                                <div className="flex flex-wrap gap-2">
                                    {BOARDS.map(b => (
                                        <button 
                                            key={b}
                                            type="button"
                                            onClick={() => toggleItem('boards', b)}
                                            className={`px-4 py-3 rounded-xl border-2 font-black text-xs uppercase tracking-widest transition-all ${
                                                form.boards.includes(b) ? "bg-blue-600 border-blue-600 text-white shadow-xl" : "bg-gray-50 border-transparent text-gray-400 hover:border-blue-200"
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
                            onClick={() => setStep(2)}
                            className="w-full py-6 bg-gray-900 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.4em] flex items-center justify-center gap-4 shadow-4xl hover:bg-blue-600 transition-all active:scale-95 disabled:opacity-30 disabled:grayscale group"
                        >
                            Configure Logistics <ArrowRight size={20} strokeWidth={3} className="group-hover:translate-x-2 transition-transform" />
                        </button>
                    </div>
                )}

                {/* Step 2: Logistics Constraints */}
                {step === 2 && (
                    <div className="space-y-10 animate-in fade-in slide-in-from-right-8 duration-700">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                                <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-2 text-center block">Preferred Location</label>
                                <div className="grid grid-cols-2 gap-4">
                                    {[
                                        { id: "ONLINE", icon: Monitor, label: "Digital Hub", desc: "Remote learning" },
                                        { id: "STUDENT_HOME", icon: Home, label: "My Location", desc: "Tutor travels to me" },
                                        { id: "TUTOR_HOME", icon: MapPin, label: "Tutor Hub", desc: "I travel to tutor" },
                                        { id: "CENTER", icon: Building2, label: "Academy", desc: "Institutional center" }
                                    ].map((mode) => (
                                        <button
                                            key={mode.id}
                                            type="button"
                                            onClick={() => toggleItem('modes', mode.id)}
                                            className={`py-6 px-4 rounded-[2rem] border-2 flex flex-col items-center gap-3 transition-all ${
                                                form.modes.includes(mode.id) 
                                                ? "bg-blue-600 border-blue-600 text-white shadow-2xl scale-105" 
                                                : "bg-gray-50 border-transparent text-gray-300 hover:border-blue-200"
                                            }`}
                                        >
                                            <mode.icon size={28} strokeWidth={1.5} />
                                            <div className="text-center">
                                                <p className="font-black text-xs uppercase tracking-widest leading-none mb-1">{mode.label}</p>
                                                <p className="text-xs opacity-60 uppercase tracking-tighter leading-none">{mode.desc}</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-2">Interaction Model</label>
                                <div className="grid grid-cols-1 gap-3">
                                    {[
                                        { id: "PRIVATE", label: "Exclusive 1:1 Private", icon: User, desc: "Personalized attention" },
                                        { id: "GROUP", label: "Small Group Batch", icon: Users, desc: "Cost-effective collaborative" }
                                    ].map(pref => (
                                        <button 
                                            key={pref.id}
                                            type="button"
                                            onClick={() => setForm({...form, groupPreference: pref.id})}
                                            className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all ${
                                                form.groupPreference === pref.id ? "bg-gray-900 border-gray-900 text-white shadow-xl" : "bg-gray-50 border-transparent text-gray-400"
                                            }`}
                                        >
                                            <pref.icon size={18} />
                                            <div className="text-left">
                                                <p className="text-xs font-black uppercase tracking-widest leading-none mb-1">{pref.label}</p>
                                                <p className="text-xs opacity-40 uppercase tracking-tighter leading-none">{pref.desc}</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-2">Budget Allocation (INR)</label>
                                <div className="relative group">
                                    <CircleDollarSign className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-600 transition-all" size={24} />
                                    <input 
                                        type="number"
                                        value={form.budget}
                                        onChange={(e) => setForm({...form, budget: e.target.value})}
                                        className="w-full pl-16 pr-4 py-5 bg-gray-50 border-2 border-transparent rounded-[1.8rem] focus:bg-white focus:border-blue-600 focus:ring-8 focus:ring-blue-100 transition-all outline-none font-black text-2xl text-blue-600"
                                        placeholder="5000"
                                    />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-2">Tutor Gender Preference</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {["MALE", "FEMALE", "ANY"].map(g => (
                                        <button 
                                            key={g}
                                            type="button"
                                            onClick={() => setForm({...form, genderPreference: g})}
                                            className={`py-5 rounded-2xl border-2 font-black text-xs uppercase tracking-widest transition-all ${
                                                form.genderPreference === g ? "bg-gray-900 border-gray-900 text-white" : "bg-gray-50 border-transparent text-gray-400"
                                            }`}
                                        >
                                            {g}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <button 
                            disabled={form.modes.length === 0 || !form.budget}
                            onClick={() => setStep(3)}
                            className="w-full py-6 bg-gray-900 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.4em] flex items-center justify-center gap-4 shadow-4xl hover:bg-blue-600 transition-all active:scale-95 disabled:opacity-30 group"
                        >
                            Final Alignment <ArrowRight size={20} strokeWidth={3} className="group-hover:translate-x-2 transition-transform" />
                        </button>
                    </div>
                )}

                {/* Step 3: Review & Submit */}
                {step === 3 && (
                    <div className="space-y-10 animate-in zoom-in-95 duration-700">
                        <div className="bg-blue-50/50 border-2 border-blue-100 rounded-[3.5rem] p-10 space-y-8 shadow-inner">
                            <div className="flex flex-wrap gap-3">
                                {form.subjects.map(s => (
                                    <div key={s} className="px-6 py-3 bg-white border border-blue-100 rounded-2xl shadow-sm text-xs font-black text-gray-900 uppercase italic tracking-widest">
                                        {s}
                                    </div>
                                ))}
                            </div>
                            
                            <div className="grid grid-cols-2 gap-y-6 gap-x-12 pt-8 border-t border-blue-100">
                                <div className="space-y-1">
                                    <p className="text-xs font-black uppercase tracking-[0.3em] text-blue-400">Target Boards</p>
                                    <p className="text-sm font-black text-gray-900">{form.boards.join(', ') || 'Global Curriculum'}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-black uppercase tracking-[0.3em] text-blue-400">Time Allocation</p>
                                    <p className="text-sm font-black text-gray-900">{form.timings.length} Slots Locked</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-black uppercase tracking-[0.3em] text-blue-400">Economic Cap</p>
                                    <p className="text-sm font-black text-blue-600">₹{form.budget} / MON</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-black uppercase tracking-[0.3em] text-blue-400">Gender Priority</p>
                                    <p className="text-sm font-black text-gray-900">{form.genderPreference}</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-2">Additional Details (Brief)</label>
                            <textarea 
                                rows={3}
                                value={form.description}
                                onChange={(e) => setForm({...form, description: e.target.value})}
                                className="w-full px-8 py-6 bg-gray-50 border-2 border-transparent rounded-[2rem] focus:bg-white focus:border-blue-600 focus:ring-8 focus:ring-blue-100 transition-all outline-none font-medium text-sm placeholder:text-gray-200 min-h-[140px]"
                                placeholder="State any additional additional requirements or preferences for the tutor..."
                            />
                        </div>

                        <button 
                            disabled={loading}
                            onClick={handleSubmit}
                            className="w-full py-8 bg-blue-600 text-white rounded-[2.5rem] font-black text-xs uppercase tracking-[0.5em] shadow-4xl shadow-blue-600/30 hover:bg-gray-900 transition-all flex items-center justify-center gap-6 active:scale-95 group"
                        >
                            {loading ? <Loader2 className="animate-spin" size={24} /> : (
                                <>Submit Requirement <ArrowRight size={24} strokeWidth={3} className="group-hover:translate-x-4 transition-transform" /></>
                            )}
                        </button>
                    </div>
                )}
                
                <div className="mt-12 text-center flex items-center justify-center gap-2 text-xs font-black text-gray-300 uppercase tracking-[0.7em]">
                    <Lock size={14} strokeWidth={3} /> Your data is secure
                </div>
            </div>
        </div>
    );
}
