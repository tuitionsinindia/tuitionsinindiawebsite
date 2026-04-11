"use client";

export default function SkeletonLoader() {
    return (
        <div className="bg-white rounded-2xl p-6 border border-gray-200 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-50 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>

            <div className="flex flex-col md:flex-row gap-6 md:gap-8">
                {/* Avatar Skeleton */}
                <div className="size-20 md:size-28 rounded-2xl bg-gray-100 shrink-0"></div>

                <div className="flex-1 space-y-5 py-1">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                        <div className="space-y-3 w-full md:w-2/3">
                            {/* Name Skeleton */}
                            <div className="h-7 bg-gray-100 rounded-xl w-3/4"></div>
                            {/* Tags Skeleton */}
                            <div className="flex gap-2">
                                <div className="h-5 bg-gray-100 rounded-lg w-20"></div>
                                <div className="h-5 bg-gray-100 rounded-lg w-28"></div>
                            </div>
                        </div>
                        <div className="md:text-right space-y-2 w-28">
                            {/* Price Skeleton */}
                            <div className="h-10 bg-gray-100 rounded-xl"></div>
                            <div className="h-3 bg-gray-100 rounded-lg w-14 ml-auto"></div>
                        </div>
                    </div>

                    {/* Bio Skeleton */}
                    <div className="space-y-2">
                        <div className="h-3 bg-gray-100 rounded-lg w-full"></div>
                        <div className="h-3 bg-gray-100 rounded-lg w-5/6"></div>
                    </div>

                    {/* Buttons Skeleton */}
                    <div className="flex flex-wrap items-center gap-3 pt-2">
                        <div className="h-11 bg-gray-100 rounded-xl flex-1 md:flex-none w-48"></div>
                        <div className="h-11 bg-gray-100 rounded-xl flex-1 md:flex-none w-36"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
