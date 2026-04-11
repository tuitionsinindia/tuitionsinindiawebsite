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
    ChevronDown,
} from "lucide-react";

export default function DashboardHeader({ 
    user, 
    role = "USER", 
    credits = null, 
    onAddCredits = null, 
    onLogout = null
}) {
    return (
        <header className="fixed top-0 left-0 right-0 z-[60] w-full border-b border-gray-100 bg-white/80 backdrop-blur-2xl px-6 md:px-12 py-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-8">
                <Logo className="scale-90 origin-left" />
                
                {/* Role Badge */}
                <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-100 rounded-full">
                    <span className="size-1.5 rounded-full bg-blue-600 animate-pulse"></span>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 italic leading-none">
                        {role === "ADMIN" ? "Institutional Overseer" : `${role} Academic Hub`}
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-3 md:gap-8">
                {/* Credits / Token Block */}
                {credits !== null && (
                    <div className="hidden sm:flex items-center gap-4 px-5 py-2 bg-blue-600 text-white rounded-2xl shadow-xl shadow-blue-600/20 group cursor-default transition-all hover:bg-gray-900">
                        <div className="text-right">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 leading-none mb-1">Secure Tokens</p>
                            <p className="text-sm font-black tracking-tighter uppercase italic leading-none">{credits}</p>
                        </div>
                        {onAddCredits && (
                            <button 
                                onClick={onAddCredits}
                                className="size-8 rounded-xl bg-white/10 text-white flex items-center justify-center hover:bg-white hover:text-blue-600 transition-all active:scale-90"
                                title="Optimize Allocation"
                            >
                                <Zap size={14} fill="currentColor" strokeWidth={3} />
                            </button>
                        )}
                    </div>
                )}

                {/* User Identity */}
                <div className="flex items-center gap-4 pl-8 border-l border-gray-100">
                    <div className="flex flex-col text-right hidden lg:block leading-none">
                        <span className="text-xs font-black text-gray-900 uppercase tracking-widest leading-none mb-1">{user?.name || "Member"}</span>
                        <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] italic opacity-60">
                            {role === "ADMIN" ? "Registry Admin" : role === "TUTOR" ? "Verified Faculty" : "Registered Scholar"}
                        </span>
                    </div>
                    <div className="relative group/profile">
                        <button className="size-10 rounded-2xl bg-gray-50 border border-gray-100 shadow-sm flex items-center justify-center text-blue-600 font-bold overflow-hidden hover:border-blue-600 transition-all">
                            {user?.image ? (
                                <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                            ) : (
                                <User size={20} strokeWidth={2.5} />
                            )}
                        </button>
                        
                        {/* Session Commands */}
                        <div className="absolute top-full right-0 mt-4 w-52 bg-white border border-gray-100 rounded-3xl p-3 opacity-0 invisible group-hover/profile:opacity-100 group-hover/profile:visible group-hover/profile:translate-y-0 translate-y-2 transition-all duration-300 shadow-4xl shadow-blue-900/10 z-[70]">
                            <Link href="/dashboard/profile" className="flex items-center justify-between px-5 py-4 rounded-2xl hover:bg-gray-50 text-gray-900 font-bold text-[10px] uppercase tracking-widest transition-all italic">
                                Account Access <Settings size={14} strokeWidth={2.5} className="text-gray-300" />
                            </Link>
                            <button 
                                onClick={onLogout}
                                className="w-full flex items-center justify-between px-5 py-4 rounded-2xl hover:bg-red-50 text-red-500 font-bold text-[10px] uppercase tracking-widest transition-all italic"
                            >
                                Terminate Session <LogOut size={14} strokeWidth={2.5} className="text-red-300" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
