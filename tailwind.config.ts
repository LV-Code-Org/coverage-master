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
          // DEFAULT: "#4F9D69",
          light: "#4F9D69",
          dark: "#238636",
        },
        secondary: {
          light: "#f4f4f4",
          dark: "#02040a",
        },
        tertiary: {
          light: "#3D444D",
          dark: "#3D444D",
        },
        background: {
          light: "#fff",
          dark: "#0d1116",
        },
        text: {
          light: "#333",
          dark: "#f4f4f4",
        },
      },
    },
  },

  plugins: [],
} satisfies Config;
