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
                throw new Error("Save failed");
            }
        } catch (err) {
            setMessage({ type: "error", text: "Failed to save. Please try again." });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Profile Settings</h2>
                <span className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-semibold border border-blue-100 w-fit">
                    {userData?.role || 'Member'}
                </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="bg-white border border-gray-100 p-6 rounded-2xl space-y-6 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="size-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                            <User size={20} />
                        </div>
                        <h3 className="text-sm font-bold text-gray-900">Personal Information</h3>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-gray-700">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-11 pr-4 text-sm text-gray-900 font-medium focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-gray-700">Email (read-only)</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                                <input
                                    type="email"
                                    value={formData.email}
                                    disabled
                                    className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 pl-11 pr-4 text-sm text-gray-400 cursor-not-allowed"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-gray-700">Phone Number</label>
                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                                <input
                                    type="text"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-11 pr-4 text-sm text-gray-900 font-medium focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 outline-none transition-all"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Privacy Settings */}
                <div className="bg-white border border-gray-100 p-6 rounded-2xl space-y-6 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="size-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                            <ShieldCheck size={20} />
                        </div>
                        <h3 className="text-sm font-bold text-gray-900">Privacy Settings</h3>
                    </div>

                    <div className="space-y-4">
                        <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 space-y-4">
                            <div className="flex items-start gap-3">
                                <Info size={14} className="text-blue-600 shrink-0 mt-0.5" />
                                <p className="text-sm text-gray-500">
                                    Choose how students and tutors can contact you.
                                </p>
                            </div>
                            <div className="flex flex-col gap-2">
                                {[
                                    { value: "PHONE", label: "Phone only" },
                                    { value: "EMAIL", label: "Email only" },
                                    { value: "BOTH", label: "Phone and email" }
                                ].map(mode => (
                                    <button
                                        key={mode.value}
                                        onClick={() => setFormData({...formData, preferredContact: mode.value})}
                                        className={`p-3 rounded-xl border text-sm font-medium transition-all text-left ${
                                            formData.preferredContact === mode.value
                                            ? "bg-blue-600 border-blue-600 text-white"
                                            : "bg-white border-gray-200 text-gray-700 hover:border-blue-300"
                                        }`}
                                    >
                                        {mode.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 space-y-3">
                            <div className="flex items-center gap-2">
                                <Lock size={14} className="text-gray-400" />
                                <h4 className="text-sm font-semibold text-gray-700">Change Password</h4>
                            </div>
                            <p className="text-sm text-gray-400">Request a password reset link sent to your email.</p>
                            <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:border-blue-500 hover:text-blue-600 transition-all">
                                Send Reset Link
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Save Button */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-100">
                {message && (
                    <div className={`px-4 py-2 rounded-lg text-sm font-medium ${
                        message.type === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                    }`}>
                        {message.text}
                    </div>
                )}
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="ml-auto flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold text-sm shadow-sm hover:bg-blue-700 transition-all disabled:opacity-50"
                >
                    {isSaving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                    Save Settings
                </button>
            </div>
        </div>
    );
}
