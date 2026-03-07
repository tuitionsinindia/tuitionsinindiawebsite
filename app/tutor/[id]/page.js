import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function TutorProfile({ params }) {
    const id = params.id;

    // Fetch tutor and listing data
    const tutor = await prisma.user.findUnique({
        where: { id },
        include: {
            listing: true
        }
    });

    if (!tutor || tutor.role !== "TUTOR" || !tutor.listing) {
        notFound();
    }

    const listing = tutor.listing;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans relative overflow-hidden flex flex-col pt-24 pb-20 px-4 md:px-8">
            {/* Background Effects */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[100px] pointer-events-none translate-y-1/3 -translate-x-1/3"></div>

            <div className="max-w-5xl mx-auto w-full relative z-10 flex flex-col gap-8">
                {/* Back link */}
                <div>
                    <Link href="/tutors" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-primary transition-colors bg-white/50 dark:bg-slate-900/50 backdrop-blur-md px-4 py-2 rounded-full border border-slate-200 dark:border-slate-800 shadow-sm">
                        <span className="material-symbols-outlined text-[18px]">arrow_back</span> Back to Directory
                    </Link>
                </div>

                {/* Profile Header Card */}
                <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-12 border border-white/50 dark:border-slate-800 shadow-2xl shadow-primary/5 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-accent/5 pointer-events-none"></div>

                    <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center md:items-start relative z-10">
                        {/* Avatar */}
                        <div className="relative flex-shrink-0">
                            <div className="size-32 md:size-40 rounded-[2rem] bg-gradient-to-tr from-primary to-accent p-1 shadow-2xl shadow-primary/30 rotate-3 group-hover:rotate-0 transition-transform duration-500">
                                <div className="w-full h-full rounded-[1.8rem] bg-white dark:bg-slate-900 flex items-center justify-center text-5xl md:text-6xl font-heading font-bold text-slate-900 dark:text-white border-4 border-white dark:border-slate-900">
                                    {tutor.name.charAt(0)}
                                </div>
                            </div>
                            {tutor.isVerified && (
                                <div className="absolute -bottom-4 -right-4 size-12 bg-emerald-500 rounded-full border-4 border-white dark:border-slate-900 flex items-center justify-center text-white shadow-xl" title="Verified Expert">
                                    <span className="material-symbols-outlined text-[24px]">verified</span>
                                </div>
                            )}
                        </div>

                        {/* Title & Key Info */}
                        <div className="flex-1 text-center md:text-left">
                            <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-4 mb-4">
                                <div>
                                    <h1 className="text-4xl md:text-5xl font-heading font-bold text-slate-900 dark:text-white mb-2">{tutor.name}</h1>
                                    <p className="text-lg text-slate-500 font-semibold">{tutor.isVerified ? "Verified Premium Tutor" : "Independent Tutor"}</p>
                                </div>
                                <div className="text-center sm:text-right bg-slate-50 dark:bg-slate-800/50 px-6 py-4 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-inner">
                                    <div className="text-3xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">₹{listing.hourlyRate}</div>
                                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">per hour</div>
                                </div>
                            </div>

                            <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-6">
                                <div className="flex items-center gap-2 text-amber-500 bg-amber-50 dark:bg-amber-900/20 px-4 py-2 rounded-xl border border-amber-100 dark:border-amber-900/50 font-bold">
                                    <span className="material-symbols-outlined text-[20px]">star</span>
                                    {listing.rating > 0 ? listing.rating : "New"}
                                    <span className="text-slate-500 dark:text-slate-400 font-semibold">({listing.reviewCount} reviews)</span>
                                </div>
                                {listing.locations && listing.locations.length > 0 && (
                                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 font-bold">
                                        <span className="material-symbols-outlined text-[20px] text-slate-400">location_on</span>
                                        {listing.locations.join(", ")}
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 w-full">
                                <Link href="/post-requirement" className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-primary text-white font-bold py-4 px-8 rounded-xl hover:bg-primary-glow shadow-xl shadow-primary/30 transition-all">
                                    <span className="material-symbols-outlined">how_to_reg</span> Book a Demo Class
                                </Link>
                                <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold py-4 px-8 rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-primary hover:text-primary transition-all shadow-sm">
                                    <span className="material-symbols-outlined">chat</span> Message
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* About Section */}
                        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none relative z-10">
                            <h3 className="text-2xl font-heading font-bold mb-6 flex items-center gap-3">
                                <span className="material-symbols-outlined text-primary bg-primary/10 p-2 rounded-xl">person</span>
                                About Me
                            </h3>
                            <div className="prose dark:prose-invert max-w-none">
                                <p className="text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line text-lg">
                                    {listing.bio || "This tutor hasn't written a biography yet. Consider booking a trial class to get to know them better!"}
                                </p>
                            </div>
                        </div>

                        {/* Experience & Education */}
                        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none relative z-10">
                            <h3 className="text-2xl font-heading font-bold mb-6 flex items-center gap-3">
                                <span className="material-symbols-outlined text-accent bg-accent/10 p-2 rounded-xl">history_edu</span>
                                Experience & Education
                            </h3>
                            <div className="grid sm:grid-cols-2 gap-6">
                                <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800">
                                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Total Experience</p>
                                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{listing.experienceYears || 0}+ Years</p>
                                </div>
                                <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800">
                                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Highest Qualification</p>
                                    <p className="text-xl font-bold text-slate-900 dark:text-white capitalize">{listing.qualifications || "Not specified"}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <aside className="space-y-8">
                        {/* Subjects Expertise */}
                        <div className="bg-gradient-to-b from-white/90 to-white/50 dark:from-slate-900/90 dark:to-slate-900/50 backdrop-blur-md rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none relative z-10">
                            <h3 className="text-xl font-heading font-bold mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">Subjects Expertise</h3>
                            <div className="flex flex-wrap gap-2">
                                {listing.subjects && listing.subjects.length > 0 ? (
                                    listing.subjects.map(sub => (
                                        <span key={sub} className="px-4 py-2 font-bold text-primary bg-primary/10 border border-primary/20 rounded-xl hover:bg-primary hover:text-white cursor-pointer transition-colors shadow-sm">
                                            {sub}
                                        </span>
                                    ))
                                ) : (
                                    <p className="text-slate-500">No specific subjects listed.</p>
                                )}
                            </div>
                        </div>

                        {/* Trust & Safety */}
                        <div className="bg-emerald-50 dark:bg-emerald-900/10 rounded-3xl p-8 border border-emerald-100 dark:border-emerald-800/30 relative z-10 overflow-hidden">
                            <div className="absolute -right-10 -bottom-10 size-40 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>
                            <h3 className="text-xl font-heading font-bold mb-6 text-emerald-900 dark:text-emerald-400 flex items-center gap-2">
                                <span className="material-symbols-outlined">shield_person</span> Trust & Safety
                            </h3>
                            <ul className="space-y-4 text-emerald-800 dark:text-emerald-300 font-semibold">
                                <li className="flex items-start gap-3">
                                    <span className="material-symbols-outlined text-emerald-500 mt-0.5">check_circle</span>
                                    {tutor.isVerified ? "Identity & Documents Verified by TuitionsInIndia team." : "Identity verification pending."}
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="material-symbols-outlined text-emerald-500 mt-0.5">check_circle</span>
                                    Secure payments and trial classes available.
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="material-symbols-outlined text-emerald-500 mt-0.5">check_circle</span>
                                    Support from the TuitionsInIndia team resolving disputes.
                                </li>
                            </ul>
                        </div>
                    </aside>
                </div>
            </div>

            {/* Structured Data (JSON-LD) for SEO */}
            <script type="application/ld+json" dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "Person",
                    "name": tutor.name,
                    "description": listing.bio,
                    "jobTitle": "Tutor",
                    "url": `https://tuitionsinindia.com/tutor/${tutor.id}`,
                    "image": "https://tuitionsinindia.com/default-avatar.png",
                    "aggregateRating": listing.rating > 0 ? {
                        "@type": "AggregateRating",
                        "ratingValue": listing.rating,
                        "reviewCount": listing.reviewCount
                    } : undefined,
                })
            }} />
        </div>
    );
}
