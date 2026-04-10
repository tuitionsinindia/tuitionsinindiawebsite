import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import ChatInitiator from "@/app/components/chat/ChatInitiator";

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
    const id = params.id;
    const tutor = await prisma.user.findUnique({
        where: { id },
        include: { tutorListing: true }
    });

    if (!tutor) return { title: "Tutor Profile | TuitionsInIndia" };

    const name = tutor.name || "Expert Faculty";
    const subject = tutor.tutorListing?.subjects?.[0] || "Academics";
    const location = tutor.tutorListing?.locations?.[0] || "India";

    return {
        title: `Best ${subject} Tutor in ${location} | ${name} | TuitionsInIndia`,
        description: `Connect with ${name}, a premier ${subject} specialist in ${location}. View verified credentials, academic affinity scores, and pedagogical approach. Initiate secure scholarly synchronization today.`,
        openGraph: {
            title: `${name} - Professional ${subject} Educator`,
            description: `Verify the Match Score for ${name} in ${location}. Strategic academic outcomes and high-fidelity tutoring.`,
            images: [tutor.image || "/logo.png"]
        }
    };
}

export default async function TutorProfile({ params, searchParams }) {
    const id = params.id;
    const viewerId = searchParams.viewerId;

    // Fetch tutor and listing data
    const tutor = await prisma.user.findUnique({
        where: { id },
        include: {
            tutorListing: true,
            reviewsReceived: {
                include: {
                    author: {
                        select: { name: true, image: true }
                    }
                },
                orderBy: { createdAt: 'desc' }
            }
        }
    });

    if (!tutor || (tutor.role !== "TUTOR" && tutor.role !== "INSTITUTE")) {
        notFound();
    }

    const listing = tutor.tutorListing || { bio: "", subjects: [], experience: 0, hourlyRate: 0, rating: 0, reviewCount: 0 };

    // Fetch viewer data for paywall check
    let viewer = null;
    if (viewerId) {
        viewer = await prisma.user.findUnique({
            where: { id: viewerId },
            select: { role: true, subscriptionTier: true }
        });
    }

    const canContactProactively = viewer ? (viewer.role === 'ADMIN' || viewer.subscriptionTier !== 'FREE') : false;

    return (
        <div className="min-h-screen bg-surface font-body text-on-surface antialiased pt-28 pb-32">
            {/* Ambient Background Strategy */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-primary/5 rounded-full blur-[160px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/5 rounded-full blur-[140px]"></div>
            </div>

            <main className="max-w-7xl mx-auto px-6 relative z-10">
                {/* Strategic Backlink */}
                <div className="mb-12">
                    <Link href="/tutors" className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-variant/40 hover:text-primary transition-all group">
                        <span className="material-symbols-outlined text-lg group-hover:-translate-x-1 transition-transform">west</span> 
                        GLOBAL DIRECTORY
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    {/* Left Column: Intelligence Profile */}
                    <div className="lg:col-span-8">
                        <section className="relative">
                            <div className="relative h-[500px] md:h-[650px] w-full rounded-[4rem] overflow-hidden mb-12 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] border border-outline-variant/5 bg-surface-container-low group">
                                {tutor.image ? (
                                    <img 
                                        src={tutor.image} 
                                        alt={tutor.name} 
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" 
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-9xl font-headline font-black text-on-surface-variant/10 uppercase bg-gradient-to-br from-surface-container-low to-surface-container-high italic">
                                        {(tutor.name || "U")[0]}
                                    </div>
                                )}
                                
                                <div className="absolute top-10 right-10 flex items-center gap-3 bg-white/40 dark:bg-slate-900/40 backdrop-blur-2xl px-6 py-3 rounded-full border border-white/20 shadow-2xl">
                                    <span className="size-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                    <span className="text-[10px] font-black uppercase tracking-widest">ACTIVE PARTNER</span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-4 mb-4">
                                    <span className="px-4 py-1.5 bg-primary/5 text-primary rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-primary/10">
                                        {tutor.subscriptionTier === 'ELITE' ? "ELITE PARTNER" : "VERIFIED EXPERT"}
                                    </span>
                                    <div className="flex items-center gap-1 text-amber-500 font-black">
                                        {[...Array(5)].map((_, i) => (
                                            <span 
                                                key={i} 
                                                className="material-symbols-outlined text-sm" 
                                                style={{ fontVariationSettings: `'FILL' ${i < Math.floor(listing.rating || 4.5) ? 1 : 0}` }}
                                            >
                                                star
                                            </span>
                                        ))}
                                        <span className="text-xs uppercase tracking-tighter ml-1">
                                            {listing.rating > 0 ? listing.rating.toFixed(1) : "NEW"}
                                        </span>
                                    </div>
                                </div>
                                <h1 className="text-6xl md:text-8xl font-headline font-black tracking-tighter mb-4 uppercase italic leading-[0.85]">
                                    {tutor.role === "INSTITUTE" 
                                        ? "Premium Institute" 
                                        : (tutor.name?.split(' ')[0] || "Expert")} 
                                    <br/> 
                                    <span className="text-primary not-italic lowercase font-serif font-light">
                                        {tutor.role === "INSTITUTE" 
                                            ? "Education Partner" 
                                            : (tutor.name?.split(' ').slice(1).join(' ') || "Tutor")}
                                    </span>
                                </h1>
                                <p className="text-2xl text-on-surface-variant font-medium max-w-xl leading-snug">
                                    {listing.title || `Specialist in ${listing.subjects?.[0] || 'Modern Education'}`}
                                </p>
                            </div>
                        </section>

                        {/* Performance Intelligence */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 mb-20 bg-surface-container-low/50 backdrop-blur-md p-10 rounded-[3rem] border border-outline-variant/5">
                            <div className="space-y-1">
                                <p className="text-[9px] font-black text-on-surface-variant/40 uppercase tracking-widest">Experience</p>
                                <p className="text-3xl font-headline font-black">{listing.experience || 0} Yrs</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[9px] font-black text-on-surface-variant/40 uppercase tracking-widest">Impact</p>
                                <p className="text-3xl font-headline font-black">{listing.reviewCount || 0}+</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[9px] font-black text-on-surface-variant/40 uppercase tracking-widest">Hourly Rate</p>
                                <p className="text-3xl font-headline font-black text-primary">₹{listing.hourlyRate || "TBD"}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[9px] font-black text-on-surface-variant/40 uppercase tracking-widest">Status</p>
                                <p className="text-3xl font-headline font-black flex items-center gap-2">
                                    <span className="size-3 rounded-full bg-emerald-500"></span>
                                    ONLINE
                                </p>
                            </div>
                        </div>

                        {/* Narrative Sections */}
                        <div className="space-y-24">
                            <section>
                                <div className="flex items-center gap-6 mb-12">
                                    <h2 className="text-4xl font-headline font-black uppercase italic tracking-tighter">Strategic <span className="text-primary not-italic lowercase font-serif font-light">approach</span></h2>
                                    <div className="flex-1 h-px bg-outline-variant/10"></div>
                                </div>
                                <p className="text-xl text-on-surface-variant leading-relaxed max-w-3xl whitespace-pre-line font-medium opacity-80">
                                    {listing.bio || "This partner maintains a strictly confidential pedagogical framework focused on high-performance academic outcomes."}
                                </p>
                            </section>

                            <section>
                                <div className="flex items-center gap-6 mb-12">
                                    <h2 className="text-4xl font-headline font-black uppercase italic tracking-tighter">Specialized <span className="text-primary not-italic lowercase font-serif font-light">domains</span></h2>
                                    <div className="flex-1 h-px bg-outline-variant/10"></div>
                                </div>
                                <div className="flex flex-wrap gap-4">
                                    {listing.subjects?.map(sub => (
                                        <span key={sub} className="px-8 py-4 bg-white dark:bg-slate-900 border border-outline-variant/10 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                            {sub}
                                        </span>
                                    )) || <p className="text-on-surface-variant/40 italic font-black text-xs uppercase tracking-widest">GENERAL INTELLIGENCE</p>}
                                </div>
                            </section>

                            {/* Verification Cloud */}
                            <section className="p-16 rounded-[4rem] bg-gradient-to-br from-primary to-blue-900 text-on-primary relative overflow-hidden group">
                                <div className="absolute top-0 right-0 size-96 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-white/10 transition-colors duration-1000"></div>
                                <h3 className="text-4xl font-headline font-black mb-12 uppercase italic leading-none">Institutional <br/> <span className="lowercase font-serif font-light not-italic text-blue-200">Verification.</span></h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                    {[
                                        { label: "Identity Matrix", status: "AUTHENTICATED", icon: "verified_user" },
                                        { label: "Academic Credentials", status: "VERIFIED", icon: "school" },
                                        { label: "Background Protocol", status: "CLEARED", icon: "shield_moon" },
                                        { label: "Platform Tenure", status: "PARTNER SINCE 2024", icon: "history_edu" }
                                    ].map((item, i) => (
                                        <div key={i} className="flex gap-6 group/item">
                                            <div className="size-16 rounded-2xl bg-white/10 backdrop-blur-xl flex items-center justify-center group-hover/item:bg-white group-hover/item:text-primary transition-all duration-500">
                                                <span className="material-symbols-outlined text-2xl">{item.icon}</span>
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-lg mb-1">{item.label}</h4>
                                                <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-40">{item.status}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Reputation Terminal */}
                            <section id="reviews">
                                <div className="flex items-center gap-6 mb-12">
                                    <h2 className="text-4xl font-headline font-black uppercase italic tracking-tighter">Reputation <span className="text-primary not-italic lowercase font-serif font-light">terminal</span></h2>
                                    <div className="flex-1 h-px bg-outline-variant/10"></div>
                                </div>
                                
                                <div className="space-y-6">
                                    {tutor.reviewsReceived?.length > 0 ? tutor.reviewsReceived.map((review, i) => (
                                        <div key={review.id} className="p-10 rounded-[3rem] bg-surface-container-low/40 backdrop-blur-md border border-outline-variant/5 group hover:border-primary/20 transition-all duration-500 relative overflow-hidden">
                                            <div className="flex flex-col md:flex-row justify-between gap-8 relative z-10">
                                                <div className="flex gap-6">
                                                    <div className="size-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-black text-xl italic shrink-0">
                                                        {review.author?.name?.[0] || "S"}
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <h4 className="font-bold text-lg uppercase italic tracking-tight">{review.author?.name || "STUDENT_VERIFIED"}</h4>
                                                            <span className="text-[9px] font-black text-on-surface-variant/20 uppercase tracking-widest">• {new Date(review.createdAt).toLocaleDateString()}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1 text-amber-500 mb-6">
                                                            {[...Array(5)].map((_, i) => (
                                                                <span key={i} className="material-symbols-outlined text-xs" style={{ fontVariationSettings: `'FILL' ${i < review.rating ? 1 : 0}` }}>star</span>
                                                            ))}
                                                        </div>
                                                        <p className="text-lg text-on-surface-variant leading-relaxed font-medium italic opacity-80">
                                                            "{review.comment || "NO_COMMENT_LOGGED"}"
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="md:text-right shrink-0">
                                                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/5 text-emerald-500 border border-emerald-500/10 text-[9px] font-black uppercase tracking-widest">
                                                        <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                                        VERIFIED_FEEDBACK
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="absolute -bottom-6 -right-6 size-32 bg-primary/2 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        </div>
                                    )) : (
                                        <div className="p-20 rounded-[4rem] border-4 border-dashed border-outline-variant/10 text-center">
                                            <p className="text-on-surface-variant/20 italic font-black text-xs uppercase tracking-[0.4em]">Establishing Reputation Ledger...</p>
                                        </div>
                                    )}
                                </div>
                            </section>
                        </div>
                    </div>

                    {/* Right Column: Acquisition Hub */}
                    <aside className="lg:col-span-4">
                        <div className="sticky top-32">
                            <div className="bg-white dark:bg-slate-950 rounded-[3.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] p-12 md:p-14 border border-outline-variant/10 relative overflow-hidden group">
                                {/* Match Indicator Overlay */}
                                <div className="absolute top-0 right-0 p-8">
                                    <div className="size-16 rounded-full border border-primary/10 flex flex-col items-center justify-center group-hover:bg-primary group-hover:text-on-primary transition-all duration-700">
                                        <span className="text-[8px] font-black uppercase leading-none opacity-40 group-hover:opacity-100 mb-0.5">High</span>
                                        <span className="text-lg font-headline font-black leading-none italic">A+</span>
                                    </div>
                                </div>

                                <div className="relative z-10">
                                    <h3 className="text-3xl font-headline font-black mb-4 uppercase italic tracking-tight">Initiate <br/> <span className="text-primary not-italic lowercase font-serif font-light">Engagement.</span></h3>
                                    <p className="text-on-surface-variant font-medium mb-12 opacity-60 leading-relaxed">Secure a 30-minute diagnostic session to assess academic affinity.</p>
                                    
                                    <div className="space-y-6">
                                        <Link 
                                            href={`/post-requirement?tutorId=${id}`}
                                            className="w-full bg-primary text-on-primary py-8 rounded-[2rem] font-black text-[11px] tracking-[0.4em] uppercase shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4 group/btn"
                                        >
                                            <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">lock_open</span>
                                            Unlock Contact Details
                                        </Link>

                                        {canContactProactively ? (
                                            <ChatInitiator 
                                                studentId={viewerId} 
                                                tutorId={id} 
                                                recipientRole="TUTOR" 
                                                label="SECURE CHAT ACTIVE" 
                                            />
                                        ) : viewerId ? (
                                            <ChatInitiator 
                                                studentId={viewerId} 
                                                tutorId={id} 
                                                recipientRole="TUTOR" 
                                                label="START SECURE DIALOGUE" 
                                            />
                                        ) : (
                                            <Link 
                                                href={`/dashboard/student?tutorId=${id}`}
                                                className="w-full bg-amber-50 text-amber-600 border border-amber-500/10 py-6 rounded-[1.5rem] font-black text-[10px] tracking-widest uppercase flex items-center justify-center gap-3 hover:bg-amber-100 transition-all text-center"
                                            >
                                                <span className="material-symbols-outlined text-lg">workspace_premium</span>
                                                UPGRADE TO ACCESS
                                            </Link>
                                        )}

                                        <div className="pt-10 border-t border-outline-variant/10 text-center">
                                            <div className="flex items-center justify-center -space-x-3 mb-4">
                                                {[1,2,3,4].map(i => (
                                                    <div key={i} className="size-10 rounded-full border-2 border-white dark:border-slate-950 bg-surface-container-high flex items-center justify-center font-black text-[10px]">
                                                        {String.fromCharCode(64 + i)}
                                                    </div>
                                                ))}
                                                <div className="size-10 rounded-full border-2 border-white dark:border-slate-950 bg-primary text-on-primary flex items-center justify-center font-black text-[8px]">
                                                    +82
                                                </div>
                                            </div>
                                            <p className="text-[10px] font-black uppercase tracking-widest opacity-30">Active students this month</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Performance Guarantee */}
                            <div className="mt-10 p-10 bg-emerald-50 dark:bg-emerald-950/20 rounded-[2.5rem] border border-emerald-100 dark:border-emerald-800/30 flex items-start gap-6 group hover:border-emerald-500 transition-all duration-500">
                                <div className="size-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:rotate-12 transition-transform shrink-0">
                                    <span className="material-symbols-outlined">verified</span>
                                </div>
                                <div>
                                    <h4 className="font-bold text-emerald-900 dark:text-emerald-400 mb-1">Elite Standard</h4>
                                    <p className="text-xs text-emerald-800/60 dark:text-emerald-300/40 leading-relaxed font-medium">This partner adheres to the Global Learning Protocol for verifiable growth.</p>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </main>

            {/* SEO & Graph Intelligence */}
            <script type="application/ld+json" dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "Person",
                    "name": tutor.name,
                    "description": listing.bio,
                    "jobTitle": "High-Performance Tutor",
                    "url": `https://tuitionsinindia.com/tutor/${tutor.id}`,
                    "image": tutor.image || "https://tuitionsinindia.com/default-avatar.png",
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
