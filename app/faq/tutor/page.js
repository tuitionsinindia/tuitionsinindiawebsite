"use client";

import FAQ from "@/app/components/FAQ";
import Link from "next/link";
import { ArrowRight, CircleHelp, Mail, Lock } from "lucide-react";

export default function TutorFAQ() {
    const questions = [
        {
            question: "How do I receive student enquiries?",
            answer: "Once your profile is live, you will get notifications in your dashboard and by email when students post requirements matching your subjects and location."
        },
        {
            question: "Is it free to list my profile?",
            answer: "Yes, creating your tutor profile is completely free. To unlock student contacts and get priority in search results, you can upgrade to our Pro or Elite plans."
        },
        {
            question: "Does the platform take a commission on my fees?",
            answer: "No. We charge zero commission. You negotiate and collect fees directly from students. We only charge for credits used to unlock student contacts."
        },
        {
            question: "How does verification work?",
            answer: "We verify your ID and qualifications to give you a Verified badge. Verified tutors get significantly more student enquiries and appear higher in search results."
        },
        {
            question: "Can I teach multiple subjects?",
            answer: "Yes. You can list multiple subjects, grades, and locations on your profile. Pro plan tutors can list up to 5 subjects."
        }
    ];

    return (
        <div className="bg-white text-gray-900 antialiased">

            {/* Header Section */}
            <section className="px-6 py-24 text-center bg-gray-50 border-b border-gray-100">
                <div className="max-w-3xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full border border-blue-100 mb-6">
                        <CircleHelp size={14} className="text-blue-600" />
                        <span className="text-blue-700 text-xs font-semibold">Tutor help</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-gray-900 leading-tight">
                        Frequently asked questions
                    </h1>
                    <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
                        Everything you need to know about getting students and growing your tutoring work on TuitionsInIndia.
                    </p>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="px-6 py-20 bg-gray-50">
                <div className="max-w-3xl mx-auto">
                    <FAQ items={questions} />
                </div>
            </section>

            {/* CTA Section */}
            <section className="px-6 py-16">
                <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-gray-200 p-10 md:p-14 text-center shadow-sm">
                    <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900 leading-tight">
                        Ready to grow your student base?
                    </h2>
                    <p className="text-gray-500 mb-8 max-w-lg mx-auto leading-relaxed">
                        Create your tutor profile today and start receiving enquiries from students in your area.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/register/tutor"
                            className="bg-blue-600 text-white font-semibold px-8 py-4 rounded-xl hover:bg-blue-700 active:scale-95 transition-all shadow-sm flex items-center justify-center gap-2 text-sm"
                        >
                            Create tutor profile <ArrowRight size={16} />
                        </Link>
                        <button className="bg-white border border-gray-200 text-gray-700 font-semibold px-8 py-4 rounded-xl hover:bg-gray-50 active:scale-95 transition-all flex items-center justify-center gap-2 text-sm">
                            <Mail size={16} className="text-blue-600" />
                            Contact support
                        </button>
                    </div>
                    <div className="mt-10 flex items-center justify-center gap-2 text-xs text-gray-400">
                        <Lock size={12} /> Your data is secure
                    </div>
                </div>
            </section>
        </div>
    );
}
