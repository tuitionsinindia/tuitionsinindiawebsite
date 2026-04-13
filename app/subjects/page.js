"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, GraduationCap, Search } from "lucide-react";

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
        const params = new URLSearchParams({ subject, grade: selectedGrade || "", role: "TUTOR" });
        router.push(`/search?${params.toString()}`);
    };

    return (
        <div className="min-h-screen bg-white pt-24 pb-20">
            <main className="max-w-6xl mx-auto px-6">

                {/* Header */}
                <div className="mb-10">
                    <h1 className="text-4xl font-bold text-gray-900 mb-3 tracking-tight">Browse subjects</h1>
                    <p className="text-gray-500 text-lg">
                        Select your grade level below, then choose a subject to find tutors near you.
                    </p>
                </div>

                {/* Grade tabs */}
                <div className="mb-8">
                    <p className="text-sm font-semibold text-gray-700 mb-3">Step 1 — Select your grade</p>
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
                                <div className="flex items-center gap-2 mb-1">
                                    <GraduationCap size={14} className={selectedGrade === grade ? "text-white" : "text-blue-600"} />
                                    <span className={`text-xs font-semibold ${selectedGrade === grade ? "text-blue-100" : "text-gray-400"}`}>
                                        {GRADE_SUBJECT_MAPPING[grade].length} subjects
                                    </span>
                                </div>
                                <p className="font-semibold text-sm leading-tight">{grade}</p>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Subject grid */}
                <div className="mb-12">
                    <p className="text-sm font-semibold text-gray-700 mb-3">Step 2 — Choose a subject</p>
                    <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {GRADE_SUBJECT_MAPPING[selectedGrade].map((subject) => (
                                <button
                                    key={subject}
                                    onClick={() => handleSubjectClick(subject)}
                                    className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-400 hover:shadow-sm transition-all group text-left"
                                >
                                    <span className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                        {subject}
                                    </span>
                                    <ArrowRight size={15} className="text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all shrink-0" />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <div className="bg-blue-600 rounded-2xl p-8 text-center text-white">
                    <div className="flex items-center justify-center gap-2 mb-3">
                        <Search size={18} className="text-blue-200" />
                        <h2 className="text-xl font-bold">Can't find your subject?</h2>
                    </div>
                    <p className="text-blue-100 mb-5 max-w-md mx-auto">
                        Post a requirement and we'll connect you with tutors who can help — even for niche subjects.
                    </p>
                    <Link
                        href="/post-requirement"
                        className="inline-flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors text-sm"
                    >
                        Post your requirement
                        <ArrowRight size={15} strokeWidth={2.5} />
                    </Link>
                </div>

            </main>
        </div>
    );
}
