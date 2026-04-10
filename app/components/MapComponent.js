"use client";

import { MapPin, Navigation, Info, User, Star, Activity, Radar } from "lucide-react";

export default function MapComponent({ tutors = [] }) {
    return (
        <div className="w-full h-full bg-background-dark rounded-[4rem] border border-border-dark relative overflow-hidden flex flex-col shadow-2xl">
            {/* Tactical Grid Background Pattern */}
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none" 
                style={{ 
                    backgroundImage: `radial-gradient(circle, #4f46e5 1px, transparent 1px)`,
                    backgroundSize: '40px 40px'
                }} 
            />
            
            {/* Neural Map Background Scan */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] blend-overlay"></div>

            {/* Map Overlay Info (Tactical HUD) */}
            <div className="absolute top-10 left-10 z-20 max-w-sm space-y-6">
                <div className="bg-surface-dark/40 backdrop-blur-3xl p-8 rounded-[3rem] border border-border-dark shadow-2xl space-y-6 border-b-8">
                    <div className="flex items-center gap-4">
                        <div className="size-14 rounded-2xl bg-indigo-600/10 text-indigo-500 flex items-center justify-center border border-indigo-500/20">
                            <Radar size={28} className="animate-pulse" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-white italic tracking-tighter uppercase leading-none mb-1">Neural Discovery</h3>
                            <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] leading-none">
                                Scan active: {tutors.length} nodes detected
                            </p>
                        </div>
                    </div>
                    <div className="px-6 py-4 bg-background-dark/80 rounded-2xl border border-white/5 italic">
                        <p className="text-[11px] font-medium text-white/40 leading-relaxed uppercase tracking-wider">
                            Explore academic experts in the <span className="text-indigo-500">geospatial grid</span>. Zoom for granular node data.
                        </p>
                    </div>
                    <div className="pt-2">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/5 text-amber-500 rounded-xl text-[9px] font-black uppercase tracking-widest border border-amber-500/10 italic">
                            <Activity size={14} className="animate-pulse" />
                            Establishing high-fidelity satellite link
                        </div>
                    </div>
                </div>
            </div>

            {/* Tactical Markers Area */}
            <div className="relative flex-1 group overflow-hidden">
                {/* Visual Radar Sweep Effect */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[800px] border border-indigo-500/5 rounded-full animate-ping pointer-events-none"></div>
                
                {/* Simulated Markers */}
                {tutors.slice(0, 15).map((tutor, i) => {
                    // Determistic but random-looking positions
                    const top = 15 + ((i * 73) % 70);
                    const left = 15 + ((i * 37) % 70);
                    
                    return (
                        <div 
                            key={tutor.id || i}
                            className="absolute z-10 transition-all duration-1000 animate-in fade-in zoom-in"
                            style={{ top: `${top}%`, left: `${left}%` }}
                        >
                            <div className="group/marker relative cursor-pointer">
                                {/* Glassmorphic Hover Card (HUD Data) */}
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-6 w-64 bg-surface-dark border border-border-dark backdrop-blur-3xl rounded-[2.5rem] p-6 shadow-[0_30px_60px_rgba(0,0,0,0.5)] opacity-0 group-hover/marker:opacity-100 transition-all scale-75 group-hover/marker:scale-100 pointer-events-none z-30 border-b-6">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="size-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black text-xl italic shadow-xl">
                                            {tutor.name?.charAt(0) || '?'}
                                        </div>
                                        <div className="overflow-hidden">
                                            <p className="text-[12px] font-black text-white italic uppercase tracking-tighter truncate leading-none mb-1">{tutor.name || 'ANONYMOUS'}</p>
                                            <p className="text-[9px] font-black text-indigo-500 uppercase tracking-widest leading-none">{tutor.subject || 'FACULTY'}</p>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center py-4 border-t border-white/5">
                                        <div className="flex items-center gap-1.5 text-amber-500 text-[10px] font-black italic">
                                            <Star size={12} fill="currentColor" /> {(tutor.rating || '4.8')}
                                        </div>
                                        <div className="text-white text-[12px] font-black italic tracking-tighter">₹{tutor.rate || '500'}/HR</div>
                                    </div>
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-4 h-4 bg-surface-dark rotate-45 border-r border-b border-border-dark -mt-2"></div>
                                </div>

                                {/* Tactical Pin Icon */}
                                <div className="size-12 bg-white/5 border border-white/10 rounded-full flex items-center justify-center group-hover/marker:scale-125 group-hover/marker:border-indigo-500 transition-all hover:z-20 shadow-2xl group-hover/marker:bg-indigo-600/20">
                                    <div className="size-8 rounded-full bg-indigo-600/20 border border-indigo-500/20 flex items-center justify-center text-indigo-500 group-hover/marker:text-white transition-colors">
                                        <MapPin size={18} className="fill-current" />
                                    </div>
                                </div>
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-16 bg-indigo-500/10 rounded-full animate-pulse pointer-events-none"></div>
                            </div>
                        </div>
                    );
                })}

                {/* Empty State Tactical Display */}
                {tutors.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center text-center p-20">
                        <div className="space-y-8 max-w-sm">
                            <div className="size-32 bg-white/5 rounded-[3rem] border border-border-dark flex items-center justify-center mx-auto text-indigo-500/20 animate-pulse">
                                <Radar size={64} strokeWidth={1} />
                            </div>
                            <div>
                                <h4 className="text-2xl font-black text-white/40 uppercase italic tracking-tighter mb-2">Network Standby</h4>
                                <p className="text-white/10 font-black text-[10px] uppercase tracking-[0.4em] leading-relaxed">Adjust spatial coordinates or filter matrix to detect active scholars.</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Tactical Map Controls HUD */}
            <div className="absolute bottom-12 right-12 z-20 flex flex-col gap-4">
                <button className="size-14 bg-surface-dark/60 backdrop-blur-xl rounded-2xl border border-border-dark shadow-2xl flex items-center justify-center text-white/40 hover:text-indigo-500 hover:border-indigo-500/30 transition-all hover:-translate-y-1 font-black text-2xl active:scale-90">+</button>
                <button className="size-14 bg-surface-dark/60 backdrop-blur-xl rounded-2xl border border-border-dark shadow-2xl flex items-center justify-center text-white/40 hover:text-indigo-500 hover:border-indigo-500/30 transition-all hover:-translate-y-1 font-black text-2xl active:scale-90">-</button>
            </div>
        </div>
    );
}
