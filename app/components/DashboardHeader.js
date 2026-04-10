"use client";

import Link from "next/link";
import { useState } from "react";
import Logo from "./Logo";
import { 
    Bell, 
    Settings, 
    LogOut, 
    User, 
    Zap, 
    Search,
    Menu,
    X,
    ChevronDown,
    ShieldCheck
} from "lucide-react";

export default function DashboardHeader({ 
    user, 
    role = "USER", 
    credits = null, 
    onAddCredits = null, 
    onSync = null,
    onLogout = null
}) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-[60] w-full border-b border-gray-100 bg-white/80 backdrop-blur-2xl px-6 md:px-12 py-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-8">
                <Logo className="scale-90 origin-left" />
                
                {/* Role Badge */}
                <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-gray-50 border border-gray-100 rounded-full">
                    <span className="size-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                    <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">
                        {role === "ADMIN" ? "System Master" : `${role} Terminal`}
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-3 md:gap-6">
                {/* Contextual Actions */}
                {credits !== null && (
                    <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-blue-50 border border-blue-100 rounded-xl group cursor-default">
                        <div className="text-right">
                            <p className="text-[8px] font-black uppercase tracking-widest text-blue-400 leading-none mb-1">Credits</p>
                            <p className="text-sm font-black text-blue-600 leading-none tracking-tighter uppercase italic">{credits}</p>
                        </div>
                        {onAddCredits && (
                            <button 
                                onClick={onAddCredits}
                                className="size-8 rounded-lg bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-all shadow-md active:scale-90 group-hover:scale-105"
                                title="Add Credits"
                            >
                                <Zap size={14} fill="currentColor" />
                            </button>
                        )}
                    </div>
                )}

                {onSync && (
                    <button 
                        onClick={onSync}
                        className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 text-gray-600 rounded-xl font-bold text-[10px] tracking-widest uppercase hover:bg-gray-100 transition-all active:scale-95"
                    >
                        <Search size={14} /> SCRUB DATA
                    </button>
                )}

                {/* User Profile Dropdown */}
                <div className="flex items-center gap-3 pl-6 border-l border-gray-100">
                    <div className="flex flex-col text-right hidden lg:block leading-none">
                        <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest">{user?.name || "Member"}</span>
                        <span className="text-[9px] font-bold text-blue-500 uppercase tracking-widest mt-1 italic">
                            {role === "ADMIN" ? "Global Admin" : role === "TUTOR" ? "Expert Faculty" : "Registered Member"}
                        </span>
                    </div>
                    <div className="relative group/profile">
                        <button className="size-10 rounded-xl bg-gradient-to-tr from-gray-100 to-gray-200 border border-gray-200 shadow-sm flex items-center justify-center text-gray-600 font-bold overflow-hidden hover:border-blue-300 transition-colors">
                            {user?.image ? (
                                <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                            ) : (
                                <User size={20} />
                            )}
                        </button>
                        
                        {/* Dropdown Menu */}
                        <div className="absolute top-full right-0 mt-3 w-48 bg-white border border-gray-100 rounded-2xl p-2 opacity-0 invisible group-hover/profile:opacity-100 group-hover/profile:visible group-hover/profile:translate-y-1 transition-all duration-300 shadow-xl z-[70]">
                            <Link href="/dashboard/profile" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 text-gray-600 font-semibold text-xs transition-colors">
                                <Settings size={14} /> Settings
                            </Link>
                            <button 
                                onClick={onLogout}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 text-red-500 font-semibold text-xs transition-colors"
                            >
                                <LogOut size={14} /> Exit Session
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
