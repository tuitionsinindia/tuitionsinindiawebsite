import FAQ from "@/app/components/FAQ";
import Link from "next/link";
import { ArrowRight, CircleHelp, ShieldCheck, Mail, MessageSquare } from "lucide-react";

export default function StudentFAQ() {
    const questions = [
        {
            question: "How do I find the right tutor for my needs?",
            answer: "You can use our 'Expert Search' to filter by subject, location, and institutional metrics. Alternatively, deploy our AI Matchmaker for an automated, high-precision recommendation based on your pedagogical requirements."
        },
        {
            question: "Is the first trial session really free?",
            answer: "The majority of our verified institutional specialists offer a 30-minute diagnostic session at zero cost. Look for the 'Verified Trial' badge on the educator's profile for confirmation."
        },
        {
            question: "How are financial transactions handled?",
            answer: "We utilize a secure credit-based ecosystem and direct payment protocols through Razorpay. All transactions are encrypted and support UPI, Netbanking, and major credit facilities."
        },
        {
            question: "What is the Satisfaction Guarantee protocol?",
            answer: "Our Academic Integrity Guarantee ensures that if your first session does not meet institutional standards, we will re-initiate a high-priority match sequence at no additional platform cost."
        },
        {
            question: "Does the platform support home-based discovery?",
            answer: "Yes. Our matching engine supports 'Home Laboratory', 'Online Synchronous', and 'Institutional Center' modes. You can filter your search based on your preferred learning environment."
        }
    ];

    return (
        <div className="min-h-screen bg-background-dark text-on-background-dark font-sans selection:bg-primary/30">
            
            <main className="pt-40 pb-32">
                <div className="max-w-4xl mx-auto px-6">
                    {/* Header Section */}
                    <div className="text-center mb-24">
                        <div className="inline-flex items-center gap-3 px-4 py-2 bg-primary/10 rounded-full border border-primary/20 mb-8 animate-fade-in">
                            <ShieldCheck size={14} className="text-primary" />
                            <span className="text-primary text-[10px] font-black uppercase tracking-[0.3em]">Institutional Support Matrix</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-white italic tracking-tighter mb-8 leading-none">
                            Student <span className="underline decoration-primary/20 decoration-8 underline-offset-8">Support</span>.
                        </h1>
                        <p className="text-on-background-dark/60 font-medium text-xl max-w-2xl mx-auto leading-relaxed">
                            Comprehensive documentation for navigating the TuitionsInIndia academic ecosystem. Find clarity on procurement, matching, and pedagogical protocols.
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
                            <h2 className="text-3xl font-black text-white mb-6 uppercase tracking-tight italic">Queries still <span className="text-primary">unresolved</span>?</h2>
                            <p className="text-on-surface-dark/60 mb-12 font-medium text-lg max-w-xl mx-auto">
                                Our institutional support team is standing by to provide technical and pedagogical assistance for your learning journey.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-6 justify-center">
                                <Link 
                                    href="/post-requirement" 
                                    className="bg-primary text-white font-black px-12 py-6 rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3 uppercase tracking-widest text-xs"
                                >
                                    Deploy Requirement
                                    <ArrowRight size={16} strokeWidth={3} />
                                </Link>
                                <button className="bg-background-dark border border-border-dark text-white font-black px-12 py-6 rounded-2xl hover:border-primary/50 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-xs">
                                    <Mail size={16} className="text-primary" />
                                    Contact Counsel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

        </div>
    );
}
