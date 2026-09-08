import type { Config } from "tailwindcss";

// Color values pulled directly from Creative Tim's Material Dashboard (Free)
// theme CSS (material-dashboard.min.css v3.2.0) so this matches exactly,
// not approximated. Gray scale is left to Tailwind's stock "neutral" palette,
// which already matches MD's --bs-gray-100..900 values 1:1.
//
// boxShadow.primary/info/success/warning follow the exact same formula the
// theme itself uses for .shadow-primary (confirmed: rgba(233,30,99,.4) is
// primary's own RGB) — extended to the other three accents using their RGB.
//
// The `hr` and `luxe` scales below are the two role-dashboard palettes. They
// live under their own namespaces (rather than overriding Tailwind's stock
// `teal`/`amber`) so the default palettes stay intact for everything else.
const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        // Executive dashboard headings only. A serif display face is the
        // cheapest, strongest "this is a considered document, not an admin
        // template" signal available.
        display: ["var(--font-playfair)", "Georgia", "serif"],
      },
      colors: {
        primary: { DEFAULT: "#e91e63", from: "#ec407a", to: "#d81b60" },
        info: { DEFAULT: "#1a73e8", from: "#49a3f1", to: "#1a73e8" },
        success: { DEFAULT: "#4caf50", from: "#66bb6a", to: "#43a047" },
        warning: { DEFAULT: "#fb8c00", from: "#ffa726", to: "#fb8c00" },
        danger: { DEFAULT: "#f44335", from: "#ef5350", to: "#e53935" },

        // ---- HR dashboard: "Warm Sand & Teal" ------------------------------
        // Warm neutrals rather than white — the 2025/26 move away from cold
        // corporate white — with deep teal carrying the trust signal that
        // generic SaaS blue has worn out.
        hr: {
          canvas: "#F7F3EE",
          "canvas-2": "#F1EBE3",
          card: "#FFFDFA",
          border: "#E8DFD3",
          "border-strong": "#D9CCBA",
          ink: "#1C1917",
          "ink-soft": "#44403C",
          muted: "#78716C",
          accent: "#0F766E",
          "accent-from": "#14857A",
          "accent-to": "#0B5D57",
          "accent-ink": "#0B4A45",
          "accent-soft": "#CFE6E3",
          "accent-tint": "#EDF6F4",
          clay: "#B4643C",
          "clay-tint": "#FBEFE8",
        },

        // ---- Executive dashboard: "Black Tie" ------------------------------
        luxe: {
          canvas: "#0A0A0C",
          "canvas-2": "#111114",
          card: "#16161A",
          "card-2": "#1C1C22",
          hairline: "#2A2A30",
          "hairline-strong": "#3A3A44",
          gold: "#D4AF37",
          "gold-from": "#E8C87E",
          "gold-to": "#C9A227",
          "gold-deep": "#8A7220",
          "gold-tint": "#241F0E",
          ink: "#F5F3EF",
          "ink-soft": "#C9C6BF",
          muted: "#8A8A94",
          // Supporting chart series — desaturated so gold stays the hero.
          ice: "#8FB8C9",
          rose: "#C08497",
          sage: "#8A9A7B",
        },
      },
      boxShadow: {
        card: "0 1px 2px 0 rgba(0,0,0,0.05)", // exact --bs-card-box-shadow
        primary: "0 4px 20px 0 rgba(0,0,0,.14), 0 7px 10px -5px rgba(233,30,99,.4)", // exact .shadow-primary
        info: "0 4px 20px 0 rgba(0,0,0,.14), 0 7px 10px -5px rgba(26,115,232,.4)",
        success: "0 4px 20px 0 rgba(0,0,0,.14), 0 7px 10px -5px rgba(76,175,80,.4)",
        warning: "0 4px 20px 0 rgba(0,0,0,.14), 0 7px 10px -5px rgba(251,140,0,.4)",

        // Warm-tinted shadows: a neutral grey shadow over a sand canvas reads
        // as dirt. These are tinted with the canvas's own warm base instead.
        warm: "0 1px 2px 0 rgba(68,52,38,0.04), 0 8px 24px -14px rgba(68,52,38,0.18)",
        "warm-lg": "0 2px 4px 0 rgba(68,52,38,0.05), 0 18px 44px -20px rgba(68,52,38,0.28)",
        teal: "0 4px 20px 0 rgba(0,0,0,.10), 0 7px 12px -6px rgba(15,118,110,.45)",

        // Dark-surface elevation can't rely on shadow alone (a shadow on near
        // black is invisible) — the inset top highlight is what actually
        // separates the card from the canvas.
        luxe: "inset 0 1px 0 0 rgba(255,255,255,0.04), 0 12px 32px -16px rgba(0,0,0,0.9)",
        "luxe-lg":
          "inset 0 1px 0 0 rgba(255,255,255,0.07), 0 24px 56px -24px rgba(0,0,0,0.95)",
        gold: "0 4px 24px -8px rgba(212,175,55,0.45)",
      },
    },
  },
  plugins: [],
};

export default config;
