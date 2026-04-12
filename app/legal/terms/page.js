"use client";

import { ShieldCheck, FileText, Scale, CheckCircle2 } from "lucide-react";

export default function TermsOfService() {
    return (
        <div className="min-h-screen bg-background-dark font-sans text-on-background-dark antialiased pt-32 selection:bg-primary/30">
            
            <main className="px-6 md:px-12 lg:px-24 pb-32 pt-10">
                <div className="max-w-4xl mx-auto bg-surface-dark p-12 md:p-24 rounded-[4rem] border border-border-dark shadow-4xl relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-1 bg-primary/20"></div>
                    <div className="absolute -right-32 -top-32 size-[500px] bg-primary/5 rounded-full blur-[120px] -z-10"></div>

                    <div className="space-y-12 relative z-10">
                        <section className="space-y-4">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full border border-primary/20 mb-4">
                                <Scale size={14} />
                                <span className="text-xs font-black uppercase tracking-[0.2em]">Institutional Mandate</span>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter leading-none text-white">Terms of <span className="text-primary font-serif lowercase tracking-normal not-italic">engagement</span>.</h1>
                            <p className="text-on-surface-dark/40 font-medium italic text-sm">Last Audit: March 24, 2026</p>
                        </section>

                        <div className="space-y-16 text-on-surface-dark/60 font-medium leading-[1.8] italic text-lg">
                            <section className="space-y-6">
                                <div className="flex items-center gap-4 mb-2">
                                    <FileText className="text-primary size-5" />
                                    <h2 className="text-2xl font-black text-white uppercase italic tracking-tight underline decoration-primary/20 decoration-4 underline-offset-4">01. Acceptance of Mandate</h2>
                                </div>
                                <p>By accessing the TuitionsInIndia digital infrastructure, you enter into a formal covenant to abide by our institutional standards. We provide the ecosystem; you provide the integrity.</p>
                            </section>

                            <section className="space-y-6">
                                <div className="flex items-center gap-4 mb-2">
                                    <ShieldCheck className="text-primary size-5" />
                                    <h2 className="text-2xl font-black text-white uppercase italic tracking-tight underline decoration-primary/20 decoration-4 underline-offset-4">02. Sovereignty of Accounts</h2>
                                </div>
                                <p>Members maintain absolute sovereignty over their academic credentials. Tutors are mandated to provide authentic, verifiable pedagogical history. Any deviation from academic truth results in immediate platform expulsion.</p>
                            </section>

                            <section className="space-y-6">
                                <div className="flex items-center gap-4 mb-2">
                                    <Scale className="text-primary size-5" />
                                    <h2 className="text-2xl font-black text-white uppercase italic tracking-tight underline decoration-primary/20 decoration-4 underline-offset-4">03. Economic Framework</h2>
                                </div>
                                <p>Our ecosystem utilizes a credit-based protocol for lead distribution. Once academic infrastructure is deployed (credits purchased), the transaction is final. We operate on a zero-commission model to ensure 100% economic efficiency for our educators.</p>
                            </section>

                            <section className="space-y-6">
                                <div className="flex items-center gap-4 mb-2">
                                    <CheckCircle2 className="text-primary size-5" />
                                    <h2 className="text-2xl font-black text-white uppercase italic tracking-tight underline decoration-primary/20 decoration-4 underline-offset-4">04. Professional Conduct</h2>
                                </div>
                                <p>Harassment, fraud, or pedagogical misrepresentation is strictly prohibited. We maintain an 'Ivory Tower' standard—excellence, respect, and academic rigor are the only currencies accepted here.</p>
                            </section>

                            <section className="space-y-6">
                                <h2 className="text-2xl font-black text-white uppercase italic tracking-tight underline decoration-primary/20 decoration-4 underline-offset-4">05. Platform Disclaimer</h2>
                                <p>TuitionsInIndia is the architectural layer connecting students and faculty. We do not employ the educators; we verify them. Users are encouraged to perform high-fidelity due diligence before initiating formal instruction.</p>
                            </section>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
