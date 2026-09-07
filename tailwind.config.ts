import type { Config } from "tailwindcss";

// Color values pulled directly from Creative Tim's Material Dashboard (Free)
// theme CSS (material-dashboard.min.css v3.2.0) so this matches exactly,
// not approximated. Gray scale is left to Tailwind's stock "neutral" palette,
// which already matches MD's --bs-gray-100..900 values 1:1.
//
// boxShadow.primary/info/success/warning follow the exact same formula the
// theme itself uses for .shadow-primary (confirmed: rgba(233,30,99,.4) is
// primary's own RGB) — extended to the other three accents using their RGB.
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
      },
      colors: {
        primary: { DEFAULT: "#e91e63", from: "#ec407a", to: "#d81b60" },
        info: { DEFAULT: "#1a73e8", from: "#49a3f1", to: "#1a73e8" },
        success: { DEFAULT: "#4caf50", from: "#66bb6a", to: "#43a047" },
        warning: { DEFAULT: "#fb8c00", from: "#ffa726", to: "#fb8c00" },
        danger: { DEFAULT: "#f44335", from: "#ef5350", to: "#e53935" },
      },
      boxShadow: {
        card: "0 1px 2px 0 rgba(0,0,0,0.05)", // exact --bs-card-box-shadow
        primary: "0 4px 20px 0 rgba(0,0,0,.14), 0 7px 10px -5px rgba(233,30,99,.4)", // exact .shadow-primary
        info: "0 4px 20px 0 rgba(0,0,0,.14), 0 7px 10px -5px rgba(26,115,232,.4)",
        success: "0 4px 20px 0 rgba(0,0,0,.14), 0 7px 10px -5px rgba(76,175,80,.4)",
        warning: "0 4px 20px 0 rgba(0,0,0,.14), 0 7px 10px -5px rgba(251,140,0,.4)",
      },
    },
  },
  plugins: [],
};

export default config;
