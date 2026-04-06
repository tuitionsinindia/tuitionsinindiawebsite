/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#0066ff", // Stitch Action Blue
        secondary: "#000a1e", // Stitch Deep Navy
        "background-dark": "#000a1e",
        "surface-dark": "#000f2d",
        "accent-amber": "#ff9500",
        "success-green": "#34c759",
        "danger-red": "#ff3b3b",
        "slate-light": "#f8fafc",
        "border-dark": "#1a2333",
      },
      fontFamily: {
        heading: ["Inter-Bold"],
        body: ["Inter-Medium"],
      },
    },
  },
  plugins: [],
};
