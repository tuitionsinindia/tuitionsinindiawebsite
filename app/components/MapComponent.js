"use client";

export default function MapComponent({ tutors }) {
    return (
        <div className="w-full h-[600px] bg-slate-100 rounded-[2.5rem] border border-slate-200 relative overflow-hidden flex items-center justify-center">
            <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#1e448a 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

            <div className="relative z-10 text-center space-y-4 max-w-md px-6">
                <div className="size-20 rounded-3xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-6">
                    <span className="material-symbols-outlined text-4xl">map</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-800">Interactive Map View</h3>
                <p className="text-slate-500 font-medium leading-relaxed">
                    Showing location of {tutors.length} tutors near you. Connect with local subject experts for home tuition or nearby coaching.
                </p>

                <div className="grid grid-cols-2 gap-3 mt-8">
                    {tutors.slice(0, 4).map(tutor => (
                        <div key={tutor.id} className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
                            <div className="size-8 rounded-full bg-primary/5 text-primary flex items-center justify-center font-bold text-xs">
                                {tutor.name.charAt(0)}
                            </div>
                            <div className="text-left">
                                <p className="text-[10px] font-bold text-slate-900 truncate w-24">{tutor.name}</p>
                                <p className="text-[9px] text-slate-400 font-medium">{tutor.location}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="pt-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-700 rounded-xl text-[10px] font-bold uppercase tracking-wider">
                        <span className="material-symbols-outlined text-sm">info</span>
                        Google Maps API Key Required for Live View
                    </div>
                </div>
            </div>

            {/* Mock Markers */}
            <div className="absolute top-1/4 left-1/3 size-4 bg-primary rounded-full animate-pulse shadow-lg shadow-primary/40 border-2 border-white"></div>
            <div className="absolute top-1/2 right-1/4 size-4 bg-primary rounded-full animate-pulse shadow-lg shadow-primary/40 border-2 border-white transition-all hover:scale-150 cursor-pointer"></div>
            <div className="absolute bottom-1/3 left-1/2 size-4 bg-primary rounded-full animate-pulse shadow-lg shadow-primary/40 border-2 border-white"></div>
        </div>
    );
}
