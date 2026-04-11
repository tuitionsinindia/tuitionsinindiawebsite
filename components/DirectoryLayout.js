"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import MapComponent from "@/app/components/MapComponent";
import MatchBadge from "@/app/components/MatchBadge";
import { 
    Search, 
    MapPin, 
    School, 
    Filter, 
    Verified, 
    Star, 
    ArrowRight, 
    Lock, 
    Mail, 
    Phone, 
    Activity,
    LayoutGrid,
    Map
} from "lucide-react";

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
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900 antialiased selection:bg-blue-600/10 pt-32 pb-40 px-6 lg:px-12">
            <div className="max-w-7xl mx-auto w-full relative z-10 flex flex-col flex-1">
                
                {/* Search Strategy Header */}
                <div className="text-center mb-24">
                    <h1 className="text-6xl md:text-8xl font-black text-gray-900 tracking-tighter uppercase italic leading-[0.85] mb-12">
                        {title || (
                            <>Discover <br/><span className="text-blue-600 underline decoration-blue-600/10 underline-offset-8">Faculty.</span></>
                        )}
                    </h1>

                    <form onSubmit={handleSearch} className="max-w-5xl mx-auto bg-white p-3 rounded-[2.5rem] shadow-4xl shadow-blue-900/10 border border-gray-100 flex flex-col md:flex-row items-stretch gap-3 transition-all">
                        <div className="relative flex-1 group">
                            <School className="absolute left-8 top-1/2 -translate-y-1/2 text-gray-200 group-focus-within:text-blue-600 transition-colors" size={20} strokeWidth={3} />
                            <input
                                type="text"
                                name="subject"
                                placeholder="Educational Domain..."
                                className="w-full h-16 bg-transparent border-none rounded-3xl pl-16 pr-8 focus:ring-0 outline-none font-black text-[11px] uppercase tracking-widest text-gray-900 placeholder:text-gray-200 italic"
                                defaultValue={subject}
                            />
                        </div>
                        <div className="hidden md:block w-px bg-gray-100 my-4 shadow-inner"></div>
                        <div className="relative flex-1 group">
                            <MapPin className="absolute left-8 top-1/2 -translate-y-1/2 text-gray-200 group-focus-within:text-blue-600 transition-colors" size={20} strokeWidth={3} />
                            <input
                                type="text"
                                name="location"
                                placeholder="Geographic Node..."
                                className="w-full h-16 bg-transparent border-none rounded-3xl pl-16 pr-8 focus:ring-0 outline-none font-black text-[11px] uppercase tracking-widest text-gray-900 placeholder:text-gray-200 italic"
                                defaultValue={location}
                            />
                        </div>
                        <button type="submit" className="bg-blue-600 text-white font-black text-[10px] uppercase tracking-[0.4em] h-16 px-12 rounded-[1.8rem] hover:bg-gray-900 shadow-2xl shadow-blue-600/30 transition-all flex items-center justify-center gap-4 italic active:scale-95">
                            <Search size={18} strokeWidth={3} /> Synchronize
                        </button>
                    </form>
                </div>

                <div className="flex flex-col lg:flex-row gap-16 items-start">
                    {/* Operational Filters */}
                    <aside className="w-full lg:w-[340px] flex-shrink-0 lg:sticky lg:top-32 space-y-10 group">
                        <div className="bg-white p-10 rounded-[3.5rem] border border-gray-100 shadow-4xl shadow-blue-900/[0.02]">
                            <div className="flex items-center gap-4 mb-10 pb-6 border-b border-gray-50">
                                <Filter size={20} className="text-blue-600" strokeWidth={3} />
                                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-300 italic leading-none">Global Filters</h3>
                            </div>

                            <div className="space-y-12">
                                {/* Verification Logic */}
                                <div className="space-y-5">
                                    <h4 className="text-[10px] font-black text-gray-200 uppercase tracking-widest leading-none">Institutional Status</h4>
                                    <button 
                                        onClick={() => updateFilter('verified', filters?.verified === 'true' ? null : 'true')}
                                        className={`w-full flex items-center justify-between p-5 rounded-2xl border-2 transition-all italic font-black text-[10px] uppercase tracking-widest ${
                                            filters?.verified === 'true' 
                                            ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-600/20' 
                                            : 'bg-white border-transparent text-gray-400 hover:text-blue-600'
                                        }`}
                                    >
                                        Verified Faculty
                                        <Verified size={16} />
                                    </button>
                                </div>

                                {/* Academic Level Thresholds */}
                                <div className="space-y-5">
                                    <h4 className="text-[10px] font-black text-gray-200 uppercase tracking-widest leading-none">Pedagogical Level</h4>
                                    <div className="flex flex-wrap gap-2.5">
                                        {['Primary', 'Middle', 'High', 'Higher', 'College'].map((level) => (
                                            <button
                                                key={level}
                                                onClick={() => updateFilter('levels', filters?.levels === level ? null : level)}
                                                className={`px-5 py-2.5 rounded-xl border-2 text-[10px] font-black tracking-widest uppercase transition-all italic ${
                                                    filters?.levels === level 
                                                    ? 'bg-blue-600 border-blue-600 text-white shadow-lg' 
                                                    : 'border-transparent bg-gray-50 text-gray-300 hover:text-blue-600'
                                                }`}
                                            >
                                                {level}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Financial Spectrum */}
                                <div className="space-y-5">
                                    <h4 className="text-[10px] font-black text-gray-200 uppercase tracking-widest leading-none">Asset Range (₹)</h4>
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="number"
                                            placeholder="MIN"
                                            className="w-full h-12 bg-gray-50 border-none rounded-xl px-4 text-[10px] font-black text-gray-900 outline-none focus:ring-1 focus:ring-blue-600/20 italic shadow-inner hover:bg-white transition-colors"
                                            value={filters?.minPrice || ""}
                                            onChange={(e) => updateFilter('minPrice', e.target.value)}
                                        />
                                        <span className="text-gray-100 font-black tracking-tighter">—</span>
                                        <input
                                            type="number"
                                            placeholder="MAX"
                                            className="w-full h-12 bg-gray-50 border-none rounded-xl px-4 text-[10px] font-black text-gray-900 outline-none focus:ring-1 focus:ring-blue-600/20 italic shadow-inner hover:bg-white transition-colors"
                                            value={filters?.maxPrice || ""}
                                            onChange={(e) => updateFilter('maxPrice', e.target.value)}
                                        />
                                    </div>
                                </div>

                                {/* Reputation Threshold */}
                                <div className="space-y-5">
                                    <h4 className="text-[10px] font-black text-gray-200 uppercase tracking-widest leading-none">Quality Index</h4>
                                    <div className="flex gap-2">
                                        {[4, 4.5, 4.8].map(r => (
                                            <button
                                                key={r}
                                                onClick={() => updateFilter('rating', filters?.rating == r ? null : r)}
                                                className={`flex-1 py-3 rounded-xl border-2 text-[10px] font-black tracking-widest uppercase transition-all italic ${
                                                    filters?.rating == r 
                                                    ? 'bg-amber-500 border-amber-500 text-white shadow-lg' 
                                                    : 'border-transparent bg-gray-50 text-gray-300 hover:text-amber-500'
                                                }`}
                                            >
                                                {r}+ ★
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* AI Protocol Card */}
                        <div className="bg-gray-900 rounded-[3.5rem] p-10 text-white relative overflow-hidden group shadow-4xl shadow-blue-900/10 border-b-[12px] border-blue-600">
                            <div className="absolute top-0 right-0 size-40 bg-blue-600/10 rounded-full -mr-16 -mt-16 blur-[80px] group-hover:bg-blue-600/30 transition-all duration-1000"></div>
                            <div className="relative z-10">
                                <h4 className="font-black text-2xl uppercase italic tracking-tighter mb-4">Neural <br/> <span className="text-blue-400 lowercase font-serif font-light not-italic">Matchmaker.</span></h4>
                                <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-10 italic leading-relaxed">Let our algorithm synchronize your academic needs with the world's elite faculty.</p>
                                <Link href="/ai-match" className="inline-flex items-center gap-4 py-4 px-8 bg-blue-600 rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] hover:bg-white hover:text-gray-900 transition-all italic shadow-2xl shadow-blue-600/20 active:scale-95">
                                    Initiate Match <ArrowRight size={14} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        </div>
                    </aside>

                    {/* Faculty Directory Stream */}
                    <main className="flex-1 w-full space-y-12">
                        <div className="flex items-center justify-between mb-8 px-4">
                            <div className="flex items-center gap-4">
                               <Activity size={18} className="text-blue-600 animate-pulse" />
                               <p className="font-black text-gray-300 text-[10px] uppercase tracking-[0.4em] italic leading-none">Registry Density: {tutors.length} Verified Nodes</p>
                            </div>

                            <div className="flex bg-white p-2 rounded-2xl border border-gray-100 shadow-sm border-b-4 border-gray-100">
                                <button
                                    onClick={() => setViewMode("list")}
                                    className={`px-5 py-2.5 rounded-xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all italic ${viewMode === 'list' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-gray-300 hover:text-gray-500'}`}
                                >
                                    <LayoutGrid size={14} strokeWidth={3} /> List
                                </button>
                                <button
                                    onClick={() => setViewMode("map")}
                                    className={`px-5 py-2.5 rounded-xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all italic ${viewMode === 'map' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-gray-300 hover:text-gray-500'}`}
                                >
                                    <Map size={14} strokeWidth={3} /> Map
                                </button>
                            </div>
                        </div>

                        {viewMode === "map" ? (
                            <div className="rounded-[4rem] overflow-hidden border border-gray-100 shadow-4xl shadow-blue-900/[0.03]">
                                <MapComponent tutors={tutors} />
                            </div>
                        ) : (
                            <div className="space-y-10">
                                {tutors.length > 0 ? tutors.map((tutor) => (
                                    <div key={tutor.id} className="group bg-white rounded-[3.5rem] p-10 lg:p-14 border border-gray-100 shadow-4xl shadow-blue-900/[0.02] hover:shadow-blue-900/10 hover:border-blue-600/10 transition-all duration-700 flex flex-col md:flex-row gap-12 lg:gap-16 relative overflow-hidden">
                                        
                                        {/* Dynamic Match Index Decorator */}
                                        <div className="absolute top-0 right-10 -translate-y-full group-hover:translate-y-0 transition-transform duration-700 pointer-events-none">
                                            <div className="bg-blue-600 text-white rounded-b-3xl px-6 py-4 font-black italic text-[11px] uppercase tracking-widest shadow-2xl">High Affinity Match</div>
                                        </div>

                                        {/* Identity Matrix */}
                                        <div className="flex flex-col items-center gap-8 flex-shrink-0 w-full md:w-56">
                                            <div className="relative">
                                                <div className="size-40 rounded-[3rem] bg-gray-50 flex items-center justify-center text-5xl font-black text-blue-600/10 uppercase italic border-8 border-white shadow-4xl shadow-blue-900/5 group-hover:scale-105 transition-transform duration-1000">
                                                    {tutor.name.charAt(0)}
                                                </div>
                                                {tutor.isVerified && (
                                                    <div className="absolute -bottom-2 -right-2 size-14 bg-emerald-500 rounded-[1.5rem] border-8 border-white flex items-center justify-center text-white shadow-2xl shadow-emerald-500/30">
                                                        <Verified size={24} strokeWidth={3} />
                                                    </div>
                                                )}
                                            </div>

                                            <div className="w-full space-y-6">
                                                <div className="bg-gray-50/50 p-6 rounded-[2rem] border border-gray-100/50 text-center shadow-inner">
                                                    <div className="text-3xl font-black text-gray-900 italic tracking-tighter mb-1 uppercase leading-none">{tutor.hourlyRate}</div>
                                                    <div className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] italic underline decoration-blue-600/10">Resource Value</div>
                                                </div>
                                                
                                                {/* Unified Match Engine Output */}
                                                <div className="flex justify-center group-hover:rotate-1 transition-transform">
                                                    <MatchBadge 
                                                        score={tutor.matchScore} 
                                                        label={tutor.matchLabel} 
                                                        factors={tutor.matchFactors}
                                                        showDetails={false} 
                                                    />
                                                </div>

                                                <div className="flex items-center justify-center gap-2 py-3 px-5 bg-amber-50 rounded-2xl border border-amber-100/50 shadow-sm">
                                                    <Star size={12} fill="currentColor" strokeWidth={0} className="text-amber-500" />
                                                    <span className="font-black text-gray-900 text-xs italic">{tutor.rating}</span>
                                                    <span className="text-[10px] text-gray-300 font-black uppercase tracking-widest italic opacity-50">• {tutor.reviews} Logs</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Faculty Narrative & Protocols */}
                                        <div className="flex-1 flex flex-col pt-4">
                                            <div className="flex flex-col sm:flex-row justify-between items-start gap-6 mb-8">
                                                <div className="space-y-4">
                                                    <div className="flex flex-col gap-2">
                                                        <h2 className="text-4xl md:text-5xl font-black text-gray-900 group-hover:text-blue-600 transition-colors uppercase italic tracking-tighter leading-none">{tutor.name}</h2>
                                                        <div className="flex items-center gap-3">
                                                            <div className="size-1.5 rounded-full bg-blue-600"></div>
                                                            <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.4em] flex items-center gap-2 italic">
                                                                <MapPin size={12} className="text-gray-200" strokeWidth={3} /> {tutor.location}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-wrap gap-2.5">
                                                        {tutor.subjects.map(sub => (
                                                            <span key={sub} className="px-5 py-2 bg-gray-50 border border-gray-100 text-gray-900 text-[9px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-white hover:border-blue-600/10 transition-all italic">
                                                                {sub}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            <p className="text-gray-400 font-bold leading-relaxed mb-12 flex-1 italic text-lg uppercase tracking-tighter opacity-80 decoration-blue-600/10 underline decoration-2 underline-offset-4 line-clamp-3">
                                                {tutor.bio}
                                            </p>

                                            <div className="flex flex-col xl:flex-row gap-8 pt-10 border-t border-gray-50 relative group/footer">
                                                {/* Encrypted Node Previews (Locked State) */}
                                                <div className="flex-1 flex items-center gap-8">
                                                    <div className="flex items-center gap-3 text-[10px] font-black text-gray-200 uppercase tracking-[0.3em] italic group-hover/footer:text-gray-300 transition-colors">
                                                        <div className="size-10 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100 group-hover/footer:rotate-12 transition-transform">
                                                            <Mail size={16} strokeWidth={3} />
                                                        </div>
                                                        <span>Syncing•••@node.net</span>
                                                    </div>
                                                    <div className="flex items-center gap-3 text-[10px] font-black text-gray-200 uppercase tracking-[0.3em] italic group-hover/footer:text-gray-300 transition-colors">
                                                        <div className="size-10 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100 group-hover/footer:rotate-12 transition-transform">
                                                            <Phone size={16} strokeWidth={3} />
                                                        </div>
                                                        <span>+91 ••••• ••••8</span>
                                                    </div>
                                                </div>

                                                <div className="flex gap-4">
                                                    <Link 
                                                        href={`/tutor/${tutor.id}`} 
                                                        className="px-10 bg-white text-gray-900 font-black py-6 rounded-[2rem] border border-gray-100 hover:border-blue-600 group-hover/footer:shadow-4xl transition-all text-center text-[10px] uppercase tracking-[0.4em] italic leading-none"
                                                    >
                                                        Review Profile
                                                    </Link>
                                                    <Link 
                                                        href={`/get-started?intent=unlock&tutorId=${tutor.id}&subject=${subject || ""}&location=${location || ""}`} 
                                                        className="px-10 bg-blue-600 text-white font-black py-6 rounded-[2rem] hover:bg-gray-900 shadow-4xl shadow-blue-600/20 transition-all text-center flex items-center gap-4 text-[10px] uppercase tracking-[0.4em] italic leading-none active:scale-95"
                                                    >
                                                        <Lock size={16} strokeWidth={3} /> Unlock
                                                    </Link>
                                                </div>

                                                {/* Micro-Unlock Protocol Banner */}
                                                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-white px-6 py-1.5 rounded-full border border-gray-100 text-[9px] font-black text-gray-200 uppercase tracking-[0.3em] shadow-sm flex items-center gap-3 italic group-hover:text-blue-600 group-hover:border-blue-600/10 transition-colors">
                                                    <ShieldCheck size={12} className="text-blue-600" />
                                                    Identity Verification Required for Node Access
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="bg-white rounded-[4rem] p-32 text-center border-4 border-dashed border-gray-50 flex flex-col items-center gap-10">
                                        <div className="relative">
                                            <div className="size-32 rounded-full bg-gray-50 flex items-center justify-center text-gray-200 mx-auto border border-gray-100 shadow-inner">
                                                <Search size={64} strokeWidth={1} />
                                            </div>
                                            <div className="absolute inset-0 bg-blue-600/5 blur-3xl rounded-full scale-150"></div>
                                        </div>
                                        <div className="space-y-4">
                                            <h3 className="text-4xl font-black text-gray-900 uppercase italic tracking-tighter">No Nodes Discovered.</h3>
                                            <p className="text-gray-400 font-black text-[10px] max-w-sm mx-auto uppercase tracking-[0.5em] italic leading-relaxed">Global registry yielded zero matches for this particular combination of academic parameters.</p>
                                        </div>
                                        <button
                                            onClick={() => router.push(pathname)}
                                            className="px-12 py-6 bg-blue-600 text-white rounded-[2rem] font-black text-[10px] uppercase tracking-[0.4em] italic shadow-2xl shadow-blue-600/20 hover:bg-gray-900 transition-all active:scale-95"
                                        >
                                            Reset Strategy
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </main>
                </div>
            </div>

            {/* Structured Semantic Graph Intelligence */}
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
