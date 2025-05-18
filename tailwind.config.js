/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        primary: "#111112",
        secondery: "#00BC7F",
        secondery2: "#71717a",
      },
      fontFamily: {
        lalezar: ["Lalezar", "sans-serif"],
        zain: ["Zain", "sans-serif"],
        noto: ["Noto Naskh Arabic", "sans-serif"],
        vazir: ["Vazir", "sans-serif"],
        notonas: ["Noto Nastaliq Urdu", "sans-serif"],
        mitra: ["Mitra", "sans-serif"],
      },
      keyframes: {
        borderExpand: {
          "0%": { width: "0%", left: "50%" },
          "100%": { width: "100%", left: "0%" },
        },
      },
      animation: {
        "border-expand": "borderExpand 1s ease-in-out forwards",
      },
    },
  },
  plugins: [],
};
