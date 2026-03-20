"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function GetStarted() {
    const router = useRouter();

    const roles = [
        {
            id: "student",
            title: "I am a Student / Parent",
            description: "Looking for a verified expert to help with my academic or skill-based learning journey.",
            icon: "school",
            color: "bg-amber-50 text-amber-600",
            hoverColor: "hover:bg-amber-100/50",
            link: "/post-requirement",
            features: [
                "Post tuition requirements for free",
                "Get matched with verified tutors",
                "Book demo sessions instantly",
                "Manage multiple subjects"
            ]
        },
        {
            id: "tutor",
            title: "I am a Private Tutor",
            description: "A subject expert looking to share my knowledge and grow my professional teaching career.",
            icon: "person_search",
            color: "bg-blue-50 text-blue-600",
            hoverColor: "hover:bg-blue-100/50",
            link: "/register/tutor",
            features: [
                "Create a premium professional profile",
                "Access high-quality student leads",
                "Direct messaging with students",
                "Profile verification badge"
            ]
        },
        {
            id: "institute",
            title: "I represent an Institute",
            description: "A coaching center, school, or training hub looking to reach more students locally and online.",
            icon: "corporate_fare",
            color: "bg-indigo-50 text-indigo-600",
            hoverColor: "hover:bg-indigo-100/50",
            link: "/register/institute",
            features: [
                "Manage multiple instructors",
                "Bulk student lead access",
                "Institutional verification",
                "Advanced batch management"
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-background-dark flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/5 rounded-bl-full blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-accent/5 rounded-tr-full blur-[100px] pointer-events-none"></div>

            <div className="max-w-6xl w-full relative z-10">
                <div className="text-center mb-16 animate-fade-in-up">
                    <Link href="/" className="inline-flex items-center gap-2 mb-8 group">
                        <span className="material-symbols-outlined text-4xl font-bold text-primary group-hover:scale-110 transition-transform">school</span>
                        <span className="text-3xl font-heading font-bold tracking-tight text-slate-900 dark:text-white">TuitionsInIndia</span>
                    </Link>
                    <h1 className="text-4xl md:text-5xl font-heading font-bold text-slate-900 dark:text-white mb-6">
                        How would you like to <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">get started?</span>
                    </h1>
                    <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
                        Select your role to begin your journey with India's most trusted tuition directory platform.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {roles.map((role, idx) => (
                        <div
                            key={role.id}
                            className={`group bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-8 shadow-sm transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 flex flex-col ${role.hoverColor} animate-fade-in-up`}
                            style={{ animationDelay: `${idx * 150}ms` }}
                        >
                            <div className={`size-20 rounded-2xl ${role.color} flex items-center justify-center mb-8 shadow-inner group-hover:scale-110 transition-transform duration-500`}>
                                <span className="material-symbols-outlined text-4xl">{role.icon}</span>
                            </div>

                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 leading-tight">{role.title}</h3>
                            <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
                                {role.description}
                            </p>

                            <div className="space-y-4 mb-10 flex-grow">
                                {role.features.map((feature, fIdx) => (
                                    <div key={fIdx} className="flex items-center gap-3 text-sm font-medium text-slate-600 dark:text-slate-300">
                                        <div className="size-5 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 flex items-center justify-center">
                                            <span className="material-symbols-outlined text-[14px]">check</span>
                                        </div>
                                        {feature}
                                    </div>
                                ))}
                            </div>

                            <Link
                                href={role.link}
                                className="w-full bg-slate-900 dark:bg-slate-800 text-white font-bold py-4 rounded-xl text-center group-hover:bg-primary transition-colors shadow-lg shadow-slate-900/10 group-hover:shadow-primary/30 active:scale-[0.98]"
                            >
                                Continue as {role.id === 'institute' ? 'Institute' : role.id.charAt(0).toUpperCase() + role.id.slice(1)}
                            </Link>
                        </div>
                    ))}
                </div>

                <div className="mt-16 text-center animate-fade-in opacity-70">
                    <p className="text-slate-400 text-sm">
                        Already have an account? <Link href="/login" className="text-primary font-bold hover:underline">Log in here</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
