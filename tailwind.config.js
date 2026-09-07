// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "Quicksand", "sans-serif"],
        serif: ["var(--font-serif)", "Playfair Display", "serif"],
      },
      colors: {
        primary: "#111",
        accent: "#0066cc",
        gray: "#666",
        bg: "#fafafa",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
