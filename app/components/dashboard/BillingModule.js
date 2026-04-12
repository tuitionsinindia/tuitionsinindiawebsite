"use client";

import { Zap, History, BadgeCheck, AlertCircle } from "lucide-react";

export default function BillingModule({ userData, transactions = [] }) {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Billing</h2>
                <p className="text-gray-500 text-sm mt-1">Manage your subscription and view transaction history.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Credits */}
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
                    <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center mb-3">
                        <Zap size={18} className="text-amber-600" />
                    </div>
                    <p className="text-sm text-amber-700 font-medium mb-1">Credits Available</p>
                    <p className="text-3xl font-bold text-amber-900">{userData?.credits || 0}</p>
                    <button className="mt-4 w-full py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700 transition-colors">
                        Buy Credits
                    </button>
                </div>

                {/* Plan */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center mb-3">
                        <BadgeCheck size={18} className="text-blue-600" />
                    </div>
                    <p className="text-sm text-gray-500 font-medium mb-1">Current Plan</p>
                    <p className="text-xl font-bold text-gray-900 capitalize">
                        {userData?.subscriptionTier?.toLowerCase() || "Free"}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                        {userData?.subscriptionStatus === "ACTIVE" ? "Active" : "No active subscription"}
                    </p>
                </div>

                {/* Transaction count */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6">
                    <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center mb-3">
                        <History size={18} className="text-indigo-600" />
                    </div>
                    <p className="text-sm text-gray-500 font-medium mb-1">Transactions</p>
                    <p className="text-3xl font-bold text-gray-900">{transactions.length}</p>
                    <p className="text-xs text-gray-400 mt-1">Total payments made</p>
                </div>
            </div>

            {/* Transaction History */}
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-900">Transaction History</h3>
                </div>
                {transactions.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {transactions.map((tx) => (
                                    <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 text-sm text-gray-700">
                                            {tx.description || "Credit Purchase"}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-semibold text-emerald-600">
                                            ₹{tx.amount}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-400">
                                            {new Date(tx.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                                                tx.status === "SUCCESS" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                                            }`}>
                                                {tx.status === "SUCCESS" ? "Paid" : tx.status?.charAt(0) + tx.status?.slice(1)?.toLowerCase()}
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
                        <p className="text-sm text-gray-400">No transactions yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
