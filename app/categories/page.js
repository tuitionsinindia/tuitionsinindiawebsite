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
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                    <div className="space-y-3">
                        <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:gap-3 transition-all">
                            <ArrowLeft size={16} /> Back to Home
                        </Link>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
                            Browse All <span className="text-blue-600">Categories</span>
                        </h1>
                        <p className="text-gray-500 text-base max-w-2xl">
                            Find tutors across all academic subjects and skill areas.
                        </p>
                    </div>
                </div>

                {/* Categories Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                    {/* Left Side: Category Navigator */}
                    <div className="lg:col-span-4 space-y-2">
                        {SUBJECT_CATEGORIES.map((cat) => {
                            const count = getCategoryCount(cat);
                            return (
                                <button
                                    key={cat.id}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between group ${
                                        selectedCategory?.id === cat.id
                                        ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200"
                                        : "bg-white border-gray-100 text-gray-900 hover:border-blue-200 hover:shadow-sm"
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2.5 rounded-xl transition-colors ${
                                            selectedCategory?.id === cat.id ? "bg-white/20" : "bg-blue-50 text-blue-600"
                                        }`}>
                                            <cat.icon size={20} />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-sm">{cat.name}</p>
                                            <div className="flex items-center gap-2">
                                                <p className={`text-xs font-medium ${
                                                    selectedCategory?.id === cat.id ? "text-blue-200" : "text-gray-400"
                                                }`}>
                                                    {cat.subjects.length} subjects
                                                </p>
                                                {!loading && (
                                                    <>
                                                        <span className="text-xs text-gray-300">·</span>
                                                        <span className={`text-xs font-semibold ${
                                                            selectedCategory?.id === cat.id ? "text-white" : "text-blue-600"
                                                        }`}>
                                                            {count} tutors
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <ChevronRight size={16} className={`transition-transform ${
                                        selectedCategory?.id === cat.id ? "translate-x-1" : "text-gray-300 group-hover:text-blue-600 group-hover:translate-x-1"
                                    }`} />
                                </button>
                            );
                        })}
                    </div>

                    {/* Right Side: Subjects Detail */}
                    <div className="lg:col-span-8">
                        {selectedCategory ? (
                            <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm">
                                <div className="flex items-start justify-between mb-8">
                                    <div className="space-y-2">
                                        <div className="size-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center mb-3 shadow-sm">
                                            <selectedCategory.icon size={24} />
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-900">{selectedCategory.name}</h2>
                                        <p className="text-gray-500 text-sm">{selectedCategory.description}</p>
                                    </div>
                                    <div className="hidden md:block">
                                        <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-bold border border-blue-100">
                                            <Users size={14} /> {getCategoryCount(selectedCategory)} tutors available
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {selectedCategory.subjects.map((subject, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => handleSubjectClick(subject)}
                                            className="group flex items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-xl hover:bg-blue-600 hover:border-blue-600 transition-all text-left"
                                        >
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-sm text-gray-800 group-hover:text-white transition-colors">{subject}</span>
                                                <span className="text-xs font-medium text-gray-400 group-hover:text-blue-200 transition-colors mt-0.5">
                                                    {subjectCounts[subject] || 0} tutors
                                                </span>
                                            </div>
                                            <div className="size-7 rounded-lg bg-white text-blue-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0 shadow-sm">
                                                <Search size={14} />
                                            </div>
                                        </button>
                                    ))}
                                </div>

                                <div className="mt-8 p-5 bg-blue-50 rounded-2xl border border-blue-100 flex flex-col md:flex-row items-center justify-between gap-4">
                                    <div className="text-center md:text-left">
                                        <p className="text-blue-900 font-bold">Can't find a specific subject?</p>
                                        <p className="text-blue-700 text-sm">Post your requirement and let tutors come to you.</p>
                                    </div>
                                    <Link href="/post-requirement" className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-sm hover:bg-blue-700 transition-all flex items-center gap-2">
                                        Post Requirement <ArrowRight size={16} />
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <div className="h-full bg-white rounded-2xl border border-dashed border-gray-200 flex flex-col items-center justify-center text-center p-12 space-y-4">
                                <div className="size-16 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-300">
                                    <Search size={32} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-400">Select a category</h3>
                                    <p className="text-gray-400 text-sm mt-1">Choose a category to explore subjects and see tutor availability.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Popular Insights */}
                <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { title: "Top Rated", desc: "Browse tutors with 4.5+ star ratings from verified parents.", color: "amber", icon: Star },
                        { title: "Near You", desc: "Find home tutors within 10km of your location.", color: "blue", icon: Users },
                        { title: "Quick Match", desc: "Get connected with a tutor in less than 24 hours.", color: "green", icon: ShieldCheck }
                    ].map((item, i) => (
                        <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                            <div className={`size-10 rounded-xl bg-${item.color}-50 text-${item.color}-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                <item.icon size={20} />
                            </div>
                            <h4 className="text-lg font-bold text-gray-900 mb-1">{item.title}</h4>
                            <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
