import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#4F9D69",
          light: "#63b07d",
          dark: "#489060",
        },
        secondary: {
          DEFAULT: "#f59e0b",
        },
      },
    },
  },

  plugins: [],
} satisfies Config;
