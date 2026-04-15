"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle2, MessageSquare } from "lucide-react";

export default function ContactPage() {
    const [formState, setFormState] = useState("idle"); // idle, submitting, success, error
    const [errorMsg, setErrorMsg] = useState("");
    const [fields, setFields] = useState({ name: "", email: "", topic: "Finding a tutor", message: "" });

    const set = (key) => (e) => setFields((f) => ({ ...f, [key]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormState("submitting");
        setErrorMsg("");
        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: fields.name, email: fields.email, subject: fields.topic, message: fields.message }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Something went wrong.");
            setFormState("success");
        } catch (err) {
            setErrorMsg(err.message || "Something went wrong. Please try again.");
            setFormState("error");
        }
    };

    return (
        <div className="min-h-screen bg-white pt-24 pb-20">
            <main className="max-w-5xl mx-auto px-6">

                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-3">Contact us</h1>
                    <p className="text-gray-500 text-lg">
                        Have a question or need help? We'll get back to you within 24 hours.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 items-start">

                    {/* Contact form */}
                    <div className="bg-white border border-gray-200 rounded-2xl p-8">
                        {formState === "success" ? (
                            <div className="text-center py-12">
                                <div className="size-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle2 size={32} className="text-green-600" />
                                </div>
                                <h2 className="text-xl font-bold text-gray-900 mb-2">Message sent</h2>
                                <p className="text-gray-500 mb-6">We'll reply to you within 24 hours.</p>
                                <button
                                    onClick={() => { setFormState("idle"); setFields({ name: "", email: "", topic: "Finding a tutor", message: "" }); }}
                                    className="text-blue-600 font-semibold text-sm hover:underline"
                                >
                                    Send another message
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-5">
                                {formState === "error" && (
                                    <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-red-700 text-sm">
                                        {errorMsg}
                                    </div>
                                )}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Your name</label>
                                    <input
                                        required
                                        type="text"
                                        value={fields.name}
                                        onChange={set("name")}
                                        placeholder="e.g. Priya Sharma"
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                                    />
                                </div>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
                                        <input
                                            required
                                            type="email"
                                            value={fields.email}
                                            onChange={set("email")}
                                            placeholder="priya@example.com"
                                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">What do you need help with?</label>
                                        <select
                                            value={fields.topic}
                                            onChange={set("topic")}
                                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                                        >
                                            <option>Finding a tutor</option>
                                            <option>Listing as a tutor</option>
                                            <option>Billing or credits</option>
                                            <option>Technical issue</option>
                                            <option>Other</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Your message</label>
                                    <textarea
                                        required
                                        rows="5"
                                        value={fields.message}
                                        onChange={set("message")}
                                        placeholder="Tell us what you need help with..."
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors resize-none"
                                    ></textarea>
                                </div>
                                <button
                                    disabled={formState === "submitting"}
                                    className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {formState === "submitting" ? (
                                        <span>Sending...</span>
                                    ) : (
                                        <>Send message <Send size={15} /></>
                                    )}
                                </button>
                            </form>
                        )}
                    </div>

                    {/* Contact details */}
                    <div className="space-y-6">
                        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                            <div className="flex gap-4 items-start">
                                <div className="size-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                                    <Mail size={18} className="text-blue-600" />
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900 mb-0.5">Email</p>
                                    <p className="text-gray-500 text-sm">support@tuitionsinindia.com</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                            <div className="flex gap-4 items-start">
                                <div className="size-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                                    <MapPin size={18} className="text-blue-600" />
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900 mb-0.5">Location</p>
                                    <p className="text-gray-500 text-sm">Gurugram, Haryana, India</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                            <div className="flex gap-4 items-start">
                                <div className="size-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                                    <MessageSquare size={18} className="text-blue-600" />
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900 mb-1">Response time</p>
                                    <p className="text-gray-500 text-sm">We typically reply within 24 hours on working days.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
