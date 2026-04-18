import Link from "next/link";
import {
    Star, ShieldCheck, Users, Clock, ArrowRight,
    CheckCircle2, RefreshCw, PhoneCall, Award,
    Zap, Lock, Calendar
} from "lucide-react";

export const metadata = {
    title: "VIP Tuition Service — Guaranteed Tutor Matching",
    description: "Let us find the perfect tutor for your child. Curated recommendations, monitored intro calls, 3 replacement guarantee. ₹2,000 one-time enrollment fee.",
};

const HOW_IT_WORKS = [
    {
        step: 1,
        icon: Star,
        title: "Tell us what you need",
        desc: "Fill a detailed form — subject, grade, location, budget, schedule, and any preferences. Takes 3 minutes.",
        color: "blue"
    },
    {
        step: 2,
        icon: Award,
        title: "We handpick your first tutor",
        desc: "Our team selects the best match from our verified VIP tutor pool and sends you their full profile.",
        color: "violet"
    },
    {
        step: 3,
        icon: PhoneCall,
        title: "Intro call through our platform",
        desc: "Connect with the tutor via a monitored call on TuitionsInIndia — no personal numbers exchanged yet.",
        color: "blue"
    },
    {
        step: 4,
        icon: CheckCircle2,
        title: "Confirm and start",
        desc: "Happy with the tutor? Confirm the booking. Monthly fees are paid through us — you're protected throughout.",
        color: "emerald"
    },
];

const GUARANTEES = [
    { icon: RefreshCw, title: "3 Free Replacements", desc: "If a tutor isn't working out, we find another — up to 3 times, no extra charge." },
    { icon: ShieldCheck, title: "Verified VIP Tutors Only", desc: "Every tutor in our VIP pool is background-checked, interview-screened, and rated 4.5+." },
    { icon: Lock, title: "No Direct Contact Until Confirmed", desc: "Protect your privacy. Phone numbers are only shared after you confirm the arrangement." },
    { icon: Clock, title: "First Match Within 48 Hours", desc: "We commit to sending your first recommendation within 2 working days of enrollment." },
    { icon: Calendar, title: "Flexible Monthly Terms", desc: "No year-long lock-ins. Pay month to month. Stop anytime with 7 days notice." },
    { icon: Zap, title: "Managed Monthly Payments", desc: "Pay us monthly — we handle payment to your tutor. No chasing bank transfers." },
];

const FAQS = [
    {
        q: "What is the ₹2,000 enrollment fee for?",
        a: "This one-time fee covers our matching service — curating tutor profiles, arranging intro calls, and managing your placement. It is separate from your monthly tuition fees."
    },
    {
        q: "How is the monthly tuition fee decided?",
        a: "You set your budget when you apply. We only match you with tutors whose fees are within your stated range. The final fee is agreed between you and the tutor before you confirm."
    },
    {
        q: "Do I have to pay through TuitionsInIndia every month?",
        a: "If you choose to continue on the managed service, yes — this gives you protection, payment receipts, and the replacement guarantee. You can also choose to go direct with the tutor after the first month, in which case you leave the managed service."
    },
    {
        q: "What if none of the 5 recommendations work for me?",
        a: "If all 5 recommendations are rejected, we refund your ₹2,000 enrollment fee in full, no questions asked."
    },
    {
        q: "Who are the VIP tutors?",
        a: "VIP tutors are selected from our marketplace based on ratings (4.5+), experience (3+ years), and an additional interview and document check by our team. They commit to specific availability slots for VIP students."
    },
    {
        q: "Can I use this service for online tuition?",
        a: "Yes. You can request online, at-home, or at-tutor's-place tuition when you apply. The intro call is always conducted through our platform regardless of mode."
    },
];

export default function VipPage() {
    return (
        <div className="min-h-screen bg-white">

            {/* Hero */}
            <section className="bg-gradient-to-br from-blue-700 to-indigo-800 pt-28 pb-20 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <span className="inline-flex items-center gap-2 bg-white/20 text-white text-xs font-semibold px-4 py-2 rounded-full mb-6 border border-white/30">
                        <Award size={13} /> VIP Managed Tuition Service
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                        We find the perfect tutor.<br />
                        <span className="text-blue-200">You just show up and learn.</span>
                    </h1>
                    <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
                        Tell us what you need. Our team handpicks verified tutors, arranges a monitored intro call,
                        and manages monthly payments — with 3 free replacements guaranteed.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href="/vip/apply"
                            className="flex items-center gap-2 px-8 py-4 bg-white text-blue-700 font-bold rounded-xl hover:bg-blue-50 transition-colors text-base shadow-lg"
                        >
                            Enroll Now — ₹2,000 <ArrowRight size={18} />
                        </Link>
                        <p className="text-blue-200 text-sm">Full refund if we can't find your tutor</p>
                    </div>

                    {/* Quick stats */}
                    <div className="mt-12 grid grid-cols-3 gap-4 max-w-lg mx-auto">
                        {[
                            { value: "48 hrs", label: "First match" },
                            { value: "3x", label: "Replacements" },
                            { value: "4.5+", label: "Tutor rating" },
                        ].map(stat => (
                            <div key={stat.label} className="bg-white/10 rounded-xl p-4 border border-white/20">
                                <p className="text-2xl font-bold text-white">{stat.value}</p>
                                <p className="text-blue-200 text-xs mt-1">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-20 px-6 bg-gray-50">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-3">How it works</h2>
                        <p className="text-gray-500">From enrollment to your first lesson in 4 simple steps.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {HOW_IT_WORKS.map((item) => (
                            <div key={item.step} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm relative">
                                <div className="absolute -top-3 -left-3 size-7 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shadow">
                                    {item.step}
                                </div>
                                <div className={`size-11 rounded-xl bg-${item.color}-50 text-${item.color}-600 flex items-center justify-center mb-4`}>
                                    <item.icon size={20} />
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-2 text-sm">{item.title}</h3>
                                <p className="text-gray-500 text-xs leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Guarantees */}
            <section className="py-20 px-6">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-3">What's included</h2>
                        <p className="text-gray-500">Everything you need for a worry-free tuition experience.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {GUARANTEES.map((item) => (
                            <div key={item.title} className="flex gap-4 p-5 rounded-2xl border border-gray-100 bg-white shadow-sm hover:border-blue-100 hover:shadow-md transition-all">
                                <div className="size-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                    <item.icon size={18} />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 text-sm mb-1">{item.title}</h3>
                                    <p className="text-gray-500 text-xs leading-relaxed">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing */}
            <section className="py-20 px-6 bg-blue-50">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-3">Simple pricing</h2>
                        <p className="text-gray-500">One enrollment fee. Then pay only when you have a confirmed tutor.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Enrollment */}
                        <div className="bg-white rounded-2xl border-2 border-blue-600 p-8 shadow-lg">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">One-time</span>
                            </div>
                            <p className="text-4xl font-bold text-gray-900 mb-1">₹2,000</p>
                            <p className="text-gray-500 text-sm mb-6">Enrollment & matching fee</p>
                            <ul className="space-y-3 mb-8">
                                {[
                                    "Up to 5 curated tutor recommendations",
                                    "Monitored intro call for each match",
                                    "3 free replacements after confirmation",
                                    "Full refund if no match found",
                                    "Dedicated support throughout",
                                ].map(point => (
                                    <li key={point} className="flex items-start gap-2.5 text-sm text-gray-700">
                                        <CheckCircle2 size={16} className="text-emerald-500 mt-0.5 shrink-0" />
                                        {point}
                                    </li>
                                ))}
                            </ul>
                            <Link
                                href="/vip/apply"
                                className="block w-full py-3.5 text-center bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors"
                            >
                                Enroll Now
                            </Link>
                        </div>

                        {/* Monthly */}
                        <div className="bg-white rounded-2xl border border-gray-200 p-8">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">Monthly (after confirmation)</span>
                            </div>
                            <p className="text-4xl font-bold text-gray-900 mb-1">Your agreed rate</p>
                            <p className="text-gray-500 text-sm mb-6">Paid to TuitionsInIndia · We pay your tutor</p>
                            <ul className="space-y-3 mb-8">
                                {[
                                    "Pay us, not the tutor directly",
                                    "Monthly receipts and payment records",
                                    "Replacement protection active while on plan",
                                    "7-day notice to cancel anytime",
                                    "Go direct anytime — no lock-in",
                                ].map(point => (
                                    <li key={point} className="flex items-start gap-2.5 text-sm text-gray-700">
                                        <CheckCircle2 size={16} className="text-blue-400 mt-0.5 shrink-0" />
                                        {point}
                                    </li>
                                ))}
                            </ul>
                            <div className="py-3.5 text-center border-2 border-gray-100 rounded-xl text-sm font-semibold text-gray-400">
                                Only after tutor confirmation
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Who is VIP for */}
            <section className="py-20 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-3">Who should use VIP?</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        {[
                            {
                                emoji: "📚",
                                title: "Exam-focused students",
                                desc: "Preparing for JEE, NEET, board exams, or competitive tests where a committed long-term tutor matters."
                            },
                            {
                                emoji: "⏰",
                                title: "Busy parents",
                                desc: "No time to interview multiple tutors. Let us shortlist the right ones — you just have one conversation."
                            },
                            {
                                emoji: "🏆",
                                title: "Quality-first families",
                                desc: "Don't want to experiment with random tutors. Want verified, screened professionals who are serious about teaching."
                            },
                        ].map(card => (
                            <div key={card.title} className="bg-gray-50 rounded-2xl border border-gray-100 p-6 text-center">
                                <div className="text-4xl mb-4">{card.emoji}</div>
                                <h3 className="font-bold text-gray-900 mb-2">{card.title}</h3>
                                <p className="text-gray-500 text-sm leading-relaxed">{card.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="py-20 px-6 bg-gray-50">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Frequently asked questions</h2>
                    <div className="space-y-4">
                        {FAQS.map((faq) => (
                            <div key={faq.q} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                                <h3 className="font-semibold text-gray-900 mb-2">{faq.q}</h3>
                                <p className="text-gray-500 text-sm leading-relaxed">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 px-6 bg-blue-700">
                <div className="max-w-2xl mx-auto text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">Ready to find your perfect tutor?</h2>
                    <p className="text-blue-100 mb-8">
                        Enroll today. Your first recommendation arrives within 48 hours.
                        Full refund if we can't find the right match.
                    </p>
                    <Link
                        href="/vip/apply"
                        className="inline-flex items-center gap-2 px-10 py-4 bg-white text-blue-700 font-bold rounded-xl hover:bg-blue-50 transition-colors text-base shadow-lg"
                    >
                        Enroll in VIP Service — ₹2,000 <ArrowRight size={18} />
                    </Link>
                    <p className="text-blue-200 text-xs mt-4">One-time fee · Full refund guarantee · No monthly commitment until you confirm a tutor</p>
                </div>
            </section>

        </div>
    );
}
