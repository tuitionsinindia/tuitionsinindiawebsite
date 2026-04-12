"use client";

import { MapPin, Star, Search } from "lucide-react";

export default function MapComponent({ tutors = [] }) {
    return (
        <div className="w-full h-full bg-gray-50 rounded-2xl border border-gray-200 relative overflow-hidden flex flex-col">
            {/* Grid Background */}
            <div className="absolute inset-0 opacity-[0.08] pointer-events-none"
                style={{ backgroundImage: `radial-gradient(circle, #94a3b8 1px, transparent 1px)`, backgroundSize: '40px 40px' }}
            />

            {/* Map Info Panel */}
            <div className="absolute top-6 left-6 z-20 max-w-xs">
                <div className="bg-white/95 backdrop-blur-sm p-5 rounded-xl border border-gray-200 shadow-lg">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="size-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                            <MapPin size={20} />
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900">Tutors Near You</h3>
                            <p className="text-xs text-gray-500">{tutors.length} tutors found</p>
                        </div>
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed">
                        Showing tutors in your area. Click a pin to see details.
                    </p>
                </div>
            </div>

            {/* Markers */}
            <div className="relative flex-1 overflow-hidden">
                {tutors.slice(0, 15).map((tutor, i) => {
                    const top = 15 + ((i * 73) % 70);
                    const left = 15 + ((i * 37) % 70);

                    return (
                        <div key={tutor.id || i} className="absolute z-10" style={{ top: `${top}%`, left: `${left}%` }}>
                            <div className="group/marker relative cursor-pointer">
                                {/* Hover Card */}
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-56 bg-white border border-gray-200 rounded-xl p-4 shadow-lg opacity-0 group-hover/marker:opacity-100 transition-all scale-90 group-hover/marker:scale-100 pointer-events-none z-30">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="size-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-sm">
                                            {tutor.name?.charAt(0) || '?'}
                                        </div>
                                        <div className="overflow-hidden">
                                            <p className="text-sm font-semibold text-gray-900 truncate">{tutor.name || 'Tutor'}</p>
                                            <p className="text-xs text-blue-600">{tutor.subject || 'Academics'}</p>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                                        <div className="flex items-center gap-1 text-amber-500 text-xs font-medium">
                                            <Star size={11} fill="currentColor" /> {tutor.rating || '4.8'}
                                        </div>
                                        <p className="text-sm font-bold text-gray-900">{tutor.rate ? `₹${tutor.rate}/hr` : ''}</p>
                                    </div>
                                </div>

                                {/* Pin */}
                                <div className="size-10 bg-white border border-gray-200 rounded-full flex items-center justify-center group-hover/marker:scale-110 group-hover/marker:border-blue-500 transition-all shadow-md">
                                    <MapPin size={16} className="text-blue-600" />
                                </div>
                            </div>
                        </div>
                    );
                })}

                {/* Empty State */}
                {tutors.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center text-center p-12">
                        <div className="space-y-4">
                            <div className="size-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto text-gray-300">
                                <Search size={28} />
                            </div>
                            <div>
                                <h4 className="text-base font-semibold text-gray-500 mb-1">No tutors on map</h4>
                                <p className="text-xs text-gray-400">Try adjusting your filters or searching a different location.</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Zoom Controls */}
            <div className="absolute bottom-6 right-6 z-20 flex flex-col gap-2">
                <button className="size-10 bg-white rounded-lg border border-gray-200 shadow-sm flex items-center justify-center text-gray-500 hover:text-blue-600 transition-colors text-lg font-semibold">+</button>
                <button className="size-10 bg-white rounded-lg border border-gray-200 shadow-sm flex items-center justify-center text-gray-500 hover:text-blue-600 transition-colors text-lg font-semibold">-</button>
            </div>
        </div>
    );
}
