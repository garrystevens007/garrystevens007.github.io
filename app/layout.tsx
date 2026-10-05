import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import { ParticleBackground } from "@/components/site/ParticleBackground";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { profile } from "@/lib/data";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

// The serif carries the editorial voice: headings and large figures only.
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  weight: ["400", "500", "600"],
});

const description = `${profile.name}, ${profile.title.toLowerCase()} in ${profile.location}. Case studies in secure enterprise systems, product delivery and teaching.`;

export const metadata: Metadata = {
  metadataBase: new URL("https://garrystevens007.github.io"),
  title: { default: `${profile.name}, ${profile.title}`, template: `%s · ${profile.name}` },
  description,
  openGraph: { title: `${profile.name}, ${profile.title}`, description, type: "website" },
};

// Runs before hydration so the chosen theme is on the first paint. Light is the default; dark only applies when
// the visitor switched it on (ThemeToggle) on this device, never from the OS setting alone.
const themeInitScript = `
(function () {
  try {
    if (localStorage.getItem('theme') === 'dark') document.documentElement.classList.add('dark');
  } catch (e) {}
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable}`} data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="font-sans antialiased">
        <ParticleBackground />
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
