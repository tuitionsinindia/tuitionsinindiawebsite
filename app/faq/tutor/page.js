import FAQ from "@/app/components/FAQ";
import Link from "next/link";
import { ArrowRight, Zap, ShieldCheck, TrendingUp, BarChart3, Briefcase } from "lucide-react";

export default function TutorFAQ() {
    const questions = [
        {
            question: "How do I optimize my lead acquisition rate?",
            answer: "Lead acquisition is driven by profile integrity. Ensure your 'Expert Portfolio' is 100% complete with high-resolution identifiers, verified academic credentials, and a strategic pedagogical bio. Profiles with high 'Trust Matrix' scores receive 5x more matching weight."
        },
        {
            question: "How does the Credit Ecosystem function?",
            answer: "Credits are the primary currency for unlocking direct communication protocols. Unlocking a student's 'Matched Requirement' costs 1 institutional credit. This provides immediate access to their secure contact points, including WhatsApp and direct telephony."
        },
        {
            question: "What is the 'Verified Institutional Expert' certification?",
            answer: "Certification is achieved after our audit team validates your government ID and academic degrees. Tutors with 'Institutional Verification' are prioritized by our AI Matchmaker and display a high-trust shield on all discovery views."
        },
        {
            question: "How do I manage my professional session rates?",
            answer: "You maintain full sovereignty over your pricing. Rates can be adjusted via the 'Intelligence Hub' (Tutor Dashboard) under 'Profile Architecture'. We recommend aligning your rates with the current market valuation for your specific expertise."
        },
        {
            question: "Is there a commission on academic revenue?",
            answer: "No. TuitionsInIndia adheres to a zero-commission model for student sessions. We operate exclusively on a credit-based lead discovery model, allowing you to retain 100% of your pedagogical earnings."
        }
    ];

    return (
        <div className="min-h-screen bg-background-dark text-on-background-dark font-sans selection:bg-primary/30">
            
            <main className="pt-40 pb-32">
                <div className="max-w-4xl mx-auto px-6">
                    {/* Header Section */}
                    <div className="text-center mb-24">
                        <div className="inline-flex items-center gap-3 px-4 py-2 bg-primary/10 rounded-full border border-primary/20 mb-8 animate-fade-in">
                            <Briefcase size={14} className="text-primary" />
                            <span className="text-primary text-[10px] font-black uppercase tracking-[0.3em]">Educator Success Matrix</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-white italic tracking-tighter mb-8 leading-none">
                            Expert <span className="underline decoration-primary/20 decoration-8 underline-offset-8">Guidance</span>.
                        </h1>
                        <p className="text-on-background-dark/60 font-medium text-xl max-w-2xl mx-auto leading-relaxed">
                            A strategic repository for professional educators to scale their pedagogical brand and master the TuitionsInIndia discovery engine.
                        </p>
                    </div>

                    {/* FAQ Component Area */}
                    <div className="mb-32">
                        <FAQ items={questions} />
                    </div>

                    {/* Support Hub CTA */}
                    <div className="bg-surface-dark border border-border-dark rounded-[3.5rem] p-12 md:p-20 shadow-4xl relative overflow-hidden">
                        <div className="absolute -right-20 -bottom-20 size-64 bg-primary/5 rounded-full blur-3xl -z-10"></div>
                        
                        <div className="text-center">
                            <h2 className="text-3xl font-black text-white mb-6 uppercase tracking-tight italic">Scale your <span className="text-primary">Teaching Brand</span></h2>
                            <p className="text-on-surface-dark/60 mb-12 font-medium text-lg max-w-xl mx-auto">
                                Access high-intent leads and manage your academic portfolio through our advanced educator intelligence hub.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-6 justify-center">
                                <Link 
                                    href="/register/tutor" 
                                    className="bg-primary text-white font-black px-12 py-6 rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3 uppercase tracking-widest text-xs"
                                >
                                    Complete Profile
                                    <TrendingUp size={16} strokeWidth={3} />
                                </Link>
                                <Link 
                                    href="/dashboard/tutor" 
                                    className="bg-background-dark border border-border-dark text-white font-black px-12 py-6 rounded-2xl hover:border-primary/50 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-xs"
                                >
                                    <BarChart3 size={16} className="text-primary" />
                                    Intelligence Hub
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

        </div>
    );
}
