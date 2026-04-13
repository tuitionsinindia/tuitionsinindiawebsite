"use client";

import Link from "next/link";
import { GraduationCap } from "lucide-react";

export default function Logo({ light = false, className = "", iconOnly = false }) {
    return (
        <Link href="/" className={`flex items-center gap-2.5 group ${className}`}>
            <div className="size-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm">
                <GraduationCap size={20} strokeWidth={2} />
            </div>
            {!iconOnly && (
                <span className={`text-base font-bold tracking-tight ${light ? 'text-white' : 'text-gray-900'}`}>
                    Tuitions<span className={light ? 'text-white/70' : 'text-blue-600'}>in</span>India
                </span>
            )}
        </Link>
    );
}
