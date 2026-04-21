import prisma from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
    MapPin, BookOpen, Star, BadgeCheck, ArrowLeft,
    Globe, Building2, Users, Calendar, Mail, Phone,
    ChevronRight
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

function parseWebsite(bio) {
    const match = bio?.match(/Website:\s*(https?:\/\/[^\s\n]+)/);
    return match ? match[1] : null;
}

function parseFoundingYear(bio) {
    const match = bio?.match(/Established:\s*(\d{4})/);
    return match ? match[1] : null;
}

function cleanBio(bio) {
    return (bio || "")
        .replace(/\n+Website:\s*https?:\/\/[^\s\n]+/, "")
        .replace(/\n+Established:\s*\d{4}/, "")
        .trim();
}

function InitialsAvatar({ name }) {
    const initials = (name || "?").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
    const colours = ["from-blue-500 to-blue-700", "from-violet-500 to-purple-700", "from-emerald-500 to-teal-700", "from-rose-500 to-pink-700"];
    const idx = (name || "").charCodeAt(0) % colours.length;
    return (
        <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${colours[idx]} text-white text-2xl font-bold flex items-center justify-center shrink-0 shadow-lg`}>
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
                    id: true,
                    name: true,
                    image: true,
                    email: true,
                    isVerified: true,
                    createdAt: true,
                    courses: {
                        orderBy: { createdAt: "desc" },
                        take: 10,
                        select: {
                            id: true,
                            title: true,
                            description: true,
                            duration: true,
                            price: true,
                        },
                    },
                },
            },
        },
    });

    if (!listing) notFound();

    const institute = listing.tutor;
    const website = parseWebsite(listing.bio);
    const foundingYear = parseFoundingYear(listing.bio);
    const bio = cleanBio(listing.bio);
    const yearsActive = foundingYear ? new Date().getFullYear() - parseInt(foundingYear) : null;

    // Increment view count async
    prisma.listing.update({ where: { id: listing.id }, data: { viewCount: { increment: 1 } } }).catch(() => {});

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
                    <Link href="/institutes" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 transition-colors">
                        <ArrowLeft size={15} /> Institutes
                    </Link>
                    <ChevronRight size={14} className="text-gray-300" />
                    <span className="text-sm text-gray-800 font-medium truncate">{listing.title}</span>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">

                {/* Hero card */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <div className="flex gap-5 items-start">
                        {institute?.image
                            ? <img src={institute.image} alt={listing.title} className="w-20 h-20 rounded-2xl object-cover shadow-md" />
                            : <InitialsAvatar name={listing.title} />
                        }
                        <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                                <h1 className="text-xl md:text-2xl font-bold text-gray-900">{listing.title}</h1>
                                {institute?.isVerified && (
                                    <span className="flex items-center gap-1 text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                                        <BadgeCheck size={12} /> Verified
                                    </span>
                                )}
                            </div>
                            <div className="flex flex-wrap gap-3 text-sm text-gray-500 mt-2">
                                {listing.locations?.length > 0 && (
                                    <span className="flex items-center gap-1.5">
                                        <MapPin size={13} className="text-gray-400" />
                                        {listing.locations.join(", ")}
                                    </span>
                                )}
                                {foundingYear && (
                                    <span className="flex items-center gap-1.5">
                                        <Calendar size={13} className="text-gray-400" />
                                        Est. {foundingYear}{yearsActive ? ` · ${yearsActive} years` : ""}
                                    </span>
                                )}
                                {website && (
                                    <a href={website} target="_blank" rel="noopener noreferrer"
                                        className="flex items-center gap-1.5 text-blue-600 hover:underline">
                                        <Globe size={13} /> Website
                                    </a>
                                )}
                            </div>

                            {listing.rating > 0 && (
                                <div className="flex items-center gap-1.5 mt-3">
                                    <div className="flex">
                                        {[1,2,3,4,5].map(i => (
                                            <Star key={i} size={14}
                                                className={i <= Math.round(listing.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-200 fill-gray-200"}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-sm font-medium text-gray-700">{listing.rating.toFixed(1)}</span>
                                    <span className="text-sm text-gray-400">({listing.reviewCount} reviews)</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* CTA row */}
                    {institute?.email && (
                        <div className="mt-5 pt-5 border-t border-gray-100 flex flex-wrap gap-3">
                            <a href={`mailto:${institute.email}`}
                                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors">
                                <Mail size={15} /> Contact Institute
                            </a>
                            {website && (
                                <a href={website} target="_blank" rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors">
                                    <Globe size={15} /> Visit Website
                                </a>
                            )}
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Main content */}
                    <div className="md:col-span-2 space-y-5">

                        {/* About */}
                        {bio && (
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                                <h2 className="font-semibold text-gray-900 mb-3">About</h2>
                                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{bio}</p>
                            </div>
                        )}

                        {/* Courses */}
                        {institute?.courses?.length > 0 && (
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                                <h2 className="font-semibold text-gray-900 mb-4">Courses Offered</h2>
                                <div className="space-y-3">
                                    {institute.courses.map(course => (
                                        <div key={course.id} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50">
                                            <BookOpen size={16} className="text-blue-600 mt-0.5 shrink-0" />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-800">{course.title}</p>
                                                {course.description && (
                                                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{course.description}</p>
                                                )}
                                            </div>
                                            <div className="text-right shrink-0">
                                                {course.price && <p className="text-sm font-semibold text-gray-800">₹{course.price.toLocaleString()}</p>}
                                                {course.duration && <p className="text-xs text-gray-400">{course.duration}</p>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-5">

                        {/* Subjects */}
                        {listing.subjects?.length > 0 && (
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                                <h2 className="font-semibold text-gray-900 mb-3 text-sm">Subjects</h2>
                                <div className="flex flex-wrap gap-2">
                                    {listing.subjects.map(s => (
                                        <span key={s} className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full font-medium">{s}</span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Locations */}
                        {listing.locations?.length > 0 && (
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                                <h2 className="font-semibold text-gray-900 mb-3 text-sm">Locations</h2>
                                <div className="space-y-2">
                                    {listing.locations.map(loc => (
                                        <div key={loc} className="flex items-center gap-2 text-sm text-gray-600">
                                            <MapPin size={13} className="text-gray-400" /> {loc}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Quick stats */}
                        <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
                            <h2 className="font-semibold text-gray-900 mb-3 text-sm">Quick Info</h2>
                            <div className="space-y-2.5 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                    <Building2 size={13} className="text-blue-500" />
                                    <span>Coaching Centre</span>
                                </div>
                                {listing.locations?.length > 1 && (
                                    <div className="flex items-center gap-2">
                                        <MapPin size={13} className="text-blue-500" />
                                        <span>{listing.locations.length} locations</span>
                                    </div>
                                )}
                                {institute?.courses?.length > 0 && (
                                    <div className="flex items-center gap-2">
                                        <BookOpen size={13} className="text-blue-500" />
                                        <span>{institute.courses.length} courses</span>
                                    </div>
                                )}
                                {foundingYear && (
                                    <div className="flex items-center gap-2">
                                        <Calendar size={13} className="text-blue-500" />
                                        <span>Since {foundingYear}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
