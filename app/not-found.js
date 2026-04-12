import Link from "next/link";
import { ArrowLeft, Search, Home, ShieldAlert, Cpu } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-background-dark text-on-background-dark font-sans selection:bg-primary/30 flex flex-col">

            
            <main className="flex-1 flex items-center justify-center pt-40 pb-20 px-6">
                <div className="max-w-4xl w-full text-center relative">
                    {/* Background Visuals */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[600px] bg-primary/5 rounded-full blur-[120px] -z-10 animate-pulse"></div>
                    
                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-3 px-5 py-2 bg-red-500/10 rounded-full border border-red-500/20 mb-10">
                            <ShieldAlert size={16} className="text-red-400" />
                            <span className="text-red-400 text-xs font-black uppercase tracking-[0.3em]">Page Not Found</span>
                        </div>
                        
                        <h1 className="text-[120px] md:text-[200px] font-black leading-none tracking-tighter text-white/5 mb-[-60px] md:mb-[-100px] cursor-default select-none">
                            VOID
                        </h1>
                        
                        <h2 className="text-5xl md:text-8xl font-black text-white italic tracking-tighter mb-8 leading-tight">
                            Domain <span className="text-primary underline decoration-primary/20 decoration-8 underline-offset-8">Deficient</span>.
                        </h2>
                        
                        <p className="text-on-background-dark/60 font-medium text-xl max-w-xl mx-auto leading-relaxed mb-16">
                            The academic coordinate you requested does not exist within our current mapping. Our AI matching engine suggests redirecting to known discovery hubs.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                            <Link 
                                href="/" 
                                className="w-full sm:w-auto bg-primary text-white font-black px-12 py-6 rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-4 uppercase tracking-widest text-xs"
                            >
                                <Home size={18} strokeWidth={3} />
                                Return to Base
                            </Link>
                            
                            <Link 
                                href="/search" 
                                className="w-full sm:w-auto bg-surface-dark border border-border-dark text-white font-black px-12 py-6 rounded-2xl hover:border-primary/50 transition-all flex items-center justify-center gap-4 uppercase tracking-widest text-xs"
                            >
                                <Search size={18} className="text-primary" />
                                Expert Discovery
                            </Link>
                        </div>
                        
                        <div className="mt-24 pt-12 border-t border-border-dark max-w-md mx-auto">
                            <div className="flex items-center justify-center gap-3 text-on-surface-dark/20">
                                <Cpu size={14} />
                                <p className="text-xs font-black uppercase tracking-[0.4em]">Matching Engine Active</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>


        </div>
    );
}
