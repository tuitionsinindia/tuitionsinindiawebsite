"use client";

import { useState } from "react";
import { User, ShieldCheck, Mail, Phone, Lock, Save, Loader2, Info } from "lucide-react";

export default function SettingsModule({ userData, onUpdate }) {
    const [formData, setFormData] = useState({
        name: userData?.name || "",
        email: userData?.email || "",
        phone: userData?.phone || "",
        bio: userData?.tutorListing?.bio || "",
        gender: userData?.tutorListing?.gender || "OTHER",
        preferredContact: userData?.privacySettings?.preferredContact || "PHONE"
    });
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState(null);

    const handleSave = async () => {
        setIsSaving(true);
        setMessage(null);
        try {
            const res = await fetch("/api/user/update", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: userData.id, ...formData })
            });

            if (res.ok) {
                setMessage({ type: "success", text: "SYNC_SUCCESS: PROFILE_METADATA_UPDATED" });
                if (onUpdate) onUpdate();
            } else {
                throw new Error("SYNC_FAILURE");
            }
        } catch (err) {
            setMessage({ type: "error", text: "SYNC_ERROR: RE-INITIALIZE_CONNECTION" });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-12 animate-in fade-in duration-700">
            <div className="flex items-center justify-between">
                <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter">Profile <span className="text-primary underline decoration-primary/20">Protocol.</span></h2>
                <div className="px-5 py-2 bg-emerald-500/10 text-emerald-500 rounded-xl text-[9px] font-black uppercase tracking-widest border border-emerald-500/20 italic">
                    Security: Verified_{userData?.role}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Identity Matrix */}
                <div className="bg-surface-dark/40 border border-border-dark p-10 rounded-[3rem] space-y-8 border-b-8">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                            <User size={20} strokeWidth={3} />
                        </div>
                        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 italic">Identity Matrix</h3>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[9px] font-black uppercase tracking-widest text-white/20 px-4">Subject Name</label>
                            <div className="relative">
                                <User className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                                <input 
                                    type="text" 
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    className="w-full bg-background-dark/50 border border-border-dark rounded-2xl p-5 pl-14 text-white font-black text-xs uppercase tracking-widest focus:ring-2 focus:ring-primary/50 outline-none italic"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[9px] font-black uppercase tracking-widest text-white/20 px-4">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                                <input 
                                    type="email" 
                                    value={formData.email}
                                    disabled
                                    className="w-full bg-background-dark/20 border border-border-dark/50 rounded-2xl p-5 pl-14 text-white/40 font-black text-xs uppercase tracking-widest outline-none italic cursor-not-allowed"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[9px] font-black uppercase tracking-widest text-white/20 px-4">Phone Number</label>
                            <div className="relative">
                                <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                                <input 
                                    type="text" 
                                    value={formData.phone}
                                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                    className="w-full bg-background-dark/50 border border-border-dark rounded-2xl p-5 pl-14 text-white font-black text-xs uppercase tracking-widest focus:ring-2 focus:ring-primary/50 outline-none italic"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Privacy Protocols */}
                <div className="bg-surface-dark/40 border border-border-dark p-10 rounded-[3rem] space-y-8 border-b-8">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="size-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                            <ShieldCheck size={20} strokeWidth={3} />
                        </div>
                        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 italic">Privacy Settings</h3>
                    </div>

                    <div className="space-y-6">
                        <div className="p-8 rounded-2xl bg-background-dark/30 border border-border-dark space-y-4">
                            <div className="flex items-start gap-4">
                                <Info size={16} className="text-blue-500 shrink-0 mt-1" />
                                <p className="text-[10px] font-black uppercase tracking-widest text-white/40 leading-relaxed italic">
                                    Determine how the academic terminal broadcats your secure line.
                                </p>
                            </div>
                            <div className="flex flex-col gap-3">
                                {["PHONE", "EMAIL", "BOTH"].map(mode => (
                                    <button 
                                        key={mode}
                                        onClick={() => setFormData({...formData, preferredContact: mode})}
                                        className={`p-4 rounded-xl border font-black text-[9px] uppercase tracking-widest transition-all italic text-left ${
                                            formData.preferredContact === mode 
                                            ? "bg-blue-500 border-blue-500 text-white shadow-lg shadow-blue-500/20" 
                                            : "bg-surface-dark border-border-dark text-white/40"
                                        }`}
                                    >
                                        PREFERRED_PROTOCOL: {mode}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="p-8 rounded-2xl bg-amber-500/5 border border-amber-500/10 space-y-2">
                             <div className="flex items-center gap-3">
                                <Lock size={14} className="text-amber-500" />
                                <h4 className="text-[10px] font-black text-amber-500 uppercase tracking-widest leading-none">Security Key</h4>
                             </div>
                             <p className="text-[9px] font-black text-on-surface-dark/20 uppercase tracking-[0.3em] italic">Access secure re-initialization logic to modify passwords.</p>
                             <button className="mt-4 px-6 py-2 bg-amber-500/10 border border-amber-500/20 rounded-lg text-[8px] font-black text-amber-500 uppercase tracking-widest hover:bg-amber-500 hover:text-white transition-all">GENERATE_REQUEST</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Response Section */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 pt-10 border-t border-border-dark">
                {message && (
                    <div className={`px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest italic animate-in fade-in slide-in-from-left-4 ${
                        message.type === 'success' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'
                    }`}>
                        {message.text}
                    </div>
                )}
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="ml-auto flex items-center gap-4 px-12 py-6 bg-primary text-on-primary rounded-[2rem] font-black text-[11px] tracking-widest shadow-2xl shadow-primary/30 hover:scale-[1.05] transition-all uppercase leading-none italic disabled:opacity-50"
                >
                    {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} strokeWidth={3} />}
                    COMMIT_SYNC_REQUEST
                </button>
            </div>
        </div>
    );
}
