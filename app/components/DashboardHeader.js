"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Logo from "./Logo";
import {
    Settings,
    LogOut,
    User,
    CreditCard,
    Bell,
    X,
    CheckCheck,
} from "lucide-react";

export default function DashboardHeader({
    user,
    role = "USER",
    credits = null,
    onAddCredits = null,
    onLogout = null
}) {
    const roleLabel = role === "ADMIN" ? "Admin" : role === "TUTOR" ? "Tutor" : role === "INSTITUTE" ? "Institute" : "Student";
    const displayName = user?.name
        ? user.name.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ")
        : "Member";

    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [notifOpen, setNotifOpen] = useState(false);
    const notifRef = useRef(null);

    useEffect(() => {
        if (!user?.id) return;
        fetchNotifications();
    }, [user?.id]);

    // Close on outside click
    useEffect(() => {
        const handler = (e) => {
            if (notifRef.current && !notifRef.current.contains(e.target)) {
                setNotifOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const fetchNotifications = async () => {
        if (!user?.id) return;
        try {
            const res = await fetch(`/api/notifications?userId=${user.id}`);
            if (res.ok) {
                const data = await res.json();
                setNotifications(data.notifications || []);
                setUnreadCount(data.unreadCount || 0);
            }
        } catch {}
    };

    const openNotifications = async () => {
        setNotifOpen(v => !v);
        if (!notifOpen && unreadCount > 0 && user?.id) {
            // Mark all as read
            try {
                await fetch("/api/notifications", {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ userId: user.id }),
                });
                setUnreadCount(0);
                setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            } catch {}
        }
    };

    const timeAgo = (dateStr) => {
        const diff = Date.now() - new Date(dateStr).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 1) return "Just now";
        if (mins < 60) return `${mins}m ago`;
        const hrs = Math.floor(mins / 60);
        if (hrs < 24) return `${hrs}h ago`;
        return `${Math.floor(hrs / 24)}d ago`;
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-[60] w-full border-b border-gray-100 bg-white/80 backdrop-blur-xl px-3 sm:px-6 md:px-12 py-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-6">
                <Logo className="scale-90 origin-left" />

                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-lg">
                    <span className="size-1.5 rounded-full bg-blue-600 animate-pulse"></span>
                    <span className="text-xs font-semibold text-blue-600">
                        {roleLabel} Dashboard
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-3 md:gap-4">
                {credits !== null && (
                    <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-blue-50 border border-blue-100 rounded-xl">
                        <CreditCard size={16} className="text-blue-600" />
                        <div className="text-right">
                            <p className="text-xs text-gray-400 font-medium leading-none mb-0.5">Credits</p>
                            <p className="text-sm font-bold text-gray-900 leading-none">{credits}</p>
                        </div>
                    </div>
                )}

                {/* Notification Bell */}
                <div className="relative" ref={notifRef}>
                    <button
                        onClick={openNotifications}
                        className="relative size-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:border-gray-200 transition-all"
                    >
                        <Bell size={18} />
                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                {unreadCount > 9 ? "9+" : unreadCount}
                            </span>
                        )}
                    </button>

                    {notifOpen && (
                        <div className="absolute top-full right-0 mt-3 w-[min(320px,90vw)] bg-white border border-gray-100 rounded-2xl shadow-xl z-[70] overflow-hidden">
                            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                                <p className="text-sm font-bold text-gray-900">Notifications</p>
                                <button onClick={() => setNotifOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                    <X size={16} />
                                </button>
                            </div>
                            <div className="max-h-80 overflow-y-auto">
                                {notifications.length === 0 ? (
                                    <div className="py-10 text-center">
                                        <Bell size={24} className="text-gray-200 mx-auto mb-2" />
                                        <p className="text-sm text-gray-400">No notifications yet</p>
                                    </div>
                                ) : (
                                    notifications.map(n => (
                                        <a
                                            key={n.id}
                                            href={n.link || "#"}
                                            onClick={() => setNotifOpen(false)}
                                            className={`block px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors last:border-0 ${!n.isRead ? "bg-blue-50/50" : ""}`}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${!n.isRead ? "bg-blue-500" : "bg-gray-200"}`} />
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-sm font-semibold text-gray-900 leading-snug">{n.title}</p>
                                                    <p className="text-xs text-gray-500 mt-0.5 leading-snug">{n.body}</p>
                                                    <p className="text-[10px] text-gray-400 mt-1">{timeAgo(n.createdAt)}</p>
                                                </div>
                                            </div>
                                        </a>
                                    ))
                                )}
                            </div>
                            {notifications.length > 0 && (
                                <div className="px-4 py-2 border-t border-gray-100 text-center">
                                    <button
                                        onClick={async () => {
                                            if (!user?.id) return;
                                            await fetch("/api/notifications", {
                                                method: "PATCH",
                                                headers: { "Content-Type": "application/json" },
                                                body: JSON.stringify({ userId: user.id }),
                                            }).catch(() => {});
                                            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
                                            setUnreadCount(0);
                                        }}
                                        className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors"
                                    >
                                        <CheckCheck size={12} /> Mark all as read
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-3 pl-4 border-l border-gray-100">
                    <div className="hidden lg:flex flex-col text-right leading-none">
                        <span className="text-sm font-semibold text-gray-900 leading-none mb-1">{displayName}</span>
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
