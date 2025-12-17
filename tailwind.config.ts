import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f0f4f8",
          100: "#d9e3f0",
          200: "#b3c7e0",
          300: "#8daad1",
          400: "#678ec1",
          500: "#4a6fa5",
          600: "#3a5884",
          700: "#2c3e50",
          800: "#1e2a38",
          900: "#0f151f",
        },
        neutral: {
          50: "#f8f9fa",
          100: "#f1f3f5",
          200: "#e1e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#5a6c7d",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
        },
      },
      backgroundImage: {
        "primary-gradient": "linear-gradient(135deg, #4a6fa5, #2c3e50)",
        "light-gradient":
          "linear-gradient(135deg, rgba(74,111,165,0.05), rgba(44,62,80,0.05))",
        "element-gradient":
          "linear-gradient(135deg, rgba(74,111,165,0.1), rgba(44,62,80,0.05))",
      },
    },
  },
  plugins: [],
};

export default config;
