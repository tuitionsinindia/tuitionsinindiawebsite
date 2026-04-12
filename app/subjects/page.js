"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    ArrowRight,
    CheckCircle2,
    GraduationCap,
    Zap
} from "lucide-react";


const GRADE_SUBJECT_MAPPING = {
    "Primary (1-5)": [
        "Maths", "EVS (Science)", "English", "Hindi", "Moral Science",
        "Arts & Craft", "Vocal Music", "Abacus", "Vedic Maths"
    ],
    "Middle (6-8)": [
        "Maths", "Physics", "Chemistry", "Biology", "History", "Geography",
        "Civics", "English", "Hindi", "French", "German", "Computer Science",
        "Coding", "Music", "Dance", "Yoga"
    ],
    "High School (9-10)": [
        "Maths", "Physics", "Chemistry", "Biology", "History", "Geography",
        "Economics", "Civics", "English", "Hindi", "Sanskrit", "Computer Applications",
        "Spanish", "German", "French"
    ],
    "Higher Secondary (11-12)": [
        "Maths", "Physics", "Chemistry", "Biology", "Economics", "Accountancy",
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
    "Specialized Skills": [
        "Spoken English", "Public Speaking", "Personality Development",
        "Photography", "Digital Marketing", "Chess", "Martial Arts", "Cooking"
    ]
};

const GRADES = Object.keys(GRADE_SUBJECT_MAPPING);

export default function SubjectsPage() {
    const router = useRouter();
    const [selectedGrade, setSelectedGrade] = useState("High School (9-10)");

    const handleSubjectClick = (subject) => {
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
        <div className="min-h-screen bg-white">
            {/* Hero */}
            <section className="bg-gray-50 border-b border-gray-100 py-16 px-6">
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">Browse by Subject</h1>
                    <p className="text-gray-500 text-lg max-w-2xl">
                        Select your grade level and subject to find verified tutors near you.
                    </p>
                </div>
            </section>

            <div className="max-w-6xl mx-auto px-6 py-12 space-y-12">
                {/* Grade Selection */}
                <div>
                    <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Select Grade Level</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                        {GRADES.map((grade) => (
                            <button
                                key={grade}
                                onClick={() => setSelectedGrade(grade)}
                                className={`p-4 rounded-xl border-2 text-left transition-all ${
                                    selectedGrade === grade
                                    ? "bg-blue-600 border-blue-600 text-white"
                                    : "bg-white border-gray-200 text-gray-700 hover:border-blue-300"
                                }`}
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <GraduationCap size={18} className={selectedGrade === grade ? "text-blue-100" : "text-gray-400"} />
                                    {selectedGrade === grade && <CheckCircle2 size={16} className="text-white" />}
                                </div>
                                <h3 className="text-sm font-semibold leading-tight mb-1">{grade}</h3>
                                <p className={`text-xs ${selectedGrade === grade ? "text-blue-100" : "text-gray-400"}`}>
                                    {GRADE_SUBJECT_MAPPING[grade].length} subjects
                                </p>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Subject Grid */}
                <div>
                    <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                        Subjects for {selectedGrade}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {GRADE_SUBJECT_MAPPING[selectedGrade].map((subject, idx) => (
                            <button
                                key={subject}
                                onClick={() => handleSubjectClick(subject)}
                                className="p-5 rounded-xl bg-white border border-gray-200 text-left hover:border-blue-500 hover:shadow-sm transition-all group"
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-xs font-medium text-gray-400">{String(idx + 1).padStart(2, '0')}</span>
                                    <ArrowRight size={14} className="text-gray-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                                </div>
                                <h3 className="text-base font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{subject}</h3>
                                <p className="text-xs text-gray-400 mt-1">Find tutors</p>
                            </button>
                        ))}
                    </div>
                </div>

                {/* CTA */}
                <div className="bg-blue-600 rounded-2xl p-10 text-center text-white">
                    <Zap size={28} className="mx-auto mb-4 text-blue-200" />
                    <h2 className="text-2xl font-bold mb-2">Can't find your subject?</h2>
                    <p className="text-blue-100 mb-6 max-w-lg mx-auto">
                        Post a requirement and let tutors come to you. Our matching system will find the right fit.
                    </p>
                    <Link
                        href="/post-requirement"
                        className="inline-flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold text-sm hover:bg-blue-50 transition-colors"
                    >
                        Post a Requirement
                        <ArrowRight size={16} />
                    </Link>
                </div>
            </div>
        </div>
    );
}
