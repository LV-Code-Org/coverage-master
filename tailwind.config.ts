import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: "#4F9D69",
          dark: "#238636",
        },
        secondary: {
          light: "#f4f4f4",
          "light-60": "rgba(244, 244, 244, 0.6)",
          dark: "#02040a",
        },
        tertiary: {
          light: "#3D444D",
          dark: "#2c3137",
        },
        background: {
          light: "#fff",
          dark: "#0d1116",
          "dark-60": "rgba(13, 17, 22, 0.6)",
        },
        text: {
          light: "#333",
          dark: "#f4f4f4",
        },
      },
      keyframes: {
        slideInRight: {
          '0%': { transform: 'translateX(100%)', opacity: 0 },
          '100%': { transform: 'translateX(0)', opacity: 1 },
        },
        slideInDown: {
          '0%': { transform: 'translateY(100%)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
      },
      animation: {
        slideInRight: 'slideInRight 0.5s ease-out',
        slideInDown: 'slideInDown 0.5s ease-out',
      },

    },
  },

  plugins: [],
} satisfies Config;
