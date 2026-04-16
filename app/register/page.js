"use client";

import { Suspense } from "react";
import Link from "next/link";
import { 
    UserPlus, GraduationCap, Building2, User, ArrowRight
} from "lucide-react";

export default function RegisterLanding() {
    const roles = [
        {
            id: "student",
            title: "I am a Student",
            desc: "Looking for local tutors or professional home tuition experts for academic growth.",
            icon: GraduationCap,
            href: "/register/student"
        },
        {
            id: "tutor",
            title: "I am a Tutor",
            desc: "Join as a subject expert, build your professional profile, and connect with students.",
            icon: User,
            href: "/register/tutor"
        },
        {
            id: "institute",
            title: "I am an Institute",
            desc: "Manage your coaching center, list courses, and reach students across India.",
            icon: Building2,
            href: "/register/institute"
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 pt-24 pb-12">
            <div className="max-w-4xl w-full text-center space-y-4 mb-16">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-xl text-xs font-bold mb-4">
                    <UserPlus size={14} /> Join the Marketplace
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">Create your Account</h1>
                <p className="text-gray-500 font-medium text-lg max-w-xl mx-auto">
                    Select your identity to get tailored tools and connect with the right people in our educational ecosystem.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
                {roles.map((role) => (
                    <Link 
                        key={role.id} 
                        href={role.href}
                        className="group bg-white rounded-3xl p-8 md:p-10 border border-gray-200 shadow-sm hover:shadow-xl hover:border-blue-500 hover:-translate-y-2 transition-all flex flex-col items-center text-center relative overflow-hidden"
                    >
                        <div className={`size-20 rounded-2xl bg-${role.id === 'student' ? 'blue' : role.id === 'tutor' ? 'indigo' : 'slate'}-50 flex items-center justify-center text-${role.id === 'student' ? 'blue' : role.id === 'tutor' ? 'indigo' : 'slate'}-600 mb-8 transition-colors group-hover:bg-blue-600 group-hover:text-white`}>
                            <role.icon size={32} />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">{role.title}</h2>
                        <p className="text-gray-500 font-medium text-sm leading-relaxed mb-10">
                            {role.desc}
                        </p>
                        <div className="mt-auto w-full flex items-center justify-center gap-2 py-4 bg-gray-50 rounded-2xl text-gray-900 font-bold text-sm tracking-tight group-hover:bg-blue-600 group-hover:text-white transition-all">
                            Join as {role.id.charAt(0).toUpperCase() + role.id.slice(1)} <ArrowRight size={16} />
                        </div>
                    </Link>
                ))}
            </div>

            <p className="mt-16 text-gray-400 font-medium text-sm">
                Already part of the community? <Link href="/login" className="text-blue-600 hover:underline font-bold">Log In here</Link>
            </p>
        </div>
    );
}
