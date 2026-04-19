import { notFound } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, Star, CheckCircle2, Award, Users, Clock, MessageCircle } from "lucide-react";
import { getAdLandingPage, listAdLandingSlugs } from "@/lib/adLandingPages";
import LeadForm from "./LeadForm";

export async function generateStaticParams() {
    return listAdLandingSlugs().map(slug => ({ slug }));
}

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const page = getAdLandingPage(slug);
    if (!page) return {};
    return {
        title: page.metaTitle,
        description: page.metaDescription,
        robots: { index: false, follow: true },
        openGraph: {
            title: page.metaTitle,
            description: page.metaDescription,
        },
    };
}

export default async function AdLandingPage({ params, searchParams }) {
    const { slug } = await params;
    const sp = await searchParams;
    const page = getAdLandingPage(slug);
    if (!page) notFound();

    const utm = {
        source: sp?.utm_source || "",
        medium: sp?.utm_medium || "",
        campaign: sp?.utm_campaign || "",
        content: sp?.utm_content || "",
        term: sp?.utm_term || "",
    };

    return (
        <div id="top" className="bg-white text-gray-900 scroll-smooth">
            {/* Minimal top bar — no nav links, minimise distraction */}
            <div className="border-b border-gray-100 bg-white">
                <div className="max-w-6xl mx-auto px-5 py-3 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="size-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                            <ShieldCheck size={16} />
                        </div>
                        <span className="text-sm font-bold text-gray-900">
                            Tuitions<span className="text-blue-600">in</span>India
                        </span>
                    </Link>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Star size={12} className="text-amber-500 fill-amber-500" />
                        <span className="font-semibold">4.8</span> · 2,400+ reviews
                    </div>
                </div>
            </div>

            {/* Hero */}
            <section className="bg-gradient-to-br from-blue-50 via-white to-white border-b border-gray-100">
                <div className="max-w-6xl mx-auto px-5 py-10 md:py-16 grid md:grid-cols-5 gap-8 items-start">
                    <div className="md:col-span-3">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold mb-4">
                            <Award size={12} /> {page.eyebrow}
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-4 tracking-tight">
                            {page.headline}
                        </h1>
                        <p className="text-base md:text-lg text-gray-600 mb-6 leading-relaxed">
                            {page.subheadline}
                        </p>

                        {/* Stat row */}
                        <div className="grid grid-cols-3 gap-3 mb-8">
                            {page.stats.map((stat, i) => (
                                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4 text-center">
                                    <div className="text-2xl font-bold text-blue-600">{stat.value}</div>
                                    <div className="text-[11px] font-semibold text-gray-500 mt-1">{stat.label}</div>
                                </div>
                            ))}
                        </div>

                        {/* Bullets */}
                        <ul className="space-y-3">
                            {page.bullets.map((b, i) => (
                                <li key={i} className="flex items-start gap-3 text-sm text-gray-700 leading-relaxed">
                                    <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                                    <span>{b}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Sticky lead form on desktop */}
                    <div className="md:col-span-2 md:sticky md:top-4">
                        <LeadForm
                            defaultSubject={page.subject}
                            defaultLocation={page.location}
                            utm={utm}
                        />
                    </div>
                </div>
            </section>

            {/* How it works */}
            <section className="py-12 md:py-16 border-b border-gray-100">
                <div className="max-w-5xl mx-auto px-5">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-2 tracking-tight">
                        How it works
                    </h2>
                    <p className="text-sm text-gray-500 text-center mb-10">No guessing. No commission. No chasing.</p>
                    <div className="grid md:grid-cols-3 gap-5">
                        {[
                            { icon: MessageCircle, title: "1. Tell us what you need", desc: "Share your subject, grade, area and budget. Takes 30 seconds." },
                            { icon: Users, title: "2. Tutors reach out", desc: "Matching verified tutors call or WhatsApp you — usually within 12 hours." },
                            { icon: Clock, title: "3. Start learning", desc: "Book a demo for ₹149 (refundable). Continue only if you're happy." },
                        ].map((step, i) => (
                            <div key={i} className="bg-gray-50 border border-gray-200 rounded-2xl p-5">
                                <div className="size-10 rounded-xl bg-blue-600 text-white flex items-center justify-center mb-4">
                                    <step.icon size={18} />
                                </div>
                                <h3 className="font-bold text-gray-900 mb-1.5">{step.title}</h3>
                                <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-12 md:py-16 bg-gray-50 border-b border-gray-100">
                <div className="max-w-5xl mx-auto px-5">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-10 tracking-tight">
                        What parents and students say
                    </h2>
                    <div className="grid md:grid-cols-3 gap-5">
                        {page.testimonials.map((t, i) => (
                            <div key={i} className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col">
                                <div className="flex gap-0.5 mb-3">
                                    {Array.from({ length: t.rating }).map((_, r) => (
                                        <Star key={r} size={14} className="text-amber-500 fill-amber-500" />
                                    ))}
                                </div>
                                <p className="text-sm text-gray-700 leading-relaxed mb-4 flex-1">
                                    &ldquo;{t.quote}&rdquo;
                                </p>
                                <div className="pt-3 border-t border-gray-100">
                                    <div className="text-sm font-bold text-gray-900">{t.name}</div>
                                    <div className="text-xs text-gray-500">{t.role}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="py-12 md:py-16">
                <div className="max-w-3xl mx-auto px-5">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-10 tracking-tight">
                        Common questions
                    </h2>
                    <div className="space-y-3">
                        {page.faqs.map((faq, i) => (
                            <details key={i} className="group bg-gray-50 border border-gray-200 rounded-xl p-5">
                                <summary className="font-semibold text-gray-900 text-sm cursor-pointer list-none flex items-center justify-between">
                                    {faq.q}
                                    <span className="text-gray-400 group-open:rotate-180 transition-transform">▾</span>
                                </summary>
                                <p className="text-sm text-gray-600 mt-3 leading-relaxed">{faq.a}</p>
                            </details>
                        ))}
                    </div>
                </div>
            </section>

            {/* Bottom CTA */}
            <section className="py-12 bg-blue-600 text-white">
                <div className="max-w-3xl mx-auto px-5 text-center">
                    <h2 className="text-2xl md:text-3xl font-bold mb-3 tracking-tight">Ready to find your tutor?</h2>
                    <p className="text-blue-100 mb-6">Fill the form above and matching tutors will contact you within 12 hours.</p>
                    <a
                        href="#top"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-700 font-semibold rounded-lg hover:bg-blue-50 transition-colors text-sm"
                    >
                        Back to the form
                    </a>
                </div>
            </section>

            {/* Footer — minimal */}
            <footer className="py-6 border-t border-gray-100 bg-white">
                <div className="max-w-6xl mx-auto px-5 flex flex-wrap items-center justify-between gap-3 text-xs text-gray-500">
                    <div>© 2026 TuitionsinIndia. All rights reserved.</div>
                    <div className="flex items-center gap-4">
                        <Link href="/legal/privacy" className="hover:text-gray-900">Privacy</Link>
                        <Link href="/legal/terms" className="hover:text-gray-900">Terms</Link>
                        <Link href="/contact" className="hover:text-gray-900">Contact</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
