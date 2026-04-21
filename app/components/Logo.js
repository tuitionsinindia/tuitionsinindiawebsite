"use client";

import Link from "next/link";
import { GraduationCap } from "lucide-react";

export default function Logo({ light = false, className = "", iconOnly = false }) {
    return (
        <Link href="/" className={`flex items-center gap-2.5 group ${className}`}>
            <div className="size-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white shadow-md shadow-blue-200">
                <GraduationCap size={19} strokeWidth={2.2} />
            </div>
            {!iconOnly && (
                <span className={`text-[15px] font-bold tracking-tight leading-none ${light ? 'text-white' : 'text-gray-900'}`}>
                    Tuitions<span className={`font-normal ${light ? 'text-white/60' : 'text-blue-500'}`}>in</span>India
                </span>
            )}
        </Link>
    );
}
