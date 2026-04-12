"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldCheck, Loader2 } from "lucide-react";

export default function AdminLoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch("/api/admin/auth", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });
            const json = await res.json();

            if (json.success && json.key) {
                localStorage.setItem("ti_admin_key", json.key);
                router.push("/dashboard/admin");
            } else {
                setError(json.error || "Invalid credentials");
            }
        } catch {
            setError("Login failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm w-full max-w-sm p-8">
                <div className="text-center mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-gray-900 flex items-center justify-center mx-auto mb-5">
                        <ShieldCheck size={26} className="text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">Admin Portal</h1>
                    <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold">Authorized Personnel Only</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    {error && (
                        <div className="p-3 bg-red-50 text-red-600 text-sm font-medium rounded-xl text-center border border-red-100">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Admin Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-gray-900 outline-none transition-all"
                            placeholder="admin@tuitionsinindia.com"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-gray-900 outline-none transition-all"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-2 bg-gray-900 text-white font-semibold py-3 rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
                    >
                        {loading ? <><Loader2 size={16} className="animate-spin" /> Authenticating...</> : "Sign In"}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <Link href="/login" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
                        ← Return to public login
                    </Link>
                </div>
            </div>
        </div>
    );
}
