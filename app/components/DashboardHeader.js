"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import Logo from "./Logo";
import {
    Bell,
    Settings,
    LogOut,
    User,
    Zap,
    Search,
    X,
    CheckCheck
} from "lucide-react";

export default function DashboardHeader({
    user,
    role = "USER",
    credits = null,
    onAddCredits = null,
    onSync = null,
    onLogout = null
}) {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [bellOpen, setBellOpen] = useState(false);
    const bellRef = useRef(null);

    // Poll for notifications every 30 seconds if we have a user id
    useEffect(() => {
        if (!user?.id) return;
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, [user?.id]);

    // Close bell dropdown when clicking outside
    useEffect(() => {
        const handleClick = (e) => {
            if (bellRef.current && !bellRef.current.contains(e.target)) {
                setBellOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    const fetchNotifications = async () => {
        try {
            const res = await fetch(`/api/notifications?userId=${user.id}`);
            if (res.ok) {
                const data = await res.json();
                setNotifications(data.notifications || []);
                setUnreadCount(data.unreadCount || 0);
            }
        } catch {}
    };

    const markAllRead = async () => {
        try {
            await fetch("/api/notifications", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: user.id }),
            });
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
        } catch {}
    };

    const markOneRead = async (id) => {
        try {
            await fetch("/api/notifications", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: user.id, notificationId: id }),
            });
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch {}
    };

    const roleLabel = role === "ADMIN" ? "Admin" : role === "TUTOR" ? "Tutor" : role === "INSTITUTE" ? "Institute" : "Student";

    return (
        <header className="sticky top-0 z-[60] w-full border-b border-gray-100 bg-white/90 backdrop-blur-xl px-6 md:px-12 py-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-8">
                <Logo className="scale-90 origin-left" />

                {/* Role Badge */}
                <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-gray-50 border border-gray-100 rounded-full">
                    <span className="size-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                        {roleLabel}
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-3 md:gap-5">
                {/* Credits */}
                {credits !== null && (
                    <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100 rounded-xl">
                        <Zap size={14} className="text-blue-500" fill="currentColor" />
                        <span className="text-sm font-bold text-blue-700">{credits}</span>
                        <span className="text-xs text-blue-400 font-medium">credits</span>
                        {onAddCredits && (
                            <button
                                onClick={onAddCredits}
                                className="ml-1 px-2 py-0.5 bg-blue-600 text-white rounded-md text-xs font-semibold hover:bg-blue-700 transition-colors"
                            >
                                +
                            </button>
                        )}
                    </div>
                )}

                {onSync && (
                    <button
                        onClick={onSync}
                        className="hidden sm:flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 text-gray-600 rounded-lg font-medium text-xs hover:bg-gray-100 transition-all"
                    >
                        <Search size={14} /> Refresh
                    </button>
                )}

                {/* Notification Bell */}
                {user?.id && (
                    <div className="relative" ref={bellRef}>
                        <button
                            onClick={() => setBellOpen(o => !o)}
                            className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-500"
                        >
                            <Bell size={20} />
                            {unreadCount > 0 && (
                                <span className="absolute top-1 right-1 size-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center leading-none">
                                    {unreadCount > 9 ? "9+" : unreadCount}
                                </span>
                            )}
                        </button>

                        {bellOpen && (
                            <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-gray-100 rounded-2xl shadow-xl z-[70] overflow-hidden">
                                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                                    <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                                    <div className="flex items-center gap-2">
                                        {unreadCount > 0 && (
                                            <button
                                                onClick={markAllRead}
                                                className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium"
                                            >
                                                <CheckCheck size={12} /> Mark all read
                                            </button>
                                        )}
                                        <button onClick={() => setBellOpen(false)} className="text-gray-400 hover:text-gray-600">
                                            <X size={14} />
                                        </button>
                                    </div>
                                </div>
                                <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
                                    {notifications.length === 0 ? (
                                        <div className="py-10 text-center text-sm text-gray-400">
                                            <Bell size={24} className="mx-auto mb-2 opacity-30" />
                                            No notifications yet
                                        </div>
                                    ) : notifications.map(n => (
                                        <div
                                            key={n.id}
                                            onClick={() => { if (!n.isRead) markOneRead(n.id); if (n.link) { setBellOpen(false); window.location.href = n.link; } }}
                                            className={`px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors ${!n.isRead ? "bg-blue-50/60" : ""}`}
                                        >
                                            <div className="flex items-start gap-3">
                                                {!n.isRead && <span className="size-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />}
                                                <div className={!n.isRead ? "" : "pl-4"}>
                                                    <p className="text-xs font-semibold text-gray-900">{n.title}</p>
                                                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{n.body}</p>
                                                    <p className="text-[10px] text-gray-400 mt-1">
                                                        {new Date(n.createdAt).toLocaleString("en-IN", { dateStyle: "short", timeStyle: "short" })}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* User Profile Dropdown */}
                <div className="flex items-center gap-3 pl-4 border-l border-gray-100">
                    <div className="hidden lg:flex flex-col text-right leading-none">
                        <span className="text-xs font-semibold text-gray-900">{user?.name || "User"}</span>
                        <span className="text-[10px] text-gray-400 mt-0.5">{roleLabel}</span>
                    </div>
                    <div className="relative group/profile">
                        <button className="size-10 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-600 font-semibold overflow-hidden hover:border-blue-300 transition-colors">
                            {user?.image ? (
                                <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                            ) : (
                                <User size={20} />
                            )}
                        </button>

                        {/* Dropdown */}
                        <div className="absolute top-full right-0 mt-2 w-44 bg-white border border-gray-100 rounded-xl p-1.5 opacity-0 invisible group-hover/profile:opacity-100 group-hover/profile:visible transition-all duration-200 shadow-lg z-[70]">
                            <Link href="/dashboard/profile" className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg hover:bg-gray-50 text-gray-600 font-medium text-xs transition-colors">
                                <Settings size={14} /> Settings
                            </Link>
                            <button
                                onClick={onLogout}
                                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg hover:bg-red-50 text-red-500 font-medium text-xs transition-colors"
                            >
                                <LogOut size={14} /> Log out
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
