import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ["var(--font-sky-mono)", "monospace"]
      },
      colors: {
        ink: "#050505",
        bone: "#f2eee2",
        dim: "#8c877a",
        brass: "#b59d67"
      }
    }
  },
  plugins: []
};

export default config;
