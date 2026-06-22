import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        studio: {
          bg: "#0f1419",
          surface: "#1a2332",
          "surface-hover": "#243044",
          border: "#2d3a4f",
          muted: "#8899aa",
          accent: "#7c9cff",
          "accent-soft": "#5b7fd4",
          success: "#4ade80",
          warning: "#fbbf24",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      boxShadow: {
        glow: "0 0 40px -10px rgba(124, 156, 255, 0.35)",
        card: "0 4px 24px -4px rgba(0, 0, 0, 0.4)",
      },
    },
  },
  plugins: [],
};

export default config;
