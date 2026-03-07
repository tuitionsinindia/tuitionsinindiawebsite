/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                "primary": "#6366f1", // Deep Indigo
                "accent": "#f59e0b",  // Gold/Amber Accent
                "background-light": "#f8fafc",
                "background-dark": "#0f172a",
            },
            fontFamily: {
                "display": ["Outfit", "sans-serif"],
                "sans": ["Outfit", "sans-serif"],
                "heading": ["Lexend", "sans-serif"]
            },
            borderRadius: {
                "DEFAULT": "0.25rem",
                "lg": "0.5rem",
                "xl": "0.75rem",
                "2xl": "1rem",
                "full": "9999px"
            },
        },
    },
    plugins: [],
}
