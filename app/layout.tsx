import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { RoleProvider } from "@/context/RoleContext";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

// Executive dashboard headings only (font-display). Loaded with display:
// "swap" and a Georgia fallback so a slow font fetch never blanks a heading.
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

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
    // data-scroll-behavior opts into the smooth scrolling globals.css sets on
    // <html> (the sidebar's scroll-to-section relies on it) while telling
    // Next it's intentional — without it, route changes inherit the smooth
    // scroll and the new page visibly slides in from the old scroll position.
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable}`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="font-sans antialiased">
        {/* Role state is provider-level (not per-page) so the sidebar's
            "Change Role" button and the redirect logic on / and /dashboard
            all read the same store. The provider renders no chrome of its
            own — each dashboard brings its own shell, and /portfolio keeps
            the original DashboardShell untouched. */}
        <RoleProvider>{children}</RoleProvider>
      </body>
    </html>
  );
}
