"use client";

import { useState } from "react";
import { ChevronDown, CircleHelp, ShieldCheck } from "lucide-react";

export default function FAQ({ items }) {
    const [openIndex, setOpenIndex] = useState(0);

    if (!items || items.length === 0) return null;

    return (
        <div className="space-y-6">
            {items.map((item, index) => (
                <div
                    key={index}
                    className={`group transition-all duration-500 rounded-[2.5rem] border overflow-hidden ${
                        openIndex === index 
                        ? "bg-white border-blue-600/20 shadow-4xl shadow-blue-600/5" 
                        : "bg-gray-50/50 border-gray-100 hover:border-blue-600/20"
                    }`}
                >
                    <button
                        onClick={() => setOpenIndex(openIndex === index ? null : index)}
                        className="w-full px-10 py-8 flex items-center justify-between text-left transition-all"
                    >
                        <div className="flex items-center gap-6 pr-8">
                            <div className={`size-12 rounded-2xl flex items-center justify-center transition-all ${
                                openIndex === index ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "bg-white border border-gray-100 text-gray-400 group-hover:text-blue-600"
                            }`}>
                                <CircleHelp size={22} strokeWidth={1.5} />
                            </div>
                            <span className={`text-xl md:text-2xl font-black tracking-tighter transition-colors uppercase italic ${
                                openIndex === index ? "text-gray-900" : "text-gray-400 group-hover:text-blue-600"
                            }`}>
                                {item.question}
                            </span>
                        </div>
                        <div className={`p-3 rounded-2xl transition-all duration-500 ${
                            openIndex === index ? "bg-blue-600 text-white rotate-180 shadow-lg" : "bg-white border border-gray-100 text-gray-300"
                        }`}>
                            <ChevronDown size={20} strokeWidth={3} />
                        </div>
                    </button>
                    <div
                        className={`transition-all duration-500 ease-in-out px-10 overflow-hidden ${
                            openIndex === index ? 'pb-12 opacity-100 max-h-[800px]' : 'max-h-0 opacity-0'
                        }`}
                    >
                        <div className="pl-16 border-l-4 border-blue-600/10 ml-6">
                            <p className="text-gray-500 font-medium text-lg md:text-xl leading-relaxed italic">
                                "{item.answer}"
                            </p>
                            <div className="mt-8 flex items-center gap-3">
                                <div className="bg-blue-600/10 p-2 rounded-lg">
                                    <ShieldCheck size={14} className="text-blue-600" />
                                </div>
                                <span className="text-blue-600 text-xs font-black uppercase tracking-[0.3em] italic">Institutional Verification Protocol Active</span>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
