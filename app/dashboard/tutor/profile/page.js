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
                alert(err.error || "Failed to update profile.");
            }
        } catch (err) {
            console.error(err);
            alert("Error saving profile.");
        } finally {
            setSaving(false);
        }
    };

    if (!tutorId) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-background-dark p-4">
                <div className="bg-white dark:bg-slate-900 p-10 rounded-3xl shadow-2xl max-w-md w-full text-center">
                    <h2 className="text-2xl font-heading font-bold mb-4">Access Denied</h2>
                    <p className="text-slate-500 mb-8">Please access this page via your dashboard.</p>
                    <Link href="/dashboard/tutor" className="text-primary font-bold hover:underline">Return to Dashboard</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-surface font-body text-on-surface antialiased pb-20">
            {/* Header */}
            <header className="sticky top-0 z-[60] w-full border-b border-outline-variant/10 bg-white/70 dark:bg-slate-950/70 backdrop-blur-2xl px-6 md:px-12 py-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href={`/dashboard/tutor?tutorId=${tutorId}`} className="size-10 rounded-full bg-surface-container-high flex items-center justify-center hover:bg-primary hover:text-on-primary transition-all">
                        <span className="material-symbols-outlined text-lg">arrow_back</span>
                    </Link>
                    <h1 className="text-2xl font-headline font-black uppercase italic">Control <span className="text-primary not-italic lowercase font-serif font-light">Center.</span></h1>
                </div>
                <div className="flex items-center gap-4">
                    <Link href={`/tutor/${tutorId}?viewerId=${tutorId}`} target="_blank" className="hidden sm:flex items-center gap-2 px-6 py-2.5 bg-white border border-outline-variant/20 rounded-xl font-black text-xs tracking-widest hover:shadow-lg transition-all">
                        <span className="material-symbols-outlined text-sm">visibility</span>
                        PREVIEW PUBLIC PROFILE
                    </Link>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-6 pt-16">
                {loading ? (
                    <div className="py-32 flex flex-col items-center justify-center opacity-50">
                        <div className="size-16 rounded-full border-[6px] border-primary/10 border-t-primary animate-spin mb-8"></div>
                        <p className="font-black text-xs uppercase tracking-[0.4em]">Loading Configuration...</p>
                    </div>
                ) : (
                    <form onSubmit={handleSave} className="space-y-12">
                        {/* Section 1: Professional Identity */}
                        <section className="bg-white dark:bg-slate-900/50 rounded-[3rem] p-10 md:p-16 border border-outline-variant/5 shadow-sm">
                            <h2 className="text-3xl font-headline font-black mb-10 uppercase italic tracking-tight">Professional <span className="text-primary not-italic font-serif lowercase font-light">identity</span></h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-3">
                                    <label className="text-xs font-black uppercase tracking-widest opacity-40 ml-2">Full Legal Name</label>
                                    <input 
                                        type="text" 
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        className="w-full bg-surface-container-low border-none rounded-2xl p-5 focus:ring-2 focus:ring-primary outline-none font-bold"
                                        placeholder="e.g. Rahul Gupta"
                                        required
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-xs font-black uppercase tracking-widest opacity-40 ml-2">Contact Intelligence (Phone)</label>
                                    <input 
                                        type="tel" 
                                        value={formData.phone}
                                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                        className="w-full bg-surface-container-low border-none rounded-2xl p-5 focus:ring-2 focus:ring-primary outline-none font-bold"
                                        placeholder="e.g. +91 9876543210"
                                        required
                                    />
                                </div>
                                <div className="md:col-span-2 space-y-3">
                                    <label className="text-xs font-black uppercase tracking-widest opacity-40 ml-2">Professional Headline</label>
                                    <input 
                                        type="text" 
                                        value={formData.title}
                                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                                        className="w-full bg-surface-container-low border-none rounded-2xl p-5 focus:ring-2 focus:ring-primary outline-none font-bold"
                                        placeholder="e.g. Senior Mathematics Specialist with 10+ Years Experience"
                                        required
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Section 2: Expertise & Subjects */}
                        <section className="bg-white dark:bg-slate-900/50 rounded-[3rem] p-10 md:p-16 border border-outline-variant/5 shadow-sm">
                            <h2 className="text-3xl font-headline font-black mb-10 uppercase italic tracking-tight">Expertise <span className="text-primary not-italic font-serif lowercase font-light">domain</span></h2>
                            
                            <div className="space-y-10">
                                <div className="space-y-3">
                                    <label className="text-xs font-black uppercase tracking-widest opacity-40 ml-2">Subjects (Comma Separated)</label>
                                    <textarea 
                                        rows="2"
                                        value={formData.subjects}
                                        onChange={(e) => setFormData({...formData, subjects: e.target.value})}
                                        className="w-full bg-surface-container-low border-none rounded-2xl p-5 focus:ring-2 focus:ring-primary outline-none font-bold resize-none"
                                        placeholder="e.g. Mathematics, Calculus, Trigonometry"
                                        required
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-xs font-black uppercase tracking-widest opacity-40 ml-2">Serviceable Locations</label>
                                    <input 
                                        type="text" 
                                        value={formData.locations}
                                        onChange={(e) => setFormData({...formData, locations: e.target.value})}
                                        className="w-full bg-surface-container-low border-none rounded-2xl p-5 focus:ring-2 focus:ring-primary outline-none font-bold"
                                        placeholder="e.g. South Mumbai, Bandra, Online"
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="space-y-3">
                                        <label className="text-xs font-black uppercase tracking-widest opacity-40 ml-2">Hourly Strategy Rate (₹)</label>
                                        <input 
                                            type="number" 
                                            value={formData.hourlyRate}
                                            onChange={(e) => setFormData({...formData, hourlyRate: e.target.value})}
                                            className="w-full bg-surface-container-low border-none rounded-2xl p-5 focus:ring-2 focus:ring-primary outline-none font-bold"
                                            placeholder="e.g. 1500"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-xs font-black uppercase tracking-widest opacity-40 ml-2">Target Academic Grades</label>
                                        <input 
                                            type="text" 
                                            value={formData.grades}
                                            onChange={(e) => setFormData({...formData, grades: e.target.value})}
                                            className="w-full bg-surface-container-low border-none rounded-2xl p-5 focus:ring-2 focus:ring-primary outline-none font-bold"
                                            placeholder="e.g. Class 10, Class 12, JEE"
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Section 3: Professional Bio */}
                        <section className="bg-white dark:bg-slate-900/50 rounded-[3rem] p-10 md:p-16 border border-outline-variant/5 shadow-sm">
                            <h2 className="text-3xl font-headline font-black mb-10 uppercase italic tracking-tight">Strategy & <span className="text-primary not-italic font-serif lowercase font-light">philosophy</span></h2>
                            
                            <div className="space-y-3">
                                <label className="text-xs font-black uppercase tracking-widest opacity-40 ml-2">Detailed Professional Biography</label>
                                <textarea 
                                    rows="8"
                                    value={formData.bio}
                                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                                    className="w-full bg-surface-container-low border-none rounded-2xl p-8 focus:ring-2 focus:ring-primary outline-none font-medium leading-relaxed"
                                    placeholder="Tell students about your methodology, experience, and why you are the best fit for their academic goals."
                                    required
                                />
                            </div>
                        </section>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-6 pt-10">
                            <button 
                                type="submit"
                                disabled={saving}
                                className="flex-1 bg-primary text-on-primary py-8 rounded-[2rem] font-black text-xs tracking-[0.4em] uppercase transition-all flex items-center justify-center gap-4 shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                            >
                                {saving ? (
                                    <>
                                        <span className="material-symbols-outlined animate-spin">sync</span>
                                        SYNCHRONIZING...
                                    </>
                                ) : (
                                    <>
                                        <span className="material-symbols-outlined">save</span>
                                        PERSIST CHANGES
                                    </>
                                )}
                            </button>
                            <Link 
                                href={`/dashboard/tutor?tutorId=${tutorId}`}
                                className="sm:w-1/3 py-8 rounded-[2rem] border border-outline-variant/20 font-black text-xs tracking-[0.4em] uppercase transition-all flex items-center justify-center gap-4 hover:bg-surface-container-high"
                            >
                                ABORT
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
            <div className="flex items-center justify-center min-h-screen bg-background-light dark:bg-background-dark">
                <div className="flex flex-col items-center">
                    <span className="material-symbols-outlined text-5xl text-primary animate-spin">sync</span>
                    <p className="mt-4 font-heading font-bold text-slate-500">Initializing Control Center...</p>
                </div>
            </div>
        }>
            <ProfileEditorContent />
        </Suspense>
    );
}
