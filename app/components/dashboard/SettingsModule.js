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
                setMessage({ type: "success", text: "Settings saved successfully." });
                if (onUpdate) onUpdate();
            } else {
                throw new Error("SYNC_FAILURE");
            }
        } catch (err) {
            setMessage({ type: "error", text: "Failed to save. Please try again." });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-12 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <h2 className="text-4xl font-black text-gray-900 uppercase italic tracking-tighter">Profile Settings</h2>
                <div className="px-5 py-2 bg-blue-50 text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-blue-100 italic shadow-sm w-fit">
                    Security Level: Verified_{userData?.role}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Identity Credentials */}
                <div className="bg-white border border-gray-100 p-10 rounded-[3rem] space-y-10 shadow-4xl shadow-blue-900/[0.02]">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="size-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-inner border border-blue-100">
                            <User size={24} strokeWidth={3} />
                        </div>
                        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-300 italic">Identity Credentials</h3>
                    </div>

                    <div className="space-y-8">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-300 px-2 lg:px-4">Full Legal Name</label>
                            <div className="relative group">
                                <User className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-200 group-focus-within:text-blue-600 transition-all font-black" size={18} />
                                <input 
                                    type="text" 
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    className="w-full bg-gray-50 border border-transparent rounded-[1.8rem] p-6 pl-16 text-gray-900 font-black text-xs uppercase tracking-tight focus:bg-white focus:border-blue-600 outline-none italic transition-all shadow-inner"
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-300 px-2 lg:px-4">Institutional Email (Read-Only)</label>
                            <div className="relative">
                                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-200" size={18} />
                                <input 
                                    type="email" 
                                    value={formData.email}
                                    disabled
                                    className="w-full bg-gray-50/50 border border-gray-100 rounded-[1.8rem] p-6 pl-16 text-gray-300 font-black text-xs uppercase tracking-tight outline-none italic cursor-not-allowed"
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-300 px-2 lg:px-4">Phone Number</label>
                            <div className="relative group">
                                <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-200 group-focus-within:text-blue-600 transition-all font-black" size={18} />
                                <input 
                                    type="text" 
                                    value={formData.phone}
                                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                    className="w-full bg-gray-50 border border-transparent rounded-[1.8rem] p-6 pl-16 text-gray-900 font-black text-xs uppercase tracking-tight focus:bg-white focus:border-blue-600 outline-none italic transition-all shadow-inner"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Privacy Hub */}
                <div className="bg-white border border-gray-100 p-10 rounded-[3rem] space-y-10 shadow-4xl shadow-blue-900/[0.02]">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="size-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-inner border border-blue-100">
                            <ShieldCheck size={24} strokeWidth={3} />
                        </div>
                        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-300 italic">Privacy Hub</h3>
                    </div>

                    <div className="space-y-8">
                        <div className="p-8 rounded-[2rem] bg-gray-50 border border-gray-100 space-y-6 shadow-inner">
                            <div className="flex items-start gap-4">
                                <Info size={16} className="text-blue-600 shrink-0 mt-1" />
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 leading-relaxed italic">
                                    Choose how students and tutors can contact you.
                                </p>
                            </div>
                            <div className="flex flex-col gap-3">
                                {["PHONE", "EMAIL", "BOTH"].map(mode => (
                                    <button 
                                        key={mode}
                                        onClick={() => setFormData({...formData, preferredContact: mode})}
                                        className={`p-5 rounded-2xl border-2 font-black text-[10px] uppercase tracking-widest transition-all italic text-left ${
                                            formData.preferredContact === mode 
                                            ? "bg-blue-600 border-blue-600 text-white shadow-2xl shadow-blue-600/20" 
                                            : "bg-white border-transparent text-gray-300 hover:text-blue-600"
                                        }`}
                                    >
                                        COMMUNICATION_PROTOCOL: {mode}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="p-10 rounded-[2rem] bg-gray-900 text-white space-y-4 relative overflow-hidden group">
                             <div className="absolute top-0 right-0 size-32 bg-blue-600/20 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-blue-600/40 transition-all"></div>
                             <div className="flex items-center gap-3">
                                <Lock size={16} className="text-blue-400" strokeWidth={3} />
                                <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-widest leading-none">Change Password</h4>
                             </div>
                             <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] italic leading-relaxed">Request a password reset link sent to your email.</p>
                             <button className="relative z-10 mt-4 px-8 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black text-white uppercase tracking-widest hover:bg-white hover:text-gray-900 transition-all italic">Initiate Re-keying Request</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Response Section */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 pt-10 border-t border-gray-100">
                {message && (
                    <div className={`px-8 py-4 rounded-full text-[10px] font-black uppercase tracking-widest italic animate-in fade-in slide-in-from-left-4 shadow-sm border ${
                        message.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-red-50 border-red-100 text-red-600'
                    }`}>
                        {message.text}
                    </div>
                )}
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="ml-auto flex items-center gap-4 px-14 py-7 bg-blue-600 text-white rounded-[2.5rem] font-black text-[10px] tracking-[0.5em] shadow-4xl shadow-blue-600/30 hover:bg-gray-900 transition-all uppercase leading-none italic disabled:opacity-50 active:scale-95 group"
                >
                    {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} strokeWidth={3} className="group-hover:rotate-12 transition-transform" />}
                    Synchronize Registry
                </button>
            </div>
        </div>
    );
}
