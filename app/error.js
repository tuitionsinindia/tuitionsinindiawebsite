"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

// Catches render/runtime errors in any route. Next.js invokes this when a
// React tree below it throws. Keep it branded so a stacktrace never reaches
// the user.
export default function Error({ error, reset }) {
    useEffect(() => {
        // Report to server logs so we can see what broke for real users.
        console.error("Page error boundary:", error);
    }, [error]);

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 py-20">
            <div className="text-center max-w-md">
                <div className="inline-flex items-center justify-center size-14 rounded-2xl bg-amber-50 text-amber-600 mb-5">
                    <AlertTriangle size={24} />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h1>
                <p className="text-sm text-gray-500 mb-8 leading-relaxed">
                    A technical error stopped this page from loading. Our team has been notified.
                    In the meantime, try reloading — usually it's temporary.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                        onClick={reset}
                        className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <RefreshCw size={16} />
                        Try again
                    </button>
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center gap-2 bg-white text-gray-700 font-semibold px-6 py-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                        <Home size={16} />
                        Go home
                    </Link>
                </div>
                {error?.digest && (
                    <p className="mt-8 text-xs text-gray-400">
                        Reference: <code className="bg-gray-50 border border-gray-200 px-1.5 py-0.5 rounded">{error.digest}</code>
                    </p>
                )}
            </div>
        </div>
    );
}
