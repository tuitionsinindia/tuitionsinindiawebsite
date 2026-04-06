"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
    Mail, 
    Lock, 
    ArrowRight, 
    User, 
    UserCheck, 
    Building2,
    Eye, 
    EyeOff,
    ShieldCheck, 
    Zap, 
    Award,
    Check
} from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const [loginType, setLoginType] = useState("student"); // 'student', 'tutor', 'institute'
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = (e) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);
        // Direct simulation
        setTimeout(() => {
            alert(`Marketplace Login: Standard authentication sequence initiated for ${loginType}.`);
            setIsLoading(false);
        }, 1500);
    };

    const handleDemoLogin = (type) => {
        if (type === "student") {
            router.push("/dashboard/student?studentId=demo_student_123");
        } else if (type === "tutor") {
            router.push("/dashboard/tutor?tutorId=demo_tutor_123");
        } else if (type === "institute") {
            router.push("/dashboard/institute?instId=demo_inst_999");
        }
    };

    const loginTypes = [
        { id: 'student', title: 'Student', icon: User },
        { id: 'tutor', title: 'Tutor', icon: UserCheck },
        { id: 'institute', title: 'Institute', icon: Building2 }
    ];

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans relative overflow-hidden antialiased selection:bg-blue-100">
            {/* Soft Background Accents */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-500/5 blur-[120px] rounded-full -mr-96 -mt-96 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-400/5 blur-[100px] rounded-full -ml-64 -mb-64 pointer-events-none"></div>

            {/* Main Content Container */}
            <div className="flex-1 flex items-center justify-center p-6 z-10 pt-40 pb-32">
                <div className="w-full max-w-[500px] animate-in fade-in slide-in-from-bottom-8 duration-700">
                    
                    {/* Brand Context */}
                    <div className="text-center mb-10">
                        <Link href="/" className="inline-flex items-center gap-3 mb-6 group">
                            <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-xl shadow-blue-600/20 group-hover:scale-110 transition-transform">
                                <Zap size={24} className="text-white fill-white" />
                            </div>
                            <span className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic">Marketplace</span>
                        </Link>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase mb-2">Welcome Back</h1>
                        <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest italic">Authorization Required to Access Your Assets</p>
                    </div>

                    <div className="bg-white rounded-[3rem] shadow-2xl shadow-blue-900/5 border border-slate-100 overflow-hidden relative">
                        
                        {/* Status Bar */}
                        <div className="h-1.5 bg-slate-50 w-full overflow-hidden">
                            <div className={`h-full bg-blue-600 transition-all duration-500 ${isLoading ? 'w-full opacity-100' : 'w-0 opacity-0'}`}></div>
                        </div>

                        <div className="p-8 md:p-14">
                            
                            {/* Login Type Tabs */}
                            <div className="flex p-1.5 bg-slate-50 rounded-[1.5rem] mb-12 border border-slate-100 shadow-inner">
                                {loginTypes.map((type) => (
                                    <button
                                        key={type.id}
                                        onClick={() => { setLoginType(type.id); setError(""); }}
                                        className={`flex-1 py-4 px-2 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 italic ${
                                            loginType === type.id 
                                            ? 'bg-white text-blue-600 shadow-xl shadow-blue-900/5 scale-[1.05]' 
                                            : 'text-slate-400 hover:text-slate-600'
                                        }`}
                                    >
                                        <type.icon size={14} strokeWidth={3} />
                                        <span className="hidden sm:inline">{type.title}</span>
                                    </button>
                                ))}
                            </div>

                            {/* Main Form */}
                            <form onSubmit={handleLogin} className="space-y-8">
                                {error && (
                                    <div className="p-5 bg-red-50 text-red-600 text-[10px] font-black rounded-2xl text-center border border-red-100 uppercase tracking-widest flex items-center justify-center gap-3 italic">
                                        <ShieldCheck size={16} strokeWidth={3} /> {error}
                                    </div>
                                )}

                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 italic">Registered Email</label>
                                        <div className="relative group">
                                            <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" size={20} strokeWidth={2} />
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl pl-16 pr-8 py-5 font-bold outline-none transition-all italic text-slate-700 placeholder:text-slate-200 shadow-inner focus:border-blue-500/20 focus:bg-white"
                                                placeholder={`user@academic.net`}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 italic">Access Cipher</label>
                                        <div className="relative group">
                                            <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" size={20} strokeWidth={2} />
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl pl-16 pr-14 py-5 font-bold outline-none transition-all italic text-slate-700 placeholder:text-slate-200 shadow-inner focus:border-blue-500/20 focus:bg-white"
                                                placeholder="••••••••"
                                            />
                                            <button 
                                                type="button" 
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 hover:text-blue-600 transition-colors p-1"
                                            >
                                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center px-2">
                                    <label className="flex items-center gap-2 cursor-pointer group">
                                        <div className="size-5 rounded-lg border-2 border-slate-200 bg-slate-50 flex items-center justify-center transition-all group-hover:border-blue-500 overflow-hidden">
                                            <Check size={12} strokeWidth={4} className="text-blue-600 opacity-0 group-hover:opacity-20 transition-opacity" />
                                        </div>
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic group-hover:text-slate-600">Remember Me</span>
                                    </label>
                                    <a href="#" className="text-[10px] font-black text-blue-600 hover:text-blue-700 transition-all uppercase tracking-widest italic underline decoration-blue-200 underline-offset-8">Forgot Cipher?</a>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-blue-600 text-white py-6 rounded-2xl font-black text-[11px] shadow-2xl shadow-blue-600/20 hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-6 uppercase tracking-[0.3em] disabled:opacity-50"
                                >
                                    {isLoading ? "Authenticating..." : "Execute Login"} <ArrowRight size={16} strokeWidth={3} />
                                </button>
                            </form>

                            {/* Demo Overlay Bypass */}
                            <div className="mt-14 pt-12 border-t border-slate-50 relative">
                                <div className="absolute top-[-10px] left-1/2 -translate-x-1/2 bg-white px-8 text-[9px] font-black text-slate-300 uppercase tracking-[0.3em] italic">
                                    Maintenance Bypass
                                </div>

                                <button
                                    onClick={() => handleDemoLogin(loginType)}
                                    className="w-full flex items-center justify-center gap-4 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] border-2 border-dashed border-blue-600/20 text-blue-600 transition-all hover:bg-blue-50 hover:border-blue-600/50 active:scale-95 group italic"
                                >
                                    <Zap size={18} className="group-hover:rotate-12 transition-transform text-blue-400" />
                                    Launch {loginType} Interface
                                </button>
                            </div>

                        </div>
                    </div>

                    <div className="mt-12 text-center">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">
                            New Identity Variable?{' '}
                            <Link
                                href="/get-started"
                                className="text-blue-600 hover:text-blue-700 transition-all ml-2 underline decoration-blue-200 underline-offset-8"
                            >
                                Apply for Access
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

            {/* Footer Trust Context */}
            <div className="max-w-4xl mx-auto container px-6 grid grid-cols-3 gap-12 text-center mb-20 opacity-30">
                <div className="space-y-3">
                    <Award size={20} className="mx-auto text-slate-900" />
                    <p className="text-[9px] font-black text-slate-900 uppercase tracking-widest italic">Tier-1 Market</p>
                </div>
                <div className="space-y-3">
                    <ShieldCheck size={20} className="mx-auto text-slate-900" />
                    <p className="text-[9px] font-black text-slate-900 uppercase tracking-widest italic">Secure Endpoints</p>
                </div>
                <div className="space-y-3">
                    <Check size={20} className="mx-auto text-slate-900" />
                    <p className="text-[9px] font-black text-slate-900 uppercase tracking-widest italic">Verified Logs</p>
                </div>
            </div>
        </div>
    );
}
