"use client";

import Link from "next/link";
import Logo from "./Logo";
import {
    Settings,
    LogOut,
    User,
    CreditCard,
} from "lucide-react";

export default function DashboardHeader({
    user,
    role = "USER",
    credits = null,
    onAddCredits = null,
    onLogout = null
}) {
    const roleLabel = role === "ADMIN" ? "Admin" : role === "TUTOR" ? "Tutor" : role === "INSTITUTE" ? "Institute" : "Student";

    return (
        <header className="fixed top-0 left-0 right-0 z-[60] w-full border-b border-gray-100 bg-white/80 backdrop-blur-xl px-6 md:px-12 py-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-6">
                <Logo className="scale-90 origin-left" />

                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-lg">
                    <span className="size-1.5 rounded-full bg-blue-600 animate-pulse"></span>
                    <span className="text-xs font-semibold text-blue-600">
                        {roleLabel} Dashboard
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-3 md:gap-6">
                {credits !== null && (
                    <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-blue-50 border border-blue-100 rounded-xl">
                        <CreditCard size={16} className="text-blue-600" />
                        <div className="text-right">
                            <p className="text-xs text-gray-400 font-medium leading-none mb-0.5">Credits</p>
                            <p className="text-sm font-bold text-gray-900 leading-none">{credits}</p>
                        </div>
                    </div>
                )}

                <div className="flex items-center gap-3 pl-6 border-l border-gray-100">
                    <div className="hidden lg:flex flex-col text-right leading-none">
                        <span className="text-sm font-semibold text-gray-900 leading-none mb-1">{user?.name || "Member"}</span>
                        <span className="text-xs font-medium text-gray-400">{roleLabel}</span>
                    </div>
                    <div className="relative group/profile">
                        <button className="size-10 rounded-xl bg-gray-50 border border-gray-100 shadow-sm flex items-center justify-center text-blue-600 font-bold overflow-hidden hover:border-blue-600 transition-all">
                            {user?.image ? (
                                <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                            ) : (
                                <User size={20} />
                            )}
                        </button>

                        <div className="absolute top-full right-0 mt-3 w-48 bg-white border border-gray-100 rounded-xl p-2 opacity-0 invisible group-hover/profile:opacity-100 group-hover/profile:visible group-hover/profile:translate-y-0 translate-y-2 transition-all duration-300 shadow-lg z-[70]">
                            <Link href="/dashboard/profile" className="flex items-center justify-between px-4 py-3 rounded-lg hover:bg-gray-50 text-sm font-medium text-gray-700 transition-all">
                                Settings <Settings size={14} className="text-gray-400" />
                            </Link>
                            <button
                                onClick={onLogout}
                                className="w-full flex items-center justify-between px-4 py-3 rounded-lg hover:bg-red-50 text-sm font-medium text-red-500 transition-all"
                            >
                                Log Out <LogOut size={14} className="text-red-400" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
