"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Loader2 } from "lucide-react";

function ProfileEditorContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [tutorId, setTutorId] = useState(searchParams.get("tutorId") || "");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        title: "",
        bio: "",
        subjects: "",
        locations: "",
        hourlyRate: 0,
        grades: ""
    });

    useEffect(() => {
        if (tutorId) {
            fetchProfile();
        }
    }, [tutorId]);

    const fetchProfile = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/user/info?id=${tutorId}`);
            if (res.ok) {
                const data = await res.json();
                setFormData({
                    name: data.name || "",
                    phone: data.phone || "",
                    title: data.tutorListing?.title || "Professional Tutor",
                    bio: data.tutorListing?.bio || "",
                    subjects: data.tutorListing?.subjects?.join(", ") || "",
                    locations: data.tutorListing?.locations?.join(", ") || "",
                    hourlyRate: data.tutorListing?.hourlyRate || 0,
                    grades: data.tutorListing?.grades?.join(", ") || ""
                });
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await fetch("/api/tutor/profile/update", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ tutorId, ...formData }),
            });

            if (res.ok) {
                alert("Profile updated successfully!");
                router.push(`/dashboard/tutor?tutorId=${tutorId}`);
            } else {
                const err = await res.json();
                alert(err.error || "Failed to update profile.");
            }
        } catch (err) {
            console.error(err);
            alert("Error saving profile.");
        } finally {
            setSaving(false);
        }
    };

    const inputCls = "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all bg-white";

    const field = (label, children) => (
        <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">{label}</label>
            {children}
        </div>
    );

    if (!tutorId) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
                <div className="bg-white rounded-2xl border border-gray-200 p-8 max-w-md w-full text-center">
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h2>
                    <p className="text-gray-500 text-sm mb-6">Please access this page from your dashboard.</p>
                    <Link href="/dashboard/tutor" className="text-blue-600 text-sm font-medium hover:underline">Return to Dashboard</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 font-sans pb-20">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/90 backdrop-blur-xl px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href={`/dashboard/tutor?tutorId=${tutorId}`} className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors">
                        <ArrowLeft size={18} className="text-gray-600" />
                    </Link>
                    <div>
                        <h1 className="text-base font-bold text-gray-900">Edit Profile</h1>
                        <p className="text-xs text-gray-400">Update your public listing</p>
                    </div>
                </div>
                <Link href={`/tutor/${tutorId}`} target="_blank" className="hidden sm:flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                    Preview Public Profile
                </Link>
            </header>

            <main className="max-w-3xl mx-auto px-6 pt-8">
                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="animate-spin text-blue-600" size={32} />
                    </div>
                ) : (
                    <form onSubmit={handleSave} className="space-y-6">
                        {/* Basic Info */}
                        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
                            <h2 className="text-base font-bold text-gray-900">Basic Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {field("Full Name",
                                    <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className={inputCls} placeholder="e.g. Rahul Gupta" required />
                                )}
                                {field("Phone Number",
                                    <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className={inputCls} placeholder="e.g. +91 9876543210" required />
                                )}
                                <div className="md:col-span-2">
                                    {field("Professional Headline",
                                        <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className={inputCls} placeholder="e.g. Senior Maths Tutor with 10+ years experience" required />
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Teaching Details */}
                        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
                            <h2 className="text-base font-bold text-gray-900">Teaching Details</h2>
                            {field("Subjects (comma-separated)",
                                <textarea rows="2" value={formData.subjects} onChange={e => setFormData({...formData, subjects: e.target.value})} className={inputCls} placeholder="e.g. Mathematics, Calculus, Trigonometry" required />
                            )}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {field("Locations / Areas",
                                    <input type="text" value={formData.locations} onChange={e => setFormData({...formData, locations: e.target.value})} className={inputCls} placeholder="e.g. South Mumbai, Bandra, Online" />
                                )}
                                {field("Hourly Rate (₹)",
                                    <input type="number" value={formData.hourlyRate} onChange={e => setFormData({...formData, hourlyRate: e.target.value})} className={inputCls} placeholder="e.g. 1500" />
                                )}
                                {field("Target Grades",
                                    <input type="text" value={formData.grades} onChange={e => setFormData({...formData, grades: e.target.value})} className={inputCls} placeholder="e.g. Class 10, Class 12, JEE" />
                                )}
                            </div>
                        </div>

                        {/* Bio */}
                        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
                            <h2 className="text-base font-bold text-gray-900">About You</h2>
                            {field("Bio",
                                <textarea rows="8" value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} className={inputCls} placeholder="Tell students about your experience, teaching approach, and why they should choose you..." required />
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3">
                            <button
                                type="submit"
                                disabled={saving}
                                className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 text-sm"
                            >
                                {saving ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : <><Save size={16} /> Save Changes</>}
                            </button>
                            <Link
                                href={`/dashboard/tutor?tutorId=${tutorId}`}
                                className="px-6 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </Link>
                        </div>
                    </form>
                )}
            </main>
        </div>
    );
}

export default function ProfileEditor() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <Loader2 className="animate-spin text-blue-600" size={32} />
            </div>
        }>
            <ProfileEditorContent />
        </Suspense>
    );
}
