import { Loader2 } from "lucide-react";

export default function Loading() {
    return (
        <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center">
            <Loader2 size={32} className="animate-spin text-blue-600 mb-4" />
            <p className="text-sm text-gray-400">Loading...</p>
        </div>
    );
}
