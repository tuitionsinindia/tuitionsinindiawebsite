import prisma from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
    MapPin, BookOpen, Star, BadgeCheck, ArrowLeft,
    Globe, Building2, Calendar, Mail, ChevronRight,
    Clock, Users, IndianRupee, Sparkles, Phone
} from "lucide-react";

export async function generateMetadata({ params }) {
    const { id } = await params;
    const listing = await prisma.listing.findFirst({
        where: { OR: [{ id }, { tutorId: id }], isInstitute: true },
        include: { tutor: { select: { name: true, image: true } } },
    });
    if (!listing) return { title: "Institute Not Found | TuitionsInIndia" };

    const name = listing.title;
    const subjects = listing.subjects?.join(", ") || "Coaching";
    const location = listing.locations?.[0] || "India";
    const bio = listing.bio?.slice(0, 155) || `${name} — coaching institute in ${location} offering ${subjects}.`;

    return {
        title: `${name} — Coaching Centre in ${location} | TuitionsInIndia`,
        description: bio,
        keywords: [...(listing.subjects || []), ...(listing.locations || []), "coaching centre", "institute", "TuitionsInIndia"].join(", "),
        alternates: { canonical: `https://tuitionsinindia.com/institute/${id}` },
        openGraph: {
            title: `${name} | TuitionsInIndia`,
            description: bio,
            url: `https://tuitionsinindia.com/institute/${id}`,
            type: "profile",
            images: listing.tutor?.image ? [{ url: listing.tutor.image }] : [],
        },
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
                <div className="h-full bg-amber-400 rounded-full" style={{ width: `${pct}%` }} />
            </div>
            <span className="w-5 text-gray-400 shrink-0">{count}</span>
        </div>
    );
}

function parseWebsite(bio) {
    const m = bio?.match(/Website:\s*(https?:\/\/[^\s\n]+)/);
    return m ? m[1] : null;
}

function parseFoundingYear(bio) {
    const m = bio?.match(/Established:\s*(\d{4})/);
    return m ? parseInt(m[1]) : null;
}

function cleanBio(bio) {
    return (bio || "")
        .replace(/\n+Website:\s*https?:\/\/[^\s\n]+/, "")
        .replace(/\n+Established:\s*\d{4}/, "")
        .trim();
}

function InitialsLogo({ name, image, size = "lg" }) {
    const initials = (name || "?").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
    const colours = ["from-blue-600 to-indigo-700", "from-violet-600 to-purple-700", "from-emerald-600 to-teal-700", "from-rose-500 to-pink-700"];
    const idx = (name || "").charCodeAt(0) % colours.length;
    const dim = size === "lg" ? "w-20 h-20 text-2xl" : "w-12 h-12 text-base";
    if (image) return <img src={image} alt={name} className={`${dim} rounded-2xl object-cover border-4 border-white shadow-lg`} />;
    return (
        <div className={`${dim} rounded-2xl bg-gradient-to-br ${colours[idx]} text-white font-bold flex items-center justify-center border-4 border-white shadow-lg shrink-0`}>
            {initials}
        </div>
    );
}

export default async function InstituteProfilePage({ params }) {
    const { id } = await params;

    const listing = await prisma.listing.findFirst({
        where: { OR: [{ id }, { tutorId: id }], isInstitute: true },
        include: {
            tutor: {
                select: {
                    id: true, name: true, image: true, email: true, phone: true,
                    isVerified: true, createdAt: true,
                    courses: {
                        where: { isActive: true },
                        orderBy: { createdAt: "desc" },
                        take: 12,
                        select: { id: true, title: true, description: true, duration: true, price: true, category: true, maxSeats: true, enrolledCount: true },
                    },
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

    const institute = listing.tutor;
    const website = parseWebsite(listing.bio);
    const foundingYear = parseFoundingYear(listing.bio) || (listing.experience ? new Date().getFullYear() - listing.experience : null);
    const bio = cleanBio(listing.bio);
    const yearsActive = foundingYear ? new Date().getFullYear() - foundingYear : null;

    const reviews = institute.reviewsReceived || [];
    const dist = [5, 4, 3, 2, 1].map(star => ({ star, count: reviews.filter(r => r.rating === star).length }));

    // Increment view count
    prisma.listing.update({ where: { id: listing.id }, data: { viewCount: { increment: 1 } } }).catch(() => {});

    // JSON-LD
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "EducationalOrganization",
        name: listing.title,
        description: bio || listing.bio || "",
        url: `https://tuitionsinindia.com/institute/${id}`,
        ...(institute.image && { image: institute.image }),
        ...(listing.locations?.[0] && { address: { "@type": "PostalAddress", addressLocality: listing.locations[0], addressCountry: "IN" } }),
        ...(listing.rating > 0 && { aggregateRating: { "@type": "AggregateRating", ratingValue: listing.rating.toFixed(1), reviewCount: listing.reviewCount || 1, bestRating: 5, worstRating: 1 } }),
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

            {/* Sticky breadcrumb */}
            <div className="sticky top-0 z-20 bg-white/95 backdrop-blur border-b border-gray-100">
                <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-2 text-sm text-gray-500">
                    <Link href="/institutes" className="flex items-center gap-1.5 hover:text-blue-600 transition-colors">
                        <ArrowLeft size={15} /> Institutes
                    </Link>
                    <ChevronRight size={13} className="text-gray-300" />
                    <span className="text-gray-800 font-medium truncate max-w-48 md:max-w-sm">{listing.title}</span>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 py-6 space-y-5">

                {/* ── Hero Card ── */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    {/* Banner */}
                    <div className="h-28 bg-gradient-to-r from-violet-600 via-blue-600 to-blue-500 relative">
                        {listing.isFeatured && (
                            <span className="absolute top-3 right-3 flex items-center gap-1 text-xs font-semibold bg-amber-400 text-amber-900 px-2.5 py-1 rounded-full">
                                <Sparkles size={11} /> Featured
                            </span>
                        )}
                    </div>

                    <div className="px-6 pb-6">
                        <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-10 mb-5">
                            <InitialsLogo name={listing.title} image={institute.image} />
                            <div className="flex-1 sm:pb-1">
                                <div className="flex flex-wrap items-center gap-2 mb-0.5">
                                    <h1 className="text-xl font-bold text-gray-900">{listing.title}</h1>
                                    {institute.isVerified && (
                                        <span className="flex items-center gap-1 text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium border border-blue-100">
                                            <BadgeCheck size={11} /> Verified
                                        </span>
                                    )}
                                    {listing.offersTrialClass && (
                                        <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-medium border border-emerald-100">
                                            Free Demo Class
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-gray-500">{listing.title}</p>
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
                            {foundingYear && (
                                <span className="flex items-center gap-1.5">
                                    <Calendar size={13} className="text-gray-400" />
                                    Est. {foundingYear}{yearsActive ? ` · ${yearsActive} yrs` : ""}
                                </span>
                            )}
                            {listing.locations?.length > 0 && (
                                <span className="flex items-center gap-1.5">
                                    <MapPin size={13} className="text-gray-400" />
                                    {listing.locations.slice(0, 2).join(", ")}
                                    {listing.locations.length > 2 && ` +${listing.locations.length - 2}`}
                                </span>
                            )}
                            {institute.courses?.length > 0 && (
                                <span className="flex items-center gap-1.5">
                                    <BookOpen size={13} className="text-gray-400" />
                                    {institute.courses.length} courses
                                </span>
                            )}
                        </div>

                        {/* CTAs */}
                        <div className="flex flex-wrap gap-3">
                            {institute.email && (
                                <a href={`mailto:${institute.email}`}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors">
                                    <Mail size={15} /> Contact Institute
                                </a>
                            )}
                            {website && (
                                <a href={website} target="_blank" rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors">
                                    <Globe size={15} /> Visit Website
                                </a>
                            )}
                        </div>
                    </div>
                </div>

                {/* ── Main grid ── */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

                    {/* Left: main content */}
                    <div className="lg:col-span-2 space-y-5">

                        {/* About */}
                        {bio && (
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                                <h2 className="text-sm font-semibold text-gray-900 mb-3">About</h2>
                                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{bio}</p>
                            </div>
                        )}

                        {/* Courses */}
                        {institute.courses?.length > 0 && (
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                                <h2 className="text-sm font-semibold text-gray-900 mb-4">Courses Offered</h2>
                                <div className="space-y-3">
                                    {institute.courses.map(course => (
                                        <div key={course.id} className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-blue-100 transition-colors">
                                            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                                                <BookOpen size={14} className="text-blue-600" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-gray-800">{course.title}</p>
                                                {course.description && (
                                                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-2 leading-relaxed">{course.description}</p>
                                                )}
                                                <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-400">
                                                    {course.duration && (
                                                        <span className="flex items-center gap-1"><Clock size={10} /> {course.duration}</span>
                                                    )}
                                                    {course.maxSeats && (
                                                        <span className="flex items-center gap-1"><Users size={10} /> {course.enrolledCount || 0}/{course.maxSeats} seats</span>
                                                    )}
                                                </div>
                                            </div>
                                            {course.price > 0 && (
                                                <div className="text-right shrink-0">
                                                    <p className="text-sm font-bold text-gray-900">₹{course.price.toLocaleString("en-IN")}</p>
                                                    <p className="text-xs text-gray-400">total</p>
                                                </div>
                                            )}
                                        </div>
                                    ))}
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
                                    <div className="flex flex-col items-center justify-center shrink-0">
                                        <span className="text-5xl font-bold text-gray-900">{listing.rating.toFixed(1)}</span>
                                        <StarRow rating={listing.rating} size={13} />
                                        <span className="text-xs text-gray-400 mt-1">{listing.reviewCount} reviews</span>
                                    </div>
                                    <div className="flex-1 space-y-1.5 justify-center flex flex-col">
                                        {dist.map(({ star, count }) => (
                                            <RatingBar key={star} label={star} count={count} total={listing.reviewCount} />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {reviews.length > 0 ? (
                                <div className="space-y-5">
                                    {reviews.map(r => (
                                        <div key={r.id} className="flex gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-violet-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
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
                                <p className="text-sm text-gray-400">No reviews yet.</p>
                            )}
                        </div>
                    </div>

                    {/* Right sidebar */}
                    <div className="space-y-4">

                        {/* Contact card */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 lg:sticky lg:top-20 space-y-3">
                            <h3 className="text-sm font-semibold text-gray-900">Contact</h3>
                            {institute.email && (
                                <a href={`mailto:${institute.email}`}
                                    className="flex items-center gap-2.5 text-sm text-gray-700 hover:text-blue-600 transition-colors">
                                    <Mail size={14} className="text-gray-400" /> {institute.email}
                                </a>
                            )}
                            {website && (
                                <a href={website} target="_blank" rel="noopener noreferrer"
                                    className="flex items-center gap-2.5 text-sm text-blue-600 hover:underline">
                                    <Globe size={14} /> Visit Website
                                </a>
                            )}
                            {institute.email && (
                                <a href={`mailto:${institute.email}`}
                                    className="mt-2 w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors">
                                    <Mail size={14} /> Send Enquiry
                                </a>
                            )}
                            <p className="text-xs text-center text-gray-400">Free to enquire · No commission</p>
                        </div>

                        {/* Subjects */}
                        {listing.subjects?.length > 0 && (
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Subjects</h3>
                                <div className="flex flex-wrap gap-1.5">
                                    {listing.subjects.map(s => (
                                        <span key={s} className="text-xs bg-violet-50 text-violet-700 px-2.5 py-1 rounded-full font-medium">{s}</span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Quick info */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
                            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Quick Info</h3>
                            <div className="flex items-center gap-2.5 text-sm text-gray-700">
                                <Building2 size={14} className="text-gray-400" /> Coaching Centre
                            </div>
                            {foundingYear && (
                                <div className="flex items-center gap-2.5 text-sm text-gray-700">
                                    <Calendar size={14} className="text-gray-400" /> Est. {foundingYear}
                                </div>
                            )}
                            {listing.locations?.length > 0 && (
                                <div className="flex items-start gap-2.5 text-sm text-gray-700">
                                    <MapPin size={14} className="text-gray-400 shrink-0 mt-0.5" />
                                    {listing.locations.join(", ")}
                                </div>
                            )}
                            {institute.courses?.length > 0 && (
                                <div className="flex items-center gap-2.5 text-sm text-gray-700">
                                    <BookOpen size={14} className="text-gray-400" /> {institute.courses.length} courses
                                </div>
                            )}
                            {listing.hourlyRate > 0 && (
                                <div className="flex items-center gap-2.5 text-sm text-gray-700">
                                    <IndianRupee size={14} className="text-gray-400" /> From ₹{listing.hourlyRate.toLocaleString("en-IN")}/hr
                                </div>
                            )}
                        </div>

                        {/* Trust */}
                        <div className="rounded-2xl bg-blue-50 border border-blue-100 p-4 space-y-2">
                            {["Verified institute", "Direct contact", "Zero platform commission"].map(t => (
                                <div key={t} className="flex items-center gap-2 text-xs text-blue-700">
                                    <BadgeCheck size={13} className="text-blue-500 shrink-0" />
                                    {t}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
