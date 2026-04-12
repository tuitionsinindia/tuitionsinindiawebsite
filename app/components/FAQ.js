"use client";

import { useState } from "react";
import { ChevronDown, CircleHelp } from "lucide-react";

export default function FAQ({ items }) {
    const [openIndex, setOpenIndex] = useState(0);

    return (
        <div className="space-y-3">
            {items.map((item, index) => (
                <div
                    key={index}
                    className={`group transition-all duration-300 rounded-xl border overflow-hidden ${
                        openIndex === index
                            ? "bg-white border-blue-200 shadow-sm"
                            : "bg-white border-gray-200 hover:border-blue-100"
                    }`}
                >
                    <button
                        onClick={() => setOpenIndex(openIndex === index ? null : index)}
                        className="w-full px-6 py-4 flex items-center justify-between text-left transition-all"
                    >
                        <div className="flex items-center gap-3 pr-4">
                            <div className={`size-8 rounded-lg flex items-center justify-center transition-colors shrink-0 ${
                                openIndex === index ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-400"
                            }`}>
                                <CircleHelp size={16} />
                            </div>
                            <span className={`text-sm font-semibold transition-colors ${
                                openIndex === index ? "text-gray-900" : "text-gray-700"
                            }`}>
                                {item.question}
                            </span>
                        </div>
                        <div className={`transition-transform duration-300 text-gray-400 shrink-0 ${
                            openIndex === index ? "rotate-180 text-blue-600" : ""
                        }`}>
                            <ChevronDown size={16} />
                        </div>
                    </button>
                    <div className={`transition-all duration-300 px-6 overflow-hidden ${
                        openIndex === index ? 'pb-5 opacity-100 max-h-[500px]' : 'max-h-0 opacity-0'
                    }`}>
                        <p className="text-sm text-gray-600 leading-relaxed pl-11">
                            {item.answer}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}
