import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // La scala predefinita copre solo i multipli di 5: valori come /74 o /98
      // non generano CSS e la classe viene ignorata silenziosamente.
      opacity: Object.fromEntries(
        Array.from({ length: 101 }, (_, i) => [String(i), String(i / 100)])
      ),
      colors: {
        background: "#050505",
        foreground: "#f5f0e8",
        gold: "#c8a97e",
        "gold-light": "#d4c4a8",
        amber: "#d4a574",
        beige: "#e8ddd0",
        charcoal: "#1a1a1a",
        "warm-gray": "#2a2a2a",
      },
      fontFamily: {
        sans: ["var(--font-outfit)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
