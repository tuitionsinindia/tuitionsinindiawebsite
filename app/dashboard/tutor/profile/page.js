"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

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
                alert(err.error || "Failed to update profile. Please try again.");
            }
        } catch (err) {
            console.error(err);
            alert("Something went wrong. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    if (!tutorId) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 max-w-md w-full text-center">
                    <h2 className="text-xl font-bold text-gray-900 mb-3">Access Denied</h2>
                    <p className="text-gray-500 mb-6">Please access this page via your dashboard.</p>
                    <Link href="/dashboard/tutor" className="text-blue-600 font-semibold hover:underline">Return to Dashboard</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 font-sans pb-20">
            {/* Header */}
            <header className="sticky top-0 z-[60] w-full border-b border-gray-200 bg-white px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Link href={`/dashboard/tutor?tutorId=${tutorId}`} className="size-9 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
                        <span className="material-symbols-outlined text-lg text-gray-600">arrow_back</span>
                    </Link>
                    <h1 className="text-lg font-bold text-gray-900">Edit Profile</h1>
                </div>
                <Link href={`/tutor/${tutorId}?viewerId=${tutorId}`} target="_blank" className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl font-semibold text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                    <span className="material-symbols-outlined text-sm">visibility</span>
                    Preview profile
                </Link>
            </header>

            <main className="max-w-3xl mx-auto px-6 pt-10">
                {loading ? (
                    <div className="py-20 flex flex-col items-center justify-center text-gray-400">
                        <div className="size-10 rounded-full border-4 border-gray-200 border-t-blue-600 animate-spin mb-4"></div>
                        <p className="text-sm font-semibold">Loading your profile...</p>
                    </div>
                ) : (
                    <form onSubmit={handleSave} className="space-y-6">
                        {/* Section 1: Basic Info */}
                        <section className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                            <h2 className="text-lg font-bold text-gray-900 mb-5">Basic information</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Full name</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none font-medium"
                                        placeholder="e.g. Rahul Gupta"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Phone number</label>
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none font-medium"
                                        placeholder="e.g. +91 9876543210"
                                        required
                                    />
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Profile headline</label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none font-medium"
                                        placeholder="e.g. Maths tutor with 10+ years experience"
                                        required
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Section 2: Subjects & Locations */}
                        <section className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                            <h2 className="text-lg font-bold text-gray-900 mb-5">Subjects and locations</h2>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Subjects you teach <span className="text-gray-400 font-normal">(comma separated)</span></label>
                                    <textarea
                                        rows="2"
                                        value={formData.subjects}
                                        onChange={(e) => setFormData({...formData, subjects: e.target.value})}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none font-medium resize-none"
                                        placeholder="e.g. Mathematics, Calculus, Trigonometry"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Locations you teach in <span className="text-gray-400 font-normal">(comma separated)</span></label>
                                    <input
                                        type="text"
                                        value={formData.locations}
                                        onChange={(e) => setFormData({...formData, locations: e.target.value})}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none font-medium"
                                        placeholder="e.g. South Mumbai, Bandra, Online"
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">Hourly rate (₹)</label>
                                        <input
                                            type="number"
                                            value={formData.hourlyRate}
                                            onChange={(e) => setFormData({...formData, hourlyRate: e.target.value})}
                                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none font-medium"
                                            placeholder="e.g. 1500"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">Grades you teach</label>
                                        <input
                                            type="text"
                                            value={formData.grades}
                                            onChange={(e) => setFormData({...formData, grades: e.target.value})}
                                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none font-medium"
                                            placeholder="e.g. Class 10, Class 12, JEE"
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Section 3: Bio */}
                        <section className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                            <h2 className="text-lg font-bold text-gray-900 mb-5">About you</h2>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Your bio</label>
                                <textarea
                                    rows="7"
                                    value={formData.bio}
                                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none font-medium leading-relaxed"
                                    placeholder="Tell students about your experience, teaching style, and why you are a good fit for them."
                                    required
                                />
                            </div>
                        </section>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-3 pb-6">
                            <button
                                type="submit"
                                disabled={saving}
                                className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2 hover:bg-blue-700 disabled:opacity-50"
                            >
                                {saving ? (
                                    <>
                                        <span className="material-symbols-outlined animate-spin text-lg">sync</span>
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <span className="material-symbols-outlined text-lg">save</span>
                                        Save changes
                                    </>
                                )}
                            </button>
                            <Link
                                href={`/dashboard/tutor?tutorId=${tutorId}`}
                                className="sm:w-1/3 py-3 rounded-xl border border-gray-200 font-semibold text-sm text-gray-700 transition-colors flex items-center justify-center hover:bg-gray-50"
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
                <div className="flex flex-col items-center text-gray-400">
                    <span className="material-symbols-outlined text-4xl text-blue-600 animate-spin">sync</span>
                    <p className="mt-3 font-semibold text-sm">Loading profile...</p>
                </div>
            </div>
        }>
            <ProfileEditorContent />
        </Suspense>
    );
}
