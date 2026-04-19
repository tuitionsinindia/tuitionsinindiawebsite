"use client";

// Fallback when the root layout itself errors. Must include <html> and <body>
// because it replaces the entire tree. Kept minimal — no external imports so
// it can't error further.
export default function GlobalError({ error, reset }) {
    return (
        <html lang="en">
            <body style={{
                margin: 0,
                fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                background: "#f9fafb",
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "20px",
            }}>
                <div style={{ textAlign: "center", maxWidth: 440 }}>
                    <h1 style={{ fontSize: 28, fontWeight: 700, color: "#111827", marginBottom: 8 }}>
                        Something went wrong
                    </h1>
                    <p style={{ fontSize: 14, color: "#6b7280", marginBottom: 24, lineHeight: 1.6 }}>
                        The site hit an unexpected error. Please reload the page. If this keeps happening,
                        email support@tuitionsinindia.com.
                    </p>
                    <button
                        onClick={reset}
                        style={{
                            background: "#2563eb",
                            color: "#fff",
                            border: "none",
                            padding: "12px 24px",
                            fontSize: 14,
                            fontWeight: 600,
                            borderRadius: 8,
                            cursor: "pointer",
                        }}
                    >
                        Reload
                    </button>
                </div>
            </body>
        </html>
    );
}
