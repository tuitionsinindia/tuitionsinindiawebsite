"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Wallet } from "lucide-react";

function EarningsContent() {
    const searchParams = useSearchParams();
    const instituteId = searchParams.get("instituteId");
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (instituteId) {
            fetchTransactions();
        }
    }, [instituteId]);

    const fetchTransactions = async () => {
        try {
            const res = await fetch(`/api/user/transactions?userId=${instituteId}`);
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

    const totalSpend = transactions.reduce((acc, curr) => curr.status === 'SUCCESS' ? acc + curr.amount : acc, 0);

    return (
        <div className="flex min-h-screen bg-gray-50 font-sans text-gray-900">
            <main className="flex-1 overflow-y-auto p-6 md:p-10">
                <div className="max-w-3xl mx-auto">
                    <Link
                        href={`/dashboard/institute?instituteId=${instituteId}`}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-blue-600 transition-colors group mb-8"
                    >
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
                    </Link>

                    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm mb-6">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="size-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 shrink-0">
                                <Wallet size={22} strokeWidth={2} />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">Billing</h1>
                                <p className="text-sm text-gray-500">Track your credit purchases and spending history.</p>
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 text-center mb-8">
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Total spend</p>
                            <h2 className="text-4xl font-bold text-gray-900">₹{totalSpend}</h2>
                        </div>

                        <div>
                            <h3 className="text-base font-bold text-gray-900 mb-4">Transaction history</h3>
                            {loading ? (
                                <div className="space-y-3">
                                    {[1, 2, 3].map(i => <div key={i} className="h-14 w-full bg-gray-50 rounded-xl animate-pulse border border-gray-100"></div>)}
                                </div>
                            ) : transactions.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="border-b border-gray-200 bg-gray-50">
                                                <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider rounded-tl-xl">Date</th>
                                                <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</th>
                                                <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                                                <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right rounded-tr-xl">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {transactions.map(tx => (
                                                <tr key={tx.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                                                    <td className="py-4 px-4 text-sm font-medium text-gray-700">{new Date(tx.createdAt).toLocaleDateString()}</td>
                                                    <td className="py-4 px-4 text-sm text-gray-500">{tx.description}</td>
                                                    <td className="py-4 px-4 text-sm font-semibold text-gray-900">₹{tx.amount}</td>
                                                    <td className="py-4 px-4 text-right">
                                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${tx.status === 'SUCCESS' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : tx.status === 'PENDING' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
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
                                    <p className="text-gray-400 text-sm font-medium">No transactions yet.</p>
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
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="flex flex-col items-center gap-4 text-gray-400">
                    <div className="size-10 rounded-full border-4 border-gray-200 border-t-blue-600 animate-spin"></div>
                    <p className="text-sm font-medium">Loading billing...</p>
                </div>
            </div>
        }>
            <EarningsContent />
        </Suspense>
    );
}
