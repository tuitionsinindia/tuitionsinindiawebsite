import Link from "next/link";
import { Search, Home } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
            <div className="text-center max-w-md">
                <p className="text-8xl font-bold text-blue-600 mb-4">404</p>
                <h1 className="text-2xl font-bold text-gray-900 mb-3">Page not found</h1>
                <p className="text-gray-500 mb-8">
                    Sorry, we couldn't find the page you were looking for.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Home size={16} />
                        Go home
                    </Link>
                    <Link
                        href="/search"
                        className="inline-flex items-center justify-center gap-2 bg-white text-gray-700 font-semibold px-6 py-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                        <Search size={16} />
                        Find a tutor
                    </Link>
                </div>
            </div>
        </div>
    );
}
