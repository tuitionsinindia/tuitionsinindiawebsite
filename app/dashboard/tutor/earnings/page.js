"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function EarningsContent() {
    const searchParams = useSearchParams();
    const tutorId = searchParams.get("tutorId");
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (tutorId) {
            fetchTransactions();
        }
    }, [tutorId]);

    const fetchTransactions = async () => {
        try {
            const res = await fetch(`/api/user/transactions?userId=${tutorId}`);
            if (res.ok) {
                const data = await res.json();
                setTransactions(data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-50 font-sans">
            <main className="flex-1 overflow-y-auto p-6">
                <div className="max-w-4xl mx-auto">
                    <Link href={`/dashboard/tutor?tutorId=${tutorId}`} className="flex items-center gap-2 text-blue-600 font-bold mb-8 hover:underline">
                        <span className="material-symbols-outlined text-sm">arrow_back</span> Back to Dashboard
                    </Link>

                    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm mb-6">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="size-14 bg-green-50 rounded-xl flex items-center justify-center text-green-600 shrink-0">
                                <span className="material-symbols-outlined text-3xl">payments</span>
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Earnings & Billing</h1>
                                <p className="text-gray-500 text-sm">Your credit purchase history and billing receipts.</p>
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 text-center mb-8">
                            <p className="text-sm font-semibold text-gray-500 mb-1">Total spent on leads</p>
                            <h2 className="text-4xl font-bold text-gray-900">
                                ₹{transactions.reduce((acc, curr) => curr.status === 'SUCCESS' ? acc + curr.amount : acc, 0)}
                            </h2>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Transaction history</h3>
                            {loading ? (
                                <div className="space-y-3">
                                    {[1, 2, 3].map(i => <div key={i} className="h-14 w-full bg-gray-100 rounded-xl animate-pulse"></div>)}
                                </div>
                            ) : transactions.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="border-b border-gray-200 bg-gray-50">
                                                <th className="py-3 px-3 text-xs font-semibold text-gray-500">Date</th>
                                                <th className="py-3 px-3 text-xs font-semibold text-gray-500">Description</th>
                                                <th className="py-3 px-3 text-xs font-semibold text-gray-500">Amount</th>
                                                <th className="py-3 px-3 text-xs font-semibold text-gray-500 text-right">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {transactions.map(tx => (
                                                <tr key={tx.id} className="border-b border-gray-100 last:border-0">
                                                    <td className="py-3 px-3 text-sm font-medium text-gray-700">{new Date(tx.createdAt).toLocaleDateString()}</td>
                                                    <td className="py-3 px-3 text-sm text-gray-500">{tx.description}</td>
                                                    <td className="py-3 px-3 text-sm font-semibold text-gray-900">₹{tx.amount}</td>
                                                    <td className="py-3 px-3 text-right">
                                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${tx.status === 'SUCCESS' ? 'bg-green-100 text-green-700' : tx.status === 'PENDING' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                                                            {tx.status === 'SUCCESS' ? 'Paid' : tx.status === 'PENDING' ? 'Pending' : 'Failed'}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                    <p className="text-gray-400 font-semibold text-sm">No transactions yet.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default function Earnings() {
    return (
        <Suspense fallback={<div className="p-10 text-center text-gray-500 font-semibold animate-pulse">Loading billing data...</div>}>
            <EarningsContent />
        </Suspense>
    );
}
