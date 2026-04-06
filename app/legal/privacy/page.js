"use client";

import { ShieldCheck, Lock, ScrollText, CheckCircle2 } from "lucide-react";

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-background-dark font-sans text-on-background-dark antialiased pt-32 selection:bg-primary/30">
            
            <main className="px-6 md:px-12 lg:px-24 pb-32 pt-10">
                <div className="max-w-4xl mx-auto bg-surface-dark p-12 md:p-24 rounded-[4rem] border border-border-dark shadow-4xl relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-1 bg-primary/20"></div>
                    <div className="absolute -right-32 -top-32 size-[500px] bg-primary/5 rounded-full blur-[120px] -z-10"></div>

                    <div className="space-y-12 relative z-10">
                        <section className="space-y-4">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full border border-primary/20 mb-4">
                                <ShieldCheck size={14} />
                                <span className="text-[9px] font-black uppercase tracking-[0.2em]">Institutional Governance</span>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter leading-none text-white">Privacy <span className="text-primary font-serif lowercase tracking-normal not-italic">protocol</span>.</h1>
                            <p className="text-on-surface-dark/40 font-medium italic text-sm">Last Audit: March 24, 2026</p>
                        </section>

                        <div className="space-y-16 text-on-surface-dark/60 font-medium leading-[1.8] italic text-lg">
                            <section className="space-y-6">
                                <div className="flex items-center gap-4 mb-2">
                                    <Lock className="text-primary size-5" />
                                    <h2 className="text-2xl font-black text-white uppercase italic tracking-tight underline decoration-primary/20 decoration-4 underline-offset-4">01. Data Acquisition</h2>
                                </div>
                                <p>TuitionsInIndia acquires personal identifiers (Identity, Academic Credentials, Digital Contact points) strictly for the purpose of architecting learning matches. Every data point is treated as a high-security academic asset.</p>
                            </section>

                            <section className="space-y-6">
                                <div className="flex items-center gap-4 mb-2">
                                    <ScrollText className="text-primary size-5" />
                                    <h2 className="text-2xl font-black text-white uppercase italic tracking-tight underline decoration-primary/20 decoration-4 underline-offset-4">02. Functional Application</h2>
                                </div>
                                <p>Your data facilitates the connection between ambition and expertise. We utilize telecommunication vectors (OTP, SMS, WhatsApp) solely for critical verification and service-level notifications.</p>
                            </section>

                            <section className="space-y-6">
                                <div className="flex items-center gap-4 mb-2">
                                    <CheckCircle2 className="text-primary size-5" />
                                    <h2 className="text-2xl font-black text-white uppercase italic tracking-tight underline decoration-primary/20 decoration-4 underline-offset-4">03. Transparency in Sharing</h2>
                                </div>
                                <p>Learning requirements are distributed to verified faculty only. Explicit contact details remain encrypted until a formal 'Lead Unlock' protocol is initiated by a verified educator using the platform's credits.</p>
                            </section>

                            <section className="space-y-6">
                                <div className="flex items-center gap-4 mb-2">
                                    <ShieldCheck className="text-primary size-5" />
                                    <h2 className="text-2xl font-black text-white uppercase italic tracking-tight underline decoration-primary/20 decoration-4 underline-offset-4">04. Encryption Standards</h2>
                                </div>
                                <p>We deploy institutional-grade encryption to safeguard your academic legacy. While we maintain the highest standards of digital fortification, we remind our members that no digital vector is 100% impenetrable.</p>
                            </section>

                            <section className="space-y-6">
                                <h2 className="text-2xl font-black text-white uppercase italic tracking-tight underline decoration-primary/20 decoration-4 underline-offset-4">05. Support Matrix</h2>
                                <p>For inquiries regarding data sovereignty or our privacy architecture, please contact our Legal Counsel at <span className="text-primary border-b border-primary/20">privacy@tuitionsinindia.com</span>.</p>
                            </section>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
