/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        indigo: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#0ea5e9",
          600: "#0284c7",
          700: "#0369a1",
          800: "#075985",
          900: "#0c4a6e",
        },
        light: {
          primary: "#2563eb",
          background: "#ffffff",
          text: "#1a1a1a",
          secondary: "#f1f5f9",
          border: "#e2e8f0",
        },
        dark: {
          primary: "#3b82f6",
          background: "#1a1a1a",
          text: "#f8fafc",
          secondary: "#334155",
          border: "#475569",
        },
      },
    },
  },
  plugins: [],
};
