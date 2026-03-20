"use client";

export default function SkeletonLoader() {
    return (
        <div className="premium-card relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
            
            <div className="flex flex-col sm:flex-row gap-8 sm:gap-12 opacity-40">
                {/* Avatar Skeleton */}
                <div className="size-32 sm:size-44 rounded-[2.5rem] bg-slate-200 shrink-0 shadow-2xl shadow-slate-200 border border-white"></div>

                <div className="flex-1 space-y-6 py-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-6">
                        <div className="space-y-3 w-full sm:w-2/3">
                            {/* Name Skeleton */}
                            <div className="h-8 bg-slate-200 rounded-xl w-3/4"></div>
                            {/* Tags Skeleton */}
                            <div className="flex gap-2">
                                <div className="h-6 bg-slate-200 rounded-full w-24"></div>
                                <div className="h-6 bg-slate-200 rounded-full w-20"></div>
                            </div>
                        </div>
                        <div className="sm:text-right space-y-2 w-24">
                            {/* Price Skeleton */}
                            <div className="h-10 bg-slate-200 rounded-xl"></div>
                            <div className="h-4 bg-slate-200 rounded-lg w-16 ml-auto"></div>
                        </div>
                    </div>
                    
                    {/* Bio Skeleton */}
                    <div className="space-y-2">
                        <div className="h-4 bg-slate-200 rounded-lg w-full"></div>
                        <div className="h-4 bg-slate-200 rounded-lg w-5/6"></div>
                    </div>
                    
                    {/* Buttons Skeleton */}
                    <div className="flex flex-wrap items-center gap-4 pt-4">
                        <div className="h-14 bg-slate-200 rounded-2xl flex-1 sm:flex-none w-48"></div>
                        <div className="h-14 bg-slate-200 rounded-2xl flex-1 sm:flex-none w-44"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
