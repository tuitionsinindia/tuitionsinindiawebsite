import { Cpu, Sparkles } from "lucide-react";

export default function Loading() {
    return (
        <div className="fixed inset-0 z-[100] bg-background-dark flex flex-col items-center justify-center pointer-events-none select-none overflow-hidden">
            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes progressMove {
                    0% { transform: translateX(-100%); }
                    50% { transform: translateX(0); }
                    100% { transform: translateX(100%); }
                }
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-progress {
                    animation: progressMove 1.5s cubic-bezier(0.65, 0, 0.35, 1) infinite;
                }
                .animate-spin-slow {
                    animation: spin-slow 8s linear infinite;
                }
            ` }} />

            {/* Abstract Background Visuals */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[400px] bg-primary/10 rounded-full blur-[100px] animate-pulse"></div>
            
            <div className="relative z-10 flex flex-col items-center">
                {/* Logo / Icon Animation */}
                <div className="relative mb-12">
                    <div className="size-24 rounded-[2.5rem] bg-surface-dark border border-border-dark flex items-center justify-center relative overflow-hidden group">
                        <div className="absolute inset-0 bg-primary/5 animate-pulse"></div>
                        <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center animate-spin-slow">
                            <Cpu size={24} className="text-primary" />
                        </div>
                    </div>
                    {/* Floating Accents */}
                    <div className="absolute -top-4 -right-4 size-10 rounded-full bg-surface-dark border border-border-dark flex items-center justify-center animate-bounce">
                        <Sparkles size={14} className="text-primary" />
                    </div>
                </div>

                {/* Progress Bar Group */}
                <div className="w-64">
                    <div className="flex items-center justify-between mb-4 px-2">
                        <span className="text-xs font-black uppercase tracking-[0.4em] text-primary">Matching Engine</span>
                        <span className="text-xs font-black uppercase tracking-[0.2em] text-on-surface-dark/40 italic">In Progress</span>
                    </div>
                    
                    <div className="h-1.5 w-full bg-surface-dark rounded-full overflow-hidden border border-border-dark">
                        <div className="h-full bg-primary w-2/3 rounded-full animate-progress shadow-[0_0_15px_rgba(0,102,255,0.5)]"></div>
                    </div>
                    
                    <div className="mt-8 text-center">
                        <p className="text-xs font-black text-white/40 uppercase tracking-[0.2em] italic">Deploying Academic Assets...</p>
                    </div>
                </div>
            </div>

            {/* Bottom Brand Marker */}
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex items-center gap-3">
                <div className="size-1.5 bg-primary rounded-full animate-pulse"></div>
                <span className="text-xs font-black uppercase tracking-[0.5em] text-on-surface-dark/20 cursor-default">Tuitions In India Intelligence</span>
                <div className="size-1.5 bg-primary rounded-full animate-pulse"></div>
            </div>
        </div>
    );
}
