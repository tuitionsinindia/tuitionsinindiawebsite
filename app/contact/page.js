"use client";

import { useState } from "react";
import Link from "next/link";
import { 
    Mail, 
    MessageSquare, 
    MapPin, 
    Phone, 
    ShieldCheck, 
    Send, 
    CheckCircle2, 
    ArrowRight,
    Search,
    Zap,
    Building2,
    Users
} from "lucide-react";

export default function ContactPage() {
    const [formState, setFormState] = useState("IDLE"); // IDLE, SUBMITTING, SUCCESS

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormState("SUBMITTING");
        // Simulate high-fidelity API sequence
        setTimeout(() => setFormState("SUCCESS"), 1500);
    };

    return (
        <div className="min-h-screen bg-background-dark font-sans text-on-background-dark antialiased pt-40 pb-32 selection:bg-primary/30">
            {/* Redundant Header/Footer removed (in RootLayout) */}

            <main className="px-6 max-w-7xl mx-auto space-y-32">
                
                {/* Hero Protocol */}
                <section className="text-center relative overflow-hidden max-w-4xl mx-auto">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-primary/5 blur-[120px] rounded-full -z-10"></div>
                    
                    <div className="inline-flex items-center gap-3 px-4 py-2 bg-primary/10 rounded-full border border-primary/20 mb-8">
                        <MessageSquare size={14} className="text-primary" />
                        <span className="text-primary text-[10px] font-black uppercase tracking-[0.3em]">Academic Support Hub</span>
                    </div>

                    <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter leading-[0.9] text-white uppercase mb-12">
                        Consult with the <br />
                        <span className="text-primary font-serif lowercase tracking-normal not-italic px-4">strategy</span> team.
                    </h1>

                    <p className="text-xl md:text-2xl text-on-background-dark/40 font-medium leading-relaxed italic max-w-2xl mx-auto">
                        Whether you are an ambitious student seeking the perfect mentor or an elite educator looking to scale your practice, our team is here to architect your success.
                    </p>
                </section>

                <div className="grid lg:grid-cols-2 gap-24 items-start">
                    
                    {/* Inquiry Matrix */}
                    <section className="bg-surface-dark p-12 md:p-20 rounded-[4rem] border border-border-dark shadow-4xl relative overflow-hidden group">
                        <div className="absolute inset-0 bg-primary/5 blur-3xl opacity-50 -z-10 group-hover:scale-110 transition-transform duration-1000"></div>
                        
                        {formState === "SUCCESS" ? (
                            <div className="relative z-10 text-center py-24 animate-in fade-in zoom-in duration-500">
                                <div className="size-24 rounded-[2rem] bg-primary/10 text-primary flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-primary/20">
                                    <CheckCircle2 size={48} />
                                </div>
                                <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter mb-6">Inquiry Received</h2>
                                <p className="text-on-surface-dark/60 font-medium italic mb-12 text-lg">Our academic strategy counsel will contact you within 24 business hours.</p>
                                <button 
                                    onClick={() => setFormState("IDLE")}
                                    className="text-primary font-black uppercase text-[10px] tracking-[0.4em] border-b-2 border-primary/20 hover:border-primary transition-all pb-2"
                                >
                                    Initialize New Batch
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="relative z-10 space-y-10">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-dark/20 ml-6 italic">Full Identity</label>
                                    <input 
                                        required
                                        type="text" 
                                        placeholder="eg. Dr. Aarav Mehta"
                                        className="w-full bg-background-dark p-7 rounded-3xl border border-border-dark focus:border-primary transition-all font-medium italic outline-none text-white text-lg placeholder:text-on-surface-dark/10"
                                    />
                                </div>
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-dark/20 ml-6 italic">Electronic Mail</label>
                                        <input 
                                            required
                                            type="email" 
                                            placeholder="aarav@university.edu"
                                            className="w-full bg-background-dark p-7 rounded-3xl border border-border-dark focus:border-primary transition-all font-medium italic outline-none text-white text-lg placeholder:text-on-surface-dark/10"
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-dark/20 ml-6 italic">Protocol Objective</label>
                                        <div className="relative">
                                            <select className="w-full bg-background-dark p-7 rounded-3xl border border-border-dark focus:border-primary transition-all font-medium italic outline-none appearance-none text-white text-lg">
                                                <option>Institutional Membership</option>
                                                <option>Student Matching Services</option>
                                                <option>Technical Infrastructure</option>
                                                <option>Academic Partnerships</option>
                                            </select>
                                            <div className="absolute right-7 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-dark/20">
                                                <Zap size={16} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-dark/20 ml-6 italic">Requirement Context</label>
                                    <textarea 
                                        required
                                        rows="5"
                                        placeholder="Describe your academic objectives or technical legacy concerns..."
                                        className="w-full bg-background-dark p-7 rounded-3xl border border-border-dark focus:border-primary transition-all font-medium italic outline-none resize-none text-white text-lg placeholder:text-on-surface-dark/10"
                                    ></textarea>
                                </div>
                                <button 
                                    disabled={formState === "SUBMITTING"}
                                    className="w-full py-7 bg-primary text-white rounded-3xl font-black uppercase text-[10px] tracking-[0.4em] shadow-2xl shadow-primary/40 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-4"
                                >
                                    {formState === "SUBMITTING" ? (
                                        <span className="animate-pulse italic">Synchronizing Batch...</span>
                                    ) : (
                                        <>Dispatch Inquiry <Send size={16} strokeWidth={3} /></>
                                    )}
                                </button>
                            </form>
                        )}
                    </section>

                    {/* Channel Intelligence */}
                    <div className="space-y-16 py-12">
                        <section className="space-y-12">
                            <h3 className="text-4xl font-black uppercase italic tracking-tighter text-white">Direct <span className="text-primary font-serif lowercase tracking-normal not-italic px-4">channels</span>.</h3>
                            <div className="space-y-10">
                                {[
                                    { label: "Institutional HQ", value: "Cyber Hub, Level 14, Gurugram, Bharat", icon: Building2 },
                                    { label: "Strategic Support", value: "counsel@tuitionsinindia.com", icon: Mail },
                                    { label: "Protocol Hotline", value: "+91 (800) ACAD-ELITE", icon: Phone }
                                ].map((info, i) => (
                                    <div key={i} className="flex gap-8 items-start group">
                                        <div className="size-16 rounded-2xl bg-surface-dark border border-border-dark text-on-surface-dark/40 flex items-center justify-center shrink-0 group-hover:text-primary group-hover:border-primary/30 transition-all">
                                            <info.icon size={28} />
                                        </div>
                                        <div className="pt-2">
                                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-dark/20 mb-2 italic">{info.label}</p>
                                            <p className="text-2xl font-black italic text-white tracking-tight">{info.value}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Security Protocol */}
                        <section className="p-16 bg-surface-dark rounded-[4rem] border border-border-dark shadow-4xl relative overflow-hidden group">
                            <div className="absolute inset-0 bg-primary/5 opacity-50 -z-10 group-hover:scale-110 transition-transform duration-700"></div>
                            <div className="relative z-10 space-y-8">
                                <ShieldCheck size={56} className="text-primary group-hover:scale-110 transition-transform" />
                                <h4 className="text-2xl font-black uppercase italic text-white tracking-tight">Elite Support Protocol</h4>
                                <p className="text-lg text-on-surface-dark/60 font-medium leading-relaxed italic opacity-80">
                                    All inquiries are handled with absolute confidentiality and prioritized by our academic advisory board. Expect a high-fidelity response from a senior strategist within 24 hours.
                                </p>
                            </div>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
}
