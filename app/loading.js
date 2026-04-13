import { GraduationCap } from "lucide-react";

export default function Loading() {
    return (
        <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center pointer-events-none select-none">
            <div className="flex flex-col items-center gap-4">
                <div className="size-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center">
                    <GraduationCap size={28} />
                </div>
                <div className="w-48 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full animate-pulse" style={{ width: "60%" }} />
                </div>
                <p className="text-sm text-gray-400">Loading...</p>
            </div>
        </div>
    );
}
