"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
    Building2, 
    ArrowLeft, 
    Visibility, 
    Save, 
    Close,
    School,
    MapPin,
    BookOpen,
    Users,
    BadgeCheck,
    Contact
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
                    contactPerson: data.name || "", // Assuming name is the contact person if not specialized
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
                alert("Institutional profile updated successfully!");
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

    if (!instituteId) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background-dark p-4">
                <div className="bg-surface-dark p-10 rounded-[2.5rem] border border-border-dark max-w-md w-full text-center">
                    <h2 className="text-3xl font-black text-white mb-4 uppercase italic tracking-tighter">Access Denied</h2>
                    <p className="text-on-surface-dark/40 mb-8 font-medium uppercase tracking-widest text-xs italic leading-loose">"Identity verification required to access the B2B configuration matrix."</p>
                    <Link href="/dashboard/institute" className="text-indigo-500 font-black text-xs uppercase tracking-[0.3em] hover:text-white transition-colors">Back to Dashboard</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background-dark font-sans text-on-background-dark antialiased pb-20 selection:bg-indigo-500/20 selection:text-indigo-500">
            {/* Unified B2B Header */}
            <header className="sticky top-0 z-[60] w-full border-b border-border-dark bg-background-dark/80 backdrop-blur-2xl px-6 md:px-12 py-6 flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <Link href={`/dashboard/institute?instituteId=${instituteId}`} className="group size-12 rounded-2xl bg-surface-dark border border-border-dark flex items-center justify-center hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all active:scale-95 shadow-lg">
                        <Building2 size={24} strokeWidth={1.5} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-black uppercase italic tracking-tighter text-white leading-none mb-1">Entity <span className="text-indigo-500 underline decoration-indigo-500/20 underline-offset-4 decoration-4">Config.</span></h1>
                        <p className="text-xs font-black uppercase tracking-[0.4em] text-on-surface-dark/20 leading-none">Institute Profile</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <Link href={`/tutor/${instituteId}`} target="_blank" className="hidden sm:flex items-center gap-3 px-8 py-3.5 bg-surface-dark border border-border-dark rounded-xl font-black text-xs tracking-widest hover:bg-white hover:text-black transition-all active:scale-95 uppercase leading-none">
                        PREVIEW PUBLIC PRESENCE
                    </Link>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-6 pt-20">
                {loading ? (
                    <div className="py-40 flex flex-col items-center justify-center opacity-50">
                        <div className="size-20 rounded-[2rem] border-[8px] border-indigo-500/5 border-t-indigo-500 animate-spin mb-10 shadow-2xl"></div>
                        <p className="font-black text-xs uppercase tracking-[0.6em] italic animate-pulse">Loading profile...</p>
                    </div>
                ) : (
                    <form onSubmit={handleSave} className="space-y-16">
                        {/* Section 1: Entity Identity */}
                        <section className="bg-surface-dark/40 backdrop-blur-md rounded-[4rem] p-12 md:p-20 border border-border-dark relative overflow-hidden group shadow-2xl border-b-[12px] hover:border-indigo-500/30 transition-all duration-700">
                            <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-[0.1] transition-all duration-1000 group-hover:scale-125 group-hover:rotate-6 text-white pointer-events-none">
                                <School size={200} strokeWidth={1} />
                            </div>
                            
                            <div className="relative z-10">
                                <h2 className="text-4xl font-black mb-12 uppercase italic tracking-tighter text-white">Institutional <span className="text-indigo-500 not-italic font-serif font-light lowercase">identity.</span></h2>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="space-y-4">
                                        <label className="text-xs font-black uppercase tracking-[0.4em] text-on-surface-dark/40 ml-2 italic">Institution Brand Name</label>
                                        <div className="relative group/input">
                                            <input 
                                                type="text" 
                                                value={formData.instituteName}
                                                onChange={(e) => setFormData({...formData, instituteName: e.target.value})}
                                                className="w-full bg-background-dark/50 border border-border-dark rounded-2xl p-6 focus:ring-2 focus:ring-indigo-500 outline-none font-black text-lg uppercase tracking-tight text-white transition-all placeholder:text-white/5"
                                                placeholder="e.g. ALPHA ACADEMICS"
                                                required
                                            />
                                            <div className="absolute inset-0 rounded-2xl bg-indigo-500/5 opacity-0 group-focus-within/input:opacity-100 transition-opacity pointer-events-none"></div>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-xs font-black uppercase tracking-[0.4em] text-on-surface-dark/40 ml-2 italic">Authorized Contact Person</label>
                                        <input 
                                            type="text" 
                                            value={formData.contactPerson}
                                            onChange={(e) => setFormData({...formData, contactPerson: e.target.value})}
                                            className="w-full bg-background-dark/50 border border-border-dark rounded-2xl p-6 focus:ring-2 focus:ring-indigo-500 outline-none font-black text-lg uppercase tracking-tight text-white transition-all placeholder:text-white/5"
                                            placeholder="e.g. DR. RAHUL GUPTA"
                                            required
                                        />
                                    </div>
                                    <div className="md:col-span-2 space-y-4">
                                        <label className="text-xs font-black uppercase tracking-[0.4em] text-on-surface-dark/40 ml-2 italic">Phone Number</label>
                                        <input 
                                            type="tel" 
                                            value={formData.phone}
                                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                            className="w-full bg-background-dark/50 border border-border-dark rounded-2xl p-6 focus:ring-2 focus:ring-indigo-500 outline-none font-black text-lg uppercase tracking-widest text-white transition-all placeholder:text-white/5"
                                            placeholder="+91 XXXXXXXXXX"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Section 2: Educational Vector */}
                        <section className="bg-surface-dark/40 backdrop-blur-md rounded-[4rem] p-12 md:p-20 border border-border-dark relative overflow-hidden group shadow-2xl border-b-[12px] hover:border-indigo-500/30 transition-all duration-700">
                             <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-[0.1] transition-all duration-1000 group-hover:scale-125 group-hover:rotate-6 text-white pointer-events-none">
                                <BadgeCheck size={200} strokeWidth={1} />
                            </div>

                            <div className="relative z-10">
                                <h2 className="text-4xl font-black mb-12 uppercase italic tracking-tighter text-white">Academic <span className="text-indigo-500 not-italic font-serif font-light lowercase">vectors.</span></h2>
                                
                                <div className="space-y-12">
                                    <div className="space-y-4">
                                        <label className="text-xs font-black uppercase tracking-[0.4em] text-on-surface-dark/40 ml-2 italic">Subjects & Batches (Comma Separated)</label>
                                        <textarea 
                                            rows="3"
                                            value={formData.subjects}
                                            onChange={(e) => setFormData({...formData, subjects: e.target.value})}
                                            className="w-full bg-background-dark/50 border border-border-dark rounded-3xl p-8 focus:ring-2 focus:ring-indigo-500 outline-none font-black text-lg uppercase tracking-tight text-white transition-all placeholder:text-white/5 resize-none leading-relaxed"
                                            placeholder="e.g. JEE ADVANCED, NEET FOUNDATION, CLASS 12 PHYSICS"
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                        <div className="space-y-4">
                                            <label className="text-xs font-black uppercase tracking-[0.4em] text-on-surface-dark/40 ml-2 italic">Serviceable Regions</label>
                                            <input 
                                                type="text" 
                                                value={formData.locations}
                                                onChange={(e) => setFormData({...formData, locations: e.target.value})}
                                                className="w-full bg-background-dark/50 border border-border-dark rounded-2xl p-6 focus:ring-2 focus:ring-indigo-500 outline-none font-black text-lg uppercase tracking-tight text-white transition-all placeholder:text-white/5"
                                                placeholder="e.g. SOUTH MUMBAI, ONLINE, HYBRID"
                                            />
                                        </div>
                                        <div className="space-y-4">
                                            <label className="text-xs font-black uppercase tracking-[0.4em] text-on-surface-dark/40 ml-2 italic">Foundation Year / Experience</label>
                                            <input 
                                                type="number" 
                                                value={formData.experience}
                                                onChange={(e) => setFormData({...formData, experience: e.target.value})}
                                                className="w-full bg-background-dark/50 border border-border-dark rounded-2xl p-6 focus:ring-2 focus:ring-indigo-500 outline-none font-black text-lg uppercase tracking-tight text-white transition-all placeholder:text-white/5"
                                                placeholder="e.g. 15"
                                            />
                                        </div>
                                        <div className="space-y-4">
                                            <label className="text-xs font-black uppercase tracking-[0.4em] text-on-surface-dark/40 ml-2 italic">Fee Structure (Average ₹/Course)</label>
                                            <input 
                                                type="number" 
                                                value={formData.hourlyRate}
                                                onChange={(e) => setFormData({...formData, hourlyRate: e.target.value})}
                                                className="w-full bg-background-dark/50 border border-border-dark rounded-2xl p-6 focus:ring-2 focus:ring-indigo-500 outline-none font-black text-lg uppercase tracking-tight text-white transition-all placeholder:text-white/5"
                                                placeholder="e.g. 45000"
                                            />
                                        </div>
                                        <div className="space-y-4">
                                            <label className="text-xs font-black uppercase tracking-[0.4em] text-on-surface-dark/40 ml-2 italic">Target Grade Matrices</label>
                                            <input 
                                                type="text" 
                                                value={formData.grades}
                                                onChange={(e) => setFormData({...formData, grades: e.target.value})}
                                                className="w-full bg-background-dark/50 border border-border-dark rounded-2xl p-6 focus:ring-2 focus:ring-indigo-500 outline-none font-black text-lg uppercase tracking-tight text-white transition-all placeholder:text-white/5"
                                                placeholder="e.g. CLASS 9-12, REPEATERS"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Section 3: Institutional Bio */}
                        <section className="bg-surface-dark/40 backdrop-blur-md rounded-[4rem] p-12 md:p-20 border border-border-dark relative overflow-hidden group shadow-2xl border-b-[12px] hover:border-indigo-500/30 transition-all duration-700">
                             <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-[0.1] transition-all duration-1000 group-hover:scale-125 group-hover:rotate-6 text-white pointer-events-none">
                                <BookOpen size={200} strokeWidth={1} />
                            </div>

                            <div className="relative z-10">
                                <h2 className="text-4xl font-black mb-12 uppercase italic tracking-tighter text-white">Pedagogical <span className="text-indigo-500 not-italic font-serif font-light lowercase">philosophy.</span></h2>
                                
                                <div className="space-y-4">
                                    <label className="text-xs font-black uppercase tracking-[0.4em] text-on-surface-dark/40 ml-2 italic">Institutional Biography & Methodology</label>
                                    <textarea 
                                        rows="10"
                                        value={formData.bio}
                                        onChange={(e) => setFormData({...formData, bio: e.target.value})}
                                        className="w-full bg-background-dark/50 border border-border-dark rounded-[2.5rem] p-10 focus:ring-2 focus:ring-indigo-500 outline-none font-medium text-lg text-white/80 transition-all placeholder:text-white/5 leading-relaxed"
                                        placeholder="Describe your academy's mission, teaching methodology, facilities, and historic results to attract the right students."
                                        required
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-8 pt-10">
                            <button 
                                type="submit"
                                disabled={saving}
                                className="flex-1 bg-indigo-600 text-white py-10 rounded-[3rem] font-black text-[12px] tracking-[0.6em] uppercase transition-all flex items-center justify-center gap-6 shadow-2xl shadow-indigo-600/30 hover:scale-[1.02] active:scale-95 disabled:opacity-50 italic leading-none"
                            >
                                {saving ? (
                                    <>
                                        <div className="size-5 rounded-full border-4 border-white/20 border-t-white animate-spin"></div>
                                        SYNCHRONIZING...
                                    </>
                                ) : (
                                    <>
                                        <Save size={20} strokeWidth={3} />
                                        PERSIST B2B CHANGES
                                    </>
                                )}
                            </button>
                            <Link 
                                href={`/dashboard/institute?instituteId=${instituteId}`}
                                className="sm:w-1/3 py-10 rounded-[3rem] border border-border-dark bg-surface-dark/40 backdrop-blur-sm font-black text-[12px] tracking-[0.6em] uppercase transition-all flex items-center justify-center gap-6 hover:bg-white hover:text-black hover:border-white active:scale-95 italic leading-none"
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

export default function InstituteProfileEditor() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen bg-background-dark overflow-hidden relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[400px] bg-indigo-600/10 rounded-full blur-[100px] animate-pulse"></div>
                <div className="flex flex-col items-center relative z-10">
                    <div className="size-24 bg-surface-dark border border-border-dark rounded-[2.5rem] flex items-center justify-center mb-10 shadow-2xl animate-spin-slow">
                         <div className="size-12 bg-indigo-600/20 rounded-2xl flex items-center justify-center">
                            <Building2 size={28} className="text-indigo-600 animate-pulse" />
                         </div>
                    </div>
                </div>
            </div>
        }>
            <InstituteProfileEditorContent />
        </Suspense>
    );
}
