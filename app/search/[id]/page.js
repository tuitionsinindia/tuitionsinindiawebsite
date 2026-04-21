import prisma from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
    MapPin, Clock, Star, BadgeCheck, GraduationCap, BookOpen,
    ArrowLeft, Briefcase, Languages, Users, Monitor, Home as HomeIcon,
    IndianRupee, Award, ChevronRight, Sparkles
} from "lucide-react";
import { WhatsAppShareButton, ShareButton } from "@/app/components/ShareButtons";
import TrackProfileView from "@/app/components/TrackProfileView";
import TutorProfileActions from "@/app/components/TutorProfileActions";
import ReviewForm from "@/app/components/ReviewForm";

export async function generateMetadata({ params }) {
    const { id } = await params;
    const listing = await prisma.listing.findFirst({
        where: { OR: [{ id }, { tutorId: id }] },
        include: { tutor: { select: { name: true, image: true } } },
    });
    if (!listing) return { title: "Tutor Not Found | TuitionsInIndia" };

    const name = listing.tutor.name;
    const subjects = listing.subjects?.join(", ") || "Academics";
    const location = listing.locations?.[0] || "India";
    const rate = listing.hourlyRate ? `₹${listing.hourlyRate}/hr` : "";
    const bio = listing.bio?.slice(0, 155) || `${name} is an experienced tutor teaching ${subjects} in ${location}.`;
    const title = `${name} — ${subjects} Tutor in ${location}${rate ? ` | ${rate}` : ""} | TuitionsInIndia`;
    const url = `https://tuitionsinindia.com/search/${id}`;

    return {
        title,
        description: bio,
        keywords: [...(listing.subjects || []), ...(listing.locations || []), "tutor", "home tuition", "online tutor", "TuitionsInIndia"].join(", "),
        alternates: { canonical: url },
        openGraph: { title, description: bio, url, type: "profile", images: listing.tutor.image ? [{ url: listing.tutor.image }] : [] },
        twitter: { card: "summary", title, description: bio },
    };
}

function StarRow({ rating, size = 14 }) {
    return (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map(i => (
                <Star key={i} size={size} className={i <= Math.round(rating) ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"} />
            ))}
        </div>
    );
}

function RatingBar({ label, count, total }) {
    const pct = total > 0 ? Math.round((count / total) * 100) : 0;
    return (
        <div className="flex items-center gap-2 text-xs">
            <span className="w-4 text-right text-gray-500 shrink-0">{label}</span>
            <Star size={10} className="text-amber-400 fill-amber-400 shrink-0" />
            <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-amber-400 rounded-full transition-all" style={{ width: `${pct}%` }} />
            </div>
            <span className="w-5 text-gray-400 shrink-0">{count}</span>
        </div>
    );
}

export default async function TutorProfilePage({ params, searchParams }) {
    const { id } = await params;
    const resolvedSearch = await searchParams;
    const initialAction = resolvedSearch?.action || "";

    const listing = await prisma.listing.findFirst({
        where: { OR: [{ id }, { tutorId: id }], isActive: true },
        include: {
            tutor: {
                select: {
                    id: true, name: true, image: true, role: true,
                    isVerified: true, isIdVerified: true, subscriptionTier: true,
                    reviewsReceived: {
                        select: { id: true, rating: true, comment: true, createdAt: true, author: { select: { name: true } } },
                        orderBy: { createdAt: "desc" },
                        take: 20,
                    },
                },
            },
        },
    });

    if (!listing) notFound();

    const tutor = listing.tutor;
    const isPremium = ["PRO", "ELITE"].includes(tutor.subscriptionTier);
    const trackSubject = listing.subjects?.[0] || "Unknown";

    // Rating distribution
    const reviews = tutor.reviewsReceived || [];
    const dist = [5, 4, 3, 2, 1].map(star => ({
        star,
        count: reviews.filter(r => r.rating === star).length,
    }));

    // Similar tutors
    let similarTutors = [];
    try {
        similarTutors = await prisma.listing.findMany({
            where: { isActive: true, subjects: { hasSome: listing.subjects || [] }, tutorId: { not: tutor.id } },
            include: { tutor: { select: { id: true, name: true, image: true, isVerified: true } } },
            take: 4,
            orderBy: [{ isFeatured: "desc" }, { rating: "desc" }],
        });
    } catch {}

    // JSON-LD
    const profileUrl = `https://tuitionsinindia.com/search/${id}`;
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Person",
        name: tutor.name,
        description: listing.bio || "",
        image: tutor.image || undefined,
        url: profileUrl,
        jobTitle: "Private Tutor",
        knowsAbout: listing.subjects || [],
        ...(listing.locations?.[0] && { address: { "@type": "PostalAddress", addressLocality: listing.locations[0], addressCountry: "IN" } }),
        ...(listing.hourlyRate && { offers: { "@type": "Offer", priceCurrency: "INR", price: listing.hourlyRate, priceSpecification: { "@type": "UnitPriceSpecification", price: listing.hourlyRate, priceCurrency: "INR", unitText: "HOUR" } } }),
        ...(listing.rating > 0 && { aggregateRating: { "@type": "AggregateRating", ratingValue: listing.rating.toFixed(1), reviewCount: listing.reviewCount || 1, bestRating: 5, worstRating: 1 } }),
        worksFor: { "@type": "Organization", name: "TuitionsInIndia", url: "https://tuitionsinindia.com" },
    };

    const modeLabel = (modes = []) => {
        if (modes.includes("ONLINE") && modes.includes("HOME")) return "Online + Home Tuition";
        if (modes.includes("ONLINE")) return "Online Only";
        if (modes.includes("HOME")) return "Home Tuition";
        if (modes.includes("CENTER")) return "Coaching Centre";
        return modes.join(", ");
    };

    const initials = (tutor.name || "T").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

    return (
        <div className="min-h-screen bg-gray-50">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <TrackProfileView tutorId={listing.id} subject={trackSubject} />

            {/* ── Sticky breadcrumb nav ── */}
            <div className="sticky top-0 z-20 bg-white/95 backdrop-blur border-b border-gray-100">
                <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Link href="/search" className="flex items-center gap-1.5 hover:text-blue-600 transition-colors">
                            <ArrowLeft size={15} /> Search
                        </Link>
                        <ChevronRight size={13} className="text-gray-300" />
                        <span className="text-gray-800 font-medium truncate max-w-48 md:max-w-xs">{tutor.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <WhatsAppShareButton
                            text={`Check out ${tutor.name} on TuitionsInIndia — ${listing.subjects?.join(", ")} tutor`}
                            url={`https://tuitionsinindia.com/search/${id}`}
                        />
                        <ShareButton
                            title={`${tutor.name} — ${listing.subjects?.[0]} Tutor`}
                            url={`https://tuitionsinindia.com/search/${id}`}
                        />
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 py-6 space-y-5">

                {/* ── Hero Card ── */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    {/* Banner */}
                    <div className="h-28 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-500 relative">
                        {listing.isFeatured && (
                            <span className="absolute top-3 right-3 flex items-center gap-1 text-xs font-semibold bg-amber-400 text-amber-900 px-2.5 py-1 rounded-full">
                                <Sparkles size={11} /> Featured
                            </span>
                        )}
                    </div>

                    <div className="px-6 pb-6">
                        {/* Photo + name row */}
                        <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-10 mb-5">
                            <div className="relative shrink-0">
                                {tutor.image ? (
                                    <img src={tutor.image} alt={tutor.name}
                                        className="w-20 h-20 rounded-2xl object-cover border-4 border-white shadow-lg" />
                                ) : (
                                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 text-white text-2xl font-bold flex items-center justify-center border-4 border-white shadow-lg">
                                        {initials}
                                    </div>
                                )}
                                {(tutor.isVerified || tutor.isIdVerified) && (
                                    <span className="absolute -bottom-1 -right-1 size-6 bg-blue-600 rounded-full flex items-center justify-center border-2 border-white">
                                        <BadgeCheck size={13} className="text-white" />
                                    </span>
                                )}
                            </div>
                            <div className="flex-1 sm:pb-1">
                                <div className="flex flex-wrap items-center gap-2 mb-0.5">
                                    <h1 className="text-xl font-bold text-gray-900">{tutor.name}</h1>
                                    {isPremium && (
                                        <span className="px-2 py-0.5 bg-amber-50 text-amber-700 text-xs font-semibold rounded-full border border-amber-200">
                                            {tutor.subscriptionTier}
                                        </span>
                                    )}
                                    {listing.offersTrialClass && (
                                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-200">
                                            Free Trial
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-gray-500 leading-snug">{listing.title}</p>
                            </div>
                        </div>

                        {/* Stats strip */}
                        <div className="flex flex-wrap gap-x-5 gap-y-2 mb-5 text-sm text-gray-600">
                            {listing.rating > 0 && (
                                <span className="flex items-center gap-1.5 font-medium text-amber-600">
                                    <Star size={14} className="fill-amber-400 text-amber-400" />
                                    {listing.rating.toFixed(1)}
                                    <span className="text-gray-400 font-normal">({listing.reviewCount} reviews)</span>
                                </span>
                            )}
                            {listing.experience > 0 && (
                                <span className="flex items-center gap-1.5">
                                    <Briefcase size={13} className="text-gray-400" />
                                    {listing.experience} yrs experience
                                </span>
                            )}
                            {listing.locations?.length > 0 && (
                                <span className="flex items-center gap-1.5">
                                    <MapPin size={13} className="text-gray-400" />
                                    {listing.locations.slice(0, 2).join(", ")}
                                    {listing.locations.length > 2 && ` +${listing.locations.length - 2}`}
                                </span>
                            )}
                            {listing.teachingModes?.length > 0 && (
                                <span className="flex items-center gap-1.5">
                                    {listing.teachingModes.includes("ONLINE")
                                        ? <Monitor size={13} className="text-gray-400" />
                                        : <HomeIcon size={13} className="text-gray-400" />}
                                    {modeLabel(listing.teachingModes)}
                                </span>
                            )}
                            {listing.hourlyRate > 0 && (
                                <span className="flex items-center gap-1.5 font-semibold text-gray-800">
                                    <IndianRupee size={13} className="text-gray-400" />
                                    ₹{listing.hourlyRate.toLocaleString("en-IN")}/hr
                                </span>
                            )}
                        </div>

                        {/* CTA */}
                        <TutorProfileActions
                            tutor={{ id: tutor.id, name: tutor.name }}
                            subject={listing.subjects?.[0] || ""}
                            offersTrialClass={listing.offersTrialClass}
                            trialDuration={listing.trialDuration}
                            initialAction={initialAction}
                        />
                    </div>
                </div>

                {/* ── Main grid ── */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

                    {/* Left: main content */}
                    <div className="lg:col-span-2 space-y-5">

                        {/* About */}
                        {listing.bio && (
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                                <h2 className="text-sm font-semibold text-gray-900 mb-3">About</h2>
                                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{listing.bio}</p>
                            </div>
                        )}

                        {/* Subjects & Grades */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                            {listing.subjects?.length > 0 && (
                                <div>
                                    <h2 className="text-sm font-semibold text-gray-900 mb-3">Subjects</h2>
                                    <div className="flex flex-wrap gap-2">
                                        {listing.subjects.map(s => (
                                            <Link key={s} href={`/search?subject=${encodeURIComponent(s)}`}
                                                className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium hover:bg-blue-100 transition-colors">
                                                {s}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {listing.grades?.length > 0 && (
                                <div>
                                    <h2 className="text-sm font-semibold text-gray-900 mb-3">Grade Levels</h2>
                                    <div className="flex flex-wrap gap-2">
                                        {listing.grades.map(g => (
                                            <span key={g} className="px-3 py-1.5 bg-gray-50 text-gray-600 rounded-lg text-xs font-medium border border-gray-100">
                                                {g}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {listing.boards?.length > 0 && (
                                <div>
                                    <h2 className="text-sm font-semibold text-gray-900 mb-3">Boards</h2>
                                    <div className="flex flex-wrap gap-2">
                                        {listing.boards.map(b => (
                                            <span key={b} className="px-3 py-1.5 bg-violet-50 text-violet-700 rounded-lg text-xs font-medium">
                                                {b}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Teaching Details */}
                        {(listing.teachingModes?.length > 0 || listing.timings?.length > 0 || listing.languages?.length > 0) && (
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                                <h2 className="text-sm font-semibold text-gray-900">Teaching Details</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {listing.teachingModes?.length > 0 && (
                                        <div>
                                            <p className="text-xs text-gray-400 font-medium mb-2">Mode</p>
                                            <div className="flex flex-wrap gap-2">
                                                {listing.teachingModes.map(m => (
                                                    <span key={m} className="flex items-center gap-1.5 text-xs font-medium text-gray-700 bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-lg">
                                                        {m === "ONLINE" && <Monitor size={11} className="text-blue-500" />}
                                                        {m === "HOME" && <HomeIcon size={11} className="text-emerald-500" />}
                                                        {m === "CENTER" && <GraduationCap size={11} className="text-violet-500" />}
                                                        {m === "ONLINE" ? "Online" : m === "HOME" ? "Home Tuition" : m === "CENTER" ? "Centre" : m}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {listing.timings?.length > 0 && (
                                        <div>
                                            <p className="text-xs text-gray-400 font-medium mb-2">Availability</p>
                                            <div className="flex flex-wrap gap-2">
                                                {listing.timings.map(t => (
                                                    <span key={t} className="text-xs font-medium text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg">{t}</span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {listing.languages?.length > 0 && (
                                        <div>
                                            <p className="text-xs text-gray-400 font-medium mb-2">Languages</p>
                                            <div className="flex flex-wrap gap-2">
                                                {listing.languages.map(l => (
                                                    <span key={l} className="text-xs font-medium text-gray-600 bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-lg">{l}</span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {listing.expertiseLevel && (
                                        <div>
                                            <p className="text-xs text-gray-400 font-medium mb-2">Expertise Level</p>
                                            <span className="text-xs font-medium text-violet-700 bg-violet-50 px-3 py-1.5 rounded-lg">
                                                {listing.expertiseLevel === "PRIMARY" ? "Primary (Class 1–5)" :
                                                 listing.expertiseLevel === "SECONDARY" ? "Secondary (Class 6–10)" :
                                                 listing.expertiseLevel === "SENIOR" ? "Senior Secondary (11–12)" :
                                                 listing.expertiseLevel === "COMPETITIVE" ? "Competitive Exams" :
                                                 listing.expertiseLevel}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Reviews */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                            <div className="flex items-center justify-between mb-5">
                                <h2 className="text-sm font-semibold text-gray-900">Reviews</h2>
                                {listing.reviewCount > 0 && (
                                    <span className="text-xs text-gray-400">{listing.reviewCount} {listing.reviewCount === 1 ? "review" : "reviews"}</span>
                                )}
                            </div>

                            {listing.reviewCount > 0 && (
                                <div className="flex flex-col sm:flex-row gap-6 mb-6 pb-6 border-b border-gray-100">
                                    {/* Big number */}
                                    <div className="flex flex-col items-center justify-center shrink-0">
                                        <span className="text-5xl font-bold text-gray-900">{listing.rating.toFixed(1)}</span>
                                        <StarRow rating={listing.rating} size={13} />
                                        <span className="text-xs text-gray-400 mt-1">{listing.reviewCount} reviews</span>
                                    </div>
                                    {/* Bar chart */}
                                    <div className="flex-1 space-y-1.5 justify-center flex flex-col">
                                        {dist.map(({ star, count }) => (
                                            <RatingBar key={star} label={star} count={count} total={listing.reviewCount} />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {reviews.length > 0 ? (
                                <div className="space-y-5 mb-6">
                                    {reviews.map(r => (
                                        <div key={r.id} className="flex gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                                                {(r.author?.name || "S")[0].toUpperCase()}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex flex-wrap items-center gap-2 mb-1">
                                                    <span className="text-sm font-semibold text-gray-900">{r.author?.name || "Student"}</span>
                                                    <StarRow rating={r.rating} size={11} />
                                                    <span className="text-xs text-gray-400">
                                                        {new Date(r.createdAt).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}
                                                    </span>
                                                </div>
                                                {r.comment && <p className="text-sm text-gray-600 leading-relaxed">{r.comment}</p>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-400 mb-5">No reviews yet.</p>
                            )}

                            <div className={reviews.length > 0 ? "pt-5 border-t border-gray-100" : ""}>
                                <ReviewForm tutorId={tutor.id} />
                            </div>
                        </div>
                    </div>

                    {/* Right: sticky sidebar */}
                    <div className="space-y-4">

                        {/* Contact card */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 lg:sticky lg:top-20">
                            {listing.hourlyRate > 0 && (
                                <div className="mb-4">
                                    <span className="text-2xl font-bold text-gray-900">₹{listing.hourlyRate.toLocaleString("en-IN")}</span>
                                    <span className="text-sm text-gray-400">/hr</span>
                                </div>
                            )}
                            <TutorProfileActions
                                tutor={{ id: tutor.id, name: tutor.name }}
                                subject={listing.subjects?.[0] || ""}
                                offersTrialClass={listing.offersTrialClass}
                                trialDuration={listing.trialDuration}
                                initialAction={initialAction}
                                compact
                            />
                            <p className="text-xs text-center text-gray-400 mt-3">No commission · Pay tutor directly</p>
                        </div>

                        {/* Details */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
                            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Quick Details</h3>
                            {listing.experience > 0 && (
                                <div className="flex items-center gap-2.5 text-sm text-gray-700">
                                    <Briefcase size={14} className="text-gray-400 shrink-0" />
                                    {listing.experience} years experience
                                </div>
                            )}
                            {listing.locations?.length > 0 && (
                                <div className="flex items-start gap-2.5 text-sm text-gray-700">
                                    <MapPin size={14} className="text-gray-400 shrink-0 mt-0.5" />
                                    {listing.locations.join(", ")}
                                </div>
                            )}
                            {listing.grades?.length > 0 && (
                                <div className="flex items-start gap-2.5 text-sm text-gray-700">
                                    <GraduationCap size={14} className="text-gray-400 shrink-0 mt-0.5" />
                                    {listing.grades.slice(0, 3).join(", ")}
                                    {listing.grades.length > 3 && ` +${listing.grades.length - 3} more`}
                                </div>
                            )}
                            {listing.languages?.length > 0 && (
                                <div className="flex items-center gap-2.5 text-sm text-gray-700">
                                    <Languages size={14} className="text-gray-400 shrink-0" />
                                    {listing.languages.join(", ")}
                                </div>
                            )}
                            {listing.type === "GROUP" && (
                                <div className="flex items-center gap-2.5 text-sm text-gray-700">
                                    <Users size={14} className="text-gray-400 shrink-0" />
                                    {listing.enrolledCount || 0} / {listing.maxSeats || "N/A"} seats
                                </div>
                            )}
                        </div>

                        {/* Trust note */}
                        <div className="rounded-2xl bg-blue-50 border border-blue-100 p-4 space-y-2">
                            {[
                                "Zero commission on tutor fees",
                                "Verified profiles",
                                "Direct contact with tutor",
                            ].map(t => (
                                <div key={t} className="flex items-center gap-2 text-xs text-blue-700">
                                    <BadgeCheck size={13} className="text-blue-500 shrink-0" />
                                    {t}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── Similar Tutors ── */}
                {similarTutors.length > 0 && (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <h2 className="text-sm font-semibold text-gray-900 mb-4">Similar Tutors</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {similarTutors.map(s => (
                                <Link key={s.id} href={`/search/${s.id}`}
                                    className="group flex flex-col items-center p-4 rounded-xl bg-gray-50 hover:bg-blue-50 hover:border-blue-100 border border-transparent transition-all text-center">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-white font-bold flex items-center justify-center mb-2 text-sm shrink-0 overflow-hidden">
                                        {s.tutor?.image
                                            ? <img src={s.tutor.image} alt={s.tutor.name} className="w-full h-full object-cover" />
                                            : (s.tutor?.name?.[0] || "T")}
                                    </div>
                                    <p className="text-xs font-semibold text-gray-900 truncate w-full">{s.tutor?.name}</p>
                                    {s.tutor?.isVerified && <p className="text-[10px] text-blue-500 font-medium">Verified</p>}
                                    <div className="flex flex-wrap justify-center gap-1 mt-1.5">
                                        {s.subjects?.slice(0, 2).map(sub => (
                                            <span key={sub} className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded font-medium group-hover:bg-white">{sub}</span>
                                        ))}
                                    </div>
                                    {s.hourlyRate > 0 && <p className="text-[11px] text-gray-500 mt-1">₹{s.hourlyRate}/hr</p>}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
