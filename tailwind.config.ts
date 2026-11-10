import type { Config } from "tailwindcss";

// "Quiet precision" palette (rework 2026): Apple-like neutrals, one blue accent. Every colour is a CSS variable
// (an RGB triplet) set in app/globals.css, so dark mode is one class on <html> and Tailwind's opacity modifiers
// (`text-ink/70`) still work.
const token = (name: string) => `rgb(var(--${name}) / <alpha-value>)`;

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "-apple-system", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "Menlo", "monospace"],
      },
      colors: {
        bg: token("bg"),
        alt: token("alt"),
        card: token("card"),
        ink: token("ink"),
        "ink-2": token("ink-2"),
        muted: token("muted"),
        rule: token("rule"),
        accent: token("accent"),
        "on-accent": token("on-accent"),
      },
      maxWidth: {
        page: "1080px",
      },
      boxShadow: {
        soft: "var(--shadow)",
        device: "0 30px 60px -30px rgb(0 0 0 / 0.35)",
        phone: "0 40px 70px -24px rgb(0 0 0 / 0.5)",
      },
      screens: {
        nav: "820px",
      },
    },
  },
  plugins: [],
};

export default config;
