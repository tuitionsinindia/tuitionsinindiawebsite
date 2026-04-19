import Link from "next/link";
import { LifeBuoy, Search, ChevronRight } from "lucide-react";
import { HELP_CATEGORIES } from "@/lib/helpCenter";

export const metadata = {
    title: "Help Center — TuitionsInIndia",
    description: "Find answers about finding tutors, pricing, demo classes, verification and more. Can't find what you need? Our chatbot can help or raise a ticket.",
    alternates: { canonical: "https://tuitionsinindia.com/help" },
};

export default function HelpCenterPage() {
    return (
        <div className="bg-white min-h-screen">
            {/* Hero */}
            <section className="bg-gradient-to-br from-blue-50 via-white to-white border-b border-gray-100">
                <div className="max-w-5xl mx-auto px-5 py-12 md:py-16 text-center">
                    <div className="inline-flex items-center justify-center size-12 rounded-2xl bg-blue-600 text-white mb-4">
                        <LifeBuoy size={22} />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-3">
                        How can we help?
                    </h1>
                    <p className="text-base text-gray-600 max-w-2xl mx-auto">
                        Browse common questions, or open the chat bubble on the right for quick answers. If you need a human, the chatbot can raise a ticket for our team.
                    </p>
                </div>
            </section>

            {/* Categories */}
            <section className="py-10 md:py-14">
                <div className="max-w-5xl mx-auto px-5 space-y-10">
                    {HELP_CATEGORIES.map((category) => (
                        <div key={category.id}>
                            <h2 className="text-xl font-bold text-gray-900 mb-4 tracking-tight">
                                {category.label}
                            </h2>
                            <div className="grid md:grid-cols-2 gap-3">
                                {category.articles.map((article) => (
                                    <details
                                        key={article.slug}
                                        className="group bg-gray-50 hover:bg-white border border-gray-200 hover:border-blue-200 rounded-xl p-4 transition-colors"
                                    >
                                        <summary className="flex items-center justify-between gap-3 cursor-pointer list-none">
                                            <span className="text-sm font-semibold text-gray-900">{article.title}</span>
                                            <ChevronRight size={16} className="text-gray-400 group-open:rotate-90 transition-transform shrink-0" />
                                        </summary>
                                        <p className="mt-3 text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                                            {article.body}
                                        </p>
                                    </details>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Contact fallback */}
            <section className="py-10 bg-gray-50 border-t border-gray-100">
                <div className="max-w-3xl mx-auto px-5 text-center">
                    <h2 className="text-lg font-bold text-gray-900 mb-2">Still stuck?</h2>
                    <p className="text-sm text-gray-600 mb-5">
                        Open the chat at the bottom-right of your screen — our assistant can help, and if it can't, it will raise a ticket with our team.
                    </p>
                    <Link
                        href="/contact"
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Contact us directly <ChevronRight size={14} />
                    </Link>
                </div>
            </section>
        </div>
    );
}
