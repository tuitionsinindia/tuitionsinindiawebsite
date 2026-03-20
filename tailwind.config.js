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
                "primary": "#1e448a", // Premium Dark Blue
                "accent": "#ec5b13",  // Professional Orange/Amber from reference
                "background-light": "#ffffff",
                "background-dark": "#121720",
            },
            fontFamily: {
                "display": ["Inter", "Public Sans", "sans-serif"],
                "sans": ["Inter", "Public Sans", "sans-serif"],
                "heading": ["Inter", "Public Sans", "sans-serif"]
            },
            borderRadius: {
                "DEFAULT": "0.25rem",
                "lg": "0.5rem",
                "xl": "0.75rem",
                "2xl": "1.25rem",
                "full": "9999px"
            },
        },
    },
    plugins: [],
}
