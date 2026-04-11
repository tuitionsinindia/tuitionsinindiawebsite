"use client";

import { MapPin, Navigation, Info, User, Star, Activity, Radar } from "lucide-react";

export default function MapComponent({ tutors = [] }) {
    return (
        <div className="w-full h-full bg-slate-50 rounded-[4rem] border border-gray-200 relative overflow-hidden flex flex-col shadow-inner">
            {/* Tactical Grid Background Pattern */}
            <div className="absolute inset-0 opacity-[0.1] pointer-events-none" 
                style={{ 
                    backgroundImage: `radial-gradient(circle, #0d40a5 1px, transparent 1px)`,
                    backgroundSize: '40px 40px'
                }} 
            />
            
            {/* Neural Map Background Scan */}
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] blend-multiply"></div>

            {/* Map Overlay Info (Tactical HUD) */}
            <div className="absolute top-10 left-10 z-20 max-w-sm space-y-6">
                <div className="bg-white/90 backdrop-blur-3xl p-8 rounded-[3rem] border border-gray-100 shadow-2xl space-y-6 border-b-8 border-blue-600/20">
                    <div className="flex items-center gap-4">
                        <div className="size-14 rounded-2xl bg-blue-600/10 text-blue-600 flex items-center justify-center border border-blue-500/20">
                            <Radar size={28} className="animate-pulse" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-gray-900 italic tracking-tighter uppercase leading-none mb-1">Geospatial Radar</h3>
                            <p className="text-xs font-black text-gray-400 uppercase tracking-[0.4em] leading-none">
                                Nodes detected: {tutors.length}
                            </p>
                        </div>
                    </div>
                    <div className="px-6 py-4 bg-gray-50 rounded-2xl border border-gray-100 italic">
                        <p className="text-xs font-medium text-gray-500 leading-relaxed uppercase tracking-wider">
                            Explore academic experts in the <span className="text-blue-600 font-bold">geospatial grid</span>. Zoom for granular data.
                        </p>
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
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-6 w-64 bg-white border border-gray-100 backdrop-blur-3xl rounded-[2.5rem] p-6 shadow-4xl opacity-0 group-hover/marker:opacity-100 transition-all scale-75 group-hover/marker:scale-100 pointer-events-none z-30 border-b-6 border-blue-600/20">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="size-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-xl italic shadow-xl">
                                            {tutor.name?.charAt(0) || '?'}
                                        </div>
                                        <div className="overflow-hidden">
                                            <p className="text-[13px] font-black text-gray-900 italic uppercase tracking-tighter truncate leading-none mb-1">{tutor.name || 'ANONYMOUS'}</p>
                                            <p className="text-xs font-black text-blue-600 uppercase tracking-widest leading-none">{tutor.subject || 'FACULTY'}</p>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center py-4 border-t border-gray-50">
                                        <div className="flex items-center gap-1.5 text-amber-500 text-xs font-black italic">
                                            <Star size={12} fill="currentColor" /> {(tutor.rating || '4.8')}
                                        </div>
                                        <div className="text-gray-900 text-[12px] font-black italic tracking-tighter">₹{tutor.rate || '500'}/HR</div>
                                    </div>
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45 border-r border-b border-gray-100 -mt-2"></div>
                                </div>

                                {/* Tactical Pin Icon */}
                                <div className="size-12 bg-white border border-gray-100 rounded-full flex items-center justify-center group-hover/marker:scale-125 group-hover/marker:border-blue-600 transition-all hover:z-20 shadow-xl group-hover/marker:bg-blue-50">
                                    <div className="size-8 rounded-full bg-blue-600/10 border border-blue-500/10 flex items-center justify-center text-blue-600 group-hover/marker:text-blue-700 transition-colors">
                                        <MapPin size={18} className="fill-current" />
                                    </div>
                                </div>
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-16 bg-blue-500/10 rounded-full animate-pulse pointer-events-none"></div>
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
                                <p className="text-white/10 font-black text-xs uppercase tracking-[0.4em] leading-relaxed">Adjust spatial coordinates or filter matrix to detect active scholars.</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Tactical Map Controls HUD */}
            <div className="absolute bottom-12 right-12 z-20 flex flex-col gap-4">
                <button className="size-14 bg-white/90 backdrop-blur-xl rounded-2xl border border-gray-100 shadow-2xl flex items-center justify-center text-gray-400 hover:text-blue-600 hover:border-blue-500/30 transition-all hover:-translate-y-1 font-black text-2xl active:scale-90">+</button>
                <button className="size-14 bg-white/90 backdrop-blur-xl rounded-2xl border border-gray-100 shadow-2xl flex items-center justify-center text-gray-400 hover:text-blue-600 hover:border-blue-500/30 transition-all hover:-translate-y-1 font-black text-2xl active:scale-90">-</button>
            </div>
        </div>
    );
}
