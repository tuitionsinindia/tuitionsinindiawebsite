"use client";

import { CreditCard, History, BadgeCheck, AlertCircle, Wallet } from "lucide-react";

export default function BillingModule({ userData, transactions = [] }) {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Billing & Credits</h2>
                <span className={`px-4 py-1.5 rounded-lg text-xs font-semibold border w-fit ${
                    userData?.subscriptionTier === 'ELITE'
                        ? 'bg-blue-600 text-white border-blue-600'
                        : userData?.subscriptionTier === 'PRO'
                        ? 'bg-blue-50 text-blue-600 border-blue-100'
                        : 'bg-gray-50 text-gray-600 border-gray-200'
                }`}>
                    {userData?.subscriptionTier || 'Free'} Plan
                </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Credit Balance */}
                <div className="p-6 rounded-2xl bg-blue-600 text-white shadow-sm">
                    <p className="text-xs font-medium opacity-70 mb-2">Credit Balance</p>
                    <p className="text-4xl font-bold mb-4">{userData?.credits || 0}</p>
                    <p className="text-xs opacity-60">Use credits to unlock student contacts</p>
                </div>

                {/* Subscription Status */}
                <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm">
                    <div className="size-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                        <BadgeCheck size={20} />
                    </div>
                    <p className="text-xs font-medium text-gray-400 mb-1">Subscription</p>
                    <p className="text-lg font-bold text-gray-900">{userData?.subscriptionStatus === 'ACTIVE' ? 'Active' : 'Not subscribed'}</p>
                </div>

                {/* Total Transactions */}
                <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm">
                    <div className="size-10 rounded-xl bg-gray-50 text-gray-600 flex items-center justify-center mb-4">
                        <History size={20} />
                    </div>
                    <p className="text-xs font-medium text-gray-400 mb-1">Transactions</p>
                    <p className="text-lg font-bold text-gray-900">{transactions.length} total</p>
                </div>
            </div>

            {/* Transaction History */}
            <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Transaction History</h3>
                <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                    {transactions.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-gray-50 bg-gray-50">
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-500">Description</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-500">Amount</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-500">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {transactions.map((tx) => (
                                        <tr key={tx.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="size-8 rounded-lg bg-gray-50 text-gray-400 flex items-center justify-center">
                                                        <Wallet size={14} />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900">{tx.description || 'Credit purchase'}</p>
                                                        <p className="text-xs text-gray-400">{new Date(tx.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm font-semibold text-gray-900">₹{tx.amount}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                                                    tx.status === 'SUCCESS' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                                                }`}>
                                                    {tx.status === 'SUCCESS' ? 'Completed' : tx.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="py-16 text-center">
                            <AlertCircle size={32} className="text-gray-200 mx-auto mb-3" />
                            <p className="text-sm text-gray-400">No transactions yet</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
