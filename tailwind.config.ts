import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        cyber: {
          dark: "#05070D",
          darker: "#030407",
          card: "rgba(10, 15, 29, 0.75)",
          border: "rgba(0, 240, 255, 0.2)",
          neonCyan: "#00F0FF",
          neonPink: "#FF0055",
          neonYellow: "#FFE600",
          neonPurple: "#8A2BE2",
          neonGreen: "#00FF66",
          accent: "#00F0FF",
        },
      },
      backgroundImage: {
        "cyber-grid": "radial-gradient(circle, rgba(0,240,255,0.08) 1px, transparent 1px)",
        "cyber-glow": "radial-gradient(ellipse at center, rgba(0, 240, 255, 0.15), transparent 70%)",
      },
      boxShadow: {
        "neon-cyan": "0 0 20px rgba(0, 240, 255, 0.4)",
        "neon-pink": "0 0 20px rgba(255, 0, 85, 0.4)",
        "cyber-panel": "0 8px 32px 0 rgba(0, 0, 0, 0.6), inset 0 0 0 1px rgba(255, 255, 255, 0.08)",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "glow-ping": "glowPing 2s ease-in-out infinite",
        "float-slow": "float 6s ease-in-out infinite",
      },
      keyframes: {
        glowPing: {
          "0%, 100%": { transform: "scale(1)", opacity: "0.8" },
          "50%": { transform: "scale(1.15)", opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        }
      }
    },
  },
  plugins: [],
};
export default config;
