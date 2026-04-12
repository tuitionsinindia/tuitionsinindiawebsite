"use client";

import { useEffect, useState } from "react";
import { Zap, ShieldCheck, Target } from "lucide-react";

export default function MatchBadge({ score, label, showDetails = false, factors = [] }) {
    const [animatedScore, setAnimatedScore] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => setAnimatedScore(score), 300);
        return () => clearTimeout(timer);
    }, [score]);

    const getColorClass = () => {
        if (score >= 85) return "text-emerald-500 stroke-emerald-500 fill-emerald-500/10 border-emerald-500/20";
        if (score >= 60) return "text-blue-500 stroke-blue-500 fill-blue-500/10 border-blue-500/20";
        return "text-amber-500 stroke-amber-500 fill-amber-500/10 border-amber-500/20";
    };

    const circumference = 2 * Math.PI * 18;
    const offset = circumference - (animatedScore / 100) * circumference;

    return (
        <div className={`inline-flex flex-col items-center gap-4 p-6 rounded-[2.5rem] bg-white border ${getColorClass()} shadow-md transition-all group relative overflow-hidden`}>
            {/* Background Glow */}
            <div className={`absolute inset-0 opacity-[0.03] pointer-events-none transition-opacity duration-1000 ${score >= 85 ? 'bg-emerald-500' : 'bg-blue-500'}`}></div>

            <div className="relative size-24 flex items-center justify-center">
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
                    <span className="text-3xl font-black italic tracking-tighter leading-none">{animatedScore}%</span>
                    <span className="text-xs font-black uppercase tracking-widest opacity-40 leading-none mt-1">AFFINITY</span>
                </div>
            </div>

            <div className="text-center">
                <div className="flex items-center justify-center gap-1.5 mb-1">
                    {score >= 85 ? <Zap size={10} className="fill-current" /> : <Target size={10} />}
                    <span className="text-xs font-black uppercase tracking-[0.2em] italic leading-none">{label?.replace('_', ' ')}</span>
                </div>
                {showDetails && (
                    <div className="mt-4 flex flex-wrap justify-center gap-2 max-w-[200px]">
                        {factors.map((f, i) => (
                            <span key={i} className="px-2 py-0.5 bg-white/5 rounded-md text-xs font-black uppercase tracking-widest text-white/40 italic">
                                {f.label}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
