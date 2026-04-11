"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { 
    ChevronRight, 
    ArrowLeft, 
    BookOpen, 
    GraduationCap, 
    Award, 
    Zap, 
    Target,
    Users
} from "lucide-react";

const GRADES_OPTIONS = [
    { id: "p5", label: "Primary (1-5)", desc: "Foundational years and basic skill development." },
    { id: "m8", label: "Middle (6-8)", desc: "Core subjects and conceptual understanding." },
    { id: "h10", label: "High School (9-10)", desc: "Board preparation and secondary excellence." },
    { id: "s12", label: "Higher Secondary (11-12)", desc: "Stream-specific focus and board exams." },
    { id: "ug", label: "Undergraduate", desc: "College-level specialized learning." },
    { id: "comp", label: "Competitive Exams", desc: "IIT JEE, NEET, UPSC, and Entrance prep." },
    { id: "hobby", label: "Hobby / Skill-based", desc: "Extracurriculars and creative learning." }
];

function SelectLevelContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const subject = searchParams.get("subject") || "Maths";
    const [gradeCounts, setGradeCounts] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGradeCounts = async () => {
            try {
                const res = await fetch(`/api/subjects?subject=${encodeURIComponent(subject)}`);
                const data = await res.json();
                setGradeCounts(data);
            } catch (error) {
                console.error("Failed to fetch grade counts:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchGradeCounts();
    }, [subject]);

    const handleSelectLevel = (level) => {
        try {
            localStorage.setItem("last_browsed_subject", subject);
            localStorage.setItem("last_browsed_grade", level);
        } catch (e) {}

        const params = new URLSearchParams();
        params.set("subject", subject);
        params.set("grade", level);
        params.set("role", "TUTOR");
        router.push(`/search?${params.toString()}`);
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-800 antialiased pt-32 pb-20">
            <div className="max-w-4xl mx-auto px-6">
                
                {/* Header Context */}
                <div className="text-center mb-16 space-y-4">
                    <button onClick={() => router.back()} className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-blue-600 transition-all mb-4">
                        <ArrowLeft size={16} /> Change Subject
                    </button>
                    <div className="flex items-center justify-center gap-4 mb-2">
                        <div className="size-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-100">
                            <BookOpen size={24} />
                        </div>
                        <span className="text-blue-600 font-black uppercase text-sm tracking-widest">Excellence in {subject}</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-none">
                        Which <span className="text-blue-600">Level</span> are you looking for?
                    </h1>
                    <p className="text-gray-500 text-lg font-medium max-w-xl mx-auto leading-relaxed">
                        We found {Object.values(gradeCounts).reduce((a, b) => a + b, 0)} experts specializes in {subject}. Please select your target level.
                    </p>
                </div>

                {/* Level Selection Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {GRADES_OPTIONS.map((opt) => {
                        const count = gradeCounts[opt.label] || 0;
                        return (
                            <button
                                key={opt.id}
                                onClick={() => handleSelectLevel(opt.label)}
                                className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:border-blue-500 hover:shadow-xl hover:shadow-blue-50 transition-all text-left flex items-start gap-5 group"
                            >
                                <div className="size-12 rounded-2xl bg-gray-50 text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-600 flex items-center justify-center transition-colors shrink-0">
                                    {opt.id === 'comp' ? <Trophy size={22} /> : opt.id === 'hobby' ? <Zap size={22} /> : <GraduationCap size={22} />}
                                </div>
                                <div className="space-y-1 w-full">
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-black text-gray-900 text-lg group-hover:text-blue-600 transition-colors tracking-tight">{opt.label}</h3>
                                            <ChevronRight size={16} className="text-gray-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                        </div>
                                        {!loading && (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-black uppercase tracking-wider group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                                <Users size={12} /> {count} 
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-gray-400 text-sm font-medium leading-relaxed">{opt.desc}</p>
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Help/Inquiry Footer */}
                <div className="mt-16 bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 justify-center md:justify-start">
                            <Target size={18} className="text-amber-500" />
                            <span className="text-amber-600 font-bold uppercase text-xs tracking-widest">Need more precision?</span>
                        </div>
                        <h4 className="text-xl font-bold text-gray-900">Get a tailored search</h4>
                        <p className="text-gray-500 text-sm font-medium">Post your specific requirements and let tutors reach out to you.</p>
                    </div>
                    <div className="flex gap-4">
                        <Link href="/post-requirement" className="px-8 py-4 bg-gray-900 text-white rounded-2xl font-bold text-sm hover:bg-black transition-all shadow-lg hover:shadow-gray-200">
                            Post Requirement
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Trophy({ size, className }) {
    return <Award size={size} className={className} />;
}

export default function SelectLevelPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center p-20"><div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>}>
            <SelectLevelContent />
        </Suspense>
    );
}
