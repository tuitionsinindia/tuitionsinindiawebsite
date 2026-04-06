"use client";

import { useState } from "react";
import { ChevronDown, CircleHelp, ShieldCheck } from "lucide-react";

export default function FAQ({ items }) {
    const [openIndex, setOpenIndex] = useState(0);

    return (
        <div className="space-y-6">
            {items.map((item, index) => (
                <div
                    key={index}
                    className={`group transition-all duration-500 rounded-[2.5rem] border overflow-hidden ${
                        openIndex === index 
                        ? "bg-surface-dark border-primary/40 shadow-2xl shadow-primary/10" 
                        : "bg-surface-dark/40 border-border-dark hover:border-primary/20"
                    }`}
                >
                    <button
                        onClick={() => setOpenIndex(openIndex === index ? null : index)}
                        className="w-full px-10 py-8 flex items-center justify-between text-left transition-all"
                    >
                        <div className="flex items-center gap-6 pr-8">
                            <div className={`size-10 rounded-xl flex items-center justify-center transition-all ${
                                openIndex === index ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-background-dark border border-border-dark text-on-surface-dark/40 group-hover:text-primary"
                            }`}>
                                <CircleHelp size={18} />
                            </div>
                            <span className={`text-xl font-black tracking-tight transition-colors ${
                                openIndex === index ? "text-white" : "text-on-surface-dark group-hover:text-primary"
                            }`}>
                                {item.question}
                            </span>
                        </div>
                        <div className={`p-2 rounded-xl transition-all duration-500 ${
                            openIndex === index ? "bg-primary text-white rotate-180 shadow-lg" : "bg-background-dark border border-border-dark text-on-surface-dark/40"
                        }`}>
                            <ChevronDown size={18} strokeWidth={3} />
                        </div>
                    </button>
                    <div
                        className={`transition-all duration-500 ease-in-out px-10 overflow-hidden ${
                            openIndex === index ? 'pb-10 opacity-100 max-h-[800px]' : 'max-h-0 opacity-0'
                        }`}
                    >
                        <div className="pl-16 border-l-2 border-primary/20 ml-5">
                            <p className="text-on-surface-dark/60 font-medium text-lg leading-relaxed italic">
                                "{item.answer}"
                            </p>
                            <div className="mt-6 flex items-center gap-2">
                                <ShieldCheck size={12} className="text-primary" />
                                <span className="text-primary text-[9px] font-black uppercase tracking-[0.2em]">Institutional Verification</span>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
