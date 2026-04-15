import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ["'Playfair Display'", "Georgia", "serif"],
        sans: ["'DM Sans'", "system-ui", "sans-serif"],
        display: ["'Cormorant Garamond'", "Georgia", "serif"],
      },
      colors: {
        navy: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#1d4ed8",
          700: "#1e3a8a",
          800: "#1e3070",
          900: "#0f1f4a",
          950: "#060d24",
        },
        gold: {
          400: "#f59e0b",
          500: "#d97706",
          600: "#b45309",
        },
      },
      backgroundImage: {
        "hero-gradient": "linear-gradient(135deg, #0f1f4a 0%, #1e3a8a 40%, #1d4ed8 70%, #3b82f6 100%)",
        "card-gradient": "linear-gradient(145deg, #ffffff 0%, #f0f7ff 100%)",
        "footer-gradient": "linear-gradient(180deg, #0f1f4a 0%, #060d24 100%)",
      },
      boxShadow: {
        "card": "0 4px 24px rgba(30, 58, 138, 0.08)",
        "card-hover": "0 12px 40px rgba(30, 58, 138, 0.18)",
        "hero": "0 24px 60px rgba(6, 13, 36, 0.4)",
        "nav": "0 2px 20px rgba(30, 58, 138, 0.12)",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out",
        "slide-up": "slideUp 0.7s ease-out",
        "float": "float 6s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
