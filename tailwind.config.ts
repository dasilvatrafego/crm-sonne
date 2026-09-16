import type { Config } from "tailwindcss";

/* Identidade visual SONNE (extraída de sonne.global) */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#011e41",
          600: "#0a2c55",
          400: "#4f758c",
        },
        gold: {
          DEFAULT: "#b1915d",
          soft: "#eaded0",
        },
        muted: "#f3f5f7",
        wa: "#25d366",
      },
      fontFamily: {
        serif: ['"Playfair Display"', "Georgia", "serif"],
        sans: ['"Inter"', "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
