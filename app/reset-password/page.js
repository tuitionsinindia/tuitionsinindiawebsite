"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { Loader2, CheckCircle, AlertTriangle, GraduationCap } from "lucide-react";
import Logo from "@/app/components/Logo";

function ResetPasswordContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [status, setStatus] = useState("verifying"); // verifying | success | error
    const [errorMsg, setErrorMsg] = useState("");

    useEffect(() => {
        const token = searchParams.get("token");
        const uid = searchParams.get("uid");

        if (!token || !uid) {
            setStatus("error");
            setErrorMsg("This link is incomplete. Please request a new one.");
            return;
        }

        fetch("/api/auth/password-reset/confirm", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token, uid }),
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setStatus("success");
                    setTimeout(() => router.push(data.redirectTo), 1500);
                } else {
                    setStatus("error");
                    setErrorMsg(data.error || "Link is invalid or has expired.");
                }
            })
            .catch(() => {
                setStatus("error");
                setErrorMsg("Something went wrong. Please try again.");
            });
    }, [searchParams, router]);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 font-sans">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 w-full max-w-sm text-center space-y-5">
                <div className="flex justify-center mb-2">
                    <Logo />
                </div>

                {status === "verifying" && (
                    <>
                        <div className="size-14 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto">
                            <Loader2 size={28} className="text-blue-600 animate-spin" />
                        </div>
                        <h1 className="text-xl font-bold text-gray-900">Verifying your link…</h1>
                        <p className="text-sm text-gray-400">Just a moment while we log you in.</p>
                    </>
                )}

                {status === "success" && (
                    <>
                        <div className="size-14 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto">
                            <CheckCircle size={28} className="text-emerald-600" />
                        </div>
                        <h1 className="text-xl font-bold text-gray-900">You're logged in!</h1>
                        <p className="text-sm text-gray-400">Taking you to your dashboard…</p>
                    </>
                )}

                {status === "error" && (
                    <>
                        <div className="size-14 rounded-2xl bg-red-50 flex items-center justify-center mx-auto">
                            <AlertTriangle size={28} className="text-red-500" />
                        </div>
                        <h1 className="text-xl font-bold text-gray-900">Link not valid</h1>
                        <p className="text-sm text-gray-500">{errorMsg}</p>
                        <div className="flex flex-col gap-2 pt-2">
                            <Link
                                href="/login"
                                className="w-full py-3 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors"
                            >
                                Back to login
                            </Link>
                            <p className="text-xs text-gray-400">
                                You can request a new link from your dashboard settings.
                            </p>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 size={32} className="animate-spin text-blue-600" />
            </div>
        }>
            <ResetPasswordContent />
        </Suspense>
    );
}
