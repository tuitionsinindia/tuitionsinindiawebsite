import Link from "next/link";
import { Search, Home } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 py-20">
            <div className="max-w-md w-full text-center space-y-8">
                <div className="text-[120px] font-black text-gray-100 leading-none select-none">
                    404
                </div>

                <div className="space-y-3">
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Page not found</h1>
                    <p className="text-gray-500 leading-relaxed">
                        The page you're looking for doesn't exist or has been moved.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
                    >
                        <Home size={16} />
                        Go Home
                    </Link>
                    <Link
                        href="/search"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
                    >
                        <Search size={16} />
                        Find a Tutor
                    </Link>
                </div>
            </div>
        </div>
    );
}
