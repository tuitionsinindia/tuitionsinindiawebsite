"use client";

import { useState } from "react";
import Link from "next/link";
import {
    Mail,
    MessageSquare,
    Phone,
    ShieldCheck,
    Send,
    CheckCircle2,
    Building2,
    Loader2
} from "lucide-react";

export default function ContactPage() {
    const [formState, setFormState] = useState("IDLE"); // IDLE, SUBMITTING, SUCCESS, ERROR
    const [errorMsg, setErrorMsg] = useState("");
    const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "General Enquiry", message: "" });

    const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormState("SUBMITTING");
        setErrorMsg("");
        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form)
            });
            const data = await res.json();
            if (data.success) {
                setFormState("SUCCESS");
            } else {
                setErrorMsg(data.error || "Something went wrong. Please try again.");
                setFormState("ERROR");
            }
        } catch (err) {
            setErrorMsg("Network error. Please check your connection and try again.");
            setFormState("ERROR");
        }
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Hero */}
            <section className="bg-gray-50 border-b border-gray-100 py-16 px-6">
                <div className="max-w-3xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-full border border-blue-100 mb-6">
                        <MessageSquare size={13} className="text-blue-600" />
                        <span className="text-blue-700 text-xs font-medium">Get in Touch</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">How can we help?</h1>
                    <p className="text-gray-500 text-lg max-w-xl mx-auto">
                        Have a question or need support? Fill out the form and our team will get back to you within 24 hours.
                    </p>
                </div>
            </section>

            <div className="max-w-6xl mx-auto px-6 py-16">
                <div className="grid lg:grid-cols-5 gap-12 items-start">

                    {/* Contact Form */}
                    <div className="lg:col-span-3">
                        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">

                            {formState === "SUCCESS" ? (
                                <div className="text-center py-12">
                                    <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
                                        <CheckCircle2 size={32} className="text-emerald-500" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Message Sent</h2>
                                    <p className="text-gray-500 mb-8">We've received your message and will respond within 24 hours.</p>
                                    <button
                                        onClick={() => { setFormState("IDLE"); setForm({ name: "", email: "", phone: "", subject: "General Enquiry", message: "" }); }}
                                        className="text-blue-600 text-sm font-medium hover:underline"
                                    >
                                        Send another message
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name <span className="text-red-500">*</span></label>
                                        <input
                                            required
                                            type="text"
                                            name="name"
                                            value={form.name}
                                            onChange={handleChange}
                                            placeholder="Your name"
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-colors"
                                        />
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email <span className="text-red-500">*</span></label>
                                            <input
                                                required
                                                type="email"
                                                name="email"
                                                value={form.email}
                                                onChange={handleChange}
                                                placeholder="you@example.com"
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-colors"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone <span className="text-gray-400 font-normal">(optional)</span></label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={form.phone}
                                                onChange={handleChange}
                                                placeholder="+91 98765 43210"
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-colors"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Subject</label>
                                        <select
                                            name="subject"
                                            value={form.subject}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-colors"
                                        >
                                            <option>General Enquiry</option>
                                            <option>Finding a Tutor</option>
                                            <option>Tutor Registration</option>
                                            <option>Institute Registration</option>
                                            <option>Billing & Subscription</option>
                                            <option>Technical Support</option>
                                            <option>Partnership</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Message <span className="text-red-500">*</span></label>
                                        <textarea
                                            required
                                            rows="5"
                                            name="message"
                                            value={form.message}
                                            onChange={handleChange}
                                            placeholder="Tell us how we can help..."
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-colors resize-none"
                                        />
                                    </div>

                                    {formState === "ERROR" && (
                                        <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">{errorMsg}</p>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={formState === "SUBMITTING"}
                                        className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2 text-sm"
                                    >
                                        {formState === "SUBMITTING" ? (
                                            <><Loader2 size={16} className="animate-spin" /> Sending...</>
                                        ) : (
                                            <><Send size={15} /> Send Message</>
                                        )}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className="lg:col-span-2 space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                            <div className="space-y-4">
                                {[
                                    { icon: Mail, label: "Email", value: "support@tuitionsinindia.com" },
                                    { icon: Phone, label: "Phone", value: "+91 99309 93025" }
                                ].map((info, i) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                                            <info.icon size={15} className="text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium text-gray-400 mb-0.5">{info.label}</p>
                                            <p className="text-sm text-gray-700">{info.value}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="p-5 bg-blue-50 border border-blue-100 rounded-2xl">
                            <ShieldCheck size={20} className="text-blue-600 mb-3" />
                            <h4 className="font-semibold text-gray-900 text-sm mb-1">We respond within 24 hours</h4>
                            <p className="text-xs text-gray-500 leading-relaxed">
                                All enquiries are handled by our support team. Your information is kept confidential and never shared with third parties.
                            </p>
                        </div>

                        <div className="p-5 bg-gray-50 border border-gray-200 rounded-2xl">
                            <h4 className="font-semibold text-gray-900 text-sm mb-3">Looking for something specific?</h4>
                            <div className="space-y-2">
                                <Link href="/search" className="flex items-center gap-2 text-sm text-blue-600 hover:underline">Find a tutor near you</Link>
                                <Link href="/register/tutor" className="flex items-center gap-2 text-sm text-blue-600 hover:underline">Register as a tutor</Link>
                                <Link href="/pricing" className="flex items-center gap-2 text-sm text-blue-600 hover:underline">View pricing plans</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
