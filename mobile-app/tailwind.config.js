/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./App.{js,jsx,ts,tsx}",
        "./app/**/*.{js,jsx,ts,tsx}",
        "./components/**/*.{js,jsx,ts,tsx}"
    ],
    theme: {
        extend: {
            colors: {
                "primary": "#1e448a", // Dark Blue
                "accent": "#f2994a",  // Orange Accent
                "background-light": "#ffffff",
                "background-slate": "#f8fafc",
            },
        },
    },
    plugins: [],
}
