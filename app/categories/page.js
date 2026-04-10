"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
    ChevronRight, 
    ArrowLeft, 
    Search,
    ShieldCheck,
    Star,
    ArrowRight,
    Users
} from "lucide-react";
import { SUBJECT_CATEGORIES } from "../../lib/subjects";

export default function CategoriesPage() {
    const router = useRouter();
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [subjectCounts, setSubjectCounts] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCounts = async () => {
            try {
                const res = await fetch("/api/subjects");
                const data = await res.json();
                const countsMap = {};
                data.forEach(item => {
                    countsMap[item.name] = item.count;
                });
                setSubjectCounts(countsMap);
            } catch (error) {
                console.error("Failed to fetch subject counts:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCounts();
    }, []);

    const getCategoryCount = (cat) => {
        return cat.subjects.reduce((sum, sub) => sum + (subjectCounts[sub] || 0), 0);
    };

    const handleSubjectClick = (subject) => {
        router.push(`/select-level?subject=${encodeURIComponent(subject)}`);
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-800 antialiased pt-24 pb-20">
            <div className="max-w-7xl mx-auto px-6">
                
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
                    <div className="space-y-4">
                        <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:gap-3 transition-all">
                            <ArrowLeft size={16} /> Back to Home
                        </Link>
                        <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
                            Browse All <span className="text-blue-600">Categories</span>
                        </h1>
                        <p className="text-gray-500 text-lg font-medium max-w-2xl">
                            Real-time tutor availability across all academic disciplines. Find the perfect match for your learning journey.
                        </p>
                    </div>
                </div>

                {/* Categories Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* Left Side: Category Navigator */}
                    <div className="lg:col-span-4 space-y-3">
                        {SUBJECT_CATEGORIES.map((cat) => {
                            const count = getCategoryCount(cat);
                            return (
                                <button
                                    key={cat.id}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`w-full text-left p-6 rounded-[2rem] border transition-all flex items-center justify-between group ${
                                        selectedCategory?.id === cat.id 
                                        ? "bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-200 translate-x-2" 
                                        : "bg-white border-gray-100 text-gray-900 hover:border-blue-200 hover:shadow-md"
                                    }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`p-3 rounded-2xl transition-colors ${
                                            selectedCategory?.id === cat.id ? "bg-white/20" : "bg-blue-50 text-blue-600"
                                        }`}>
                                            <cat.icon size={24} />
                                        </div>
                                        <div>
                                            <p className="font-bold">{cat.name}</p>
                                            <div className="flex items-center gap-2">
                                                <p className={`text-[10px] uppercase font-black tracking-widest ${
                                                    selectedCategory?.id === cat.id ? "text-blue-200" : "text-gray-400"
                                                }`}>
                                                    {cat.subjects.length} Subjects
                                                </p>
                                                {!loading && (
                                                    <>
                                                        <span className="text-[10px] text-gray-300">•</span>
                                                        <span className={`text-[10px] font-bold ${
                                                            selectedCategory?.id === cat.id ? "text-white" : "text-blue-600"
                                                        }`}>
                                                            {count} Tutors
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <ChevronRight size={18} className={`transition-transform ${
                                        selectedCategory?.id === cat.id ? "translate-x-1" : "text-gray-300 group-hover:text-blue-600 group-hover:translate-x-1"
                                    }`} />
                                </button>
                            );
                        })}
                    </div>

                    {/* Right Side: Subjects Detail */}
                    <div className="lg:col-span-8">
                        {selectedCategory ? (
                            <div className="bg-white rounded-[3rem] p-10 md:p-16 border border-gray-100 shadow-sm animate-in fade-in slide-in-from-right-4 duration-500">
                                <div className="flex items-start justify-between mb-10">
                                    <div className="space-y-2">
                                        <div className="size-16 rounded-3xl bg-blue-600 text-white flex items-center justify-center mb-4 shadow-lg shadow-blue-100">
                                            <selectedCategory.icon size={32} />
                                        </div>
                                        <h2 className="text-3xl font-black text-gray-900">{selectedCategory.name}</h2>
                                        <p className="text-gray-500 font-medium">{selectedCategory.description}</p>
                                    </div>
                                    <div className="hidden md:block">
                                        <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-xs font-black uppercase tracking-widest border border-blue-100">
                                            <Users size={14} /> {getCategoryCount(selectedCategory)} Experts Available
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {selectedCategory.subjects.map((subject, idx) => (
                                        <button 
                                            key={idx}
                                            onClick={() => handleSubjectClick(subject)}
                                            className="group flex items-center justify-between p-5 bg-gray-50 border border-gray-100 rounded-2xl hover:bg-blue-600 hover:border-blue-600 transition-all text-left"
                                        >
                                            <div className="flex flex-col">
                                                <span className="font-bold text-gray-800 group-hover:text-white transition-colors">{subject}</span>
                                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-blue-200 transition-colors mt-1">
                                                    {subjectCounts[subject] || 0} Tutors
                                                </span>
                                            </div>
                                            <div className="size-8 rounded-xl bg-white text-blue-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0 shadow-sm">
                                                <Search size={16} />
                                            </div>
                                        </button>
                                    ))}
                                </div>

                                <div className="mt-12 p-8 bg-blue-50 rounded-[2rem] border border-blue-100 flex flex-col md:flex-row items-center justify-between gap-6">
                                    <div className="text-center md:text-left">
                                        <p className="text-blue-900 font-black text-lg">Can't find a specific subject?</p>
                                        <p className="text-blue-700 text-sm font-medium">Our marketplace handles custom requests for all levels.</p>
                                    </div>
                                    <Link href="/post-requirement" className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all flex items-center gap-2">
                                        Post Requirement <ArrowRight size={18} />
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <div className="h-full bg-white rounded-[3rem] border border-dashed border-gray-200 flex flex-col items-center justify-center text-center p-20 space-y-6">
                                <div className="size-24 rounded-[2rem] bg-gray-50 flex items-center justify-center text-gray-300">
                                    <Search size={48} />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-gray-400 tracking-tight">Select a category</h3>
                                    <p className="text-gray-400 font-medium">Choose a category to explore specialized subjects and availability counts.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Popular Insights */}
                <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { title: "Top Rated", desc: "Browse tutors with 4.5+ star ratings from verified parents.", color: "amber", icon: Star },
                        { title: "Nearby You", desc: "Find home tutors within 10km radius of your location.", color: "blue", icon: Users },
                        { title: "Instant Match", desc: "Get connected with a tutor in less than 24 hours.", color: "green", icon: ShieldCheck }
                    ].map((item, i) => (
                        <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
                            <div className={`size-12 rounded-2xl bg-${item.color}-50 text-${item.color}-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                <item.icon size={24} />
                            </div>
                            <h4 className="text-xl font-black text-gray-900 mb-2">{item.title}</h4>
                            <p className="text-gray-500 font-medium leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

