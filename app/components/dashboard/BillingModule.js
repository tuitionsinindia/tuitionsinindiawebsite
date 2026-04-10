"use client";

import { Zap, CreditCard, History, ArrowUpRight, BadgeCheck, AlertCircle } from "lucide-react";

export default function BillingModule({ userData, transactions = [] }) {
    return (
        <div className="space-y-12 animate-in fade-in duration-700">
            <div className="flex items-center justify-between">
                <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter">Finance <span className="text-amber-500 underline decoration-amber-500/20">Ledger.</span></h2>
                <div className="flex gap-4">
                     <span className={`px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border border-emerald-500/20 italic ${
                        userData?.subscriptionTier === 'ELITE' ? 'bg-emerald-500 text-white shadow-xl shadow-emerald-500/20' : 'bg-emerald-500/10 text-emerald-500'
                     }`}>
                        Tier: {userData?.subscriptionTier || 'FREE_SIGNAL'}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {/* Credit Balance Card */}
                <div className="p-10 rounded-[3rem] bg-amber-500 text-white shadow-2xl shadow-amber-500/20 relative overflow-hidden group border-b-8 border-amber-600">
                    <Zap size={100} className="absolute -right-4 -top-4 opacity-10 group-hover:scale-110 transition-transform duration-700" />
                    <div className="relative z-10">
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] mb-4 opacity-60 italic leading-none">Neural Credits Available</p>
                        <p className="text-7xl font-black italic tracking-tighter leading-none mb-10">{userData?.credits || 0}</p>
                        <button className="w-full py-4 bg-white/20 backdrop-blur-md rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] border border-white/30 hover:bg-white hover:text-amber-500 transition-all italic">
                            RECHARGE_RESOURCES
                        </button>
                    </div>
                </div>

                {/* Subscription Card */}
                <div className="p-10 rounded-[4rem] bg-surface-dark/40 border border-border-dark flex flex-col justify-between border-b-8 group">
                    <div className="space-y-4">
                        <div className="size-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                            <BadgeCheck size={24} strokeWidth={2.5} />
                        </div>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 italic">Subscription Logic</h4>
                        <p className="text-3xl font-black text-white italic tracking-tight">{userData?.subscriptionStatus || 'INACTIVE'}</p>
                    </div>
                    <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.3em] mt-8 italic">Next Cycle: UNSET</p>
                </div>

                {/* Activity Card */}
                <div className="p-10 rounded-[4rem] bg-surface-dark/40 border border-border-dark flex flex-col justify-between border-b-8">
                    <div className="space-y-4">
                        <div className="size-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                            <History size={24} strokeWidth={2.5} />
                        </div>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 italic">Market Velocity</h4>
                        <p className="text-3xl font-black text-white italic tracking-tight">{transactions.length} SYNC_LOGS</p>
                    </div>
                    <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.3em] mt-8 italic text-right">LEDGER_SYNCHRONIZED</p>
                </div>
            </div>

            {/* Transaction Terminal */}
            <div className="space-y-8">
                <div className="flex items-center gap-6">
                    <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">Transaction <span className="text-white/20">Ledger.</span></h3>
                    <div className="flex-1 h-px bg-border-dark"></div>
                </div>

                <div className="bg-surface-dark/20 backdrop-blur-3xl border border-border-dark rounded-[3rem] overflow-hidden shadow-2xl border-b-8">
                    {transactions.length > 0 ? (
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-border-dark bg-background-dark/30">
                                    <th className="px-10 py-10 text-[9px] font-black uppercase tracking-[0.5em] text-white/20 italic">Ledger Entry</th>
                                    <th className="px-10 py-10 text-[9px] font-black uppercase tracking-[0.5em] text-white/20 italic">Asset Value</th>
                                    <th className="px-10 py-10 text-[9px] font-black uppercase tracking-[0.5em] text-white/20 italic">Status Protocol</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border-dark/50">
                                {transactions.map((tx) => (
                                    <tr key={tx.id} className="group hover:bg-white/5 transition-colors font-black text-white italic tracking-tighter">
                                        <td className="px-10 py-10">
                                            <p className="text-sm uppercase leading-none mb-2">{tx.description || 'RESOURCE_RECHARGE'}</p>
                                            <p className="text-[9px] text-white/20 uppercase tracking-widest">{new Date(tx.createdAt).toLocaleDateString()}</p>
                                        </td>
                                        <td className="px-10 py-10 text-emerald-500">
                                            ₹{tx.amount}
                                        </td>
                                        <td className="px-10 py-10">
                                            <span className={`px-4 py-1.5 rounded-full text-[8px] uppercase tracking-widest border italic ${
                                                tx.status === 'SUCCESS' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                                            }`}>
                                                {tx.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="py-24 text-center opacity-20 flex flex-col items-center gap-6 italic">
                             <AlertCircle size={40} className="text-white/20" />
                             <p className="text-[10px] font-black uppercase tracking-[0.5em]">No financial sync logs discovered in the terminal directory.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
