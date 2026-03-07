import Link from "next/link";

export default function DirectoryLayout({ tutors, subject, location, title }) {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-background-dark font-sans relative overflow-hidden flex flex-col pt-24 pb-20 px-4 md:px-8">
            {/* Background Effects */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[100px] pointer-events-none translate-y-1/3 -translate-x-1/3"></div>

            <div className="max-w-7xl mx-auto w-full relative z-10 flex flex-col flex-1">
                {/* Search Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-8 text-slate-900 dark:text-white tracking-tight">
                        {title || (
                            <>Find <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">{subject || "Expert Tutors"}</span> {location ? `in ${location}` : ""}</>
                        )}
                    </h1>

                    <div className="max-w-4xl mx-auto bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-3 md:p-4 rounded-[2rem] shadow-2xl shadow-primary/10 border border-white/50 dark:border-slate-800 flex flex-col md:flex-row items-stretch gap-3">
                        <div className="relative flex-1">
                            <span className="absolute left-6 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400">menu_book</span>
                            <input
                                type="text"
                                placeholder="Subject (e.g., Mathematics)"
                                className="w-full h-14 bg-slate-50/50 dark:bg-slate-800/50 border-none rounded-2xl pl-14 pr-6 focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-slate-400 font-medium"
                                defaultValue={subject}
                            />
                        </div>
                        <div className="hidden md:block w-px bg-slate-200 dark:bg-slate-700 my-2"></div>
                        <div className="relative flex-1">
                            <span className="absolute left-6 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400">location_on</span>
                            <input
                                type="text"
                                placeholder="Location or Online"
                                className="w-full h-14 bg-slate-50/50 dark:bg-slate-800/50 border-none rounded-2xl pl-14 pr-6 focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-slate-400 font-medium"
                                defaultValue={location}
                            />
                        </div>
                        <button className="bg-primary text-white font-bold h-14 px-10 rounded-2xl hover:bg-primary-glow shadow-lg shadow-primary/30 transition-all flex items-center justify-center gap-2 flex-shrink-0">
                            <span className="material-symbols-outlined text-[20px]">search</span> Search
                        </button>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 items-start">
                    {/* Sidebar Filters */}
                    <aside className="w-full lg:w-[300px] flex-shrink-0 sticky top-32 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-6 rounded-3xl border border-white/50 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
                            <span className="material-symbols-outlined text-primary">filter_list</span>
                            <h3 className="text-xl font-heading font-bold">Filters</h3>
                        </div>

                        <div className="mb-8">
                            <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Verification</h4>
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <div className="relative flex items-center justify-center size-6 rounded bg-primary/10 border border-primary/20 group-hover:border-primary transition-colors">
                                    <input type="checkbox" defaultChecked className="opacity-0 absolute inset-0 cursor-pointer peer" />
                                    <span className="material-symbols-outlined text-[16px] text-primary opacity-0 peer-checked:opacity-100 transition-opacity">check</span>
                                </div>
                                <span className="font-semibold text-slate-700 dark:text-slate-300">Verified Tutors Only</span>
                            </label>
                        </div>

                        <div>
                            <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Academic Level</h4>
                            <div className="space-y-3">
                                {['Primary (1-5)', 'Middle (6-8)', 'High School (9-10)', 'Higher Sec (11-12)'].map((level) => (
                                    <label key={level} className="flex items-center gap-3 cursor-pointer group">
                                        <div className="relative flex items-center justify-center size-6 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 group-hover:border-primary transition-colors">
                                            <input type="checkbox" className="opacity-0 absolute inset-0 cursor-pointer peer" />
                                            <span className="material-symbols-outlined text-[16px] text-primary opacity-0 peer-checked:opacity-100 transition-opacity">check</span>
                                        </div>
                                        <span className="font-semibold text-slate-700 dark:text-slate-300">{level}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </aside>

                    {/* Tutor Listings */}
                    <main className="flex-1 w-full space-y-6">
                        <div className="flex items-center justify-between mb-4 px-2">
                            <p className="font-bold text-slate-500">Showing {tutors.length} verified tutors</p>
                            <div className="flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300 cursor-pointer hover:text-primary transition-colors">
                                Sort by Relevancy <span className="material-symbols-outlined text-[18px]">keyboard_arrow_down</span>
                            </div>
                        </div>

                        {tutors.length > 0 ? tutors.map((tutor) => (
                            <div key={tutor.id} className="group bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none hover:border-primary/50 transition-all duration-300 animate-fade-in-up flex flex-col md:flex-row gap-6 md:items-start relative overflow-hidden">

                                {/* Subtle hover gradient */}
                                <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:to-transparent transition-all duration-500 pointer-events-none"></div>

                                {/* Avatar & Price Column */}
                                <div className="flex flex-col items-center gap-4 flex-shrink-0 relative z-10 w-full md:w-48">
                                    <div className="relative">
                                        <div className="size-24 rounded-full bg-gradient-to-tr from-primary to-accent p-1 shadow-lg shadow-primary/30">
                                            <div className="w-full h-full rounded-full bg-white dark:bg-slate-900 flex items-center justify-center text-3xl font-heading font-bold text-slate-900 dark:text-white border-4 border-white dark:border-slate-900">
                                                {tutor.name.charAt(0)}
                                            </div>
                                        </div>
                                        {tutor.isVerified && (
                                            <div className="absolute -bottom-2 -right-2 size-8 bg-emerald-500 rounded-full border-4 border-white dark:border-slate-900 flex items-center justify-center text-white shadow-sm" title="Verified Expert">
                                                <span className="material-symbols-outlined text-[16px]">verified</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="text-center w-full bg-slate-50 dark:bg-slate-800/50 py-3 rounded-2xl border border-slate-100 dark:border-slate-800">
                                        <div className="text-xl font-heading font-bold text-slate-900 dark:text-white">{tutor.hourlyRate}</div>
                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">per hour</div>
                                    </div>
                                </div>

                                {/* Info Column */}
                                <div className="flex-1 relative z-10 flex flex-col h-full">
                                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-3">
                                        <div>
                                            <div className="flex items-center gap-3 mb-2">
                                                <h2 className="text-2xl font-heading font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">{tutor.name}</h2>
                                                {tutor.isVerified && (
                                                    <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-full border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                                                        <span className="material-symbols-outlined text-[12px]">shield</span> Trusted
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-semibold">
                                                <div className="flex items-center gap-1 text-amber-500 bg-amber-50/50 dark:bg-amber-900/10 px-2.5 py-1 rounded-lg border border-amber-100 dark:border-amber-900/30">
                                                    <span className="material-symbols-outlined text-[16px] text-amber-400">star</span> {tutor.rating} <span className="text-slate-500 dark:text-slate-400">({tutor.reviews} reviews)</span>
                                                </div>
                                                <div className="flex items-center gap-1 text-slate-600 dark:text-slate-300 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800">
                                                    <span className="material-symbols-outlined text-[16px] text-slate-400">location_on</span> {tutor.location}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-2 mb-5">
                                        {tutor.subjects.map(sub => (
                                            <span key={sub} className="px-4 py-1.5 text-xs font-bold text-primary bg-primary/10 border border-primary/20 rounded-full">
                                                {sub}
                                            </span>
                                        ))}
                                    </div>

                                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6 line-clamp-3 bg-slate-50 dark:bg-slate-800/30 p-4 rounded-xl border border-slate-100 dark:border-slate-800/50">
                                        {tutor.bio}
                                    </p>

                                    <div className="mt-auto flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                                        <button className="flex-1 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold py-3.5 rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2">
                                            <span className="material-symbols-outlined text-[20px]">person</span> View Full Profile
                                        </button>
                                        <button className="flex-1 bg-primary text-white font-bold py-3.5 rounded-xl hover:bg-primary-glow shadow-lg shadow-primary/30 transition-all flex items-center justify-center gap-2">
                                            <span className="material-symbols-outlined text-[20px]">forum</span> Contact Tutor
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-md rounded-3xl p-16 text-center border-2 border-dashed border-slate-300 dark:border-slate-700">
                                <div className="size-24 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mx-auto mb-6">
                                    <span className="material-symbols-outlined text-5xl">search_off</span>
                                </div>
                                <h3 className="text-2xl font-heading font-bold mb-2">No tutors found</h3>
                                <p className="text-slate-500 max-w-md mx-auto">We couldn't find any tutors matching your exact criteria. Try broadening your location or subject search.</p>
                                <button className="mt-8 px-8 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold rounded-xl hover:text-primary transition-colors shadow-sm">
                                    Clear All Filters
                                </button>
                            </div>
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

