import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function SubscriptionContent() {
    const searchParams = useSearchParams();
    const studentId = searchParams.get("studentId");
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (studentId) {
            fetchTransactions();
        }
    }, [studentId]);

    const fetchTransactions = async () => {
        try {
            const res = await fetch(`/api/user/transactions?userId=${studentId}`);
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
            <main className="flex-1 overflow-y-auto p-6 md:p-10">
                <div className="max-w-4xl mx-auto">
                    <Link href={`/dashboard/student?studentId=${studentId}`} className="flex items-center gap-2 text-primary font-bold mb-8 hover:underline">
                        <span className="material-symbols-outlined text-sm">arrow_back</span> Back to Dashboard
                    </Link>

                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-10 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/20 text-center flex flex-col items-center">
                        <div className="size-20 bg-indigo-500/10 rounded-full flex items-center justify-center text-indigo-500 mx-auto mb-6">
                            <span className="material-symbols-outlined text-4xl">card_membership</span>
                        </div>
                        <h1 className="text-3xl font-heading font-bold mb-4">Pro Learner Subscription</h1>
                        <p className="text-slate-500 mb-8 max-w-lg mx-auto">Upgrade to the Pro Learner tier to unlock premium tutor contacts instantly every month and access advanced AI matchmaking tools.</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full text-left">
                            <div className="bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-2xl p-8 shadow-xl shadow-indigo-500/20 text-white overflow-hidden relative border border-indigo-400">
                                <div className="absolute -right-10 -top-10 size-40 bg-white/10 rounded-full blur-2xl"></div>
                                <h2 className="text-xl font-bold mb-2">Basic Plan</h2>
                                <p className="opacity-80 text-sm mb-6">Free access to directory.</p>
                                <ul className="space-y-3 font-semibold text-sm mb-8 opacity-90">
                                    <li className="flex items-center gap-2"><span className="material-symbols-outlined text-[18px]">close</span> No monthly credits</li>
                                    <li className="flex items-center gap-2 text-emerald-300"><span className="material-symbols-outlined text-[18px]">check</span> Pay-per-unlock active</li>
                                </ul>
                                <Link href="/pricing/student" className="block text-center w-full py-3 bg-white text-indigo-600 font-bold rounded-xl hover:bg-slate-50 transition-colors">Compare Plans</Link>
                            </div>

                            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-100 dark:border-slate-700">
                                <h3 className="font-bold text-lg mb-4">Recent Top-ups</h3>
                                {loading ? (
                                    <div className="space-y-2">
                                        <div className="h-10 bg-slate-50 dark:bg-slate-700 rounded-lg animate-pulse"></div>
                                        <div className="h-10 bg-slate-50 dark:bg-slate-700 rounded-lg animate-pulse"></div>
                                    </div>
                                ) : transactions.length > 0 ? (
                                    <div className="space-y-3">
                                        {transactions.slice(0, 5).map(tx => (
                                            <div key={tx.id} className="flex justify-between items-center py-2 border-b border-slate-50 dark:border-slate-700 last:border-0">
                                                <div>
                                                    <p className="text-xs font-bold text-slate-400">{new Date(tx.createdAt).toLocaleDateString()}</p>
                                                    <p className="text-sm font-semibold">{tx.description?.split('(')[0] || 'Credit Top-up'}</p>
                                                </div>
                                                <p className="font-bold text-primary">₹{tx.amount}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-slate-400 font-medium italic text-center py-4">No recent transactions.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default function Subscription() {
    return (
        <Suspense fallback={<div className="p-10 text-center text-slate-500 font-bold animate-pulse">Loading Subscription...</div>}>
            <SubscriptionContent />
        </Suspense>
    );
}
