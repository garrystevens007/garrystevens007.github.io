import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { profile } from "@/lib/data";
import "./globals.css";

// "Quiet precision": Inter for everything, JetBrains Mono for metadata, section numbers and code. No serif.
const inter = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

const description = `${profile.name}, ${profile.title.toLowerCase()} in ${profile.location}. Case studies in secure enterprise systems, product delivery and teaching.`;

export const metadata: Metadata = {
  metadataBase: new URL("https://garrystevens007.github.io"),
  title: { default: profile.name, template: `%s · ${profile.name}` },
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
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable}`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="font-sans antialiased">
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
