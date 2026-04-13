"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
    Building2,
    ArrowLeft,
    Save,
    School,
    BookOpen,
    BadgeCheck
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
                alert(err.error || "Failed to update profile. Please try again.");
            }
        } catch (err) {
            console.error(err);
            alert("Error saving profile. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    if (!instituteId) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
                <div className="bg-white p-8 rounded-2xl border border-gray-200 max-w-md w-full text-center shadow-sm">
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">Access Required</h2>
                    <p className="text-gray-500 mb-6 text-sm">Please log in with your institute account to edit your profile.</p>
                    <Link href="/dashboard/institute" className="text-blue-600 font-semibold text-sm hover:underline">Back to Dashboard</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 font-sans pb-20">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white px-6 md:px-12 py-4 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-4">
                    <Link href={`/dashboard/institute?instituteId=${instituteId}`} className="size-10 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all text-gray-500">
                        <ArrowLeft size={20} strokeWidth={2} />
                    </Link>
                    <div>
                        <h1 className="text-lg font-bold text-gray-900 leading-none mb-0.5">Edit Institute Profile</h1>
                        <p className="text-xs text-gray-400">Update your institute details</p>
                    </div>
                </div>
                <Link href={`/tutor/${instituteId}`} target="_blank" className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-white hover:text-blue-600 transition-all">
                    Preview Public Profile
                </Link>
            </header>

            <main className="max-w-3xl mx-auto px-6 pt-10">
                {loading ? (
                    <div className="py-24 flex flex-col items-center justify-center text-gray-400">
                        <div className="size-10 rounded-full border-4 border-gray-200 border-t-blue-600 animate-spin mb-4"></div>
                        <p className="text-sm font-medium">Loading profile...</p>
                    </div>
                ) : (
                    <form onSubmit={handleSave} className="space-y-8">
                        {/* Section 1: Basic Info */}
                        <section className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="size-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                                    <School size={16} strokeWidth={2} />
                                </div>
                                <h2 className="text-base font-bold text-gray-900">Institute details</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-gray-600">Institute name</label>
                                    <input
                                        type="text"
                                        value={formData.instituteName}
                                        onChange={(e) => setFormData({...formData, instituteName: e.target.value})}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400"
                                        placeholder="e.g. Alpha Academics"
                                        required
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-gray-600">Contact person</label>
                                    <input
                                        type="text"
                                        value={formData.contactPerson}
                                        onChange={(e) => setFormData({...formData, contactPerson: e.target.value})}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400"
                                        placeholder="e.g. Rahul Gupta"
                                        required
                                    />
                                </div>
                                <div className="md:col-span-2 space-y-1.5">
                                    <label className="text-xs font-semibold text-gray-600">Phone number</label>
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400"
                                        placeholder="+91 XXXXXXXXXX"
                                        required
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Section 2: Academic Details */}
                        <section className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="size-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                                    <BadgeCheck size={16} strokeWidth={2} />
                                </div>
                                <h2 className="text-base font-bold text-gray-900">Subjects and classes</h2>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-gray-600">Subjects offered (comma separated)</label>
                                    <textarea
                                        rows="3"
                                        value={formData.subjects}
                                        onChange={(e) => setFormData({...formData, subjects: e.target.value})}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400 resize-none"
                                        placeholder="e.g. JEE Advanced, NEET Foundation, Class 12 Physics"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-gray-600">Locations served</label>
                                        <input
                                            type="text"
                                            value={formData.locations}
                                            onChange={(e) => setFormData({...formData, locations: e.target.value})}
                                            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400"
                                            placeholder="e.g. South Mumbai, Online"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-gray-600">Years of experience</label>
                                        <input
                                            type="number"
                                            value={formData.experience}
                                            onChange={(e) => setFormData({...formData, experience: e.target.value})}
                                            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400"
                                            placeholder="e.g. 15"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-gray-600">Average fee per course (₹)</label>
                                        <input
                                            type="number"
                                            value={formData.hourlyRate}
                                            onChange={(e) => setFormData({...formData, hourlyRate: e.target.value})}
                                            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400"
                                            placeholder="e.g. 45000"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-gray-600">Classes or grades taught</label>
                                        <input
                                            type="text"
                                            value={formData.grades}
                                            onChange={(e) => setFormData({...formData, grades: e.target.value})}
                                            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400"
                                            placeholder="e.g. Class 9–12, Repeaters"
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Section 3: About */}
                        <section className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="size-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                                    <BookOpen size={16} strokeWidth={2} />
                                </div>
                                <h2 className="text-base font-bold text-gray-900">About your institute</h2>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-gray-600">Description</label>
                                <textarea
                                    rows="8"
                                    value={formData.bio}
                                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400 leading-relaxed"
                                    placeholder="Describe your institute's teaching approach, facilities, results, and what makes you a good choice for students."
                                    required
                                />
                            </div>
                        </section>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-2">
                            <button
                                type="submit"
                                disabled={saving}
                                className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 hover:bg-blue-700 disabled:opacity-50"
                            >
                                {saving ? (
                                    <>
                                        <div className="size-4 rounded-full border-2 border-white/30 border-t-white animate-spin"></div>
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save size={16} strokeWidth={2} />
                                        Save Changes
                                    </>
                                )}
                            </button>
                            <Link
                                href={`/dashboard/institute?instituteId=${instituteId}`}
                                className="sm:w-40 py-3 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-600 transition-all flex items-center justify-center hover:bg-gray-50"
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
                <div className="flex flex-col items-center gap-4 text-gray-400">
                    <div className="size-10 rounded-full border-4 border-gray-200 border-t-blue-600 animate-spin"></div>
                    <p className="text-sm font-medium">Loading profile...</p>
                </div>
            </div>
        }>
            <InstituteProfileEditorContent />
        </Suspense>
    );
}
