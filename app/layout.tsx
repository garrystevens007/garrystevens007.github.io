import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Garry Stevens — Backend Engineer",
  description:
    "Backend Engineer portfolio presented as a dashboard: experience, skills, and projects at a glance.",
  openGraph: {
    title: "Garry Stevens — Backend Engineer",
    description:
      "Backend Engineer portfolio presented as a dashboard: experience, skills, and projects at a glance.",
    type: "website",
  },
};

// Runs before hydration so the correct theme class is present on first paint.
// Light is always the default — dark mode only applies if the visitor
// explicitly switched it on (via ThemeToggle) on this device before. This
// deliberately ignores prefers-color-scheme, so the site doesn't silently
// open in dark mode just because the OS/browser happens to be set to dark.
const themeInitScript = `
(function () {
  try {
    if (localStorage.getItem('theme') === 'dark') {
      document.documentElement.classList.add('dark');
    }
  } catch (e) {}
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
