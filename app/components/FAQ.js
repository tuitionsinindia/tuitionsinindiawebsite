"use client";

import { useState } from "react";

export default function FAQ({ items }) {
    const [openIndex, setOpenIndex] = useState(null);

    return (
        <div className="space-y-4">
            {items.map((item, index) => (
                <div
                    key={index}
                    className="bg-white border border-slate-100 rounded-[1.5rem] overflow-hidden transition-all hover:shadow-lg hover:border-primary/10"
                >
                    <button
                        onClick={() => setOpenIndex(openIndex === index ? null : index)}
                        className="w-full px-8 py-6 flex items-center justify-between text-left group"
                    >
                        <span className="font-bold text-slate-900 group-hover:text-primary transition-colors pr-6">
                            {item.question}
                        </span>
                        <span className={`material-symbols-outlined text-primary transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`}>
                            expand_more
                        </span>
                    </button>
                    <div
                        className={`px-8 transition-all duration-300 ease-in-out ${openIndex === index ? 'pb-8 opacity-100 max-h-[500px]' : 'max-h-0 opacity-0 pointer-events-none'}`}
                    >
                        <p className="text-slate-500 font-medium leading-relaxed">
                            {item.answer}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}
