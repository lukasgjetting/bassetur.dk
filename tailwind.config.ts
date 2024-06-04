import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        bassebrun: "#786456",
        "green-suit": "#39543C",
        "green-suit-dark": "#2C3F2D",
        "green-dust": "#B7CB9B",
        "purple-lavender": "#F7F4FF",
        cream: "#FFFFF9",
      },
    },
  },
  plugins: [],
};
export default config;
