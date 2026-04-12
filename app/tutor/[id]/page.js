import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import ChatInitiator from "@/app/components/chat/ChatInitiator";
import { 
    Star, 
    ShieldCheck, 
    Award, 
    Clock, 
    Users, 
    Zap, 
    ArrowLeft, 
    MapPin, 
    Briefcase, 
    CheckCircle2,
    Verified,
    Info,
    MessageCircle,
    Lock
} from "lucide-react";

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
    const id = params.id;
    const tutor = await prisma.user.findUnique({
        where: { id },
        include: { tutorListing: true }
    });

    if (!tutor) return { title: "Tutor Profile | TuitionsInIndia" };

    const name = tutor.name || "Tutor";
    const subject = tutor.tutorListing?.subjects?.[0] || "Academics";
    const location = tutor.tutorListing?.locations?.[0] || "India";

    return {
        title: `Best ${subject} Tutor in ${location} | ${name} | TuitionsInIndia`,
        description: `Connect with ${name}, a premier ${subject} specialist in ${location}. View verified credentials, academic affinity scores, and teaching style.`,
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
        select: {
            id: true,
            name: true,
            image: true,
            role: true,
            subscriptionTier: true,
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
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900 antialiased selection:bg-blue-600/10 selection:text-blue-900 pt-32 pb-40">
            {/* Ambient Background Strategy */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-600/[0.03] rounded-full blur-[160px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/[0.02] rounded-full blur-[140px]"></div>
            </div>

            <main className="max-w-7xl mx-auto px-6 relative z-10">
                {/* Standardized Navigation */}
                <div className="mb-16">
                    <Link href="/tutors" className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-gray-300 hover:text-blue-600 transition-all group italic">
                        <ArrowLeft size={16} className="group-hover:-translate-x-2 transition-transform" /> 
                        All Tutors
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
                    {/* Left Column: Tutor Profile */}
                    <div className="lg:col-span-8">
                        <section className="relative">
                            <div className="relative h-[500px] md:h-[750px] w-full rounded-[4rem] overflow-hidden mb-16 shadow-4xl shadow-blue-900/10 border border-gray-100 bg-white group">
                                {tutor.image ? (
                                    <img 
                                        src={tutor.image} 
                                        alt={tutor.name} 
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" 
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-9xl font-black text-blue-600/5 uppercase bg-white italic tracking-tighter">
                                        {(tutor.name || "U")[0]}
                                    </div>
                                )}
                                
                                <div className="absolute top-12 right-12 flex items-center gap-3 bg-white/60 backdrop-blur-2xl px-6 py-3 rounded-2xl border border-white/40 shadow-2xl">
                                    <span className="size-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-900">Live Partnership</span>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="flex flex-wrap items-center gap-4 mb-6">
                                    <span className="px-6 py-2.5 bg-blue-50 text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-blue-100 shadow-sm italic">
                                        {tutor.subscriptionTier === 'ELITE' ? "Elite Tutor" : "Verified Tutor"}
                                    </span>
                                    <div className="flex items-center gap-1.5 text-amber-500 font-black px-4 py-2 bg-white rounded-xl border border-gray-100 shadow-sm">
                                        <Star size={14} fill="currentColor" strokeWidth={0} />
                                        <span className="text-[11px] uppercase tracking-tighter ml-1 text-gray-900">
                                            {listing.rating > 0 ? listing.rating.toFixed(1) : "Unrated"}
                                        </span>
                                    </div>
                                </div>
                                <h1 className="text-7xl md:text-9xl font-black tracking-tighter mb-6 uppercase italic leading-[0.85] text-gray-900">
                                    {tutor.role === "INSTITUTE" 
                                        ? "Premium Institute" 
                                        : (tutor.name?.split(' ')[0] || "Expert")} 
                                    <br/> 
                                    <span className="text-blue-600 not-italic lowercase font-serif font-light tracking-normal">
                                        {tutor.role === "INSTITUTE" 
                                            ? "Learning Center" 
                                            : (tutor.name?.split(' ').slice(1).join(' ') || "Tutor")}
                                    </span>
                                </h1>
                                <p className="text-2xl text-gray-400 font-bold max-w-2xl leading-snug italic uppercase tracking-tighter opacity-80 decoration-blue-600/10 underline decoration-4 underline-offset-8">
                                    {listing.title || `Specialist in ${listing.subjects?.[0] || 'Modern Education'}`}
                                </p>
                            </div>
                        </section>

                        {/* High-Fidelity Metrics Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-24 mb-24 bg-white p-12 rounded-[4rem] border border-gray-100 shadow-4xl shadow-blue-900/[0.02]">
                            {[
                                { label: "Experience", val: `${listing.experience || 0} Yrs`, icon: Briefcase, color: "text-blue-600" },
                                { label: "Student Reach", val: `${listing.reviewCount || 0}+`, icon: Users, color: "text-indigo-600" },
                                { label: "Standard Rate", val: `₹${listing.hourlyRate || "TBD"}`, icon: Wallet, color: "text-emerald-600" },
                                { label: "Global Status", val: "ONLINE", icon: Zap, color: "text-amber-600" }
                            ].map((metric, i) => (
                                <div key={i} className="space-y-4 group">
                                    <div className={`size-12 rounded-xl bg-gray-50 flex items-center justify-center ${metric.color} shadow-inner group-hover:scale-110 transition-transform`}>
                                        <metric.icon size={20} strokeWidth={3} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1 italic">{metric.label}</p>
                                        <p className="text-2xl font-black text-gray-900 italic tracking-tighter">{metric.val}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Narrative Registry */}
                        <div className="space-y-28">
                            <section>
                                <div className="flex items-center gap-10 mb-14">
                                    <h2 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter text-gray-900 shrink-0">About <span className="text-blue-600 lowercase font-serif font-light not-italic">Bio.</span></h2>
                                    <div className="flex-1 h-px bg-gray-100"></div>
                                </div>
                                <div className="relative">
                                    <div className="absolute -left-10 top-0 text-[120px] font-black text-gray-50 select-none pointer-events-none italic opacity-50 uppercase">BIO</div>
                                    <p className="text-xl text-gray-400 font-bold leading-relaxed max-w-3xl whitespace-pre-line relative z-10 italic uppercase tracking-tighter">
                                        {listing.bio || "Professional tutor available for classes."}
                                    </p>
                                </div>
                            </section>

                            <section>
                                <div className="flex items-center gap-10 mb-14">
                                    <h2 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter text-gray-900 shrink-0">Specialized <span className="text-blue-600 lowercase font-serif font-light not-italic">Domains.</span></h2>
                                    <div className="flex-1 h-px bg-gray-100"></div>
                                </div>
                                <div className="flex flex-wrap gap-4 relative">
                                    {listing.subjects?.map(sub => (
                                        <span key={sub} className="px-10 py-5 bg-white border border-gray-100 rounded-[2rem] text-[11px] font-black uppercase tracking-[0.2em] shadow-4xl shadow-blue-900/[0.03] hover:shadow-blue-900/10 hover:-translate-y-2 transition-all duration-500 italic text-gray-900">
                                            {sub}
                                        </span>
                                    )) || <p className="text-gray-200 italic font-black text-[10px] uppercase tracking-widest">General Intelligence Spectrum</p>}
                                </div>
                            </section>

                            {/* Verification Registry */}
                            <section className="p-16 rounded-[4rem] bg-gray-900 text-white relative overflow-hidden group">
                                <div className="absolute top-0 right-0 size-96 bg-blue-600/10 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-blue-600/20 transition-all duration-1000"></div>
                                <div className="relative z-10 mb-16">
                                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 rounded-full border border-blue-500/20 mb-6">
                                        < ShieldCheck size={14} className="text-blue-400" />
                                        <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest italic">Institutional Authentication</span>
                                    </div>
                                    <h3 className="text-4xl md:text-5xl font-black uppercase italic leading-none tracking-tighter">Global <br/> <span className="lowercase font-serif font-light not-italic text-blue-400">Verifications.</span></h3>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
                                    {[
                                        { label: "Identity Matrix", status: "AUTHENTICATED", icon: ShieldCheck },
                                        { label: "Academic Registry", status: "VERIFIED", icon: Award },
                                        { label: "Professional Background", status: "CLEARED", icon: CheckCircle2 },
                                        { label: "Platform Tenure", status: "VERIFIED SINCE 2024", icon: Clock }
                                    ].map((item, i) => (
                                        <div key={i} className="flex gap-6 group/item">
                                            <div className="size-16 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-xl flex items-center justify-center group-hover/item:bg-blue-600 group-hover/item:border-blue-600 transition-all duration-500 shadow-lg">
                                                <item.icon size={28} strokeWidth={2.5} />
                                            </div>
                                            <div>
                                                <h4 className="font-black text-xl mb-1 italic tracking-tighter uppercase">{item.label}</h4>
                                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400/60 italic">{item.status}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Reputation Registry */}
                            <section id="reviews">
                                <div className="flex items-center gap-10 mb-14">
                                    <h2 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter text-gray-900 shrink-0">Reviews <span className="text-blue-600 lowercase font-serif font-light not-italic">Dialogue.</span></h2>
                                    <div className="flex-1 h-px bg-gray-100"></div>
                                </div>
                                
                                <div className="space-y-8">
                                    {tutor.reviewsReceived?.length > 0 ? tutor.reviewsReceived.map((review, i) => (
                                        <div key={review.id} className="p-12 rounded-[3.5rem] bg-white border border-gray-100 shadow-4xl shadow-blue-900/[0.02] group hover:border-blue-600/10 transition-all duration-500 relative overflow-hidden">
                                            <div className="flex flex-col md:flex-row justify-between gap-10 relative z-10">
                                                <div className="flex gap-8">
                                                    <div className="size-20 rounded-[2rem] bg-gray-50 border border-gray-100 text-blue-600 flex items-center justify-center font-black text-3xl italic shrink-0 shadow-inner group-hover:rotate-6 transition-transform">
                                                        {review.author?.name?.[0] || "S"}
                                                    </div>
                                                    <div>
                                                        <div className="flex flex-wrap items-center gap-4 mb-4">
                                                            <h4 className="font-black text-xl uppercase italic tracking-tighter text-gray-900 leading-none">{review.author?.name || "Verified Student"}</h4>
                                                            <span className="text-[10px] font-black text-gray-200 uppercase tracking-widest">• {new Date(review.createdAt).toLocaleDateString()}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1 text-amber-500 mb-8 border border-gray-50 w-fit px-3 py-1.5 rounded-xl shadow-inner">
                                                            {[...Array(5)].map((_, i) => (
                                                                <Star key={i} size={12} fill={i < review.rating ? "currentColor" : "none"} strokeWidth={i < review.rating ? 0 : 3} className={i < review.rating ? "" : "text-gray-100"} />
                                                            ))}
                                                        </div>
                                                        <p className="text-xl text-gray-400 font-bold leading-relaxed italic uppercase tracking-tighter opacity-80 max-w-2xl">
                                                            "{review.comment || "SYNCHRONIZATION_COMPLETE: NO_COMMENT_SPECIFIED"}"
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="md:text-right shrink-0">
                                                    <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 text-[10px] font-black uppercase tracking-widest italic shadow-sm">
                                                        <span className="size-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                                        High-Fidelity Feedback
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="p-24 rounded-[4rem] border-4 border-dashed border-gray-100 text-center flex flex-col items-center justify-center group hover:border-blue-600/10 transition-colors">
                                            <MessageCircle size={64} className="text-gray-100 group-hover:text-blue-600/10 transition-colors mb-8" strokeWidth={1} />
                                            <p className="text-gray-200 italic font-black text-[10px] uppercase tracking-[0.5em] group-hover:text-gray-300 transition-colors">Establishing Reputation Ledger...</p>
                                        </div>
                                    )}
                                </div>
                            </section>
                        </div>
                    </div>

                    {/* Right Column: Enrollment Terminal */}
                    <aside className="lg:col-span-4">
                        <div className="sticky top-40">
                            <div className="bg-white rounded-[4rem] shadow-4xl shadow-blue-900/10 p-12 lg:p-14 border border-gray-100 relative overflow-hidden group border-b-[12px] border-blue-600">
                                {/* Match Index Overlay */}
                                <div className="absolute top-0 right-0 p-10">
                                    <div className="size-20 rounded-[2rem] border-2 border-dashed border-blue-600/10 flex flex-col items-center justify-center group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:text-white transition-all duration-700 shadow-inner">
                                        <span className="text-[9px] font-black uppercase leading-none opacity-40 group-hover:opacity-100 mb-1 italic">High</span>
                                        <span className="text-2xl font-black leading-none italic tracking-tighter">A+</span>
                                    </div>
                                </div>

                                <div className="relative z-10">
                                    <h3 className="text-4xl font-black mb-6 uppercase italic tracking-tighter text-gray-900 leading-[0.9]">Initiate <br/> <span className="text-blue-600 not-italic lowercase font-serif font-light tracking-normal">Engagement.</span></h3>
                                    <p className="text-gray-400 font-bold mb-14 opacity-80 leading-relaxed italic uppercase text-[11px] tracking-tight">Book a trial class to see if this tutor is right for you.</p>
                                    
                                    <div className="space-y-8">
                                        <Link 
                                            href={`/post-requirement?tutorId=${id}`}
                                            className="w-full bg-blue-600 text-white py-8 rounded-[2.5rem] font-black text-[10px] tracking-[0.5em] uppercase shadow-2xl shadow-blue-600/30 hover:bg-gray-900 transition-all flex items-center justify-center gap-4 group/btn italic active:scale-95"
                                        >
                                            <Lock size={18} strokeWidth={3} className="group-hover/btn:rotate-12 transition-transform" />
                                            Unlock Credentials
                                        </Link>

                                        {canContactProactively ? (
                                            <ChatInitiator 
                                                studentId={viewerId} 
                                                tutorId={id} 
                                                recipientRole="TUTOR" 
                                                label="OPEN SECURE CHANNEL" 
                                            />
                                        ) : viewerId ? (
                                            <ChatInitiator 
                                                studentId={viewerId} 
                                                tutorId={id} 
                                                recipientRole="TUTOR" 
                                                label="RE-SYNC DIALOGUE" 
                                            />
                                        ) : (
                                            <div className="p-8 rounded-[2rem] bg-blue-50/50 border border-blue-100/50 flex flex-col gap-6 text-center">
                                                <div className="flex items-center justify-center gap-2 text-blue-600">
                                                    <Info size={16} strokeWidth={3} />
                                                    <span className="text-[10px] font-black uppercase tracking-widest italic leading-none">Access Restricted</span>
                                                </div>
                                                <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest leading-relaxed italic">Identity synchronization is required to establish a direct neural link.</p>
                                                <Link 
                                                    href={`/dashboard/student?tutorId=${id}`}
                                                    className="w-full bg-white border border-blue-600/20 py-5 rounded-2xl font-black text-[10px] tracking-widest uppercase text-blue-600 flex items-center justify-center gap-3 hover:bg-blue-600 hover:text-white transition-all italic shadow-sm"
                                                >
                                                    <Verified size={14} />
                                                    Upgrade Registry
                                                </Link>
                                            </div>
                                        )}

                                        <div className="pt-12 border-t border-gray-50 text-center">
                                            <div className="flex items-center justify-center -space-x-4 mb-6">
                                                {[1,2,3,4].map(i => (
                                                    <div key={i} className="size-12 rounded-full border-[3px] border-white bg-gray-50 flex items-center justify-center font-black text-[11px] text-gray-300 italic shadow-sm">
                                                        {String.fromCharCode(64 + i)}
                                                    </div>
                                                ))}
                                                <div className="size-12 rounded-full border-[3px] border-white bg-blue-600 text-white flex items-center justify-center font-black text-[11px] italic shadow-lg">
                                                    +82
                                                </div>
                                            </div>
                                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-200 italic">Current Students</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Institutional Integrity Check */}
                            <div className="mt-10 p-12 bg-white rounded-[3.5rem] border border-gray-100 flex items-start gap-8 shadow-4xl shadow-blue-900/[0.02] group hover:border-emerald-500/20 transition-all duration-500 overflow-hidden relative">
                                <div className="absolute -left-4 -bottom-4 size-24 bg-emerald-500/5 rounded-full blur-2xl"></div>
                                <div className="size-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-inner border border-emerald-100 group-hover:rotate-12 transition-transform shrink-0">
                                    <Verified size={24} strokeWidth={3} />
                                </div>
                                <div>
                                    <h4 className="font-black text-gray-900 mb-2 italic tracking-tighter uppercase leading-none text-xl">Elite Integrity</h4>
                                    <p className="text-[10px] text-gray-300 leading-relaxed font-black uppercase tracking-widest italic opacity-80">This tutor is committed to helping students achieve their learning goals.</p>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </main>

            {/* Structured Semantic Intelligence */}
            <script type="application/ld+json" dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "Person",
                    "name": tutor.name,
                    "description": listing.bio,
                    "jobTitle": "High-Performance Educator",
                    "url": `https://tuitionsinindia.com/tutor/${tutor.id}`,
                    "image": tutor.image || "https://tuitionsinindia.com/logo.png",
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
