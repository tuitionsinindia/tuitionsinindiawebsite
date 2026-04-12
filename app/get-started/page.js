"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { GraduationCap, Users, Building2, ArrowRight, CheckCircle2, ShieldCheck, Star } from "lucide-react";

export default function GetStarted() {
    const searchParams = useSearchParams();
    const queryString = searchParams.toString();
    const suffix = queryString ? `?${queryString}` : "";

    const roles = [
        {
            id: "student",
            title: "I am a Student / Parent",
            description: "Looking for a verified tutor to help with academics, competitive exams, or skill-based learning.",
            icon: GraduationCap,
            color: "bg-blue-50 text-blue-600 border-blue-100",
            cardHover: "hover:border-blue-300",
            link: `/register/student${suffix}`,
            features: [
                "Search verified tutors by subject & location",
                "Post your tuition requirement for free",
                "Book demo sessions directly",
                "Compare fees and reviews transparently"
            ]
        },
        {
            id: "tutor",
            title: "I am a Private Tutor",
            description: "Looking to grow my teaching career and connect with students who need my exact expertise.",
            icon: Users,
            color: "bg-green-50 text-green-600 border-green-100",
            cardHover: "hover:border-green-300",
            link: `/register/tutor${suffix}`,
            features: [
                "Create a professional verified profile",
                "Get student leads matching your subjects",
                "Zero commission on your tuition fees",
                "Earn the Verified Tutor badge"
            ]
        },
        {
            id: "institute",
            title: "I represent an Institute",
            description: "A coaching centre, academy, or school looking to reach more students locally and online.",
            icon: Building2,
            color: "bg-purple-50 text-purple-600 border-purple-100",
            cardHover: "hover:border-purple-300",
            link: `/register/institute${suffix}`,
            features: [
                "List your institute with branch locations",
                "Manage multiple tutors under one profile",
                "Get a verified institute badge",
                "Receive direct student enquiries"
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900 antialiased flex flex-col items-center justify-center px-6 py-32">
            {/* Background gradients */}
            <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-blue-100/40 rounded-bl-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-purple-100/30 rounded-tr-full blur-[120px] pointer-events-none"></div>

            <div className="max-w-5xl w-full relative z-10">
                <div className="text-center mb-16">
                    <Link href="/" className="inline-flex items-center gap-2 mb-8 group hover:opacity-80 transition-opacity">
                        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-md">
                            <ShieldCheck size={20} className="text-white" />
                        </div>
                        <span className="text-2xl font-bold tracking-tight text-gray-900">TuitionsInIndia</span>
                    </Link>
                    
                    {searchParams.get('intent') === 'unlock' && (
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-full text-xs font-black uppercase tracking-widest mb-6 animate-bounce shadow-lg shadow-blue-600/20">
                            <Star size={14} fill="currentColor" /> One step closer to unlocking your tutor
                        </div>
                    )}

                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
                        How would you like to <span className="text-blue-600">get started?</span>
                    </h1>
                    <p className="text-lg text-gray-500 font-medium max-w-2xl mx-auto">
                        Select your role to create your free account on India's most trusted tuition marketplace.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {roles.map((role, idx) => (
                        <div
                            key={role.id}
                            className={`group bg-white rounded-3xl border border-gray-200 p-8 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col ${role.cardHover}`}
                        >
                            <div className={`w-16 h-16 rounded-2xl ${role.color} border flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                <role.icon size={28} />
                            </div>

                            <h3 className="text-xl font-bold text-gray-900 mb-2">{role.title}</h3>
                            <p className="text-gray-500 text-sm font-medium mb-6 leading-relaxed">
                                {role.description}
                            </p>

                            <div className="space-y-3 mb-8 flex-grow">
                                {role.features.map((feature, fIdx) => (
                                    <div key={fIdx} className="flex items-start gap-2.5 text-sm font-medium text-gray-600">
                                        <CheckCircle2 size={16} className="text-green-500 mt-0.5 shrink-0" />
                                        {feature}
                                    </div>
                                ))}
                            </div>

                            <Link
                                href={role.link}
                                className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl text-center text-sm hover:bg-blue-700 transition-colors shadow-sm active:scale-[0.98] flex items-center justify-center gap-2"
                            >
                                Continue as {role.id === 'institute' ? 'Institute' : role.id.charAt(0).toUpperCase() + role.id.slice(1)}
                                <ArrowRight size={16} />
                            </Link>
                        </div>
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <p className="text-gray-400 text-sm font-medium">
                        Already have an account? <Link href="/login" className="text-blue-600 font-bold hover:underline">Log in here</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
