import type { Config } from "tailwindcss";

// Enable class‑based dark mode

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "light": {
          "bg": "#ffffff",
          "surface": "#f5f5f5",
          "surface-hover": "#e5e7eb",
          "border": "#d1d5db",
          "muted": "#6b7280",
          "accent": "#ff6600",
          "accent-soft": "#cc5200",
          "success": "#4ade80",
          "warning": "#fbbf24"
        },
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
      // Ensure the new color groups are applied via the generated utilities
      // (Tailwind will expose classes like bg-studio-bg, bg-light-bg, text-studio-accent, etc.)
    },
  },
  plugins: [],
};

export default config;
