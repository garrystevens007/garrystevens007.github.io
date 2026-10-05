import type { Config } from "tailwindcss";

// Editorial palette: ivory paper, navy ink and one terracotta accent, the restraint consulting firms use on their
// own sites. Every colour is a CSS variable (an RGB triplet) set in app/globals.css, so dark mode is one class on
// <html> and Tailwind's opacity modifiers (`bg-ink/5`) still work.
const token = (name: string) => `rgb(var(--${name}) / <alpha-value>)`;

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        serif: ["var(--font-fraunces)", "Georgia", "serif"],
      },
      colors: {
        paper: token("paper"),
        surface: token("surface"),
        ink: token("ink"),
        "ink-2": token("ink-2"),
        muted: token("muted"),
        rule: token("rule"),
        accent: token("accent"),
        "accent-soft": token("accent-soft"),
      },
      maxWidth: {
        page: "1160px",
      },
      boxShadow: {
        device: "0 40px 80px -30px rgb(11 31 58 / 0.40)",
        phone: "0 40px 70px -24px rgb(11 31 58 / 0.50)",
      },
    },
  },
  plugins: [],
};

export default config;
