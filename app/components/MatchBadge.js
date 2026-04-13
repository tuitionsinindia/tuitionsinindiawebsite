"use client";

import { useEffect, useState } from "react";
import { Zap, Target } from "lucide-react";

export default function MatchBadge({ score, label, showDetails = false, factors = [] }) {
    const [animatedScore, setAnimatedScore] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => setAnimatedScore(score), 300);
        return () => clearTimeout(timer);
    }, [score]);

    const getColorClass = () => {
        if (score >= 85) return "text-emerald-600 stroke-emerald-500 fill-emerald-500/10 border-emerald-200";
        if (score >= 60) return "text-blue-600 stroke-blue-500 fill-blue-500/10 border-blue-200";
        return "text-amber-600 stroke-amber-500 fill-amber-500/10 border-amber-200";
    };

    const circumference = 2 * Math.PI * 18;
    const offset = circumference - (animatedScore / 100) * circumference;

    return (
        <div className={`inline-flex flex-col items-center gap-3 p-5 rounded-2xl bg-white border ${getColorClass()} shadow-sm transition-all`}>
            <div className="relative size-20 flex items-center justify-center">
                <svg className="size-full -rotate-90" viewBox="0 0 44 44">
                    <circle
                        cx="22"
                        cy="22"
                        r="18"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        fill="none"
                        className="opacity-10"
                    />
                    <circle
                        cx="22"
                        cy="22"
                        r="18"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        fill="none"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-out"
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold tracking-tight leading-none">{animatedScore}%</span>
                    <span className="text-xs font-semibold text-gray-400 leading-none mt-1">match</span>
                </div>
            </div>

            <div className="text-center">
                <div className="flex items-center justify-center gap-1.5 mb-1">
                    {score >= 85 ? <Zap size={12} className="fill-current" /> : <Target size={12} />}
                    <span className="text-xs font-semibold leading-none">{label?.replace('_', ' ')}</span>
                </div>
                {showDetails && (
                    <div className="mt-3 flex flex-wrap justify-center gap-1.5 max-w-[200px]">
                        {factors.map((f, i) => (
                            <span key={i} className="px-2 py-1 bg-gray-50 border border-gray-100 rounded-md text-xs font-medium text-gray-500">
                                {f.label}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
