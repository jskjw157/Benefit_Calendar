import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        midnight: "#0f172a",
        primary: "#2563eb",
        accent: "#22c55e",
        warning: "#f97316",
        danger: "#ef4444",
        surface: "#f8fafc"
      },
      boxShadow: {
        card: "0 12px 30px -20px rgba(15, 23, 42, 0.35)"
      }
    }
  },
  plugins: []
};

export default config;
