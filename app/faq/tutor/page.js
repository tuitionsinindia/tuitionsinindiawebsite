import FAQ from "@/app/components/FAQ";
import Link from "next/link";

export default function TutorFAQ() {
    const questions = [
        {
            question: "How do I get more student leads?",
            answer: "Ensure your profile is complete with a clear bio, professional photo, and verified subjects. Using our 'Premium Visibility' and 'Credits' ensures you are prioritized in search results."
        },
        {
            question: "How do credits work?",
            answer: "Credits are used to unlock the contact details of students who have posted requirements. It costs 1 credit per unlock, allowing you to call, email, or chat with the student directly."
        },
        {
            question: "What is the 'Verified Expert' badge?",
            answer: "The 'Verified Expert' badge is awarded after our team reviews your ID and academic certifications. Tutors with this badge receive 5x more inquiries."
        },
        {
            question: "How do I set my hourly rate?",
            answer: "You can set and update your hourly rate at any time from your Tutor Dashboard under 'Profile Settings'. We recommend researching competitive rates for your subjects and experience level."
        },
        {
            question: "Is there a commission on my earnings?",
            answer: "No, TuitionsInIndia does not take a commission from the payments you receive directly from students. Our platform operates on a credit-based model for lead unlocking."
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50 pt-32 pb-20 px-4 md:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-16">
                    <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-widest mb-6 inline-block">
                        Tutor Support
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Tutor FAQs</h1>
                    <p className="text-slate-500 font-medium text-lg max-w-2xl mx-auto">
                        Your go-to resource for growing your teaching career and managing your student leads effectively.
                    </p>
                </div>

                <div className="mb-20">
                    <FAQ items={questions} />
                </div>

                <div className="bg-white rounded-[2.5rem] p-12 border border-slate-100 shadow-sm text-center">
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">Grow your presence</h2>
                    <p className="text-slate-500 mb-8 font-medium">Ready to take your professional teaching career to the next level?</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/register/tutor" className="bg-primary text-white font-bold px-8 py-4 rounded-2xl hover:opacity-90 transition-all">
                            Complete Your Profile
                        </Link>
                        <Link href="/dashboard/tutor" className="bg-slate-50 text-slate-900 font-bold px-8 py-4 rounded-2xl border border-slate-100 hover:bg-slate-100 transition-all">
                            Go to Dashboard
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
