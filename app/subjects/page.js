"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
    BookOpen, 
    ArrowRight, 
    CheckCircle2, 
    Search, 
    GraduationCap, 
    ShieldCheck, 
    Sparkles,
    Flame,
    Zap,
    TrendingUp,
    Library
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
        <div className="min-h-screen bg-background-dark text-on-background-dark font-sans selection:bg-primary/30">


            <main className="pt-40 pb-32">
                {/* Hero Section - Abstract Analytics */}
                <div className="max-w-7xl mx-auto px-6 mb-24">
                    <div className="flex flex-col md:flex-row items-end justify-between gap-12">
                        <div className="max-w-3xl">
                            <div className="flex items-center gap-3 mb-6 animate-fade-in">
                                <div className="size-2 bg-primary rounded-full animate-pulse"></div>
                                <span className="text-primary font-black uppercase tracking-[0.3em] text-xs">Academic Intelligence Hub</span>
                            </div>
                            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none mb-8">
                                Browse <span className="text-primary italic font-serif lowercase tracking-normal">expert</span> <br/>
                                <span className="underline decoration-primary/20 decoration-8 underline-offset-8">Inventories</span>.
                            </h1>
                            <p className="text-on-background-dark/60 text-xl font-medium leading-relaxed max-w-2xl">
                                Navigate through our subject categories below to find verified tutors.
                            </p>
                        </div>
                        <div className="hidden lg:block bg-surface-dark p-8 rounded-[3rem] border border-border-dark shadow-4xl rotate-3 translate-y-6">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                                    <TrendingUp size={24} className="text-primary" />
                                </div>
                                <div>
                                    <p className="text-xs font-black uppercase tracking-widest text-primary">Live Demand</p>
                                    <p className="text-white font-black">STEM Subjects +12%</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="h-2 w-48 bg-border-dark rounded-full overflow-hidden">
                                    <div className="h-full w-2/3 bg-primary"></div>
                                </div>
                                <div className="h-2 w-32 bg-border-dark rounded-full overflow-hidden">
                                    <div className="h-full w-1/2 bg-blue-400"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Grade Selection Grid */}
                <div className="max-w-7xl mx-auto px-6 mb-32">
                    <div className="flex items-center justify-between mb-12">
                        <div className="flex items-center gap-4">
                            <div className="size-12 rounded-2xl bg-surface-dark border border-border-dark flex items-center justify-center font-black text-primary italic">01</div>
                            <h2 className="text-3xl font-black uppercase tracking-tight">Institutional <span className="text-primary">Levels</span></h2>
                        </div>
                        <div className="hidden md:flex h-px flex-1 bg-border-dark mx-12"></div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {GRADES.map((grade) => (
                            <button
                                key={grade}
                                onClick={() => setSelectedGrade(grade)}
                                className={`p-10 rounded-[3rem] border-2 transition-all text-left relative overflow-hidden group ${
                                    selectedGrade === grade 
                                    ? "bg-primary border-primary text-white shadow-2xl shadow-primary/30 scale-[1.03] z-10" 
                                    : "bg-surface-dark border-border-dark text-on-surface-dark hover:border-primary/40 hover:translate-y-[-4px]"
                                }`}
                            >
                                {selectedGrade === grade && (
                                    <div className="absolute -right-4 -top-4 size-24 bg-white/10 rounded-full blur-2xl"></div>
                                )}
                                <div className="flex justify-between items-start mb-6">
                                    <div className={`p-3 rounded-2xl ${selectedGrade === grade ? "bg-white/20" : "bg-background-dark border border-border-dark"}`}>
                                        <GraduationCap size={20} className={selectedGrade === grade ? "text-white" : "text-primary"} />
                                    </div>
                                    {selectedGrade === grade && (
                                        <div className="bg-white text-primary p-2 rounded-xl shadow-lg">
                                            <CheckCircle2 size={16} strokeWidth={3} />
                                        </div>
                                    )}
                                </div>
                                <span className={`font-black uppercase tracking-widest text-xs mb-2 block ${selectedGrade === grade ? "text-white" : "text-primary"}`}>Level Category</span>
                                <h3 className="text-xl font-black leading-tight tracking-tight mb-4">{grade}</h3>
                                <p className={`text-xs font-black uppercase tracking-[0.2em] ${selectedGrade === grade ? "text-white/80" : "text-on-surface-dark/40"}`}>
                                    {GRADE_SUBJECT_MAPPING[grade].length} Verified Domains
                                </p>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Subject Selection Area */}
                <div className="max-w-7xl mx-auto px-6 relative">
                    <div className="absolute -left-20 top-0 size-[600px] bg-primary/5 rounded-full blur-[120px] -z-10 animate-pulse"></div>
                    
                    <div className="flex items-center gap-4 mb-14">
                        <div className="size-12 rounded-2xl bg-surface-dark border border-border-dark flex items-center justify-center font-black text-primary italic">02</div>
                        <h2 className="text-3xl font-black uppercase tracking-tight">Available <span className="text-primary italic">Expertise</span></h2>
                    </div>

                    <div className="bg-surface-dark/40 backdrop-blur-3xl rounded-[4rem] border border-border-dark p-12 md:p-20 shadow-inner">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {GRADE_SUBJECT_MAPPING[selectedGrade].map((subject, idx) => (
                                <button
                                    key={subject}
                                    onClick={() => handleSubjectClick(subject)}
                                    className="p-10 rounded-[2.5rem] bg-background-dark border border-border-dark text-left hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 transition-all group relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                                        <Library size={80} className="text-primary" />
                                    </div>
                                    <div className="flex items-start justify-between mb-8">
                                        <div className="size-12 rounded-2xl bg-surface-dark items-center justify-center flex border border-border-dark text-primary shadow-lg group-hover:bg-primary group-hover:text-white transition-all">
                                            <span className="text-sm font-black">{String(idx + 1).padStart(2, '0')}</span>
                                        </div>
                                        <div className="opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                                            <div className="bg-primary/20 p-2 rounded-xl">
                                                <Zap size={14} className="text-primary fill-primary" />
                                            </div>
                                        </div>
                                    </div>
                                    <h3 className="text-2xl font-black text-white group-hover:text-primary transition-colors tracking-tighter mb-2 uppercase italic">{subject}</h3>
                                    <p className="text-on-background-dark/40 text-xs font-black uppercase tracking-[0.2em]">Verified Asset Directory</p>
                                    
                                    <div className="mt-8 pt-6 border-t border-border-dark flex items-center justify-between">
                                        <span className="text-primary font-black uppercase tracking-widest text-xs">Explore Academy</span>
                                        <ArrowRight size={16} className="text-primary group-hover:translate-x-2 transition-transform" />
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Custom Search CTA */}
                <div className="max-w-5xl mx-auto px-6 mt-40">
                    <div className="bg-primary p-12 md:p-20 rounded-[4rem] relative overflow-hidden shadow-4xl shadow-primary/40 text-center">
                        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
                        <div className="relative z-10">
                            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-6 py-2 rounded-full border border-white/30 mb-10">
                                <ShieldCheck size={16} className="text-white" />
                                <span className="text-white text-xs font-black uppercase tracking-widest">Post Requirement</span>
                            </div>
                            <h2 className="text-4xl md:text-6xl font-black text-white italic tracking-tighter leading-tight mb-8">
                                Domain not found in <br className="hidden md:block" /> the <span className="underline decoration-white/30 decoration-8 underline-offset-8">Primary Inventory</span>?
                            </h2>
                            <p className="text-white/80 font-medium text-lg mb-14 max-w-2xl mx-auto">
                                Our AI system can deploy custom discovery markers. Post a specific requirement and let our matching engine authenticate the perfect educator.
                            </p>
                            <Link 
                                href="/post-requirement" 
                                className="inline-flex items-center gap-4 bg-white text-primary px-12 py-6 rounded-2xl font-black uppercase tracking-[0.25em] text-xs hover:scale-105 active:scale-95 transition-all shadow-3xl"
                            >
                                Deploy Requirement
                                <ArrowRight size={18} strokeWidth={3} />
                            </Link>
                        </div>
                    </div>
                </div>
            </main>

        </div>
    );
}
