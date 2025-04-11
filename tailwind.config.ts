import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Light mode
        "bg-light-mode-main": "#1f2328",
        "bg-light-mode-menu": "#f6f8fa",

        "svg-color-light-mode-main": "#59636e",

        "text-light-mode-main": "#1f2328",
        "text-light-mode-h2": "#6a737d",
        "text-light-mode-placeholder": "#59636e",

        // Dark mode
        "bg-dark-mode-main": "#0d1117",
        "bg-dark-mode-menu": "#010409",

        "svg-color-dark-mode-main": "#9198a1",

        "text-dark-mode-main": "#f0f6fc",
        "text-dark-mode-h2": "#868c96",
        "text-dark-mode-placeholder": "#9198a1",
      },
    },
  },
  darkMode: "class",
};
export default config;
