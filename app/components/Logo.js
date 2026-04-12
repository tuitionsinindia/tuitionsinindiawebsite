"use client";

import Image from "next/image";
import Link from "next/link";

export default function Logo({ light = false, className = "", iconOnly = false }) {
    const mainLogo = "/logo.png";
    
    return (
        <Link href="/" className={`flex items-center gap-2 group transition-opacity hover:opacity-90 ${className}`}>
            <div className="relative size-8 md:size-10 overflow-hidden rounded-lg bg-white shadow-sm border border-gray-100 flex items-center justify-center p-0.5 group-hover:shadow-md transition-all">
                <Image
                    src={mainLogo}
                    alt="TuitionsInIndia Logo"
                    fill
                    className="object-contain"
                    sizes="40px"
                />
            </div>
            {!iconOnly && (
                <span className={`text-base md:text-lg font-black tracking-tighter uppercase italic drop-shadow-sm ${light ? 'text-white' : 'text-gray-900'}`}>
                    TUITIONS<span className="text-blue-600 not-italic lowercase px-0.5">in</span>INDIA
                </span>
            )}
        </Link>
    );
}
