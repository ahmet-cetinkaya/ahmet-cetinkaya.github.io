export const colors = {
  primary: {
    50: "#fae89f",
    100: "#f8e38c",
    200: "#f7de79",
    300: "#f6d965",
    400: "#f5d552",
    500: "#f4d03f",
    600: "#dcbb39",
    700: "#c3a632",
    800: "#ab922c",
    900: "#927d26",
  },
  secondary: {
    50: "#9c95b7",
    100: "#887fa8",
    200: "#746a9a",
    300: "#60558b",
    400: "#4c3f7d",
    500: "#382a6e",
    600: "#322663",
    700: "#2d2258",
    800: "#271d4d",
    900: "#221942",
  },
  surface: {
    100: "#706f70",
    200: "#585758",
    300: "#403f40",
    400: "#282728",
    500: "#100f10",
    600: "#0e0e0e",
    700: "#0d0c0d",
    800: "#0b0b0b",
    900: "#0a090a",
  },
};

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,md,mdx,ts,tsx}", "../core/acore-solidjs/**/*.{ts,tsx}"],
  theme: {
    fontFamily: {
      sans: ["Oxanium", "monospace"],
    },
    boxShadow: {
      primary: "4px 4px 0px rgba(244, 208, 63, 0.4)",
      secondary: "6px 6px 0px rgba(56, 42, 110, 0.6)",
      surface: "4px 4px 0px #706f70",
    },
    extend: {
      spacing: {
        128: "32rem",
        144: "36rem",
      },
      screens: {
        xs: "475px",
      },
      colors,
    },
  },
  plugins: [],
};
