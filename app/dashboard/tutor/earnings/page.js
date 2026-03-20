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
        <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 font-sans">
            <main className="flex-1 overflow-y-auto p-10">
                <div className="max-w-4xl mx-auto">
                    <Link href={`/dashboard/tutor?tutorId=${tutorId}`} className="flex items-center gap-2 text-primary font-bold mb-8 hover:underline">
                        <span className="material-symbols-outlined text-sm">arrow_back</span> Back to Dashboard
                    </Link>

                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-10 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/20 mb-8">
                        <div className="flex items-center gap-6 mb-8 text-left">
                            <div className="size-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 shrink-0">
                                <span className="material-symbols-outlined text-3xl">payments</span>
                            </div>
                            <div>
                                <h1 className="text-3xl font-heading font-bold">Earnings & Billing</h1>
                                <p className="text-slate-500 font-medium">View your credit purchase history and billing receipts.</p>
                            </div>
                        </div>

                        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 text-center mb-10">
                            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Total Spent on Leads</p>
                            <h2 className="text-5xl font-black text-slate-900 dark:text-white">
                                ₹{transactions.reduce((acc, curr) => curr.status === 'SUCCESS' ? acc + curr.amount : acc, 0)}
                            </h2>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-xl font-bold mb-4">Transaction History</h3>
                            {loading ? (
                                <div className="space-y-3">
                                    {[1, 2, 3].map(i => <div key={i} className="h-16 w-full bg-slate-50 dark:bg-slate-800 rounded-xl animate-pulse"></div>)}
                                </div>
                            ) : transactions.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="border-b border-slate-100 dark:border-slate-800">
                                                <th className="py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Date</th>
                                                <th className="py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Description</th>
                                                <th className="py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Amount</th>
                                                <th className="py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {transactions.map(tx => (
                                                <tr key={tx.id} className="border-b border-slate-50 dark:border-slate-800 last:border-0">
                                                    <td className="py-4 text-sm font-semibold">{new Date(tx.createdAt).toLocaleDateString()}</td>
                                                    <td className="py-4 text-sm font-medium text-slate-500">{tx.description}</td>
                                                    <td className="py-4 text-sm font-bold">₹{tx.amount}</td>
                                                    <td className="py-4 text-right">
                                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${tx.status === 'SUCCESS' ? 'bg-emerald-100 text-emerald-600' : tx.status === 'PENDING' ? 'bg-amber-100 text-amber-600' : 'bg-red-100 text-red-600'}`}>
                                                            {tx.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-12 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                                    <p className="text-slate-400 font-bold">No transactions found.</p>
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
        <Suspense fallback={<div className="p-10 text-center text-slate-500 font-bold animate-pulse">Loading Billing Data...</div>}>
            <EarningsContent />
        </Suspense>
    );
}
