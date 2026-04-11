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
    ArrowLeft,
    MapPin,
    Briefcase,
    CheckCircle2,
    MessageCircle,
    Lock,
    BookOpen,
    Monitor,
    Home,
    Building2,
    GraduationCap,
    IndianRupee
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
    const subject = tutor.tutorListing?.subjects?.[0] || "All Subjects";
    const location = tutor.tutorListing?.locations?.[0] || "India";

    return {
        title: `${name} - ${subject} Tutor in ${location} | TuitionsInIndia`,
        description: `Book ${name} for ${subject} tuition in ${location}. Verified tutor with ${tutor.tutorListing?.experience || 0} years experience.`,
        openGraph: {
            title: `${name} - ${subject} Tutor`,
            description: `Verified tutor in ${location}. Book a session today.`,
            images: [tutor.image || "/logo.png"]
        }
    };
}

const modeLabels = {
    ONLINE: "Online",
    STUDENT_HOME: "At Student's Home",
    TUTOR_HOME: "At Tutor's Home",
    CENTRE: "At Centre",
    // Already human-readable forms
    "Online": "Online",
    "At Student's Home": "At Student's Home",
    "At Tutor's Home": "At Tutor's Home",
    "At Centre": "At Centre",
};

const modeIconMap = {
    ONLINE: Monitor,
    Online: Monitor,
    STUDENT_HOME: Home,
    "At Student's Home": Home,
    TUTOR_HOME: Home,
    "At Tutor's Home": Home,
    CENTRE: Building2,
    "At Centre": Building2,
};

const getModeLabel = (mode) => modeLabels[mode] || mode;
const getModeIcon = (mode) => modeIconMap[mode] || BookOpen;

export default async function TutorProfile({ params, searchParams }) {
    const id = params.id;
    const viewerId = searchParams.viewerId;

    const tutor = await prisma.user.findUnique({
        where: { id },
        select: {
            id: true,
            name: true,
            image: true,
            role: true,
            isVerified: true,
            isIdVerified: true,
            subscriptionTier: true,
            createdAt: true,
            tutorListing: true,
            reviewsReceived: {
                include: {
                    author: { select: { name: true, image: true } }
                },
                orderBy: { createdAt: 'desc' }
            }
        }
    });

    if (!tutor || (tutor.role !== "TUTOR" && tutor.role !== "INSTITUTE")) {
        notFound();
    }

    const listing = tutor.tutorListing || {
        bio: "", subjects: [], grades: [], locations: [],
        teachingModes: [], boards: [], experience: 0, hourlyRate: 0,
        rating: 0, reviewCount: 0, title: "", gender: ""
    };

    let viewer = null;
    if (viewerId) {
        viewer = await prisma.user.findUnique({
            where: { id: viewerId },
            select: { role: true, subscriptionTier: true }
        });
    }

    const canContact = viewer
        ? (viewer.role === 'ADMIN' || viewer.subscriptionTier !== 'FREE')
        : false;

    const memberSince = new Date(tutor.createdAt).getFullYear();
    const initials = (tutor.name || "T").split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-20">
            <main className="max-w-6xl mx-auto px-4 md:px-6">

                {/* Back */}
                <Link
                    href="/search?role=TUTOR"
                    className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-700 transition-colors mb-8"
                >
                    <ArrowLeft size={16} /> Back to search
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* ── Left / Main column ── */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Profile card */}
                        <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8">
                            <div className="flex flex-col sm:flex-row gap-6">

                                {/* Avatar */}
                                <div className="shrink-0">
                                    {tutor.image ? (
                                        <img
                                            src={tutor.image}
                                            alt={tutor.name}
                                            className="w-24 h-24 rounded-2xl object-cover border border-gray-100"
                                        />
                                    ) : (
                                        <div className="w-24 h-24 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 text-2xl font-bold">
                                            {initials}
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-wrap items-center gap-2 mb-1">
                                        <h1 className="text-2xl font-bold text-gray-900">{tutor.name || "Tutor"}</h1>
                                        {tutor.isVerified && (
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs font-medium border border-blue-100">
                                                <ShieldCheck size={12} /> Verified
                                            </span>
                                        )}
                                    </div>

                                    {listing.title && (
                                        <p className="text-gray-600 text-sm mb-3">{listing.title}</p>
                                    )}

                                    {/* Quick stats row */}
                                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                                        {listing.experience > 0 && (
                                            <span className="flex items-center gap-1.5">
                                                <Briefcase size={14} /> {listing.experience} yr{listing.experience !== 1 ? "s" : ""} experience
                                            </span>
                                        )}
                                        {listing.locations?.[0] && (
                                            <span className="flex items-center gap-1.5">
                                                <MapPin size={14} /> {listing.locations[0]}
                                            </span>
                                        )}
                                        {listing.rating > 0 && (
                                            <span className="flex items-center gap-1.5 text-amber-500 font-medium">
                                                <Star size={14} fill="currentColor" strokeWidth={0} />
                                                {listing.rating.toFixed(1)} ({listing.reviewCount} reviews)
                                            </span>
                                        )}
                                        <span className="flex items-center gap-1.5">
                                            <Clock size={14} /> Member since {memberSince}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Stats strip */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {[
                                { label: "Experience", value: listing.experience ? `${listing.experience} yrs` : "—", icon: Briefcase, color: "bg-blue-50 text-blue-600" },
                                { label: "Students taught", value: `${listing.reviewCount || 0}+`, icon: Users, color: "bg-green-50 text-green-600" },
                                { label: "Hourly rate", value: listing.hourlyRate ? `₹${listing.hourlyRate}` : "Contact", icon: IndianRupee, color: "bg-amber-50 text-amber-600" },
                                { label: "Rating", value: listing.rating > 0 ? listing.rating.toFixed(1) : "New", icon: Star, color: "bg-purple-50 text-purple-600" },
                            ].map((s, i) => (
                                <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
                                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${s.color}`}>
                                        <s.icon size={16} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400">{s.label}</p>
                                        <p className="font-semibold text-gray-900 text-sm">{s.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* About */}
                        {listing.bio && (
                            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                <h2 className="font-semibold text-gray-900 mb-3">About</h2>
                                <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{listing.bio}</p>
                            </div>
                        )}

                        {/* Subjects & Grades */}
                        {(listing.subjects?.length > 0 || listing.grades?.length > 0) && (
                            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                <h2 className="font-semibold text-gray-900 mb-4">Subjects & Classes</h2>
                                {listing.subjects?.length > 0 && (
                                    <div className="mb-4">
                                        <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">Subjects</p>
                                        <div className="flex flex-wrap gap-2">
                                            {listing.subjects.map(s => (
                                                <span key={s} className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium border border-blue-100">{s}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {listing.grades?.length > 0 && (
                                    <div className="mb-4">
                                        <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">Classes / Grades</p>
                                        <div className="flex flex-wrap gap-2">
                                            {listing.grades.map(g => (
                                                <span key={g} className="px-3 py-1.5 bg-gray-50 text-gray-700 rounded-lg text-sm font-medium border border-gray-200">{g}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {listing.boards?.length > 0 && (
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">Boards</p>
                                        <div className="flex flex-wrap gap-2">
                                            {listing.boards.map(b => (
                                                <span key={b} className="px-3 py-1.5 bg-gray-50 text-gray-700 rounded-lg text-sm font-medium border border-gray-200">{b}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Teaching modes & locations */}
                        {(listing.teachingModes?.length > 0 || listing.locations?.length > 0) && (
                            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                <h2 className="font-semibold text-gray-900 mb-4">How & Where</h2>
                                {listing.teachingModes?.length > 0 && (
                                    <div className="mb-4">
                                        <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">Teaching Mode</p>
                                        <div className="flex flex-wrap gap-2">
                                            {listing.teachingModes.map(m => {
                                                const Icon = getModeIcon(m);
                                                return (
                                                    <span key={m} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 text-gray-700 rounded-lg text-sm font-medium border border-gray-200">
                                                        <Icon size={13} /> {getModeLabel(m)}
                                                    </span>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                                {listing.locations?.length > 0 && (
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">Locations</p>
                                        <div className="flex flex-wrap gap-2">
                                            {listing.locations.map(l => (
                                                <span key={l} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 text-gray-700 rounded-lg text-sm font-medium border border-gray-200">
                                                    <MapPin size={13} /> {l}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Verifications */}
                        <div className="bg-white rounded-2xl border border-gray-200 p-6">
                            <h2 className="font-semibold text-gray-900 mb-4">Verifications</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {[
                                    { label: "Identity verified", done: tutor.isIdVerified, icon: ShieldCheck },
                                    { label: "Profile approved", done: tutor.isVerified, icon: CheckCircle2 },
                                    { label: "Phone number verified", done: true, icon: CheckCircle2 },
                                    { label: "Member since " + memberSince, done: true, icon: Clock },
                                ].map((v, i) => (
                                    <div key={i} className="flex items-center gap-3 text-sm">
                                        <v.icon size={16} className={v.done ? "text-green-500" : "text-gray-300"} />
                                        <span className={v.done ? "text-gray-700" : "text-gray-400"}>{v.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Reviews */}
                        <div className="bg-white rounded-2xl border border-gray-200 p-6" id="reviews">
                            <h2 className="font-semibold text-gray-900 mb-4">
                                Reviews {listing.reviewCount > 0 && <span className="text-gray-400 font-normal text-sm">({listing.reviewCount})</span>}
                            </h2>

                            {tutor.reviewsReceived?.length > 0 ? (
                                <div className="space-y-5">
                                    {tutor.reviewsReceived.map(review => (
                                        <div key={review.id} className="border-b border-gray-100 last:border-0 pb-5 last:pb-0">
                                            <div className="flex items-start gap-3">
                                                <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-semibold text-sm shrink-0">
                                                    {(review.author?.name || "S")[0].toUpperCase()}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="font-medium text-sm text-gray-900">{review.author?.name || "Student"}</span>
                                                        <span className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}</span>
                                                    </div>
                                                    <div className="flex items-center gap-0.5 mb-2">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star key={i} size={12} fill={i < review.rating ? "#f59e0b" : "none"} stroke={i < review.rating ? "none" : "#d1d5db"} />
                                                        ))}
                                                    </div>
                                                    {review.comment && (
                                                        <p className="text-sm text-gray-600 leading-relaxed">{review.comment}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-10">
                                    <MessageCircle size={32} className="text-gray-200 mx-auto mb-3" />
                                    <p className="text-sm text-gray-400">No reviews yet</p>
                                </div>
                            )}
                        </div>

                    </div>

                    {/* ── Right / Sidebar ── */}
                    <aside className="lg:col-span-1">
                        <div className="sticky top-28 space-y-4">

                            {/* Contact card */}
                            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                                <div className="flex items-baseline justify-between mb-4">
                                    <div>
                                        {listing.hourlyRate ? (
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-2xl font-bold text-gray-900">₹{listing.hourlyRate}</span>
                                                <span className="text-sm text-gray-400">/ hour</span>
                                            </div>
                                        ) : (
                                            <span className="text-gray-500 text-sm">Rate on request</span>
                                        )}
                                    </div>
                                    {listing.rating > 0 && (
                                        <span className="flex items-center gap-1 text-sm text-amber-500 font-medium">
                                            <Star size={14} fill="currentColor" strokeWidth={0} />
                                            {listing.rating.toFixed(1)}
                                        </span>
                                    )}
                                </div>

                                <Link
                                    href={`/register/student?tutorId=${id}&subject=${listing.subjects?.[0] || ""}&intent=unlock`}
                                    className="block w-full bg-blue-600 text-white text-center py-3 rounded-xl font-semibold text-sm hover:bg-blue-700 transition-colors mb-3"
                                >
                                    Contact Tutor
                                </Link>

                                {canContact ? (
                                    <ChatInitiator
                                        studentId={viewerId}
                                        tutorId={id}
                                        recipientRole="TUTOR"
                                        label="Send Message"
                                    />
                                ) : viewerId ? (
                                    <ChatInitiator
                                        studentId={viewerId}
                                        tutorId={id}
                                        recipientRole="TUTOR"
                                        label="Send Message"
                                    />
                                ) : (
                                    <Link
                                        href={`/login?next=/tutor/${id}`}
                                        className="block w-full border border-gray-200 text-gray-700 text-center py-3 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
                                    >
                                        Log in to message
                                    </Link>
                                )}

                                <p className="text-xs text-gray-400 text-center mt-3">Free to contact · No charges until you hire</p>
                            </div>

                            {/* Quick info */}
                            <div className="bg-white rounded-2xl border border-gray-200 p-5">
                                <h3 className="text-sm font-semibold text-gray-900 mb-3">Quick Info</h3>
                                <ul className="space-y-2.5 text-sm">
                                    {listing.gender && (
                                        <li className="flex justify-between">
                                            <span className="text-gray-400">Gender</span>
                                            <span className="text-gray-700 font-medium">{listing.gender}</span>
                                        </li>
                                    )}
                                    {listing.experience > 0 && (
                                        <li className="flex justify-between">
                                            <span className="text-gray-400">Experience</span>
                                            <span className="text-gray-700 font-medium">{listing.experience} years</span>
                                        </li>
                                    )}
                                    {listing.teachingModes?.length > 0 && (
                                        <li className="flex justify-between">
                                            <span className="text-gray-400">Mode</span>
                                            <span className="text-gray-700 font-medium text-right">{listing.teachingModes.slice(0, 2).map(getModeLabel).join(", ")}</span>
                                        </li>
                                    )}
                                    {listing.locations?.length > 0 && (
                                        <li className="flex justify-between">
                                            <span className="text-gray-400">Location</span>
                                            <span className="text-gray-700 font-medium">{listing.locations[0]}</span>
                                        </li>
                                    )}
                                </ul>
                            </div>

                            {/* Trust badge */}
                            <div className="bg-green-50 rounded-2xl border border-green-100 p-4 flex items-start gap-3">
                                <ShieldCheck size={18} className="text-green-600 shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-green-800">Safe to contact</p>
                                    <p className="text-xs text-green-600 mt-0.5">All tutors are verified before listing on TuitionsInIndia.</p>
                                </div>
                            </div>

                        </div>
                    </aside>
                </div>
            </main>

            {/* JSON-LD */}
            <script type="application/ld+json" dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "Person",
                    "name": tutor.name,
                    "description": listing.bio,
                    "jobTitle": `${listing.subjects?.[0] || "Academic"} Tutor`,
                    "url": `https://tuitionsinindia.com/tutor/${tutor.id}`,
                    "image": tutor.image || "https://tuitionsinindia.com/logo.png",
                    ...(listing.rating > 0 && {
                        "aggregateRating": {
                            "@type": "AggregateRating",
                            "ratingValue": listing.rating,
                            "reviewCount": listing.reviewCount
                        }
                    })
                })
            }} />
        </div>
    );
}
