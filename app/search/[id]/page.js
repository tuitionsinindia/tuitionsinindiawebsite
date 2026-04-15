import prisma from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
    MapPin, Clock, Star, BadgeCheck, GraduationCap, BookOpen,
    ArrowLeft, Briefcase, Languages, Users
} from "lucide-react";
import { WhatsAppShareButton, ShareButton } from "@/app/components/ShareButtons";
import TrackProfileView from "@/app/components/TrackProfileView";
import TutorProfileActions from "@/app/components/TutorProfileActions";

export async function generateMetadata({ params }) {
    const { id } = await params;
    const listing = await prisma.listing.findFirst({
        where: { OR: [{ id }, { tutorId: id }] },
        include: { tutor: { select: { name: true } } },
    });
    if (!listing) return { title: "Tutor Not Found" };
    const title = `${listing.tutor.name} — ${listing.subjects?.[0] || "Tutor"} | TuitionsInIndia`;
    const description = listing.bio?.slice(0, 160) || `${listing.tutor.name} teaches ${listing.subjects?.join(", ")} on TuitionsInIndia.`;
    return {
        title,
        description,
        openGraph: { title, description, type: "profile" },
        twitter: { card: "summary", title, description },
    };
}

export default async function TutorProfilePage({ params }) {
    const { id } = await params;

    const listing = await prisma.listing.findFirst({
        where: { OR: [{ id }, { tutorId: id }], isActive: true },
        include: {
            tutor: {
                select: {
                    id: true, name: true, image: true, role: true,
                    isVerified: true, subscriptionTier: true,
                    reviewsReceived: {
                        select: { rating: true, comment: true, createdAt: true,
                            author: { select: { name: true } }
                        },
                        orderBy: { createdAt: "desc" },
                        take: 10,
                    },
                },
            },
        },
    });

    // Fetch similar tutors includes offersTrialClass implicitly via listing

    if (!listing) notFound();

    const trackSubject = listing.subjects?.[0] || "Unknown";
    const tutor = listing.tutor;
    const isPremium = ["PRO", "ELITE"].includes(tutor.subscriptionTier);

    // Fetch similar tutors (same subjects, different tutor)
    let similarTutors = [];
    try {
        const similar = await prisma.listing.findMany({
            where: {
                isActive: true,
                subjects: { hasSome: listing.subjects || [] },
                tutorId: { not: tutor.id },
            },
            include: { tutor: { select: { id: true, name: true, isVerified: true } } },
            take: 4,
            orderBy: { rating: "desc" },
        });
        similarTutors = similar;
    } catch {}

    return (
        <div className="min-h-screen bg-gray-50">
            <TrackProfileView tutorId={listing.id} subject={trackSubject} />
            {/* Header */}
            <div className="bg-white border-b border-gray-100">
                <div className="max-w-4xl mx-auto px-6 py-4">
                    <Link href="/search" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 transition-colors">
                        <ArrowLeft size={16} /> Back to Search
                    </Link>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
                {/* Profile Card */}
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                    <div className="h-24 bg-gradient-to-r from-blue-600 to-indigo-600" />
                    <div className="px-8 pb-8">
                        <div className="flex flex-col sm:flex-row items-start gap-5 -mt-10">
                            <div className="w-20 h-20 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-3xl border-4 border-white shadow-lg shrink-0">
                                {tutor.image ? <img src={tutor.image} alt={tutor.name} className="w-full h-full rounded-xl object-cover" /> : tutor.name?.[0]}
                            </div>
                            <div className="flex-1 pt-2">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <h1 className="text-2xl font-bold text-gray-900">{tutor.name}</h1>
                                    {tutor.isVerified && <BadgeCheck size={20} className="text-blue-500" />}
                                    {isPremium && (
                                        <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full">
                                            {tutor.subscriptionTier}
                                        </span>
                                    )}
                                    {listing.offersTrialClass && (
                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-100">
                                            <Clock size={10} /> Free {listing.trialDuration}-min Trial
                                        </span>
                                    )}
                                </div>
                                <p className="text-gray-500 text-sm mt-1">{listing.title}</p>
                            </div>
                            <div className="flex flex-wrap gap-2 shrink-0">
                                <TutorProfileActions
                                    tutor={{ id: tutor.id, name: tutor.name }}
                                    subject={listing.subjects?.[0] || ""}
                                    offersTrialClass={listing.offersTrialClass}
                                    trialDuration={listing.trialDuration}
                                />
                                <WhatsAppShareButton
                                    text={`Check out ${tutor.name} on TuitionsInIndia — ${listing.subjects?.join(", ")} tutor`}
                                    url={`https://tuitionsinindia.com/search/${tutor.id}`}
                                />
                                <ShareButton
                                    title={`${tutor.name} — ${listing.subjects?.[0]} Tutor`}
                                    url={`https://tuitionsinindia.com/search/${tutor.id}`}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* About */}
                        {listing.bio && (
                            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                <h2 className="text-base font-semibold text-gray-900 mb-3">About</h2>
                                <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{listing.bio}</p>
                            </div>
                        )}

                        {/* Subjects */}
                        <div className="bg-white rounded-2xl border border-gray-200 p-6">
                            <h2 className="text-base font-semibold text-gray-900 mb-3">Subjects</h2>
                            <div className="flex flex-wrap gap-2">
                                {listing.subjects?.map(s => (
                                    <Link key={s} href={`/tutors/${s.toLowerCase()}`} className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors">
                                        {s}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Reviews */}
                        <div className="bg-white rounded-2xl border border-gray-200 p-6">
                            <h2 className="text-base font-semibold text-gray-900 mb-4">Reviews</h2>
                            {tutor.reviewsReceived?.length > 0 ? (
                                <div className="space-y-4">
                                    {tutor.reviewsReceived.map((r, i) => (
                                        <div key={i} className="pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <p className="text-sm font-medium text-gray-900">{r.author?.name || "Student"}</p>
                                                <div className="flex gap-0.5">
                                                    {[...Array(5)].map((_, j) => (
                                                        <Star key={j} size={12} className={j < r.rating ? "text-amber-400 fill-amber-400" : "text-gray-200"} />
                                                    ))}
                                                </div>
                                            </div>
                                            {r.comment && <p className="text-sm text-gray-600">{r.comment}</p>}
                                            <p className="text-xs text-gray-400 mt-1">{new Date(r.createdAt).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-400">No reviews yet.</p>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-4">
                        {/* Stats */}
                        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
                            {listing.rating > 0 && (
                                <div className="flex items-center gap-3">
                                    <Star size={16} className="text-amber-400 fill-amber-400" />
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">{listing.rating.toFixed(1)} Rating</p>
                                        <p className="text-xs text-gray-400">{listing.reviewCount} reviews</p>
                                    </div>
                                </div>
                            )}
                            {listing.experience > 0 && (
                                <div className="flex items-center gap-3">
                                    <Briefcase size={16} className="text-gray-400" />
                                    <p className="text-sm text-gray-700">{listing.experience} years experience</p>
                                </div>
                            )}
                            {listing.hourlyRate > 0 && (
                                <div className="flex items-center gap-3">
                                    <Clock size={16} className="text-gray-400" />
                                    <p className="text-sm text-gray-700">₹{listing.hourlyRate.toLocaleString("en-IN")}/hr</p>
                                </div>
                            )}
                            {listing.locations?.length > 0 && (
                                <div className="flex items-center gap-3">
                                    <MapPin size={16} className="text-gray-400" />
                                    <p className="text-sm text-gray-700">{listing.locations.join(", ")}</p>
                                </div>
                            )}
                            {listing.grades?.length > 0 && (
                                <div className="flex items-center gap-3">
                                    <GraduationCap size={16} className="text-gray-400" />
                                    <p className="text-sm text-gray-700">{listing.grades.join(", ")}</p>
                                </div>
                            )}
                            {listing.boards?.length > 0 && (
                                <div className="flex items-center gap-3">
                                    <BookOpen size={16} className="text-gray-400" />
                                    <p className="text-sm text-gray-700">{listing.boards.join(", ")}</p>
                                </div>
                            )}
                            {listing.languages?.length > 0 && (
                                <div className="flex items-center gap-3">
                                    <Languages size={16} className="text-gray-400" />
                                    <p className="text-sm text-gray-700">{listing.languages.join(", ")}</p>
                                </div>
                            )}
                        </div>

                        {/* Teaching Modes */}
                        {listing.teachingModes?.length > 0 && (
                            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                <h3 className="text-sm font-semibold text-gray-900 mb-3">Teaching Modes</h3>
                                <div className="flex flex-wrap gap-2">
                                    {listing.teachingModes.map(m => (
                                        <span key={m} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-medium">
                                            {m.replace(/_/g, " ")}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Availability / Timings */}
                        {listing.timings?.length > 0 && (
                            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                <h3 className="text-sm font-semibold text-gray-900 mb-3">Availability</h3>
                                <div className="flex flex-wrap gap-2">
                                    {listing.timings.map(t => (
                                        <span key={t} className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-medium">
                                            {t}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Expertise Level */}
                        {listing.expertiseLevel && (
                            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                <h3 className="text-sm font-semibold text-gray-900 mb-2">Expertise Level</h3>
                                <span className="px-3 py-1.5 bg-violet-50 text-violet-700 rounded-lg text-sm font-medium">
                                    {listing.expertiseLevel === "PRIMARY" ? "Primary (Class 1-5)" :
                                     listing.expertiseLevel === "SECONDARY" ? "Secondary (Class 6-10)" :
                                     listing.expertiseLevel === "SENIOR" ? "Senior Secondary (Class 11-12)" :
                                     listing.expertiseLevel === "COMPETITIVE" ? "Competitive Exams" :
                                     listing.expertiseLevel}
                                </span>
                            </div>
                        )}

                        {/* Group Class Info */}
                        {listing.type === "GROUP" && (
                            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                <h3 className="text-sm font-semibold text-gray-900 mb-2">Group Classes</h3>
                                <div className="flex items-center gap-3">
                                    <Users size={16} className="text-blue-500" />
                                    <p className="text-sm text-gray-700">
                                        {listing.enrolledCount || 0} / {listing.maxSeats || "N/A"} seats filled
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* CTA */}
                        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 space-y-3">
                            <p className="text-sm font-semibold text-blue-900">Interested in this tutor?</p>
                            <Link
                                href={`/register/student?intent=unlock&tutorId=${tutor.id}&subject=${listing.subjects?.[0] || ""}`}
                                className="block w-full py-2.5 text-center bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors"
                            >
                                Contact Tutor
                            </Link>
                            {listing.offersTrialClass && (
                                <Link
                                    href={`/register/student?intent=trial&tutorId=${tutor.id}&subject=${listing.subjects?.[0] || ""}`}
                                    className="block w-full py-2.5 text-center bg-white border border-emerald-200 text-emerald-700 rounded-xl text-sm font-semibold hover:bg-emerald-50 transition-colors"
                                >
                                    Book Free {listing.trialDuration}-min Trial
                                </Link>
                            )}
                            <p className="text-xs text-blue-600 text-center">No commission. Pay the tutor directly.</p>
                        </div>
                    </div>
                </div>

                {/* Similar Tutors */}
                {similarTutors.length > 0 && (
                    <div className="bg-white rounded-2xl border border-gray-200 p-6">
                        <h2 className="text-base font-semibold text-gray-900 mb-4">Similar Tutors</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {similarTutors.map(s => (
                                <Link key={s.id} href={`/search/${s.tutorId}`} className="block p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="size-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-sm shrink-0">
                                            {s.tutor?.name?.[0]}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold text-gray-900 truncate">{s.tutor?.name}</p>
                                            {s.tutor?.isVerified && <p className="text-[10px] text-blue-500 font-medium">Verified</p>}
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-1 mb-2">
                                        {s.subjects?.slice(0, 2).map(sub => (
                                            <span key={sub} className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[10px] font-medium">{sub}</span>
                                        ))}
                                    </div>
                                    {s.hourlyRate > 0 && <p className="text-xs text-gray-500">₹{s.hourlyRate}/hr</p>}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
