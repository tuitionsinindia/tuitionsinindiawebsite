"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import MapComponent from "@/app/components/MapComponent";

export default function DirectoryLayout({ tutors, subject, location, filters, title }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const [viewMode, setViewMode] = useState("list"); // 'list' or 'map'

    const updateFilter = (key, value) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        router.push(`${pathname}?${params.toString()}`);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        const sub = e.target.subject.value;
        const loc = e.target.location.value;
        const params = new URLSearchParams(searchParams.toString());
        if (sub) params.set("subject", sub);
        else params.delete("subject");
        if (loc) params.set("location", loc);
        else params.delete("location");
        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans flex flex-col pt-32 pb-20 px-4 md:px-8">
            <div className="max-w-7xl mx-auto w-full relative z-10 flex flex-col flex-1">
                {/* Search Header - Clean White */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold mb-8 text-slate-900 tracking-tight">
                        {title || (
                            <>Find <span className="text-primary">{subject || "Expert Tutors"}</span> {location ? `in ${location}` : ""}</>
                        )}
                    </h1>

                    <form onSubmit={handleSearch} className="max-w-4xl mx-auto bg-white p-2 rounded-[1.5rem] shadow-2xl shadow-primary/5 border border-slate-100 flex flex-col md:flex-row items-stretch gap-2 transition-all hover:shadow-primary/10">
                        <div className="relative flex-1">
                            <span className="absolute left-6 top-1/2 -translate-y-1/2 material-symbols-outlined text-primary/40">school</span>
                            <input
                                type="text"
                                name="subject"
                                placeholder="Subject (e.g., Mathematics)"
                                className="w-full h-14 bg-transparent border-none rounded-2xl pl-14 pr-6 focus:ring-0 outline-none font-semibold text-slate-700 placeholder:text-slate-300"
                                defaultValue={subject}
                            />
                        </div>
                        <div className="hidden md:block w-px bg-slate-100 my-3"></div>
                        <div className="relative flex-1">
                            <span className="absolute left-6 top-1/2 -translate-y-1/2 material-symbols-outlined text-primary/40">location_on</span>
                            <input
                                type="text"
                                name="location"
                                placeholder="Location or Online"
                                className="w-full h-14 bg-transparent border-none rounded-2xl pl-14 pr-6 focus:ring-0 outline-none font-semibold text-slate-700 placeholder:text-slate-300"
                                defaultValue={location}
                            />
                        </div>
                        <button type="submit" className="bg-primary text-white font-bold h-14 px-10 rounded-xl hover:opacity-90 shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 flex-shrink-0">
                            <span className="material-symbols-outlined text-[20px]">search</span> Search
                        </button>
                    </form>
                </div>

                <div className="flex flex-col lg:flex-row gap-10 items-start">
                    {/* Sidebar Filters - Minimalist */}
                    <aside className="w-full lg:w-[320px] flex-shrink-0 lg:sticky lg:top-24 space-y-8">
                        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                            <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-50">
                                <span className="material-symbols-outlined text-primary">filter_list</span>
                                <h3 className="text-lg font-bold text-slate-900">Filters</h3>
                            </div>

                            <div className="space-y-10">
                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Verification</h4>
                                    <label className="flex items-center justify-between cursor-pointer group">
                                        <span className="font-bold text-slate-600 group-hover:text-primary transition-colors">Verified Only</span>
                                        <div className={`relative inline-flex items-center h-6 w-11 rounded-full transition-colors ${filters?.verified === 'true' ? 'bg-primary' : 'bg-slate-100'}`}>
                                            <input
                                                type="checkbox"
                                                className="sr-only peer"
                                                checked={filters?.verified === 'true'}
                                                onChange={(e) => updateFilter('verified', e.target.checked ? 'true' : null)}
                                            />
                                            <div className={`size-5 bg-white rounded-full shadow-sm transform transition-transform ${filters?.verified === 'true' ? 'translate-x-5.5' : 'translate-x-0.5'}`}></div>
                                        </div>
                                    </label>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Academic Level</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {['Primary', 'Middle', 'High School', 'Higher Sec', 'College'].map((level) => (
                                            <button
                                                key={level}
                                                onClick={() => updateFilter('levels', filters?.levels === level ? null : level)}
                                                className={`px-4 py-2 rounded-xl border text-xs font-bold transition-all ${filters?.levels === level ? 'bg-primary text-white border-primary' : 'border-slate-100 text-slate-500 hover:border-primary hover:text-primary'}`}
                                            >
                                                {level}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Hourly Rate</h4>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="number"
                                            placeholder="Min"
                                            className="w-full h-10 bg-slate-50 border-none rounded-xl px-3 text-xs font-bold text-slate-700 outline-none focus:ring-1 focus:ring-primary/20"
                                            value={filters?.minPrice || ""}
                                            onChange={(e) => updateFilter('minPrice', e.target.value)}
                                        />
                                        <span className="text-slate-300 font-bold">-</span>
                                        <input
                                            type="number"
                                            placeholder="Max"
                                            className="w-full h-10 bg-slate-50 border-none rounded-xl px-3 text-xs font-bold text-slate-700 outline-none focus:ring-1 focus:ring-primary/20"
                                            value={filters?.maxPrice || ""}
                                            onChange={(e) => updateFilter('maxPrice', e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Minimum Rating</h4>
                                    <div className="flex gap-2">
                                        {[4, 4.5, 4.8].map(r => (
                                            <button
                                                key={r}
                                                onClick={() => updateFilter('rating', filters?.rating == r ? null : r)}
                                                className={`flex-1 py-2 rounded-xl border text-[10px] font-bold transition-all ${filters?.rating == r ? 'bg-amber-500 text-white border-amber-500' : 'border-slate-100 text-slate-500 hover:border-amber-500 hover:text-amber-500'}`}
                                            >
                                                {r}+ ★
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Ads / Promo Card */}
                        <div className="bg-primary rounded-[2rem] p-8 text-white relative overflow-hidden group">
                            <div className="relative z-10">
                                <h4 className="font-bold text-xl mb-3">Premium Tutoring</h4>
                                <p className="text-white/70 text-sm mb-6 font-medium">Get matched with top-tier educators in under 30 seconds with AI.</p>
                                <Link href="/ai-match" className="inline-flex items-center gap-2 font-bold text-accent group-hover:gap-3 transition-all">
                                    Try AI Matchmaker <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                </Link>
                            </div>
                            <div className="absolute top-0 right-0 size-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-xl"></div>
                        </div>
                    </aside>

                    {/* Tutor Listings - Clean & High Contrast */}
                    <main className="flex-1 w-full space-y-8">
                        <div className="flex items-center justify-between mb-4 px-2">
                            <p className="font-bold text-slate-400 text-sm uppercase tracking-widest">Showing {tutors.length} verified results</p>

                            <div className="flex bg-white p-1 rounded-2xl border border-slate-100 shadow-sm">
                                <button
                                    onClick={() => setViewMode("list")}
                                    className={`px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-bold transition-all ${viewMode === 'list' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    <span className="material-symbols-outlined text-sm">list</span> List
                                </button>
                                <button
                                    onClick={() => setViewMode("map")}
                                    className={`px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-bold transition-all ${viewMode === 'map' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    <span className="material-symbols-outlined text-sm">map</span> Map
                                </button>
                            </div>
                        </div>

                        {viewMode === "map" ? (
                            <MapComponent tutors={tutors} />
                        ) : (
                            <>
                                {tutors.length > 0 ? tutors.map((tutor) => (
                                    <div key={tutor.id} className="group bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm hover:shadow-2xl hover:border-primary/5 transition-all duration-500 flex flex-col md:flex-row gap-10">

                                        {/* Avatar & Stats */}
                                        <div className="flex flex-col items-center gap-6 flex-shrink-0 w-full md:w-52">
                                            <div className="relative">
                                                <div className="size-32 rounded-[2rem] bg-slate-50 flex items-center justify-center text-4xl font-bold text-primary overflow-hidden border-4 border-white shadow-xl shadow-primary/5">
                                                    {tutor.name.charAt(0)}
                                                </div>
                                                {tutor.isVerified && (
                                                    <div className="absolute -bottom-2 -right-2 size-10 bg-emerald-500 rounded-2xl border-4 border-white flex items-center justify-center text-white shadow-lg">
                                                        <span className="material-symbols-outlined text-xl font-bold">verified</span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="w-full space-y-2">
                                                <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 text-center">
                                                    <div className="text-2xl font-bold text-slate-900">{tutor.hourlyRate}</div>
                                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Per Hour fee</div>
                                                </div>
                                                <div className="flex items-center justify-center gap-1.5 p-2 bg-amber-50 rounded-xl">
                                                    <span className="material-symbols-outlined text-amber-500 text-sm">star</span>
                                                    <span className="font-bold text-amber-700 text-xs">{tutor.rating}</span>
                                                    <span className="text-[10px] text-amber-600 font-bold opacity-70">({tutor.reviews})</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Info & Actions */}
                                        <div className="flex-1 flex flex-col">
                                            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
                                                <div>
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <h2 className="text-2xl font-bold text-slate-900 group-hover:text-primary transition-colors">{tutor.name}</h2>
                                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                                                            <span className="material-symbols-outlined text-sm">location_on</span> {tutor.location}
                                                        </span>
                                                    </div>
                                                    <div className="flex flex-wrap gap-2">
                                                        {tutor.subjects.map(sub => (
                                                            <span key={sub} className="px-3 py-1 bg-primary/5 text-primary text-[10px] font-bold uppercase tracking-widest rounded-lg border border-primary/10">
                                                                {sub}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            <p className="text-slate-500 font-medium leading-relaxed mb-8 flex-1">
                                                {tutor.bio}
                                            </p>

                                            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-50">
                                                <Link href={`/tutor/${tutor.id}`} className="flex-1 bg-slate-50 text-slate-900 font-bold py-4 rounded-2xl border border-slate-100 hover:bg-slate-100 transition-all text-center">
                                                    View Profile
                                                </Link>
                                                <Link href={`/messages?tutorId=${tutor.id}`} className="flex-1 bg-primary text-white font-bold py-4 rounded-2xl hover:opacity-90 shadow-lg shadow-primary/10 transition-all text-center">
                                                    Contact Now
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="bg-white rounded-[3rem] p-24 text-center border-2 border-dashed border-slate-100">
                                        <div className="size-24 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 mx-auto mb-8">
                                            <span className="material-symbols-outlined text-6xl">search_off</span>
                                        </div>
                                        <h3 className="text-3xl font-bold text-slate-900 mb-4">No tutors found</h3>
                                        <p className="text-slate-400 font-medium max-w-sm mx-auto mb-10 text-lg">We couldn't find a match for this specific combination. Try adjusting your filters.</p>
                                        <button
                                            onClick={() => router.push(pathname)}
                                            className="btn-primary"
                                        >
                                            Clear All Filters
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </main>
                </div>
            </div>

            {/* Structured Data (JSON-LD) */}
            <script type="application/ld+json" dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "ItemList",
                    "itemListElement": tutors.map((t, i) => ({
                        "@type": "ListItem",
                        "position": i + 1,
                        "item": {
                            "@type": "LocalBusiness",
                            "name": t.name,
                            "description": t.bio,
                            "address": {
                                "@type": "PostalAddress",
                                "addressLocality": t.location
                            }
                        }
                    }))
                })
            }} />
        </div>
    );
}


