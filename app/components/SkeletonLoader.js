"use client";

export default function SkeletonLoader() {
    return (
        <div className="bg-surface-dark/40 backdrop-blur-3xl rounded-[3.5rem] p-10 md:p-12 border border-border-dark relative overflow-hidden group border-b-8">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
            
            <div className="flex flex-col md:flex-row gap-10 md:gap-12 opacity-20">
                {/* Avatar Skeleton */}
                <div className="size-24 md:size-32 rounded-[2rem] bg-indigo-500/10 shrink-0 border-2 border-indigo-500/10 shadow-[0_0_50px_rgba(79,70,229,0.1)]"></div>

                <div className="flex-1 space-y-8 py-2">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                        <div className="space-y-4 w-full md:w-2/3">
                            {/* Name Skeleton */}
                            <div className="h-10 bg-white/10 rounded-2xl w-3/4 italic"></div>
                            {/* Tags Skeleton */}
                            <div className="flex gap-3">
                                <div className="h-6 bg-white/5 rounded-xl w-24"></div>
                                <div className="h-6 bg-white/5 rounded-xl w-32"></div>
                            </div>
                        </div>
                        <div className="md:text-right space-y-3 w-32">
                            {/* Price Skeleton */}
                            <div className="h-12 bg-indigo-500/10 rounded-2xl border border-indigo-500/20"></div>
                            <div className="h-4 bg-white/5 rounded-lg w-16 ml-auto"></div>
                        </div>
                    </div>
                    
                    {/* Bio Skeleton */}
                    <div className="space-y-3">
                        <div className="h-4 bg-white/5 rounded-lg w-full"></div>
                        <div className="h-4 bg-white/5 rounded-lg w-5/6"></div>
                    </div>
                    
                    {/* Buttons Skeleton */}
                    <div className="flex flex-wrap items-center gap-6 pt-6">
                        <div className="h-16 bg-white/10 rounded-[2rem] flex-1 md:flex-none w-56"></div>
                        <div className="h-16 bg-white/5 rounded-[2rem] flex-1 md:flex-none w-48"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
