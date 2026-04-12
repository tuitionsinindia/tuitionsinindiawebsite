"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
    Building2,
    ArrowLeft,
    Loader2,
    Save
} from "lucide-react";

function InstituteProfileEditorContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [instituteId, setInstituteId] = useState(searchParams.get("instituteId") || "");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        instituteName: "",
        contactPerson: "",
        phone: "",
        bio: "",
        subjects: "",
        locations: "",
        hourlyRate: 0,
        grades: "",
        experience: 0
    });

    useEffect(() => {
        if (instituteId) {
            fetchProfile();
        }
    }, [instituteId]);

    const fetchProfile = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/user/info?id=${instituteId}`);
            if (res.ok) {
                const data = await res.json();
                setFormData({
                    instituteName: data.name || "",
                    contactPerson: data.name || "",
                    phone: data.phone || "",
                    bio: data.tutorListing?.bio || "",
                    subjects: data.tutorListing?.subjects?.join(", ") || "",
                    locations: data.tutorListing?.locations?.join(", ") || "",
                    hourlyRate: data.tutorListing?.hourlyRate || 0,
                    grades: data.tutorListing?.grades?.join(", ") || "",
                    experience: data.tutorListing?.experience || 0
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
                body: JSON.stringify({
                    userId: instituteId,
                    isInstitute: true,
                    ...formData
                }),
            });

            if (res.ok) {
                alert("Profile updated successfully!");
                router.push(`/dashboard/institute?instituteId=${instituteId}`);
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

    const field = (label, children) => (
        <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">{label}</label>
            {children}
        </div>
    );

    const inputCls = "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all";

    if (!instituteId) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
                <div className="bg-white rounded-2xl border border-gray-200 p-8 max-w-md w-full text-center">
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h2>
                    <p className="text-gray-500 text-sm mb-6">An institute ID is required to edit this profile.</p>
                    <Link href="/dashboard/institute" className="text-blue-600 text-sm font-medium hover:underline">Go to Institute Dashboard</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 font-sans pb-20">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/90 backdrop-blur-xl px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href={`/dashboard/institute?instituteId=${instituteId}`} className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors">
                        <ArrowLeft size={18} className="text-gray-600" />
                    </Link>
                    <div>
                        <h1 className="text-base font-bold text-gray-900">Edit Institute Profile</h1>
                        <p className="text-xs text-gray-400">Update your public listing</p>
                    </div>
                </div>
                <Link href={`/tutor/${instituteId}`} target="_blank" className="hidden sm:flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                    Preview Public Profile
                </Link>
            </header>

            <main className="max-w-3xl mx-auto px-6 pt-8">
                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="animate-spin text-blue-600" size={32} />
                    </div>
                ) : (
                    <form onSubmit={handleSave} className="space-y-8">
                        {/* Identity */}
                        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
                            <h2 className="text-base font-bold text-gray-900">Basic Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {field("Institute Name",
                                    <input type="text" value={formData.instituteName} onChange={e => setFormData({...formData, instituteName: e.target.value})} className={inputCls} placeholder="e.g. Alpha Academics" required />
                                )}
                                {field("Contact Person",
                                    <input type="text" value={formData.contactPerson} onChange={e => setFormData({...formData, contactPerson: e.target.value})} className={inputCls} placeholder="e.g. Dr. Rahul Gupta" required />
                                )}
                                <div className="md:col-span-2">
                                    {field("Phone Number",
                                        <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className={inputCls} placeholder="+91 XXXXXXXXXX" required />
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Academic Details */}
                        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
                            <h2 className="text-base font-bold text-gray-900">Courses & Teaching</h2>
                            {field("Subjects & Courses (comma-separated)",
                                <textarea rows="3" value={formData.subjects} onChange={e => setFormData({...formData, subjects: e.target.value})} className={inputCls} placeholder="e.g. JEE Advanced, NEET Foundation, Class 12 Physics" required />
                            )}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {field("Locations / Areas Served",
                                    <input type="text" value={formData.locations} onChange={e => setFormData({...formData, locations: e.target.value})} className={inputCls} placeholder="e.g. South Mumbai, Online" />
                                )}
                                {field("Years of Experience",
                                    <input type="number" value={formData.experience} onChange={e => setFormData({...formData, experience: e.target.value})} className={inputCls} placeholder="e.g. 15" />
                                )}
                                {field("Average Fee (₹/course)",
                                    <input type="number" value={formData.hourlyRate} onChange={e => setFormData({...formData, hourlyRate: e.target.value})} className={inputCls} placeholder="e.g. 45000" />
                                )}
                                {field("Target Grades",
                                    <input type="text" value={formData.grades} onChange={e => setFormData({...formData, grades: e.target.value})} className={inputCls} placeholder="e.g. Class 9-12, Repeaters" />
                                )}
                            </div>
                        </div>

                        {/* Bio */}
                        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
                            <h2 className="text-base font-bold text-gray-900">About Your Institute</h2>
                            {field("Description",
                                <textarea rows="8" value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} className={inputCls} placeholder="Describe your institute's mission, teaching approach, facilities, and results..." required />
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
                                href={`/dashboard/institute?instituteId=${instituteId}`}
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

export default function InstituteProfileEditor() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <Loader2 className="animate-spin text-blue-600" size={32} />
            </div>
        }>
            <InstituteProfileEditorContent />
        </Suspense>
    );
}
