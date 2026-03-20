"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();
    const [loginType, setLoginType] = useState("student"); // 'student', 'tutor'
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = (e) => {
        e.preventDefault();
        setError("");

        // For Tutor/Student real login, we'd call an API. 
        // Since User requested a Demo button, this form might just be for show for now if they click "Login"
        alert(`Demo Mode: Please use the "Demo Login" button below for ${loginType} access.`);
    };

    const handleDemoLogin = (type) => {
        // Redirect to respective dashboard with a dummy ID for demo purposes
        if (type === "student") {
            // Using a dummy student ID (e.g., from seeder or just a string)
            router.push("/dashboard/student?studentId=demo_student_123");
        } else if (type === "tutor") {
            router.push("/dashboard/tutor?tutorId=demo_tutor_123");
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-sans relative">
            {/* Background elements */}
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] opacity-5 bg-cover bg-center mix-blend-multiply dark:mix-blend-screen pointer-events-none"></div>

            {/* Header */}
            <header className="px-6 py-6 absolute top-0 w-full z-20 flex justify-between items-center">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="flex items-center group-hover:scale-105 transition-transform">
                        <img src="/tuitions_logo.png" alt="Tuitions In India Logo" className="h-10 w-auto object-contain mix-blend-multiply" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-heading font-bold text-xl text-slate-900 dark:text-white leading-none">TuitionsInIndia</span>
                    </div>
                </Link>
            </header>

            {/* Main Content */}
            <div className="flex-1 flex items-center justify-center p-4 z-10 pt-24 pb-12">
                <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl w-full max-w-[500px] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden relative">

                    {/* Decorative Blobs */}
                    <div className="absolute -top-20 -left-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
                    <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>

                    <div className="p-8 md:p-10">
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-heading font-bold text-slate-900 dark:text-white mb-2">Welcome Back</h1>
                            <p className="text-sm text-slate-500">Sign in to manage your account or explore the demo.</p>
                        </div>

                        {/* Login Type Tabs */}
                        <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl mb-8 relative z-10 w-full">
                            <button
                                onClick={() => { setLoginType("student"); setError(""); }}
                                className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${loginType === "student" ? 'bg-primary text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                            >
                                Student
                            </button>
                            <button
                                onClick={() => { setLoginType("tutor"); setError(""); }}
                                className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${loginType === "tutor" ? 'bg-primary text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                            >
                                Tutor
                            </button>
                        </div>

                        {/* Login Form */}
                        <form onSubmit={handleLogin} className="space-y-5 relative z-10 w-full">
                            {error && (
                                <div className="p-3 bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400 text-sm font-semibold rounded-lg text-center">
                                    {error}
                                </div>
                            )}

                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Email Address</label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">mail</span>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl pl-12 pr-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                        placeholder={`your.${loginType}@email.com`}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Password</label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">lock</span>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl pl-12 pr-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <a href="#" className="text-xs font-semibold text-primary hover:text-primary-glow transition-colors">Forgot password?</a>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-primary text-white hover:bg-primary-glow shadow-primary/30 font-bold py-3.5 rounded-xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
                            >
                                <span className="material-symbols-outlined text-[20px]">login</span>
                                Login
                            </button>
                        </form>

                        {/* Demo Access Section */}
                        <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800 relative z-10 center w-full">
                            <div className="text-center mb-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                or explore without an account
                            </div>

                            <button
                                onClick={() => handleDemoLogin(loginType)}
                                className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl font-bold border-2 border-dashed border-primary/30 text-primary transition-all hover:bg-primary/5"
                            >
                                <span className="material-symbols-outlined text-[20px]">visibility</span>
                                Demo {loginType.charAt(0).toUpperCase() + loginType.slice(1)} Dashboard
                            </button>
                        </div>

                        <div className="mt-8 text-center text-sm text-slate-500 relative z-10">
                            Don't have an account?{' '}
                            <Link
                                href={loginType === 'student' ? '/register/student' : '/register/tutor'}
                                className="font-bold text-primary hover:text-primary-glow transition-colors"
                            >
                                Sign up
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
