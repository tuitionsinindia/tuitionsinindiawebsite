"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const GRADE_SUBJECT_MAPPING = {
    "Primary (1-5)": [
        "Mathematics", "EVS (Science)", "English", "Hindi", "Moral Science", 
        "Arts & Craft", "Vocal Music", "Abacus", "Vedic Maths"
    ],
    "Middle (6-8)": [
        "Mathematics", "Physics", "Chemistry", "Biology", "History", "Geography", 
        "Civics", "English", "Hindi", "French", "German", "Computer Science", 
        "Coding", "Music", "Dance", "Yoga"
    ],
    "High School (9-10)": [
        "Mathematics", "Physics", "Chemistry", "Biology", "History", "Geography", 
        "Economics", "Civics", "English", "Hindi", "Sanskrit", "Computer Applications", 
        "Spanish", "German", "French"
    ],
    "Higher Secondary (11-12)": [
        "Mathematics", "Physics", "Chemistry", "Biology", "Economics", "Accountancy", 
        "Business Studies", "History", "Psychology", "Sociology", "Political Science", 
        "Computer Science", "Informatics Practices", "English Core"
    ],
    "Undergraduate": [
        "B.Tech - Core Subjects", "B.Com - Accounts/Tax", "B.Sc - Physics/Maths", 
        "B.A - Literature/History", "BCA - Coding", "BBA - Management", 
        "Engineering Mathematics", "Microbiology", "Biotechnology"
    ],
    "Competitive Exams": [
        "JEE Main/Advanced", "NEET (Medicine)", "UPSC / Civil Services", 
        "CAT / MBA Entrance", "GATE", "Banking (IBPS/SBI)", "SSC CGL", 
        "IELTS / TOEFL", "GRE / GMAT", "SAT / LSAT"
    ],
    "Other": [
        "Spoken English", "Public Speaking", "Personality Development", 
        "Photography", "Digital Marketing", "Chess", "Martial Arts", "Cooking"
    ]
};

const GRADES = Object.keys(GRADE_SUBJECT_MAPPING);

export default function SubjectsPage() {
    const router = useRouter();
    const [selectedGrade, setSelectedGrade] = useState(null);

    const handleSubjectClick = (subject) => {
        // Save context for signup optimization
        sessionStorage.setItem("last_search_subject", subject);
        sessionStorage.setItem("last_search_grade", selectedGrade);
        
        const params = new URLSearchParams({
            subject: subject,
            grade: selectedGrade || "",
            role: "TUTOR"
        });
        router.push(`/search?${params.toString()}`);
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            <header className="bg-white border-b border-slate-100 py-10 px-6">
                <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
                    <Link href="/" className="inline-flex items-center gap-2 mb-6 group">
                        <span className="material-symbols-outlined text-3xl font-bold text-primary group-hover:scale-110 transition-transform">school</span>
                        <span className="text-2xl font-black tracking-tight text-slate-900">TuitionsInIndia</span>
                    </Link>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">Find Tutors by <span className="text-primary italic font-serif">Subject</span></h1>
                    <p className="text-slate-500 font-bold max-w-2xl">
                        Select your grade level first to see relevant subjects and verified home tutors in your area.
                    </p>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-16">
                {/* 1. GRADE SELECTION */}
                <div className="mb-16">
                    <div className="flex items-center gap-4 mb-10">
                        <div className="size-10 rounded-xl bg-primary text-white flex items-center justify-center font-black">1</div>
                        <h2 className="text-2xl font-black text-slate-900">Select Grade / Level</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {GRADES.map((grade) => (
                            <button
                                key={grade}
                                onClick={() => setSelectedGrade(grade === selectedGrade ? null : grade)}
                                className={`p-6 rounded-[2rem] border-2 transition-all text-left group ${
                                    selectedGrade === grade 
                                    ? "bg-primary border-primary text-white shadow-2xl shadow-primary/20 scale-[1.02]" 
                                    : "bg-white border-slate-100 text-slate-600 hover:border-primary/30 hover:shadow-xl"
                                }`}
                            >
                                <div className="flex justify-between items-center">
                                    <span className="font-black uppercase tracking-widest text-xs">{grade}</span>
                                    {selectedGrade === grade && (
                                        <span className="material-symbols-outlined text-white">check_circle</span>
                                    )}
                                </div>
                                <p className={`mt-2 text-sm font-bold ${selectedGrade === grade ? "text-white/80" : "text-slate-400"}`}>
                                    {GRADE_SUBJECT_MAPPING[grade].length} subjects available
                                </p>
                            </button>
                        ))}
                    </div>
                </div>

                {/* 2. SUBJECT SELECTION (Show only if grade selected) */}
                <div className={`transition-all duration-500 overflow-hidden ${selectedGrade ? "opacity-100 max-h-[2000px]" : "opacity-30 pointer-events-none max-h-0"}`}>
                    <div className="flex items-center gap-4 mb-10">
                        <div className="size-10 rounded-xl bg-primary text-white flex items-center justify-center font-black">2</div>
                        <h2 className="text-2xl font-black text-slate-900">Pick a Subject</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {selectedGrade && GRADE_SUBJECT_MAPPING[selectedGrade].map((subject) => (
                            <button
                                key={subject}
                                onClick={() => handleSubjectClick(subject)}
                                className="bg-white p-8 rounded-[2.5rem] border border-slate-100 text-left hover:shadow-2xl hover:border-primary/20 transition-all group flex items-center justify-between"
                            >
                                <div>
                                    <h3 className="font-black text-slate-900 group-hover:text-primary transition-colors text-lg uppercase tracking-tight">{subject}</h3>
                                    <p className="text-slate-400 text-xs font-bold mt-1">Browse verified experts</p>
                                </div>
                                <div className="size-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-primary group-hover:text-white transition-all">
                                    <span className="material-symbols-outlined">arrow_forward</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {!selectedGrade && (
                    <div className="py-20 text-center bg-slate-100/50 rounded-[4rem] border-4 border-dashed border-slate-200">
                        <span className="material-symbols-outlined text-6xl text-slate-200 mb-6">ads_click</span>
                        <p className="text-xl font-black text-slate-400">Please select a Grade level above to see subjects.</p>
                    </div>
                )}
            </main>

            <footer className="bg-slate-900 py-20 px-6 mt-20">
                <div className="max-w-4xl mx-auto text-center text-white">
                    <h2 className="text-3xl font-black mb-6 italic font-serif">Don't see your subject?</h2>
                    <p className="text-slate-400 font-bold mb-10">
                        Our directory is growing every day. You can post a custom requirement and our AI will find the perfect match for you.
                    </p>
                    <Link href="/post-requirement" className="inline-flex items-center gap-3 bg-white text-slate-900 px-10 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-2xl shadow-black/20">
                        Post Requirement
                        <span className="material-symbols-outlined">post_add</span>
                    </Link>
                </div>
            </footer>
        </div>
    );
}
