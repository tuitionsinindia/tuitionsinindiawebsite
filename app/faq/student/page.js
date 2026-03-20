import FAQ from "@/app/components/FAQ";
import Link from "next/link";

export default function StudentFAQ() {
    const questions = [
        {
            question: "How do I find the right tutor for my needs?",
            answer: "You can use our 'Find Tutors' page to filter by subject, location, and price. Alternatively, use our AI Matchmaker to get personalized recommendations based on your learning style."
        },
        {
            question: "Is the first trial session really free?",
            answer: "Most of our verified tutors offer a 30-minute free trial session. Look for the 'Free Trial' badge on their profile to confirm."
        },
        {
            question: "How do I pay for my sessions?",
            answer: "We support direct payments to tutors or through our secure platform using Razorpay (UPI, Cards, Netbanking). Check the 'Pricing' page for bundle discounts."
        },
        {
            question: "What if I'm not satisfied with a tutor?",
            answer: "Our Satisfaction Guarantee ensures that if you're not happy after your first paid session, we'll help you find a new tutor and refund your last session's platform fee."
        },
        {
            question: "Can I get home tuition or only online?",
            answer: "Both! Tutors specify their availability for 'Home Tuition', 'Online', or 'Coaching Center' on their profiles. You can filter for your preferred mode."
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50 pt-32 pb-20 px-4 md:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-16">
                    <span className="px-4 py-2 bg-orange-100 text-orange-600 rounded-full text-xs font-bold uppercase tracking-widest mb-6 inline-block">
                        Support Center
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Student FAQs</h1>
                    <p className="text-slate-500 font-medium text-lg max-w-2xl mx-auto">
                        Everything you need to know about finding, connecting, and learning with the best tutors in India.
                    </p>
                </div>

                <div className="mb-20">
                    <FAQ items={questions} />
                </div>

                <div className="bg-white rounded-[2.5rem] p-12 border border-slate-100 shadow-sm text-center">
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">Still have questions?</h2>
                    <p className="text-slate-500 mb-8 font-medium">Our student support team is here to help you skip the stress and start learning.</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/post-requirement" className="bg-primary text-white font-bold px-8 py-4 rounded-2xl hover:opacity-90 transition-all">
                            Post a Requirement
                        </Link>
                        <button className="bg-slate-50 text-slate-900 font-bold px-8 py-4 rounded-2xl border border-slate-100 hover:bg-slate-100 transition-all">
                            Contact Support
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
