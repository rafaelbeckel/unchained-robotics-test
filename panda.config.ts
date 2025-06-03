import { defineConfig } from "@pandacss/dev";

export default defineConfig({
  // Whether to use css reset
  preflight: true,

  // Where to look for your css declarations
  include: ["./src/**/*.{js,jsx,ts,tsx}", "./pages/**/*.{js,jsx,ts,tsx}"],

  // Files to exclude
  exclude: [],

  // Useful for theme customization
  theme: {
    extend: {
      tokens: {
        colors: {
          bg: {
            DEFAULT: { value: "#ececec" },
            panel: { value: "#f6f7f9" },
            card: { value: "#f9f9fa" },
            accent: { value: "#e3e7f0" },
          },
          text: {
            DEFAULT: { value: "#23272d" },
            secondary: { value: "#5a5f6a" },
            muted: { value: "#8a8f99" },
            accent: { value: "#2d6cdf" },
          },
          border: {
            DEFAULT: { value: "#d1d5db" },
            focus: { value: "#2d6cdf" },
          },
        },
        fontSizes: {
          xs: { value: "0.72rem" },
          sm: { value: "0.8rem" },
          md: { value: "0.92rem" },
          lg: { value: "1.05rem" },
          xl: { value: "1.18rem" },
          '2xl': { value: "1.32rem" },
        },
        fontWeights: {
          normal: { value: "400" },
          medium: { value: "500" },
          bold: { value: "600" },
        },
        radii: {
          sm: { value: "0.12rem" },
          md: { value: "0.18rem" },
          lg: { value: "0.25rem" },
        },
        shadows: {
          card: { value: "0 1px 2px 0 rgb(0 0 0 / 0.03)" },
        },
        spacing: {
          0: { value: "0px" },
          1: { value: "0.15rem" },
          2: { value: "0.3rem" },
          3: { value: "0.5rem" },
          4: { value: "0.7rem" },
          5: { value: "1rem" },
          6: { value: "1.2rem" },
        },
      },
    },
  },

  // The output directory for your css system
  outdir: "styled-system",
});
