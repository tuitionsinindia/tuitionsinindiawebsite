"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = (e) => {
        e.preventDefault();
        setError("");

        if (email === "info@tuitionsinindia.com" && password === "Tuitions@123#") {
            router.push("/dashboard/admin");
        } else {
            setError("Invalid admin credentials");
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-sans relative">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] opacity-5 bg-cover bg-center mix-blend-multiply dark:mix-blend-screen pointer-events-none"></div>

            <header className="px-6 py-6 absolute top-0 w-full z-20 flex justify-between items-center">
                <Link href="/" className="flex items-center gap-2 group">
                    <span className="material-symbols-outlined text-3xl font-bold text-slate-800 dark:text-slate-200 group-hover:scale-110 transition-transform">admin_panel_settings</span>
                    <span className="font-heading font-bold text-xl text-slate-900 dark:text-white">Admin Portal</span>
                </Link>
            </header>

            <div className="flex-1 flex items-center justify-center p-4 z-10">
                <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl w-full max-w-[450px] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden relative p-8 md:p-10">
                    <div className="text-center mb-8">
                        <div className="size-16 rounded-2xl bg-slate-900 dark:bg-white flex flex-col items-center justify-center mx-auto mb-6 text-white dark:text-slate-900">
                            <span className="material-symbols-outlined text-3xl">security</span>
                        </div>
                        <h1 className="text-2xl font-heading font-bold text-slate-900 dark:text-white mb-2">System Login</h1>
                        <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Authorized Personnel Only</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-5">
                        {error && (
                            <div className="p-3 bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400 text-sm font-semibold rounded-lg text-center">
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Admin Email</label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">mail</span>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl pl-12 pr-4 py-3 text-sm focus:ring-2 focus:ring-slate-900 dark:focus:ring-white outline-none transition-all"
                                    placeholder="admin@tuitionsinindia.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Secure Password</label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">lock</span>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl pl-12 pr-4 py-3 text-sm focus:ring-2 focus:ring-slate-900 dark:focus:ring-white outline-none transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full mt-4 text-white dark:text-slate-900 font-bold py-3.5 rounded-xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 shadow-slate-900/30 dark:bg-white dark:hover:bg-slate-200"
                        >
                            <span className="material-symbols-outlined text-[20px]">login</span>
                            Authenticate
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <Link href="/login" className="text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors flex justify-center items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">arrow_back</span> Return to public login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
