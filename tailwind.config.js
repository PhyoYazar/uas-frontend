/** @type {import('tailwindcss').Config} */

module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },

    fontFamily: {
      body: ["Inter", "sans-serif"],
    },

    fontSize: {
      // fontSize: 12px, lineHeight: 18px
      xs: ["0.75rem", { lineHeight: "1.125rem" }],

      // fontSize: 14px, lineHeight: 20px
      sm: ["0.875rem", { lineHeight: "1.25rem" }],

      // fontSize: 16px, lineHeight: 24px
      md: ["1rem", { lineHeight: "1.5rem" }],

      // fontSize: 18px, lineHeight: 28px
      lg: ["1.125rem", { lineHeight: "1.75rem" }],

      // fontSize: 20px, lineHeight: 30p
      xl: ["1.25rem", { lineHeight: "1.875rem" }],
    },

    borderRadius: {
      none: "0",
      xs: "0.125rem", // 2px
      sm: "0.25rem", // 4px
      md: "0.5rem", // 8px
      lg: "0.75rem", // 12px
      xl: "1rem", // 16px
      "2xl": "2rem", // 32px
      full: "999px",
    },

    extend: {
      zIndex: {
        1: "1",
        2: "2",
        3: "3",
        4: "4",
        5: "5",
        6: "6",
        7: "7",
        8: "8",
        9: "9",
      },

      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },

      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
