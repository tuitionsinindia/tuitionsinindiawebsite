"use client";

import Image from "next/image";
import Link from "next/link";

export default function Logo({ light = false, className = "", iconOnly = false }) {
    const minimalistLogo = "/logo_minimal.png";
    
    return (
        <Link href="/" className={`flex items-center gap-2.5 group transition-opacity hover:opacity-90 ${className}`}>
            <div className="relative size-10 md:size-12 overflow-hidden rounded-xl bg-white shadow-md border border-gray-100 flex items-center justify-center group-hover:shadow-lg transition-all p-1">
                <img 
                    src={minimalistLogo} 
                    alt="TuitionsInIndia Logo" 
                    className="w-full h-full object-contain"
                />
            </div>
            {!iconOnly && (
                <span className={`text-xl font-headline font-black tracking-tighter italic uppercase drop-shadow-sm ${light ? 'text-white' : 'text-gray-900'}`}>
                    TUITIONS<span className="text-primary not-italic font-serif font-light lowercase">in</span>INDIA
                </span>
            )}
        </Link>
    );
}
