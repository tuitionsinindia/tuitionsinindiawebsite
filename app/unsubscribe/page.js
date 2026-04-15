"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";

function UnsubscribeContent() {
    const searchParams = useSearchParams();
    const done = searchParams.get("done") === "1";
    const error = searchParams.get("error") === "1";

    return (
        <div className="min-h-screen bg-white flex items-center justify-center px-6">
            <div className="max-w-md w-full text-center">
                {done ? (
                    <>
                        <div className="size-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-5">
                            <CheckCircle2 size={32} className="text-green-600" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-3">You're unsubscribed</h1>
                        <p className="text-gray-500 mb-2">
                            You will no longer receive marketing emails from TuitionsInIndia.
                        </p>
                        <p className="text-gray-400 text-sm mb-8">
                            You will still receive important emails about your account, bookings, and payments.
                        </p>
                        <Link href="/" className="text-blue-600 font-semibold text-sm hover:underline">
                            Back to home
                        </Link>
                    </>
                ) : error ? (
                    <>
                        <div className="size-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-5">
                            <AlertCircle size={32} className="text-red-500" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-3">Something went wrong</h1>
                        <p className="text-gray-500 mb-8">
                            We could not process your unsubscribe request. Please try again or contact us at{" "}
                            <a href="mailto:support@tuitionsinindia.com" className="text-blue-600 hover:underline">
                                support@tuitionsinindia.com
                            </a>
                        </p>
                        <Link href="/" className="text-blue-600 font-semibold text-sm hover:underline">
                            Back to home
                        </Link>
                    </>
                ) : (
                    <>
                        <h1 className="text-2xl font-bold text-gray-900 mb-3">Unsubscribe</h1>
                        <p className="text-gray-500 mb-8">
                            If you received an unsubscribe link via email, please click it directly to opt out.
                        </p>
                        <Link href="/" className="text-blue-600 font-semibold text-sm hover:underline">
                            Back to home
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
}

export default function UnsubscribePage() {
    return (
        <Suspense>
            <UnsubscribeContent />
        </Suspense>
    );
}
