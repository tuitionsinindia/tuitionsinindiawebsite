"use client";

import { useState } from "react";
import { useRef } from "react";
import { User, ShieldCheck, Mail, Phone, Bell, Save, Loader2, Lock, Camera } from "lucide-react";

export default function SettingsModule({ userData, onUpdate }) {
    const [formData, setFormData] = useState({
        name: userData?.name || "",
        email: userData?.email || "",
        phone: userData?.phone || "",
        preferredContact: userData?.privacySettings?.preferredContact || "PHONE",
    });

    const [notifPrefs, setNotifPrefs] = useState({
        emailMatches: userData?.notificationPrefs?.emailMatches ?? true,
        emailMessages: userData?.notificationPrefs?.emailMessages ?? true,
        emailPayments: userData?.notificationPrefs?.emailPayments ?? true,
        smsLeads: userData?.notificationPrefs?.smsLeads ?? false,
    });

    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState(null);
    const [resetSent, setResetSent] = useState(false);
    const [resetLoading, setResetLoading] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState(userData?.image || null);
    const [avatarUploading, setAvatarUploading] = useState(false);
    const fileInputRef = useRef(null);

    const handleAvatarUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 2 * 1024 * 1024) { setMessage({ type: "error", text: "Image must be under 2MB." }); return; }

        setAvatarUploading(true);
        const formData = new FormData();
        formData.append("file", file);
        try {
            const res = await fetch("/api/upload/avatar", { method: "POST", body: formData });
            if (res.ok) {
                const data = await res.json();
                setAvatarPreview(data.image);
                setMessage({ type: "success", text: "Photo updated." });
                if (onUpdate) onUpdate();
            } else {
                const err = await res.json();
                setMessage({ type: "error", text: err.error || "Upload failed." });
            }
        } catch {
            setMessage({ type: "error", text: "Upload failed." });
        } finally {
            setAvatarUploading(false);
        }
    };

    const handlePasswordReset = async () => {
        if (!userData?.email) return;
        setResetLoading(true);
        try {
            await fetch("/api/auth/password-reset", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: userData.email }),
            });
            setResetSent(true);
        } catch {
            // silently fail — user sees nothing unexpected
        } finally {
            setResetLoading(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        setMessage(null);
        try {
            const res = await fetch("/api/user/update", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: userData.id,
                    ...formData,
                    notificationPrefs: notifPrefs,
                }),
            });
            if (res.ok) {
                setMessage({ type: "success", text: "Settings saved successfully." });
                if (onUpdate) onUpdate();
            } else {
                throw new Error("Save failed");
            }
        } catch {
            setMessage({ type: "error", text: "Failed to save. Please try again." });
        } finally {
            setIsSaving(false);
        }
    };

    const Toggle = ({ value, onChange, label, description }) => (
        <div className="flex items-center justify-between py-3">
            <div>
                <p className="text-sm font-medium text-gray-900">{label}</p>
                {description && <p className="text-xs text-gray-400 mt-0.5">{description}</p>}
            </div>
            <button
                onClick={() => onChange(!value)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${value ? "bg-blue-600" : "bg-gray-200"}`}
            >
                <span className={`inline-block size-4 rounded-full bg-white shadow transition-transform ${value ? "translate-x-6" : "translate-x-1"}`} />
            </button>
        </div>
    );

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
                <p className="text-gray-500 text-sm mt-1">Manage your profile and notification preferences.</p>
            </div>

            {/* Profile Photo */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 flex items-center gap-5">
                <div className="relative group">
                    <div className="size-20 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-2xl overflow-hidden border-2 border-gray-200">
                        {avatarPreview ? (
                            <img src={avatarPreview} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            userData?.name?.[0] || <User size={28} />
                        )}
                    </div>
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={avatarUploading}
                        className="absolute -bottom-1 -right-1 size-7 rounded-full bg-blue-600 text-white flex items-center justify-center border-2 border-white hover:bg-blue-700 transition-colors"
                    >
                        {avatarUploading ? <Loader2 size={12} className="animate-spin" /> : <Camera size={12} />}
                    </button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleAvatarUpload}
                        className="hidden"
                    />
                </div>
                <div>
                    <p className="text-sm font-semibold text-gray-900">{userData?.name || "User"}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{userData?.email || userData?.phone || ""}</p>
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="mt-2 text-xs text-blue-600 hover:underline font-medium"
                    >
                        {avatarPreview ? "Change photo" : "Upload photo"}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Profile Info */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-5">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="size-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                            <User size={18} />
                        </div>
                        <h3 className="text-sm font-semibold text-gray-900">Profile Information</h3>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1.5">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={15} />
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 pl-10 text-sm text-gray-900 focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all"
                                    placeholder="Your full name"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1.5">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={15} />
                                <input
                                    type="email"
                                    value={formData.email}
                                    disabled
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 pl-10 text-sm text-gray-400 outline-none cursor-not-allowed"
                                />
                            </div>
                            <p className="text-[11px] text-gray-400 mt-1">Email cannot be changed.</p>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1.5">Phone Number</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={15} />
                                <input
                                    type="text"
                                    value={formData.phone}
                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 pl-10 text-sm text-gray-900 focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all"
                                    placeholder="+91 XXXXX XXXXX"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Notification Preferences */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-2">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="size-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                            <Bell size={18} />
                        </div>
                        <h3 className="text-sm font-semibold text-gray-900">Notification Preferences</h3>
                    </div>

                    <div className="divide-y divide-gray-100">
                        <Toggle
                            value={notifPrefs.emailMatches}
                            onChange={v => setNotifPrefs({ ...notifPrefs, emailMatches: v })}
                            label="Email — New Matches"
                            description="Get emailed when a tutor matches your requirements"
                        />
                        <Toggle
                            value={notifPrefs.emailMessages}
                            onChange={v => setNotifPrefs({ ...notifPrefs, emailMessages: v })}
                            label="Email — Messages"
                            description="Get emailed when someone sends you a message"
                        />
                        <Toggle
                            value={notifPrefs.emailPayments}
                            onChange={v => setNotifPrefs({ ...notifPrefs, emailPayments: v })}
                            label="Email — Payments"
                            description="Receipts and credit top-up confirmations"
                        />
                        <Toggle
                            value={notifPrefs.smsLeads}
                            onChange={v => setNotifPrefs({ ...notifPrefs, smsLeads: v })}
                            label="SMS — New Leads"
                            description="Get a text message when a new student lead matches you"
                        />
                    </div>
                </div>
            </div>

            {/* Contact Preference */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="size-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                        <ShieldCheck size={18} />
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900">Preferred Contact Method</h3>
                        <p className="text-xs text-gray-400 mt-0.5">How would you like students or tutors to contact you?</p>
                    </div>
                </div>
                <div className="flex flex-wrap gap-3">
                    {["PHONE", "EMAIL", "BOTH"].map(mode => (
                        <button
                            key={mode}
                            onClick={() => setFormData({ ...formData, preferredContact: mode })}
                            className={`px-5 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                                formData.preferredContact === mode
                                    ? "bg-blue-600 border-blue-600 text-white shadow-sm"
                                    : "bg-gray-50 border-gray-200 text-gray-600 hover:border-blue-300"
                            }`}
                        >
                            {mode === "PHONE" ? "Phone" : mode === "EMAIL" ? "Email" : "Phone & Email"}
                        </button>
                    ))}
                </div>
            </div>

            {/* Password Reset */}
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Lock size={16} className="text-amber-500 shrink-0" />
                    <div>
                        <p className="text-sm font-semibold text-amber-800">Change Password</p>
                        <p className="text-xs text-amber-600 mt-0.5">
                            {resetSent ? `Reset link sent to ${userData?.email}` : "Send a password reset link to your email."}
                        </p>
                    </div>
                </div>
                <button
                    onClick={handlePasswordReset}
                    disabled={resetLoading || resetSent}
                    className="px-4 py-2 bg-amber-500 text-white rounded-xl text-xs font-semibold hover:bg-amber-600 transition-colors disabled:opacity-60 flex items-center gap-1.5"
                >
                    {resetLoading ? <Loader2 size={13} className="animate-spin" /> : null}
                    {resetSent ? "Email Sent" : "Send Reset Link"}
                </button>
            </div>

            {/* Save */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                {message && (
                    <p className={`text-sm font-medium ${message.type === "success" ? "text-emerald-600" : "text-red-500"}`}>
                        {message.text}
                    </p>
                )}
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="ml-auto flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                    {isSaving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                    Save Changes
                </button>
            </div>
        </div>
    );
}
