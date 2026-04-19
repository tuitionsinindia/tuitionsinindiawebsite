"use client";

import { useState, useEffect } from "react";
import { MessageCircle, X } from "lucide-react";

// Floating WhatsApp click-to-chat button.
// Renders nothing if NEXT_PUBLIC_WHATSAPP_NUMBER is not set (e.g. in dev),
// so we don't expose a fake number on the live site by accident.
//
// Pre-fill a contextual message via the `message` prop — defaults to a
// generic greeting so the button is useful even on pages that don't pass one.
export default function WhatsAppButton({ message = "" }) {
    const phone = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "").replace(/[^0-9]/g, "");
    const [open, setOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    if (!phone) return null;

    const text = encodeURIComponent(message || "Hi, I'm looking for a tutor on TuitionsInIndia.");
    const href = `https://wa.me/${phone}?text=${text}`;

    return (
        <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
            {/* Tooltip card — shows on first mount, dismissible */}
            {mounted && open && (
                <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-4 max-w-[280px] relative">
                    <button
                        onClick={() => setOpen(false)}
                        className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-50"
                        aria-label="Close"
                    >
                        <X size={14} />
                    </button>
                    <div className="flex items-start gap-3 pr-4">
                        <div className="size-9 rounded-full bg-green-50 flex items-center justify-center text-green-600 shrink-0">
                            <MessageCircle size={18} />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-900">Need help finding a tutor?</p>
                            <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">Chat with us on WhatsApp — usually replies in under 10 minutes.</p>
                        </div>
                    </div>
                    <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 block w-full text-center py-2 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 transition-colors"
                    >
                        Open WhatsApp
                    </a>
                </div>
            )}

            {/* Floating action button */}
            <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                onMouseEnter={() => setOpen(true)}
                aria-label="Chat on WhatsApp"
                className="size-14 rounded-full bg-green-500 hover:bg-green-600 active:scale-95 transition-all shadow-lg flex items-center justify-center text-white"
            >
                <MessageCircle size={26} strokeWidth={2} />
            </a>
        </div>
    );
}
