import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'wednesday-dark': '#080A12',
        'sword-dark': '#000000',
        'thing-dark': '#060C14',
        'cta-start': '#0A0000',
        'cta-end': '#1A0800',
        'netflix-red': '#E50914',
      },
      animation: {
        'pulse-slow': 'pulse-slow 2s ease-in-out infinite',
        'pulse-cue': 'pulse-cue 2s ease-in-out infinite',
      },
      keyframes: {
        'pulse-slow': {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '1' },
        },
        'pulse-cue': {
          '0%, 100%': { opacity: '0.3' },
          '50%': { opacity: '0.8' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
