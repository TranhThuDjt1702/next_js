'use client'
import type { Config } from "tailwindcss";
import { withUt } from "uploadthing/tw";



const config: Config = {
  darkMode:['class'],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{ts,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#7AB2D3", 
      },
    },
  },
  plugins: [],
};
export default withUt(config);
