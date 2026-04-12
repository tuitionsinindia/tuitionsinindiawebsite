"use client";

import { Zap, CreditCard, History, ArrowUpRight, BadgeCheck, AlertCircle, Wallet } from "lucide-react";

export default function BillingModule({ userData, transactions = [] }) {
    return (
        <div className="space-y-12 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <h2 className="text-4xl font-black text-gray-900 uppercase italic tracking-tighter">Financial <span className="text-blue-600 underline decoration-blue-600/10">Ledger.</span></h2>
                <div className="flex gap-4">
                     <span className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border italic shadow-sm ${
                        userData?.subscriptionTier === 'ELITE' ? 'bg-blue-600 text-white border-blue-600 shadow-blue-600/20' : 'bg-white border-gray-100 text-blue-600'
                     }`}>
                        Tier Status: {userData?.subscriptionTier || 'Standard Discoverer'}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {/* Credit Asset Balance */}
                <div className="p-12 rounded-[3.5rem] bg-blue-600 text-white shadow-4xl shadow-blue-600/30 relative overflow-hidden group border-b-8 border-blue-800">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
                    <Zap size={110} className="absolute -right-6 -top-6 opacity-10 group-hover:scale-110 transition-transform duration-700 font-black" strokeWidth={3} />
                    <div className="relative z-10">
                        <p className="text-[10px] font-black uppercase tracking-[0.5em] mb-4 opacity-70 italic leading-none">Global Credit Assets</p>
                        <p className="text-7xl font-black italic tracking-tighter leading-none mb-10">{userData?.credits || 0}</p>
                        <button className="w-full py-5 bg-white text-blue-600 rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] hover:bg-gray-900 hover:text-white transition-all italic shadow-xl">
                            Recharge Reserves
                        </button>
                    </div>
                </div>

                {/* Subscription Status Card */}
                <div className="p-12 rounded-[3.5rem] bg-white border border-gray-100 flex flex-col justify-between shadow-4xl shadow-blue-900/[0.02] border-b-8 group">
                    <div className="space-y-6">
                        <div className="size-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shadow-inner">
                            <BadgeCheck size={28} strokeWidth={2.5} />
                        </div>
                        <div>
                            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-300 italic mb-2">Institutional Tier</h4>
                            <p className="text-3xl font-black text-gray-900 italic tracking-tight uppercase">{userData?.subscriptionStatus || 'PROVISIONAL'}</p>
                        </div>
                    </div>
                    <div className="flex items-center justify-between mt-10 pt-6 border-t border-gray-50">
                        <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] italic">Next Registry Update</p>
                        <p className="text-[10px] font-black text-blue-600 uppercase italic">PENDING</p>
                    </div>
                </div>

                {/* Sync Logs Frequency */}
                <div className="p-12 rounded-[3.5rem] bg-white border border-gray-100 flex flex-col justify-between shadow-4xl shadow-blue-900/[0.02] border-b-8">
                    <div className="space-y-6">
                        <div className="size-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 shadow-inner">
                            <History size={28} strokeWidth={2.5} />
                        </div>
                        <div>
                            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-300 italic mb-2">Synchronization Density</h4>
                            <p className="text-3xl font-black text-gray-900 italic tracking-tight uppercase">{transactions.length} Total Logs</p>
                        </div>
                    </div>
                    <div className="flex items-center justify-between mt-10 pt-6 border-t border-gray-50">
                        <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] italic">Ledger Status</p>
                        <p className="text-[10px] font-black text-emerald-600 uppercase italic">SYNCHRONIZED</p>
                    </div>
                </div>
            </div>

            {/* Detailed Transaction Registry */}
            <div className="space-y-10">
                <div className="flex items-center gap-8">
                    <h3 className="text-2xl font-black text-gray-900 uppercase italic tracking-tighter">Asset Synchronization <span className="text-gray-200">Ledger.</span></h3>
                    <div className="flex-1 h-px bg-gray-100"></div>
                </div>

                <div className="bg-white border border-gray-100 rounded-[3.5rem] overflow-hidden shadow-4xl shadow-blue-900/[0.03] border-b-8">
                    {transactions.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-gray-50 bg-gray-50/50">
                                        <th className="px-12 py-10 text-[10px] font-black uppercase tracking-[0.6em] text-gray-300 italic">Financial Narrative</th>
                                        <th className="px-12 py-10 text-[10px] font-black uppercase tracking-[0.6em] text-gray-300 italic">Institutional Value</th>
                                        <th className="px-12 py-10 text-[10px] font-black uppercase tracking-[0.6em] text-gray-300 italic">Registry Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {transactions.map((tx) => (
                                        <tr key={tx.id} className="group hover:bg-blue-50/30 transition-all font-black text-gray-900 italic tracking-tighter">
                                            <td className="px-12 py-10">
                                                <div className="flex items-center gap-4">
                                                    <div className="size-10 rounded-xl bg-gray-50 text-gray-400 flex items-center justify-center border border-gray-100 group-hover:bg-white group-hover:text-blue-600 transition-colors shadow-sm">
                                                        <Wallet size={16} strokeWidth={3} />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs lg:text-sm uppercase leading-none mb-2">{tx.description || 'CREDIT_RESERVE_RECAPTURE'}</p>
                                                        <p className="text-[10px] text-gray-300 uppercase tracking-widest leading-none font-medium italic">{new Date(tx.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-12 py-10 text-xl text-blue-600 font-serif font-light">
                                                <span className="font-sans font-black mr-1 text-gray-900 not-italic">₹</span>{tx.amount}
                                            </td>
                                            <td className="px-12 py-10">
                                                <span className={`px-5 py-2 rounded-full text-[10px] uppercase tracking-widest border italic shadow-sm flex items-center gap-2 w-fit ${
                                                    tx.status === 'SUCCESS' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                                                }`}>
                                                    <div className={`size-1.5 rounded-full ${tx.status === 'SUCCESS' ? 'bg-emerald-500' : 'bg-amber-500'} animate-pulse`}></div>
                                                    {tx.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="py-32 text-center flex flex-col items-center justify-center gap-8 opacity-20">
                             <div className="relative">
                                <AlertCircle size={80} className="text-gray-300" strokeWidth={1} />
                                <div className="absolute inset-0 bg-blue-600/10 blur-3xl rounded-full"></div>
                             </div>
                             <p className="text-[10px] font-black uppercase tracking-[0.6em] max-w-xs mx-auto leading-relaxed">No transactions yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
